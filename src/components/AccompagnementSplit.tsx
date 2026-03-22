import { motion } from "framer-motion";
import { Zap, Sparkles, Users, ArrowRight } from "lucide-react";
import { AnalysisTask, AccompagnementLevel, ACCOMPAGNEMENT_CONFIG } from "@/types/analysis";

interface AccompagnementSplitProps {
  tasks: AnalysisTask[];
  metier: string;
}

const ICONS = { express: Zap, guide: Sparkles, consultant: Users } as const;
const LEVELS: AccompagnementLevel[] = ["express", "guide", "consultant"];

export default function AccompagnementSplit({ tasks }: AccompagnementSplitProps) {
  // Only render if tasks have the new field
  const enriched = tasks.filter((t) => t.niveau_accompagnement);
  if (enriched.length === 0) return null;

  const counts: Record<AccompagnementLevel, AnalysisTask[]> = {
    express: enriched.filter((t) => t.niveau_accompagnement === "express"),
    guide: enriched.filter((t) => t.niveau_accompagnement === "guide"),
    consultant: enriched.filter((t) => t.niveau_accompagnement === "consultant"),
  };

  const total = enriched.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="lecko-card p-5 md:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
        Parcours d'accompagnement
      </p>
      <p className="text-sm text-foreground-secondary mb-5">
        Voici comment passer à l'action sur vos {total} tâches
      </p>

      {/* Stacked bar */}
      <div className="flex h-10 rounded-full overflow-hidden mb-6">
        {LEVELS.map((level, i) => {
          const pct = total > 0 ? (counts[level].length / total) * 100 : 0;
          if (pct === 0) return null;
          const conf = ACCOMPAGNEMENT_CONFIG[level];
          return (
            <motion.div
              key={level}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              className="flex items-center justify-center"
              style={{ backgroundColor: conf.color }}
            >
              {pct >= 15 && (
                <span className="text-white text-xs font-bold whitespace-nowrap">
                  {counts[level].length} {conf.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 3 description blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {LEVELS.map((level) => {
          const conf = ACCOMPAGNEMENT_CONFIG[level];
          const Icon = ICONS[level];
          const levelTasks = counts[level];
          if (levelTasks.length === 0) return null;

          const shown = levelTasks.slice(0, 3);
          const remaining = levelTasks.length - shown.length;

          return (
            <div key={level} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: conf.color }}
                />
                <Icon size={14} style={{ color: conf.color }} strokeWidth={1.5} />
                <span className="text-sm font-bold text-foreground">
                  {conf.label}
                </span>
                <span className="text-xs text-foreground-muted">
                  ({levelTasks.length} tâche{levelTasks.length > 1 ? "s" : ""})
                </span>
              </div>

              <p className="text-xs text-foreground-secondary leading-relaxed">
                {conf.description}
              </p>

              <div className="space-y-0.5">
                {shown.map((t) => (
                  <p key={t.nom} className="text-xs text-foreground-muted truncate">
                    • {t.nom}
                  </p>
                ))}
                {remaining > 0 && (
                  <p className="text-xs text-foreground-muted italic">
                    +{remaining} autre{remaining > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA for consultant tasks */}
      {counts.consultant.length > 0 && (
        <div
          className="rounded-xl p-4 mt-2"
          style={{
            backgroundColor: ACCOMPAGNEMENT_CONFIG.consultant.bgLight,
            borderLeft: `3px solid ${ACCOMPAGNEMENT_CONFIG.consultant.color}`,
          }}
        >
          <p className="text-sm text-foreground-secondary leading-relaxed mb-2">
            Pour{" "}
            <span className="font-semibold" style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.textColor }}>
              {counts.consultant.length} tâche{counts.consultant.length > 1 ? "s" : ""}
            </span>
            , un accompagnement Lecko accélérera significativement la mise en place et sécurisera le
            déploiement.
          </p>
          <a
            href="https://calendly.com/lecko/decouverte"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
            style={{ color: ACCOMPAGNEMENT_CONFIG.consultant.textColor }}
          >
            Réserver un échange
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </motion.div>
  );
}
