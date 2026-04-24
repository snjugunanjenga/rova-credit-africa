# Database Schema Build Plan — Cloud SQL + Sanity CMS + Query Management

**Status:** Active
**Owner:** Data Platform Agent
**Last updated:** 2026-04-24

---

## 1. Architecture Overview

The data layer splits into three complementary systems:

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        RovaCredit Data Layer                        │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Cloud SQL       │  │   Sanity CMS      │  │  Query Manager   │  │
│  │   (PostgreSQL 16) │  │   (Content Lake)  │  │  (Prisma + GROQ) │  │
│  │                    │  │                    │  │                    │  │
│  │  System of Record  │  │  Managed Content   │  │  Typed Access     │  │
│  │  - Users/Roles     │  │  - Product Pages   │  │  - Prisma Client  │  │
│  │  - Partners        │  │  - Legal Docs      │  │  - GROQ Queries   │  │
│  │  - Leads           │  │  - Marketing Copy  │  │  - Cache Layer    │  │
│  │  - Agreements      │  │  - FAQ/Help        │  │  - Migrations     │  │
│  │  - Repayments      │  │  - Landing Pages   │  │                    │  │
│  │  - Audit Events    │  │  - Partner Profiles │  │                    │  │
│  │  - Compliance      │  │  - Blog/News       │  │                    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│           │                      │                      │            │
│           └──────────┬───────────┘                      │            │
│                      │                                  │            │
│              FastAPI Backend ◄───────────────────────────┘            │
│                      │                                               │
│              React 19 Frontend                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Ownership Boundaries

| System | Owns | Access Pattern |
|--------|------|----------------|
| Cloud SQL (PostgreSQL 16) | Transactional data: users, roles, leads, partners, agreements, repayments, audit events, compliance records | Prisma ORM via FastAPI |
| Sanity CMS | Editorial content: product marketing pages, legal templates, FAQ/help articles, blog posts, partner spotlight profiles, landing page content | GROQ queries via `@sanity/client` |
| Redis (Memorystore) | Ephemeral: session cache, rate-limit counters, Celery broker, query result cache | Redis client in FastAPI |

---

## 2. Cloud SQL Schema Design (PostgreSQL 16)

### 2.1 Design Principles

- Forward-only migrations via Alembic (matching `.lovable/DataModel.md` policy)
- UUID primary keys everywhere (matches Clerk user model)
- `timestamptz` for all timestamps (UTC storage, EAT display)
- Row-level security where applicable
- PII columns tagged for masking (see Compliance)
- JSONB for extensible metadata without schema migration
- Generated columns for computed reference codes

### 2.2 Enum Types

```sql
CREATE TYPE app_role AS ENUM (
  'admin_owner', 'developer', 'analyst', 'marketer', 'partner'
);

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'approved',
  'disbursed', 'rejected', 'defaulted', 'converted', 'lost'
);

CREATE TYPE lead_source AS ENUM (
  'marketplace', 'partner', 'direct', 'dsr', 'web'
);

CREATE TYPE product_category AS ENUM (
  'budget', 'mid-range', 'flagship'
);

CREATE TYPE partner_status AS ENUM (
  'pending', 'approved', 'suspended', 'terminated'
);

CREATE TYPE agreement_status AS ENUM (
  'draft', 'sent', 'signed', 'acknowledged', 'expired', 'revoked'
);

CREATE TYPE kyc_status AS ENUM (
  'pending', 'verified', 'rejected', 'expired'
);

CREATE TYPE repayment_status AS ENUM (
  'scheduled', 'paid', 'overdue', 'defaulted', 'waived'
);

CREATE TYPE dsr_type AS ENUM (
  'access', 'erase', 'rectify', 'object'
);

CREATE TYPE dsr_status AS ENUM (
  'received', 'processing', 'fulfilled', 'denied'
);
```

### 2.3 Core Tables

