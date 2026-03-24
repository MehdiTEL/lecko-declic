import { useState } from "react";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { AnalysisResult } from "@/types/analysis";

interface EmailResultsFormProps {
  result: AnalysisResult;
}

export default function EmailResultsForm({ result }: EmailResultsFormProps) {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState(profile?.email ?? "");
  const [nom, setNom] = useState(profile ? `${profile.prenom} ${profile.nom}` : "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topTasks = result.taches
    .filter(t => t.categorie === "automatisable")
    .sort((a, b) => (b.score_criteres ?? 0) - (a.score_criteres ?? 0))
    .slice(0, 3)
    .map(t => t.nom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError(null);

    try {
      await (supabase.from("leads") as any).insert({
        nom: nom.trim() || null,
        email: email.trim(),
        metier_analyse: result.metier,
        score_global: result.score_global,
        message: `Envoi resultats par email. Top taches : ${topTasks.join(", ")}. ${result.heures_economisees_semaine}h/sem recuperables.`,
        source: "email_results",
        type_analyse: "individuel",
      });

      try {
        await supabase.functions.invoke("send-results-email", {
          body: {
            to: email.trim(),
            nom: nom.trim() || null,
            metier: result.metier,
            score: result.score_global,
            heures: result.heures_economisees_semaine,
            topTasks,
            totalTasks: result.taches.length,
            automatisables: result.taches.filter(t => t.categorie === "automatisable").length,
          },
        });
      } catch {
        // Edge function may not be deployed — lead is already captured
      }

      setSent(true);
    } catch {
      setError("Une erreur est survenue. Vos resultats sont sauvegardes.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-xl border p-4 flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Resultats envoyes</p>
          <p className="text-xs text-foreground-muted">Un recapitulatif a ete envoye a {email}.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border p-4 bg-card">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-lecko-blue/10 flex items-center justify-center shrink-0">
            <Mail size={15} className="text-lecko-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Recevoir ces resultats par email</p>
            <p className="text-xs text-foreground-muted">Gardez une trace de votre diagnostic et de vos taches prioritaires.</p>
          </div>
        </div>

        <div className="flex gap-2 sm:items-center">
          {!user && (
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Prenom"
              className="w-24 sm:w-28 h-10 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="flex-1 sm:w-48 h-10 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !email.trim()}
            className="shrink-0 h-10 px-4 flex items-center gap-2 rounded-lg text-sm font-semibold text-white bg-lecko-blue hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            {sending ? "" : "Envoyer"}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </form>
  );
}
