CREATE TABLE IF NOT EXISTS public.user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
  metier TEXT NOT NULL,
  task_name TEXT NOT NULL,
  task_category TEXT NOT NULL,
  task_tool_type TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metier, task_name)
);

CREATE INDEX IF NOT EXISTS idx_user_actions_user ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON public.user_actions(user_id, status);

ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own actions"
  ON public.user_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own actions"
  ON public.user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own actions"
  ON public.user_actions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own actions"
  ON public.user_actions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_actions_updated_at
  BEFORE UPDATE ON public.user_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
