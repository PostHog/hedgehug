"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { useFeatureFlagVariant } from "@/hooks/use-feature-flag"
import type { Hedgehog } from "@/types/database"
import type { Locale } from "@/lib/i18n/translations"

const temperamentColors: Record<string, string> = {
  Calm: "bg-blue-100 text-blue-800",
  Friendly: "bg-emerald-100 text-emerald-800",
  Playful: "bg-amber-100 text-amber-800",
  Adventurous: "bg-purple-100 text-purple-800",
  Shy: "bg-rose-100 text-rose-800",
}

function getInterestCount(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return 3 + (Math.abs(hash) % 12)
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

export function HedgehogCard({ hedgehog }: { hedgehog: Hedgehog }) {
  const { locale, t } = useI18n()
  const socialProofVariant = useFeatureFlagVariant("show-social-proof")
  const count = getInterestCount(hedgehog.id)

  return (
    <Link href={`/hedgehogs/${hedgehog.id}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 h-full">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {hedgehog.image_url && (
            <Image
              src={hedgehog.image_url}
              alt={hedgehog.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {hedgehog.is_adopted && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-white tracking-widest">
                {t("card.adopted.overlay")}
              </span>
            </div>
          )}
          {hedgehog.sex && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="text-[10px] font-bold bg-white/80 backdrop-blur-sm"
              >
                {hedgehog.sex === "M" ? "♂" : "♀"}
              </Badge>
            </div>
          )}
          {socialProofVariant &&
            socialProofVariant !== "control" &&
            !hedgehog.is_adopted && (
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-foreground/70 text-white text-[9px] sm:text-[10px] backdrop-blur-sm gap-1">
                  <Users className="h-3 w-3" />
                  {socialProofVariant === "views"
                    ? t("card.views", count)
                    : t("card.interested", count)}
                </Badge>
              </div>
            )}
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-1 mb-1">
            <Badge
              variant="outline"
              className={`text-[9px] sm:text-[10px] font-medium shrink-0 px-1.5 sm:px-2 ${temperamentColors[hedgehog.temperament] || ""}`}
            >
              {t(`temperament.${hedgehog.temperament}` as keyof typeof import("@/lib/i18n/translations").translations)}
            </Badge>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {formatAgeLocalized(hedgehog.age_months, locale)}
            </span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base leading-snug mt-1.5 sm:mt-2 group-hover:text-primary transition-colors">
            {hedgehog.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
            {hedgehog.breed} &middot; {hedgehog.color}
          </p>
          <p className="text-xs sm:text-sm mt-2 sm:mt-3">
            {hedgehog.is_adopted ? (
              <span className="text-muted-foreground font-medium">
                {t("card.adopted")}
              </span>
            ) : (
              <span className="text-primary font-semibold">
                {t("card.available")}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
