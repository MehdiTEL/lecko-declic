import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckSquare, Square, Search, BarChart3, Wrench, Play, Award, ShieldCheck, RefreshCw, AlertTriangle, Lightbulb, Target, Inbox, GitBranch, Send, BellRing } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DECLIC_PHASES } from "@/types/declic";
import { useChatContext } from "@/context/ChatContext";

const PHASE_ICONS = [ShieldCheck, Search, BarChart3, Wrench, Play, Award];

const CRITERES = [
  { key: "recurrence", Icon: RefreshCw, label: "Récurrence", question: "Vous l'avez fait plus de 3 fois et vous allez le refaire ?" },
  { key: "energie", Icon: Lightbulb, label: "Énergie", question: "Ça vous coûte un vrai morceau de temps ou d'énergie ?" },
  { key: "scalabilite", Icon: BarChart3, label: "Scalabilité", question: "Si votre activité double, cette tâche explose ?" },
  { key: "fiabilite", Icon: AlertTriangle, label: "Fiabilité", question: "L'humain oublie ou se trompe régulièrement dessus ?" },
  { key: "penibilite", Icon: Target, label: "Pénibilité", question: "C'est mentalement usant, ça grignote votre motivation ?" },
];

const CHECKLIST_ITEMS = [
  "La tâche a un score de 3+ sur les 5 critères",
  "Le croquis (déclencheur → sorties → exceptions) est clair",
  "On a d'abord essayé sans IA",
  "L'IA a été ajoutée uniquement là où elle fait une vraie différence",
  "Logs + alertes + exceptions sont prévus",
  "10 tests réels ont été faits",
  "Déploiement progressif validé",
];

const WORKFLOW_ITEMS = [
  { Icon: Target, label: "DÉCLENCHEUR", desc: "Qu'est-ce qui démarre le process ?", ex: "Un email arrive, un formulaire est soumis, un paiement est reçu" },
  { Icon: Inbox, label: "ENTRÉES", desc: "Quelles infos arrivent ? D'où ? Format ?", ex: "Nom + email + montant depuis Stripe" },
  { Icon: GitBranch, label: "RÈGLES", desc: "Si ceci, alors cela (les cas simples)", ex: "Si montant > 500€ → notifier le commercial" },
  { Icon: Send, label: "SORTIES", desc: "Quel résultat ? Où ça atterrit ?", ex: "Fiche client créée dans le CRM + email de bienvenue envoyé" },
  { Icon: BellRing, label: "EXCEPTIONS", desc: "Quand est-ce qu'un humain reprend la main ?", ex: "Si les données sont incomplètes → alerte Slack à l'équipe" },
];

function CritereRow({ crit, checked, onToggle }: { crit: typeof CRITERES[0]; checked: boolean; onToggle: () => void }) {
  const { Icon } = crit;
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition-all ${
        checked
          ? "border-lecko-blue bg-lecko-blue/5"
          : "border-border bg-card hover:border-border/80"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        checked ? "bg-lecko-blue text-white" : "bg-muted text-foreground-muted"
      }`}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{crit.label}</p>
        <p className="text-xs text-foreground-secondary leading-snug">{crit.question}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
        checked
          ? "bg-lecko-blue text-white"
          : "bg-muted text-foreground-muted"
      }`}>
        {checked ? "1" : "0"}
      </span>
    </button>
  );
}

