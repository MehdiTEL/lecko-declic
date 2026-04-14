import { FORMATIONS } from "@/data/formations";
import FormationGrid from "@/components/formations/FormationGrid";

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-4">Catalogue</p>
          <h1 className="text-display text-white font-display mb-4">
            Nos formations IA
          </h1>
          <p className="text-body-lg text-[#8A8AA3] max-w-2xl mx-auto">
            Des parcours pratiques pour maîtriser l'IA dans votre métier.
            Chaque formation combine théorie, exemples concrets et quiz interactifs.
          </p>
        </div>

        <FormationGrid formations={FORMATIONS} />
      </div>
    </div>
  );
}
