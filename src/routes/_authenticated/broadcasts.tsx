import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, StatusPill, Button } from "@/components/ui-bits";
import { useBroadcasts, useCreateBroadcast, useDeleteBroadcast, formatDuration, formatDate } from "@/lib/queries";
import { Plus, LayoutGrid, List, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/broadcasts")({
  head: () => ({ meta: [{ title: "Transmisiones — NovaStream AI" }] }),
  component: Broadcasts,
});

const STATUS_LABELS: Record<string, string> = {
  all: "Todas", live: "En vivo", scheduled: "Programadas", completed: "Finalizadas", draft: "Borradores",
};

function Broadcasts() {
  const { data: broadcasts, isLoading } = useBroadcasts();
  const createMut = useCreateBroadcast();
  const deleteMut = useDeleteBroadcast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = (broadcasts ?? [])
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => !search || b.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    const title = prompt("Título de la nueva transmisión:");
    if (!title?.trim()) return;
    try {
      await createMut.mutateAsync({ title: title.trim(), status: "draft" });
      toast.success("Transmisión creada");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al crear");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar «${title}»?`)) return;
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Eliminada");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Transmisiones"
        description="Todos tus directos, próximos streams y emisiones archivadas en un solo lugar."
        action={<Button onClick={handleCreate}><Plus className="h-4 w-4" /> Nueva transmisión</Button>}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transmisiones..."
            className="w-full rounded-xl bg-secondary/60 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "live", "scheduled", "completed", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                filter === s ? "gradient-primary-bg text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border bg-secondary/60 p-1">
          <button onClick={() => setView("grid")} className={`rounded-md p-1.5 ${view === "grid" ? "bg-accent" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView("list")} className={`rounded-md p-1.5 ${view === "list" ? "bg-accent" : ""}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Aún no tienes transmisiones{filter !== "all" ? " en este estado" : ""}.</p>
          <Button onClick={handleCreate}><Plus className="h-4 w-4" /> Crear la primera</Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div key={b.id} className="glass rounded-2xl overflow-hidden hover:border-primary/40 transition-colors group relative">
              <div className="aspect-video relative" style={{ background: b.thumbnail ?? "linear-gradient(135deg, oklch(0.5 0.2 260), oklch(0.3 0.18 305))" }}>
                <div className="absolute top-3 left-3"><StatusPill status={b.status} /></div>
                <div className="absolute bottom-3 right-3 rounded-md bg-background/70 backdrop-blur px-2 py-0.5 text-xs font-medium">
                  {formatDuration(b.duration_seconds)}
                </div>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="absolute top-3 right-3 rounded-md bg-background/70 backdrop-blur p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-snug line-clamp-2">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(b.scheduled_at)} · {b.host_name ?? "—"}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{b.platforms.length > 0 ? b.platforms.join(" · ") : "Sin destinos"}</span>
                  {b.engagement > 0 && <span className="font-bold text-neon">{b.engagement}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Título</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-right px-4 py-3">Espectadores</th>
                <th className="text-right px-4 py-3">Engagement</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(b.scheduled_at)}</td>
                  <td className="px-4 py-3 text-right">{b.peak_viewers.toLocaleString("es")}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neon">{b.engagement > 0 ? `${b.engagement}%` : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(b.id, b.title)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
