import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronRight,
  Loader2, FileText, Type, AlignLeft, List, CheckSquare, Hash, Sliders,
  Star, Copy, Eye, ToggleLeft, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getQuestionnaire,
  createQuestionnaire,
  updateQuestionnaire,
} from "@/lib/modulableDb";
import type {
  QuestionnaireTemplate,
  QuestionnaireSection,
  Question,
  QuestionType,
} from "@/types/modulable";

// ─── Question type config ────────────────────────────────────────────────────

const QUESTION_TYPES: {
  type: QuestionType;
  label: string;
  icon: typeof Type;
  description: string;
}[] = [
  { type: "text", label: "Texte court", icon: Type, description: "Réponse en une ligne" },
  { type: "textarea", label: "Texte long", icon: AlignLeft, description: "Réponse multi-lignes" },
  { type: "select", label: "Liste déroulante", icon: List, description: "Choix unique dans une liste" },
  { type: "multiselect", label: "Multi-sélection", icon: CheckSquare, description: "Choix multiples" },
  { type: "radio", label: "Choix unique", icon: List, description: "Boutons radio" },
  { type: "checkbox", label: "Cases à cocher", icon: CheckSquare, description: "Plusieurs cases" },
  { type: "number", label: "Nombre", icon: Hash, description: "Valeur numérique" },
  { type: "slider", label: "Curseur", icon: Sliders, description: "Échelle glissante" },
  { type: "rating", label: "Notation", icon: Star, description: "Étoiles ou score" },
];

const QUESTION_TYPE_MAP = Object.fromEntries(QUESTION_TYPES.map((q) => [q.type, q]));

const NEEDS_OPTIONS: QuestionType[] = ["select", "multiselect", "radio", "checkbox"];
const NEEDS_RANGE: QuestionType[] = ["number", "slider", "rating"];

function generateId(): string {
  return crypto.randomUUID();
}

function newQuestion(): Question {
  return {
    id: generateId(),
    type: "text",
    label: "",
    description: "",
    obligatoire: false,
    placeholder: "",
  };
}

