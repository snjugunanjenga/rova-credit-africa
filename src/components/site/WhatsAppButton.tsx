import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/format";

export function WhatsAppFAB() {
  return (
    <a
      href={whatsappLink("Hello RovaCredit Africa, I'd like to know more about phone financing.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elegant transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
