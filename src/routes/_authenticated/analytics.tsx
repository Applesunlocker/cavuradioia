import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, StatCard } from "@/components/ui-bits";
import { useAnalyticsEvents, useBroadcasts } from "@/lib/queries";
import { Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analítica — NovaStream AI" }] }),
  component: Analytics,
});

function Analytics() {
  const { data: events, isLoading } = useAnalyticsEvents(30);
  const { data: broadcasts } = useBroadcasts();

  const metrics = useMemo(() => {
    const evts = events ?? [];
    const bcs = broadcasts ?? [];
    const totalViewers = evts.filter((e) => e.event_type === "viewer").reduce((s, e) => s + Number(e.value), 0);
    const engEvents = evts.filter((e) => e.event_type === "engagement");
    const avgEng = engEvents.length ? engEvents.reduce((s, e) => s + Number(e.value), 0) / engEvents.length : 0;
    const totalHours = bcs.reduce((s, b) => s + b.duration_seconds, 0) / 3600;
    const clips = evts.filter((e) => e.event_type === "clip_generated").length;
    return [
      { label: "Espectadores totales", value: totalViewers.toLocaleString("es"), delta: "30 días", positive: true },
      { label: "Engagement promedio", value: `${avgEng.toFixed(0)}%`, delta: "30 días", positive: avgEng > 50 },
      { label: "Horas transmitidas", value: `${totalHours.toFixed(0)}h`, delta: `${bcs.length} streams`, positive: true },
      { label: "Clips generados por IA", value: String(clips), delta: "30 días", positive: true },
    ];
  }, [events, broadcasts]);

  const chartData = useMemo(() => {
    const buckets = new Array(14).fill(0);
    const now = Date.now();
    (events ?? []).filter((e) => e.event_type === "viewer").forEach((e) => {
      const days = Math.floor((now - new Date(e.occurred_at).getTime()) / 86400_000);
      if (days >= 0 && days < 14) buckets[13 - days] += Number(e.value);
    });
    return buckets;
  }, [events]);

  const platformShare = useMemo(() => {
    const totals: Record<string, number> = {};
    (events ?? []).filter((e) => e.event_type === "viewer" && e.platform).forEach((e) => {
      totals[e.platform!] = (totals[e.platform!] ?? 0) + Number(e.value);
    });
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    if (!total) return [];
    return Object.entries(totals)
      .map(([name, v]) => ({ name, value: Math.round((v / total) * 100), color: platformColor(name) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [events]);

  return (
    <AppShell>
      <PageHeader
        title="Analítica"
        description="Rendimiento en tiempo real e histórico en todas las plataformas donde emites."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => <StatCard key={m.label} {...m} />)}
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Espectadores últimos 14 días</h2>
        </div>
        {isLoading ? <p className="text-muted-foreground text-sm">Cargando…</p> : <FakeChart points={chartData} />}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Plataformas principales</h3>
          {platformShare.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos aún. Los eventos aparecerán aquí cuando transmitas.</p>
          ) : platformShare.map((p) => (
            <div key={p.name} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="capitalize">{p.name}</span>
                <span className="font-semibold">{p.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.value}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-neon/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-neon" />
              <span className="text-xs font-bold tracking-widest uppercase text-neon">Insights predictivos</span>
            </div>
            <h3 className="text-lg font-semibold">Recomendaciones de IA</h3>
            <p className="mt-4 text-sm text-muted-foreground">Las recomendaciones basadas en IA se activan en la <strong>Fase 4</strong> (motor de análisis predictivo).</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function platformColor(name: string): string {
  const map: Record<string, string> = {
    youtube: "oklch(0.65 0.24 25)",
    linkedin: "oklch(0.55 0.18 245)",
    twitch: "oklch(0.55 0.22 295)",
    tiktok: "oklch(0.65 0.2 350)",
    instagram: "oklch(0.6 0.22 25)",
    facebook: "oklch(0.55 0.18 250)",
    x: "oklch(0.4 0.02 270)",
  };
  return map[name.toLowerCase()] ?? "oklch(0.55 0.18 260)";
}

function FakeChart({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  return (
    <div className="h-48 flex items-end gap-2">
      {points.map((p, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div className="w-full rounded-t-md gradient-primary-bg opacity-90 hover:opacity-100 transition-opacity" style={{ height: `${(p / max) * 100}%`, minHeight: "2px" }} />
        </div>
      ))}
    </div>
  );
}
