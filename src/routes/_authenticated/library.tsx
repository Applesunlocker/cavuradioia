import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { useLibraryItems, useCreateLibraryItem, useBroadcasts, formatDuration } from "@/lib/queries";
import { Sparkles, Play, Download, Scissors, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({ meta: [{ title: "Librería — NovaStream AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { data: items, isLoading } = useLibraryItems();
  const { data: broadcasts } = useBroadcasts();
  const create = useCreateLibraryItem();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const filtered = (items ?? []).filter((v) => !search || v.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    const title = prompt("Título del clip / grabación:");
    if (!title?.trim()) return;
    try {
      await create.mutateAsync({ title: title.trim(), item_type: "clip" });
      toast.success("Añadido a la librería");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
  };

  const runSearch = () => {
    if (!query.trim()) return;
    setSearch(query.trim());
    toast.info("Búsqueda por texto. La búsqueda semántica con IA llega en la Fase 4.");
  };

  return (
    <AppShell>
      <PageHeader
        title="Librería"
        description="Todas tus transmisiones, clips y recursos — buscables por texto (semántica con IA en Fase 4)."
        action={<Button onClick={handleCreate}><Plus className="h-4 w-4" /> Añadir item</Button>}
      />

      <div className="glass-strong rounded-2xl p-4 mb-8 border border-neon/30">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-neon shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Buscar en tu librería..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <Button variant="neon" className="!py-2 !text-xs" onClick={runSearch}>Buscar</Button>
        </div>
        {search && <p className="mt-3 text-xs text-muted-foreground">Filtrando por «{search}» — <button className="underline" onClick={() => { setSearch(""); setQuery(""); }}>limpiar</button></p>}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Tu librería está vacía{search ? " para esa búsqueda" : ""}.</p>
          {!search && <Button onClick={handleCreate}><Plus className="h-4 w-4" /> Añadir el primer clip</Button>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => {
            const parent = broadcasts?.find((b) => b.id === v.broadcast_id);
            return (
              <div key={v.id} className="glass rounded-2xl overflow-hidden group">
                <div className="aspect-video relative" style={{ background: v.thumbnail ?? "linear-gradient(135deg, oklch(0.5 0.2 260), oklch(0.3 0.18 305))" }}>
                  <button className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-14 w-14 rounded-full gradient-primary-bg flex items-center justify-center glow">
                      <Play className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </button>
                  <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-xs">{formatDuration(v.duration_seconds)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{v.item_type}{parent ? ` · de ${parent.title}` : ""}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent"><Scissors className="h-3 w-3" /> Clips IA</button>
                    {v.url && <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent"><Download className="h-3 w-3" /> Descargar</a>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
