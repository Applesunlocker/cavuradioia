export type BroadcastStatus = "live" | "scheduled" | "completed" | "draft";

export interface Broadcast {
  id: string;
  title: string;
  status: BroadcastStatus;
  date: string;
  duration: string;
  peakViewers: number;
  engagement: number;
  platforms: string[];
  thumbnail: string;
  tags: string[];
  host: string;
}

const thumbs = [
  "linear-gradient(135deg, oklch(0.5 0.2 260), oklch(0.3 0.18 305))",
  "linear-gradient(135deg, oklch(0.55 0.18 195), oklch(0.4 0.22 260))",
  "linear-gradient(135deg, oklch(0.6 0.22 305), oklch(0.35 0.15 195))",
  "linear-gradient(135deg, oklch(0.5 0.24 25), oklch(0.35 0.2 305))",
  "linear-gradient(135deg, oklch(0.55 0.2 145), oklch(0.4 0.18 260))",
  "linear-gradient(135deg, oklch(0.5 0.22 280), oklch(0.35 0.2 200))",
];

export const broadcasts: Broadcast[] = [
  {
    id: "b1",
    title: "IA en Marketing: Mesa Redonda en Vivo con Líderes del Sector",
    status: "live",
    date: "Hoy · 14:00",
    duration: "1:24:32",
    peakViewers: 4827,
    engagement: 92,
    platforms: ["YouTube", "LinkedIn", "X"],
    thumbnail: thumbs[0],
    tags: ["IA", "Marketing", "Webinar"],
    host: "Alex Rivera",
  },
  {
    id: "b2",
    title: "El Show de los Fundadores — Episodio 42",
    status: "scheduled",
    date: "Vie · 18:00",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["YouTube", "Twitch", "TikTok"],
    thumbnail: thumbs[1],
    tags: ["Startups", "Podcast"],
    host: "Alex Rivera",
  },
  {
    id: "b3",
    title: "Diseñando para 2026: Tendencias y Predicciones",
    status: "completed",
    date: "12 Mar",
    duration: "58:14",
    peakViewers: 2103,
    engagement: 88,
    platforms: ["YouTube", "LinkedIn"],
    thumbnail: thumbs[2],
    tags: ["Diseño", "Charla"],
    host: "Maya Chen",
  },
  {
    id: "b4",
    title: "Lanzamiento de Producto — NovaStream v3",
    status: "scheduled",
    date: "2 Abr · 11:00",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["YouTube", "LinkedIn", "X", "Facebook"],
    thumbnail: thumbs[3],
    tags: ["Lanzamiento", "Producto"],
    host: "Alex Rivera",
  },
  {
    id: "b5",
    title: "Detrás del Código: WebRTC en Tiempo Real a Fondo",
    status: "completed",
    date: "8 Mar",
    duration: "1:42:08",
    peakViewers: 3344,
    engagement: 94,
    platforms: ["YouTube", "Twitch"],
    thumbnail: thumbs[4],
    tags: ["Tecnología", "Dev"],
    host: "Jordan Park",
  },
  {
    id: "b6",
    title: "Stream Vertical — Especial TikTok Live",
    status: "draft",
    date: "Borrador",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["TikTok", "Instagram"],
    thumbnail: thumbs[5],
    tags: ["Vertical", "Formato corto"],
    host: "Alex Rivera",
  },
];

export const metrics = [
  { label: "Espectadores totales", value: "184,2K", delta: "+12,4%", positive: true },
  { label: "Engagement promedio", value: "89%", delta: "+4,1%", positive: true },
  { label: "Horas transmitidas", value: "412h", delta: "+22h", positive: true },
  { label: "Clips generados por IA", value: "1.283", delta: "+318", positive: true },
];

export const platforms = [
  { id: "youtube", name: "YouTube", connected: true, color: "oklch(0.65 0.24 25)" },
  { id: "twitch", name: "Twitch", connected: true, color: "oklch(0.55 0.22 295)" },
  { id: "linkedin", name: "LinkedIn", connected: true, color: "oklch(0.55 0.18 245)" },
  { id: "x", name: "X", connected: true, color: "oklch(0.4 0.02 270)" },
  { id: "facebook", name: "Facebook", connected: false, color: "oklch(0.55 0.18 250)" },
  { id: "tiktok", name: "TikTok", connected: true, color: "oklch(0.65 0.2 350)" },
  { id: "instagram", name: "Instagram", connected: false, color: "oklch(0.6 0.22 25)" },
  { id: "rtmp", name: "RTMP Personalizado", connected: false, color: "oklch(0.55 0.18 200)" },
];

export const aiTools = [
  {
    id: "cohost",
    name: "Co-Host y Director IA",
    description: "Sugerencias de layout en tiempo real, detección de highlights, lower thirds automáticos y transiciones inteligentes.",
    icon: "🎬",
    accent: "from-primary to-purple-glow",
  },
  {
    id: "script",
    name: "Guion IA y Teleprompter",
    description: "Genera guiones completos, títulos SEO, descripciones y miniaturas con los mejores LLMs.",
    icon: "✍️",
    accent: "from-neon to-primary",
  },
  {
    id: "clipping",
    name: "Clipping y Reutilización Automática",
    description: "Tras cada stream, obtén shorts virales, transcripciones y resúmenes ejecutivos automáticamente.",
    icon: "✂️",
    accent: "from-purple-glow to-neon",
  },
  {
    id: "guests",
    name: "Asistente de Invitados IA",
    description: "Encuentra invitados relevantes, redacta invitaciones personalizadas y modera el chat con respuestas inteligentes.",
    icon: "🤝",
    accent: "from-primary to-neon",
  },
  {
    id: "moderation",
    name: "Moderación Inteligente de Chat",
    description: "Filtro de toxicidad y spam, auto-respuestas inteligentes y seguimiento de sentimiento en tiempo real.",
    icon: "🛡️",
    accent: "from-neon to-purple-glow",
  },
  {
    id: "voice",
    name: "Clonación de Voz y Avatares",
    description: "Usa avatares con IA o clona tu voz para segmentos pregrabados profesionales.",
    icon: "🗣️",
    accent: "from-purple-glow to-primary",
  },
  {
    id: "predictive",
    name: "Analítica Predictiva",
    description: "La IA predice el mejor momento para emitir, títulos óptimos y oportunidades de crecimiento.",
    icon: "📈",
    accent: "from-primary to-neon",
  },
  {
    id: "search",
    name: "Búsqueda Semántica en la Librería",
    description: "Encuentra cualquier momento de tus streams anteriores usando lenguaje natural.",
    icon: "🔍",
    accent: "from-neon to-primary",
  },
];

export const teamMembers = [
  { name: "Alex Rivera", role: "Admin", initials: "AR", online: true },
  { name: "Maya Chen", role: "Host", initials: "MC", online: true },
  { name: "Jordan Park", role: "Productor", initials: "JP", online: false },
  { name: "Sam Okafor", role: "Productor", initials: "SO", online: true },
  { name: "Lina Torres", role: "Invitado", initials: "LT", online: false },
];
