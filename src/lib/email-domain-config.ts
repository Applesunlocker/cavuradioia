const KEY = "novastream.emaildomain.v1";
const EVENT = "novastream:emaildomain-updated";

export type EmailDomainConfig = {
  /** Subdominio de envío delegado, ej. notify.midominio.com */
  senderDomain: string;
  /** Registros NS esperados que entrega el asistente de Lovable */
  nsRecords: string[];
  /** Proveedor DNS actual (informativo) */
  dnsProvider: string;
  updatedAt: string | null;
};

export const DEFAULT_EMAIL_DOMAIN: EmailDomainConfig = {
  senderDomain: "",
  nsRecords: [],
  dnsProvider: "",
  updatedAt: null,
};

export function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

export function isValidDomain(value: string) {
  const d = normalizeDomain(value);
  return /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(d);
}

export function parseNsList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((s) => normalizeDomain(s))
        .filter((s) => s.length > 0),
    ),
  ).slice(0, 8);
}

export function loadEmailDomain(): EmailDomainConfig {
  if (typeof window === "undefined") return DEFAULT_EMAIL_DOMAIN;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_EMAIL_DOMAIN;
    const p = JSON.parse(raw) as Partial<EmailDomainConfig>;
    return {
      senderDomain: normalizeDomain(String(p.senderDomain ?? "")),
      nsRecords: Array.isArray(p.nsRecords) ? p.nsRecords.map(normalizeDomain).filter(Boolean) : [],
      dnsProvider: String(p.dnsProvider ?? ""),
      updatedAt: p.updatedAt ?? null,
    };
  } catch {
    return DEFAULT_EMAIL_DOMAIN;
  }
}

export function saveEmailDomain(cfg: Omit<EmailDomainConfig, "updatedAt">): EmailDomainConfig {
  const clean: EmailDomainConfig = {
    senderDomain: normalizeDomain(cfg.senderDomain),
    nsRecords: cfg.nsRecords.map(normalizeDomain).filter(Boolean),
    dnsProvider: cfg.dnsProvider.trim(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(clean));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: clean }));
  return clean;
}

export function onEmailDomainChange(cb: (cfg: EmailDomainConfig) => void) {
  const handler = () => cb(loadEmailDomain());
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
