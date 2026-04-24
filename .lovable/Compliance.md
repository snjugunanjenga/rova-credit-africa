# RovaCredit Africa — Compliance

**Status:** v1.0 (must be reviewed by East African counsel before launch)
**Owner:** DPO
**Last updated:** 2026-04-24

---

## 1. Applicable laws

| Jurisdiction | Law | Regulator |
|---|---|---|
| Uganda | Data Protection and Privacy Act, 2019 (DPPA) + DPP Regulations 2021 | Personal Data Protection Office (PDPO), under NITA-U |
| Kenya | Data Protection Act, 2019 (DPA) | Office of the Data Protection Commissioner (ODPC) |
| Both | Consumer credit / lending regulations (UMRA Uganda, CBK Kenya) | UMRA / CBK |
| Both | Anti-Money Laundering Acts | Financial Intelligence Authorities |

## 2. Data subject rights honoured

| Right | DPPA UG | DPA KE | RovaCredit response |
|---|:-:|:-:|---|
| Be informed | ✓ | ✓ | Privacy notice + cookie banner on every page |
| Access | ✓ | ✓ | DSR portal: export within 30 days |
| Rectification | ✓ | ✓ | Self-serve in profile + admin DSR queue |
| Erasure | ✓ | ✓ | Cascade delete or anonymise within 30 days, subject to credit-record retention duty |
| Restrict processing | ✓ | ✓ | Flag in `consent` table; honoured by API |
| Data portability | ✓ | ✓ | JSON export from DSR portal |
| Object | ✓ | ✓ | Marketing opt-out one click; processing opt-out via DSR |
| Not be subject to automated decisions | ✓ | ✓ | Tier ladder is deterministic + human-reviewable; no opaque ML |
| Lodge complaint | ✓ | ✓ | Contact PDPO / ODPC links in privacy notice |

## 3. Lawful bases used

| Processing | Lawful basis |
|---|---|
| Marketplace browsing | Legitimate interest |
| Lead application | Contract (pre-contractual steps) + consent for marketing |
| Eligibility scoring | Contract |
| Geolocation capture | Explicit consent (toggle in modal) |
| Partner KYC | Legal obligation + contract |
| Repayment reminders via WhatsApp | Contract |
| Marketing WhatsApp / SMS | Explicit consent (separate checkbox) |

## 4. Registrations required before launch

- **Uganda PDPO**: register as Data Controller (annual fee).
- **Kenya ODPC**: register as Data Controller and Data Processor.
- **UMRA**: lender / credit-provider licence (Phase 2 if balance-sheet lending).
- **URSB / KRA / KBS**: standard business registrations.

## 5. Breach response

```text
T+0          incident detected (Sev1/Sev2)
T+1h         IR commander assigned; war room opened
T+24h        scope confirmed (records/PII affected)
T+72h        regulator notified (PDPO and/or ODPC) if PII risk material
T+72h        affected data subjects notified (where high risk)
T+30d        post-mortem published; remediation tracked
```

## 6. Retention schedule

| Data | Retention |
|---|---|
| Active customer record | While account active + 7 years (credit/AML) |
| Lead (no conversion) | 24 months |
| Partner agreement | 7 years post-termination |
| Audit log | 7 years |
| Web access logs (no PII) | 90 days |
| Marketing consent log | 5 years |
| Backups | 35 days (Cloud SQL PITR) + 12 months cold |

## 7. Cookie policy

- Strictly necessary cookies: no consent required (session, CSRF).
- Analytics: opt-in banner; default OFF.
- Marketing: opt-in banner; default OFF.
- Cookie banner shows on first visit; preference stored in `cookie_consent` cookie + server-side audit.

## 8. WhatsApp messaging compliance

- Only Meta-approved templates for outbound to non-opted-in users.
- Marketing templates require separate consent.
- Opt-out: reply "STOP" → handled by webhook → consent revoked + suppression list.
- Quality rating monitored daily; mitigation plan if it drops below "High".

## 9. Subprocessors registry

| Subprocessor | Purpose | Region | DPA signed |
|---|---|---|---|
| Google Cloud (GCP) | Hosting, DB, Maps | europe-west1 | Yes |
| Vercel | Frontend hosting | EU | Yes |
| Clerk | Authentication | US (DPF) | Yes |
| Inngest | Workflow orchestration | US (SCCs) | Yes |
| Meta (WhatsApp) | Messaging | Global | Yes |
| Sentry | Error monitoring | EU | Yes |
| Locker.io | Internal secrets | Self-hosted in GCP | Internal |

Public list maintained at `/legal/subprocessors`; customers notified 30 days before any addition.

## 10. Outstanding items before go-live

- [ ] Counsel review of all `/legal/*` pages (UG + KE)
- [ ] PDPO registration submitted
- [ ] ODPC registration submitted
- [ ] DPO appointed in writing
- [ ] First DSR test request executed end-to-end
- [ ] Subprocessor DPAs filed
- [ ] Pen test report reviewed and remediated
