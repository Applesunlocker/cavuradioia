import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui-bits";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, Settings2, Users,
  Layout, Sparkles, Bot, ChevronUp, Send, Image as ImageIcon, Type, Square,
} from "lucide-react";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [{ title: "Studio — NovaStream AI" }] }),
  component: Studio,
});

function Studio() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [layout, setLayout] = useState<"grid" | "focus" | "pip">("grid");

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] -mt-2">
        {/* Left tools rail */}
        <aside className="lg:w-56 glass rounded-2xl p-3 space-y-1 lg:overflow-y-auto shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1.5">Sources</p>
          {[
            { icon: Video, label: "Camera" },
            { icon: Monitor, label: "Screen share" },
            { icon: ImageIcon, label: "Media board" },
            { icon: Type, label: "Lower third" },
            { icon: Square, label: "Overlay" },
            { icon: Users, label: "Invite guest" },
          ].map((t) => (
            <button key={t.label} className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-accent">
              <t.icon className="h-4 w-4 text-primary" />
              {t.label}
            </button>
          ))}

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pt-4 pb-1.5">Layouts</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(["grid", "focus", "pip"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`aspect-video rounded-md border ${
                  layout === l ? "border-primary bg-primary/10 glow" : "border-border bg-secondary/40"
                }`}
                title={l}
              >
                <Layout className="h-3 w-3 mx-auto text-muted-foreground" />
              </button>
            ))}
          </div>
        </aside>

        {/* Stage */}
        <section className="flex-1 flex flex-col min-w-0 gap-3">
          <div className="flex-1 relative rounded-2xl overflow-hidden glass-strong">
            {/* Status bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-wider text-white live-dot">● Live</span>
                <span className="rounded-full glass px-3 py-1 text-xs font-semibold">01:24:32</span>
                <span className="rounded-full glass px-3 py-1 text-xs font-semibold">4,827 watching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full glass px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon" /> 1080p · 60fps
                </span>
              </div>
            </div>

            {/* Stage preview */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.25 0.05 270), oklch(0.18 0.04 290))" }}
            >
              <div className={`grid gap-3 p-12 w-full h-full ${
                layout === "grid" ? "grid-cols-2 grid-rows-2" : layout === "focus" ? "grid-cols-1" : "grid-cols-1"
              }`}>
                {(layout === "grid" ? [1, 2, 3, 4] : [1]).map((i) => (
                  <div key={i} className="relative rounded-xl glass-strong overflow-hidden flex items-center justify-center">
                    <div className="text-6xl opacity-60">{["🎙️", "👤", "💡", "📊"][i - 1] || "🎙️"}</div>
                    <div className="absolute bottom-2 left-2 rounded-md glass px-2 py-0.5 text-xs font-semibold">
                      {["Alex Rivera", "Maya Chen", "Jordan Park", "Slides"][i - 1] || "Speaker"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Director suggestion */}
            <div className="absolute bottom-3 left-3 right-3 z-10 glass-strong rounded-xl p-3 flex items-center gap-3 border border-neon/30">
              <div className="h-9 w-9 rounded-lg gradient-neon-bg flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-neon-foreground" />
              </div>
              <p className="text-sm flex-1">
                <span className="font-semibold text-neon">AI Director:</span> Maya is speaking — switch to focus layout?
              </p>
              <Button variant="neon" className="!py-1.5 !px-3 !text-xs">Apply</Button>
              <button className="text-xs text-muted-foreground hover:text-foreground px-2">Dismiss</button>
            </div>
          </div>

          {/* Controls */}
          <div className="glass rounded-2xl p-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ControlBtn active={mic} onClick={() => setMic(!mic)} on={Mic} off={MicOff} />
              <ControlBtn active={cam} onClick={() => setCam(!cam)} on={Video} off={VideoOff} />
              <button className="rounded-xl p-3 bg-secondary/60 hover:bg-accent" title="Share screen">
                <Monitor className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`rounded-xl p-3 ${showChat ? "bg-primary/20 text-primary" : "bg-secondary/60"} hover:bg-accent`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="rounded-xl p-3 bg-secondary/60 hover:bg-accent">
                <Settings2 className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Sparkles className="h-4 w-4 text-neon" /> AI Tools</Button>
              <Button variant="primary" className="!bg-destructive !bg-none">End Stream</Button>
            </div>
          </div>
        </section>

        {/* Chat panel */}
        {showChat && (
          <aside className="lg:w-80 glass rounded-2xl flex flex-col shrink-0 h-96 lg:h-auto">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Live Chat
              </h3>
              <span className="text-[10px] font-bold text-neon tracking-wider">AI MODERATED</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
              {[
                { user: "Sarah K.", msg: "This is amazing 🔥", color: "oklch(0.7 0.2 305)" },
                { user: "Mike T.", msg: "How do you handle multi-platform audio sync?", color: "oklch(0.72 0.2 195)" },
                { user: "AI Mod 🤖", msg: "Top question pinned by AI", color: "oklch(0.78 0.21 195)", ai: true },
                { user: "Devon", msg: "Subbed!", color: "oklch(0.68 0.22 25)" },
                { user: "Jamie L.", msg: "What mic are you using?", color: "oklch(0.65 0.2 145)" },
              ].map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.ai ? "rounded-lg bg-neon/10 p-2 border border-neon/20" : ""}`}>
                  <div
                    className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-background"
                    style={{ background: m.color }}
                  >
                    {m.user[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{m.user}</p>
                    <p className="text-sm">{m.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                placeholder="Send message..."
                className="flex-1 rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-lg gradient-primary-bg p-2 text-primary-foreground">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </AppShell>
  );
}

function ControlBtn({ active, onClick, on: On, off: Off }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-3 transition-colors ${
        active ? "bg-secondary/60 hover:bg-accent" : "bg-destructive/20 text-destructive hover:bg-destructive/30"
      }`}
    >
      {active ? <On className="h-5 w-5" /> : <Off className="h-5 w-5" />}
    </button>
  );
}
