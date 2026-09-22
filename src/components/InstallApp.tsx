import { useEffect, useState } from "react";
import { Download, MonitorDown, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "novastream.install.dismissed";

export function useInstallApp() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
    return outcome === "accepted";
  };

  return { canInstall: !!promptEvent && !installed, installed, install };
}

/** Botón compacto para barras de navegación */
export function InstallButton({ className = "" }: { className?: string }) {
  const { canInstall, install } = useInstallApp();
  if (!canInstall) return null;
  return (
    <button
      type="button"
      onClick={install}
      className={`inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/20 ${className}`}
    >
      <MonitorDown className="h-4 w-4" />
      Instalar app
    </button>
  );
}

/** Aviso flotante de instalación, descartable */
export function InstallPrompt() {
  const { canInstall, install } = useInstallApp();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!canInstall || hidden) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-card/90 p-4 shadow-2xl backdrop-blur-xl">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setHidden(true);
        }}
        className="absolute right-2 top-2 rounded-lg p-1 text-muted-foreground transition hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/15 p-2 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Instala NovaStream AI</p>
          <p className="text-xs text-muted-foreground">
            Ábrela desde tu escritorio en su propia ventana, sin barra del navegador.
          </p>
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Instalar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
