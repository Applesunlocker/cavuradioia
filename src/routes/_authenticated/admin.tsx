import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Shield, ShieldCheck, UserCog, Loader2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administración — NovaStream AI" }] }),
  component: AdminPage,
});

type UserRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  roles: string[];
  created_at: string;
};

function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? null;
    setMe(uid);

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid ?? "")
      .eq("role", "admin")
      .maybeSingle();
    const admin = !!roles;
    setIsAdmin(admin);

    if (admin) {
      const { data, error } = await supabase.rpc("list_users_with_roles");
      if (error) toast.error(error.message);
      else setUsers((data ?? []) as UserRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const claimAdmin = async () => {
    setBusy("claim");
    const { data, error } = await supabase.rpc("claim_admin_if_none");
    setBusy(null);
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("Eres administrador. Recargando…");
      await load();
    } else {
      toast.error("Ya existe un administrador. Pídele que te promueva.");
    }
  };

  const toggleRole = async (userId: string, role: "admin" | "user", grant: boolean) => {
    setBusy(`${userId}:${role}`);
    const { error } = await supabase.rpc("set_user_role", {
      _user_id: userId,
      _role: role,
      _grant: grant,
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Rol actualizado");
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto glass-strong rounded-2xl p-8 text-center border border-border">
        <Crown className="mx-auto h-10 w-10 text-neon" />
        <h1 className="mt-3 text-2xl font-bold">Zona de administración</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cuenta aún no es administradora. Si eres el propietario del proyecto y todavía no hay
          ningún administrador, puedes reclamar el rol ahora.
        </p>
        <button
          onClick={claimAdmin}
          disabled={busy === "claim"}
          className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow disabled:opacity-50"
        >
          {busy === "claim" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Reclamar administrador
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary-bg flex items-center justify-center glow">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Administración</h1>
          <p className="text-sm text-muted-foreground">{users.length} usuarios registrados</p>
        </div>
      </header>

      <div className="glass-strong rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Usuario</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Roles</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.user_id === me;
              const isUAdmin = u.roles.includes("admin");
              return (
                <tr key={u.user_id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">
                    {u.display_name ?? "—"} {isSelf && <span className="text-[10px] text-primary">(tú)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length === 0 ? (
                        <span className="text-xs text-muted-foreground">sin rol</span>
                      ) : (
                        u.roles.map((r) => (
                          <span
                            key={r}
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                              r === "admin" ? "bg-primary/20 text-primary" : "bg-secondary text-foreground"
                            }`}
                          >
                            {r}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleRole(u.user_id, "admin", !isUAdmin)}
                      disabled={(isSelf && isUAdmin) || busy === `${u.user_id}:admin`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-border px-3 py-1.5 hover:bg-accent disabled:opacity-40"
                      title={isSelf && isUAdmin ? "No puedes quitarte tu propio admin" : ""}
                    >
                      {busy === `${u.user_id}:admin` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <UserCog className="h-3 w-3" />
                      )}
                      {isUAdmin ? "Quitar admin" : "Hacer admin"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
