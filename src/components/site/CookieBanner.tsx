import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "rovacredit_cookie_consent_v1";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    localStorage.setItem(KEY, value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience and measure traffic. By accepting, you consent
          to our use of cookies in line with the Uganda Data Protection and Privacy Act 2019 and
          Kenya Data Protection Act 2019.{" "}
          <Link to="/legal/cookies" className="font-medium text-primary underline-offset-4 hover:underline">
            Cookie Policy
          </Link>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => decide("rejected")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
