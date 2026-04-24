import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Globe,
  Handshake,
  Leaf,
  Target,
  TrendingUp,
  Users,
  PlayCircle,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RovaCredit Africa — Empowering communities & businesses" },
      {
        name: "description",
        content:
          "Rova Credit Africa is a pan-African financial solutions company focused on expanding access to capital for entrepreneurs and emerging enterprises.",
      },
    ],
  }),
  component: AboutPage,
});

const focusAreas = [
  {
    icon: BriefcaseBusiness,
    title: "Business Financing",
    description:
      "Flexible credit facilities for SMEs, startups, traders, service providers, agricultural entrepreneurs, and innovation-led businesses.",
  },
  {
    icon: TrendingUp,
    title: "Asset and Equipment Financing",
    description:
      "Financing structures that help entrepreneurs acquire productive assets, machinery, agricultural equipment, and essential digital devices.",
  },
  {
    icon: Handshake,
    title: "Venture Capital Sourcing",
    description:
      "Support for high-potential businesses through investment introductions, growth capital sourcing, and investment readiness support.",
  },
];

const impactPoints = [
  "Business expansion and job creation",
  "Financial inclusion",
  "Entrepreneurial innovation",
  "SME growth and sustainability",
  "Cross-border investment in African businesses",
];

const networkGroups = [
  "Venture capital firms",
  "Impact investment funds",
  "Private equity investors",
  "Family offices",
  "Development finance institutions",
  "Strategic financial partners",
];

const teamMembers = [
  {
    name: "Edmund Mwesigwa",
    role: "Founder & Managing Director",
    bio: "Leads Rova Credit Africa’s vision for financial inclusion, growth financing, and cross-border capital partnerships.",
  },
  {
    name: "Capital Partnerships Team",
    role: "Investor Relations & Advisory",
    bio: "Builds relationships with venture, impact, and institutional capital partners to support high-potential African businesses.",
  },
  {
    name: "Credit Operations Team",
    role: "Financing & Risk Enablement",
    bio: "Designs financing structures that reflect local market realities and keep disbursement, verification, and repayment practical.",
  },
];

