const KEY = "novastream.contact.v1";

export type ContactConfig = {
  whatsappNumber: string; // formato internacional sin "+"
  whatsappMessage: string;
};

export const DEFAULT_CONTACT: ContactConfig = {
  whatsappNumber: "584120000000",
  whatsappMessage: "Hola, me interesa NovaStream AI",
};

const EVENT = "novastream:contact-updated";

export function loadContact(): ContactConfig {
  if (typeof window === "undefined") return DEFAULT_CONTACT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONTACT;
    const parsed = JSON.parse(raw);
    return {
      whatsappNumber: String(parsed.whatsappNumber || DEFAULT_CONTACT.whatsappNumber).replace(/\D/g, ""),
      whatsappMessage: String(parsed.whatsappMessage || DEFAULT_CONTACT.whatsappMessage),
    };
  } catch {
    return DEFAULT_CONTACT;
  }
}

export function saveContact(cfg: ContactConfig) {
  const clean: ContactConfig = {
    whatsappNumber: cfg.whatsappNumber.replace(/\D/g, ""),
    whatsappMessage: cfg.whatsappMessage.trim() || DEFAULT_CONTACT.whatsappMessage,
  };
  localStorage.setItem(KEY, JSON.stringify(clean));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: clean }));
  return clean;
}

export function onContactChange(cb: (cfg: ContactConfig) => void) {
  const handler = () => cb(loadContact());
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function buildWhatsAppUrl(cfg: ContactConfig) {
  return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage)}`;
}
