import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { AnalysisResult } from "@/types/analysis";

export type PageName =
  | "landing"
  | "results"
  | "equipe"
  | "equipe_results"
  | "methode"
  | "history"
  | "settings"
  | "unknown";

interface PageState {
  currentPage: PageName;
  analysisResult: AnalysisResult | null;
  metier: string | null;
  roiParams: { hourlyRate: number; nbPeople: number } | null;
}

interface PageContextValue extends PageState {
  setPage: (page: PageName) => void;
  setAnalysis: (result: AnalysisResult, metier: string) => void;
  setRoi: (params: { hourlyRate: number; nbPeople: number }) => void;
  clearAnalysis: () => void;
}

const PageContext = createContext<PageContextValue | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PageState>({
    currentPage: "unknown",
    analysisResult: null,
    metier: null,
    roiParams: null,
  });

  const setPage = useCallback((page: PageName) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setAnalysis = useCallback((result: AnalysisResult, metier: string) => {
    setState((prev) => ({ ...prev, analysisResult: result, metier }));
  }, []);

  const setRoi = useCallback((params: { hourlyRate: number; nbPeople: number }) => {
    setState((prev) => ({ ...prev, roiParams: params }));
  }, []);

  const clearAnalysis = useCallback(() => {
    setState((prev) => ({ ...prev, analysisResult: null, metier: null, roiParams: null }));
  }, []);

  return (
    <PageContext.Provider value={{ ...state, setPage, setAnalysis, setRoi, clearAnalysis }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used inside PageProvider");
  return ctx;
}