#### `profiles`
Maps 1:1 to Clerk users. No PII beyond what Clerk exposes.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | DEFAULT gen_random_uuid() |
| clerk_user_id | text UNIQUE NOT NULL | Clerk external ID |
| email | text | Confidential PII |
| display_name | text | |
| avatar_url | text | |
| country | text | "UG" / "KE" |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `user_roles`
Separate table for RBAC (security best practice).

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| profile_id | uuid FK profiles | ON DELETE CASCADE |
| role | app_role | NOT NULL |
| granted_by | uuid FK profiles | nullable |
| granted_at | timestamptz | DEFAULT now() |
| UNIQUE(profile_id, role) | | |

#### `partners`
Business entities that submit client applications.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| name | text NOT NULL | |
| tin | text | Tax ID (Restricted PII) |
| momo_merchant_code | text | Confidential |
| contact_phone | text | E.164 format |
| contact_email | text | |
| address_label | text | |
| latitude | float8 | |
| longitude | float8 | |
| owner_id_number | text | Restricted PII, AES-256 at rest |
| foot_traffic | text | |
| risk_tier | text | |
| status | partner_status | DEFAULT 'pending' |
| approved_by | uuid FK profiles | |
| approved_at | timestamptz | |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `partner_docs`
Supporting documents for partner onboarding.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| partner_id | uuid FK partners | ON DELETE CASCADE |
| doc_type | text NOT NULL | e.g. "business_license", "id_front" |
| file_url | text NOT NULL | Cloud Storage URL |
| uploaded_at | timestamptz | DEFAULT now() |

#### `products`
Device catalog (transactional pricing data; marketing copy lives in Sanity).

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| name | text NOT NULL | |
| brand | text NOT NULL | |
| asset_model | text | |
| category | product_category | DEFAULT 'budget' |
| asset_price | numeric(12,2) NOT NULL | UGX |
| down_payment | numeric(12,2) NOT NULL | Suggested floor |
| price_label | text | Formatted display |
| image_url | text | |
| alt_text | text | |
| ram | text | |
| storage | text | |
| specs | text[] | Summary chips |
| specifications | jsonb | Full key-value specs |
| badges | text[] | |
| rating | numeric(2,1) | DEFAULT 4.5 |
| available | boolean | DEFAULT true |
| sort_order | integer | DEFAULT 0 |
| sanity_ref | text | Cross-reference to Sanity product page |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `leads`
Client financing applications.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_ref | text GENERATED ALWAYS AS ('RC-' \|\| upper(substr(id::text, 1, 4))) STORED | |
| source | lead_source | DEFAULT 'marketplace' |
| status | lead_status | DEFAULT 'new' |
| full_name | text NOT NULL | Confidential PII |
| email | text | Confidential PII |
| phone | text | Confidential PII, E.164 |
| country | text | DEFAULT 'Uganda' |
| id_type | text | |
| monthly_income | text | |
| employment_type | text | |
| latitude | float8 | Confidential PII |
| longitude | float8 | Confidential PII |
| location_label | text | |
| eligibility_tier | text | A-E |
| eligibility_down_payment_pct | numeric | |
| computed_down_payment | numeric | |
| repayment_cadence | text | |
| product_id | uuid FK products | ON DELETE SET NULL |
| product_snapshot | jsonb | Point-in-time product data |
| partner_id | uuid FK partners | nullable |
| subject | text | |
| message | text | |
| consent_given | boolean NOT NULL | DEFAULT false |
| agreement_version | text | |
| agreement_accepted_at | timestamptz | |
| agreement_signatory_name | text | |
| assigned_to | uuid FK profiles | ON DELETE SET NULL |
| metadata | jsonb | DEFAULT '{}' |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `eligibility_checks`
CRB integration results.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads UNIQUE | ON DELETE CASCADE |
| crb_provider | text NOT NULL | |
| score | integer | |
| decision | text | "approve" / "reject" / "manual_review" |
| reason | text | |
| raw_response | jsonb | |
| checked_at | timestamptz | DEFAULT now() |

