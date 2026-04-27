# Demo Cheat Sheet

## Setup (before the talk)

- [ ] Site running at `localhost:3000` (or deployed URL)
- [ ] PostHog project with pre-generated traffic (click around, trigger adoptions, chat)
- [ ] 3 feature flags created: `chat-auto-open`, `simplified-adoption-flow`, `show-social-proof`
- [ ] Funnel insight saved: `adoption_started` → `adoption_terms_accepted` → `adoption_requested`
- [ ] Browser zoom 125-150%
- [ ] Notifications off, phone silent
- [ ] Bookmark: site URL + PostHog dashboard

## The story

> "We built a hedgehog adoption site. People are clicking 'Quero Adotar' but almost nobody completes the adoption. Let me show you how I find out why and fix it — live."

## Flow

### 1. Show the app (30 seconds)
- Browse the catalog, click a hedgehog, show the detail page
- Click "Quero Adotar" — walk through the 3-step flow (terms → confirm → success)
- Open the chat, ask Max about a hedgehog

### 2. Show the problem in PostHog (60 seconds)
- Open the funnel: `adoption_started` → `adoption_terms_accepted` → `adoption_requested`
- Point to the drop-off at the terms step — "70% of people abandon here"
- Open a session replay of someone who abandoned — watch them read the terms and close

### 3. Fix it with a feature flag (60 seconds)
- Open `simplified-adoption-flow` feature flag
- Enable `skip-terms` variant for 100% of users
- Go back to the site — click "Quero Adotar" — terms step is gone, straight to confirm
- "We just ran an experiment without deploying code"

### 4. Show the full stack (60 seconds)
- **Error tracking**: show a captured exception (or trigger one)
- **Logs**: show backend log entries (chat request received, response streamed)
- **AI observability**: show the `$ai_generation` event — model, latency, tokens, full prompt/response

### 5. Wrap up (30 seconds)
- "One tool. Funnels told us where users dropped off. Session replay showed us why. A feature flag fixed it. Error tracking and logs caught issues. AI observability monitors the chatbot. All in PostHog."

## If Wi-Fi dies
- Have screenshots of: the funnel, a session replay, the feature flag config, an AI trace
- The site runs locally with `pnpm dev` — chat still works if Anthropic API is reachable
