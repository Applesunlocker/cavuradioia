import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { aiTools } from "@/lib/mock-data";
import { generateStreamContent } from "@/lib/ai.functions";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-tools")({
  head: () => ({
    meta: [
      { title: "Herramientas IA — NovaStream AI" },
      { name: "description", content: "Genera guiones, títulos, descripciones, clips y miniaturas para tus directos con IA real." },
    ],
  }),
  component: AITools,
});

type ToolKey = "paquete" | "guion" | "titulos" | "descripcion" | "clips" | "resumen" | "traduccion";

const toolOptions: { key: ToolKey; label: string }[] = [
  { key: "paquete", label: "Paquete completo" },
  { key: "guion", label: "Guion del directo" },
  { key: "titulos", label: "10 títulos" },
  { key: "descripcion", label: "Descripción SEO" },
  { key: "clips", label: "Momentos para clips" },
  { key: "resumen", label: "Resumen en puntos" },
  { key: "traduccion", label: "Traducir al inglés" },
];

function AITools() {
  const generate = useServerFn(generateStreamContent);
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState<ToolKey>("paquete");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "IA en gestión de producto",
    "Cómo lanzar un podcast en 2026",
    "Estrategias de crecimiento en YouTube",
    "Entrevista con un fundador early-stage",
  ];

  const run = async (text?: string, forcedTool?: ToolKey) => {
    const q = (text ?? prompt).trim();
    if (!q) return toast.error("Escribe un tema para tu directo.");
    setPrompt(q);
    if (forcedTool) setTool(forcedTool);
    setLoading(true);
    setOutput(null);
    try {
      const res = await generate({ data: { topic: q, tool: forcedTool ?? tool } });
      setOutput(res.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "No se pudo generar el contenido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Herramientas IA"
        description="Contenido generado con IA real: guiones, títulos, descripciones, clips y miniaturas."
      />

      <div className="glass-strong rounded-3xl p-6 md:p-8 mb-10 border border-neon/30 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-neon/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-glow/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-neon" />
            <span className="text-xs font-bold tracking-widest uppercase text-neon">Playground de IA</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Genera guiones, títulos, descripciones y miniaturas</h2>
          <p className="text-sm text-muted-foreground mt-2">Describe el tema de tu stream y deja que la IA haga el trabajo pesado.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {toolOptions.map((t) => (
              <button
                key={t.key}
                onClick={() => setTool(t.key)}
                className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                  tool === t.key ? "border-neon text-neon bg-neon/10" : "border-border bg-background/40 hover:border-neon/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && run()}
              placeholder="ej. IA en gestión de producto"
              className="flex-1 rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
            />
            <Button variant="neon" onClick={() => run()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Generando…" : "Generar"}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Prueba:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => run(s)}
                disabled={loading}
                className="text-xs rounded-full border border-border bg-background/40 hover:border-neon/50 hover:text-neon px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-5 rounded-xl bg-background/60 border border-border p-5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-neon" /> La IA está pensando…
            </div>
          )}

          {output && !loading && (
            <div className="mt-5 rounded-xl bg-background/60 border border-border p-5 text-sm whitespace-pre-wrap">
              {output}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(output); toast.success("Copiado al portapapeles"); }}
                  className="text-xs rounded-md bg-secondary/60 px-3 py-1.5 hover:bg-accent"
                >
                  Copiar
                </button>
                <button onClick={() => run()} className="text-xs rounded-md bg-secondary/60 px-3 py-1.5 hover:bg-accent">
                  Regenerar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Todas las herramientas IA</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiTools.map((t, i) => (
          <div key={t.id} className="glass rounded-2xl p-6 hover:border-neon/40 transition-colors group">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center text-2xl glow`}>
              {t.icon}
            </div>
            <h3 className="mt-4 font-semibold">{t.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
            <button
              onClick={() => run(prompt || suggestions[0], toolOptions[i % toolOptions.length].key)}
              disabled={loading}
              className="mt-4 text-xs font-semibold text-neon group-hover:underline disabled:opacity-50"
            >
              Abrir herramienta →
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
