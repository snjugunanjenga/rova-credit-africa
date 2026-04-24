# Implementation Plan v1.0 (PRD -> Build)

## Delivery principles
- Contract-first: API schemas and data contracts before UI coupling.
- Stage machine integrity: only valid transitions, idempotent retries.
- Shift-left quality: tests and observability added in same PR as feature logic.
- Deployability: every phase must be releasable with rollback.

## Phase sequence

### Phase 1 - Foundation and Core Platform
Scope:
- FastAPI project modules, health checks, OpenAPI standards.
- Clerk auth integration and role claims.
- PostgreSQL + Prisma base schema.
- Redis + Celery baseline worker infrastructure.
- GitHub Actions baseline CI.

Outputs:
- Authenticated API skeleton.
- Initial migrations and seed data.
- Worker and queue plumbing.

Testing gates:
- Unit tests for auth middleware and role guards.
- Integration tests for DB + Redis connectivity.

### Phase 2 - Onboarding Domain Engine
Scope:
- Implement Stage 1-4 domain state machine.
- Eligibility (CRB), device stage, KYC, agreement/release APIs.
- Evidence upload metadata models and validation rules.
- WhatsApp template notification hooks.

Outputs:
- Domain services for all stage transitions.
- Callback/webhook handlers and retry policies.

Testing gates:
- Unit tests for transition rules and rejection/amendment paths.
- Integration tests for external adapter boundaries.
- Playwright happy-path onboarding run.

### Phase 3 - Partner and Admin Experience
Scope:
- Partner onboarding and application submission UX (React 19).
- Admin dashboards and exception queues by role.
- Ownership controls, analytics starter views, marketer messaging tools.

Outputs:
- Partner portal and admin portal MVP.
- Permission-aware routes and components.

Testing gates:
- Component and route-level access tests.
- Playwright role-based E2E tests.

### Phase 4 - Reliability, Security, Compliance, Observability
Scope:
- Sentry instrumentation, Cloud Monitoring metrics and alerts.
- AES-256 NIN data handling policy and implementation checks.
- Audit event completeness and retention controls.
- Runbook finalization and incident drills.

Outputs:
- SLO dashboards and alert policies.
- Security and compliance evidence checklist.

Testing gates:
- Security tests for authN/authZ and sensitive data masking.
- Failure-mode tests for queue retries and dead-letter processing.

### Phase 5 - Deployment and Cutover (GCP + Vercel)
Scope:
- Docker image hardening and Compute Engine deployment manifests.
- Cloud SQL and Redis configuration alignment.
- Inngest workflow registration and schedule verification.
- Vercel environment and frontend rollout.

Outputs:
- Production deployment pipeline with rollback procedure.
- Smoke test and go-live checklist.

Testing gates:
- Pre-deploy smoke checks.
- Post-deploy synthetic onboarding tests.
- Canary monitoring validation.
