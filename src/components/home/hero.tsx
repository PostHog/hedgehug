"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F9BD2B]/10 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F9BD2B]/15 text-[#B8860B] px-3 py-1 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Heart className="h-3.5 w-3.5 fill-current" />
            {t("hero.badge")}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-4 sm:mb-6">
            {t("hero.title.line1")}
            <br />
            <span className="text-primary">{t("hero.title.line2")}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            {t("hero.description")}
          </p>
          <Link
            href="/hedgehogs"
            className={buttonVariants({
              size: "lg",
              className: "font-semibold w-full sm:w-auto",
            })}
          >
            {t("hero.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
