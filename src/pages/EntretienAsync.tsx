import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import DeclicLogo from "@/components/DeclicLogo";
import { getEntretienByToken, updateEntretien } from "@/lib/consultantDb";
import type { Entretien } from "@/types/consultant";

export default function EntretienAsync() {
  const { token } = useParams<{ token: string }>();

  const [entretien, setEntretien] = useState<Entretien | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form
  const [taches, setTaches] = useState("");
  const [douleurs, setDouleurs] = useState("");
  const [nom, setNom] = useState("");
  const [poste, setPoste] = useState("");

  // ─── Load entretien ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getEntretienByToken(token)
      .then((e) => {
        if (!e) {
          setNotFound(true);
        } else if (e.async_completed_at) {
          setAlreadyDone(true);
          setEntretien(e);
        } else {
          setEntretien(e);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  // ─── Submit ─────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entretien) return;

    if (!taches.trim()) {
      setError("Veuillez decrire les taches quotidiennes.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateEntretien(entretien.id, {
        statut: "termine",
        async_completed_at: new Date().toISOString(),
        interlocuteur_nom: nom || null,
        interlocuteur_poste: poste || null,
        notes_consultant: `Taches: ${taches}\n\nPoints de douleur: ${douleurs}`,
      });
      setSubmitted(true);
    } catch {
      setError("Erreur lors de l'envoi. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  // ─── Not found ──────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <AlertTriangle size={48} className="mx-auto text-amber-500" />
          <h1 className="text-xl font-semibold text-slate-800">
            Ce lien est expire ou invalide
          </h1>
          <p className="text-sm text-slate-500">
            Le lien que vous avez utilise n'est plus valide. Contactez votre
            consultant pour obtenir un nouveau lien.
          </p>
          <Link
            to="/"
            className="inline-block text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Retour a l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // ─── Already completed ──────────────────────────────────────────────────

  if (alreadyDone) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <CheckCircle size={48} className="mx-auto text-emerald-500" />
          <h1 className="text-xl font-semibold text-slate-800">
            Vous avez deja soumis vos reponses. Merci !
          </h1>
          <p className="text-sm text-slate-500">
            Votre consultant traitera vos reponses prochainement.
          </p>
        </div>
      </div>
    );
  }

  // ─── Submitted confirmation ─────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <CheckCircle size={56} className="mx-auto text-emerald-500" />
          <h1 className="text-xl font-semibold text-slate-800">
            Merci ! Vos reponses ont ete transmises.
          </h1>
          <p className="text-sm text-slate-500">
            Votre consultant analysera vos reponses et reviendra vers vous.
          </p>
        </div>
      </div>
    );
  }

  // ─── Form ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 px-6 py-4">
        <DeclicLogo size="sm" />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Questionnaire d'analyse
          </h1>
          <p className="text-sm text-slate-500">
            Ce formulaire vous est envoye par votre consultant Lecko
          </p>
          {entretien?.service_nom && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              {entretien.service_nom}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Taches quotidiennes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={taches}
              onChange={(e) => setTaches(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Decrivez les principales taches que vous ou votre equipe realisez au quotidien..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Points de douleur
            </label>
            <textarea
              rows={3}
              value={douleurs}
              onChange={(e) => setDouleurs(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Qu'est-ce qui prend trop de temps, est source d'erreurs, vous frustre..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Votre nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Votre poste
              </label>
              <input
                type="text"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Responsable administratif"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              Envoyer mes reponses
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
