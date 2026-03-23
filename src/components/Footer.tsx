import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const CALENDLY_URL = "https://calendly.com/lecko/decouverte";

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
              <span className="text-[10px] text-slate-500 font-medium">by Lecko</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Plateforme d'automatisation IA par métier. Analysez, priorisez, et passez à l'action.
            </p>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Produit
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Diagnostic métier", href: "/" },
                  { label: "Méthode DÉCLIC", href: "/methode" },
                  { label: "Mode équipe", href: "/equipe" },
                ].map((l) => (
                  <Link key={l.label} to={l.href}
                    className="block text-sm text-slate-300 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Ressources
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Comment ça marche", href: "/methode" },
                  { label: "Paramètres", href: "/parametres" },
                ].map((l) => (
                  <Link key={l.label} to={l.href}
                    className="block text-sm text-slate-300 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Contact
              </p>
              <a href="mailto:contact@lecko.fr" className="block text-sm text-slate-300 transition-colors hover:text-white mb-4">
                contact@lecko.fr
              </a>
              <button
                onClick={openCalendly}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-blue-500/40 text-blue-400 transition-all hover:border-blue-400 hover:text-blue-300"
              >
                <CalendarDays size={13} strokeWidth={1.5} />
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-slate-700/60 pt-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DÉCLIC by Lecko
          </p>
        </div>
      </div>
    </footer>
  );
}
