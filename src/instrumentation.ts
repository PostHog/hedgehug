export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node")
  }
}

export const onRequestError = async (
  err: Error,
  request: { headers: Record<string, string | string[] | undefined> },
  _context: unknown
) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogClient } = await import("./lib/posthog-server")
    const posthog = getPostHogClient()

    // Try to extract distinct_id from PostHog cookie
    let distinctId: string | undefined
    const cookieHeader = request.headers?.cookie
    if (cookieHeader) {
      const cookieString = Array.isArray(cookieHeader)
        ? cookieHeader.join("; ")
        : cookieHeader
      const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/)
      if (match?.[1]) {
        try {
          const decoded = decodeURIComponent(match[1])
          const data = JSON.parse(decoded)
          distinctId = data.distinct_id
        } catch {
          // ignore parse errors
        }
      }
    }

    await posthog.captureException(err, distinctId)
  }
}
