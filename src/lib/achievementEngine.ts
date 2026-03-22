import { ProgressState } from "@/types/gamification";
import { BadgeDefinition, BadgeExtraContext, EarnedBadge, ActiveChallenge, ChallengeDefinition } from "@/types/badges";
import { BADGE_CATALOG } from "@/data/badgeCatalog";
import { CHALLENGE_CATALOG } from "@/data/challengeCatalog";
import { getHistory } from "@/lib/history";

const BADGES_KEY = "declic-badges";
const CHALLENGES_KEY = "declic-challenges";
const ACTIONS_KEY = "declic-user-actions";

export interface UserActions {
  hasUsedCopilot: boolean;
  hasSharedDiagnostic: boolean;
  hasExportedPDF: boolean;
}

export function loadUserActions(): UserActions {
  try {
    const raw = localStorage.getItem(ACTIONS_KEY);
    return raw ? JSON.parse(raw) : { hasUsedCopilot: false, hasSharedDiagnostic: false, hasExportedPDF: false };
  } catch { return { hasUsedCopilot: false, hasSharedDiagnostic: false, hasExportedPDF: false }; }
}

export function recordAction(action: keyof UserActions): void {
  const current = loadUserActions();
  current[action] = true;
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(current));
}

function buildExtraContext(state: ProgressState): BadgeExtraContext {
  const history = getHistory();
  const actions = loadUserActions();
  const distinctMetiers = new Set(state.trackedTasks.map(t => t.metier)).size;
  return { totalAnalyses: history.length, hasUsedCopilot: actions.hasUsedCopilot, hasSharedDiagnostic: actions.hasSharedDiagnostic, hasExportedPDF: actions.hasExportedPDF, distinctMetiers };
}

// ── BADGES ──────────────────────────────────────────────────

export function loadEarnedBadges(): EarnedBadge[] {
  try { const raw = localStorage.getItem(BADGES_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveEarnedBadges(badges: EarnedBadge[]): void {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

export function evaluateBadges(state: ProgressState): { allEarned: EarnedBadge[]; newlyEarned: BadgeDefinition[] } {
  const earned = loadEarnedBadges();
  const earnedIds = new Set(earned.map(b => b.badgeId));
  const extra = buildExtraContext(state);
  const newlyEarned: BadgeDefinition[] = [];
  for (const badge of BADGE_CATALOG) {
    if (earnedIds.has(badge.id)) continue;
    try { if (badge.condition(state, extra)) { newlyEarned.push(badge); earned.push({ badgeId: badge.id, earnedAt: new Date().toISOString() }); } } catch { /* skip */ }
  }
  if (newlyEarned.length > 0) saveEarnedBadges(earned);
  return { allEarned: earned, newlyEarned };
}

export function getBadgeShelf(): Array<BadgeDefinition & { earned: boolean; earnedAt?: string }> {
  const earned = loadEarnedBadges();
  const earnedMap = new Map(earned.map(b => [b.badgeId, b.earnedAt]));
  return BADGE_CATALOG.map(badge => ({ ...badge, earned: earnedMap.has(badge.id), earnedAt: earnedMap.get(badge.id) }));
}

// ── CHALLENGES ──────────────────────────────────────────────

export function loadActiveChallenges(): ActiveChallenge[] {
  try { const raw = localStorage.getItem(CHALLENGES_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveActiveChallenges(challenges: ActiveChallenge[]): void {
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

export function refreshChallenges(state: ProgressState): ActiveChallenge[] {
  const existing = loadActiveChallenges();
  const extra = buildExtraContext(state);
  const now = new Date();

  const active = existing.filter(c => c.status === "completed" || new Date(c.expiresAt) > now);

  for (const challenge of active) {
    if (challenge.status !== "active") continue;
    const def = CHALLENGE_CATALOG.find(c => c.id === challenge.challengeId);
    if (!def) continue;
    try {
      challenge.currentProgress = def.condition(state, extra);
      if (challenge.currentProgress >= def.targetCount) {
        challenge.status = "completed";
        challenge.completedAt = now.toISOString();
      }
    } catch { /* skip */ }
  }

  const activeCount = active.filter(c => c.status === "active").length;
  const activeIds = new Set(active.map(c => c.challengeId));

  if (activeCount < 3) {
    const candidates = CHALLENGE_CATALOG.filter(c => {
      if (activeIds.has(c.id)) return false;
      const earned = active.find(a => a.challengeId === c.id && a.status === "completed");
      if (earned?.completedAt) {
        const days = (now.getTime() - new Date(earned.completedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (days < 7) return false;
      }
      return true;
    });

    const faciles = candidates.filter(c => c.difficulty === "facile");
    const moyens = candidates.filter(c => c.difficulty === "moyen");
    const ambitieux = candidates.filter(c => c.difficulty === "ambitieux");
    const toAdd: ChallengeDefinition[] = [];
    const needed = 3 - activeCount;

    if (faciles.length > 0 && toAdd.length < needed) toAdd.push(faciles[Math.floor(Math.random() * faciles.length)]);
    if (moyens.length > 0 && toAdd.length < needed) toAdd.push(moyens[Math.floor(Math.random() * moyens.length)]);
    if (ambitieux.length > 0 && toAdd.length < needed) toAdd.push(ambitieux[Math.floor(Math.random() * ambitieux.length)]);

    const remaining = candidates.filter(c => !toAdd.includes(c));
    while (toAdd.length < needed && remaining.length > 0) {
      toAdd.push(remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0]);
    }

    for (const def of toAdd) {
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + def.durationDays);
      active.push({ challengeId: def.id, startedAt: now.toISOString(), expiresAt: expiresAt.toISOString(), status: "active", currentProgress: 0 });
    }
  }

  saveActiveChallenges(active);
  return active;
}

export function resetAchievements(): void {
  localStorage.removeItem(BADGES_KEY);
  localStorage.removeItem(CHALLENGES_KEY);
  localStorage.removeItem(ACTIONS_KEY);
}
