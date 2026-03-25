
-- ============================================================
-- 1. user_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  nom         TEXT NOT NULL,
  entreprise  TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- 2. user_actions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_actions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metier           TEXT NOT NULL,
  task_name        TEXT NOT NULL,
  task_category    TEXT NOT NULL,
  task_tool_type   TEXT,
  status           TEXT NOT NULL DEFAULT 'todo',
  priority         INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  started_at       TIMESTAMP WITH TIME ZONE,
  completed_at     TIMESTAMP WITH TIME ZONE,
  updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, metier, task_name)
);

ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own actions"
  ON public.user_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
  ON public.user_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
  ON public.user_actions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actions"
  ON public.user_actions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. user_progress  (anonymous progress sync)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id       TEXT NOT NULL UNIQUE,
  progress_data JSONB NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert their own progress"
  ON public.user_progress FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. team_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  nom         TEXT NOT NULL,
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create team sessions"
  ON public.team_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view team sessions"
  ON public.team_sessions FOR SELECT
  USING (true);

-- ============================================================
-- 5. team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES public.team_sessions(id) ON DELETE CASCADE,
  metier      TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 1,
  anon_id     TEXT NOT NULL,
  result      JSONB,
  joined_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert team members"
  ON public.team_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view team members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update team members"
  ON public.team_members FOR UPDATE
  USING (true);

-- ============================================================
-- Trigger: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_actions_updated_at
  BEFORE UPDATE ON public.user_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
