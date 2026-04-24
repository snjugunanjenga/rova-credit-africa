import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Globe } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY, COMPANY_EMAIL } from "@/lib/format";
import { BrandLogo } from "@/components/site/BrandLogo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 border-b border-sidebar-border pb-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" aria-label="RovaCredit home">
              <BrandLogo light />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-sidebar-foreground/80">
              Empowering communities, businesses and entrepreneurs with transparent
              smartphone financing and mobile-money native repayments.
            </p>
          </div>

          <nav aria-labelledby="footer-client-heading">
            <h3
              id="footer-client-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary"
            >
              Clients
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Browse Phones</Link></li>
              <li><a href="/#how-it-works" className="text-sidebar-foreground/80 hover:text-sidebar-primary">How it Works</a></li>
              <li><Link to="/contact" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Credit Application</Link></li>
              <li><Link to="/legal/credit-disclosure" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Credit Disclosure</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-company-heading">
            <h3
              id="footer-company-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary"
            >
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-sidebar-foreground/80 hover:text-sidebar-primary">About RovaCredit</Link></li>
              <li><Link to="/careers" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Careers</Link></li>
              <li><Link to="/press" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Press</Link></li>
              <li><Link to="/sign-in" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Admin</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-partners-heading">
            <h3
              id="footer-partners-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary"
            >
              Partners
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/partners" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Become a Partner</Link></li>
              <li><Link to="/legal/partner-agreement" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Partner Agreement</Link></li>
              <li><Link to="/contact" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Partner Support</Link></li>
              <li><a href="/#compliance" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Compliance Rules</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal-heading">
            <h3
              id="footer-legal-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary"
            >
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/privacy" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Privacy Policy</Link></li>
              <li><Link to="/legal/data-practices" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Data Practices</Link></li>
              <li><Link to="/legal/terms" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Terms of Service</Link></li>
              <li><Link to="/legal/cookies" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Cookie Policy</Link></li>
              <li><Link to="/legal/credit-disclosure" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Credit Disclosure</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-sidebar-foreground/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>Plot 2A, Nviri Ln, Kololo, Kampala</span>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
                >
                  <MessageCircle className="h-4 w-4 text-sidebar-primary" />
                  {WHATSAPP_NUMBER_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
                >
                  <Mail className="h-4 w-4 text-sidebar-primary" /> {COMPANY_EMAIL}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <SocialIcon href="https://rovacredit.com" label="RovaCredit website"><Globe className="h-4 w-4" /></SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/60 md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 RovaCredit. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("rovacredit_cookie_consent_v1");
                  window.location.reload();
                }
              }}
              className="hover:text-sidebar-primary"
            >
              Reset cookie consent
            </button>
            <Link to="/sign-in" className="text-sidebar-foreground/40 hover:text-sidebar-primary">
              Admin
            </Link>
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
      className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:border-sidebar-primary hover:text-sidebar-primary"
    >
      {children}
    </a>
  );
}
