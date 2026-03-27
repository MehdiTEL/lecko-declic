import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Plus, Calendar, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { getMissions, createMission } from "@/lib/consultantDb";
import type { Mission, MissionStatut } from "@/types/consultant";
import { MISSION_STATUT_LABELS, MISSION_STATUT_COLORS } from "@/types/consultant";
import { SECTOR_LABELS, ORG_SIZE_LABELS } from "@/types/diagnostic";
import type { Sector, OrgSize } from "@/types/diagnostic";

// ─── Filter types ────────────────────────────────────────────
type FilterTab = "all" | "en_cours" | "cartographie_terminee" | "archivee";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "en_cours", label: "En cours" },
  { key: "cartographie_terminee", label: "Terminées" },
  { key: "archivee", label: "Archivées" },
];

// ─── Create-mission form state ───────────────────────────────
interface CreateForm {
  client_nom: string;
  client_organisation: string;
  client_secteur: Sector | "";
  client_taille: OrgSize | "";
  client_contact_nom: string;
  client_contact_email: string;
  objectif_mission: string;
  date_livraison_prevue: string;
}

const EMPTY_FORM: CreateForm = {
  client_nom: "",
  client_organisation: "",
  client_secteur: "",
  client_taille: "",
  client_contact_nom: "",
  client_contact_email: "",
  objectif_mission: "",
  date_livraison_prevue: "",
};

