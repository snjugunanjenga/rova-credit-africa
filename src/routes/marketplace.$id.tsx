import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Check, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { LeadModal } from "@/components/site/LeadModal";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [applyFor, setApplyFor] = useState<ProductCardData | null>(null);

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

  // Recommendations: same category, then same brand, ±25% price, exclude self.
  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations", id, product?.category, product?.brand, product?.asset_price],
    enabled: !!product,
    queryFn: async () => {
      if (!product) return [];
      const minPrice = Math.round(product.asset_price * 0.75);
      const maxPrice = Math.round(product.asset_price * 1.25);
      // Try category + price band first
      const { data: byCategory } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .eq("category", product.category)
        .neq("id", product.id)
        .gte("asset_price", minPrice)
        .lte("asset_price", maxPrice)
        .order("sort_order", { ascending: true })
        .limit(6);
      let results = byCategory ?? [];
      if (results.length < 4) {
        const { data: byBrand } = await supabase
          .from("products")
          .select("*")
          .eq("available", true)
          .eq("brand", product.brand)
          .neq("id", product.id)
          .order("sort_order", { ascending: true })
          .limit(6);
        const seen = new Set(results.map((r) => r.id));
        for (const r of byBrand ?? []) {
          if (!seen.has(r.id)) {
            results.push(r);
            seen.add(r.id);
          }
          if (results.length >= 6) break;
        }
      }
      return results.slice(0, 6) as unknown as ProductCardData[];
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

  const detailedSpecs = (product.specifications ?? null) as Record<string, string> | null;

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
                Pay weekly or daily via MTN MoMo / Airtel Money. Eligibility-based deposit (5%–25%).
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

        {/* Full specs accordion */}
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-bold">Full specifications</h2>
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card">
            <AccordionItem value="quick">
              <AccordionTrigger className="px-4">Quick specs</AccordionTrigger>
              <AccordionContent className="px-4">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {(product.specs ?? ["Storage", "RAM"]).map((s: string) => (
                    <li key={s} className="text-sm">• {s}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            {detailedSpecs && Object.keys(detailedSpecs).length > 0 && (
              <AccordionItem value="full">
                <AccordionTrigger className="px-4">Detailed specifications</AccordionTrigger>
                <AccordionContent className="px-4">
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(detailedSpecs).map(([k, v]) => (
                      <div key={k} className="rounded-md bg-muted/40 p-2 text-sm">
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                        <dd className="font-medium">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="warranty">
              <AccordionTrigger className="px-4">Warranty &amp; support</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                12-month manufacturer warranty. Service drop-off at any RovaCredit partner shop in Uganda &amp; Kenya.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold">You may also like</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommendations.map((r) => (
                <ProductCard key={r.id} product={r} onApply={setApplyFor} />
              ))}
            </div>
          </section>
        )}
      </div>

      <LeadModal
        open={open}
        onOpenChange={setOpen}
        productId={product.id}
        productName={product.name}
        productPrice={product.asset_price}
      />
      <LeadModal
        open={!!applyFor}
        onOpenChange={(o) => { if (!o) setApplyFor(null); }}
        productId={applyFor?.id}
        productName={applyFor?.name}
        productPrice={applyFor?.asset_price}
      />
    </SiteShell>
  );
}
