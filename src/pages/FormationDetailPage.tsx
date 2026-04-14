import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FORMATIONS } from "@/data/formations";
import { DOMAINES } from "@/data/domaines";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ArrowLeft, Clock, BookOpen, Target, ChevronRight } from "lucide-react";
import type { NiveauFormation } from "@/types/formation";

const NIVEAU_BADGE: Record<NiveauFormation, "debutant" | "intermediaire"> = {
  debutant: "debutant",
  intermediaire: "intermediaire",
};

const NIVEAU_LABEL: Record<NiveauFormation, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
};

export default function FormationDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const formation = useMemo(
    () => FORMATIONS.find((f) => f.slug === slug) ?? null,
    [slug]
  );

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8A8AA3] mb-4">Formation introuvable.</p>
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

  const domain = DOMAINES[formation.domaine];

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link
          to="/formations"
          className="inline-flex items-center gap-2 text-sm text-[#8A8AA3] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Retour au catalogue
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${domain?.couleur ?? "#8B5CF6"}20`,
                color: domain?.couleur ?? "#8B5CF6",
              }}
            >
              {domain?.titre ?? formation.domaine}
            </span>
            <ScoreBadge level={NIVEAU_BADGE[formation.niveau]} />
          </div>

          <h1 className="text-heading-xl text-white font-display mb-3">
            {formation.titre}
          </h1>
          <p className="text-body-lg text-[#8A8AA3]">{formation.description}</p>

          <div className="flex items-center gap-6 mt-4 text-sm text-[#55556A]">
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {formation.duree}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={16} />
              {formation.modules.length} modules
            </span>
            <span className="flex items-center gap-1.5">
              {NIVEAU_LABEL[formation.niveau]}
            </span>
          </div>
        </div>

        {/* Objectifs */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
            <Target size={18} className="text-violet-400" />
            Objectifs de la formation
          </h2>
          <ul className="space-y-2">
            {formation.objectifs.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-[#C8C8D8] text-sm">
                <span className="text-violet-400 mt-0.5">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Modules list */}
        <div>
          <h2 className="text-heading-md text-white font-display mb-4">Modules</h2>
          <div className="space-y-3">
            {formation.modules.map((module, i) => (
              <Link
                key={module.id}
                to={`/formations/${formation.slug}/${module.id}`}
                className="glass-card p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium group-hover:text-violet-300 transition-colors">
                    {module.titre}
                  </h3>
                  <p className="text-xs text-[#55556A] mt-0.5">{module.duree}</p>
                </div>
                <ChevronRight size={16} className="text-[#55556A] group-hover:text-white transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
