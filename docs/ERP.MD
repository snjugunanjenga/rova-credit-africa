# Engineering Requirements Plan (ERP)

## Scope
Translate PRD requirements into actionable engineering components.

## Required Components
- React frontend for partner and admin journeys.
- FastAPI backend with domain services for onboarding stages.
- PostgreSQL schema with Prisma migrations.
- Redis-backed caching and job queues.
- Celery/Inngest workers for external calls and asynchronous checks.
- Clerk-based authentication and role authorization.

## Engineering Constraints
- State transitions must be deterministic and idempotent.
- External integration failures must be retriable and observable.
- Every endpoint needs schema validation and permission checks.

## Acceptance Signals
- End-to-end onboarding path succeeds in non-production environments.
- Stage-level dashboards track conversion and fallout.
- Incident runbooks exist for integration and queue failures.
