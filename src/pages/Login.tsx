import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/missions";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <img src="/logo-declic.png" alt="DÉCLIC" style={{ height: "36px", filter: "brightness(0) invert(1)" }} />
        <p className="text-slate-400 text-sm font-mono">Espace consultant Lecko</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-white font-bold text-xl mb-1">Connexion</h1>
        <p className="text-slate-400 text-sm mb-6">Réservé aux consultants Lecko</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 text-sm flex items-start gap-2">
            <Lock size={14} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">Email Lecko</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@lecko.fr"
                className="w-full h-11 pl-9 pr-3 bg-slate-800 border border-slate-700 rounded-xl
                           text-white text-sm placeholder:text-slate-600 outline-none
                           focus:border-lecko-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">Mot de passe</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl
                         text-white text-sm placeholder:text-slate-600 outline-none
                         focus:border-lecko-blue transition-colors"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-xl bg-lecko-blue text-white font-semibold text-sm
                       hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={15} className="animate-spin" />Connexion...</> : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Pas encore de compte ?{" "}
          <a href="mailto:contact@lecko.fr" className="text-slate-400 hover:text-slate-200 transition-colors">
            Contactez votre administrateur Lecko
          </a>
        </p>
      </div>

      <p className="text-slate-600 text-xs mt-8 font-mono">
        DÉCLIC by Lecko — Outil interne
      </p>
    </div>
  );
}
