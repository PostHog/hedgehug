"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import type { ChatMessage } from "@/types/database"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n/context"
import posthog from "posthog-js"

const STORAGE_KEY = "hedgehug-chat-session"

export function useChat() {
  const { displayName } = useAuth()
  const { t, locale } = useI18n()
  const welcomeMessage = t("chat.welcome")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const loadMessages = useCallback(async (sid: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sid)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data as ChatMessage[])
    }
  }, [])

  // Restore session from localStorage, validate it still exists
  useEffect(() => {
    async function restore() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { data } = await supabase
          .from("chat_sessions")
          .select("id")
          .eq("id", stored)
          .single()

        if (data) {
          setSessionId(stored)
          posthog.identify(stored)
          await loadMessages(stored)
        } else {
          // Stale session — clear it
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      setIsReady(true)
    }
    restore()
  }, [loadMessages])

  // Subscribe to realtime for persisted messages (history reload, etc.)
  useEffect(() => {
    if (!sessionId) return

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [sessionId])

  const sendMessage = useCallback(
    async (content: string) => {
      let sid = sessionId

      if (!sid) {
        const { data } = await supabase
          .from("chat_sessions")
          .insert({ customer_name: displayName })
          .select()
          .single()

        if (!data) return
        sid = data.id as string
        setSessionId(sid)
        localStorage.setItem(STORAGE_KEY, sid)
        posthog.alias(sid, posthog.get_distinct_id())
        posthog.identify(sid)
        posthog.capture("chat_session_started", { session_id: sid })

        // Insert welcome message
        await supabase.from("chat_messages").insert({
          session_id: sid,
          role: "assistant",
          content: welcomeMessage,
        })

        // Small delay for realtime subscription to establish
        await new Promise((r) => setTimeout(r, 300))
      }

      // Insert user message into DB
      await supabase.from("chat_messages").insert({
        session_id: sid,
        role: "user",
        content,
      })
      posthog.capture("chat_message_sent", {
        session_id: sid,
        message_length: content.length,
      })

      setIsLoading(true)
      setStreamingContent("")

      // Stream the response from the API
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, message: content, displayName, locale }),
        })

        if (!response.ok || !response.body) {
          posthog.captureLog({
            body: `Chat API returned ${response.status}`,
            level: "error",
            attributes: { session_id: sid!, status: String(response.status) },
          })
          setIsLoading(false)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                // Stream complete — the message is now in DB via realtime
                setStreamingContent("")
                setIsLoading(false)
                return
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  accumulated += parsed.text
                  setStreamingContent(accumulated)
                }
              } catch {
                // ignore parse errors on partial chunks
              }
            }
          }
        }

        setStreamingContent("")
        setIsLoading(false)
      } catch (err) {
        posthog.captureException(err instanceof Error ? err : new Error(String(err)), {
          source: "chat-stream",
          session_id: sid,
        })
        posthog.captureLog({
          body: `Chat stream error: ${err instanceof Error ? err.message : String(err)}`,
          level: "error",
          attributes: { session_id: sid! },
        })
        setStreamingContent("")
        setIsLoading(false)
      }
    },
    [sessionId, welcomeMessage, displayName]
  )

  const resetChat = useCallback(() => {
    posthog.capture("chat_reset")
    localStorage.removeItem(STORAGE_KEY)
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setSessionId(null)
    setMessages([])
    setStreamingContent("")
    setIsLoading(false)
  }, [])

  return {
    messages,
    streamingContent,
    sendMessage,
    isLoading,
    isReady,
    sessionId,
    resetChat,
    welcomeMessage,
  }
}
