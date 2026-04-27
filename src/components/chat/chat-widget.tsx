"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatPanel } from "./chat-panel"
import { useChat } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"
import { useFeatureFlagVariant } from "@/hooks/use-feature-flag"
import posthog from "posthog-js"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    messages,
    streamingContent,
    sendMessage,
    isLoading,
    isReady,
    resetChat,
    welcomeMessage,
  } = useChat()
  const autoOpenTriggered = useRef(false)

  // Feature flag: chat-auto-open
  // Variants: "control" (no auto-open), "5s" (5 second delay), "10s" (10 second delay)
  const chatAutoOpen = useFeatureFlagVariant("chat-auto-open")

  // Auto-open chat on hedgehog detail pages after a delay
  useEffect(() => {
    if (
      !chatAutoOpen ||
      chatAutoOpen === "control" ||
      isOpen ||
      autoOpenTriggered.current
    )
      return

    const isDetailPage = window.location.pathname.startsWith("/hedgehogs/")
    if (!isDetailPage) return

    const delayMs = chatAutoOpen === "5s" ? 5000 : chatAutoOpen === "10s" ? 10000 : 0
    if (delayMs === 0) return

    const timer = setTimeout(() => {
      if (!autoOpenTriggered.current) {
        autoOpenTriggered.current = true
        setIsOpen(true)
        posthog.capture("chat_auto_opened", { variant: chatAutoOpen })
      }
    }, delayMs)

    return () => clearTimeout(timer)
  }, [chatAutoOpen, isOpen])

  // Listen for "open-chat" events from hedgehog detail page
  const handleOpenChat = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail
      setIsOpen(true)
      if (detail?.message) {
        setTimeout(() => {
          sendMessage(detail.message)
        }, 500)
      }
    },
    [sendMessage]
  )

  useEffect(() => {
    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [handleOpenChat])

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isReady) return null

  return (
    <>
      {/* Chat Panel — fullscreen on mobile, floating on desktop */}
      <div
        className={cn(
          "fixed z-50 bg-card overflow-hidden transition-all duration-300",
          "inset-0",
          "sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[520px] sm:max-h-[80vh] sm:rounded-xl sm:shadow-2xl sm:border sm:border-border/60",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none sm:scale-95 sm:translate-y-0"
        )}
      >
        <ChatPanel
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
          welcomeMessage={welcomeMessage}
          onSend={sendMessage}
          onClose={() => {
            posthog.capture("chat_closed")
            setIsOpen(false)
          }}
          onReset={resetChat}
        />
      </div>

      {/* Floating Button */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 active:scale-95",
          isOpen && "sm:rotate-0 hidden sm:flex"
        )}
        onClick={() => {
          const opening = !isOpen
          setIsOpen(opening)
          if (opening) posthog.capture("chat_opened")
        }}
      >
        {isOpen ? (
          <span className="text-lg font-bold">&times;</span>
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </>
  )
}
