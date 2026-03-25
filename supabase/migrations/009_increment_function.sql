CREATE OR REPLACE FUNCTION public.increment_counter(counter_key TEXT, amount BIGINT DEFAULT 1)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.global_counters
  SET value = value + amount, updated_at = NOW()
  WHERE key = counter_key;
$$;
GRANT EXECUTE ON FUNCTION public.increment_counter TO anon, authenticated;
