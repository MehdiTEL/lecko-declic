-- DÉCLIC Platform Tables

-- Diagnostic results
CREATE TABLE IF NOT EXISTS diagnostic_resultats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domaines_evalues TEXT[] NOT NULL,
  scores JSONB NOT NULL, -- { "documents": 75, "communication": 50, ... }
  niveaux JSONB NOT NULL, -- { "documents": "Avancé", ... }
  score_global INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Formation progress
CREATE TABLE IF NOT EXISTS formation_progression (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  formation_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  quiz_score INTEGER, -- percentage 0-100, null if not taken
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, formation_id, module_id)
);

-- AI usage tracking (rate limiting)
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- for anonymous users
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE diagnostic_resultats ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can read own diagnostic results"
  ON diagnostic_resultats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostic results"
  ON diagnostic_resultats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own formation progress"
  ON formation_progression FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formation progress"
  ON formation_progression FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formation progress"
  ON formation_progression FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own AI usage"
  ON ai_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert AI usage"
  ON ai_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Indexes
CREATE INDEX idx_diagnostic_resultats_user ON diagnostic_resultats(user_id);
CREATE INDEX idx_formation_progression_user ON formation_progression(user_id);
CREATE INDEX idx_ai_usage_user ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_session ON ai_usage(session_id);
CREATE INDEX idx_ai_usage_created ON ai_usage(created_at);
