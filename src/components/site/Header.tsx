import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { HAS_CLERK } from "@/lib/clerk";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/format";

const navLinks = [
  { label: "Browse Assets", href: "/marketplace" },
  { label: "Partnerships", href: "/partners" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [solidHeader, setSolidHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSolidHeader(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidHeader
          ? "border-b border-white/10 bg-[#1a1744]/95 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          : "border-b border-white/5 bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Rova Credit Africa home">
          <img
            src="/rova-credit-mark.svg"
            alt="Rova Credit"
            width={44}
            height={44}
            className="h-11 w-11"
          />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-[-0.03em] text-white">
              Rova Credit Africa
            </span>
            <span className="text-xs font-medium text-white/70">
              Asset finance for growth
            </span>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={whatsappLink("Hello RovaCredit Africa, I'd like to know more about phone financing.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:bg-[#20bd5a] hover:shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            <span>WhatsApp</span>
          </a>
          {HAS_CLERK && (
            <Button asChild variant="outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10 rounded-full">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={whatsappLink("Hello RovaCredit Africa, I'd like to know more about phone financing.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all hover:bg-[#20bd5a]"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-white/10 bg-[#1a1744] shadow-[0_24px_60px_rgba(0,0,0,0.5)] lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {HAS_CLERK && (
                <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
                  <Button asChild variant="outline" className="w-full border-white/15 bg-white/5 text-white rounded-full">
                    <Link to="/sign-in" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
