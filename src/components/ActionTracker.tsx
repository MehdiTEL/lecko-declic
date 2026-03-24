import { useActions, ActionStatus } from "@/hooks/useActions";
import { useAuth } from "@/context/AuthContext";
import { AnalysisResult } from "@/types/analysis";
import { CheckCircle, Circle, ArrowRight, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ActionTrackerProps {
  result: AnalysisResult;
}

const STATUS_CONFIG: Record<ActionStatus, { label: string; icon: typeof Circle; color: string }> = {
  todo: { label: "A faire", icon: Circle, color: "text-foreground-muted" },
  in_progress: { label: "En cours", icon: Clock, color: "text-lecko-blue" },
  done: { label: "Fait", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400" },
  skipped: { label: "Ignore", icon: X, color: "text-foreground-muted/50" },
};

const NEXT_STATUS: Record<ActionStatus, ActionStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
  skipped: "todo",
};

export default function ActionTracker({ result }: ActionTrackerProps) {
  const { user } = useAuth();
  const { actions, stats, initFromDiagnostic, updateStatus, loading } = useActions(result.metier);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user && !initialized && actions.length === 0 && !loading) {
      initFromDiagnostic(result).then(() => setInitialized(true));
    } else if (actions.length > 0) {
      setInitialized(true);
    }
  }, [user, initialized, actions.length, loading, initFromDiagnostic, result]);

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-border p-5 text-center">
        <p className="text-sm text-foreground-muted mb-3">
          Connectez-vous pour suivre votre progression et cocher les automatisations mises en place.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-lecko-blue hover:bg-lecko-blue/5 transition-colors"
        >
          Se connecter <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  if (loading && actions.length === 0) {
    return <div className="py-8 text-center text-sm text-foreground-muted">Chargement du suivi...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-xl border border-border p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Votre progression — {result.metier}</p>
          <span className="text-sm font-bold text-lecko-blue">{stats.progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-lecko-blue rounded-full transition-all duration-500"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs text-foreground-muted">
          <span>{stats.done} terminee{stats.done !== 1 ? "s" : ""}</span>
          <span>{stats.inProgress} en cours</span>
          <span>{stats.todo} a faire</span>
        </div>
      </div>

      {/* CTA when starting */}
      {stats.inProgress > 0 && stats.done === 0 && (
        <div className="rounded-xl border border-lecko-blue/20 bg-lecko-blue/5 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Besoin d'aide pour demarrer ?</p>
            <p className="text-xs text-foreground-muted mt-0.5">Nos consultants peuvent vous accompagner sur la mise en place de vos premieres automatisations.</p>
          </div>
          <a href="https://calendly.com/lecko/decouverte" target="_blank" rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-lecko-blue hover:bg-blue-700 transition-colors">
            Echanger
          </a>
        </div>
      )}

      {/* CTA when progressing */}
      {stats.done >= 2 && stats.todo > 0 && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Vous avancez bien.</p>
            <p className="text-xs text-foreground-muted mt-0.5">{stats.done} automatisations en place. Pour aller plus vite sur les {stats.todo} restantes, un consultant peut les configurer avec vous.</p>
          </div>
          <a href="https://calendly.com/lecko/decouverte" target="_blank" rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            Accelerer
          </a>
        </div>
      )}

      {/* Actions list */}
      <div className="space-y-1.5">
        {actions
          .sort((a, b) => {
            const order: Record<ActionStatus, number> = { in_progress: 0, todo: 1, done: 2, skipped: 3 };
            const diff = order[a.status] - order[b.status];
            return diff !== 0 ? diff : b.priority - a.priority;
          })
          .map((action) => {
            const config = STATUS_CONFIG[action.status];
            const Icon = config.icon;
            return (
              <button
                key={action.id}
                onClick={() => updateStatus(action.task_name, NEXT_STATUS[action.status])}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors hover:bg-muted/50 ${
                  action.status === "done" ? "opacity-60" : ""
                } ${action.status === "skipped" ? "opacity-40" : ""}`}
              >
                <Icon size={18} className={`shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${action.status === "done" ? "line-through text-foreground-muted" : "text-foreground"}`}>
                    {action.task_name}
                  </p>
                  <p className="text-[11px] text-foreground-muted">
                    {action.task_tool_type}{action.status === "done" && action.completed_at ? ` — termine le ${new Date(action.completed_at).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${config.color}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
