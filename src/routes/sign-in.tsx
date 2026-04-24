import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findProfileByClerkId, insertProfile, countRoles, insertRole } from "@/integrations/database/client";
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

    const clerkLikeId = `local_${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const existing = await findProfileByClerkId(clerkLikeId);

    let profileId = existing?.id;
    if (!profileId) {
      try {
        const created = await insertProfile({ clerk_user_id: clerkLikeId, email, full_name: name || email });
        profileId = created.id;
      } catch {
        setSubmitting(false);
        toast.error("Sign-in failed");
        return;
      }
    }

    const roleCount = await countRoles();
    if (roleCount === 0) {
      await insertRole({ profile_id: profileId, role: "admin_owner" });
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
