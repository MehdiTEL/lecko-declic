import { useState, useMemo } from "react";
import FormationCard from "./FormationCard";
import { DOMAINES, domaines } from "@/data/domaines";
import type { Formation } from "@/types/formation";
import type { DomaineId } from "@/types/diagnostic";

interface FormationGridProps {
  formations: Formation[];
}

export default function FormationGrid({ formations }: FormationGridProps) {
  const [domainFilter, setDomainFilter] = useState<DomaineId | "all">("all");
  const [niveauFilter, setNiveauFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      if (domainFilter !== "all" && f.domaine !== domainFilter) return false;
      if (niveauFilter !== "all" && f.niveau !== niveauFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          f.titre.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [formations, domainFilter, niveauFilter, search]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Rechercher une formation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#55556A] focus:outline-none focus:border-violet-500/50 transition-colors"
        />

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value as DomaineId | "all")}
          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="all">Tous les domaines</option>
          {domaines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.titre}
            </option>
          ))}
        </select>

        <select
          value={niveauFilter}
          onChange={(e) => setNiveauFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="all">Tous les niveaux</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#8A8AA3] py-12">
          Aucune formation ne correspond à vos critères.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => (
            <FormationCard key={f.id} formation={f} />
          ))}
        </div>
      )}
    </div>
  );
}
