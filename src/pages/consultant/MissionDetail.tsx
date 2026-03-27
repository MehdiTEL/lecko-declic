import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Star,
  Circle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChantiersView from "./ChantiersView";
import {
  getMission,
  createEntretien,
  generateAsyncLink,
  importTasksAsChantiers,
} from "@/lib/consultantDb";
import type { Mission, Entretien, EntretienMode, EntretienStatut } from "@/types/consultant";
import {
  MISSION_STATUT_LABELS,
  MISSION_STATUT_COLORS,
} from "@/types/consultant";
import { SECTOR_LABELS } from "@/types/diagnostic";
import { ORG_SIZE_LABELS } from "@/types/diagnostic";
import type { Sector, OrgSize } from "@/types/diagnostic";

// ─── Tab types ──────────────────────────────────────────────────────────────
type Tab = "overview" | "entretiens" | "chantiers" | "roadmap";

const TAB_LABELS: Record<Tab, string> = {
  overview: "Vue d'ensemble",
  entretiens: "Entretiens",
  chantiers: "Chantiers",
  roadmap: "Feuille de route",
};

// ─── Entretien statut labels/colors ─────────────────────────────────────────
const ENTRETIEN_STATUT_LABELS: Record<EntretienStatut, string> = {
  a_planifier: "A planifier",
  lien_envoye: "Lien envoye",
  en_cours: "En cours",
  termine: "Termine",
};
const ENTRETIEN_STATUT_COLORS: Record<EntretienStatut, { color: string; bg: string }> = {
  a_planifier: { color: "#6B7280", bg: "#F3F4F6" },
  lien_envoye: { color: "#F59E0B", bg: "#FFFBEB" },
  en_cours: { color: "#2563EB", bg: "#EFF6FF" },
  termine: { color: "#10B981", bg: "#ECFDF5" },
};

