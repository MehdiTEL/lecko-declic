import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, RotateCcw, Filter, Settings, Sparkles, Bot, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ScoreCircle from "@/components/ScoreCircle";
import KPICard from "@/components/KPICard";
import TaskCard from "@/components/TaskCard";
import DeclicCTA from "@/components/DeclicCTA";
import MicroCTA from "@/components/MicroCTA";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";
import DeclicProgress from "@/components/DeclicProgress";
import WhereToStart from "@/components/WhereToStart";
import BenchmarkBanner from "@/components/BenchmarkBanner";
import AccompagnementSplit from "@/components/AccompagnementSplit";
import BadgeShelf from "@/components/BadgeShelf";
import ChallengeCards from "@/components/ChallengeCards";
import ActionPlan from "@/components/ActionPlan";
import { Toast, useToast } from "@/components/Toast";
import { AnalysisResult, AnalysisTask, AnalysisSource, TaskCategory, ToolType, AccompagnementLevel } from "@/types/analysis";
import { DeclicPhase } from "@/types/declic";
import { saveToHistory } from "@/lib/history";
import { getApiKey, getProvider, analyzeJob as callAnalyzeJob } from "@/lib/aiProvider";
import { findInLocalDatabase } from "@/data/jobDatabase";
import { supabase } from "@/integrations/supabase/client";
import { generatePremiumPdf } from "@/lib/pdfReport";
import { usePageContext } from "@/context/PageContext";
import { useProgress } from "@/context/ProgressContext";

type CategoryFilter = "all" | TaskCategory | "easy_wins" | "ai_needed";
type ToolFilter = "all" | ToolType;
type AccompagnementFilter = "all" | AccompagnementLevel;

