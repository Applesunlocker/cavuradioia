import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, StatCard } from "@/components/ui-bits";
import { metrics } from "@/lib/mock-data";
import { Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analítica — NovaStream AI" }] }),
  component: Analytics,
});

function Analytics() {
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
          <h2 className="text-lg font-semibold">Espectadores en el tiempo</h2>
          <div className="flex gap-2 text-xs">
            {["7d", "30d", "90d"].map((p, i) => (
              <button key={p} className={`rounded-md px-3 py-1.5 font-semibold ${i === 1 ? "gradient-primary-bg text-primary-foreground" : "bg-secondary/60"}`}>{p}</button>
            ))}
          </div>
        </div>
        <FakeChart />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Plataformas principales</h3>
          {[
            { name: "YouTube", value: 62, color: "oklch(0.65 0.24 25)" },
            { name: "LinkedIn", value: 24, color: "oklch(0.55 0.18 245)" },
            { name: "Twitch", value: 9, color: "oklch(0.55 0.22 295)" },
            { name: "TikTok", value: 5, color: "oklch(0.65 0.2 350)" },
          ].map((p) => (
            <div key={p.name} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <span>{p.name}</span>
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
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><TrendingUp className="h-4 w-4 text-neon mt-0.5 shrink-0" />Emitir los jueves a las <strong>18:00</strong> haría crecer tu audiencia un estimado <strong>+24%</strong>.</li>
              <li className="flex gap-3"><TrendingUp className="h-4 w-4 text-neon mt-0.5 shrink-0" />El patrón de título "Cómo yo…" rinde <strong>3,1×</strong> mejor. Considéralo para tu próximo stream.</li>
              <li className="flex gap-3"><TrendingUp className="h-4 w-4 text-neon mt-0.5 shrink-0" />Tu audiencia está más enganchada en los minutos <strong>14-22</strong>. Pon el contenido clave al inicio.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FakeChart() {
  const points = [40, 55, 48, 70, 62, 80, 75, 92, 85, 95, 88, 100, 92, 110];
  const max = Math.max(...points);
  return (
    <div className="h-48 flex items-end gap-2">
      {points.map((p, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div
            className="w-full rounded-t-md gradient-primary-bg opacity-90 hover:opacity-100 transition-opacity"
            style={{ height: `${(p / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}
