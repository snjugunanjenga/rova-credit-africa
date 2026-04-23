import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/legal")({
  component: LegalLayout,
});

const LINKS = [
  { to: "/legal/privacy", label: "Privacy Policy" },
  { to: "/legal/data-practices", label: "Data Practices" },
  { to: "/legal/terms", label: "Terms of Service" },
  { to: "/legal/cookies", label: "Cookie Policy" },
  { to: "/legal/credit-disclosure", label: "Credit Disclosure" },
  { to: "/legal/partner-agreement", label: "Sales Partner Agreement" },
] as const;

function LegalLayout() {
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[220px_1fr] md:px-6">
        <aside>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</h2>
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "bg-accent text-primary font-semibold" }}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 rounded-md bg-warning/10 p-3 text-xs text-warning-foreground">
            Template content. Review with Ugandan/Kenyan legal counsel before launch.
          </p>
        </aside>
        <article className="prose prose-sm max-w-none rounded-xl border border-border bg-card p-6">
          <Outlet />
        </article>
      </div>
    </SiteShell>
  );
}
