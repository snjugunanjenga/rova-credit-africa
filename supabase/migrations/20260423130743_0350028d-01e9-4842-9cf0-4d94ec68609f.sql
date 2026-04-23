ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specifications jsonb;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS location_label text,
  ADD COLUMN IF NOT EXISTS eligibility_tier text,
  ADD COLUMN IF NOT EXISTS eligibility_down_payment_pct numeric,
  ADD COLUMN IF NOT EXISTS computed_down_payment numeric,
  ADD COLUMN IF NOT EXISTS repayment_cadence text,
  ADD COLUMN IF NOT EXISTS employment_type text,
  ADD COLUMN IF NOT EXISTS agreement_version text,
  ADD COLUMN IF NOT EXISTS agreement_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS agreement_signatory_name text,
  ADD COLUMN IF NOT EXISTS lead_ref text GENERATED ALWAYS AS ('RC-' || upper(substr(id::text, 1, 4))) STORED;