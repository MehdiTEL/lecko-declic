const API_KEY_STORAGE = "openai_api_key";

export function getApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function deleteApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "sk-...****";
  return `sk-...${key.slice(-4)}`;
}
