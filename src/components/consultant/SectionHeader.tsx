import type { ReactNode } from "react";

export function SectionHeader({
  title,
  subtitle,
  action,
  count,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2">
          <h2
            className="text-lg font-consultant font-bold text-foreground"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-sm font-mono text-foreground-muted">({count})</span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-foreground-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
