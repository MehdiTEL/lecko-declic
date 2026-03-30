import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/missions";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">

      {/* Logo + tagline */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <img
          src="/logo-declic.png"
          alt="DÉCLIC by Lecko"
          style={{ height: "40px", filter: "brightness(0) invert(1)" }}
        />
        <div className="flex items-center gap-2">
          <div className="h-px w-10 bg-slate-700" />
          <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">
            Espace consultant
          </p>
          <div className="h-px w-10 bg-slate-700" />
        </div>
      </div>

      {/* Card de connexion */}
      <div className="w-full max-w-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">

          <h1 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Connexion
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Réservé aux consultants Lecko
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl
                            bg-red-950/60 border border-red-900/60 text-red-300 text-sm">
              <Lock size={14} className="shrink-0 mt-0.5 text-red-400" strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                Email professionnel
              </label>
              <div className="relative">
                <Mail size={14} strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="prenom.nom@lecko.fr"
                  className="w-full h-11 pl-9 pr-4 bg-slate-800 border border-slate-700 rounded-xl
                             text-white text-sm placeholder:text-slate-600
                             outline-none focus:border-lecko-blue focus:ring-2 focus:ring-lecko-blue/20
                             transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 bg-slate-800 border border-slate-700 rounded-xl
                             text-white text-sm placeholder:text-slate-600
                             outline-none focus:border-lecko-blue focus:ring-2 focus:ring-lecko-blue/20
                             transition-all"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600
                             hover:text-slate-400 transition-colors">
                  {showPassword
                    ? <EyeOff size={14} strokeWidth={1.5} />
                    : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !email.trim() || !password}
              className="w-full h-11 rounded-xl bg-lecko-blue text-white font-semibold text-sm
                         hover:bg-blue-600 active:scale-[0.98] transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><Loader2 size={15} className="animate-spin" />Connexion en cours...</>
                : "Se connecter"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-700 mt-5">
          Pas encore de compte ?{" "}
          <a href="mailto:contact@lecko.fr"
            className="text-slate-500 hover:text-slate-300 transition-colors">
            Contactez votre administrateur Lecko
          </a>
        </p>
      </div>

      <p className="text-slate-800 text-xs font-mono mt-10">
        DÉCLIC by Lecko — Outil interne de conseil IA
      </p>
    </div>
  );
}
