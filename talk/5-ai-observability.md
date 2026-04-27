# Lesson 3: AI chat needs observability too

The chatbot (Max) uses Claude Haiku with streaming. Every conversation is traced:

```mermaid
flowchart LR
    User["User message"] --> API["API Route"]
    API --> Prompt["Build system prompt\n(queries DB)"]
    Prompt --> Claude["Claude Haiku\n(streaming)"]
    Claude --> DB["Save to Supabase"]
    DB --> RT["Realtime\ndelivers to UI"]

    API -.- OTel["OTel span\n→ PostHog"]
    Claude -.- Trace["$ai_generation\nmodel · tokens · latency"]

    style OTel fill:#1D4AFF,stroke:#1D4AFF,color:#fff
    style Trace fill:#1D4AFF,stroke:#1D4AFF,color:#fff
```

What you can see in PostHog:
- Which hedgehogs users ask about most
- Average response latency and time-to-first-token
- Token usage per conversation
- Whether the chatbot is hallucinating (check `$ai_output_choices`)

**You wouldn't ship an API without monitoring. Don't ship an AI feature without it either.**
