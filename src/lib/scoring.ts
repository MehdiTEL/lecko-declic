import { DomaineId, DiagnosticResult, NiveauResultat } from '../types/diagnostic';
import { QUESTIONS } from '../data/diagnostic-questions';

function getNiveau(score: number): NiveauResultat {
  if (score <= 25) return 'Débutant';
  if (score <= 50) return 'Intermédiaire';
  if (score <= 75) return 'Avancé';
  return 'Expert';
}

export function calculateScores(
  answers: Record<string, number>,
  domaines: DomaineId[]
): DiagnosticResult {
  const scores = {} as Record<DomaineId, number>;
  const niveaux = {} as Record<DomaineId, NiveauResultat>;

  for (const domaine of domaines) {
    const questions = QUESTIONS.filter((q) => q.domaine === domaine);
    const answeredQuestions = questions.filter((q) => answers[q.id] !== undefined);

    if (answeredQuestions.length === 0) {
      scores[domaine] = 0;
      niveaux[domaine] = 'Débutant';
      continue;
    }

    const totalPoints = answeredQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const maxPoints = answeredQuestions.length * 3;
    const score = Math.round((totalPoints / maxPoints) * 100);

    scores[domaine] = score;
    niveaux[domaine] = getNiveau(score);
  }

  const evaluatedScores = domaines.map((d) => scores[d]);
  const score_global =
    evaluatedScores.length > 0
      ? Math.round(evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length)
      : 0;

  return {
    domaines_evalues: domaines,
    scores,
    niveaux,
    score_global,
  };
}
