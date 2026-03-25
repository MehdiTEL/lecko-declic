import { describe, it, expect } from "vitest";

describe("Results cached param decoding", () => {
  it("roundtrip encode/decode preserves data", () => {
    const data = {
      metier: "Chef de projet",
      score_global: 62,
      heures_economisees_semaine: 9,
      taches: [{ nom: "Reporting", categorie: "automatisable" }],
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const decoded = JSON.parse(decodeURIComponent(atob(encoded)));

    expect(decoded.metier).toBe("Chef de projet");
    expect(decoded.score_global).toBe(62);
    expect(decoded.taches).toHaveLength(1);
    expect(decoded.taches[0].nom).toBe("Reporting");
  });

  it("handles corrupted base64 without throwing", () => {
    const corrupted = "not-valid-base64!!!";
    let result = null;
    try {
      result = JSON.parse(decodeURIComponent(atob(corrupted)));
    } catch {
      result = null;
    }
    expect(result).toBeNull();
  });

  it("handles empty string", () => {
    let result = null;
    try {
      result = JSON.parse(decodeURIComponent(atob("")));
    } catch {
      result = null;
    }
    expect(result).toBeNull();
  });
});
