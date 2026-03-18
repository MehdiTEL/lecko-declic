export type TaskCategory =
  | "automatisable"
  | "partiellement_automatisable"
  | "difficilement_automatisable";

export type ToolType =
  | "Agent IA"
  | "Workflow N8N"
  | "Automatisation No-Code"
  | "Copilot / Assistant IA"
  | "Script personnalisé";

export type AnalysisSource = "local" | "api";

export interface TaskCriteres {
  recurrence: boolean;
  energie: boolean;
  scalabilite: boolean;
  fiabilite: boolean;
  penibilite: boolean;
}

export interface AnalysisTask {
  nom: string;
  description: string;
  categorie: TaskCategory;
  solution: string;
  type_outil: ToolType;
  temps_gagne_heures_semaine: number;
  // DÉCLIC methodology fields (optional for backward compat)
  criteres?: TaskCriteres;
  score_criteres?: number; // 0-5
  peut_fonctionner_sans_ia?: boolean;
  raison_ia?: string;
}

export interface AnalysisResult {
  metier: string;
  score_global: number;
  heures_economisees_semaine: number;
  taches: AnalysisTask[];
}

export interface HistoryEntry {
  id: string;
  metier: string;
  date: string;
  result: AnalysisResult;
  source?: AnalysisSource;
  supabaseId?: string;
}

// Helpers
export function computeScoreCriteres(criteres?: TaskCriteres): number {
  if (!criteres) return 0;
  return [criteres.recurrence, criteres.energie, criteres.scalabilite, criteres.fiabilite, criteres.penibilite]
    .filter(Boolean).length;
}

export function getScoreColor(score: number): string {
  if (score >= 3) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 2) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

export function getScoreBadgeClass(score: number): string {
  if (score >= 3) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (score >= 2) return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
}
