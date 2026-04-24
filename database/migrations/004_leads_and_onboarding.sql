-- Migration 004: Leads, eligibility, device enrollment, KYC, lead notes
-- Depends on: 002_core_tables, 003_partners

-- =========================================================
-- Leads (client financing applications)
-- =========================================================
CREATE TABLE leads (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_ref                    text GENERATED ALWAYS AS ('RC-' || upper(substr(id::text, 1, 4))) STORED,
  source                      lead_source NOT NULL DEFAULT 'marketplace',
  status                      lead_status NOT NULL DEFAULT 'new',
  full_name                   text NOT NULL,
  email                       text,
  phone                       text,
  country                     text DEFAULT 'Uganda',
  id_type                     text,
  monthly_income              text,
  employment_type             text,
  latitude                    float8,
  longitude                   float8,
  location_label              text,
  eligibility_tier            text,
  eligibility_down_payment_pct numeric,
  computed_down_payment       numeric,
  repayment_cadence           text,
  product_id                  uuid REFERENCES products(id) ON DELETE SET NULL,
  product_snapshot            jsonb,
  partner_id                  uuid REFERENCES partners(id) ON DELETE SET NULL,
  subject                     text,
  message                     text,
  consent_given               boolean NOT NULL DEFAULT false,
  agreement_version           text,
  agreement_accepted_at       timestamptz,
  agreement_signatory_name    text,
  assigned_to                 uuid REFERENCES profiles(id) ON DELETE SET NULL,
  metadata                    jsonb DEFAULT '{}'::jsonb,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_status_created ON leads (status, created_at DESC);
CREATE INDEX idx_leads_partner_status ON leads (partner_id, status);
CREATE UNIQUE INDEX idx_leads_ref ON leads (lead_ref);

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Eligibility checks (CRB integration results)
-- =========================================================
CREATE TABLE eligibility_checks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  crb_provider text NOT NULL,
  score        integer,
  decision     text,
  reason       text,
  raw_response jsonb,
  checked_at   timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- Device enrollments (locking/management state)
-- =========================================================
CREATE TABLE device_enrollments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id          uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  imei             text NOT NULL,
  dp_amount        numeric(12,2),
  dp_proof_url     text,
  knox_status      text,
  payjoy_status    text,
  goupil_relock_time timestamptz,
  enrolled_at      timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_device_enrollments_updated_at
  BEFORE UPDATE ON device_enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- KYC evidence (Know Your Customer documents)
-- =========================================================
CREATE TABLE kyc_evidence (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  id_front_url        text,
  id_back_url         text,
  selfie_url          text,
  unboxing_url        text,
  verification_status kyc_status NOT NULL DEFAULT 'pending',
  verified_at         timestamptz,
  verified_by         uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- =========================================================
-- Lead notes (internal annotations by staff)
-- =========================================================
CREATE TABLE lead_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_clerk_id text,
  author_name     text,
  body            text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
