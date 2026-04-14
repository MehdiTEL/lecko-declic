import type { Domaine, DomaineId } from '../types/diagnostic';

export const domaines: Domaine[] = [
  {
    id: 'documents',
    titre: 'Documents',
    description: 'Rédaction, extraction, synthèse et reformulation automatisées',
    icone: 'FileText',
    couleur: '#8B5CF6',
    questionsCount: 6,
  },
  {
    id: 'communication',
    titre: 'Communication',
    description: 'Emails, comptes-rendus, messages et réponses automatisés',
    icone: 'MessageSquare',
    couleur: '#06B6D4',
    questionsCount: 6,
  },
  {
    id: 'donnees',
    titre: 'Données',
    description: 'Analyse, reporting, tableaux et visualisations automatisés',
    icone: 'BarChart3',
    couleur: '#22C55E',
    questionsCount: 6,
  },
  {
    id: 'workflows',
    titre: 'Workflows',
    description: 'Processus, approbations et chaînes de tâches automatisés',
    icone: 'GitBranch',
    couleur: '#F59E0B',
    questionsCount: 6,
  },
  {
    id: 'creatif',
    titre: 'Créatif',
    description: 'Visuels, présentations et contenu automatisés',
    icone: 'Palette',
    couleur: '#EC4899',
    questionsCount: 6,
  },
  {
    id: 'orchestration',
    titre: 'Orchestration',
    description: 'Agents, prompts avancés et intégrations multi-outils',
    icone: 'Cpu',
    couleur: '#F97316',
    questionsCount: 6,
  },
];

// Record by ID for quick lookup
export const DOMAINES: Record<DomaineId, Domaine> = Object.fromEntries(
  domaines.map((d) => [d.id, d])
) as Record<DomaineId, Domaine>;
