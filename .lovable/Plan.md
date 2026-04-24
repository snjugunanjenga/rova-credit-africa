# RovaCredit Africa — Delivery Plan

**Status:** v1.0 (target architecture)
**Owner:** Engineering Lead
**Last updated:** 2026-04-24

---

## 1. Milestones

| # | Milestone | Duration | Exit criteria |
|---|---|---|---|
| M0 | Architecture sign-off | 1 wk | All ADRs accepted |
| M1 | GCP foundation provisioned | 2 wks | Cloud SQL + VPC + Secret Manager + Cloud Run live |
| M2 | FastAPI skeleton + Clerk JWT | 2 wks | `/v1/health` + `/v1/me` pass auth e2e |
| M3 | Marketplace + lead capture | 3 wks | Customer can submit lead, WhatsApp receipt sent |
| M4 | Partner onboarding + e-sign | 2 wks | Partner self-serve to "approved" |
| M5 | Admin command center | 3 wks | Roles, leads pipeline, products CRUD |
| M6 | Inngest workflows | 2 wks | Lead routing + repayment reminders running |
| M7 | Hardening + DPPA/DPA review | 2 wks | Pen test passed, DSR portal live |
| M8 | Uganda soft launch | 1 wk | 10 partners, 100 leads, < 5 incidents |

Total: ~18 weeks to soft launch.

## 2. Workstreams

| Workstream | Lead | Members |
|---|---|---|
| Frontend | FE Lead | 2 engineers |
| Backend (API + workers) | BE Lead | 2 engineers |
| Infra / SRE | SRE | 1 engineer |
| Data / Analytics | Analyst | 1 |
| Product | PM | 1 |
| Compliance / Legal | DPO | 1 (fractional) + counsel |
| Design | Design Lead | 1 |

## 3. Dependency map

```text
M1 (infra) ──► M2 (API skeleton) ──► M3 (marketplace) ──► M5 (admin)
                       │                       │
                       └──► M4 (partner)       └──► M6 (workflows)
                                                            │
                                                            └──► M7 ──► M8
```

## 4. Top risks + mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Clerk SSR incompatibility re-emerges | Medium | Frontend-only Clerk SDK; backend verifies JWT via JWKS |
| WhatsApp template approval slow | High | Submit 3 templates in M2, parallel to API build |
| Cloud SQL Private IP misconfig blocks dev | Medium | Bastion host + IAM auth tested in M1 |
| Partner KYC manual bottleneck | Medium | Inngest human-in-the-loop step with SLA timer |
| Defaults exceed plan | High | Conservative tier ladder; partner deposit collection |

## 5. Acceptance gates

Each milestone exits only when:
1. All P0 user stories pass Playwright E2E.
2. Code coverage ≥ 70% (backend), ≥ 60% (frontend).
3. No open `Critical` Sentry issues.
4. Runbook updated for any new component.
5. Compliance checklist signed by DPO.

## 6. Budget envelope (engineering, 18 wks)

| Item | Cost (USD) |
|---|---:|
| Engineering salaries (loaded) | 270,000 |
| Cloud (GCP + Vercel + SaaS) MVP run-rate | 4,000 |
| Legal review (UG + KE) | 12,000 |
| Pen test (M7) | 8,000 |
| Contingency (10%) | 29,400 |
| **Total** | **~323,400** |
