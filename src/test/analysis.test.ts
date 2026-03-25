import { describe, it, expect } from "vitest";
import { computeScoreCriteres, getScoreBadgeClass } from "@/types/analysis";

describe("computeScoreCriteres", () => {
  it("returns 5 when all criteria are true", () => {
    expect(computeScoreCriteres({
      recurrence: true, energie: true, scalabilite: true, fiabilite: true, penibilite: true,
    })).toBe(5);
  });

  it("returns 0 when all criteria are false", () => {
    expect(computeScoreCriteres({
      recurrence: false, energie: false, scalabilite: false, fiabilite: false, penibilite: false,
    })).toBe(0);
  });

  it("returns correct count for mixed criteria", () => {
    expect(computeScoreCriteres({
      recurrence: true, energie: false, scalabilite: true, fiabilite: false, penibilite: true,
    })).toBe(3);
  });

  it("returns 0 when criteres is undefined", () => {
    expect(computeScoreCriteres(undefined)).toBe(0);
  });
});

describe("getScoreBadgeClass", () => {
  it("returns a non-empty class for low scores (0-1)", () => {
    expect(getScoreBadgeClass(0).length).toBeGreaterThan(0);
    expect(getScoreBadgeClass(1).length).toBeGreaterThan(0);
  });

  it("returns a non-empty class for mid scores (2-3)", () => {
    expect(getScoreBadgeClass(2).length).toBeGreaterThan(0);
    expect(getScoreBadgeClass(3).length).toBeGreaterThan(0);
  });

  it("returns a non-empty class for high scores (4-5)", () => {
    expect(getScoreBadgeClass(4).length).toBeGreaterThan(0);
    expect(getScoreBadgeClass(5).length).toBeGreaterThan(0);
  });
});
