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
    title: "AI in Marketing: Live Roundtable with Industry Leaders",
    status: "live",
    date: "Today · 14:00",
    duration: "1:24:32",
    peakViewers: 4827,
    engagement: 92,
    platforms: ["YouTube", "LinkedIn", "X"],
    thumbnail: thumbs[0],
    tags: ["AI", "Marketing", "Webinar"],
    host: "Alex Rivera",
  },
  {
    id: "b2",
    title: "Friday Founders Show — Episode 42",
    status: "scheduled",
    date: "Fri · 18:00",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["YouTube", "Twitch", "TikTok"],
    thumbnail: thumbs[1],
    tags: ["Startup", "Podcast"],
    host: "Alex Rivera",
  },
  {
    id: "b3",
    title: "Designing for 2026: Trends & Predictions",
    status: "completed",
    date: "Mar 12",
    duration: "58:14",
    peakViewers: 2103,
    engagement: 88,
    platforms: ["YouTube", "LinkedIn"],
    thumbnail: thumbs[2],
    tags: ["Design", "Talk"],
    host: "Maya Chen",
  },
  {
    id: "b4",
    title: "Product Launch — NovaStream v3",
    status: "scheduled",
    date: "Apr 02 · 11:00",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["YouTube", "LinkedIn", "X", "Facebook"],
    thumbnail: thumbs[3],
    tags: ["Launch", "Product"],
    host: "Alex Rivera",
  },
  {
    id: "b5",
    title: "Behind the Code: Realtime WebRTC Deep Dive",
    status: "completed",
    date: "Mar 08",
    duration: "1:42:08",
    peakViewers: 3344,
    engagement: 94,
    platforms: ["YouTube", "Twitch"],
    thumbnail: thumbs[4],
    tags: ["Tech", "Dev"],
    host: "Jordan Park",
  },
  {
    id: "b6",
    title: "Vertical Stream — TikTok Live Special",
    status: "draft",
    date: "Draft",
    duration: "—",
    peakViewers: 0,
    engagement: 0,
    platforms: ["TikTok", "Instagram"],
    thumbnail: thumbs[5],
    tags: ["Vertical", "Short-form"],
    host: "Alex Rivera",
  },
];

export const metrics = [
  { label: "Total viewers", value: "184.2K", delta: "+12.4%", positive: true },
  { label: "Avg engagement", value: "89%", delta: "+4.1%", positive: true },
  { label: "Hours streamed", value: "412h", delta: "+22h", positive: true },
  { label: "AI clips generated", value: "1,283", delta: "+318", positive: true },
];

export const platforms = [
  { id: "youtube", name: "YouTube", connected: true, color: "oklch(0.65 0.24 25)" },
  { id: "twitch", name: "Twitch", connected: true, color: "oklch(0.55 0.22 295)" },
  { id: "linkedin", name: "LinkedIn", connected: true, color: "oklch(0.55 0.18 245)" },
  { id: "x", name: "X", connected: true, color: "oklch(0.4 0.02 270)" },
  { id: "facebook", name: "Facebook", connected: false, color: "oklch(0.55 0.18 250)" },
  { id: "tiktok", name: "TikTok", connected: true, color: "oklch(0.65 0.2 350)" },
  { id: "instagram", name: "Instagram", connected: false, color: "oklch(0.6 0.22 25)" },
  { id: "rtmp", name: "Custom RTMP", connected: false, color: "oklch(0.55 0.18 200)" },
];

export const aiTools = [
  {
    id: "cohost",
    name: "AI Co-Host & Director",
    description: "Real-time layout suggestions, highlight detection, auto lower thirds and smart transitions.",
    icon: "🎬",
    accent: "from-primary to-purple-glow",
  },
  {
    id: "script",
    name: "AI Script & Teleprompter",
    description: "Generate full scripts, SEO titles, descriptions and thumbnails powered by leading LLMs.",
    icon: "✍️",
    accent: "from-neon to-primary",
  },
  {
    id: "clipping",
    name: "Auto Clipping & Repurposing",
    description: "After every stream, get viral shorts, transcripts and executive summaries automatically.",
    icon: "✂️",
    accent: "from-purple-glow to-neon",
  },
  {
    id: "guests",
    name: "AI Guest Assistant",
    description: "Find relevant guests, draft personalized invites, moderate the chat with smart replies.",
    icon: "🤝",
    accent: "from-primary to-neon",
  },
  {
    id: "moderation",
    name: "Smart Chat Moderation",
    description: "Toxicity + spam filter, smart auto-responses, sentiment tracking in real time.",
    icon: "🛡️",
    accent: "from-neon to-purple-glow",
  },
  {
    id: "voice",
    name: "Voice Cloning & Avatars",
    description: "Use AI avatars or clone your voice for polished pre-recorded segments.",
    icon: "🗣️",
    accent: "from-purple-glow to-primary",
  },
  {
    id: "predictive",
    name: "Predictive Analytics",
    description: "AI predicts the best time to stream, optimal titles, and growth opportunities.",
    icon: "📈",
    accent: "from-primary to-neon",
  },
  {
    id: "search",
    name: "Semantic Library Search",
    description: "Find any moment across all your past streams using natural language.",
    icon: "🔍",
    accent: "from-neon to-primary",
  },
];

export const teamMembers = [
  { name: "Alex Rivera", role: "Admin", initials: "AR", online: true },
  { name: "Maya Chen", role: "Host", initials: "MC", online: true },
  { name: "Jordan Park", role: "Producer", initials: "JP", online: false },
  { name: "Sam Okafor", role: "Producer", initials: "SO", online: true },
  { name: "Lina Torres", role: "Guest", initials: "LT", online: false },
];
