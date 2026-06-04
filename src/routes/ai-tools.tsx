import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { aiTools } from "@/lib/mock-data";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({ meta: [{ title: "AI Tools — NovaStream AI" }] }),
  component: AITools,
});

function AITools() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setOutput(
      `✨ Suggested title: "${prompt} — The 2026 Playbook"\n\n📝 Description: A deep dive into ${prompt.toLowerCase()}, with real examples and frameworks you can apply immediately. Featuring expert guests and audience Q&A.\n\n🎯 SEO tags: ${prompt}, masterclass, 2026, live, AI\n\n🎬 Opening hook: "If you've ever struggled with ${prompt.toLowerCase()}, the next 60 minutes will change how you think about it forever."`
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Tools"
        description="The most powerful AI suite ever built into a live streaming platform."
      />

      {/* Hero AI playground */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 mb-10 border border-neon/30 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-neon/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-glow/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-neon" />
            <span className="text-xs font-bold tracking-widest uppercase text-neon">AI Playground</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Generate scripts, titles, descriptions & thumbnails</h2>
          <p className="text-sm text-muted-foreground mt-2">Describe your stream topic and let AI do the heavy lifting.</p>

          <div className="mt-5 flex flex-col md:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. AI in product management"
              className="flex-1 rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
            />
            <Button variant="neon" onClick={generate}><Send className="h-4 w-4" /> Generate</Button>
          </div>

          {output && (
            <div className="mt-5 rounded-xl bg-background/60 border border-border p-5 text-sm whitespace-pre-wrap font-mono">
              {output}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">All AI tools</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiTools.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-6 hover:border-neon/40 transition-colors group cursor-pointer">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center text-2xl glow`}>
              {t.icon}
            </div>
            <h3 className="mt-4 font-semibold">{t.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
            <button className="mt-4 text-xs font-semibold text-neon group-hover:underline">Open tool →</button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
