import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock, Users, Zap, Target, TrendingUp,
  CheckCircle, AlertTriangle, BarChart3,
  Rocket, Award, Calendar,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type { AnalysisResult } from "@/types/analysis";
import type { TaskWithDecision } from "./PhaseTriCollab";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  serviceName: string;
  results: AnalysisResult[];
  decisions: TaskWithDecision[];
  nbPersonnes: number;
  notesConsultant: string;
  onNotesChange: (notes: string) => void;
  prochaines: string;
  onProchainesChange: (prochaines: string) => void;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, decimals = 0, suffix = "", className }: { value: number; decimals?: number; suffix?: string; className: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span className={className}>{display.toFixed(decimals)}{suffix}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhaseSynthese({
  serviceName, results, decisions, nbPersonnes,
  notesConsultant, onNotesChange, prochaines, onProchainesChange,
}: Props) {
  const validated = decisions.filter((d) => d.decision === "on_fonce");
  const toExplore = decisions.filter((d) => d.decision === "a_creuser");
  const rejected = decisions.filter((d) => d.decision === "pas_pour_nous");

  const heuresValidees = validated.reduce((s, d) => s + d.task.temps_gagne_heures_semaine, 0);
  const heuresCreuser = toExplore.reduce((s, d) => s + d.task.temps_gagne_heures_semaine, 0);
  const heuresAn = Math.round(heuresValidees * nbPersonnes * 46);
  const joursSem = (heuresValidees / 7).toFixed(1);

  // Charts data
  const ecosystemData = useMemo(() => {
    const map = new Map<string, number>();
    validated.forEach((d) => {
      const eco = d.task.ecosysteme?.replace(/_/g, " ") ?? "Autre";
      map.set(eco, (map.get(eco) ?? 0) + d.task.temps_gagne_heures_semaine);
    });
    return Array.from(map, ([name, value]) => ({ name: name.substring(0, 14), value }))
      .sort((a, b) => b.value - a.value);
  }, [validated]);

  const accompData = useMemo(() => {
    const express = validated.filter((d) => d.task.niveau_accompagnement === "express" || d.task.niveau_accompagnement === "autonome").length;
    const guide = validated.filter((d) => d.task.niveau_accompagnement === "guide" || d.task.niveau_accompagnement === "formation").length;
    const expert = validated.filter((d) => d.task.niveau_accompagnement === "consultant" || d.task.niveau_accompagnement === "accompagnement_expert").length;
    return [
      { name: "Autonome", value: express, color: "#10B981" },
      { name: "Guidé", value: guide, color: "#2563EB" },
      { name: "Expert", value: expert, color: "#7C3AED" },
    ].filter((d) => d.value > 0);
  }, [validated]);

  const quickWins = validated
    .filter((d) => d.task.niveau_accompagnement === "express" || d.task.niveau_accompagnement === "autonome")
    .sort((a, b) => b.task.temps_gagne_heures_semaine - a.task.temps_gagne_heures_semaine)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── HERO — Chiffres clés animés ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-lecko-blue/10 border border-slate-800 rounded-3xl p-10"
      >
        <div className="text-center mb-8">
          <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.3em] mb-2">
            Synthèse de l'entretien
          </p>
          <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
            {serviceName}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <AnimatedNumber value={validated.length} className="text-4xl font-bold text-emerald-400 block" />
            <span className="text-slate-400 text-sm font-mono">chantiers validés</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
              <Clock size={24} className="text-amber-400" />
            </div>
            <AnimatedNumber value={heuresValidees} decimals={1} suffix="h" className="text-4xl font-bold text-amber-400 block" />
            <span className="text-slate-400 text-sm font-mono">par semaine</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-lecko-blue/15 flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={24} className="text-lecko-blue" />
            </div>
            <AnimatedNumber value={heuresAn} className="text-4xl font-bold text-lecko-blue block" />
            <span className="text-slate-400 text-sm font-mono">heures/an équipe</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center mx-auto mb-3">
              <Target size={24} className="text-purple-400" />
            </div>
            <AnimatedNumber value={Number(joursSem)} decimals={1} className="text-4xl font-bold text-purple-400 block" />
            <span className="text-slate-400 text-sm font-mono">ETP récupérés</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Écosystèmes */}
        {ecosystemData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <h3 className="text-sm font-mono font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Répartition par écosystème
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ecosystemData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px", fontSize: 12 }}
                  formatter={(value: number) => [`${value}h/sem`, "Impact"]}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Accompagnement */}
        {accompData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <h3 className="text-sm font-mono font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Niveaux d'accompagnement
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={accompData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {accompData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {accompData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-slate-300">{d.name}</span>
                    <span className="text-sm font-bold text-white ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Quick Wins ── */}
      {quickWins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Rocket size={18} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-400">Quick Wins — démarrage immédiat</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickWins.map((qw, i) => (
              <div key={i} className="bg-slate-900/80 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={14} className="text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400">#{i + 1}</span>
                </div>
                <p className="text-sm font-medium text-white mb-2">{qw.task.nom}</p>
                <p className="text-xs text-slate-400 mb-2">{qw.task.solution}</p>
                <span className="text-sm font-bold text-amber-400 font-mono">{qw.task.temps_gagne_heures_semaine}h/sem</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Résumé tri ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{validated.length}</p>
          <p className="text-xs font-mono text-emerald-400/60 mt-1">On fonce</p>
          <p className="text-sm text-slate-400 mt-2">{heuresValidees}h/sem</p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{toExplore.length}</p>
          <p className="text-xs font-mono text-amber-400/60 mt-1">À creuser</p>
          <p className="text-sm text-slate-400 mt-2">{heuresCreuser}h/sem</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-red-400">{rejected.length}</p>
          <p className="text-xs font-mono text-red-400/60 mt-1">Écarté</p>
          <p className="text-sm text-slate-400 mt-2">Non pertinent</p>
        </div>
      </motion.div>

      {/* ── Prochaines étapes ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-lecko-blue" />
          <h3 className="text-lg font-bold text-white">Prochaines étapes</h3>
        </div>
        <textarea
          rows={3}
          value={prochaines}
          onChange={(e) => onProchainesChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-lecko-blue transition-colors resize-none leading-relaxed"
          placeholder="1. Valider le budget avec la DG&#10;2. Déployer les quick wins dès la semaine prochaine&#10;3. Planifier un atelier approfondi pour les chantiers 'à creuser'"
        />
      </motion.div>
    </div>
  );
}
