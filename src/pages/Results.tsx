import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, RotateCcw, Filter, Settings, Sparkles, Bot, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ScoreCircle from "@/components/ScoreCircle";
import KPICard from "@/components/KPICard";
import TaskCard from "@/components/TaskCard";
import LeckoCTA from "@/components/LeckoCTA";
import MicroCTA from "@/components/MicroCTA";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";
import DeclicProgress from "@/components/DeclicProgress";
import WhereToStart from "@/components/WhereToStart";
import { Toast, useToast } from "@/components/Toast";
import { AnalysisResult, AnalysisTask, AnalysisSource, TaskCategory, ToolType } from "@/types/analysis";
import { DeclicPhase } from "@/types/declic";
import { saveToHistory } from "@/lib/history";
import { getApiKey, getProvider, analyzeJob as callAnalyzeJob } from "@/lib/aiProvider";
import { findInLocalDatabase } from "@/data/jobDatabase";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type CategoryFilter = "all" | TaskCategory | "easy_wins" | "ai_needed";
type ToolFilter = "all" | ToolType;

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

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisSource, setAnalysisSource] = useState<AnalysisSource>("local");
  const [error, setError] = useState<string | null>(null);
  const [errorShowSettings, setErrorShowSettings] = useState(false);
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [toolFilter, setToolFilter] = useState<ToolFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const handleCtaVisible = useCallback((v: boolean) => setCtaVisible(v), []);
  // ROI state
  const [roiHourlyRate, setRoiHourlyRate] = useState(45);
  const [roiNbPeople, setRoiNbPeople] = useState(1);
  const handleRoiParams = useCallback((r: number, p: number) => {
    setRoiHourlyRate(r);
    setRoiNbPeople(p);
  }, []);

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
          saveToHistory({
            id: crypto.randomUUID(),
            metier,
            date: new Date().toISOString(),
            result: localResult,
            source: "local",
          });
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
    if (catFilter !== "all" && t.categorie !== catFilter) return false;
    if (toolFilter !== "all" && t.type_outil !== toolFilter) return false;
    return true;
  });

  const countByCat = (cat: TaskCategory) => result?.taches.filter((t) => t.categorie === cat).length ?? 0;
  const countByTool = (tool: ToolType) => result?.taches.filter((t) => t.type_outil === tool).length ?? 0;

  const handleShare = async () => {
    if (!result) return;
    const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
    const url = `${window.location.origin}/resultats?metier=${encodeURIComponent(result.metier)}&cached=${encoded}&source=${analysisSource}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien copié dans le presse-papier !");
    } catch {
      showToast("Erreur lors de la copie du lien.", "error");
    }
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current || !result) return;
    showToast("Génération du PDF en cours...");
    try {
      const canvas = await html2canvas(resultsRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgH = pageW * ratio;
      let yOffset = 0;
      let remaining = imgH;
      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, -yOffset, pageW, imgH);
        remaining -= pageH;
        yOffset += pageH;
        if (remaining > 0) pdf.addPage();
      }
      pdf.save(`lecko-diagnostic-${result.metier.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      showToast("PDF exporté avec succès !");
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
                  className="w-full py-3 flex items-center justify-center gap-2 bg-lecko-orange text-primary-foreground rounded-xl font-bold hover:bg-lecko-orange/90 transition-colors"
                >
                  <Settings size={15} />
                  Modifier ma clé API
                </Link>
              )}
              <button
                onClick={() => metier && runAnalysis(metier)}
                className="w-full py-3 bg-lecko-blue text-primary-foreground rounded-xl font-bold hover:bg-lecko-blue/90 transition-colors"
              >
                Réessayer
              </button>
              <p className="text-xs text-foreground-muted">
                💡 Vous pouvez aussi essayer avec un autre fournisseur dans les{" "}
                <Link to="/parametres" className="text-lecko-blue hover:underline">paramètres</Link>.
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

      <div ref={resultsRef}>
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-lecko-blue transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Nouvelle analyse
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lecko-blue/10 text-lecko-blue border border-lecko-blue/20">
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
              <KPICard value={result.taches.length} label="Tâches analysées" color="blue" delay={0.1} />
              <KPICard value={automatisables + partiels} label="Automatisables" color="green" delay={0.2} />
              <KPICard
                value={result.heures_economisees_semaine}
                suffix="h"
                label="Heures / semaine gagnées"
                color="orange"
                delay={0.3}
              />
            </div>
          </div>

          {/* ROI Calculator */}
          <RoiCalculator
            hoursPerWeek={result.heures_economisees_semaine}
            metier={result.metier}
            onParamsChange={handleRoiParams}
          />

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
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-lecko-orange text-primary-foreground hover:bg-lecko-orange/90 transition-colors whitespace-nowrap"
              >
                Passer au mode API →
              </Link>
            </motion.div>
          )}

          {/* Filters */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-lecko-blue transition-colors mb-3"
            >
              <Filter size={15} />
              Filtres
              {(catFilter !== "all" || toolFilter !== "all") && (
                <span className="w-5 h-5 rounded-full bg-lecko-blue text-primary-foreground text-xs flex items-center justify-center">
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
                          ? "bg-lecko-blue text-primary-foreground border-lecko-blue"
                          : "border-border text-foreground-secondary hover:border-lecko-blue hover:text-lecko-blue"
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
                            ? "bg-lecko-blue text-primary-foreground border-lecko-blue"
                            : "border-border text-foreground-secondary hover:border-lecko-blue hover:text-lecko-blue"
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
                          ? "bg-lecko-blue text-primary-foreground border-lecko-blue"
                          : "border-border text-foreground-secondary hover:border-lecko-blue hover:text-lecko-blue"
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
                            ? "bg-lecko-blue text-primary-foreground border-lecko-blue"
                            : "border-border text-foreground-secondary hover:border-lecko-blue hover:text-lecko-blue"
                        }`}
                      >
                        {t} ({countByTool(t)})
                      </button>
                    ))}
                  </div>
                </div>
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
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="lecko-card p-8 text-center text-foreground-muted">
                Aucune tâche ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>

          {/* Lecko CTA */}
          <LeckoCTA
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-lecko-blue text-primary-foreground hover:bg-lecko-blue/90 transition-colors"
          >
            <Download size={15} />
            Exporter en PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-lecko-orange text-primary-foreground hover:bg-lecko-orange/90 transition-colors"
          >
            <Share2 size={15} />
            Partager les résultats
          </button>
          <Link
            to="/"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 border-lecko-blue text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground transition-colors"
          >
            <RotateCcw size={15} />
            Analyser un autre métier
          </Link>
        </div>
        {/* Team upsell */}
        <div className="max-w-5xl mx-auto mt-3">
          <Link
            to="/equipe"
            className="inline-flex items-center gap-2 text-xs text-foreground-muted hover:text-lecko-blue transition-colors"
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