export default function Methode() {
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

  const toggleCrit = (key: string) => {
    setCritScores((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCheck = (i: number) => {
    setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));
  };

  const scoreLabel = () => {
    if (totalCritScore >= 3) return { text: "Priorité absolue — automatisez ça maintenant", color: "hsl(160 72% 35%)", bg: "hsl(138 76% 97%)" };
    if (totalCritScore === 2) return { text: "Candidat intéressant — à creuser", color: "hsl(32 95% 35%)", bg: "hsl(48 100% 96%)" };
    return { text: "Pas le bon levier — gardez votre énergie", color: "hsl(215 16% 47%)", bg: "hsl(210 40% 96%)" };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      {/* Hero */}
      <section className="relative px-4 py-20 md:py-24 overflow-hidden"
        style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
        <div
          className="absolute top-8 right-8 w-8 h-8 rounded-lg hidden md:block pointer-events-none"
          style={{ backgroundColor: "hsl(var(--lecko-orange))", opacity: 0.4 }}
          aria-hidden
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="label-uppercase mb-4 text-lecko-blue">
            Méthodologie Lecko
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-5"
            style={{ lineHeight: "1.12", letterSpacing: "-0.02em" }}>
            La méthode <span className="underline-orange">DÉCLIC</span> —
            5 phases pour automatiser intelligemment
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
            className="text-lg text-foreground-secondary mb-12 max-w-2xl mx-auto" style={{ lineHeight: "1.65" }}>
            Pas de promesses magiques. Une approche structurée, concrète, et qui respecte une règle d'or :
            on n'automatise que ce qu'on comprend parfaitement.
          </motion.p>

          {/* Phase timeline */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-0 md:flex-nowrap">
            {DECLIC_PHASES.map((phase, i) => {
              const Icon = PHASE_ICONS[i];
              return (
                <div key={phase.id} className="flex items-center">
                  <a href={`#phase-${phase.id}`}
                    className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl hover:bg-white/60 transition-colors w-24 text-center group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: `${phase.color}18` }}>
                      <Icon size={16} style={{ color: phase.color }} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: phase.color }}>{phase.shortLabel}</span>
                    <span className="text-[10px] text-foreground-muted leading-tight text-center">{phase.question}</span>
                  </a>
                  {i < DECLIC_PHASES.length - 1 && <div className="hidden md:block w-4 h-px bg-border mx-0.5" />}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-20 space-y-12 pt-12">

        {/* Phase 0 — Prérequis */}
        <section id="phase-0" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(215 16% 47%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(215 16% 90%)" }}>
              <ShieldCheck size={18} style={{ color: "hsl(215 16% 47%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(215 16% 47%)" }}>Phase 0 — Prérequis</p>
              <h2 className="text-xl font-bold text-foreground">Avant toute chose : est-ce que votre process est clair ?</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5 leading-relaxed">
            Si vous ne pouvez pas expliquer un process en 30 secondes à un collègue, il n'est pas prêt à être automatisé.
            L'automatisation est un amplificateur : elle amplifie l'efficacité d'un bon process, mais elle amplifie aussi
            le chaos d'un mauvais process. Commencez toujours par <strong>clarifier, simplifier, puis automatiser</strong>.
          </p>

          <div className="bg-muted/40 rounded-xl p-5">
            <p className="text-sm font-semibold text-foreground mb-2">Le test des 30 secondes</p>
            <p className="text-sm text-foreground-secondary mb-3">Pouvez-vous décrire votre process en une phrase ?</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                value={thirtySecText}
                onChange={(e) => { setThirtySecText(e.target.value); if (!timerStarted && e.target.value.length > 0) startTimer(); }}
                placeholder="Ex : Quand un formulaire est soumis, je l'envoie dans Notion et j'envoie un email..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-lecko-blue/30 text-foreground placeholder:text-foreground-muted"
              />
              {timerStarted && !timerDone && (
                <div className="flex items-center justify-center w-14 h-10 rounded-xl text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: "hsl(var(--lecko-orange))" }}>
                  {timeLeft}s
                </div>
              )}
            </div>
            {timerDone && thirtySecText.trim() && (
              <p className="text-sm text-lecko-green mt-3 font-medium">
                Bien joué ! Ce process est probablement prêt à être automatisé.
              </p>
            )}
            {timerDone && !thirtySecText.trim() && (
              <p className="text-sm mt-3 font-medium" style={{ color: "hsl(var(--destructive))" }}>
                Temps écoulé. Clarifiez d'abord ce process avant d'essayer de l'automatiser.
              </p>
            )}
          </div>
        </section>

        {/* Phase 1 — Détecter */}
        <section id="phase-1" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(38 92% 50%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(38 92% 96%)" }}>
              <Search size={18} style={{ color: "hsl(38 92% 50%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(38 92% 50%)" }}>Phase 1 — Détecter</p>
              <h2 className="text-xl font-bold text-foreground">Identifiez les tâches qui vous freinent</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5 leading-relaxed">
            Prenez 15 minutes. Listez tout ce qui revient chaque semaine et qui vous donne envie de procrastiner.
            Pas besoin d'être exhaustif — soyez honnête. Les meilleures automatisations naissent des tâches
            qu'on repousse toujours à demain.
          </p>
          <div className="callout-orange">
            <strong>Le meilleur signal ?</strong> Les tâches qui vous donnent la nausée rien qu'en y pensant.
            Si vous soupirez avant de commencer, c'est un candidat idéal.
          </div>
        </section>

        {/* Phase 2 — Évaluer */}
        <section id="phase-2" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(221 83% 53%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(214 100% 97%)" }}>
              <BarChart3 size={18} style={{ color: "hsl(221 83% 53%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(221 83% 53%)" }}>Phase 2 — Évaluer</p>
              <h2 className="text-xl font-bold text-foreground">Mesurez le vrai potentiel de chaque tâche</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5 leading-relaxed">
            Toutes les tâches pénibles ne méritent pas d'être automatisées. Cliquez sur chaque critère
            pour évaluer une de vos tâches :
          </p>
          <div className="space-y-2 mb-5">
            {CRITERES.map((c) => (
              <CritereRow key={c.key} crit={c} checked={!!critScores[c.key]} onToggle={() => toggleCrit(c.key)} />
            ))}
          </div>
          {totalCritScore > 0 && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: scoreLabel().bg, color: scoreLabel().color }}>
              Score : {totalCritScore}/5 — {scoreLabel().text}
            </div>
          )}
          <p className="text-xs text-foreground-muted mt-3">
            Notre app fait ce scoring automatiquement quand vous analysez votre métier.
          </p>
        </section>

        {/* Phase 3 — Concevoir */}
        <section id="phase-3" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(271 91% 55%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(271 91% 97%)" }}>
              <Wrench size={18} style={{ color: "hsl(271 55% 50%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(271 55% 50%)" }}>Phase 3 — Concevoir</p>
              <h2 className="text-xl font-bold text-foreground">Dessinez votre automatisation avant de la construire</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5 leading-relaxed">
            Avant d'ouvrir N8N, Make ou tout autre outil, remplissez ces 5 cases :
          </p>
          <div className="space-y-3 mb-5">
            {WORKFLOW_ITEMS.map((item) => {
              const { Icon } = item;
              return (
                <div key={item.label} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "hsl(271 91% 97%)" }}>
                    <Icon size={14} style={{ color: "hsl(271 55% 50%)" }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="label-uppercase text-[10px] mb-0.5" style={{ color: "hsl(271 55% 50%)" }}>{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.desc}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">Ex : {item.ex}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="callout-blue mb-3">
            <strong>Note pédagogique :</strong> Si vous ne pouvez pas remplir ces 5 cases, ce n'est pas un échec —
            c'est juste un process pas encore mûr. Passez à la tâche suivante et revenez-y plus tard.
          </div>
          <div className="callout-orange">
            <strong>Règle d'or :</strong> Commencez TOUJOURS sans IA. Si ça marche avec des règles simples (si X alors Y),
            c'est parfait. L'IA, on l'ajoute uniquement quand les données sont trop variables ou le texte trop libre.
          </div>
        </section>

        {/* Phase 4 — Lancer */}
        <section id="phase-4" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(160 72% 35%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(138 76% 97%)" }}>
              <Play size={18} style={{ color: "hsl(160 72% 35%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(160 72% 35%)" }}>Phase 4 — Lancer</p>
              <h2 className="text-xl font-bold text-foreground">Testez, ajustez, déployez</h2>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Le crash-test",
                body: "Avant de mettre en production, faites passer 10 cas à votre automatisation : des cas normaux, incomplets, bizarres, des doublons, des hors-sujets. Si 8 sur 10 passent, c'est très bien. Vous n'êtes pas Airbus — vous voulez gagner du temps maintenant.",
              },
              {
                title: "Le filet de sécurité",
                body: "Trois réflexes de pro : consultez les logs régulièrement, ajoutez une alerte en cas d'échec (email ou Slack), ayez un plan B si l'automatisation plante.",
              },
              {
                title: "Le déploiement progressif",
                body: "Lancez sur une semaine. Observez. Ajustez. Puis élargissez. Une automatisation réussie doit vous rendre un bénéfice clair — du temps, moins d'erreurs, plus de sérénité.",
              },
            ].map((s) => (
              <div key={s.title} className="p-4 rounded-xl border border-border bg-muted/20">
                <p className="text-sm font-semibold text-foreground mb-1.5">{s.title}</p>
                <p className="text-sm text-foreground-secondary leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 5 — Consolider */}
        <section id="phase-5" className="lecko-card p-8" style={{ borderLeft: "4px solid hsl(32 95% 42%)" }}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(48 100% 96%)" }}>
              <Award size={18} style={{ color: "hsl(32 95% 42%)" }} strokeWidth={2} />
            </div>
            <div>
              <p className="label-uppercase mb-1 text-[11px]" style={{ color: "hsl(32 95% 42%)" }}>Phase 5 — Consolider</p>
              <h2 className="text-xl font-bold text-foreground">Ancrez les gains et passez à la suivante</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5 leading-relaxed">
            Une automatisation qui tourne, c'est une victoire. Mais le vrai gain, c'est l'effet cumulé.
            Chaque tâche automatisée libère du temps et de l'énergie pour la suivante. C'est un cercle vertueux.
          </p>
          <p className="text-sm font-semibold text-foreground mb-3">Checklist finale</p>
          <div className="space-y-2 mb-5">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors text-left">
                {checklist[i]
                  ? <CheckSquare size={16} className="text-lecko-green shrink-0" />
                  : <Square size={16} className="text-foreground-muted shrink-0" />}
                <span className={`text-sm ${checklist[i] ? "line-through text-foreground-muted" : "text-foreground"}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
          {checklist.every(Boolean) && (
            <div className="p-4 rounded-xl border"
              style={{ backgroundColor: "hsl(138 76% 97%)", borderColor: "hsl(160 72% 35% / 0.3)" }}>
              <p className="text-sm font-semibold" style={{ color: "hsl(160 72% 30%)" }}>
                Tout est coché. Vous avez une automatisation solide. Passez à la suivante.
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-8 text-center" style={{ backgroundColor: "hsl(var(--surface-accent))" }}>
          <p className="label-uppercase mb-3 text-lecko-blue">Passer à la pratique</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Envie de passer de la théorie à la pratique ?
          </h2>
          <p className="text-foreground-secondary mb-7 max-w-md mx-auto leading-relaxed">
            Analysez votre métier et recevez un plan d'action personnalisé basé sur la méthode DÉCLIC.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
              style={{ backgroundColor: "hsl(var(--lecko-blue))" }}>
              Analyser mon métier
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => openChat()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm border-2 border-lecko-blue text-lecko-blue hover:bg-lecko-blue hover:text-white transition-all duration-200">
              Parler au Coach
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
