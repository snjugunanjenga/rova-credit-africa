export function formatUGX(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "UGX 0";
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

export function whatsappLink(message?: string): string {
  const phone = "254727291121";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${text}`;
}

export const WHATSAPP_NUMBER_DISPLAY = "+254 727 291 121";
export const COMPANY_EMAIL = "hello@rovacredit.africa";
export const DPO_EMAIL = "dpo@rovacredit.africa";

export function driveImage(url: string | null | undefined): string {
  if (!url) return "";
  const m = url.match(/\/file\/d\/([^/]+)\//) || url.match(/[?&]id=([^&]+)/);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  return url;
}
