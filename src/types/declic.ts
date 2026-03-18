// DÉCLIC Methodology constants

export type DeclicPhase = 0 | 1 | 2 | 3 | 4 | 5;

export interface PhaseConfig {
  id: DeclicPhase;
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
    icon: "🛡️",
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
    icon: "🔍",
    label: "Détecter",
    shortLabel: "Détecter",
    color: "#F59E0B",
    bgClass: "bg-lecko-orange",
    borderClass: "border-lecko-orange",
    textClass: "text-lecko-orange",
    question: "Qu'est-ce qui me freine ?",
    description: "Identifier les tâches répétitives qui freinent la productivité.",
  },
  {
    id: 2,
    icon: "⚖️",
    label: "Évaluer",
    shortLabel: "Évaluer",
    color: "#2563EB",
    bgClass: "bg-lecko-blue",
    borderClass: "border-lecko-blue",
    textClass: "text-lecko-blue",
    question: "Ça vaut le coup ?",
    description: "Scorer chaque tâche sur 5 critères pour prioriser les automatisations.",
  },
  {
    id: 3,
    icon: "🔧",
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
    icon: "🚀",
    label: "Lancer",
    shortLabel: "Lancer",
    color: "#10B981",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
    textClass: "text-emerald-500 dark:text-emerald-400",
    question: "On teste et on ajuste",
    description: "Crash-test sur 10 cas réels, filet de sécurité, déploiement progressif.",
  },
  {
    id: 5,
    icon: "🏆",
    label: "Consolider",
    shortLabel: "Consolider",
    color: "#D97706",
    bgClass: "bg-amber-600",
    borderClass: "border-amber-600",
    textClass: "text-amber-600 dark:text-amber-400",
    question: "On ancre les gains",
    description: "Mesurer l'impact, documenter, et lancer le cycle suivant.",
  },
];
