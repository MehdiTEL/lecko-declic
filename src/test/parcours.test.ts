import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: null }) })),
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }), onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }) },
    functions: { invoke: vi.fn().mockResolvedValue({ data: {}, error: null }) },
    channel: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() }),
    removeChannel: vi.fn(),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

const ls: Record<string, string> = {};
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (k: string) => ls[k] ?? null,
    setItem: (k: string, v: string) => { ls[k] = v; },
    removeItem: (k: string) => { delete ls[k]; },
    clear: () => { Object.keys(ls).forEach(k => delete ls[k]); },
  },
});

describe("Diagnostic express — base locale", () => {
  it("retourne un résultat pour métier connu", async () => {
    const { findInLocalDatabase } = await import("@/data/jobDatabase");
    const r = findInLocalDatabase("Chef de projet");
    expect(r).not.toBeNull();
    expect(r!.score_global).toBeGreaterThan(0);
    expect(r!.taches.length).toBeGreaterThan(0);
  });
  it("est case-insensitive", async () => {
    const { findInLocalDatabase } = await import("@/data/jobDatabase");
    expect(findInLocalDatabase("chef de projet")?.metier).toBe(findInLocalDatabase("CHEF DE PROJET")?.metier);
  });
  it("retourne null pour métier inconnu", async () => {
    const { findInLocalDatabase } = await import("@/data/jobDatabase");
    expect(findInLocalDatabase("Astronaute quantique")).toBeNull();
  });
});

describe("Gestion clé API", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());
  it("persiste et récupère la clé", async () => {
    const { saveProviderAndKey, getApiKey, getProvider } = await import("@/lib/aiProvider");
    saveProviderAndKey("anthropic", "sk-ant-test12345678");
    expect(getApiKey()).toBe("sk-ant-test12345678");
    expect(getProvider()).toBe("anthropic");
  });
  it("efface la clé", async () => {
    const { saveProviderAndKey, deleteProviderAndKey, getApiKey } = await import("@/lib/aiProvider");
    saveProviderAndKey("openai", "sk-test12345678");
    deleteProviderAndKey();
    // Falls back to env var or null
    const key = getApiKey();
    expect(key === null || key !== "sk-test12345678").toBe(true);
  });
  it("masque correctement", async () => {
    const { maskApiKey } = await import("@/lib/aiProvider");
    const masked = maskApiKey("sk-ant-abcdefgh1234");
    expect(masked).toContain("1234");
    expect(masked).not.toContain("abcdefgh");
  });
});

describe("Décodage URL base64", () => {
  it("encode/décode sans perte", () => {
    const d = { metier: "Comptable", score_global: 65, heures_economisees_semaine: 7.5, taches: [] };
    const enc = btoa(encodeURIComponent(JSON.stringify(d)));
    const dec = JSON.parse(decodeURIComponent(atob(enc)));
    expect(dec.metier).toBe("Comptable");
    expect(dec.score_global).toBe(65);
  });
  it("gère les accents", () => {
    const d = { metier: "Chargé de communication", score_global: 70, heures_economisees_semaine: 8, taches: [] };
    const dec = JSON.parse(decodeURIComponent(atob(btoa(encodeURIComponent(JSON.stringify(d))))));
    expect(dec.metier).toBe("Chargé de communication");
  });
  it("renvoie null si base64 corrompu", () => {
    let r = null;
    try { r = JSON.parse(decodeURIComponent(atob("INVALID!!!"))); } catch { r = null; }
    expect(r).toBeNull();
  });
});

describe("Progression gamification", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());
  it("crée des tâches todo", async () => {
    const { initTracking, loadProgress } = await import("@/lib/progressStorage");
    initTracking("a1", "Chef de projet", ["A", "B", "C"]);
    expect(loadProgress().trackedTasks.length).toBe(3);
    expect(loadProgress().trackedTasks[0].status).toBe("todo");
  });
  it("cycle todo → done", async () => {
    const { initTracking, updateTaskStatus, loadProgress } = await import("@/lib/progressStorage");
    initTracking("a2", "RH", ["X"]);
    updateTaskStatus("a2", "X", "in_progress");
    updateTaskStatus("a2", "X", "done");
    const t = loadProgress().trackedTasks.find(t => t.taskName === "X");
    expect(t?.status).toBe("done");
    expect(t?.completedAt).toBeDefined();
  });
  it("calcule la progression globale", async () => {
    const { initTracking, updateTaskStatus, getGlobalProgress, loadProgress } = await import("@/lib/progressStorage");
    initTracking("a3", "Consultant", ["A", "B", "C", "D"]);
    updateTaskStatus("a3", "A", "done"); updateTaskStatus("a3", "B", "done");
    updateTaskStatus("a3", "C", "in_progress");
    const p = getGlobalProgress(loadProgress());
    expect(p.done).toBe(2); expect(p.inProgress).toBe(1); expect(p.total).toBe(4);
  });
});

describe("Profil progressif", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());
  it("défauts si vide", async () => {
    const { loadProfile } = await import("@/lib/userProfile");
    const p = loadProfile();
    expect(p.role).toBeNull(); expect(p.diagnosticsCount).toBe(0);
  });
  it("demande role en premier", async () => {
    const { getNextProfileQuestion, loadProfile } = await import("@/lib/userProfile");
    expect(getNextProfileQuestion(loadProfile())).toBe("role");
  });
  it("null si profil complet", async () => {
    const { getNextProfileQuestion, saveProfile, loadProfile } = await import("@/lib/userProfile");
    saveProfile({ role: "consultant", secteur: "tech_produit", stack: "m365", diagnosticsCount: 10, lastVisit: new Date().toISOString() });
    expect(getNextProfileQuestion(loadProfile())).toBeNull();
  });
});

describe("Types consultant", () => {
  it("computePriorite", async () => {
    const { computePriorite } = await import("@/types/consultant");
    expect(computePriorite(5, 1)).toBe("critique");
    expect(computePriorite(1, 5)).toBe("basse");
    expect(computePriorite(3, 3)).toBe("normale");
  });
  it("computeImpactAnnuel", async () => {
    const { computeImpactAnnuel } = await import("@/types/consultant");
    expect(computeImpactAnnuel(2, 5)).toBe(470);
  });
});

describe("Config modulable", () => {
  it("5 critères DÉCLIC actifs par défaut", async () => {
    const { DEFAULT_MISSION_CONFIG } = await import("@/types/modulable");
    const actifs = DEFAULT_MISSION_CONFIG.scoring.criteres.filter(c => c.actif);
    expect(actifs.length).toBe(5);
    expect(actifs.map(c => c.id)).toContain("recurrence");
    expect(actifs.map(c => c.id)).toContain("penibilite");
  });
});
