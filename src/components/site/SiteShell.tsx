import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFAB } from "./WhatsAppButton";
import { CookieBanner } from "./CookieBanner";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#1a1744" }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFAB />
      <CookieBanner />
    </div>
  );
}
