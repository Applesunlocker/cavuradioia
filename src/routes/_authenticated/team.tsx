import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { useTeamMembers, useInviteTeamMember, useRemoveTeamMember } from "@/lib/queries";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({ meta: [{ title: "Equipo — NovaStream AI" }] }),
  component: Team,
});

const ROLE_LABELS: Record<string, string> = { admin: "Admin", host: "Host", producer: "Productor", guest: "Invitado" };

function Team() {
  const { data: members, isLoading } = useTeamMembers();
  const invite = useInviteTeamMember();
  const remove = useRemoveTeamMember();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "host" | "producer" | "guest">("guest");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await invite.mutateAsync({ invited_email: email.trim(), display_name: name.trim() || undefined, role });
      toast.success("Invitación creada");
      setEmail(""); setName(""); setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("¿Quitar del equipo?")) return;
    try { await remove.mutateAsync(id); toast.success("Eliminado"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
  };

  return (
    <AppShell>
      <PageHeader
        title="Equipo"
        description="Colabora en transmisiones con roles: Admin, Host, Productor e Invitado."
        action={<Button onClick={() => setShowForm((v) => !v)}><UserPlus className="h-4 w-4" /> Invitar miembro</Button>}
      />

      {showForm && (
        <form onSubmit={submit} className="glass rounded-2xl p-5 mb-6 grid sm:grid-cols-4 gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="email@ejemplo.com" className="rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm sm:col-span-2" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre (opcional)" className="rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm">
            {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Button type="submit" className="sm:col-span-4">Enviar invitación</Button>
        </form>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando…</p>
      ) : (members ?? []).length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          Aún no has invitado a nadie. Invita a tu primer miembro con el botón de arriba.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {(members ?? []).map((m, i) => {
            const label = m.display_name || m.invited_email || "Miembro";
            const initials = label.substring(0, 2).toUpperCase();
            return (
              <div key={m.id} className={`flex items-center gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="h-12 w-12 rounded-full gradient-primary-bg flex items-center justify-center font-bold text-primary-foreground">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.invited_email ?? "—"} · {m.status}</p>
                </div>
                <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold">{ROLE_LABELS[m.role]}</span>
                <button onClick={() => handleRemove(m.id)} className="text-muted-foreground hover:text-destructive" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
