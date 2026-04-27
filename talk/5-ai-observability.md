# Lesson 3: AI chat needs observability too

The chatbot (Max) uses Claude Haiku with streaming. Every conversation is traced:

- **OTel instrumentation** auto-traces Anthropic API calls (spans with model, tokens, latency)
- **`$ai_generation` events** capture the full prompt/response, input/output tokens, time-to-first-token
- **Supabase Realtime** delivers streamed tokens to the UI — the message builds up live

The system prompt is dynamic — it queries the hedgehog database on every request so Max always knows the current inventory.

What you can see in PostHog:
- Which hedgehogs users ask about most
- Average response latency
- Token usage per conversation
- Whether the chatbot is hallucinating (check `$ai_output_choices`)

**You wouldn't ship an API without monitoring. Don't ship an AI feature without it either.**
