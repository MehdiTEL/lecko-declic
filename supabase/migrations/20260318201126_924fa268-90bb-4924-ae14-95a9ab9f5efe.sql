
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT,
  email TEXT NOT NULL,
  telephone TEXT,
  message TEXT,
  metier_analyse TEXT,
  score_global INTEGER,
  type_analyse TEXT DEFAULT 'individuel',
  source TEXT DEFAULT 'cta_diagnostic',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit a lead)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  TO public
  WITH CHECK (true);
