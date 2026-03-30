import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Wrench,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  DiagnosticFormData,
  EMPTY_FORM,
  STEP_LABELS,
  ORG_SIZE_LABELS,
  SECTOR_LABELS,
  TOOL_OPTIONS,
  AUTOMATION_EXPERIENCE_OPTIONS,
  CONTRAINTE_LABELS,
  OrgSize,
  Sector,
  ToolId,
  AutomationExperience,
  ContrainteIT,
} from "@/types/diagnostic";

/* ── animation variants ─────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const STEP_ICONS = [Search, Wrench, Clock, Target];

/* ── component ──────────────────────────────────────────── */
export default function DiagnosticForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<DiagnosticFormData>(EMPTY_FORM);

  const update = useCallback(
    <K extends keyof DiagnosticFormData>(field: K, value: DiagnosticFormData[K]) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  /* navigation helpers */
  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  /* submit */
  const handleLaunch = () => {
    sessionStorage.setItem("declic-diagnostic-form", JSON.stringify(form));
    navigate(
      `/resultats?metier=${encodeURIComponent(form.metier)}&mode=personnalise`,
    );
  };

  /* tool toggle */
  const toggleTool = (id: ToolId) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.includes(id)
        ? prev.tools.filter((t) => t !== id)
        : [...prev.tools, id],
    }));
  };

  /* ── step indicator ─────────────────────────────────── */
  const StepIndicator = () => (
    <div className="mb-10">
      {/* Barre de progression */}
      <div className="relative h-1 bg-border rounded-full mb-4">
        <div
          className="absolute h-full bg-lecko-blue rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
        />
      </div>
      {/* Labels des étapes */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-mono transition-colors ${
              i === step
                ? "text-lecko-blue font-medium"
                : i < step
                  ? "text-foreground-muted"
                  : "text-foreground-muted/40"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );

  /* ── shared input classes ────────────────────────────── */
  const inputCls =
    "w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:border-primary transition-colors";
  const textareaCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";

  /* ── step content ───────────────────────────────────── */
  const renderStep = () => {
    switch (step) {
      /* ── Step 0: Contexte ───────────────────────── */
      case 0:
        return (
          <div className="space-y-5">
            <p className="text-sm text-foreground-muted">
              Ces informations permettent de personnaliser le diagnostic a votre situation reelle.
            </p>

            {/* Metier */}
            <div>
              <label className={labelCls}>
                Quel est votre metier ou poste actuel ? <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                type="text"
                placeholder="Ex : Chef de projet IT, Responsable RH, Comptable fournisseurs..."
                value={form.metier}
                onChange={(e) => update("metier", e.target.value)}
              />
              <p className="text-xs text-foreground-muted mt-1">Soyez precis : "Chef de projet IT" est mieux que "Chef de projet"</p>
            </div>

            {/* Sector */}
            <div>
              <label className={labelCls}>Dans quel secteur travaillez-vous ?</label>
              <select
                className={inputCls}
                value={form.sector}
                onChange={(e) => update("sector", e.target.value as Sector | "")}
              >
                <option value="">Selectionnez votre secteur</option>
                {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(
                  ([key, lbl]) => (
                    <option key={key} value={key}>
                      {lbl}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Org size */}
            <div>
              <label className={labelCls}>Combien de personnes dans votre organisation ?</label>
              <select
                className={inputCls}
                value={form.orgSize}
                onChange={(e) => update("orgSize", e.target.value as OrgSize | "")}
              >
                <option value="">Selectionnez une taille</option>
                {(Object.entries(ORG_SIZE_LABELS) as [OrgSize, string][]).map(
                  ([key, lbl]) => (
                    <option key={key} value={key}>
                      {lbl}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Team size */}
            <div>
              <label className={labelCls}>Combien de personnes dans votre equipe directe ?</label>
              <input
                className={inputCls}
                type="number"
                min={1}
                placeholder="Ex : 5"
                value={form.teamSize}
                onChange={(e) => update("teamSize", e.target.value)}
              />
              <p className="text-xs text-foreground-muted mt-1">Les personnes qui font le meme type de travail que vous</p>
            </div>
          </div>
        );

      /* ── Step 1: Outils ─────────────────────────── */
      case 1:
        return (
          <div className="space-y-6">
            {/* Tool grid */}
            <div>
              <label className={labelCls}>Quels outils utilisez-vous au quotidien ?</label>
              <p className="text-xs text-foreground-muted mb-3">Selectionnez tous ceux que vous utilisez, meme occasionnellement. Cela permet de recommander des automatisations compatibles.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TOOL_OPTIONS.map((opt) => {
                  const selected = form.tools.includes(opt.id);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => toggleTool(opt.id)}
                      className={`lecko-card p-3 text-left text-sm font-medium border-2 transition-all cursor-pointer
                        ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:border-border"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded border-2 text-xs transition-colors
                            ${
                              selected
                                ? "border-primary bg-primary text-white"
                                : "border-border"
                            }`}
                        >
                          {selected && "✓"}
                        </span>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other tools text */}
            {form.tools.includes("other") && (
              <div>
                <label className={labelCls}>Pr&eacute;cisez vos autres outils</label>
                <input
                  className={inputCls}
                  type="text"
                  placeholder="Ex : Monday.com, Airtable..."
                  value={form.otherTools}
                  onChange={(e) => update("otherTools", e.target.value)}
                />
              </div>
            )}

            {/* Automation experience */}
            <div>
              <label className={labelCls}>
                Votre exp&eacute;rience avec l'automatisation
              </label>
              <div className="space-y-2">
                {AUTOMATION_EXPERIENCE_OPTIONS.map((opt) => {
                  const selected = form.automationExperience === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() =>
                        update("automationExperience", opt.id as AutomationExperience)
                      }
                      className={`lecko-card w-full p-3 text-left text-sm font-medium border-2 transition-all cursor-pointer
                        ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:border-border"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors
                            ${
                              selected
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                        >
                          {selected && (
                            <span className="block w-2 h-2 rounded-full bg-white" />
                          )}
                        </span>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* IT Constraints */}
            <div>
              <label className={labelCls}>
                Votre organisation a-t-elle des contraintes techniques ?
              </label>
              <p className="text-xs text-foreground-muted mb-3">
                Cela nous permet de ne recommander que des solutions réellement déployables chez vous.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.entries(CONTRAINTE_LABELS) as [ContrainteIT, typeof CONTRAINTE_LABELS[ContrainteIT]][]).map(([id, conf]) => {
                  const isAucune = id === "aucune";
                  const selected = isAucune
                    ? form.contraintesIT.includes("aucune")
                    : form.contraintesIT.includes(id);
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => {
                        if (isAucune) {
                          update("contraintesIT", ["aucune"]);
                        } else {
                          const without = form.contraintesIT.filter(c => c !== "aucune" && c !== id);
                          update("contraintesIT", selected ? without : [...without, id]);
                        }
                      }}
                      className={`lecko-card p-3 text-left border-2 transition-all cursor-pointer ${
                        selected ? "border-primary bg-primary/5" : "border-transparent hover:border-border"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{conf.label}</p>
                      <p className="text-[11px] text-foreground-muted mt-0.5">{conf.detail}</p>
                    </button>
                  );
                })}
              </div>
              {form.contraintesIT.includes("aucune") && (
                <p className="text-xs text-gr33t-600 dark:text-gr33t-400 mt-2">Toutes les solutions sont envisageables.</p>
              )}
              {form.contraintesIT.length > 0 && !form.contraintesIT.includes("aucune") && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Les recommandations seront adaptées à ces contraintes.</p>
              )}
            </div>
          </div>
        );

      /* ── Step 2: Quotidien ──────────────────────── */
      case 2: {
        const canLaunch = form.taskDescription.trim().length >= 20;
        return (
          <div className="space-y-5">
            <p className="text-sm text-foreground-muted">
              C'est l'etape la plus importante. Plus vous etes precis, plus le diagnostic sera pertinent.
            </p>

            <div>
              <label className={labelCls}>
                Decrivez vos taches principales au quotidien{" "}
                <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-foreground-muted mb-2">
                Listez ce que vous faites chaque jour ou chaque semaine. Pas besoin d'etre formel — ecrivez comme vous parlez.
              </p>
              <textarea
                className={textareaCls}
                rows={6}
                placeholder={"Exemples :\n- Je redige des comptes-rendus apres chaque reunion\n- Je mets a jour un fichier Excel de suivi chaque vendredi\n- Je reponds aux memes questions par email 5 fois par jour\n- Je compile des chiffres de 3 outils differents pour le reporting"}
                value={form.taskDescription}
                onChange={(e) => update("taskDescription", e.target.value)}
              />
              <p className="text-xs text-foreground-muted mt-1">{form.taskDescription.length} caracteres — minimum 20 pour un diagnostic precis</p>
            </div>

            <div>
              <label className={labelCls}>
                Quelles taches vous pesent le plus ?
              </label>
              <p className="text-xs text-foreground-muted mb-2">
                Les taches repetitives, ennuyeuses, ou qui vous donnent l'impression de perdre votre temps.
              </p>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Ex : Relancer les gens pour obtenir des infos, copier-coller entre outils, verifier manuellement des donnees..."
                value={form.painPoints}
                onChange={(e) => update("painPoints", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                Qu'est-ce qui prend beaucoup trop de temps par rapport a sa valeur ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Ex : Le reporting hebdomadaire (2h pour un document que personne ne lit en entier)..."
                value={form.timeWasters}
                onChange={(e) => update("timeWasters", e.target.value)}
              />
            </div>

            {/* If enough text, show launch CTA instead of just next */}
            {canLaunch && (
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full h-14 rounded-2xl bg-lecko-blue text-white font-semibold text-base flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-lecko-blue/20 hover:shadow-xl hover:shadow-lecko-blue/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles size={18} strokeWidth={1.5} />
                Lancer l'analyse personnalisée
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
        );
      }

      /* ── Step 3: Approfondir ────────────────────── */
      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-foreground-muted">
              Ces informations sont optionnelles mais permettent d'affiner les recommandations.
            </p>

            <div>
              <label className={labelCls}>
                Si vous pouviez automatiser UNE seule chose demain, ce serait quoi ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Ex : Le reporting hebdomadaire — ca me prend 2h chaque vendredi et c'est toujours la meme chose."
                value={form.priorities}
                onChange={(e) => update("priorities", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                Y a-t-il des contraintes dont on devrait tenir compte ?
              </label>
              <p className="text-xs text-foreground-muted mb-2">
                Budget, restrictions de votre DSI, donnees sensibles, resistance au changement dans l'equipe...
              </p>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Ex : Mon responsable est sceptique sur l'IA, on a un budget quasi nul, les donnees sont confidentielles..."
                value={form.constraints}
                onChange={(e) => update("constraints", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Qu'attendez-vous de ce diagnostic ?</label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Ex : Identifier 2-3 gains rapides pour convaincre ma direction, avoir un plan d'action concret..."
                value={form.objectives}
                onChange={(e) => update("objectives", e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="w-full h-14 rounded-2xl bg-lecko-blue text-white font-semibold text-base flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-lecko-blue/20 hover:shadow-xl hover:shadow-lecko-blue/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles size={18} strokeWidth={1.5} />
              Lancer l'analyse personnalisée
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  /* can advance? */
  const canNext =
    step === 0 ? form.metier.trim().length > 0 : true;

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        <StepIndicator />

        <div className="lecko-card p-6 sm:p-8">
          {/* Step title */}
          <h2 className="text-xl font-bold mb-6">
            {STEP_LABELS[step]}
          </h2>

          {/* Animated step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={goPrev}
                className="h-11 px-6 rounded-full border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Pr&eacute;c&eacute;dent
              </button>
            ) : (
              <span />
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className="h-11 px-6 rounded-full bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
