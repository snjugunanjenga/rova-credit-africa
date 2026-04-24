# RovaCredit Africa — Architecture

**Status:** Target v1.0
**Owner:** Engineering / Architecture
**Last updated:** 2026-04-24

---

## 1. C4 Context

```text
                  +-----------------------------+
                  |   Customer (Web + WhatsApp) |
                  +--------------+--------------+
                                 |
                  +--------------v--------------+      +-------------------+
                  |   Sales Partner (Web)       |----->|   Admin Staff     |
                  +--------------+--------------+      +---------+---------+
                                 |                              |
                                 v                              v
                  +-------------------------------------------------+
                  |              RovaCredit Platform                |
                  +-------------------------------------------------+
                                 |
        +------------------------+------------------------+
        |             |              |              |     |
        v             v              v              v     v
  +---------+   +---------+   +-----------+  +--------+  +---------+
  | Clerk   |   | WhatsApp|   | Google    |  | MoMo / |  | Cloud   |
  | Auth    |   | Business|   | Maps      |  | Airtel |  | SQL     |
  +---------+   +---------+   +-----------+  | (manual|  +---------+
                                             |  v1)   |
                                             +--------+
```

## 2. C4 Container

```text
  +--------------------------------------------------------------+
  |                       VERCEL EDGE                            |
  |   +------------------------------------------------------+   |
  |   |  React 19 SPA  (TanStack Router/Query, Tailwind)     |   |
  |   |  Clerk JS SDK                                        |   |
  |   +-------+----------------------------------+-----------+   |
  +-----------|----------------------------------|---------------+
              | HTTPS + Bearer JWT (Clerk JWKS)  |
              v                                  v
  +------------------------+         +-------------------------+
  |  GOOGLE CLOUD RUN      |         |  INNGEST CLOUD          |
  |  +------------------+  |         |  Durable workflows:     |
  |  | FastAPI (api)    |--+-------->|  - lead.routing         |
  |  | uvicorn workers  |  | webhook |  - partner.onboarding   |
  |  +---+----------+---+  |         |  - repayment.reminder   |
  |      |          |      |         |  - dsr.fulfillment      |
  |  +---v---+  +---v---+  |         +-------------------------+
  |  |Celery |  |Celery |  |
  |  |worker |  | beat  |  |
  |  +---+---+  +---+---+  |
  +------|----------|------+
         |          |
         v          v
  +-----------+  +-----------+         +---------------------+
  | Memory-   |  | Cloud SQL |<------->| Secret Manager      |
  | store     |  | Postgres16|         | (DB pwd, JWKS,      |
  | Redis     |  | Private IP|         |  WA token, MoMo key)|
  +-----------+  +-----------+         +---------------------+
                       ^
                       | private VPC
                       |
              +--------+--------+
              | Cloud Build CI  |
              | (GitHub OIDC)   |
              +-----------------+
```

## 3. Request flow — "Buy on credit"

```text
Customer (browser)
  │
  │ 1. POST /v1/leads  (Clerk JWT optional for guest)
  ▼
Vercel Edge ── 2. forward ──► Cloud Run FastAPI
                                    │
                                    │ 3. validate (Pydantic)
                                    │ 4. compute eligibility (server-side)
                                    │ 5. INSERT lead (Cloud SQL)
                                    │ 6. ENQUEUE celery: send_whatsapp_receipt
                                    │ 7. EMIT inngest event: lead.created
                                    │
                                    └─ 200 { lead_ref: "RC-7F3A", tier: "B" }

Background:
  Celery  ──► WhatsApp Business API ──► customer phone
  Inngest ──► step 1: notify partner
           ──► step 2 (24h delay): if no contact, escalate to ops
           ──► step 3 (72h delay): if no deposit, mark stale
```

## 4. Data flow zones

| Zone | Purpose | Example components |
|---|---|---|
| **Edge** | Public, anonymous traffic | Vercel SPA, marketing pages, marketplace browse |
| **API** | Authenticated business logic | Cloud Run FastAPI + Clerk JWT verification |
| **Workers** | Async + durable | Celery, Inngest |
| **Data** | Persisted state | Cloud SQL, Redis cache |
| **Integrations** | External I/O | WhatsApp, Maps, MoMo (future) |

## 5. Key non-functional requirements

| NFR | Target |
|---|---|
| API p95 latency | < 250 ms |
| API availability | 99.5% (MVP) → 99.9% (GA) |
| Recovery Point Objective (RPO) | ≤ 5 min |
| Recovery Time Objective (RTO) | ≤ 1 hour |
| Concurrent users supported | 5,000 (GA) |
| Data residency | europe-west1 (until Africa region selected) |

## 6. Security boundaries

- All API traffic terminates TLS at Cloud Run; no public DB.
- Cloud SQL is **Private IP only**; access via Serverless VPC Connector.
- Clerk JWT validated on every request via cached JWKS (5-min TTL).
- RBAC enforced by FastAPI dependency `require_role(...)`.
- Secrets fetched once at boot from Secret Manager; never in env files.

## 7. Technology decision summary

See `adr/ADR-*.md` for each major decision.
