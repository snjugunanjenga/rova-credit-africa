import { cn } from "@/lib/utils";
import logoLockup from "@/assets/brand/rova-credit-logo.svg";
import logoLockupLight from "@/assets/brand/rova-credit-logo-light.svg";
import logoMark from "@/assets/brand/rova-credit-mark.svg";

interface BrandLogoProps {
  compact?: boolean;
  light?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, light = false, className }: BrandLogoProps) {
  const src = compact ? logoMark : light ? logoLockupLight : logoLockup;
  const alt = compact ? "RovaCredit logo mark" : "RovaCredit Africa";

  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-9 w-auto", compact && "h-8", className)}
      loading="eager"
      decoding="async"
    />
  );
}
