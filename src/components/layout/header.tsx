"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"

export function Header() {
  const { locale, setLocale, t } = useI18n()

  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/hedgehog.svg"
              alt="HedgeHug"
              width={28}
              height={17}
              className="transition-transform group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              HedgeHug
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-4 sm:gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/hedgehogs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.adopt")}
              </Link>
            </nav>
            <button
              onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-2 py-1"
            >
              {locale === "pt-BR" ? "EN" : "PT"}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
