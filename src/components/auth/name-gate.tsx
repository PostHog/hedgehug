"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function NameGate({ children }: { children: React.ReactNode }) {
  const { displayName, setDisplayName, isReady } = useAuth()
  const { locale, setLocale, t } = useI18n()
  const [value, setValue] = useState("")
  const pathname = usePathname()

  // Skip gate for the talk/slides route
  if (pathname?.startsWith("/talk")) return <>{children}</>

  if (!isReady) return null
  if (displayName) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <button
            onClick={() =>
              setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")
            }
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-2 py-1"
          >
            {locale === "pt-BR" ? "EN" : "PT"}
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F9BD2B]/15 mb-4">
            <Image
              src="/hedgehog.svg"
              alt="HedgeHug"
              width={40}
              height={24}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("gate.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("gate.subtitle")}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (value.trim()) setDisplayName(value.trim())
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="display-name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              {t("gate.label")}
            </label>
            <Input
              id="display-name"
              type="text"
              placeholder={t("gate.placeholder")}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-base sm:text-sm"
              autoFocus
              autoComplete="name"
              maxLength={50}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!value.trim()}>
            {t("gate.submit")}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          {t("gate.disclaimer")}
        </p>
      </div>
    </div>
  )
}
