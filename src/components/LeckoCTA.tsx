import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, X, Send } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface LeckoCTAProps {
  score: number;
  metier: string;
  typeAnalyse?: "individuel" | "equipe";
  onVisible?: (visible: boolean) => void;
}

const CALENDLY_URL = "https://calendly.com/lecko/decouverte";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly?: any;
  }
}

function loadCalendly(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Calendly) { resolve(); return; }
    const existing = document.getElementById("calendly-script");
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
    // also load Calendly CSS
    if (!document.getElementById("calendly-css")) {
      const link = document.createElement("link");
      link.id = "calendly-css";
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }
  });
}

function getVariant(score: number) {
  if (score > 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

const VARIANT_CONFIG = {
  high: {
    emoji: "🚀",
    title: "Votre métier a un fort potentiel d'automatisation",
    intro: (score: number) =>
      `${score}% de vos tâches sont automatisables. C'est un levier majeur de productivité — mais pour en tirer le maximum, il faut prioriser, structurer et déployer méthodiquement.`,
    body: "Lecko accompagne les organisations dans leur transformation digitale depuis plus de 15 ans. Nos consultants peuvent vous aider à :",
    bullets: [
      "Identifier les quick wins à activer en moins de 2 semaines",
      "Construire une roadmap d'automatisation sur mesure",
      "Déployer les bons outils (M365, agents IA, N8N, Power Automate)",
      "Former vos équipes pour une adoption durable",
    ],
    cta: "Réserver un appel découverte (30 min, gratuit)",
    link: "En savoir plus sur Lecko →",
  },
  medium: {
    emoji: "💡",
    title: "Des gains rapides sont à portée de main",
    intro: () =>
      "Certaines de vos tâches sont automatisables dès maintenant. Un regard expert peut vous aider à identifier les priorités et éviter les faux départs.",
    body: "Lecko propose un cadrage express (1h) pour :",
    bullets: [
      "Valider les automatisations les plus rentables pour votre contexte",
      "Recommander les outils adaptés à votre environnement",
      "Estimer le ROI concret de chaque action",
    ],
    cta: "Réserver un cadrage express (1h)",
    link: "Découvrir nos offres →",
  },
  low: {
    emoji: "🎯",
    title: "L'automatisation n'est qu'une partie de l'équation",
    intro: () =>
      "Votre métier repose sur des compétences humaines difficilement remplaçables — et c'est une force. Mais la transformation digitale peut vous aider autrement : meilleurs outils collaboratifs, IA assistive, optimisation des processus.",
    body: "Lecko accompagne aussi les organisations sur :",
    bullets: [
      "Le déploiement de Microsoft 365 et les usages collaboratifs",
      "L'intégration d'IA assistive (Copilot, Claude) dans le quotidien",
      "La conduite du changement et l'adoption des outils",
    ],
    cta: "Discuter de votre transformation digitale",
    link: "Nos références →",
  },
} as const;

// ── Fallback contact form ────────────────────────────────────────────────────

interface FallbackFormProps {
  metier: string;
  score: number;
  typeAnalyse: string;
  onClose: () => void;
}

function FallbackForm({ metier, score, typeAnalyse, onClose }: FallbackFormProps) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const defaultMessage = `Je souhaite un accompagnement suite à mon diagnostic IA (${metier}, score ${score}%).`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setErr(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("leads") as any).insert({
        nom: nom.trim() || null,
        email: email.trim(),
        telephone: tel.trim() || null,
        message: defaultMessage,
        metier_analyse: metier,
        score_global: score,
        type_analyse: typeAnalyse,
        source: "cta_diagnostic",
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setErr("Une erreur est survenue. Réessayez ou contactez-nous à contact@lecko.fr");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-foreground mb-1">Demande envoyée !</p>
        <p className="text-sm text-foreground-secondary mb-4">
          Notre équipe vous recontactera dans les 24h.
        </p>
        <button onClick={onClose} className="text-xs text-foreground-muted hover:text-foreground transition-colors">
          Fermer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-foreground">Nous vous recontactons</p>
        <button type="button" onClick={onClose} className="p-1 rounded-md text-foreground-muted hover:text-foreground transition-colors">
          <X size={14} />
        </button>
      </div>
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email *"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors"
      />
      <input
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        placeholder="Téléphone (optionnel)"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors"
      />
      <p className="text-xs text-foreground-muted bg-muted/50 rounded-lg px-3 py-2">{defaultMessage}</p>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button
        type="submit"
        disabled={!email.trim() || sending}
        className="w-full h-9 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all disabled:opacity-50"
      >
        <Send size={14} />
        {sending ? "Envoi…" : "Envoyer la demande"}
      </button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LeckoCTA({ score, metier, typeAnalyse = "individuel", onVisible }: LeckoCTAProps) {
  const variant = getVariant(score);
  const cfg = VARIANT_CONFIG[variant];
  const intro = cfg.intro(score as never);

  const [showFallback, setShowFallback] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  // Notify parent when this block enters / leaves viewport
  useEffect(() => {
    if (!onVisible || !blockRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => onVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [onVisible]);

  const handleCTA = async () => {
    try {
      await loadCalendly();
      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url: CALENDLY_URL,
          prefill: {
            name: "",
            email: "",
            customAnswers: {
              a1: metier,
              a2: `Score : ${score}%`,
            },
          },
        });
      } else {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
    }
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, hsl(var(--lecko-blue)) 0%, hsl(221 83% 43%) 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10" style={{ background: "white" }} />

      <div className="relative z-10 p-8">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">{cfg.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight mb-1">
                {cfg.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">{intro}</p>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-white/90 font-semibold mb-3">{cfg.body}</p>
          <ul className="space-y-1.5 mb-6">
            {cfg.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-white/85">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-white/70" />
                {b}
              </li>
            ))}
          </ul>

          {/* Fallback form */}
          {showFallback ? (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 max-w-md">
              <FallbackForm
                metier={metier}
                score={score}
                typeAnalyse={typeAnalyse}
                onClose={() => setShowFallback(false)}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCTA}
                className="px-5 py-3 rounded-xl font-bold text-sm bg-white text-lecko-blue hover:bg-lecko-orange hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                📅 {cfg.cta}
              </button>
              <a
                href="https://lecko.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors font-semibold"
              >
                {cfg.link}
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
