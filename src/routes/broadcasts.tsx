import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, StatusPill, Button } from "@/components/ui-bits";
import { broadcasts } from "@/lib/mock-data";
import { Plus, LayoutGrid, List, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/broadcasts")({
  head: () => ({ meta: [{ title: "Broadcasts — NovaStream AI" }] }),
  component: Broadcasts,
});

function Broadcasts() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? broadcasts : broadcasts.filter((b) => b.status === filter);

  return (
    <AppShell>
      <PageHeader
        title="Broadcasts"
        description="All your live shows, upcoming streams, and archived broadcasts in one place."
        action={
          <Link to="/studio">
            <Button><Plus className="h-4 w-4" /> New Broadcast</Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search broadcasts..."
            className="w-full rounded-xl bg-secondary/60 border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "live", "scheduled", "completed", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                filter === s ? "gradient-primary-bg text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border bg-secondary/60 p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md p-1.5 ${view === "grid" ? "bg-accent" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-md p-1.5 ${view === "list" ? "bg-accent" : ""}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div key={b.id} className="glass rounded-2xl overflow-hidden hover:border-primary/40 transition-colors group">
              <div className="aspect-video relative" style={{ background: b.thumbnail }}>
                <div className="absolute top-3 left-3">
                  <StatusPill status={b.status} />
                </div>
                <div className="absolute bottom-3 right-3 rounded-md bg-background/70 backdrop-blur px-2 py-0.5 text-xs font-medium">
                  {b.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-snug line-clamp-2">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.date} · {b.host}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.platforms.join(" · ")}</span>
                  {b.engagement > 0 && (
                    <span className="font-bold text-neon">{b.engagement}%</span>
                  )}
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
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Viewers</th>
                <th className="text-right px-4 py-3">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-md shrink-0" style={{ background: b.thumbnail }} />
                      <span className="font-medium">{b.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-4 py-3 text-right">{b.peakViewers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neon">{b.engagement > 0 ? `${b.engagement}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
