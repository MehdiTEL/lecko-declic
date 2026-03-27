import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, FileDown, RotateCcw, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  { key: "non_planifie", horizon: null, label: "Non planifie", color: "#6B7280", bg: "#F3F4F6" },
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
  // "12_mois" and "plus" both go in the last column
  return "12_mois_plus";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
      className="bg-white rounded-lg border border-border p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1">
        {chantier.titre}
      </h4>
      {chantier.service_concerne && (
        <p className="text-xs text-foreground-muted mb-2">{chantier.service_concerne}</p>
      )}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded"
          style={{ color: pConfig.color, backgroundColor: pConfig.bg }}
        >
          {pConfig.label}
        </span>
      </div>
      <p className="text-xs text-foreground-muted mb-1.5">
        ~{formatHours(chantier.temps_gagne_heures_semaine)}/sem &middot; {chantier.nb_personnes_impactees} personne{chantier.nb_personnes_impactees > 1 ? "s" : ""}
      </p>
      {chantier.niveau_accompagnement && (
        <span className="inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded bg-accent/10 text-accent">
          {chantier.niveau_accompagnement}
        </span>
      )}
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
  const totalHours = chantiers.reduce(
    (sum, c) => sum + (c.impact_total_heures_an ?? 0),
    0
  );

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
    if (chantierId) {
      onDrop(chantierId, horizonForColumn(col));
    }
  }

  const isOver = dragOver === col.key;

  return (
    <div
      className={`flex flex-col rounded-lg border transition-colors min-w-0 ${
        isOver ? "border-accent ring-2 ring-accent/20" : "border-border"
      }`}
      style={{ backgroundColor: col.bg }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header bar */}
      <div className="px-3 py-2 rounded-t-lg" style={{ backgroundColor: col.color }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{col.label}</span>
          <span className="text-xs text-white/80">
            {chantiers.length} chantier{chantiers.length > 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-xs text-white/70 mt-0.5">
          {Math.round(totalHours)}h/an estimees
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {chantiers.length === 0 && (
          <p className="text-xs text-foreground-muted text-center py-6 italic">
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
    return {
      label: col.label,
      color: col.color,
      count: items.length,
      hoursPerWeek: Math.round(hoursPerWeek * 10) / 10,
      totalHoursYear: Math.round(totalHours),
      leckoCount,
    };
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
      <h2 className="text-lg font-semibold text-foreground mb-3">Synthese</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-surface">
              <th className="text-left px-4 py-2 font-medium text-foreground-muted">Horizon</th>
              <th className="text-right px-4 py-2 font-medium text-foreground-muted">Chantiers</th>
              <th className="text-right px-4 py-2 font-medium text-foreground-muted">Heures/sem</th>
              <th className="text-right px-4 py-2 font-medium text-foreground-muted">Heures/an</th>
              <th className="text-right px-4 py-2 font-medium text-foreground-muted">Accomp. Lecko</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <td className="px-4 py-2 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                  {r.label}
                </td>
                <td className="text-right px-4 py-2">{r.count}</td>
                <td className="text-right px-4 py-2">{r.hoursPerWeek}h</td>
                <td className="text-right px-4 py-2">{r.totalHoursYear}h</td>
                <td className="text-right px-4 py-2">{r.leckoCount}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border bg-surface font-semibold">
              <td className="px-4 py-2">Total</td>
              <td className="text-right px-4 py-2">{totals.count}</td>
              <td className="text-right px-4 py-2">{totals.hoursPerWeek}h</td>
              <td className="text-right px-4 py-2">{totals.totalHoursYear}h</td>
              <td className="text-right px-4 py-2">{totals.leckoCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-foreground-muted mt-2">
        Estimation basee sur un cout moyen de 45&euro;/h
      </p>
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
      setChantiers(
        [...(m.chantiers ?? [])].sort((a, b) => a.ordre - b.ordre)
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Drag & drop handler ──
  async function handleDrop(chantierId: string, horizon: Horizon | null) {
    // Optimistic update
    setChantiers((prev) =>
      prev.map((c) => (c.id === chantierId ? { ...c, horizon } : c))
    );
    try {
      await updateChantier(chantierId, { horizon });
    } catch {
      // Revert on error
      load();
    }
  }

  // ── Reset all horizons ──
  async function handleReset() {
    if (!window.confirm("Reinitialiser tous les horizons ? Les chantiers reviendront dans la colonne Non planifie.")) return;
    setResetting(true);
    try {
      await Promise.all(
        chantiers
          .filter((c) => c.horizon !== null)
          .map((c) => updateChantier(c.id, { horizon: null }))
      );
      setChantiers((prev) => prev.map((c) => ({ ...c, horizon: null })));
    } catch {
      load();
    } finally {
      setResetting(false);
    }
  }

  // ── Bucket chantiers per column ──
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-foreground-muted mb-4 flex-wrap">
          <Link to="/missions" className="hover:text-foreground transition-colors">
            Missions
          </Link>
          <ChevronRight size={14} />
          <Link to={`/missions/${id}`} className="hover:text-foreground transition-colors">
            {mission?.client_organisation ?? "Mission"}
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Feuille de route</span>
        </nav>

        {/* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Feuille de route{mission ? ` \u2014 ${mission.client_organisation}` : ""}
          </h1>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-border text-foreground-muted bg-surface hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Bientot disponible"
            >
              <FileDown size={14} />
              Exporter PDF
            </button>
            <button
              onClick={handleReset}
              disabled={resetting || chantiers.every((c) => c.horizon === null)}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-border text-foreground-muted bg-surface hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={14} className={resetting ? "animate-spin" : ""} />
              Reinitialiser
            </button>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={28} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!loading && !error && chantiers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground-muted mb-2">Aucun chantier identifie pour cette mission.</p>
            <Link to={`/missions/${id}`} className="text-sm text-accent hover:underline">
              Retour a la mission
            </Link>
          </div>
        )}

        {/* Kanban board */}
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
      </main>
      <Footer />
    </div>
  );
}
