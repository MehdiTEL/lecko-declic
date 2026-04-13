import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-slate-800 font-mono mb-4">404</p>
      <h1 className="text-white text-xl font-semibold mb-2">Page introuvable</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-xs">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/missions"
        className="h-10 px-5 rounded-xl bg-brand-blue text-white text-sm font-semibold
                   hover:bg-blue-600 transition-all inline-flex items-center gap-2"
      >
        Retour aux missions
      </Link>
    </div>
  );
}
