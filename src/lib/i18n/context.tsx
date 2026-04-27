"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { type Locale, type TranslationKey, translations } from "./translations"
import posthog from "posthog-js"

const STORAGE_KEY = "hedgehug-locale"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: {
    (key: TranslationKey): string
    (key: TranslationKey, ...args: unknown[]): string
  }
}

const I18nContext = createContext<I18nContextType>({
  locale: "pt-BR",
  setLocale: () => {},
  t: ((key: string) => key) as I18nContextType["t"],
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && (stored === "pt-BR" || stored === "en-US")) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang = l
    posthog.capture("language_changed", { locale: l })
  }, [])

  const t = useCallback(
    (key: TranslationKey, ...args: unknown[]) => {
      const entry = translations[key]
      if (!entry) return key
      const value = (entry as Record<Locale, unknown>)[locale]
      if (typeof value === "function") {
        return (value as (...a: unknown[]) => string)(...args)
      }
      if (Array.isArray(value)) return value as unknown as string
      return (value as string) ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

/** Helper to get array translations (e.g. terms list) */
export function useTranslationArray(key: TranslationKey): string[] {
  const { locale } = useI18n()
  const entry = translations[key]
  if (!entry) return []
  const value = (entry as Record<Locale, unknown>)[locale]
  return Array.isArray(value) ? value : []
}
