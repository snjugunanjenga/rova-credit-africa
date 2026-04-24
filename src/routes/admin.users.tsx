import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { db } from "@/integrations/database/client";
import { Section } from "./admin";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const ROLES = ["admin_owner", "developer", "analyst", "marketer"] as const;

function AdminUsers() {
  const qc = useQueryClient();

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await db.from("profiles").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data } = await db.from("user_roles").select("*");
      return data ?? [];
    },
  });

  const grant = async (profile_id: string, role: typeof ROLES[number]) => {
    const { error } = await db.from("user_roles").insert({ profile_id, role });
    if (error) toast.error(error.message);
    else { toast.success("Role granted"); qc.invalidateQueries({ queryKey: ["admin-roles"] }); }
  };
  const revoke = async (id: string) => {
    const { error } = await db.from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Revoked"); qc.invalidateQueries({ queryKey: ["admin-roles"] }); }
  };

  return (
    <Section title="Users & Roles" desc="Grant or revoke admin roles.">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr><th className="p-3">User</th><th className="p-3">Roles</th><th className="p-3">Grant</th></tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const userRoles = roles.filter((r) => r.profile_id === p.id);
              return (
                <tr key={p.id} className="border-t border-border align-top">
                  <td className="p-3"><div className="font-medium">{p.full_name ?? "—"}</div><div className="text-xs text-muted-foreground">{p.email}</div></td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.map((r) => (
                        <span key={r.id} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {r.role}
                          <button onClick={() => revoke(r.id)}><Trash2 className="h-3 w-3" /></button>
                        </span>
                      ))}
                      {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No role</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <Select onValueChange={(v) => grant(p.id, v as typeof ROLES[number])}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Add role" /></SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
