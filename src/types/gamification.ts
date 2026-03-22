// ─── Statut d'une tâche dans le parcours ──────────────────────────
export type TaskStatus = "todo" | "in_progress" | "done";

// ─── Niveau de maturité IA ────────────────────────────────────────
export type MaturityLevel = "explorateur" | "batisseur" | "automatiseur" | "transformateur";

export interface MaturityConfig {
  level: MaturityLevel;
  label: string;
  emoji: string;
  minPercent: number;
  color: string;
  bgLight: string;
  description: string;
}

export const MATURITY_LEVELS: MaturityConfig[] = [
  {
    level: "explorateur",
    label: "Explorateur",
    emoji: "🔍",
    minPercent: 0,
    color: "#6B7280",
    bgLight: "hsl(220 9% 94%)",
    description: "Vous découvrez le potentiel d'automatisation de votre métier.",
  },
  {
    level: "batisseur",
    label: "Bâtisseur",
    emoji: "🔧",
    minPercent: 25,
    color: "#2563EB",
    bgLight: "hsl(221 100% 96%)",
    description: "Vous commencez à automatiser vos premières tâches. Le mouvement est lancé !",
  },
  {
    level: "automatiseur",
    label: "Automatiseur",
    emoji: "⚡",
    minPercent: 50,
    color: "#F59E0B",
    bgLight: "hsl(48 100% 96%)",
    description: "Plus de la moitié de vos tâches sont en cours ou automatisées. Impressionnant.",
  },
  {
    level: "transformateur",
    label: "Transformateur",
    emoji: "🏆",
    minPercent: 75,
    color: "#10B981",
    bgLight: "hsl(152 76% 94%)",
    description: "Vous avez transformé votre façon de travailler. Vous êtes un modèle.",
  },
];

// ─── Tracking d'une tâche individuelle ────────────────────────────
export interface TrackedTask {
  taskName: string;
  metier: string;
  analysisId: string;
  status: TaskStatus;
  startedAt?: string;
  completedAt?: string;
}

// ─── Streak ───────────────────────────────────────────────────────
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

// ─── État complet de progression ──────────────────────────────────
export interface ProgressState {
  trackedTasks: TrackedTask[];
  streak: StreakData;
  totalTasksCompleted: number;
  firstActivityDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────

export function getMaturityLevel(progressPercent: number): MaturityConfig {
  const sorted = [...MATURITY_LEVELS].sort((a, b) => b.minPercent - a.minPercent);
  return sorted.find((l) => progressPercent >= l.minPercent) ?? MATURITY_LEVELS[0];
}

export function computeProgressPercent(tasks: TrackedTask[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  return Math.round(((done + inProgress * 0.5) / tasks.length) * 100);
}

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
