import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import {
  Loader2, ArrowRight, ArrowLeft, X, AlertTriangle,
  Sparkles, CheckCircle, Building2, Search, User2, Gamepad2, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMission, updateEntretien } from "@/lib/consultantDb";
import { analyzeJob } from "@/lib/aiProvider";
import type { Mission, Entretien } from "@/types/consultant";
import type { AnalysisResult } from "@/types/analysis";

import PhaseDecouverte, { type DecouverteData } from "@/components/consultant/entretien/PhaseDecouverte";
import PhaseZoomMetier, { type MetierZoom } from "@/components/consultant/entretien/PhaseZoomMetier";
import PhaseAnalyse from "@/components/consultant/entretien/PhaseAnalyse";
import PhaseTriCollab, { type TaskWithDecision } from "@/components/consultant/entretien/PhaseTriCollab";
import PhaseSynthese from "@/components/consultant/entretien/PhaseSynthese";

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: "decouverte", label: "Découverte", icon: Building2, color: "#2563EB" },
  { id: "zoom", label: "Zoom métier", icon: Search, color: "#7C3AED" },
  { id: "analyse", label: "Analyse IA", icon: Sparkles, color: "#F59E0B" },
  { id: "tri", label: "Tri collab.", icon: Gamepad2, color: "#10B981" },
  { id: "synthese", label: "Synthèse", icon: BarChart3, color: "#EC4899" },
] as const;

// ─── Default data factories ───────────────────────────────────────────────────

function createDefaultDecouverte(): DecouverteData {
  return {
    nbPersonnes: 10,
    heuresAdminParSemaine: 5,
    pourcentageRepetitif: 40,
    periodesPointe: [],
    repartitionTravail: "",
    selectedTools: [],
    satisfactionOutils: 3,
    outilsManquants: "",
    douleursPredefinies: [],
    douleursLibre: "",
    ambitions: "",
    tempsLibereUtilisation: "",
  };
}

