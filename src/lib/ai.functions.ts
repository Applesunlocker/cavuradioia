import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ES = "Responde SIEMPRE en español neutro. Usa formato claro y directo, sin relleno.";

export const generateStreamContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      topic: z.string().min(2).max(300),
      tool: z.enum(["paquete", "guion", "titulos", "descripcion", "clips", "resumen", "traduccion"]).default("paquete"),
    }),
  )
  .handler(async ({ data }) => {
    const { runAi } = await import("./ai.server");

    const briefs: Record<string, string> = {
      paquete:
        "Genera un paquete completo para un directo: 1) Título sugerido, 2) Descripción (máx. 80 palabras), 3) 8 etiquetas SEO, 4) Gancho inicial de 2 frases, 5) Idea de miniatura, 6) Llamada a la acción. Usa emojis como viñetas de sección.",
      guion: "Escribe un guion estructurado para un directo de 30 minutos: intro, 4 bloques con puntos clave y cierre.",
      titulos: "Propón 10 títulos alternativos optimizados para clics, con una nota breve de por qué funciona cada uno.",
      descripcion: "Escribe una descripción optimizada para SEO (máx. 120 palabras) más 10 etiquetas.",
      clips: "Sugiere 6 momentos clip-worthy con título corto, gancho y duración recomendada en segundos.",
      resumen: "Resume el tema en 5 puntos clave accionables más una conclusión de una frase.",
      traduccion: "Traduce y adapta al inglés el paquete promocional (título, descripción y etiquetas) del tema indicado.",
    };

    const text = await runAi({
      instructions: `Eres el director creativo de NovaStream AI, plataforma de streaming en vivo. ${ES} Máximo 400 palabras.`,
      input: `Tarea: ${briefs[data.tool] ?? briefs.paquete}\n\nTema del directo: ${data.topic}`,
    });

    return { text };
  });

export const semanticLibrarySearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      query: z.string().min(2).max(200),
      items: z.array(z.object({ id: z.string(), title: z.string(), item_type: z.string().nullable() })).max(60),
    }),
  )
  .handler(async ({ data }) => {
    const { runAi } = await import("./ai.server");

    if (data.items.length === 0) {
      return { intent: data.query, summary: "Tu librería está vacía, aún no hay nada que buscar.", ids: [] as string[] };
    }

    const catalog = data.items.map((i) => `${i.id} | ${i.title} | ${i.item_type ?? "item"}`).join("\n");
    const text = await runAi({
      instructions: `Eres un motor de búsqueda semántica para una librería de vídeo. ${ES} Devuelve EXACTAMENTE este formato, sin nada más:\nINTENCION: <intención detectada en una frase>\nRESUMEN: <resumen de los resultados en 1-2 frases>\nIDS: <ids separados por comas, más relevante primero; vacío si no hay coincidencias>`,
      input: `Consulta del usuario: "${data.query}"\n\nCatálogo (id | título | tipo):\n${catalog}`,
    });

    const get = (label: string) => new RegExp(`${label}:\\s*(.*)`, "i").exec(text)?.[1]?.trim() ?? "";
    const validIds = new Set(data.items.map((i) => i.id));
    const ids = get("IDS")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => validIds.has(s));

    return {
      intent: get("INTENCION") || data.query,
      summary: get("RESUMEN") || "Resultados ordenados por relevancia semántica.",
      ids,
    };
  });
