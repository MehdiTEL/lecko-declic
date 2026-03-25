import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadTeamSession, joinTeamSession, updateMemberResult } from "@/lib/teamSession";
import { findInLocalDatabase, FREE_JOB_LABELS } from "@/data/jobDatabase";
import { analyzeJob } from "@/lib/aiProvider";

export default function EquipeRejoindre() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code") ?? "";

  const [sessionName, setSessionName] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [metier, setMetier] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    if (!code) { setSessionError(true); return; }
    loadTeamSession(code)
      .then(({ session, members: m }) => {
        setSessionName(session.nom ?? "Session d'equipe");
        setMembers(m);
      })
      .catch(() => setSessionError(true));
  }, [code]);

  const handleJoin = async () => {
    if (!metier.trim() || !code) return;
    setLoading(true);
    setError(null);
    try {
      const memberId = await joinTeamSession(code, metier.trim(), count);

      // Run analysis
      const localResult = findInLocalDatabase(metier.trim());
      let result;
      if (localResult) {
        result = localResult;
      } else {
        try {
          const content = await analyzeJob(metier.trim());
          result = JSON.parse(content);
        } catch {
          // Fallback — save without result
          result = null;
        }
      }

      if (result) {
        await updateMemberResult(memberId, result);
      }

      // Navigate to results
      if (result) {
        const encoded = btoa(encodeURIComponent(JSON.stringify(result)));
        navigate(`/resultats?metier=${encodeURIComponent(metier.trim())}&cached=${encoded}&source=local`);
      } else {
        navigate(`/resultats?metier=${encodeURIComponent(metier.trim())}&source=local`);
      }
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de l'analyse");
      setLoading(false);
    }
  };

  if (sessionError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-lg font-bold text-foreground mb-2">Session introuvable</p>
            <p className="text-sm text-foreground-muted mb-4">Le code {code || "fourni"} ne correspond a aucune session active.</p>
            <a href="/equipe" className="text-sm text-primary hover:underline">Creer une nouvelle session</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-primary" />
          </div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Session collaborative</p>
          <h1 className="text-xl font-bold text-foreground">{sessionName}</h1>
          <p className="text-xs text-foreground-muted mt-1">Code : {code}</p>
        </div>

        {/* Current members */}
        {members.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-foreground-muted mb-2">{members.length} participant{members.length > 1 ? "s" : ""}</p>
            <div className="flex flex-wrap gap-2">
              {members.map((m: any) => (
                <span key={m.id} className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-foreground-muted">
                  {m.metier} ({m.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Join form */}
        <div className="rounded-xl border border-border p-5 bg-card space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground-muted block mb-1.5">Votre metier</label>
            <input
              value={metier} onChange={e => setMetier(e.target.value)}
              placeholder="Ex : Chef de projet, Comptable..."
              className="w-full h-11 px-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary transition-all"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {FREE_JOB_LABELS.slice(0, 6).map(j => (
                <button key={j} onClick={() => setMetier(j)} className="text-[11px] text-foreground-muted hover:text-primary transition-colors">{j}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground-muted block mb-1.5">Nombre de personnes avec ce metier : {count}</label>
            <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)}
              className="w-full accent-primary" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleJoin}
            disabled={!metier.trim() || loading}
            className="w-full h-11 rounded-xl font-semibold text-sm bg-primary text-white hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
            {loading ? "Analyse en cours..." : "Analyser et rejoindre"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
