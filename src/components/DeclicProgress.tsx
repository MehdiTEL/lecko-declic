import { DECLIC_PHASES, DeclicPhase } from "@/types/declic";
import { Search, BarChart3, Wrench, Play, Award, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DeclicProgressProps {
  currentPhase: DeclicPhase;
  completedPhases: DeclicPhase[];
}

const PHASE_ICONS = [ShieldCheck, Search, BarChart3, Wrench, Play, Award];

const PHASE_TOOLTIPS: Record<number, string> = {
  0: "Votre process est-il clair ? On n'automatise que ce qu'on comprend.",
  1: "Les tâches qui vous freinent ont été identifiées.",
  2: "Chaque tâche a été évaluée sur 5 critères.",
  3: "Vous concevez vos automatisations étape par étape.",
  4: "Vous testez et déployez progressivement.",
  5: "Vous ancrez les gains dans la durée.",
};

export default function DeclicProgress({ currentPhase, completedPhases }: DeclicProgressProps) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <div className="lecko-card px-5 py-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="label-uppercase text-[10px]">
          Méthode{" "}
          <Link to="/methode" className="text-lecko-blue hover:underline">
            DÉCLIC
          </Link>
        </p>
        <Link to="/methode" className="text-xs text-foreground-muted hover:text-lecko-blue transition-colors">
          En savoir plus
        </Link>
      </div>

      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {DECLIC_PHASES.map((phase, i) => {
          const isDone = completedPhases.includes(phase.id);
          const isCurrent = phase.id === currentPhase;
          const isFuture = !isDone && !isCurrent;
          const Icon = PHASE_ICONS[i];

          return (
            <div key={phase.id} className="flex items-center">
              {i > 0 && (
                <div
                  className="w-6 h-px shrink-0"
                  style={{
                    backgroundColor: isDone
                      ? "hsl(var(--lecko-blue))"
                      : "hsl(var(--border))",
                  }}
                />
              )}
              <div
                className="relative"
                onMouseEnter={() => setTooltip(phase.id)}
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                    isCurrent ? "bg-muted" : ""
                  }`}
                >
                  {/* Circle */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all"
                    style={{
                      borderColor: isDone
                        ? "hsl(var(--lecko-blue))"
                        : isCurrent
                        ? phase.color
                        : "hsl(var(--border))",
                      backgroundColor: isDone
                        ? "hsl(var(--lecko-blue))"
                        : isCurrent
                        ? `${phase.color}18`
                        : "transparent",
                    }}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
                        ? "hsl(var(--lecko-blue))"
                        : isCurrent
                        ? phase.color
                        : "hsl(var(--foreground-muted))",
                    }}
                  >
                    {phase.shortLabel}
                  </span>

                  {isCurrent && (
                    <span
                      className="hidden sm:block w-1 h-1 rounded-full animate-pulse-subtle"
                      style={{ backgroundColor: phase.color }}
                    />
                  )}
                </div>

                {/* Tooltip */}
                {tooltip === phase.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-44 bg-card border border-border rounded-xl shadow-elevated p-3 animate-fade-in pointer-events-none">
                    <p className="text-xs font-semibold text-foreground mb-1">{phase.label}</p>
                    <p className="text-[11px] text-foreground-secondary leading-snug">
                      {PHASE_TOOLTIPS[phase.id]}
                    </p>
                    {isFuture && (
                      <p className="text-[10px] text-foreground-muted mt-1 italic">Non débloquée</p>
                    )}
                    {isCurrent && (
                      <p className="text-[10px] font-semibold mt-1" style={{ color: phase.color }}>
                        En cours
                      </p>
                    )}
                    {isDone && (
                      <p className="text-[10px] font-semibold text-lecko-green mt-1">Complétée</p>
                    )}
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
