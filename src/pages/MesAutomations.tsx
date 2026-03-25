import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ListTodo, Timer, ArrowRight, ChevronDown } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { usePageContext } from "@/context/PageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { TrackedTask } from "@/types/gamification";

export default function MesAutomations() {
  const { state, setTaskStatus } = useProgress();
  const { setPage } = usePageContext();
  const [showTodo, setShowTodo] = useState(false);

  useMemo(() => setPage("history"), [setPage]);

  const allTasks = state.trackedTasks;
  const inProgress = allTasks.filter(t => t.status === "in_progress");
  const done = allTasks.filter(t => t.status === "done");
  const todo = allTasks.filter(t => t.status === "todo");

  // Group by metier
  const groupByMetier = (tasks: TrackedTask[]) => {
    const map = new Map<string, TrackedTask[]>();
    tasks.forEach(t => {
      const list = map.get(t.metier) ?? [];
      list.push(t);
      map.set(t.metier, list);
    });
    return Array.from(map.entries());
  };

  // Empty state
  if (allTasks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ListTodo size={24} className="text-foreground-muted" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Aucune automation suivie</h2>
            <p className="text-sm text-foreground-muted mb-6">
              Lancez un diagnostic pour commencer a suivre vos automations.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Lancer un diagnostic <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">

        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground mb-1">Mes automations</h1>
        <p className="text-sm text-foreground-muted mb-8">Suivez vos chantiers d'automatisation en cours</p>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl border border-border p-4 bg-card">
            <ListTodo size={16} className="text-foreground-muted mb-2" />
            <p className="text-2xl font-bold text-foreground">{allTasks.length}</p>
            <p className="text-xs text-foreground-muted">Taches suivies</p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <CheckCircle size={16} className="text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{done.length}</p>
            <p className="text-xs text-foreground-muted">Terminees</p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <Clock size={16} className="text-lecko-blue mb-2" />
            <p className="text-2xl font-bold text-lecko-blue">{inProgress.length}</p>
            <p className="text-xs text-foreground-muted">En cours</p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-card">
            <Timer size={16} className="text-lecko-orange mb-2" />
            <p className="text-2xl font-bold text-foreground">--</p>
            <p className="text-xs text-foreground-muted">Heures recuperees</p>
          </div>
        </div>

        {/* In Progress */}
        {inProgress.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-lecko-blue mb-4">
              En cours ({inProgress.length})
            </h2>
            <div className="space-y-2">
              {groupByMetier(inProgress).map(([metier, tasks]) => (
                <div key={metier}>
                  <p className="text-xs font-semibold text-foreground-muted mb-2">{metier}</p>
                  {tasks.map(task => (
                    <div key={task.taskName} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card mb-1.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Clock size={15} className="text-lecko-blue shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">{task.taskName}</span>
                      </div>
                      <button
                        onClick={() => setTaskStatus(task.analysisId, task.taskName, "done")}
                        className="shrink-0 px-3 py-1 text-xs font-semibold rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        Terminer
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Done */}
        {done.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
              Terminees ({done.length})
            </h2>
            <div className="space-y-1.5">
              {groupByMetier(done).map(([metier, tasks]) => (
                <div key={metier}>
                  <p className="text-xs font-semibold text-foreground-muted mb-2">{metier}</p>
                  {tasks.map(task => (
                    <div key={task.taskName} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50 opacity-70">
                      <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                      <span className="text-sm text-foreground-muted line-through truncate flex-1">{task.taskName}</span>
                      {task.completedAt && (
                        <span className="text-[10px] text-foreground-muted shrink-0">
                          {new Date(task.completedAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Todo — collapsed */}
        {todo.length > 0 && (
          <section className="mb-8">
            <button
              onClick={() => setShowTodo(!showTodo)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground-muted mb-4 hover:text-foreground transition-colors"
            >
              A faire ({todo.length})
              <ChevronDown size={14} className={`transition-transform ${showTodo ? "rotate-180" : ""}`} />
            </button>
            {showTodo && (
              <div className="space-y-1.5">
                {groupByMetier(todo).map(([metier, tasks]) => (
                  <div key={metier}>
                    <p className="text-xs font-semibold text-foreground-muted mb-2">{metier}</p>
                    {tasks.map(task => (
                      <div key={task.taskName} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-dashed border-border bg-card/50 mb-1.5">
                        <span className="text-sm text-foreground-muted truncate">{task.taskName}</span>
                        <button
                          onClick={() => setTaskStatus(task.analysisId, task.taskName, "in_progress")}
                          className="shrink-0 px-3 py-1 text-xs font-semibold rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          Commencer
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA consultant */}
        {inProgress.length > 0 && done.length < 2 && (
          <div className="rounded-xl border border-lecko-blue/20 bg-lecko-blue/5 p-5 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Besoin d'aide pour avancer ?</p>
            <p className="text-xs text-foreground-muted mb-3">Un consultant peut configurer vos automations avec vous.</p>
            <a
              href="https://calendly.com/lecko/decouverte"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-lecko-blue hover:bg-blue-700 transition-colors"
            >
              Echanger avec un consultant
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
