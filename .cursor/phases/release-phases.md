# Release Phases (Execution + Exit Criteria)

## Phase 1: Foundation
Objectives:
- Establish secure, deployable core.

Exit criteria:
- Clerk auth + role middleware active.
- DB schema v1 and migration pipeline running.
- Redis/Celery connected and health-checked.
- CI runs lint + tests on pull requests.

## Phase 2: Onboarding Engine
Objectives:
- Implement complete Stage 1-4 business flow.

Exit criteria:
- All stage transitions implemented and audited.
- CRB/device/WhatsApp integration adapters wired.
- Happy path + amendment + rejection paths tested.

## Phase 3: Partner + Admin Product Surface
Objectives:
- Deliver role-based interfaces and operational queues.

Exit criteria:
- Partner registration/activation paths live in UI.
- Admin role dashboards and queues functional.
- Role permissions proven by tests.

## Phase 4: Security, Reliability, Observability
Objectives:
- Harden for regulated, high-availability operation.

Exit criteria:
- Sentry + Cloud Monitoring dashboards and alerts configured.
- Sensitive data controls (AES-256 at rest) verified.
- Runbook procedures tested via incident drills.

## Phase 5: Deployment and Go-Live
Objectives:
- Deploy to GCP/Vercel with controlled cutover.

Exit criteria:
- Production pipeline and rollback documented.
- Smoke tests pass pre/post deploy.
- Launch readiness checklist signed off.
