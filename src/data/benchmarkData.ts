/**
 * Benchmark data — based on Referentiel Lecko analysis.
 * 312 organisations analysed across 20 years of consulting (2005-2025).
 * Source: referentiel.lecko.fr
 */

export interface SectorData {
  jobs: string[];
  avgScore: number;
  avgHours: number;
  topOutil: string;
  gainConstate: string;
}

export const BENCHMARK = {
  avgScore: 68,
  avgHoursPerWeek: 8.5,
  totalOrganisations: 312,
  referentielEdition: "2025-2026",
  anneeCollecte: 2025,
  totalJobs: 15,
  scores: [58, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 77],
  sectors: {
    "Finance & Gestion": {
      jobs: ["Comptable", "DAF", "Juriste"],
      avgScore: 64,
      avgHours: 7.2,
      topOutil: "Power Automate",
      gainConstate: "3h a 6h/semaine recuperees en moyenne",
    },
    "Tech & Produit": {
      jobs: ["Developpeur", "Product Manager", "Data Analyst", "Designer/UX"],
      avgScore: 70,
      avgHours: 9.8,
      topOutil: "Agent IA + N8N",
      gainConstate: "5h a 12h/semaine recuperees en moyenne",
    },
    "Marketing & Communication": {
      jobs: ["Responsable Marketing", "Community Manager", "Charge de communication"],
      avgScore: 71,
      avgHours: 10.1,
      topOutil: "Copilot + Make",
      gainConstate: "4h a 9h/semaine recuperees en moyenne",
    },
    "Management & Conseil": {
      jobs: ["Chef de projet", "Consultant", "Assistant(e) de direction"],
      avgScore: 65,
      avgHours: 7.8,
      topOutil: "M365 Copilot",
      gainConstate: "3h a 7h/semaine recuperees en moyenne",
    },
    "RH & Commercial": {
      jobs: ["RH/Recruteur", "Commercial"],
      avgScore: 67,
      avgHours: 8.2,
      topOutil: "Automatisation No-Code",
      gainConstate: "4h a 8h/semaine recuperees en moyenne",
    },
    "Secteur Public": {
      jobs: ["Agent administratif", "Responsable service public"],
      avgScore: 61,
      avgHours: 6.5,
      topOutil: "Power Automate",
      gainConstate: "2h a 5h/semaine recuperees en moyenne",
    },
  } as Record<string, SectorData>,
};

/** Returns the percentile rank (0-100) for a given score */
export function getPercentile(score: number): number {
  const below = BENCHMARK.scores.filter((s) => s < score).length;
  return Math.round((below / BENCHMARK.scores.length) * 100);
}

/** Returns the sector name for a given job title, or null if not found */
export function getSector(metier: string): string | null {
  const normalized = metier.toLowerCase();
  for (const [sector, data] of Object.entries(BENCHMARK.sectors)) {
    if (
      data.jobs.some((j) =>
        normalized.includes(
          j
            .toLowerCase()
            .split("/")[0]
            .split("(")[0]
            .trim()
        )
      )
    ) {
      return sector;
    }
  }
  return null;
}
