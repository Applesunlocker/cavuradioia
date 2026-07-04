
-- Enum para roles de equipo
CREATE TYPE public.team_role AS ENUM ('admin', 'host', 'producer', 'guest');
CREATE TYPE public.broadcast_status AS ENUM ('live', 'scheduled', 'completed', 'draft');
CREATE TYPE public.team_status AS ENUM ('pending', 'active', 'removed');

-- =============== BROADCASTS ===============
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status public.broadcast_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  peak_viewers INTEGER NOT NULL DEFAULT 0,
  engagement NUMERIC(5,2) NOT NULL DEFAULT 0,
  platforms TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  thumbnail TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  host_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.broadcasts TO authenticated;
GRANT ALL ON public.broadcasts TO service_role;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage broadcasts" ON public.broadcasts FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all broadcasts" ON public.broadcasts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_broadcasts_owner ON public.broadcasts(owner_id, status);

-- =============== DESTINATIONS ===============
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  display_name TEXT NOT NULL,
  connected BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id, platform)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destinations TO authenticated;
GRANT ALL ON public.destinations TO service_role;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage destinations" ON public.destinations FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all destinations" ON public.destinations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============== LIBRARY ITEMS ===============
CREATE TABLE public.library_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broadcast_id UUID REFERENCES public.broadcasts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'clip',
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  url TEXT,
  thumbnail TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
GRANT ALL ON public.library_items TO service_role;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage library" ON public.library_items FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all library" ON public.library_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_library_owner ON public.library_items(owner_id);

-- =============== TEAM MEMBERS ===============
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT,
  display_name TEXT,
  role public.team_role NOT NULL DEFAULT 'guest',
  status public.team_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage team" ON public.team_members FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Members see own membership" ON public.team_members FOR SELECT TO authenticated
  USING (auth.uid() = member_user_id);
CREATE POLICY "Admins view all team" ON public.team_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============== ANALYTICS EVENTS ===============
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broadcast_id UUID REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  platform TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage analytics" ON public.analytics_events FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all analytics" ON public.analytics_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_analytics_owner_time ON public.analytics_events(owner_id, occurred_at DESC);

-- =============== UPDATED_AT TRIGGERS ===============
CREATE TRIGGER trg_broadcasts_updated BEFORE UPDATE ON public.broadcasts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_library_updated BEFORE UPDATE ON public.library_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
