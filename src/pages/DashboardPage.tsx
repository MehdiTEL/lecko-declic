import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DOMAINES } from "@/data/domaines";
import RadarChart from "@/components/diagnostic/RadarChart";
import ScoreGauge from "@/components/diagnostic/ScoreGauge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  LogOut,
  Target,
  BookOpen,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import type { NiveauResultat } from "@/types/diagnostic";

const NIVEAU_TO_BADGE: Record<NiveauResultat, "debutant" | "intermediaire" | "avance" | "expert"> = {
  "Débutant": "debutant",
  "Intermédiaire": "intermediaire",
  "Avancé": "avance",
  "Expert": "expert",
};

interface DiagResult {
  scores: Record<string, number>;
  niveaux: Record<string, NiveauResultat>;
  score_global: number;
  domaines_evalues: string[];
  created_at: string;
}

interface ProgressEntry {
  formation_id: string;
  module_id: string;
  quiz_score: number | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<DiagResult | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/connexion", { replace: true });
      return;
    }

    async function fetchData() {
      // Latest diagnostic
      const { data: diagData } = await supabase
        .from("diagnostic_resultats")
        .select("scores, niveaux, score_global, domaines_evalues, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (diagData && diagData.length > 0) {
        setDiagnostic(diagData[0] as unknown as DiagResult);
      }

      // Formation progress
      const { data: progData } = await supabase
        .from("formation_progression")
        .select("formation_id, module_id, quiz_score")
        .eq("user_id", user!.id);

      if (progData) {
        setProgress(progData as ProgressEntry[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const completedModules = progress.length;
  const avgQuizScore =
    progress.filter((p) => p.quiz_score !== null).length > 0
      ? Math.round(
          progress
            .filter((p) => p.quiz_score !== null)
            .reduce((sum, p) => sum + (p.quiz_score ?? 0), 0) /
            progress.filter((p) => p.quiz_score !== null).length
        )
      : null;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label mb-2">Tableau de bord</p>
            <h1 className="text-heading-xl text-white font-display">
              Bienvenue
            </h1>
            <p className="text-body text-[#8A8AA3] mt-1">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm text-[#8A8AA3] hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>

        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-5 text-center">
            <Target size={20} className="mx-auto text-violet-400 mb-2" />
            <div className="text-2xl font-bold text-white">
              {diagnostic ? `${diagnostic.score_global}%` : "—"}
            </div>
            <p className="text-xs text-[#8A8AA3]">Score global</p>
          </div>
          <div className="glass-card p-5 text-center">
            <BookOpen size={20} className="mx-auto text-cyan-400 mb-2" />
            <div className="text-2xl font-bold text-white">{completedModules}</div>
            <p className="text-xs text-[#8A8AA3]">Modules complétés</p>
          </div>
          <div className="glass-card p-5 text-center">
            <BarChart3 size={20} className="mx-auto text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">
              {avgQuizScore !== null ? `${avgQuizScore}%` : "—"}
            </div>
            <p className="text-xs text-[#8A8AA3]">Score quiz moyen</p>
          </div>
        </div>

        {/* Diagnostic section */}
        {diagnostic ? (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="glass-card p-8 flex flex-col items-center justify-center">
              <p className="text-sm text-[#8A8AA3] mb-4">Dernier diagnostic</p>
              <ScoreGauge score={diagnostic.score_global} size={140} />
            </div>
            <div className="glass-card p-6">
              <RadarChart
                scores={diagnostic.scores as Record<string, number>}
                domainLabels={Object.fromEntries(
                  diagnostic.domaines_evalues.map((d) => [d, DOMAINES[d as keyof typeof DOMAINES]?.titre ?? d])
                )}
              />
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 text-center mb-10">
            <Target size={32} className="mx-auto text-[#55556A] mb-3" />
            <h3 className="text-white font-semibold mb-2">Aucun diagnostic</h3>
            <p className="text-sm text-[#8A8AA3] mb-4">
              Commencez par évaluer votre niveau pour obtenir des recommandations personnalisées.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all"
            >
              Lancer le diagnostic
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Niveaux par domaine */}
        {diagnostic && (
          <div className="mb-10">
            <h2 className="text-heading-md text-white font-display mb-4">Niveaux par domaine</h2>
            <div className="space-y-3">
              {diagnostic.domaines_evalues.map((d) => {
                const score = (diagnostic.scores as Record<string, number>)[d] ?? 0;
                const niveau = ((diagnostic.niveaux as Record<string, NiveauResultat>)[d] ?? "Débutant") as NiveauResultat;
                const domain = DOMAINES[d as keyof typeof DOMAINES];
                return (
                  <div key={d} className="glass-card p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium text-sm">{domain?.titre ?? d}</span>
                        <ScoreBadge level={NIVEAU_TO_BADGE[niveau]} />
                      </div>
                      <ProgressBar value={score} size="sm" />
                    </div>
                    <span className="text-lg font-bold text-white shrink-0">{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/formations"
            className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-3 rounded-full transition-all btn-glow"
          >
            <BookOpen size={18} />
            Continuer les formations
          </Link>
          <Link
            to="/diagnostic"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            Refaire le diagnostic
          </Link>
        </div>
      </div>
    </div>
  );
}
