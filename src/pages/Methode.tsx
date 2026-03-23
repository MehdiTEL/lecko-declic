import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckSquare, Square, Search, BarChart3, Wrench,
  Play, Award, ShieldCheck, RefreshCw, AlertTriangle, Lightbulb,
  Target, Inbox, GitBranch, Send, BellRing,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DECLIC_PHASES } from "@/types/declic";
import { useChatContext } from "@/context/ChatContext";
import { usePageContext } from "@/context/PageContext";

const PHASE_ICONS = [ShieldCheck, Search, BarChart3, Wrench, Play, RefreshCw, Award];

const CRITERES = [
  { key: "recurrence", Icon: RefreshCw, label: "Récurrence", question: "Vous l'avez fait plus de 3 fois et vous allez le refaire ?" },
  { key: "energie", Icon: Lightbulb, label: "Énergie", question: "Ça vous coûte un vrai morceau de temps ou d'énergie ?" },
  { key: "scalabilite", Icon: BarChart3, label: "Scalabilité", question: "Si votre activité double, cette tâche explose ?" },
  { key: "fiabilite", Icon: AlertTriangle, label: "Fiabilité", question: "L'humain oublie ou se trompe régulièrement dessus ?" },
  { key: "penibilite", Icon: Target, label: "Pénibilité", question: "C'est mentalement usant, ça grignote votre motivation ?" },
];

const CHECKLIST_ITEMS = [
  "La tâche a un score de 3+ sur les 5 critères",
  "Le croquis (déclencheur > sorties > exceptions) est clair",
  "On a d'abord essayé sans IA",
  "L'IA a été ajoutée uniquement là où elle fait une vraie différence",
  "Logs + alertes + exceptions sont prévus",
  "10 tests réels ont été faits",
  "Déploiement progressif validé",
];

