# Phase 2 - Onboarding Engine Backlog

## Stories
- P2-S1: Build Stage state machine with strict transition map.
- P2-S2: Eligibility service with CRB adapter and decision persistence.
- P2-S3: Device stage endpoints for IMEI/DP evidence and enrollment events.
- P2-S4: KYC stage evidence intake and validation checks.
- P2-S5: Agreement dispatch/acknowledgement + completion logic.
- P2-S6: Webhook handlers and idempotent retry paths.

## Definition of done
- No invalid transition accepted.
- Every transition emits audit event + notification hook.
- Playwright covers complete onboarding happy path.
