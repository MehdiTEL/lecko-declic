import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, Edit3, Users, Zap, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import Navbar from "@/components/Navbar";
import LeckoCTA from "@/components/LeckoCTA";
import MicroCTA from "@/components/MicroCTA";
import Footer from "@/components/Footer";
import RoiCalculatorEquipe from "@/components/RoiCalculatorEquipe";
import BenchmarkBanner from "@/components/BenchmarkBanner";
import { Toast, useToast } from "@/components/Toast";
import { TeamAnalysisResult, QuickWin } from "@/types/team";
import { TeamJobResult } from "@/types/team";
import { AnalysisTask, TaskCategory } from "@/types/analysis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard from "@/components/TaskCard";
import { generateTeamPdf } from "@/lib/pdfReport";

const CAT_COLORS: Record<TaskCategory, string> = {
  automatisable: "hsl(160 84% 39%)",
  partiellement_automatisable: "hsl(38 92% 50%)",
  difficilement_automatisable: "hsl(0 84% 60%)",
};

function computeQuickWins(results: TeamJobResult[]): QuickWin[] {
  const wins: QuickWin[] = [];
  for (const r of results) {
    for (const task of r.result.taches) {
      if (task.categorie !== "difficilement_automatisable" && task.temps_gagne_heures_semaine > 0) {
        wins.push({
          task,
          metier: r.result.metier,
          count: r.member.count,
          totalImpact: task.temps_gagne_heures_semaine * r.member.count,
        });
      }
    }
  }
  return wins.sort((a, b) => b.totalImpact - a.totalImpact).slice(0, 5);
}

function buildChartData(results: TeamJobResult[]) {
  return results
    .map((r) => {
      const auto = r.result.taches.filter((t) => t.categorie === "automatisable").length;
      const partial = r.result.taches.filter((t) => t.categorie === "partiellement_automatisable").length;
      const hard = r.result.taches.filter((t) => t.categorie === "difficilement_automatisable").length;
      const hoursTotal = r.result.heures_economisees_semaine * r.member.count;
      return {
        name: r.result.metier,
        count: r.member.count,
        automatisable: auto,
        partiellement: partial,
        difficile: hard,
        hoursTotal,
      };
    })
    .sort((a, b) => b.hoursTotal - a.hoursTotal);
}

const TOOL_BADGE_COLORS: Record<string, string> = {
  "Agent IA": "bg-primary/10 text-primary border-primary/20",
  "Workflow N8N": "bg-gr33t-500/10 text-gr33t-500 border-gr33t-500/20",
  "Automatisation No-Code": "bg-lecko-orange/10 text-lecko-orange border-lecko-orange/20",
  "Copilot / Assistant IA": "bg-primary/10 text-primary border-primary/20",
  "Script personnalisé": "bg-muted text-foreground-muted border-border",
};

