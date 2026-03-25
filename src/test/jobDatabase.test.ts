import { describe, it, expect } from "vitest";
import { findInLocalDatabase, getSimilarJobs, FREE_JOB_LABELS } from "@/data/jobDatabase";

describe("findInLocalDatabase", () => {
  it("finds a known metier (exact match)", () => {
    const result = findInLocalDatabase("Chef de projet");
    expect(result).not.toBeNull();
    expect(result?.metier).toBe("Chef de projet");
    expect(result?.taches.length).toBeGreaterThan(0);
  });

  it("finds with different casing", () => {
    const result = findInLocalDatabase("chef de projet");
    expect(result).not.toBeNull();
    expect(result?.metier).toBe("Chef de projet");
  });

  it("returns null for unknown metier", () => {
    expect(findInLocalDatabase("Astronaute")).toBeNull();
  });
});

describe("getSimilarJobs", () => {
  it("returns similar jobs for a close input", () => {
    const similar = getSimilarJobs("chef projet");
    expect(similar.length).toBeGreaterThan(0);
  });

  it("returns empty or limited for completely unrelated input", () => {
    const similar = getSimilarJobs("xyzzy999");
    expect(Array.isArray(similar)).toBe(true);
  });
});

describe("FREE_JOB_LABELS", () => {
  it("is a non-empty array of strings", () => {
    expect(FREE_JOB_LABELS.length).toBeGreaterThan(0);
    FREE_JOB_LABELS.forEach((label) => {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it("contains at least 15 metiers", () => {
    expect(FREE_JOB_LABELS.length).toBeGreaterThanOrEqual(15);
  });
});
