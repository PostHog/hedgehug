"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void
  disabled: boolean
}) {
  const { t } = useI18n()
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    inputRef.current?.focus()
  }

  return (
    <div className="border-t border-border/60 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-card">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder={t("chat.placeholder")}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-muted/50 rounded-lg px-3 py-2.5 text-base sm:text-sm leading-snug placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 max-h-24"
        />
        <Button
          size="icon"
          className="h-10 w-10 sm:h-9 sm:w-9 rounded-lg shrink-0"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
        >
          <ArrowUp className="h-5 w-5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
