
# RovaCredit Africa — Updated Plan (Uganda-First + Footer/Header)

Building on the approved plan, with these additions tailored to your message.

## Header (every public page)
Sticky top nav with:
- **Logo** — RovaCredit Africa (left)
- **Links**: Home · Marketplace · Partners · About · Contact
- **Right side**: WhatsApp icon (+254 727 291 121) · "Sign In" (Clerk)
- Mobile: hamburger drawer with same links

## Footer (every public page)
Four-column layout with Uganda-first compliance & corporate trust signals:

**Column 1 — Corporate**
- About RovaCredit
- Marketplace
- Partner With Us
- Careers
- Press

**Column 2 — Legal & Data Practices** (Uganda + Kenya compliance)
- Privacy Policy *(/legal/privacy)* — references **Uganda Data Protection and Privacy Act 2019** + **Kenya Data Protection Act 2019**
- Data Protection Practices *(/legal/data-practices)* — how we collect, store, share, and let users request/delete their data; named Data Protection Officer
- Terms of Service *(/legal/terms)*
- Cookie Policy *(/legal/cookies)* — with consent banner
- Consumer Credit Disclosure *(/legal/credit-disclosure)*
- Complaints & Dispute Resolution

**Column 3 — Partners & Payments**
- Partner logos/links: **MTN MoMo**, **Airtel Money**, **MTN Uganda**, **Airtel Uganda**
- "Powered by mobile money across Uganda & Kenya"

**Column 4 — Contact**
- Kampala HQ address (placeholder), Nairobi office
- WhatsApp: +254 727 291 121 (click → wa.me)
- Email: hello@rovacredit.africa
- Social: X, LinkedIn, Facebook, Instagram

**Footer bottom strip**
- © 2026 RovaCredit Africa Ltd
- Registered in Uganda · URSB Reg. No. (placeholder)
- **Discreet "Admin" link → `/sign-in`** (admins log in from here)
- Cookie consent reset link

## Corporate landing page (`/about` upgraded to corporate-grade)
- Hero: "Financing Africa's Digital Future, One Device at a Time" with photo of Ugandan customer with smartphone
- **Our Story** — founded in Kampala, expanding across East Africa
- **Mission & Vision**
- **Leadership team** — 4 placeholder Ugandan names with roles + photos:
  - *Nakato Sarah Mukasa* — CEO & Co-founder
  - *Kato David Ssempa* — CTO & Co-founder
  - *Achieng Patricia Namugga* — Head of Partnerships
  - *Okello James Wamala* — Head of Credit Risk
- **Our partners** — logo grid: MTN MoMo, Airtel Money, MTN Uganda, Airtel Uganda, Stanbic Bank Uganda, Centenary Bank
- **Compliance & Trust** — UCC licensed, Bank of Uganda compliant (placeholder), GDPR + Uganda DPPA aligned
- **Coverage map** — Uganda (primary) highlighted; Kenya, Tanzania, Rwanda secondary
- CTA: Partner with us · Browse marketplace

## Uganda-first content adjustments
- **Default currency**: UGX (already in your seed data)
- **Default country in lead form**: Uganda (Kenya, Tanzania, Rwanda also selectable)
- **Imagery**: Use African / Ugandan stock photos throughout — hero, testimonials, about page, marketplace lifestyle shots. Sourced from Unsplash collections featuring African subjects (manually vetted URLs).
- **Mobile money emphasis**: MTN MoMo + Airtel Money badges on every product card + checkout-style lead modal

## Testimonials section (homepage + about page)
Six testimonials with **real Ugandan names** + photos + business context:

1. **Namugga Christine** — Boutique owner, Owino Market, Kampala — "I got my Samsung A15 with just UGX 147,500 down. My business is on WhatsApp now."
2. **Ssemwogerere Robert** — Boda boda rider, Wakiso — "RovaCredit gave me a phone when no bank would. I pay weekly through MoMo."
3. **Akello Grace Lamwaka** — Salon owner, Gulu — "Three phones for my staff on flexible terms. Easiest financing I've used."
4. **Mukasa Joseph Kintu** — SME retailer, Mbarara — "Partnered with RovaCredit to offer phone financing to my customers. Game changer."
5. **Nabirye Esther** — University student, Makerere — "Got my A25 5G for school. Pay-as-I-earn from my side hustle."
6. **Tumusiime Patrick Byaruhanga** — Farmer cooperative leader, Kabale — "We financed 20 phones for our cooperative members. RovaCredit understood us."

## New routes added to plan
```
src/routes/
  index.tsx                      → home (with new testimonials section)
  marketplace.tsx                → catalog
  marketplace.$id.tsx            → product detail
  partners.tsx                   → partner onboarding
  about.tsx                      → corporate landing (upgraded)
  contact.tsx                    → contact form
  legal.privacy.tsx              → Privacy Policy (Uganda DPPA + Kenya DPA)
  legal.data-practices.tsx       → Data Protection Practices + DPO contact
  legal.terms.tsx                → Terms of Service
  legal.cookies.tsx              → Cookie Policy
  legal.credit-disclosure.tsx    → Consumer Credit Disclosure
  sign-in.tsx / sign-up.tsx      → Clerk auth (admin entry from footer)
  admin/*                        → role-gated command center (unchanged from prior plan)
```

## Compliance specifics implemented
- **Cookie consent banner** (bottom-fixed) with Accept / Reject / Customize — gates analytics cookies until consent given
- **Lead form** includes explicit DPPA-compliant consent checkbox: *"I consent to RovaCredit Africa processing my personal data per the Uganda Data Protection and Privacy Act 2019 and Kenya Data Protection Act 2019."*
- **Data subject rights page** — request access, correction, deletion, portability via form (creates a `data_request` lead with `source='dsr'`)
- **Named DPO** placeholder on data-practices page with email `dpo@rovacredit.africa`

## Everything else from the prior approved plan stays the same
- Clerk frontend-only auth, admin login via footer link → `/sign-in`
- Lovable Cloud Supabase for products, leads, profiles, user_roles (4 roles), RLS
- Catalog seeded with all 30 Samsung devices you provided + ~20 popular Tecno/Infinix/iPhone/Xiaomi models, Drive image URLs auto-converted
- WhatsApp +254 727 291 121 wired into every CTA + floating button
- Admin command center: dashboard, products CRUD, leads pipeline, analytics, users & roles, system status

## Out of scope (this build)
- Live MoMo/Airtel Money payment APIs (lead-only flow; partner logos shown for trust)
- Real legal text — pages will use compliant template copy with clear "Review before launch with Ugandan/Kenyan legal counsel" notice in admin docs
- Real Clerk → Cloud webhook (mirrored client-side on first sign-in)
