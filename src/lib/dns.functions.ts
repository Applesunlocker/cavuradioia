import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const checkSenderDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      domain: z
        .string()
        .min(4)
        .max(253)
        .regex(/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i, "Dominio inválido"),
      expectedNs: z.array(z.string().min(3).max(253)).max(8).default([]),
    }),
  )
  .handler(async ({ data }) => {
    const { inspectDomain } = await import("./dns.server");
    return inspectDomain(data.domain.toLowerCase(), data.expectedNs.map((n) => n.toLowerCase()));
  });
