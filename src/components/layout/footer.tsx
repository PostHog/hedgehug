"use client"

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Image
                src="/hedgehog.svg"
                alt="HedgeHug"
                width={24}
                height={14}
              />
              <span className="text-base sm:text-lg font-bold">HedgeHug</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2 sm:mb-3">
              {t("footer.visit")}
            </h3>
            <div className="text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
              <p>Rua Augusta, 1200</p>
              <p>Consolação, São Paulo - SP</p>
              <p>Seg-Sáb 10h-18h</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2 sm:mb-3">
              {t("footer.contact")}
            </h3>
            <div className="text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
              <p>ola@hedgehug.com.br</p>
              <p>+55 (11) 98765-4321</p>
            </div>
          </div>
        </div>
        <Separator className="my-6 sm:my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HedgeHug. {t("footer.rights")}
          </p>
          <Image
            src="/logo-row.svg"
            alt="Powered by PostHog"
            width={100}
            height={18}
            className="opacity-40"
          />
        </div>
      </div>
    </footer>
  )
}
