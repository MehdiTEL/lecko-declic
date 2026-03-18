import { HistoryEntry } from "@/types/analysis";

const STORAGE_KEY = "lecko-history";

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry): void {
  const history = getHistory();
  const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeFromHistory(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
