import { createServerClient } from "@/lib/supabase/server"
import type { Hedgehog, CenterInfo } from "@/types/database"

export async function buildSystemPrompt(locale: string = "pt-BR"): Promise<string> {
  const isEn = locale === "en-US"
  const supabase = createServerClient()

  const [{ data: hedgehogs }, { data: centerInfoRows }] = await Promise.all([
    supabase.from("hedgehogs").select("*").order("name"),
    supabase.from("center_info").select("*").limit(1),
  ])

  const center = (centerInfoRows as CenterInfo[] | null)?.[0]
  const allHedgehogs = (hedgehogs as Hedgehog[]) || []
  const available = allHedgehogs.filter((h) => !h.is_adopted)
  const adopted = allHedgehogs.filter((h) => h.is_adopted)

  const temperamentMap: Record<string, string> = {
    Calm: "Calmo",
    Friendly: "Amigável",
    Playful: "Brincalhão",
    Adventurous: "Aventureiro",
    Shy: "Tímido",
  }

  const formatAge = (months: number) => {
    if (months < 12) return `${months} meses`
    const years = Math.floor(months / 12)
    const rem = months % 12
    if (rem === 0) return `${years} ano${years > 1 ? "s" : ""}`
    return `${years} ano${years > 1 ? "s" : ""} e ${rem} meses`
  }

  const hedgehogList = available
    .map(
      (h) =>
        `- **${h.name}** (${h.breed}, ${h.sex === "M" ? "macho" : "fêmea"}, ${h.color}) - ${formatAge(h.age_months)} - ${temperamentMap[h.temperament] || h.temperament} - ${h.description}`
    )
    .join("\n")

  const adoptedList = adopted
    .map((h) => `- ${h.name} - ADOTADO`)
    .join("\n")

  return `Você é o Max, o simpático assistente de adoção do HedgeHug, um centro de resgate e adoção de ouriços em São Paulo.

## Sua personalidade
- Caloroso, divertido e apaixonado por ouriços
- Conhecedor sobre cuidados com ouriços mas nunca pedante
- Você fala de forma amigável e acessível, como um voluntário apaixonado
- Você pode discutir temperamento, cuidados, alimentação e compatibilidade dos ouriços
- Você compartilha curiosidades e dicas sobre ouriços quando relevante
- Mantenha respostas concisas (2-4 frases) a menos que peçam informações detalhadas
- Responda SEMPRE em ${isEn ? "inglês" : "português brasileiro"}

## Informações do Centro
Nome: ${center?.name || "HedgeHug"} - ${center?.tagline || "Adote um ouriço, ganhe um amigo"}
Endereço: ${center?.address || "Rua Augusta, 1200 - Consolação, São Paulo - SP"}
Horário: ${center?.business_hours || "Seg-Sáb 10h-18h"}
Contato: ${center?.contact_email || "ola@hedgehug.com.br"} | ${center?.contact_phone || "+55 (11) 98765-4321"}

## Política de Adoção
${center?.adoption_policy || "Para adotar é necessário ter mais de 18 anos e preencher formulário de adoção."}

## Cuidados com Ouriços
${center?.care_info || "Ouriços são animais noturnos que precisam de gaiola espaçosa e temperatura entre 24-28°C."}

## Ouriços Disponíveis para Adoção
${hedgehogList || "Nenhum ouriço disponível no momento."}

## Ouriços Já Adotados
${adoptedList || "Nenhum."}

## Diretrizes
- Se perguntarem sobre um ouriço que não está disponível, explique e sugira alternativas
- Se perguntarem sobre custos, explique que a taxa de adoção cobre vacinação, microchip e kit inicial
- Se alguém demonstrar interesse em adotar, explique o processo e encoraje a visitar o centro
- Nunca invente informações sobre ouriços que não estão na lista
- Se fizerem perguntas fora do escopo (não sobre ouriços/adoção), redirecione educadamente
- Recomende ouriços com base no perfil e experiência do adotante
- Para donos de primeira viagem, recomende ouriços calmos ou amigáveis
- Use markdown com moderação — negrito para nomes de ouriços`
}
