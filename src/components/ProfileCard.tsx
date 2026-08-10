import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, useMediaUrl, isImageFile } from "@/lib/storage";
import { Button } from "@/components/ui-bits";
import { UserRound, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: avatarUrl } = useMediaUrl(avatarPath);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", u.user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? "");
      setAvatarPath(data?.avatar_url ?? null);
    })();
  }, []);

  const onPick = async (file: File) => {
    if (!isImageFile(file)) return toast.error("Selecciona una imagen (PNG, JPG o WebP).");
    if (file.size > 5 * 1024 * 1024) return toast.error("La imagen debe pesar menos de 5 MB.");
    setBusy(true);
    try {
      const path = await uploadMedia(file, "avatars");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", u.user!.id);
      if (error) throw error;
      setAvatarPath(path);
      toast.success("Foto de perfil actualizada");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "No se pudo subir la imagen");
    } finally {
      setBusy(false);
    }
  };

  const saveName = async () => {
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").update({ display_name: displayName.trim() || null }).eq("id", u.user!.id);
      if (error) throw error;
      toast.success("Perfil guardado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserRound className="h-5 w-5 text-neon" /> Perfil
        </h2>
        <p className="text-sm text-muted-foreground">Tu nombre y foto se muestran en el estudio y ante tu equipo.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-2xl overflow-hidden border border-border bg-secondary/60 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Foto de perfil" className="h-full w-full object-cover" width={80} height={80} />
          ) : (
            <UserRound className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ""; }}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? "Subiendo…" : "Cambiar foto"}
          </Button>
          <p className="mt-1.5 text-[11px] text-muted-foreground">PNG, JPG o WebP · máx. 5 MB · almacenamiento privado</p>
        </div>
      </div>

      <div>
        <label htmlFor="profile-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Nombre visible
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="profile-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.slice(0, 60))}
            placeholder="Tu nombre"
            className="flex-1 rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button variant="neon" onClick={saveName} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
