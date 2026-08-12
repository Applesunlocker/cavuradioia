import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Button, StatCard } from "@/components/ui-bits";
import { checkSenderDomain } from "@/lib/dns.functions";
import {
  loadEmailDomain,
  saveEmailDomain,
  isValidDomain,
  normalizeDomain,
  parseNsList,
  type EmailDomainConfig,
} from "@/lib/email-domain-config";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Save, Mail, Server, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/email-domain")({
  head: () => ({
    meta: [
      { title: "Dominio de remitente — NovaStream AI" },
      {
        name: "description",
        content:
          "Gestiona tu dominio de remitente en NovaStream AI: estado de SPF, DKIM, DMARC, MX y actualización de registros NS.",
      },
    ],
  }),
  component: EmailDomainPanel;
});

const statusStyles = {
  ok: "bg-neon/15 text-neon border-neon/30",
  warning: "bg-primary/15 text-primary border-primary/30",
  missing: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

const statusLabels = { ok: "Correcto", warning: "Revisar", missing: "Falta" } as const;
const StatusIcon = { ok: CheckCircle2, warning: AlertTriangle, missing: XCircle };

function EmailDomainPanel() {
  const [cfg, setCfg] = useState<EmailDomainConfig>(() => loadEmailDomain());
  const [domain, setDomain] = useState("");
  const [nsRaw, setNsRaw] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    const c = loadEmailDomain();
    setCfg(c);
    setDomain(c.senderDomain);
    setNsRaw(c.nsRecords.join("\n"));
    setProvider(c.dnsProvider);
  }, []);

  const nsList = useMemo(() => parseNsList(nsRaw), [nsRaw]);
  const domainError = domain.length > 0 && !isValidDomain(domain) ? "Formato de dominio inválido (ej. notify.midominio.com)" : null;

  const check = useServerFn(checkSenderDomain);
  const inspection = useMutation({
    mutationFn: (input: { domain: string; expectedNs: string[] }) => check({ data: input }),
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "No se pudo verificar el DNS"),
  });

  const save = () => {
    if (!isValidDomain(domain)) {
      toast.error("Introduce un dominio válido antes de guardar");
      return;
    }
    const saved = saveEmailDomain({ senderDomain: normalizeDomain(domain), nsRecords: nsList, dnsProvider: provider });
    setCfg(saved);
    setNsRaw(saved.nsRecords.join("\n"));
    toast.success("Configuración de dominio guardada");
    inspection.mutate({ domain: saved.senderDomain, expectedNs: saved.nsRecords });
  };

  const verify = () => {
    if (!isValidDomain(domain)) {
      toast.error("Introduce un dominio válido para verificar");
      return;
    }
    inspection.mutate({ domain: normalizeDomain(domain), expectedNs: nsList });
  };

  const result = inspection.data;

  return (
    <AppShell>
      <PageHeader
        title="Dominio de remitente"
        description="Controla el subdominio desde el que salen tus correos, revisa SPF, DKIM, DMARC y MX en vivo, y actualiza los registros NS cuando cambies de proveedor DNS."
        action={
          <Button onClick={verify} disabled={inspection.isPending}>
            <RefreshCw className={`h-4 w-4 ${inspection.isPending ? "animate-spin" : ""}`} />
            {inspection.isPending ? "Verificando…" : "Verificar DNS"}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Configuración</h2>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Subdominio de envío</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="notify.midominio.com"
              className="mt-1.5 w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
            />
            {domainError && <p className="mt-1.5 text-xs text-destructive">{domainError}</p>}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Proveedor DNS actual</label>
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Cloudflare, Namecheap, GoDaddy…"
              className="mt-1.5 w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Registros NS esperados (uno por línea)
            </label>
            <textarea
              value={nsRaw}
              onChange={(e) => setNsRaw(e.target.value)}
              rows={4}
              placeholder={"ns1.ejemplo-proveedor.com\nns2.ejemplo-proveedor.com"}
              className="mt-1.5 w-full rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm font-mono outline-none focus:border-primary/60"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Pega aquí los nameservers que te indique el asistente de correo. Al cambiar de proveedor, actualiza esta lista y
              vuelve a verificar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={!!domainError || domain.length === 0}>
              <Save className="h-4 w-4" /> Guardar y verificar
            </Button>
            {nsList.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(nsList.join("\n"));
                  toast.success("Registros NS copiados");
                }}
              >
                <Copy className="h-4 w-4" /> Copiar NS
              </Button>
            )}
          </div>

          {cfg.updatedAt && (
            <p className="text-xs text-muted-foreground">
              Última actualización: {new Date(cfg.updatedAt).toLocaleString("es-ES")}
            </p>
          )}
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard label="Salud del dominio" value={result ? `${result.score}%` : "—"} />
            <StatCard label="Registros correctos" value={result ? `${result.checks.filter((c) => c.status === "ok").length}/${result.checks.length}` : "—"} />
            <StatCard label="NS esperados" value={String(nsList.length)} />
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="h-4 w-4 text-neon" />
              <h2 className="font-semibold">Estado de autenticación de correo</h2>
            </div>

            {!result && !inspection.isPending && (
              <p className="text-sm text-muted-foreground">
                Introduce tu subdominio de envío y pulsa «Verificar DNS» para consultar SPF, DKIM, DMARC, MX y la delegación NS
                en tiempo real.
              </p>
            )}
            {inspection.isPending && <p className="text-sm text-muted-foreground">Consultando servidores DNS…</p>}

            {result && (
              <>
                <ul className="space-y-3">
                  {result.checks.map((c) => {
                    const Icon = StatusIcon[c.status];
                    return (
                      <li key={c.id} className="rounded-xl border border-border bg-card/30 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0" />
                              <p className="font-semibold">{c.label}</p>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[c.status]}`}
                              >
                                {statusLabels[c.status]}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-mono text-muted-foreground break-all">
                              {c.type} · {c.host}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">{c.detail}</p>
                            {c.found.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {c.found.map((f, i) => (
                                  <li key={i} className="text-xs font-mono break-all text-foreground/80">
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Verificado el {new Date(result.checkedAt).toLocaleString("es-ES")}. Los cambios DNS pueden tardar hasta 72 h en
                  propagarse.
                </p>
              </>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Cambiar de proveedor DNS sin cortar el envío</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
              <li>Crea el subdominio de envío en el nuevo proveedor antes de mover nada.</li>
              <li>Añade allí los registros NS indicados por el asistente de correo y guárdalos aquí.</li>
              <li>Verifica el DNS en este panel hasta que la delegación NS aparezca como «Correcto».</li>
              <li>Elimina los NS antiguos solo cuando SPF, DKIM y DMARC estén en verde.</li>
            </ol>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
