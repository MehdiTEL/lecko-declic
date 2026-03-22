import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BENCHMARK, getPercentile, getSector } from "@/data/benchmarkData";

interface BenchmarkBannerProps {
  score: number;
  metier: string;
  hoursPerWeek: number;
}

export default function BenchmarkBanner({ score, metier }: BenchmarkBannerProps) {
  const avg = BENCHMARK.avgScore;
  const percentile = getPercentile(score);
  const sector = getSector(metier);
  const sectorData = sector ? BENCHMARK.sectors[sector] : null;
  const diff = score - avg;

  // Contextual text
  let message: string;
  let TrendIcon = Minus;
  let trendColor = "text-foreground-muted";

  if (diff > 5) {
    message = `Votre potentiel de ${score}% est supérieur à la moyenne (${avg}%). Vous êtes dans le top ${100 - percentile}% des métiers analysés.`;
    TrendIcon = TrendingUp;
    trendColor = "text-gr33t-600 dark:text-gr33t-400";
  } else if (diff >= -5) {
    message = `Votre potentiel de ${score}% est dans la moyenne (${avg}%). Il y a encore de la marge de progression !`;
    trendColor = "text-foreground-muted";
  } else {
    message = `Votre potentiel de ${score}% est en-dessous de la moyenne (${avg}%). Certaines tâches complexes nécessitent un accompagnement spécifique.`;
    TrendIcon = TrendingDown;
    trendColor = "text-amber-600 dark:text-amber-400";
  }

  // Position on bar (clamped 5-95% to keep marker visible)
  const markerPos = Math.max(5, Math.min(95, score));
  const avgPos = Math.max(5, Math.min(95, avg));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="lecko-card p-5 md:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
        Benchmark
      </p>

      {/* Distribution bar */}
      <div className="relative h-10 mb-4">
        {/* Bar background with gradient */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-gradient-to-r from-muted via-muted to-primary/10 overflow-hidden" />

        {/* Average marker — dashed line */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}
        >
          <span className="text-[10px] font-semibold text-foreground-muted whitespace-nowrap mb-0.5">
            Moy. {avg}%
          </span>
          <div className="flex-1 border-l border-dashed border-foreground-muted/40" />
        </div>

        {/* User score marker — animated */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${markerPos}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md">
              {score}%
              {diff > 5 && (
                <TrendingUp size={11} className="ml-1 text-green-200" strokeWidth={2} />
              )}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Contextual message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <p className="text-sm text-foreground-secondary leading-relaxed flex items-start gap-2">
          <TrendIcon
            size={16}
            className={`shrink-0 mt-0.5 ${trendColor}`}
            strokeWidth={1.5}
          />
          <span>{message}</span>
        </p>

        {/* Sector info */}
        {sectorData && (
          <p className="text-sm text-foreground-muted mt-2 flex items-center gap-2">
            <Building2 size={14} className="shrink-0" strokeWidth={1.5} />
            Dans le secteur {sector}, la moyenne est de {sectorData.avgScore}%.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