const TOOL_TYPES: ToolType[] = ["Agent IA", "Workflow N8N", "Automatisation No-Code", "Copilot / Assistant IA", "Script personnalisé"];
const CAT_LABELS: Record<TaskCategory, string> = {
  automatisable: "Automatisable",
  partiellement_automatisable: "Partiellement",
  difficilement_automatisable: "Difficile",
};

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const metier = searchParams.get("metier") ?? "";
  const sharedId = searchParams.get("id");
  const cachedParam = searchParams.get("cached");
  const sourceParam = searchParams.get("source") as AnalysisSource | null;
  const isDemo = searchParams.get("demo") === "1";
  const demoRoiRate = searchParams.get("roiRate");
  const demoRoiPeople = searchParams.get("roiPeople");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisSource, setAnalysisSource] = useState<AnalysisSource>("local");
  const [error, setError] = useState<string | null>(null);
  const [errorShowSettings, setErrorShowSettings] = useState(false);
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [toolFilter, setToolFilter] = useState<ToolFilter>("all");
  const [accompFilter, setAccompFilter] = useState<AccompagnementFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const handleCtaVisible = useCallback((v: boolean) => setCtaVisible(v), []);
  // ROI state (pre-fill from demo params if present)
  const [roiHourlyRate, setRoiHourlyRate] = useState(demoRoiRate ? parseInt(demoRoiRate, 10) : 45);
  const [roiNbPeople, setRoiNbPeople] = useState(demoRoiPeople ? parseInt(demoRoiPeople, 10) : 1);
  const { setPage, setAnalysis, setRoi } = usePageContext();
  const { initAnalysisTracking, setTaskStatus, getTasksForAnalysis, recordUserAction, badgeShelf, activeChallenges } = useProgress();

  const handleRoiParams = useCallback((r: number, p: number) => {
    setRoiHourlyRate(r);
    setRoiNbPeople(p);
    setRoi({ hourlyRate: r, nbPeople: p });
  }, [setRoi]);

  // Sync with PageContext for Copilot awareness
  useEffect(() => { setPage("results"); }, [setPage]);
  useEffect(() => {
    if (result) setAnalysis(result, result.metier);
  }, [result, setAnalysis]);

  // Init progression tracking
  const analysisId = result ? `analysis-${result.metier.toLowerCase().replace(/\s+/g, "-")}` : "";
  useEffect(() => {
    if (result && !isDemo) {
      initAnalysisTracking(analysisId, result.metier, result.taches.map((t) => t.nom));
    }
  }, [result, analysisId, isDemo, initAnalysisTracking]);
  const trackedTasks = getTasksForAnalysis(analysisId);

  const minLoadMs = 3000;

  useEffect(() => {
    if (cachedParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(atob(cachedParam))) as AnalysisResult;
        setResult(parsed);
        setAnalysisSource(sourceParam ?? "local");
        setLoading(false);
      } catch {
        runAnalysis(metier);
      }
    } else if (sharedId) {
      loadShared(sharedId);
    } else if (metier) {
      // Check if local source was requested
      if (sourceParam === "local") {
        const localResult = findInLocalDatabase(metier);
        if (localResult) {
          setResult(localResult);
          setAnalysisSource("local");
          if (!isDemo) {
            saveToHistory({
              id: crypto.randomUUID(),
              metier,
              date: new Date().toISOString(),
              result: localResult,
              source: "local",
            });
          }
          // Small delay for visual polish
          setTimeout(() => setLoading(false), 900);
          return;
        }
      }
      const key = getApiKey();
      if (!key) {
        navigate("/?requireKey=1");
        return;
      }
      runAnalysis(metier);
    } else {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadShared(id: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) throw new Error("Analyse introuvable.");
      setResult(data.resultats as unknown as AnalysisResult);
      setAnalysisSource("api");
    } catch {
      setError("Analyse introuvable ou lien expiré.");
      setErrorShowSettings(false);
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis(job: string, retry = false) {
    const apiKey = getApiKey();
    if (!apiKey) {
      navigate("/?requireKey=1");
      return;
    }

    const startTime = Date.now();
    setLoading(true);
    setError(null);
    setErrorShowSettings(false);

    try {
      const content: string = await callAnalyzeJob(job);

      let parsed: AnalysisResult;
      try {
        parsed = JSON.parse(content);
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Réponse IA invalide. Veuillez réessayer.");
        parsed = JSON.parse(match[0]);
      }

      const elapsed = Date.now() - startTime;
      const remaining = minLoadMs - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      setResult(parsed);
      setAnalysisSource("api");

      if (!isDemo) {
        saveToHistory({
          id: crypto.randomUUID(),
          metier: job,
          date: new Date().toISOString(),
          result: parsed,
          source: "api",
        });

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("analyses") as any).insert({ metier: job, resultats: parsed });
        } catch {
          // silent fail
        }
      }

    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      const remaining = minLoadMs - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      if (!retry && !(err instanceof Error && (err as { showSettings?: boolean }).showSettings)) {
        await runAnalysis(job, true);
        return;
      }

      const e = err as Error & { showSettings?: boolean };
      setError(e.message ?? "Une erreur est survenue. Veuillez réessayer.");
      setErrorShowSettings(!!e.showSettings);
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks: AnalysisTask[] = (result?.taches ?? []).filter((t) => {
    if (catFilter === "easy_wins") return (t.score_criteres ?? 0) >= 3 && t.peut_fonctionner_sans_ia === true;
    if (catFilter === "ai_needed") return t.peut_fonctionner_sans_ia === false;
    if (catFilter !== "all" && t.categorie !== catFilter) return false;
    if (toolFilter !== "all" && t.type_outil !== toolFilter) return false;
    if (accompFilter !== "all" && t.niveau_accompagnement !== accompFilter) return false;
    return true;
  });

  const countByCat = (cat: TaskCategory) => result?.taches.filter((t) => t.categorie === cat).length ?? 0;
  const countByTool = (tool: ToolType) => result?.taches.filter((t) => t.type_outil === tool).length ?? 0;
  const countByAccomp = (level: AccompagnementLevel) => result?.taches.filter((t) => t.niveau_accompagnement === level).length ?? 0;
  const hasAccompagnement = result?.taches.some((t) => t.niveau_accompagnement) ?? false;

  const handleShare = async () => {
    if (!result) return;
    const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
    const url = `${window.location.origin}/resultats?metier=${encodeURIComponent(result.metier)}&cached=${encoded}&source=${analysisSource}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien copié dans le presse-papier !");
      recordUserAction("hasSharedDiagnostic");
    } catch {
      showToast("Erreur lors de la copie du lien.", "error");
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    showToast("Génération du PDF en cours...");
    try {
      generatePremiumPdf({
        result,
        source: analysisSource,
        hourlyRate: roiHourlyRate,
        nbPeople: roiNbPeople,
      });
      showToast("PDF exporté avec succès !");
      recordUserAction("hasExportedPDF");
    } catch {
      showToast("Erreur lors de la génération du PDF.", "error");
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="lecko-card p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Une erreur est survenue</h2>
            <p className="text-foreground-secondary text-sm mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              {errorShowSettings && (
                <Link
                  to="/parametres"
                  className="w-full py-3 flex items-center justify-center gap-2 bg-lecko-orange text-primary-foreground rounded-2xl font-bold hover:bg-lecko-orange/90 transition-colors"
                >
                  <Settings size={15} />
                  Modifier ma clé API
                </Link>
              )}
              <button
                onClick={() => metier && runAnalysis(metier)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-colors"
              >
                Réessayer
              </button>
              <p className="text-xs text-foreground-muted">
                💡 Vous pouvez aussi essayer avec un autre fournisseur dans les{" "}
                <Link to="/parametres" className="text-primary hover:underline">paramètres</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const automatisables = countByCat("automatisable");
  const partiels = countByCat("partiellement_automatisable");
  const provider = getProvider();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            ⚠️ MODE DÉMO — Données fictives à titre d'illustration
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
          >
            Quitter la démo
          </button>
        </div>
      )}

      <div ref={resultsRef}>
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Nouvelle analyse
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                Diagnostic IA pour :{" "}
                <span className="text-lecko-orange">{result.metier}</span>
              </h1>
              {/* Source badge */}
              {analysisSource === "local" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground-muted border border-border">
                  <Sparkles size={11} />
                  Analyse générique
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Bot size={11} />
                  Analyse IA personnalisée{provider ? ` · via ${provider === "openai" ? "OpenAI" : "Claude"}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Score + KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
            <div className="md:col-span-1 flex flex-col items-center lecko-card p-6">
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest mb-3">Score global</p>
              <ScoreCircle score={result.score_global} />
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard value={result.taches.length} label="Tâches analysées" delay={0.1} />
              <KPICard value={automatisables + partiels} label="Automatisables" delay={0.2} />
              <KPICard
                value={result.heures_economisees_semaine}
                suffix="h"
                label="Heures / semaine gagnées"
                delay={0.3}
              />
            </div>
          </div>

          {/* Benchmark */}
          <BenchmarkBanner score={result.score_global} metier={result.metier} hoursPerWeek={result.heures_economisees_semaine} />

          {/* ROI Calculator */}
          <RoiCalculator
            hoursPerWeek={result.heures_economisees_semaine}
            metier={result.metier}
            onParamsChange={handleRoiParams}
          />

          {/* DÉCLIC progress bar */}
          <DeclicProgress
            currentPhase={3}
            completedPhases={[0, 1, 2]}
          />

          {/* Badges & challenges compact */}
          {(badgeShelf.some(b => b.earned) || activeChallenges.length > 0) && (
            <div className="lecko-card p-4 space-y-3">
              {badgeShelf.some(b => b.earned) && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-2">Badges</p>
                  <BadgeShelf badges={badgeShelf} compact />
                </div>
              )}
              {activeChallenges.filter(c => c.status === "active").length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-2">Défis en cours</p>
                  <ChallengeCards challenges={activeChallenges.filter(c => c.status === "active").slice(0, 1)} />
                </div>
              )}
            </div>
          )}

          {/* Accompagnement split */}
          <AccompagnementSplit tasks={result.taches} metier={result.metier} />

          {/* "Par où commencer?" */}
          <WhereToStart
            tasks={result.taches}
            metier={result.metier}
            onFilterEasyWins={() => { setCatFilter("easy_wins"); setToolFilter("all"); setAccompFilter("all"); }}
            onFilterAI={() => { setCatFilter("ai_needed"); setToolFilter("all"); setAccompFilter("all"); }}
            onFilterAccompagnement={(level) => { setAccompFilter(level); setCatFilter("all"); setToolFilter("all"); }}
          />

          {/* Action Plan timeline */}
          <ActionPlan tasks={result.taches} metier={result.metier} />

          {/* Free mode upsell banner */}
          {analysisSource === "local" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lecko-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-lecko-orange/30 bg-lecko-orange/5"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  📊 Cette analyse est basée sur des données génériques
                </p>
                <p className="text-xs text-foreground-secondary">
                  Pour une analyse sur-mesure adaptée à votre contexte spécifique, utilisez le mode API avec votre clé OpenAI ou Anthropic.
                </p>
              </div>
              <Link
                to="/parametres"
                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold bg-lecko-orange text-primary-foreground hover:bg-lecko-orange/90 transition-colors whitespace-nowrap"
              >
                Passer au mode API →
              </Link>
            </motion.div>
          )}

          {/* Filters */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors mb-3"
            >
              <Filter size={15} />
              Filtres
              {(catFilter !== "all" || toolFilter !== "all") && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {[catFilter !== "all" ? 1 : 0, toolFilter !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="lecko-card p-4 space-y-4 mb-4"
              >
                <div>
                  <p className="text-xs font-bold text-foreground-muted uppercase mb-2">Catégorie</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCatFilter("all")}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        catFilter === "all"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      Toutes ({result.taches.length})
                    </button>
                    {(["automatisable", "partiellement_automatisable", "difficilement_automatisable"] as TaskCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCatFilter(cat)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                          catFilter === cat
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                        }`}
                      >
                        {CAT_LABELS[cat]} ({countByCat(cat)})
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground-muted uppercase mb-2">Type d'outil</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setToolFilter("all")}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        toolFilter === "all"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      Tous
                    </button>
                    {TOOL_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setToolFilter(t)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                          toolFilter === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                        }`}
                      >
                        {t} ({countByTool(t)})
                      </button>
                    ))}
                  </div>
                </div>
                {hasAccompagnement && (
                  <div>
                    <p className="text-xs font-bold text-foreground-muted uppercase mb-2">Accompagnement</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setAccompFilter("all")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                          accompFilter === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                        }`}
                      >
                        Tous
                      </button>
                      {(["express", "guide", "consultant"] as AccompagnementLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setAccompFilter(level)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                            accompFilter === level ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground-secondary hover:border-primary hover:text-primary"
                          }`}
                        >
                          {level === "express" ? "⚡ Express" : level === "guide" ? "✨ Guidé" : "👥 Consultant"} ({countByAccomp(level)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <p className="text-sm text-foreground-muted">
              {filteredTasks.length} tâche{filteredTasks.length !== 1 ? "s" : ""} affichée{filteredTasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Task cards */}
          <div className="space-y-3">
            {filteredTasks.map((task, i) => (
              <TaskCard
                key={task.nom + i}
                task={task}
                index={i}
                metier={result?.metier}
                roiPerWeek={task.temps_gagne_heures_semaine * roiHourlyRate * roiNbPeople}
                analysisId={analysisId}
                trackedStatus={trackedTasks.find((t) => t.taskName === task.nom)?.status ?? "todo"}
                onStatusChange={(taskName, status) => setTaskStatus(analysisId, taskName, status)}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="lecko-card p-8 text-center text-foreground-muted">
                Aucune tâche ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>

          {/* DÉCLIC CTA */}
          <DeclicCTA
            score={result.score_global}
            metier={result.metier}
            typeAnalyse="individuel"
            onVisible={handleCtaVisible}
          />
        </main>
      </div>

      {/* Actions */}
      <div className="border-t border-border bg-card px-4 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap gap-3">
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-colors"
          >
            <Download size={15} />
            Exporter en PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm bg-lecko-orange text-primary-foreground hover:bg-lecko-orange/90 hover:shadow-md transition-colors"
          >
            <Share2 size={15} />
            Partager les résultats
          </button>
          <Link
            to="/"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-colors"
          >
            <RotateCcw size={15} />
            Analyser un autre métier
          </Link>
        </div>
        {/* Team upsell */}
        <div className="max-w-5xl mx-auto mt-3">
          <Link
            to="/equipe"
            className="inline-flex items-center gap-2 text-xs text-foreground-muted hover:text-primary transition-colors"
          >
            <Users size={12} />
            Vous gérez une équipe ? Essayez le mode équipe →
          </Link>
        </div>
      </div>

      <Footer />

      <MicroCTA ctaVisible={ctaVisible} metier={result.metier} score={result.score_global} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
