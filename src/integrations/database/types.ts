export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = "admin_owner" | "developer" | "analyst" | "marketer" | "partner";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "approved"
  | "disbursed"
  | "rejected"
  | "defaulted"
  | "converted"
  | "lost";
export type LeadSource = "marketplace" | "partner" | "direct" | "dsr" | "web";
export type ProductCategory = "budget" | "mid-range" | "flagship";

export interface Product {
  id: string;
  name: string;
  brand: string;
  asset_model: string | null;
  category: ProductCategory;
  asset_price: number;
  down_payment: number;
  price_label: string | null;
  image_url: string | null;
  alt_text: string | null;
  ram: string | null;
  storage: string | null;
  specs: string[] | null;
  specifications: Json | null;
  badges: string[] | null;
  rating: number | null;
  available: boolean;
  sort_order: number;
  sanity_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  lead_ref: string | null;
  source: LeadSource;
  status: LeadStatus;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  id_type: string | null;
  monthly_income: string | null;
  employment_type: string | null;
  latitude: number | null;
  longitude: number | null;
  location_label: string | null;
  eligibility_tier: string | null;
  eligibility_down_payment_pct: number | null;
  computed_down_payment: number | null;
  repayment_cadence: string | null;
  product_id: string | null;
  product_snapshot: Json | null;
  partner_id: string | null;
  subject: string | null;
  message: string | null;
  consent_given: boolean;
  agreement_version: string | null;
  agreement_accepted_at: string | null;
  agreement_signatory_name: string | null;
  assigned_to: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  source: LeadSource;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  id_type?: string | null;
  monthly_income?: string | null;
  employment_type?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_label?: string | null;
  eligibility_tier?: string | null;
  eligibility_down_payment_pct?: number | null;
  computed_down_payment?: number | null;
  repayment_cadence?: string | null;
  product_id?: string | null;
  product_snapshot?: Json | null;
  subject?: string | null;
  message?: string | null;
  consent_given: boolean;
  agreement_version?: string | null;
  agreement_accepted_at?: string | null;
  agreement_signatory_name?: string | null;
  metadata?: Json | null;
}

export interface Profile {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  clerk_user_id: string;
  email?: string | null;
  full_name?: string | null;
}

export interface UserRole {
  id: string;
  profile_id: string;
  role: AppRole;
  created_at: string;
}

export interface UserRoleInsert {
  profile_id: string;
  role: AppRole;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  payload: Json | null;
  session_id: string | null;
  path: string | null;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_clerk_id: string | null;
  author_name: string | null;
  body: string;
  created_at: string;
}
