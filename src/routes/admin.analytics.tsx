import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/database/client";
import { Section, Stat } from "./admin";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

function AdminAnalytics() {
  const { data: leads = [] } = useQuery({
    queryKey: ["analytics-leads"],
    queryFn: async () => {
      const { data } = await db.from("leads").select("source, status, country");
      return data ?? [];
    },
  });

  const bySource = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] ?? 0) + 1;
    return acc;
  }, {});
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversion = leads.length ? Math.round((converted / leads.length) * 100) : 0;

  return (
    <Section title="Analytics" desc="Lead funnel overview">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total leads" value={leads.length} />
        <Stat label="Marketplace" value={bySource.marketplace ?? 0} />
        <Stat label="Partners" value={bySource.partner ?? 0} />
        <Stat label="Conversion" value={`${conversion}%`} />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Leads by source</h3>
        <div className="space-y-2">
          {Object.entries(bySource).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs"><span>{k}</span><span>{v}</span></div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(v / leads.length) * 100}%` }} />
              </div>
            </div>
          ))}
          {leads.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
        </div>
      </div>
    </Section>
  );
}
