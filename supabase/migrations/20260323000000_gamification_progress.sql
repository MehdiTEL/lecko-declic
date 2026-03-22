-- Gamification : table de progression utilisateur
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anon_id TEXT NOT NULL UNIQUE,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour lookups par anon_id
CREATE INDEX IF NOT EXISTS idx_user_progress_anon_id ON public.user_progress(anon_id);

-- RLS : tout le monde peut lire/écrire (mode anonyme)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view progress"
  ON public.user_progress FOR SELECT USING (true);

CREATE POLICY "Anyone can insert progress"
  ON public.user_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own progress"
  ON public.user_progress FOR UPDATE USING (true);
