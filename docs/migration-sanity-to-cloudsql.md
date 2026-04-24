# Migration Plan: Supabase → Sanity → Cloud SQL

**Status:** Active
**Owner:** Data Platform Agent
**Last updated:** 2026-04-24

---

## 1. Migration Strategy Overview

The migration follows a three-phase pipeline:

```text
Phase 1 (Current)          Phase 2                    Phase 3 (Target)
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Supabase       │  ──►  │   Sanity CMS     │  ──►  │   Cloud SQL      │
│   (PostgreSQL)   │       │   (Content Lake)  │       │   (PostgreSQL 16)│
│                  │       │                    │       │                    │
│ Products         │       │ Product pages     │       │ Products (pricing) │
│ Leads            │       │ Legal docs        │       │ Leads              │
│ Profiles         │       │ FAQ, Help, Blog   │       │ Profiles           │
│ User roles       │       │ Landing pages     │       │ User roles         │
│ Analytics        │       │ Settings          │       │ Partners           │
│                  │       │ Announcements     │       │ Agreements         │
│                  │       │                    │       │ Repayments         │
│                  │       │                    │       │ Audit + compliance │
└──────────────────┘       └──────────────────┘       └──────────────────┘
         │                          │                          │
         └──── Database Client ─────┴──────────────────────────┘
              Abstraction Layer (src/integrations/database/)
```

### Key Principle: Split by Nature

| Data Nature | Goes To | Reason |
|-------------|---------|--------|
| Transactional (pricing, leads, users, roles, agreements, repayments) | Cloud SQL | ACID guarantees, relational integrity, RLS, compliance |
| Editorial (marketing copy, legal text, FAQ, blog, landing pages) | Sanity CMS | Editor-friendly Studio, CDN delivery, no deploy needed |
| Ephemeral (sessions, rate limits, queues) | Redis | TTL-based, low-latency |

---

## 2. Phase 1: Abstraction Layer (Completed)

### What Changed

1. **New `src/integrations/database/` module** replaces direct Supabase imports:
   - `types.ts` — Standalone TypeScript types (no Supabase dependency)
   - `client.ts` — Database client with typed query functions

2. **All routes and components updated** to import from `@/integrations/database/client`:
   - `index.tsx`, `marketplace.tsx`, `marketplace.$id.tsx` → `fetchProducts()`, `fetchProductById()`, `fetchRecommendations()`
   - `contact.tsx`, `partners.tsx`, `LeadModal.tsx` → `insertLead()`
   - `sign-in.tsx` → `findProfileByClerkId()`, `insertProfile()`, `countRoles()`, `insertRole()`
   - Admin routes → `db` proxy for complex CRUD operations

3. **Supabase files retained** (not deleted) as bridge implementation:
   - `src/integrations/supabase/` still exists but is only imported by `database/client.ts`
   - Will be removed once Cloud SQL + FastAPI backend is live

4. **Environment files created**:
   - `.env.example` — Template with all required variables documented
   - `.env.local` — Local development values (gitignored via `*.local`)

### Migration-Safe Architecture

The `database/client.ts` module currently delegates to Supabase. When Cloud SQL is ready:

```typescript
// Before (current — Supabase bridge)
export async function fetchProducts() {
  const { data } = await db.from('products').select('*')...
  return data
}

// After (target — FastAPI backend)
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/v1/products?available=true`)
  return res.json()
}
```

No component changes needed — only `database/client.ts` changes.

---

## 3. Phase 2: Sanity Content Population

### 3.1 Content That Moves to Sanity

| Current Location | Sanity Document Type | Notes |
|------------------|---------------------|-------|
| Hardcoded in `index.tsx` | `landingPage` | Hero text, testimonials, how-it-works steps |
| Hardcoded in legal routes | `legalDocument` | Terms, privacy, partner agreement, cookies |
| Products table `image_url`, `alt_text` | `productPage` | Marketing copy, hero images, feature descriptions |
| Hardcoded in `about.tsx` | `landingPage` | Company story content |
| N/A (new) | `faqItem` | FAQ entries currently missing |
| N/A (new) | `helpArticle` | Help center articles |
| N/A (new) | `blogPost` | Company news |
| N/A (new) | `announcement` | Banner notifications |
| N/A (new) | `siteSettings` | Navigation, footer, branding |
| N/A (new) | `partnerSpotlight` | Partner success stories |

### 3.2 Content Extraction Scripts

To migrate existing hardcoded content into Sanity:

```bash
# 1. Initialize Sanity Studio
npm create sanity@latest -- --template clean --typescript

# 2. Deploy schema types (from sanity/schemaTypes/)
npx sanity schema deploy

