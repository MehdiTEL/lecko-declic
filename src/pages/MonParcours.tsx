import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Flame, CheckCircle, BarChart3, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProgress } from "@/context/ProgressContext";
import { usePageContext } from "@/context/PageContext";
import {
  MATURITY_LEVELS,
  getMaturityLevel,
  computeProgressPercent,
} from "@/types/gamification";

export default function MonParcours() {
  const { setPage } = usePageContext();
  const { state, globalProgress, currentMaturity } = useProgress();

  useEffect(() => {
    setPage("history");
  }, [setPage]);

  // Group tasks by unique analysisId
  const analysisGroups = useMemo(() => {
    const map = new Map<
      string,
      { metier: string; analysisId: string; tasks: typeof state.trackedTasks }
    >();
    for (const t of state.trackedTasks) {
      if (!map.has(t.analysisId)) {
        map.set(t.analysisId, { metier: t.metier, analysisId: t.analysisId, tasks: [] });
      }
      map.get(t.analysisId)!.tasks.push(t);
    }
    return Array.from(map.values());
  }, [state.trackedTasks]);

  const uniqueAnalysisCount = analysisGroups.length;

  // Next level computation
  const currentIdx = MATURITY_LEVELS.findIndex(
    (l) => l.level === currentMaturity.level,
  );
  const nextLevel =
    currentIdx < MATURITY_LEVELS.length - 1
      ? MATURITY_LEVELS[currentIdx + 1]
      : null;

  const hasData = state.trackedTasks.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
            Mon <span className="text-lecko-orange">parcours</span>
          </h1>
          <p className="text-foreground-secondary text-sm mb-8">
            Suivez votre progression dans l'automatisation de vos taches.
          </p>
        </motion.div>

        {!hasData ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lecko-card p-12 text-center"
          >
            <div className="text-5xl mb-4">&#128640;</div>
            <p className="text-foreground-secondary font-medium mb-4">
              Commencez par analyser un metier
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-lecko-orange transition-colors"
            >
              Lancer une analyse
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* ─── Level Card ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="lecko-card p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl leading-none">{currentMaturity.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-xl font-bold"
                      style={{ color: currentMaturity.color }}
                    >
                      {currentMaturity.label}
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {globalProgress.percent}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${globalProgress.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${currentMaturity.color}88, ${currentMaturity.color})`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {currentMaturity.description}
                  </p>
                  {nextLevel && (
                    <p className="text-xs text-foreground-muted mt-2">
                      Prochain niveau : {nextLevel.emoji} {nextLevel.label} a{" "}
                      {nextLevel.minPercent}%
                    </p>
                  )}
                </div>
              </div>

              {/* Mini level dots */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-border">
                {MATURITY_LEVELS.map((lvl, i) => {
                  const isReached = globalProgress.percent >= lvl.minPercent;
                  return (
                    <div key={lvl.level} className="flex flex-col items-center gap-1">
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: isReached ? lvl.color : "transparent",
                          border: `2px solid ${lvl.color}`,
                          transition: "background-color 0.3s",
                        }}
                      />
                      <span className="text-[10px] text-foreground-muted">
                        {lvl.emoji}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ─── KPI Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Streak */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="lecko-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={18} className="text-amber-500" />
                  <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                    Serie
                  </span>
                </div>
                <div className="text-3xl font-bold text-amber-500 mb-1">
                  {state.streak.currentStreak}
                </div>
                <p className="text-sm text-foreground-secondary">
                  {state.streak.currentStreak === 0
                    ? "Reprenez aujourd'hui !"
                    : "jours d'affilee"}
                </p>
                <p className="text-xs text-foreground-muted mt-1">
                  Record : {state.streak.longestStreak}
                </p>
              </motion.div>

              {/* Tasks completed */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="lecko-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                    Taches
                  </span>
                </div>
                <div className="text-3xl font-bold text-emerald-500 mb-1">
                  {state.totalTasksCompleted}
                </div>
                <p className="text-sm text-foreground-secondary">
                  taches terminees
                </p>
              </motion.div>

              {/* Analyses */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="lecko-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={18} className="text-blue-500" />
                  <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                    Analyses
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-500 mb-1">
                  {uniqueAnalysisCount}
                </div>
                <p className="text-sm text-foreground-secondary">
                  metiers analyses
                </p>
              </motion.div>
            </div>

            {/* ─── Activity History ───────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-lecko-orange" />
                Historique d'activite
              </h2>

              <div className="space-y-3">
                {analysisGroups.map((group) => {
                  const percent = computeProgressPercent(group.tasks);
                  const level = getMaturityLevel(percent);
                  const done = group.tasks.filter((t) => t.status === "done").length;
                  const inProg = group.tasks.filter(
                    (t) => t.status === "in_progress",
                  ).length;

                  return (
                    <Link
                      key={group.analysisId}
                      to="/resultats"
                      className="lecko-card p-4 block hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{level.emoji}</span>
                          <span className="font-bold text-foreground truncate">
                            {group.metier}
                          </span>
                          <span className="text-xs text-foreground-muted shrink-0">
                            {done}/{group.tasks.length} taches
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-sm font-bold"
                            style={{ color: level.color }}
                          >
                            {percent}%
                          </span>
                          <ArrowRight
                            size={14}
                            className="text-foreground-muted"
                          />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
                          }}
                        />
                      </div>

                      {/* Task status dots */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {group.tasks.map((task, i) => {
                          let bg: string;
                          let title: string;
                          if (task.status === "done") {
                            bg = "#10B981";
                            title = `${task.taskName} (termine)`;
                          } else if (task.status === "in_progress") {
                            bg = "#F59E0B";
                            title = `${task.taskName} (en cours)`;
                          } else {
                            bg = "transparent";
                            title = `${task.taskName} (a faire)`;
                          }
                          return (
                            <div
                              key={i}
                              title={title}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: bg,
                                border:
                                  task.status === "todo"
                                    ? "1.5px solid #9CA3AF"
                                    : "none",
                                transition: "background-color 0.3s",
                              }}
                            />
                          );
                        })}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
