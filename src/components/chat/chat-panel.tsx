"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { Button } from "@/components/ui/button"
import { X, RotateCcw } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import type { ChatMessage as ChatMessageType } from "@/types/database"

export function ChatPanel({
  messages,
  streamingContent,
  isLoading,
  welcomeMessage,
  onSend,
  onClose,
  onReset,
}: {
  messages: ChatMessageType[]
  streamingContent: string
  isLoading: boolean
  welcomeMessage: string
  onSend: (message: string) => void
  onClose: () => void
  onReset: () => void
}) {
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent, isLoading])

  const displayMessages: ChatMessageType[] =
    messages.length > 0
      ? messages
      : [
          {
            id: "welcome",
            session_id: "",
            role: "assistant" as const,
            content: welcomeMessage,
            created_at: new Date().toISOString(),
          },
        ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 sm:py-3 border-b border-border/60 bg-primary text-primary-foreground sm:rounded-t-xl safe-top">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🦔</span>
          <div>
            <p className="text-base sm:text-sm font-semibold leading-tight">
              {t("chat.title")}
            </p>
            <p className="text-xs sm:text-[10px] opacity-80">
              {t("chat.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-7 sm:w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-7 sm:w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onClose}
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {displayMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {streamingContent && (
          <ChatMessage
            message={{
              id: "streaming",
              session_id: "",
              role: "assistant",
              content: streamingContent,
              created_at: new Date().toISOString(),
            }}
          />
        )}
        {isLoading && !streamingContent && <TypingIndicator />}
      </div>

      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  )
}
