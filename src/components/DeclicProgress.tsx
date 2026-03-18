import { DECLIC_PHASES, DeclicPhase } from "@/types/declic";
import { Info } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DeclicProgressProps {
  currentPhase: DeclicPhase; // phase "in progress"
  completedPhases: DeclicPhase[];
}

export default function DeclicProgress({ currentPhase, completedPhases }: DeclicProgressProps) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <div className="lecko-card p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
          Méthode <Link to="/methode" className="text-lecko-blue hover:underline">DÉCLIC</Link> — Progression
        </p>
        <Link to="/methode" className="text-xs text-foreground-muted hover:text-lecko-blue flex items-center gap-1 transition-colors">
          <Info size={12} />
          En savoir plus
        </Link>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {DECLIC_PHASES.map((phase, i) => {
          const isDone = completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhase;
          const isFuture = !isDone && !isCurrent;

          return (
            <div key={phase.id} className="flex items-center shrink-0">
              {i > 0 && (
                <div className={`w-4 h-px mx-0.5 ${isDone || completedPhases.includes(DECLIC_PHASES[i - 1].id) ? "" : "bg-border"}`}
                  style={{ backgroundColor: isDone ? phase.color : undefined }} />
              )}
              <div
                className="relative"
                onMouseEnter={() => setTooltip(phase.id)}
                onMouseLeave={() => setTooltip(null)}
              >
                <div className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl cursor-pointer transition-all ${
                  isCurrent ? "bg-muted/60" : ""
                }`}>
                  <span className={`text-base ${isFuture ? "opacity-40" : ""}`}>{phase.icon}</span>
                  <div className="flex items-center gap-1">
                    {isDone && <span className="text-[10px] text-emerald-500">✅</span>}
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: phase.color }} />
                    )}
                    <span className={`text-[10px] font-semibold hidden sm:block ${isFuture ? "text-foreground-muted" : ""}`}
                      style={isCurrent || isDone ? { color: phase.color } : undefined}>
                      {phase.shortLabel}
                    </span>
                  </div>
                </div>

                {/* Tooltip */}
                {tooltip === phase.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 bg-card border border-border rounded-xl shadow-xl p-3 animate-fade-in">
                    <p className="text-xs font-bold text-foreground mb-1">{phase.icon} {phase.label}</p>
                    <p className="text-[11px] text-foreground-secondary leading-snug">{phase.description}</p>
                    {isFuture && <p className="text-[10px] text-foreground-muted mt-1 italic">Non débloquée</p>}
                    {isCurrent && <p className="text-[10px] font-semibold mt-1" style={{ color: phase.color }}>En cours ↗</p>}
                    {isDone && <p className="text-[10px] text-emerald-500 font-semibold mt-1">Complétée ✅</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
