
# RovaCredit Africa — Architecture Documentation Set

Generate a complete, executive-grade documentation bundle in `/.lovable/` describing the **target production architecture** (React 19 + FastAPI + Celery + Redis + Inngest + Cloud SQL + Clerk + GCP). The current Lovable Cloud build is treated as a discarded prototype — docs describe only the new stack.

## Scope

- **Audience**: Senior engineers, ops, security, product, compliance, and onboarding readers.
- **Depth**: Executive (5–10 pages per file, ~40–60 pages total).
- **Style**: Clean Markdown, ASCII diagrams, tables, no emoji, references to Uganda DPPA 2019 + Kenya DPA 2019.
- **No code changes**: this phase only writes `.md` files. Existing app code is untouched.

## Files to create under `/.lovable/`

### Core docs (the 8 you requested)

```
.lovable/
├── techstack.md            Stack inventory, versions, rationale, cost notes
├── PRD.md                  Product Requirements: vision, personas, user stories, KPIs, scope
├── Architecture.md         System architecture, C4 context+container diagrams, data flow
├── Plan.md                 Delivery plan: milestones, owners, dependencies, risks
├── phases.md               Phased rollout: MVP → Beta → GA → Pan-African expansion
├── workflow.md             Dev workflow: branching, PR, CI/CD, code review, release trains
├── Onboarding_flow.md      Customer + Partner onboarding journeys (sequence diagrams)
└── Admin.md                Admin command center: roles, screens, permissions matrix
```

### Additional Senior-Architect deliverables

```
.lovable/
├── Security.md             Threat model (STRIDE), RBAC, secrets, key rotation, audit
├── Compliance.md           Uganda DPPA 2019, Kenya DPA 2019, KYC, consumer credit, DSR flow
├── DataModel.md            ERD, table dictionary, retention, PII classification
├── API.md                  REST contract sketch (OpenAPI-style), versioning, errors
├── Runbook.md              Incident response, on-call, common ops, DR/backup
├── Testing.md              Pyramid: pytest unit/integration, Playwright E2E, load
├── Observability.md        Logs (Cloud Logging), metrics, traces, SLOs, alerts
└── adr/
    ├── ADR-0001-fastapi-over-django.md
    ├── ADR-0002-celery-and-inngest-split.md
    ├── ADR-0003-clerk-auth-frontend-only.md
    ├── ADR-0004-cloud-sql-postgres.md
    ├── ADR-0005-vercel-frontend-gcloud-backend.md
    ├── ADR-0006-locker-io-secrets.md
    └── ADR-0007-whatsapp-business-as-channel.md
```

## Stack documented (per your request)

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TanStack Router/Query, Tailwind |
| Frontend hosting | Vercel (primary) + cPanel (legacy/static fallback) |
| Auth | Clerk (frontend SDK only — incompatible with SSR per Lovable docs noted) |
| API | FastAPI (Python 3.12) on Google Cloud Run |
| Async jobs | Celery + Redis (broker/result) for in-flight tasks |
| Workflow orchestration | Inngest for durable, scheduled, retry-safe flows (lead routing, partner payouts, repayment reminders) |
| Database | Cloud SQL for PostgreSQL 16 (Private IP, IAM auth, automated backups) |
| Cache / queue | Redis (Memorystore) |
| Secrets | Google Secret Manager (runtime) + GitHub Secrets (CI) + Locker.io (team password vault) |
| Maps / geo | Google Maps API (Places + Geocoding for partner/customer location) |
| Messaging | WhatsApp Business Cloud API (lead handoff to +254 727 291 121, templated outbound) |
| Testing | Pytest, Playwright (E2E), k6 (load) |
| CI/CD | GitHub Actions → Cloud Build → Cloud Run; Vercel for frontend |
| Observability | Google Cloud Logging + Monitoring; Sentry for FE/BE errors |

## Key documentation contents (highlights)

### Architecture.md — system diagram

```text
                ┌────────────────────────┐
                │  Customer / Partner    │
                │  (Web + WhatsApp)      │
                └────────────┬───────────┘
                             │
               ┌─────────────▼─────────────┐
               │  React 19 SPA on Vercel   │
               │  Clerk SDK (frontend)     │
               └─────────────┬─────────────┘
                             │ HTTPS / JWT (Clerk)
               ┌─────────────▼─────────────┐
               │  FastAPI on Cloud Run     │
               │  - REST endpoints         │
               │  - Clerk JWT verification │
               │  - RBAC middleware        │
               └──┬───────────┬─────────┬──┘
                  │           │         │
       ┌──────────▼──┐  ┌─────▼────┐  ┌─▼──────────────┐
       │ Cloud SQL   │  │ Redis    │  │ Inngest Cloud  │
       │ Postgres 16 │  │ +Celery  │  │ (durable wfs)  │
       └─────────────┘  └─────┬────┘  └─┬──────────────┘
                              │         │
                       ┌──────▼─────────▼──────┐
                       │ External integrations │
                       │ - WhatsApp Business   │
                       │ - Google Maps         │
                       │ - MoMo / Airtel (lead)│
                       └───────────────────────┘
```

### Onboarding_flow.md — two journeys with sequence diagrams

1. **Customer "Buy on Credit"**: browse → select device → eligibility quiz (5–25% tier) → geolocation → DPPA consent → lead persisted → WhatsApp handoff.
2. **Sales Partner**: pitch → application (geo + TIN + MoMo merchant code) → agreement v1.0 e-sign → admin approval → POS kit dispatched → first sale.

### Admin.md — RBAC matrix

| Capability | admin_owner | developer | analyst | marketer |
|---|---|---|---|---|
| Manage users & roles | ✓ | | | |
| Products CRUD | ✓ | ✓ | | |
| Leads view | ✓ | ✓ | ✓ | ✓ |
| Leads edit/assign | ✓ | | ✓ | ✓ |
| Approve partners | ✓ | | ✓ | |
| System diagnostics | ✓ | ✓ | | |
| Analytics dashboards | ✓ | ✓ | ✓ | ✓ |

### phases.md — delivery roadmap

- **Phase 0 (Now)**: Lovable prototype validated.
- **Phase 1 (MVP, 6 wks)**: FastAPI + Cloud SQL + Clerk + WhatsApp inbound; Uganda only.
- **Phase 2 (Beta, 8 wks)**: Celery+Redis+Inngest, partner agreements, MoMo deposit tracking.
- **Phase 3 (GA, 12 wks)**: Repayment scheduler, collections, analytics, Kenya rollout.
- **Phase 4**: Tanzania + Rwanda, native mobile companion.

### Compliance.md — Uganda + Kenya specifics

- Uganda **Data Protection and Privacy Act 2019** + Personal Data Protection Office registration.
- Kenya **Data Protection Act 2019** + ODPC notification.
- Named DPO, DSR portal, breach notification SLAs (72h Uganda / 72h Kenya).
- Consumer credit disclosure standards, APR transparency, complaints register.

### Security.md — highlights

- STRIDE per component, JWT validation pipeline, Cloud SQL IAM auth, VPC SC.
- Secrets: GSM (runtime), GitHub Secrets (CI), Locker.io (humans). Rotation cadence table.
- Audit log: append-only `audit_events` table, retention 7 years.

### Out of scope for this phase

- No code changes, no infrastructure provisioning, no Terraform.
- No migration scripts from Lovable Cloud → Cloud SQL (covered as a future ADR).
- Real legal text remains placeholder; each legal doc carries a "review with East African counsel before launch" notice.

