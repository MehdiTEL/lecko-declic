import { ProgressState } from "./gamification";

// ═══════════════════════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════════════════════

export type BadgeCategory = "progression" | "competence" | "engagement" | "methode";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string;
  color: string;
  condition: (state: ProgressState, extra: BadgeExtraContext) => boolean;
}

export interface BadgeExtraContext {
  totalAnalyses: number;
  hasUsedCopilot: boolean;
  hasSharedDiagnostic: boolean;
  hasExportedPDF: boolean;
  distinctMetiers: number;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export const BADGE_RARITY_CONFIG: Record<BadgeRarity, {
  label: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
}> = {
  common: {
    label: "Commun",
    borderColor: "#9CA3AF",
    glowColor: "transparent",
    bgGradient: "from-gray-50 to-gray-100",
  },
  rare: {
    label: "Rare",
    borderColor: "#2563EB",
    glowColor: "hsl(221 83% 53% / 0.15)",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  epic: {
    label: "Épique",
    borderColor: "#7C3AED",
    glowColor: "hsl(271 91% 55% / 0.15)",
    bgGradient: "from-violet-50 to-purple-50",
  },
  legendary: {
    label: "Légendaire",
    borderColor: "#F59E0B",
    glowColor: "hsl(38 92% 50% / 0.2)",
    bgGradient: "from-amber-50 to-orange-50",
  },
};

// ═══════════════════════════════════════════════════════════
// CHALLENGES
// ═══════════════════════════════════════════════════════════

export type ChallengeStatus = "active" | "completed" | "expired";
export type ChallengeDifficulty = "facile" | "moyen" | "ambitieux";

export interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  icon: string;
  color: string;
  targetCount: number;
  unit: string;
  durationDays: number;
  rewardBadgeId?: string;
  condition: (state: ProgressState, extra: BadgeExtraContext) => number;
}

export interface ActiveChallenge {
  challengeId: string;
  startedAt: string;
  expiresAt: string;
  status: ChallengeStatus;
  completedAt?: string;
  currentProgress: number;
}

export const CHALLENGE_DIFFICULTY_CONFIG: Record<ChallengeDifficulty, {
  label: string;
  color: string;
  bgLight: string;
}> = {
  facile: { label: "Facile", color: "#10B981", bgLight: "hsl(152 76% 94%)" },
  moyen: { label: "Moyen", color: "#2563EB", bgLight: "hsl(221 100% 96%)" },
  ambitieux: { label: "Ambitieux", color: "#F59E0B", bgLight: "hsl(48 100% 96%)" },
};
