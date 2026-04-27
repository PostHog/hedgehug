"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import posthog from "posthog-js"

export function ChatTrigger({ hedgehogName }: { hedgehogName: string }) {
  const { t } = useI18n()

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      onClick={() => {
        posthog.capture("hedgehog_inquiry_clicked", {
          hedgehog_name: hedgehogName,
        })
        window.dispatchEvent(
          new CustomEvent("open-chat", {
            detail: { message: t("chat.open_message", hedgehogName) },
          })
        )
      }}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {t("chat.ask_about", hedgehogName)}
    </Button>
  )
}
