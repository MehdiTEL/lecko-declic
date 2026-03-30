import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Clock, AlertTriangle, Zap, Lightbulb,
  ChevronRight, Check, Building2, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_OPTIONS } from "@/types/diagnostic";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DecouverteData {
  // Volumes & charge
  nbPersonnes: number;
  heuresAdminParSemaine: number;
  pourcentageRepetitif: number;
  // Organisation
  periodesPointe: string[];
  repartitionTravail: string;
  // Outils
  selectedTools: string[];
  satisfactionOutils: number; // 1-5
  outilsManquants: string;
  // Douleurs
  douleursPredefinies: string[];
  douleursLibre: string;
  // Ambitions
  ambitions: string;
  tempsLibereUtilisation: string;
}

interface Props {
  serviceName: string;
  metiers: string[];
  data: DecouverteData;
  onChange: (data: DecouverteData) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  { id: "saisie_manuelle", label: "Saisie manuelle répétitive", icon: "⌨️" },
  { id: "copier_coller", label: "Copier-coller entre outils", icon: "📋" },
  { id: "emails_volume", label: "Volume d'emails ingérable", icon: "📧" },
  { id: "reporting_long", label: "Reporting chronophage", icon: "📊" },
  { id: "recherche_info", label: "Recherche d'infos dispersées", icon: "🔍" },
  { id: "validation_lente", label: "Circuits de validation lents", icon: "⏳" },
  { id: "erreurs_humaines", label: "Erreurs humaines fréquentes", icon: "⚠️" },
  { id: "formation_outils", label: "Outils mal maîtrisés", icon: "🎓" },
  { id: "silos_equipes", label: "Silos entre équipes", icon: "🧱" },
  { id: "suivi_projets", label: "Suivi de projets opaque", icon: "📅" },
  { id: "relances_manuelles", label: "Relances manuelles", icon: "🔔" },
  { id: "donnees_dispersees", label: "Données non centralisées", icon: "🗄️" },
];

const PERIODES_POINTE = [
  { id: "fin_mois", label: "Fin de mois" },
  { id: "fin_trimestre", label: "Fin de trimestre" },
  { id: "debut_annee", label: "Début d'année" },
  { id: "budget", label: "Période budgétaire" },
  { id: "rentree", label: "Rentrée" },
  { id: "conges", label: "Périodes de congés" },
  { id: "permanente", label: "Charge permanente" },
];

