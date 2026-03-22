import { AnalysisTask, AccompagnementLevel } from "@/types/analysis";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionStep {
  id: string;
  phase: "quick_win" | "short_term" | "medium_term" | "long_term";
  phaseLabel: string;
  timing: string;
  tasks: AnalysisTask[];
  totalHoursGained: number;
  cumulativeHoursGained: number;
  accompagnement: AccompagnementLevel;
  status: "actionable" | "planned";
}

export interface ActionPlan {
  steps: ActionStep[];
  totalTasks: number;
  totalHoursGained: number;
  estimatedCompletionWeeks: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sumHours(tasks: AnalysisTask[]): number {
  return tasks.reduce((sum, t) => sum + (t.temps_gagne_heures_semaine ?? 0), 0);
}

function estimateWeeks(plan: { steps: ActionStep[] }): number {
  if (plan.steps.length === 0) return 0;
  const lastPhase = plan.steps[plan.steps.length - 1].phase;
  switch (lastPhase) {
    case "quick_win":
      return 1;
    case "short_term":
      return 4;
    case "medium_term":
      return 12;
    case "long_term":
      return 16;
    default:
      return 12;
  }
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateActionPlan(tasks: AnalysisTask[]): ActionPlan {
  if (!tasks || tasks.length === 0) {
    return { steps: [], totalTasks: 0, totalHoursGained: 0, estimatedCompletionWeeks: 0 };
  }

  const assigned = new Set<string>();
  const taskKey = (t: AnalysisTask) => `${t.nom}::${t.description}`;

  // ── Phase 1: Quick Wins (Semaine 1) ───────────────────────────────────────
  // Tasks with niveau_accompagnement==="express" OR
  // (peut_fonctionner_sans_ia===true AND score_criteres>=3)
  const quickWinCandidates = tasks.filter((t) => {
    if (t.niveau_accompagnement === "express") return true;
    if (t.peut_fonctionner_sans_ia === true && (t.score_criteres ?? 0) >= 3) return true;
    return false;
  });
  // Sort by temps_gagne descending, limit to 4
  quickWinCandidates.sort(
    (a, b) => (b.temps_gagne_heures_semaine ?? 0) - (a.temps_gagne_heures_semaine ?? 0)
  );
  const quickWinTasks = quickWinCandidates.slice(0, 4);
  quickWinTasks.forEach((t) => assigned.add(taskKey(t)));

  // ── Phase 2: Short Term (Semaine 2-4) ─────────────────────────────────────
  // Tasks with niveau_accompagnement==="guide" OR
  // (categorie==="automatisable" not already assigned)
  const shortTermTasks = tasks.filter((t) => {
    if (assigned.has(taskKey(t))) return false;
    if (t.niveau_accompagnement === "guide") return true;
    if (t.categorie === "automatisable") return true;
    return false;
  });
  shortTermTasks.sort((a, b) => (b.score_criteres ?? 0) - (a.score_criteres ?? 0));
  shortTermTasks.forEach((t) => assigned.add(taskKey(t)));

  // ── Phase 3: Medium Term (Mois 2-3) ──────────────────────────────────────
  // Tasks with niveau_accompagnement==="consultant" OR
  // remaining partiellement_automatisable
  const mediumTermTasks = tasks.filter((t) => {
    if (assigned.has(taskKey(t))) return false;
    if (t.niveau_accompagnement === "consultant") return true;
    if (t.categorie === "partiellement_automatisable") return true;
    return false;
  });
  mediumTermTasks.sort(
    (a, b) => (b.temps_gagne_heures_semaine ?? 0) - (a.temps_gagne_heures_semaine ?? 0)
  );
  mediumTermTasks.forEach((t) => assigned.add(taskKey(t)));

  // ── Phase 4: Long Term (Mois 3+) ─────────────────────────────────────────
  // Remaining "difficilement_automatisable" (reflection items)
  const longTermTasks = tasks.filter((t) => {
    if (assigned.has(taskKey(t))) return false;
    return t.categorie === "difficilement_automatisable";
  });
  longTermTasks.forEach((t) => assigned.add(taskKey(t)));

  // ── Build steps (skip empty phases) ───────────────────────────────────────

  const phaseDefinitions: {
    phase: ActionStep["phase"];
    phaseLabel: string;
    timing: string;
    tasks: AnalysisTask[];
    accompagnement: AccompagnementLevel;
    status: ActionStep["status"];
  }[] = [
    {
      phase: "quick_win",
      phaseLabel: "Quick Wins",
      timing: "Semaine 1",
      tasks: quickWinTasks,
      accompagnement: "express",
      status: "actionable",
    },
    {
      phase: "short_term",
      phaseLabel: "Court terme",
      timing: "Semaine 2-4",
      tasks: shortTermTasks,
      accompagnement: "guide",
      status: "actionable",
    },
    {
      phase: "medium_term",
      phaseLabel: "Moyen terme",
      timing: "Mois 2-3",
      tasks: mediumTermTasks,
      accompagnement: "consultant",
      status: "planned",
    },
    {
      phase: "long_term",
      phaseLabel: "Long terme",
      timing: "Mois 3+",
      tasks: longTermTasks,
      accompagnement: "consultant",
      status: "planned",
    },
  ];

  let cumulativeHours = 0;
  const steps: ActionStep[] = [];

  for (const def of phaseDefinitions) {
    if (def.tasks.length === 0) continue;
    const totalHoursGained = sumHours(def.tasks);
    cumulativeHours += totalHoursGained;
    steps.push({
      id: def.phase,
      phase: def.phase,
      phaseLabel: def.phaseLabel,
      timing: def.timing,
      tasks: def.tasks,
      totalHoursGained,
      cumulativeHoursGained: cumulativeHours,
      accompagnement: def.accompagnement,
      status: def.status,
    });
  }

  const totalTasks = steps.reduce((sum, s) => sum + s.tasks.length, 0);
  const totalHoursGained = cumulativeHours;
  const estimatedCompletionWeeks = estimateWeeks({ steps });

  return { steps, totalTasks, totalHoursGained, estimatedCompletionWeeks };
}
