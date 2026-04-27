import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatAge(months: number) {
  if (months < 1) return "Recém-nascido"
  if (months === 1) return "1 mês"
  if (months < 12) return `${months} meses`
  const years = Math.floor(months / 12)
  const remaining = months % 12
  if (remaining === 0) return years === 1 ? "1 ano" : `${years} anos`
  return `${years} ano${years > 1 ? "s" : ""} e ${remaining} ${remaining === 1 ? "mês" : "meses"}`
}
