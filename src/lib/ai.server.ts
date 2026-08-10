// Server-only helper for Lovable AI Gateway (Responses API, streaming).
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-5.6-sol";

export async function runAi(opts: { instructions: string; input: string }): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Falta LOVABLE_API_KEY en el servidor.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: opts.instructions,
      input: opts.input,
      stream: true,
      reasoning: { effort: "low", summary: "auto" },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Límite de solicitudes alcanzado. Intenta de nuevo en un momento.");
    if (res.status === 402) throw new Error("Créditos de IA agotados. Añade créditos al espacio de trabajo.");
    throw new Error(`Error de IA (${res.status}): ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let reasoning = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as { type?: string; delta?: string };
        if (evt.type === "response.output_text.delta" && evt.delta) text += evt.delta;
        else if (evt.type === "response.reasoning_summary_text.delta" && evt.delta) reasoning += evt.delta;
      } catch {
        // ignore partial/non-JSON events
      }
    }
  }

  return text.trim() || reasoning.trim() || "La IA no devolvió contenido. Inténtalo de nuevo.";
}
