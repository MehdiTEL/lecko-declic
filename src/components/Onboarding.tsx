import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, BarChart3, Zap, ArrowRight } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

/* ── CountUp animation for the "67%" stat ──────────────────────────────── */
function useCountUp(target: number, duration = 1500, delay = 0): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return current;
}

/* ── Screen definitions ─────────────────────────────────────────────────── */

function ScreenWelcome() {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8"
      >
        <Sparkles size={28} className="text-primary" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight"
      >
        DÉCLIC
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-base md:text-lg text-foreground-secondary leading-relaxed max-w-sm"
      >
        L'outil qui analyse votre métier et identifie ce que l'IA peut
        automatiser pour vous.
      </motion.p>
    </div>
  );
}

const HOW_STEPS = [
  {
    icon: Search,
    color: "hsl(221 83% 53%)",
    bg: "bg-primary/10",
    title: "Entrez votre métier",
    desc: "Chef de projet, Comptable, RH...",
  },
  {
    icon: BarChart3,
    color: "hsl(38 92% 50%)",
    bg: "bg-lecko-orange/10",
    title: "Obtenez votre diagnostic",
    desc: "Score, tâches automatisables, ROI estimé",
  },
  {
    icon: Zap,
    color: "hsl(160 84% 39%)",
    bg: "bg-gr33t-500/10",
    title: "Passez à l'action",
    desc: "Plan par étape avec la méthode DÉCLIC",
  },
];

function ScreenHowItWorks() {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-heading text-xl md:text-2xl font-bold text-foreground mb-10"
      >
        Comment ça marche ?
      </motion.h2>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        {HOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + idx * 0.15 }}
              className="flex items-start gap-4 text-left"
            >
              <div
                className={`w-11 h-11 rounded-xl ${step.bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={20} style={{ color: step.color }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-0.5">
                  {step.title}
                </p>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ScreenReady({ onStart }: { onStart: () => void }) {
  const animatedValue = useCountUp(67, 1500, 300);

  return (
    <div className="flex flex-col items-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <span className="font-heading text-7xl md:text-8xl font-bold text-primary leading-none">
          {animatedValue}%
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-base text-foreground-secondary leading-relaxed max-w-sm mb-10"
      >
        C'est le potentiel moyen d'automatisation que nous identifions.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        onClick={onStart}
        className="h-[52px] px-8 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
      >
        Analyser mon métier
        <ArrowRight size={18} />
      </motion.button>
    </div>
  );
}

/* ── Main Onboarding component ──────────────────────────────────────────── */

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-5 right-5 text-sm text-foreground-muted hover:text-foreground transition-colors z-10"
      >
        Passer
      </button>

      {/* Content */}
      <div className="relative w-full max-w-[480px] px-4 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {step === 0 && <ScreenWelcome />}
            {step === 1 && <ScreenHowItWorks />}
            {step === 2 && <ScreenReady onStart={onComplete} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="relative w-full max-w-[480px] px-6 pb-10 flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "bg-primary w-6" : "bg-border w-2"
              }`}
              aria-label={`Étape ${i + 1}`}
            />
          ))}
        </div>

        {/* Next button (hidden on last step — the CTA replaces it) */}
        {step < totalSteps - 1 && (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Suivant
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
