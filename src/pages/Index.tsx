import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Target, Bot, BarChart3, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import Footer from "@/components/Footer";
import { getApiKey } from "@/lib/aiProvider";
import { findInLocalDatabase, FREE_JOB_LABELS, getSimilarJobs } from "@/data/jobDatabase";

const HOW_IT_WORKS = [
  {
    icon: <Target size={28} className="text-lecko-blue" />,
    num: "01",
    title: "Entrez votre métier",
    desc: "Tapez votre intitulé de poste ou choisissez parmi nos suggestions disponibles gratuitement",
  },
  {
    icon: <Bot size={28} className="text-lecko-blue" />,
    num: "02",
    title: "Analyse instantanée",
    desc: "Résultats immédiats depuis notre base de 15 métiers, ou analyse IA personnalisée avec votre clé API",
  },
  {
    icon: <BarChart3 size={28} className="text-lecko-blue" />,
    num: "03",
    title: "Recevez votre diagnostic",
    desc: "Obtenez un plan d'action concret avec les outils et méthodes recommandés",
  },
];

interface NoMatchModalProps {
  metier: string;
  onClose: () => void;
  onUseApi: () => void;
  similarJobs: string[];
  onPickJob: (job: string) => void;
}

function NoMatchModal({ metier, onClose, onUseApi, similarJobs, onPickJob }: NoMatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
      >
        <div className="text-3xl text-center">🔍</div>
        <h2 className="text-lg font-bold text-foreground text-center">
          Ce métier n'est pas dans notre base gratuite
        </h2>
        <p className="text-sm text-foreground-secondary text-center">
          <span className="font-semibold text-lecko-orange">"{metier}"</span> n'est pas encore
          disponible gratuitement. Pour obtenir une analyse personnalisée, vous pouvez utiliser
          votre propre clé API.
        </p>

        <button
          onClick={onUseApi}
          className="w-full h-11 rounded-xl font-bold text-sm bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-300 flex items-center justify-center gap-2"
        >
          Utiliser ma clé API →
        </button>

        {similarJobs.length > 0 && (
          <div>
            <p className="text-xs text-foreground-muted mb-2 text-center">
              Ou essayez un métier proche disponible gratuitement :
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {similarJobs.map((j) => (
                <button
                  key={j}
                  onClick={() => onPickJob(j)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-lecko-blue/30 bg-lecko-blue/5 text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground transition-all duration-200 flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  {j}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full text-xs text-foreground-muted hover:text-foreground transition-colors py-1"
        >
          Annuler
        </button>
      </motion.div>
    </div>
  );
}

export default function Index() {
  const [metier, setMetier] = useState("");
  const [pendingJob, setPendingJob] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showNoMatchModal, setShowNoMatchModal] = useState(false);
  const [noMatchMetier, setNoMatchMetier] = useState("");
  const [similarJobs, setSimilarJobs] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("requireKey") === "1") {
      setShowApiModal(true);
    }
  }, [searchParams]);

  const handleAnalyze = (value?: string) => {
    const job = (value ?? metier).trim();
    if (!job) return;

    // 1. Check local database first
    const localResult = findInLocalDatabase(job);
    if (localResult) {
      navigate(`/resultats?metier=${encodeURIComponent(job)}&source=local`);
      return;
    }

    // 2. If not in local DB, check if user has API key
    if (getApiKey()) {
      navigate(`/resultats?metier=${encodeURIComponent(job)}`);
      return;
    }

    // 3. Neither local nor API — show no-match modal
    setNoMatchMetier(job);
    setSimilarJobs(getSimilarJobs(job));
    setShowNoMatchModal(true);
  };

  const handleApiKeySaved = () => {
    const job = pendingJob;
    setPendingJob(null);
    setShowApiModal(false);
    if (job) {
      navigate(`/resultats?metier=${encodeURIComponent(job)}`);
    }
  };

  const handleNoMatchUseApi = () => {
    setShowNoMatchModal(false);
    setPendingJob(noMatchMetier);
    setShowApiModal(true);
  };

  const handlePickSimilarJob = (job: string) => {
    setShowNoMatchModal(false);
    navigate(`/resultats?metier=${encodeURIComponent(job)}&source=local`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      {/* ── HERO ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div
          className="absolute top-6 right-6 w-10 h-10 rounded-lg opacity-70"
          style={{ backgroundColor: "hsl(var(--lecko-orange))" }}
          aria-hidden
        />
        <div
          className="absolute bottom-8 left-8 w-6 h-6 rounded-md opacity-30"
          style={{ backgroundColor: "hsl(var(--lecko-blue))" }}
          aria-hidden
        />

        <div className="relative z-10 max-w-3xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-lecko-blue/10 border border-lecko-blue/20 text-lecko-blue text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lecko-orange" />
            Diagnostic IA × Métier
          </motion.div>

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
            Entrez votre profession, obtenez instantanément un diagnostic d'automatisation.{" "}
            <span className="text-lecko-blue font-semibold">Gratuit</span> pour 15 métiers, ou
            utilisez votre clé API pour une analyse sur-mesure.
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
              className="h-13 px-6 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 shrink-0 bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover"
            >
              Analyser mon métier
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Suggestions with free badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-xs text-foreground-muted mb-2 flex items-center justify-center gap-1">
              <Sparkles size={11} className="text-lecko-blue" />
              Disponibles gratuitement :
            </p>
            <div className="tags-scroll justify-center flex-wrap">
              {FREE_JOB_LABELS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAnalyze(s)}
                  className="shrink-0 px-3 py-1.5 text-sm font-semibold rounded-full border border-lecko-blue/30 bg-lecko-blue/5 text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground hover:scale-105 dark:border-lecko-blue/30 dark:bg-lecko-blue/10 transition-all duration-200 flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM CTA ── */}
      <section className="px-4 pb-10 flex justify-center">
        <div className="max-w-3xl w-full">
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-dashed border-border" />
            <span className="text-xs text-foreground-muted font-semibold shrink-0">— ou —</span>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link
              to="/equipe"
              className="block rounded-2xl p-6 border-2 border-dashed border-lecko-blue/40 bg-lecko-blue/5 dark:bg-lecko-blue/10 hover:border-lecko-blue hover:bg-lecko-blue/10 dark:hover:bg-lecko-blue/15 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-lecko-blue/10 border border-lecko-blue/20 flex items-center justify-center shrink-0 group-hover:bg-lecko-blue/20 transition-colors">
                  <Users size={24} className="text-lecko-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base mb-0.5">
                    Mode Équipe — Analysez toute votre organisation
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    Ajoutez plusieurs métiers pour obtenir un diagnostic global et un rapport consolidé.
                  </p>
                </div>
                <span className="shrink-0 px-4 py-2 rounded-xl font-bold text-sm bg-lecko-blue text-primary-foreground group-hover:bg-lecko-orange transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                  Lancer une analyse d'équipe
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
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
      <Footer />

      {showNoMatchModal && (
        <NoMatchModal
          metier={noMatchMetier}
          onClose={() => setShowNoMatchModal(false)}
          onUseApi={handleNoMatchUseApi}
          similarJobs={similarJobs}
          onPickJob={handlePickSimilarJob}
        />
      )}

      <ApiKeyModal
        open={showApiModal}
        onClose={() => { setShowApiModal(false); setPendingJob(null); }}
        onSaved={handleApiKeySaved}
        initialProvider={null}
      />
    </div>
  );
}
