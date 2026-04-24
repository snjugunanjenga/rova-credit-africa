-- Migration 002: Core tables — profiles, user_roles, products, product_images
-- Depends on: 001_enums_and_extensions

-- Auto-update trigger function (shared by all tables with updated_at)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- Profiles (mirrors Clerk user)
-- =========================================================
CREATE TABLE profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,
  email         text,
  display_name  text,
  avatar_url    text,
  country       text DEFAULT 'UG',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- User roles (separate table — RBAC best practice)
-- =========================================================
CREATE TABLE user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       app_role NOT NULL,
  granted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, role)
);

-- Security-definer helpers to avoid recursive RLS lookups
CREATE OR REPLACE FUNCTION has_role(_clerk_user_id text, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM user_roles ur
    JOIN profiles p ON p.id = ur.profile_id
    WHERE p.clerk_user_id = _clerk_user_id
      AND ur.role = _role
  )
$$;

CREATE OR REPLACE FUNCTION has_any_role(_clerk_user_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM user_roles ur
    JOIN profiles p ON p.id = ur.profile_id
    WHERE p.clerk_user_id = _clerk_user_id
  )
$$;

-- =========================================================
-- Products (transactional pricing data)
-- =========================================================
CREATE TABLE products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  brand          text NOT NULL,
  asset_model    text,
  category       product_category NOT NULL DEFAULT 'budget',
  asset_price    numeric(12,2) NOT NULL,
  down_payment   numeric(12,2) NOT NULL,
  price_label    text,
  image_url      text,
  alt_text       text,
  ram            text,
  storage        text,
  specs          text[] DEFAULT '{}',
  specifications jsonb,
  badges         text[] DEFAULT '{}',
  rating         numeric(2,1) DEFAULT 4.5,
  available      boolean NOT NULL DEFAULT true,
  sort_order     integer NOT NULL DEFAULT 0,
  sanity_ref     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_available_sort ON products (available, sort_order);
CREATE INDEX idx_products_sanity_ref ON products (sanity_ref) WHERE sanity_ref IS NOT NULL;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- Product images (multi-image support)
-- =========================================================
CREATE TABLE product_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        text NOT NULL,
  alt_text   text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
