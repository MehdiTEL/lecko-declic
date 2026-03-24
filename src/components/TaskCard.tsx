import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ChevronDown, Clock, Brain, Zap, ArrowRight, Info, Sparkles, Users, Wrench } from "lucide-react";
import { AnalysisTask, TaskCategory, ToolType, computeScoreCriteres, getScoreBadgeClass, ACCOMPAGNEMENT_CONFIG, COMPLEXITE_CONFIG, ECOSYSTEM_LABELS, PERIMETRE_IMPACT_CONFIG, NIVEAU_CHANGEMENT_CONFIG, RISQUE_ADOPTION_CONFIG } from "@/types/analysis";
import ConsultantContactForm from "@/components/ConsultantContactForm";
import WorkflowPreview from "@/components/WorkflowPreview";
import WorkflowGenerator from "@/components/WorkflowGenerator";
import type { AccompagnementLevel, ComplexiteMiseEnPlace, ToolEcosystem } from "@/types/analysis";
import type { TaskStatus } from "@/types/gamification";
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

/** Mini sparkline showing a projected ramp-up curve over 6 weeks */
function MiniSparkline({
  values,
  color,
  width = 80,
  height = 24,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = width;
  const lastY = height - (values[values.length - 1] / max) * (height - 2) - 1;

  return (
    <div className="inline-flex flex-col items-start ml-2">
      <svg
        width={width}
        height={height}
        className="inline-block align-middle"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 200,
            animation: "draw-line 0.8s ease-out forwards",
          }}
        />
        <circle cx={lastX} cy={lastY} r="2" fill={color} />
      </svg>
      <span className="text-[10px] text-foreground-muted leading-none mt-0.5">
        Projection 6 sem.
      </span>
    </div>
  );
}

