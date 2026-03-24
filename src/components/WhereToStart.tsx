import { AnalysisTask, AccompagnementLevel, ACCOMPAGNEMENT_CONFIG } from "@/types/analysis";
import { useChatContext } from "@/context/ChatContext";
import { MessageCircle, Filter, Zap, Brain, Sparkles, Users } from "lucide-react";

interface WhereToStartProps {
  tasks: AnalysisTask[];
  metier: string;
  onFilterEasyWins: () => void;
  onFilterAI: () => void;
  onFilterAccompagnement?: (level: AccompagnementLevel) => void;
}

export default function WhereToStart({ tasks, metier, onFilterEasyWins, onFilterAI, onFilterAccompagnement }: WhereToStartProps) {
  const { openChat } = useChatContext();

  // Check if new accompagnement data is available
  const hasAccompagnement = tasks.some((t) => t.niveau_accompagnement);

  // New mode: accompagnement-based cards
  if (hasAccompagnement && onFilterAccompagnement) {
    const expressTasks = tasks.filter((t) => t.niveau_accompagnement === "express");
    const guideTasks = tasks.filter((t) => t.niveau_accompagnement === "guide");
    const consultantTasks = tasks.filter((t) => t.niveau_accompagnement === "consultant");

    return (
      <div className="mb-6">
        <p className="label-uppercase mb-3">Par où commencer ?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Express */}
          <div className="lecko-card p-5" style={{ borderLeft: `3px solid ${ACCOMPAGNEMENT_CONFIG.express.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.express.color }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCOMPAGNEMENT_CONFIG.express.textColor }}>
                Victoires Express
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {expressTasks.length} tâche{expressTasks.length !== 1 ? "s" : ""} faisable{expressTasks.length !== 1 ? "s" : ""} immédiatement
            </p>
            <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
              Pas besoin d'aide externe — activez une fonctionnalité native ou suivez un tuto rapide.
            </p>
            <button
              onClick={() => onFilterAccompagnement("express")}
              disabled={expressTasks.length === 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
              style={{ color: ACCOMPAGNEMENT_CONFIG.express.textColor }}
            >
              <Filter size={11} />
              Voir ces {expressTasks.length} tâche{expressTasks.length !== 1 ? "s" : ""}
            </button>
          </div>

          {/* Guidé */}
          <div className="lecko-card p-5" style={{ borderLeft: `3px solid ${ACCOMPAGNEMENT_CONFIG.guide.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.guide.color }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCOMPAGNEMENT_CONFIG.guide.textColor }}>
                Avec le Copilot
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {guideTasks.length} tâche{guideTasks.length !== 1 ? "s" : ""} avec guide pas-à-pas
            </p>
            <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
              Le DÉCLIC Copilot vous accompagne étape par étape. Comptez quelques jours de mise en place.
            </p>
            <button
              onClick={() => onFilterAccompagnement("guide")}
              disabled={guideTasks.length === 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
              style={{ color: ACCOMPAGNEMENT_CONFIG.guide.textColor }}
            >
              <Filter size={11} />
              Voir ces {guideTasks.length} tâche{guideTasks.length !== 1 ? "s" : ""}
            </button>
          </div>

          {/* Consultant */}
          <div className="lecko-card p-5" style={{ borderLeft: `3px solid ${ACCOMPAGNEMENT_CONFIG.consultant.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.color }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.textColor }}>
                Accompagnement
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {consultantTasks.length} tâche{consultantTasks.length !== 1 ? "s" : ""} nécessitant un expert
            </p>
            <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
              Intégrations complexes, conduite du changement, architecture SI — un accompagnement expert vous accélère.
            </p>
            <button
              onClick={() => onFilterAccompagnement("consultant")}
              disabled={consultantTasks.length === 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
              style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.textColor }}
            >
              <Filter size={11} />
              Voir ces {consultantTasks.length} tâche{consultantTasks.length !== 1 ? "s" : ""}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Fallback: legacy mode (no accompagnement data)
  const easyWins = tasks.filter(
    (t) => (t.score_criteres ?? 0) >= 3 && t.peut_fonctionner_sans_ia === true
  );
  const aiNeeded = tasks.filter((t) => t.peut_fonctionner_sans_ia === false);

  return (
    <div className="mb-6">
      <p className="label-uppercase mb-3">Par où commencer ?</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Easy wins */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(var(--accent-green-text))" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-gr33t-500 shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gr33t-500">
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
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gr33t-500 hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Filter size={11} />
            Voir ces {easyWins.length} tâche{easyWins.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* AI tasks */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(var(--accent-violet-text))" }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="shrink-0" style={{ color: "hsl(var(--accent-violet-text))" }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--accent-violet-text))" }}>
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
            style={{ color: "hsl(var(--accent-violet-text))" }}
          >
            <Filter size={11} />
            Voir ces {aiNeeded.length} tâche{aiNeeded.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Coach */}
        <div className="lecko-card p-5" style={{ borderLeft: "3px solid hsl(var(--primary))" }}>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-primary shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Besoin d'un guide ?
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Le Copilot est là</p>
          <p className="text-sm text-foreground-secondary mb-3 leading-relaxed">
            Notre assistant expert vous guide nœud par nœud pour construire chaque automatisation.
          </p>
          <button
            onClick={() => openChat({ task: tasks[0], metier })}
            disabled={tasks.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <MessageCircle size={11} />
            Ouvrir le Copilot
          </button>
        </div>

      </div>
    </div>
  );
}
