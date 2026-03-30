import type { LucideIcon } from "lucide-react";

interface KpiItem {
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
  icon: LucideIcon;
}

export function KpiStrip({ kpis }: { kpis: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-mission-border border border-mission-border rounded-2xl overflow-hidden">
      {kpis.map(({ label, value, sublabel, color, icon: Icon }) => (
        <div key={label} className="bg-white px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono uppercase tracking-wide text-foreground-muted">
              {label}
            </p>
            <Icon size={14} strokeWidth={1.5} className="text-foreground-muted/50" />
          </div>
          <p
            className="text-2xl font-consultant font-bold"
            style={{ color, letterSpacing: "-0.02em" }}
          >
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-foreground-muted mt-0.5">{sublabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}
