import { DECLIC_PHASES, DeclicPhase } from "@/types/declic";
import { Search, BarChart3, Wrench, Play, Award, ShieldCheck, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DeclicProgressProps {
  currentPhase: DeclicPhase;
  completedPhases: DeclicPhase[];
  onPhaseClick?: (phase: DeclicPhase) => void;
  sticky?: boolean;
}

const PHASE_ICONS = [ShieldCheck, Search, BarChart3, Wrench, Play, RefreshCw, Award];

export default function DeclicProgress({ currentPhase, completedPhases, onPhaseClick, sticky }: DeclicProgressProps) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  const handleClick = (phaseId: DeclicPhase) => {
    if (onPhaseClick) {
      onPhaseClick(phaseId);
    }
  };

  const wrapperCls = sticky
    ? "sticky top-16 z-30 bg-card/95 backdrop-blur-sm border-b border-border/60 px-4 py-2"
    : "lecko-card px-5 py-4 mb-6";

  return (
    <div className={wrapperCls}>
      <div className={`${sticky ? "max-w-5xl mx-auto" : ""}`}>
        {!sticky && (
          <div className="flex items-center justify-between mb-3">
            <p className="label-uppercase text-[10px]">
              Méthode{" "}
              <Link to="/methode" className="text-primary hover:underline">
                DÉCLIC
              </Link>
            </p>
            <Link to="/methode" className="text-xs text-foreground-muted hover:text-primary transition-colors">
              En savoir plus
            </Link>
          </div>
        )}

        <div className="flex items-center gap-0 overflow-x-auto pb-0.5">
          {DECLIC_PHASES.map((phase, i) => {
            const isDone = completedPhases.includes(phase.id);
            const isCurrent = phase.id === currentPhase;
            const isFuture = !isDone && !isCurrent;
            const Icon = PHASE_ICONS[i];
            const isClickable = !!onPhaseClick;

            return (
              <div key={phase.id} className="flex items-center">
                {i > 0 && (
                  <div
                    className="w-6 h-px shrink-0 transition-colors"
                    style={{
                      backgroundColor: isDone
                        ? "hsl(var(--primary))"
                        : "hsl(var(--border))",
                    }}
                  />
                )}
                <div
                  className="relative"
                  onMouseEnter={() => setTooltip(phase.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <button
                    type="button"
                    onClick={() => handleClick(phase.id)}
                    className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                      isClickable ? "cursor-pointer hover:bg-muted/50" : "cursor-default"
                    } ${isCurrent ? "bg-muted" : ""}`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all"
                      style={{
                        borderColor: isDone
                          ? "hsl(var(--primary))"
                          : isCurrent
                          ? phase.color
                          : "hsl(var(--border))",
                        backgroundColor: isDone
                          ? "hsl(var(--primary))"
                          : isCurrent
                          ? `${phase.color}18`
                          : "transparent",
                      }}
                    >
                      {isDone ? (
                        <Check size={12} className="text-white" strokeWidth={2.5} />
                      ) : (
                        <Icon
                          size={12}
                          style={{
                            color: isFuture ? "hsl(var(--foreground-muted))" : phase.color,
                            opacity: isFuture ? 0.4 : 1,
                          }}
                          strokeWidth={2}
                        />
                      )}
                    </div>

                    <span
                      className="text-[10px] font-medium hidden sm:block whitespace-nowrap"
                      style={{
                        color: isDone
                          ? "hsl(var(--primary))"
                          : isCurrent
                          ? phase.color
                          : "hsl(var(--foreground-muted))",
                      }}
                    >
                      {phase.shortLabel}
                    </span>
                  </button>

                  {/* Tooltip */}
                  {tooltip === phase.id && !sticky && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 bg-card border border-border rounded-xl shadow-elevated p-3 animate-fade-in pointer-events-none">
                      <p className="text-xs font-semibold text-foreground mb-1">{phase.label}</p>
                      <p className="text-[11px] text-foreground-secondary leading-snug">
                        {phase.question}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
