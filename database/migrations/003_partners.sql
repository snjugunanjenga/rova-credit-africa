-- Migration 003: Partners and partner documents
-- Depends on: 002_core_tables

-- =========================================================
-- Partners (business entities submitting client applications)
-- =========================================================
CREATE TABLE partners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  tin               text,
  momo_merchant_code text,
  contact_phone     text,
  contact_email     text,
  address_label     text,
  latitude          float8,
  longitude         float8,
  owner_id_number   text,
  foot_traffic      text,
  risk_tier         text,
  status            partner_status NOT NULL DEFAULT 'pending',
  approved_by       uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_status ON partners (status);

CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Partner documents
-- =========================================================
CREATE TABLE partner_docs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  doc_type    text NOT NULL,
  file_url    text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
