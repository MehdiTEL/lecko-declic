import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  Link2,
  MessageSquare,
  Layers,
  Clock,
  Users,
} from "lucide-react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import { KpiStrip } from "@/components/consultant/KpiStrip";
import { SectionHeader } from "@/components/consultant/SectionHeader";
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
import { SECTOR_LABELS, ORG_SIZE_LABELS } from "@/types/diagnostic";
import type { Sector, OrgSize } from "@/types/diagnostic";

// ─── Tab types ──────────────────────────────────────────────────────────────
type Tab = "overview" | "entretiens" | "chantiers" | "roadmap";

// ─── Entretien statut labels/colors ─────────────────────────────────────────
const ENTRETIEN_STATUT_LABELS: Record<EntretienStatut, string> = {
  a_planifier: "À planifier",
  lien_envoye: "Lien envoyé",
  en_cours: "En cours",
  termine: "Terminé",
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
  const [searchParams] = useSearchParams();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive activeTab from searchParams
  const tabParam = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = tabParam && ["overview", "entretiens", "chantiers", "roadmap"].includes(tabParam) ? tabParam : "overview";
  const setActiveTab = (tab: Tab) => {
    if (tab === "overview") {
      navigate(`/missions/${id}`, { replace: true });
    } else {
      navigate(`/missions/${id}?tab=${tab}`, { replace: true });
    }
  };

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);

  const loadMission = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getMission(id);
      setMission(data);
    } catch {
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

  async function handleSendAsync(entretien: Entretien) {
    try {
      const { token } = await generateAsyncLink(entretien.id);
      const link = `${window.location.origin}/entretien/${token}`;
      await navigator.clipboard.writeText(link);
      setCopiedId(entretien.id);
      setTimeout(() => setCopiedId(null), 2000);
      await loadMission();
      const subject = encodeURIComponent(
        `Questionnaire DÉCLIC — ${mission!.client_organisation} — ${entretien.service_nom}`
      );
      const body = encodeURIComponent(
        `Bonjour,\n\nJe vous invite à remplir ce questionnaire (5 min) :\n\n${link}\n\nLien valable 7 jours.\n\nCordialement`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`);
    } catch {
      // silently fail
    }
  }

  // ─── Determine active section for sidebar ──────────────────────────────────
  const sidebarSection =
    activeTab === "overview"
      ? "overview"
      : activeTab === "entretiens"
      ? "entretiens"
      : activeTab === "chantiers"
      ? "chantiers"
      : "overview";

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <ConsultantLayout activeSection="overview">
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-foreground-muted" size={32} />
        </div>
      </ConsultantLayout>
    );
  }

  if (error || !mission) {
    return (
      <ConsultantLayout activeSection="overview">
        <div className="px-8 py-12">
          <div className="rounded-2xl border border-mission-border p-8 text-center max-w-md mx-auto">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={28} />
            <p className="text-foreground font-medium">{error || "Mission introuvable"}</p>
            <Link
              to="/missions"
              className="text-sm text-lecko-blue hover:underline mt-3 inline-block"
            >
              Retour aux missions
            </Link>
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const entretiens = mission.entretiens ?? [];
  const chantiers = mission.chantiers ?? [];
  const entretiensDone = entretiens.filter((e) => e.statut === "termine").length;
  const servicesCouverts = new Set(entretiens.map((e) => e.service_nom)).size;
  const totalHeuresSem = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);

  const inputCls =
    "w-full bg-white border-2 border-mission-border rounded-xl px-4 py-3 text-sm outline-none focus:border-lecko-blue transition-all placeholder:text-foreground-muted/40 text-foreground";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <ConsultantLayout mission={mission} activeSection={sidebarSection}>
      <div className="px-8 py-8">
        {/* KPI Strip */}
        <KpiStrip
          kpis={[
            {
              label: "Entretiens",
              value: `${entretiensDone}/${entretiens.length}`,
              sublabel: `${servicesCouverts} service${servicesCouverts > 1 ? "s" : ""}`,
              color: "#2563EB",
              icon: MessageSquare,
            },
            {
              label: "Chantiers",
              value: String(chantiers.length),
              icon: Layers,
            },
            {
              label: "Impact",
              value: `${totalHeuresSem}h`,
              sublabel: "par semaine",
              color: "#10B981",
              icon: Clock,
            },
            {
              label: "Personnes",
              value: String(
                new Set(chantiers.map((c) => c.nb_personnes_impactees)).size || entretiens.reduce((s, e) => s + e.nb_personnes, 0)
              ),
              sublabel: "impactées",
              icon: Users,
            },
          ]}
        />

        {/* Tab navigation — inside content */}
        <div className="flex gap-1 mt-8 mb-6 border-b border-mission-border pb-4">
          {(
            [
              { key: "overview" as Tab, label: "Vue d'ensemble" },
              { key: "entretiens" as Tab, label: "Entretiens" },
              { key: "chantiers" as Tab, label: "Chantiers" },
              { key: "roadmap" as Tab, label: "Feuille de route" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-foreground text-background font-semibold"
                  : "text-foreground-muted hover:text-foreground hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Tab: Vue d'ensemble ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-mission-border rounded-2xl p-5 space-y-4">
              <SectionHeader title="Contexte client" />
              {mission.objectif_mission && (
                <div>
                  <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-wide mb-1">
                    Objectif
                  </p>
                  <p className="text-sm text-foreground">{mission.objectif_mission}</p>
                </div>
              )}
              {mission.contexte_si && (
                <div>
                  <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-wide mb-1">
                    Contexte SI
                  </p>
                  <p className="text-sm text-foreground">{mission.contexte_si}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {mission.client_secteur && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-mission-alt text-foreground-muted border border-mission-border">
                    {SECTOR_LABELS[mission.client_secteur as Sector] ?? mission.client_secteur}
                  </span>
                )}
                {mission.client_taille && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-mission-alt text-foreground-muted border border-mission-border">
                    {ORG_SIZE_LABELS[mission.client_taille as OrgSize] ?? mission.client_taille}
                  </span>
                )}
                {mission.date_livraison_prevue && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                    Livraison : {new Date(mission.date_livraison_prevue).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              {mission.contraintes.length > 0 && (
                <div>
                  <p className="text-[11px] font-mono text-foreground-muted uppercase tracking-wide mb-1">
                    Contraintes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mission.contraintes.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-red-50 text-red-700"
                      >
                        {c}
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
            <SectionHeader
              title="Entretiens"
              count={entretiens.length}
              action={
                <button
                  onClick={() => setShowEntretienModal(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:bg-blue-700 transition-all"
                >
                  <Plus size={14} /> Ajouter
                </button>
              }
            />

            {entretiens.length === 0 && (
              <div className="rounded-2xl border border-dashed border-mission-border p-8 text-center">
                <p className="text-foreground-muted text-sm">
                  Aucun entretien pour le moment.
                </p>
              </div>
            )}

            {entretiens.map((ent) => (
              <div
                key={ent.id}
                className="bg-white border border-mission-border rounded-xl p-4 space-y-3 hover:border-lecko-blue/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-consultant font-semibold text-sm text-foreground">
                      {ent.service_nom}
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                      style={{
                        color: ent.mode === "live" ? "#2563EB" : "#F59E0B",
                        backgroundColor: ent.mode === "live" ? "#EFF6FF" : "#FFFBEB",
                      }}
                    >
                      {ent.mode === "live" ? "Live" : "Async"}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                      style={{
                        color: ENTRETIEN_STATUT_COLORS[ent.statut].color,
                        backgroundColor: ENTRETIEN_STATUT_COLORS[ent.statut].bg,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: ENTRETIEN_STATUT_COLORS[ent.statut].color }}
                      />
                      {ENTRETIEN_STATUT_LABELS[ent.statut]}
                    </span>
                  </div>
                </div>

                {ent.metiers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {ent.metiers.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-mission-alt text-foreground-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs font-mono text-foreground-muted">
                  {ent.date_entretien && (
                    <span>
                      {new Date(ent.date_entretien).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {ent.nb_personnes > 0 && (
                    <span>
                      {ent.nb_personnes} personne{ent.nb_personnes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {ent.statut === "a_planifier" && (
                    <>
                      <button
                        onClick={() => navigate(`/missions/${id}/entretien/${ent.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-lecko-blue text-white hover:bg-blue-700 transition-all"
                      >
                        <ExternalLink size={12} /> Lancer
                      </button>
                      <button
                        onClick={() => handleSendAsync(ent)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-mission-border text-foreground hover:bg-mission-alt transition-colors"
                      >
                        {copiedId === ent.id ? <Check size={12} /> : <Link2 size={12} />}
                        Envoyer lien async
                      </button>
                    </>
                  )}
                  {ent.statut === "lien_envoye" && ent.async_token && (
                    <button
                      onClick={() => copyAsyncLink(ent)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-mission-border text-foreground hover:bg-mission-alt transition-colors"
                    >
                      {copiedId === ent.id ? <Check size={12} /> : <Copy size={12} />}
                      Copier le lien
                    </button>
                  )}
                  {ent.statut === "termine" && ent.resultats && ent.resultats.length > 0 && (
                    <button
                      onClick={() => handleImportChantiers(ent)}
                      disabled={importingId === ent.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gr33t-600 text-white hover:bg-gr33t-700 transition-all disabled:opacity-50"
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
          </div>
        )}

        {/* ─── Tab: Chantiers ─────────────────────────────────────────────── */}
        {activeTab === "chantiers" && (
          <ChantiersView missionId={id!} chantiers={mission.chantiers} onUpdate={loadMission} />
        )}

        {/* ─── Tab: Feuille de route ──────────────────────────────────────── */}
        {activeTab === "roadmap" && (
          <div className="rounded-2xl border border-mission-border p-8 text-center">
            <p className="text-foreground-muted text-sm mb-4">
              Consultez la feuille de route complète de cette mission.
            </p>
            <Link
              to={`/missions/${id}/roadmap`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:bg-blue-700 transition-all"
            >
              <ExternalLink size={14} /> Ouvrir la feuille de route
            </Link>
          </div>
        )}
      </div>

      {/* ── Entretien Modal ──────────────────────────────────────────────── */}
      {showEntretienModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowEntretienModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-consultant font-bold text-foreground mb-4">
              Nouvel entretien
            </h2>
            <form onSubmit={handleCreateEntretien} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
                  Service *
                </label>
                <input
                  type="text"
                  required
                  value={entretienForm.service_nom}
                  onChange={(e) =>
                    setEntretienForm((f) => ({ ...f, service_nom: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="ex: Direction Marketing"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
                  Métiers (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={entretienForm.metiers}
                  onChange={(e) =>
                    setEntretienForm((f) => ({ ...f, metiers: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="ex: Chef de projet, Chargé de com"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
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
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
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
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
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
                  className={inputCls}
                  placeholder="ex: Marie Dupont"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-foreground-muted mb-1">
                  Mode
                </label>
                <div className="flex gap-2">
                  {(["live", "async"] as EntretienMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEntretienForm((f) => ({ ...f, mode }))}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        entretienForm.mode === mode
                          ? "border-lecko-blue bg-lecko-blue/5 text-lecko-blue"
                          : "border-mission-border text-foreground-muted hover:text-foreground"
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
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Ajout..." : "Ajouter l'entretien"}
              </button>
            </form>
          </div>
        </div>
      )}
    </ConsultantLayout>
  );
}
