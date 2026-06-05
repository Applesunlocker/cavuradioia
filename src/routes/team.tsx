import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { teamMembers } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Equipo — NovaStream AI" }] }),
  component: Team,
});

function Team() {
  return (
    <AppShell>
      <PageHeader
        title="Equipo"
        description="Colabora en transmisiones con roles: Admin, Host, Productor e Invitado."
        action={<Button><UserPlus className="h-4 w-4" /> Invitar miembro</Button>}
      />

      <div className="glass rounded-2xl overflow-hidden">
        {teamMembers.map((m, i) => (
          <div key={m.name} className={`flex items-center gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="relative">
              <div className="h-12 w-12 rounded-full gradient-primary-bg flex items-center justify-center font-bold text-primary-foreground">
                {m.initials}
              </div>
              {m.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon border-2 border-card" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.online ? "En línea ahora" : "Desconectado"}</p>
            </div>
            <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold">{m.role}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
