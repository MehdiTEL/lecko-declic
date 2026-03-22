import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  ProgressState,
  TaskStatus,
  TrackedTask,
  MaturityConfig,
  getMaturityLevel,
  computeProgressPercent,
} from "@/types/gamification";
import type { BadgeDefinition, EarnedBadge, ActiveChallenge } from "@/types/badges";
import type { UserActions } from "@/lib/achievementEngine";
import {
  loadProgress,
  initTracking,
  updateTaskStatus,
  getGlobalProgress,
  getTrackedForAnalysis,
  resetProgress,
} from "@/lib/progressStorage";
import {
  evaluateBadges,
  loadEarnedBadges,
  getBadgeShelf,
  refreshChallenges,
  recordAction,
  resetAchievements,
} from "@/lib/achievementEngine";

export interface CelebrationEvent {
  type: "task_done" | "level_up" | "streak" | "badge_earned" | "challenge_completed";
  message: string;
  level?: MaturityConfig;
  streakCount?: number;
  badge?: BadgeDefinition;
}

interface ProgressContextValue {
  state: ProgressState;
  globalProgress: { percent: number; done: number; inProgress: number; total: number };
  currentMaturity: MaturityConfig;
  celebration: CelebrationEvent | null;
  earnedBadges: EarnedBadge[];
  activeChallenges: ActiveChallenge[];
  badgeShelf: ReturnType<typeof getBadgeShelf>;

  initAnalysisTracking: (analysisId: string, metier: string, taskNames: string[]) => void;
  setTaskStatus: (analysisId: string, taskName: string, status: TaskStatus) => void;
  getTasksForAnalysis: (analysisId: string) => TrackedTask[];
  dismissCelebration: () => void;
  resetAll: () => void;
  recordUserAction: (action: keyof UserActions) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress);
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>(loadEarnedBadges);
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([]);

  const globalProgress = getGlobalProgress(state);
  const currentMaturity = getMaturityLevel(globalProgress.percent);

  // Refresh challenges when progress changes
  useEffect(() => {
    const challenges = refreshChallenges(state);
    setActiveChallenges(challenges);
  }, [state.totalTasksCompleted, state.streak.currentStreak]);

  const initAnalysisTracking = useCallback(
    (analysisId: string, metier: string, taskNames: string[]) => {
      const updated = initTracking(analysisId, metier, taskNames);
      setState(updated);
      // Evaluate badges after init (may earn "first_analysis")
      const badgeResult = evaluateBadges(updated);
      setEarnedBadges(badgeResult.allEarned);
      if (badgeResult.newlyEarned.length > 0) {
        setCelebration({
          type: "badge_earned",
          message: `Badge débloqué : ${badgeResult.newlyEarned[0].name}`,
          badge: badgeResult.newlyEarned[0],
        });
      }
    },
    [],
  );

  const setTaskStatus = useCallback(
    (analysisId: string, taskName: string, status: TaskStatus) => {
      const result = updateTaskStatus(analysisId, taskName, status);
      setState(result.state);

      // Evaluate badges
      const badgeResult = evaluateBadges(result.state);
      setEarnedBadges(badgeResult.allEarned);

      // Trigger celebrations (priority: badge > level_up > streak > task_done)
      if (status === "done") {
        if (badgeResult.newlyEarned.length > 0) {
          setCelebration({
            type: "badge_earned",
            message: `Badge débloqué : ${badgeResult.newlyEarned[0].name}`,
            badge: badgeResult.newlyEarned[0],
          });
        } else if (result.levelUp) {
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

  const recordUserAction = useCallback(
    (action: keyof UserActions) => {
      recordAction(action);
      const badgeResult = evaluateBadges(state);
      setEarnedBadges(badgeResult.allEarned);
      if (badgeResult.newlyEarned.length > 0) {
        setCelebration({
          type: "badge_earned",
          message: `Badge débloqué : ${badgeResult.newlyEarned[0].name}`,
          badge: badgeResult.newlyEarned[0],
        });
      }
    },
    [state],
  );

  const resetAll = useCallback(() => {
    resetProgress();
    resetAchievements();
    setState(loadProgress());
    setEarnedBadges([]);
    setActiveChallenges([]);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        state,
        globalProgress,
        currentMaturity,
        celebration,
        earnedBadges,
        activeChallenges,
        badgeShelf: getBadgeShelf(),
        initAnalysisTracking,
        setTaskStatus,
        getTasksForAnalysis,
        dismissCelebration,
        resetAll,
        recordUserAction,
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
