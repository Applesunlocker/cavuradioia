CREATE TABLE public.launch_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  plan_interest text,
  source text NOT NULL DEFAULT 'lanzamiento',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX launch_waitlist_email_key ON public.launch_waitlist (lower(email));
GRANT INSERT ON public.launch_waitlist TO anon;
GRANT INSERT, SELECT ON public.launch_waitlist TO authenticated;
GRANT ALL ON public.launch_waitlist TO service_role;
ALTER TABLE public.launch_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON public.launch_waitlist FOR INSERT TO anon, authenticated WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
CREATE POLICY "Admins view waitlist" ON public.launch_waitlist FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));