import { type ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm md:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {delta && (
        <p
          className={`mt-2 text-xs font-medium ${
            positive ? "text-neon" : "text-destructive"
          }`}
        >
          {positive ? "▲" : "▼"} {delta}
        </p>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "bg-destructive/15 text-destructive border-destructive/30",
    scheduled: "bg-primary/15 text-primary border-primary/30",
    completed: "bg-neon/15 text-neon border-neon/30",
    draft: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<string, string> = {
    live: "En vivo",
    scheduled: "Programada",
    completed: "Finalizada",
    draft: "Borrador",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
        map[status] ?? map.draft
      }`}
    >
      {status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-destructive live-dot" />}
      {labels[status] ?? status}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "neon";
}) {
  const styles = {
    primary: "gradient-primary-bg text-primary-foreground glow hover:scale-[1.02]",
    neon: "gradient-neon-bg text-neon-foreground glow-neon hover:scale-[1.02]",
    outline: "border border-border bg-card/40 hover:bg-accent text-foreground",
    ghost: "hover:bg-accent text-foreground",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
