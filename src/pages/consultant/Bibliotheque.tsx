import { Library, FileText, Plus } from "lucide-react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";

export default function Bibliotheque() {
  return (
    <ConsultantLayout activeSection="bibliotheque">
      <div className="px-8 pt-8 pb-6 border-b border-mission-border">
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

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-lecko-blue/8 flex items-center justify-center mb-5">
          <Library size={28} className="text-lecko-blue/50" strokeWidth={1.5} />
        </div>
        <h3 className="font-consultant font-semibold text-foreground mb-2">
          Bibliothèque de templates
        </h3>
        <p className="text-sm text-foreground-muted mb-6 max-w-xs">
          Retrouvez ici vos modèles de questionnaires, grilles d'analyse et templates
          de restitution.
        </p>
        <button
          disabled
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-lecko-blue text-white text-sm font-semibold opacity-50 cursor-not-allowed"
        >
          <Plus size={15} />
          Bientôt disponible
        </button>
      </div>
    </ConsultantLayout>
  );
}
