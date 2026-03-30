import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isLeckoConsultant } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-lecko-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Non connecté → login
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Connecté mais pas consultant Lecko → page d'erreur claire
  if (!isLeckoConsultant) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/50 flex items-center justify-center mb-5">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-white font-bold text-xl mb-2">Accès non autorisé</h1>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Cet outil est réservé aux consultants Lecko.
          Si vous pensez que c'est une erreur, contactez votre administrateur.
        </p>
        <a href="mailto:contact@lecko.fr"
          className="text-lecko-blue text-sm hover:underline">
          contact@lecko.fr
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
