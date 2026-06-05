import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { broadcasts } from "@/lib/mock-data";
import { Sparkles, Play, Download, Scissors } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Librería — NovaStream AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const videos = broadcasts.filter((b) => b.status === "completed");
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
            placeholder='Prueba: "muéstrame clips donde hablo sobre estrategia de marketing"'
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <Button variant="neon" className="!py-2 !text-xs">Buscar con IA</Button>
        </div>
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
