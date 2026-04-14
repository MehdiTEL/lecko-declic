import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

function ProgressBar({
  value,
  className,
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "w-full bg-white/[0.06] rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-[width] duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[#8A8AA3] tabular-nums shrink-0">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };
