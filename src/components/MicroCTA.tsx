import { useState, useEffect } from "react";
import { X, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DISMISSED_KEY = "lecko-micro-cta-dismissed";
const CALENDLY_URL = "https://calendly.com/lecko/decouverte";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly?: any;
  }
}

interface MicroCTAProps {
  /** True when the main LeckoCTA block is visible in viewport */
  ctaVisible: boolean;
  metier?: string;
  score?: number;
}

export default function MicroCTA({ ctaVisible, metier = "", score = 0 }: MicroCTAProps) {
  const [dismissed, setDismissed] = useState(() =>
    sessionStorage.getItem(DISMISSED_KEY) === "true"
  );

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISSED_KEY, "true");
  };

  const handleRDV = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: CALENDLY_URL,
        prefill: {
          name: "",
          email: "",
          customAnswers: { a1: metier, a2: `Score : ${score}%` },
        },
      });
    } else {
      window.open(CALENDLY_URL, "_blank");
    }
  };

  const show = !dismissed && !ctaVisible;

  // Make sure the bar doesn't overlap the main action bar (which is already sticky bottom)
  // We'll show it as a slim overlay above the actions bar when applicable
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-[72px] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto flex items-center gap-3 bg-card border border-border rounded-2xl shadow-2xl px-4 py-2.5 max-w-lg w-full"
            style={{ boxShadow: "0 -4px 24px hsl(var(--lecko-blue) / 0.15)" }}
          >
            <span className="text-sm font-semibold text-foreground flex-1 min-w-0 truncate">
              💬 Besoin d'aide pour passer à l'action ?
            </span>
            <button
              onClick={handleRDV}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-200"
            >
              <CalendarDays size={12} />
              Prendre RDV
            </button>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-md text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
