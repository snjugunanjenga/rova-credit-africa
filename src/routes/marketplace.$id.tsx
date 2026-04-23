import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Check, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { LeadModal } from "@/components/site/LeadModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatUGX, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/marketplace/$id")({
  component: ProductPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/marketplace" className="mt-4 inline-block text-primary underline">Back to marketplace</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </SiteShell>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const [open, setOpen] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Loading…</div>
      </SiteShell>
    );
  }
  if (!product) return null;

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Link to="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={product.image_url ?? ""}
              alt={product.alt_text ?? product.name}
              className="aspect-square w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80";
              }}
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-sm">{product.rating ?? "4.5"}</span>
              <span className="text-sm text-muted-foreground">· {product.category}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(product.badges ?? []).map((b: string) => (
                <Badge key={b} className="bg-gold text-gold-foreground hover:bg-gold">{b}</Badge>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
              <p className="text-sm text-muted-foreground">Cash price</p>
              <p className="text-3xl font-bold text-primary">{formatUGX(product.asset_price)}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">Down payment from</span>
                <span className="font-semibold">{formatUGX(product.down_payment)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Pay weekly or monthly via MTN MoMo / Airtel Money. Final terms confirmed on application.
              </p>
            </div>

            {(product.specs ?? []).length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-2">
                {(product.specs ?? []).map((s: string) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /> {s}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setOpen(true)}>Buy on Credit</Button>
              <a
                href={whatsappLink(`Hello RovaCredit, I'm interested in the ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <LeadModal open={open} onOpenChange={setOpen} productId={product.id} productName={product.name} />
    </SiteShell>
  );
}
