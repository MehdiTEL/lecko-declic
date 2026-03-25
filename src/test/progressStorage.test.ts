import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadProgress, resetProgress } from "@/lib/progressStorage";

// Mock supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(() => ({ upsert: vi.fn() })) },
}));

describe("loadProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default state when localStorage is empty", () => {
    const state = loadProgress();
    expect(state.trackedTasks).toEqual([]);
    expect(state.streak.currentStreak).toBe(0);
    expect(state.streak.longestStreak).toBe(0);
    expect(state.totalTasksCompleted).toBe(0);
  });

  it("roundtrip: save then load preserves data", () => {
    const testState = {
      trackedTasks: [{
        taskName: "Test Task",
        metier: "Test",
        analysisId: "test-id",
        status: "done" as const,
        completedAt: "2026-01-01",
      }],
      streak: { currentStreak: 3, longestStreak: 5, lastActivityDate: "2026-01-01" },
      totalTasksCompleted: 1,
      firstActivityDate: "2025-12-01",
    };

    localStorage.setItem("declic-progress", JSON.stringify(testState));
    const loaded = loadProgress();

    expect(loaded.trackedTasks).toHaveLength(1);
    expect(loaded.trackedTasks[0].taskName).toBe("Test Task");
    expect(loaded.streak.currentStreak).toBe(3);
    expect(loaded.totalTasksCompleted).toBe(1);
  });
});

describe("resetProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("clears progress from localStorage", () => {
    localStorage.setItem("declic-progress", JSON.stringify({ trackedTasks: [{ taskName: "x" }] }));
    resetProgress();
    expect(localStorage.getItem("declic-progress")).toBeNull();
  });
});
