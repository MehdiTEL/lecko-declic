import { useParams, useEffect, useState } from "react";
import { getPortailByToken, logPortailVisit, getCommentaires, addCommentaire, getValidations, upsertValidation } from "@/lib/modulableDb";
import { getMission } from "@/lib/consultantDb";
import type { PortailClient as TPortail, CommentaireClient, ValidationClient, ValidationStatut } from "@/types/modulable";
import { VALIDATION_CONFIG } from "@/types/modulable";
import type { Mission, Chantier } from "@/types/consultant";
import { HORIZON_LABELS, PRIORITE_CONFIG } from "@/types/consultant";
import { XCircle, CheckCircle, MessageSquare, Map, LayoutDashboard, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortailClient() {
  const { token } = useParams<{ token: string }>();
  const [portail, setPortail] = useState<TPortail | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [section, setSection] = useState<"overview" | "chantiers" | "roadmap" | "commentaires">("overview");
  const [commentaires, setCommentaires] = useState<CommentaireClient[]>([]);
  const [validations, setValidations] = useState<ValidationClient[]>([]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"commentaire" | "question" | "objection">("commentaire");
  const [sending, setSending] = useState(false);

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
      setPortail(p); setMission(m); setCommentaires(comms); setValidations(vals);
      setLoading(false);
    })();
  }, [token]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-6 h-6 border-2 border-lecko-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (invalid || !portail || !mission) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <XCircle size={40} className="text-destructive" />
      <p className="text-lg font-semibold text-foreground">Lien invalide ou expiré</p>
      <p className="text-sm text-foreground-muted">Ce lien n'existe pas ou a expiré.</p>
    </div>
  );

  const clientPrimary = "#2563EB";
  const chantiers = (mission.chantiers ?? []) as Chantier[];
  const entretiens = mission.entretiens ?? [];
  const totalHeures = chantiers.reduce((s, c) => s + c.temps_gagne_heures_semaine, 0);
  const totalImpact = chantiers.reduce((s, c) => s + (c.impact_total_heures_an ?? 0), 0);
  const entretiensTermines = entretiens.filter((e) => e.statut === "termine").length;

  const handleValider = async (chantierId: string, statut: "valide" | "refuse" | "a_revoir") => {
    if (!nom.trim()) { alert("Entrez votre nom pour valider."); return; }
    const v = await upsertValidation({
      mission_id: mission.id,
      chantier_id: chantierId,
      statut,
      validateur_nom: nom,
      commentaire: null,
      note_priorite: null,
      validated_at: statut === "valide" ? new Date().toISOString() : null,
    } as any);
    setValidations(prev => [...prev.filter(x => x.chantier_id !== chantierId), v]);
  };

  const handleComment = async () => {
    if (!message.trim() || !nom.trim()) return;
    setSending(true);
    const c = await addCommentaire({
      mission_id: mission.id,
      chantier_id: null,
      auteur_nom: nom,
      contenu: message,
      type,
    } as any);
    setCommentaires(prev => [c, ...prev]);
    setMessage("");
    setSending(false);
  };

  const nav = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "chantiers", label: `Chantiers (${chantiers.length})`, icon: Layers },
    { id: "roadmap", label: "Feuille de route", icon: Map },
    { id: "commentaires", label: `Commentaires (${commentaires.length})`, icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-white font-sans" style={{ "--client-primary": clientPrimary } as React.CSSProperties}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur border-b border-slate-100 flex items-center px-6 gap-3">
        <img src="/logo-declic.png" style={{ height: "24px" }} alt="DÉCLIC" />
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm font-medium text-slate-600">{mission.client_organisation}</span>
        <span className="ml-auto text-xs font-mono px-2 py-1 rounded-full bg-slate-100 text-slate-500">Cartographie IA</span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-slate-100 py-6 px-3 flex flex-col gap-1 min-h-[calc(100vh-3.5rem)]">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id as any)}
              className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all",
                section === id ? "font-medium" : "text-slate-500 hover:bg-slate-50"
              )}
              style={section === id ? { backgroundColor: clientPrimary + "12", color: clientPrimary } : {}}>
              <Icon size={15} strokeWidth={1.5} />{label}
            </button>
          ))}
        </aside>

        {/* Contenu */}
        <main className="flex-1 px-8 py-6 max-w-4xl">
          {section === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Vue d'ensemble</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Services analysés", value: entretiensTermines },
                  { label: "Chantiers", value: chantiers.length },
                  { label: "Heures /sem.", value: `~${Math.round(totalHeures * 10) / 10}h` },
                  { label: "Impact /an", value: `~${Math.round(totalImpact)}h` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Services cartographiés</p>
                {entretiens.filter((e) => e.statut === "termine").map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium">{e.service_nom}</span>
                    <span className="text-xs text-slate-400 ml-auto">{e.metiers?.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "chantiers" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Chantiers identifiés</h1>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
                Validez les chantiers qui vous semblent prioritaires. Votre consultant en tiendra compte.
              </div>
              <div className="mb-3">
                <label className="text-xs text-slate-500 block mb-1">Votre nom (pour valider)</label>
                <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Prénom Nom"
                  className="h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue w-48" />
              </div>
              {chantiers.map(c => {
                const v = validations.find(x => x.chantier_id === c.id);
                const cfg = v ? VALIDATION_CONFIG[v.statut as ValidationStatut] : null;
                return (
                  <div key={c.id} className={cn("border rounded-xl transition-all",
                    v?.statut === "valide" ? "border-emerald-200 bg-emerald-50/50" :
                    v?.statut === "refuse" ? "border-red-100 bg-red-50/30" :
                    v?.statut === "a_revoir" ? "border-amber-100 bg-amber-50/30" :
                    "border-slate-100 hover:border-slate-200"
                  )}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-sm text-foreground">{c.titre}</p>
                        {c.priorite && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: PRIORITE_CONFIG[c.priorite as keyof typeof PRIORITE_CONFIG]?.bg, color: PRIORITE_CONFIG[c.priorite as keyof typeof PRIORITE_CONFIG]?.color }}>
                            {PRIORITE_CONFIG[c.priorite as keyof typeof PRIORITE_CONFIG]?.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{c.service_concerne}</p>
                      {c.description && <p className="text-sm text-slate-600">{c.description}</p>}
                      <p className="text-xs text-emerald-600 font-medium mt-2">~{c.impact_total_heures_an ?? 0}h/an</p>
                    </div>
                    <div className="border-t border-inherit px-4 py-3">
                      {!v ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Votre avis :</span>
                          {([["valide", "✓ Valider", "#10B981"], ["a_revoir", "⟳ À revoir", "#F59E0B"], ["refuse", "✗ Rejeter", "#EF4444"]] as const).map(([s, l, col]) => (
                            <button key={s} onClick={() => handleValider(c.id, s)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all hover:-translate-y-0.5"
                              style={{ borderColor: col + "40", color: col }}>{l}</button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium" style={{ color: cfg?.color }}>{cfg?.label}</span>
                          <span className="text-xs text-slate-400">par {v.validateur_nom}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {section === "roadmap" && (
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-6">Feuille de route</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(["non_planifie", "3_mois", "6_mois", "12_mois"] as const).map(h => (
                  <div key={h} className="space-y-2">
                    <div className="text-xs font-mono font-semibold text-slate-500 uppercase px-1">
                      {h === "non_planifie" ? "Non planifié" : HORIZON_LABELS[h as keyof typeof HORIZON_LABELS]}
                    </div>
                    {chantiers.filter(c => (h === "non_planifie" ? !c.horizon : c.horizon === h)).map(c => (
                      <div key={c.id} className="bg-white border border-slate-100 rounded-xl p-3">
                        <p className="text-sm font-medium text-foreground leading-snug">{c.titre}</p>
                        <p className="text-xs text-slate-400 mt-1">{c.service_concerne}</p>
                        <p className="text-xs text-emerald-600 mt-1">~{c.impact_total_heures_an ?? 0}h/an</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "commentaires" && (
            <div className="space-y-6 max-w-xl">
              <h1 className="text-2xl font-bold text-foreground">Commentaires</h1>
              <div className="space-y-3 p-4 border border-slate-100 rounded-xl">
                <div className="flex gap-2">
                  <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom *"
                    className="h-9 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue flex-1" />
                  <select value={type} onChange={e => setType(e.target.value as any)}
                    className="h-9 px-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue">
                    <option value="commentaire">Commentaire</option>
                    <option value="question">Question</option>
                    <option value="objection">Objection</option>
                  </select>
                </div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="Votre message..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-lecko-blue resize-none" />
                <button onClick={handleComment} disabled={sending || !message.trim() || !nom.trim()}
                  className="h-9 px-4 rounded-lg bg-lecko-blue text-white text-sm font-semibold disabled:opacity-40 transition-all">
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
              </div>
              <div className="space-y-3">
                {commentaires.map(c => (
                  <div key={c.id} className="space-y-2">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-foreground">{c.auteur_nom}</span>
                        <span className="text-[10px] text-slate-400 ml-auto">{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <p className="text-sm text-slate-700">{c.contenu}</p>
                    </div>
                    {c.reponse_consultant && (
                      <div className="bg-lecko-blue/5 rounded-xl p-3 border border-lecko-blue/10 ml-4">
                        <p className="text-xs font-semibold text-lecko-blue mb-1">Consultant Lecko</p>
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
