import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { AnalysisResult } from "@/types/analysis";

export type ActionStatus = "todo" | "in_progress" | "done" | "skipped";

export interface UserAction {
  id: string;
  task_name: string;
  task_category: string;
  task_tool_type: string | null;
  status: ActionStatus;
  priority: number;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  metier: string;
}

export function useActions(metier: string | null) {
  const { user } = useAuth();
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActions = useCallback(async () => {
    if (!user || !metier) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase.from("user_actions") as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("metier", metier)
        .order("priority", { ascending: false });
      if (!error && data) setActions(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user, metier]);

  useEffect(() => { loadActions(); }, [loadActions]);

  const initFromDiagnostic = useCallback(async (result: AnalysisResult) => {
    if (!user) return;
    const autoTasks = result.taches.filter(
      t => t.categorie === "automatisable" || t.categorie === "partiellement_automatisable"
    );
    for (const task of autoTasks) {
      try {
        await (supabase.from("user_actions") as any).upsert({
          user_id: user.id,
          metier: result.metier,
          task_name: task.nom,
          task_category: task.categorie,
          task_tool_type: task.type_outil ?? null,
          priority: task.score_criteres ?? 0,
          status: "todo",
        }, { onConflict: "user_id,metier,task_name", ignoreDuplicates: true });
      } catch { /* duplicate */ }
    }
    await loadActions();
  }, [user, loadActions]);

  const updateStatus = useCallback(async (taskName: string, newStatus: ActionStatus) => {
    if (!user || !metier) return;
    const updates: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === "in_progress" && !actions.find(a => a.task_name === taskName)?.started_at) {
      updates.started_at = new Date().toISOString();
    }
    if (newStatus === "done") updates.completed_at = new Date().toISOString();

    await (supabase.from("user_actions") as any)
      .update(updates)
      .eq("user_id", user.id)
      .eq("metier", metier)
      .eq("task_name", taskName);

    setActions(prev => prev.map(a =>
      a.task_name === taskName ? { ...a, ...updates } as UserAction : a
    ));
  }, [user, metier, actions]);

  const updateNotes = useCallback(async (taskName: string, notes: string) => {
    if (!user || !metier) return;
    await (supabase.from("user_actions") as any)
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("metier", metier)
      .eq("task_name", taskName);
    setActions(prev => prev.map(a => a.task_name === taskName ? { ...a, notes } : a));
  }, [user, metier]);

  const activeActions = actions.filter(a => a.status !== "skipped");
  const stats = {
    total: actions.length,
    todo: actions.filter(a => a.status === "todo").length,
    inProgress: actions.filter(a => a.status === "in_progress").length,
    done: actions.filter(a => a.status === "done").length,
    skipped: actions.filter(a => a.status === "skipped").length,
    progressPercent: activeActions.length > 0
      ? Math.round((actions.filter(a => a.status === "done").length / activeActions.length) * 100)
      : 0,
  };

  return { actions, loading, stats, initFromDiagnostic, updateStatus, updateNotes, reload: loadActions };
}
