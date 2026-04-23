import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, MapPin, FileSignature } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink, formatUGX } from "@/lib/format";
import { Section } from "./admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;
type Status = typeof STATUSES[number];
type SourceFilter = "all" | "marketplace" | "partner" | "direct" | "dsr";

function AdminLeads() {
  const qc = useQueryClient();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const { data = [] } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(
    () => sourceFilter === "all" ? data : data.filter((l) => l.source === sourceFilter),
    [data, sourceFilter],
  );

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-leads"] }); }
  };

  return (
    <Section title="Leads" desc={`${filtered.length} of ${data.length} captured`}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as SourceFilter)}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="marketplace">Marketplace</SelectItem>
            <SelectItem value="partner">Partner applications</SelectItem>
            <SelectItem value="direct">Direct / Contact</SelectItem>
            <SelectItem value="dsr">Data subject requests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Ref / When</th>
              <th className="p-3">Name</th>
              <th className="p-3">Source</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Location</th>
              <th className="p-3">Tier / Down</th>
              <th className="p-3">Agreement</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const meta = (l.metadata ?? {}) as Record<string, unknown>;
              const product = (l.product_snapshot ?? {}) as Record<string, unknown>;
              return (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="p-3 text-xs">
                    <div className="font-mono font-semibold text-primary">{l.lead_ref ?? "—"}</div>
                    <div className="text-muted-foreground">{new Date(l.created_at).toLocaleString()}</div>
                  </td>
                  <td className="p-3 font-medium">
                    {l.full_name}
                    <div className="text-xs text-muted-foreground">{l.email ?? ""}</div>
                  </td>
                  <td className="p-3"><Badge variant="outline">{l.source}</Badge></td>
                  <td className="p-3">{l.phone ?? "—"}</td>
                  <td className="p-3 text-xs">
                    {l.location_label ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {l.location_label}
                      </span>
                    ) : "—"}
                    {l.latitude && l.longitude && (
                      <div className="text-muted-foreground">
                        {Number(l.latitude).toFixed(3)}, {Number(l.longitude).toFixed(3)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-xs">
                    {l.eligibility_tier ? (
                      <>
                        <Badge variant="secondary">Tier {l.eligibility_tier}</Badge>
                        {l.computed_down_payment && (
                          <div className="mt-1 font-medium">{formatUGX(Number(l.computed_down_payment))}</div>
                        )}
                      </>
                    ) : "—"}
                  </td>
                  <td className="p-3 text-xs">
                    {l.agreement_accepted_at ? (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-auto p-1 text-success">
                            <FileSignature className="mr-1 h-3 w-3" /> Signed {l.agreement_version}
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Agreement snapshot</SheetTitle>
                            <SheetDescription>Lead {l.lead_ref}</SheetDescription>
                          </SheetHeader>
                          <dl className="mt-6 space-y-3 text-sm">
                            <Row label="Signatory" value={l.agreement_signatory_name ?? "—"} />
                            <Row label="Version" value={l.agreement_version ?? "—"} />
                            <Row label="Accepted at" value={l.agreement_accepted_at ? new Date(l.agreement_accepted_at).toLocaleString() : "—"} />
                            <Row label="Company" value={String(meta.company ?? "—")} />
                            <Row label="Business type" value={String(meta.business_type ?? "—")} />
                            <Row label="TIN" value={String(meta.tin ?? "—")} />
                            <Row label="National ID" value={String(meta.national_id ?? "—")} />
                            <Row label="MoMo merchant code" value={String(meta.momo_merchant_code ?? "—")} />
                            <Row label="Foot traffic / day" value={String(meta.foot_traffic ?? "—")} />
                            <Row label="Monthly volume" value={String(meta.monthly_volume ?? "—")} />
                            <Row label="Address" value={l.location_label ?? "—"} />
                          </dl>
                        </SheetContent>
                      </Sheet>
                    ) : (
                      <span className="text-muted-foreground">
                        {product.name ? String(product.name) : "—"}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v as Status)}>
                      <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    {l.phone && (
                      <a href={whatsappLink(`Hi ${l.full_name}, this is RovaCredit Africa following up on your application (${l.lead_ref ?? ""}).`)} target="_blank" rel="noopener noreferrer" className="text-whatsapp">
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-border pb-2">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
