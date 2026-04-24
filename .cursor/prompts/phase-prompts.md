# Laser-Focused Prompts by Phase

## Phase 1 Prompt
"Using `.cursor/phases/phase-1-foundation.md`, implement only P1-S1 through P1-S5 with FastAPI + Clerk + Prisma + Redis/Celery baseline. Add unit/integration tests for auth and persistence. Do not build UI yet. Return changed files, migration scripts, and test results."

## Phase 2 Prompt
"Implement `.cursor/phases/phase-2-onboarding-engine.md` stories with strict onboarding state transitions, CRB/device/KYC/agreement endpoints, idempotent webhooks, and audit events. Add unit + integration tests plus one Playwright happy-path flow. Return API contract diffs and failing/risky edge cases."

## Phase 3 Prompt
"Build `.cursor/phases/phase-3-partner-admin.md` features in React 19 (mobile-first), including partner flows and admin role dashboards (Owner, Developers, Analyst, Marketers). Enforce RBAC end-to-end and add Playwright coverage for role-specific workflows."

## Phase 4 Prompt
"Execute `.cursor/phases/phase-4-reliability-security.md`: instrument Sentry and Cloud Monitoring metrics/alerts, enforce NIN/PII controls, and implement failure-mode handling for queues/integrations. Add security and resilience tests and map every alert to a runbook action."

## Phase 5 Prompt
"Deliver `.cursor/phases/phase-5-deployment-gcp.md`: containerize services, configure GCP Compute Engine + Cloud SQL + Redis environments, register Inngest schedules, deploy frontend to Vercel, run smoke tests, and validate rollback readiness. Return deployment manifests and go-live checklist evidence."
