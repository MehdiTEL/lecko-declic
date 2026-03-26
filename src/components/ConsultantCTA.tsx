import { useState } from "react";
import { CheckCircle, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConsultantCTAProps {
  metier: string;
  score: number;
  heures: number;
  topTasks: string[];
}

export default function ConsultantCTA({ metier, score, heures, topTasks }: ConsultantCTAProps) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    try {
      await (supabase.from("leads") as any).insert({
        nom: prenom.trim() || null,
        email: email.trim(),
        metier_analyse: metier,
        score_global: score,
        message: `Cartographie DECLIC — ${topTasks.slice(0, 3).join(", ")}. ~${heures}h/sem recupérables.`,
        source: "cta_resultats_principal",
        type_analyse: "individuel",
      });
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Reessayez.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-lecko-blue p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left — text */}
        <div className="md:w-2/3">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Users size={11} />
            Accompagnement Lecko
          </span>
          <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ letterSpacing: "-0.01em" }}>
            Ces resultats vous parlent ?
          </h3>
          <p className="text-white/85 text-sm leading-relaxed mb-3">
            Votre cartographie indique ~{heures}h/semaine recuperables sur {topTasks.length} taches.
            Un consultant Lecko analyse votre situation reelle et construit
            avec vous un plan concret — adapte a votre stack et votre organisation.
          </p>
          <p className="text-white/60 text-xs">
            Duree : 30 minutes — Sans engagement — Vos resultats envoyes en amont au consultant
          </p>
        </div>

        {/* Right — form */}
        <div className="md:w-1/3">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <CheckCircle size={28} className="text-white" />
              <p className="text-sm font-semibold">Demande envoyee</p>
              <p className="text-xs text-white/70">Un consultant vous contactera sous 48h. Vos resultats lui seront transmis en amont.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prenom"
                className="h-11 px-4 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 outline-none transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email pro"
                required
                className="h-11 px-4 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={sending || !email.trim()}
                className="h-11 rounded-xl bg-white text-lecko-blue font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : null}
                {sending ? "Envoi..." : "Etre contacte par un consultant"}
              </button>
              {error && <p className="text-xs text-white/70">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
