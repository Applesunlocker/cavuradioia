import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
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
  QrCode,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { loadContact, onContactChange, buildWhatsAppUrl } from "@/lib/contact-config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [showQR, setShowQR] = useState(false);
  const [contact, setContact] = useState(() => loadContact());
  const [user, setUser] = useState<{ email?: string; displayName?: string } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setYear(new Date().getFullYear()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => onContactChange(setContact), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email,
          displayName:
            (data.user.user_metadata?.display_name as string | undefined) ??
            (data.user.user_metadata?.full_name as string | undefined) ??
            data.user.email?.split("@")[0],
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/auth", replace: true });
  };

  const initials = (user?.displayName ?? user?.email ?? "U")
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const waUrl = buildWhatsAppUrl(contact);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(waUrl)}&bgcolor=0F172A&color=38BDF8&margin=10`;

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
              <p className="text-sm font-semibold">{user?.displayName ?? "Invitado"}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user?.email ?? "—"}</p>
            </div>
            <div className="h-9 w-9 rounded-full gradient-primary-bg flex items-center justify-center text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              className="rounded-lg p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 pt-14 lg:pt-0 px-5 lg:px-8 py-6 lg:py-8 overflow-x-hidden">
          {children}
        </main>

        <footer className="px-5 lg:px-8 py-4 text-[11px] text-muted-foreground border-t border-border">
          © {year === 2026 ? "1997 - 2026" : `1997 - ${year}`} PCVEN, C.A. Todos los derechos reservados. Desarrollado por Ing. Carlos Vásquez
        </footer>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setShowQR(true)}
          aria-label="Mostrar código QR"
          className="group h-12 w-12 rounded-full glass-strong border border-border flex items-center justify-center hover:scale-110 transition-transform glow"
        >
          <QrCode className="h-5 w-5 text-neon" />
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="h-14 w-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform animate-pulse"
          style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", boxShadow: "0 0 20px rgba(37,211,102,0.55)" }}
        >
          <MessageCircle className="h-7 w-7" fill="currentColor" />
        </a>
      </div>

      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl p-6 max-w-xs w-full text-center border border-border animate-scale-in"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Escanea para contactarnos</h3>
              <button onClick={() => setShowQR(false)} aria-label="Cerrar" className="p-1 rounded hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#0F172A] p-2">
              <img src={qrSrc} alt="Código QR de WhatsApp" className="w-full h-auto" />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Apunta tu cámara al QR o pulsa el botón de WhatsApp para iniciar chat.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" />
              Abrir WhatsApp
            </a>
          </div>
        </div>
      )}
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
