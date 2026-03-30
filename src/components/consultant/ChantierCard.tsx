import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chantier, Horizon } from "@/types/consultant";
import { HORIZON_LABELS } from "@/types/consultant";
import { PriorityBadge } from "./PriorityBadge";
import { EcosystemPill } from "./EcosystemPill";

const ACCOMPAGNEMENT_LABELS: Record<string, string> = {
  express: "Express",
  guide: "Guidé",
  consultant: "Consultant",
};

export function ChantierCard({
  chantier,
  isDragging,
}: {
  chantier: Chantier;
  isDragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "group bg-white border rounded-xl p-4 transition-all duration-200",
        "hover:border-lecko-blue/20 hover:shadow-sm",
        isDragging && "opacity-50 scale-[0.98] rotate-1"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button className="mt-0.5 cursor-grab active:cursor-grabbing text-foreground-muted/30 hover:text-foreground-muted transition-colors opacity-0 group-hover:opacity-100">
          <GripVertical size={14} strokeWidth={1.5} />
        </button>

        <div className="flex-1 min-w-0">
          {/* Titre + badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-consultant font-semibold text-foreground leading-snug">
              {chantier.titre}
            </p>
            <PriorityBadge priorite={chantier.priorite} />
          </div>

          {/* Service + métier */}
          <p className="text-xs font-mono text-foreground-muted mb-2.5">
            {[chantier.service_concerne, chantier.metier_source]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {/* Méta pills */}
          <div className="flex flex-wrap gap-1.5">
            {chantier.ecosysteme && (
              <EcosystemPill ecosysteme={chantier.ecosysteme} />
            )}
            {chantier.niveau_accompagnement && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700">
                {ACCOMPAGNEMENT_LABELS[chantier.niveau_accompagnement] ??
                  chantier.niveau_accompagnement}
              </span>
            )}
            {chantier.horizon && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-mission-alt border border-mission-border text-foreground-muted">
                {HORIZON_LABELS[chantier.horizon as Horizon]}
              </span>
            )}
          </div>
        </div>

        {/* Impact */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold font-consultant text-gr33t-600">
            ~{chantier.impact_total_heures_an ?? 0}h
          </p>
          <p className="text-[10px] font-mono text-foreground-muted">/an</p>
        </div>
      </div>
    </div>
  );
}
