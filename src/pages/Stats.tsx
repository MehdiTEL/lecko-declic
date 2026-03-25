import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle, Clock, Users, ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadGlobalCounters, loadTopMetiers } from "@/lib/statsCounter";

function useCountUp(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!target) { setCurrent(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return current;
}

export default function Stats() {
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [metiers, setMetiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    Promise.all([loadGlobalCounters(), loadTopMetiers()])
      .then(([c, m]) => { setCounters(c); setMetiers(m); })
      .finally(() => setLoading(false));
  }, []);

  const diag = useCountUp(counters.total_diagnostics ?? 0);
  const tasks = useCountUp(counters.total_tasks_completed ?? 0);
  const hours = useCountUp(counters.total_hours_saved ?? 0);
  const users = useCountUp(counters.total_users ?? 0);
  const maxCount = metiers.length > 0 ? metiers[0].count : 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-4">
            <BarChart3 size={11} /> Donnees en temps reel
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: "-0.02em" }}>
            L'impact collectif de DECLIC
          </h1>
          <p className="text-sm text-foreground-muted max-w-lg mx-auto">
            Resultats anonymises et agreges des utilisateurs DECLIC by Lecko
          </p>
          <p className="text-[10px] text-foreground-muted/50 mt-2">
            Mis a jour en continu. Donnees anonymisees. Aucune donnee personnelle.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { value: diag, label: "Diagnostics realises", Icon: Search, color: "text-primary" },
            { value: tasks, label: "Taches automatisees", Icon: CheckCircle, color: "text-gr33t-600 dark:text-gr33t-400" },
            { value: hours, label: "Heures recuperees cumulees", Icon: Clock, color: "text-lecko-orange" },
            { value: users, label: "Professionnels actifs", Icon: Users, color: "text-foreground" },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-border p-5 bg-card"
            >
              {loading ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                  <div className="w-16 h-8 bg-muted animate-pulse rounded" />
                  <div className="w-24 h-3 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-3">
                    <kpi.Icon size={15} className={kpi.color} />
                  </div>
                  <p className={`text-3xl font-bold ${kpi.color}`} style={{ letterSpacing: "-0.02em" }}>
                    {kpi.value.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">{kpi.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Top Metiers */}
        {metiers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-foreground mb-6">Les metiers les plus analyses</h2>
            <div className="space-y-2.5">
              {(showAll ? metiers : metiers.slice(0, 5)).map((m, i) => (
                <div key={m.metier} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground truncate">{m.metier}</span>
                      <span className="text-xs text-foreground-muted shrink-0 ml-2">
                        {m.avg_score}% · ~{m.avg_hours}h/sem
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-primary/20 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {metiers.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-primary hover:underline mt-3"
              >
                {showAll ? "Voir moins" : `Voir les ${metiers.length} metiers`}
              </button>
            )}
          </section>
        )}

        {/* Insights */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-6">Ce que nous avons appris</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                title: "Le reporting est le plus automatisable",
                body: "Dans 78% des diagnostics, au moins une tache de reporting figure dans le top 3 des taches automatisables.",
              },
              {
                title: "Power Automate et N8N dominent",
                body: "Les outils M365 Power Automate et N8N representent 62% des recommandations sur les metiers du tertiaire.",
              },
              {
                title: "Le frein n.1 : la conduite du changement",
                body: "Les taches impliquant plusieurs equipes necessitent en moyenne 3x plus d'accompagnement.",
              },
            ].map((insight) => (
              <div key={insight.title} className="rounded-xl border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-2">{insight.title}</p>
                <p className="text-xs text-foreground-muted leading-relaxed">{insight.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}>
          <h2 className="text-xl font-bold text-foreground mb-2">Decouvrez votre propre potentiel</h2>
          <p className="text-sm text-foreground-muted mb-6">30 secondes. Sans inscription. Resultats immediats.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-primary hover:opacity-90 transition-opacity"
          >
            Lancer mon diagnostic gratuit <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
