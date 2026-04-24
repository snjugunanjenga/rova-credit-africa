import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — RovaCredit Africa" },
      { name: "description", content: "Press resources and media contact for RovaCredit Africa." },
    ],
  }),
  component: PressPage,
});

function PressPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Press</h1>
        <p className="mt-3 text-muted-foreground">
          For media and partnership inquiries, contact our communications desk.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Media contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Email: press@rovacredit.africa
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We respond to verified media requests within one business day.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
