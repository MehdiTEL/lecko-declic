import type { Priorite } from "@/types/consultant";
import { PRIORITE_CONFIG } from "@/types/consultant";

export function PriorityBadge({ priorite }: { priorite: Priorite }) {
  const config = PRIORITE_CONFIG[priorite];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
