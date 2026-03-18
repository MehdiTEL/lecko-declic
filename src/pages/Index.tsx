import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Wrench, Play, Award, Users, Send, CheckCircle, Building2, Mail, User } from "lucide-react";
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
    color: "hsl(160 72% 35%)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "hsl(222 47% 11% / 0.5)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-2xl shadow-elevated max-w-md w-full p-8 space-y-5"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted mx-auto">
          <Search size={22} className="text-foreground-muted" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Métier non disponible en mode gratuit
          </h2>
          <p className="text-sm text-foreground-secondary">
            <span className="font-semibold text-lecko-blue">"{metier}"</span> n'est pas encore dans
            notre base gratuite. Utilisez votre clé API pour une analyse personnalisée.
          </p>
        </div>

        <button
          onClick={onUseApi}
          className="w-full h-11 rounded-xl font-semibold text-sm bg-lecko-blue text-white hover:bg-lecko-blue/90 transition-colors flex items-center justify-center gap-2"
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
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-border text-foreground-secondary hover:border-lecko-blue hover:text-lecko-blue transition-colors"
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

// ── Main Page ──────────────────────────────────────────────────────────────────

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
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Message envoyé !</h3>
        <p className="text-foreground-secondary">Notre équipe vous recontactera dans les 48h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Prénom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            required value={prenom} onChange={e => setPrenom(e.target.value)}
            placeholder="Jean"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Nom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            required value={nom} onChange={e => setNom(e.target.value)}
            placeholder="Dupont"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Email *</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="jean.dupont@entreprise.fr"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors text-foreground"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Entreprise</label>
        <div className="relative">
          <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            value={entreprise} onChange={e => setEntreprise(e.target.value)}
            placeholder="Nom de votre organisation"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors text-foreground"
          />
        </div>
      </div>
      {err && <p className="sm:col-span-2 text-sm text-destructive">{err}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={!email.trim() || !prenom.trim() || !nom.trim() || sending}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-lecko-blue text-white font-semibold text-sm hover:bg-lecko-blue/90 transition-colors disabled:opacity-50"
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

  useEffect(() => {
    if (searchParams.get("requireKey") === "1") setShowApiModal(true);
  }, [searchParams]);

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

  

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
        {/* Deco corner */}
        <div
          className="absolute top-8 right-8 w-8 h-8 rounded-lg hidden md:block pointer-events-none"
          style={{ backgroundColor: "hsl(var(--lecko-orange))", opacity: 0.4 }}
          aria-hidden
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="label-uppercase mb-4 text-lecko-blue"
              >
                Diagnostic IA × Métier
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-4xl md:text-5xl font-bold text-foreground mb-5"
                style={{ lineHeight: "1.12", letterSpacing: "-0.02em" }}
              >
                Automatisez intelligemment les tâches qui vous{" "}
                <span className="underline-orange">freinent</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="text-lg text-foreground-secondary mb-8"
                style={{ maxWidth: "520px", lineHeight: "1.6" }}
              >
                Analysez votre métier. Identifiez ce qui peut être automatisé.
                Passez à l'action étape par étape.
              </motion.p>

              {/* Search box */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="flex flex-col sm:flex-row gap-3 mb-5"
              >
                <input
                  type="text"
                  value={metier}
                  onChange={(e) => setMetier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Votre métier — ex : Chef de projet, Comptable..."
                  className="flex-1 h-13 px-4 py-3 text-base bg-white border border-border rounded-xl outline-none focus:border-lecko-blue transition-colors text-foreground placeholder:text-foreground-muted shadow-editorial"
                  style={{ height: "52px" }}
                />
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!metier.trim()}
                  className="shrink-0 px-6 font-semibold text-sm text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "hsl(var(--lecko-blue))",
                    height: "52px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "hsl(221 83% 45%)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "hsl(var(--lecko-blue))")}
                >
                  Analyser
                </button>
              </motion.div>

              {/* Job chips — text only, no colored background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap gap-x-0 gap-y-0"
              >
                {FREE_JOB_LABELS.slice(0, 8).map((s, i) => (
                  <span key={s} className="inline-flex items-center">
                    <button
                      onClick={() => handleAnalyze(s)}
                      className="text-sm text-foreground-muted hover:text-lecko-blue hover:underline transition-colors py-0.5 px-1"
                    >
                      {s}
                    </button>
                    {i < Math.min(FREE_JOB_LABELS.length, 8) - 1 && (
                      <span className="text-foreground-muted/40 select-none">·</span>
                    )}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — abstract illustration placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center justify-center"
            >
              <div
                className="relative w-80 h-72 rounded-2xl overflow-hidden"
                style={{ backgroundColor: "hsl(221 83% 53% / 0.06)", border: "1px solid hsl(221 83% 53% / 0.12)" }}
              >
                {/* Abstract workflow illustration */}
                <svg viewBox="0 0 320 280" className="w-full h-full" aria-hidden>
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(221 83% 53% / 0.06)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="320" height="280" fill="url(#grid)" />

                  {/* Workflow nodes */}
                  <rect x="30" y="110" width="64" height="36" rx="8" fill="hsl(221 83% 53% / 0.15)" stroke="hsl(221 83% 53% / 0.3)" strokeWidth="1.5"/>
                  <text x="62" y="132" textAnchor="middle" fontSize="10" fill="hsl(221 83% 53%)" fontFamily="sans-serif" fontWeight="600">Déclencheur</text>

                  <rect x="128" y="80" width="64" height="36" rx="8" fill="hsl(38 92% 50% / 0.12)" stroke="hsl(38 92% 50% / 0.3)" strokeWidth="1.5"/>
                  <text x="160" y="102" textAnchor="middle" fontSize="10" fill="hsl(32 95% 42%)" fontFamily="sans-serif" fontWeight="600">Traitement</text>

                  <rect x="128" y="140" width="64" height="36" rx="8" fill="hsl(160 72% 35% / 0.1)" stroke="hsl(160 72% 35% / 0.3)" strokeWidth="1.5"/>
                  <text x="160" y="162" textAnchor="middle" fontSize="10" fill="hsl(160 72% 35%)" fontFamily="sans-serif" fontWeight="600">Condition</text>

                  <rect x="226" y="80" width="64" height="36" rx="8" fill="hsl(271 91% 55% / 0.1)" stroke="hsl(271 91% 55% / 0.25)" strokeWidth="1.5"/>
                  <text x="258" y="102" textAnchor="middle" fontSize="10" fill="hsl(271 91% 55%)" fontFamily="sans-serif" fontWeight="600">IA / LLM</text>

                  <rect x="226" y="140" width="64" height="36" rx="8" fill="hsl(221 83% 53% / 0.08)" stroke="hsl(221 83% 53% / 0.2)" strokeWidth="1.5"/>
                  <text x="258" y="162" textAnchor="middle" fontSize="10" fill="hsl(221 83% 53%)" fontFamily="sans-serif" fontWeight="600">Notification</text>

                  {/* Arrows */}
                  <line x1="94" y1="128" x2="128" y2="104" stroke="hsl(221 83% 53% / 0.4)" strokeWidth="1.5" markerEnd="url(#arrow)"/>
                  <line x1="94" y1="134" x2="128" y2="154" stroke="hsl(221 83% 53% / 0.4)" strokeWidth="1.5"/>
                  <line x1="192" y1="98" x2="226" y2="98" stroke="hsl(38 92% 50% / 0.4)" strokeWidth="1.5"/>
                  <line x1="192" y1="158" x2="226" y2="158" stroke="hsl(160 72% 35% / 0.4)" strokeWidth="1.5"/>

                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="hsl(221 83% 53% / 0.4)"/>
                    </marker>
                  </defs>

                  {/* Orange accent */}
                  <circle cx="256" cy="48" r="16" fill="hsl(38 92% 50% / 0.15)" stroke="hsl(38 92% 50% / 0.3)" strokeWidth="1.5"/>
                  <text x="256" y="52" textAnchor="middle" fontSize="11" fill="hsl(32 95% 42%)" fontFamily="sans-serif" fontWeight="700">ROI</text>

                  {/* Time saved tag */}
                  <rect x="30" y="190" width="100" height="22" rx="11" fill="hsl(160 72% 35% / 0.1)" stroke="hsl(160 72% 35% / 0.25)" strokeWidth="1"/>
                  <text x="80" y="205" textAnchor="middle" fontSize="9" fill="hsl(160 72% 35%)" fontFamily="sans-serif" fontWeight="600">~4h économisées/sem</text>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-4 py-10 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/equipe"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-2xl border border-dashed border-lecko-blue/30 bg-lecko-blue/3 hover:border-lecko-blue/60 hover:bg-lecko-blue/5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-lecko-blue/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-lecko-blue" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-base">Analyse d'équipe</p>
              <p className="text-sm text-foreground-secondary mt-0.5">
                Plusieurs métiers ? Obtenez un diagnostic consolidé avec ROI agrégé.
              </p>
            </div>
            <span className="text-sm font-medium text-lecko-blue flex items-center gap-1.5 group-hover:gap-2.5 transition-all shrink-0">
              Lancer une analyse d'équipe <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── APPROACH — 5 PHASES ──────────────────────────────────────────────── */}
      <section className="px-4 py-20 section-alt">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="label-uppercase mb-3 text-lecko-blue">Méthode</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Une approche en 5 phases pour automatiser{" "}
              <span className="underline-orange">durablement</span>
            </h2>
            <p className="text-lg text-foreground-secondary mx-auto" style={{ maxWidth: "580px" }}>
              Pas de promesses magiques. Une méthode structurée qui respecte une règle d'or :
              on n'automatise que ce qu'on comprend parfaitement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {DECLIC_PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <Link
                  key={phase.num}
                  to="/methode"
                  className="lecko-card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold" style={{ color: phase.color, opacity: 0.2 }}>
                      {phase.num}
                    </span>
                    <Icon size={20} style={{ color: phase.color }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base mb-1">{phase.label}</p>
                    <p className="text-sm text-foreground-muted leading-snug">{phase.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-center">
            <Link
              to="/methode"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lecko-blue hover:underline transition-colors"
            >
              Découvrir la méthode en détail <ArrowRight size={14} />
            </Link>
          </p>
          <p className="text-center mt-2 text-sm text-foreground-muted max-w-2xl mx-auto">
            Notre app vous accompagne dans les phases 1 à 3. Pour les phases 4 et 5, le Coach IA vous guide pas à pas.
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center label-uppercase mb-8">Des organisations qui passent à l'action</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 hover:opacity-70 transition-opacity">
            {["Collectivité ÎdF", "Région Sud", "Groupe bancaire", "Maison de luxe", "Équipementier auto"].map((name) => (
              <div key={name} className="text-sm font-semibold text-foreground-muted tracking-wide">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 section-alt">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Big decorative quote */}
            <span
              className="absolute -top-4 -left-2 text-6xl font-bold leading-none select-none pointer-events-none"
              style={{ color: "hsl(var(--lecko-orange))", opacity: 0.4 }}
              aria-hidden
            >«</span>

            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pl-8"
              style={{ borderLeft: "3px solid hsl(var(--lecko-blue))" }}
            >
              <p className="text-xl italic text-foreground-secondary leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: "hsl(var(--lecko-blue))" }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-foreground-muted">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center gap-2 mt-8 pl-8">
              <button
                onClick={() => { setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }}
                className="p-2 rounded-lg border border-border hover:border-lecko-blue hover:text-lecko-blue text-foreground-muted transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => { setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length); }}
                className="p-2 rounded-lg border border-border hover:border-lecko-blue hover:text-lecko-blue text-foreground-muted transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight size={16} />
              </button>
              <div className="flex items-center gap-1.5 ml-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: i === testimonialIdx ? "hsl(var(--lecko-blue))" : "hsl(var(--border))",
                      width: i === testimonialIdx ? "16px" : "6px",
                    }}
                    aria-label={`Témoignage ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
