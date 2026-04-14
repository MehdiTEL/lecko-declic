import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "@/data/diagnostic-questions";
import { DOMAINES } from "@/data/domaines";
import { calculateScores } from "@/lib/scoring";
import QuestionCard from "@/components/diagnostic/QuestionCard";
import ProgressStepper from "@/components/diagnostic/ProgressStepper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DomaineId } from "@/types/diagnostic";

export default function DiagnosticTestPage() {
  const navigate = useNavigate();

  const selectedDomains = useMemo<DomaineId[]>(() => {
    try {
      const stored = sessionStorage.getItem("diagnostic_domains");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [domainIdx, setDomainIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);

  useEffect(() => {
    if (selectedDomains.length === 0) {
      navigate("/diagnostic");
    }
  }, [selectedDomains, navigate]);

  const questionsByDomain = useMemo(() => {
    const map: Record<string, typeof QUESTIONS> = {};
    for (const d of selectedDomains) {
      map[d] = QUESTIONS.filter((q) => q.domaine === d);
    }
    return map;
  }, [selectedDomains]);

  const currentDomain = selectedDomains[domainIdx];
  const currentDomainQs = currentDomain ? questionsByDomain[currentDomain] ?? [] : [];
  const currentQuestion = currentDomainQs[questionIdx] ?? null;

  const completedDomains = selectedDomains.slice(0, domainIdx);
  const totalQuestions = selectedDomains.reduce((sum, d) => sum + (questionsByDomain[d]?.length ?? 0), 0);
  const answeredCount = Object.keys(answers).length;

  const canGoNext = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const isFirst = domainIdx === 0 && questionIdx === 0;

  const handleSelect = useCallback((value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  const goNext = () => {
    if (questionIdx < currentDomainQs.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else if (domainIdx < selectedDomains.length - 1) {
      setDomainIdx((i) => i + 1);
      setQuestionIdx(0);
    } else {
      // Finished
      const result = calculateScores(answers, selectedDomains);
      sessionStorage.setItem("diagnostic_result", JSON.stringify(result));
      navigate("/diagnostic/resultats");
    }
  };

  const goPrev = () => {
    if (questionIdx > 0) {
      setQuestionIdx((i) => i - 1);
    } else if (domainIdx > 0) {
      const prevDomain = selectedDomains[domainIdx - 1];
      const prevQs = questionsByDomain[prevDomain] ?? [];
      setDomainIdx((i) => i - 1);
      setQuestionIdx(prevQs.length - 1);
    }
  };

  if (!currentQuestion || selectedDomains.length === 0) return null;

  const domainLabel = DOMAINES[currentDomain]?.titre ?? currentDomain;
  const isLastQuestion = domainIdx === selectedDomains.length - 1 && questionIdx === currentDomainQs.length - 1;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Progress */}
        <ProgressStepper
          domains={selectedDomains}
          currentDomain={currentDomain}
          completedDomains={completedDomains}
          currentQuestionIndex={questionIdx}
          totalQuestionsInDomain={currentDomainQs.length}
        />

        {/* Domain label */}
        <div className="mt-8 mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-[#8A8AA3]">
            {domainLabel} · Question {questionIdx + 1}/{currentDomainQs.length}
          </p>
          <p className="text-xs text-[#55556A]">
            {answeredCount}/{totalQuestions} total
          </p>
        </div>

        {/* Question */}
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedValue={answers[currentQuestion.id] ?? null}
          onSelect={handleSelect}
        />

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="inline-flex items-center gap-2 text-sm text-[#8A8AA3] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} />
            Précédent
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200"
          >
            {isLastQuestion ? "Voir mes résultats" : "Suivant"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
