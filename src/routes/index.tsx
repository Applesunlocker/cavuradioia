import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Radio, Zap, Globe2, Bot, Scissors } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NovaStream AI — Live streaming, supercharged by AI" },
      { name: "description", content: "Broadcast professional live shows to every platform, with an AI co-host that clips, captions and grows your audience." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg gradient-primary-bg flex items-center justify-center glow">
              <Sparkles className="h-4 w-4 text-neon-foreground" />
            </div>
            <span>NovaStream<span className="gradient-text"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#ai" className="hover:text-foreground">AI</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </div>
          <Link
            to="/dashboard"
            className="rounded-xl gradient-primary-bg px-4 py-2 text-sm font-semibold text-primary-foreground glow"
          >
            Open Studio
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-32 max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-neon">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Agentic AI
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Live streaming, <span className="gradient-text">reimagined</span> for the AI era.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Broadcast to every platform in seconds. Your AI co-host directs the show, clips highlights, and writes the captions — while you focus on the conversation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary-bg px-6 py-3.5 font-semibold text-primary-foreground glow hover:scale-105 transition-transform"
          >
            Start Streaming Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 font-semibold hover:bg-accent"
          >
            Enter Studio
          </Link>
        </div>

        {/* Preview mock */}
        <div className="mt-20 relative">
          <div className="absolute -inset-8 gradient-vibrant-bg opacity-30 blur-3xl rounded-[3rem]" />
          <div className="relative rounded-3xl glass-strong p-3 shadow-elegant">
            <div className="aspect-video rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, oklch(0.3 0.18 260), oklch(0.25 0.2 305))" }}>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white live-dot">● Live</span>
                <span className="rounded-full glass px-2.5 py-1 text-[10px] font-semibold">4,827 watching</span>
              </div>
              <div className="absolute inset-0 grid grid-cols-3 gap-2 p-16">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl glass-strong flex items-center justify-center text-3xl">
                    {["🎙️", "👤", "💡"][i - 1]}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl px-4 py-3 flex items-center gap-3">
                <Bot className="h-5 w-5 text-neon" />
                <span className="text-sm">AI Director: <strong>Switching to focus layout — Maya is speaking.</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center">Everything pros need.<br /><span className="gradient-text">Nothing they don't.</span></h2>
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {[
            { icon: Radio, title: "Multi-stream everywhere", desc: "YouTube, Twitch, LinkedIn, TikTok, X, Custom RTMP — all at once, in landscape & portrait." },
            { icon: Bot, title: "AI Co-Host & Director", desc: "Auto layouts, smart switching, lower thirds, color correction. Like a producer in your browser." },
            { icon: Scissors, title: "Auto Clips & Repurpose", desc: "Highlights, shorts, transcripts, summaries — generated the moment you go offline." },
            { icon: Zap, title: "Browser Studio", desc: "Drag-and-drop layouts, media board, overlays. No downloads. Invite guests with a link." },
            { icon: Globe2, title: "Vertical + Landscape", desc: "Stream both aspect ratios simultaneously. Perfect for TikTok + YouTube workflows." },
            { icon: Sparkles, title: "Predictive Analytics", desc: "AI tells you when to stream, what to title, and what's working with your audience." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="h-11 w-11 rounded-xl gradient-primary-bg flex items-center justify-center glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 max-w-5xl mx-auto text-center">
        <div className="glass-strong rounded-3xl p-12 md:p-16 glow">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to broadcast <span className="gradient-text">smarter?</span></h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands of creators streaming with NovaStream AI.</p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl gradient-primary-bg px-7 py-3.5 font-semibold text-primary-foreground glow hover:scale-105 transition-transform"
          >
            Launch your first stream <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © 2026 NovaStream AI — Built for creators.
      </footer>
    </div>
  );
}
