import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortailByToken, logPortailVisit, getCommentaires, addCommentaire, getValidations, upsertValidation } from "@/lib/modulableDb";
import { getMission } from "@/lib/consultantDb";
import type { PortailClient as TPortail, CommentaireClient, ValidationClient, ValidationStatut } from "@/types/modulable";
import type { Mission, Chantier } from "@/types/consultant";
import { HORIZON_LABELS, PRIORITE_CONFIG } from "@/types/consultant";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Layers, Map, MessageSquare, FileText,
  CheckCircle, XCircle, AlertCircle, Clock, Loader2
} from "lucide-react";

const VALIDATION_ICONS: Record<string, React.ElementType> = {
  valide: CheckCircle, refuse: XCircle, a_revoir: AlertCircle, en_attente: Clock
};
const VALIDATION_COLORS: Record<string, string> = {
  valide: "#10B981", refuse: "#EF4444", a_revoir: "#F59E0B", en_attente: "#6B7280"
};

export default function PortailClient() {
  const { token } = useParams<{ token: string }>();
  const [portail, setPortail] = useState<TPortail | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [section, setSection] = useState<"overview" | "chantiers" | "roadmap" | "pdf" | "commentaires">("overview");
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
      type: msgType,
    } as any);
    setCommentaires(prev => [c, ...prev]);
    setMessage("");
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-lecko-blue" />
    </div>
  );

  if (invalid || !portail || !mission) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <XCircle size={40} className="text-slate-300" />
      <h1 className="text-xl font-bold text-foreground">Lien invalide ou expiré</h1>
      <p className="text-sm text-foreground-muted max-w-sm">
        Ce lien n'existe pas, a expiré, ou a été désactivé par votre consultant.
        Contactez-le pour obtenir un nouveau lien.
      </p>
    </div>
  );

  const clientPrimary = "#2563EB";
  const chantiers = (mission.chantiers ?? []) as Chantier[];
  const entretiens = (mission.entretiens ?? []) as any[];
  const totalHeures = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);
  const totalImpact = chantiers.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);
  const entretiensTermines = entretiens.filter((e: any) => e.statut === "termine").length;

  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "chantiers", label: `Chantiers (${chantiers.length})`, icon: Layers },
    { id: "roadmap", label: "Feuille de route", icon: Map },
    { id: "commentaires", label: `Échanges (${commentaires.length})`, icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-white font-sans"
      style={{ "--client-primary": clientPrimary } as React.CSSProperties}>

      {/* Navbar client */}
      <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur border-b border-slate-100 flex items-center px-6 gap-3">
        <img src="/logo-declic.png" style={{ height: "22px" }} alt="DÉCLIC" />
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm font-medium text-slate-700">{mission.client_organisation}</span>
        <span className="ml-auto text-xs font-mono px-2 py-1 rounded-full bg-slate-100 text-slate-500">
          Cartographie IA — {new Date(mission.created_at).getFullYear()}
        </span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-52 border-r border-slate-100 flex-col py-6 px-3 gap-1
                          min-h-[calc(100vh-3.5rem)] sticky top-14">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id as any)}
              className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all",
                section === id ? "font-medium" : "text-slate-500 hover:bg-slate-50"
              )}
              style={section === id
                ? { backgroundColor: clientPrimary + "15", color: clientPrimary }
                : {}
              }>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 px-6 md:px-10 py-8 max-w-3xl">

          {/* VUE D'ENSEMBLE */}
          {section === "overview" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Cartographie IA</p>
                <h1 className="text-2xl font-bold text-foreground">{mission.client_organisation}</h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Services analysés", value: entretiensTermines, color: clientPrimary },
                  { label: "Chantiers", value: chantiers.length, color: clientPrimary },
                  { label: "Heures /sem.", value: `~${Math.round(totalHeures * 10) / 10}h`, color: "#10B981" },
                  { label: "Impact /an", value: `~${Math.round(totalImpact)}h`, color: "#10B981" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-mono mb-1">{label}</p>
                    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Services analysés</p>
                <div className="space-y-2">
                  {entretiens.filter((e: any) => e.statut === "termine").map((e: any) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50">
                      <CheckCircle size={16} style={{ color: clientPrimary }} />
                      <span className="text-sm font-medium text-foreground">{e.service_nom}</span>
                      <span className="text-xs text-slate-400 ml-auto">{e.metiers?.join(", ")}</span>
                    </div>
                  ))}
                  {entretiens.filter((e: any) => e.statut !== "termine").map((e: any) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                      <Clock size={16} className="text-slate-300" />
                      <span className="text-sm text-slate-400">{e.service_nom}</span>
                      <span className="text-xs text-slate-300 ml-auto">À venir</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top chantiers prioritaires */}
              {chantiers.filter(c => c.priorite === "critique" || c.priorite === "haute").length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Chantiers prioritaires</p>
                  <div className="space-y-2">
                    {chantiers.filter(c => c.priorite === "critique" || c.priorite === "haute")
                      .slice(0, 3).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PRIORITE_CONFIG[c.priorite]?.bg ?? "#F9FAFB",
                                   color: PRIORITE_CONFIG[c.priorite]?.color ?? "#6B7280" }}>
                          {PRIORITE_CONFIG[c.priorite]?.label ?? c.priorite}
                        </span>
                        <span className="text-sm font-medium text-foreground flex-1">{c.titre}</span>
                        <span className="text-xs text-green-600 flex-shrink-0">~{c.impact_total_heures_an ?? 0}h/an</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHANTIERS */}
          {section === "chantiers" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Chantiers identifiés</h1>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-600 mb-3">
                  Validez les chantiers qui vous semblent prioritaires. Votre consultant en tiendra compte dans la feuille de route finale.
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 whitespace-nowrap">Votre nom :</label>
                  <input value={nom} onChange={e => saveName(e.target.value)}
                    placeholder="Prénom Nom"
                    className="h-8 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue flex-1 max-w-48" />
                </div>
              </div>

              {chantiers.map(c => {
                const v = validations.find(x => x.chantier_id === c.id);
                const Icon = v ? VALIDATION_ICONS[v.statut] : null;
                return (
                  <div key={c.id} className={cn("border rounded-xl overflow-hidden transition-all",
                    v?.statut === "valide" ? "border-green-200 bg-green-50/30" :
                    v?.statut === "refuse" ? "border-red-100 bg-red-50/20" :
                    v?.statut === "a_revoir" ? "border-amber-100 bg-amber-50/20" :
                    "border-slate-100"
                  )}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-sm text-foreground">{c.titre}</p>
                        {c.priorite && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PRIORITE_CONFIG[c.priorite]?.bg ?? "#F9FAFB",
                                     color: PRIORITE_CONFIG[c.priorite]?.color ?? "#6B7280" }}>
                            {PRIORITE_CONFIG[c.priorite]?.label ?? c.priorite}
                          </span>
                        )}
                      </div>
                      {c.service_concerne && <p className="text-xs text-slate-400 mb-2">{c.service_concerne}</p>}
                      {c.description && <p className="text-sm text-slate-600 mb-2 leading-relaxed">{c.description}</p>}
                      <div className="flex items-center gap-3 text-xs">
                        {c.niveau_accompagnement && (
                          <span className="text-slate-500 font-mono">{c.niveau_accompagnement}</span>
                        )}
                        <span className="text-green-600 font-medium ml-auto">
                          ~{c.impact_total_heures_an ?? 0}h/an
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-inherit px-4 py-3 bg-white/50">
                      {!v ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-400">Votre avis :</span>
                          {([["valide", "✓ Valider", "#10B981"],
                             ["a_revoir", "⟳ À revoir", "#F59E0B"],
                             ["refuse", "✗ Rejeter", "#EF4444"]] as [ValidationStatut, string, string][]).map(([s, l, col]) => (
                            <button key={s}
                              onClick={() => handleValider(c.id, s)}
                              disabled={validating === c.id}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:-translate-y-0.5 disabled:opacity-40"
                              style={{ borderColor: col + "40", color: col }}>
                              {validating === c.id ? "..." : l}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={14} style={{ color: VALIDATION_COLORS[v.statut] }} />}
                          <span className="text-xs font-medium" style={{ color: VALIDATION_COLORS[v.statut] }}>
                            {v.statut === "valide" ? "Validé" : v.statut === "refuse" ? "Rejeté" : "À revoir"}
                          </span>
                          <span className="text-xs text-slate-400">par {v.validateur_nom}</span>
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
              <h1 className="text-2xl font-bold text-foreground mb-6">Feuille de route</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(["non_planifie", "3_mois", "6_mois", "12_mois"] as const).map(h => {
                  const items = chantiers.filter(c =>
                    h === "non_planifie" ? !c.horizon : c.horizon === h
                  );
                  return (
                    <div key={h}>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <p className="text-xs font-mono font-semibold text-slate-500 uppercase">
                          {h === "non_planifie" ? "Non planifié" : HORIZON_LABELS[h as keyof typeof HORIZON_LABELS]}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">{items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {items.map(c => (
                          <div key={c.id} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                            <p className="text-sm font-medium text-foreground leading-snug mb-1">{c.titre}</p>
                            <p className="text-xs text-slate-400">{c.service_concerne}</p>
                            <p className="text-xs font-medium text-green-600 mt-1">~{c.impact_total_heures_an ?? 0}h/an</p>
                          </div>
                        ))}
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
            </div>
          )}

          {/* DOCUMENTS / PDF */}
          {section === "pdf" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Documents</h1>
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center">
                <FileText size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  Les documents partagés par votre consultant apparaîtront ici.
                </p>
              </div>
            </div>
          )}

          {/* COMMENTAIRES */}
          {section === "commentaires" && (
            <div className="space-y-6 max-w-xl">
              <h1 className="text-2xl font-bold text-foreground">Échanges</h1>

              {/* Formulaire */}
              <div className="space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50">
                <div className="flex gap-2">
                  <input value={nom} onChange={e => saveName(e.target.value)}
                    placeholder="Votre nom *"
                    className="h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue flex-1 bg-white" />
                  <select value={msgType} onChange={e => setMsgType(e.target.value as any)}
                    className="h-9 px-2 text-sm border border-slate-200 rounded-lg outline-none bg-white">
                    <option value="commentaire">Commentaire</option>
                    <option value="question">Question</option>
                    <option value="objection">Objection</option>
                  </select>
                </div>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  rows={3} placeholder="Votre message pour le consultant Lecko..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue resize-none bg-white" />
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
                    Aucun échange pour l'instant.
                  </p>
                )}
                {commentaires.map(c => (
                  <div key={c.id} className="space-y-2">
                    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-foreground">{c.auteur_nom}</span>
                        <span className="text-[10px] text-slate-300 ml-auto">
                          {new Date(c.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{c.contenu}</p>
                    </div>
                    {c.reponse_consultant && (
                      <div className="ml-4 rounded-xl p-3 border"
                        style={{ backgroundColor: clientPrimary + "08", borderColor: clientPrimary + "20" }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: clientPrimary }}>
                          Consultant Lecko
                        </p>
                        <p className="text-sm text-slate-700">{c.reponse_consultant}</p>
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
