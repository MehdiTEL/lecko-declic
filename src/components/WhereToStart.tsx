import { AnalysisTask } from "@/types/analysis";
import { useChatContext } from "@/context/ChatContext";
import { MessageCircle, Filter } from "lucide-react";

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
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        🎯 Par où commencer ?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Easy wins */}
        <div className="lecko-card p-4 border-l-4 border-emerald-500">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            ⚡ Victoires faciles
          </p>
          <p className="text-sm font-bold text-foreground mb-1">Commencez par les gains rapides</p>
          <p className="text-xs text-foreground-secondary mb-3">
            {easyWins.length} tâche{easyWins.length !== 1 ? "s" : ""} avec score 3+ et faisable{easyWins.length !== 1 ? "s" : ""} sans IA. Pas d'expertise requise — juste N8N ou Make.
          </p>
          <button
            onClick={onFilterEasyWins}
            disabled={easyWins.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-40 disabled:pointer-events-none"
          >
            <Filter size={12} />
            Voir ces {easyWins.length} tâche{easyWins.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* AI tasks */}
        <div className="lecko-card p-4 border-l-4 border-violet-500">
          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">
            🤖 Automatisations augmentées
          </p>
          <p className="text-sm font-bold text-foreground mb-1">Ajoutez l'IA quand les règles ne suffisent plus</p>
          <p className="text-xs text-foreground-secondary mb-3">
            {aiNeeded.length} tâche{aiNeeded.length !== 1 ? "s" : ""} nécessitant l'IA — deuxième vague une fois les bases maîtrisées.
          </p>
          <button
            onClick={onFilterAI}
            disabled={aiNeeded.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline disabled:opacity-40 disabled:pointer-events-none"
          >
            <Filter size={12} />
            Voir ces {aiNeeded.length} tâche{aiNeeded.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Coach */}
        <div className="lecko-card p-4 border-l-4 border-lecko-blue">
          <p className="text-xs font-bold text-lecko-blue uppercase tracking-wider mb-2">
            💬 Besoin d'un guide ?
          </p>
          <p className="text-sm font-bold text-foreground mb-1">Le Coach est là</p>
          <p className="text-xs text-foreground-secondary mb-3">
            Le Coach IA expert vous guide nœud par nœud pour construire chaque automatisation.
          </p>
          <button
            onClick={() => openChat({ task: tasks[0], metier })}
            disabled={tasks.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-lecko-blue hover:underline disabled:opacity-40 disabled:pointer-events-none"
          >
            <MessageCircle size={12} />
            Ouvrir le Coach IA
          </button>
        </div>
      </div>
    </div>
  );
}
