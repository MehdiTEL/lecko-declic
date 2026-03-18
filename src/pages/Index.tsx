import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Target, Bot, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import { getApiKey } from "@/lib/aiProvider";

const SUGGESTIONS = [
  "Consultant",
  "Comptable",
  "Chef de projet",
  "Community Manager",
  "RH / Recruteur",
  "Commercial",
  "Développeur",
  "Assistant(e) de direction",
  "Juriste",
  "Product Manager",
];

const HOW_IT_WORKS = [
  {
    icon: <Target size={28} className="text-lecko-blue" />,
    num: "01",
    title: "Entrez votre métier",
    desc: "Tapez votre intitulé de poste ou choisissez parmi nos suggestions",
  },
  {
    icon: <Bot size={28} className="text-lecko-blue" />,
    num: "02",
    title: "L'IA analyse",
    desc: "Notre IA identifie vos tâches quotidiennes et évalue leur potentiel d'automatisation",
  },
  {
    icon: <BarChart3 size={28} className="text-lecko-blue" />,
    num: "03",
    title: "Recevez votre diagnostic",
    desc: "Obtenez un plan d'action concret avec les outils et méthodes recommandés",
  },
];

export default function Index() {
  const [metier, setMetier] = useState("");
  const [pendingJob, setPendingJob] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-open modal if redirected from results with requireKey
  useEffect(() => {
    if (searchParams.get("requireKey") === "1") {
      setShowApiModal(true);
    }
  }, [searchParams]);

  const handleAnalyze = (value?: string) => {
    const job = (value ?? metier).trim();
    if (!job) return;
    if (!getApiKey()) {
      setPendingJob(job);
      setShowApiModal(true);
      return;
    }
    navigate(`/resultats?metier=${encodeURIComponent(job)}`);
  };

  const handleApiKeySaved = () => {
    if (pendingJob) {
      navigate(`/resultats?metier=${encodeURIComponent(pendingJob)}`);
      setPendingJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Orange deco square fixed */}
      <div className="lecko-deco-square" aria-hidden />

      {/* ── HERO ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Hero background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />

        {/* Orange deco top-right */}
        <div
          className="absolute top-6 right-6 w-10 h-10 rounded-lg opacity-70"
          style={{ backgroundColor: "hsl(var(--lecko-orange))" }}
          aria-hidden
        />
        {/* Blue deco bottom-left hero */}
        <div
          className="absolute bottom-8 left-8 w-6 h-6 rounded-md opacity-30"
          style={{ backgroundColor: "hsl(var(--lecko-blue))" }}
          aria-hidden
        />

        <div className="relative z-10 max-w-3xl w-full text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-lecko-blue/10 border border-lecko-blue/20 text-lecko-blue text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lecko-orange" />
            Diagnostic IA × Métier
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4"
          >
            Découvrez ce que{" "}
            <span className="text-lecko-orange">l'IA</span> peut{" "}
            <span className="text-lecko-orange">automatiser</span> dans votre métier
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-foreground-secondary mb-8 max-w-xl mx-auto"
          >
            Entrez votre profession, notre IA analyse vos tâches quotidiennes et identifie les gains de temps possibles grâce à l'automatisation.
          </motion.p>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-5"
          >
            <input
              type="text"
              value={metier}
              onChange={(e) => setMetier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Ex : Chef de projet, Comptable, Community Manager..."
              className="flex-1 h-13 px-5 py-3.5 text-base bg-card border-2 border-border rounded-xl outline-none focus:border-lecko-blue transition-colors text-foreground placeholder:text-foreground-muted shadow-card"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={!metier.trim()}
              className="h-13 px-6 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 shrink-0
                bg-lecko-blue text-primary-foreground
                hover:bg-lecko-orange transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-card hover:shadow-card-hover"
            >
              Analyser mon métier
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-xs text-foreground-muted mb-2">Suggestions rapides :</p>
            <div className="tags-scroll justify-center flex-wrap">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAnalyze(s)}
                  className="shrink-0 px-3 py-1.5 text-sm font-semibold rounded-full border border-lecko-blue/30 bg-lecko-blue/5 text-lecko-blue
                    hover:bg-lecko-blue hover:text-primary-foreground hover:scale-105
                    dark:border-lecko-blue/30 dark:bg-lecko-blue/10
                    transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-card border-t border-border px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Comment <span className="text-lecko-orange">ça marche</span> ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="lecko-card p-6 flex flex-col items-center text-center gap-3"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-lecko-blue">{step.num}</span>
                  {step.icon}
                </div>
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-foreground-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-card border-t border-border px-4 py-6 text-center">
        <p className="text-foreground-muted text-sm">
          <span className="font-bold">lecko.</span> — Propulsé par l'expertise IA de Lecko — Conseil en transformation digitale
        </p>
        <a
          href="https://lecko.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-foreground-muted hover:text-lecko-blue transition-colors"
        >
          lecko.fr
        </a>
      </footer>

      <ApiKeyModal
        open={showApiModal}
        onClose={() => { setShowApiModal(false); setPendingJob(null); }}
        onSaved={handleApiKeySaved}
      />
    </div>
  );
}
