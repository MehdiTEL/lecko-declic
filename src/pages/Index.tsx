import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Wrench, Play, Award, Users, Send, CheckCircle, Building2, Mail, User } from "lucide-react";
import Onboarding from "@/components/Onboarding";
import { usePageContext } from "@/context/PageContext";
import { getDemoScenario, DEMO_SCENARIOS } from "@/data/demoScenarios";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import Footer from "@/components/Footer";
import { getApiKey } from "@/lib/aiProvider";
import { findInLocalDatabase, FREE_JOB_LABELS, getSimilarJobs } from "@/data/jobDatabase";
import { supabase } from "@/integrations/supabase/client";

const DECLIC_PHASES = [
  {
    num: "01",
    icon: Search,
    color: "hsl(38 92% 50%)",
    label: "Détecter",
    desc: "Identifiez les tâches qui vous freinent au quotidien.",
  },
  {
    num: "02",
    icon: BarChart3,
    color: "hsl(221 83% 53%)",
    label: "Évaluer",
    desc: "Mesurez le potentiel réel de chaque tâche.",
  },
  {
    num: "03",
    icon: Wrench,
    color: "hsl(271 91% 55%)",
    label: "Concevoir",
    desc: "Construisez le workflow pas à pas.",
  },
  {
    num: "04",
    icon: Play,
    color: "hsl(160 84% 39%)",
    label: "Lancer",
    desc: "Testez et déployez sereinement.",
  },
  {
    num: "05",
    icon: Award,
    color: "hsl(32 95% 42%)",
    label: "Consolider",
    desc: "Ancrez les gains durablement.",
  },
];


// ── No-match modal ─────────────────────────────────────────────────────────────

interface NoMatchModalProps {
  metier: string;
  onClose: () => void;
  onUseApi: () => void;
  similarJobs: string[];
  onPickJob: (job: string) => void;
}

