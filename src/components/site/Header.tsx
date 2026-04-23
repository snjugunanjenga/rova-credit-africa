import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY } from "@/lib/format";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/partners", label: "Partners" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="text-lg leading-none">
            RovaCredit
            <span className="ml-1 text-gold">Africa</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
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
          <Link to="/sign-in">
            <Button size="sm" variant="default">
              Sign In
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-accent text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
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
            <Link to="/sign-in" onClick={() => setOpen(false)} className="mt-1">
              <Button size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
