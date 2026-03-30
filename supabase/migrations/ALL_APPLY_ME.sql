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
-- ============================================================================
-- 011_modulable.sql — Couche modulable consultant
-- ============================================================================

-- ─── 1. Mission Templates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mission_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  description TEXT,
  secteur TEXT,
  taille_cible TEXT,
  objectif_type TEXT,
  config JSONB DEFAULT '{}',
  questionnaire_id UUID,
  stack_config_id UUID,
  chantiers_preset JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Questionnaire Templates ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.questionnaire_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Chantier Library ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chantier_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  categorie TEXT,
  type_outil TEXT,
  ecosysteme TEXT,
  niveau_accompagnement TEXT,
  temps_gagne_heures_semaine NUMERIC(5,1) DEFAULT 0,
  score_impact INTEGER DEFAULT 3,
  score_effort INTEGER DEFAULT 3,
  horizon TEXT,
  budget_estime TEXT,
  prerequis TEXT[],
  tags TEXT[] DEFAULT '{}',
  secteur TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Stack Configs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stack_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  description TEXT,
  outils JSONB NOT NULL DEFAULT '[]',
  ecosysteme_principal TEXT,
  contraintes TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. Custom Metiers ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_metiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  secteur TEXT,
  description TEXT,
  taches_cles TEXT[],
  outils_courants TEXT[],
  resultats JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. Portail Clients ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portail_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  actif BOOLEAN DEFAULT TRUE,
  derniere_visite TIMESTAMPTZ,
  nb_visites INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. Commentaires Client ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.commentaires_client (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE CASCADE,
  auteur_nom TEXT NOT NULL,
  contenu TEXT NOT NULL,
  reponse_consultant TEXT,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. Validations Client ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.validations_client (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  chantier_id UUID NOT NULL REFERENCES public.chantiers(id) ON DELETE CASCADE,
  statut TEXT NOT NULL DEFAULT 'en_attente',
  commentaire TEXT,
  validateur_nom TEXT,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mission_id, chantier_id)
);

-- ─── ALTER missions — colonnes modulables ────────────────────────────────────
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.mission_templates(id) ON DELETE SET NULL;
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS questionnaire_id UUID REFERENCES public.questionnaire_templates(id) ON DELETE SET NULL;
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS stack_config_id UUID REFERENCES public.stack_configs(id) ON DELETE SET NULL;
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS client_logo_url TEXT;
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS client_couleur_primaire TEXT DEFAULT '#2563EB';
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS client_couleur_secondaire TEXT DEFAULT '#1E40AF';
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS portail_client_actif BOOLEAN DEFAULT FALSE;
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS portail_client_token TEXT;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mission_templates_consultant ON public.mission_templates(consultant_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_consultant ON public.questionnaire_templates(consultant_id);
CREATE INDEX IF NOT EXISTS idx_chantier_library_consultant ON public.chantier_library(consultant_id);
CREATE INDEX IF NOT EXISTS idx_chantier_library_categorie ON public.chantier_library(categorie);
CREATE INDEX IF NOT EXISTS idx_chantier_library_tags ON public.chantier_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_stack_configs_consultant ON public.stack_configs(consultant_id);
CREATE INDEX IF NOT EXISTS idx_custom_metiers_consultant ON public.custom_metiers(consultant_id);
CREATE INDEX IF NOT EXISTS idx_portail_clients_mission ON public.portail_clients(mission_id);
CREATE INDEX IF NOT EXISTS idx_portail_clients_token ON public.portail_clients(token);
CREATE INDEX IF NOT EXISTS idx_commentaires_client_mission ON public.commentaires_client(mission_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_client_chantier ON public.commentaires_client(chantier_id);
CREATE INDEX IF NOT EXISTS idx_validations_client_mission ON public.validations_client(mission_id);
CREATE INDEX IF NOT EXISTS idx_validations_client_chantier ON public.validations_client(chantier_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantier_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stack_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portail_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commentaires_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validations_client ENABLE ROW LEVEL SECURITY;

-- Mission Templates: consultant owns
CREATE POLICY "Consultant sees own mission_templates" ON public.mission_templates FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Public mission_templates readable" ON public.mission_templates FOR SELECT
  USING (is_public = TRUE);

-- Questionnaire Templates: consultant owns
CREATE POLICY "Consultant sees own questionnaire_templates" ON public.questionnaire_templates FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Public questionnaire_templates readable" ON public.questionnaire_templates FOR SELECT
  USING (is_public = TRUE);

-- Chantier Library: consultant owns
CREATE POLICY "Consultant sees own chantier_library" ON public.chantier_library FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Public chantier_library readable" ON public.chantier_library FOR SELECT
  USING (is_public = TRUE);

-- Stack Configs: consultant owns
CREATE POLICY "Consultant sees own stack_configs" ON public.stack_configs FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Public stack_configs readable" ON public.stack_configs FOR SELECT
  USING (is_public = TRUE);

-- Custom Metiers: consultant owns
CREATE POLICY "Consultant sees own custom_metiers" ON public.custom_metiers FOR ALL
  USING (auth.uid() = consultant_id) WITH CHECK (auth.uid() = consultant_id);

-- Portail Clients: consultant via mission ownership
CREATE POLICY "Consultant sees own portail_clients" ON public.portail_clients FOR ALL
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = portail_clients.mission_id AND missions.consultant_id = auth.uid()));

CREATE POLICY "Public portail access via token" ON public.portail_clients FOR SELECT
  USING (actif = TRUE AND token IS NOT NULL);

-- Commentaires Client: consultant via mission + public via portail token
CREATE POLICY "Consultant sees own commentaires" ON public.commentaires_client FOR ALL
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = commentaires_client.mission_id AND missions.consultant_id = auth.uid()));

CREATE POLICY "Client can add commentaire via portail" ON public.commentaires_client FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.portail_clients WHERE portail_clients.mission_id = commentaires_client.mission_id AND portail_clients.actif = TRUE));

-- Validations Client: consultant via mission + public via portail token
CREATE POLICY "Consultant sees own validations" ON public.validations_client FOR ALL
  USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = validations_client.mission_id AND missions.consultant_id = auth.uid()));

CREATE POLICY "Client can upsert validation via portail" ON public.validations_client FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.portail_clients WHERE portail_clients.mission_id = validations_client.mission_id AND portail_clients.actif = TRUE));

CREATE POLICY "Client can update validation via portail" ON public.validations_client FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.portail_clients WHERE portail_clients.mission_id = validations_client.mission_id AND portail_clients.actif = TRUE));

-- ─── FK back-references for templates ────────────────────────────────────────
ALTER TABLE public.mission_templates
  ADD CONSTRAINT fk_mission_templates_questionnaire
  FOREIGN KEY (questionnaire_id) REFERENCES public.questionnaire_templates(id) ON DELETE SET NULL;

ALTER TABLE public.mission_templates
  ADD CONSTRAINT fk_mission_templates_stack_config
  FOREIGN KEY (stack_config_id) REFERENCES public.stack_configs(id) ON DELETE SET NULL;
