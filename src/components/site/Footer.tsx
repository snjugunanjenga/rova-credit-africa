import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY, COMPANY_EMAIL } from "@/lib/format";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const companyLinks = [
  { label: "Our Mission", href: "/about" },
  { label: "Join the Team", href: "/careers" },
  { label: "Media Kit", href: "/press" },
  { label: "Contact Us", href: "/contact" },
];

const clientLinks = [
  { label: "Asset Marketplace", href: "/marketplace" },
  { label: "Apply for Financing", href: "/sign-up" },
  { label: "Business Credit", href: "/contact" },
  { label: "Support", href: "/contact" },
];

const partnerLinks = [
  { label: "Become a Partner", href: "/partners" },
  { label: "Partner Resources", href: "/partners" },
  { label: "Venture Facilitation", href: "/about" },
  { label: "Global Network", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Framework", href: "/legal/privacy" },
  { label: "Operating Terms", href: "/legal/terms" },
  { label: "Data Stewardship", href: "/legal/data-practices" },
  { label: "Fair Lending", href: "/legal/credit-disclosure" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/rovacredit", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/rovacredit", Icon: InstagramIcon },
  { label: "TikTok", href: "https://tiktok.com/@rovacredit", Icon: TikTokIcon },
  { label: "YouTube", href: "https://youtube.com/@rovacredit", Icon: YouTubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/rovacredit", Icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="bg-[#110f30] text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        {/* Main grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3" aria-label="RovaCredit home">
              <img src="/rova-credit-mark.svg" alt="Rova Credit" className="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight">Rova Credit Africa</span>
            </Link>
            <p className="max-w-sm text-base leading-7 text-white/50">
              Expanding access to growth financing through innovative credit models,
              strategic partnerships, and international investment networks across the continent.
            </p>

            {/* Contact */}
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[var(--landing-purple)]" />
                <span>Kololo, Kampala, Uganda</span>
              </li>
              <li>
                <a href={whatsappLink()} className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  {WHATSAPP_NUMBER_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-[var(--landing-purple)]" />
                  {COMPANY_EMAIL}
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-[var(--landing-purple)] hover:text-white hover:border-[var(--landing-purple)] hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company quick links */}
          <nav aria-labelledby="footer-company">
            <h3 id="footer-company" className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Company
            </h3>
            <ul className="space-y-3.5 text-sm text-white/60">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Clients quick links */}
          <nav aria-labelledby="footer-clients">
            <h3 id="footer-clients" className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Clients
            </h3>
            <ul className="space-y-3.5 text-sm text-white/60">
              {clientLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Partners quick links */}
          <nav aria-labelledby="footer-partners">
            <h3 id="footer-partners" className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Partners
            </h3>
            <ul className="space-y-3.5 text-sm text-white/60">
              {partnerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal & Governance */}
          <nav aria-labelledby="footer-legal">
            <h3 id="footer-legal" className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Legal & Governance
            </h3>
            <ul className="space-y-3.5 text-sm text-white/60">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Login portals */}
        <div className="mt-14 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-sm font-bold text-white/70">Portal Access</h4>
              <p className="mt-1 text-xs text-white/40">Sign in to your dashboard</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:bg-[var(--landing-purple)] hover:text-white hover:border-[var(--landing-purple)]"
              >
                Admin Login
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:bg-[var(--landing-purple)] hover:text-white hover:border-[var(--landing-purple)]"
              >
                Partner Login
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:bg-[var(--landing-purple)] hover:text-white hover:border-[var(--landing-purple)]"
              >
                Client Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30">
          <p>&copy; 2026 Rova Credit Africa. Empowering African enterprise.</p>
          <div className="flex gap-6">
            <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
