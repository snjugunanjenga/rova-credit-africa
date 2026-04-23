import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin, Award, Handshake } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RovaCredit Africa — Financing East Africa's digital future" },
      { name: "description", content: "Founded in Kampala. RovaCredit Africa is the leading device financing platform for Uganda, Kenya, Tanzania & Rwanda." },
      { property: "og:title", content: "About RovaCredit Africa" },
      { property: "og:description", content: "Founded in Kampala. Financing East Africa's digital future." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=1200&q=80" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=1200&q=80" },
    ],
  }),
  component: AboutPage,
});

const LEADERSHIP = [
  { name: "Nakato Sarah Mukasa", role: "CEO & Co-founder", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" },
  { name: "Kato David Ssempa", role: "CTO & Co-founder", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Achieng Patricia Namugga", role: "Head of Partnerships", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { name: "Okello James Wamala", role: "Head of Credit Risk", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
];

const PARTNERS = ["MTN MoMo", "Airtel Money", "MTN Uganda", "Airtel Uganda", "Stanbic Bank Uganda", "Centenary Bank"];

function AboutPage() {
  return (
    <SiteShell>
      <section className="gradient-hero py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs">🇺🇬 Founded in Kampala</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Financing Africa's Digital Future, <span className="text-gold">One Device at a Time</span>
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/90">
              RovaCredit Africa is the leading asset-financing platform for smartphones in East Africa.
              We bridge the gap between aspiration and access — so every Ugandan, Kenyan, Tanzanian and
              Rwandan can own a phone that powers their business and life.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=900&q=80" alt="Ugandan entrepreneur using a smartphone" className="rounded-2xl shadow-elegant" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Our story</h2>
          <p className="mt-3 text-muted-foreground">
            RovaCredit Africa was founded in 2024 in Kampala, Uganda by a team of fintech operators who saw
            millions of hardworking Ugandans locked out of credit. Today we serve customers across Uganda,
            Kenya, Tanzania and Rwanda — all powered by mobile money.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Our mission</h3>
            <p className="mt-2 text-sm text-muted-foreground">Make digital tools accessible to every African through fair, flexible asset financing.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Our vision</h3>
            <p className="mt-2 text-sm text-muted-foreground">A continent where credit history is built on trust, mobile money and merit — not collateral.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Leadership team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((p) => (
              <div key={p.name} className="rounded-xl border border-border bg-card p-5 text-center">
                <img src={p.photo} alt={p.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                <h3 className="mt-3 font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">Our partners</h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <div key={p} className="flex h-20 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold">
              {p}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sidebar py-16 text-sidebar-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Compliance &amp; trust</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Trust Icon={ShieldCheck} title="Data Protection" desc="Aligned with Uganda DPPA 2019 and Kenya DPA 2019. Named DPO." />
            <Trust Icon={Award} title="Licensed" desc="UCC-registered and Bank of Uganda compliance pending (placeholder)." />
            <Trust Icon={Handshake} title="Mobile-money first" desc="Direct integrations with MTN MoMo and Airtel Money for instant repayment." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Coverage</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Coverage flag="🇺🇬" name="Uganda" status="Primary market" />
          <Coverage flag="🇰🇪" name="Kenya" status="Active" />
          <Coverage flag="🇹🇿" name="Tanzania" status="Expanding" />
          <Coverage flag="🇷🇼" name="Rwanda" status="Expanding" />
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/partners"><Button size="lg">Partner with us</Button></Link>
          <Link to="/marketplace"><Button size="lg" variant="outline">Browse marketplace</Button></Link>
        </div>
      </section>
    </SiteShell>
  );
}

function Trust({ Icon, title, desc }: { Icon: typeof ShieldCheck; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-5">
      <Icon className="h-6 w-6 text-sidebar-primary" />
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-sidebar-foreground/80">{desc}</p>
    </div>
  );
}
function Coverage({ flag, name, status }: { flag: string; name: string; status: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-3xl">{flag}</div>
      <h3 className="mt-2 font-semibold">{name}</h3>
      <p className="text-xs text-muted-foreground">
        <MapPin className="mr-1 inline h-3 w-3" />
        {status}
      </p>
    </div>
  );
}