#### `device_enrollments`
Device locking/management state.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads UNIQUE | ON DELETE CASCADE |
| imei | text NOT NULL | |
| dp_amount | numeric(12,2) | |
| dp_proof_url | text | |
| knox_status | text | |
| payjoy_status | text | |
| goupil_relock_time | timestamptz | |
| enrolled_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `kyc_evidence`
Know Your Customer documents.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads UNIQUE | ON DELETE CASCADE |
| id_front_url | text | Restricted PII |
| id_back_url | text | Restricted PII |
| selfie_url | text | Restricted PII |
| unboxing_url | text | |
| verification_status | kyc_status | DEFAULT 'pending' |
| verified_at | timestamptz | |
| verified_by | uuid FK profiles | |

#### `agreements`
Immutable signed snapshots of partner/client agreements.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads | ON DELETE CASCADE |
| partner_id | uuid FK partners | nullable |
| version | text NOT NULL | Semver |
| terms_text | text NOT NULL | Full agreement body |
| terms_checksum | text NOT NULL | SHA-256 |
| delivery_channel | text | "whatsapp" / "email" / "sms" |
| sent_at | timestamptz | |
| signed_at | timestamptz | |
| acknowledged_at | timestamptz | |
| status | agreement_status | DEFAULT 'draft' |
| created_at | timestamptz | DEFAULT now() |

#### `repayments`
Scheduled and actual repayment records.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads | ON DELETE CASCADE |
| due_date | date NOT NULL | |
| amount_due | numeric(12,2) NOT NULL | UGX |
| amount_paid | numeric(12,2) | DEFAULT 0 |
| paid_at | timestamptz | |
| payment_method | text | "momo" / "bank" / "cash" |
| payment_ref | text | External transaction reference |
| status | repayment_status | DEFAULT 'scheduled' |
| created_at | timestamptz | DEFAULT now() |

#### `lead_notes`
Internal notes on leads by staff.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| lead_id | uuid FK leads | ON DELETE CASCADE |
| author_clerk_id | text | |
| author_name | text | |
| body | text NOT NULL | |
| created_at | timestamptz | DEFAULT now() |

#### `audit_events`
Append-only compliance trail.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| actor_user_id | uuid FK profiles | nullable |
| entity | text NOT NULL | Table name |
| entity_id | uuid NOT NULL | Row PK |
| event_type | text NOT NULL | |
| payload_json | jsonb | DEFAULT '{}' |
| ip_address | inet | |
| user_agent | text | |
| created_at | timestamptz | DEFAULT now() |

#### `consent`
DPPA/DPA consent records — one row per change.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| subject_id | uuid NOT NULL | Lead or profile ID |
| consent_type | text NOT NULL | "dppa_processing", "marketing", etc. |
| granted | boolean NOT NULL | |
| lawful_basis | text | |
| ip_address | inet | |
| created_at | timestamptz | DEFAULT now() |

#### `dsr_requests`
Data Subject Rights requests (Uganda DPPA / Kenya DPA).

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| type | dsr_type NOT NULL | |
| subject_id | uuid NOT NULL | |
| status | dsr_status | DEFAULT 'received' |
| notes | text | |
| fulfilled_at | timestamptz | |
| evidence_url | text | |
| created_at | timestamptz | DEFAULT now() |

#### `analytics_events`
Event stream — partitioned by day for retention sweeps.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| event_name | text NOT NULL | |
| payload | jsonb | DEFAULT '{}' |
| session_id | text | |
| path | text | |
| created_at | timestamptz | DEFAULT now() |

#### `product_images`
Multi-image support for product catalog.

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid PK | |
| product_id | uuid FK products | ON DELETE CASCADE |
| url | text NOT NULL | |
| alt_text | text | |
| sort_order | integer | DEFAULT 0 |
| created_at | timestamptz | DEFAULT now() |

### 2.4 Key Indexes

