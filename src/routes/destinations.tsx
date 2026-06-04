import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { platforms } from "@/lib/mock-data";
import { Plus, Check, Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/destinations")({
  head: () => ({ meta: [{ title: "Destinations — NovaStream AI" }] }),
  component: Destinations,
});

function Destinations() {
  return (
    <AppShell>
      <PageHeader
        title="Destinations"
        description="Connect every platform once. Multistream simultaneously in landscape and portrait."
        action={<Button><Plus className="h-4 w-4" /> Add Custom RTMP</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
              style={{ background: p.color }}
            >
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.connected ? "Connected · streaming enabled" : "Not connected"}
              </p>
            </div>
            {p.connected ? (
              <span className="rounded-full bg-neon/15 text-neon px-3 py-1 text-xs font-bold flex items-center gap-1">
                <Check className="h-3 w-3" /> ON
              </span>
            ) : (
              <button className="rounded-lg bg-secondary/60 hover:bg-accent px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                <LinkIcon className="h-3 w-3" /> Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 glass-strong rounded-2xl p-6">
        <h2 className="text-xl font-semibold">Stream profiles</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-configured multi-platform presets for one-click broadcasting.</p>
        <div className="mt-5 grid md:grid-cols-3 gap-3">
          {[
            { name: "Full Reach", platforms: "YouTube + LinkedIn + X", ratio: "16:9 + 9:16" },
            { name: "Podcast Stack", platforms: "YouTube + Twitch", ratio: "16:9" },
            { name: "Short-form", platforms: "TikTok + Instagram", ratio: "9:16" },
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
