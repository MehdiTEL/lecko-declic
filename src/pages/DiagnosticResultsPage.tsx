import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DOMAINES } from "@/data/domaines";
import RadarChart from "@/components/diagnostic/RadarChart";
import ScoreGauge from "@/components/diagnostic/ScoreGauge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRight, RotateCcw, BookOpen, Save } from "lucide-react";
import type { DiagnosticResult, NiveauResultat } from "@/types/diagnostic";

const NIVEAU_TO_BADGE: Record<NiveauResultat, "debutant" | "intermediaire" | "avance" | "expert"> = {
  "Débutant": "debutant",
  "Intermédiaire": "intermediaire",
  "Avancé": "avance",
  "Expert": "expert",
};

export default function DiagnosticResultsPage() {
  const navigate = useNavigate();

  const result = useMemo<DiagnosticResult | null>(() => {
    try {
      const stored = sessionStorage.getItem("diagnostic_result");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8A8AA3] mb-4">Aucun résultat disponible.</p>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all"
          >
            Lancer le diagnostic
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const radarScores: Record<string, number> = {};
  const radarLabels: Record<string, string> = {};
  for (const d of result.domaines_evalues) {
    radarScores[d] = result.scores[d] ?? 0;
    radarLabels[d] = DOMAINES[d]?.titre ?? d;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-4">Résultats</p>
          <h1 className="text-display text-white font-display mb-4">
            Votre profil IA
          </h1>
          <p className="text-body-lg text-[#8A8AA3]">
            Voici votre niveau de maturité sur les domaines évalués.
          </p>
        </div>

        {/* Global score + Radar */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Score global */}
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <p className="text-sm text-[#8A8AA3] mb-4">Score global</p>
            <ScoreGauge score={Math.round(result.score_global)} size={160} />
          </div>

          {/* Radar */}
          <div className="glass-card p-6">
            <RadarChart scores={radarScores} domainLabels={radarLabels} />
          </div>
        </div>

        {/* Detail per domain */}
        <div className="space-y-4 mb-12">
          <h2 className="text-heading-md text-white font-display">Détail par domaine</h2>
          {result.domaines_evalues.map((d) => {
            const score = result.scores[d] ?? 0;
            const niveau = result.niveaux[d] ?? "Débutant";
            const domain = DOMAINES[d];
            return (
              <div key={d} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-semibold">{domain?.titre ?? d}</span>
                    <ScoreBadge level={NIVEAU_TO_BADGE[niveau]} />
                  </div>
                  <ProgressBar value={score} size="sm" />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-bold text-white">{Math.round(score)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/formations"
            className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-3 rounded-full transition-all btn-glow"
          >
            <BookOpen size={18} />
            Voir les formations recommandées
          </Link>
          <Link
            to="/connexion"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            <Save size={18} />
            Sauvegarder mes résultats
          </Link>
          <button
            onClick={() => navigate("/diagnostic")}
            className="inline-flex items-center justify-center gap-2 text-[#8A8AA3] hover:text-white font-semibold px-6 py-3 transition-colors"
          >
            <RotateCcw size={16} />
            Recommencer
          </button>
        </div>
      </div>
    </div>
  );
}
