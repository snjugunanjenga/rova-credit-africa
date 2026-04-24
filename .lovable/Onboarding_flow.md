# RovaCredit Africa — Onboarding Flows

**Status:** v1.0
**Owner:** Product
**Last updated:** 2026-04-24

---

## 1. Customer onboarding — "Buy on Credit"

### 1.1 Happy path (sequence)

```text
Customer        SPA              FastAPI         Cloud SQL    Inngest      WhatsApp     Partner
   │              │                 │                │            │            │           │
   │ visits /     │                 │                │            │            │           │
   ├─────────────►│                 │                │            │            │           │
   │              │ GET /v1/products│                │            │            │           │
   │              ├────────────────►│                │            │            │           │
   │              │                 │ SELECT         │            │            │           │
   │              │                 ├───────────────►│            │            │           │
   │              │◄────────────────┤                │            │            │           │
   │              │                 │                │            │            │           │
   │ tap "Buy on Credit"            │                │            │            │           │
   ├─────────────►│                 │                │            │            │           │
   │              │ open LeadModal  │                │            │            │           │
   │              │ getCurrentPosition (Maps geocode)│            │            │           │
   │ income/job/cadence + consent   │                │            │            │           │
   ├─────────────►│ compute eligibility (preview)    │            │            │           │
   │              │                 │                │            │            │           │
   │              │ POST /v1/leads  │                │            │            │           │
   │              ├────────────────►│ validate       │            │            │           │
   │              │                 │ persist lead   │            │            │           │
   │              │                 ├───────────────►│            │            │           │
   │              │                 │ emit event     │            │            │           │
   │              │                 ├──────────────────────────►──┤            │           │
   │              │                 │ enqueue celery: send_receipt│            │           │
   │              │                 │                │            ├───────────►│           │
   │              │                 │                │            │            │ template  │
   │              │                 │                │            │            ├──────────►│
   │              │◄────────────────┤ 200 lead_ref   │            │            │           │
   │              │ open WhatsApp deep link to ops    │           │            │           │
   │              │                 │                │ inngest 24h timer       │           │
   │              │                 │                │            ├───────────►│  follow-up│
   │              │                 │                │            │            ├──────────►│
```

### 1.2 Steps the user sees

1. **Browse marketplace** — filters by brand, budget, category.
2. **Open device detail** — specs accordion, recommendations rail.
3. **Tap "Buy on Credit"** — modal opens.
4. **Allow location** (or type area manually).
5. **Eligibility quiz** — income band, employment, repayment cadence.
6. **See live preview** — Tier A/B/C/D/E with deposit %.
7. **Provide name + phone**.
8. **Tick consent** — Uganda DPPA / Kenya DPA.
9. **Submit** — server returns `lead_ref` `RC-XXXX`.
10. **WhatsApp opens** — pre-filled message to RovaCredit ops.
11. **Receipt arrives** via WhatsApp template within 60s.
12. **Partner contacts** customer; deposit collected via MoMo; device handed over.

### 1.3 Edge cases

| Case | Behaviour |
|---|---|
| Geolocation denied | Show free-text area field; no lat/lng stored |
| WhatsApp not installed | Show fallback SMS link + copyable text |
| Duplicate phone within 24h | Server returns same `lead_ref`; no duplicate row |
| Eligibility = E (starter) | Show transparent explainer; allow proceed |
| Consent unticked | Submit disabled |

---

## 2. Partner onboarding

### 2.1 Three-step flow

```text
Step 1: Pitch & economics       (read)
   │
   ▼
Step 2: Application form        (capture)
   │   - business name, TIN, MoMo merchant code
   │   - geolocated business address (Maps Places)
   │   - owner ID number, foot traffic estimate
   ▼
Step 3: Sales Partner Agreement (e-sign)
   │   - scrollable terms (legal/partner-agreement v1.0)
   │   - typed full name + checkbox + timestamp
   │   - persisted: agreement_version, accepted_at, signatory_name
   ▼
Submit ─► server creates lead source='partner' status='pending_review'
       └► Inngest workflow: partner.onboarding
            ├─ ops review (human step, SLA 48h)
            ├─ approval → POS kit dispatch task
            ├─ training WhatsApp message
            └─ partner role granted in Clerk + user_roles
```

### 2.2 Approval criteria

- Valid Uganda Registration Services Bureau (URSB) number or Kenya BRS.
- Active MoMo / Airtel merchant code OR willingness to register one.
- Physical premises confirmed (geolocation + photo upload).
- Owner national ID provided (stored encrypted; never displayed in admin list view).

### 2.3 Post-approval

- Welcome WhatsApp message with portal link.
- First sale within 14 days targeted; otherwise re-engagement workflow fires.
- Monthly partner statement emailed (PDF) with payouts and pending leads.

---

## 3. Admin staff onboarding

1. Admin owner invites via Clerk dashboard email.
2. New user signs in once → row mirrored into `profiles`.
3. Admin owner assigns role from `user_roles` (admin_owner / developer / analyst / marketer).
4. Mandatory: review `Compliance.md` and sign DPO acknowledgement.
