import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { PLANS, LAUNCH_DATE, LAUNCH_DISCOUNT } from "@/lib/launch-config";
import { Megaphone, Users, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/campaign")({
  head: () => ({
    meta: [
      { title: "Campaña de lanzamiento — NovaStream AI" },
      { name: "description", content: "Kit de campaña del lanzamiento de NovaStream AI: textos, creatividades y lista de espera." },
    ],
  }),
  component: CampaignPanel,
});

const COPY_KIT: { title: string; items: { label: string; text: string }[] }[] = [
  {
    title: "Redes sociales",
    items: [
      {
        label: "Publicación X / Instagram",
        text: `El día ${new Date(LAUNCH_DATE).toLocaleDateString("es-ES", { dateStyle: "long" })} abrimos NovaStream AI: transmite en vivo a todas las plataformas con un co-host de IA que clipea, subtitula y hace crecer tu audiencia. Apúntate y conserva el −${LAUNCH_DISCOUNT}% fundador de por vida → /lanzamiento`,
      },
      {
        label: "Hilo de lanzamiento",
        text: "Hoy lanzamos NovaStream AI. 3 razones para transmitir con nosotros: 1) multistream sin límites, 2) clips automáticos con IA en español, 3) analíticas que te dicen la mejor hora para emitir. Precios fundadores desde 11 USD/mes → /precios",
      },
      {
        label: "Story / estado de WhatsApp",
        text: `Quedan pocos días para el lanzamiento de NovaStream AI. Reserva tu plan con −${LAUNCH_DISCOUNT}% sin tarjeta: entra a la lista de espera.`,
      },
    ],
  },
  {
    title: "Correo y comunidad",
    items: [
      {
        label: "Asunto de correo",
        text: `Mañana abre NovaStream AI: tu plan fundador con −${LAUNCH_DISCOUNT}% te espera`,
      },
      {
        label: "Cuerpo corto de correo",
        text: "Hola, ya casi. NovaStream AI abre mañana y como estás en la lista de espera conservas tu descuento fundador de por vida. Solo entra, elige tu plan y empieza a transmitir con el co-host de IA. Nos vemos en vivo.",
      },
      {
        label: "Anuncio en Discord / Telegram",
        text: "Lanzamiento: NovaStream AI ya está en vivo. Studio en navegador + IA en español. Quienes estén en la lista de espera mantienen el precio fundador. Entra desde /lanzamiento",
      },
    ],
  },
  {
    title: "Dentro de la app",
    items: [
      {
        label: "Banner superior",
        text: `Oferta de lanzamiento: −${LAUNCH_DISCOUNT}% en todos los planes. Termina en: ver cuenta atrás en /lanzamiento`,
      },
      {
        label: "Modal de actualización",
        text: "Ya puedes activar tu plan de pago. Actívalo ahora para desbloquear transmisiones sin límite, clips ilimitados con IA y analíticas predictivas. Ir a planes →",
      },
    ],
  },
];

function CampaignPanel() {
  const waitlist = useQuery({
    queryKey: ["launch-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("launch_waitlist")
        .select("id, email, name, plan_interest, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppShell>
      <PageHeader
        title="Campaña de lanzamiento"
        description="Kit de textos listos para copiar, enlaces a las páginas públicas y la lista de espera registrada. El cobro se conectará cuando se active la pasarela de pagos."
        action={
          <div className="flex gap-2">
            <Link to="/precios">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" /> Ver precios
              </Button>
            </Link>
            <Link to="/lanzamiento">
              <Button>
                <ExternalLink className="h-4 w-4" /> Ver lanzamiento
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {COPY_KIT.map((section) => (
            <section key={section.title} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label} className="rounded-xl border border-border bg-card/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.text);
                          toast.success("Texto copiado");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copiar
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="glass rounded-2xl p-6 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-neon" />
            <h2 className="font-semibold">Lista de espera</h2>
            <span className="ml-auto rounded-full border border-neon/30 bg-neon/10 px-2 py-0.5 text-xs font-semibold text-neon">
              {waitlist.data?.length ?? 0}
            </span>
          </div>
          {waitlist.isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          {waitlist.isError && (
            <p className="text-sm text-muted-foreground">
              No se pudo cargar la lista (necesitas permisos de administrador).
            </p>
          )}
          <ul className="space-y-3">
            {(waitlist.data ?? []).map((row) => (
              <li key={row.id} className="rounded-xl border border-border bg-card/30 p-3">
                <p className="text-sm font-semibold break-all">{row.email}</p>
                <p className="text-xs text-muted-foreground">
                  {row.name ?? "Sin nombre"} · Plan {PLANS.find((p) => p.id === row.plan_interest)?.name ?? row.plan_interest} ·{" "}
                  {new Date(row.created_at).toLocaleString("es-ES")}
                </p>
              </li>
            ))}
          </ul>
          {!waitlist.isLoading && waitlist.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay registros. Comparte la página de lanzamiento para empezar a captar interesados.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
