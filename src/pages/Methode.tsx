import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckSquare, Square, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DECLIC_PHASES } from "@/types/declic";
import { useChatContext } from "@/context/ChatContext";

const CRITERES = [
  { key: "recurrence", icon: "🔁", label: "Récurrence", question: "Vous l'avez fait plus de 3 fois et vous allez le refaire ?" },
  { key: "energie", icon: "⚡", label: "Énergie", question: "Ça vous coûte un vrai morceau de temps ou d'énergie ?" },
  { key: "scalabilite", icon: "📈", label: "Scalabilité", question: "Si votre activité double, cette tâche explose ?" },
  { key: "fiabilite", icon: "⚠️", label: "Fiabilité", question: "L'humain oublie ou se trompe régulièrement dessus ?" },
  { key: "penibilite", icon: "😤", label: "Pénibilité", question: "C'est mentalement usant, ça grignote votre motivation ?" },
];

const CHECKLIST_ITEMS = [
  "La tâche a un score de 3+ sur les 5 critères ?",
  "Le croquis (déclencheur → sorties → exceptions) est clair ?",
  "On a d'abord essayé sans IA ?",
  "L'IA a été ajoutée uniquement là où elle fait une vraie différence ?",
  "Logs + alertes + exceptions sont prévus ?",
  "10 tests réels ont été faits ?",
  "Déploiement progressif validé ?",
];

function CritereCard({ crit, score, onChange }: { crit: typeof CRITERES[0]; score: number; onChange: () => void }) {
  const checked = score > 0;
  return (
    <button
      onClick={onChange}
      className={`flex flex-col gap-2 p-3 rounded-xl border-2 text-left transition-all ${
        checked ? "border-lecko-blue bg-lecko-blue/5" : "border-border bg-card hover:border-lecko-blue/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">{crit.icon}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${checked ? "bg-lecko-blue text-primary-foreground" : "bg-muted text-foreground-muted"}`}>
          {checked ? "1" : "0"}
        </span>
      </div>
      <p className="text-xs font-bold text-foreground">{crit.label}</p>
      <p className="text-[11px] text-foreground-secondary leading-snug">{crit.question}</p>
    </button>
  );
}

