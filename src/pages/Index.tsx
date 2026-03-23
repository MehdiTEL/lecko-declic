import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Wrench, Play, Award, Users, Send, CheckCircle, Building2, Mail, User, RefreshCw, Sparkles } from "lucide-react";
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
    icon: RefreshCw,
    color: "hsl(199 89% 48%)",
    label: "Itérer",
    desc: "Ajustez après les premiers retours.",
  },
  {
    num: "06",
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
        source: "declic_contact",
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

      {/* ── HERO — centré, orienté action ──────────────────────────────── */}
      <section className="px-4 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            Diagnostic IA par métier
          </p>

          <h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ lineHeight: "1.15", letterSpacing: "-0.02em" }}
          >
            Identifiez ce que l'IA peut{" "}
            <span className="underline-orange">automatiser</span>{" "}
            dans votre quotidien.
          </h1>

          <p className="text-base sm:text-lg text-foreground-secondary mb-10 max-w-xl mx-auto" style={{ lineHeight: "1.65" }}>
            Entrez votre métier. En 30 secondes, obtenez la liste de vos tâches
            automatisables, le temps récupérable, et un plan d'action concret.
          </p>

          {/* ── Dual choice: Express vs Personnalisé ──────────────── */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            {/* CARD 1 — Diagnostic Express (gratuit) */}
            <div className="lecko-card p-6 flex flex-col text-left relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gr33t-500/10 flex items-center justify-center shrink-0">
                  <Search size={16} className="text-gr33t-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Diagnostic Express</p>
                  <p className="text-[10px] font-semibold text-gr33t-600 uppercase tracking-wider">Gratuit — sans inscription</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5 flex-1">
                {["Score d'automatisation", "Tâches identifiées + ROI", "Plan d'action en 6 phases", "Base de 15 métiers"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-foreground-secondary">
                    <div className="w-1 h-1 rounded-full bg-gr33t-500 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={metier}
                    onChange={(e) => setMetier(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    placeholder="Votre métier..."
                    className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-foreground-muted"
                  />
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!metier.trim()}
                  className="w-full h-10 font-semibold text-sm text-white rounded-lg bg-gr33t-600 hover:bg-gr33t-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lancer le diagnostic
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {FREE_JOB_LABELS.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAnalyze(s)}
                    className="text-[11px] text-foreground-muted hover:text-primary transition-colors"
                  >
                    {s}{" "}·
                  </button>
                ))}
              </div>
            </div>

            {/* CARD 2 — Diagnostic Personnalisé (clé API) */}
            <div className="relative lecko-card p-6 flex flex-col text-left border-2 border-primary/20 bg-primary/[0.02]">
              {/* Recommended badge */}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  Recommandé
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Diagnostic Personnalisé</p>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Clé API requise</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5 flex-1">
                {[
                  "Tout le diagnostic Express +",
                  "Analyse de VOTRE quotidien réel",
                  "Adapté à vos outils et contraintes",
                  "Recommandations sur-mesure par l'IA",
                ].map((item, i) => (
                  <li key={item} className={`flex items-start gap-2 text-xs ${i === 0 ? "text-foreground-muted" : "text-foreground-secondary font-medium"}`}>
                    <div className={`w-1 h-1 rounded-full shrink-0 mt-1.5 ${i === 0 ? "bg-foreground-muted" : "bg-primary"}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  const job = metier.trim() || "";
                  if (!getApiKey()) {
                    navigate(`/configurer-api?metier=${encodeURIComponent(job)}&redirect=diagnostic`);
                    return;
                  }
                  navigate(`/diagnostic?metier=${encodeURIComponent(job)}`);
                }}
                className="w-full h-10 font-semibold text-sm text-white rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                Démarrer le diagnostic
              </button>

              <p className="text-[10px] text-foreground-muted mt-2 text-center">
                Utilise votre clé OpenAI ou Anthropic.{" "}
                <Link to="/configurer-api" className="text-primary hover:underline">
                  En savoir plus
                </Link>
              </p>
            </div>

          </div>

          {/* Compteurs factuels */}
          <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-border">
            {[
              { value: "15", label: "métiers analysables" },
              { value: "120+", label: "tâches dans la base" },
              { value: "6", label: "phases DÉCLIC" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-foreground-muted">{stat.label}</p>
              </div>
            ))}
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
              Une approche en 6 phases pour automatiser{" "}
              <span className="underline-orange">durablement</span>
            </h2>
            <p className="text-body-lg text-foreground-secondary mx-auto max-w-xl">
              Pas de promesses magiques. Une méthode structurée qui respecte une règle d'or :
              on n'automatise que ce qu'on comprend parfaitement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
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


      {/* ── CONTACT ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 section-alt">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="section-label mb-4 inline-block">Contact</span>
            <h2 className="font-heading text-heading-lg md:text-heading-xl text-foreground mb-4">
              Une <span className="underline-orange">question</span> ?
            </h2>
            <p className="text-body-lg text-foreground-secondary max-w-xl">
              Laissez-nous vos coordonnées, nous revenons vers vous sous 48h.
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
