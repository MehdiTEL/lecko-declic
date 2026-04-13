import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/missions";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-[hsl(244,35%,8%)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="mb-10 flex flex-col items-center gap-3 relative z-10">
        <img src="/logo-declic.png" alt="DÉCLIC"
          style={{ height: "40px", filter: "brightness(0) invert(1)" }} />
        <p className="text-indigo-300/70 text-xs font-mono tracking-widest uppercase">
          Cartographie IA · Espace consultant
        </p>
      </div>

      <div className="w-full max-w-sm bg-[hsl(244,30%,12%)]/80 backdrop-blur-xl border border-indigo-900/40 rounded-2xl p-8 relative z-10 shadow-2xl shadow-indigo-950/50">
        <h1 className="text-white font-bold text-xl mb-1">Connexion</h1>
        <p className="text-slate-400 text-sm mb-6">Accédez à votre espace privé</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-900/50
                          text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={14} strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@declic.fr"
                className="w-full h-11 pl-9 pr-4 bg-[hsl(244,25%,18%)] border border-indigo-900/50
                           rounded-xl text-white text-sm placeholder:text-slate-600
                           outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 pr-10 bg-[hsl(244,25%,18%)] border border-indigo-900/50
                           rounded-xl text-white text-sm placeholder:text-slate-600
                           outline-none focus:border-indigo-500 transition-colors" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500
                           hover:text-slate-300 transition-colors">
                {showPwd ? <EyeOff size={14} strokeWidth={1.5} />
                         : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full h-11 mt-2 rounded-xl bg-indigo-600 text-white font-semibold
                       text-sm hover:bg-indigo-500 transition-all disabled:opacity-40
                       flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40">
            {loading
              ? <><Loader2 size={15} className="animate-spin" />Connexion...</>
              : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Pas encore d'accès ?{" "}
          <a href="mailto:contact@declic.fr"
            className="text-slate-400 hover:text-slate-200 transition-colors">
            Contactez votre consultant
          </a>
        </p>
      </div>

      <p className="text-indigo-900/80 text-xs font-mono mt-8 relative z-10">
        DÉCLIC · Cartographie IA pour les métiers
      </p>
    </div>
  );
}
