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

// ─── Niveau d'accompagnement ───────────────────────────────────────────
export type AccompagnementLevel = "express" | "guide" | "consultant";

// ─── Complexité de mise en place ───────────────────────────────────────
export type ComplexiteMiseEnPlace = "faible" | "moyenne" | "elevee";

// ─── Écosystème d'outils enrichi ───────────────────────────────────────
export type ToolEcosystem =
  | "M365_PowerAutomate"
  | "M365_Copilot"
  | "N8N"
  | "Make_Zapier"
  | "Google_AppsScript"
  | "LLM_API"
  | "Agent_IA"
  | "Notion_Airtable"
  | "Python_Script"
  | "RPA"
  | "Natif_SaaS";

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
  // ─── Nouveaux champs (optionnels, rétro-compat) ─────────────────────
  ecosysteme?: ToolEcosystem;
  outils_specifiques?: string[];
  niveau_accompagnement?: AccompagnementLevel;
  raison_accompagnement?: string;
  complexite?: ComplexiteMiseEnPlace;
  temps_mise_en_place_jours?: number;
  prerequis?: string[];
  // ─── Champs processus détaillés (optionnels) ─────────────────────────
  process_actuel?: string;
  process_cible?: string;
  etapes_mise_en_place?: string[];
  limites?: string;
  exemple_resultat?: string;
  niveau_autonomie?: "autonome" | "guide" | "expert";
  // ─── Champs conduite du changement (optionnels) ──────────────────────
  perimetre_impact?: "moi_seul" | "mon_equipe" | "multi_services" | "externe";
  niveau_changement?: "transparent" | "leger" | "moyen" | "fort";
  risque_adoption?: "faible" | "moyen" | "eleve";
  actions_conduite_changement?: string;
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

// ─── Helpers ───────────────────────────────────────────────────────────

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

// ─── Accompagnement config ─────────────────────────────────────────────

export const ACCOMPAGNEMENT_CONFIG: Record<AccompagnementLevel, {
  label: string;
  icon: string;
  color: string;
  bgLight: string;
  textColor: string;
  description: string;
}> = {
  express: {
    label: "Express",
    icon: "Zap",
    color: "#10B981",
    bgLight: "hsl(152 76% 94%)",
    textColor: "hsl(160 72% 28%)",
    description: "Faisable en autonomie en quelques heures. Pas besoin d'aide externe.",
  },
  guide: {
    label: "Guidé",
    icon: "Sparkles",
    color: "#2563EB",
    bgLight: "hsl(221 100% 96%)",
    textColor: "hsl(221 83% 40%)",
    description: "Le DÉCLIC Copilot vous guide pas à pas. Quelques jours de mise en place.",
  },
  consultant: {
    label: "Accompagnement expert",
    icon: "Users",
    color: "#F59E0B",
    bgLight: "hsl(48 100% 96%)",
    textColor: "hsl(32 95% 35%)",
    description: "Nécessite un accompagnement expert. Intégration complexe ou conduite du changement.",
  },
};

export const COMPLEXITE_CONFIG: Record<ComplexiteMiseEnPlace, {
  label: string;
  dots: number;
  color: string;
}> = {
  faible: { label: "Faible", dots: 1, color: "#10B981" },
  moyenne: { label: "Moyenne", dots: 2, color: "#F59E0B" },
  elevee: { label: "Élevée", dots: 3, color: "#EF4444" },
};

export const ECOSYSTEM_LABELS: Record<ToolEcosystem, string> = {
  M365_PowerAutomate: "Power Automate",
  M365_Copilot: "Microsoft Copilot",
  N8N: "N8N",
  Make_Zapier: "Make / Zapier",
  Google_AppsScript: "Google Apps Script",
  LLM_API: "API LLM (Claude / GPT)",
  Agent_IA: "Agent IA",
  Notion_Airtable: "Notion / Airtable",
  Python_Script: "Script Python",
  RPA: "RPA (UiPath / PA Desktop)",
  Natif_SaaS: "Fonctionnalité native",
};

// ─── Organizational dimension configs ──────────────────────────────

export const PERIMETRE_IMPACT_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  moi_seul: { label: "Moi seul", icon: "User", color: "#10B981" },
  mon_equipe: { label: "Mon équipe", icon: "Users", color: "#2563EB" },
  multi_services: { label: "Plusieurs services", icon: "Building2", color: "#F59E0B" },
  externe: { label: "Parties externes", icon: "Globe", color: "#EF4444" },
};

export const NIVEAU_CHANGEMENT_CONFIG: Record<string, { label: string; detail: string; color: string }> = {
  transparent: { label: "Transparent", detail: "Personne ne remarque le changement", color: "#10B981" },
  leger: { label: "Léger", detail: "Nouvel outil, même processus", color: "#2563EB" },
  moyen: { label: "Moyen", detail: "Le processus change — formation nécessaire", color: "#F59E0B" },
  fort: { label: "Fort", detail: "Les rôles changent — conduite du changement", color: "#EF4444" },
};

export const RISQUE_ADOPTION_CONFIG: Record<string, { label: string; detail: string; color: string }> = {
  faible: { label: "Faible", detail: "Adoption naturelle", color: "#10B981" },
  moyen: { label: "Moyen", detail: "Formation nécessaire", color: "#F59E0B" },
  eleve: { label: "Élevé", detail: "Résistance probable", color: "#EF4444" },
};
