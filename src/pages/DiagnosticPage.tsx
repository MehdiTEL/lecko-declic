import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { domaines } from "@/data/domaines";
import DomainSelector from "@/components/diagnostic/DomainSelector";
import { ArrowRight } from "lucide-react";
import type { DomaineId } from "@/types/diagnostic";

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const [selectedDomains, setSelectedDomains] = useState<DomaineId[]>([]);

  const domains = domaines;
  const estimatedMinutes = Math.ceil(selectedDomains.length * 2.5);

  const toggleDomain = (id: DomaineId) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    sessionStorage.setItem("diagnostic_domains", JSON.stringify(selectedDomains));
    navigate("/diagnostic/test");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="section-label mb-4">Diagnostic</p>
          <h1 className="text-display text-white font-display mb-4">
            Évaluez votre maturité IA
          </h1>
          <p className="text-body-lg text-[#8A8AA3] max-w-2xl mx-auto">
            Sélectionnez les domaines que vous souhaitez évaluer.
            Le diagnostic est gratuit, sans inscription, et prend quelques minutes.
          </p>
        </div>

        <DomainSelector
          domains={domains}
          selected={selectedDomains}
          onToggle={toggleDomain}
        />

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#55556A]">
            {selectedDomains.length > 0 ? (
              <>
                {selectedDomains.length} domaine{selectedDomains.length > 1 ? "s" : ""} sélectionné{selectedDomains.length > 1 ? "s" : ""}
                {" · ~"}{estimatedMinutes} minutes
              </>
            ) : (
              "Sélectionnez au moins 1 domaine pour commencer"
            )}
          </p>

          <button
            onClick={handleStart}
            disabled={selectedDomains.length === 0}
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 btn-glow"
          >
            Lancer le diagnostic
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
