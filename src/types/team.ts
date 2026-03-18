import { AnalysisResult, AnalysisSource, AnalysisTask } from "./analysis";

export interface TeamMember {
  id: string;
  metier: string;
  count: number; // number of people with this job
}

export interface TeamJobResult {
  member: TeamMember;
  result: AnalysisResult;
  source: AnalysisSource;
}

export interface TeamAnalysisResult {
  id: string;
  date: string;
  members: TeamMember[];
  results: TeamJobResult[];
}

export interface QuickWin {
  task: AnalysisTask;
  metier: string;
  count: number;
  totalImpact: number; // hours * count
}
