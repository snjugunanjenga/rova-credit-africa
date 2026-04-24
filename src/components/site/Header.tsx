import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/site/BrandLogo";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY } from "@/lib/format";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/", label: "Phones", hash: "phones" },
  { to: "/", label: "How It Works", hash: "how-it-works" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Support" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" aria-label="RovaCredit home">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              hash={l.hash}
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.exact }}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-whatsapp transition-colors hover:bg-accent"
            aria-label={`WhatsApp ${WHATSAPP_NUMBER_DISPLAY}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden lg:inline">{WHATSAPP_NUMBER_DISPLAY}</span>
          </a>
          <Button asChild size="sm" variant="default">
            <Link to="/sign-in">
              Sign In
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile primary">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                hash={l.hash}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-accent text-primary font-semibold" }}
                activeOptions={{ exact: l.exact }}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-whatsapp"
            >
              <MessageCircle className="h-4 w-4" /> {WHATSAPP_NUMBER_DISPLAY}
            </a>
            <Button asChild size="sm" className="mt-1 w-full">
              <Link to="/sign-in" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
