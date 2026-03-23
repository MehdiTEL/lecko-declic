import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, Settings, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import TaskCard from "@/components/TaskCard";
import DeclicCTA from "@/components/DeclicCTA";
import Footer from "@/components/Footer";
import ConsultantContactForm from "@/components/ConsultantContactForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Toast, useToast } from "@/components/Toast";
import { AnalysisResult, AnalysisTask, AnalysisSource, TaskCategory, ToolType, AccompagnementLevel } from "@/types/analysis";
// DeclicPhase removed — phases no longer displayed in results page
import { saveToHistory } from "@/lib/history";
import { getApiKey, getProvider, analyzeJob as callAnalyzeJob } from "@/lib/aiProvider";
import { findInLocalDatabase } from "@/data/jobDatabase";
import { supabase } from "@/integrations/supabase/client";
import { generatePremiumPdf } from "@/lib/pdfReport";
import { analyzeJobPersonalized } from "@/lib/aiProvider";
import type { DiagnosticFormData } from "@/types/diagnostic";
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
  const isPersonnalise = searchParams.get("mode") === "personnalise";
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
  const [showConceptionForm, setShowConceptionForm] = useState(false);
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

  const minLoadMs = 5500;

  useEffect(() => {
    if (isPersonnalise) {
      // Personalized mode: load form data from sessionStorage and run personalized analysis
      runPersonalizedAnalysis();
      return;
    }
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
          setTimeout(() => setLoading(false), 5500);
          return;
        }
      }
      const key = getApiKey();
      if (!key) {
        setError("L'analyse IA nécessite une clé API. Configurez-la dans les paramètres pour analyser ce métier, ou choisissez un métier de la base gratuite (Chef de projet, Comptable, etc.).");
        setErrorShowSettings(true);
        setLoading(false);
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

  async function runPersonalizedAnalysis() {
    const raw = sessionStorage.getItem("declic-diagnostic-form");
    if (!raw) { navigate("/diagnostic"); return; }
    try {
      const formData: DiagnosticFormData = JSON.parse(raw);
      setLoading(true);
      const startTime = Date.now();
      const responseText = await analyzeJobPersonalized(formData);
      const parsed = JSON.parse(responseText) as AnalysisResult;
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadMs) await new Promise((r) => setTimeout(r, minLoadMs - elapsed));
      setResult(parsed);
      setAnalysisSource("api");
      saveToHistory({ id: crypto.randomUUID(), metier: parsed.metier, date: new Date().toISOString(), result: parsed, source: "api" });
      sessionStorage.removeItem("declic-diagnostic-form");
    } catch (err: unknown) {
      const e = err as Error & { showSettings?: boolean };
      setError(e.message ?? "Erreur lors de l'analyse personnalisée.");
      setErrorShowSettings(!!e.showSettings);
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis(job: string) {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError("L'analyse IA nécessite une clé API. Configurez-la dans les paramètres pour analyser ce métier, ou choisissez un métier de la base gratuite (Chef de projet, Comptable, etc.).");
      setErrorShowSettings(true);
      setLoading(false);
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

  if (loading) return <LoadingScreen metier={metier} />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="lecko-card p-8 max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-destructive" /></div>
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
                Vous pouvez aussi essayer avec un autre fournisseur dans les{" "}
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

  const annualSaving = Math.round(result.heures_economisees_semaine * roiHourlyRate * 47);
  const annualHours = Math.round(result.heures_economisees_semaine * 47);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">MODE DEMO</p>
          <button onClick={() => navigate("/")} className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline">Quitter</button>
        </div>
      )}

      {/* ═══════════ ZONE A — Résumé héro ═══════════ */}
      <div ref={resultsRef} className="bg-card border-b border-border px-4 py-8">
        <div className="max-w-4xl mx-auto">

          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors mb-6">
            <ArrowLeft size={15} /> Nouvelle analyse
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <h1 className="text-2xl font-bold text-foreground">{result.metier}</h1>
            {analysisSource === "local" ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-foreground-muted">Express</span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-primary" style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}>Personnalisé</span>
            )}
          </div>

          {/* KPIs grid — 2 rows */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
              <p className="text-4xl md:text-5xl font-bold text-primary leading-none">{result.score_global}%</p>
              <p className="text-xs text-foreground-muted mt-1.5 font-medium">Score d'automatisation</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-foreground leading-none">{result.taches.length}</p>
              <p className="text-xs text-foreground-muted mt-1.5">taches analysées</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-foreground leading-none">{automatisables + partiels}</p>
              <p className="text-xs text-foreground-muted mt-1.5">automatisables</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-lecko-orange leading-none">{result.heures_economisees_semaine}h</p>
              <p className="text-xs text-foreground-muted mt-1.5">par semaine</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-foreground leading-none">~{annualSaving.toLocaleString("fr-FR")}€</p>
              <p className="text-xs text-foreground-muted mt-1.5">par an</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
            <button onClick={handleExportPDF} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity">
              <Download size={14} /> Exporter en PDF
            </button>
            <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border text-foreground hover:border-primary hover:text-primary transition-colors">
              <Share2 size={14} /> Partager
            </button>
          </div>

        </div>
      </div>

      {/* ═══════════ ZONE B — Les tâches ═══════════ */}
      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Source notice for local */}
        {analysisSource === "local" && !isDemo && (
          <p className="text-xs text-foreground-muted mb-6">
            Diagnostic générique. <Link to="/" className="text-primary hover:underline">Lancez un diagnostic personnalisé</Link> pour des résultats basés sur votre quotidien réel.
          </p>
        )}

        {/* Title + inline filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {filteredTasks.length} tâche{filteredTasks.length !== 1 ? "s" : ""}
            {catFilter !== "all" && catFilter !== "easy_wins" && catFilter !== "ai_needed" && ` — ${CAT_LABELS[catFilter as TaskCategory] ?? catFilter}`}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {([
              { key: "all", label: "Toutes" },
              { key: "automatisable", label: "Automatisable" },
              { key: "partiellement_automatisable", label: "Partiel" },
              { key: "difficilement_automatisable", label: "Difficile" },
            ] as { key: CategoryFilter; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setCatFilter(key); setToolFilter("all"); setAccompFilter("all"); }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  catFilter === key
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-foreground-muted mb-4">
          Triées par score DÉCLIC décroissant — les plus impactantes en premier.
        </p>

        {/* Task cards — sorted by score descending */}
        <div className="space-y-3">
          {filteredTasks
            .sort((a, b) => (b.score_criteres ?? 0) - (a.score_criteres ?? 0))
            .map((task, i) => (
              <TaskCard
                key={task.nom + i}
                task={task}
                index={i}
                metier={result?.metier}
                roiPerWeek={task.temps_gagne_heures_semaine * roiHourlyRate * roiNbPeople}
                analysisId={analysisId}
                trackedStatus={trackedTasks.find((t) => t.taskName === task.nom)?.status ?? "todo"}
                onStatusChange={(taskName, status) => setTaskStatus(analysisId, taskName, status)}
                isDemo={isDemo}
              />
            ))}
          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-foreground-muted text-sm">
              Aucune tâche ne correspond à ce filtre.
            </div>
          )}
        </div>
      </main>

      {/* ═══════════ ZONE D — Tableau de bord ROI ═══════════ */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <ResultsDashboard
          result={result}
          initialRate={roiHourlyRate}
          initialPeople={roiNbPeople}
          onParamsChange={(rate, people) => {
            setRoiHourlyRate(rate);
            setRoiNbPeople(people);
          }}
        />
      </div>

      {/* ═══════════ ZONE C — Aller plus loin ═══════════ */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <DeclicCTA
          score={result.score_global}
          metier={result.metier}
          tasks={result.taches}
          roiParams={{ hourlyRate: roiHourlyRate, nbPeople: roiNbPeople }}
          typeAnalyse="individuel"
          onVisible={handleCtaVisible}
        />
        <div className="text-center mt-6 space-y-2">
          <Link to="/equipe" className="block text-xs text-foreground-muted hover:text-primary transition-colors">
            Vous gérez une équipe ? Essayez le mode équipe
          </Link>
          <Link to="/" className="block text-xs text-foreground-muted hover:text-primary transition-colors">
            Analyser un autre métier
          </Link>
        </div>
      </div>

      <Footer />

      {/* Consultant contact modal */}
      {showConceptionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "hsl(222 47% 11% / 0.5)" }}>
          <div className="bg-card border border-border rounded-2xl shadow-elevated max-w-md w-full p-6">
            <ConsultantContactForm
              variant="card"
              source="phase_concevoir"
              contextMessage={`Accompagnement — ${result.metier}, ${result.taches.length} tâches identifiées.`}
              metier={result.metier}
              score={result.score_global}
              onClose={() => setShowConceptionForm(false)}
              onSuccess={() => { setShowConceptionForm(false); showToast("Demande envoyée."); }}
            />
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
