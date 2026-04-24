# Phase 1 - Foundation Backlog

## Stories
- P1-S1: Bootstrap FastAPI modules, health and readiness endpoints.
- P1-S2: Implement Clerk JWT verification and role claim extraction.
- P1-S3: Define Prisma schema for users, partners, applications, and audit events.
- P1-S4: Provision Redis and Celery baseline workers.
- P1-S5: Configure GitHub Actions for lint, unit, integration tests.

## Definition of done
- All APIs behind auth middleware (except health/docs).
- Migrations repeatable in clean environments.
- CI green on main branch protections.
