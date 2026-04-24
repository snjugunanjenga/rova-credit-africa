import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Globe } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY, COMPANY_EMAIL } from "@/lib/format";

export function Footer() {
  return (
    <footer className="bg-[#0b0f1a] text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3" aria-label="RovaCredit home">
              <img src="/rova-credit-mark.svg" alt="Rova Credit" className="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight">Rova Credit Africa</span>
            </Link>
            <p className="max-w-sm text-base leading-7 text-white/50">
              Expanding access to growth financing through innovative credit models, 
              strategic partnerships, and international investment networks across the continent.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://rovacredit.com" label="Website"><Globe className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={whatsappLink()} label="WhatsApp"><MessageCircle className="h-5 w-5" /></SocialIcon>
            </div>
          </div>

          <nav aria-labelledby="footer-solutions">
            <h3 id="footer-solutions" className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Solutions
            </h3>
            <ul className="space-y-4 text-base text-white/60">
              <li><Link to="/marketplace" className="hover:text-[var(--landing-purple)] transition-colors">Asset Marketplace</Link></li>
              <li><Link to="/partners" className="hover:text-[var(--landing-purple)] transition-colors">Sales Partnerships</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--landing-purple)] transition-colors">Business Credit</Link></li>
              <li><Link to="/about" className="hover:text-[var(--landing-purple)] transition-colors">Venture Facilitation</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h3 id="footer-company" className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Company
            </h3>
            <ul className="space-y-4 text-base text-white/60">
              <li><Link to="/about" className="hover:text-[var(--landing-purple)] transition-colors">Our Mission</Link></li>
              <li><Link to="/careers" className="hover:text-[var(--landing-purple)] transition-colors">Join the Team</Link></li>
              <li><Link to="/press" className="hover:text-[var(--landing-purple)] transition-colors">Media Kit</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--landing-purple)] transition-colors">Global Network</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h3 id="footer-legal" className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Governance
            </h3>
            <ul className="space-y-4 text-base text-white/60">
              <li><Link to="/legal/privacy" className="hover:text-[var(--landing-purple)] transition-colors">Privacy Framework</Link></li>
              <li><Link to="/legal/data-practices" className="hover:text-[var(--landing-purple)] transition-colors">Data Stewardship</Link></li>
              <li><Link to="/legal/terms" className="hover:text-[var(--landing-purple)] transition-colors">Operating Terms</Link></li>
              <li><Link to="/legal/credit-disclosure" className="hover:text-[var(--landing-purple)] transition-colors">Fair Lending</Link></li>
            </ul>
          </nav>

          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Contact Headquarters
            </h3>
            <ul className="space-y-4 text-base text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[var(--landing-purple)]" />
                <span>Kololo, Kampala, Uganda</span>
              </li>
              <li>
                <a href={whatsappLink()} className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5 text-[var(--landing-purple)]" />
                  {WHATSAPP_NUMBER_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 text-[var(--landing-purple)]" />
                  {COMPANY_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/30">
          <p>© 2026 Rova Credit Africa. Empowering African enterprise.</p>
          <div className="flex gap-8">
            <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:bg-[var(--landing-purple)] hover:text-white hover:border-[var(--landing-purple)]"
    >
      {children}
    </a>
  );
}
