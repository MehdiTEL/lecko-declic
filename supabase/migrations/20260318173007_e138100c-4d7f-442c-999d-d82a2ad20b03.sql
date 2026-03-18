
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metier TEXT NOT NULL,
  resultats JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analyses" 
  ON public.analyses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert analyses" 
  ON public.analyses 
  FOR INSERT 
  WITH CHECK (true);
