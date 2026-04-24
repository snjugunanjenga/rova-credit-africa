# RovaCredit Africa — Tech Stack

**Status:** Target production architecture (v1.0)
**Owner:** Engineering
**Last updated:** 2026-04-24

---

## 1. Stack at a glance

| Layer | Technology | Version | Hosting |
|---|---|---|---|
| Frontend | React 19 + Vite 7 + TanStack Router/Query | 19.x | Vercel (primary), cPanel (static fallback) |
| Styling | Tailwind CSS 4 | 4.x | — |
| Auth | Clerk (frontend SDK only) | latest | Clerk Cloud |
| API | FastAPI (Python 3.12) | 0.115+ | Google Cloud Run |
| Async tasks | Celery + Redis broker | 5.4 / 7.x | Cloud Run worker + Memorystore Redis |
| Workflows | Inngest (durable, scheduled, retry-safe) | latest | Inngest Cloud |
| Database | Cloud SQL for PostgreSQL | 16 | GCP (Private IP, IAM auth) |
| Cache / queue | Redis (Memorystore) | 7.x | GCP |
| Secrets — runtime | Google Secret Manager | — | GCP |
| Secrets — CI | GitHub Secrets / OIDC | — | GitHub |
| Secrets — humans | Locker.io vault | — | SaaS |
| Geocoding | Google Maps API (Places + Geocoding) | — | Google |
| Messaging | WhatsApp Business Cloud API | v19+ | Meta |
| E2E testing | Playwright | latest | GitHub Actions |
| Unit / integration | pytest, vitest | latest | GitHub Actions |
| CI/CD | GitHub Actions → Cloud Build | — | — |
| Observability | Cloud Logging, Cloud Monitoring, Sentry | — | GCP / Sentry |

---

## 2. Why this stack

**FastAPI** — async-first, OpenAPI auto-generation, Pydantic v2 validation. Best fit for high-throughput lead and repayment APIs in a small Python team.

**Celery + Redis** — battle-tested for in-flight worker tasks (WhatsApp send, MoMo polling, document generation). Redis doubles as cache.

**Inngest** — durable orchestration for multi-step flows that span hours/days (eligibility → deposit collection → device handover → repayment schedule). Replaces home-grown cron + state machines.

**Cloud SQL Postgres 16** — managed, regional HA, automated backups, IAM auth, Private IP, point-in-time recovery. Compatible with our SQL-first data model.

**Clerk (frontend only)** — fast user setup, social auth, MFA out of the box. Backend verifies Clerk-issued JWTs via JWKS — no Clerk server SDK on the API.

**Vercel + Cloud Run** — split deployment: SPA on Vercel edge, Python API on Cloud Run with min-instances=1 for low cold-start. cPanel kept only for marketing/static fallback if Vercel is unavailable.

**WhatsApp Business Cloud API** — primary customer channel in East Africa. Sends templated outbound (lead receipts, repayment reminders); receives inbound via webhook.

**Google Maps API** — Places autocomplete (partner addresses), Geocoding (customer location capture), Distance Matrix (territory routing).

**Locker.io** — open-source self-hostable team password vault for human-held credentials (admin consoles, vendor logins). Distinct from runtime secrets.

---

## 3. Environments

| Env | Frontend | API | DB | Notes |
|---|---|---|---|---|
| local | Vite dev server | uvicorn --reload | Docker postgres | Seeded fixtures |
| dev | Vercel preview | Cloud Run dev service | Cloud SQL dev instance | Auto-deploy from `main` |
| staging | Vercel staging | Cloud Run staging | Cloud SQL staging | Manual promote |
| prod | Vercel prod | Cloud Run prod | Cloud SQL prod (HA) | Tagged release only |

---

## 4. Cost shape (order-of-magnitude, monthly USD)

| Item | MVP | GA |
|---|---:|---:|
| Vercel | 20 | 150 |
| Cloud Run (FastAPI + Celery worker) | 30 | 250 |
| Cloud SQL Postgres (db-g1-small → db-custom-2-7680) | 50 | 350 |
| Memorystore Redis | 40 | 120 |
| Inngest | 0 (free) | 100 |
| Clerk | 0 (free) | 100 |
| WhatsApp conversations | 50 | 600 |
| Google Maps | 20 | 150 |
| Sentry | 26 | 80 |
| Locker.io | 0 (self-host) | 0 |
| **Total** | **~240** | **~1,900** |

---

## 5. Versioning policy

- Frontend: SemVer; tagged releases mirror Vercel deployments.
- API: URL-versioned (`/v1/…`); breaking changes require `/v2/…`.
- Database: forward-only migrations via Alembic. No destructive migration without a paired backfill plan.

---

## 6. Out of stack (deliberately rejected)

- Django — too heavy for our async-first, OpenAPI-driven API surface.
- Supabase / Firebase — replaced by Cloud SQL + FastAPI for full control over compliance posture.
- Kubernetes / GKE — Cloud Run is sufficient at expected scale.
- Self-hosted Clerk equivalent — buy beats build for auth.
