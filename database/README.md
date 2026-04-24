# Database Migrations — Cloud SQL PostgreSQL 16

## Migration Order

Run migrations in sequence against the target Cloud SQL instance:

```bash
# Connect via Cloud SQL Auth Proxy
cloud-sql-proxy rovacredit:africa-east1:rovacredit-dev \
  --auto-iam-authn --port 5432

# Or connect directly
gcloud sql connect myinstance --user=postgres
```

Then execute each migration file in order:

| Order | File | Description |
|-------|------|-------------|
| 1 | `001_enums_and_extensions.sql` | PostgreSQL extensions and all enum types |
| 2 | `002_core_tables.sql` | Profiles, user_roles, products, product_images, set_updated_at trigger |
| 3 | `003_partners.sql` | Partners and partner_docs |
| 4 | `004_leads_and_onboarding.sql` | Leads, eligibility_checks, device_enrollments, kyc_evidence, lead_notes |
| 5 | `005_agreements_and_repayments.sql` | Agreements and repayments |
| 6 | `006_compliance_and_audit.sql` | Audit_events, consent, dsr_requests, analytics_events |

```bash
# Example: run all migrations
for f in migrations/001_*.sql migrations/002_*.sql migrations/003_*.sql \
         migrations/004_*.sql migrations/005_*.sql migrations/006_*.sql; do
  psql "$DATABASE_URL" -f "$f"
done
```

## Migration Policy

- **Forward-only**: no down migrations. Destructive changes use a 2-step deploy (deprecate, then drop).
- **Backfill plan required**: any migration that modifies existing rows must include a paired backfill script.
- **Production target**: Alembic will be the migration runner for the FastAPI backend. These SQL files serve as the canonical schema reference.

## Prisma Integration

The `prisma/schema.prisma` file mirrors this schema for type-safe query generation. After schema changes:

```bash
npx prisma db pull    # Introspect from database
npx prisma generate   # Regenerate Prisma Client
```
