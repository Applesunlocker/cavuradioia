import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mic, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceder o crear cuenta — NovaStream AI" },
      { name: "description", content: "Entra a tu Studio de NovaStream AI o crea una cuenta gratis para empezar a transmitir con IA." },
      { property: "og:title", content: "Acceder o crear cuenta — NovaStream AI" },
      { property: "og:description", content: "Accede a tu Studio de streaming con IA en segundos." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://cavuradioia.lovable.app/auth" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://cavuradioia.lovable.app/auth" }],
  }),

  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu correo si se requiere confirmación.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido de vuelta.");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error(`No se pudo iniciar sesión con ${provider}`);
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg gradient-primary-bg flex items-center justify-center glow">
            <Mic className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">NovaStream AI</span>
        </Link>

        <div className="glass-strong rounded-2xl p-6 border border-border">
          <h1 className="text-2xl font-bold text-center">
            {mode === "signin" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {mode === "signin" ? "Accede a tu studio" : "Empieza a transmitir en minutos"}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="rounded-lg border border-border bg-card/60 hover:bg-accent py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={loading}
              className="rounded-lg border border-border bg-card/60 hover:bg-accent py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <AppleIcon /> Apple
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> o con email <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nombre
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                className="mt-1 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="mt-1 w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl gradient-primary-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "¿Sin cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signin" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6L19 3.7C17.1 1.95 14.7 1 12 1 7.3 1 3.3 3.7 1.4 7.6l3.4 2.6C5.7 7.2 8.6 5 12 5z"/>
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.4 3.4l3.7 2.9c2.2-2 3.5-5 3.5-8.5z"/>
      <path fill="#FBBC05" d="M4.8 14.2C4.6 13.5 4.5 12.8 4.5 12s.1-1.5.3-2.2L1.4 7.2C.5 8.7 0 10.3 0 12s.5 3.3 1.4 4.8l3.4-2.6z"/>
      <path fill="#34A853" d="M12 23c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.1-4.2 1.1-3.4 0-6.3-2.2-7.3-5.2L1.4 15.7C3.3 19.7 7.3 23 12 23z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 12.04c-.03-2.96 2.42-4.38 2.53-4.45-1.38-2.02-3.53-2.3-4.3-2.33-1.83-.19-3.57 1.08-4.5 1.08-.93 0-2.36-1.05-3.88-1.02-2 .03-3.84 1.16-4.87 2.95-2.08 3.6-.53 8.93 1.5 11.86.99 1.43 2.17 3.04 3.71 2.98 1.49-.06 2.05-.96 3.85-.96s2.31.96 3.88.93c1.6-.03 2.62-1.46 3.6-2.9 1.13-1.66 1.6-3.27 1.63-3.35-.04-.02-3.13-1.2-3.15-4.79zM14.4 3.5c.82-1 1.37-2.39 1.22-3.77-1.18.05-2.6.78-3.45 1.77-.76.88-1.43 2.29-1.25 3.65 1.32.1 2.66-.67 3.48-1.65z"/>
    </svg>
  );
}
