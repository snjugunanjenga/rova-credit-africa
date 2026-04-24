# RovaCredit Africa — Architecture Documentation

Senior-Architect documentation set for the **target production architecture** of RovaCredit Africa. The current Lovable Cloud build is a discarded prototype; these docs describe only the target stack (React 19 + FastAPI + Celery + Redis + Inngest + Cloud SQL + Clerk + GCP/Vercel).

> All `/legal/*` content remains template-only. Review with Ugandan and Kenyan legal counsel before launch.

## Index

### Core
- [techstack.md](./techstack.md) — Stack inventory, versions, rationale, cost shape
- [PRD.md](./PRD.md) — Product Requirements: vision, personas, KPIs, scope
- [Architecture.md](./Architecture.md) — C4 diagrams, request flow, NFRs
- [Plan.md](./Plan.md) — Milestones, workstreams, risks, budget
- [phases.md](./phases.md) — MVP → Beta → GA → Pan-African
- [workflow.md](./workflow.md) — Branching, PRs, CI/CD, releases
- [Onboarding_flow.md](./Onboarding_flow.md) — Customer + Partner + Admin journeys
- [Admin.md](./Admin.md) — Admin command center, RBAC matrix, audit

### Senior-Architect deliverables
- [Security.md](./Security.md) — STRIDE, RBAC, secrets, network, DR
- [Compliance.md](./Compliance.md) — Uganda DPPA 2019 + Kenya DPA 2019 + DSR
- [DataModel.md](./DataModel.md) — ERD, table dictionary, PII classes
- [API.md](./API.md) — REST contract sketch, errors, rate limits, webhooks
- [Runbook.md](./Runbook.md) — On-call, incidents, common ops, DR drill
- [Testing.md](./Testing.md) — Pyramid, P0 E2E, load, CI gates
- [Observability.md](./Observability.md) — Logs, metrics, traces, SLOs

### Architecture Decision Records
- [ADR-0001 — FastAPI over Django](./adr/ADR-0001-fastapi-over-django.md)
- [ADR-0002 — Celery + Inngest split](./adr/ADR-0002-celery-and-inngest-split.md)
- [ADR-0003 — Clerk frontend-only](./adr/ADR-0003-clerk-auth-frontend-only.md)
- [ADR-0004 — Cloud SQL Postgres 16](./adr/ADR-0004-cloud-sql-postgres.md)
- [ADR-0005 — Vercel + Cloud Run](./adr/ADR-0005-vercel-frontend-gcloud-backend.md)
- [ADR-0006 — Locker.io + GSM + GitHub Secrets](./adr/ADR-0006-locker-io-secrets.md)
- [ADR-0007 — WhatsApp Business Cloud API](./adr/ADR-0007-whatsapp-business-as-channel.md)

## Document conventions
- Markdown, ASCII diagrams, no emoji.
- All money in UGX unless stated.
- All times UTC unless stated; user-facing times EAT (UTC+3).
- New ADRs are append-only; superseded ADRs keep their number and gain a `Superseded-by` header.
