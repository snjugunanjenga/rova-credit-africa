import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUGX } from "@/lib/format";

export interface ProductCardData {
  id: string;
  name: string;
  brand: string;
  category: string;
  asset_price: number;
  down_payment: number;
  image_url: string | null;
  alt_text: string | null;
  rating: number | null;
  badges: string[] | null;
  specs: string[] | null;
}

export function ProductCard({
  product,
  onApply,
}: {
  product: ProductCardData;
  onApply?: (p: ProductCardData) => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <Link
        to="/marketplace/$id"
        params={{ id: product.id }}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.alt_text ?? product.name}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80";
            }}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} className="bg-gold text-gold-foreground hover:bg-gold">
                {b}
              </Badge>
            ))}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to="/marketplace/$id" params={{ id: product.id }} className="block">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
              <h3 className="line-clamp-1 font-semibold text-foreground">{product.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {product.rating ?? "4.5"}
            </div>
          </div>
        </Link>
        {product.specs && product.specs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.specs.slice(0, 3).map((s) => (
              <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2">
          <p className="text-lg font-bold text-primary">{formatUGX(product.asset_price)}</p>
          <p className="text-xs text-muted-foreground">
            From <span className="font-semibold text-foreground">{formatUGX(product.down_payment)}</span> down · MoMo / Airtel
          </p>
          {onApply ? (
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={(e) => {
                e.preventDefault();
                onApply(product);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy on Credit
            </Button>
          ) : (
            <Link to="/marketplace/$id" params={{ id: product.id }} className="mt-3 block">
              <Button size="sm" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy on Credit
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
