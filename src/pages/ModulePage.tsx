import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FORMATIONS } from "@/data/formations";
import ModuleContent from "@/components/formations/ModuleContent";
import QuizBlock from "@/components/formations/QuizBlock";
import AIChatPanel from "@/components/ai/AIChatPanel";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Bot } from "lucide-react";

export default function ModulePage() {
  const { slug, moduleId } = useParams<{ slug: string; moduleId: string }>();
  const [showQuiz, setShowQuiz] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const formation = useMemo(
    () => FORMATIONS.find((f) => f.slug === slug) ?? null,
    [slug]
  );

  const moduleIndex = useMemo(
    () => formation?.modules.findIndex((m) => m.id === moduleId) ?? -1,
    [formation, moduleId]
  );

  const module = formation?.modules[moduleIndex] ?? null;
  const prevModule = moduleIndex > 0 ? formation?.modules[moduleIndex - 1] : null;
  const nextModule = formation?.modules[moduleIndex + 1] ?? null;

  if (!formation || !module) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8A8AA3] mb-4">Module introuvable.</p>
          <Link
            to="/formations"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-2.5 rounded-full transition-all"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Breadcrumb */}
        <Link
          to={`/formations/${formation.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[#8A8AA3] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {formation.titre}
        </Link>

        {/* Module header */}
        <div className="mb-8">
          <p className="text-sm text-violet-400 mb-2">
            Module {moduleIndex + 1}/{formation.modules.length}
          </p>
          <h1 className="text-heading-xl text-white font-display mb-2">
            {module.titre}
          </h1>
          <p className="text-sm text-[#55556A]">{module.duree}</p>
        </div>

        {/* Content */}
        <div className="mb-12">
          <ModuleContent content={module.contenu} />
        </div>

        {/* Quiz section */}
        {module.quiz.length > 0 && (
          <div className="mb-12">
            {!showQuiz ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full glass-card p-6 text-center hover:border-violet-500/30 transition-all group"
              >
                <BookOpen size={24} className="mx-auto text-violet-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">Quiz du module</h3>
                <p className="text-sm text-[#8A8AA3]">
                  {module.quiz.length} questions pour tester vos connaissances
                </p>
              </button>
            ) : (
              <div>
                <h3 className="text-heading-md text-white font-display mb-4">Quiz</h3>
                <QuizBlock questions={module.quiz} />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
          {prevModule ? (
            <Link
              to={`/formations/${formation.slug}/${prevModule.id}`}
              onClick={() => setShowQuiz(false)}
              className="inline-flex items-center gap-2 text-sm text-[#8A8AA3] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">{prevModule.titre}</span>
              <span className="sm:hidden">Précédent</span>
            </Link>
          ) : (
            <div />
          )}

          {nextModule ? (
            <Link
              to={`/formations/${formation.slug}/${nextModule.id}`}
              onClick={() => setShowQuiz(false)}
              className="inline-flex items-center gap-2 text-sm bg-violet-500 hover:bg-violet-400 text-white font-semibold px-5 py-2 rounded-full transition-all"
            >
              <span className="hidden sm:inline">{nextModule.titre}</span>
              <span className="sm:hidden">Suivant</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              to={`/formations/${formation.slug}`}
              className="inline-flex items-center gap-2 text-sm bg-violet-500 hover:bg-violet-400 text-white font-semibold px-5 py-2 rounded-full transition-all"
            >
              Terminer la formation
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* AI Chat FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-violet-500 hover:bg-violet-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25 transition-all z-30"
        title="Assistant IA"
      >
        <Bot size={24} />
      </button>

      {/* AI Chat Panel */}
      <AIChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        context={`Formation : ${formation.titre}. Module : ${module.titre}.`}
      />
    </div>
  );
}
