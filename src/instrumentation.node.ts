import { resourceFromAttributes } from "@opentelemetry/resources"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { PostHogSpanProcessor } from "@posthog/ai/otel"
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { logs } from "@opentelemetry/api-logs"

const posthogProjectApiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

if (!posthogProjectApiKey) {
  throw new Error("Missing NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN for PostHog tracing")
}

// OTel tracing (Anthropic LLM spans)
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "hedgehug-backend",
  }),
  spanProcessors: [
    new PostHogSpanProcessor({
      apiKey: posthogProjectApiKey,
      host: posthogHost,
    }),
  ],
  instrumentations: [new AnthropicInstrumentation()],
})

sdk.start()

// OTel logging → PostHog Logs
export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "hedgehug-backend" }),
  processors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${posthogHost}/i/v1/logs`,
        headers: {
          Authorization: `Bearer ${posthogProjectApiKey}`,
          "Content-Type": "application/json",
        },
      })
    ),
  ],
})

logs.setGlobalLoggerProvider(loggerProvider)