export function AboutPage() {
  return (
    <SiteShell>
      <div className="landing-page flex flex-col">
        <main className="flex-1">
          <section className="bg-[#0b0f1a] py-24 text-white lg:py-32">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end md:px-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                  <Building2 className="h-4 w-4" /> Company Profile 2026
                </span>
                <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-[-0.05em] md:text-5xl lg:text-6xl">
                  Empowering communities, businesses and unlocking opportunities.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                  Rova Credit Africa is a pan-African financial solutions company focused on expanding access to capital for entrepreneurs, small businesses, and emerging enterprises across the continent.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-white/5 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60"> Vision </p>
                    <p className="mt-3 text-base leading-7 text-white/80"> Unlocking capital pathways that help African businesses grow into globally competitive enterprises. </p>
                  </div>
                  <div className="rounded-[1.4rem] bg-white/5 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60"> Mission </p>
                    <p className="mt-3 text-base leading-7 text-white/80"> Expanding access to growth financing through innovative credit models, strategic partnerships, and international investment networks. </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="py-20 bg-[#111827]">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 bg-gray-900 shadow-2xl group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer" 
                  onClick={() => window.open("https://drive.google.com/file/d/14mrg-gKy4qFV8Zyq1kTq9ym-qVKoBqYX/view?usp=drive_link", "_blank")}>
                  <div className="flex flex-col items-center gap-4">
                    <PlayCircle className="h-20 w-20 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    <span className="text-white font-semibold text-lg tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-all">Watch our story</span>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=1200&q=80" 
                  alt="Rova Credit Story Video Thumbnail" 
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_1fr] md:px-6">
              <div className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-8 lg:p-12 shadow-sm">
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-[var(--landing-purple)]">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-[var(--landing-text)]"> About Us </h2>
                <p className="mt-6 text-lg leading-8 text-[var(--landing-text-muted)]"> Rova Credit Africa operates at the intersection of financial inclusion, venture capital facilitation, and business growth financing, helping bridge the funding gap that limits the expansion of promising enterprises across Africa. </p>
                <p className="mt-6 text-lg leading-8 text-[var(--landing-text-muted)]"> Through innovative credit models, global partnerships, and access to international investment networks, we provide financing solutions that enable African businesses to grow, create jobs, and participate meaningfully in the global economy. </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-8 lg:p-12 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-white/5 p-6 border border-white/5">
                    <div className="mb-3 inline-flex rounded-2xl bg-[#111827] p-3 text-[var(--landing-purple)] shadow-sm">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--landing-text)]"> Mission </h3>
                    <p className="mt-3 leading-7 text-[var(--landing-text-muted)]"> Build practical financing pathways for African entrepreneurs and emerging businesses. </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/5 p-6 border border-white/5">
                    <div className="mb-3 inline-flex rounded-2xl bg-[#111827] p-3 text-[var(--landing-purple)] shadow-sm">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--landing-text)]"> Vision </h3>
                    <p className="mt-3 leading-7 text-[var(--landing-text-muted)]"> Connect African enterprise to the global capital ecosystem in a way that drives inclusion and long-term growth. </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mb-12 max-w-2xl">
                <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--landing-text)]"> What We Do </h2>
                <p className="mt-4 text-xl leading-8 text-[var(--landing-text-muted)]"> Our financing structures are tailored to the realities of African markets, including flexible repayment models and growth-aligned financing. </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {focusAreas.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-[1.8rem] border border-white/10 bg-gray-900/40 p-8" >
                      <div className="mb-5 inline-flex rounded-2xl bg-white/5 p-3 text-[var(--landing-purple)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--landing-text)]"> {item.title} </h3>
                      <p className="mt-4 leading-8 text-[var(--landing-text-muted)]"> {item.description} </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_1fr] md:px-6">
              <div className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-8 lg:p-12 shadow-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-purple)]">
                  <Leaf className="h-4 w-4" /> Our Impact </span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-[var(--landing-text)]"> Why we do what we do </h2>
                <p className="mt-6 text-lg leading-8 text-[var(--landing-text-muted)]"> At Rova Credit Africa, we believe that access to capital should never limit ambition. By bridging the gap between entrepreneurs and global investment capital, we are helping unlock the next generation of African businesses and innovators. </p>
                <p className="mt-4 text-lg leading-8 text-[var(--landing-text-muted)]"> By connecting businesses with the right capital partners, we help transform ideas into thriving enterprises that contribute to economic development. </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-8 lg:p-12 shadow-sm">
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--landing-text)]"> Our work supports </h3>
                <ul className="mt-8 space-y-4">
                  {impactPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-2.5 h-2 w-2 rounded-full bg-[var(--landing-purple)]" />
                      <span className="text-lg leading-7 text-[var(--landing-text-muted)]"> {point} </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-[#0b0f1a] py-24 text-white">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.95fr_1.05fr] md:px-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                  <Globe className="h-4 w-4" /> Our Global Network </span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] md:text-5xl"> Built with capital partners across Africa and beyond. </h2>
                <p className="mt-6 text-lg leading-8 text-white/70"> Rova Credit Africa works with a growing network of financial partners across the world, enabling the flow of global capital into African enterprise. </p>
                <p className="mt-4 text-base leading-7 text-white/50"> These partnerships span Africa, Europe, North America, the Middle East, and Asia. </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {networkGroups.map((group) => (
                  <div key={group} className="rounded-[1.5rem] bg-white/5 p-6 border border-white/5 hover:bg-white/10 transition-colors" >
                    <p className="text-lg font-semibold text-white/90">{group}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mb-12 max-w-2xl">
                <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--landing-text)]"> Our Team </h2>
                <p className="mt-4 text-xl leading-8 text-[var(--landing-text-muted)]"> The team behind Rova Credit Africa brings together business financing, partnership development, and credit operations experience focused on African growth markets. </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <article key={member.name} className="rounded-[1.8rem] border border-white/10 bg-gray-900/40 p-8" >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-[var(--landing-purple)]">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--landing-text)]"> {member.name} </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--landing-purple)]"> {member.role} </p>
                    <p className="mt-6 leading-8 text-[var(--landing-text-muted)]"> {member.bio} </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-gray-900/50 flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between lg:p-16 shadow-xl">
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--landing-text)] md:text-5xl"> Looking to finance growth or explore a partnership? </h2>
                  <p className="mt-6 text-xl leading-8 text-[var(--landing-text-muted)]"> Rova Credit Africa works with businesses, entrepreneurs, and funding partners to unlock the capital needed for meaningful expansion. </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link to="/partners" className="bg-[var(--landing-purple)] text-white hover:bg-[var(--landing-purple)]/90 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all shadow-lg" > Explore Partnerships <ArrowRight className="h-5 w-5" /> </Link>
                  <Link to="/contact" className="border border-white/10 bg-white/5 text-white hover:bg-white/10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all" > Contact Us </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </SiteShell>
  );
}