```sql
CREATE INDEX idx_leads_status_created ON leads (status, created_at DESC);
CREATE INDEX idx_leads_partner_status ON leads (partner_id, status);
CREATE UNIQUE INDEX idx_leads_ref ON leads (lead_ref);
CREATE INDEX idx_products_available_sort ON products (available, sort_order);
CREATE INDEX idx_audit_entity ON audit_events (entity, entity_id, created_at DESC);
CREATE INDEX idx_analytics_created ON analytics_events (created_at);
CREATE INDEX idx_repayments_lead_due ON repayments (lead_id, due_date);
CREATE INDEX idx_repayments_status ON repayments (status) WHERE status IN ('overdue', 'defaulted');
CREATE INDEX idx_partners_status ON partners (status);
CREATE INDEX idx_consent_subject ON consent (subject_id, consent_type);
CREATE INDEX idx_dsr_status ON dsr_requests (status) WHERE status != 'fulfilled';
```

### 2.5 Triggers

```sql
-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_device_enrollments_updated_at BEFORE UPDATE ON device_enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 3. Sanity CMS Content Model

Sanity owns all **editorial, marketing, and legal content** that editors update without developer deploys.

### 3.1 Document Types

| Document Type | Purpose | Editable By |
|---------------|---------|-------------|
| `productPage` | Rich product marketing content (hero, features, comparison) | Marketers |
| `legalDocument` | Terms of service, privacy policy, DPPA notice | Legal / Admin |
| `faqItem` | Frequently asked questions | Marketers |
| `helpArticle` | Knowledge base articles | Marketers |
| `blogPost` | Company news and articles | Marketers |
| `landingPage` | Modular marketing landing pages | Marketers |
| `partnerSpotlight` | Partner success stories | Marketers |
| `siteSettings` | Global site configuration (nav, footer, branding) | Admin |
| `announcement` | Banners and notification messages | Marketers |

### 3.2 Cross-Reference Strategy

Products exist in both Cloud SQL (transactional data: pricing, availability, specs) and Sanity (marketing content: descriptions, feature highlights, comparison copy). They are linked by a shared `sanity_ref` field in the `products` table that maps to the Sanity document `_id`.

```text
Cloud SQL products.sanity_ref  ──►  Sanity productPage._id
```

The frontend fetches pricing from Cloud SQL via the API and marketing copy from Sanity via GROQ, merging them in the React component layer.

### 3.3 Schema Definitions

See `sanity/schemaTypes/` directory for full TypeScript schema definitions using `defineType`, `defineField`, and `defineArrayMember`.

---

## 4. Query Management Layer

### 4.1 Prisma ORM (Cloud SQL)

Prisma provides typed database access for the FastAPI backend:

- **Schema source of truth:** `prisma/schema.prisma`
- **Migration engine:** Alembic (preferred for Python/FastAPI; Prisma Migrate available as secondary)
- **Generated client:** Used in API route handlers for type-safe queries
- **Connection:** Cloud SQL via Private IP with IAM authentication

### 4.2 GROQ Queries (Sanity CMS)

Sanity content is queried via GROQ from the React frontend:

- **Client:** `@sanity/client` configured with project ID, dataset, and API version
- **TypeGen:** `sanity typegen` generates TypeScript types from GROQ queries
- **Caching:** CDN-backed reads for public content; API-direct for preview/draft

### 4.3 Cache Strategy (Redis)

| Cache Key Pattern | TTL | Invalidation |
|-------------------|-----|--------------|
| `product:{id}` | 5 min | On product update webhook |
| `products:list:{category}` | 2 min | On any product change |
| `partner:{id}:leads` | 1 min | On lead status change |
| `eligibility:{lead_id}` | 24 hr | Never (immutable check result) |
| `sanity:page:{slug}` | 10 min | Sanity webhook on publish |

---

## 5. Implementation Phases

### Phase 1: Foundation (Current Sprint)

**Cloud SQL:**
1. Provision Cloud SQL PostgreSQL 16 instance (db-g1-small, Private IP)
2. Run initial migration: enums, profiles, user_roles, products, leads, lead_notes, analytics_events (matches existing Supabase schema)
3. Run extension migration: partners, partner_docs, agreements, eligibility_checks, device_enrollments, kyc_evidence, repayments, consent, dsr_requests, audit_events, product_images
4. Seed product catalog data

**Sanity CMS:**
1. Initialize Sanity Studio project (`npm create sanity@latest`)
2. Define schema types: productPage, legalDocument, faqItem, siteSettings
3. Deploy schema (`npx sanity schema deploy`)
4. Populate initial content via Studio or MCP

**Prisma:**
1. Define `schema.prisma` matching Cloud SQL tables
2. Generate Prisma Client
3. Create FastAPI dependency for database sessions

### Phase 2: Onboarding Domain

**Cloud SQL:**
1. Implement lead state machine transitions with audit trail
2. Add eligibility check workflow tables
3. Add device enrollment tracking
4. Add KYC evidence workflow

**Sanity CMS:**
1. Add helpArticle and blogPost types
2. Add landingPage with modular page builder
3. Set up Sanity webhook for cache invalidation

**Prisma:**
1. Define typed query helpers for lead lifecycle
2. Implement transaction wrappers for multi-table state changes

### Phase 3: Partner & Admin

**Cloud SQL:**
1. Partner CRUD with approval workflow
2. Repayment schedule generation and tracking
3. Agreement versioning and signing workflow

**Sanity CMS:**
1. Add partnerSpotlight document type
2. Add announcement banner type
3. Configure Studio structure for role-based editing

**Prisma:**
1. Complex reporting queries (partner performance, lead funnels)
2. Aggregate views for admin dashboards

### Phase 4: Reliability & Compliance

**Cloud SQL:**
1. Enable automated backups and point-in-time recovery
2. Configure read replicas for analytics queries
3. Implement data retention sweep (Inngest nightly job)
4. PII masking functions for API responses

**Sanity CMS:**
1. Content versioning and release management
2. Preview/draft workflow for legal documents

---

## 6. Connection Configuration

### Cloud SQL

```yaml
# Environment: production
CLOUD_SQL_INSTANCE: rovacredit:africa-east1:rovacredit-prod
DATABASE_URL: postgresql://api_user@/rovacredit?host=/cloudsql/rovacredit:africa-east1:rovacredit-prod
DB_IAM_USER: api-sa@rovacredit.iam.gserviceaccount.com
```

### Sanity

```yaml
SANITY_PROJECT_ID: <project-id>
SANITY_DATASET: production
SANITY_API_VERSION: "2026-04-24"
SANITY_USE_CDN: true  # false for preview/draft
```

### Redis

```yaml
REDIS_HOST: <memorystore-private-ip>
REDIS_PORT: 6379
REDIS_DB: 0
```

---

## 7. gcloud SQL Connection Reference

```bash
# Connect to Cloud SQL instance directly
gcloud sql connect myinstance --user=postgres

# Via Cloud SQL Auth Proxy (recommended for development)
cloud-sql-proxy rovacredit:africa-east1:rovacredit-dev \
  --auto-iam-authn \
  --port 5432

# Then connect locally
psql "host=127.0.0.1 port=5432 dbname=rovacredit user=postgres"
```

---

## 8. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema drift between Supabase (current) and Cloud SQL (target) | Data loss during migration | Maintain parallel schemas; automated diff tooling |
| Sanity content not in sync with product pricing | Stale marketing copy | Webhook-driven cache invalidation; sanity_ref foreign key |
| PII exposure in logs/queries | Compliance violation | Column-level masking functions; no PII in log payloads |
| Migration rollback needed | Service disruption | Forward-only migrations with paired backfill plans |
| Cloud SQL cold-start latency | Slow first request | min-instances=1 on Cloud Run; connection pooling via PgBouncer |