function NoMatchModal({ metier, onClose, onUseApi, similarJobs, onPickJob }: NoMatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl shadow-float max-w-md w-full p-8 space-y-5"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-muted mx-auto">
          <Search size={22} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h2 className="font-heading text-lg font-bold text-foreground mb-2">
            Métier non disponible en mode gratuit
          </h2>
          <p className="text-sm text-foreground-secondary">
            <span className="font-semibold text-primary">"{metier}"</span> n'est pas encore dans
            notre base gratuite. Utilisez votre clé API pour une analyse personnalisée.
          </p>
        </div>

        <button
          onClick={onUseApi}
          className="w-full h-11 rounded-full font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-all hover:shadow-md flex items-center justify-center gap-2"
        >
          Utiliser ma clé API
          <ArrowRight size={15} />
        </button>

        {similarJobs.length > 0 && (
          <div>
            <p className="text-xs text-foreground-muted mb-2.5 text-center">
              Métiers proches disponibles gratuitement :
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {similarJobs.map((j) => (
                <button
                  key={j}
                  onClick={() => onPickJob(j)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-foreground-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                >
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

// ── Contact Form ───────────────────────────────────────────────────────────────

function ContactSection() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !prenom.trim() || !nom.trim()) return;
    setSending(true);
    setErr(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("leads") as any).insert({
        nom: `${prenom.trim()} ${nom.trim()}`,
        email: email.trim(),
        message: entreprise.trim() ? `Entreprise : ${entreprise.trim()}` : null,
        source: "contact_accueil",
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setErr("Une erreur est survenue. Réessayez ou écrivez-nous à contact@lecko.fr");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-gr33t-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-gr33t-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">Message envoyé !</h3>
        <p className="text-foreground-secondary">Notre équipe vous recontactera dans les 48h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Prénom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input
            required value={prenom} onChange={e => setPrenom(e.target.value)}
            placeholder="Jean"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Nom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input
            required value={nom} onChange={e => setNom(e.target.value)}
            placeholder="Dupont"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Email *</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="jean.dupont@entreprise.fr"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Entreprise</label>
        <div className="relative">
          <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input
            value={entreprise} onChange={e => setEntreprise(e.target.value)}
            placeholder="Nom de votre organisation"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
          />
        </div>
      </div>
      {err && <p className="sm:col-span-2 text-sm text-destructive">{err}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={!email.trim() || !prenom.trim() || !nom.trim() || sending}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          <Send size={15} />
          {sending ? "Envoi en cours…" : "Envoyer"}
        </button>
      </div>
    </form>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Index() {
  const [metier, setMetier] = useState("");
  const [pendingJob, setPendingJob] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showNoMatchModal, setShowNoMatchModal] = useState(false);
  const [noMatchMetier, setNoMatchMetier] = useState("");
  const [similarJobs, setSimilarJobs] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setPage, clearAnalysis } = usePageContext();

  useEffect(() => { setPage("landing"); clearAnalysis(); }, [setPage, clearAnalysis]);

  // Onboarding — show only once for new visitors
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("declic-onboarding-done")
  );

  const handleOnboardingComplete = () => {
    localStorage.setItem("declic-onboarding-done", "1");
    setShowOnboarding(false);
    // Focus the search input after onboarding closes
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (searchParams.get("requireKey") === "1") setShowApiModal(true);
  }, [searchParams]);

  // Demo mode redirect
  useEffect(() => {
    const demoParam = searchParams.get("demo");
    if (demoParam) {
      const scenario = getDemoScenario(demoParam === "true" ? undefined : demoParam);
      const encoded = btoa(encodeURIComponent(JSON.stringify(scenario.result)));
      navigate(
        `/resultats?metier=${encodeURIComponent(scenario.result.metier)}&cached=${encoded}&source=local&demo=1&roiRate=${scenario.roiParams.hourlyRate}&roiPeople=${scenario.roiParams.nbPeople}`,
        { replace: true }
      );
    }
  }, [searchParams, navigate]);

  // Demo selector mode (?demos)
  const showDemoSelector = searchParams.get("demos") !== null;

  const handleAnalyze = (value?: string) => {
    const job = (value ?? metier).trim();
    if (!job) return;
    const localResult = findInLocalDatabase(job);
    if (localResult) {
      navigate(`/resultats?metier=${encodeURIComponent(job)}&source=local`);
      return;
    }
    if (getApiKey()) {
      navigate(`/resultats?metier=${encodeURIComponent(job)}`);
      return;
    }
    setNoMatchMetier(job);
    setSimilarJobs(getSimilarJobs(job));
    setShowNoMatchModal(true);
  };

  const handleApiKeySaved = () => {
    const job = pendingJob;
    setPendingJob(null);
    setShowApiModal(false);
    if (job) navigate(`/resultats?metier=${encodeURIComponent(job)}`);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* ── HERO — Gr33t style with gradient bg ──────────────────────────────── */}
      <section className="relative px-4 py-24 md:py-32 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-gr33t-100/20 dark:bg-gr33t-900/10 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5"
              >
                <span className="section-label">Diagnostic IA × Métier</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="font-heading text-display text-foreground mb-6"
              >
                Automatisez intelligemment les tâches qui vous{" "}
                <span className="underline-orange">freinent</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="text-body-lg text-foreground-secondary mb-10 max-w-xl"
              >
                Analysez votre métier. Identifiez ce qui peut être automatisé.
                Passez à l'action étape par étape.
              </motion.p>

              {/* Search box — Gr33t style: large, rounded, shadow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={metier}
                    onChange={(e) => setMetier(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    placeholder="Votre métier — ex : Chef de projet, Comptable..."
                    className="w-full h-14 pl-11 pr-4 text-base bg-white dark:bg-card border border-border/60 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground placeholder:text-foreground-light shadow-card"
                  />
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!metier.trim()}
                  className="shrink-0 h-14 px-8 font-semibold text-sm text-white rounded-2xl bg-primary hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Analyser
                </button>
              </motion.div>

              {/* Job chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap gap-2"
              >
                {FREE_JOB_LABELS.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAnalyze(s)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-foreground-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Right — abstract illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="relative w-80 h-72 rounded-3xl overflow-hidden bg-primary/[0.04] border border-primary/10">
                <svg viewBox="0 0 320 280" className="w-full h-full" aria-hidden>
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(221 83% 53% / 0.05)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="320" height="280" fill="url(#grid)" />

                  {/* Workflow nodes */}
                  <rect x="30" y="110" width="64" height="36" rx="12" fill="hsl(221 83% 53% / 0.12)" stroke="hsl(221 83% 53% / 0.25)" strokeWidth="1.5"/>
                  <text x="62" y="132" textAnchor="middle" fontSize="10" fill="hsl(221 83% 53%)" fontFamily="Inter, sans-serif" fontWeight="600">Déclencheur</text>

                  <rect x="128" y="80" width="64" height="36" rx="12" fill="hsl(38 92% 50% / 0.10)" stroke="hsl(38 92% 50% / 0.25)" strokeWidth="1.5"/>
                  <text x="160" y="102" textAnchor="middle" fontSize="10" fill="hsl(32 95% 42%)" fontFamily="Inter, sans-serif" fontWeight="600">Traitement</text>

                  <rect x="128" y="140" width="64" height="36" rx="12" fill="hsl(160 84% 39% / 0.08)" stroke="hsl(160 84% 39% / 0.25)" strokeWidth="1.5"/>
                  <text x="160" y="162" textAnchor="middle" fontSize="10" fill="hsl(160 84% 39%)" fontFamily="Inter, sans-serif" fontWeight="600">Condition</text>

                  <rect x="226" y="80" width="64" height="36" rx="12" fill="hsl(271 91% 55% / 0.08)" stroke="hsl(271 91% 55% / 0.2)" strokeWidth="1.5"/>
                  <text x="258" y="102" textAnchor="middle" fontSize="10" fill="hsl(271 91% 55%)" fontFamily="Inter, sans-serif" fontWeight="600">IA / LLM</text>

                  <rect x="226" y="140" width="64" height="36" rx="12" fill="hsl(221 83% 53% / 0.06)" stroke="hsl(221 83% 53% / 0.15)" strokeWidth="1.5"/>
                  <text x="258" y="162" textAnchor="middle" fontSize="10" fill="hsl(221 83% 53%)" fontFamily="Inter, sans-serif" fontWeight="600">Notification</text>

                  {/* Arrows */}
                  <line x1="94" y1="128" x2="128" y2="104" stroke="hsl(221 83% 53% / 0.3)" strokeWidth="1.5" markerEnd="url(#arrow)"/>
                  <line x1="94" y1="134" x2="128" y2="154" stroke="hsl(221 83% 53% / 0.3)" strokeWidth="1.5"/>
                  <line x1="192" y1="98" x2="226" y2="98" stroke="hsl(38 92% 50% / 0.3)" strokeWidth="1.5"/>
                  <line x1="192" y1="158" x2="226" y2="158" stroke="hsl(160 84% 39% / 0.3)" strokeWidth="1.5"/>

                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="hsl(221 83% 53% / 0.3)"/>
                    </marker>
                  </defs>

                  {/* ROI badge */}
                  <circle cx="256" cy="48" r="16" fill="hsl(38 92% 50% / 0.12)" stroke="hsl(38 92% 50% / 0.25)" strokeWidth="1.5"/>
                  <text x="256" y="52" textAnchor="middle" fontSize="11" fill="hsl(32 95% 42%)" fontFamily="Inter, sans-serif" fontWeight="700">ROI</text>

                  {/* Time saved */}
                  <rect x="30" y="190" width="100" height="24" rx="12" fill="hsl(160 84% 39% / 0.08)" stroke="hsl(160 84% 39% / 0.2)" strokeWidth="1"/>
                  <text x="80" y="206" textAnchor="middle" fontSize="9" fill="hsl(160 84% 39%)" fontFamily="Inter, sans-serif" fontWeight="600">~4h économisées/sem</text>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/equipe"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.02] hover:border-primary/50 hover:bg-primary/[0.04] transition-all duration-200 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-foreground text-base">Analyse d'équipe</p>
              <p className="text-sm text-foreground-secondary mt-0.5">
                Plusieurs métiers ? Obtenez un diagnostic consolidé avec ROI agrégé.
              </p>
            </div>
            <span className="text-sm font-semibold text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all shrink-0">
              Lancer une analyse d'équipe <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── APPROACH — 5 PHASES ──────────────────────────────────────────────── */}
      <section className="px-4 py-24 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4 inline-block">Méthode</span>
            <h2 className="font-heading text-heading-lg md:text-heading-xl text-foreground mb-5">
              Une approche en 5 phases pour automatiser{" "}
              <span className="underline-orange">durablement</span>
            </h2>
            <p className="text-body-lg text-foreground-secondary mx-auto max-w-xl">
              Pas de promesses magiques. Une méthode structurée qui respecte une règle d'or :
              on n'automatise que ce qu'on comprend parfaitement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {DECLIC_PHASES.map((phase, idx) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link
                    to="/methode"
                    className="lecko-card p-5 flex flex-col gap-3 group h-full"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-3xl font-bold" style={{ color: phase.color, opacity: 0.15 }}>
                        {phase.num}
                      </span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${phase.color}10` }}>
                        <Icon size={18} style={{ color: phase.color }} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-foreground text-base mb-1">{phase.label}</p>
                      <p className="text-sm text-foreground-muted leading-snug">{phase.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center">
            <Link
              to="/methode"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
            >
              Découvrir la méthode en détail <ArrowRight size={14} />
            </Link>
          </p>
          <p className="text-center mt-2 text-sm text-foreground-muted max-w-2xl mx-auto">
            Notre app vous accompagne dans les phases 1 à 3. Pour les phases 4 et 5, le DÉCLIC Copilot vous guide pas à pas.
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center section-label mb-10">Des organisations qui passent à l'action</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-60 transition-opacity">
            {["Collectivité ÎdF", "Région Sud", "Groupe bancaire", "Maison de luxe", "Équipementier auto"].map((name) => (
              <div key={name} className="font-heading text-sm font-semibold text-foreground-muted tracking-wide">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 section-alt">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="section-label mb-4 inline-block">Contact</span>
            <h2 className="font-heading text-heading-lg md:text-heading-xl text-foreground mb-4">
              Parlons de votre <span className="underline-orange">projet</span>
            </h2>
            <p className="text-body-lg text-foreground-secondary max-w-xl">
              Renseignez vos coordonnées et notre équipe vous recontactera pour discuter de vos besoins en automatisation.
            </p>
          </div>
          <div className="lecko-card p-8">
            <ContactSection />
          </div>
        </div>
      </section>

      {/* Demo selector (/?demos) */}
      {showDemoSelector && (
        <section className="px-4 py-16 section-alt">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="section-label mb-4 inline-block">Mode démo</span>
              <h2 className="font-heading text-heading-lg text-foreground mb-3">
                Choisissez un scénario de démonstration
              </h2>
              <p className="text-body-lg text-foreground-secondary max-w-xl mx-auto">
                Données fictives pré-remplies pour présenter DÉCLIC en réunion client ou en webinaire.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_SCENARIOS.map((s) => (
                <div key={s.id} className="lecko-card p-6 flex flex-col gap-3">
                  <p className="font-heading font-semibold text-foreground">{s.label}</p>
                  <p className="text-sm text-foreground-secondary flex-1">{s.description}</p>
                  <p className="text-xs text-foreground-muted">{s.context}</p>
                  <button
                    onClick={() => navigate(`/?demo=${s.id}`)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-1"
                  >
                    Lancer cette démo <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {showNoMatchModal && (
        <NoMatchModal
          metier={noMatchMetier}
          onClose={() => setShowNoMatchModal(false)}
          onUseApi={() => { setShowNoMatchModal(false); setPendingJob(noMatchMetier); setShowApiModal(true); }}
          similarJobs={similarJobs}
          onPickJob={(job) => { setShowNoMatchModal(false); navigate(`/resultats?metier=${encodeURIComponent(job)}&source=local`); }}
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
