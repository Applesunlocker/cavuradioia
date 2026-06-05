import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, StatCard, StatusPill, Button } from "@/components/ui-bits";
import { broadcasts, metrics } from "@/lib/mock-data";
import { Plus, Play, Calendar, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Panel — NovaStream AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const upcoming = broadcasts.filter((b) => b.status === "scheduled").slice(0, 3);
  const recent = broadcasts.filter((b) => b.status === "completed").slice(0, 3);
  const live = broadcasts.find((b) => b.status === "live");

  return (
    <AppShell>
      <PageHeader
        title="Bienvenido, Alex 👋"
        description="Tu studio está listo. Esto es lo que está pasando en tus canales."
        action={
          <Link to="/studio">
            <Button><Plus className="h-4 w-4" /> Nueva transmisión</Button>
          </Link>
        }
      />

      {live && (
        <div className="mb-8 relative overflow-hidden rounded-2xl glass-strong p-6 border border-destructive/30">
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-destructive/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div
              className="h-24 w-40 rounded-xl shrink-0"
              style={{ background: live.thumbnail }}
            />
            <div className="flex-1">
              <StatusPill status="live" />
              <h3 className="mt-2 text-xl font-semibold">{live.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {live.peakViewers.toLocaleString("es")} espectadores · {live.duration} · {live.platforms.join(" · ")}
              </p>
            </div>
            <Link to="/studio">
              <Button variant="neon"><Play className="h-4 w-4" /> Unirse al directo</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <Link to="/studio" className="glass rounded-2xl p-6 hover:border-primary/50 transition-colors group">
          <div className="h-12 w-12 rounded-xl gradient-primary-bg flex items-center justify-center glow">
            <Play className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Emitir ahora</h3>
          <p className="mt-1 text-sm text-muted-foreground">Abre el Studio y empieza a transmitir en segundos.</p>
        </Link>
        <Link to="/ai-tools" className="glass rounded-2xl p-6 hover:border-neon/50 transition-colors group">
          <div className="h-12 w-12 rounded-xl gradient-neon-bg flex items-center justify-center glow-neon">
            <Sparkles className="h-5 w-5 text-neon-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Herramientas IA</h3>
          <p className="mt-1 text-sm text-muted-foreground">Genera guiones, clips, miniaturas y títulos con IA.</p>
        </Link>
        <Link to="/analytics" className="glass rounded-2xl p-6 hover:border-purple-glow/50 transition-colors group">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center glow" style={{ background: "linear-gradient(135deg, var(--purple-glow), var(--primary))" }}>
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Ver analítica</h3>
          <p className="mt-1 text-sm text-muted-foreground">Métricas en tiempo real de todas las plataformas donde emites.</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Próximas
            </h2>
            <Link to="/broadcasts" className="text-sm text-primary hover:underline">Ver todas →</Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="h-14 w-20 rounded-lg shrink-0" style={{ background: b.thumbnail }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.date} · {b.platforms.join(" · ")}</p>
                </div>
                <StatusPill status={b.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Transmisiones recientes</h2>
            <Link to="/library" className="text-sm text-primary hover:underline">Librería →</Link>
          </div>
          <div className="space-y-3">
            {recent.map((b) => (
              <div key={b.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="h-14 w-20 rounded-lg shrink-0" style={{ background: b.thumbnail }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.peakViewers.toLocaleString("es")} espectadores · {b.duration}</p>
                </div>
                <span className="text-xs font-bold text-neon">{b.engagement}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
