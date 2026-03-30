import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, FileDown, RotateCcw } from "lucide-react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import { SectionHeader } from "@/components/consultant/SectionHeader";
import { getMission, updateChantier } from "@/lib/consultantDb";
import type { Mission, Chantier, Horizon, Priorite } from "@/types/consultant";
import { HORIZON_LABELS, PRIORITE_CONFIG } from "@/types/consultant";

// ─── Column definitions ─────────────────────────────────────────────────────
type ColumnKey = "non_planifie" | "3_mois" | "6_mois" | "12_mois_plus";

interface ColumnDef {
  key: ColumnKey;
  horizon: Horizon | null;
  label: string;
  color: string;
  bg: string;
}

const COLUMNS: ColumnDef[] = [
  { key: "non_planifie", horizon: null, label: "Non planifié", color: "#6B7280", bg: "#F3F4F6" },
  { key: "3_mois", horizon: "3_mois", label: HORIZON_LABELS["3_mois"], color: "#10B981", bg: "#ECFDF5" },
  { key: "6_mois", horizon: "6_mois", label: HORIZON_LABELS["6_mois"], color: "#F59E0B", bg: "#FFFBEB" },
  { key: "12_mois_plus", horizon: "12_mois", label: "12 mois+", color: "#8B5CF6", bg: "#F5F3FF" },
];

function horizonForColumn(col: ColumnDef): Horizon | null {
  return col.horizon;
}

function columnForChantier(c: Chantier): ColumnKey {
  if (c.horizon === null) return "non_planifie";
  if (c.horizon === "3_mois") return "3_mois";
  if (c.horizon === "6_mois") return "6_mois";
  return "12_mois_plus";
}

function formatHours(h: number | null): string {
  if (h === null || h === 0) return "0h";
  if (h < 1) return `${Math.round(h * 60)}min`;
  return `${Math.round(h * 10) / 10}h`;
}

// ─── Card component ──────────────────────────────────────────────────────────
function ChantierCard({ chantier }: { chantier: Chantier }) {
  const pConfig = PRIORITE_CONFIG[chantier.priorite as Priorite] ?? PRIORITE_CONFIG.normale;

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", chantier.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-xl border border-mission-border p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-lecko-blue/20 transition-all"
    >
      <h4 className="text-sm font-consultant font-medium text-foreground line-clamp-2 leading-snug mb-1">
        {chantier.titre}
      </h4>
      {chantier.service_concerne && (
        <p className="text-xs font-mono text-foreground-muted mb-2">{chantier.service_concerne}</p>
      )}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full"
          style={{ color: pConfig.color, backgroundColor: pConfig.bg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pConfig.color }} />
          {pConfig.label}
        </span>
      </div>
      <p className="text-xs font-mono text-foreground-muted mb-1.5">
        ~{formatHours(chantier.temps_gagne_heures_semaine)}/sem · {chantier.nb_personnes_impactees} pers.
      </p>
    </div>
  );
}

// ─── Column component ────────────────────────────────────────────────────────
interface KanbanColumnProps {
  col: ColumnDef;
  chantiers: Chantier[];
  onDrop: (chantierId: string, horizon: Horizon | null) => void;
  dragOver: ColumnKey | null;
  onDragOverColumn: (key: ColumnKey | null) => void;
}

function KanbanColumn({ col, chantiers, onDrop, dragOver, onDragOverColumn }: KanbanColumnProps) {
  const totalHours = chantiers.reduce((sum, c) => sum + (c.impact_total_heures_an ?? 0), 0);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOverColumn(col.key);
  }
  function handleDragLeave() {
    onDragOverColumn(null);
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    onDragOverColumn(null);
    const chantierId = e.dataTransfer.getData("text/plain");
    if (chantierId) onDrop(chantierId, horizonForColumn(col));
  }

  const isOver = dragOver === col.key;

  return (
    <div
      className={`flex flex-col rounded-xl border transition-colors min-w-0 overflow-hidden ${
        isOver ? "border-lecko-blue ring-2 ring-lecko-blue/20" : "border-mission-border"
      }`}
      style={{ backgroundColor: col.bg }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-3 py-2 rounded-t-xl" style={{ backgroundColor: col.color }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-consultant font-semibold text-white">{col.label}</span>
          <span className="text-xs font-mono text-white/80">
            {chantiers.length} chantier{chantiers.length > 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-xs font-mono text-white/70 mt-0.5">{Math.round(totalHours)}h/an</p>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {chantiers.length === 0 && (
          <p className="text-xs text-foreground-muted text-center py-6 italic font-mono">
            Glissez un chantier ici
          </p>
        )}
        {chantiers.map((c) => (
          <ChantierCard key={c.id} chantier={c} />
        ))}
      </div>
    </div>
  );
}

