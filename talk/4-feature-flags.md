# Lesson 2: Feature flags as product levers

Three multivariate flags control different parts of the experience:

### `simplified-adoption-flow`
| Variant | What happens |
|---------|-------------|
| `control` | Full 3-step flow: terms → confirm → success |
| `skip-terms` | Skip terms, go straight to confirm |
| `one-click` | One click → success |

### `show-social-proof`
| Variant | What happens |
|---------|-------------|
| `control` | Nothing shown |
| `interested` | "X interessados" badge on cards |
| `views` | "X visualizações" badge on cards |

### `chat-auto-open`
| Variant | What happens |
|---------|-------------|
| `control` | Chat stays closed |
| `5s` | Auto-opens after 5 seconds on detail page |
| `10s` | Auto-opens after 10 seconds |

Every event includes the flag variant as a property. You can break down any metric by variant — no extra work.

The key insight: **the flags are already in the code. The product decision is made in PostHog, not in a deploy.**
