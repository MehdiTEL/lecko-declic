CREATE OR REPLACE VIEW public.stats_metiers AS
SELECT
  metier,
  COUNT(*) as count,
  AVG(score_global) as avg_score,
  AVG(heures_economisees_semaine) as avg_hours
FROM public.analyses
WHERE metier IS NOT NULL
GROUP BY metier
ORDER BY count DESC
LIMIT 20;

CREATE TABLE IF NOT EXISTS public.global_counters (
  key TEXT PRIMARY KEY,
  value BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.global_counters (key, value) VALUES
  ('total_diagnostics', 0),
  ('total_hours_saved', 0),
  ('total_tasks_completed', 0),
  ('total_users', 0)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.global_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read counters" ON public.global_counters FOR SELECT USING (true);