// ─── Component ───────────────────────────────────────────────
export default function Missions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load missions on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getMissions();
        if (!cancelled) setMissions(data);
      } catch (err) {
        console.error("Failed to load missions:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Filtered list ───────────────────────────────────────────
  const filtered =
    filter === "all"
      ? missions
      : missions.filter((m) => m.statut === filter);

  // ── Create handler ──────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_nom.trim() || !form.client_organisation.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const mission = await createMission({
        client_nom: form.client_nom.trim(),
        client_organisation: form.client_organisation.trim(),
        client_secteur: form.client_secteur || null,
        client_taille: form.client_taille || null,
        client_contact_nom: form.client_contact_nom.trim() || null,
        client_contact_email: form.client_contact_email.trim() || null,
        client_contact_poste: null,
        objectif_mission: form.objectif_mission.trim() || null,
        contexte_si: null,
        contraintes: [],
        outils_actuels: [],
        budget_indicatif: null,
        statut: "en_cours",
        date_debut: new Date().toISOString().slice(0, 10),
        date_livraison_prevue: form.date_livraison_prevue || null,
      });
      navigate(`/missions/${mission.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────
  function updateField<K extends keyof CreateForm>(key: K, value: CreateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function formatDate(iso: string | null): string | null {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes missions</h1>
            <p className="text-sm text-foreground-muted mt-1">
              Gérez vos missions de conseil en automatisation
            </p>
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setError(null);
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> Nouvelle mission
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-lecko-blue text-white"
                  : "bg-card text-foreground-muted hover:bg-muted"
              }`}
            >
              {tab.label}
              {tab.key === "all" && missions.length > 0 && (
                <span className="ml-1.5 text-xs opacity-75">({missions.length})</span>
              )}
              {tab.key !== "all" && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({missions.filter((m) => m.statut === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-foreground-muted" size={28} />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-foreground-muted" size={40} />
            <p className="text-foreground-muted text-sm mb-2 font-medium">
              Aucune mission active
            </p>
            <p className="text-foreground-muted text-xs mb-6">
              Créez votre première mission pour commencer à accompagner un client.
            </p>
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setError(null);
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={15} /> Créer une mission
            </button>
          </div>
        )}

        {/* Mission cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4">
            {filtered.map((mission) => {
              const entretienCount = mission.entretiens?.length ?? 0;
              const chantierCount = mission.chantiers?.length ?? 0;
              const deliveryDate = formatDate(mission.date_livraison_prevue);

              return (
                <button
                  key={mission.id}
                  onClick={() => navigate(`/missions/${mission.id}`)}
                  className="lecko-card rounded-xl p-5 text-left w-full hover:ring-2 hover:ring-lecko-blue/30 transition-all"
                >
                  {/* Top row: badge + delivery date */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span
                      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        color: MISSION_STATUT_COLORS[mission.statut],
                        backgroundColor: MISSION_STATUT_COLORS[mission.statut] + "18",
                      }}
                    >
                      {MISSION_STATUT_LABELS[mission.statut]}
                    </span>

                    {deliveryDate && (
                      <span className="inline-flex items-center gap-1 text-xs text-foreground-muted whitespace-nowrap">
                        <Calendar size={12} />
                        {deliveryDate}
                      </span>
                    )}
                  </div>

                  {/* Client name + org */}
                  <p className="font-semibold text-foreground">{mission.client_nom}</p>
                  <p className="text-sm text-foreground-muted">{mission.client_organisation}</p>

                  {/* Chips: sector + size */}
                  {(mission.client_secteur || mission.client_taille) && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {mission.client_secteur && (
                        <span className="text-xs bg-muted text-foreground-muted px-2.5 py-0.5 rounded-full">
                          {SECTOR_LABELS[mission.client_secteur]}
                        </span>
                      )}
                      {mission.client_taille && (
                        <span className="text-xs bg-muted text-foreground-muted px-2.5 py-0.5 rounded-full">
                          {ORG_SIZE_LABELS[mission.client_taille]}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress: entretiens + chantiers (shown if joined data present) */}
                  {(entretienCount > 0 || chantierCount > 0) && (
                    <p className="text-xs text-foreground-muted mt-3">
                      {entretienCount} entretien{entretienCount !== 1 ? "s" : ""}
                      {" · "}
                      {chantierCount} chantier{chantierCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* ── Create Modal ─────────────────────────────────────── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Nouvelle mission</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={18} className="text-foreground-muted" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Client name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.client_nom}
                  onChange={(e) => updateField("client_nom", e.target.value)}
                  placeholder="Ex : Marie Dupont"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                />
              </div>

              {/* Organisation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Organisation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.client_organisation}
                  onChange={(e) => updateField("client_organisation", e.target.value)}
                  placeholder="Ex : Mairie de Lyon"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                />
              </div>

              {/* Sector + Size side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Secteur
                  </label>
                  <select
                    value={form.client_secteur}
                    onChange={(e) => updateField("client_secteur", e.target.value as Sector | "")}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                  >
                    <option value="">-- Choisir --</option>
                    {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Taille
                  </label>
                  <select
                    value={form.client_taille}
                    onChange={(e) => updateField("client_taille", e.target.value as OrgSize | "")}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                  >
                    <option value="">-- Choisir --</option>
                    {(Object.entries(ORG_SIZE_LABELS) as [OrgSize, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nom du contact
                </label>
                <input
                  type="text"
                  value={form.client_contact_nom}
                  onChange={(e) => updateField("client_contact_nom", e.target.value)}
                  placeholder="Interlocuteur principal"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                />
              </div>

              {/* Contact email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email du contact
                </label>
                <input
                  type="email"
                  value={form.client_contact_email}
                  onChange={(e) => updateField("client_contact_email", e.target.value)}
                  placeholder="contact@organisation.fr"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                />
              </div>

              {/* Objectif */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Objectif de la mission
                </label>
                <textarea
                  rows={3}
                  value={form.objectif_mission}
                  onChange={(e) => updateField("objectif_mission", e.target.value)}
                  placeholder="Décrivez l'objectif principal de cette mission..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-lecko-blue/40 resize-none"
                />
              </div>

              {/* Date livraison */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date de livraison prévue
                </label>
                <input
                  type="date"
                  value={form.date_livraison_prevue}
                  onChange={(e) => updateField("date_livraison_prevue", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground-muted hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Créer la mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
