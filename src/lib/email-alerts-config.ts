const KEY = "novastream.emailalerts.v1";
const EVENT = "novastream:emailalerts-updated";

export type AlertFrequency = "inmediata" | "cambios" | "diaria";
export type AlertEventId = "ns" | "spf" | "dkim" | "dmarc" | "mx";

export const ALERT_EVENTS: { id: AlertEventId; label: string }[] = [
  { id: "ns", label: "Delegación NS" },
  { id: "spf", label: "SPF" },
  { id: "dkim", label: "DKIM" },
  { id: "dmarc", label: "DMARC" },
  { id: "mx", label: "MX (rebotes)" },
];

export const FREQUENCY_OPTIONS: { id: AlertFrequency; label: string; hint: string }[] = [
  { id: "inmediata", label: "Inmediata", hint: "Avisa en cada verificación, incluso si el estado no cambió." },
  { id: "cambios", label: "Solo cambios", hint: "Avisa únicamente cuando un registro cambia de estado." },
  { id: "diaria", label: "Diaria", hint: "Como máximo un aviso cada 24 horas." },
];

export type AlertsConfig = {
  enabledEvents: AlertEventId[];
  frequency: AlertFrequency;
  notifyOnFailure: boolean;
  lastNotifiedAt: string | null;
  updatedAt: string | null;
};

export const DEFAULT_ALERTS: AlertsConfig = {
  enabledEvents: ["ns", "spf", "dkim", "dmarc", "mx"],
  frequency: "cambios",
  notifyOnFailure: true,
  lastNotifiedAt: null,
  updatedAt: null,
};

export function loadAlertsConfig(): AlertsConfig {
  if (typeof window === "undefined") return DEFAULT_ALERTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_ALERTS;
    const p = JSON.parse(raw) as Partial<AlertsConfig>;
    const valid = ALERT_EVENTS.map((e) => e.id);
    return {
      enabledEvents: Array.isArray(p.enabledEvents)
        ? (p.enabledEvents.filter((e) => valid.includes(e as AlertEventId)) as AlertEventId[])
        : DEFAULT_ALERTS.enabledEvents,
      frequency: FREQUENCY_OPTIONS.some((f) => f.id === p.frequency) ? (p.frequency as AlertFrequency) : "cambios",
      notifyOnFailure: p.notifyOnFailure !== false,
      lastNotifiedAt: p.lastNotifiedAt ?? null,
      updatedAt: p.updatedAt ?? null,
    };
  } catch {
    return DEFAULT_ALERTS;
  }
}

export function saveAlertsConfig(cfg: Partial<AlertsConfig>): AlertsConfig {
  const current = loadAlertsConfig();
  const next: AlertsConfig = {
    ...current,
    ...cfg,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  return next;
}

export function markAlertsNotified(): AlertsConfig {
  const current = loadAlertsConfig();
  const next = { ...current, lastNotifiedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  return next;
}

/** ¿Se permite notificar ahora según la frecuencia configurada? */
export function canNotifyNow(cfg: AlertsConfig, hasChanges: boolean): boolean {
  if (cfg.frequency === "cambios") return hasChanges;
  if (cfg.frequency === "diaria") {
    if (!cfg.lastNotifiedAt) return true;
    return Date.now() - new Date(cfg.lastNotifiedAt).getTime() >= 24 * 3600_000;
  }
  return true;
}

export function onAlertsConfigChange(cb: (cfg: AlertsConfig) => void) {
  const handler = () => cb(loadAlertsConfig());
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
