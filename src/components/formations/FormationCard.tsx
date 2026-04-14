import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { DOMAINES } from "@/data/domaines";
import type { Formation } from "@/types/formation";

const NIVEAU_BADGE = {
  debutant: "debutant",
  intermediaire: "intermediaire",
} as const;

interface FormationCardProps {
  formation: Formation;
}

export default function FormationCard({ formation }: FormationCardProps) {
  const domain = DOMAINES[formation.domaine];

  return (
    <Link
      to={`/formations/${formation.slug}`}
      className="glass-card p-6 flex flex-col gap-4 hover:border-white/[0.12] transition-all group"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${domain?.couleur ?? "#8B5CF6"}20` }}
        >
          <BookOpen size={20} style={{ color: domain?.couleur ?? "#8B5CF6" }} />
        </div>
        <ScoreBadge level={NIVEAU_BADGE[formation.niveau]} />
      </div>

      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-violet-300 transition-colors">
          {formation.titre}
        </h3>
        <p className="text-[#8A8AA3] text-sm line-clamp-2">
          {formation.description}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#55556A]">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {formation.duree}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen size={14} />
          {formation.modules.length} modules
        </span>
      </div>
    </Link>
  );
}
