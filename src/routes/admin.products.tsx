import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { db } from "@/integrations/database/client";
import { formatUGX } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Section } from "./admin";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

interface Row {
  id: string;
  name: string;
  brand: string;
  category: string;
  asset_price: number;
  down_payment: number;
  image_url: string | null;
  available: boolean;
  sort_order: number;
  specifications?: Record<string, string> | null;
}

function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await db.from("products").select("*").order("sort_order");
      return (data ?? []) as unknown as Row[];
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name ?? "",
      brand: editing.brand ?? "",
      category: (editing.category ?? "budget") as "budget" | "mid-range" | "flagship",
      asset_price: Number(editing.asset_price ?? 0),
      down_payment: Number(editing.down_payment ?? 0),
      image_url: editing.image_url ?? null,
      available: editing.available ?? true,
      sort_order: Number(editing.sort_order ?? 999),
      specifications: editing.specifications && Object.keys(editing.specifications).length > 0 ? editing.specifications : null,
    };
    const { error } = editing.id
      ? await db.from("products").update(payload).eq("id", editing.id)
      : await db.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  return (
    <Section title="Products" desc={`${data.length} products in catalog`}>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing({ available: true, category: "budget", sort_order: 999, specifications: {} })}>
          <Plus className="mr-2 h-4 w-4" /> New product
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Brand</th><th className="p-3">Price</th>
              <th className="p-3">Down</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td className="p-3" colSpan={6}>Loading…</td></tr> :
              data.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{formatUGX(p.asset_price)}</td>
                  <td className="p-3">{formatUGX(p.down_payment)}</td>
                  <td className="p-3">{p.available ? "Active" : "Hidden"}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} product</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Name" value={editing.name ?? ""} onChange={(v) => setEditing({ ...editing, name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand" value={editing.brand ?? ""} onChange={(v) => setEditing({ ...editing, brand: v })} />
                <Field label="Category" value={editing.category ?? "budget"} onChange={(v) => setEditing({ ...editing, category: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Asset price (UGX)" type="number" value={String(editing.asset_price ?? "")} onChange={(v) => setEditing({ ...editing, asset_price: Number(v) })} />
                <Field label="Down payment" type="number" value={String(editing.down_payment ?? "")} onChange={(v) => setEditing({ ...editing, down_payment: Number(v) })} />
              </div>
              <Field label="Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
              <Field label="Sort order" type="number" value={String(editing.sort_order ?? 999)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })} />

              <SpecsEditor
                specs={editing.specifications ?? {}}
                onChange={(s) => setEditing({ ...editing, specifications: s })}
              />

              <Button onClick={save} className="w-full">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function SpecsEditor({ specs, onChange }: { specs: Record<string, string>; onChange: (s: Record<string, string>) => void }) {
  const entries = useMemo(() => Object.entries(specs), [specs]);
  const [k, setK] = useState("");
  const [v, setV] = useState("");

  const add = () => {
    if (!k.trim()) return;
    onChange({ ...specs, [k.trim()]: v.trim() });
    setK(""); setV("");
  };
  const remove = (key: string) => {
    const next = { ...specs };
    delete next[key];
    onChange(next);
  };

  return (
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Detailed specifications</Label>
      <div className="mt-2 space-y-1">
        {entries.length === 0 && <p className="text-xs text-muted-foreground">No detailed specs yet.</p>}
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2 rounded bg-card px-2 py-1 text-sm">
            <span className="min-w-[100px] font-medium">{key}</span>
            <span className="flex-1 text-muted-foreground">{val}</span>
            <Button size="sm" variant="ghost" onClick={() => remove(key)}><X className="h-3 w-3" /></Button>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[1fr_1fr_auto] gap-2">
        <Input placeholder="Key (e.g. Battery)" value={k} onChange={(e) => setK(e.target.value)} />
        <Input placeholder="Value (e.g. 5000 mAh)" value={v} onChange={(e) => setV(e.target.value)} />
        <Button type="button" size="sm" onClick={add}>Add</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
