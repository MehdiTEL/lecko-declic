-- Missions client
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_nom TEXT NOT NULL,
  client_organisation TEXT NOT NULL,
  client_secteur TEXT,
  client_taille TEXT,
  client_contact_nom TEXT,
  client_contact_email TEXT,
  client_contact_poste TEXT,
  objectif_mission TEXT,
  contexte_si TEXT,
  contraintes TEXT[],
  outils_actuels TEXT[],
  budget_indicatif TEXT,
  statut TEXT NOT NULL DEFAULT 'en_cours',
  date_debut DATE DEFAULT CURRENT_DATE,
  date_livraison_prevue DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entretiens
CREATE TABLE IF NOT EXISTS public.entretiens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  service_nom TEXT NOT NULL,
  metiers TEXT[] NOT NULL,
  nb_personnes INTEGER DEFAULT 1,
  interlocuteur_nom TEXT,
  interlocuteur_poste TEXT,
  date_entretien DATE,
  mode TEXT DEFAULT 'live',
  async_token TEXT UNIQUE,
  async_expires_at TIMESTAMPTZ,
  async_completed_at TIMESTAMPTZ,
  resultats JSONB,
  notes_consultant TEXT,
  statut TEXT NOT NULL DEFAULT 'a_planifier',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chantiers
CREATE TABLE IF NOT EXISTS public.chantiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  entretien_id UUID REFERENCES public.entretiens(id) ON DELETE SET NULL,
  titre TEXT NOT NULL,
  description TEXT,
  service_concerne TEXT,
  metier_source TEXT,
  categorie TEXT,
  type_outil TEXT,
  ecosysteme TEXT,
  niveau_accompagnement TEXT,
  temps_gagne_heures_semaine NUMERIC(5,1) DEFAULT 0,
  nb_personnes_impactees INTEGER DEFAULT 1,
  impact_total_heures_an NUMERIC(8,1),
  score_impact INTEGER DEFAULT 3,
  score_effort INTEGER DEFAULT 3,
  priorite TEXT DEFAULT 'normale',
  horizon TEXT,
  statut TEXT DEFAULT 'identifie',
  budget_estime TEXT,
  prerequis TEXT[],
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_missions_consultant ON public.missions(consultant_id);
CREATE INDEX IF NOT EXISTS idx_entretiens_mission ON public.entretiens(mission_id);
CREATE INDEX IF NOT EXISTS idx_entretiens_token ON public.entretiens(async_token);
CREATE INDEX IF NOT EXISTS idx_chantiers_mission ON public.chantiers(mission_id);

-- RLS
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entretiens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultant sees own missions" ON public.missions FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Consultant sees own entretiens" ON public.entretiens FOR ALL
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = entretiens.mission_id AND missions.consultant_id = auth.uid()));

CREATE POLICY "Client async access via token" ON public.entretiens FOR SELECT
  USING (async_token IS NOT NULL AND async_expires_at > NOW());

CREATE POLICY "Client can submit via token" ON public.entretiens FOR UPDATE
  USING (async_token IS NOT NULL AND async_expires_at > NOW()) WITH CHECK (async_token IS NOT NULL);

CREATE POLICY "Consultant sees own chantiers" ON public.chantiers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = chantiers.mission_id AND missions.consultant_id = auth.uid()));
