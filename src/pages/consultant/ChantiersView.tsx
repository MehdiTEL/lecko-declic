import { useState } from "react";
import { Trash2, Star, Circle } from "lucide-react";
import { deleteChantier } from "@/lib/consultantDb";
import type { Chantier, Horizon, Priorite } from "@/types/consultant";
import {
  HORIZON_LABELS,
  PRIORITE_CONFIG,
} from "@/types/consultant";

// ─── Props ──────────────────────────────────────────────────────────────────
interface ChantiersViewProps {
  missionId: string;
  chantiers?: Chantier[];
  onUpdate?: () => void;
}

// ─── Filter options ─────────────────────────────────────────────────────────
const HORIZON_FILTERS: Array<{ value: Horizon | "all"; label: string }> = [
  { value: "all", label: "Tous" },
  { value: "3_mois", label: "3 mois" },
  { value: "6_mois", label: "6 mois" },
  { value: "12_mois", label: "12 mois" },
];

const PRIORITE_FILTERS: Array<{ value: Priorite | "all"; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: "critique", label: "Critique" },
  { value: "haute", label: "Haute" },
  { value: "normale", label: "Normale" },
  { value: "basse", label: "Basse" },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function ChantiersView({ missionId, chantiers: initialChantiers, onUpdate }: ChantiersViewProps) {
  const [chantiers, setChantiers] = useState<Chantier[]>(initialChantiers ?? []);
  const [horizonFilter, setHorizonFilter] = useState<Horizon | "all">("all");
  const [prioriteFilter, setPrioriteFilter] = useState<Priorite | "all">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep in sync when parent reloads
  // We use initialChantiers via key or useEffect alternative — keep local for deletes
  const filtered = chantiers.filter((c) => {
    if (horizonFilter !== "all" && c.horizon !== horizonFilter) return false;
    if (prioriteFilter !== "all" && c.priorite !== prioriteFilter) return false;
    return true;
  });

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteChantier(id);
      setChantiers((prev) => prev.filter((c) => c.id !== id));
      onUpdate?.();
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (chantiers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-foreground-muted text-sm">
          Aucun chantier. Importez des resultats d'entretien pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-2">
        {/* Horizon filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-foreground-muted mr-1">Horizon :</span>
          {HORIZON_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setHorizonFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                horizonFilter === f.value
                  ? "bg-lecko-blue text-white"
                  : "bg-surface-alt text-foreground-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Priorite filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-foreground-muted mr-1">Priorite :</span>
          {PRIORITE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPrioriteFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                prioriteFilter === f.value
                  ? "bg-lecko-blue text-white"
                  : "bg-surface-alt text-foreground-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-foreground-muted">
        {filtered.length} chantier{filtered.length > 1 ? "s" : ""} affiche{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Chantier cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-foreground-muted text-sm">Aucun chantier ne correspond aux filtres.</p>
        </div>
      ) : (
        filtered.map((c) => {
          const pConfig = PRIORITE_CONFIG[c.priorite];
          const impactAnnuel =
            c.impact_total_heures_an ??
            Math.round(c.temps_gagne_heures_semaine * c.nb_personnes_impactees * 47 * 10) / 10;

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-border p-4 space-y-3"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-sm text-foreground leading-snug">
                  {c.titre}
                </span>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  className="shrink-0 p-1.5 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Description */}
              {c.description && (
                <p className="text-xs text-foreground-muted line-clamp-2">
                  {c.description}
                </p>
              )}

              {/* Pills */}
              <div className="flex flex-wrap gap-1.5">
                {c.service_concerne && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {c.service_concerne}
                  </span>
                )}
                {c.metier_source && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {c.metier_source}
                  </span>
                )}
                {c.ecosysteme && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-alt text-foreground-muted">
                    {c.ecosysteme}
                  </span>
                )}
                {c.niveau_accompagnement && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-alt text-foreground-muted">
                    {c.niveau_accompagnement}
                  </span>
                )}
              </div>

              {/* Impact & effort indicators */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Impact stars */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-foreground-muted mr-0.5">Impact</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < c.score_impact
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                {/* Effort dots */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-foreground-muted mr-0.5">Effort</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Circle
                      key={i}
                      size={10}
                      className={
                        i < c.score_effort
                          ? "text-red-400 fill-red-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Badges + time calc */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Priorite badge */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ color: pConfig.color, backgroundColor: pConfig.bg }}
                >
                  {pConfig.label}
                </span>
                {/* Horizon badge */}
                {c.horizon && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-alt text-foreground-muted">
                    {HORIZON_LABELS[c.horizon]}
                  </span>
                )}
                {/* Time calculation */}
                <span className="text-[10px] text-foreground-muted ml-auto">
                  {c.temps_gagne_heures_semaine}h/sem x {c.nb_personnes_impactees} pers. = {impactAnnuel}h/an
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
