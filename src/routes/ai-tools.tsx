import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { aiTools } from "@/lib/mock-data";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({ meta: [{ title: "Herramientas IA — NovaStream AI" }] }),
  component: AITools,
});

function AITools() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setOutput(
      `✨ Título sugerido: "${prompt} — La guía definitiva 2026"\n\n📝 Descripción: Un análisis a fondo sobre ${prompt.toLowerCase()}, con ejemplos reales y frameworks aplicables desde el primer día. Con invitados expertos y preguntas en vivo.\n\n🎯 Etiquetas SEO: ${prompt}, masterclass, 2026, en vivo, IA\n\n🎬 Gancho inicial: "Si alguna vez has luchado con ${prompt.toLowerCase()}, los próximos 60 minutos cambiarán cómo lo ves para siempre."`
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Herramientas IA"
        description="La suite de IA más potente jamás integrada en una plataforma de streaming en vivo."
      />

      {/* Hero AI playground */}
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

          <div className="mt-5 flex flex-col md:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ej. IA en gestión de producto"
              className="flex-1 rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
            />
            <Button variant="neon" onClick={generate}><Send className="h-4 w-4" /> Generar</Button>
          </div>

          {output && (
            <div className="mt-5 rounded-xl bg-background/60 border border-border p-5 text-sm whitespace-pre-wrap font-mono">
              {output}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Todas las herramientas IA</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiTools.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-6 hover:border-neon/40 transition-colors group cursor-pointer">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center text-2xl glow`}>
              {t.icon}
            </div>
            <h3 className="mt-4 font-semibold">{t.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
            <button className="mt-4 text-xs font-semibold text-neon group-hover:underline">Abrir herramienta →</button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
