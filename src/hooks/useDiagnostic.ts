import { useState, useCallback, useMemo } from "react";
import type { DomaineId, DiagnosticResult } from "@/types/diagnostic";
import { QUESTIONS } from "@/data/diagnostic-questions";
import { calculateScores } from "@/lib/scoring";

interface DiagnosticState {
  selectedDomains: DomaineId[];
  answers: Record<string, number>;
  currentDomainIndex: number;
  currentQuestionIndex: number;
  result: DiagnosticResult | null;
  phase: "select" | "test" | "results";
}

export function useDiagnostic() {
  const [state, setState] = useState<DiagnosticState>({
    selectedDomains: [],
    answers: {},
    currentDomainIndex: 0,
    currentQuestionIndex: 0,
    result: null,
    phase: "select",
  });

  const toggleDomain = useCallback((id: DomaineId) => {
    setState((prev) => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(id)
        ? prev.selectedDomains.filter((d) => d !== id)
        : [...prev.selectedDomains, id],
    }));
  }, []);

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => state.selectedDomains.includes(q.domaine));
  }, [state.selectedDomains]);

  const questionsByDomain = useMemo(() => {
    const map: Partial<Record<DomaineId, typeof QUESTIONS>> = {};
    for (const d of state.selectedDomains) {
      map[d] = filteredQuestions.filter((q) => q.domaine === d);
    }
    return map;
  }, [state.selectedDomains, filteredQuestions]);

  const currentDomain = state.selectedDomains[state.currentDomainIndex] as DomaineId | undefined;

  const currentDomainQuestions = currentDomain ? questionsByDomain[currentDomain] ?? [] : [];

  const currentQuestion = currentDomainQuestions[state.currentQuestionIndex] ?? null;

  const completedDomains = useMemo(() => {
    return state.selectedDomains.slice(0, state.currentDomainIndex);
  }, [state.selectedDomains, state.currentDomainIndex]);

  const totalQuestions = filteredQuestions.length;
  const answeredCount = Object.keys(state.answers).length;

  const estimatedMinutes = Math.ceil(state.selectedDomains.length * 2.5);

  const selectAnswer = useCallback((questionId: string, value: number) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const canGoNext = currentQuestion ? state.answers[currentQuestion.id] !== undefined : false;

  const goNext = useCallback(() => {
    setState((prev) => {
      const domainQs = questionsByDomain[prev.selectedDomains[prev.currentDomainIndex]] ?? [];
      if (prev.currentQuestionIndex < domainQs.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      if (prev.currentDomainIndex < prev.selectedDomains.length - 1) {
        return { ...prev, currentDomainIndex: prev.currentDomainIndex + 1, currentQuestionIndex: 0 };
      }
      // Finished — calculate results
      const result = calculateScores(prev.answers, prev.selectedDomains);
      return { ...prev, result, phase: "results" as const };
    });
  }, [questionsByDomain]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      if (prev.currentDomainIndex > 0) {
        const prevDomain = prev.selectedDomains[prev.currentDomainIndex - 1];
        const prevDomainQs = questionsByDomain[prevDomain] ?? [];
        return {
          ...prev,
          currentDomainIndex: prev.currentDomainIndex - 1,
          currentQuestionIndex: prevDomainQs.length - 1,
        };
      }
      return prev;
    });
  }, [questionsByDomain]);

  const startTest = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "test", currentDomainIndex: 0, currentQuestionIndex: 0 }));
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedDomains: [],
      answers: {},
      currentDomainIndex: 0,
      currentQuestionIndex: 0,
      result: null,
      phase: "select",
    });
  }, []);

  return {
    ...state,
    currentDomain,
    currentQuestion,
    currentDomainQuestions,
    completedDomains,
    totalQuestions,
    answeredCount,
    estimatedMinutes,
    canGoNext,
    toggleDomain,
    selectAnswer,
    goNext,
    goPrev,
    startTest,
    reset,
  };
}
