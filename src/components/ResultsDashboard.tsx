/**
 * ResultsDashboard — Interactive ROI dashboard at the bottom of Results page.
 * Sliders to adjust hourly rate + team size, Recharts visualizations,
 * task-level breakdown with toggleable automation rates.
 */
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Sliders, TrendingUp, Clock, Euro, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { AnalysisResult, AnalysisTask, TaskCategory } from "@/types/analysis";

interface ResultsDashboardProps {
  result: AnalysisResult;
  initialRate: number;
  initialPeople: number;
  onParamsChange?: (rate: number, people: number) => void;
}

const CAT_COLORS: Record<TaskCategory, string> = {
  automatisable: "#10B981",
  partiellement_automatisable: "#F59E0B",
  difficilement_automatisable: "#6B7280",
};

const CAT_LABELS: Record<TaskCategory, string> = {
  automatisable: "Automatisable",
  partiellement_automatisable: "Partiel",
  difficilement_automatisable: "Difficile",
};

export default function ResultsDashboard({ result, initialRate, initialPeople, onParamsChange }: ResultsDashboardProps) {
  const [hourlyRate, setHourlyRate] = useState(initialRate);
  const [nbPeople, setNbPeople] = useState(initialPeople);
  const [adoptionRate, setAdoptionRate] = useState(80); // % of estimated savings actually captured
  const [expanded, setExpanded] = useState(false);

  const handleRateChange = useCallback((v: number) => {
    setHourlyRate(v);
    onParamsChange?.(v, nbPeople);
  }, [nbPeople, onParamsChange]);

  const handlePeopleChange = useCallback((v: number) => {
    setNbPeople(v);
    onParamsChange?.(hourlyRate, v);
  }, [hourlyRate, onParamsChange]);

  // ── Computed values ──────────────────────────────────────
  const stats = useMemo(() => {
    const totalHours = result.heures_economisees_semaine;
    const effectiveHours = totalHours * (adoptionRate / 100);
    const weekEur = effectiveHours * hourlyRate * nbPeople;
    const monthEur = weekEur * 4.33;
    const yearEur = weekEur * 47;
    const etp = (effectiveHours * nbPeople) / 35;
    const daysPerYear = Math.round(effectiveHours * 47 / 7);

    return { totalHours, effectiveHours, weekEur, monthEur, yearEur, etp, daysPerYear };
  }, [result, hourlyRate, nbPeople, adoptionRate]);

  // ── Chart data ───────────────────────────────────────────
  const taskBarData = useMemo(() =>
    result.taches
      .filter(t => t.temps_gagne_heures_semaine > 0)
      .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
      .map(t => ({
        name: t.nom.length > 25 ? t.nom.slice(0, 22) + "..." : t.nom,
        fullName: t.nom,
        heures: +(t.temps_gagne_heures_semaine * (adoptionRate / 100)).toFixed(1),
        euros: Math.round(t.temps_gagne_heures_semaine * (adoptionRate / 100) * hourlyRate * nbPeople),
        categorie: t.categorie,
        color: CAT_COLORS[t.categorie],
      })),
    [result.taches, adoptionRate, hourlyRate, nbPeople]
  );

  const categoryPieData = useMemo(() => {
    const cats: Record<string, number> = {};
    result.taches.forEach(t => {
      const label = CAT_LABELS[t.categorie];
      cats[label] = (cats[label] ?? 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({
      name,
      value,
      color: name === "Automatisable" ? "#10B981" : name === "Partiel" ? "#F59E0B" : "#6B7280",
    }));
  }, [result.taches]);

  const projectionData = useMemo(() => [
    { period: "3 mois", value: Math.round(stats.monthEur * 3) },
    { period: "6 mois", value: Math.round(stats.monthEur * 6) },
    { period: "1 an", value: Math.round(stats.yearEur) },
    { period: "2 ans", value: Math.round(stats.yearEur * 2) },
  ], [stats]);

  const radarData = useMemo(() => {
    const keys = ["recurrence", "energie", "scalabilite", "fiabilite", "penibilite"] as const;
    const labels = ["Récurrence", "Énergie", "Scalabilité", "Fiabilité", "Pénibilité"];
    const tasksWithCriteres = result.taches.filter(t => t.criteres);
    const total = tasksWithCriteres.length || 1;
    return keys.map((k, i) => ({
      critere: labels[i],
      value: Math.round((tasksWithCriteres.filter(t => t.criteres?.[k]).length / total) * 100),
    }));
  }, [result.taches]);

  const formatEur = (n: number) => n.toLocaleString("fr-FR") + " €";

  return (
    <section className="border-t border-border pt-8">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-6 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sliders size={16} className="text-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground">Tableau de bord ROI</h2>
            <p className="text-xs text-foreground-muted">Ajustez les paramètres et explorez vos données</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-primary">{formatEur(stats.yearEur)}/an</span>
          {expanded
            ? <ChevronUp size={18} className="text-foreground-muted" />
            : <ChevronDown size={18} className="text-foreground-muted" />
          }
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >

          {/* ── Sliders ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
                  <Euro size={12} /> Taux horaire chargé
                </label>
                <span className="text-sm font-bold text-foreground">{hourlyRate} €/h</span>
              </div>
              <input
                type="range" min={20} max={120} step={5} value={hourlyRate}
                onChange={e => handleRateChange(+e.target.value)}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-foreground-muted mt-1">
                <span>20€</span><span>120€</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
                  <Users size={12} /> Personnes concernées
                </label>
                <span className="text-sm font-bold text-foreground">{nbPeople}</span>
              </div>
              <input
                type="range" min={1} max={50} step={1} value={nbPeople}
                onChange={e => handlePeopleChange(+e.target.value)}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-foreground-muted mt-1">
                <span>1</span><span>50</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5">
                  <TrendingUp size={12} /> Taux d'adoption
                </label>
                <span className="text-sm font-bold text-foreground">{adoptionRate}%</span>
              </div>
              <input
                type="range" min={30} max={100} step={5} value={adoptionRate}
                onChange={e => setAdoptionRate(+e.target.value)}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-foreground-muted mt-1">
                <span>30%</span><span>100%</span>
              </div>
            </div>
          </div>

          {/* ── KPI row ──────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Heures / semaine", value: `${stats.effectiveHours.toFixed(1)}h`, icon: Clock, color: "text-primary" },
              { label: "Économie / mois", value: formatEur(stats.monthEur), icon: Euro, color: "text-foreground" },
              { label: "Économie / an", value: formatEur(stats.yearEur), icon: TrendingUp, color: "text-lecko-orange" },
              { label: "Équivalent ETP", value: stats.etp.toFixed(2), icon: Users, color: "text-primary" },
            ].map(kpi => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="p-4 rounded-xl border border-border text-center">
                  <Icon size={14} className={`${kpi.color} mx-auto mb-1.5`} />
                  <p className={`text-xl font-bold ${kpi.color} leading-none`}>{kpi.value}</p>
                  <p className="text-[10px] text-foreground-muted mt-1">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Charts row ───────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Bar chart — hours by task */}
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-foreground-muted mb-3">Temps gagné par tâche (h/semaine)</p>
              <ResponsiveContainer width="100%" height={Math.max(180, taskBarData.length * 28)}>
                <BarChart data={taskBarData} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "hsl(var(--foreground-muted))" }} />
                  <Tooltip
                    formatter={(value: number, _name: string, props: { payload: { fullName: string; euros: number } }) => [
                      `${value}h/sem — ${props.payload.euros.toLocaleString("fr-FR")}€/sem`,
                      props.payload.fullName,
                    ]}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="heures" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {taskBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Projection chart */}
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-foreground-muted mb-3">Projection d'économies cumulées</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectionData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 10, fill: "hsl(var(--foreground-muted))" }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: number) => [formatEur(value), "Économies"]}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {projectionData.map((_, i) => (
                      <Cell key={i} fill={i === projectionData.length - 1 ? "#F59E0B" : "#2563EB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Second row: Pie + Radar ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Pie — category distribution */}
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-foreground-muted mb-3">Répartition des tâches</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={categoryPieData} dataKey="value" cx="50%" cy="50%"
                      innerRadius={35} outerRadius={60} paddingAngle={3}
                      strokeWidth={0}
                    >
                      {categoryPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryPieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-foreground">{d.name}</span>
                      <span className="text-xs font-bold text-foreground-muted">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar — DÉCLIC criteria */}
            {radarData.some(d => d.value > 0) && (
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-semibold text-foreground-muted mb-3">Profil DÉCLIC (5 critères)</p>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={65}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="critere" tick={{ fontSize: 9, fill: "hsl(var(--foreground-muted))" }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ── Task-level breakdown table ────────────────── */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/30 border-b border-border">
              <p className="text-xs font-semibold text-foreground-muted">Détail par tâche</p>
            </div>
            <div className="divide-y divide-border">
              {result.taches
                .sort((a, b) => b.temps_gagne_heures_semaine - a.temps_gagne_heures_semaine)
                .map(task => {
                  const effectiveH = +(task.temps_gagne_heures_semaine * adoptionRate / 100).toFixed(1);
                  const weekEur = Math.round(effectiveH * hourlyRate * nbPeople);
                  const yearEur = weekEur * 47;
                  return (
                    <div key={task.nom} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[task.categorie] }} />
                      <span className="flex-1 text-foreground truncate text-xs">{task.nom}</span>
                      <span className="text-xs text-foreground-muted font-medium w-14 text-right">{effectiveH}h/sem</span>
                      <span className="text-xs font-semibold text-foreground w-20 text-right">{weekEur.toLocaleString("fr-FR")}€/sem</span>
                      <span className="text-xs text-foreground-muted w-20 text-right">{yearEur.toLocaleString("fr-FR")}€/an</span>
                    </div>
                  );
                })}
              {/* Total row */}
              <div className="px-4 py-3 flex items-center gap-3 bg-primary/5">
                <div className="w-2 h-2 shrink-0" />
                <span className="flex-1 text-xs font-bold text-foreground">Total</span>
                <span className="text-xs font-bold text-primary w-14 text-right">{stats.effectiveHours.toFixed(1)}h</span>
                <span className="text-xs font-bold text-primary w-20 text-right">{Math.round(stats.weekEur).toLocaleString("fr-FR")}€</span>
                <span className="text-xs font-bold text-lecko-orange w-20 text-right">{Math.round(stats.yearEur).toLocaleString("fr-FR")}€</span>
              </div>
            </div>
          </div>

          {/* ── Comparison text ───────────────────────────── */}
          <div className="p-4 rounded-xl bg-muted/30 text-center">
            <p className="text-sm text-foreground-secondary">
              {stats.yearEur > 60000
                ? `${formatEur(stats.yearEur)} par an, c'est l'équivalent de ${(stats.yearEur / 35000).toFixed(1)} collaborateurs à temps plein.`
                : stats.yearEur > 30000
                ? `${formatEur(stats.yearEur)} par an, c'est l'équivalent d'un salaire junior à temps plein.`
                : stats.yearEur > 10000
                ? `${formatEur(stats.yearEur)} par an — soit ${stats.daysPerYear} jours ouvrés libérés pour des tâches à plus forte valeur.`
                : `${formatEur(stats.yearEur)} par an — chaque heure récupérée compte.`
              }
            </p>
          </div>

        </motion.div>
      )}
    </section>
  );
}
