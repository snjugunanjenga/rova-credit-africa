# RovaCredit Africa — Phased Rollout

**Status:** v1.0
**Owner:** Product + Engineering
**Last updated:** 2026-04-24

---

## Phase 0 — Discovery (complete)

Lovable prototype validated marketplace UX, eligibility quiz, partner agreement and WhatsApp handoff.

## Phase 1 — MVP (Weeks 1–6)

**Goal:** Take real Ugandan customer leads and route them to a pilot partner.

**Scope:**
- React 19 SPA on Vercel
- FastAPI on Cloud Run + Cloud SQL Postgres
- Clerk auth (frontend only)
- Marketplace + lead capture (eligibility tiers A–E)
- WhatsApp inbound webhook + receipt template
- Admin: products CRUD, leads list, role grants
- Geolocation via Google Maps Geocoding

**Success:** 100 leads / week, 1 active partner, manual deposit reconciliation.

## Phase 2 — Beta (Weeks 7–14)

**Goal:** Scale to 25 partners; introduce automation.

**Scope:**
- Celery worker for WhatsApp send + retries
- Inngest workflows: lead routing, partner SLA timer, repayment reminders
- Partner self-onboarding + e-sign agreement v1.0
- DSR (data subject request) portal
- Sentry, Cloud Logging dashboards, SLO alerts
- Admin: leads pipeline, partner approvals, exports, audit log

**Success:** 1,500 leads/mo, 25 partners, < 24h application → handover.

## Phase 3 — General Availability (Weeks 15–28)

**Goal:** National Uganda rollout + Kenya pilot.

**Scope:**
- Repayment scheduler (read-only → outbound reminders)
- CRB Uganda + Metropol Kenya credit reporting (Phase 3 stretch)
- KES support, M-Pesa partner deposit codes
- Read replica for analytics
- A/B testing framework on marketplace

**Success:** 8,000 active customers, 250 partners, ≥ 92% 30-day repayment rate.

## Phase 4 — Pan-African expansion (Months 7–12)

**Goal:** Tanzania + Rwanda + native mobile.

**Scope:**
- Multi-currency wallet
- React Native companion (customer + partner POS)
- Live MoMo collection API integration
- Regional underwriting models per country
- 24/7 NOC + on-call rotation

## Cross-phase posture

| Posture | MVP | Beta | GA | Expansion |
|---|---|---|---|---|
| Availability | 99.0% | 99.5% | 99.9% | 99.95% |
| On-call | Best-effort | Business hours | 24/5 | 24/7 |
| Backups | Daily | Daily + PITR | PITR + cross-region | + tested DR drill quarterly |
| Compliance | DPPA opt-in | DPPA + DPA registered | + ISO 27001 path | + PCI-DSS scope review |
