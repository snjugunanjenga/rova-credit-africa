import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, Smartphone, ShieldCheck, Wallet, Users,
  Search as SearchIcon, ClipboardCheck, Banknote, PackageCheck,
  HandCoins, MessageSquare, Headphones, Calculator, Shield, FileCheck2, LockKeyhole,
  CircleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SiteShell } from "@/components/site/SiteShell";
import { BrandLogo } from "@/components/site/BrandLogo";
import { ProductCard } from "@/components/site/ProductCard";
import type { ProductCardData } from "@/components/site/ProductCard";
import { fetchProducts } from "@/integrations/database/client";
import { formatUGX, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const TESTIMONIALS = [
  {
    name: "Namugga Christine",
    role: "Boutique owner — Owino Market, Kampala",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
    quote:
      "I got my Samsung A15 with just UGX 147,500 down. My business is now on WhatsApp.",
  },
  {
    name: "Ssemwogerere Robert",
    role: "Boda boda rider — Wakiso",
    photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&q=80",
    quote:
      "RovaCredit gave me a phone when no bank would. I pay weekly through MoMo.",
  },
  {
    name: "Akello Grace Lamwaka",
    role: "Salon owner — Gulu",
    photo: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=200&q=80",
    quote: "Three phones for my staff on flexible terms. Easiest financing I've used.",
  },
  {
    name: "Mukasa Joseph Kintu",
    role: "SME retailer — Mbarara",
    photo: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&q=80",
    quote:
      "Partnered with RovaCredit to offer phone financing to my customers. Game changer.",
  },
  {
    name: "Nabirye Esther",
    role: "University student — Makerere",
    photo: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=200&q=80",
    quote: "Got my A25 5G for school. Pay-as-I-earn from my side hustle.",
  },
  {
    name: "Tumusiime Patrick Byaruhanga",
    role: "Farmer cooperative leader — Kabale",
    photo: "https://images.unsplash.com/photo-1536763225213-b5592b5e0a8e?w=200&q=80",
    quote:
      "We financed 20 phones for our cooperative members. RovaCredit understood us.",
  },
];

function HomePage() {
  const [loanAmount, setLoanAmount] = useState(700000);
  const [loanWeeks, setLoanWeeks] = useState(52);
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => fetchProducts({ available: true, limit: 8 }),
  });

  const weeklyPayment = useMemo(
    () => Math.ceil((loanAmount * 1.12) / loanWeeks),
    [loanAmount, loanWeeks],
  );
  const totalRepayment = weeklyPayment * loanWeeks;
  const estimatedDeposit = Math.ceil(loanAmount * 0.15);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              🇺🇬 Uganda-first · Kenya · Tanzania · Rwanda
            </p>
            <div className="mb-6 max-w-[180px] rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur">
              <BrandLogo light />
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Own your phone today. <span className="text-success">Pay flexibly.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/90 md:text-lg">
              Pan-African asset financing for smartphones — powered by MTN MoMo and Airtel Money.
              Apply in minutes, get approved on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
                <Link to="/marketplace">
                  Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={whatsappLink("Hello RovaCredit, I'd like to know more about phone financing.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
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
            <div className="mb-4 overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-elegant">
              <img
                src="https://media.giphy.com/media/i93FlNqwdRcSscMpxb/giphy.gif"
                alt="Shopper in a phone shop scrolling with a Samsung phone display"
                className="h-44 w-full object-cover md:h-56"
              />
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-elegant backdrop-blur-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Calculator className="h-4 w-4" /> Phone Loan Calculator
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/85">
                  <span>Loan amount</span>
                  <span className="font-semibold text-white">{formatUGX(loanAmount)}</span>
                </div>
                <Slider
                  min={100000}
                  max={2500000}
                  step={10000}
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0] ?? 700000)}
                  aria-label="Loan amount"
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/85">
                  <span>Loan term</span>
                  <span className="font-semibold text-white">{loanWeeks} weeks</span>
                </div>
                <Slider
                  min={26}
                  max={104}
                  step={2}
                  value={[loanWeeks]}
                  onValueChange={(value) => setLoanWeeks(value[0] ?? 52)}
                  aria-label="Loan term in weeks"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-center text-xs uppercase tracking-wider text-primary-foreground/70">
                  Weekly Payment
                </p>
                <p className="mt-1 text-center text-3xl font-bold text-white">
                  {formatUGX(weeklyPayment)}
                  <span className="ml-1 text-sm font-medium text-primary-foreground/80">/week</span>
                </p>
                <p className="mt-1 text-center text-xs text-primary-foreground/70">
                  Total: {formatUGX(totalRepayment)}
                </p>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-black/15">
                <img
                  src="https://media.giphy.com/media/i93FlNqwdRcSscMpxb/giphy.gif"
                  alt="Shopper at a phone shop scrolling while Samsung phones are displayed"
                  className="h-44 w-full object-cover"
                />
                <div className="flex items-center justify-between bg-black/25 px-3 py-2 text-xs text-primary-foreground/85">
                  <span>Live shopper moment</span>
                  <span>Samsung display</span>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-primary-foreground/80">
                Estimated deposit from <span className="font-semibold text-white">{formatUGX(estimatedDeposit)}</span>
              </p>

              <Button asChild className="mt-5 w-full bg-success text-success-foreground hover:bg-success/90">
                <Link to="/marketplace">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Why RovaCredit Africa</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <Pillar Icon={Smartphone} title="Latest devices" desc="Samsung, Tecno, Infinix, iPhone, Xiaomi — all in one marketplace." />
          <Pillar Icon={Wallet} title="Mobile-money native" desc="Pay your installments via MTN MoMo or Airtel Money — no bank visit needed." />
          <Pillar Icon={ShieldCheck} title="Compliant & safe" desc="Aligned with Uganda DPPA & Kenya DPA. Your data stays protected." />
          <Pillar Icon={Users} title="Built for SMEs" desc="Finance phones for your staff or cooperative — flexible bulk terms." />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            From browsing to ringing — typically same day.
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            <Step n={1} Icon={SearchIcon} title="Browse" desc="Pick your phone from 48+ models across Samsung, Tecno, Infinix, iPhone &amp; Xiaomi." />
            <Step n={2} Icon={ClipboardCheck} title="Apply" desc="2-minute eligibility check — we tell you your deposit % before you submit." />
            <Step n={3} Icon={Banknote} title="Pay deposit" desc="5%–25% deposit via MTN MoMo or Airtel Money — no bank visit needed." />
            <Step n={4} Icon={PackageCheck} title="Get your phone" desc="Collect at any partner shop. Repay weekly or daily for up to 12 months." />
          </div>
        </div>
      </section>

      {/* Eligibility banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-success/15 p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Transparent eligibility
              </p>
              <h3 className="mt-3 text-2xl font-bold">Your deposit is 5% – 25%, based on your profile.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We score your income, employment and repayment cadence into 5 transparent tiers. No surprises — you see your deposit and weekly payment before you submit.
              </p>
              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs font-medium">
                <Tier label="A" pct="5%" />
                <Tier label="B" pct="10%" />
                <Tier label="C" pct="15%" />
                <Tier label="D" pct="20%" />
                <Tier label="E" pct="25%" />
              </div>
            </div>
            <Button asChild size="lg">
              <Link to="/marketplace">
                Check my eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured devices</h2>
              <p className="mt-1 text-muted-foreground">Hand-picked phones with flexible UGX terms.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/marketplace">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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

      {/* Legal and compliance quick summary */}
      <section id="compliance" className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Fintech legal and data compliance
            </span>
            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Uganda, Kenya, Tanzania, Rwanda
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight">
            Built for responsible lending, transparent terms, and secure data practices.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Our onboarding and repayment workflows are designed to respect country-level data protection rules,
            explicit consent, and fair-credit disclosures for East African markets.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <LegalPill
              icon={LockKeyhole}
              title="Data protection by design"
              detail="Consent-led processing, data minimization, and secure retention aligned to regional privacy obligations."
            />
            <LegalPill
              icon={FileCheck2}
              title="Consumer credit transparency"
              detail="Pricing, repayments, and late-payment handling are disclosed with clear terms before confirmation."
            />
            <LegalPill
              icon={Shield}
              title="Cross-market compliance baseline"
              detail="Operational controls mapped to Uganda DPPA, Kenya DPA, Tanzania PDPA, and Rwanda privacy frameworks."
            />
          </div>
          <div className="mt-5 rounded-xl border border-warning/40 bg-warning/10 p-4">
            <p className="flex items-start gap-2 text-sm text-warning-foreground">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              Country privacy and credit rules evolve. Customers should review local terms and disclosures,
              and RovaCredit updates policies as regulations change across East African markets.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/legal/privacy">Privacy policy</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/legal/data-practices">Data practices</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/legal/credit-disclosure">Credit disclosure</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Become a sales partner */}
      <section className="bg-sidebar py-16 text-sidebar-foreground">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Become a sales partner</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sidebar-foreground/80">
              Run a shop, SACCO or SME? Sell phones on credit on our behalf — get your processing fee in full on the day, collect customer deposits via your MoMo merchant line. We handle credit, collections and support.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PartnerPerk Icon={HandCoins} title="Paid same day" desc="Full processing fee paid the day each sale is approved." />
            <PartnerPerk Icon={MessageSquare} title="MoMo deposits" desc="Collect 5%–25% customer deposit via your MoMo merchant line." />
            <PartnerPerk Icon={Headphones} title="We do the rest" desc="Credit risk, recovery, customer support — all on us. 1-year plans, daily or weekly." />
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
              <Link to="/partners">
                Apply to partner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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

function Step({ n, Icon, title, desc }: { n: number; Icon: typeof Smartphone; title: string; desc: string }) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-6 shadow-card">
      <span className="absolute -top-3 left-6 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
        Step {n}
      </span>
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Tier({ label, pct }: { label: string; pct: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-2 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Tier {label}</p>
      <p className="mt-1 text-lg font-bold text-primary">{pct}</p>
    </div>
  );
}

function PartnerPerk({ Icon, title, desc }: { Icon: typeof Smartphone; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-6">
      <Icon className="h-6 w-6 text-success" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-sidebar-foreground/80">{desc}</p>
    </div>
  );
}

function LegalPill({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Shield;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <h4 className="mt-2 font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
