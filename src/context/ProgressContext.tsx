import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  ProgressState,
  TaskStatus,
  TrackedTask,
  MaturityConfig,
  getMaturityLevel,
  computeProgressPercent,
} from "@/types/gamification";
import {
  loadProgress,
  initTracking,
  updateTaskStatus,
  getGlobalProgress,
  getTrackedForAnalysis,
  resetProgress,
} from "@/lib/progressStorage";

export interface CelebrationEvent {
  type: "task_done" | "level_up" | "streak";
  message: string;
  level?: MaturityConfig;
  streakCount?: number;
}

interface ProgressContextValue {
  state: ProgressState;
  globalProgress: { percent: number; done: number; inProgress: number; total: number };
  currentMaturity: MaturityConfig;
  celebration: CelebrationEvent | null;

  initAnalysisTracking: (analysisId: string, metier: string, taskNames: string[]) => void;
  setTaskStatus: (analysisId: string, taskName: string, status: TaskStatus) => void;
  getTasksForAnalysis: (analysisId: string) => TrackedTask[];
  dismissCelebration: () => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress);
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);

  const globalProgress = getGlobalProgress(state);
  const currentMaturity = getMaturityLevel(globalProgress.percent);

  const initAnalysisTracking = useCallback(
    (analysisId: string, metier: string, taskNames: string[]) => {
      const updated = initTracking(analysisId, metier, taskNames);
      setState(updated);
    },
    [],
  );

  const setTaskStatus = useCallback(
    (analysisId: string, taskName: string, status: TaskStatus) => {
      const result = updateTaskStatus(analysisId, taskName, status);
      setState(result.state);

      // Trigger celebrations
      if (status === "done") {
        if (result.levelUp) {
          const newLevel = getMaturityLevel(
            computeProgressPercent(
              result.state.trackedTasks.filter((t) => t.analysisId === analysisId),
            ),
          );
          setCelebration({
            type: "level_up",
            message: `Niveau atteint : ${newLevel.emoji} ${newLevel.label} !`,
            level: newLevel,
          });
        } else {
          const s = result.state.streak;
          if ([3, 7, 14, 30].includes(s.currentStreak)) {
            setCelebration({
              type: "streak",
              message: `${s.currentStreak} jours d'affilée !`,
              streakCount: s.currentStreak,
            });
          } else {
            setCelebration({
              type: "task_done",
              message: `"${taskName}" automatisée !`,
            });
          }
        }
      }
    },
    [],
  );

  const getTasksForAnalysis = useCallback(
    (analysisId: string) => {
      return getTrackedForAnalysis(state, analysisId);
    },
    [state],
  );

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  const resetAll = useCallback(() => {
    resetProgress();
    setState(loadProgress());
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        state,
        globalProgress,
        currentMaturity,
        celebration,
        initAnalysisTracking,
        setTaskStatus,
        getTasksForAnalysis,
        dismissCelebration,
        resetAll,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
