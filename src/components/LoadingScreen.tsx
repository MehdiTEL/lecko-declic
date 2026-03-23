import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface LoadingScreenProps {
  metier?: string;
  tasks?: string[];
}

const GENERIC_TASKS = [
  "Analyse des tâches récurrentes",
  "Identification des processus manuels",
  "Évaluation du potentiel d'automatisation",
  "Calcul du temps récupérable",
  "Recherche des outils adaptés",
  "Génération du plan d'action",
];

const PHASES = [
  "Analyse du métier en cours",
  "Identification des tâches",
  "Évaluation des critères DÉCLIC",
  "Génération des recommandations",
];

export default function LoadingScreen({ metier, tasks }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showTasks, setShowTasks] = useState(false);

  const displayTasks = tasks?.slice(0, 6) ?? GENERIC_TASKS;

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 95 ? p : p + Math.random() * 2.5));
    }, 200);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
    }, 2000);

    const taskDelay = setTimeout(() => setShowTasks(true), 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      clearTimeout(taskDelay);
    };
  }, []);

  useEffect(() => {
    if (!showTasks || visibleTasks >= displayTasks.length) return;
    const timer = setTimeout(() => setVisibleTasks((v) => v + 1), 700);
    return () => clearTimeout(timer);
  }, [showTasks, visibleTasks, displayTasks.length]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Phase title */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-semibold text-foreground"
            >
              {PHASES[phaseIndex]}
              {metier && phaseIndex === 0 ? ` — ${metier}` : ""}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-8">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Tasks detected — sequential reveal */}
        <div className="space-y-2">
          <AnimatePresence>
            {displayTasks.slice(0, visibleTasks).map((task, i) => {
              const isLast = i === visibleTasks - 1 && visibleTasks < displayTasks.length;
              return (
                <motion.div
                  key={task}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: isLast ? "transparent" : "hsl(var(--surface-alt, 210 40% 98%))",
                  }}
                >
                  {isLast ? (
                    <Loader2 size={15} className="text-primary animate-spin shrink-0" />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                    >
                      <Check size={15} className="text-primary shrink-0" />
                    </motion.div>
                  )}
                  <span className={`text-sm ${isLast ? "text-foreground-muted" : "text-foreground"}`}>
                    {task}
                    {isLast ? "..." : ""}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Counter */}
        {visibleTasks > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-foreground-muted text-center mt-6"
          >
            {visibleTasks} tâche{visibleTasks > 1 ? "s" : ""} identifiée{visibleTasks > 1 ? "s" : ""}
          </motion.p>
        )}
      </div>
    </div>
  );
}
