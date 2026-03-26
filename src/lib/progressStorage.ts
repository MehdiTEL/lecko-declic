/**
 * Gamification progress persistence — hybrid localStorage + Supabase.
 * READ: always from localStorage (instant, no latency)
 * WRITE: localStorage immediate + Supabase fire-and-forget background sync
 */
import {
  ProgressState,
  TrackedTask,
  StreakData,
  TaskStatus,
  todayDateString,
  computeProgressPercent,
  getMaturityLevel,
} from "@/types/gamification";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "declic-progress";

const DEFAULT_STATE: ProgressState = {
  trackedTasks: [],
  streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: "" },
  totalTasksCompleted: 0,
};

// ─── localStorage (source of truth) ─────────────────────────────────

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncToSupabase(state).catch(() => {});
}

// ─── Supabase sync (background, best-effort) ────────────────────────

async function syncToSupabase(state: ProgressState): Promise<void> {
  const anonId = getOrCreateAnonId();
  try {
    await supabase.from("user_progress").upsert(
      {
        anon_id: anonId,
        progress_data: state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "anon_id" },
    );
  } catch {
    // Silent fail — localStorage is the source of truth
  }
}

function getOrCreateAnonId(): string {
  const KEY = "declic-anon-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

// ─── Actions ────────────────────────────────────────────────────────

/** Initialize tracking for an analysis (idempotent — skips if already tracked) */
export function initTracking(
  analysisId: string,
  metier: string,
  taskNames: string[],
): ProgressState {
  const state = loadProgress();
  const existing = state.trackedTasks.filter((t) => t.analysisId === analysisId);
  if (existing.length > 0) return state;

  const newTasks: TrackedTask[] = taskNames.map((name) => ({
    taskName: name,
    metier,
    analysisId,
    status: "todo" as TaskStatus,
  }));

  const updated: ProgressState = {
    ...state,
    trackedTasks: [...state.trackedTasks, ...newTasks],
    firstActivityDate: state.firstActivityDate ?? new Date().toISOString(),
  };

  saveProgress(updated);
  return updated;
}

/** Update task status — returns new state + level-up info */
export function updateTaskStatus(
  analysisId: string,
  taskName: string,
  newStatus: TaskStatus,
): {
  state: ProgressState;
  levelUp: boolean;
  previousLevel: string;
  newLevel: string;
} {
  const state = loadProgress();
  const prevLevel = getMaturityLevelForAnalysis(state, analysisId);

  const now = new Date().toISOString();
  const trackedTasks = state.trackedTasks.map((t) => {
    if (t.analysisId === analysisId && t.taskName === taskName) {
      return {
        ...t,
        status: newStatus,
        startedAt: newStatus === "in_progress" ? (t.startedAt ?? now) : t.startedAt,
        completedAt: newStatus === "done" ? now : undefined,
      };
    }
    return t;
  });

  const streak = updateStreak(state.streak);

  const totalTasksCompleted =
    newStatus === "done" ? state.totalTasksCompleted + 1 : state.totalTasksCompleted;

  const updated: ProgressState = { ...state, trackedTasks, streak, totalTasksCompleted };
  saveProgress(updated);

  const newLevelStr = getMaturityLevelForAnalysis(updated, analysisId);
  const levelUp = newLevelStr !== prevLevel && newStatus === "done";

  return {
    state: updated,
    levelUp,
    previousLevel: prevLevel,
    newLevel: newLevelStr,
  };
}

/** Update streak data */
function updateStreak(streak: StreakData): StreakData {
  const today = todayDateString();
  if (streak.lastActivityDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const isConsecutive = streak.lastActivityDate === yesterdayStr;
  const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
  const newLongest = Math.max(streak.longestStreak, newCurrent);

  return {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastActivityDate: today,
  };
}

// ─── Computed helpers ───────────────────────────────────────────────

function getMaturityLevelForAnalysis(state: ProgressState, analysisId: string): string {
  const tasks = state.trackedTasks.filter((t) => t.analysisId === analysisId);
  const percent = computeProgressPercent(tasks);
  return getMaturityLevel(percent).level;
}

/** Global progress across all analyses */
export function getGlobalProgress(state: ProgressState): {
  percent: number;
  done: number;
  inProgress: number;
  total: number;
} {
  const total = state.trackedTasks.length;
  const done = state.trackedTasks.filter((t) => t.status === "done").length;
  const inProgress = state.trackedTasks.filter((t) => t.status === "in_progress").length;
  const percent = computeProgressPercent(state.trackedTasks);
  return { percent, done, inProgress, total };
}

/** Get tracked tasks for a specific analysis */
export function getTrackedForAnalysis(
  state: ProgressState,
  analysisId: string,
): TrackedTask[] {
  return state.trackedTasks.filter((t) => t.analysisId === analysisId);
}

/** Reset all progress */
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  syncToSupabase(DEFAULT_STATE).catch(() => {});
}
