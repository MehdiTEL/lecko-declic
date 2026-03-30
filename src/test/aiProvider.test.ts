import { describe, it, expect, beforeEach, vi } from "vitest";
import { maskApiKey, getProvider, getApiKey, saveProviderAndKey, deleteProviderAndKey } from "@/lib/aiProvider";

// Mock supabase to avoid import errors
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn(), functions: { invoke: vi.fn() } },
}));

describe("maskApiKey", () => {
  it("masks a normal key showing last 4 chars", () => {
    expect(maskApiKey("sk-proj-abcdefghij1234")).toBe("sk-...1234");
  });

  it("returns placeholder for short key (<8 chars)", () => {
    expect(maskApiKey("short")).toBe("sk-...****");
  });

  it("returns placeholder for empty string", () => {
    expect(maskApiKey("")).toBe("sk-...****");
  });

  it("returns placeholder for null-ish input", () => {
    expect(maskApiKey(null as unknown as string)).toBe("sk-...****");
  });
});

describe("provider storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getProvider returns null or env fallback when nothing stored", () => {
    const p = getProvider();
    // If VITE_ANTHROPIC_API_KEY env var is set, falls back to "anthropic"
    expect(p === null || p === "anthropic").toBe(true);
  });

  it("saveProviderAndKey stores and retrieves correctly", () => {
    saveProviderAndKey("anthropic", "sk-ant-test1234");
    expect(getProvider()).toBe("anthropic");
    expect(getApiKey()).toBe("sk-ant-test1234");
  });

  it("deleteProviderAndKey clears stored values", () => {
    saveProviderAndKey("openai", "sk-test");
    deleteProviderAndKey();
    // After delete, provider/key may fall back to env var
    const p = getProvider();
    expect(p === null || p === "anthropic").toBe(true);
    const k = getApiKey();
    expect(k !== "sk-test").toBe(true);
  });

  it("migrates legacy openai_api_key on first access", () => {
    localStorage.setItem("openai_api_key", "sk-legacy-key");
    // Accessing getProvider triggers migrateLegacy
    const provider = getProvider();
    expect(provider).toBe("openai");
    expect(getApiKey()).toBe("sk-legacy-key");
    expect(localStorage.getItem("openai_api_key")).toBeNull();
  });
});
