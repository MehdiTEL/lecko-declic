/**
 * Benchmark data — pre-calculated from the 15 jobs in JOB_DATABASE.
 * Static constants to avoid runtime computation on every render.
 */

export const BENCHMARK = {
  avgScore: 68,
  avgHoursPerWeek: 8.5,
  totalJobs: 15,
  /** Sorted scores of all 15 jobs for percentile calculation */
  scores: [58, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 77],
  /** Sector groupings with pre-calculated averages */
  sectors: {
    "Finance & Gestion": { jobs: ["Comptable", "DAF", "Juriste"], avgScore: 64 },
    "Tech & Produit": { jobs: ["Développeur", "Product Manager", "Data Analyst", "Designer/UX"], avgScore: 70 },
    "Marketing & Communication": { jobs: ["Responsable Marketing", "Community Manager", "Chargé de communication"], avgScore: 71 },
    "Management & Conseil": { jobs: ["Chef de projet", "Consultant", "Assistant(e) de direction"], avgScore: 65 },
    "RH & Commercial": { jobs: ["RH/Recruteur", "Commercial"], avgScore: 67 },
  } as Record<string, { jobs: string[]; avgScore: number }>,
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
