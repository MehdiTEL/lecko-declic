import type { AnalysisResult } from "./analysis";
import type { Sector, OrgSize } from "./diagnostic";

export type MissionStatut = "en_cours" | "cartographie_terminee" | "roadmap_validee" | "archivee";
export type EntretienStatut = "a_planifier" | "lien_envoye" | "en_cours" | "termine";
export type EntretienMode = "live" | "async";
export type Horizon = "3_mois" | "6_mois" | "12_mois" | "plus";
export type Priorite = "critique" | "haute" | "normale" | "basse";

export interface Mission {
  id: string;
  consultant_id: string;
  client_nom: string;
  client_organisation: string;
  client_secteur: Sector | null;
  client_taille: OrgSize | null;
  client_contact_nom: string | null;
  client_contact_email: string | null;
  client_contact_poste: string | null;
  objectif_mission: string | null;
  contexte_si: string | null;
  contraintes: string[];
  outils_actuels: string[];
  budget_indicatif: string | null;
  statut: MissionStatut;
  date_debut: string;
  date_livraison_prevue: string | null;
  created_at: string;
  updated_at: string;
  entretiens?: Entretien[];
  chantiers?: Chantier[];
}

export interface Entretien {
  id: string;
  mission_id: string;
  service_nom: string;
  metiers: string[];
  nb_personnes: number;
  interlocuteur_nom: string | null;
  interlocuteur_poste: string | null;
  date_entretien: string | null;
  mode: EntretienMode;
  async_token: string | null;
  async_expires_at: string | null;
  async_completed_at: string | null;
  resultats: AnalysisResult[] | null;
  notes_consultant: string | null;
  statut: EntretienStatut;
  created_at: string;
}

export interface Chantier {
  id: string;
  mission_id: string;
  entretien_id: string | null;
  titre: string;
  description: string | null;
  service_concerne: string | null;
  metier_source: string | null;
  categorie: string | null;
  type_outil: string | null;
  ecosysteme: string | null;
  niveau_accompagnement: string | null;
  temps_gagne_heures_semaine: number;
  nb_personnes_impactees: number;
  impact_total_heures_an: number | null;
  score_impact: number;
  score_effort: number;
  priorite: Priorite;
  horizon: Horizon | null;
  statut: string;
  budget_estime: string | null;
  prerequis: string[];
  ordre: number;
  created_at: string;
}

export const MISSION_STATUT_LABELS: Record<MissionStatut, string> = {
  en_cours: "En cours",
  cartographie_terminee: "Cartographie terminee",
  roadmap_validee: "Roadmap validee",
  archivee: "Archivee",
};

export const MISSION_STATUT_COLORS: Record<MissionStatut, string> = {
  en_cours: "#2563EB",
  cartographie_terminee: "#F59E0B",
  roadmap_validee: "#10B981",
  archivee: "#6B7280",
};

export const HORIZON_LABELS: Record<Horizon, string> = {
  "3_mois": "3 mois",
  "6_mois": "6 mois",
  "12_mois": "12 mois",
  "plus": "12 mois+",
};

export const PRIORITE_CONFIG: Record<Priorite, { label: string; color: string; bg: string }> = {
  critique: { label: "Critique", color: "#EF4444", bg: "#FEF2F2" },
  haute: { label: "Haute", color: "#F59E0B", bg: "#FFFBEB" },
  normale: { label: "Normale", color: "#2563EB", bg: "#EFF6FF" },
  basse: { label: "Basse", color: "#6B7280", bg: "#F9FAFB" },
};

export function computePriorite(impact: number, effort: number): Priorite {
  const score = impact - effort;
  if (score >= 3) return "critique";
  if (score >= 1) return "haute";
  if (score >= -1) return "normale";
  return "basse";
}

export function computeImpactAnnuel(heures: number, personnes: number): number {
  return Math.round(heures * personnes * 47 * 10) / 10;
}
