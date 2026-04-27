"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"

/** Returns true/false for boolean flags */
export function useFeatureFlagEnabled(flag: string): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(posthog.isFeatureEnabled(flag) ?? false)

    const unsubscribe = posthog.onFeatureFlags(() => {
      setEnabled(posthog.isFeatureEnabled(flag) ?? false)
    })

    return () => {
      unsubscribe?.()
    }
  }, [flag])

  return enabled
}

/** Returns the string variant key for multivariate flags */
export function useFeatureFlagVariant(flag: string): string | undefined {
  const [variant, setVariant] = useState<string | undefined>(undefined)

  useEffect(() => {
    const value = posthog.getFeatureFlag(flag)
    setVariant(typeof value === "string" ? value : undefined)

    const unsubscribe = posthog.onFeatureFlags(() => {
      const value = posthog.getFeatureFlag(flag)
      setVariant(typeof value === "string" ? value : undefined)
    })

    return () => {
      unsubscribe?.()
    }
  }, [flag])

  return variant
}
