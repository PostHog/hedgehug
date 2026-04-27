"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import type { Hedgehog, Category } from "@/types/database"
import { ChatTrigger } from "./chat-trigger"
import { AdoptButton } from "./adopt-button"
import type { Locale } from "@/lib/i18n/translations"

const temperamentColors: Record<string, string> = {
  Calm: "bg-blue-100 text-blue-800",
  Friendly: "bg-emerald-100 text-emerald-800",
  Playful: "bg-amber-100 text-amber-800",
  Adventurous: "bg-purple-100 text-purple-800",
  Shy: "bg-rose-100 text-rose-800",
}

function formatAgeLocalized(months: number, locale: Locale) {
  if (months < 1)
    return locale === "pt-BR" ? "Recém-nascido" : "Newborn"
  if (months === 1)
    return locale === "pt-BR" ? "1 mês" : "1 month"
  if (months < 12)
    return locale === "pt-BR" ? `${months} meses` : `${months} months`
  const years = Math.floor(months / 12)
  const rem = months % 12
  const yStr =
    locale === "pt-BR"
      ? `${years} ${years === 1 ? "ano" : "anos"}`
      : `${years} ${years === 1 ? "year" : "years"}`
  if (rem === 0) return yStr
  const mStr =
    locale === "pt-BR"
      ? `${rem} ${rem === 1 ? "mês" : "meses"}`
      : `${rem} ${rem === 1 ? "month" : "months"}`
  const and = locale === "pt-BR" ? "e" : "and"
  return `${yStr} ${and} ${mStr}`
}

export function HedgehogDetail({
  hedgehog,
}: {
  hedgehog: Hedgehog & { categories: Category | null }
}) {
  const { locale, t } = useI18n()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Link
        href="/hedgehogs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("detail.back")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {hedgehog.image_url && (
            <Image
              src={hedgehog.image_url}
              alt={hedgehog.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          )}
          {hedgehog.is_adopted && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-widest">
                {t("card.adopted.overlay")}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            {hedgehog.categories && (
              <Badge variant="secondary" className="text-xs">
                {hedgehog.categories.name}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-xs ${temperamentColors[hedgehog.temperament] || ""}`}
            >
              {t(`temperament.${hedgehog.temperament}` as keyof typeof import("@/lib/i18n/translations").translations)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t(`detail.sex.${hedgehog.sex}` as keyof typeof import("@/lib/i18n/translations").translations)}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-1 sm:mb-2">
            {hedgehog.name}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">
            {hedgehog.breed} &middot; {hedgehog.color}
          </p>

          {hedgehog.is_adopted ? (
            <div className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4 sm:mb-6">
              {t("detail.found_home")}
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-4 py-1.5 text-sm font-medium mb-4 sm:mb-6">
              {t("detail.available")}
            </div>
          )}

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
            {hedgehog.description}
          </p>

          {!hedgehog.is_adopted && (
            <div className="flex flex-col sm:flex-row gap-3">
              <AdoptButton
                hedgehogName={hedgehog.name}
                hedgehogId={hedgehog.id}
              />
              <ChatTrigger hedgehogName={hedgehog.name} />
            </div>
          )}

          <Separator className="my-4 sm:my-6" />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {t("detail.age")}
              </span>
              <p className="font-medium">
                {formatAgeLocalized(hedgehog.age_months, locale)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {t("detail.breed")}
              </span>
              <p className="font-medium">{hedgehog.breed}</p>
            </div>
            {hedgehog.weight_grams && (
              <div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {t("detail.weight")}
                </span>
                <p className="font-medium">{hedgehog.weight_grams}g</p>
              </div>
            )}
            {hedgehog.color && (
              <div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {t("detail.color")}
                </span>
                <p className="font-medium">{hedgehog.color}</p>
              </div>
            )}
            {!hedgehog.is_adopted && (
              <div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {t("detail.fee")}
                </span>
                <p className="font-medium">
                  {formatPrice(hedgehog.adoption_fee)}
                </p>
              </div>
            )}
            {hedgehog.health_notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs sm:text-sm">
                  {t("detail.health")}
                </span>
                <p className="font-medium">{hedgehog.health_notes}</p>
              </div>
            )}
          </div>

          {hedgehog.bio && (
            <>
              <Separator className="my-4 sm:my-6" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                  {t("detail.about", hedgehog.name)}
                </h3>
                {hedgehog.bio.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm text-muted-foreground leading-relaxed mb-3"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
