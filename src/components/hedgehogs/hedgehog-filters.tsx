"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import type { Category } from "@/types/database"
import posthog from "posthog-js"

const temperamentKeys = ["Calm", "Friendly", "Playful", "Adventurous", "Shy"] as const

export function HedgehogFilters({
  categories,
  currentCategory,
  currentTemperament,
  currentQuery,
  currentSort,
}: {
  categories: Category[]
  currentCategory?: string
  currentTemperament?: string
  currentQuery?: string
  currentSort?: string
}) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()

  const sorts = [
    { value: "", label: t("filter.sort.recent") },
    { value: "age-asc", label: t("filter.sort.youngest") },
    { value: "age-desc", label: t("filter.sort.oldest") },
    { value: "name", label: t("filter.sort.name") },
  ]

  const setFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/hedgehogs?${params.toString()}`)
    },
    [router, searchParams]
  )

  const hasFilters =
    currentCategory || currentTemperament || currentQuery || currentSort

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("filter.search")}
            defaultValue={currentQuery || ""}
            className="pl-9 text-base sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query =
                  (e.target as HTMLInputElement).value || undefined
                posthog.capture("hedgehog_searched", { query: query ?? "" })
                setFilter("q", query)
              }
            }}
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-background px-2 sm:px-3 text-sm shrink-0"
          value={currentSort || ""}
          onChange={(e) => {
            const sort = e.target.value || undefined
            posthog.capture("hedgehog_sort_changed", {
              sort: sort ?? "default",
            })
            setFilter("sort", sort)
          }}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
        {categories.map((cat) => (
          <Badge
            key={cat.slug}
            variant={currentCategory === cat.slug ? "default" : "outline"}
            className="cursor-pointer transition-colors whitespace-nowrap shrink-0"
            onClick={() => {
              const next =
                currentCategory === cat.slug ? undefined : cat.slug
              posthog.capture("hedgehog_filter_applied", {
                filter_type: "category",
                filter_value: next ?? null,
                category: cat.name,
              })
              setFilter("category", next)
            }}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
        {temperamentKeys.map((tk) => (
          <Badge
            key={tk}
            variant={currentTemperament === tk ? "default" : "outline"}
            className="cursor-pointer transition-colors text-xs whitespace-nowrap shrink-0"
            onClick={() => {
              const next = currentTemperament === tk ? undefined : tk
              posthog.capture("hedgehog_filter_applied", {
                filter_type: "temperament",
                filter_value: next ?? null,
              })
              setFilter("temperament", next)
            }}
          >
            {t(`temperament.${tk}` as keyof typeof import("@/lib/i18n/translations").translations)}
          </Badge>
        ))}
        {hasFilters && (
          <Badge
            variant="outline"
            className="cursor-pointer text-xs text-destructive border-destructive/30 whitespace-nowrap shrink-0"
            onClick={() => router.push("/hedgehogs")}
          >
            <X className="h-3 w-3 mr-1" />
            {t("filter.clear")}
          </Badge>
        )}
      </div>
    </div>
  )
}
