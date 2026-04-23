import { Link } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Linkedin, Facebook, Instagram, Twitter } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY, COMPANY_EMAIL } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Corporate */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
              Corporate
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-sidebar-foreground/80 hover:text-sidebar-primary">About RovaCredit</Link></li>
              <li><Link to="/marketplace" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Marketplace</Link></li>
              <li><Link to="/partners" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Partner With Us</Link></li>
              <li><span className="text-sidebar-foreground/60">Careers</span></li>
              <li><span className="text-sidebar-foreground/60">Press</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
              Legal &amp; Data Practices
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/privacy" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Privacy Policy</Link></li>
              <li><Link to="/legal/data-practices" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Data Protection Practices</Link></li>
              <li><Link to="/legal/terms" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Terms of Service</Link></li>
              <li><Link to="/legal/cookies" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Cookie Policy</Link></li>
              <li><Link to="/legal/credit-disclosure" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Consumer Credit Disclosure</Link></li>
              <li><Link to="/contact" className="text-sidebar-foreground/80 hover:text-sidebar-primary">Complaints &amp; Disputes</Link></li>
            </ul>
            <p className="mt-3 text-xs text-sidebar-foreground/60">
              Aligned with Uganda Data Protection &amp; Privacy Act 2019 and Kenya Data Protection Act 2019.
            </p>
          </div>

          {/* Partners */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
              Partners &amp; Payments
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <PartnerBadge label="MTN MoMo" href="https://www.mtn.co.ug/momo/" />
              <PartnerBadge label="Airtel Money" href="https://www.airtel.co.ug/airtel-money/" />
              <PartnerBadge label="MTN Uganda" href="https://www.mtn.co.ug/" />
              <PartnerBadge label="Airtel Uganda" href="https://www.airtel.co.ug/" />
            </div>
            <p className="mt-3 text-xs text-sidebar-foreground/60">
              Powered by mobile money across Uganda &amp; Kenya.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sidebar-primary">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-sidebar-foreground/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>Plot 12, Kampala Road<br />Kampala, Uganda</span>
              </li>
              <li className="flex items-start gap-2 text-sidebar-foreground/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                <span>Westlands Office Park<br />Nairobi, Kenya</span>
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
                <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary">
                  <Mail className="h-4 w-4 text-sidebar-primary" /> {COMPANY_EMAIL}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <SocialIcon href="#" label="X (Twitter)"><Twitter className="h-4 w-4" /></SocialIcon>
              <SocialIcon href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialIcon>
              <SocialIcon href="#" label="Facebook"><Facebook className="h-4 w-4" /></SocialIcon>
              <SocialIcon href="#" label="Instagram"><Instagram className="h-4 w-4" /></SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/60 md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 RovaCredit Africa Ltd · Registered in Uganda · URSB Reg. No. 80020003456789 (placeholder)
          </div>
          <div className="flex items-center gap-4">
            <button
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

function PartnerBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-center text-xs font-medium text-sidebar-foreground transition-colors hover:border-sidebar-primary hover:text-sidebar-primary"
    >
      {label}
    </a>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:border-sidebar-primary hover:text-sidebar-primary"
    >
      {children}
    </a>
  );
}
