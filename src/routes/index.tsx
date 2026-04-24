import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight, Smartphone, ShieldCheck, Wallet, Users,
  Search as SearchIcon, ClipboardCheck, Banknote, PackageCheck,
  HandCoins, MessageSquare, Headphones, Calculator, Shield, FileCheck2, LockKeyhole,
  CircleAlert, Clock3, MapPin, Sparkles, WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchProducts } from "@/integrations/database/client";
import { formatUGX, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const trustItems = [
  { icon: ShieldCheck, label: "Transparent pricing" },
  { icon: MapPin, label: "Partner pickup hubs" },
  { icon: WalletCards, label: "Mobile money repayments" },
];

const signalCards = [
  {
    label: "Decision speed",
    value: "15 min",
    note: "Structured verification with clear next-step routing.",
  },
  {
    label: "Starting deposit",
    value: "25%",
    note: "Designed around trader cash flow instead of rigid upfront cost.",
  },
  {
    label: "Current rollout",
    value: "Uganda",
    note: "Built to scale into East African lending operations.",
  },
];

function Hero() {
  return (
    <section className="bg-[#0b0f1a] relative overflow-hidden pb-24 pt-32 text-white lg:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.05),transparent_22%),radial-gradient(circle_at_80%_24%,rgba(104,84,255,0.15),transparent_20%)]" />
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-12 h-96 w-96 rounded-full bg-[rgba(110,79,255,0.1)] blur-3xl" />
      
      <div className="mx-auto relative grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <Clock3 className="h-4 w-4" /> Uganda-first asset finance
          </span>
          <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.06em]">
            Own your phone today. Pay Flexibly.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
            Rova Credit turns asset financing into a cleaner operating system for merchants, riders, and growth-stage SMEs, with digital onboarding, fast decisions, and partner pickup built into one premium flow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/marketplace"
              className="bg-[var(--landing-purple)] text-white hover:bg-[var(--landing-purple)]/90 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all shadow-lg"
            >
              Browse Assets <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/sign-up"
              className="border border-white/10 bg-white/5 text-white hover:bg-white/10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all"
            >
              Start Account <Sparkles className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/5 px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 text-white/60" />
                  {item.label}
                </div>
              );
            })}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {signalCards.map((card) => (
              <div
                key={card.label}
                className="bg-white/5 border border-white/5 rounded-[1.55rem] p-6 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-white">
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  {card.note}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="border border-white/10 bg-white/5 relative mx-auto max-w-xl rounded-[2.2rem] p-6 text-white backdrop-blur-md shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-white/80">
                <div className="rounded-xl bg-white/10 p-2">
                  <WalletCards className="h-5 w-5" />
                </div>
                Financing pulse
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Live flow
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-[#0b0f1a] border border-white/5 rounded-[1.6rem] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/50"> Asset profile </p>
                    <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-white"> Samsung A25 5G </p>
                    <p className="mt-2 text-sm leading-6 text-white/50"> Pickup-ready routing, down-payment clarity, and weekly repayment visibility before approval. </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/5 px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/40"> Deposit </p>
                    <p className="mt-1 text-lg font-bold text-white"> UGX 220,500 </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-[#0b0f1a] border border-white/5 rounded-[1.4rem] p-5">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/60">
                    <span>Application readiness</span>
                    <span className="font-semibold text-white">82%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 w-[82%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/40"> ID, contact, and repayment preference captured. </p>
                </div>
                <div className="bg-[#0b0f1a] border border-white/5 rounded-[1.4rem] p-5">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/60">
                    <span>Weekly repayment</span>
                    <span className="font-semibold text-white">UGX 27,100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 w-[61%] rounded-full bg-[var(--landing-cta-green)] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/40"> Structured over a 52-week operating cycle. </p>
                </div>
              </div>
              <div className="bg-[#0b0f1a] border border-white/5 rounded-[1.6rem] p-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-white/50"> What the platform coordinates </p>
                    <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-white"> 3 layers </p>
                  </div>
                  <div className="text-right text-xs leading-5 text-white/50 space-y-1">
                    <p>Verification</p>
                    <p>Credit decision</p>
                    <p>Partner pickup</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/sign-up"
                  className="bg-[var(--landing-purple)] text-white hover:bg-[var(--landing-purple)]/90 flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold transition-all shadow-lg"
                >
                  Start Financing Flow <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Talk to a Specialist
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
      <Hero />

      {/* Why */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <h2 className="mb-12 text-center text-4xl font-extrabold tracking-tight">Why Rova Credit Africa</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <Pillar Icon={Smartphone} title="Latest devices" desc="Samsung, Tecno, Infinix, iPhone, Xiaomi — all in one marketplace." />
          <Pillar Icon={Wallet} title="Mobile-money native" desc="Pay your installments via MTN MoMo or Airtel Money — no bank visit needed." />
          <Pillar Icon={ShieldCheck} title="Compliant & safe" desc="Aligned with Uganda DPPA & Kenya DPA. Your data stays protected." />
          <Pillar Icon={Users} title="Built for SMEs" desc="Finance phones for your staff or cooperative — flexible bulk terms." />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#0b0f1a]/50 py-24 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-2 text-center text-4xl font-extrabold tracking-tight">How it works</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
            From browsing to ringing — typically same day.
          </p>
          <div className="grid gap-8 md:grid-cols-4">
            <Step n={1} Icon={SearchIcon} title="Browse" desc="Pick your phone from 48+ models across Samsung, Tecno, Infinix, iPhone &amp; Xiaomi." />
            <Step n={2} Icon={ClipboardCheck} title="Apply" desc="2-minute eligibility check — we tell you your deposit % before you submit." />
            <Step n={3} Icon={Banknote} title="Pay deposit" desc="5%–25% deposit via MTN MoMo or Airtel Money — no bank visit needed." />
            <Step n={4} Icon={PackageCheck} title="Get your phone" desc="Collect at any partner shop. Repay weekly or daily for up to 12 months." />
          </div>
        </div>
      </section>

      {/* Eligibility banner */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/20 via-gray-900 to-green-900/10 p-8 md:p-12 shadow-2xl">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-400">
                Transparent eligibility
              </p>
              <h3 className="mt-6 text-3xl font-extrabold tracking-tight">Your deposit is 5% – 25%, based on your profile.</h3>
              <p className="mt-4 text-lg text-white/60 leading-relaxed">
                We score your income, employment and repayment cadence into 5 transparent tiers. No surprises — you see your deposit and weekly payment before you submit.
              </p>
              <div className="mt-8 grid grid-cols-5 gap-3 text-center text-[10px] font-bold tracking-widest uppercase text-white/40">
                <Tier label="A" pct="5%" />
                <Tier label="B" pct="10%" />
                <Tier label="C" pct="15%" />
                <Tier label="D" pct="20%" />
                <Tier label="E" pct="25%" />
              </div>
            </div>
            <Button asChild size="lg" className="bg-[var(--landing-purple)] text-white hover:bg-[var(--landing-purple)]/90 h-14 px-8 rounded-full font-bold">
              <Link to="/marketplace">
                Check my eligibility <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured devices */}
      <section id="featured" className="bg-[#0b0f1a]/30 py-24 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">Featured devices</h2>
              <p className="mt-4 text-xl text-white/60">Hand-picked phones with flexible UGX terms.</p>
            </div>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full px-6">
              <Link to="/marketplace">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <h2 className="mb-12 text-center text-4xl font-extrabold tracking-tight">Trusted by Ugandans</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="flex flex-col rounded-3xl border border-white/10 bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-white/80">"{t.quote}"</p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                <img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-white/10" />
                <div>
                  <p className="text-base font-bold text-white">{t.name}</p>
                  <p className="text-sm text-white/40">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Legal and compliance quick summary */}
      <section id="compliance" className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-gray-900/50 p-8 shadow-2xl md:p-12 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              Fintech legal and data compliance
            </span>
            <span className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400">
              Uganda, Kenya, Tanzania, Rwanda
            </span>
          </div>
          <h3 className="mt-8 text-3xl font-extrabold tracking-tight">
            Built for responsible lending, transparent terms, and secure data practices.
          </h3>
          <p className="mt-4 text-lg text-white/60 leading-relaxed max-w-3xl">
            Our onboarding and repayment workflows are designed to respect country-level data protection rules,
            explicit consent, and fair-credit disclosures for East African markets.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <p className="flex items-start gap-3 text-sm text-amber-200/80 leading-relaxed">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <span>
                Country privacy and credit rules evolve. Customers should review local terms and disclosures,
                and RovaCredit updates policies as regulations change across East African markets.
              </span>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full px-6">
              <Link to="/legal/privacy">Privacy policy</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full px-6">
              <Link to="/legal/data-practices">Data practices</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-full px-6">
              <Link to="/legal/credit-disclosure">Credit disclosure</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Become a sales partner */}
      <section className="bg-gray-900 py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">Become a sales partner</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
              Run a shop, SACCO or SME? Sell phones on credit on our behalf — get your processing fee in full on the day, collect customer deposits via your MoMo merchant line. We handle credit, collections and support.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <PartnerPerk Icon={HandCoins} title="Paid same day" desc="Full processing fee paid the day each sale is approved." />
            <PartnerPerk Icon={MessageSquare} title="MoMo deposits" desc="Collect 5%–25% customer deposit via your MoMo merchant line." />
            <PartnerPerk Icon={Headphones} title="We do the rest" desc="Credit risk, recovery, customer support — all on us. 1-year plans, daily or weekly." />
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" className="bg-[var(--landing-purple)] text-white hover:bg-[var(--landing-purple)]/90 h-14 px-10 rounded-full font-bold shadow-lg">
              <Link to="/partners">
                Apply to partner <ArrowRight className="ml-2 h-5 w-5" />
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
    <div className="rounded-3xl border border-white/10 bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm hover:border-white/20 transition-all group">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, Icon, title, desc }: { n: number; Icon: typeof Smartphone; title: string; desc: string }) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gray-900/50 p-8 shadow-xl backdrop-blur-sm hover:border-white/20 transition-all group">
      <span className="absolute -top-3 left-8 rounded-full bg-[var(--landing-purple)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
        Step {n}
      </span>
      <div className="mb-6 mt-2">
        <Icon className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{desc}</p>
    </div>
  );
}

function Tier({ label, pct }: { label: string; pct: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-4 backdrop-blur-sm">
      <p className="text-white/40 mb-2">Tier {label}</p>
      <p className="text-2xl font-black text-white">{pct}</p>
    </div>
  );
}

function PartnerPerk({ Icon, title, desc }: { Icon: typeof Smartphone; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 hover:bg-white/10 transition-all">
      <div className="mb-6 h-12 w-12 flex items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{desc}</p>
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
    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all">
      <div className="mb-4 text-indigo-400">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-white/50 leading-relaxed">{detail}</p>
    </div>
  );
}

