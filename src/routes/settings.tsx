import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-bits";
import { loadContact, saveContact, buildWhatsAppUrl } from "@/lib/contact-config";
import { MessageCircle, QrCode, Check, AlertCircle, Loader2 } from "lucide-react";

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

type SaveStatus = "idle" | "saving" | "saved" | "error";

function Settings() {
  const [contact, setContact] = useState(() => loadContact());
  const [draft, setDraft] = useState(contact);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftAtDebounceStart = useRef<typeof draft | null>(null);

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

  const performSave = (data: z.infer<typeof contactSchema>) => {
    setSaveStatus("saving");
    try {
      const clean = saveContact(data);
      setContact(clean);
      setErrors({});
      setSaveStatus("saved");
      toast.success("Contacto actualizado correctamente.");
    } catch {
      setSaveStatus("error");
      toast.error("No se pudo guardar. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const sameNumber = draft.whatsappNumber === contact.whatsappNumber;
    const sameMessage = draft.whatsappMessage === contact.whatsappMessage;
    if (sameNumber && sameMessage) {
      setSaveStatus("idle");
      return;
    }

    const parsed = contactSchema.safeParse(draft);
    if (!parsed.success) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    draftAtDebounceStart.current = draft;
    debounceRef.current = setTimeout(() => {
      performSave(parsed.data);
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draft, contact]);

  useEffect(() => {
    if (saveStatus === "saved" || saveStatus === "error") {
      const id = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(id);
    }
  }, [saveStatus]);

  const handleManualSave = () => {
    setTouched({ whatsappNumber: true, whatsappMessage: true });
    if (!validation.success) {
      setErrors(liveErrors);
      toast.error("Revisa los campos marcados.");
      return;
    }
    setErrors({});
    performSave(validation.data);
  };

  const statusLabel = {
    idle: "Guardar cambios",
    saving: "Guardando…",
    saved: "Guardado",
    error: "Error al guardar",
  }[saveStatus];

  const statusIcon = {
    idle: null,
    saving: <Loader2 className="h-4 w-4 animate-spin" />,
    saved: <Check className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
  }[saveStatus];

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
            <label htmlFor="wa-number" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Número de WhatsApp (formato internacional, sin "+")
            </label>
            <input
              id="wa-number"
              value={draft.whatsappNumber}
              onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value.replace(/\D/g, "").slice(0, 15) })}
              onBlur={() => setTouched((t) => ({ ...t, whatsappNumber: true }))}
              placeholder="584120000000"
              inputMode="numeric"
              maxLength={15}
              aria-invalid={!!shownErrors.whatsappNumber}
              aria-describedby="wa-number-help"
              className={`mt-1.5 w-full rounded-lg bg-secondary/60 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                shownErrors.whatsappNumber
                  ? "border-destructive/60 focus:ring-destructive/40"
                  : "border-border focus:ring-ring"
              }`}
            />
            {shownErrors.whatsappNumber ? (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <AlertCircle className="h-3 w-3" /> {shownErrors.whatsappNumber}
              </p>
            ) : (
              <p id="wa-number-help" className="mt-1 text-[11px] text-muted-foreground">
                Solo dígitos, 8–15 caracteres (E.164). Ej: 584120000000, 34612345678.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="wa-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mensaje predeterminado
            </label>
            <textarea
              id="wa-message"
              value={draft.whatsappMessage}
              onChange={(e) => setDraft({ ...draft, whatsappMessage: e.target.value.slice(0, 300) })}
              onBlur={() => setTouched((t) => ({ ...t, whatsappMessage: true }))}
              rows={3}
              maxLength={300}
              aria-invalid={!!shownErrors.whatsappMessage}
              className={`mt-1.5 w-full rounded-lg bg-secondary/60 border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none ${
                shownErrors.whatsappMessage
                  ? "border-destructive/60 focus:ring-destructive/40"
                  : "border-border focus:ring-ring"
              }`}
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              {shownErrors.whatsappMessage ? (
                <p className="flex items-center gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3" /> {shownErrors.whatsappMessage}
                </p>
              ) : (
                <span className="text-[11px] text-muted-foreground">Texto que se precarga al abrir el chat.</span>
              )}
              <span className="text-[11px] text-muted-foreground tabular-nums">{draft.whatsappMessage.length}/300</span>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4 items-center bg-card/40">
            {validation.success ? (
              <div className="rounded-lg overflow-hidden bg-[#0F172A] p-2 shrink-0">
                <img src={qrPreview} alt="Vista previa del QR" className="h-32 w-32" />
              </div>
            ) : (
              <div className="h-32 w-32 rounded-lg border border-dashed border-border flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 shrink-0">
                Corrige los errores para previsualizar el QR
              </div>
            )}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                <QrCode className="h-3.5 w-3.5" /> Vista previa
              </p>
              {validation.success ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-primary hover:underline truncate"
                >
                  {previewUrl}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">—</p>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                Los cambios se aplican al guardar y se sincronizan en todas las páginas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleManualSave}
              disabled={!validation.success || saveStatus === "saving"}
              className="rounded-xl gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusIcon}
              {statusLabel}
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
