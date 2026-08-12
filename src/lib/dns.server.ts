type DohAnswer = { name: string; type: number; TTL: number; data: string };

async function query(name: string, type: "NS" | "TXT" | "MX" | "CNAME"): Promise<DohAnswer[]> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
  const res = await fetch(url, { headers: { accept: "application/dns-json" } });
  if (!res.ok) throw new Error(`Consulta DNS fallida (${res.status})`);
  const json = (await res.json()) as { Answer?: DohAnswer[] };
  return json.Answer ?? [];
}

const cleanTxt = (data: string) =>
  data
    .split(/"\s*"/)
    .join("")
    .replace(/^"|"$/g, "")
    .trim();

const DKIM_SELECTORS = ["smtp", "mailo", "k1", "default", "mx", "s1", "lovable"];

export type RecordCheck = {
  id: string;
  label: string;
  host: string;
  type: string;
  status: "ok" | "missing" | "warning";
  found: string[];
  detail: string;
};

export async function inspectDomain(domain: string, expectedNs: string[]) {
  const checks: RecordCheck[] = [];
  const rootDomain = domain.split(".").slice(-2).join(".");

  // NS (delegación)
  const ns = await query(domain, "NS").catch(() => []);
  const nsFound = ns.filter((a) => a.type === 2).map((a) => cleanTxt(a.data).replace(/\.$/, "").toLowerCase());
  const nsMissing = expectedNs.filter((e) => !nsFound.includes(e));
  checks.push({
    id: "ns",
    label: "Delegación NS",
    host: domain,
    type: "NS",
    status: nsFound.length === 0 ? "missing" : expectedNs.length === 0 ? "warning" : nsMissing.length ? "warning" : "ok",
    found: nsFound,
    detail:
      nsFound.length === 0
        ? "No hay delegación NS publicada para este subdominio."
        : expectedNs.length === 0
          ? "Delegación detectada. Añade los NS esperados para comparar automáticamente."
          : nsMissing.length
            ? `Faltan o no coinciden: ${nsMissing.join(", ")}`
            : "Delegación correcta hacia los nameservers esperados.",
  });

  // SPF
  const spfAnswers = await query(domain, "TXT").catch(() => []);
  const spf = spfAnswers.map((a) => cleanTxt(a.data)).filter((t) => t.toLowerCase().startsWith("v=spf1"));
  checks.push({
    id: "spf",
    label: "SPF",
    host: domain,
    type: "TXT",
    status: spf.length === 0 ? "missing" : spf.length > 1 ? "warning" : "ok",
    found: spf,
    detail:
      spf.length === 0
        ? "Sin registro SPF: los correos pueden marcarse como spam."
        : spf.length > 1
          ? "Hay más de un SPF publicado; debe existir solo uno."
          : "SPF publicado correctamente.",
  });

  // DKIM
  const dkimFound: string[] = [];
  for (const sel of DKIM_SELECTORS) {
    const host = `${sel}._domainkey.${domain}`;
    const [txt, cname] = await Promise.all([
      query(host, "TXT").catch(() => []),
      query(host, "CNAME").catch(() => []),
    ]);
    const hit = [...txt, ...cname].map((a) => cleanTxt(a.data)).filter(Boolean);
    if (hit.length) dkimFound.push(`${sel}: ${hit[0].slice(0, 80)}${hit[0].length > 80 ? "…" : ""}`);
  }
  checks.push({
    id: "dkim",
    label: "DKIM",
    host: `<selector>._domainkey.${domain}`,
    type: "TXT / CNAME",
    status: dkimFound.length ? "ok" : "missing",
    found: dkimFound,
    detail: dkimFound.length
      ? "Firma DKIM detectada. Los correos se firman criptográficamente."
      : "No se detectó DKIM en los selectores habituales. Si la delegación NS es reciente, espera la propagación.",
  });

  // DMARC
  const dmarcAnswers = await query(`_dmarc.${rootDomain}`, "TXT").catch(() => []);
  const dmarc = dmarcAnswers.map((a) => cleanTxt(a.data)).filter((t) => t.toLowerCase().startsWith("v=dmarc1"));
  checks.push({
    id: "dmarc",
    label: "DMARC",
    host: `_dmarc.${rootDomain}`,
    type: "TXT",
    status: dmarc.length === 0 ? "missing" : /p=\s*none/i.test(dmarc[0]) ? "warning" : "ok",
    found: dmarc,
    detail:
      dmarc.length === 0
        ? "Sin política DMARC. Recomendado: v=DMARC1; p=quarantine; rua=mailto:..."
        : /p=\s*none/i.test(dmarc[0])
          ? "Política en p=none (solo monitorización). Sube a quarantine o reject cuando todo esté estable."
          : "Política DMARC activa.",
  });

  // MX
  const mxAnswers = await query(domain, "MX").catch(() => []);
  const mx = mxAnswers.map((a) => cleanTxt(a.data));
  checks.push({
    id: "mx",
    label: "MX (rebotes)",
    host: domain,
    type: "MX",
    status: mx.length ? "ok" : "warning",
    found: mx,
    detail: mx.length
      ? "Servidores de correo configurados para procesar rebotes y quejas."
      : "Sin MX en el subdominio de envío; los rebotes pueden no registrarse.",
  });

  const score = Math.round((checks.filter((c) => c.status === "ok").length / checks.length) * 100);

  return { domain, checkedAt: new Date().toISOString(), score, checks };
}
