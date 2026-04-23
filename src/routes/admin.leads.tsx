import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/format";
import { Section } from "./admin";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;
type Status = typeof STATUSES[number];

function AdminLeads() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-leads"] }); }
  };

  return (
    <Section title="Leads" desc={`${data.length} captured`}>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">When</th><th className="p-3">Name</th><th className="p-3">Source</th>
              <th className="p-3">Phone</th><th className="p-3">Country</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <td className="p-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium">{l.full_name}<div className="text-xs text-muted-foreground">{l.email ?? ""}</div></td>
                <td className="p-3"><Badge variant="outline">{l.source}</Badge></td>
                <td className="p-3">{l.phone ?? "—"}</td>
                <td className="p-3">{l.country ?? "—"}</td>
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
                    <a href={whatsappLink(`Hi ${l.full_name}, this is RovaCredit Africa following up on your application.`)} target="_blank" rel="noopener noreferrer" className="text-whatsapp">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
