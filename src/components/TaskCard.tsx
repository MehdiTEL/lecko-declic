import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Clock, Brain, Zap, ArrowRight, Info } from "lucide-react";
import { AnalysisTask, TaskCategory, ToolType, computeScoreCriteres, getScoreBadgeClass } from "@/types/analysis";
import { useChatContext } from "@/context/ChatContext";

const categoryConfig: Record<TaskCategory, { label: string; bgClass: string; textClass: string }> = {
  automatisable: {
    label: "Automatisable",
    bgClass: "bg-badge-auto-bg",
    textClass: "text-badge-auto-text",
  },
  partiellement_automatisable: {
    label: "Partiellement",
    bgClass: "bg-badge-partial-bg",
    textClass: "text-badge-partial-text",
  },
  difficilement_automatisable: {
    label: "Difficile",
    bgClass: "bg-badge-hard-bg",
    textClass: "text-badge-hard-text",
  },
};

const toolConfig: Record<ToolType, { badgeClass: string }> = {
  "Agent IA": { badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  "Workflow N8N": { badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  "Automatisation No-Code": { badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  "Copilot / Assistant IA": { badgeClass: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  "Script personnalisé": { badgeClass: "bg-muted text-foreground-secondary" },
};

const CRITERE_LABELS: Record<string, string> = {
  recurrence: "Récurrence",
  energie: "Énergie",
  scalabilite: "Scalab.",
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
  const hasCriteres = !!task.criteres;

  // Score badge style — soft, professional
  const scoreBgStyle =
    score >= 3
      ? { backgroundColor: "hsl(138 76% 97%)", color: "hsl(160 72% 30%)" }
      : score === 2
      ? { backgroundColor: "hsl(48 100% 96%)", color: "hsl(32 95% 35%)" }
      : { backgroundColor: "hsl(210 40% 96%)", color: "hsl(215 16% 47%)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="lecko-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-3 p-5 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-base font-semibold text-foreground leading-tight">{task.nom}</span>
            {hasCriteres && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={scoreBgStyle}
              >
                {score}/5
              </span>
            )}
          </div>

          {/* Criteria dots — visible in header */}
          {hasCriteres && task.criteres && (
            <div className="flex items-center gap-1.5 mt-1">
              {Object.entries(task.criteres).map(([key, val]) => (
                <div
                  key={key}
                  title={CRITERE_LABELS[key]}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: val
                      ? "hsl(var(--lecko-blue))"
                      : "hsl(var(--border))",
                  }}
                />
              ))}
              <span className="text-xs text-foreground-muted ml-1 hidden sm:block">
                {Object.entries(task.criteres)
                  .filter(([, v]) => v)
                  .map(([k]) => CRITERE_LABELS[k])
                  .join(" · ")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.bgClass} ${cat.textClass}`}>
            {cat.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-foreground-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
              <p className="text-sm text-foreground-secondary leading-relaxed">{task.description}</p>

              {/* AI / No-AI badges */}
              <div className="flex flex-wrap gap-2">
                {task.peut_fonctionner_sans_ia === true && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "hsl(138 76% 97%)", color: "hsl(160 72% 30%)" }}>
                    <Zap size={11} />
                    Sans IA
                  </span>
                )}
                {task.peut_fonctionner_sans_ia === false && (
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowRaisonIa(!showRaisonIa); }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                      style={{ backgroundColor: "hsl(271 91% 97%)", color: "hsl(271 55% 45%)" }}
                    >
                      <Brain size={11} />
                      IA recommandée
                      <Info size={10} />
                    </button>
                    {showRaisonIa && task.raison_ia && (
                      <div className="absolute top-full left-0 mt-2 z-10 w-64 bg-card border border-border rounded-xl shadow-elevated p-3 text-xs text-foreground-secondary animate-fade-in">
                        {task.raison_ia}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool badge */}
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badgeClass}`}>
                  {task.type_outil}
                </span>
              </div>

              {/* Solution */}
              <div>
                <p className="label-uppercase mb-1.5 text-[11px]">Solution recommandée</p>
                <p className="text-sm text-foreground-secondary leading-relaxed">{task.solution}</p>
              </div>

              {/* Metrics row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(214 100% 97%)", color: "hsl(221 83% 40%)" }}>
                  <Clock size={11} />
                  ~{task.temps_gagne_heures_semaine}h / semaine
                </span>

                {roiPerWeek !== undefined && roiPerWeek > 0 && (
                  <span className="text-sm font-semibold text-lecko-blue">
                    ~{Math.round(roiPerWeek).toLocaleString("fr-FR")}&nbsp;€/sem.
                  </span>
                )}
              </div>

              {/* Coach CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openChat({ task, metier: metier ?? "" });
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-lecko-blue hover:underline transition-colors mt-1"
              >
                Se faire accompagner
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
