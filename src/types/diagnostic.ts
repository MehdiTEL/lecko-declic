export type DomaineId = 'documents' | 'communication' | 'donnees' | 'workflows' | 'creatif' | 'orchestration';
export type Niveau = 'basique' | 'intermediaire' | 'avance';
export type NiveauResultat = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';

export interface Domaine {
  id: DomaineId;
  titre: string;
  description: string;
  icone: string; // lucide-react icon name
  couleur: string; // hex color
  questionsCount: number;
}

export interface Option {
  label: string;
  valeur: number; // 0-3
}

export interface Question {
  id: string;
  domaine: DomaineId;
  texte: string;
  type: 'choix_unique';
  niveau: Niveau;
  options: Option[];
}

export interface DiagnosticResult {
  domaines_evalues: DomaineId[];
  scores: Record<DomaineId, number>; // 0-100
  niveaux: Record<DomaineId, NiveauResultat>;
  score_global: number;
  recommandation_ia?: string;
}
