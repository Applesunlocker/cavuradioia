import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { broadcasts } from "@/lib/mock-data";
import { Sparkles, Play, Download, Scissors } from "lucide-react";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({ meta: [{ title: "Librería — NovaStream AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const videos = broadcasts.filter((b) => b.status === "completed");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    intent: string;
    summary: string;
    matches: { title: string; moment: string; quote: string }[];
  } | null>(null);

  const detectIntent = (q: string) => {
    const lower = q.toLowerCase();
    if (/(clip|short|highlight|momento)/.test(lower)) return "Buscar clips y momentos destacados";
    if (/(quién|invitad|host|ponente)/.test(lower)) return "Identificar personas e invitados";
    if (/(cómo|tutorial|explica|guía)/.test(lower)) return "Encontrar explicaciones y tutoriales";
    if (/(error|problema|fallo|bug)/.test(lower)) return "Localizar incidencias y soluciones";
    return "Búsqueda temática en transmisiones";
  };

  const search = () => {
    const q = query.trim();
    if (!q) return;
    const lower = q.toLowerCase();
    setResults({
      intent: detectIntent(q),
      summary: `He revisado tus 3 transmisiones más relevantes y encontré 3 momentos donde se aborda «${q}». El tema aparece sobre todo en contextos de producto y estrategia, con un sentimiento mayoritariamente positivo de la audiencia. Te recomiendo convertir el segmento de WebRTC en un short vertical: es el de mayor retención.`,
      matches: [
        {
          title: "Diseñando para 2026: Tendencias y Predicciones",
          moment: "00:12:48",
          quote: `"…cuando hablamos de ${lower}, la clave está en iterar rápido con feedback real de la audiencia…"`,
        },
        {
          title: "Detrás del Código: WebRTC en Tiempo Real a Fondo",
          moment: "00:47:21",
          quote: `"…un buen ejemplo de ${lower} es cómo medimos el engagement minuto a minuto…"`,
        },
        {
          title: "IA en Marketing: Mesa Redonda en Vivo",
          moment: "01:03:10",
          quote: `"…la IA ya nos permite resumir horas de contenido sobre ${lower} en clips listos para publicar…"`,
        },
      ],
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Librería"
        description="Todas tus transmisiones, clips y recursos generados por IA — buscables en lenguaje natural."
      />

      <div className="glass-strong rounded-2xl p-4 mb-8 border border-neon/30">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-neon shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder='Prueba: "muéstrame clips donde hablo sobre estrategia de marketing"'
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <Button variant="neon" className="!py-2 !text-xs" onClick={search}>Buscar con IA</Button>
        </div>

        {results && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-background/60 border border-neon/20 p-3">
              <p className="text-[10px] uppercase tracking-widest text-neon font-bold mb-1">Intención detectada</p>
              <p className="text-sm font-semibold">{results.intent}</p>
              <p className="text-[10px] uppercase tracking-widest text-neon font-bold mt-3 mb-1">Resumen IA</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{results.summary}</p>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-neon font-bold pt-1">Coincidencias semánticas</p>
            {results.matches.map((r, i) => (
              <div key={i} className="rounded-xl bg-background/60 border border-border p-3 flex items-start gap-3">
                <span className="text-xs font-mono text-neon shrink-0 mt-0.5">{r.moment}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{r.quote}</p>
                </div>
                <button className="text-xs text-primary hover:underline shrink-0">Ir al momento →</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <div key={v.id} className="glass rounded-2xl overflow-hidden group">
            <div className="aspect-video relative" style={{ background: v.thumbnail }}>
              <button className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-14 w-14 rounded-full gradient-primary-bg flex items-center justify-center glow">
                  <Play className="h-5 w-5 text-primary-foreground" />
                </div>
              </button>
              <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-xs">{v.duration}</div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{v.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{v.date} · {v.peakViewers.toLocaleString("es")} visualizaciones</p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent">
                  <Scissors className="h-3 w-3" /> Clips IA
                </button>
                <button className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent">
                  <Download className="h-3 w-3" /> Descargar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
