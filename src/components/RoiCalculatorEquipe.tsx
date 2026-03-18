import { useState } from "react";
import { motion } from "framer-motion";
import { TeamJobResult } from "@/types/team";
import { getDefaultRate, formatEur, DEFAULT_RATE } from "./RoiCalculator";

const LECKO_MISSION_COST = 15000;

interface RoiCalculatorEquipeProps {
  results: TeamJobResult[];
  onRatesChange?: (rates: Record<string, number>) => void;
}

export default function RoiCalculatorEquipe({ results, onRatesChange }: RoiCalculatorEquipeProps) {
  // per-job hourly rate state, keyed by member id
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    results.forEach((r) => {
      init[r.member.id] = getDefaultRate(r.result.metier);
    });
    return init;
  });

  const updateRate = (id: string, rate: number) => {
    const updated = { ...rates, [id]: rate };
    setRates(updated);
    onRatesChange?.(updated);
  };

  // Aggregated calculations
  const rows = results.map((r) => {
    const rate = rates[r.member.id] ?? DEFAULT_RATE;
    const weekHours = r.result.heures_economisees_semaine * r.member.count;
    const weekEur = weekHours * rate;
    const monthEur = weekEur * 4.33;
    return {
      id: r.member.id,
      metier: r.result.metier,
      count: r.member.count,
      weekHours,
      rate,
      weekEur,
      monthEur,
    };
  });

  const totalPeople = rows.reduce((s, r) => s + r.count, 0);
  const totalWeekHours = rows.reduce((s, r) => s + r.weekHours, 0);
  const totalMonthEur = rows.reduce((s, r) => s + r.monthEur, 0);
  const totalWeekEur = rows.reduce((s, r) => s + r.weekEur, 0);
  const totalYearEur = totalWeekEur * 47;
  const totalEtp = totalWeekHours / 35;
  const payback = Math.ceil(LECKO_MISSION_COST / Math.max(totalWeekEur, 1));

  const comparison =
    totalYearEur < 10000
      ? `l'équivalent de ${Math.round(totalYearEur / 750)} jours de prestation conseil`
      : totalYearEur < 30000
      ? "l'équivalent d'un mi-temps"
      : totalYearEur < 60000
      ? "l'équivalent d'un salaire junior à temps plein"
      : `l'équivalent de ${(totalYearEur / 35000).toFixed(1)} collaborateurs à temps plein`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 md:p-8 border border-border"
      style={{ background: "hsl(var(--background))" }}
    >
      <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
        💰 ROI agrégé de l'<span className="text-lecko-orange">équipe</span>
      </h2>

      {/* Per-job table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-xs font-bold text-foreground-muted uppercase tracking-wider">Métier</th>
              <th className="text-center py-2 px-2 text-xs font-bold text-foreground-muted uppercase tracking-wider">Pers.</th>
              <th className="text-center py-2 px-2 text-xs font-bold text-foreground-muted uppercase tracking-wider">h/sem.</th>
              <th className="text-center py-2 px-2 text-xs font-bold text-foreground-muted uppercase tracking-wider">€/h</th>
              <th className="text-right py-2 pl-2 text-xs font-bold text-foreground-muted uppercase tracking-wider">€/mois</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 pr-4 font-semibold text-foreground">{row.metier}</td>
                <td className="py-2.5 px-2 text-center text-foreground-secondary">{row.count}</td>
                <td className="py-2.5 px-2 text-center text-lecko-blue font-semibold">{row.weekHours}h</td>
                <td className="py-2.5 px-2 text-center">
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={row.rate}
                    onChange={(e) => updateRate(row.id, Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-16 h-7 text-center text-xs font-bold bg-card border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors"
                  />
                  <span className="text-xs text-foreground-muted ml-0.5">€</span>
                </td>
                <td className="py-2.5 pl-2 text-right font-bold text-lecko-green">{formatEur(row.monthEur)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="py-3 pr-4 font-bold text-foreground">TOTAL</td>
              <td className="py-3 px-2 text-center font-bold text-foreground">{totalPeople}</td>
              <td className="py-3 px-2 text-center font-bold text-lecko-blue">{Math.round(totalWeekHours)}h</td>
              <td className="py-3 px-2 text-center text-foreground-muted">—</td>
              <td className="py-3 pl-2 text-right font-bold text-lecko-green text-base">{formatEur(totalMonthEur)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* KPIs row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { icon: "💶", label: "/ semaine", value: totalWeekEur, color: "text-lecko-orange" },
          { icon: "📅", label: "/ mois", value: totalMonthEur, color: "text-lecko-blue" },
          { icon: "📆", label: "/ an", value: totalYearEur, color: "text-lecko-blue" },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="lecko-card p-4 flex flex-col items-center text-center gap-1"
          >
            <span className="text-xl mb-0.5">{k.icon}</span>
            <span className={`font-bold text-2xl ${k.color}`}>{formatEur(k.value)}</span>
            <span className="text-xs text-foreground-muted">{k.label}</span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="lecko-card p-4 flex flex-col items-center text-center gap-1"
        >
          <span className="text-xl mb-0.5">👤</span>
          <span className="font-bold text-2xl text-lecko-green">{totalEtp.toFixed(1)}</span>
          <span className="text-xs text-foreground-muted">équivalent temps plein</span>
        </motion.div>
      </div>

      {/* Comparison */}
      {totalYearEur > 0 && (
        <div className="rounded-xl border border-lecko-orange/20 bg-lecko-orange/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📊</span>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                Économie annuelle de{" "}
                <span className="text-lecko-orange">{formatEur(totalYearEur)}</span> ={" "}
                {comparison}.
              </p>
              <p className="text-sm text-foreground-secondary">
                Un accompagnement Lecko se rentabilise en moyenne en{" "}
                <strong>{payback} semaine{payback > 1 ? "s" : ""}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
