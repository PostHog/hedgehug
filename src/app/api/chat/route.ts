import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from "@/lib/supabase/server"
import { buildSystemPrompt } from "@/lib/chat-system-prompt"
import type { ChatMessage } from "@/types/database"
import { getPostHogClient, serverLog } from "@/lib/posthog-server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, displayName, locale } = await request.json()
    const distinctId = displayName || sessionId

    if (!sessionId || !message) {
      return new Response(
        JSON.stringify({ error: "sessionId and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    serverLog("info", "Chat request received", {
      session_id: sessionId,
      distinct_id: distinctId,
      message_length: message.length,
    })

    const supabase = createServerClient()

    // Fetch conversation history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    let messages: { role: "user" | "assistant"; content: string }[] = (
      (history as ChatMessage[]) || []
    )
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))

    // Fallback: if history is empty (stale session), use the message from the request
    if (messages.length === 0) {
      messages = [{ role: "user", content: message }]
    }

    // Build system prompt with fresh inventory data
    const systemPrompt = await buildSystemPrompt(locale || "pt-BR")

    // Stream from Anthropic
    const generationStartMs = Date.now()
    let firstTokenMs: number | null = null
    const traceId = crypto.randomUUID()

    const stream = anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages,
    })

    let fullContent = ""

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text
              if (firstTokenMs === null && text.length > 0) {
                firstTokenMs = Date.now()
              }
              fullContent += text
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              )
            }
          }

          const finalMessage = await stream.finalMessage()
          const usage = finalMessage.usage
          const generationEndMs = Date.now()
          const latency = (generationEndMs - generationStartMs) / 1000

          serverLog("info", "Chat response streamed", {
            session_id: sessionId,
            distinct_id: distinctId,
            latency_s: latency,
            input_tokens: usage?.input_tokens,
            output_tokens: usage?.output_tokens,
            response_length: fullContent.length,
          })

          // Stream complete — save the full message to Supabase
          if (fullContent) {
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              role: "assistant",
              content: fullContent,
            })

            getPostHogClient().capture({
              distinctId,
              event: "$ai_generation",
              properties: {
                $ai_trace_id: traceId,
                $ai_session_id: sessionId,
                $ai_provider: "anthropic",
                $ai_model: "claude-haiku-4-5-20251001",
                $ai_stream: true,
                $ai_max_tokens: 512,
                $ai_latency: latency,
                ...(firstTokenMs !== null
                  ? {
                      $ai_time_to_first_token:
                        (firstTokenMs - generationStartMs) / 1000,
                    }
                  : {}),
                ...(usage?.input_tokens != null
                  ? { $ai_input_tokens: usage.input_tokens }
                  : {}),
                ...(usage?.output_tokens != null
                  ? { $ai_output_tokens: usage.output_tokens }
                  : {}),
                $ai_input: [
                  { role: "system", content: "[omitted]" },
                  ...messages,
                ],
                $ai_output_choices: [
                  { role: "assistant", content: fullContent },
                ],
              },
            })

            getPostHogClient().capture({
              distinctId,
              event: "chat_response_completed",
              properties: {
                session_id: sessionId,
                response_length: fullContent.length,
              },
            })

            await getPostHogClient().flush()
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Stream error:", error)
          const errorMsg =
            "Desculpe, estou com dificuldades no momento. Tente novamente ou entre em contato pelo ola@hedgehug.com.br."

          serverLog("error", `Chat stream error: ${error instanceof Error ? error.message : String(error)}`, {
            session_id: sessionId,
            distinct_id: distinctId,
            error_name: error instanceof Error ? error.name : "Unknown",
          })

          getPostHogClient().captureException(
            error instanceof Error ? error : new Error(String(error)),
            distinctId
          )

          await getPostHogClient().flush()

          // Save error message to DB
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            role: "assistant",
            content: errorMsg,
          })

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: errorMsg })}\n\n`)
          )
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    serverLog("error", `Chat API top-level error: ${error instanceof Error ? error.message : String(error)}`, {
      error_name: error instanceof Error ? error.name : "Unknown",
    })

    getPostHogClient().captureException(
      error instanceof Error ? error : new Error(String(error)),
      "server"
    )
    await getPostHogClient().flush()

    return new Response(
      JSON.stringify({ error: "Failed to process message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
