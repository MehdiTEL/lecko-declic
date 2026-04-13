import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { AnalysisResult } from "@/types/analysis";

interface InsightKillerProps {
  result: AnalysisResult;
}

function generateInsight(result: AnalysisResult) {
  const autoTasks = result.taches.filter(t => t.categorie === "automatisable");
  const totalHours = result.heures_economisees_semaine;
  const autoMinutes = Math.round(autoTasks.reduce((s, t) => s + t.temps_gagne_heures_semaine, 0) * 60);
  const machineMinutes = Math.max(5, Math.round(autoMinutes * 0.03));

  const headline = `Vous passez environ ${totalHours}h par semaine sur des tâches qu'une automatisation traiterait en ${machineMinutes} minutes.`;
  const detail = `${autoTasks.length} de vos ${result.taches.length} tâches sont automatisables. Cela représente ${Math.round(totalHours * 47)} heures récupérées par an.`;

  const quickWins = autoTasks
    .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
    .slice(0, 3)
    .map(t => t.nom);

  return { headline, detail, quickWins };
}

export default function InsightKiller({ result }: InsightKillerProps) {
  const insight = generateInsight(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{ backgroundColor: "hsl(var(--brand-blue))" }}
    >
      {/* Deco — orange circle */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
        style={{ backgroundColor: "hsl(var(--brand-orange))" }}
        aria-hidden
      />

      <div className="relative z-10">
        <p className="text-white text-lg md:text-xl font-bold leading-snug mb-3">
          {insight.headline}
        </p>

        <p className="text-white/75 text-sm mb-5">
          {insight.detail}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider self-center mr-1">
            Quick wins :
          </span>
          {insight.quickWins.map((qw) => (
            <span
              key={qw}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm"
            >
              <Zap size={10} />
              {qw}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
