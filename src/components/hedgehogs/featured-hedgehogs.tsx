"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { HedgehogCard } from "./hedgehog-card"
import { useI18n } from "@/lib/i18n/context"
import type { Hedgehog } from "@/types/database"

export function FeaturedHedgehogs() {
  const { t } = useI18n()
  const [hedgehogs, setHedgehogs] = useState<Hedgehog[]>([])

  useEffect(() => {
    supabase
      .from("hedgehogs")
      .select("*")
      .eq("is_featured", true)
      .eq("is_adopted", false)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setHedgehogs(data as Hedgehog[])
      })
  }, [])

  if (hedgehogs.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          {t("featured.title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("featured.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {hedgehogs.map((h) => (
          <HedgehogCard key={h.id} hedgehog={h} />
        ))}
      </div>
    </section>
  )
}
