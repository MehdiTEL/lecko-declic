import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Hourly rate defaults by job ─────────────────────────────────────────────
export const DEFAULT_HOURLY_RATES: Record<string, number> = {
  "chef de projet": 55,
  "comptable": 45,
  "developpeur": 60,
  "developer": 60,
  "community manager": 35,
  "assistant de direction": 35,
  "assistante de direction": 35,
  "rh / recruteur": 50,
  "rh recruteur": 50,
  "commercial": 50,
  "consultant": 65,
  "juriste": 70,
  "product manager": 60,
  "responsable marketing": 50,
  "data analyst": 55,
  "designer": 50,
  "ux designer": 50,
  "chargé de communication": 40,
  "directeur financier": 70,
  "daf": 70,
};
export const DEFAULT_RATE = 45;

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s/]/g, "").trim();
}

export function getDefaultRate(metier: string): number {
  const q = normalize(metier);
  for (const [key, rate] of Object.entries(DEFAULT_HOURLY_RATES)) {
    if (q.includes(key) || key.includes(q)) return rate;
  }
  return DEFAULT_RATE;
}

export function formatEur(n: number): string {
  return Math.round(n).toLocaleString("fr-FR", { useGrouping: true }).replace(/\s/g, "\u00A0") + "\u00A0€";
}

function getComparison(annualEur: number): string {
  if (annualEur <= 0) return "";
  const base =
    annualEur < 10000
      ? `l'équivalent de ${Math.round(annualEur / 750)} jours de prestation conseil`
      : annualEur < 30000
      ? "l'équivalent d'un mi-temps"
      : annualEur < 60000
      ? "l'équivalent d'un salaire junior à temps plein"
      : `l'équivalent de ${(annualEur / 35000).toFixed(1)} collaborateurs à temps plein`;
  return `Soit ${base}.`;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedValue({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    const startTime = performance.now();
    const duration = 700;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => { rafRef.current = requestAnimationFrame(animate); }, delay * 1000);
    return () => { clearTimeout(timer); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, delay]);

  return <>{formatEur(displayed)}</>;
}

// ─── ROI KPI card ─────────────────────────────────────────────────────────────
interface RoiKpiProps {
  label: string;
  sublabel?: string;
  value: number;
  accent?: boolean;
  large?: boolean;
  delay?: number;
}

function RoiKpi({ label, sublabel, value, accent, large, delay = 0 }: RoiKpiProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="lecko-card p-4 flex flex-col gap-1"
    >
      <p className="label-uppercase text-[10px] mb-1">{label}</p>
      <span
        className={`font-bold ${large ? "text-2xl" : "text-xl"}`}
        style={{ color: accent ? "hsl(var(--lecko-orange))" : "hsl(var(--primary))" }}
      >
        <AnimatedValue value={value} delay={delay} />
      </span>
      {sublabel && <span className="text-xs text-foreground-muted">{sublabel}</span>}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface RoiCalculatorProps {
  hoursPerWeek: number;
  metier: string;
  defaultPeople?: number;
  fixedPeople?: boolean;
  onParamsChange?: (hourlyRate: number, nbPeople: number) => void;
}

export default function RoiCalculator({
  hoursPerWeek,
  metier,
  defaultPeople = 1,
  fixedPeople = false,
  onParamsChange,
}: RoiCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(() => getDefaultRate(metier));
  const [nbPeople, setNbPeople] = useState(defaultPeople);

  useEffect(() => {
    onParamsChange?.(hourlyRate, nbPeople);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRateChange = (v: number) => { setHourlyRate(v); onParamsChange?.(v, nbPeople); };
  const handlePeopleChange = (v: number) => { setNbPeople(v); onParamsChange?.(hourlyRate, v); };

  const weekEur = hoursPerWeek * hourlyRate * nbPeople;
  const monthEur = weekEur * 4.33;
  const yearEur = weekEur * 47;
  const etp = (hoursPerWeek * nbPeople) / 35;
  const comparison = getComparison(yearEur);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="lecko-card p-6 md:p-8"
    >
      {/* Title */}
      <p className="label-uppercase mb-1 text-[11px]">Calculateur</p>
      <h2 className="text-lg font-bold font-heading text-foreground mb-5">
        Estimez vos <span className="underline-orange">économies</span>
      </h2>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="label-uppercase block mb-1.5 text-[10px]">Coût horaire chargé (€/h)</label>
          <input
            type="number" min={10} max={500} value={hourlyRate}
            onChange={(e) => handleRateChange(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full h-10 px-3 text-sm font-semibold bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-foreground"
          />
          <p className="text-xs text-foreground-muted mt-1">Salaire brut chargé ÷ 151,67h/mois</p>
        </div>
        {!fixedPeople && (
          <div className="flex-1 sm:max-w-[160px]">
            <label className="label-uppercase block mb-1.5 text-[10px]">Nombre de personnes</label>
            <input
              type="number" min={1} max={200} value={nbPeople}
              onChange={(e) => handlePeopleChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-10 px-3 text-sm font-semibold bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>
        )}
      </div>

      {/* ROI KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <RoiKpi label="Économie / semaine" value={weekEur} accent delay={0} />
        <RoiKpi label="Économie / mois" value={monthEur} delay={0.06} />
        <RoiKpi label="Économie / an" value={yearEur} large delay={0.12} />
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="lecko-card p-4 flex flex-col gap-1"
        >
          <p className="label-uppercase text-[10px] mb-1">Équivalent ETP</p>
          <span className="font-bold text-xl text-gr33t-500">{etp.toFixed(1)}</span>
          <span className="text-xs text-foreground-muted">temps plein</span>
        </motion.div>
      </div>

      {/* Comparison */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="callout-orange"
        >
          <p className="font-semibold mb-0.5">
            Votre économie annuelle de <span style={{ color: "hsl(var(--lecko-orange))" }}>{formatEur(yearEur)}</span> représente :
          </p>
          <p>{comparison}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
