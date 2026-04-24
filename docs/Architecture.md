# Architecture

## High-Level Design
- **Client Apps**: Partner Portal and Admin Console (React).
- **API Layer**: FastAPI gateway exposing onboarding, partner, admin, and reporting endpoints.
- **Domain Services**: eligibility, device management, KYC, agreements, notifications.
- **Data Layer**: PostgreSQL for system of record; Redis for queueing/caching; Sanity for managed content.
- **Worker Layer**: Celery/Inngest for asynchronous checks, reminders, and reconciliation tasks.
- **Integration Layer**: CRB providers, Knox/PayJoy, Goupil relock control, WhatsApp messaging.

## Architectural Patterns
- Event-driven workflow transitions.
- Outbox pattern for reliable external event publication.
- Role-based access control with scoped permissions.
- Idempotent integration handlers with retry/dead-letter handling.
