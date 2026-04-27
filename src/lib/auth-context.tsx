"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import posthog from "posthog-js"

const STORAGE_KEY = "hedgehug-display-name"

interface AuthContextType {
  displayName: string | null
  setDisplayName: (name: string) => void
  isReady: boolean
}

const AuthContext = createContext<AuthContextType>({
  displayName: null,
  setDisplayName: () => {},
  isReady: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setDisplayNameState(stored)
      // Re-identify on load
      posthog.identify(stored, { display_name: stored })
    }
    setIsReady(true)
  }, [])

  function setDisplayName(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem(STORAGE_KEY, trimmed)
    setDisplayNameState(trimmed)

    // Identify in PostHog
    posthog.identify(trimmed, { display_name: trimmed })
    posthog.capture("user_identified", { display_name: trimmed })
  }

  return (
    <AuthContext.Provider value={{ displayName, setDisplayName, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