const THEMES = [
  { id: "volumes", label: "Volumes & charge", icon: BarChart3, color: "#2563EB" },
  { id: "organisation", label: "Organisation", icon: Building2, color: "#7C3AED" },
  { id: "outils", label: "Outils & SI", icon: Zap, color: "#059669" },
  { id: "douleurs", label: "Points de friction", icon: AlertTriangle, color: "#F59E0B" },
  { id: "ambitions", label: "Vision & ambitions", icon: Lightbulb, color: "#EC4899" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhaseDecouverte({ serviceName, metiers, data, onChange }: Props) {
  const [activeTheme, setActiveTheme] = useState<string>("volumes");

  const update = <K extends keyof DecouverteData>(key: K, value: DecouverteData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const themeCompletion = {
    volumes: data.nbPersonnes > 0 && data.heuresAdminParSemaine > 0 ? 100 : data.nbPersonnes > 0 ? 50 : 0,
    organisation: data.periodesPointe.length > 0 ? 100 : 0,
    outils: data.selectedTools.length > 0 ? 100 : 0,
    douleurs: data.douleursPredefinies.length > 0 || data.douleursLibre.length > 0 ? 100 : 0,
    ambitions: data.ambitions.length > 0 ? 100 : 0,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header service */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
          {serviceName}
        </h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {metiers.map((m) => (
            <span key={m} className="bg-lecko-blue/20 text-lecko-blue text-sm font-mono px-3 py-1 rounded-lg">
              {m}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Navigation thèmes — tabs horizontaux */}
      <div className="flex gap-1 mb-8 bg-slate-900/50 rounded-2xl p-1.5 overflow-x-auto">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isActive = activeTheme === theme.id;
          const isComplete = themeCompletion[theme.id as keyof typeof themeCompletion] === 100;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center",
                isActive
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              {isComplete ? (
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.color }}>
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              ) : (
                <Icon size={16} style={{ color: isActive ? theme.color : undefined }} />
              )}
              <span className="hidden sm:inline">{theme.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu thème actif */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── VOLUMES & CHARGE ── */}
          {activeTheme === "volumes" && (
            <div className="space-y-8">
              {/* Nombre de personnes */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Users size={18} className="text-blue-400" />
                  <p className="text-white text-lg font-medium">Combien de personnes dans l'équipe ?</p>
                </div>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min={1} max={200} step={1}
                    value={data.nbPersonnes}
                    onChange={(e) => update("nbPersonnes", Number(e.target.value))}
                    className="flex-1 accent-lecko-blue h-2 rounded-full"
                  />
                  <div className="bg-slate-800 rounded-xl px-5 py-3 min-w-[80px] text-center">
                    <span className="text-3xl font-bold text-lecko-blue font-consultant">{data.nbPersonnes}</span>
                    <span className="text-slate-400 text-xs block font-mono">pers.</span>
                  </div>
                </div>
              </div>

              {/* Heures admin */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Clock size={18} className="text-blue-400" />
                  <p className="text-white text-lg font-medium">
                    Heures par semaine sur des tâches administratives / répétitives ?
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min={0} max={35} step={0.5}
                    value={data.heuresAdminParSemaine}
                    onChange={(e) => update("heuresAdminParSemaine", Number(e.target.value))}
                    className="flex-1 accent-amber-400 h-2 rounded-full"
                  />
                  <div className="bg-slate-800 rounded-xl px-5 py-3 min-w-[80px] text-center">
                    <span className="text-3xl font-bold text-amber-400 font-consultant">{data.heuresAdminParSemaine}</span>
                    <span className="text-slate-400 text-xs block font-mono">h/sem</span>
                  </div>
                </div>
                {data.heuresAdminParSemaine > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-slate-500 text-sm mt-3 font-mono">
                    = {Math.round(data.heuresAdminParSemaine * data.nbPersonnes * 46)} heures/an pour l'équipe
                  </motion.p>
                )}
              </div>

              {/* Pourcentage répétitif */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-5">
                  Quel pourcentage de ces tâches est vraiment répétitif (même processus, même format) ?
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[20, 40, 60, 80, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => update("pourcentageRepetitif", pct)}
                      className={cn(
                        "py-4 rounded-xl text-center transition-all border-2",
                        data.pourcentageRepetitif === pct
                          ? "bg-lecko-blue/20 border-lecko-blue text-white"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      <span className="text-2xl font-bold font-consultant block">{pct}%</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {pct <= 20 ? "Peu" : pct <= 40 ? "Modéré" : pct <= 60 ? "Moyen" : pct <= 80 ? "Beaucoup" : "Quasi tout"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORGANISATION ── */}
          {activeTheme === "organisation" && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-5">
                  Quelles sont vos périodes de charge intense ?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PERIODES_POINTE.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        const next = data.periodesPointe.includes(p.id)
                          ? data.periodesPointe.filter((x) => x !== p.id)
                          : [...data.periodesPointe, p.id];
                        update("periodesPointe", next);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border",
                        data.periodesPointe.includes(p.id)
                          ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {data.periodesPointe.includes(p.id) && <Check size={14} />}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-4">
                  Comment le travail est-il réparti dans l'équipe ?
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  Chacun fait tout ? Des spécialisations par dossier/client ? Un workflow séquentiel ?
                </p>
                <textarea
                  rows={3}
                  value={data.repartitionTravail}
                  onChange={(e) => update("repartitionTravail", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                  placeholder="Ex: Chaque gestionnaire gère un portefeuille de dossiers de A à Z..."
                />
              </div>
            </div>
          )}

          {/* ── OUTILS & SI ── */}
          {activeTheme === "outils" && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-5">
                  Quels outils utilisez-vous au quotidien ?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOOL_OPTIONS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        const next = data.selectedTools.includes(tool.id)
                          ? data.selectedTools.filter((t) => t !== tool.id)
                          : [...data.selectedTools, tool.id];
                        update("selectedTools", next);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border text-left",
                        data.selectedTools.includes(tool.id)
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {data.selectedTools.includes(tool.id) ? (
                        <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border border-slate-600 flex-shrink-0" />
                      )}
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-4">
                  Satisfaction globale avec vos outils ?
                </p>
                <div className="flex gap-3">
                  {[
                    { val: 1, emoji: "😫", label: "Pénible" },
                    { val: 2, emoji: "😕", label: "Insuffisant" },
                    { val: 3, emoji: "😐", label: "Correct" },
                    { val: 4, emoji: "🙂", label: "Bien" },
                    { val: 5, emoji: "🤩", label: "Excellent" },
                  ].map(({ val, emoji, label }) => (
                    <button
                      key={val}
                      onClick={() => update("satisfactionOutils", val)}
                      className={cn(
                        "flex-1 py-4 rounded-xl text-center transition-all border-2",
                        data.satisfactionOutils === val
                          ? "bg-emerald-500/20 border-emerald-500 scale-110"
                          : "bg-slate-800 border-slate-700 hover:border-slate-600"
                      )}
                    >
                      <span className="text-2xl block mb-1">{emoji}</span>
                      <span className="text-[11px] font-mono text-slate-400">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-4">
                  Un outil ou une fonctionnalité qui vous manque ?
                </p>
                <textarea
                  rows={2}
                  value={data.outilsManquants}
                  onChange={(e) => update("outilsManquants", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                  placeholder="Ex: Un vrai outil de suivi de projet, un CRM intégré..."
                />
              </div>
            </div>
          )}

          {/* ── DOULEURS ── */}
          {activeTheme === "douleurs" && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-2">
                  Quels sont vos points de friction au quotidien ?
                </p>
                <p className="text-slate-400 text-sm mb-5">
                  Sélectionnez tout ce qui résonne. Plus c'est précis, meilleure sera l'analyse.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAIN_POINTS.map((pain) => {
                    const selected = data.douleursPredefinies.includes(pain.id);
                    return (
                      <button
                        key={pain.id}
                        onClick={() => {
                          const next = selected
                            ? data.douleursPredefinies.filter((x) => x !== pain.id)
                            : [...data.douleursPredefinies, pain.id];
                          update("douleursPredefinies", next);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border",
                          selected
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        )}
                      >
                        <span className="text-xl flex-shrink-0">{pain.icon}</span>
                        <span className="text-sm">{pain.label}</span>
                        {selected && <Check size={14} className="ml-auto text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-4">
                  Autre chose qui vous pèse ?
                </p>
                <textarea
                  rows={3}
                  value={data.douleursLibre}
                  onChange={(e) => update("douleursLibre", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
                  placeholder="Ce qui n'est pas dans la liste mais qui vous fait soupirer..."
                />
              </div>

              {data.douleursPredefinies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center"
                >
                  <p className="text-amber-300 text-lg font-semibold">
                    {data.douleursPredefinies.length} point{data.douleursPredefinies.length > 1 ? "s" : ""} de friction identifié{data.douleursPredefinies.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-amber-400/60 text-sm font-mono mt-1">
                    L'IA va cibler ces zones en priorité
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* ── AMBITIONS ── */}
          {activeTheme === "ambitions" && (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-2">
                  Si vous gagniez 10 heures par semaine, que feriez-vous ?
                </p>
                <p className="text-slate-400 text-sm mb-5">
                  Cette question révèle les vraies priorités du service.
                </p>
                <textarea
                  rows={4}
                  value={data.ambitions}
                  onChange={(e) => update("ambitions", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-pink-500 transition-colors resize-none leading-relaxed"
                  placeholder="Ex: Plus de temps pour l'accompagnement individuel, de l'innovation, réduire la pression sur l'équipe..."
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-white text-lg font-medium mb-4">
                  Quelle serait votre situation idéale dans 12 mois ?
                </p>
                <textarea
                  rows={3}
                  value={data.tempsLibereUtilisation}
                  onChange={(e) => update("tempsLibereUtilisation", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-pink-500 transition-colors resize-none leading-relaxed"
                  placeholder="Ex: Zéro ressaisie manuelle, reporting automatique, équipe sereine..."
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Barre de progression globale */}
      <div className="mt-10 flex items-center gap-3">
        {THEMES.map((theme) => {
          const pct = themeCompletion[theme.id as keyof typeof themeCompletion];
          return (
            <div key={theme.id} className="flex-1">
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: theme.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
