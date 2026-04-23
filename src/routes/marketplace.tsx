import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import type { ProductCardData } from "@/components/site/ProductCard";
import { LeadModal } from "@/components/site/LeadModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — RovaCredit Africa" },
      { name: "description", content: "Browse Samsung, Tecno, Infinix, iPhone & Xiaomi smartphones with flexible UGX financing." },
      { property: "og:title", content: "Marketplace — RovaCredit Africa" },
      { property: "og:description", content: "Smartphones with flexible UGX financing via MTN MoMo & Airtel Money." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [applyFor, setApplyFor] = useState<ProductCardData | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("sort_order", { ascending: true });
      return (data ?? []) as unknown as ProductCardData[];
    },
  });

  const brands = useMemo(() => Array.from(new Set(data.map((p) => p.brand))).sort(), [data]);

  const filtered = data.filter((p) => {
    if (brand !== "all" && p.brand !== brand) return false;
    if (category !== "all" && p.category !== category) return false;
    if (search && !`${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SiteShell>
      <section className="border-b border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">
            {data.length} devices available · Pay via MTN MoMo or Airtel Money
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:px-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by brand or model"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="flagship">Flagship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading devices…</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No devices match your filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onApply={setApplyFor} />
            ))}
          </div>
        )}
      </section>

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
