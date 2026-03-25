export interface PhaseTemplate {
  phase: number;
  label: string;
  nom: string;
  description: string;
  sections: {
    titre: string;
    champs: {
      label: string;
      type: "text" | "textarea" | "table" | "checklist";
      placeholder?: string;
      options?: string[];
      colonnes?: string[];
      lignes?: number;
    }[];
  }[];
}

export const PHASE_TEMPLATES: PhaseTemplate[] = [
  {
    phase: 1, label: "01", nom: "Detecter",
    description: "Identifier les taches candidates a l'automatisation dans votre quotidien",
    sections: [
      { titre: "Contexte", champs: [
        { label: "Metier / Poste", type: "text", placeholder: "Ex : Chef de projet IT" },
        { label: "Organisation", type: "text", placeholder: "Nom de l'equipe ou service" },
        { label: "Date", type: "text", placeholder: "JJ/MM/AAAA" },
      ]},
      { titre: "Inventaire des taches repetitives", champs: [
        { label: "Liste de vos taches candidates", type: "table",
          colonnes: ["Tache", "Frequence", "Temps (h/sem)", "Score /5"], lignes: 8 },
      ]},
      { titre: "Selection prioritaire", champs: [
        { label: "Top 3 taches retenues pour la suite", type: "textarea", placeholder: "1.\n2.\n3." },
        { label: "Justification du choix", type: "textarea", placeholder: "Pourquoi ces taches en priorite ?" },
      ]}
    ]
  },
  {
    phase: 2, label: "02", nom: "Evaluer",
    description: "Mesurer le potentiel reel de chaque tache retenue",
    sections: [
      { titre: "Contexte", champs: [
        { label: "Tache evaluee", type: "text" },
        { label: "Evaluateur", type: "text" },
        { label: "Date", type: "text" },
      ]},
      { titre: "Grille DECLIC", champs: [
        { label: "Criteres d'evaluation", type: "table",
          colonnes: ["Critere", "Question cle", "Score (0/1)", "Commentaire"], lignes: 5 },
      ]},
      { titre: "Estimation ROI", champs: [
        { label: "Temps actuel (h/semaine)", type: "text" },
        { label: "Taux d'automatisation estime (%)", type: "text" },
        { label: "Temps recupere estime (h/semaine)", type: "text" },
        { label: "Decision", type: "textarea", placeholder: "Go / No-Go / A retravailler" },
      ]}
    ]
  },
  {
    phase: 3, label: "03", nom: "Concevoir",
    description: "Construire le workflow pas a pas avant de toucher a un outil",
    sections: [
      { titre: "Contexte", champs: [
        { label: "Tache", type: "text" }, { label: "Outil cible", type: "text" }, { label: "Date", type: "text" }
      ]},
      { titre: "Croquis du workflow", champs: [
        { label: "Declencheur (Trigger)", type: "textarea", placeholder: "Qu'est-ce qui demarre le processus ?" },
        { label: "Entrees (Inputs)", type: "textarea", placeholder: "Quelles donnees arrivent ?" },
        { label: "Regles (Si... alors...)", type: "textarea", placeholder: "Listez les regles de gestion" },
        { label: "Sorties (Outputs)", type: "textarea", placeholder: "Quel resultat est produit ?" },
        { label: "Exceptions", type: "textarea", placeholder: "Cas limites identifies" },
      ]},
      { titre: "Checklist pre-developpement", champs: [
        { label: "Points a valider", type: "checklist", options: [
          "Score DECLIC >= 3/5",
          "Croquis valide par un pair",
          "Cas d'exception documentes",
          "On a essaye sans IA d'abord",
          "Les donnees d'entree sont disponibles et stables",
        ]}
      ]}
    ]
  },
  {
    phase: 4, label: "04", nom: "Lancer",
    description: "Tester et deployer sereinement",
    sections: [
      { titre: "Plan de test", champs: [
        { label: "Resultats des 10 tests de validation", type: "table",
          colonnes: ["Test #", "Cas teste", "Resultat attendu", "Resultat obtenu", "Statut"], lignes: 10 },
      ]},
      { titre: "Plan de deploiement", champs: [
        { label: "Perimetre de deploiement initial", type: "textarea" },
        { label: "Plan de communication equipe", type: "textarea" },
        { label: "Responsable du suivi", type: "text" },
        { label: "Date de mise en production", type: "text" },
      ]}
    ]
  },
  {
    phase: 5, label: "05", nom: "Iterer",
    description: "Ajuster apres les premiers retours terrain",
    sections: [
      { titre: "Retours a J+30", champs: [
        { label: "Taux d'adoption reel (%)", type: "text" },
        { label: "Problemes remontes", type: "textarea" },
        { label: "Ajustements realises", type: "textarea" },
        { label: "Gain mesure (h/semaine)", type: "text" },
      ]},
      { titre: "Decision", champs: [
        { label: "Continuer / Pivoter / Arreter ?", type: "textarea" },
      ]}
    ]
  },
  {
    phase: 6, label: "06", nom: "Consolider",
    description: "Ancrer les gains durablement dans l'organisation",
    sections: [
      { titre: "Bilan final", champs: [
        { label: "Gain total mesure (h/semaine)", type: "text" },
        { label: "ROI estime (EUR/an)", type: "text" },
        { label: "Lecons apprises", type: "textarea" },
      ]},
      { titre: "Plan de perennisation", champs: [
        { label: "Documentation produite", type: "checklist", options: [
          "Procedure d'utilisation redigee",
          "Responsable nomme",
          "Revue trimestrielle planifiee",
          "Integration au onboarding equipe",
        ]},
        { label: "Prochaine tache a automatiser", type: "text" },
      ]}
    ]
  },
];
