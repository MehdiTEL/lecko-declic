import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ConnexionPage() {
  const navigate = useNavigate();
  const { user, signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    navigate("/tableau-de-bord", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error: authError } = await signInWithOtp(email.trim());

    if (authError) {
      setError("Une erreur est survenue. Vérifiez votre email et réessayez.");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <p className="section-label mb-4">Connexion</p>
          <h1 className="text-heading-xl text-white font-display mb-3">
            Sauvegardez votre progression
          </h1>
          <p className="text-body text-[#8A8AA3]">
            Connectez-vous avec un lien magique envoyé par email.
            Pas de mot de passe à retenir.
          </p>
        </div>

        {sent ? (
          <div className="glass-card p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
            <h2 className="text-white font-semibold text-lg mb-2">
              Email envoyé !
            </h2>
            <p className="text-[#8A8AA3] text-sm mb-4">
              Cliquez sur le lien dans l'email envoyé à{" "}
              <span className="text-white">{email}</span> pour vous connecter.
            </p>
            <p className="text-xs text-[#55556A]">
              Vérifiez votre dossier spam si vous ne le trouvez pas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm text-[#8A8AA3] mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#55556A]"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-[#55556A] focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all btn-glow"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Recevoir le lien magique
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-xs text-[#55556A] text-center mt-4">
              Tout fonctionne sans compte. La connexion permet de sauvegarder vos résultats.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