export default function EquipeResultats() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamAnalysisResult | null>(null);
  const { toast, showToast, hideToast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const handleCtaVisible = useCallback((v: boolean) => setCtaVisible(v), []);
  const [teamRates, setTeamRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const raw = sessionStorage.getItem("lecko-team-result");
    if (!raw) {
      navigate("/equipe");
      return;
    }
    try {
      setTeam(JSON.parse(raw));
    } catch {
      navigate("/equipe");
    }
  }, [navigate]);

  if (!team) return null;

  const totalPeople = team.members.reduce((s, m) => s + m.count, 0);
  const totalTasks = team.results.reduce((s, r) => s + r.result.taches.length, 0);
  const totalAutomatable = team.results.reduce(
    (s, r) =>
      s +
      r.result.taches.filter(
        (t) => t.categorie === "automatisable" || t.categorie === "partiellement_automatisable"
      ).length,
    0
  );
  const totalHours = team.results.reduce(
    (s, r) => s + r.result.heures_economisees_semaine * r.member.count,
    0
  );

  const quickWins = computeQuickWins(team.results);
  const chartData = buildChartData(team.results);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Lien copié dans le presse-papier !");
    } catch {
      showToast("Erreur lors de la copie du lien.", "error");
    }
  };

  const handleExportPDF = () => {
    if (!team) return;
    showToast("Génération du PDF en cours...");
    try {
      generateTeamPdf({
        team,
        quickWins,
        hourlyRates: teamRates,
      });
      showToast("PDF exporté avec succès !");
    } catch {
      showToast("Erreur lors de la génération du PDF.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      <div ref={reportRef}>
        {/* ── Header ── */}
        <div className="bg-card border-b border-border px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/equipe"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Modifier l'équipe
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                Diagnostic <span className="text-lecko-orange">d'équipe</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Users size={11} />
                {team.results.length} métiers · {totalPeople} collaborateurs
              </span>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

          {/* ── Section 1 — Executive Dashboard ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "hsl(var(--primary))", color: "white" }}
          >
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4">
              Diagnostic d'équipe — {totalPeople} collaborateur{totalPeople > 1 ? "s" : ""} analysé{totalPeople > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Users size={20} />, value: team.results.length, label: "Métiers analysés" },
                { icon: <Target size={20} />, value: totalTasks, label: "Tâches identifiées" },
                { icon: <Zap size={20} />, value: totalAutomatable, label: "Tâches automatisables" },
                { icon: <Clock size={20} />, value: `${Math.round(totalHours)}h`, label: "Heures/sem. gagnées" },
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex flex-col items-center text-center rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <span className="opacity-70 mb-1">{kpi.icon}</span>
                  <span className="text-3xl font-bold">{kpi.value}</span>
                  <span className="text-xs opacity-75 mt-0.5">{kpi.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Benchmark ── */}
          <BenchmarkBanner
            score={Math.round(team.results.reduce((s, r) => s + r.result.score_global, 0) / team.results.length)}
            metier="Équipe"
            hoursPerWeek={totalHours}
          />

          {/* ── Section 2 — ROI Calculator ── */}
          <RoiCalculatorEquipe results={team.results} onRatesChange={setTeamRates} />

          {/* ── Section 3 — Stacked Bar Chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lecko-card p-6"
          >
            <h2 className="text-lg font-bold font-heading text-foreground mb-1">
              Répartition par métier
            </h2>
            <p className="text-xs text-foreground-muted mb-5">
              Trié par impact décroissant (heures × nombre de personnes)
            </p>
            <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 52)}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 60 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 12, fill: "hsl(var(--foreground-secondary))" }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      automatisable: "Automatisable",
                      partiellement: "Partiellement",
                      difficile: "Difficile",
                    };
                    return [value, labels[name as string] ?? name];
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      automatisable: "Automatisable",
                      partiellement: "Partiellement",
                      difficile: "Difficile",
                    };
                    return <span style={{ fontSize: 11 }}>{labels[value] ?? value}</span>;
                  }}
                />
                <Bar dataKey="automatisable" stackId="a" fill={CAT_COLORS.automatisable} radius={[0, 0, 0, 0]} />
                <Bar dataKey="partiellement" stackId="a" fill={CAT_COLORS.partiellement_automatisable} />
                <Bar dataKey="difficile" stackId="a" fill={CAT_COLORS.difficilement_automatisable} radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Per-job summary chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {chartData.map((d) => (
                <span
                  key={d.name}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground-secondary border border-border font-medium"
                >
                  {d.name} ×{d.count} — ~{Math.round(d.hoursTotal)}h/sem.
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Section 3 — Top 5 Quick Wins ── */}
          {quickWins.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lecko-card p-6"
            >
              <h2 className="text-lg font-bold font-heading text-foreground mb-1 flex items-center gap-2">
                🏆 Top 5 des automatisations à impact immédiat
              </h2>
              <p className="text-xs text-foreground-muted mb-5">
                Meilleures opportunités classées par impact total (heures × personnes)
              </p>
              <div className="space-y-3">
                {quickWins.map((win, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-4 bg-muted/40 rounded-2xl p-4"
                  >
                    <span className="text-2xl font-bold text-primary w-8 shrink-0 text-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-foreground text-sm">{win.task.nom}</span>
                        <span className="text-xs text-foreground-muted">({win.metier})</span>
                      </div>
                      <p className="text-xs text-foreground-secondary mb-2">{win.task.solution}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-gr33t-500">
                          ~{win.task.temps_gagne_heures_semaine}h × {win.count} pers. ={" "}
                          <strong>{win.totalImpact}h/sem.</strong>
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                            TOOL_BADGE_COLORS[win.task.type_outil] ?? "bg-muted text-foreground-muted border-border"
                          }`}
                        >
                          {win.task.type_outil}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Section 4 — Detail accordions ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="lecko-card p-6"
          >
            <h2 className="text-lg font-bold font-heading text-foreground mb-5">
              Détail par métier
            </h2>
            <Accordion type="multiple" className="space-y-2">
              {team.results.map((r) => {
                const auto = r.result.taches.filter((t) => t.categorie === "automatisable").length;
                const partial = r.result.taches.filter((t) => t.categorie === "partiellement_automatisable").length;
                return (
                  <AccordionItem
                    key={r.member.id}
                    value={r.member.id}
                    className="border border-border rounded-2xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 text-left">
                        <span className="font-bold text-foreground text-sm">{r.result.metier}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                          {r.result.score_global}%
                        </span>
                        <span className="text-xs text-foreground-muted">
                          ×{r.member.count} pers. — {r.result.heures_economisees_semaine}h/sem.
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gr33t-500/10 text-gr33t-500 border border-gr33t-500/20 font-semibold">
                          {auto + partial} automatisables / {r.result.taches.length}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-2 pt-1">
                      {r.result.taches.map((task, idx) => (
                        <TaskCard key={idx} task={task} index={idx} metier={r.result.metier} />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </motion.div>

          {/* ── Lecko CTA ── */}
          <LeckoCTA
            score={Math.round(team.results.reduce((s, r) => s + r.result.score_global, 0) / team.results.length)}
            metier={`${team.results.length} métiers (${team.members.reduce((s, m) => s + m.count, 0)} personnes)`}
            typeAnalyse="equipe"
            onVisible={handleCtaVisible}
          />
        </main>
      </div>

      {/* ── Action buttons ── */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur border-t border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-colors"
          >
            <Download size={15} />
            Exporter PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border border-border text-foreground-secondary hover:border-primary hover:text-primary hover:shadow-md transition-colors"
          >
            <Share2 size={15} />
            Partager
          </button>
          <Link
            to="/equipe"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border border-border text-foreground-secondary hover:border-primary hover:text-primary hover:shadow-md transition-colors"
          >
            <Edit3 size={15} />
            Modifier l'équipe
          </Link>
          <div className="ml-auto text-xs text-foreground-muted hidden md:block">
            {new Date(team.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      <Footer />

      <MicroCTA
        ctaVisible={ctaVisible}
        metier={`${team.results.length} métiers`}
        score={Math.round(team.results.reduce((s, r) => s + r.result.score_global, 0) / team.results.length)}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}
