import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Analyse du métier en cours...",
  "Identification des tâches quotidiennes...",
  "Évaluation du potentiel d'automatisation...",
  "Génération des recommandations...",
];

export default function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 900);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        return p + Math.random() * 4;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo + Spinner */}
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="font-heading text-2xl font-bold text-primary mb-6 tracking-tight">DÉCLIC</span>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
              />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="hsl(var(--lecko-green))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="213.6"
                strokeDashoffset={213.6 - (213.6 * progress) / 100}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading text-sm font-bold text-foreground-muted">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Step text */}
        <div className="h-8 mb-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-lg font-semibold text-foreground"
            >
              {STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex ? "bg-primary w-6" : "bg-border w-2"
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-foreground-muted text-sm mt-2">
          {Math.round(progress)}% — Analyse en cours
        </p>
      </div>
    </div>
  );
}