// ─── Main component ─────────────────────────────────────────────────────────
export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Entretien modal
  const [showEntretienModal, setShowEntretienModal] = useState(false);
  const [entretienForm, setEntretienForm] = useState({
    service_nom: "",
    metiers: "",
    nb_personnes: 1,
    interlocuteur_nom: "",
    date_entretien: "",
    mode: "live" as EntretienMode,
  });
  const [submitting, setSubmitting] = useState(false);

  // Clipboard feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Importing chantiers feedback
  const [importingId, setImportingId] = useState<string | null>(null);

  const loadMission = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getMission(id);
      setMission(data);
    } catch (err) {
      setError("Mission introuvable.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMission();
  }, [loadMission]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  async function handleCreateEntretien(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !entretienForm.service_nom.trim()) return;
    setSubmitting(true);
    try {
      await createEntretien({
        mission_id: id,
        service_nom: entretienForm.service_nom.trim(),
        metiers: entretienForm.metiers
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        nb_personnes: entretienForm.nb_personnes,
        interlocuteur_nom: entretienForm.interlocuteur_nom.trim() || null,
        interlocuteur_poste: null,
        date_entretien: entretienForm.date_entretien || null,
        mode: entretienForm.mode,
        notes_consultant: null,
        statut: "a_planifier",
      });
      setShowEntretienModal(false);
      setEntretienForm({
        service_nom: "",
        metiers: "",
        nb_personnes: 1,
        interlocuteur_nom: "",
        date_entretien: "",
        mode: "live",
      });
      await loadMission();
    } catch {
      // keep modal open
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGenerateLink(entretienId: string) {
    try {
      const { token } = await generateAsyncLink(entretienId);
      const url = `${window.location.origin}/entretien/${token}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(entretienId);
      setTimeout(() => setCopiedId(null), 2000);
      await loadMission();
    } catch {
      // silently fail
    }
  }

  function copyAsyncLink(entretien: Entretien) {
    if (!entretien.async_token) return;
    const url = `${window.location.origin}/entretien/${entretien.async_token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(entretien.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleImportChantiers(entretien: Entretien) {
    if (!id || !entretien.resultats) return;
    setImportingId(entretien.id);
    try {
      for (const result of entretien.resultats) {
        await importTasksAsChantiers(
          id,
          entretien.id,
          entretien.service_nom,
          result.metier,
          result.taches
        );
      }
      await loadMission();
    } catch {
      // silently fail
    } finally {
      setImportingId(null);
    }
  }

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-foreground-muted" size={32} />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <Link
            to="/missions"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Mes missions
          </Link>
          <div className="rounded-2xl border border-border p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={28} />
            <p className="text-foreground font-medium">{error || "Mission introuvable"}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const entretiens = mission.entretiens ?? [];
  const chantiers = mission.chantiers ?? [];
  const entretiensDone = entretiens.filter((e) => e.statut === "termine").length;
  const servicesCouverts = new Set(entretiens.map((e) => e.service_nom)).size;
  const totalHeuresSem = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Back link */}
        <Link
          to="/missions"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Mes missions
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{mission.client_nom}</h1>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{
                color: MISSION_STATUT_COLORS[mission.statut],
                backgroundColor: MISSION_STATUT_COLORS[mission.statut] + "18",
              }}
            >
              {MISSION_STATUT_LABELS[mission.statut]}
            </span>
          </div>
          {mission.client_organisation && (
            <p className="text-sm text-foreground-muted mt-1">{mission.client_organisation}</p>
          )}

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {mission.client_secteur && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-foreground-muted">
                {SECTOR_LABELS[mission.client_secteur as Sector] ?? mission.client_secteur}
              </span>
            )}
            {mission.client_taille && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-foreground-muted">
                {ORG_SIZE_LABELS[mission.client_taille as OrgSize] ?? mission.client_taille}
              </span>
            )}
            {mission.date_livraison_prevue && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-alt text-foreground-muted">
                Livraison : {new Date(mission.date_livraison_prevue).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-lecko-blue text-white"
                  : "bg-surface-alt text-foreground-muted hover:text-foreground"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* ─── Tab: Vue d'ensemble ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4">
              <KpiCard label="Entretiens" value={`${entretiensDone}/${entretiens.length}`} />
              <KpiCard label="Services couverts" value={String(servicesCouverts)} />
              <KpiCard label="Chantiers" value={String(chantiers.length)} />
              <KpiCard label="Heures/sem total" value={`${totalHeuresSem}h`} />
            </div>

            {/* Contexte client */}
            <div className="rounded-2xl border border-border p-5 space-y-4">
              <h2 className="text-base font-semibold text-foreground">Contexte client</h2>
              {mission.objectif_mission && (
                <div>
                  <p className="text-xs font-medium text-foreground-muted mb-1">Objectif</p>
                  <p className="text-sm text-foreground">{mission.objectif_mission}</p>
                </div>
              )}
              {mission.contexte_si && (
                <div>
                  <p className="text-xs font-medium text-foreground-muted mb-1">Contexte SI</p>
                  <p className="text-sm text-foreground">{mission.contexte_si}</p>
                </div>
              )}
              {mission.contraintes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground-muted mb-1">Contraintes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.contraintes.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {mission.outils_actuels.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground-muted mb-1">Outils actuels</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.outils_actuels.map((o, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-surface-alt text-foreground-muted"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Tab: Entretiens ────────────────────────────────────────────── */}
        {activeTab === "entretiens" && (
          <div className="space-y-4">
            <button
              onClick={() => setShowEntretienModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={15} /> Ajouter un entretien
            </button>

            {entretiens.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-foreground-muted text-sm">Aucun entretien pour le moment.</p>
              </div>
            )}

            {entretiens.map((ent) => (
              <div key={ent.id} className="rounded-2xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {ent.service_nom}
                    </span>
                    {/* Mode badge */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        color: ent.mode === "live" ? "#2563EB" : "#F59E0B",
                        backgroundColor:
                          ent.mode === "live" ? "#EFF6FF" : "#FFFBEB",
                      }}
                    >
                      {ent.mode === "live" ? "Live" : "Async"}
                    </span>
                    {/* Statut badge */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        color: ENTRETIEN_STATUT_COLORS[ent.statut].color,
                        backgroundColor: ENTRETIEN_STATUT_COLORS[ent.statut].bg,
                      }}
                    >
                      {ENTRETIEN_STATUT_LABELS[ent.statut]}
                    </span>
                  </div>
                </div>

                {/* Metiers pills */}
                {ent.metiers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {ent.metiers.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-surface-alt text-foreground-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-foreground-muted">
                  {ent.date_entretien && (
                    <span>
                      {new Date(ent.date_entretien).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {ent.nb_personnes > 0 && (
                    <span>{ent.nb_personnes} personne{ent.nb_personnes > 1 ? "s" : ""}</span>
                  )}
                </div>

                {/* Actions per statut */}
                <div className="flex flex-wrap gap-2">
                  {ent.statut === "a_planifier" && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/missions/${id}/entretien/${ent.id}`)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-lecko-blue text-white hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={12} /> Lancer
                      </button>
                      <button
                        onClick={() => handleGenerateLink(ent.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-surface-alt transition-colors"
                      >
                        {copiedId === ent.id ? (
                          <Check size={12} />
                        ) : (
                          <Copy size={12} />
                        )}
                        Envoyer lien async
                      </button>
                    </>
                  )}

                  {ent.statut === "lien_envoye" && ent.async_token && (
                    <button
                      onClick={() => copyAsyncLink(ent)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-surface-alt transition-colors"
                    >
                      {copiedId === ent.id ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      Copier le lien
                    </button>
                  )}

                  {ent.statut === "termine" && ent.resultats && ent.resultats.length > 0 && (
                    <button
                      onClick={() => handleImportChantiers(ent)}
                      disabled={importingId === ent.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {importingId === ent.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Plus size={12} />
                      )}
                      Importer chantiers
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Entretien modal */}
            {showEntretienModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-background rounded-2xl border border-border shadow-xl w-full max-w-md p-6 relative">
                  <button
                    onClick={() => setShowEntretienModal(false)}
                    className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
                  >
                    <X size={18} />
                  </button>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Nouvel entretien
                  </h2>
                  <form onSubmit={handleCreateEntretien} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Service *
                      </label>
                      <input
                        type="text"
                        required
                        value={entretienForm.service_nom}
                        onChange={(e) =>
                          setEntretienForm((f) => ({ ...f, service_nom: e.target.value }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                        placeholder="ex: Direction Marketing"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Metiers (separes par des virgules)
                      </label>
                      <input
                        type="text"
                        value={entretienForm.metiers}
                        onChange={(e) =>
                          setEntretienForm((f) => ({ ...f, metiers: e.target.value }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                        placeholder="ex: Chef de projet, Charge de com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground-muted mb-1">
                          Nb personnes
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={entretienForm.nb_personnes}
                          onChange={(e) =>
                            setEntretienForm((f) => ({
                              ...f,
                              nb_personnes: parseInt(e.target.value, 10) || 1,
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground-muted mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={entretienForm.date_entretien}
                          onChange={(e) =>
                            setEntretienForm((f) => ({
                              ...f,
                              date_entretien: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Interlocuteur
                      </label>
                      <input
                        type="text"
                        value={entretienForm.interlocuteur_nom}
                        onChange={(e) =>
                          setEntretienForm((f) => ({
                            ...f,
                            interlocuteur_nom: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                        placeholder="ex: Marie Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Mode
                      </label>
                      <div className="flex gap-2">
                        {(["live", "async"] as EntretienMode[]).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              setEntretienForm((f) => ({ ...f, mode }))
                            }
                            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                              entretienForm.mode === mode
                                ? "border-lecko-blue bg-lecko-blue/10 text-lecko-blue"
                                : "border-border text-foreground-muted hover:text-foreground"
                            }`}
                          >
                            {mode === "live" ? "Live" : "Async"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {submitting ? "Ajout..." : "Ajouter l'entretien"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Tab: Chantiers ─────────────────────────────────────────────── */}
        {activeTab === "chantiers" && (
          <ChantiersView
            missionId={id!}
            chantiers={mission.chantiers}
            onUpdate={loadMission}
          />
        )}

        {/* ─── Tab: Feuille de route ──────────────────────────────────────── */}
        {activeTab === "roadmap" && (
          <div className="rounded-2xl border border-border p-8 text-center">
            <p className="text-foreground-muted text-sm mb-4">
              Consultez la feuille de route complete de cette mission.
            </p>
            <Link
              to={`/missions/${id}/roadmap`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} /> Ouvrir la feuille de route
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs font-medium text-foreground-muted mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
