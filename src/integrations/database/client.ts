/**
 * Database client abstraction layer.
 *
 * During the migration from Supabase to Cloud SQL, this module provides the
 * same query interface the UI components expect. It currently delegates to
 * Supabase under the hood. When the Cloud SQL + FastAPI backend is live,
 * swap the implementation to fetch from the API instead — no component
 * changes needed.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Product,
  Lead,
  LeadInsert,
  Profile,
  ProfileInsert,
  UserRole,
  UserRoleInsert,
} from "./types";

function getClient(): SupabaseClient {
  const url =
    (typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_URL : undefined) ??
    (typeof process !== "undefined" ? process.env?.SUPABASE_URL : undefined) ??
    (typeof import.meta !== "undefined" ? import.meta.env?.VITE_DATABASE_API_URL : undefined) ??
    "";

  const key =
    (typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY
      : undefined) ??
    (typeof process !== "undefined" ? process.env?.SUPABASE_PUBLISHABLE_KEY : undefined) ??
    (typeof import.meta !== "undefined" ? import.meta.env?.VITE_DATABASE_API_KEY : undefined) ??
    "";

  if (!url || !key) {
    throw new Error(
      "Missing database environment variables. Set VITE_SUPABASE_URL / VITE_DATABASE_API_URL and matching key in .env.local",
    );
  }

  return createClient(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _db: SupabaseClient | undefined;

export const db = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    if (!_db) _db = getClient();
    return Reflect.get(_db, prop, receiver);
  },
});

// ── Product queries ─────────────────────────────────────

export async function fetchProducts(opts?: {
  available?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let q = db.from("products").select("*");
  if (opts?.available !== undefined) q = q.eq("available", opts.available);
  q = q.order("sort_order", { ascending: true });
  if (opts?.limit) q = q.limit(opts.limit);
  const { data } = await q;
  return (data ?? []) as unknown as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await db.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as unknown as Product | null;
}

export async function fetchRecommendations(product: Product, limit = 6): Promise<Product[]> {
  const minPrice = Math.round(product.asset_price * 0.75);
  const maxPrice = Math.round(product.asset_price * 1.25);

  const { data: byCategory } = await db
    .from("products")
    .select("*")
    .eq("available", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .gte("asset_price", minPrice)
    .lte("asset_price", maxPrice)
    .order("sort_order", { ascending: true })
    .limit(limit);

  let results = (byCategory ?? []) as unknown as Product[];
  if (results.length < 4) {
    const { data: byBrand } = await db
      .from("products")
      .select("*")
      .eq("available", true)
      .eq("brand", product.brand)
      .neq("id", product.id)
      .order("sort_order", { ascending: true })
      .limit(limit);
    const seen = new Set(results.map((r) => r.id));
    for (const r of (byBrand ?? []) as unknown as Product[]) {
      if (!seen.has(r.id)) {
        results.push(r);
        seen.add(r.id);
      }
      if (results.length >= limit) break;
    }
  }
  return results.slice(0, limit);
}

// ── Lead mutations ──────────────────────────────────────

export async function insertLead(payload: LeadInsert): Promise<{ id: string } | null> {
  const { data, error } = await db.from("leads").insert(payload).select("id").maybeSingle();
  if (error) throw error;
  return data as { id: string } | null;
}

// ── Profile queries ─────────────────────────────────────

export async function findProfileByClerkId(
  clerkUserId: string,
): Promise<Pick<Profile, "id"> | null> {
  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();
  return data as Pick<Profile, "id"> | null;
}

export async function insertProfile(payload: ProfileInsert): Promise<{ id: string }> {
  const { data, error } = await db.from("profiles").insert(payload).select("id").single();
  if (error) throw error;
  return data as { id: string };
}

// ── Role queries ────────────────────────────────────────

export async function countRoles(): Promise<number> {
  const { count } = await db.from("user_roles").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function insertRole(payload: UserRoleInsert): Promise<void> {
  await db.from("user_roles").insert(payload);
}

// ── Admin queries (used by admin routes) ────────────────

export async function fetchLeads(): Promise<Lead[]> {
  const { data } = await db.from("leads").select("*").order("created_at", { ascending: false });
  return (data ?? []) as unknown as Lead[];
}

export async function fetchProfiles(): Promise<Profile[]> {
  const { data } = await db.from("profiles").select("*");
  return (data ?? []) as unknown as Profile[];
}

export async function fetchUserRoles(): Promise<UserRole[]> {
  const { data } = await db.from("user_roles").select("*");
  return (data ?? []) as unknown as UserRole[];
}

export { type Product, type Lead, type LeadInsert, type Profile, type UserRole };
