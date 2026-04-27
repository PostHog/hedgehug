import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Hedgehog, Category } from "@/types/database"
import { HedgehogDetail } from "@/components/hedgehogs/hedgehog-detail"

export default async function HedgehogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerClient()
  const { data } = await supabase
    .from("hedgehogs")
    .select("*, categories(*)")
    .eq("id", id)
    .single()

  if (!data) notFound()

  return (
    <HedgehogDetail
      hedgehog={data as Hedgehog & { categories: Category | null }}
    />
  )
}
