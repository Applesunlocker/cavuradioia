import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Radio,
  Clapperboard,
  Library,
  Share2,
  Sparkles,
  Mic,
  BarChart3,
  Users,
  Settings,
  Plus,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; accent?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { to: "/broadcasts", label: "Transmisiones", icon: Radio },
  { to: "/studio", label: "Studio", icon: Clapperboard, accent: true },
  { to: "/library", label: "Librería", icon: Library },
  { to: "/destinations", label: "Destinos", icon: Share2 },
  { to: "/ai-tools", label: "Herramientas IA", icon: Sparkles },
  { to: "/analytics", label: "Analítica", icon: BarChart3 },
  { to: "/team", label: "Equipo", icon: Users },
  { to: "/settings", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 glass-strong flex items-center justify-between px-4 h-14">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <Logo />
          <span>NovaStream</span>
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-64 shrink-0 glass-strong border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 pt-6 pb-5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <Logo />
            <div className="flex flex-col leading-tight">
              <span className="font-bold tracking-tight">NovaStream</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Estudio IA</span>
            </div>
          </Link>
        </div>

        <div className="px-3">
          <Link
            to="/studio"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl gradient-primary-bg px-3 py-2.5 text-sm font-semibold text-primary-foreground glow hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            Nueva transmisión
          </Link>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-3 space-y-0.5">
          {nav.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-accent text-foreground shadow-inner"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                <span>{item.label}</span>
                {item.accent && (
                  <span className="ml-auto text-[10px] font-bold tracking-wider gradient-text">EN VIVO</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl glass p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-neon" />
            <span className="text-xs font-semibold">Créditos de IA</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-3/4 gradient-neon-bg rounded-full" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">2.340 / 3.000 usados</p>
          <button className="mt-2 w-full text-xs font-medium text-primary hover:underline">
            Mejorar plan →
          </button>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-20 bg-background/60 backdrop-blur-sm"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar desktop */}
        <header className="hidden lg:flex sticky top-0 z-20 h-16 items-center gap-4 px-8 glass border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar transmisiones, clips, invitados..."
              className="w-full rounded-xl bg-secondary/60 border border-border pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="relative rounded-lg p-2 hover:bg-accent transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-neon live-dot" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold">Alex Rivera</p>
              <p className="text-xs text-muted-foreground">Creador Pro</p>
            </div>
            <div className="h-9 w-9 rounded-full gradient-primary-bg flex items-center justify-center text-sm font-bold text-primary-foreground">
              AR
            </div>
          </div>
        </header>

        <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-6 lg:py-8 overflow-x-hidden">
          {children}
        </main>

        <footer className="px-5 lg:px-8 py-4 text-[11px] text-muted-foreground border-t border-border">
          © 1997 - 2026 PCVEN, C.A. Todos los derechos reservados. Desarrollado por Ing. Carlos Vásquez
        </footer>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative h-8 w-8 rounded-lg gradient-vibrant-bg overflow-hidden flex items-center justify-center glow">
      <div className="absolute inset-0 gradient-primary-bg" />
      <div className="absolute inset-[2px] rounded-md bg-background/60 backdrop-blur" />
      <Mic className="relative h-4 w-4 text-neon animate-pulse drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
    </div>
  );
}