function createDefaultMetierZooms(metiers: string[]): MetierZoom[] {
  return metiers.map((m) => ({
    metier: m,
    journeeType: "",
    taches: [],
    fluxDonnees: "",
    irritantMajeur: "",
  }));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EntretienLive() {
  const { id: missionId, entretienId } = useParams<{ id: string; entretienId: string }>();
  const navigate = useNavigate();

  // ── Data loading
  const [mission, setMission] = useState<Mission | null>(null);
  const [entretien, setEntretien] = useState<Entretien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Navigation
  const [currentStep, setCurrentStep] = useState(0);

  // ── Phase 1: Découverte
  const [decouverte, setDecouverte] = useState<DecouverteData>(createDefaultDecouverte());

  // ── Phase 2: Zoom Métier
  const [metierZooms, setMetierZooms] = useState<MetierZoom[]>([]);

  // ── Phase 3: Analyse
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0, currentMetier: "" });
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // ── DEV: expose state setters for demo/testing (remove in prod) ──
  useEffect(() => {
    (window as any).__entretienDemo = {
      setResults: (r: AnalysisResult[]) => { setAnalysisResults(r); setAnalysisStarted(true); },
      setStep: (s: number) => setCurrentStep(s),
      setDecisions: (d: TaskWithDecision[]) => setDecisions(d),
    };
    return () => { delete (window as any).__entretienDemo; };
  }, []);

  // ── Phase 4: Tri collaboratif
  const [decisions, setDecisions] = useState<TaskWithDecision[]>([]);

  // ── Phase 5: Synthèse
  const [notesConsultant, setNotesConsultant] = useState("");
  const [prochaines, setProchaines] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Sidebar notes visible
  const [showNotes, setShowNotes] = useState(true);

  // ─── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!missionId) return;
    setLoading(true);
    getMission(missionId)
      .then((m) => {
        setMission(m);
        const e = m.entretiens?.find((e) => e.id === entretienId) ?? null;
        setEntretien(e);
        if (!e) {
          setError("Entretien introuvable.");
        } else {
          setDecouverte((prev) => ({ ...prev, nbPersonnes: e.nb_personnes || 10 }));
          setMetierZooms(createDefaultMetierZooms(e.metiers));
        }
      })
      .catch(() => setError("Impossible de charger la mission."))
      .finally(() => setLoading(false));
  }, [missionId, entretienId]);

  // ─── Build enriched prompt context ──────────────────────────────────────────
  const buildContextPrompt = useCallback(
    (metier: string) => {
      const zoom = metierZooms.find((z) => z.metier === metier);
      const painLabels = decouverte.douleursPredefinies.join(", ");
      const tools = decouverte.selectedTools.join(", ");

      const parts = [
        `Métier : ${metier}`,
        `Organisation : ${mission?.client_organisation ?? ""}`,
        `Secteur : ${mission?.client_secteur ?? ""}`,
        `Taille équipe : ${decouverte.nbPersonnes} personnes`,
        `Heures admin/sem estimées : ${decouverte.heuresAdminParSemaine}h`,
        `% répétitif : ${decouverte.pourcentageRepetitif}%`,
        tools ? `Outils utilisés : ${tools}` : "",
        `Satisfaction outils : ${decouverte.satisfactionOutils}/5`,
        painLabels ? `Points de friction identifiés : ${painLabels}` : "",
        decouverte.douleursLibre ? `Douleurs complémentaires : ${decouverte.douleursLibre}` : "",
        decouverte.ambitions ? `Ambitions du service : ${decouverte.ambitions}` : "",
        zoom?.journeeType ? `Journée type ${metier} : ${zoom.journeeType}` : "",
        zoom?.taches.length
          ? `Tâches décrites :\n${zoom.taches
              .map((t) => `- ${t.nom} (${t.frequence}, ${t.tempsEstime}h, pénibilité ${t.penibilite}/5)${t.description ? ` : ${t.description}` : ""}`)
              .join("\n")}`
          : "",
        zoom?.fluxDonnees ? `Flux de données : ${zoom.fluxDonnees}` : "",
        zoom?.irritantMajeur ? `Irritant n°1 : ${zoom.irritantMajeur}` : "",
        mission?.contexte_si ? `Contexte SI : ${mission.contexte_si}` : "",
        mission?.contraintes?.length ? `Contraintes : ${mission.contraintes.join(", ")}` : "",
        decouverte.outilsManquants ? `Outils manquants : ${decouverte.outilsManquants}` : "",
      ];

      return parts.filter(Boolean).join("\n");
    },
    [decouverte, metierZooms, mission]
  );

  // ─── Analysis ───────────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async () => {
    if (!entretien) return;
    setAnalyzing(true);
    setAnalysisStarted(true);
    setAnalyzeError(null);

    const metiers = entretien.metiers;
    setAnalyzeProgress({ current: 0, total: metiers.length, currentMetier: "" });

    const results: AnalysisResult[] = [];
    for (let i = 0; i < metiers.length; i++) {
      setAnalyzeProgress({ current: i + 1, total: metiers.length, currentMetier: metiers[i] });
      try {
        const contextPrompt = buildContextPrompt(metiers[i]);
        const raw = await analyzeJob(contextPrompt);
        const parsed: AnalysisResult = JSON.parse(raw);
        results.push(parsed);
      } catch (err: any) {
        if (err?.showSettings) {
          setAnalyzeError("Clé API non configurée. Configurez votre clé dans les paramètres.");
          setAnalyzing(false);
          return;
        }
        results.push({ metier: metiers[i], score_global: 0, heures_economisees_semaine: 0, taches: [] });
      }
    }

    setAnalysisResults(results);
    setAnalyzing(false);

    // Initialize decisions from results
    const allDecisions: TaskWithDecision[] = results.flatMap((r) =>
      r.taches.map((task) => ({ task, metier: r.metier, decision: null }))
    );
    setDecisions(allDecisions);
  }, [entretien, buildContextPrompt]);

  // ─── Finish ─────────────────────────────────────────────────────────────────
  const handleFinish = async () => {
    if (!entretien) return;
    setSaving(true);
    try {
      // Build enriched notes
      const validated = decisions.filter((d) => d.decision === "on_fonce");
      const toExplore = decisions.filter((d) => d.decision === "a_creuser");

      const fullNotes = [
        notesConsultant,
        `--- TRI COLLABORATIF ---`,
        `Validés (${validated.length}): ${validated.map((d) => d.task.nom).join(", ")}`,
        toExplore.length > 0 ? `À creuser (${toExplore.length}): ${toExplore.map((d) => d.task.nom).join(", ")}` : "",
        prochaines ? `--- PROCHAINES ÉTAPES ---\n${prochaines}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      // Filter results to only keep validated + to-explore tasks
      const keptTaskNames = new Set([
        ...validated.map((d) => d.task.nom),
        ...toExplore.map((d) => d.task.nom),
      ]);

      const filteredResults = analysisResults.map((r) => ({
        ...r,
        taches: r.taches.filter((t) => keptTaskNames.has(t.nom)),
      }));

      await updateEntretien(entretien.id, {
        resultats: filteredResults,
        notes_consultant: fullNotes,
        statut: "termine",
      });
      navigate(`/missions/${missionId}`);
    } catch {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const canGoNext = () => {
    if (currentStep === 2 && !analysisStarted) return false;
    if (currentStep === 2 && analyzing) return false;
    if (currentStep === 2 && analysisResults.length === 0 && analysisStarted) return false;
    return true;
  };

  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));
  const goNext = () => setCurrentStep((s) => Math.min(4, s + 1));

  // ─── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-consultant">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error && !entretien) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-consultant">
        <div className="text-center space-y-3">
          <AlertTriangle size={40} className="mx-auto text-amber-400" />
          <p>{error}</p>
          <button onClick={() => navigate(`/missions/${missionId}`)} className="text-brand-blue underline text-sm">
            Retour à la mission
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-consultant">
      {/* ── Header ── */}
      <header className="h-14 flex items-center justify-between px-8 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <img src="/logo-declic.png" alt="DÉCLIC" style={{ height: "20px", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
          <span className="text-slate-500 text-xs font-mono">·</span>
          <span className="text-slate-300 text-sm font-medium">
            {entretien?.service_nom}
          </span>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center gap-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = currentStep === i;
            const isDone = currentStep > i;
            return (
              <div key={step.id} className="flex items-center">
                {i > 0 && (
                  <div className={cn("w-6 h-px mx-1", isDone ? "bg-slate-600" : "bg-slate-800")} />
                )}
                <button
                  onClick={() => {
                    // Allow going back, but not forward past analysis without results
                    if (i <= currentStep || (i < 3 || analysisResults.length > 0)) {
                      setCurrentStep(i);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                    isActive
                      ? "text-white border"
                      : isDone
                      ? "text-slate-400"
                      : "text-slate-600"
                  )}
                  style={isActive ? { backgroundColor: `${step.color}15`, borderColor: `${step.color}40`, color: step.color } : {}}
                >
                  {isDone ? (
                    <CheckCircle size={12} strokeWidth={2} className="text-slate-500" />
                  ) : (
                    <Icon size={12} style={isActive ? { color: step.color } : {}} />
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate(`/missions/${missionId}`)}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5"
        >
          <X size={15} strokeWidth={1.5} />
          <span className="hidden sm:inline">Quitter</span>
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
          {/* Phase 1 — Découverte */}
          {currentStep === 0 && entretien && (
            <PhaseDecouverte
              serviceName={entretien.service_nom}
              metiers={entretien.metiers}
              data={decouverte}
              onChange={setDecouverte}
            />
          )}

          {/* Phase 2 — Zoom Métier */}
          {currentStep === 1 && entretien && (
            <PhaseZoomMetier
              metiers={entretien.metiers}
              data={metierZooms}
              onChange={setMetierZooms}
            />
          )}

          {/* Phase 3 — Analyse IA */}
          {currentStep === 2 && (
            <PhaseAnalyse
              analyzing={analyzing}
              progress={analyzeProgress}
              results={analysisResults}
              error={analyzeError}
              onRetry={runAnalysis}
              onConfigureKey={() => navigate("/parametres")}
            />
          )}

          {/* Phase 4 — Tri Collaboratif */}
          {currentStep === 3 && (
            <PhaseTriCollab
              results={analysisResults}
              decisions={decisions}
              onDecisionsChange={setDecisions}
            />
          )}

          {/* Phase 5 — Synthèse */}
          {currentStep === 4 && entretien && (
            <PhaseSynthese
              serviceName={entretien.service_nom}
              results={analysisResults}
              decisions={decisions}
              nbPersonnes={decouverte.nbPersonnes}
              notesConsultant={notesConsultant}
              onNotesChange={setNotesConsultant}
              prochaines={prochaines}
              onProchainesChange={setProchaines}
            />
          )}
        </div>

        {/* Notes panel (desktop only, phases 0-2) */}
        {showNotes && currentStep <= 2 && (
          <aside className="hidden lg:flex w-72 border-l border-slate-800 flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                Notes consultant
              </p>
              <button onClick={() => setShowNotes(false)} className="text-slate-600 hover:text-slate-400">
                <X size={12} />
              </button>
            </div>
            <textarea
              value={notesConsultant}
              onChange={(e) => setNotesConsultant(e.target.value)}
              placeholder="Observations, nuances, signaux faibles..."
              className="flex-1 bg-transparent text-slate-300 text-sm p-4 resize-none placeholder:text-slate-600 outline-none leading-relaxed"
            />
          </aside>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="h-16 border-t border-slate-800 flex items-center justify-between px-8 flex-shrink-0">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm disabled:opacity-30"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Précédent
        </button>

        {/* Center action */}
        <div>
          {/* Phase 3: launch analysis */}
          {currentStep === 2 && !analysisStarted && (
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 h-11 px-8 rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-blue/25 hover:-translate-y-0.5 transition-all"
            >
              <Sparkles size={16} strokeWidth={1.5} />
              Lancer l'analyse IA
            </button>
          )}

          {/* Phase 5: finish */}
          {currentStep === 4 && (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex items-center gap-2 h-11 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} strokeWidth={2} />}
              Terminer & sauvegarder
            </button>
          )}
        </div>

        {/* Next */}
        {currentStep < 4 && (currentStep !== 2 || (analysisStarted && !analyzing && analysisResults.length > 0)) && (
          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2 h-10 px-6 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all disabled:opacity-30"
          >
            Suivant
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        )}

        {/* Invisible spacer when no next button */}
        {(currentStep === 4 || (currentStep === 2 && (!analysisStarted || analyzing || analysisResults.length === 0))) && (
          <div className="w-24" />
        )}
      </footer>
    </div>
  );
}
