-- Table de whitelist des consultants DÉCLIC autorisés
-- NOTE: table nommée declic_consultants
CREATE TABLE IF NOT EXISTS public.declic_consultants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  prenom TEXT,
  nom TEXT,
  role TEXT DEFAULT 'consultant', -- 'consultant' | 'admin'
  actif BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emails autorisés par défaut
INSERT INTO public.declic_consultants (email, prenom, nom, role) VALUES
  ('contact@declic.fr', 'Admin', 'DÉCLIC', 'admin'),
  ('demo@declic.fr', 'Demo', 'DÉCLIC', 'consultant')
ON CONFLICT (email) DO NOTHING;

-- Index
CREATE INDEX IF NOT EXISTS idx_declic_consultants_email ON public.declic_consultants(email);

-- RLS : lecture par l'utilisateur lui-même ou les admins
ALTER TABLE public.declic_consultants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultant can read own record"
  ON public.declic_consultants FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admin can manage all"
  ON public.declic_consultants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.declic_consultants
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND role = 'admin'
    )
  );

-- Fonction pour vérifier si un email est autorisé
CREATE OR REPLACE FUNCTION public.is_declic_consultant(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.declic_consultants
    WHERE email = check_email AND actif = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_declic_consultant TO anon, authenticated;

-- Met à jour last_login automatiquement
CREATE OR REPLACE FUNCTION public.update_consultant_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.declic_consultants
  SET last_login = NOW()
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$;
