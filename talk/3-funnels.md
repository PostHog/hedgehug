# Lesson 1: Funnels tell you WHERE, not WHY

The adoption funnel has 3 events:

```mermaid
flowchart LR
    A["adoption_started"] --> B["adoption_terms_accepted"]
    B --> C["adoption_requested"]

    A -. "70% drop off" .-> X["abandoned"]

    style X fill:#e94560,stroke:#e94560,color:#fff
    style C fill:#16c784,stroke:#16c784,color:#fff
```

The funnel showed 70% drop-off at the terms step. But it doesn't tell you **why**.

Session replay does. You watch a user read the terms, scroll down, hesitate, and close the dialog.

The combination is what makes it useful: **funnels find the problem, session replay explains it, feature flags test the fix.**

One platform. No context-switching between tools.
