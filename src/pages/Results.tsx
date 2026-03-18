import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, RotateCcw, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ScoreCircle from "@/components/ScoreCircle";
import KPICard from "@/components/KPICard";
import TaskCard from "@/components/TaskCard";
import { Toast, useToast } from "@/components/Toast";
import { AnalysisResult, AnalysisTask, TaskCategory, ToolType } from "@/types/analysis";
import { saveToHistory } from "@/lib/history";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type CategoryFilter = "all" | TaskCategory;
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

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [toolFilter, setToolFilter] = useState<ToolFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const minLoadMs = 3000;

  useEffect(() => {
    if (sharedId) {
      loadShared(sharedId);
    } else if (metier) {
      analyzeJob(metier);
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
      setResult(data.resultats as AnalysisResult);
    } catch {
      setError("Analyse introuvable ou lien expiré.");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeJob(job: string, retry = false) {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-job", {
        body: { metier: job },
      });

      if (error) throw new Error(error.message);
      const parsed: AnalysisResult = typeof data === "string" ? JSON.parse(data) : data;

      const elapsed = Date.now() - startTime;
      const remaining = minLoadMs - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      setResult(parsed);

      // Save to history
      const entry = {
        id: crypto.randomUUID(),
        metier: job,
        date: new Date().toISOString(),
        result: parsed,
      };
      saveToHistory(entry);

      // Save to Supabase for sharing
      try {
        const { data: saved } = await supabase
          .from("analyses")
          .insert({ metier: job, resultats: parsed as unknown as Record<string, unknown> })
          .select("id")
          .single();
        if (saved) {
          entry.supabaseId = saved.id;
          saveToHistory(entry);
        }
      } catch {
        // silent fail - sharing will fall back to base64
      }

    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      const remaining = minLoadMs - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

      if (!retry) {
        await analyzeJob(job, true);
        return;
      }
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
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
    let url = "";
    // Try to get supabase id from history
    const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
    url = `${window.location.origin}/resultats?metier=${encodeURIComponent(result.metier)}&shared=${encoded}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    showToast("Lien copié dans le presse-papier !");
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
            <button
              onClick={() => metier && analyzeJob(metier)}
              className="w-full py-3 bg-lecko-blue text-primary-foreground rounded-xl font-bold hover:bg-lecko-orange transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const automatisables = countByCat("automatisable");
  const partiels = countByCat("partiellement_automatisable");

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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Diagnostic IA pour :{" "}
              <span className="text-lecko-orange">{result.metier}</span>
            </h1>
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
                {/* Category filter */}
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
                {/* Tool filter */}
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

            {/* Results count */}
            <p className="text-sm text-foreground-muted">
              {filteredTasks.length} tâche{filteredTasks.length !== 1 ? "s" : ""} affichée{filteredTasks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Task cards */}
          <div className="space-y-3">
            {filteredTasks.map((task, i) => (
              <TaskCard key={task.nom + i} task={task} index={i} />
            ))}
            {filteredTasks.length === 0 && (
              <div className="lecko-card p-8 text-center text-foreground-muted">
                Aucune tâche ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>
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
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 py-4 text-center">
        <p className="text-xs text-foreground-muted">
          Analyse propulsée par l'IA — Les résultats sont indicatifs et basés sur des tendances générales.
        </p>
        <p className="text-xs text-foreground-muted mt-0.5">
          <span className="font-bold">lecko.</span>{" "}
          <a href="https://lecko.fr" target="_blank" rel="noopener noreferrer" className="hover:text-lecko-blue transition-colors">
            lecko.fr
          </a>
        </p>
      </footer>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
