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
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => {
        const completed = i < step;
        const active = i === step;
        const Icon = STEP_ICONS[i];
        return (
          <div key={label} className="flex items-center">
            {/* connector line */}
            {i > 0 && (
              <div
                className={`h-0.5 w-8 sm:w-12 transition-colors ${
                  i <= step ? "bg-primary" : "bg-border"
                }`}
              />
            )}

            <div className="flex flex-col items-center gap-1.5">
              {/* dot */}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all text-sm font-semibold
                  ${
                    completed
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                        ? "bg-primary border-primary text-white"
                        : "bg-background border-border text-muted-foreground"
                  }`}
              >
                {completed ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {/* label */}
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  active
                    ? "text-primary"
                    : completed
                      ? "text-green-600"
                      : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
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
            {/* Metier */}
            <div>
              <label className={labelCls}>
                Votre m&eacute;tier <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                type="text"
                placeholder="Chef de projet, Comptable..."
                value={form.metier}
                onChange={(e) => update("metier", e.target.value)}
              />
            </div>

            {/* Org size */}
            <div>
              <label className={labelCls}>Taille de l'organisation</label>
              <select
                className={inputCls}
                value={form.orgSize}
                onChange={(e) => update("orgSize", e.target.value as OrgSize | "")}
              >
                <option value="">-- Choisir --</option>
                {(Object.entries(ORG_SIZE_LABELS) as [OrgSize, string][]).map(
                  ([key, lbl]) => (
                    <option key={key} value={key}>
                      {lbl}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className={labelCls}>Secteur</label>
              <select
                className={inputCls}
                value={form.sector}
                onChange={(e) => update("sector", e.target.value as Sector | "")}
              >
                <option value="">-- Choisir --</option>
                {(Object.entries(SECTOR_LABELS) as [Sector, string][]).map(
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
              <label className={labelCls}>Taille de votre &eacute;quipe</label>
              <input
                className={inputCls}
                type="number"
                min={1}
                placeholder="Ex : 5"
                value={form.teamSize}
                onChange={(e) => update("teamSize", e.target.value)}
              />
            </div>
          </div>
        );

      /* ── Step 1: Outils ─────────────────────────── */
      case 1:
        return (
          <div className="space-y-6">
            {/* Tool grid */}
            <div>
              <label className={labelCls}>Quels outils utilisez-vous ?</label>
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
            <div>
              <label className={labelCls}>
                D&eacute;crivez une journ&eacute;e type{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                className={textareaCls}
                rows={5}
                placeholder="Le matin, je commence par... Ensuite je..."
                value={form.taskDescription}
                onChange={(e) => update("taskDescription", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                Qu'est-ce qui vous frustre le plus ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Les tâches répétitives, les allers-retours..."
                value={form.painPoints}
                onChange={(e) => update("painPoints", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                Qu'est-ce qui prend trop de temps ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="La saisie de données, les rapports..."
                value={form.timeWasters}
                onChange={(e) => update("timeWasters", e.target.value)}
              />
            </div>

            {/* If enough text, show launch CTA instead of just next */}
            {canLaunch && (
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full h-12 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Lancer le diagnostic
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      }

      /* ── Step 3: Approfondir ────────────────────── */
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>
                Que souhaitez-vous automatiser en priorit&eacute; ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="La gestion des emails, la facturation..."
                value={form.priorities}
                onChange={(e) => update("priorities", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                Des contraintes techniques ou organisationnelles ?
              </label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Budget limité, restrictions IT, RGPD..."
                value={form.constraints}
                onChange={(e) => update("constraints", e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Vos objectifs</label>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Gagner du temps, réduire les erreurs, monter en compétence..."
                value={form.objectives}
                onChange={(e) => update("objectives", e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="w-full h-12 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Lancer le diagnostic
              <ChevronRight className="w-5 h-5" />
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
