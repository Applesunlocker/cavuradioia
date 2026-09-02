import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { PLANS, LAUNCH_DISCOUNT } from "@/lib/launch-config";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: "Precios y planes — NovaStream AI" },
      {
        name: "description",
        content:
          "Planes de suscripción de NovaStream AI para transmitir en vivo con IA: multistream, clips automáticos y analíticas predictivas desde 11 USD al mes.",
      },
      { property: "og:title", content: "Precios y planes — NovaStream AI" },
      {
        property: "og:description",
        content: "Elige tu plan de streaming con IA y aprovecha el descuento fundador del lanzamiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon">
            <Sparkles className="h-3.5 w-3.5" /> Descuento fundador −{LAUNCH_DISCOUNT}%
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            Planes para <span className="gradient-text">monetizar tus directos</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Paga solo por lo que transmites. Todos los planes incluyen el Studio en navegador, multistream y el co-host de IA en
            español. Cancela cuando quieras.
          </p>
        </header>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <section
              key={p.id}
              className={`glass rounded-2xl p-7 flex flex-col ${p.highlight ? "border-primary/50 glow" : ""}`}
            >
              {p.highlight && (
                <span className="self-start rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Más elegido
                </span>
              )}
              <h2 className="mt-3 text-xl font-bold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">{p.priceLaunch} USD</span>
                <span className="mb-1 text-sm text-muted-foreground line-through">{p.price} USD</span>
              </div>
              <p className="text-xs text-muted-foreground">al mes, facturación mensual</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-neon" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/lanzamiento"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  p.highlight
                    ? "gradient-primary-bg text-primary-foreground glow"
                    : "border border-border hover:border-primary/40"
                }`}
              >
                Reservar precio fundador <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-6 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-neon shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            El cobro se activará con la pasarela de pagos en cuanto esté conectada. Hasta entonces puedes reservar tu plan sin
            tarjeta desde la página de lanzamiento y te avisaremos por correo el día de la apertura.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
