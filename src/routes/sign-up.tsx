import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/sign-up")({
  head: () => ({ meta: [{ title: "Sign up — RovaCredit Africa Admin" }] }),
  component: () => (
    <SiteShell>
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Admin access is invite-only</h1>
        <p className="mt-2 text-muted-foreground">Use the same form as sign-in. The first user becomes admin_owner; subsequent users need a role granted by an existing admin_owner.</p>
        <Link to="/sign-in" className="mt-4 inline-block text-primary underline">Go to sign in</Link>
      </section>
    </SiteShell>
  ),
});