function newSection(): QuestionnaireSection {
  return {
    id: generateId(),
    titre: "",
    description: "",
    questions: [newQuestion()],
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function QuestionnaireEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "nouveau";

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sections, setSections] = useState<QuestionnaireSection[]>([newSection()]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState<string | null>(null);

  // ── Load existing template ──
  useEffect(() => {
    if (isNew) {
      // Expand first section by default
      setSections((prev) => {
        setExpandedSections(new Set([prev[0].id]));
        return prev;
      });
      return;
    }
    (async () => {
      try {
        const data = await getQuestionnaire(id!);
        setNom(data.nom);
        setDescription(data.description ?? "");
        setIsPublic(data.is_public);
        setSections(data.sections.length > 0 ? data.sections : [newSection()]);
        // Expand all sections on load
        setExpandedSections(new Set(data.sections.map((s) => s.id)));
      } catch {
        setError("Questionnaire introuvable");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  // ── Track changes ──
  const markChanged = useCallback(() => setHasChanges(true), []);

  // ── Save ──
  async function handleSave() {
    if (!nom.trim()) {
      setError("Le nom du questionnaire est requis");
      return;
    }
    // Validate sections
    for (const s of sections) {
      if (!s.titre.trim()) {
        setError("Chaque section doit avoir un titre");
        return;
      }
      for (const q of s.questions) {
        if (!q.label.trim()) {
          setError(`La question dans "${s.titre}" doit avoir un libellé`);
          return;
        }
        if (NEEDS_OPTIONS.includes(q.type) && (!q.options || q.options.length < 2)) {
          setError(`La question "${q.label}" nécessite au moins 2 options`);
          return;
        }
      }
    }

    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createQuestionnaire({
          nom: nom.trim(),
          description: description.trim() || null,
          sections,
          is_public: isPublic,
        });
        navigate(`/bibliotheque/questionnaire/${created.id}`, { replace: true });
      } else {
        await updateQuestionnaire(id!, {
          nom: nom.trim(),
          description: description.trim() || null,
          sections,
          is_public: isPublic,
        });
      }
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  // ── Section helpers ──
  function updateSection(sectionId: string, patch: Partial<QuestionnaireSection>) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s))
    );
    markChanged();
  }

  function addSection() {
    const s = newSection();
    setSections((prev) => [...prev, s]);
    setExpandedSections((prev) => new Set([...prev, s.id]));
    markChanged();
  }

  function removeSection(sectionId: string) {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    markChanged();
  }

  function duplicateSection(section: QuestionnaireSection) {
    const copy: QuestionnaireSection = {
      ...section,
      id: generateId(),
      titre: `${section.titre} (copie)`,
      questions: section.questions.map((q) => ({ ...q, id: generateId() })),
    };
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === section.id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setExpandedSections((prev) => new Set([...prev, copy.id]));
    markChanged();
  }

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  // ── Question helpers ──
  function updateQuestion(sectionId: string, questionId: string, patch: Partial<Question>) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...patch } : q
              ),
            }
          : s
      )
    );
    markChanged();
  }

  function addQuestion(sectionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion()] }
          : s
      )
    );
    markChanged();
  }

  function removeQuestion(sectionId: string, questionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
          : s
      )
    );
    markChanged();
  }

  function reorderQuestions(sectionId: string, newOrder: Question[]) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, questions: newOrder } : s))
    );
    markChanged();
  }

  // ── Option helpers ──
  function addOption(sectionId: string, questionId: string) {
    updateQuestion(sectionId, questionId, {
      options: [
        ...(sections
          .find((s) => s.id === sectionId)
          ?.questions.find((q) => q.id === questionId)?.options ?? []),
        "",
      ],
    });
  }

  function updateOption(sectionId: string, questionId: string, index: number, value: string) {
    const question = sections
      .find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === questionId);
    if (!question) return;
    const opts = [...(question.options ?? [])];
    opts[index] = value;
    updateQuestion(sectionId, questionId, { options: opts });
  }

  function removeOption(sectionId: string, questionId: string, index: number) {
    const question = sections
      .find((s) => s.id === sectionId)
      ?.questions.find((q) => q.id === questionId);
    if (!question) return;
    const opts = [...(question.options ?? [])];
    opts.splice(index, 1);
    updateQuestion(sectionId, questionId, { options: opts });
  }

  // ── Loading / Error states ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mission-surface">
        <Loader2 size={24} className="animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error === "Questionnaire introuvable") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mission-surface">
        <AlertCircle size={32} className="text-red-400 mb-3" />
        <p className="text-foreground font-semibold mb-1">Questionnaire introuvable</p>
        <button
          onClick={() => navigate("/bibliotheque")}
          className="text-sm text-brand-blue hover:underline mt-2"
        >
          Retour à la bibliothèque
        </button>
      </div>
    );
  }

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="min-h-screen bg-mission-surface font-consultant">
      {/* ── Top bar ── */}
      <div className="sticky top-14 z-30 bg-white border-b border-mission-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate("/bibliotheque")}
            className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Bibliothèque
          </button>

          <div className="flex-1" />

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-foreground-muted">
            <span>{sections.length} section{sections.length > 1 ? "s" : ""}</span>
            <span>{totalQuestions} question{totalQuestions > 1 ? "s" : ""}</span>
          </div>

          {/* Preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
              showPreview
                ? "bg-brand-blue/10 text-brand-blue font-medium"
                : "text-foreground-muted hover:bg-slate-100"
            )}
          >
            <Eye size={14} strokeWidth={1.5} />
            Aperçu
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all",
              hasChanges
                ? "bg-brand-blue text-white hover:bg-blue-600 shadow-sm"
                : "bg-slate-100 text-foreground-muted"
            )}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} strokeWidth={1.5} />
            )}
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ── Error banner ── */}
        <AnimatePresence>
          {error && error !== "Questionnaire introuvable" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm
                         flex items-center gap-2"
            >
              <AlertCircle size={15} />
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showPreview ? (
          /* ── PREVIEW MODE ── */
          <PreviewMode nom={nom} description={description} sections={sections} />
        ) : (
          /* ── EDIT MODE ── */
          <>
            {/* ── Meta fields ── */}
            <div className="bg-white border border-mission-border rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-foreground-muted block mb-1.5">
                    Nom du questionnaire *
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); markChanged(); }}
                    placeholder="Ex : Diagnostic maturité IA"
                    className="w-full h-11 px-4 bg-white border border-mission-border rounded-xl
                               text-sm text-foreground placeholder:text-foreground-muted/50
                               outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-foreground-muted block mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); markChanged(); }}
                    placeholder="Courte description du template..."
                    className="w-full h-11 px-4 bg-white border border-mission-border rounded-xl
                               text-sm text-foreground placeholder:text-foreground-muted/50
                               outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
              </div>

              {/* Public toggle */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-mission-border">
                <button
                  onClick={() => { setIsPublic(!isPublic); markChanged(); }}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors",
                    isPublic ? "bg-brand-blue" : "bg-slate-200"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                      isPublic ? "left-5.5 translate-x-0" : "left-0.5"
                    )}
                    style={{ left: isPublic ? "22px" : "2px" }}
                  />
                </button>
                <span className="text-sm text-foreground-muted">
                  Visible par tous les consultants
                </span>
              </div>
            </div>

            {/* ── Sections ── */}
            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <motion.div
                  key={section.id}
                  layout
                  className="bg-white border border-mission-border rounded-2xl overflow-hidden"
                >
                  {/* Section header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronDown size={16} className="text-foreground-muted" />
                    ) : (
                      <ChevronRight size={16} className="text-foreground-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={section.titre}
                        onChange={(e) => updateSection(section.id, { titre: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={`Section ${sIdx + 1}`}
                        className="w-full bg-transparent text-foreground font-semibold text-sm
                                   outline-none placeholder:text-foreground-muted/40"
                      />
                      <input
                        type="text"
                        value={section.description ?? ""}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Description de la section (optionnel)"
                        className="w-full bg-transparent text-foreground-muted text-xs mt-0.5
                                   outline-none placeholder:text-foreground-muted/30"
                      />
                    </div>

                    <span className="text-[10px] font-mono text-foreground-muted px-2 py-0.5
                                     bg-slate-100 rounded-full">
                      {section.questions.length} q.
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateSection(section); }}
                        className="p-1.5 rounded-lg text-foreground-muted hover:bg-slate-100 transition-colors"
                        title="Dupliquer la section"
                      >
                        <Copy size={14} strokeWidth={1.5} />
                      </button>
                      {sections.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                          className="p-1.5 rounded-lg text-foreground-muted hover:text-red-500
                                     hover:bg-red-50 transition-colors"
                          title="Supprimer la section"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section body */}
                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-mission-border">
                          {/* Questions */}
                          <Reorder.Group
                            axis="y"
                            values={section.questions}
                            onReorder={(newOrder) => reorderQuestions(section.id, newOrder)}
                            className="space-y-3 pt-4"
                          >
                            {section.questions.map((question, qIdx) => (
                              <Reorder.Item
                                key={question.id}
                                value={question}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                              >
                                <QuestionEditor
                                  question={question}
                                  index={qIdx}
                                  sectionId={section.id}
                                  showTypeSelector={showTypeSelector}
                                  setShowTypeSelector={setShowTypeSelector}
                                  updateQuestion={updateQuestion}
                                  removeQuestion={removeQuestion}
                                  addOption={addOption}
                                  updateOption={updateOption}
                                  removeOption={removeOption}
                                  canDelete={section.questions.length > 1}
                                />
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>

                          {/* Add question */}
                          <button
                            onClick={() => addQuestion(section.id)}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5
                                       rounded-xl border border-dashed border-slate-300 text-sm
                                       text-foreground-muted hover:text-brand-blue hover:border-brand-blue/40
                                       transition-all"
                          >
                            <Plus size={14} />
                            Ajouter une question
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Add section */}
            <button
              onClick={addSection}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5
                         rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium
                         text-foreground-muted hover:text-brand-blue hover:border-brand-blue/30
                         transition-all"
            >
              <Plus size={16} />
              Ajouter une section
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Question Editor Component ──────────────────────────────────────────────

function QuestionEditor({
  question,
  index,
  sectionId,
  showTypeSelector,
  setShowTypeSelector,
  updateQuestion,
  removeQuestion,
  addOption,
  updateOption,
  removeOption,
  canDelete,
}: {
  question: Question;
  index: number;
  sectionId: string;
  showTypeSelector: string | null;
  setShowTypeSelector: (id: string | null) => void;
  updateQuestion: (sId: string, qId: string, patch: Partial<Question>) => void;
  removeQuestion: (sId: string, qId: string) => void;
  addOption: (sId: string, qId: string) => void;
  updateOption: (sId: string, qId: string, idx: number, val: string) => void;
  removeOption: (sId: string, qId: string, idx: number) => void;
  canDelete: boolean;
}) {
  const typeConfig = QUESTION_TYPE_MAP[question.type];
  const TypeIcon = typeConfig?.icon ?? Type;

  return (
    <div>
      {/* Top row: drag + label + type + actions */}
      <div className="flex items-start gap-2">
        <div className="pt-2.5 cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical size={14} />
        </div>

        <div className="flex-1 space-y-2">
          {/* Label */}
          <input
            type="text"
            value={question.label}
            onChange={(e) => updateQuestion(sectionId, question.id, { label: e.target.value })}
            placeholder={`Question ${index + 1}`}
            className="w-full bg-transparent text-foreground text-sm font-medium
                       outline-none placeholder:text-foreground-muted/40"
          />

          {/* Description */}
          <input
            type="text"
            value={question.description ?? ""}
            onChange={(e) =>
              updateQuestion(sectionId, question.id, { description: e.target.value })
            }
            placeholder="Aide ou consigne (optionnel)"
            className="w-full bg-transparent text-foreground-muted text-xs
                       outline-none placeholder:text-foreground-muted/30"
          />
        </div>

        {/* Type selector */}
        <div className="relative">
          <button
            onClick={() =>
              setShowTypeSelector(showTypeSelector === question.id ? null : question.id)
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border
                       border-slate-200 text-xs text-foreground-muted hover:border-brand-blue
                       transition-colors"
          >
            <TypeIcon size={12} strokeWidth={1.5} />
            {typeConfig?.label ?? question.type}
            <ChevronDown size={10} />
          </button>

          {showTypeSelector === question.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowTypeSelector(null)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-mission-border
                              rounded-xl shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
                {QUESTION_TYPES.map((qt) => (
                  <button
                    key={qt.type}
                    onClick={() => {
                      const patch: Partial<Question> = { type: qt.type };
                      if (NEEDS_OPTIONS.includes(qt.type) && !question.options?.length) {
                        patch.options = ["Option 1", "Option 2"];
                      }
                      if (NEEDS_RANGE.includes(qt.type)) {
                        patch.min = question.min ?? 0;
                        patch.max = question.max ?? (qt.type === "rating" ? 5 : 100);
                      }
                      updateQuestion(sectionId, question.id, patch);
                      setShowTypeSelector(null);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors",
                      question.type === qt.type
                        ? "bg-brand-blue/5 text-brand-blue"
                        : "text-foreground hover:bg-slate-50"
                    )}
                  >
                    <qt.icon size={14} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-medium">{qt.label}</p>
                      <p className="text-[10px] text-foreground-muted">{qt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Obligatoire toggle */}
        <button
          onClick={() =>
            updateQuestion(sectionId, question.id, { obligatoire: !question.obligatoire })
          }
          className={cn(
            "p-1.5 rounded-lg transition-colors text-xs",
            question.obligatoire
              ? "bg-red-50 text-red-500"
              : "text-slate-300 hover:text-slate-500"
          )}
          title={question.obligatoire ? "Obligatoire" : "Optionnel"}
        >
          <span className="text-[10px] font-bold">*</span>
        </button>

        {/* Delete */}
        {canDelete && (
          <button
            onClick={() => removeQuestion(sectionId, question.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500
                       hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* ── Options for select/multiselect/radio/checkbox ── */}
      {NEEDS_OPTIONS.includes(question.type) && (
        <div className="mt-3 ml-6 space-y-1.5">
          {(question.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] text-foreground-muted font-mono w-4 text-right">
                {i + 1}
              </span>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(sectionId, question.id, i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 h-8 px-3 bg-white border border-slate-200 rounded-lg text-xs
                           text-foreground outline-none focus:border-brand-blue transition-colors"
              />
              {(question.options?.length ?? 0) > 2 && (
                <button
                  onClick={() => removeOption(sectionId, question.id, i)}
                  className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addOption(sectionId, question.id)}
            className="text-xs text-brand-blue hover:underline ml-6"
          >
            + Ajouter une option
          </button>
        </div>
      )}

      {/* ── Range for number/slider/rating ── */}
      {NEEDS_RANGE.includes(question.type) && (
        <div className="mt-3 ml-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono text-foreground-muted">Min</label>
            <input
              type="number"
              value={question.min ?? 0}
              onChange={(e) =>
                updateQuestion(sectionId, question.id, { min: Number(e.target.value) })
              }
              className="w-16 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs
                         text-foreground text-center outline-none focus:border-brand-blue"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono text-foreground-muted">Max</label>
            <input
              type="number"
              value={question.max ?? 100}
              onChange={(e) =>
                updateQuestion(sectionId, question.id, { max: Number(e.target.value) })
              }
              className="w-16 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs
                         text-foreground text-center outline-none focus:border-brand-blue"
            />
          </div>
          {question.type !== "rating" && (
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono text-foreground-muted">Placeholder</label>
              <input
                type="text"
                value={question.placeholder ?? ""}
                onChange={(e) =>
                  updateQuestion(sectionId, question.id, { placeholder: e.target.value })
                }
                placeholder="Ex: 0"
                className="w-24 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs
                           text-foreground outline-none focus:border-brand-blue"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Placeholder for text types ── */}
      {(question.type === "text" || question.type === "textarea") && (
        <div className="mt-2 ml-6">
          <input
            type="text"
            value={question.placeholder ?? ""}
            onChange={(e) =>
              updateQuestion(sectionId, question.id, { placeholder: e.target.value })
            }
            placeholder="Placeholder (optionnel)"
            className="w-full h-8 px-3 bg-white border border-slate-200 rounded-lg text-xs
                       text-foreground-muted outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      )}
    </div>
  );
}

// ─── Preview Mode ───────────────────────────────────────────────────────────

function PreviewMode({
  nom,
  description,
  sections,
}: {
  nom: string;
  description: string;
  sections: QuestionnaireSection[];
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-mission-border rounded-2xl p-8 mb-6">
        <h2 className="text-xl font-consultant font-bold text-foreground mb-1">
          {nom || "Sans titre"}
        </h2>
        {description && (
          <p className="text-sm text-foreground-muted">{description}</p>
        )}
      </div>

      {sections.map((section, sIdx) => (
        <div key={section.id} className="bg-white border border-mission-border rounded-2xl p-6 mb-4">
          <h3 className="font-consultant font-semibold text-foreground mb-1">
            {section.titre || `Section ${sIdx + 1}`}
          </h3>
          {section.description && (
            <p className="text-xs text-foreground-muted mb-4">{section.description}</p>
          )}

          <div className="space-y-5">
            {section.questions.map((q, qIdx) => (
              <div key={q.id}>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  {q.label || `Question ${qIdx + 1}`}
                  {q.obligatoire && <span className="text-red-500 ml-1">*</span>}
                </label>
                {q.description && (
                  <p className="text-xs text-foreground-muted mb-2">{q.description}</p>
                )}

                {/* Render preview input */}
                {q.type === "text" && (
                  <input
                    type="text"
                    disabled
                    placeholder={q.placeholder || "Votre réponse..."}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                )}
                {q.type === "textarea" && (
                  <textarea
                    disabled
                    placeholder={q.placeholder || "Votre réponse..."}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none"
                  />
                )}
                {q.type === "select" && (
                  <select disabled className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <option>Sélectionner...</option>
                    {q.options?.map((o, i) => <option key={i}>{o}</option>)}
                  </select>
                )}
                {(q.type === "radio" || q.type === "checkbox") && (
                  <div className="space-y-2">
                    {q.options?.map((o, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type={q.type === "radio" ? "radio" : "checkbox"}
                          disabled
                          name={q.id}
                          className="accent-brand-blue"
                        />
                        {o || `Option ${i + 1}`}
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "multiselect" && (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((o, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
                        {o || `Option ${i + 1}`}
                      </span>
                    ))}
                  </div>
                )}
                {q.type === "number" && (
                  <input
                    type="number"
                    disabled
                    placeholder={q.placeholder || "0"}
                    min={q.min}
                    max={q.max}
                    className="w-32 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                )}
                {q.type === "slider" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground-muted font-mono">{q.min ?? 0}</span>
                    <input
                      type="range"
                      disabled
                      min={q.min ?? 0}
                      max={q.max ?? 100}
                      className="flex-1 accent-brand-blue"
                    />
                    <span className="text-xs text-foreground-muted font-mono">{q.max ?? 100}</span>
                  </div>
                )}
                {q.type === "rating" && (
                  <div className="flex gap-1">
                    {Array.from({ length: q.max ?? 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className="text-slate-200"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
