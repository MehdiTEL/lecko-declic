import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library, Plus, FileText, Trash2, Copy, Search,
  MoreHorizontal, Loader2, Calendar, Layers,
} from "lucide-react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import { cn } from "@/lib/utils";
import {
  getQuestionnaires,
  deleteQuestionnaire,
  createQuestionnaire,
} from "@/lib/modulableDb";
import type { QuestionnaireTemplate } from "@/types/modulable";

export default function Bibliotheque() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await getQuestionnaires();
      setTemplates(data);
    } catch (err) {
      console.error("Erreur chargement questionnaires:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteQuestionnaire(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
    } finally {
      setDeleting(null);
      setMenuOpen(null);
    }
  }

  async function handleDuplicate(template: QuestionnaireTemplate) {
    try {
      const copy = await createQuestionnaire({
        nom: `${template.nom} (copie)`,
        description: template.description,
        sections: template.sections,
        is_public: false,
      });
      setTemplates((prev) => [copy, ...prev]);
      setMenuOpen(null);
    } catch (err) {
      console.error("Erreur duplication:", err);
    }
  }

  const filtered = templates.filter((t) =>
    t.nom.toLowerCase().includes(search.toLowerCase()) ||
    (t.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalQuestions = (t: QuestionnaireTemplate) =>
    t.sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <ConsultantLayout activeSection="bibliotheque">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-mission-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest mb-1">
              Espace consultant
            </p>
            <h1
              className="text-2xl font-consultant font-bold text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ma bibliothèque
            </h1>
          </div>
          <button
            onClick={() => navigate("/bibliotheque/questionnaire/nouveau")}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-lecko-blue text-white
                       text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm"
          >
            <Plus size={15} />
            Nouveau questionnaire
          </button>
        </div>

        {/* Search */}
        {templates.length > 0 && (
          <div className="relative mt-5 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un template..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-mission-border rounded-xl
                         text-sm text-foreground placeholder:text-foreground-muted/50
                         outline-none focus:border-lecko-blue transition-colors"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-lecko-blue" />
          </div>
        ) : templates.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-lecko-blue/8 flex items-center justify-center mb-5">
              <Library size={28} className="text-lecko-blue/50" strokeWidth={1.5} />
            </div>
            <h3 className="font-consultant font-semibold text-foreground mb-2">
              Aucun template de questionnaire
            </h3>
            <p className="text-sm text-foreground-muted mb-6 max-w-xs">
              Créez votre premier questionnaire pour structurer vos entretiens et analyses.
            </p>
            <button
              onClick={() => navigate("/bibliotheque/questionnaire/nouveau")}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-lecko-blue text-white
                         text-sm font-semibold hover:bg-blue-600 transition-all"
            >
              <Plus size={15} />
              Créer un questionnaire
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={24} className="text-foreground-muted/40 mb-3" />
            <p className="text-sm text-foreground-muted">
              Aucun résultat pour &laquo; {search} &raquo;
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white border border-mission-border rounded-2xl p-5
                             hover:border-lecko-blue/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate(`/bibliotheque/questionnaire/${t.id}`)}
                >
                  {/* Icon + Menu */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-lecko-blue/8 flex items-center justify-center">
                      <FileText size={18} className="text-lecko-blue" strokeWidth={1.5} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === t.id ? null : t.id);
                        }}
                        className="p-1.5 rounded-lg text-foreground-muted hover:bg-slate-100
                                   opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {menuOpen === t.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-mission-border
                                          rounded-xl shadow-lg overflow-hidden z-50">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicate(t); }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground
                                         hover:bg-slate-50 transition-colors"
                            >
                              <Copy size={14} strokeWidth={1.5} />
                              Dupliquer
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                              disabled={deleting === t.id}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600
                                         hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {deleting === t.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} strokeWidth={1.5} />
                              )}
                              Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-consultant font-semibold text-foreground text-sm mb-1 line-clamp-1">
                    {t.nom}
                  </h3>
                  {t.description && (
                    <p className="text-xs text-foreground-muted line-clamp-2 mb-3">
                      {t.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-[11px] font-mono text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Layers size={12} strokeWidth={1.5} />
                      {t.sections.length} section{t.sections.length > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} strokeWidth={1.5} />
                      {totalQuestions(t)} question{totalQuestions(t) > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} strokeWidth={1.5} />
                      {new Date(t.updated_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  {/* Public badge */}
                  {t.is_public && (
                    <span className="absolute top-4 right-12 text-[10px] font-mono font-medium
                                     px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                      Public
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </ConsultantLayout>
  );
}
