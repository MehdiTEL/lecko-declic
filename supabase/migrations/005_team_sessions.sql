CREATE TABLE IF NOT EXISTS public.team_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  nom TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.team_sessions(id) ON DELETE CASCADE,
  metier TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  result JSONB,
  anon_id TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_sessions_code ON public.team_sessions(code);
CREATE INDEX IF NOT EXISTS idx_team_members_session ON public.team_members(session_id);

ALTER TABLE public.team_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team sessions" ON public.team_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create team sessions" ON public.team_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Anyone can join team sessions" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update team members" ON public.team_members FOR UPDATE USING (true);
