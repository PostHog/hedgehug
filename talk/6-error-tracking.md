# Lesson 4: Full-stack error tracking without extra tools

### Frontend
- `capture_exceptions: true` in posthog-js config — auto-captures `window.onerror` and unhandled promise rejections
- React `ErrorBoundary` wraps the app — catches component crashes, sends via `posthog.captureException()`
- Manual `captureException()` in the chat stream error handler

### Backend
- `onRequestError` hook in `instrumentation.ts` — catches all Next.js server errors, extracts `distinct_id` from PostHog cookie
- `posthog.captureException()` in API route catch blocks
- OTel `LoggerProvider` sends structured logs to PostHog Logs

### What this means
One error shows up in PostHog with:
- The stack trace
- The user who hit it (linked to their session replay)
- The backend logs from that request
- The feature flags that were active

**No Sentry. No Datadog. No correlating timestamps across dashboards.**
