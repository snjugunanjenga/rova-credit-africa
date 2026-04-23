const KEY = "rovacredit_admin_session_v1";

export interface LocalAdmin {
  clerkUserId: string;
  profileId: string;
  email: string;
  name: string;
}

export function setLocalAdmin(a: LocalAdmin) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function getLocalAdmin(): LocalAdmin | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as LocalAdmin; } catch { return null; }
}

export function clearLocalAdmin() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
