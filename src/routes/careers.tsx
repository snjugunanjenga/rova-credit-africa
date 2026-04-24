import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Rocket, Users } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — RovaCredit" },
      {
        name: "description",
        content:
          "Join RovaCredit and help build inclusive fintech infrastructure for Uganda and East Africa.",
      },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <SiteShell>
      <section className="gradient-hero py-16 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Build the future of responsible fintech in East Africa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            We are hiring operators, builders, and community-first problem solvers.
            If you care about fair credit access, we would love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <CareerValue
            icon={Rocket}
            title="Mission-driven delivery"
            description="Ship products that unlock economic opportunity for merchants and households."
          />
          <CareerValue
            icon={Users}
            title="Regional impact"
            description="Collaborate with teams across Uganda, Kenya, Tanzania, and Rwanda."
          />
          <CareerValue
            icon={Briefcase}
            title="Ownership culture"
            description="Take end-to-end responsibility for products, systems, and customer outcomes."
          />
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <h2 className="text-2xl font-bold tracking-tight">Current openings</h2>
          <p className="mt-3 text-muted-foreground">
            We are preparing role listings. Share your profile and preferred role area and
            our team will get back to you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/contact">Submit your profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about">Learn about RovaCredit</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function CareerValue({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Rocket;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-card">
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </article>
  );
}
