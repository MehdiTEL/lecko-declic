import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, GripVertical, User2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TacheMetier {
  id: string;
  nom: string;
  description: string;
  frequence: "quotidien" | "hebdo" | "mensuel" | "ponctuel";
  tempsEstime: number; // heures par occurrence
  penibilite: number; // 1-5
}

export interface MetierZoom {
  metier: string;
  journeeType: string;
  taches: TacheMetier[];
  fluxDonnees: string;
  irritantMajeur: string;
}

interface Props {
  metiers: string[];
  data: MetierZoom[];
  onChange: (data: MetierZoom[]) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FREQUENCE_OPTIONS = [
  { value: "quotidien" as const, label: "Quotidien", short: "1×/j", color: "hsl(var(--destructive))" },
  { value: "hebdo" as const, label: "Hebdo", short: "1×/sem", color: "#F59E0B" },
  { value: "mensuel" as const, label: "Mensuel", short: "1×/mois", color: "#2563EB" },
  { value: "ponctuel" as const, label: "Ponctuel", short: "~", color: "hsl(var(--foreground-muted))" },
];

const PENIBILITE_LEVELS = [
  { value: 1, emoji: "😊", label: "Agréable" },
  { value: 2, emoji: "🙂", label: "OK" },
  { value: 3, emoji: "😐", label: "Neutre" },
  { value: 4, emoji: "😤", label: "Pénible" },
  { value: 5, emoji: "🤯", label: "Épuisant" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PhaseZoomMetier({ metiers, data, onChange }: Props) {
  const [activeMetierIdx, setActiveMetierIdx] = useState(0);

  const updateMetier = (idx: number, patch: Partial<MetierZoom>) => {
    const next = [...data];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const addTache = (idx: number) => {
    const next = [...data];
    next[idx].taches.push({
      id: generateId(),
      nom: "",
      description: "",
      frequence: "quotidien",
      tempsEstime: 1,
      penibilite: 3,
    });
    onChange(next);
  };

  const updateTache = (metierIdx: number, tacheIdx: number, patch: Partial<TacheMetier>) => {
    const next = [...data];
    next[metierIdx].taches[tacheIdx] = { ...next[metierIdx].taches[tacheIdx], ...patch };
    onChange(next);
  };

  const removeTache = (metierIdx: number, tacheIdx: number) => {
    const next = [...data];
    next[metierIdx].taches.splice(tacheIdx, 1);
    onChange(next);
  };

  const current = data[activeMetierIdx];
  if (!current) return null;

  const totalHeuresHebdo = current.taches.reduce((s, t) => {
    const mult = t.frequence === "quotidien" ? 5 : t.frequence === "hebdo" ? 1 : t.frequence === "mensuel" ? 0.25 : 0.1;
    return s + t.tempsEstime * mult;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs métiers */}
      {metiers.length > 1 && (
        <div className="flex gap-2 mb-8">
          {metiers.map((m, i) => {
            const metierData = data[i];
            const hasTaches = metierData?.taches.length > 0;
            return (
              <button
                key={m}
                onClick={() => setActiveMetierIdx(i)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all",
                  i === activeMetierIdx
                    ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                )}
              >
                <User2 size={15} />
                {m}
                {hasTaches && (
                  <span className="text-[10px] font-mono bg-brand-blue/30 text-brand-blue px-1.5 py-0.5 rounded-full">
                    {metierData.taches.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeMetierIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Titre */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              {current.metier}
            </h2>
            <p className="text-slate-400 text-sm">Décrivons en détail le quotidien de ce métier</p>
          </div>

          {/* Journée type */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={18} className="text-brand-blue" />
              <p className="text-white text-lg font-medium">
                À quoi ressemble une journée type ?
              </p>
            </div>
            <textarea
              rows={3}
              value={current.journeeType}
              onChange={(e) => updateMetier(activeMetierIdx, { journeeType: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-brand-blue transition-colors resize-none leading-relaxed"
              placeholder="Ex: 8h-9h traitement des mails et demandes urgentes, 9h-11h saisie et vérification des dossiers..."
            />
          </div>

          {/* Tâches structurées */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-white text-lg font-medium">
                Tâches récurrentes
              </p>
              {totalHeuresHebdo > 0 && (
                <span className="text-sm font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">
                  ≈ {totalHeuresHebdo.toFixed(1)}h/sem
                </span>
              )}
            </div>

            <div className="space-y-3">
              {current.taches.map((tache, tIdx) => (
                <motion.div
                  key={tache.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4"
                >
                  {/* Ligne 1 : nom + supprimer */}
                  <div className="flex items-center gap-3 mb-3">
                    <GripVertical size={14} className="text-slate-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={tache.nom}
                      onChange={(e) => updateTache(activeMetierIdx, tIdx, { nom: e.target.value })}
                      placeholder="Nom de la tâche..."
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium"
                    />
                    <button
                      onClick={() => removeTache(activeMetierIdx, tIdx)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Ligne 2 : description */}
                  <input
                    type="text"
                    value={tache.description}
                    onChange={(e) => updateTache(activeMetierIdx, tIdx, { description: e.target.value })}
                    placeholder="Brève description (optionnel)..."
                    className="w-full bg-transparent text-slate-300 text-sm outline-none placeholder:text-slate-600 mb-3 pl-7"
                  />

                  {/* Ligne 3 : fréquence + temps + pénibilité */}
                  <div className="flex items-center gap-3 pl-7 flex-wrap">
                    {/* Fréquence */}
                    <div className="flex gap-1">
                      {FREQUENCE_OPTIONS.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => updateTache(activeMetierIdx, tIdx, { frequence: f.value })}
                          className={cn(
                            "text-[10px] font-mono px-2 py-1 rounded-md transition-all",
                            tache.frequence === f.value
                              ? "text-white font-bold"
                              : "text-slate-500 hover:text-slate-300"
                          )}
                          style={tache.frequence === f.value ? { backgroundColor: `${f.color}30`, color: f.color } : {}}
                        >
                          {f.short}
                        </button>
                      ))}
                    </div>

                    <div className="h-4 w-px bg-slate-700" />

                    {/* Temps estimé */}
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-slate-500" />
                      <input
                        type="number"
                        min={0.25} max={8} step={0.25}
                        value={tache.tempsEstime}
                        onChange={(e) => updateTache(activeMetierIdx, tIdx, { tempsEstime: Number(e.target.value) })}
                        className="w-12 bg-slate-700 rounded px-1.5 py-0.5 text-xs text-white text-center outline-none"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">h</span>
                    </div>

                    <div className="h-4 w-px bg-slate-700" />

                    {/* Pénibilité */}
                    <div className="flex gap-0.5">
                      {PENIBILITE_LEVELS.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => updateTache(activeMetierIdx, tIdx, { penibilite: p.value })}
                          className={cn(
                            "w-7 h-7 rounded-lg text-center transition-all text-sm",
                            tache.penibilite === p.value
                              ? "bg-slate-600 scale-125"
                              : "opacity-40 hover:opacity-70"
                          )}
                          title={p.label}
                        >
                          {p.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={() => addTache(activeMetierIdx)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 text-sm hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                Ajouter une tâche
              </button>
            </div>
          </div>

          {/* Flux de données */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-white text-lg font-medium mb-4">
              D'où viennent les données, où vont-elles ?
            </p>
            <textarea
              rows={2}
              value={current.fluxDonnees}
              onChange={(e) => updateMetier(activeMetierIdx, { fluxDonnees: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-brand-blue transition-colors resize-none leading-relaxed"
              placeholder="Ex: Les données arrivent par mail, sont saisies dans SAP, puis exportées en Excel pour le DAF..."
            />
          </div>

          {/* Irritant majeur */}
          <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6">
            <p className="text-white text-lg font-medium mb-2">
              🎯 Si vous ne deviez changer qu'UNE seule chose, ce serait quoi ?
            </p>
            <p className="text-slate-400 text-sm mb-4">
              La réponse à cette question guide souvent tout le plan d'action.
            </p>
            <textarea
              rows={2}
              value={current.irritantMajeur}
              onChange={(e) => updateMetier(activeMetierIdx, { irritantMajeur: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-base placeholder:text-slate-600 outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
              placeholder="La chose qui vous ferait dire 'enfin !' si elle disparaissait..."
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
