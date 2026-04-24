import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/integrations/database/client";
import { Section } from "./admin";

export const Route = createFileRoute("/admin/system")({
  component: AdminSystem,
});

function AdminSystem() {
  const { data, isLoading } = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => {
      const { count, error } = await db.from("products").select("*", { count: "exact", head: true });
      return { connected: !error, products: count ?? 0, error: error?.message };
    },
  });

  return (
    <Section title="System status" desc="Database connectivity">
      <div className="rounded-xl border border-border bg-card p-5">
        {isLoading ? <p>Checking…</p> : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={data?.connected ? "h-5 w-5 text-success" : "h-5 w-5 text-destructive"} />
              <span>Cloud database: {data?.connected ? "Connected" : "Disconnected"}</span>
            </div>
            <p className="text-sm text-muted-foreground">Products in catalog: {data?.products}</p>
            {data?.error && <p className="text-sm text-destructive">{data.error}</p>}
          </div>
        )}
      </div>
    </Section>
  );
}
