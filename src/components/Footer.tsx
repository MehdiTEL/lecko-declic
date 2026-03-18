import { CalendarDays } from "lucide-react";

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
    <footer className="bg-card border-t border-border px-4 py-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="text-sm text-foreground-muted">
            <span className="font-bold text-lecko-blue">lecko.</span>
            {" "}— Conseil en transformation digitale — IA, M365, Conduite du changement
          </p>
          <a
            href="https://lecko.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-muted hover:text-lecko-blue transition-colors"
          >
            lecko.fr
          </a>
        </div>
        <button
          onClick={openCalendly}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-lecko-blue/30 text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground transition-all duration-200 shrink-0"
        >
          <CalendarDays size={13} />
          Prendre rendez-vous
        </button>
      </div>
    </footer>
  );
}
