import { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Users, Clock, ArrowRight, Lock } from "lucide-react";
import { AnalysisTask, ACCOMPAGNEMENT_CONFIG, ECOSYSTEM_LABELS } from "@/types/analysis";
import { generateActionPlan, ActionStep } from "@/lib/actionPlanGenerator";
import { useChatContext } from "@/context/ChatContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<ActionStep["phase"], string> = {
  quick_win: "#059669",
  short_term: "#2563EB",
  medium_term: "#F59E0B",
  long_term: "#64748b",
};

const PHASE_ICONS: Record<ActionStep["phase"], React.ReactNode> = {
  quick_win: <Zap className="w-4 h-4" />,
  short_term: <Sparkles className="w-4 h-4" />,
  medium_term: <Users className="w-4 h-4" />,
  long_term: <Lock className="w-4 h-4" />,
};

const PHASE_EMOJI: Record<ActionStep["phase"], string> = {
  quick_win: "\u26A1",
  short_term: "\u2728",
  medium_term: "\uD83D\uDC65",
  long_term: "\uD83D\uDD12",
};

const CALENDLY_URL = "https://calendly.com/lecko";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ActionPlanProps {
  tasks: AnalysisTask[];
  metier: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActionPlan({ tasks, metier }: ActionPlanProps) {
  const { openChat } = useChatContext();

  const plan = useMemo(() => generateActionPlan(tasks), [tasks]);

  if (plan.steps.length === 0) return null;

  return (
    <div className="lecko-card p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="label-uppercase text-primary text-xs font-semibold tracking-widest mb-1">
          PLAN D&apos;ACTION
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Votre feuille de route en {plan.steps.length} phase{plan.steps.length > 1 ? "s" : ""}
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 md:ml-6">
        {/* Vertical line */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{
            background: `linear-gradient(to bottom, ${PHASE_COLORS.quick_win}, ${PHASE_COLORS.short_term}, ${PHASE_COLORS.medium_term}, ${PHASE_COLORS.long_term})`,
          }}
        />

        {plan.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 * index, ease: "easeOut" }}
            className="relative pl-8 pb-10 last:pb-0"
          >
            {/* Phase circle */}
            <div
              className="absolute left-0 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: PHASE_COLORS[step.phase],
                backgroundColor:
                  step.status === "actionable" ? PHASE_COLORS[step.phase] : "transparent",
              }}
            >
              {step.status === "actionable" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>

            {/* Phase header */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-sm font-bold"
                style={{ color: PHASE_COLORS[step.phase] }}
              >
                {PHASE_ICONS[step.phase]}
                {step.phaseLabel}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${PHASE_COLORS[step.phase]}15`,
                  color: PHASE_COLORS[step.phase],
                }}
              >
                {step.timing}
              </span>
              <span className="text-xs text-foreground-muted ml-auto flex items-center gap-1">
                <Clock className="w-3 h-3" />
                +{step.totalHoursGained.toFixed(1)}h/sem
              </span>
            </div>

            {/* Task cards */}
            <div className="space-y-2 mb-4">
              {step.tasks.map((task, tIdx) => (
                <motion.div
                  key={`${step.id}-${tIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 * index + 0.08 * tIdx,
                    ease: "easeOut",
                  }}
                  className="bg-muted/30 rounded-xl p-3 flex items-start gap-3 group hover:bg-muted/50 transition-colors"
                >
                  <span className="text-base mt-0.5 shrink-0">
                    {PHASE_EMOJI[step.phase]}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {task.nom}
                    </p>
                    {task.ecosysteme && (
                      <span className="text-xs text-foreground-muted">
                        {ECOSYSTEM_LABELS[task.ecosysteme]}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {task.temps_gagne_heures_semaine}h/sem
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA per phase */}
            <PhaseCTA step={step} openChat={openChat} metier={metier} />
          </motion.div>
        ))}
      </div>

      {/* Summary callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 * plan.steps.length + 0.2 }}
        className="mt-8 rounded-xl p-4 md:p-5 border"
        style={{
          backgroundColor: "hsl(var(--primary) / 0.06)",
          borderColor: "hsl(var(--primary) / 0.2)",
        }}
      >
        <p className="text-sm font-semibold text-primary mb-1">
          Potentiel total identifi\u00E9
        </p>
        <p className="text-2xl font-bold text-foreground">
          {plan.totalHoursGained.toFixed(1)}h
          <span className="text-base font-normal text-foreground-secondary"> /semaine</span>
        </p>
        <p className="text-xs text-foreground-muted mt-1">
          {plan.totalTasks} t\u00E2che{plan.totalTasks > 1 ? "s" : ""} sur ~{plan.estimatedCompletionWeeks} semaines
        </p>
      </motion.div>
    </div>
  );
}

// ─── Phase CTA ────────────────────────────────────────────────────────────────

function PhaseCTA({
  step,
  openChat,
  metier,
}: {
  step: ActionStep;
  openChat: (ctx?: { task: AnalysisTask; metier: string }) => void;
  metier: string;
}) {
  switch (step.phase) {
    case "quick_win":
      return (
        <button
          onClick={() => {
            const firstTask = step.tasks[0];
            if (firstTask) {
              openChat({ task: firstTask, metier });
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: PHASE_COLORS.quick_win }}
        >
          Commencer maintenant
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );

    case "short_term":
      return (
        <button
          onClick={() => {
            const firstTask = step.tasks[0];
            if (firstTask) {
              openChat({ task: firstTask, metier });
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: PHASE_COLORS.short_term }}
        >
          Ouvrir le Copilot
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );

    case "medium_term":
      return (
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: PHASE_COLORS.medium_term }}
        >
          Planifier un \u00E9change Lecko
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      );

    case "long_term":
      return (
        <span
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted"
        >
          <Lock className="w-3.5 h-3.5" />
          \u00C0 explorer \u00E0 moyen terme
        </span>
      );

    default:
      return null;
  }
}