# 3. Populate via MCP or Studio
# - Create productPage documents linking to Cloud SQL product IDs
# - Create legalDocument entries from legal route text
# - Create siteSettings with navigation structure
```

### 3.3 Cross-Reference Pattern

Products live in both systems:

```
Cloud SQL products table                 Sanity productPage document
┌─────────────────────────┐              ┌─────────────────────────┐
│ id: "abc-123"           │              │ _id: "prod_abc123"      │
│ name: "Galaxy A15"      │              │ title: "Galaxy A15"     │
│ asset_price: 480000     │◄────────────►│ cloudSqlProductId:      │
│ down_payment: 147500    │  sanity_ref  │   "abc-123"             │
│ sanity_ref: "prod_abc"  │              │ heroImage: {...}        │
│ available: true         │              │ body: [portable text]   │
│                         │              │ features: [...]         │
└─────────────────────────┘              └─────────────────────────┘
```

Frontend merges both:
1. Fetch pricing from Cloud SQL (via API)
2. Fetch marketing copy from Sanity (via GROQ)
3. React component renders combined data

---

## 4. Phase 3: Cloud SQL Cutover

### 4.1 Prerequisites

- [ ] Cloud SQL PostgreSQL 16 instance provisioned
- [ ] Run all 6 migration scripts from `database/migrations/`
- [ ] FastAPI backend deployed on Cloud Run
- [ ] API routes implemented for all database operations
- [ ] Cloud SQL Auth Proxy configured for development
- [ ] Redis (Memorystore) provisioned for caching

### 4.2 Data Migration Steps

```bash
# 1. Export data from Supabase
pg_dump --host=db.cnbuxysgxlwnrjaqwovw.supabase.co \
  --username=postgres --format=custom \
  --no-owner --no-acl \
  rovacredit > supabase_export.dump

# 2. Import into Cloud SQL
gcloud sql connect myinstance --user=postgres
# Then restore:
pg_restore --host=127.0.0.1 --username=postgres \
  --dbname=rovacredit --no-owner --no-acl \
  supabase_export.dump

# 3. Run new migration scripts for tables that didn't exist in Supabase
psql "$CLOUD_SQL_URL" -f database/migrations/003_partners.sql
psql "$CLOUD_SQL_URL" -f database/migrations/005_agreements_and_repayments.sql
psql "$CLOUD_SQL_URL" -f database/migrations/006_compliance_and_audit.sql
```

### 4.3 Client Swap

Update `src/integrations/database/client.ts` to fetch from FastAPI instead of Supabase:

```typescript
const API_URL = import.meta.env.VITE_DATABASE_API_URL

export async function fetchProducts(opts) {
  const params = new URLSearchParams()
  if (opts?.available !== undefined) params.set('available', String(opts.available))
  if (opts?.limit) params.set('limit', String(opts.limit))
  const res = await fetch(`${API_URL}/v1/products?${params}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
```

### 4.4 Environment Update

```bash
# .env.local — switch from Supabase to Cloud SQL API
VITE_DATABASE_API_URL="https://api.rovacredit.africa/v1"
VITE_DATABASE_API_KEY="your-api-key"
# Remove/comment out SUPABASE_* variables
```

### 4.5 Cleanup

Once Cloud SQL cutover is verified:
1. Remove `src/integrations/supabase/` directory
2. Remove `@supabase/supabase-js` from `package.json`
3. Remove Supabase env vars from `.env.example`
4. Delete `supabase/` config directory
5. Archive Supabase migrations (they're superseded by `database/migrations/`)

---

## 5. Rollback Plan

At each phase, rollback is straightforward:

| Phase | Rollback Action |
|-------|-----------------|
| Phase 1 (abstraction) | Revert `database/client.ts` imports to `supabase/client` |
| Phase 2 (Sanity content) | Content stays in Sanity; no data loss. Revert frontend GROQ calls |
| Phase 3 (Cloud SQL) | Switch `VITE_DATABASE_API_URL` back to Supabase URL |

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data loss during pg_dump/restore | Test full cycle on dev instance first; verify row counts |
| Generated columns (lead_ref) differ | Re-run column generation after import |
| RLS policies not migrated | Cloud SQL uses FastAPI middleware for auth, not RLS |
| Supabase realtime features used | Not currently used; no impact |
| Sanity CDN cache stale | Webhook-driven invalidation; 10-min TTL fallback |
| Downtime during cutover | Blue-green: run both backends, switch DNS |

---

## 7. Timeline Dependencies

```text
Phase 1 ──► Phase 2 ──► Phase 3
   │            │            │
   │            │            ├── FastAPI backend must be deployed
   │            │            ├── Cloud SQL instance provisioned
   │            │            └── API routes implemented
   │            │
   │            ├── Sanity Studio initialized
   │            ├── Schema deployed
   │            └── Content populated
   │
   ├── Database abstraction layer (DONE)
   ├── Environment files (DONE)
   └── Route migrations (DONE)
```
