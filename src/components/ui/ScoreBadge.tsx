import * as React from "react";

import { cn } from "@/lib/utils";

type Level = "debutant" | "intermediaire" | "avance" | "expert";

interface ScoreBadgeProps {
  level: Level;
  className?: string;
}

const levelConfig: Record<Level, { label: string; classes: string }> = {
  debutant: {
    label: "Débutant",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  intermediaire: {
    label: "Intermédiaire",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  avance: {
    label: "Avancé",
    classes: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  expert: {
    label: "Expert",
    classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
};

function ScoreBadge({ level, className }: ScoreBadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border text-xs font-medium px-3 py-1",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export { ScoreBadge };
export type { ScoreBadgeProps, Level };
