import { Linkedin, CalendarDays } from "lucide-react";

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
            <p className="font-heading text-xl font-bold text-white mb-3 tracking-tight">
              DÉCLIC
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              Lecko accélère la transformation interne des organisations en apportant conseils
              et services aux acteurs du changement.
            </p>
            <a
              href="https://www.linkedin.com/company/lecko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-slate-400 transition-colors hover:text-white"
            >
              <Linkedin size={16} strokeWidth={1.5} />
              LinkedIn
            </a>
          </div>

          {/* Links grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Produit
              </p>
              <div className="space-y-2.5">
                {["Diagnostic métier", "Méthode DÉCLIC", "Résultats"].map((l) => (
                  <a key={l} href="https://lecko.fr" target="_blank" rel="noopener noreferrer"
                    className="block text-sm text-slate-300 transition-colors hover:text-white">
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Méthode
              </p>
              <div className="space-y-2.5">
                {["Les 5 phases", "Équipe", "Historique"].map((l) => (
                  <a key={l} href="https://lecko.fr" target="_blank" rel="noopener noreferrer"
                    className="block text-sm text-slate-300 transition-colors hover:text-white">
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Contact
              </p>
              <p className="text-sm text-slate-300 mb-1">
                64 rue des Archives, 75003 Paris
              </p>
              <p className="text-sm text-slate-300 mb-4">
                01 83 79 01 74
              </p>
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
            © {new Date().getFullYear()} DÉCLIC par Lecko — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
