import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/format";

export function WhatsAppFAB() {
  return (
    <a
      href={whatsappLink("Hello RovaCredit Africa, I'd like to know more about phone financing.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-all hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)]"
      style={{ animation: "whatsapp-pulse 2s infinite" }}
    >
      <MessageCircle className="h-8 w-8" />
    </a>
  );
}
