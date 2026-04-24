-- Migration 001: Enums and PostgreSQL extensions
-- Target: Cloud SQL PostgreSQL 16
-- Description: Create all enum types and enable required extensions

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum: application roles
CREATE TYPE app_role AS ENUM (
  'admin_owner',
  'developer',
  'analyst',
  'marketer',
  'partner'
);

-- Enum: lead lifecycle
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'approved',
  'disbursed',
  'rejected',
  'defaulted',
  'converted',
  'lost'
);

-- Enum: lead acquisition channel
CREATE TYPE lead_source AS ENUM (
  'marketplace',
  'partner',
  'direct',
  'dsr',
  'web'
);

-- Enum: product tier
CREATE TYPE product_category AS ENUM (
  'budget',
  'mid-range',
  'flagship'
);

-- Enum: partner onboarding state
CREATE TYPE partner_status AS ENUM (
  'pending',
  'approved',
  'suspended',
  'terminated'
);

-- Enum: agreement lifecycle
CREATE TYPE agreement_status AS ENUM (
  'draft',
  'sent',
  'signed',
  'acknowledged',
  'expired',
  'revoked'
);

-- Enum: KYC verification state
CREATE TYPE kyc_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'expired'
);

-- Enum: repayment state
CREATE TYPE repayment_status AS ENUM (
  'scheduled',
  'paid',
  'overdue',
  'defaulted',
  'waived'
);

-- Enum: data subject request type (DPPA/DPA)
CREATE TYPE dsr_type AS ENUM (
  'access',
  'erase',
  'rectify',
  'object'
);

-- Enum: data subject request state
CREATE TYPE dsr_status AS ENUM (
  'received',
  'processing',
  'fulfilled',
  'denied'
);
