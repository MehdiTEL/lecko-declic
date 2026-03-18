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

export interface AnalysisTask {
  nom: string;
  description: string;
  categorie: TaskCategory;
  solution: string;
  type_outil: ToolType;
  temps_gagne_heures_semaine: number;
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
  supabaseId?: string;
}
