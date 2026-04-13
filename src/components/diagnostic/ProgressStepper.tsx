import { cn } from "@/lib/utils";
import type { DomaineId } from "@/types/diagnostic";

interface ProgressStepperProps {
  domains: DomaineId[];
  currentDomain: DomaineId;
  completedDomains: DomaineId[];
  currentQuestionIndex: number;
  totalQuestionsInDomain: number;
}

const domainDisplayNames: Record<DomaineId, string> = {
  documents: "Documents",
  communication: "Communication",
  donnees: "Donnees",
  workflows: "Workflows",
  creatif: "Creatif",
  orchestration: "Orchestration",
};

export default function ProgressStepper({
  domains,
  currentDomain,
  completedDomains,
  currentQuestionIndex,
  totalQuestionsInDomain,
}: ProgressStepperProps) {
  const progress =
    totalQuestionsInDomain > 0
      ? (currentQuestionIndex / totalQuestionsInDomain) * 100
      : 0;

  return (
    <div className="w-full">
      {/* Segments bar */}
      <div className="flex items-center gap-1.5">
        {domains.map((domainId, index) => {
          const isCompleted = completedDomains.includes(domainId);
          const isCurrent = domainId === currentDomain;

          return (
            <div key={domainId} className="flex items-center flex-1 gap-1.5">
              {/* Segment */}
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/[0.06]">
                {isCompleted ? (
                  <div className="h-full w-full bg-emerald-500 rounded-full" />
                ) : isCurrent ? (
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                ) : null}
              </div>

              {/* Dot separator (between segments, not after last) */}
              {index < domains.length - 1 && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    isCompleted ? "bg-emerald-500/60" : "bg-white/[0.12]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current domain label */}
      <div className="flex mt-2">
        {domains.map((domainId) => {
          const isCurrent = domainId === currentDomain;

          return (
            <div key={domainId} className="flex-1 text-center">
              {isCurrent && (
                <span className="text-xs text-violet-400 font-medium">
                  {domainDisplayNames[domainId]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
