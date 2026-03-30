import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getMissions, createMission } from "@/lib/consultantDb";
import { seedDemoMission } from "@/lib/seedDemo";
import type { Mission, MissionStatut } from "@/types/consultant";
import { MISSION_STATUT_LABELS, MISSION_STATUT_COLORS } from "@/types/consultant";
import { SECTOR_LABELS, ORG_SIZE_LABELS } from "@/types/diagnostic";
import type { Sector, OrgSize } from "@/types/diagnostic";

// ─── Filter types ────────────────────────────────────────────
type FilterTab = "Toutes" | "En cours" | "Terminées" | "Archivées";

const TAB_STATUT: Record<FilterTab, MissionStatut | null> = {
  Toutes: null,
  "En cours": "en_cours",
  Terminées: "cartographie_terminee",
  Archivées: "archivee",
};

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
  const [activeTab, setActiveTab] = useState<FilterTab>("Toutes");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    TAB_STATUT[activeTab] === null
      ? missions
      : missions.filter((m) => m.statut === TAB_STATUT[activeTab]);

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

  function updateField<K extends keyof CreateForm>(key: K, value: CreateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const inputCls =
    "w-full bg-white border-2 border-mission-border rounded-xl px-4 py-3 text-sm outline-none focus:border-lecko-blue transition-all placeholder:text-foreground-muted/40 text-foreground";

  return (
    <ConsultantLayout activeSection="missions">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-mission-border">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest mb-1">
              Espace consultant
            </p>
            <h1
              className="text-2xl font-consultant font-bold text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Mes missions
            </h1>
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setError(null);
              setCreateOpen(true);
            }}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-lecko-blue text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus size={15} strokeWidth={2} />
            Nouvelle mission
          </button>
        </div>

        {/* Tabs statut */}
        <div className="flex gap-1 mt-5">
          {(Object.keys(TAB_STATUT) as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all font-mono",
                activeTab === tab
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-foreground-muted" size={28} />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-lecko-blue/8 flex items-center justify-center mb-5">
            <Briefcase size={28} className="text-lecko-blue/50" strokeWidth={1.5} />
          </div>
          <h3 className="font-consultant font-semibold text-foreground mb-2">
            Aucune mission active
          </h3>
          <p className="text-sm text-foreground-muted mb-6 max-w-xs">
            Créez votre première mission pour commencer à cartographier le potentiel IA
            de vos clients.
          </p>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setError(null);
              setCreateOpen(true);
            }}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-lecko-blue text-white text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            <Plus size={15} />
            Créer une mission
          </button>
          {/* DEV ONLY — Seed demo data */}
          <button
            onClick={async () => {
              try {
                const mId = await seedDemoMission();
                alert("Mission démo créée : " + mId);
                window.location.reload();
              } catch (e: any) {
                alert("Erreur seed: " + e.message);
              }
            }}
            className="mt-3 text-xs text-foreground-muted underline hover:text-foreground transition-colors"
          >
            🧪 Injecter données démo
          </button>
        </div>
      )}

      {/* MISSION CARDS GRID */}
      {!loading && filtered.length > 0 && (
        <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((mission, index) => {
            const nbEntretiensTotal = mission.entretiens?.length ?? 0;
            const nbTermines =
              mission.entretiens?.filter((e) => e.statut === "termine").length ?? 0;
            const nbHeures =
              mission.chantiers?.reduce(
                (s, c) => s + c.temps_gagne_heures_semaine,
                0
              ) ?? 0;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => navigate(`/missions/${mission.id}`)}
                className="group relative bg-white border border-mission-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-lecko-blue/30 hover:shadow-lg hover:shadow-lecko-blue/5 hover:-translate-y-0.5"
              >
                {/* Indicateur statut — barre colorée en haut */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                  style={{
                    backgroundColor: MISSION_STATUT_COLORS[mission.statut],
                  }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-3 mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lecko-blue bg-lecko-blue/8 text-sm font-bold font-mono flex-shrink-0">
                      {mission.client_organisation.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-consultant font-semibold text-foreground text-sm leading-tight">
                        {mission.client_nom}
                      </p>
                      <p className="text-foreground-muted text-xs mt-0.5">
                        {mission.client_organisation}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-foreground-muted/40 group-hover:text-lecko-blue group-hover:translate-x-0.5 transition-all mt-1"
                  />
                </div>

                {/* Méta */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mission.client_secteur && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-mission-alt text-foreground-muted border border-mission-border">
                      {SECTOR_LABELS[mission.client_secteur as Sector] ??
                        mission.client_secteur}
                    </span>
                  )}
                  {mission.date_livraison_prevue && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                      📅{" "}
                      {new Date(mission.date_livraison_prevue).toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "short" }
                      )}
                    </span>
                  )}
                </div>

                {/* Progress bar entretiens */}
                {nbEntretiensTotal > 0 && (
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] font-mono text-foreground-muted">
                      <span>Entretiens</span>
                      <span>
                        {nbTermines}/{nbEntretiensTotal}
                      </span>
                    </div>
                    <div className="h-1 bg-mission-alt rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lecko-blue rounded-full transition-all"
                        style={{
                          width: `${(nbTermines / nbEntretiensTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer KPIs */}
                <div className="flex gap-4 pt-3 border-t border-mission-border">
                  <div>
                    <p className="text-[11px] font-mono text-foreground-muted">
                      Chantiers
                    </p>
                    <p className="text-sm font-bold font-consultant text-foreground">
                      {mission.chantiers?.length ?? 0}
                    </p>
                  </div>
                  {nbHeures > 0 && (
                    <div>
                      <p className="text-[11px] font-mono text-foreground-muted">
                        Impact
                      </p>
                      <p className="text-sm font-bold font-consultant text-gr33t-600">
                        ~{nbHeures}h/sem.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Create Modal ─────────────────────────────────────── */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-consultant font-bold text-foreground">
                Nouvelle mission
              </h2>
              <button
                onClick={() => setCreateOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-foreground-muted" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
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
                  className={inputCls}
                />
              </div>

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
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Secteur
                  </label>
                  <select
                    value={form.client_secteur}
                    onChange={(e) =>
                      updateField("client_secteur", e.target.value as Sector | "")
                    }
                    className={inputCls}
                  >
                    <option value="">-- Choisir --</option>
                    {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Taille
                  </label>
                  <select
                    value={form.client_taille}
                    onChange={(e) =>
                      updateField("client_taille", e.target.value as OrgSize | "")
                    }
                    className={inputCls}
                  >
                    <option value="">-- Choisir --</option>
                    {(Object.entries(ORG_SIZE_LABELS) as [OrgSize, string][]).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nom du contact
                </label>
                <input
                  type="text"
                  value={form.client_contact_nom}
                  onChange={(e) => updateField("client_contact_nom", e.target.value)}
                  placeholder="Interlocuteur principal"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email du contact
                </label>
                <input
                  type="email"
                  value={form.client_contact_email}
                  onChange={(e) => updateField("client_contact_email", e.target.value)}
                  placeholder="contact@organisation.fr"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Objectif de la mission
                </label>
                <textarea
                  rows={3}
                  value={form.objectif_mission}
                  onChange={(e) => updateField("objectif_mission", e.target.value)}
                  placeholder="Décrivez l'objectif principal de cette mission..."
                  className={cn(inputCls, "resize-none py-3")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date de livraison prévue
                </label>
                <input
                  type="date"
                  value={form.date_livraison_prevue}
                  onChange={(e) => updateField("date_livraison_prevue", e.target.value)}
                  className={inputCls}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground-muted hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:bg-blue-700 transition-all disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Créer la mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ConsultantLayout>
  );
}
