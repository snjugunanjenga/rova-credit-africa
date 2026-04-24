# RovaCredit Africa — Product Requirements Document (PRD)

**Status:** v1.0 (target)
**Owner:** Product
**Last updated:** 2026-04-24

---

## 1. Vision

Make a smartphone the most affordable productivity tool in East Africa by financing devices through small, mobile-money-collected installments — starting in Uganda and expanding across the region.

## 2. Mission

Originate, underwrite, and service device-financing for underbanked customers via a marketplace + sales-partner network, with WhatsApp as the primary customer channel.

## 3. Markets

- **Phase 1**: Uganda (primary). Currency UGX. MTN MoMo + Airtel Money.
- **Phase 2**: Kenya. KES. M-Pesa + Airtel Money.
- **Phase 3**: Tanzania, Rwanda.

## 4. Personas

| Persona | Description | Primary need |
|---|---|---|
| **Christine, the boda rider** (Kampala, 26) | UGX 350k/mo, no credit history | Affordable phone with weekly mobile-money payments |
| **Joseph, the salaried teacher** (Mbarara, 34) | UGX 800k/mo, NSSF member | Mid-range phone, monthly deductions |
| **Namaganda, the SME shop owner** (Jinja, 42) | Sells phones, wants more inventory turnover | Become a sales partner; earn commission, no credit risk |
| **Operations Analyst** (HQ) | Reviews leads, tracks collections | Single dashboard, WhatsApp follow-up tools |
| **Admin Owner** | Founder | Full control, audit trail, financial reporting |

## 5. User stories (top 12)

1. As a customer, I can browse devices filtered by brand/budget so I can pick what I want.
2. As a customer, I can take a 30-second eligibility quiz so I see my deposit (5–25%) before applying.
3. As a customer, I can apply with phone + location so the partner finds me quickly.
4. As a customer, I receive a WhatsApp confirmation with my lead reference within 60 seconds.
5. As a customer, I can pay my deposit via MoMo to a partner and walk out with the device.
6. As a customer, I receive WhatsApp reminders 24h before each installment is due.
7. As a partner, I can apply online, sign the agreement electronically, and onboard in <72 hours.
8. As a partner, I see all my originated leads and their collection status.
9. As an analyst, I can filter leads by tier, location, partner and export CSV.
10. As an analyst, I can mark a lead as Contacted / Approved / Disbursed / Defaulted.
11. As an admin owner, I can grant/revoke roles and see a full audit trail.
12. As a customer, I can request my data or its deletion (Uganda DPPA / Kenya DPA right).

## 6. Success metrics (12-month targets)

| Metric | Target |
|---|---:|
| Monthly active customers | 8,000 |
| Active sales partners | 250 |
| Lead → disbursement conversion | 22% |
| 30-day repayment rate | ≥ 92% |
| Time from application → device handover | < 24h median |
| WhatsApp response SLA | < 5 min business hours |
| NPS (customer) | ≥ 45 |
| Cost per acquired customer | < USD 6 |

## 7. In scope (v1)

- Public marketplace + product detail
- Eligibility quiz + lead capture + geolocation
- Partner onboarding + e-sign agreement
- Admin command center (products, leads, partners, users, analytics)
- WhatsApp inbound webhook + outbound templates
- Repayment schedule generation (read-only initial)
- DPPA/DPA-compliant consent and DSR portal

## 8. Out of scope (v1)

- Live MoMo collections API (manual partner-collected deposit)
- Credit bureau reporting (CRB Uganda, Metropol Kenya — Phase 2)
- Native mobile apps (Phase 3)
- Multi-currency wallet (Phase 3)
- AI-driven underwriting (use deterministic tiers only)

## 9. Constraints

- Uganda DPPA 2019 + Kenya DPA 2019 compliance from day one.
- All customer data resides in `europe-west1` (closest GCP region with full service availability) until an Africa region is selected.
- WhatsApp templates must be Meta-approved before send.
- No legal text ships without East African counsel review.

## 10. Key risks

| Risk | Mitigation |
|---|---|
| Default rate exceeds 8% | Conservative tier ladder, partner skin-in-the-game via deposit collection |
| WhatsApp template rejection | Maintain 3 fallback templates per use case |
| Cloud SQL cost overrun | Right-sized instance, query review weekly, read replica before vertical scale |
| Partner fraud (fake leads) | Geolocation cross-check, deposit-must-clear before payout |
| Regulatory change | Monthly compliance review with counsel |
