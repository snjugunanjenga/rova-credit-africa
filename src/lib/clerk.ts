// Clerk publishable key — frontend only.
// In Lovable preview without a real Clerk key configured, the app falls back
// to a "guest dev mode" that still lets admin users sign in by entering an
// email; the email is mirrored into the profiles table and roles can be granted
// from the admin Users page.
export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ?? "";

export const HAS_CLERK = CLERK_PUBLISHABLE_KEY.length > 0;
