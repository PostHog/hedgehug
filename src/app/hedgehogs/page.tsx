import { createServerClient } from "@/lib/supabase/server"
import { HedgehogCard } from "@/components/hedgehogs/hedgehog-card"
import { HedgehogFilters } from "@/components/hedgehogs/hedgehog-filters"
import { CatalogHeader, CatalogEmpty } from "@/components/hedgehogs/catalog-header"
import type { Hedgehog, Category } from "@/types/database"

export const metadata = {
  title: "Adotar | HedgeHug",
  description: "Conheça nossos ouriços disponíveis para adoção.",
}

export default async function HedgehogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    temperament?: string
    q?: string
    sort?: string
  }>
}) {
  const params = await searchParams
  const supabase = createServerClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  let query = supabase.from("hedgehogs").select("*, categories(*)")

  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single()
    if (cat) query = query.eq("category_id", cat.id)
  }

  if (params.temperament) {
    query = query.eq("temperament", params.temperament)
  }

  if (params.q) {
    query = query.or(
      `name.ilike.%${params.q}%,breed.ilike.%${params.q}%,color.ilike.%${params.q}%`
    )
  }

  switch (params.sort) {
    case "age-asc":
      query = query.order("age_months", { ascending: true })
      break
    case "age-desc":
      query = query.order("age_months", { ascending: false })
      break
    case "name":
      query = query.order("name", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: hedgehogs } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <CatalogHeader count={hedgehogs?.length || 0} />

      <HedgehogFilters
        categories={(categories as Category[]) || []}
        currentCategory={params.category}
        currentTemperament={params.temperament}
        currentQuery={params.q}
        currentSort={params.sort}
      />

      {hedgehogs && hedgehogs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-8">
          {(hedgehogs as Hedgehog[]).map((h) => (
            <HedgehogCard key={h.id} hedgehog={h} />
          ))}
        </div>
      ) : (
        <CatalogEmpty />
      )}
    </div>
  )
}
