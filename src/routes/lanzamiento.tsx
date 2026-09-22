import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Rocket, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LAUNCH_DATE, LAUNCH_DISCOUNT, PLANS, launchCountdown } from "@/lib/launch-config";

export const Route = createFileRoute("/lanzamiento")({
  head: () => ({
    meta: [
      { title: "Lanzamiento NovaStream AI — Descuento fundador" },
      {
        name: "description",
        content:
          "Únete a la lista de espera del lanzamiento de NovaStream AI y reserva tu plan con descuento fundador para transmitir en vivo con IA.",
      },
      { property: "og:title", content: "Lanzamiento NovaStream AI — Descuento fundador" },
      {
        property: "og:description",
        content: "Cuenta atrás para la apertura: reserva tu plan de streaming con IA con el descuento fundador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LaunchPage,
});

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const c = launchCountdown(now);
  if (c.done) {
    return <p className="text-2xl font-bold gradient-text">¡Ya estamos en vivo!</p>;
  }
  const cells = [
    { v: c.days, l: "días" },
    { v: c.hours, l: "horas" },
    { v: c.minutes, l: "min" },
    { v: c.seconds, l: "seg" },
  ];
  return (
    <div className="flex justify-center gap-3">
      {cells.map((cell) => (
        <div key={cell.l} className="glass rounded-xl px-4 py-3 min-w-[4.5rem]">
          <p className="text-2xl font-bold tabular-nums">{String(cell.v).padStart(2, "0")}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{cell.l}</p>
        </div>
      ))}
    </div>
  );
}

function LaunchPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<string>("pro");
  const [joined, setJoined] = useState(false);
  const [saving, setSaving] = useState(false);

  const planInfo = useMemo(() => PLANS.find((p) => p.id === plan), [plan]);

  const join = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Introduce un correo válido");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("launch_waitlist").insert({
      email: email.trim(),
      name: name.trim() || null,
      plan_interest: plan,
      source: "lanzamiento",
    });
    setSaving(false);
    if (error) {
      if (error.code === "23505") {
        toast.info("Ese correo ya está en la lista de espera");
      } else {
        toast.error("No pudimos registrarte, inténtalo de nuevo");
      }
      return;
    }
    setJoined(true);
    toast.success("¡Reserva registrada! Te avisaremos el día del lanzamiento");
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon">
          <Rocket className="h-3.5 w-3.5" /> Gran lanzamiento
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          Sé de los primeros en <span className="gradient-text">transmitir con IA</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          La apertura es el {new Date(LAUNCH_DATE).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })}. Apúntate
          a la lista de espera y conserva el descuento fundador del {LAUNCH_DISCOUNT}% de por vida.
        </p>

        <div className="mt-10">
          <Countdown />
        </div>

        <div className="mt-10 glass rounded-2xl p-7 text-left">
          {joined ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-neon" />
              <h2 className="text-xl font-bold">¡Dentro! Ya tienes tu reserva.</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Guardamos tu correo para avisarte cuando abran los pagos. Tu interés actual: plan{" "}
                <strong className="text-foreground">{planInfo?.name}</strong> a {planInfo?.priceLaunch} USD/mes.
              </p>
              <Link to="/precios" className="text-sm text-primary hover:underline">
                Comparar planes →
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Reserva tu precio fundador
              </h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  className="w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Plan que te interesa</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                >
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.priceLaunch} USD/mes (antes {p.price} USD)
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={join}
                disabled={saving}
                className="mt-5 w-full rounded-xl gradient-primary-bg px-4 py-3 text-sm font-semibold text-primary-foreground glow disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Reservar sin tarjeta"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                No cobramos nada ahora: solo guardamos tu correo para avisarte el día del lanzamiento.
              </p>
            </>
          )}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
