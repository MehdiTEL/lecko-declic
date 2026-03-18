import { AnalysisTask } from "@/types/analysis";
import { useChatContext } from "@/context/ChatContext";
import { MessageCircle, Filter, Zap, Brain } from "lucide-react";

interface WhereToStartProps {
  tasks: AnalysisTask[];
  metier: string;
  onFilterEasyWins: () => void;
  onFilterAI: () => void;
}

export default function WhereToStart({ tasks, metier, onFilterEasyWins, onFilterAI }: WhereToStartProps) {
  const { openChat } = useChatContext();

  const easyWins = tasks.filter(
    (t) => (t.score_criteres ?? 0) >= 3 && t.peut_fonctionner_sans_ia === true
  );
  const aiNeeded = tasks.filter((t) => t.peut_fonctionner_sans_ia === false);

  return (
    <div className="mb-6">
      <p className="label-uppercase mb-3">Par où commencer ?</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Easy wins */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(160 72% 35%)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-lecko-green shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-wider text-lecko-green">
              Victoires faciles
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Commencez par les gains rapides</p>
          <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
            {easyWins.length} tâche{easyWins.length !== 1 ? "s" : ""} score 3+ et faisable{easyWins.length !== 1 ? "s" : ""} sans IA.
            Pas d'expertise requise — juste N8N ou Make.
          </p>
          <button
            onClick={onFilterEasyWins}
            disabled={easyWins.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-lecko-green hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Filter size={11} />
            Voir ces {easyWins.length} tâche{easyWins.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* AI tasks */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(271 91% 55%)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="shrink-0" style={{ color: "hsl(271 55% 50%)" }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(271 55% 50%)" }}>
              Avec IA
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Ajoutez l'IA quand les règles ne suffisent plus</p>
          <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
            {aiNeeded.length} tâche{aiNeeded.length !== 1 ? "s" : ""} nécessitant l'IA — deuxième vague.
          </p>
          <button
            onClick={onFilterAI}
            disabled={aiNeeded.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
            style={{ color: "hsl(271 55% 50%)" }}
          >
            <Filter size={11} />
            Voir ces {aiNeeded.length} tâche{aiNeeded.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Coach */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(var(--lecko-blue))" }}>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-lecko-blue shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-wider text-lecko-blue">
              Besoin d'un guide ?
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Le Coach est là</p>
          <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
            Notre assistant expert vous guide nœud par nœud pour construire chaque automatisation.
          </p>
          <button
            onClick={() => openChat({ task: tasks[0], metier })}
            disabled={tasks.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-lecko-blue hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <MessageCircle size={11} />
            Ouvrir le Coach
          </button>
        </div>

      </div>
    </div>
  );
}
