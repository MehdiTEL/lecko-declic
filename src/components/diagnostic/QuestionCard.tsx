import { cn } from "@/lib/utils";
import type { Question } from "@/types/diagnostic";

interface QuestionCardProps {
  question: Question;
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8">
      {/* Question text */}
      <h2 className="text-lg sm:text-xl text-white font-medium leading-relaxed">
        {question.texte}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-6">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.valeur;

          return (
            <button
              key={option.valeur}
              type="button"
              onClick={() => onSelect(option.valeur)}
              className={cn(
                "flex items-center gap-4 bg-white/[0.02] border rounded-xl p-4 cursor-pointer text-left transition-all duration-200",
                isSelected
                  ? "border-violet-500/50 bg-violet-500/[0.08]"
                  : "border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              {/* Custom radio circle */}
              <span
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? "border-violet-500 bg-violet-500/20"
                    : "border-white/20 bg-transparent"
                )}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                )}
              </span>

              {/* Option label */}
              <span className="text-[#EAEAF0] text-sm">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
