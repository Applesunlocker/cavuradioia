import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { useLibraryItems, useCreateLibraryItem, useBroadcasts, formatDuration, type LibraryItem } from "@/lib/queries";
import { semanticLibrarySearch } from "@/lib/ai.functions";
import { uploadMedia, useMediaUrl } from "@/lib/storage";
import { Sparkles, Play, Download, Scissors, Plus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Librería — NovaStream AI" },
      { name: "description", content: "Busca tus grabaciones y clips con búsqueda semántica impulsada por IA." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { data: items, isLoading } = useLibraryItems();
  const { data: broadcasts } = useBroadcasts();
  const create = useCreateLibraryItem();
  const runSemantic = useServerFn(semanticLibrarySearch);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<{ intent: string; summary: string; ids: string[] } | null>(null);

  const all = items ?? [];
  const filtered = result
    ? result.ids.map((id) => all.find((i) => i.id === id)).filter((v): v is (typeof all)[number] => Boolean(v))
    : all;

  const handleCreate = async () => {
    const title = prompt("Título del clip / grabación:");
    if (!title?.trim()) return;
    try {
      await create.mutateAsync({ title: title.trim(), item_type: "clip" });
      toast.success("Añadido a la librería");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
  };

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setResult(null);
    try {
      const res = await runSemantic({
        data: { query: q, items: all.slice(0, 60).map((i) => ({ id: i.id, title: i.title, item_type: i.item_type })) },
      });
      setResult(res);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "No se pudo completar la búsqueda semántica.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Librería"
        description="Todas tus transmisiones, clips y recursos — con búsqueda semántica por IA."
        action={<Button onClick={handleCreate}><Plus className="h-4 w-4" /> Añadir item</Button>}
      />

      <div className="glass-strong rounded-2xl p-4 mb-8 border border-neon/30">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-neon shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !searching && runSearch()}
            placeholder="Describe lo que buscas: «el momento donde hablamos de precios»"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <Button variant="neon" className="!py-2 !text-xs" onClick={runSearch} disabled={searching}>
            {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} {searching ? "Buscando…" : "Buscar"}
          </Button>
        </div>
        {result && (
          <div className="mt-3 space-y-1 text-xs">
            <p className="text-neon">Intención detectada: {result.intent}</p>
            <p className="text-muted-foreground">{result.summary}</p>
            <button className="underline text-muted-foreground" onClick={() => { setResult(null); setQuery(""); }}>limpiar búsqueda</button>
          </div>
        )}
      </div>


      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Tu librería está vacía{result ? " para esa búsqueda" : ""}.</p>
          {!result && <Button onClick={handleCreate}><Plus className="h-4 w-4" /> Añadir el primer clip</Button>}

        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => (
            <LibraryCard key={v.id} item={v} parentTitle={broadcasts?.find((b) => b.id === v.broadcast_id)?.title} />
          ))}
        </div>

      )}
    </AppShell>
  );
}

function LibraryCard({ item, parentTitle }: { item: LibraryItem; parentTitle?: string }) {
  const { data: thumbUrl } = useMediaUrl(item.thumbnail);
  const { data: fileUrl } = useMediaUrl(item.url);
  const href = fileUrl ?? (item.url && /^https?:/.test(item.url) ? item.url : null);

  return (
    <div className="glass rounded-2xl overflow-hidden group">
      <div
        className="aspect-video relative"
        style={
          thumbUrl
            ? { backgroundImage: `url(${thumbUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: "linear-gradient(135deg, oklch(0.5 0.2 260), oklch(0.3 0.18 305))" }
        }
      >
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-14 w-14 rounded-full gradient-primary-bg flex items-center justify-center glow">
              <Play className="h-5 w-5 text-primary-foreground" />
            </div>
          </a>
        )}
        <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 text-xs">{formatDuration(item.duration_seconds)}</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{item.item_type}{parentTitle ? ` · de ${parentTitle}` : ""}</p>
        <div className="mt-3 flex gap-2">
          <button className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent"><Scissors className="h-3 w-3" /> Clips IA</button>
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs rounded-md bg-secondary/60 px-2 py-1 flex items-center gap-1 hover:bg-accent">
              <Download className="h-3 w-3" /> Descargar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

