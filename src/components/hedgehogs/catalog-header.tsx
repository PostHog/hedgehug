"use client"

import { useI18n } from "@/lib/i18n/context"

export function CatalogHeader({ count }: { count: number }) {
  const { t } = useI18n()

  return (
    <div className="mb-5 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        {t("catalog.title")}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {t("catalog.count", count)}
      </p>
    </div>
  )
}

export function CatalogEmpty() {
  const { t } = useI18n()

  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">{t("catalog.empty")}</p>
    </div>
  )
}
