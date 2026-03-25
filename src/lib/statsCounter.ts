// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { supabase } from "@/integrations/supabase/client";

// Cast client to any to call RPC / query tables not in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function incrementGlobalCounter(
  key: "total_diagnostics" | "total_hours_saved" | "total_tasks_completed" | "total_users",
  amount = 1
): Promise<void> {
  try {
    await db.rpc("increment_counter", { counter_key: key, amount });
  } catch { /* fire-and-forget */ }
}

export async function loadGlobalCounters(): Promise<Record<string, number>> {
  try {
    const { data } = await db.from("global_counters").select("key, value");
    return Object.fromEntries((data ?? []).map((r: any) => [r.key, Number(r.value)]));
  } catch { return {}; }
}

export async function loadTopMetiers(): Promise<Array<{
  metier: string; count: number; avg_score: number; avg_hours: number;
}>> {
  try {
    const { data } = await db.from("stats_metiers").select("*").limit(10);
    return (data ?? []).map((r: any) => ({
      metier: r.metier,
      count: Number(r.count),
      avg_score: Math.round(Number(r.avg_score)),
      avg_hours: Math.round(Number(r.avg_hours) * 10) / 10,
    }));
  } catch { return []; }
}
