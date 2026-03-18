import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Clock, Bot, Info } from "lucide-react";
import { AnalysisTask, TaskCategory, ToolType, computeScoreCriteres, getScoreBadgeClass } from "@/types/analysis";
import { useChatContext } from "@/context/ChatContext";

const categoryConfig: Record<TaskCategory, { label: string; dot: string; bgClass: string; textClass: string }> = {
  automatisable: {
    label: "Automatisable",
    dot: "🟢",
    bgClass: "bg-badge-auto-bg",
    textClass: "text-badge-auto-text",
  },
  partiellement_automatisable: {
    label: "Partiellement",
    dot: "🟡",
    bgClass: "bg-badge-partial-bg",
    textClass: "text-badge-partial-text",
  },
  difficilement_automatisable: {
    label: "Difficile",
    dot: "🔴",
    bgClass: "bg-badge-hard-bg",
    textClass: "text-badge-hard-text",
  },
};

const toolConfig: Record<ToolType, { icon: string; badgeClass: string }> = {
  "Agent IA": { icon: "🤖", badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  "Workflow N8N": { icon: "⚡", badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  "Automatisation No-Code": { icon: "🔧", badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  "Copilot / Assistant IA": { icon: "💬", badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
  "Script personnalisé": { icon: "📝", badgeClass: "bg-muted text-foreground-secondary" },
};

const CRITERE_ICONS: Record<string, string> = {
  recurrence: "🔁",
  energie: "⚡",
  scalabilite: "📈",
  fiabilite: "⚠️",
  penibilite: "😤",
};
const CRITERE_LABELS: Record<string, string> = {
  recurrence: "Récurrence",
  energie: "Énergie",
  scalabilite: "Scalabilité",
  fiabilite: "Fiabilité",
  penibilite: "Pénibilité",
};

interface TaskCardProps {
  task: AnalysisTask;
  index: number;
  roiPerWeek?: number;
  metier?: string;
}

export default function TaskCard({ task, index, roiPerWeek, metier }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showRaisonIa, setShowRaisonIa] = useState(false);
  const { openChat } = useChatContext();
  const cat = categoryConfig[task.categorie];
  const tool = toolConfig[task.type_outil];
  const score = task.score_criteres ?? computeScoreCriteres(task.criteres);
  const scoreBadge = getScoreBadgeClass(score);
  const hasCriteres = !!task.criteres;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="lecko-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-3 p-4 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-foreground">{task.nom}</span>
            {/* Score badge */}
            {hasCriteres && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBadge}`}>
                {score}/5
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted line-clamp-1">{task.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.bgClass} ${cat.textClass}`}>
            {cat.dot} {cat.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-foreground-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
              <p className="text-sm text-foreground-secondary">{task.description}</p>

              {/* Criteria dots (DÉCLIC) */}
              {hasCriteres && task.criteres && (
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(task.criteres).map(([key, val]) => (
                    <div key={key} title={CRITERE_LABELS[key]}
                      className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        val
                          ? "bg-lecko-blue/10 text-lecko-blue"
                          : "bg-muted text-foreground-muted"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${val ? "bg-lecko-blue" : "bg-foreground-muted"}`} />
                      {CRITERE_ICONS[key]} {CRITERE_LABELS[key]}
                    </div>
                  ))}
                </div>
              )}

              {/* AI badge */}
              <div className="flex flex-wrap gap-2 items-center">
                {task.peut_fonctionner_sans_ia === true && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    ⚡ Faisable sans IA
                  </span>
                )}
                {task.peut_fonctionner_sans_ia === false && (
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowRaisonIa(!showRaisonIa); }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                    >
                      🤖 IA nécessaire
                      <Info size={11} />
                    </button>
                    {showRaisonIa && task.raison_ia && (
                      <div className="absolute top-full left-0 mt-1 z-10 w-64 bg-card border border-border rounded-xl shadow-xl p-3 text-xs text-foreground-secondary animate-fade-in">
                        {task.raison_ia}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Solution */}
              <div className="flex gap-2 bg-lecko-blue/5 border border-lecko-blue/20 rounded-lg p-3">
                <span className="text-base shrink-0">💡</span>
                <p className="text-sm text-foreground-secondary">{task.solution}</p>
              </div>

              {/* Footer row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badgeClass}`}>
                  {tool.icon} {task.type_outil}
                </span>
                <div className="flex items-center gap-3">
                  {roiPerWeek !== undefined && roiPerWeek > 0 && (
                    <span className="text-sm font-bold text-lecko-blue">
                      💶 ~{Math.round(roiPerWeek).toLocaleString("fr-FR")}&nbsp;€/sem.
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm font-bold text-lecko-blue">
                    <Clock size={13} />⏱ ~{task.temps_gagne_heures_semaine}h / semaine
                  </span>
                </div>
              </div>

              {/* Coach CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openChat({ task, metier: metier ?? "" });
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground rounded-lg py-2 transition-colors mt-1"
              >
                <Bot size={13} />
                Me guider pour automatiser ça
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
