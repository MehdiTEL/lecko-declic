import { Linkedin, CalendarDays } from "lucide-react";

// TODO: mettre les vraies coordonnées Lecko
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
    <footer style={{ backgroundColor: "hsl(222 47% 11%)" }} className="px-6 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Top */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
          {/* Brand */}
          <div className="md:max-w-xs">
            <p className="text-xl font-bold text-white mb-3 tracking-tight">lecko.</p>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(215 16% 57%)" }}>
              Lecko accélère la transformation interne des organisations en apportant conseils
              et services aux acteurs du changement.
            </p>
            <a
              href="https://www.linkedin.com/company/lecko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm transition-colors hover:text-white"
              style={{ color: "hsl(215 16% 57%)" }}
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(215 16% 57%)" }}>
                Lecko
              </p>
              <div className="space-y-2">
                {["Qui sommes-nous ?", "Blog", "Études"].map((l) => (
                  <a key={l} href="https://lecko.fr" target="_blank" rel="noopener noreferrer"
                    className="block text-sm transition-colors hover:text-white"
                    style={{ color: "hsl(213 27% 75%)" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(215 16% 57%)" }}>
                Produits
              </p>
              <div className="space-y-2">
                {["Greet", "Academy", "IA × Métier"].map((l) => (
                  <a key={l} href="https://lecko.fr" target="_blank" rel="noopener noreferrer"
                    className="block text-sm transition-colors hover:text-white"
                    style={{ color: "hsl(213 27% 75%)" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(215 16% 57%)" }}>
                Contact
              </p>
              <p className="text-sm mb-1" style={{ color: "hsl(213 27% 75%)" }}>
                64 rue des Archives, 75003 Paris {/* TODO: adresse à confirmer */}
              </p>
              <p className="text-sm mb-3" style={{ color: "hsl(213 27% 75%)" }}>
                01 83 79 01 74 {/* TODO: téléphone à confirmer */}
              </p>
              <button
                onClick={openCalendly}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{
                  border: "1px solid hsl(221 83% 53% / 0.4)",
                  color: "hsl(221 83% 70%)",
                }}
              >
                <CalendarDays size={12} />
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid hsl(215 25% 20%)" }} className="pt-6">
          <p className="text-xs" style={{ color: "hsl(215 16% 40%)" }}>
            © Lecko — Tous droits réservés 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
