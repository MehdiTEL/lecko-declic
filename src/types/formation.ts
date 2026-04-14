import type { DomaineId } from './diagnostic';

export type NiveauFormation = 'debutant' | 'intermediaire';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explication: string;
}

export interface Module {
  id: string;
  titre: string;
  duree: string; // e.g. "15 min"
  contenu: string; // Markdown
  quiz: QuizQuestion[];
}

export interface Formation {
  id: string;
  slug: string;
  titre: string;
  description: string;
  domaine: DomaineId;
  niveau: NiveauFormation;
  duree: string; // e.g. "1h30"
  objectifs: string[];
  modules: Module[];
}
