import { BadgeDefinition } from "@/types/badges";

export const BADGE_CATALOG: BadgeDefinition[] = [
  // PROGRESSION (4)
  { id: "first_analysis", name: "Premier Diagnostic", description: "Lancer votre premier diagnostic métier.", category: "progression", rarity: "common", icon: "Search", color: "#F59E0B", condition: (state) => state.trackedTasks.length > 0 },
  { id: "first_done", name: "Première Victoire", description: "Marquer une tâche comme automatisée.", category: "progression", rarity: "common", icon: "CheckCircle", color: "#10B981", condition: (state) => state.totalTasksCompleted >= 1 },
  { id: "five_done", name: "Main Sûre", description: "Automatiser 5 tâches au total.", category: "progression", rarity: "rare", icon: "Target", color: "#2563EB", condition: (state) => state.totalTasksCompleted >= 5 },
  { id: "fifteen_done", name: "Machine de Guerre", description: "Automatiser 15 tâches au total.", category: "progression", rarity: "epic", icon: "Flame", color: "#7C3AED", condition: (state) => state.totalTasksCompleted >= 15 },
  // COMPETENCE (4)
  { id: "quick_win_master", name: "Quick Win Master", description: "Automatiser 3 tâches en une semaine.", category: "competence", rarity: "rare", icon: "Zap", color: "#10B981", condition: (state) => { const w = new Date(); w.setDate(w.getDate() - 7); return state.trackedTasks.filter(t => t.status === "done" && t.completedAt && new Date(t.completedAt) >= w).length >= 3; } },
  { id: "multi_metier", name: "Polyvalent", description: "Analyser 3 métiers différents.", category: "competence", rarity: "rare", icon: "Layers", color: "#2563EB", condition: (_s, extra) => extra.distinctMetiers >= 3 },
  { id: "copilot_user", name: "Pilote Assisté", description: "Utiliser le Copilot pour se faire guider.", category: "competence", rarity: "common", icon: "Sparkles", color: "#7C3AED", condition: (_s, extra) => extra.hasUsedCopilot },
  { id: "full_clear", name: "Sans-Faute", description: "Automatiser toutes les tâches d'un métier.", category: "competence", rarity: "legendary", icon: "Crown", color: "#F59E0B", condition: (state) => { const m = new Map<string, { total: number; done: number }>(); state.trackedTasks.forEach(t => { const c = m.get(t.analysisId) ?? { total: 0, done: 0 }; c.total++; if (t.status === "done") c.done++; m.set(t.analysisId, c); }); return Array.from(m.values()).some(a => a.total >= 5 && a.done === a.total); } },
  // ENGAGEMENT (4)
  { id: "streak_3", name: "Régulier", description: "Maintenir un streak de 3 jours.", category: "engagement", rarity: "common", icon: "Flame", color: "#F59E0B", condition: (state) => state.streak.longestStreak >= 3 },
  { id: "streak_7", name: "Discipliné", description: "Maintenir un streak de 7 jours.", category: "engagement", rarity: "rare", icon: "Flame", color: "#EF4444", condition: (state) => state.streak.longestStreak >= 7 },
  { id: "streak_30", name: "Infatigable", description: "Maintenir un streak de 30 jours.", category: "engagement", rarity: "legendary", icon: "Flame", color: "#F59E0B", condition: (state) => state.streak.longestStreak >= 30 },
  { id: "shared_diagnostic", name: "Ambassadeur", description: "Partager un diagnostic avec un collègue.", category: "engagement", rarity: "rare", icon: "Share2", color: "#2563EB", condition: (_s, extra) => extra.hasSharedDiagnostic },
  // METHODE (4)
  { id: "phase_detecter", name: "Détecteur", description: "Phase 1 DÉCLIC : lancer un diagnostic complet.", category: "methode", rarity: "common", icon: "Search", color: "#F59E0B", condition: (_s, extra) => extra.totalAnalyses >= 1 },
  { id: "phase_evaluer", name: "Évaluateur", description: "Phase 2 DÉCLIC : avoir priorisé ses tâches.", category: "methode", rarity: "common", icon: "BarChart3", color: "#2563EB", condition: (state) => state.trackedTasks.some(t => t.status === "in_progress" || t.status === "done") },
  { id: "phase_concevoir", name: "Concepteur", description: "Phase 3 DÉCLIC : utiliser le Copilot pour concevoir.", category: "methode", rarity: "rare", icon: "Wrench", color: "#7C3AED", condition: (_s, extra) => extra.hasUsedCopilot && extra.totalAnalyses >= 1 },
  { id: "phase_lancer", name: "Lanceur", description: "Phase 4 DÉCLIC : automatiser au moins 3 tâches.", category: "methode", rarity: "epic", icon: "Rocket", color: "#10B981", condition: (state) => state.totalTasksCompleted >= 3 },
];
