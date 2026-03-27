import type { AnalysisResult } from "./analysis";

// ─── Critères & Scoring ──────────────────────────────────────────────────────

export interface CritereConfig {
  id: string;
  label: string;
  description: string;
  poids: number; // 0-1
  actif: boolean;
}

export interface ScoringConfig {
  criteres: CritereConfig[];
  seuil_impact_minimum: number;
  seuil_effort_maximum: number;
  ponderation_impact: number;
  ponderation_effort: number;
}

export interface MissionConfig {
  scoring: ScoringConfig;
  affichage: {
    montrer_budget: boolean;
    montrer_temps_gagne: boolean;
    montrer_ecosysteme: boolean;
    montrer_accompagnement: boolean;
    montrer_conduite_changement: boolean;
    montrer_prerequis: boolean;
  };
  export: {
    inclure_graphiques: boolean;
    inclure_recommandations: boolean;
    format_par_defaut: "pdf" | "pptx" | "xlsx";
    logo_consultant_url: string | null;
  };
  portail: {
    message_accueil: string;
    sections_visibles: string[];
    permettre_commentaires: boolean;
    permettre_validations: boolean;
  };
}

export const DEFAULT_MISSION_CONFIG: MissionConfig = {
  scoring: {
    criteres: [
      { id: "recurrence", label: "Tache recurrente", description: "La tache se repete regulierement", poids: 1, actif: true },
      { id: "energie", label: "Chronophage", description: "La tache consomme beaucoup de temps/energie", poids: 1, actif: true },
      { id: "scalabilite", label: "Scalable", description: "L'automatisation profite a plusieurs personnes", poids: 1, actif: true },
      { id: "fiabilite", label: "Risque d'erreur", description: "La tache est sujette aux erreurs humaines", poids: 1, actif: true },
      { id: "penibilite", label: "Penible", description: "La tache est desagreable ou demotivante", poids: 1, actif: true },
    ],
    seuil_impact_minimum: 2,
    seuil_effort_maximum: 4,
    ponderation_impact: 1,
    ponderation_effort: 1,
  },
  affichage: {
    montrer_budget: true,
    montrer_temps_gagne: true,
    montrer_ecosysteme: true,
    montrer_accompagnement: true,
    montrer_conduite_changement: false,
    montrer_prerequis: true,
  },
  export: {
    inclure_graphiques: true,
    inclure_recommandations: true,
    format_par_defaut: "pdf",
    logo_consultant_url: null,
  },
  portail: {
    message_accueil: "Bienvenue sur votre portail de suivi de mission.",
    sections_visibles: ["chantiers", "timeline", "kpis"],
    permettre_commentaires: true,
    permettre_validations: true,
  },
};

// ─── Mission Template ────────────────────────────────────────────────────────

export interface MissionTemplate {
  id: string;
  consultant_id: string;
  nom: string;
  description: string | null;
  secteur: string | null;
  taille_cible: string | null;
  objectif_type: string | null;
  config: MissionConfig;
  questionnaire_id: string | null;
  stack_config_id: string | null;
  chantiers_preset: ChantierLibraryItem[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Questionnaire Template ──────────────────────────────────────────────────

export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "number"
  | "slider"
  | "rating";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  obligatoire: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface QuestionnaireSection {
  id: string;
  titre: string;
  description?: string;
  questions: Question[];
}

export interface QuestionnaireTemplate {
  id: string;
  consultant_id: string;
  nom: string;
  description: string | null;
  sections: QuestionnaireSection[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Chantier Library ────────────────────────────────────────────────────────

export interface ChantierLibraryItem {
  id: string;
  consultant_id: string;
  titre: string;
  description: string | null;
  categorie: string | null;
  type_outil: string | null;
  ecosysteme: string | null;
  niveau_accompagnement: string | null;
  temps_gagne_heures_semaine: number;
  score_impact: number;
  score_effort: number;
  horizon: string | null;
  budget_estime: string | null;
  prerequis: string[];
  tags: string[];
  secteur: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Stack Config ────────────────────────────────────────────────────────────

export interface StackConfig {
  id: string;
  consultant_id: string;
  nom: string;
  description: string | null;
  outils: { nom: string; categorie: string; url?: string }[];
  ecosysteme_principal: string | null;
  contraintes: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Custom Metier ───────────────────────────────────────────────────────────

export interface CustomMetier {
  id: string;
  consultant_id: string;
  nom: string;
  secteur: string | null;
  description: string | null;
  taches_cles: string[];
  outils_courants: string[];
  resultats: AnalysisResult | null;
  created_at: string;
  updated_at: string;
}

// ─── Portail Client ──────────────────────────────────────────────────────────

export interface PortailClient {
  id: string;
  mission_id: string;
  token: string;
  actif: boolean;
  derniere_visite: string | null;
  nb_visites: number;
  created_at: string;
}

// ─── Commentaire Client ──────────────────────────────────────────────────────

export interface CommentaireClient {
  id: string;
  mission_id: string;
  chantier_id: string | null;
  auteur_nom: string;
  contenu: string;
  reponse_consultant: string | null;
  lu: boolean;
  created_at: string;
}

// ─── Validation Client ───────────────────────────────────────────────────────

export type ValidationStatut =
  | "en_attente"
  | "valide"
  | "refuse"
  | "a_revoir";

export interface ValidationClient {
  id: string;
  mission_id: string;
  chantier_id: string;
  statut: ValidationStatut;
  commentaire: string | null;
  validateur_nom: string | null;
  validated_at: string | null;
  created_at: string;
}

export const VALIDATION_CONFIG: Record<
  ValidationStatut,
  { label: string; color: string; bg: string; icon: string }
> = {
  en_attente: {
    label: "En attente",
    color: "#6B7280",
    bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    icon: "Clock",
  },
  valide: {
    label: "Valide",
    color: "#10B981",
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: "CheckCircle2",
  },
  refuse: {
    label: "Refuse",
    color: "#EF4444",
    bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    icon: "XCircle",
  },
  a_revoir: {
    label: "A revoir",
    color: "#F59E0B",
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    icon: "AlertCircle",
  },
};