// ─── Summary table ───────────────────────────────────────────────────────────
function SummaryTable({ chantiers }: { chantiers: Chantier[] }) {
  const rows = COLUMNS.map((col) => {
    const items = chantiers.filter((c) => columnForChantier(c) === col.key);
    const totalHours = items.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);
    const hoursPerWeek = items.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);
    const leckoCount = items.filter((c) => c.niveau_accompagnement).length;
    return { label: col.label, color: col.color, count: items.length, hoursPerWeek: Math.round(hoursPerWeek * 10) / 10, totalHoursYear: Math.round(totalHours), leckoCount };
  });

  const totals = rows.reduce(
    (acc, r) => ({
      count: acc.count + r.count,
      hoursPerWeek: Math.round((acc.hoursPerWeek + r.hoursPerWeek) * 10) / 10,
      totalHoursYear: acc.totalHoursYear + r.totalHoursYear,
      leckoCount: acc.leckoCount + r.leckoCount,
    }),
    { count: 0, hoursPerWeek: 0, totalHoursYear: 0, leckoCount: 0 }
  );

  return (
    <div className="mt-10">
      <SectionHeader title="Synthèse" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-mission-border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-mission-alt">
              <th className="text-left px-4 py-2 font-mono font-medium text-foreground-muted text-xs">Horizon</th>
              <th className="text-right px-4 py-2 font-mono font-medium text-foreground-muted text-xs">Chantiers</th>
              <th className="text-right px-4 py-2 font-mono font-medium text-foreground-muted text-xs">Heures/sem</th>
              <th className="text-right px-4 py-2 font-mono font-medium text-foreground-muted text-xs">Heures/an</th>
              <th className="text-right px-4 py-2 font-mono font-medium text-foreground-muted text-xs">Accomp.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-mission-border">
                <td className="px-4 py-2 font-consultant font-medium text-sm">
                  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                  {r.label}
                </td>
                <td className="text-right px-4 py-2 font-mono text-sm">{r.count}</td>
                <td className="text-right px-4 py-2 font-mono text-sm">{r.hoursPerWeek}h</td>
                <td className="text-right px-4 py-2 font-mono text-sm">{r.totalHoursYear}h</td>
                <td className="text-right px-4 py-2 font-mono text-sm">{r.leckoCount}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-mission-border bg-mission-alt font-semibold">
              <td className="px-4 py-2 font-consultant">Total</td>
              <td className="text-right px-4 py-2 font-mono">{totals.count}</td>
              <td className="text-right px-4 py-2 font-mono">{totals.hoursPerWeek}h</td>
              <td className="text-right px-4 py-2 font-mono">{totals.totalHoursYear}h</td>
              <td className="text-right px-4 py-2 font-mono">{totals.leckoCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Roadmap() {
  const { id } = useParams<{ id: string }>();
  const [mission, setMission] = useState<Mission | null>(null);
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<ColumnKey | null>(null);
  const [resetting, setResetting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const m = await getMission(id);
      setMission(m);
      setChantiers([...(m.chantiers ?? [])].sort((a, b) => a.ordre - b.ordre));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDrop(chantierId: string, horizon: Horizon | null) {
    setChantiers((prev) => prev.map((c) => (c.id === chantierId ? { ...c, horizon } : c)));
    try {
      await updateChantier(chantierId, { horizon });
    } catch {
      load();
    }
  }

  async function handleReset() {
    if (!window.confirm("Réinitialiser tous les horizons ?")) return;
    setResetting(true);
    try {
      await Promise.all(
        chantiers.filter((c) => c.horizon !== null).map((c) => updateChantier(c.id, { horizon: null }))
      );
      setChantiers((prev) => prev.map((c) => ({ ...c, horizon: null })));
    } catch {
      load();
    } finally {
      setResetting(false);
    }
  }

  const buckets: Record<ColumnKey, Chantier[]> = {
    non_planifie: [],
    "3_mois": [],
    "6_mois": [],
    "12_mois_plus": [],
  };
  for (const c of chantiers) {
    buckets[columnForChantier(c)].push(c);
  }

  return (
    <ConsultantLayout mission={mission} activeSection="roadmap">
      <div className="px-8 py-8">
        {/* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest mb-1">
              Feuille de route
            </p>
            <h1 className="text-2xl font-consultant font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
              {mission ? mission.client_organisation : "Mission"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-mission-border text-foreground-muted hover:bg-mission-alt transition-colors disabled:opacity-50"
            >
              <FileDown size={13} />
              Exporter PDF
            </button>
            <button
              onClick={handleReset}
              disabled={resetting || chantiers.every((c) => c.horizon === null)}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-mission-border text-foreground-muted hover:bg-mission-alt transition-colors disabled:opacity-50"
            >
              <RotateCcw size={13} className={resetting ? "animate-spin" : ""} />
              Réinitialiser
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-foreground-muted" size={28} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!loading && !error && chantiers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground-muted mb-2">Aucun chantier identifié pour cette mission.</p>
            <Link to={`/missions/${id}`} className="text-sm text-lecko-blue hover:underline">
              Retour à la mission
            </Link>
          </div>
        )}

        {!loading && !error && chantiers.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.key}
                  col={col}
                  chantiers={buckets[col.key]}
                  onDrop={handleDrop}
                  dragOver={dragOver}
                  onDragOverColumn={setDragOver}
                />
              ))}
            </div>
            <SummaryTable chantiers={chantiers} />
          </>
        )}
      </div>
    </ConsultantLayout>
  );
}
