CREATE TABLE public.email_domain_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_email text,
  action text NOT NULL,
  domain text NOT NULL,
  dns_provider text,
  ns_records text[] NOT NULL DEFAULT ARRAY[]::text[],
  score integer,
  statuses jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_domain_audit_actor_created_idx ON public.email_domain_audit (actor_id, created_at DESC);

GRANT SELECT, INSERT ON public.email_domain_audit TO authenticated;
GRANT ALL ON public.email_domain_audit TO service_role;

ALTER TABLE public.email_domain_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actors view own audit" ON public.email_domain_audit
  FOR SELECT TO authenticated USING (auth.uid() = actor_id);

CREATE POLICY "Admins view all audit" ON public.email_domain_audit
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Actors insert own audit" ON public.email_domain_audit
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);