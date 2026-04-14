import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import type { QuizQuestion } from "@/types/formation";

interface QuizBlockProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function QuizBlock({ questions, onComplete }: QuizBlockProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIdx];
  if (!question && !finished) return null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleValidate = () => {
    if (selected === null || answered) return;
    setAnswered(true);
    if (selected === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const finalScore = correctCount + (selected === question.correctIndex ? 1 : 0) - (answered && selected === question.correctIndex ? 0 : 0);
      setFinished(true);
      onComplete?.(correctCount, questions.length);
    }
  };

  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl font-bold text-white mb-2">{percent}%</div>
        <p className="text-[#8A8AA3] mb-1">
          {correctCount}/{questions.length} réponses correctes
        </p>
        <p className="text-sm text-[#55556A]">
          {percent >= 70 ? "Excellent ! Module validé." : "Continuez à apprendre et réessayez."}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8A8AA3]">
          Question {currentIdx + 1}/{questions.length}
        </p>
      </div>

      <h4 className="text-white font-semibold mb-4">{question.question}</h4>

      <div className="space-y-2 mb-6">
        {question.options.map((option, idx) => {
          let style = "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]";
          if (answered) {
            if (idx === question.correctIndex) {
              style = "bg-green-500/10 border-green-500/30";
            } else if (idx === selected) {
              style = "bg-red-500/10 border-red-500/30";
            }
          } else if (idx === selected) {
            style = "bg-violet-500/10 border-violet-500/30";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style} ${
                answered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                {answered && idx === question.correctIndex && (
                  <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                )}
                {answered && idx === selected && idx !== question.correctIndex && (
                  <XCircle size={16} className="text-red-400 shrink-0" />
                )}
                <span className="text-[#C8C8D8]">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-[#C8C8D8]">{question.explication}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!answered ? (
          <button
            onClick={handleValidate}
            disabled={selected === null}
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-full transition-all text-sm"
          >
            Valider
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all text-sm"
          >
            {currentIdx < questions.length - 1 ? "Suivant" : "Terminer"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
