import * as React from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

function GlassCard({ children, className, interactive = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 transition-all duration-200 ease-out",
        interactive &&
          "hover:border-white/[0.12] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export { GlassCard };
export type { GlassCardProps };
