import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { aiTools } from "@/lib/mock-data";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/ai-tools")({
  head: () => ({ meta: [{ title: "Herramientas IA — NovaStream AI" }] }),
  component: AITools,
});

function AITools() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const suggestions = [
    "IA en gestión de producto",
    "Cómo lanzar un podcast en 2026",
    "Estrategias de crecimiento en YouTube",
    "Entrevista con un fundador early-stage",
  ];

  const generate = (text?: string) => {
    const q = (text ?? prompt).trim();
    if (!q) return;
    setPrompt(q);
    setOutput(
      `✨ Título sugerido: "${q} — La guía definitiva 2026"\n\n📝 Descripción: Un análisis a fondo sobre ${q.toLowerCase()}, con ejemplos reales y frameworks aplicables desde el primer día. Acompañado de invitados expertos y preguntas en vivo del público.\n\n🎯 Etiquetas SEO: ${q}, masterclass, 2026, en vivo, IA, español\n\n🎬 Gancho inicial: "Si alguna vez has luchado con ${q.toLowerCase()}, los próximos 60 minutos cambiarán cómo lo ves para siempre."\n\n🖼️ Idea de miniatura: Primer plano del presentador con expresión de asombro, texto grande en amarillo neón "${q.toUpperCase()}" y un fondo degradado púrpura-cian.\n\n📣 Llamada a la acción: "Suscríbete y activa la campanita para no perderte el siguiente directo sobre ${q.toLowerCase()}."`
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
            <Button variant="neon" onClick={() => generate()}><Send className="h-4 w-4" /> Generar</Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Prueba:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => generate(s)}
                className="text-xs rounded-full border border-border bg-background/40 hover:border-neon/50 hover:text-neon px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
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
