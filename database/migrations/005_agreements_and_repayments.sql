-- Migration 005: Agreements and repayments
-- Depends on: 003_partners, 004_leads_and_onboarding

-- =========================================================
-- Agreements (immutable signed snapshots)
-- =========================================================
CREATE TABLE agreements (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id          uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  partner_id       uuid REFERENCES partners(id) ON DELETE SET NULL,
  version          text NOT NULL,
  terms_text       text NOT NULL,
  terms_checksum   text NOT NULL,
  delivery_channel text,
  sent_at          timestamptz,
  signed_at        timestamptz,
  acknowledged_at  timestamptz,
  status           agreement_status NOT NULL DEFAULT 'draft',
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- Repayments (schedule and tracking)
-- =========================================================
CREATE TABLE repayments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  due_date       date NOT NULL,
  amount_due     numeric(12,2) NOT NULL,
  amount_paid    numeric(12,2) DEFAULT 0,
  paid_at        timestamptz,
  payment_method text,
  payment_ref    text,
  status         repayment_status NOT NULL DEFAULT 'scheduled',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_repayments_lead_due ON repayments (lead_id, due_date);
CREATE INDEX idx_repayments_overdue ON repayments (status) WHERE status IN ('overdue', 'defaulted');
