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
    if (!document.getElementById("calendly-css")) {
      const link = document.createElement("link");
      link.id = "calendly-css";
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }
  });
}

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
        <CheckCircle2 size={32} className="text-lecko-green mx-auto mb-3" />
        <p className="font-semibold text-foreground mb-1">Demande envoyée !</p>
        <p className="text-sm text-foreground-secondary mb-4">Notre équipe vous recontactera dans les 24h.</p>
        <button onClick={onClose} className="text-xs text-foreground-muted hover:text-foreground transition-colors">
          Fermer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-foreground">Nous vous recontactons</p>
        <button type="button" onClick={onClose} className="p-1 text-foreground-muted hover:text-foreground transition-colors">
          <X size={14} />
        </button>
      </div>
      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors" />
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email *"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors" />
      <input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Téléphone (optionnel)"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors" />
      <p className="text-xs text-foreground-muted bg-muted/50 rounded-lg px-3 py-2">{defaultMessage}</p>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button type="submit" disabled={!email.trim() || sending}
        className="w-full h-9 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-lecko-blue text-white hover:bg-lecko-blue/90 transition-colors disabled:opacity-50">
        <Send size={13} />
        {sending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}

export default function LeckoCTA({ score, metier, typeAnalyse = "individuel", onVisible }: LeckoCTAProps) {
  const [showFallback, setShowFallback] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

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
          prefill: { customAnswers: { a1: metier, a2: `Score : ${score}%` } },
        });
      } else {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
    }
  };

  const bullets =
    score > 70
      ? [
          "Identifier les quick wins à activer en moins de 2 semaines",
          "Construire une roadmap d'automatisation sur mesure",
          "Déployer les bons outils (M365, agents IA, N8N, Power Automate)",
          "Former vos équipes pour une adoption durable",
        ]
      : score >= 40
      ? [
          "Valider les automatisations les plus rentables pour votre contexte",
          "Recommander les outils adaptés à votre environnement",
          "Estimer le ROI concret de chaque action",
        ]
      : [
          "Déployer Microsoft 365 et les usages collaboratifs",
          "Intégrer l'IA assistive (Copilot, Claude) dans le quotidien",
          "Conduite du changement et adoption des outils",
        ];

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-8 md:p-10"
      style={{ backgroundColor: "hsl(var(--surface-accent))" }}
    >
      <div className="max-w-2xl">
        <p className="label-uppercase mb-3 text-lecko-blue text-[11px]">Aller plus loin</p>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ letterSpacing: "-0.01em" }}>
          Vous avez identifié le potentiel.
          <br />Structurons ensemble le passage à l'action.
        </h3>
        <p className="text-base text-foreground-secondary mb-6 leading-relaxed">
          Nos consultants vous accompagnent de la conception des workflows à la formation de vos équipes.
        </p>

        <ul className="space-y-2 mb-7">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-lecko-green" />
              {b}
            </li>
          ))}
        </ul>

        {showFallback ? (
          <div className="bg-card border border-border rounded-xl p-5 max-w-md">
            <FallbackForm metier={metier} score={score} typeAnalyse={typeAnalyse} onClose={() => setShowFallback(false)} />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleCTA}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
              style={{ backgroundColor: "hsl(var(--lecko-blue))" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "hsl(221 83% 45%)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "hsl(var(--lecko-blue))")}
            >
              Réserver un échange
            </button>
            <a
              href="https://lecko.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lecko-blue hover:underline transition-colors"
            >
              En savoir plus <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
