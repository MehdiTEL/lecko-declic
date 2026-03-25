import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Wrench, Play, Award, Users, Send, CheckCircle, Building2, Mail, User, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
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
import NoMatchModal from "@/components/NoMatchModal";
import ContactSection from "@/components/ContactSection";

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


// ── Extracted components ──────────────────────────────────────────────────────

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
    () => { try { return !localStorage.getItem("declic-onboarding-done"); } catch { return false; } }
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

  const handlePersonalized = () => {
    const job = metier.trim() || "";
    if (!getApiKey()) {
      navigate(`/configurer-api?metier=${encodeURIComponent(job)}&redirect=diagnostic`);
      return;
    }
    navigate(`/diagnostic?metier=${encodeURIComponent(job)}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="declic-deco-square" aria-hidden />

      {/* ═══ HERO ═══ */}
      <section className="px-4 pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-medium text-foreground-muted tracking-wide mb-8">
            Par <span className="font-semibold text-foreground">Lecko</span> — 20 ans d'expertise en transformation digitale
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-5"
            style={{ lineHeight: "1.08", letterSpacing: "-0.03em" }}
          >
            Votre diagnostic IA<br className="hidden sm:block" />
            en <span className="text-lecko-blue">30 secondes</span>.
          </h1>
          <p className="text-base md:text-lg text-foreground-muted mb-10 max-w-lg mx-auto" style={{ lineHeight: "1.65" }}>
            Entrez votre métier. Découvrez vos tâches automatisables,
            le temps récupérable, et un plan d'action structuré.
          </p>

          {/* Input principal */}
          <div className="max-w-xl mx-auto mb-5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted/50 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={metier}
                  onChange={(e) => setMetier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Ex : Chef de projet, Comptable, RH..."
                  className="w-full h-14 pl-12 pr-4 text-base bg-background border-2 border-border rounded-2xl outline-none focus:border-lecko-blue focus:shadow-[0_0_0_4px_hsl(221_83%_53%/0.1)] transition-all text-foreground placeholder:text-foreground-muted/40"
                />
              </div>
              <button
                onClick={() => handleAnalyze()}
                disabled={!metier.trim()}
                className="shrink-0 h-14 px-8 font-semibold text-[15px] text-white rounded-2xl bg-lecko-blue hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Analyser
              </button>
            </div>
          </div>

          {/* Métiers cliquables */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {FREE_JOB_LABELS.slice(0, 8).map((s) => (
              <button
                key={s}
                onClick={() => handleAnalyze(s)}
                className="px-3 py-1 text-[13px] text-foreground-muted hover:text-lecko-blue hover:bg-lecko-blue/5 rounded-lg transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTA personnalisé */}
          <button
            onClick={handlePersonalized}
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-lecko-blue transition-colors mt-1"
          >
            <Sparkles size={14} />
            Diagnostic personnalisé — basé sur votre quotidien réel
            <ArrowRight size={13} />
          </button>

          <p className="text-[11px] text-foreground-muted/60 mt-4">
            Gratuit. Sans inscription. Résultats immédiats.
          </p>
        </div>
      </section>

      {/* ═══ APERÇU PRODUIT ═══ */}
      <section className="px-4 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Outer glow container */}
          <div className="relative">
            {/* Background glow effect */}
            <div
              className="absolute -inset-4 md:-inset-6 rounded-[28px] blur-2xl opacity-[0.07]"
              style={{ background: "radial-gradient(ellipse at center, #2563EB 0%, transparent 70%)" }}
              aria-hidden
            />

            {/* Browser frame */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1.5px solid hsl(var(--border))",
                boxShadow: "0 25px 60px -12px rgba(37, 99, 235, 0.12), 0 12px 30px -8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(37, 99, 235, 0.04)",
              }}
            >
              {/* Title bar */}
              <div className="h-11 bg-card border-b border-border flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-muted/50 max-w-xs w-full">
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-foreground-muted/40 shrink-0">
                      <circle cx="5" cy="5" r="4" stroke="currentColor" fill="none" strokeWidth="1.2" />
                      <line x1="8" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <span className="text-[11px] text-foreground-muted font-mono truncate">declic.lecko.fr/resultats</span>
                  </div>
                </div>
                <div className="w-[52px]" /> {/* Spacer to center the URL bar */}
              </div>

              {/* Screenshot */}
              <div className="relative">
                <img
                  src="/Preview-diagnostic.png"
                  alt="Aperçu du diagnostic DÉCLIC — score, tâches automatisables, plan d'action"
                  className="w-full block"
                  loading="lazy"
                />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ACCOMPAGNEMENT ═══ */}
      <section className="px-4 py-16 md:py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lecko-blue mb-4">Accompagnement</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}>
                Un outil, une équipe,<br />
                un accompagnement complet.
              </h2>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-6">
                DÉCLIC vous donne le diagnostic. Quand vous avez besoin d'aller plus loin — intégration technique, conduite du changement, déploiement à l'échelle — notre équipe de consultants prend le relais.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Automatisation de processus", detail: "Conception et optimisation de workflows IA (N8N, Power Automate, Make)" },
                  { title: "Déploiement M365 et outils collaboratifs", detail: "Migration, adoption, gouvernance — du cadrage au pilotage" },
                  { title: "Stratégie IA et acculturation", detail: "Cadrage des usages, formation des équipes, choix des outils" },
                  { title: "Conduite du changement", detail: "Accompagnement humain pour sécuriser l'adoption à l'échelle" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-lecko-blue shrink-0 mt-2" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border p-6 bg-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted mb-5">Lecko en chiffres</p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "2005", label: "Année de création" },
                    { value: "20+", label: "Consultants" },
                    { value: "14", label: "Éditions du Référentiel" },
                    { value: "500+", label: "Missions réalisées" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>{stat.value}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://referentiel.lecko.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border p-4 bg-card hover:border-lecko-blue/30 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-lecko-blue/10 flex items-center justify-center shrink-0">
                  <ExternalLink size={16} className="text-lecko-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Référentiel Lecko</p>
                  <p className="text-xs text-foreground-muted">L'étude annuelle de référence sur la transformation</p>
                </div>
                <ArrowRight size={14} className="text-foreground-muted group-hover:text-lecko-blue group-hover:translate-x-1 transition-all shrink-0" />
              </a>

              <Link
                to="/notre-histoire"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm bg-lecko-blue text-white hover:bg-blue-700 transition-colors"
              >
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MÉTHODE ═══ */}
      <section className="px-4 py-16 md:py-20" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-lecko-blue mb-3">Méthodologie</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
              6 phases pour automatiser sans improviser
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {DECLIC_PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <Link
                  key={phase.num}
                  to="/methode"
                  className="group p-4 rounded-xl bg-card border border-border hover:border-lecko-blue/30 hover:shadow-sm transition-all text-center"
                >
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${phase.color}12` }}>
                    <Icon size={16} style={{ color: phase.color }} strokeWidth={2} />
                  </div>
                  <p className="text-xs font-bold" style={{ color: phase.color }}>{phase.num}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{phase.label}</p>
                  <p className="text-[11px] text-foreground-muted mt-1 leading-snug">{phase.desc}</p>
                </Link>
              );
            })}
          </div>

          <p className="text-center mt-6">
            <Link to="/methode" className="text-sm font-medium text-lecko-blue hover:underline inline-flex items-center gap-1.5">
              Découvrir la méthode en détail <ArrowRight size={13} />
            </Link>
          </p>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="px-4 py-16 md:py-20 border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ letterSpacing: "-0.02em" }}>
            Identifiez votre potentiel d'automatisation.
          </h2>
          <p className="text-sm text-foreground-muted mb-8">
            Gratuit. Aucune inscription. Résultats immédiats.
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={metier}
                onChange={(e) => setMetier(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Votre métier..."
                className="flex-1 h-12 px-4 text-sm bg-background border-2 border-border rounded-xl outline-none focus:border-lecko-blue transition-all text-foreground placeholder:text-foreground-muted/40"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={!metier.trim()}
                className="shrink-0 h-12 px-6 font-semibold text-sm text-white rounded-xl bg-lecko-blue hover:bg-blue-700 transition-all disabled:opacity-30"
              >
                Analyser
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-foreground-muted">
            <Link to="/notre-histoire" className="hover:text-foreground transition-colors">Notre histoire</Link>
            <Link to="/methode" className="hover:text-foreground transition-colors">La méthode</Link>
            <Link to="/equipe" className="hover:text-foreground transition-colors">Mode équipe</Link>
            <a href="https://referentiel.lecko.fr" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Référentiel Lecko</a>
          </div>
        </div>
      </section>

      {/* Demo selector (/?demos) */}
      {showDemoSelector && (
        <section className="px-4 py-16" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-lecko-blue mb-3">Mode démo</p>
              <h2 className="text-2xl font-bold text-foreground mb-3">Choisissez un scénario</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_SCENARIOS.map((s) => (
                <div key={s.id} className="rounded-xl border border-border p-6 bg-card flex flex-col gap-3">
                  <p className="font-semibold text-foreground">{s.label}</p>
                  <p className="text-sm text-foreground-secondary flex-1">{s.description}</p>
                  <button
                    onClick={() => navigate(`/?demo=${s.id}`)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-lecko-blue hover:underline mt-1"
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
          onUseApi={() => { setShowNoMatchModal(false); navigate(`/diagnostic?metier=${encodeURIComponent(noMatchMetier)}`); }}
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
