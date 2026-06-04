import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — NovaStream AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your profile, billing, integrations and preferences." />

      <div className="grid lg:grid-cols-3 gap-6">
        <nav className="glass rounded-2xl p-3 lg:col-span-1 h-fit">
          {["Profile", "Billing", "Integrations", "Notifications", "Language", "Security"].map((s, i) => (
            <button
              key={s}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium ${
                i === 0 ? "bg-accent" : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">Public information shown on your broadcasts.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary-bg flex items-center justify-center font-bold text-primary-foreground text-xl">AR</div>
            <button className="rounded-lg bg-secondary/60 px-3 py-2 text-sm font-medium hover:bg-accent">Change avatar</button>
          </div>
          {[
            { label: "Display name", value: "Alex Rivera" },
            { label: "Email", value: "alex@novastream.ai" },
            { label: "Bio", value: "Live streaming creator. AI nerd." },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</label>
              <input
                defaultValue={f.value}
                className="mt-1.5 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button className="rounded-xl gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow">Save changes</button>
            <button className="rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-accent">Cancel</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