/** Status circle — cycles through todo → in_progress → done */
function StatusCircle({ status, onChange }: { status: TaskStatus; onChange: (s: TaskStatus) => void }) {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: "in_progress",
    in_progress: "done",
    done: "todo",
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onChange(nextStatus[status]); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); onChange(nextStatus[status]); } }}
      whileTap={{ scale: 0.9 }}
      animate={status === "done" ? { scale: [0.9, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer"
      style={{
        borderColor: status === "done" ? "#10B981" : status === "in_progress" ? "#2563EB" : "hsl(var(--border))",
        backgroundColor: status === "done" ? "#10B981" : status === "in_progress" ? "rgba(37,99,235,0.12)" : "transparent",
      }}
      title={status === "todo" ? "Marquer en cours" : status === "in_progress" ? "Marquer comme fait" : "Remettre à faire"}
    >
      {status === "done" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {status === "in_progress" && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
      )}
    </motion.div>
  );
}

interface TaskCardProps {
  task: AnalysisTask;
  index: number;
  roiPerWeek?: number;
  metier?: string;
  analysisId?: string;
  trackedStatus?: TaskStatus;
  onStatusChange?: (taskName: string, status: TaskStatus) => void;
  isDemo?: boolean;
  viewMode?: "simple" | "technique";
}

export default function TaskCard({ task, index, roiPerWeek, metier, analysisId, trackedStatus, onStatusChange, isDemo, viewMode = "technique" }: TaskCardProps) {
  const isSimple = viewMode === "simple";
  const [expanded, setExpanded] = useState(false);
  const [showRaisonIa, setShowRaisonIa] = useState(false);

  // Generate sparkline projection data (ramp-up over 6 weeks)
  const sparklineValues = useMemo(() => {
    const t = task.temps_gagne_heures_semaine;
    return [0, t * 0.3, t * 0.5, t * 0.7, t * 0.9, t];
  }, [task.temps_gagne_heures_semaine]);

  const sparklineColor =
    task.categorie === "automatisable"
      ? "hsl(var(--primary))"
      : task.categorie === "partiellement_automatisable"
      ? "hsl(var(--accent))"
      : "hsl(var(--foreground-muted))";
  const { openChat } = useChatContext();
  const cat = categoryConfig[task.categorie];
  const tool = toolConfig[task.type_outil];
  const score = task.score_criteres ?? computeScoreCriteres(task.criteres);
  const hasCriteres = !!task.criteres;

  // Score badge style — soft, professional
  const scoreBgStyle =
    score >= 3
      ? { backgroundColor: "hsl(var(--accent-green-bg))", color: "hsl(var(--accent-green-text))" }
      : score === 2
      ? { backgroundColor: "hsl(var(--accent-amber-bg))", color: "hsl(var(--accent-amber-text))" }
      : { backgroundColor: "hsl(var(--muted))", color: "hsl(var(--foreground-muted))" };

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
        {/* Status checkbox */}
        {analysisId && onStatusChange && trackedStatus && (
          <StatusCircle
            status={trackedStatus}
            onChange={(s) => onStatusChange(task.nom, s)}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-base font-semibold leading-tight ${trackedStatus === "done" ? "line-through opacity-60 text-foreground-muted" : "text-foreground"}`}>{task.nom}</span>
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
          {/* Accompagnement badge */}
          {task.niveau_accompagnement && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].bgLight,
                color: ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].textColor,
              }}
            >
              {task.niveau_accompagnement === "express" ? "⚡" : task.niveau_accompagnement === "guide" ? "✨" : "👥"}{" "}
              {ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].label}
            </span>
          )}
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

              {/* Simple mode — friendly explanation */}
              {isSimple && (
                <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "hsl(var(--accent-blue-bg))" }}>
                  <p className="text-sm font-semibold" style={{ color: "hsl(var(--accent-blue-text))" }}>
                    {task.peut_fonctionner_sans_ia === true
                      ? "Cette tâche peut être automatisée sans intelligence artificielle."
                      : "Cette tâche bénéficie de l'intelligence artificielle pour être automatisée."}
                  </p>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    <strong>Ce qui change pour vous :</strong> {task.process_cible
                      ?? `Au lieu de faire cette tâche manuellement (~${task.temps_gagne_heures_semaine}h/semaine), un outil s'en charge automatiquement. Vous gardez le contrôle et validez quand nécessaire.`}
                  </p>
                  {task.exemple_resultat && (
                    <p className="text-sm text-foreground-secondary">
                      <strong>Résultat concret :</strong> {task.exemple_resultat}
                    </p>
                  )}
                  {task.niveau_accompagnement && (
                    <p className="text-xs text-foreground-muted mt-2">
                      {task.niveau_accompagnement === "express"
                        ? "Vous pouvez mettre ça en place vous-même en quelques heures."
                        : task.niveau_accompagnement === "guide"
                        ? "Le Consultant IA vous guide pas à pas pour la mise en place."
                        : "Un consultant Lecko vous accompagne pour cette mise en place."}
                    </p>
                  )}
                </div>
              )}

              {/* Technical mode — full details */}
              {!isSimple && (
                <>
                  {/* AI / No-AI badges */}
                  <div className="flex flex-wrap gap-2">
                    {task.peut_fonctionner_sans_ia === true && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "hsl(var(--accent-green-bg))", color: "hsl(var(--accent-green-text))" }}>
                        <Zap size={11} />
                        Sans IA
                      </span>
                    )}
                    {task.peut_fonctionner_sans_ia === false && (
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowRaisonIa(!showRaisonIa); }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                          style={{ backgroundColor: "hsl(var(--accent-violet-bg))", color: "hsl(var(--accent-violet-text))" }}
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
                </>
              )}

              {/* Solution */}
              <div>
                <p className="label-uppercase mb-1.5 text-[11px]">{isSimple ? "Comment ça marche" : "Solution recommandée"}</p>
                <p className="text-sm text-foreground-secondary leading-relaxed">{task.solution}</p>
              </div>

              {/* Mise en place section (new fields) */}
              {task.niveau_accompagnement && (
                <div className="space-y-2.5">
                  <p className="label-uppercase text-[11px]">Mise en place</p>

                  {/* Pills row: time, complexity, ecosystem */}
                  <div className="flex flex-wrap items-center gap-2">
                    {task.temps_mise_en_place_jours != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-muted text-foreground-secondary">
                        <Clock size={10} />
                        ~{task.temps_mise_en_place_jours}j
                      </span>
                    )}
                    {task.complexite && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-muted text-foreground-secondary">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span
                            key={i}
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: i < COMPLEXITE_CONFIG[task.complexite!].dots
                                ? COMPLEXITE_CONFIG[task.complexite!].color
                                : "hsl(var(--border))",
                            }}
                          />
                        ))}
                        {COMPLEXITE_CONFIG[task.complexite].label}
                      </span>
                    )}
                    {task.ecosysteme && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-muted text-foreground-secondary">
                        <Wrench size={10} />
                        {ECOSYSTEM_LABELS[task.ecosysteme]}
                      </span>
                    )}
                  </div>

                  {/* Prerequisites */}
                  {task.prerequis && task.prerequis.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-1">Prérequis</p>
                      <ul className="space-y-0.5">
                        {task.prerequis.map((p) => (
                          <li key={p} className="text-xs text-foreground-muted">• {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specific tools */}
                  {task.outils_specifiques && task.outils_specifiques.length > 0 && (
                    <p className="text-xs text-foreground-muted">
                      <span className="font-semibold">Outils :</span>{" "}
                      {task.outils_specifiques.join(" · ")}
                    </p>
                  )}

                  {/* Accompagnement banner */}
                  <div
                    className="rounded-lg p-3 flex items-start gap-2.5"
                    style={{
                      backgroundColor: ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].bgLight,
                    }}
                  >
                    {task.niveau_accompagnement === "express" && <Zap size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.express.color, marginTop: 1 }} />}
                    {task.niveau_accompagnement === "guide" && <Sparkles size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.guide.color, marginTop: 1 }} />}
                    {task.niveau_accompagnement === "consultant" && <Users size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.color, marginTop: 1 }} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].textColor }}>
                        {ACCOMPAGNEMENT_CONFIG[task.niveau_accompagnement].label}
                      </p>
                      {task.raison_accompagnement && (
                        <p className="text-xs text-foreground-muted mt-0.5">{task.raison_accompagnement}</p>
                      )}
                      <div className="mt-1.5">
                        {task.niveau_accompagnement === "express" && (
                          <span className="text-xs font-semibold" style={{ color: ACCOMPAGNEMENT_CONFIG.express.textColor }}>
                            Lancez-vous !
                          </span>
                        )}
                        {task.niveau_accompagnement === "guide" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); openChat({ task, metier: metier ?? "" }); }}
                            className="text-xs font-semibold hover:underline inline-flex items-center gap-1"
                            style={{ color: ACCOMPAGNEMENT_CONFIG.guide.textColor }}
                          >
                            Ouvrir le Copilot <ArrowRight size={11} />
                          </button>
                        )}
                        {task.niveau_accompagnement === "consultant" && (
                          <a
                            href="https://calendly.com/lecko/decouverte"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold hover:underline inline-flex items-center gap-1"
                            style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.textColor }}
                          >
                            Échanger avec un expert <ArrowRight size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organizational impact */}
              {(task.perimetre_impact || task.niveau_changement || task.risque_adoption) && (
                <div className="rounded-xl border border-border p-3 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">Impact organisationnel</p>
                  <div className="flex flex-wrap gap-3">
                    {task.perimetre_impact && PERIMETRE_IMPACT_CONFIG[task.perimetre_impact] && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PERIMETRE_IMPACT_CONFIG[task.perimetre_impact].color }} />
                        <span className="text-foreground-secondary">{PERIMETRE_IMPACT_CONFIG[task.perimetre_impact].label}</span>
                      </div>
                    )}
                    {task.niveau_changement && NIVEAU_CHANGEMENT_CONFIG[task.niveau_changement] && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: NIVEAU_CHANGEMENT_CONFIG[task.niveau_changement].color }} />
                        <span className="text-foreground-secondary">Changement {NIVEAU_CHANGEMENT_CONFIG[task.niveau_changement].label.toLowerCase()}</span>
                      </div>
                    )}
                    {task.risque_adoption && RISQUE_ADOPTION_CONFIG[task.risque_adoption] && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RISQUE_ADOPTION_CONFIG[task.risque_adoption].color }} />
                        <span className="text-foreground-secondary">Adoption : risque {RISQUE_ADOPTION_CONFIG[task.risque_adoption].label.toLowerCase()}</span>
                      </div>
                    )}
                  </div>
                  {task.actions_conduite_changement && (
                    <p className="text-xs text-foreground-secondary leading-relaxed pl-3 border-l-2" style={{ borderColor: "hsl(var(--primary))" }}>
                      {task.actions_conduite_changement}
                    </p>
                  )}
                </div>
              )}

              {/* Expert CTA — if task needs consultant */}
              {(task.niveau_accompagnement === "consultant" || task.risque_adoption === "eleve" || task.perimetre_impact === "multi_services" || task.perimetre_impact === "externe" || task.categorie === "difficilement_automatisable") && !isDemo && (
                <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: "hsl(var(--accent-blue-bg))", borderLeft: "3px solid hsl(var(--primary))" }}>
                  <p className="text-sm font-semibold text-foreground">
                    Cette tâche bénéficie d'un accompagnement structuré
                  </p>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {task.perimetre_impact === "multi_services" || task.perimetre_impact === "externe"
                      ? `L'automatisation impacte ${PERIMETRE_IMPACT_CONFIG[task.perimetre_impact]?.label.toLowerCase() ?? "plusieurs parties prenantes"}. `
                      : ""}
                    {task.risque_adoption === "eleve"
                      ? "Le risque d'adoption est élevé. "
                      : ""}
                    Un consultant divise par 3 le temps de mise en place et sécurise le résultat.
                  </p>
                  <ConsultantContactForm
                    variant="inline"
                    source={`task_expert_${task.nom.replace(/\s+/g, "_").toLowerCase().slice(0, 30)}`}
                    contextMessage={`Accompagnement pour "${task.nom}" (${metier ?? "métier"}, ${task.categorie}).`}
                    metier={metier}
                  />
                </div>
              )}

              {/* Metrics row + sparkline */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--accent-blue-bg))", color: "hsl(var(--accent-blue-text))" }}>
                  <Clock size={11} />
                  ~{task.temps_gagne_heures_semaine}h / semaine
                </span>

                {task.temps_gagne_heures_semaine > 0 && (
                  <MiniSparkline values={sparklineValues} color={sparklineColor} />
                )}

                {roiPerWeek !== undefined && roiPerWeek > 0 && (
                  <span className="text-sm font-semibold text-lecko-blue">
                    ~{Math.round(roiPerWeek).toLocaleString("fr-FR")}&nbsp;€/sem.
                  </span>
                )}
              </div>

              {/* Workflow preview + generator — technical mode only */}
              {!isSimple && task.categorie !== "difficilement_automatisable" && (
                <div className="space-y-4 mt-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted mb-2">Workflow d'automatisation</p>
                    <WorkflowPreview task={task} />
                  </div>
                  <WorkflowGenerator task={task} metier={metier ?? ""} />
                </div>
              )}

              {/* Consultant Augmenté CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openChat({ task, metier: metier ?? "" });
                }}
                className="inline-flex items-center gap-2 text-xs text-foreground-muted hover:text-primary transition-colors mt-2"
              >
                <Sparkles size={12} />
                Poser une question au Consultant IA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
