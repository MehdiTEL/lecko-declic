import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Users, ArrowLeft } from "lucide-react";
import Onboarding from "@/components/Onboarding";
import { usePageContext } from "@/context/PageContext";
import { getDemoScenario, DEMO_SCENARIOS } from "@/data/demoScenarios";
import Navbar from "@/components/Navbar";
import ApiKeyModal from "@/components/ApiKeyModal";
import Footer from "@/components/Footer";
import { getApiKey } from "@/lib/aiProvider";
import { findInLocalDatabase, FREE_JOB_LABELS, getSimilarJobs } from "@/data/jobDatabase";
import { supabase } from "@/integrations/supabase/client";
import NoMatchModal from "@/components/NoMatchModal";


// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Index() {
  const VITRINE_URL = import.meta.env.VITE_VITRINE_URL ?? "https://lecko.fr";

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
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <a href={VITRINE_URL} className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={11} />
            lecko.fr
          </a>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-5"
            style={{ lineHeight: "1.08", letterSpacing: "-0.03em" }}
          >
            Votre premiere{" "}<span className="text-lecko-blue">cartographie IA</span>
          </h1>
          <p className="text-base md:text-lg text-foreground-muted mb-10 max-w-lg mx-auto" style={{ lineHeight: "1.65" }}>
            En 30 secondes, identifiez le potentiel d'automatisation de votre metier.
            Un consultant Lecko vous aide a transformer ce potentiel en realite.
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
          <div className="max-w-xl mx-auto mt-4">
            <button
              onClick={handlePersonalized}
              className="w-full h-14 flex items-center justify-center gap-2 text-sm font-semibold border-2 border-lecko-blue text-lecko-blue rounded-2xl hover:bg-lecko-blue hover:text-white transition-all"
            >
              <Users size={16} />
              Diagnostic approfondi — avec un consultant Lecko
              <ArrowRight size={14} />
            </button>
          </div>

          <p className="text-[11px] text-foreground-muted/60 mt-4">
            Gratuit — Resultats en 30 secondes — Accompagnement disponible
          </p>
        </div>
      </section>

      {/* ═══ COMMENT CA MARCHE ═══ */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {[
              { icon: Search, color: "#F59E0B", title: "Cartographiez", text: "Entrez votre metier. DECLIC identifie vos taches automatisables et estime le temps recuperable." },
              { icon: BarChart3, color: "#2563EB", title: "Evaluez", text: "Visualisez votre potentiel. Les resultats sont indicatifs — votre situation reelle peut varier selon votre contexte." },
              { icon: Users, color: "#059669", title: "Passez a l'action avec Lecko", text: "Un consultant analyse vos resultats et construit avec vous un plan d'action realiste." },
            ].map((s, i) => (
              <div key={s.title} className="flex-1 flex items-start gap-4">
                {i > 0 && <div className="hidden md:flex items-center text-foreground-muted/30 text-lg font-light self-center px-2">→</div>}
                <div className="flex-1 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}12` }}>
                    <s.icon size={16} style={{ color: s.color }} strokeWidth={2} />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{s.title}</p>
                  <p className="text-xs text-foreground-muted leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
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
