import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, Minus, BookOpen, ExternalLink, Wrench } from "lucide-react";
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
  const topPercentile = 100 - percentile;

  let message: string;
  let TrendIcon = Minus;
  let trendColor = "text-foreground-muted";

  if (diff > 5) {
    message = `Votre potentiel de ${score}% est superieur a la moyenne (${avg}%).`;
    TrendIcon = TrendingUp;
    trendColor = "text-gr33t-600 dark:text-gr33t-400";
  } else if (diff >= -5) {
    message = `Votre potentiel de ${score}% est dans la moyenne (${avg}%). Marge de progression disponible.`;
  } else {
    message = `Votre potentiel de ${score}% est en-dessous de la moyenne (${avg}%). Un accompagnement cible peut accelerer les gains.`;
    TrendIcon = TrendingDown;
    trendColor = "text-amber-600 dark:text-amber-400";
  }

  const markerPos = Math.max(5, Math.min(95, score));
  const avgPos = Math.max(5, Math.min(95, avg));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="lecko-card p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Benchmark
        </p>
        {/* Top percentile badge */}
        {topPercentile <= 30 && (
          <span className="text-[10px] font-bold text-gr33t-600 dark:text-gr33t-400 bg-gr33t-50 dark:bg-gr33t-950/30 px-2 py-0.5 rounded-full">
            Top {topPercentile}%
          </span>
        )}
      </div>

      {/* Source badge */}
      <div className="flex items-center gap-1.5 mb-4">
        <BookOpen size={11} className="text-foreground-muted/60" strokeWidth={1.5} />
        <span className="text-[10px] text-foreground-muted/60">
          Analyse de {BENCHMARK.totalOrganisations} organisations — Referentiel Lecko {BENCHMARK.referentielEdition}
        </span>
      </div>

      {/* Distribution bar */}
      <div className="relative h-10 mb-4">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-gradient-to-r from-muted via-muted to-primary/10 overflow-hidden" />

        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}
        >
          <span className="text-[10px] font-semibold text-foreground-muted whitespace-nowrap mb-0.5">
            Moy. {avg}%
          </span>
          <div className="flex-1 border-l border-dashed border-foreground-muted/40" />
        </div>

        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${markerPos}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        >
          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md">
            {score}%
            {diff > 5 && <TrendingUp size={11} className="ml-1 text-green-200" strokeWidth={2} />}
          </span>
        </motion.div>
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        className="space-y-3"
      >
        <p className="text-sm text-foreground-secondary leading-relaxed flex items-start gap-2">
          <TrendIcon size={16} className={`shrink-0 mt-0.5 ${trendColor}`} strokeWidth={1.5} />
          <span>
            {message}
            {topPercentile <= 30 && (
              <strong className="text-foreground"> Vous etes dans le top {topPercentile}% des metiers analyses.</strong>
            )}
          </span>
        </p>

        {/* Sector card */}
        {sectorData && (
          <div className="rounded-xl bg-muted/30 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 size={13} strokeWidth={1.5} />
              Secteur {sector}
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <p className="font-bold text-foreground">{sectorData.avgScore}%</p>
                <p className="text-foreground-muted">Score moyen</p>
              </div>
              <div>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Wrench size={10} strokeWidth={1.5} />
                  {sectorData.topOutil}
                </p>
                <p className="text-foreground-muted">Outil principal</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{sectorData.gainConstate.split(" ")[0]} {sectorData.gainConstate.split(" ")[1]} {sectorData.gainConstate.split(" ")[2]}</p>
                <p className="text-foreground-muted">Gain constate</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Source footer */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <a
          href="https://referentiel.lecko.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-foreground-muted/60 hover:text-foreground-muted transition-colors"
        >
          Donnees issues du Referentiel Lecko
          <ExternalLink size={9} />
        </a>
      </div>
    </motion.div>
  );
}
