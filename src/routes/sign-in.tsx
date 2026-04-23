import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { setLocalAdmin, getLocalAdmin } from "@/lib/local-admin";

export const Route = createFileRoute("/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — RovaCredit Africa Admin" }] }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getLocalAdmin()) navigate({ to: "/admin" });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    // Mirror user into profiles table (Clerk frontend-only equivalent).
    const clerkLikeId = `local_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", clerkLikeId)
      .maybeSingle();

    let profileId = existing?.id;
    if (!profileId) {
      const { data: created, error } = await supabase
        .from("profiles")
        .insert({ clerk_user_id: clerkLikeId, email, full_name: name || email })
        .select("id")
        .single();
      if (error) {
        setSubmitting(false);
        toast.error("Sign-in failed");
        return;
      }
      profileId = created.id;
    }

    // First user automatically becomes admin_owner.
    const { count } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true });
    if (!count || count === 0) {
      await supabase.from("user_roles").insert({ profile_id: profileId, role: "admin_owner" });
      toast.success("Welcome! You are the first admin (admin_owner).");
    }

    setLocalAdmin({ clerkUserId: clerkLikeId, profileId, email, name: name || email });
    setSubmitting(false);
    navigate({ to: "/admin" });
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h1 className="text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            For RovaCredit Africa staff. New here? <Link to="/sign-up" className="text-primary underline">Create account</Link>
          </p>
          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            The first person to sign in is granted <strong>admin_owner</strong> automatically. Subsequent users must be granted a role from the admin Users page.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
