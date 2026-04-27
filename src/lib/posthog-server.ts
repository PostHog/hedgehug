import { PostHog } from "posthog-node"
import { logs, SeverityNumber } from "@opentelemetry/api-logs"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}

const severityMap: Record<string, SeverityNumber> = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
}

/** Send a structured log to PostHog via OTel */
export function serverLog(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  attributes?: Record<string, unknown>
) {
  const logger = logs.getLogger("hedgehug-backend")
  logger.emit({
    body: message,
    severityNumber: severityMap[level],
    severityText: level.toUpperCase(),
    attributes: attributes as Record<string, string | number | boolean> | undefined,
  })
}
