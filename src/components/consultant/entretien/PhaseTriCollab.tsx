import { useState, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  ThumbsUp, ThumbsDown, HelpCircle,
  Zap, Clock, ArrowRight, RotateCcw,
  Sparkles, Target, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalysisTask } from "@/types/analysis";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TriDecision = "on_fonce" | "a_creuser" | "pas_pour_nous";

export interface TaskWithDecision {
  task: AnalysisTask;
  metier: string;
  decision: TriDecision | null;
}

interface Props {
  results: AnalysisResult[];
  decisions: TaskWithDecision[];
  onDecisionsChange: (decisions: TaskWithDecision[]) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PILES = [
  { id: "on_fonce" as const, label: "On fonce ! 🚀", color: "hsl(var(--lecko-green))", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: ThumbsUp },
  { id: "a_creuser" as const, label: "À creuser 🤔", color: "#F59E0B", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: HelpCircle },
  { id: "pas_pour_nous" as const, label: "Pas pour nous ✋", color: "hsl(var(--destructive))", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: ThumbsDown },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhaseTriCollab({ results, decisions, onDecisionsChange }: Props) {
  const [mode, setMode] = useState<"swipe" | "overview">("swipe");

  const undecided = decisions.filter((d) => d.decision === null);
  const decided = decisions.filter((d) => d.decision !== null);
  const currentIdx = decisions.length - undecided.length;
  const currentCard = undecided[0] ?? null;

  const stats = useMemo(() => {
    const onFonce = decisions.filter((d) => d.decision === "on_fonce");
    const aCreuser = decisions.filter((d) => d.decision === "a_creuser");
    const pasNous = decisions.filter((d) => d.decision === "pas_pour_nous");
    const heuresValidees = onFonce.reduce((s, d) => s + d.task.temps_gagne_heures_semaine, 0);
    const heuresCreuser = aCreuser.reduce((s, d) => s + d.task.temps_gagne_heures_semaine, 0);
    return { onFonce: onFonce.length, aCreuser: aCreuser.length, pasNous: pasNous.length, heuresValidees, heuresCreuser };
  }, [decisions]);

  const handleDecision = (decision: TriDecision) => {
    if (!currentCard) return;
    const next = decisions.map((d) =>
      d.task === currentCard.task ? { ...d, decision } : d
    );
    onDecisionsChange(next);
  };

  const handleSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!currentCard) return;
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleDecision("on_fonce");
    } else if (info.offset.x < -threshold) {
      handleDecision("pas_pour_nous");
    } else if (info.offset.y < -threshold) {
      handleDecision("a_creuser");
    }
  };

  const handleUndo = () => {
    // Find last decided item and reset it
    const lastDecidedIdx = [...decisions].reverse().findIndex((d) => d.decision !== null);
    if (lastDecidedIdx < 0) return;
    const realIdx = decisions.length - 1 - lastDecidedIdx;
    const next = [...decisions];
    next[realIdx] = { ...next[realIdx], decision: null };
    onDecisionsChange(next);
  };

  const allDone = undecided.length === 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header avec stats live */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            Tri collaboratif
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {allDone ? "Tout est trié !" : `${currentIdx + 1} / ${decisions.length}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Score live */}
          <div className="flex gap-3">
            {PILES.map((pile) => {
              const count = pile.id === "on_fonce" ? stats.onFonce : pile.id === "a_creuser" ? stats.aCreuser : stats.pasNous;
              return (
                <div key={pile.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${pile.bgColor}`}>
                  <span className="text-sm" style={{ color: pile.color }}>{count}</span>
                  <pile.icon size={13} style={{ color: pile.color }} />
                </div>
              );
            })}
          </div>

          {/* Mode toggle */}
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setMode("swipe")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-mono transition-all",
                mode === "swipe" ? "bg-lecko-blue text-white" : "text-slate-400"
              )}
            >
              Swipe
            </button>
            <button
              onClick={() => setMode("overview")}
              className={cn("px-3 py-1.5 rounded-md text-xs font-mono transition-all",
                mode === "overview" ? "bg-lecko-blue text-white" : "text-slate-400"
              )}
            >
              Vue d'ensemble
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ width: `${(stats.onFonce / Math.max(decisions.length, 1)) * 100}%` }}
          />
          <motion.div
            className="h-full bg-amber-500"
            animate={{ width: `${(stats.aCreuser / Math.max(decisions.length, 1)) * 100}%` }}
          />
          <motion.div
            className="h-full bg-red-500"
            animate={{ width: `${(stats.pasNous / Math.max(decisions.length, 1)) * 100}%` }}
          />
        </div>
      </div>

      {mode === "swipe" ? (
        <div className="flex flex-col items-center">
          {/* Pile labels */}
          <div className="flex items-center justify-between w-full max-w-lg mb-6 px-4">
            <div className="flex items-center gap-1 text-red-400 text-xs font-mono">
              <ChevronLeft size={14} />
              Pas pour nous
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
              ↑ À creuser
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
              On fonce !
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card stack */}
          <div className="relative w-full max-w-lg h-[360px]">
            <AnimatePresence>
              {currentCard && (
                <motion.div
                  key={currentCard.task.nom}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.9}
                  onDragEnd={handleSwipe}
                  initial={{ opacity: 0, scale: 0.8, rotateZ: 0 }}
                  animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  whileDrag={{ cursor: "grabbing" }}
                  className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-3xl p-8 cursor-grab shadow-2xl shadow-black/50"
                >
                  {/* Catégorie badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-lg">
                      {currentCard.metier}
                    </span>
                    <span className={cn(
                      "text-xs font-mono font-bold px-3 py-1 rounded-lg",
                      currentCard.task.categorie === "automatisable" ? "bg-emerald-500/15 text-emerald-400" :
                      currentCard.task.categorie === "partiellement_automatisable" ? "bg-amber-500/15 text-amber-400" :
                      "bg-red-500/15 text-red-400"
                    )}>
                      {currentCard.task.categorie === "automatisable" ? "Automatisable" :
                       currentCard.task.categorie === "partiellement_automatisable" ? "Partiellement" : "Difficile"}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
                    {currentCard.task.nom}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-base leading-relaxed mb-6">
                    {currentCard.task.solution || currentCard.task.description}
                  </p>

                  {/* Métriques */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <Clock size={16} className="text-amber-400 mx-auto mb-1" />
                      <span className="text-xl font-bold text-white block">{currentCard.task.temps_gagne_heures_semaine}h</span>
                      <span className="text-[10px] text-slate-400 font-mono">par semaine</span>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <Target size={16} className="text-lecko-blue mx-auto mb-1" />
                      <span className="text-xl font-bold text-white block">
                        {currentCard.task.ecosysteme?.replace(/_/g, " ").substring(0, 12) ?? "—"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">écosystème</span>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3 text-center">
                      <Sparkles size={16} className="text-purple-400 mx-auto mb-1" />
                      <span className="text-xl font-bold text-white block">
                        {currentCard.task.niveau_accompagnement === "express" || currentCard.task.niveau_accompagnement === "autonome" ? "Solo" :
                         currentCard.task.niveau_accompagnement === "guide" || currentCard.task.niveau_accompagnement === "formation" ? "Guidé" : "Expert"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">accomp.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* All done */}
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Sparkles size={36} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Tri terminé !</h3>
                <p className="text-slate-400 text-center max-w-sm">
                  <span className="text-emerald-400 font-bold">{stats.onFonce}</span> chantiers validés
                  {stats.aCreuser > 0 && <>, <span className="text-amber-400 font-bold">{stats.aCreuser}</span> à creuser</>}
                  {stats.heuresValidees > 0 && (
                    <span className="block mt-2 text-lg">
                      = <span className="text-amber-400 font-bold">{stats.heuresValidees}h/semaine</span> d'impact confirmé
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          {!allDone && (
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleUndo}
                disabled={decided.length === 0}
                className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => handleDecision("pas_pour_nous")}
                className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all"
              >
                <ThumbsDown size={22} />
              </button>
              <button
                onClick={() => handleDecision("a_creuser")}
                className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 hover:scale-110 transition-all"
              >
                <HelpCircle size={20} />
              </button>
              <button
                onClick={() => handleDecision("on_fonce")}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 hover:scale-110 transition-all"
              >
                <ThumbsUp size={22} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── OVERVIEW MODE ── */
        <div className="grid grid-cols-3 gap-4">
          {PILES.map((pile) => {
            const items = decisions.filter((d) => d.decision === pile.id);
            const heures = items.reduce((s, d) => s + d.task.temps_gagne_heures_semaine, 0);
            return (
              <div key={pile.id} className={`rounded-2xl border ${pile.borderColor} ${pile.bgColor} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: pile.color }}>
                    {pile.label}
                  </h3>
                  <span className="text-xs font-mono" style={{ color: pile.color }}>
                    {items.length} · {heures}h/sem
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.task.nom}
                      className="bg-slate-900/80 rounded-lg p-3 text-sm"
                    >
                      <p className="text-white font-medium text-xs leading-snug">{item.task.nom}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-mono text-slate-400">{item.metier}</span>
                        <span className="text-[10px] font-mono text-amber-400">{item.task.temps_gagne_heures_semaine}h</span>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-slate-600 text-xs text-center py-6 font-mono">Vide</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
