import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";
import { loadContact, saveContact, buildWhatsAppUrl } from "@/lib/contact-config";
import { MessageCircle, QrCode, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Ajustes — NovaStream AI" }] }),
  component: Settings,
});

const contactSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d+$/, { message: "Solo se permiten dígitos (sin '+', espacios ni guiones)." })
    .min(8, { message: "El número es demasiado corto (mín. 8 dígitos)." })
    .max(15, { message: "El número es demasiado largo (máx. 15 dígitos, estándar E.164)." }),
  whatsappMessage: z
    .string()
    .trim()
    .min(1, { message: "El mensaje no puede estar vacío." })
    .max(300, { message: "El mensaje no debe superar 300 caracteres." }),
});

type FieldErrors = Partial<Record<"whatsappNumber" | "whatsappMessage", string>>;

function Settings() {
  const [contact, setContact] = useState(() => loadContact());
  const [draft, setDraft] = useState(contact);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => setDraft(contact), [contact]);

  const validation = useMemo(() => contactSchema.safeParse(draft), [draft]);
  const liveErrors: FieldErrors = useMemo(() => {
    if (validation.success) return {};
    const out: FieldErrors = {};
    for (const issue of validation.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      if (key && !out[key]) out[key] = issue.message;
    }
    return out;
  }, [validation]);

  const shownErrors: FieldErrors = {
    whatsappNumber: touched.whatsappNumber || errors.whatsappNumber ? liveErrors.whatsappNumber : undefined,
    whatsappMessage: touched.whatsappMessage || errors.whatsappMessage ? liveErrors.whatsappMessage : undefined,
  };

  const previewUrl = validation.success ? buildWhatsAppUrl(draft) : "";
  const qrPreview = validation.success
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(previewUrl)}&bgcolor=0F172A&color=38BDF8&margin=8`
    : "";

  const handleSave = () => {
    setTouched({ whatsappNumber: true, whatsappMessage: true });
    if (!validation.success) {
      setErrors(liveErrors);
      toast.error("Revisa los campos marcados.");
      return;
    }
    setErrors({});
    const clean = saveContact(validation.data);
    setContact(clean);
    setDraft(clean);
    setSaved(true);
    toast.success("Contacto actualizado correctamente.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <PageHeader title="Ajustes" description="Gestiona tu perfil, facturación, integraciones y preferencias." />

      <div className="grid lg:grid-cols-3 gap-6">
        <nav className="glass rounded-2xl p-3 lg:col-span-1 h-fit">
          {["Perfil", "Contacto", "Facturación", "Integraciones", "Notificaciones", "Idioma", "Seguridad"].map((s, i) => (
            <button
              key={s}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium ${
                i === 1 ? "bg-accent" : "hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-5">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-neon" /> Contacto por WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground">
              Configura el número y el mensaje. El botón flotante y el código QR se actualizan automáticamente.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Número de WhatsApp (formato internacional, sin "+")
            </label>
            <input
              value={draft.whatsappNumber}
              onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value.replace(/\D/g, "") })}
              placeholder="584120000000"
              inputMode="numeric"
              className="mt-1.5 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Ej: 584120000000 (Venezuela), 34612345678 (España).</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mensaje predeterminado
            </label>
            <textarea
              value={draft.whatsappMessage}
              onChange={(e) => setDraft({ ...draft, whatsappMessage: e.target.value })}
              rows={3}
              className="mt-1.5 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-center bg-card/40">
            <div className="rounded-lg overflow-hidden bg-[#0F172A] p-2 shrink-0">
              <img src={qrPreview} alt="Vista previa del QR" className="h-32 w-32" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                <QrCode className="h-3.5 w-3.5" /> Vista previa
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-primary hover:underline truncate"
              >
                {previewUrl}
              </a>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Los cambios se aplican al guardar y se sincronizan en todas las páginas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="rounded-xl gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow inline-flex items-center gap-2"
            >
              {saved ? <Check className="h-4 w-4" /> : null}
              {saved ? "Guardado" : "Guardar cambios"}
            </button>
            <button
              onClick={() => setDraft(contact)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
