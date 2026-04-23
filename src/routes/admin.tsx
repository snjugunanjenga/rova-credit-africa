import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users as UsersIcon, BarChart3, Inbox, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocalAdmin, clearLocalAdmin, type LocalAdmin } from "@/lib/local-admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/leads", label: "Leads", icon: Inbox, exact: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { to: "/admin/users", label: "Users & Roles", icon: UsersIcon, exact: false },
  { to: "/admin/system", label: "System", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<LocalAdmin | null>(null);

  useEffect(() => {
    const a = getLocalAdmin();
    if (!a) navigate({ to: "/sign-in" });
    else setAdmin(a);
  }, [navigate]);

  if (!admin) return null;

  // If we're on /admin exactly, show dashboard inline (we render it in this component).
  const isRoot = location.pathname === "/admin";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border p-4">
          <Link to="/" className="text-sm font-bold">RovaCredit <span className="text-gold">Admin</span></Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}
                activeOptions={{ exact: n.exact }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent"
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <p className="text-xs text-sidebar-foreground/70">{admin.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent"
            onClick={() => { clearLocalAdmin(); navigate({ to: "/" }); }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6">
          {isRoot ? <DashboardHome /> : <Outlet />}
        </div>
      </main>
    </div>
  );
}

function DashboardHome() {
  return (
    <Section title="Dashboard" desc="Welcome back. Here's what's happening today.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total leads" value="—" />
        <Stat label="Marketplace" value="—" />
        <Stat label="Partners" value="—" />
        <Stat label="Direct" value="—" />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Use the sidebar to manage products, leads, analytics, users and system status.
      </p>
    </Section>
  );
}

export function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </header>
      {children}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