const WORKFLOW_ITEMS = [
  { Icon: Target, label: "DÉCLENCHEUR", desc: "Qu'est-ce qui démarre le process ?" },
  { Icon: Inbox, label: "ENTRÉES", desc: "Quelles infos arrivent ?" },
  { Icon: GitBranch, label: "RÈGLES", desc: "Si ceci, alors cela" },
  { Icon: Send, label: "SORTIES", desc: "Quel résultat produit ?" },
  { Icon: BellRing, label: "EXCEPTIONS", desc: "Quand l'humain reprend ?" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function Methode() {
  const { setPage } = usePageContext();
  useEffect(() => { setPage("methode"); }, [setPage]);

  const [thirtySecText, setThirtySecText] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [critScores, setCritScores] = useState<Record<string, boolean>>({});
  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const { openChat } = useChatContext();

  const totalCritScore = Object.values(critScores).filter(Boolean).length;

  const startTimer = () => {
    if (timerStarted) return;
    setTimerStarted(true);
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); setTimerDone(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleCrit = (key: string) => setCritScores((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleCheck = (i: number) => setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));

  const scoreLabel = () => {
    if (totalCritScore >= 3) return { text: "Priorité absolue -- automatisez maintenant", color: "hsl(var(--accent-green-text))", bg: "hsl(var(--accent-green-bg))" };
    if (totalCritScore === 2) return { text: "Candidat intéressant -- à creuser", color: "hsl(var(--accent-amber-text))", bg: "hsl(var(--accent-amber-bg))" };
    return { text: "Pas le bon levier -- gardez votre énergie", color: "hsl(var(--foreground-muted))", bg: "hsl(var(--muted))" };
  };

  const acronymPhases = DECLIC_PHASES.filter((p) => p.id >= 1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative px-4 pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden" style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="label-uppercase mb-4 text-primary tracking-widest text-xs font-semibold">
            Méthodologie DÉCLIC
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-5"
            style={{ lineHeight: "1.1", letterSpacing: "-0.025em" }}>
            6 phases pour automatiser intelligemment
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
            className="text-lg text-foreground-secondary mb-14 max-w-2xl mx-auto" style={{ lineHeight: "1.65" }}>
            Conçue par Lecko pour les organisations qui veulent automatiser sans improviser.
          </motion.p>

          {/* Acronym letters */}
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="flex flex-wrap justify-center gap-3 md:gap-6">
            {acronymPhases.map((phase) => (
              <motion.a key={phase.id} href={`#phase-${phase.id}`} variants={fadeUp}
                className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <span className="text-[40px] md:text-[48px] font-black leading-none transition-transform group-hover:scale-110"
                  style={{ color: phase.color }}>
                  {phase.letter}
                </span>
                <span className="text-xs font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
                  {phase.shortLabel}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY DÉCLIC ─── */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-8" style={{ borderLeft: "4px solid #2563EB" }}>
          <h2 className="text-xl font-bold font-heading text-foreground mb-5">Pourquoi une méthode ?</h2>
          <div className="space-y-4 text-foreground-secondary leading-relaxed text-[15px]">
            <p>
              80% des projets d'automatisation échouent. Pas pour des raisons techniques — parce qu'on automatise
              trop vite, sans comprendre le process, sans mesurer l'impact, sans préparer les équipes.
            </p>
            <p>
              DÉCLIC est née de 15 ans d'accompagnement de la transformation digitale chez Lecko.
              Chaque phase répond à un échec que nous avons observé sur le terrain.
            </p>
            <p className="font-medium text-foreground">
              Le principe fondateur : on n'automatise jamais un flou. Si vous ne pouvez pas expliquer votre
              process en 30 secondes, il n'est pas prêt.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── VISUAL PIPELINE ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-8">
          Le parcours DÉCLIC
        </motion.h2>

        {/* Desktop pipeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="hidden md:flex items-stretch justify-center gap-0">
          {DECLIC_PHASES.filter((p) => p.id >= 1).map((phase, i) => {
            const Icon = PHASE_ICONS[phase.id];
            return (
              <div key={phase.id} className="flex items-center">
                <a href={`#phase-${phase.id}`}
                  className="flex flex-col items-center justify-start w-[150px] rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
                  style={{ borderTop: `4px solid ${phase.color}` }}>
                  <span className="text-2xl font-black mb-1" style={{ color: phase.color }}>{phase.letter}</span>
                  <span className="text-sm font-bold text-foreground mb-1">{phase.shortLabel}</span>
                  <span className="text-[11px] text-foreground-muted text-center leading-snug">{phase.question}</span>
                </a>
                {i < 5 && (
                  <div className="flex items-center px-1">
                    <div className="w-6 h-0.5 bg-border" />
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px]"
                      style={{ borderLeftColor: "hsl(var(--border))" }} />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Mobile pipeline */}
        <div className="md:hidden flex flex-col items-start gap-0 pl-4">
          {DECLIC_PHASES.filter((p) => p.id >= 1).map((phase, i) => (
            <div key={phase.id} className="flex items-stretch">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                  style={{ backgroundColor: phase.color }}>
                  {phase.letter}
                </div>
                {i < 5 && <div className="w-0.5 flex-1 min-h-[24px]" style={{ backgroundColor: phase.color, opacity: 0.3 }} />}
              </div>
              <a href={`#phase-${phase.id}`} className="pb-5">
                <p className="text-sm font-bold text-foreground">{phase.shortLabel}</p>
                <p className="text-xs text-foreground-muted">{phase.question}</p>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PHASE DETAILS ─── */}
      <div className="max-w-3xl mx-auto px-4 pb-20 space-y-10">

        {/* Phase 0 -- Prérequis */}
        <motion.section id="phase-0" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[0].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[0].color }}>Phase 0 -- Prérequis</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Votre process est-il clair ?</h2>
          <p className="text-foreground-secondary mb-5 leading-relaxed text-[15px]">
            Si vous ne pouvez pas expliquer un process en 30 secondes, il n'est pas prêt.
            L'automatisation amplifie l'efficacité d'un bon process -- et le chaos d'un mauvais.
          </p>
          <div className="bg-muted/40 rounded-xl p-5">
            <p className="text-sm font-semibold text-foreground mb-1">Le test des 30 secondes</p>
            <p className="text-sm text-foreground-secondary mb-3">Décrivez votre process en une phrase :</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input type="text" value={thirtySecText}
                onChange={(e) => { setThirtySecText(e.target.value); if (!timerStarted && e.target.value.length > 0) startTimer(); }}
                placeholder="Ex : Quand un formulaire est soumis, je l'envoie dans Notion..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-foreground-muted" />
              {timerStarted && !timerDone && (
                <div className="flex items-center justify-center w-14 h-10 rounded-xl text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: "#F59E0B" }}>{timeLeft}s</div>
              )}
            </div>
            {timerDone && thirtySecText.trim() && (
              <p className="text-sm mt-3 font-medium" style={{ color: "hsl(var(--accent-green-text))" }}>
                Ce process est probablement prêt à être automatisé.
              </p>
            )}
            {timerDone && !thirtySecText.trim() && (
              <p className="text-sm mt-3 font-medium" style={{ color: "hsl(var(--destructive))" }}>
                Temps écoulé. Clarifiez d'abord ce process.
              </p>
            )}
          </div>
        </motion.section>

        {/* Phase 1 -- Détecter */}
        <motion.section id="phase-1" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[1].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[1].color }}>Phase 1 -- Détecter</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Identifiez ce qui vous freine</h2>
          <p className="text-foreground-secondary mb-4 leading-relaxed text-[15px]">
            Prenez 15 minutes. Listez tout ce qui revient chaque semaine et que vous repoussez.
          </p>
          <ul className="space-y-2 mb-5">
            {["Les tâches que vous repoussez", "Les process qui prennent trop de temps", "Les erreurs qui reviennent"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: DECLIC_PHASES[1].color }} />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Lancer un diagnostic <ArrowRight size={14} />
          </Link>
        </motion.section>

        {/* Phase 2 -- Évaluer */}
        <motion.section id="phase-2" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[2].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[2].color }}>Phase 2 -- Évaluer</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Scorez chaque tâche</h2>
          <p className="text-foreground-secondary mb-4 leading-relaxed text-[15px]">
            Cliquez sur chaque critère pour évaluer une de vos tâches :
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {CRITERES.map((c) => {
              const checked = !!critScores[c.key];
              return (
                <button key={c.key} onClick={() => toggleCrit(c.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    checked ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground-secondary hover:border-primary/40"
                  }`}>
                  <c.Icon size={14} strokeWidth={2} />
                  {c.label}
                  <span className={`text-xs font-bold ml-1 ${checked ? "text-primary" : "text-foreground-muted"}`}>
                    {checked ? "1" : "0"}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="space-y-1.5 mb-4">
            {CRITERES.map((c) => (
              <p key={c.key} className="text-xs text-foreground-muted">
                <span className="font-semibold text-foreground">{c.label}</span> : {c.question}
              </p>
            ))}
          </div>
          {totalCritScore > 0 && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: scoreLabel().bg, color: scoreLabel().color }}>
              Score : {totalCritScore}/5 -- {scoreLabel().text}
            </div>
          )}
        </motion.section>

        {/* Phase 3 -- Concevoir */}
        <motion.section id="phase-3" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[3].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[3].color }}>Phase 3 -- Concevoir</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Dessinez avant de construire</h2>
          <p className="text-foreground-secondary mb-5 leading-relaxed text-[15px]">
            Remplissez ces 5 cases avant d'ouvrir un outil :
          </p>
          {/* Horizontal workflow */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {WORKFLOW_ITEMS.map((item, i) => (
              <div key={item.label} className="flex flex-col items-center text-center p-3 rounded-xl border border-border bg-muted/20 relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${DECLIC_PHASES[3].color}18` }}>
                  <item.Icon size={14} style={{ color: DECLIC_PHASES[3].color }} strokeWidth={2} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: DECLIC_PHASES[3].color }}>{item.label}</p>
                <p className="text-xs text-foreground-secondary leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-foreground-muted">
            Si vous ne pouvez pas remplir ces 5 cases, le process n'est pas encore mûr. Revenez-y plus tard.
          </p>
        </motion.section>

        {/* Phase 4 -- Lancer */}
        <motion.section id="phase-4" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[4].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[4].color }}>Phase 4 -- Lancer</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Testez, déployez, sécurisez</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { title: "Crash-test", items: ["10 cas : normaux, incomplets, bizarres", "8 sur 10 passent = OK", "Vous n'êtes pas Airbus"] },
              { title: "Filet de sécurité", items: ["Consultez les logs", "Alertes en cas d'échec", "Plan B si ça plante"] },
              { title: "Déploiement progressif", items: ["Lancez sur 1 semaine", "Observez et ajustez", "Puis élargissez"] },
            ].map((card) => (
              <div key={card.title} className="p-4 rounded-xl border border-border bg-muted/20">
                <p className="text-sm font-bold text-foreground mb-2">{card.title}</p>
                <ul className="space-y-1">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground-secondary">
                      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: DECLIC_PHASES[4].color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Phase 5 -- Itérer */}
        <motion.section id="phase-5" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[5].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[5].color }}>Phase 5 -- Itérer</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Observer, ajuster, améliorer</h2>
          <p className="text-foreground-secondary mb-5 leading-relaxed text-[15px]">
            L'automatisation parfaite du premier coup n'existe pas. Collectez les retours, ajustez les règles.
          </p>
          <div className="rounded-xl p-5 border-2" style={{ borderColor: DECLIC_PHASES[5].color, backgroundColor: `${DECLIC_PHASES[5].color}08` }}>
            <p className="text-lg font-bold text-foreground mb-1">La règle du 80/20</p>
            <p className="text-sm text-foreground-secondary">
              Visez 80% d'automatisation, pas 100%. Les 20% restants ne valent souvent pas l'investissement.
              Gardez un humain dans la boucle pour les cas limites.
            </p>
          </div>
        </motion.section>

        {/* Phase 6 -- Consolider */}
        <motion.section id="phase-6" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lecko-card p-8" style={{ borderLeft: `4px solid ${DECLIC_PHASES[6].color}` }}>
          <p className="label-uppercase text-[11px] mb-1" style={{ color: DECLIC_PHASES[6].color }}>Phase 6 -- Consolider</p>
          <h2 className="text-xl font-bold font-heading text-foreground mb-4">Ancrez les gains</h2>
          <div className="space-y-1.5 mb-4">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors text-left">
                {checklist[i]
                  ? <CheckSquare size={15} className="shrink-0" style={{ color: "hsl(var(--accent-green-text))" }} />
                  : <Square size={15} className="text-foreground-muted shrink-0" />}
                <span className={`text-sm ${checklist[i] ? "line-through text-foreground-muted" : "text-foreground"}`}>{item}</span>
              </button>
            ))}
          </div>
          {checklist.every(Boolean) && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "hsl(var(--accent-green-bg))", color: "hsl(var(--accent-green-text))" }}>
              Tout est coché. Automatisation solide. Passez à la suivante.
            </div>
          )}
        </motion.section>

        {/* ─── CTA ─── */}
        <section className="rounded-2xl p-10 text-center" style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
          <p className="label-uppercase mb-3 text-primary tracking-widest text-xs font-semibold">Passer à la pratique</p>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-3">
            Prêt à appliquer DÉCLIC ?
          </h2>
          <p className="text-foreground-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Analysez votre métier et recevez un plan d'action personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-primary transition-colors hover:opacity-90">
              Diagnostic express <ArrowRight size={15} />
            </Link>
            <Link to="/diagnostic"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200">
              Diagnostic personnalisé <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
