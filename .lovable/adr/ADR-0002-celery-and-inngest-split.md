# ADR-0002: Celery + Inngest split (in-flight tasks vs durable workflows)

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
We have two distinct async needs:
1. Short-lived, in-process tasks (send a WhatsApp message, generate a PDF, hit a 3rd-party API with retries).
2. Long-running, durable, multi-step workflows that span hours/days (lead routing SLAs, partner onboarding, repayment reminder sequences, DSR fulfilment, retention sweeper).

## Decision
- **Celery + Redis** for (1) — sub-second to ~minutes tasks.
- **Inngest** for (2) — durable, event-driven, time-aware workflows with built-in retries, sleeps, and human-in-the-loop steps.

## Rationale
- Celery is the right tool for fan-out and quick retries; we already need Redis for cache.
- Inngest replaces a home-grown state machine + cron + DB-backed job runner. It gives us durable `step.sleep("24h")` and `step.waitForEvent("partner.approved")` natively.
- Splitting concerns keeps each system small and observable.

## Consequences
- Two systems to monitor (mitigated by shared OTel instrumentation).
- Cost of Inngest is justified by reduced engineering time on workflow plumbing.
- Clear rule: anything with `sleep > 1 minute` or human steps → Inngest, not Celery.