export default function Methode() {
  const [thirtySecText, setThirtySecText] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [critScores, setCritScores] = useState<Record<string, number>>({});
  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const { openChat } = useChatContext();

  const totalCritScore = Object.values(critScores).reduce((a, b) => a + b, 0);

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
    setCritScores((prev) => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
  };

  const toggleCheck = (i: number) => {
    setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));
  };

  const scoreLabel = () => {
    if (totalCritScore >= 3) return { text: "🟢 Priorité absolue — automatisez ça maintenant", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
    if (totalCritScore === 2) return { text: "🟡 Candidat intéressant — à creuser", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
    return { text: "🔴 Pas le bon levier — gardez votre énergie", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      {/* Hero */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="absolute top-6 right-6 w-10 h-10 rounded-lg opacity-70" style={{ backgroundColor: "hsl(var(--lecko-orange))" }} aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-lecko-orange/10 border border-lecko-orange/20 text-lecko-orange text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lecko-orange" />
            Méthodologie Lecko
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            La méthode <span className="text-lecko-orange">DÉCLIC</span> — 5 phases pour{" "}
            <span className="text-lecko-blue">automatiser intelligemment</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-foreground-secondary mb-12 max-w-2xl mx-auto">
            Pas de promesses magiques. Une approche structurée, concrète, et qui respecte une règle d'or : on n'automatise que ce qu'on comprend parfaitement.
          </motion.p>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 md:gap-0 md:flex-nowrap relative">
            {DECLIC_PHASES.map((phase, i) => (
              <div key={phase.id} className="flex items-center">
                <a href={`#phase-${phase.id}`}
                  className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl hover:bg-muted/60 transition-colors group w-28">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{phase.icon}</span>
                  <span className="text-xs font-bold" style={{ color: phase.color }}>{phase.shortLabel}</span>
                  <span className="text-[10px] text-foreground-muted text-center leading-tight">{phase.question}</span>
                </a>
                {i < DECLIC_PHASES.length - 1 && (
                  <div className="hidden md:block w-4 h-px bg-border mx-1" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-12">

        {/* Phase 0 — Prérequis */}
        <section id="phase-0" className="lecko-card p-8 border-l-4 border-[#6B7280]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🛡️</span>
            <div>
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Phase 0 — Prérequis</span>
              <h2 className="text-xl font-bold text-foreground">Avant toute chose : est-ce que votre process est clair ?</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-4">
            Si vous ne pouvez pas expliquer un process en 30 secondes à un collègue, il n'est pas prêt à être automatisé. L'automatisation est un amplificateur : elle amplifie l'efficacité d'un bon process, mais elle amplifie aussi le chaos d'un mauvais process. Commencez toujours par <strong>clarifier, simplifier, puis automatiser</strong>.
          </p>
          {/* 30-second test */}
          <div className="bg-muted/40 rounded-xl p-5 mt-4">
            <p className="text-sm font-bold text-foreground mb-3">⏱ Le test des 30 secondes</p>
            <p className="text-sm text-foreground-secondary mb-3">Pouvez-vous décrire votre process en une phrase ?</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                value={thirtySecText}
                onChange={(e) => { setThirtySecText(e.target.value); if (!timerStarted && e.target.value.length > 0) startTimer(); }}
                placeholder="Ex : Quand un formulaire est soumis, je l'envoie dans Notion et j'envoie un email..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-lecko-blue/40"
              />
              {timerStarted && !timerDone && (
                <div className="flex items-center justify-center w-14 h-10 rounded-xl bg-lecko-orange text-primary-foreground text-sm font-bold shrink-0">{timeLeft}s</div>
              )}
            </div>
            {timerDone && thirtySecText.trim() && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-semibold">
                ✅ Bien joué ! Si vous avez pu le décrire, ce process est probablement prêt à être automatisé.
              </p>
            )}
            {timerDone && !thirtySecText.trim() && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-semibold">
                ⚠️ Temps écoulé. Clarifiez d'abord ce process avant d'essayer de l'automatiser.
              </p>
            )}
          </div>
        </section>

        {/* Phase 1 — Détecter */}
        <section id="phase-1" className="lecko-card p-8 border-l-4 border-lecko-orange">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔍</span>
            <div>
              <span className="text-xs font-bold text-lecko-orange uppercase tracking-wider">Phase 1 — Détecter</span>
              <h2 className="text-xl font-bold text-foreground">Identifiez les tâches qui vous freinent</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-4">
            Prenez 15 minutes. Listez tout ce qui revient chaque semaine et qui vous donne envie de procrastiner. Pas besoin d'être exhaustif — soyez honnête. Les meilleures automatisations naissent des tâches qu'on repousse toujours à demain.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              💡 <strong>Le meilleur signal ?</strong> Les tâches qui vous donnent la nausée rien qu'en y pensant. Si vous soupirez avant de commencer, c'est un candidat idéal.
            </p>
          </div>
        </section>

        {/* Phase 2 — Évaluer */}
        <section id="phase-2" className="lecko-card p-8 border-l-4 border-lecko-blue">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚖️</span>
            <div>
              <span className="text-xs font-bold text-lecko-blue uppercase tracking-wider">Phase 2 — Évaluer</span>
              <h2 className="text-xl font-bold text-foreground">Mesurez le vrai potentiel de chaque tâche</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5">
            Toutes les tâches pénibles ne méritent pas d'être automatisées. Pour chaque tâche détectée, posez-vous 5 questions. Cliquez sur chaque critère pour évaluer votre tâche :
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            {CRITERES.map((c) => (
              <CritereCard key={c.key} crit={c} score={critScores[c.key] ?? 0} onChange={() => toggleCrit(c.key)} />
            ))}
          </div>
          {totalCritScore > 0 && (
            <div className={`px-4 py-3 rounded-xl text-sm font-bold ${scoreLabel().cls}`}>
              Score : {totalCritScore}/5 — {scoreLabel().text}
            </div>
          )}
          <div className="mt-4 text-sm text-foreground-secondary">
            <p className="text-xs text-foreground-muted mt-2">Notre app fait ce scoring automatiquement quand vous analysez votre métier. 👆 Testez l'interaction ci-dessus sur une de vos tâches.</p>
          </div>
        </section>

        {/* Phase 3 — Concevoir */}
        <section id="phase-3" className="lecko-card p-8 border-l-4 border-violet-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔧</span>
            <div>
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Phase 3 — Concevoir</span>
              <h2 className="text-xl font-bold text-foreground">Dessinez votre automatisation avant de la construire</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5">Chaque automatisation suit le même squelette. Avant d'ouvrir N8N, Make ou tout autre outil, remplissez ces 5 cases :</p>
          <div className="space-y-3 mb-5">
            {[
              { icon: "🎯", label: "DÉCLENCHEUR", desc: "Qu'est-ce qui démarre le process ?", ex: "\"Un email arrive\", \"Un formulaire est soumis\", \"Un paiement est reçu\"" },
              { icon: "📥", label: "ENTRÉES", desc: "Quelles infos arrivent ? D'où ? Format ?", ex: "\"Nom + email + montant depuis Stripe\"" },
              { icon: "🔀", label: "RÈGLES", desc: "Si ceci, alors cela (les cas simples)", ex: "\"Si montant > 500€ → notifier le commercial\"" },
              { icon: "📤", label: "SORTIES", desc: "Quel résultat ? Où ça atterrit ?", ex: "\"Fiche client créée dans le CRM + email de bienvenue envoyé\"" },
              { icon: "🚨", label: "EXCEPTIONS", desc: "Quand est-ce qu'un humain reprend la main ?", ex: "\"Si les données sont incomplètes → alerte Slack à l'équipe\"" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-violet-700 dark:text-violet-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.desc}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">Ex : {item.ex}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-3">
            <p className="text-sm text-foreground-secondary">
              <strong>💡 Note pédagogique :</strong> Si vous ne pouvez pas remplir ces 5 cases, ce n'est pas un échec — c'est juste un process pas encore mûr. Passez à la tâche suivante et revenez-y plus tard. L'objectif est d'enchaîner les succès.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>🔑 Règle d'or :</strong> Commencez TOUJOURS sans IA. Si ça marche avec des règles simples (si X alors Y), c'est parfait. L'IA, on l'ajoute uniquement quand les données sont trop variables, le texte est libre, ou les cas trop nombreux pour une logique rigide.
            </p>
          </div>
        </section>

        {/* Phase 4 — Lancer */}
        <section id="phase-4" className="lecko-card p-8 border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🚀</span>
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Phase 4 — Lancer</span>
              <h2 className="text-xl font-bold text-foreground">Testez, ajustez, déployez</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">🧪 Le crash-test</h3>
              <p className="text-sm text-foreground-secondary">Avant de mettre en production, faites passer <strong>10 cas</strong> à votre automatisation : des cas normaux, des cas incomplets, des cas bizarres, des doublons, des hors-sujets. Si 8 sur 10 passent, c'est déjà très bien. Vous n'êtes pas Airbus — vous voulez gagner du temps <em>maintenant</em>.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">🛡️ Le filet de sécurité</h3>
              <p className="text-sm text-foreground-secondary mb-2">Trois réflexes de pro :</p>
              <ul className="text-sm text-foreground-secondary space-y-1">
                <li>• Consultez les <strong>logs</strong> régulièrement (l'historique de vos automatisations)</li>
                <li>• Ajoutez une <strong>alerte en cas d'échec</strong> (un email ou un message Slack)</li>
                <li>• Ayez un <strong>plan B</strong> : si l'automatisation plante, qui fait quoi manuellement ?</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">📈 Le déploiement progressif</h3>
              <p className="text-sm text-foreground-secondary">Lancez sur une semaine. Observez. Ajustez. Puis élargissez. Une automatisation réussie doit vous rendre un bénéfice clair — du temps, moins d'erreurs, plus de sérénité. Sinon, elle retourne à l'atelier.</p>
            </div>
          </div>
        </section>

        {/* Phase 5 — Consolider */}
        <section id="phase-5" className="lecko-card p-8 border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Phase 5 — Consolider</span>
              <h2 className="text-xl font-bold text-foreground">Ancrez les gains et passez à la suivante</h2>
            </div>
          </div>
          <p className="text-foreground-secondary mb-5">Une automatisation qui tourne, c'est une victoire. Mais le vrai gain, c'est l'effet cumulé. Chaque tâche automatisée libère du temps et de l'énergie pour la suivante. C'est un cercle vertueux.</p>
          <p className="text-sm font-bold text-foreground mb-3">☑️ Checklist finale — Votre automatisation est-elle solide ?</p>
          <div className="space-y-2">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left">
                {checklist[i]
                  ? <CheckSquare size={18} className="text-emerald-500 shrink-0" />
                  : <Square size={18} className="text-foreground-muted shrink-0" />}
                <span className={`text-sm ${checklist[i] ? "line-through text-foreground-muted" : "text-foreground"}`}>{item}</span>
              </button>
            ))}
          </div>
          {checklist.every(Boolean) && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                🎉 Tout est coché ! Vous avez une automatisation solide. Passez à la suivante.
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="lecko-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Envie de passer de la théorie à la pratique ?
          </h2>
          <p className="text-foreground-secondary mb-6">
            Analysez votre métier et recevez un plan d'action personnalisé basé sur la méthode DÉCLIC.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-300">
              Analyser mon métier
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => openChat()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-lecko-blue text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground transition-all duration-300">
              Parler au Coach IA
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
