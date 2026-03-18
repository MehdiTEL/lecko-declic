import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
const LECKO_MISSION_COST = 15000;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/]/g, "")
    .trim();
}

export function getDefaultRate(metier: string): number {
  const q = normalize(metier);
  for (const [key, rate] of Object.entries(DEFAULT_HOURLY_RATES)) {
    if (q.includes(key) || key.includes(q)) return rate;
  }
  return DEFAULT_RATE;
}

// ─── Euro formatter ────────────────────────────────────────────────────────
export function formatEur(n: number): string {
  return (
    Math.round(n)
      .toLocaleString("fr-FR", { useGrouping: true })
      .replace(/\s/g, "\u00A0") + "\u00A0€"
  );
}

// ─── Comparison text ────────────────────────────────────────────────────────
function getComparison(annualEur: number, weekEur: number): string {
  if (annualEur <= 0) return "";
  const payback = Math.ceil(LECKO_MISSION_COST / Math.max(weekEur, 1));
  const base =
    annualEur < 10000
      ? `l'équivalent de ${Math.round(annualEur / 750)} jours de prestation conseil`
      : annualEur < 30000
      ? "l'équivalent d'un mi-temps"
      : annualEur < 60000
      ? "l'équivalent d'un salaire junior à temps plein"
      : `l'équivalent de ${(annualEur / 35000).toFixed(1)} collaborateurs à temps plein`;

  return `Soit ${base}. Un accompagnement Lecko se rentabilise en moyenne en ${payback} semaine${payback > 1 ? "s" : ""}.`;
}

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedValue({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    const startTime = performance.now();
    const duration = 800;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, delay]);

  return <>{formatEur(displayed)}</>;
}

// ─── ROI KPI card ─────────────────────────────────────────────────────────────
interface RoiKpiProps {
  icon: string;
  label: string;
  value: number;
  color: "orange" | "blue";
  large?: boolean;
  delay?: number;
}

function RoiKpi({ icon, label, value, color, large, delay = 0 }: RoiKpiProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="lecko-card p-4 flex flex-col items-center text-center gap-1"
    >
      <span className="text-xl mb-1">{icon}</span>
      <span
        className={`font-bold ${large ? "text-3xl" : "text-2xl"} ${
          color === "orange" ? "text-lecko-orange" : "text-lecko-blue"
        }`}
      >
        <AnimatedValue value={value} delay={delay} />
      </span>
      <span className="text-xs text-foreground-muted font-medium">{label}</span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface RoiCalculatorProps {
  hoursPerWeek: number;
  metier: string;
  defaultPeople?: number;
  fixedPeople?: boolean; // if true, hide the people input (controlled externally)
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

  // notify parent on init
  useEffect(() => {
    onParamsChange?.(hourlyRate, nbPeople);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRateChange = (v: number) => {
    setHourlyRate(v);
    onParamsChange?.(v, nbPeople);
  };

  const handlePeopleChange = (v: number) => {
    setNbPeople(v);
    onParamsChange?.(hourlyRate, v);
  };

  const weekEur = hoursPerWeek * hourlyRate * nbPeople;
  const monthEur = weekEur * 4.33;
  const yearEur = weekEur * 47;
  const etp = (hoursPerWeek * nbPeople) / 35;
  const comparison = getComparison(yearEur, weekEur);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 md:p-8 border border-border"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
        💰 Estimez vos{" "}
        <span className="text-lecko-orange">économies</span>
      </h2>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1.5">
            Coût horaire chargé (€/h)
          </label>
          <input
            type="number"
            min={10}
            max={500}
            value={hourlyRate}
            onChange={(e) => handleRateChange(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full h-10 px-3 text-sm font-bold bg-card border-2 border-border rounded-xl outline-none focus:border-lecko-blue transition-colors text-foreground"
          />
          <p className="text-xs text-foreground-muted mt-1">
            Salaire brut chargé divisé par 151,67h/mois
          </p>
        </div>

        {!fixedPeople && (
          <div className="flex-1 sm:max-w-[180px]">
            <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1.5">
              Nombre de personnes
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={nbPeople}
              onChange={(e) => handlePeopleChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-10 px-3 text-sm font-bold bg-card border-2 border-border rounded-xl outline-none focus:border-lecko-blue transition-colors text-foreground"
            />
          </div>
        )}
      </div>

      {/* ROI KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <RoiKpi icon="💶" label="Économie / semaine" value={weekEur} color="orange" delay={0} />
        <RoiKpi icon="📅" label="Économie / mois" value={monthEur} color="blue" delay={0.08} />
        <RoiKpi icon="📆" label="Économie / an" value={yearEur} color="blue" large delay={0.16} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="lecko-card p-4 flex flex-col items-center text-center gap-1"
        >
          <span className="text-xl mb-1">👤</span>
          <span className="font-bold text-2xl text-lecko-green">
            {etp.toFixed(1)}
          </span>
          <span className="text-xs text-foreground-muted font-medium">équivalent temps plein</span>
        </motion.div>
      </div>

      {/* Comparison bar */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-lecko-orange/20 bg-lecko-orange/5 px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📊</span>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                Votre économie annuelle de{" "}
                <span className="text-lecko-orange">{formatEur(yearEur)}</span>{" "}
                représente :
              </p>
              <p className="text-sm text-foreground-secondary">{comparison}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
