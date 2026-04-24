# RovaCredit Africa — Data Model

**Status:** v1.0
**Owner:** Engineering / Data
**Last updated:** 2026-04-24

---

## 1. ERD (logical)

```text
                 ┌────────────┐
                 │  profiles  │
                 │ (id PK)    │
                 └─────┬──────┘
                       │ 1..N
              ┌────────┴────────┐
              ▼                 ▼
       ┌────────────┐    ┌────────────┐
       │ user_roles │    │   leads    │◄──────┐
       │ (uid,role) │    │  (id PK)   │       │
       └────────────┘    └─────┬──────┘       │
                               │ 1..N         │
                       ┌───────┴──────┐       │
                       ▼              ▼       │
                ┌────────────┐  ┌────────────┐│
                │ lead_notes │  │ repayments ││
                └────────────┘  └────────────┘│
                                              │
       ┌────────────┐                         │
       │  products  │─────────────────────────┘
       │  (id PK)   │ referenced by leads.product_id
       └─────┬──────┘
             │
             ▼
       ┌────────────────┐
       │ product_images │
       └────────────────┘

       ┌────────────┐         ┌──────────────┐
       │  partners  │─1..N──► │ partner_docs │
       │  (id PK)   │         └──────────────┘
       └─────┬──────┘
             │ 1..N
             ▼
       ┌──────────────┐
       │  agreements  │  (versioned, e-signed)
       └──────────────┘

       ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
       │ audit_events │    │  consent     │    │ dsr_requests │
       └──────────────┘    └──────────────┘    └──────────────┘

       ┌──────────────┐
       │analytics_evt │  (event-stream, partitioned by day)
       └──────────────┘
```

## 2. Table dictionary (key tables only)

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | matches Clerk user id |
| email | text | unique, lowercase |
| display_name | text | |
| country | text | "UG" / "KE" |
| created_at | timestamptz | |

### `user_roles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK profiles.id | |
| role | enum app_role | admin_owner / developer / analyst / marketer / partner |
| granted_by | uuid | |
| granted_at | timestamptz | |
| (user_id, role) UNIQUE |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| brand | text | |
| asset_model | text | |
| category | text | starter / mid / flagship |
| asset_price | numeric(12,2) | UGX |
| down_payment | numeric(12,2) | suggested floor |
| specs | text[] | summary chips |
| specifications | jsonb | full key/value |
| image_url | text | |
| available | bool | |
| sort_order | int | |

### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_ref | text generated `RC-XXXX` | indexed |
| product_id | uuid FK products | |
| name | text | Confidential |
| phone | text | Confidential, normalised E.164 |
| latitude | float8 | optional |
| longitude | float8 | optional |
| location_label | text | |
| income_band | text | |
| employment_type | text | |
| repayment_cadence | text | |
| eligibility_tier | text | A..E |
| eligibility_down_payment_pct | numeric | |
| computed_down_payment | numeric | |
| consent_dppa | bool | required = true |
| source | text | "web" / "partner" |
| partner_id | uuid FK partners NULL | |
| status | enum | new / contacted / approved / disbursed / rejected / defaulted |
| agreement_version | text | for partner leads |
| agreement_accepted_at | timestamptz | |
| agreement_signatory_name | text | |
| created_at | timestamptz | |

### `partners`
Business name, TIN, MoMo merchant code, address (lat/lng), owner ID (encrypted), foot-traffic, status, approved_by, approved_at.

### `agreements`
Immutable signed snapshots of partner agreements, version pinned, full terms text + checksum.

### `audit_events`
Append-only. See `Admin.md` §4.

### `consent`
Per-user consent toggles with timestamp + lawful basis (one row per change).

### `dsr_requests`
type (access / erase / rectify / object), subject_id, status, fulfilled_at, evidence_url.

## 3. Indexes (key)

- `leads (status, created_at desc)` — ops queues
- `leads (partner_id, status)` — partner views
- `leads (lead_ref)` unique — lookup
- `products (available, sort_order)` — marketplace browse
- `audit_events (entity, entity_id, ts desc)` — entity history
- `analytics_events (ts)` partitioned daily

## 4. PII classification

| Field | Class | Mask in UI? | Logged? |
|---|---|---|---|
| name | Confidential | partial | no |
| phone | Confidential | yes (`+256•••1234`) | no |
| latitude/longitude | Confidential | rounded to 0.01 | no |
| owner_id_number | Restricted | yes (`••••6789`) | never |
| momo_merchant_code | Confidential | yes | never |
| email | Confidential | partial | no |

## 5. Migration policy

- Alembic, forward-only.
- Every migration paired with a backfill plan if it changes existing rows.
- Destructive migrations require a 2-step deploy (deprecate column → release → drop column in next release).

## 6. Retention enforcement

A nightly Inngest job (`data.retention.sweeper`) anonymises or deletes rows past their retention as defined in `Compliance.md` §6.
