import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Zap, CheckCircle, AlertCircle } from "lucide-react";
import type { AnalysisResult, AnalysisTask } from "@/types/analysis";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  analyzing: boolean;
  progress: { current: number; total: number; currentMetier?: string };
  results: AnalysisResult[];
  error: string | null;
  onRetry: () => void;
  onConfigureKey: () => void;
}

// ─── Loading Messages ─────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  "Analyse des processus métier...",
  "Identification des tâches répétitives...",
  "Évaluation du potentiel d'automatisation...",
  "Recherche des outils adaptés...",
  "Calcul de l'impact en heures...",
  "Construction des recommandations...",
  "Calibrage des niveaux d'accompagnement...",
  "Finalisation de la cartographie...",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhaseAnalyse({ analyzing, progress, results, error, onRetry, onConfigureKey }: Props) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [revealedTasks, setRevealedTasks] = useState(0);
  const revealTimerRef = useRef<ReturnType<typeof setInterval>>();

  // Rotate loading messages
  useEffect(() => {
    if (!analyzing) return;
    const timer = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 3000);
    return () => clearInterval(timer);
  }, [analyzing]);

  // Progressive reveal of tasks when results arrive
  const allTasks = results.flatMap((r) => r.taches);
  const totalHours = results.reduce((s, r) => s + r.heures_economisees_semaine, 0);

  useEffect(() => {
    if (results.length === 0 || analyzing) return;
    setRevealedTasks(0);
    revealTimerRef.current = setInterval(() => {
      setRevealedTasks((prev) => {
        if (prev >= allTasks.length) {
          clearInterval(revealTimerRef.current!);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(revealTimerRef.current);
  }, [results, analyzing]);

  // ── Analyzing state ──
  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-8">
        {/* Orbital animation */}
        <div className="relative w-40 h-40">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-slate-700"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-lecko-blue" />
          </motion.div>
          {/* Middle ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-slate-800"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
          </motion.div>
          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain size={36} className="text-lecko-blue" />
            </motion.div>
          </div>
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-lecko-blue/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Progress */}
        <div className="text-center space-y-3 max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-200 text-xl font-medium"
            >
              {LOADING_MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>

          {progress.currentMetier && (
            <p className="text-lecko-blue text-sm font-mono">
              {progress.currentMetier}
            </p>
          )}

          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
              <span>Métier {progress.current}/{progress.total}</span>
              <span>{Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-lecko-blue to-blue-400 rounded-full"
                animate={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        <p className="text-red-300 text-lg font-medium text-center">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfigureKey}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
          >
            Configurer la clé API
          </button>
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-lecko-blue text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ── Results with progressive reveal ──
  if (results.length > 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Big number hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-8"
        >
          <p className="text-slate-400 text-sm font-mono uppercase tracking-widest mb-3">
            Potentiel identifié
          </p>
          <div className="flex items-baseline justify-center gap-4">
            <CountUp value={allTasks.length} className="text-6xl font-bold text-white" />
            <span className="text-slate-400 text-xl">opportunités</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Zap size={16} className="text-amber-400" />
            <CountUp value={totalHours} decimals={1} className="text-2xl font-bold text-amber-400" />
            <span className="text-slate-400">heures/semaine récupérables</span>
          </div>
        </motion.div>

        {/* Cards par métier */}
        {results.map((r, rIdx) => (
          <motion.div
            key={r.metier}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: rIdx * 0.15 }}
          >
            {/* Métier header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lecko-blue to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{r.score_global}%</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{r.metier}</h3>
                <p className="text-slate-400 text-sm font-mono">
                  {r.taches.length} tâches · {r.heures_economisees_semaine}h/sem
                </p>
              </div>
            </div>

            {/* Task grid — reveal progressif */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {r.taches.map((task, tIdx) => {
                const globalIdx = results
                  .slice(0, rIdx)
                  .reduce((s, prev) => s + prev.taches.length, 0) + tIdx;
                const isRevealed = globalIdx < revealedTasks;

                return (
                  <motion.div
                    key={tIdx}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-white leading-snug">{task.nom}</p>
                      <span className="text-sm font-bold text-amber-400 font-mono whitespace-nowrap">
                        {task.temps_gagne_heures_semaine}h
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CategoryBadge categorie={task.categorie} />
                      {task.ecosysteme && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {task.ecosysteme.replace(/_/g, " ")}
                        </span>
                      )}
                      {task.niveau_accompagnement && (
                        <AccompBadge niveau={task.niveau_accompagnement} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // ── Empty state (should not happen, but safe) ──
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span className={className}>{display.toFixed(decimals)}</span>;
}

function CategoryBadge({ categorie }: { categorie: string }) {
  const config =
    categorie === "automatisable"
      ? { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Automatisable" }
      : categorie === "partiellement_automatisable"
      ? { bg: "bg-amber-500/15", text: "text-amber-400", label: "Partiel" }
      : { bg: "bg-red-500/15", text: "text-red-400", label: "Difficile" };

  return (
    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function AccompBadge({ niveau }: { niveau: string }) {
  const config =
    niveau === "express" || niveau === "autonome"
      ? { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Express" }
      : niveau === "guide" || niveau === "formation"
      ? { bg: "bg-blue-500/10", text: "text-blue-400", label: "Guidé" }
      : { bg: "bg-purple-500/10", text: "text-purple-400", label: "Expert" };

  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
