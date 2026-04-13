import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const CALENDLY_URL = "https://calendly.com/declic/decouverte";
const VITRINE_URL = import.meta.env.VITE_VITRINE_URL ?? "https://declic.fr";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly?: any;
  }
}

function openCalendly() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  } else {
    window.open(CALENDLY_URL, "_blank");
  }
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 px-6 pt-14 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Top */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-12">
          {/* Brand */}
          <div className="md:max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading text-xl font-bold text-white tracking-tight">DÉCLIC</span>
              <span className="text-[10px] text-indigo-400/70 font-medium uppercase tracking-widest">Cartographie IA</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Votre première cartographie IA. Identifiez le potentiel, passez à l'action.
            </p>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Produit
              </p>
              <div className="space-y-2.5">
                <Link to="/" className="block text-sm text-slate-300 transition-colors hover:text-white">Diagnostic métier</Link>
                <a href={`${VITRINE_URL}/methode`} target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-300 transition-colors hover:text-white">La méthode DÉCLIC</a>
                <a href={`${VITRINE_URL}/notre-histoire`} target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-300 transition-colors hover:text-white">Le consultant</a>
                <a href={`${VITRINE_URL}/faq`} target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-300 transition-colors hover:text-white">FAQ</a>
                <Link to="/equipe" className="block text-sm text-slate-300 transition-colors hover:text-white">Mode équipe</Link>
                <Link to="/historique" className="block text-sm text-slate-300 transition-colors hover:text-white">Mes diagnostics</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Ressources
              </p>
              <div className="space-y-2.5">
                <a href={`${VITRINE_URL}/methode`} target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-300 transition-colors hover:text-white">Comment ça marche</a>
                <Link to="/parametres" className="block text-sm text-slate-300 transition-colors hover:text-white">Paramètres</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Contact
              </p>
              <a href="mailto:contact@declic.fr" className="block text-sm text-slate-300 transition-colors hover:text-white mb-4">
                contact@declic.fr
              </a>
              <button
                onClick={openCalendly}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-indigo-500/40 text-indigo-300 transition-all hover:border-indigo-400 hover:text-indigo-200"
              >
                <CalendarDays size={13} strokeWidth={1.5} />
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-slate-700/60 pt-6 flex flex-col gap-2">
          <a href={VITRINE_URL} className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            Découvrir la méthode
          </a>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DÉCLIC · Cartographie IA pour les métiers
          </p>
        </div>
      </div>
    </footer>
  );
}
