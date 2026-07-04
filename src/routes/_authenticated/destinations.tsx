import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { platformCatalog } from "@/lib/mock-data";
import { useDestinations, useUpsertDestination } from "@/lib/queries";
import { Plus, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/destinations")({
  head: () => ({ meta: [{ title: "Destinos — NovaStream AI" }] }),
  component: Destinations,
});

function Destinations() {
  const { data: destinations, isLoading } = useDestinations();
  const upsert = useUpsertDestination();

  const toggle = async (platform: string, name: string, color: string, connected: boolean) => {
    try {
      await upsert.mutateAsync({ platform, display_name: name, color, connected: !connected });
      toast.success(connected ? "Desconectado" : "Conectado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const isConnected = (id: string) => destinations?.find((d) => d.platform === id)?.connected ?? false;

  return (
    <AppShell>
      <PageHeader
        title="Destinos"
        description="Conecta cada plataforma una vez. Multi-streaming simultáneo en horizontal y vertical."
        action={<Button><Plus className="h-4 w-4" /> Añadir RTMP personalizado</Button>}
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformCatalog.map((p) => {
            const connected = isConnected(p.id);
            return (
              <div key={p.id} className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: p.color }}>
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{connected ? "Conectado · streaming activo" : "No conectado"}</p>
                </div>
                {connected ? (
                  <button
                    onClick={() => toggle(p.id, p.name, p.color, true)}
                    className="rounded-full bg-neon/15 text-neon px-3 py-1 text-xs font-bold flex items-center gap-1 hover:bg-neon/25"
                  >
                    <Check className="h-3 w-3" /> ON
                  </button>
                ) : (
                  <button
                    onClick={() => toggle(p.id, p.name, p.color, false)}
                    className="rounded-lg bg-secondary/60 hover:bg-accent px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                  >
                    <LinkIcon className="h-3 w-3" /> Conectar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Perfiles de emisión</h2>
        <p className="text-sm text-muted-foreground mt-1">Presets multi-plataforma preconfigurados para emitir con un clic.</p>
        <div className="mt-5 grid md:grid-cols-3 gap-3">
          {[
            { name: "Alcance total", platforms: "YouTube + LinkedIn + X", ratio: "16:9 + 9:16" },
            { name: "Stack de Podcast", platforms: "YouTube + Twitch", ratio: "16:9" },
            { name: "Formato corto", platforms: "TikTok + Instagram", ratio: "9:16" },
          ].map((p) => (
            <div key={p.name} className="rounded-xl bg-secondary/40 p-4 border border-border">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.platforms}</p>
              <p className="text-xs text-neon mt-1 font-semibold">{p.ratio}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
