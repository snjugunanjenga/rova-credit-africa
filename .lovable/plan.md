
# RovaCredit — Lead Capture, Geolocation, Recommendations & Partner Program

Building on the existing footer, marketplace and admin. Footer pages already exist (`/legal/*`, `/about`, `/partners`, `/contact`); this phase wires up the conversion flow and the partner agreement program.

## 1. "Buy on Credit" everywhere on the marketplace

- **ProductCard**: add a prominent **"Buy on Credit"** button at the bottom of every card (in addition to the card linking to the detail page). Clicking it opens the lead modal **without leaving the marketplace**.
- **Product detail page**: keep existing "Buy on Credit" + add a **"View full specs"** accordion (RAM, storage, battery, camera, network, screen, OS, warranty) populated from `products.specs` plus a new `specifications` JSONB column.
- **Specs schema upgrade** — add `specifications jsonb` (key/value detailed specs) to `products`; admin Products CRUD gets a small key/value editor. Existing 48 seeded products stay valid (column nullable).

## 2. Lead form upgrade — geolocation + eligibility + richer WhatsApp handoff

Upgrade `LeadModal` (used by card + detail page):

- **Location detector**: on modal open, request `navigator.geolocation`. If granted, capture `{lat, lng}` and reverse-geocode via free **OpenStreetMap Nominatim** (no key needed) to get a human-readable area (e.g. "Kampala, Central Region"). User can also type their area manually if they decline.
- **Eligibility mini-quiz** (3 quick fields): monthly income (UGX), employment type (Salaried / Self-employed / Boda / Student / Farmer), preferred repayment cadence (Daily / Weekly / Monthly).
- **Live eligibility calculator** (client-side, transparent): scores into 5 tiers and shows the user their estimated **down payment % (5% – 25%)** for the selected device before they submit.

  Tier logic (illustrative):
  ```
  Score = income_band(0-3) + employment_band(0-2) + cadence_band(0-1)
  Tier A (5%)  : score ≥ 5  → low risk
  Tier B (10%) : score = 4
  Tier C (15%) : score = 3
  Tier D (20%) : score = 2
  Tier E (25%) : score ≤ 1  → higher risk
  ```
  Repayment plan = `(asset_price - down_payment) / weeks` over up to **52 weeks**, plus configurable interest/fees shown as a transparent breakdown.

- **Submit** writes a richer row into `leads`:
  - existing fields, plus `latitude`, `longitude`, `location_label`, `eligibility_tier`, `eligibility_down_payment_pct`, `computed_down_payment`, `repayment_cadence`, `employment_type`.
- **WhatsApp handoff**: after insert, auto-open WhatsApp to **+254 727 291 121** with a pre-filled introductory message:

  > Hello RovaCredit Africa 👋
  > I'd like to apply for the **Samsung Galaxy A15 (128GB/4GB)**.
  > Name: Namugga Christine
  > Phone: +256 7XX XXX XXX
  > Location: Ntinda, Kampala (0.3476, 32.6126)
  > Income band: UGX 300k–600k · Self-employed · Weekly repayments
  > Eligibility tier: B → estimated 10% down (UGX 48,000)
  > Lead ref: RC-7F3A
  > I consent to processing per Uganda DPPA 2019 / Kenya DPA 2019.

  Lead reference (`RC-XXXX`) is generated from the new lead's UUID so ops can trace it.

## 3. Recommendation engine on product detail page

- New "**You may also like**" rail at the bottom of `/marketplace/$id` showing 4–6 similar products.
- Similarity rules (no ML — deterministic SQL):
  1. Same `category` first
  2. Then same `brand`
  3. Then `asset_price` within ±25% of current product
  4. Exclude current product, sort by `sort_order`
- Implemented as a single Supabase query in a `useQuery` keyed by product id.

## 4. Homepage refresh — new commercial story

