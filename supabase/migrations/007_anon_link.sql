ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS anon_id_link TEXT UNIQUE;

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS email_monthly_opt_in BOOLEAN DEFAULT true;

CREATE TABLE IF NOT EXISTS public.email_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON public.email_log(recipient_email, type);
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON public.email_log USING (false);
