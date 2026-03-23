import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Search, BarChart3, Zap, FileText, Shield } from "lucide-react";

interface LoadingScreenProps {
  metier?: string;
  tasks?: string[];
}

/** Steps that simulate the analysis pipeline — each with an icon and timing */
const ANALYSIS_STEPS = [
  { label: "Connexion à la base de données métier", icon: Search, duration: 800 },
  { label: "Identification des tâches quotidiennes", icon: FileText, duration: 900 },
  { label: "Scoring des 5 critères DÉCLIC", icon: BarChart3, duration: 1000 },
  { label: "Évaluation du potentiel d'automatisation", icon: Zap, duration: 800 },
  { label: "Recherche des outils adaptés", icon: Search, duration: 700 },
  { label: "Calcul du ROI et des économies", icon: BarChart3, duration: 600 },
  { label: "Vérification de la cohérence", icon: Shield, duration: 500 },
  { label: "Génération du plan d'action", icon: FileText, duration: 400 },
];

export default function LoadingScreen({ metier }: LoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Compute cumulative timings for each step start
  const stepTimings = useMemo(() => {
    let t = 600; // initial delay before first step
    return ANALYSIS_STEPS.map((s) => {
      const start = t;
      t += s.duration;
      return start;
    });
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Activate each step at its computed time
    stepTimings.forEach((startMs, i) => {
      timers.push(setTimeout(() => setActiveStep(i), startMs));
      timers.push(setTimeout(() => setCompletedSteps(i + 1), startMs + ANALYSIS_STEPS[i].duration - 150));
    });

    return () => timers.forEach(clearTimeout);
  }, [stepTimings]);

  const progressPercent = Math.min(98, Math.round((completedSteps / ANALYSIS_STEPS.length) * 100));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Diagnostic en cours
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {metier || "Analyse du métier"}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="relative mb-8">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-right text-[11px] font-semibold text-foreground-muted mt-1.5">
            {progressPercent}%
          </p>
        </div>

        {/* Analysis steps — sequential reveal */}
        <div className="space-y-1">
          {ANALYSIS_STEPS.map((step, i) => {
            const isCompleted = i < completedSteps;
            const isActive = i === activeStep && !isCompleted;
            const isHidden = i > activeStep;

            if (isHidden) return null;

            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
              >
                {/* Status icon */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  ) : isActive ? (
                    <Loader2 size={16} className="text-primary animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border" />
                  )}
                </div>

                {/* Step icon + label */}
                <Icon
                  size={13}
                  className={isCompleted ? "text-primary shrink-0" : isActive ? "text-foreground-muted shrink-0" : "text-border shrink-0"}
                  strokeWidth={1.5}
                />
                <span
                  className={`text-sm ${
                    isCompleted ? "text-foreground" : isActive ? "text-foreground-muted" : "text-border"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info */}
        <AnimatePresence>
          {completedSteps >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-foreground-muted text-center mt-8"
            >
              {completedSteps} / {ANALYSIS_STEPS.length} étapes terminées
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
