-- Table des métiers pré-écrits avec leurs tâches enrichies
CREATE TABLE IF NOT EXISTS public.metiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  metier TEXT NOT NULL,
  score_global INTEGER NOT NULL,
  heures_economisees_semaine NUMERIC(4,1) NOT NULL,
  taches JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche par slug
CREATE INDEX IF NOT EXISTS idx_metiers_slug ON public.metiers(slug);

-- Index full-text pour la recherche approximative
CREATE INDEX IF NOT EXISTS idx_metiers_search ON public.metiers USING GIN (to_tsvector('french', metier));

-- RLS : lecture publique, écriture admin uniquement
ALTER TABLE public.metiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des métiers"
  ON public.metiers FOR SELECT
  USING (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_metiers_updated_at
  BEFORE UPDATE ON public.metiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
