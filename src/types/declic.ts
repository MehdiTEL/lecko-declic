// DÉCLIC Methodology constants — V2 with full acronym (D-É-C-L-I-C)

export type DeclicPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface PhaseConfig {
  id: DeclicPhase;
  letter: string;
  icon: string;
  label: string;
  shortLabel: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  question: string;
  description: string;
}

export const DECLIC_PHASES: PhaseConfig[] = [
  {
    id: 0,
    letter: "",
    icon: "ShieldCheck",
    label: "Prérequis",
    shortLabel: "Prérequis",
    color: "#6B7280",
    bgClass: "bg-[hsl(220,9%,46%)]",
    borderClass: "border-[hsl(220,9%,46%)]",
    textClass: "text-[hsl(220,9%,46%)]",
    question: "Est-ce que c'est clair ?",
    description: "Clarifier avant d'automatiser. Un process flou donnera une automatisation chaotique.",
  },
  {
    id: 1,
    letter: "D",
    icon: "Search",
    label: "Détecter",
    shortLabel: "Détecter",
    color: "#F59E0B",
    bgClass: "bg-brand-orange",
    borderClass: "border-brand-orange",
    textClass: "text-brand-orange",
    question: "Qu'est-ce qui me freine ?",
    description: "Identifier les tâches répétitives qui freinent la productivité.",
  },
  {
    id: 2,
    letter: "É",
    icon: "BarChart3",
    label: "Évaluer",
    shortLabel: "Évaluer",
    color: "#2563EB",
    bgClass: "bg-brand-blue",
    borderClass: "border-brand-blue",
    textClass: "text-brand-blue",
    question: "Ça vaut le coup ?",
    description: "Scorer chaque tâche sur les critères DÉCLIC pour prioriser les automatisations.",
  },
  {
    id: 3,
    letter: "C",
    icon: "Wrench",
    label: "Concevoir",
    shortLabel: "Concevoir",
    color: "#7C3AED",
    bgClass: "bg-violet-600",
    borderClass: "border-violet-600",
    textClass: "text-violet-600 dark:text-violet-400",
    question: "Comment on fait concrètement ?",
    description: "Dessiner le workflow (déclencheur, entrées, règles, sorties, exceptions) avant de le construire.",
  },
  {
    id: 4,
    letter: "L",
    icon: "Play",
    label: "Lancer",
    shortLabel: "Lancer",
    color: "#10B981",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
    textClass: "text-emerald-500 dark:text-emerald-400",
    question: "On teste et on déploie",
    description: "Crash-test sur 10 cas réels, filet de sécurité, déploiement progressif.",
  },
  {
    id: 5,
    letter: "I",
    icon: "RefreshCw",
    label: "Itérer",
    shortLabel: "Itérer",
    color: "#0EA5E9",
    bgClass: "bg-sky-500",
    borderClass: "border-sky-500",
    textClass: "text-sky-500 dark:text-sky-400",
    question: "On ajuste et on améliore",
    description: "Observer les premiers résultats, collecter les retours, ajuster les règles et les prompts. L'automatisation parfaite du premier coup n'existe pas.",
  },
  {
    id: 6,
    letter: "C",
    icon: "Award",
    label: "Consolider",
    shortLabel: "Consolider",
    color: "#D97706",
    bgClass: "bg-amber-600",
    borderClass: "border-amber-600",
    textClass: "text-amber-600 dark:text-amber-400",
    question: "On ancre les gains",
    description: "Mesurer l'impact réel, documenter, former les collègues, et lancer le cycle suivant.",
  },
];
