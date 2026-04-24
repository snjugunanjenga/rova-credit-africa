# ADR-0007: WhatsApp Business Cloud API as primary customer channel

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
East African customers overwhelmingly prefer WhatsApp over email or SMS. We need a compliant, scalable, two-way channel for lead receipts, partner coordination, repayment reminders, and inbound support.

## Decision
Use the **WhatsApp Business Cloud API** (Meta-hosted) on the business number **+254 727 291 121**, with Meta-approved templates for outbound and a webhook (`POST /v1/webhooks/whatsapp`) for inbound and delivery statuses.

## Rationale
- Cloud API is hosted by Meta — no on-prem infra.
- Templates give predictable deliverability and quality scoring.
- Webhook covers `STOP`/opt-out flows for DPPA/DPA consent compliance.
- Single channel reduces customer friction vs SMS + email + push.

## Consequences
- Template approval lead time (days) — submit early; maintain 3 fallback templates per use case.
- Quality rating must be monitored daily (`Observability.md`); marketing sends paused if it drops.
- Marketing templates require explicit, separately-recorded consent.
- Single business number creates a routing/triage need handled by our admin lead pipeline rather than human inbox triage.
