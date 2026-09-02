/** Configuración compartida de la campaña de lanzamiento y los planes. */

export type Plan = {
  id: "creador" | "pro" | "estudio";
  name: string;
  price: number;
  priceLaunch: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

/** Fecha objetivo del lanzamiento (ajústala cuando definas la fecha real). */
export const LAUNCH_DATE = "2026-10-01T15:00:00.000Z";

export const LAUNCH_DISCOUNT = 40; // % de descuento fundador

export const PLANS: Plan[] = [
  {
    id: "creador",
    name: "Creador",
    price: 19,
    priceLaunch: 11,
    tagline: "Para quien empieza a transmitir en vivo con calidad profesional.",
    features: [
      "2 destinos simultáneos",
      "10 h de transmisión al mes",
      "Clips automáticos con IA (20/mes)",
      "Studio en navegador con 1 invitado",
      "Analíticas básicas de audiencia",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    priceLaunch: 29,
    tagline: "Para creadores que monetizan cada transmisión en vivo.",
    highlight: true,
    features: [
      "Destinos ilimitados (multistream)",
      "40 h de transmisión al mes",
      "Co-host de IA y clips ilimitados",
      "Hasta 6 invitados en el Studio",
      "Analíticas predictivas y mejor hora para emitir",
      "Marca propia y overlays personalizados",
    ],
  },
  {
    id: "estudio",
    name: "Estudio",
    price: 129,
    priceLaunch: 77,
    tagline: "Para equipos y medios que producen shows en directo cada semana.",
    features: [
      "Todo lo de Pro, sin límite de horas",
      "Equipo con roles (host, productor, admin)",
      "Dominio de remitente propio y alertas DNS",
      "Almacenamiento ampliado de librería",
      "Soporte prioritario y onboarding guiado",
    ],
  },
];

export function launchCountdown(now: number) {
  const diff = Math.max(0, new Date(LAUNCH_DATE).getTime() - now);
  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