- New **"How it works"** strip (4 steps): Browse → Apply (eligibility check) → Pay deposit via MoMo → Get your phone, repay weekly/daily.
- New **"Eligibility-based down payment 5–25%"** banner with a tier explainer.
- New **"Become a sales partner"** section right under the partner CTA showing the partner economics:
  - You receive your **full processing fee on the spot**
  - You collect the customer **deposit via MoMo**
  - We handle credit, recovery, and customer support
  - 1-year repayment plans, daily or weekly
- Keep existing testimonials & Why-RovaCredit pillars.

## 5. Partner program — agreement & onboarding

Upgrade `/partners` from a single intake form into a 3-step flow:

- **Step 1 — Pitch & economics**: revenue split, payout flow, MoMo deposit collection, exclusive territory option, training & POS materials.
- **Step 2 — Application form**: existing fields + business location (geolocation prefilled), TIN/registration number, average foot traffic, owner's national ID number, MoMo merchant code (optional).
- **Step 3 — Partner Agreement**: scrollable agreement text in a card with checkbox "I have read and agree to the RovaCredit Sales Partner Agreement." Signature capture = typed full name + date acknowledged. On submit, lead row stores `agreement_accepted_at`, `agreement_version = "v1.0"`, `agreement_signatory_name`.
- New route **`/legal/partner-agreement`** with full agreement text (template, with reviewable-by-counsel notice).
- Footer gets a new link under **Corporate** → "Sales Partner Agreement".
- Admin **Leads** view gains a **"Partner applications"** filter showing only `source='partner'`, with agreement status column and a "View agreement snapshot" drawer.

## 6. Database changes (one migration)

```
ALTER TABLE products ADD COLUMN specifications jsonb;

ALTER TABLE leads
  ADD COLUMN latitude double precision,
  ADD COLUMN longitude double precision,
  ADD COLUMN location_label text,
  ADD COLUMN eligibility_tier text,
  ADD COLUMN eligibility_down_payment_pct numeric,
  ADD COLUMN computed_down_payment numeric,
  ADD COLUMN repayment_cadence text,
  ADD COLUMN employment_type text,
  ADD COLUMN agreement_version text,
  ADD COLUMN agreement_accepted_at timestamptz,
  ADD COLUMN agreement_signatory_name text,
  ADD COLUMN lead_ref text GENERATED ALWAYS AS ('RC-' || upper(substr(id::text,1,4))) STORED;
```

RLS policies unchanged (insert remains public for `leads`; reads stay role-gated).

## 7. Files touched

```
src/components/site/ProductCard.tsx          → add "Buy on Credit" button + onApply prop
src/components/site/LeadModal.tsx            → geolocation, eligibility quiz, richer WhatsApp message
src/components/site/PartnerAgreement.tsx     → NEW agreement card used in /partners step 3
src/lib/eligibility.ts                       → NEW pure scoring + down-payment calc
src/lib/geolocation.ts                       → NEW navigator.geolocation + Nominatim helper
src/routes/marketplace.tsx                   → wire card "Buy on Credit" to a single LeadModal instance
src/routes/marketplace.$id.tsx               → recommendations rail + detailed specs accordion
src/routes/index.tsx                         → "How it works", eligibility banner, partner economics
src/routes/partners.tsx                      → 3-step flow with agreement
src/routes/legal.partner-agreement.tsx       → NEW agreement page
src/routes/legal.tsx                         → add agreement link
src/components/site/Footer.tsx               → add "Sales Partner Agreement" link
src/routes/admin.leads.tsx                   → location, tier, agreement columns + partner filter
src/routes/admin.products.tsx                → simple key/value editor for `specifications`
supabase/migrations/<timestamp>_leads_eligibility.sql
```

## 8. Out of scope (this phase)

- Real KYC / national ID verification (we capture, don't verify).
- Live MoMo collection API (deposit collection is described and tracked, not auto-charged — partner collects via their MoMo merchant line).
- E-signature legal binding (typed-name acknowledgement only; "review with counsel before launch" notice stays).
- Partner payouts dashboard (this phase ends at agreement acceptance & lead capture; payout reconciliation is a follow-up).
