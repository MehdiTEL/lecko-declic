import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import {
  Loader2,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
} from "lucide-react";
import DeclicLogo from "@/components/DeclicLogo";
import { getMission } from "@/lib/consultantDb";
import { updateEntretien } from "@/lib/consultantDb";
import { analyzeJob } from "@/lib/aiProvider";
import { getApiKey } from "@/lib/aiProvider";
import { TOOL_OPTIONS } from "@/types/diagnostic";
import type { Mission, Entretien } from "@/types/consultant";
import type { AnalysisResult } from "@/types/analysis";
import { useEffect } from "react";

// ─── Stepper ──────────────────────────────────────────────────────────────

const STEPS = ["Contexte", "Analyse", "Validation"] as const;

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-10 ${
                  done ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : active
                    ? "border-blue-400 text-blue-400 bg-transparent"
                    : "border-slate-600 text-slate-500 bg-transparent"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={`text-xs ${
                  active ? "text-white font-medium" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Category badge ───────────────────────────────────────────────────────

function CategoryBadge({ cat }: { cat: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    automatisable: {
      bg: "bg-emerald-900/40",
      text: "text-emerald-300",
      label: "Automatisable",
    },
    partiellement_automatisable: {
      bg: "bg-amber-900/40",
      text: "text-amber-300",
      label: "Partiel",
    },
    difficilement_automatisable: {
      bg: "bg-red-900/40",
      text: "text-red-300",
      label: "Difficile",
    },
  };
  const c = cfg[cat] ?? { bg: "bg-slate-700", text: "text-slate-300", label: cat };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

export default function EntretienLive() {
  const { id: missionId, entretienId } = useParams<{
    id: string;
    entretienId: string;
  }>();
  const navigate = useNavigate();

  // data
  const [mission, setMission] = useState<Mission | null>(null);
  const [entretien, setEntretien] = useState<Entretien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // step
  const [step, setStep] = useState(0);

  // step 1 form
  const [taches, setTaches] = useState("");
  const [douleurs, setDouleurs] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // step 2
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0 });
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [notesConsultant, setNotesConsultant] = useState("");
  const [expandedMetier, setExpandedMetier] = useState<string | null>(null);

  // step 3
  const [prochaines, setProchaines] = useState("");
  const [saving, setSaving] = useState(false);

  // ─── Load mission + entretien ────────────────────────────────────────────

  useEffect(() => {
    if (!missionId) return;
    setLoading(true);
    getMission(missionId)
      .then((m) => {
        setMission(m);
        const e = m.entretiens?.find((e) => e.id === entretienId) ?? null;
        setEntretien(e);
        if (!e) setError("Entretien introuvable.");
      })
      .catch(() => setError("Impossible de charger la mission."))
      .finally(() => setLoading(false));
  }, [missionId, entretienId]);

  // ─── Step 2: run analysis ───────────────────────────────────────────────

  const runAnalysis = useCallback(async () => {
    if (!entretien) return;

    setAnalyzing(true);
    setAnalyzeError(null);
    const metiers = entretien.metiers;
    setAnalyzeProgress({ current: 0, total: metiers.length });

    const results: AnalysisResult[] = [];

    for (let i = 0; i < metiers.length; i++) {
      setAnalyzeProgress({ current: i + 1, total: metiers.length });
      try {
        const raw = await analyzeJob(metiers[i]);
        const parsed: AnalysisResult = JSON.parse(raw);
        results.push(parsed);
      } catch (err: any) {
        if (err?.showSettings) {
          setAnalyzeError(
            "Cle API non configuree. Rendez-vous dans les parametres pour en ajouter une."
          );
          setAnalyzing(false);
          return;
        }
        // Fallback: push a stub result
        results.push({
          metier: metiers[i],
          score_global: 0,
          heures_economisees_semaine: 0,
          taches: [],
        });
      }
    }

    setAnalysisResults(results);
    setAnalyzing(false);
  }, [entretien]);

  useEffect(() => {
    if (step === 1 && analysisResults.length === 0 && !analyzing) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ─── Step 3: finish ─────────────────────────────────────────────────────

  const handleFinish = async () => {
    if (!entretien) return;
    setSaving(true);
    try {
      await updateEntretien(entretien.id, {
        resultats: analysisResults,
        notes_consultant: [notesConsultant, prochaines ? `Prochaines etapes: ${prochaines}` : ""]
          .filter(Boolean)
          .join("\n\n"),
        statut: "termine",
      });
      navigate(`/missions/${missionId}`);
    } catch {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Computed summaries ─────────────────────────────────────────────────

  const totalTasks = analysisResults.reduce((s, r) => s + r.taches.length, 0);
  const totalHours = analysisResults.reduce(
    (s, r) => s + r.heures_economisees_semaine,
    0
  );
  const topTasks = analysisResults
    .flatMap((r) => r.taches)
    .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
    .slice(0, 3);

  // ─── Render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error && !entretien) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle size={40} className="mx-auto text-amber-400" />
          <p>{error}</p>
          <button
            onClick={() => navigate(`/missions/${missionId}`)}
            className="text-blue-400 underline text-sm"
          >
            Retour a la mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* ─── Navbar ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <DeclicLogo size="sm" />
          <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full">
            Mode entretien
          </span>
        </div>
        <button
          onClick={() => navigate(`/missions/${missionId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <X size={16} />
          Terminer
        </button>
      </header>

      {/* ─── Stepper ─────────────────────────────────────────── */}
      <Stepper current={step} />

      {/* ─── Content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-12">
        {/* ============= STEP 1 — Contexte ============= */}
        {step === 0 && (
          <div className="space-y-6">
            {/* Mission context card */}
            {mission && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-2">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Contexte de la mission
                </h2>
                <p className="text-white font-medium">
                  {mission.client_organisation} — {entretien?.service_nom}
                </p>
                {mission.outils_actuels.length > 0 && (
                  <p className="text-slate-400 text-sm">
                    Outils : {mission.outils_actuels.join(", ")}
                  </p>
                )}
                {mission.contraintes.length > 0 && (
                  <p className="text-slate-400 text-sm">
                    Contraintes : {mission.contraintes.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Metiers */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">
                Metiers a analyser
              </h3>
              <div className="flex flex-wrap gap-2">
                {entretien?.metiers.map((m) => (
                  <span
                    key={m}
                    className="bg-blue-600/20 text-blue-300 text-sm px-3 py-1 rounded-full"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Taches quotidiennes de l'equipe
                </label>
                <textarea
                  rows={6}
                  value={taches}
                  onChange={(e) => setTaches(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Decrivez les taches principales de l'equipe..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Points de douleur
                </label>
                <textarea
                  rows={3}
                  value={douleurs}
                  onChange={(e) => setDouleurs(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Qu'est-ce qui prend trop de temps, est penible, source d'erreurs..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Outils utilises
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOOL_OPTIONS.map((tool) => (
                    <label
                      key={tool.id}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer border transition-colors ${
                        selectedTools.includes(tool.id)
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selectedTools.includes(tool.id)}
                        onChange={() =>
                          setSelectedTools((prev) =>
                            prev.includes(tool.id)
                              ? prev.filter((t) => t !== tool.id)
                              : [...prev, tool.id]
                          )
                        }
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          selectedTools.includes(tool.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-slate-500"
                        }`}
                      >
                        {selectedTools.includes(tool.id) && (
                          <Check size={10} className="text-white" />
                        )}
                      </div>
                      <span className="truncate">{tool.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Analyser
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============= STEP 2 — Analyse ============= */}
        {step === 1 && (
          <div className="space-y-6">
            {analyzing && (
              <div className="space-y-4 py-8">
                {entretien?.metiers.map((m, i) => {
                  const done = i < analyzeProgress.current - 1;
                  const active = i === analyzeProgress.current - 1;
                  return (
                    <div
                      key={m}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        done
                          ? "bg-emerald-900/20 border border-emerald-800/30"
                          : active
                          ? "bg-slate-800 border border-blue-700/40"
                          : "bg-slate-800/40 border border-slate-700/30"
                      }`}
                    >
                      {done ? (
                        <Check size={18} className="text-emerald-400" />
                      ) : active ? (
                        <Loader2 size={18} className="animate-spin text-blue-400" />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border border-slate-600" />
                      )}
                      <span className={done ? "text-emerald-300" : active ? "text-white" : "text-slate-500"}>
                        Analyse de {m}
                      </span>
                      <span className="ml-auto text-xs text-slate-500">
                        {done
                          ? "OK"
                          : active
                          ? `${analyzeProgress.current}/${analyzeProgress.total}`
                          : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {analyzeError && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 text-sm">{analyzeError}</p>
                  <button
                    onClick={() => navigate("/settings")}
                    className="text-blue-400 text-sm underline mt-1"
                  >
                    Configurer la cle API
                  </button>
                </div>
              </div>
            )}

            {!analyzing && analysisResults.length > 0 && (
              <>
                <h2 className="text-lg font-semibold">Resultats</h2>
                <div className="space-y-4">
                  {analysisResults.map((r) => (
                    <div
                      key={r.metier}
                      className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                        onClick={() =>
                          setExpandedMetier(
                            expandedMetier === r.metier ? null : r.metier
                          )
                        }
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-blue-400">
                            {r.score_global}%
                          </div>
                          <div>
                            <p className="font-medium">{r.metier}</p>
                            <p className="text-sm text-slate-400">
                              {r.taches.length} taches &middot;{" "}
                              {r.heures_economisees_semaine}h/sem
                            </p>
                          </div>
                        </div>
                        {expandedMetier === r.metier ? (
                          <ChevronUp size={18} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400" />
                        )}
                      </button>

                      {expandedMetier === r.metier && (
                        <div className="border-t border-slate-700/50 px-5 py-3 space-y-2">
                          {r.taches.map((t, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{t.nom}</span>
                                <CategoryBadge cat={t.categorie} />
                              </div>
                              <span className="text-xs text-slate-400">
                                {t.temps_gagne_heures_semaine}h/sem
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Notes consultant
                  </label>
                  <textarea
                    rows={4}
                    value={notesConsultant}
                    onChange={(e) => setNotesConsultant(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Vos observations..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Valider
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============= STEP 3 — Validation ============= */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Summary card */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Synthese</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400">
                    {analysisResults.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Metiers analyses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">
                    {totalTasks}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Taches identifiees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400">
                    {totalHours}h
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Heures/semaine
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 tasks */}
            {topTasks.length > 0 && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Top 3 taches par impact
                </h3>
                <div className="space-y-2">
                  {topTasks.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 text-xs flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm">{t.nom}</span>
                      </div>
                      <span className="text-sm text-amber-400 font-medium">
                        {t.temps_gagne_heures_semaine}h/sem
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prochaines etapes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Prochaines etapes
              </label>
              <textarea
                rows={4}
                value={prochaines}
                onChange={(e) => setProchaines(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Actions a planifier suite a cet entretien..."
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Terminer l'entretien
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
