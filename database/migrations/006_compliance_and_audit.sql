-- Migration 006: Audit events, consent records, DSR requests, analytics
-- Depends on: 002_core_tables

-- =========================================================
-- Audit events (append-only compliance trail)
-- =========================================================
CREATE TABLE audit_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity        text NOT NULL,
  entity_id     uuid NOT NULL,
  event_type    text NOT NULL,
  payload_json  jsonb DEFAULT '{}'::jsonb,
  ip_address    inet,
  user_agent    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_events (entity, entity_id, created_at DESC);

-- =========================================================
-- Consent records (DPPA/DPA — one row per change)
-- =========================================================
CREATE TABLE consent (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id   uuid NOT NULL,
  consent_type text NOT NULL,
  granted      boolean NOT NULL,
  lawful_basis text,
  ip_address   inet,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_subject ON consent (subject_id, consent_type);

-- =========================================================
-- Data Subject Rights requests (Uganda DPPA / Kenya DPA)
-- =========================================================
CREATE TABLE dsr_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         dsr_type NOT NULL,
  subject_id   uuid NOT NULL,
  status       dsr_status NOT NULL DEFAULT 'received',
  notes        text,
  fulfilled_at timestamptz,
  evidence_url text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_dsr_pending ON dsr_requests (status) WHERE status != 'fulfilled';

-- =========================================================
-- Analytics events (event stream)
-- =========================================================
CREATE TABLE analytics_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  payload    jsonb DEFAULT '{}'::jsonb,
  session_id text,
  path       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_created ON analytics_events (created_at);
