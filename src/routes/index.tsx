import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Smartphone, ShieldCheck, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import type { ProductCardData } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const TESTIMONIALS = [
  {
    name: "Namugga Christine",
    role: "Boutique owner — Owino Market, Kampala",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
    quote:
      "I got my Samsung A15 with just UGX 147,500 down. My business is now on WhatsApp.",
  },
  {
    name: "Ssemwogerere Robert",
    role: "Boda boda rider — Wakiso",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80",
    quote:
      "RovaCredit gave me a phone when no bank would. I pay weekly through MoMo.",
  },
  {
    name: "Akello Grace Lamwaka",
    role: "Salon owner — Gulu",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    quote: "Three phones for my staff on flexible terms. Easiest financing I've used.",
  },
  {
    name: "Mukasa Joseph Kintu",
    role: "SME retailer — Mbarara",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    quote:
      "Partnered with RovaCredit to offer phone financing to my customers. Game changer.",
  },
  {
    name: "Nabirye Esther",
    role: "University student — Makerere",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    quote: "Got my A25 5G for school. Pay-as-I-earn from my side hustle.",
  },
  {
    name: "Tumusiime Patrick Byaruhanga",
    role: "Farmer cooperative leader — Kabale",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    quote:
      "We financed 20 phones for our cooperative members. RovaCredit understood us.",
  },
];

function HomePage() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("sort_order", { ascending: true })
        .limit(8);
      return (data ?? []) as unknown as ProductCardData[];
    },
  });

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              🇺🇬 Uganda-first · Kenya · Tanzania · Rwanda
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Own your phone today. <span className="text-gold">Pay flexibly.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/90 md:text-lg">
              Pan-African asset financing for smartphones — powered by MTN MoMo and Airtel Money.
              Apply in minutes, get approved on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/marketplace">
                <Button size="lg" variant="secondary" className="bg-gold text-gold-foreground hover:bg-gold/90">
                  Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href={whatsappLink("Hello RovaCredit, I'd like to know more about phone financing.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
              <span>✓ MTN MoMo</span>
              <span>✓ Airtel Money</span>
              <span>✓ No hidden fees</span>
              <span>✓ Same-day approval</span>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80"
              alt="Ugandan customer using a smartphone"
              className="rounded-2xl shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Why RovaCredit Africa</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <Pillar Icon={Smartphone} title="Latest devices" desc="Samsung, Tecno, Infinix, iPhone, Xiaomi — all in one marketplace." />
          <Pillar Icon={Wallet} title="Mobile-money native" desc="Pay your installments via MTN MoMo or Airtel Money — no bank visit needed." />
          <Pillar Icon={ShieldCheck} title="Compliant & safe" desc="Aligned with Uganda DPPA & Kenya DPA. Your data stays protected." />
          <Pillar Icon={Users} title="Built for SMEs" desc="Finance phones for your staff or cooperative — flexible bulk terms." />
        </div>
      </section>

      {/* Featured */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured devices</h2>
              <p className="mt-1 text-muted-foreground">Hand-picked phones with flexible UGX terms.</p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline">View all <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Trusted by Ugandans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
              <p className="text-sm text-foreground/90">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="bg-sidebar py-16 text-sidebar-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Are you a retailer or SME?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sidebar-foreground/80">
            Offer phone financing to your customers or staff. Partner with RovaCredit Africa and tap into the largest device-credit marketplace in East Africa.
          </p>
          <div className="mt-6">
            <Link to="/partners">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Pillar({ Icon, title, desc }: { Icon: typeof Smartphone; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
