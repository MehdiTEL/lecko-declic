import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortailByToken, logPortailVisit, getCommentaires, addCommentaire, getValidations, upsertValidation } from "@/lib/modulableDb";
import { getMission } from "@/lib/consultantDb";
import type { PortailClient as TPortail, CommentaireClient, ValidationClient, ValidationStatut } from "@/types/modulable";
import type { Mission, Chantier } from "@/types/consultant";
import { HORIZON_LABELS, PRIORITE_CONFIG } from "@/types/consultant";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Layers, Map, MessageSquare,
  CheckCircle, XCircle, AlertCircle, Clock, Loader2,
  TrendingUp, Users, Zap, ArrowRight
} from "lucide-react";

const VALIDATION_ICONS: Record<string, React.ElementType> = {
  valide: CheckCircle, refuse: XCircle, a_revoir: AlertCircle, en_attente: Clock
};
const VALIDATION_COLORS: Record<string, string> = {
  valide: "#10B981", refuse: "#EF4444", a_revoir: "#F59E0B", en_attente: "#6B7280"
};

function ScoreDots({ score, max = 10, color }: { score: number; max?: number; color: string }) {
  const filled = Math.round(score);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: i < filled ? color : "#E2E8F0" }} />
      ))}
    </div>
  );
}

export default function PortailClient() {
  const { token } = useParams<{ token: string }>();
  const [portail, setPortail] = useState<TPortail | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [section, setSection] = useState<"overview" | "chantiers" | "roadmap" | "commentaires">("overview");
  const [commentaires, setCommentaires] = useState<CommentaireClient[]>([]);
  const [validations, setValidations] = useState<ValidationClient[]>([]);
  const [nom, setNom] = useState(() => {
    try { return sessionStorage.getItem("portail-nom") ?? ""; } catch { return ""; }
  });
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"commentaire" | "question" | "objection">("commentaire");
  const [sending, setSending] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setInvalid(true); setLoading(false); return; }
    (async () => {
      const p = await getPortailByToken(token);
      if (!p) { setInvalid(true); setLoading(false); return; }
      await logPortailVisit(token);
      const [m, comms, vals] = await Promise.all([
        getMission(p.mission_id),
        getCommentaires(p.mission_id),
        getValidations(p.mission_id),
      ]);
      setPortail(p); setMission(m);
      setCommentaires(comms ?? []); setValidations(vals ?? []);
      setLoading(false);
    })();
  }, [token]);

  const saveName = (v: string) => {
    setNom(v);
    try { sessionStorage.setItem("portail-nom", v); } catch { /* ignore */ }
  };

  const handleValider = async (chantierId: string, statut: ValidationStatut) => {
    if (!nom.trim()) { alert("Entrez votre nom pour valider."); return; }
    setValidating(chantierId);
    const v = await upsertValidation({
      mission_id: mission!.id,
      chantier_id: chantierId,
      statut,
      validateur_nom: nom,
      commentaire: null,
      validated_at: statut === "valide" ? new Date().toISOString() : null,
    } as any);
    setValidations(prev => [...prev.filter(x => x.chantier_id !== chantierId), v]);
    setValidating(null);
  };

  const handleComment = async () => {
    if (!message.trim() || !nom.trim()) return;
    setSending(true);
    const c = await addCommentaire({
      mission_id: mission!.id,
      chantier_id: null,
      auteur_nom: nom,
      contenu: message,
    } as any);
    setCommentaires(prev => [c, ...prev]);
    setMessage("");
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-blue-600" />
    </div>
  );

  if (invalid || !portail || !mission) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <XCircle size={40} className="text-slate-300" />
      <h1 className="text-xl font-bold text-slate-800">Lien invalide ou expiré</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        Ce lien n'existe pas, a expiré, ou a été désactivé par votre consultant.
        Contactez-le pour obtenir un nouveau lien.
      </p>
    </div>
  );

  const clientPrimary = mission.client_couleur_primaire || "#2563EB";
  const chantiers = (mission.chantiers ?? []) as Chantier[];
  const entretiens = (mission.entretiens ?? []) as any[];
  const totalHeures = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);
  const totalImpact = chantiers.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);
  const totalPersonnes = chantiers.reduce((s, c) => s + c.nb_personnes_impactees, 0);
  const entretiensTermines = entretiens.filter((e: any) => e.statut === "termine").length;
  const nbValides = validations.filter(v => v.statut === "valide").length;
  const nbRefuses = validations.filter(v => v.statut === "refuse").length;
  const nbARevoir = validations.filter(v => v.statut === "a_revoir").length;

  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "chantiers", label: `Chantiers (${chantiers.length})`, icon: Layers },
    { id: "roadmap", label: "Feuille de route", icon: Map },
    { id: "commentaires", label: `Échanges (${commentaires.length})`, icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">

      {/* Navbar client */}
      <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur border-b border-slate-200/60 flex items-center px-6 gap-3 shadow-sm">
        <img src="/logo-declic.png" style={{ height: "22px" }} alt="DÉCLIC" />
        <div className="h-5 w-px bg-slate-200" />
        <span className="text-sm font-semibold text-slate-800">{mission.client_organisation}</span>
        <span className="ml-auto text-xs font-mono px-3 py-1 rounded-full border border-slate-200 text-slate-500">
          Cartographie IA — {new Date(mission.created_at).getFullYear()}
        </span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 border-r border-slate-200/60 bg-white flex-col py-6 px-3 gap-1
                          min-h-[calc(100vh-3.5rem)] sticky top-14">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id as any)}
              className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all",
                section === id ? "font-semibold shadow-sm" : "text-slate-500 hover:bg-slate-50"
              )}
              style={section === id
                ? { backgroundColor: clientPrimary + "12", color: clientPrimary }
                : {}
              }>
              <Icon size={16} strokeWidth={section === id ? 2 : 1.5} />
              {label}
            </button>
          ))}

          {/* Validation summary in sidebar */}
          {validations.length > 0 && (
            <div className="mt-auto pt-4 border-t border-slate-100 mx-2">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Vos validations</p>
              <div className="space-y-1">
                {nbValides > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle size={12} className="text-green-500" />
                    <span className="text-slate-600">{nbValides} validé{nbValides > 1 ? "s" : ""}</span>
                  </div>
                )}
                {nbARevoir > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-slate-600">{nbARevoir} à revoir</span>
                  </div>
                )}
                {nbRefuses > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <XCircle size={12} className="text-red-500" />
                    <span className="text-slate-600">{nbRefuses} rejeté{nbRefuses > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 px-6 md:px-10 py-8 max-w-4xl">

          {/* VUE D'ENSEMBLE */}
          {section === "overview" && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Cartographie IA</p>
                <h1 className="text-2xl font-bold text-slate-900">{mission.client_organisation}</h1>
                {mission.objectif_mission && (
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xl">{mission.objectif_mission}</p>
                )}
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Services analysés", value: String(entretiensTermines), sub: `sur ${entretiens.length}`, icon: Users, color: clientPrimary },
                  { label: "Chantiers IA identifiés", value: String(chantiers.length), sub: "opportunités", icon: Layers, color: clientPrimary },
                  { label: "Gain potentiel", value: `${Math.round(totalHeures)}h`, sub: "par semaine", icon: TrendingUp, color: "#10B981" },
                  { label: "Impact annuel", value: `${Math.round(totalImpact).toLocaleString("fr-FR")}h`, sub: `${totalPersonnes} personnes`, icon: Zap, color: "#10B981" },
                ].map(({ label, value, sub, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "12" }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-2">{label}</p>
                  </div>
                ))}
              </div>

              {/* Services list */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Services analysés</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {entretiens.filter((e: any) => e.statut === "termine").map((e: any) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                      <CheckCircle size={16} style={{ color: clientPrimary }} />
                      <span className="text-sm font-medium text-slate-800 flex-1">{e.service_nom}</span>
                      <div className="flex gap-1.5">
                        {e.metiers?.slice(0, 3).map((m: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{m}</span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 ml-2">{e.nb_personnes} pers.</span>
                    </div>
                  ))}
                  {entretiens.filter((e: any) => e.statut !== "termine").map((e: any) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3 opacity-50">
                      <Clock size={16} className="text-slate-300" />
                      <span className="text-sm text-slate-400 flex-1">{e.service_nom}</span>
                      <span className="text-xs text-slate-300">À venir</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 chantiers */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Top chantiers par impact</p>
                  <button onClick={() => setSection("chantiers")}
                    className="text-xs font-medium flex items-center gap-1 transition-colors"
                    style={{ color: clientPrimary }}>
                    Voir tous <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {[...chantiers].sort((a, b) => (b.impact_total_heures_an ?? 0) - (a.impact_total_heures_an ?? 0))
                    .slice(0, 5).map((c, i) => (
                    <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className="text-xs font-bold w-5 text-center" style={{ color: clientPrimary }}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{c.titre}</p>
                        <p className="text-xs text-slate-400">{c.service_concerne}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-center">
                          <ScoreDots score={c.score_impact} color="#10B981" />
                          <p className="text-[9px] text-slate-400 mt-0.5">Impact</p>
                        </div>
                        <div className="text-center">
                          <ScoreDots score={c.score_effort} color="#F59E0B" />
                          <p className="text-[9px] text-slate-400 mt-0.5">Effort</p>
                        </div>
                        <span className="text-xs font-bold text-green-600 w-16 text-right">
                          {(c.impact_total_heures_an ?? 0).toLocaleString("fr-FR")}h/an
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHANTIERS */}
          {section === "chantiers" && (
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Chantiers identifiés</h1>
                  <p className="text-sm text-slate-500 mt-1">{chantiers.length} opportunités IA identifiées pour votre organisation</p>
                </div>
                {validations.length > 0 && (
                  <div className="flex items-center gap-3 text-xs">
                    {nbValides > 0 && <span className="text-green-600 font-medium">{nbValides} validé{nbValides > 1 ? "s" : ""}</span>}
                    {nbARevoir > 0 && <span className="text-amber-600 font-medium">{nbARevoir} à revoir</span>}
                    {nbRefuses > 0 && <span className="text-red-500 font-medium">{nbRefuses} rejeté{nbRefuses > 1 ? "s" : ""}</span>}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <p className="text-sm text-slate-600 mb-3">
                  Validez les chantiers que vous souhaitez prioriser. Votre consultant en tiendra compte dans la feuille de route finale.
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 whitespace-nowrap">Votre nom :</label>
                  <input value={nom} onChange={e => saveName(e.target.value)}
                    placeholder="Prénom Nom"
                    className="h-8 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 flex-1 max-w-48" />
                </div>
              </div>

              {chantiers.map(c => {
                const v = validations.find(x => x.chantier_id === c.id);
                const Icon = v ? VALIDATION_ICONS[v.statut] : null;
                return (
                  <div key={c.id} className={cn("bg-white border rounded-2xl overflow-hidden transition-all shadow-sm",
                    v?.statut === "valide" ? "border-green-200 ring-1 ring-green-100" :
                    v?.statut === "refuse" ? "border-red-200 ring-1 ring-red-50" :
                    v?.statut === "a_revoir" ? "border-amber-200 ring-1 ring-amber-50" :
                    "border-slate-200/60"
                  )}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{c.titre}</p>
                          {c.service_concerne && (
                            <p className="text-xs text-slate-400 mt-0.5">{c.service_concerne}</p>
                          )}
                        </div>
                        {c.priorite && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PRIORITE_CONFIG[c.priorite]?.bg ?? "#F9FAFB",
                                     color: PRIORITE_CONFIG[c.priorite]?.color ?? "#6B7280" }}>
                            {PRIORITE_CONFIG[c.priorite]?.label ?? c.priorite}
                          </span>
                        )}
                      </div>

                      {c.description && (
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{c.description}</p>
                      )}

                      {/* Metrics row */}
                      <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Impact</span>
                          <ScoreDots score={c.score_impact} color="#10B981" />
                          <span className="text-xs font-medium text-slate-600">{c.score_impact}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Effort</span>
                          <ScoreDots score={c.score_effort} color="#F59E0B" />
                          <span className="text-xs font-medium text-slate-600">{c.score_effort}/10</span>
                        </div>
                        <div className="ml-auto flex items-center gap-4 text-xs">
                          <span className="text-slate-500">{c.nb_personnes_impactees} pers.</span>
                          <span className="text-slate-500">~{c.temps_gagne_heures_semaine}h/sem</span>
                          <span className="font-bold text-green-600 text-sm">
                            {(c.impact_total_heures_an ?? 0).toLocaleString("fr-FR")}h/an
                          </span>
                        </div>
                      </div>

                      {/* Horizon tag */}
                      {c.horizon && (
                        <div className="mt-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            Horizon : {HORIZON_LABELS[c.horizon]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-inherit px-5 py-3 bg-slate-50/50">
                      {!v ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-400 mr-1">Votre avis :</span>
                          {([["valide", "Valider", "#10B981"],
                             ["a_revoir", "À revoir", "#F59E0B"],
                             ["refuse", "Rejeter", "#EF4444"]] as [ValidationStatut, string, string][]).map(([s, l, col]) => (
                            <button key={s}
                              onClick={() => handleValider(c.id, s)}
                              disabled={validating === c.id}
                              className="text-xs font-semibold px-4 py-1.5 rounded-lg border-2 transition-all hover:shadow-sm disabled:opacity-40"
                              style={{ borderColor: col + "40", color: col }}>
                              {validating === c.id ? "..." : l}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={14} style={{ color: VALIDATION_COLORS[v.statut] }} />}
                          <span className="text-xs font-semibold" style={{ color: VALIDATION_COLORS[v.statut] }}>
                            {v.statut === "valide" ? "Validé" : v.statut === "refuse" ? "Rejeté" : "À revoir"}
                          </span>
                          <span className="text-xs text-slate-400">par {v.validateur_nom}</span>
                          <button onClick={() => handleValider(c.id, "en_attente")}
                            className="ml-auto text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                            Modifier
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FEUILLE DE ROUTE */}
          {section === "roadmap" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Feuille de route</h1>
              <p className="text-sm text-slate-500 mb-6">Planning de déploiement des chantiers IA recommandés</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(["3_mois", "6_mois", "12_mois", "non_planifie"] as const).map(h => {
                  const items = chantiers.filter(c =>
                    h === "non_planifie" ? !c.horizon : c.horizon === h
                  );
                  const colImpact = items.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);
                  return (
                    <div key={h}>
                      <div className="mb-3 px-1">
                        <p className="text-sm font-semibold text-slate-700">
                          {h === "non_planifie" ? "Non planifié" : HORIZON_LABELS[h as keyof typeof HORIZON_LABELS]}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">{items.length} chantier{items.length > 1 ? "s" : ""}</span>
                          {colImpact > 0 && (
                            <span className="text-[10px] font-mono text-green-600">~{Math.round(colImpact)}h/an</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {items.map(c => {
                          const v = validations.find(x => x.chantier_id === c.id);
                          return (
                            <div key={c.id} className={cn("bg-white border rounded-xl p-3 shadow-sm transition-all",
                              v?.statut === "valide" ? "border-green-200" :
                              v?.statut === "refuse" ? "border-red-200 opacity-50" :
                              "border-slate-200/60"
                            )}>
                              <p className="text-sm font-medium text-slate-800 leading-snug mb-1">{c.titre}</p>
                              <p className="text-xs text-slate-400 mb-2">{c.service_concerne}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: PRIORITE_CONFIG[c.priorite]?.bg, color: PRIORITE_CONFIG[c.priorite]?.color }}>
                                  {PRIORITE_CONFIG[c.priorite]?.label}
                                </span>
                                <span className="text-xs font-medium text-green-600">
                                  {(c.impact_total_heures_an ?? 0).toLocaleString("fr-FR")}h/an
                                </span>
                              </div>
                              {v && (
                                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
                                  {VALIDATION_ICONS[v.statut] && (() => {
                                    const VIcon = VALIDATION_ICONS[v.statut];
                                    return <VIcon size={10} style={{ color: VALIDATION_COLORS[v.statut] }} />;
                                  })()}
                                  <span className="text-[10px]" style={{ color: VALIDATION_COLORS[v.statut] }}>
                                    {v.statut === "valide" ? "Validé" : v.statut === "refuse" ? "Rejeté" : "À revoir"}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {items.length === 0 && (
                          <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-300">Aucun chantier</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary table */}
              <div className="mt-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Synthèse de la feuille de route</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-mono text-slate-400 uppercase border-b border-slate-100">
                        <th className="text-left px-5 py-3">Horizon</th>
                        <th className="text-center px-3 py-3">Chantiers</th>
                        <th className="text-center px-3 py-3">Personnes</th>
                        <th className="text-right px-5 py-3">Impact /an</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(["3_mois", "6_mois", "12_mois"] as const).map(h => {
                        const items = chantiers.filter(c => c.horizon === h);
                        if (items.length === 0) return null;
                        return (
                          <tr key={h} className="border-b border-slate-50">
                            <td className="px-5 py-3 font-medium text-slate-700">{HORIZON_LABELS[h]}</td>
                            <td className="text-center px-3 py-3 text-slate-600">{items.length}</td>
                            <td className="text-center px-3 py-3 text-slate-600">{items.reduce((s, c) => s + c.nb_personnes_impactees, 0)}</td>
                            <td className="text-right px-5 py-3 font-bold text-green-600">
                              {Math.round(items.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0)).toLocaleString("fr-FR")}h
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-slate-50 font-bold">
                        <td className="px-5 py-3 text-slate-800">Total</td>
                        <td className="text-center px-3 py-3 text-slate-800">{chantiers.length}</td>
                        <td className="text-center px-3 py-3 text-slate-800">{totalPersonnes}</td>
                        <td className="text-right px-5 py-3 text-green-600">{Math.round(totalImpact).toLocaleString("fr-FR")}h</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* COMMENTAIRES */}
          {section === "commentaires" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Échanges</h1>
                <p className="text-sm text-slate-500 mt-1">Communiquez avec votre consultant DÉCLIC</p>
              </div>

              {/* Formulaire */}
              <div className="space-y-3 p-5 border border-slate-200/60 rounded-2xl bg-white shadow-sm">
                <div className="flex gap-2">
                  <input value={nom} onChange={e => saveName(e.target.value)}
                    placeholder="Votre nom *"
                    className="h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 flex-1" />
                  <select value={msgType} onChange={e => setMsgType(e.target.value as any)}
                    className="h-9 px-2 text-sm border border-slate-200 rounded-lg outline-none">
                    <option value="commentaire">Commentaire</option>
                    <option value="question">Question</option>
                    <option value="objection">Objection</option>
                  </select>
                </div>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  rows={3} placeholder="Votre message..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none" />
                <button onClick={handleComment}
                  disabled={sending || !message.trim() || !nom.trim()}
                  className="h-9 px-5 rounded-lg text-white text-sm font-semibold disabled:opacity-40 transition-all flex items-center gap-2"
                  style={{ backgroundColor: clientPrimary }}>
                  {sending ? <Loader2 size={14} className="animate-spin" /> : null}
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
              </div>

              {/* Fil de discussion */}
              <div className="space-y-3">
                {commentaires.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">
                    Aucun échange pour l'instant. Posez votre première question !
                  </p>
                )}
                {commentaires.map(c => (
                  <div key={c.id} className="space-y-2">
                    <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ backgroundColor: clientPrimary }}>
                          {c.auteur_nom?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-slate-800">{c.auteur_nom}</span>
                        <span className="text-[10px] text-slate-300 ml-auto">
                          {new Date(c.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{c.contenu}</p>
                    </div>
                    {c.reponse_consultant && (
                      <div className="ml-6 rounded-xl p-4 border shadow-sm"
                        style={{ backgroundColor: clientPrimary + "06", borderColor: clientPrimary + "20" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">D</div>
                          <span className="text-xs font-semibold" style={{ color: clientPrimary }}>Consultant DÉCLIC</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{c.reponse_consultant}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
