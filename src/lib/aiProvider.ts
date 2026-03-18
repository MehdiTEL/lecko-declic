export type AIProvider = "openai" | "anthropic";

const PROVIDER_KEY = "ai_provider";
const API_KEY_STORAGE = "ai_api_key";
const LEGACY_KEY = "openai_api_key";

// Migrate legacy key on first access
function migrateLegacy() {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy && !localStorage.getItem(API_KEY_STORAGE)) {
    localStorage.setItem(PROVIDER_KEY, "openai");
    localStorage.setItem(API_KEY_STORAGE, legacy);
    localStorage.removeItem(LEGACY_KEY);
  }
}

export function getProvider(): AIProvider | null {
  try {
    migrateLegacy();
    return (localStorage.getItem(PROVIDER_KEY) as AIProvider) || null;
  } catch {
    return null;
  }
}

export function getApiKey(): string | null {
  try {
    migrateLegacy();
    return localStorage.getItem(API_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function saveProviderAndKey(provider: AIProvider, key: string): void {
  localStorage.setItem(PROVIDER_KEY, provider);
  localStorage.setItem(API_KEY_STORAGE, key);
  // Remove legacy key if exists
  localStorage.removeItem(LEGACY_KEY);
}

export function deleteProviderAndKey(): void {
  localStorage.removeItem(PROVIDER_KEY);
  localStorage.removeItem(API_KEY_STORAGE);
  localStorage.removeItem(LEGACY_KEY);
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "sk-...****";
  return `sk-...${key.slice(-4)}`;
}

// ─── System prompt (shared for both providers) ─────────────────────────────

export const SYSTEM_PROMPT = `Tu es un expert en transformation digitale et automatisation des processus métier, spécialisé dans le conseil aux organisations. Tu appliques la méthode DÉCLIC de Lecko.

L'utilisateur va te donner un intitulé de métier.

Tu dois :
1. Lister 8 à 12 tâches quotidiennes typiques et réalistes de ce métier
2. Pour chaque tâche, évaluer les 5 critères DÉCLIC (true/false)
3. Recommander une solution concrète et actionnable d'automatisation
4. Estimer le temps gagné par semaine pour chaque tâche
5. Indiquer si la tâche peut fonctionner SANS IA (règles simples) ou si l'IA est nécessaire

Sois précis dans les noms d'outils : cite des outils réels (N8N, Make/Zapier, Claude, ChatGPT, Notion AI, Power Automate, etc.).

Les 5 critères DÉCLIC à évaluer (true/false) :
- recurrence : la tâche revient régulièrement (plus de 3 fois par mois)
- energie : elle consomme un temps ou une énergie significative
- scalabilite : elle deviendrait ingérable si l'activité doublait
- fiabilite : l'humain oublie ou se trompe régulièrement dessus
- penibilite : elle est mentalement pénible ou démotivante

Principe "Sans IA d'abord" : peut_fonctionner_sans_ia = true si des règles simples "si X alors Y" suffisent. L'IA n'est nécessaire que si les données sont en texte libre, trop variables, ou les cas trop nombreux pour une logique rigide. Si IA nécessaire, expliquer brièvement dans raison_ia.

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks markdown, avec cette structure exacte :
{
  "metier": "string",
  "score_global": number,
  "heures_economisees_semaine": number,
  "taches": [
    {
      "nom": "string",
      "description": "string",
      "criteres": {
        "recurrence": boolean,
        "energie": boolean,
        "scalabilite": boolean,
        "fiabilite": boolean,
        "penibilite": boolean
      },
      "score_criteres": number,
      "categorie": "automatisable" | "partiellement_automatisable" | "difficilement_automatisable",
      "solution": "string",
      "type_outil": "Agent IA" | "Workflow N8N" | "Automatisation No-Code" | "Copilot / Assistant IA" | "Script personnalisé",
      "temps_gagne_heures_semaine": number,
      "peut_fonctionner_sans_ia": boolean,
      "raison_ia": "string ou null"
    }
  ]
}`;

// ─── Error messages per provider ───────────────────────────────────────────

export function getApiErrorMessage(
  status: number,
  provider: AIProvider | null,
  apiMessage?: string
): { message: string; showSettings: boolean } {
  if (provider === "anthropic") {
    if (status === 401) return { message: "Clé API Anthropic invalide. Vérifiez votre clé dans les paramètres.", showSettings: true };
    if (status === 429) return { message: "Quota Anthropic dépassé. Vérifiez votre compte sur console.anthropic.com.", showSettings: false };
    if (status === 529) return { message: "L'API Anthropic est surchargée. Réessayez dans quelques instants.", showSettings: false };
    if (status === 400 && apiMessage) {
      // Surface Anthropic's own error message (e.g. credit balance too low)
      if (apiMessage.toLowerCase().includes("credit balance") || apiMessage.toLowerCase().includes("billing"))
        return { message: `Solde Anthropic insuffisant. Rechargez votre compte sur console.anthropic.com/settings/billing.`, showSettings: false };
      return { message: `Erreur API Anthropic : ${apiMessage}`, showSettings: false };
    }
    return { message: `Erreur API Anthropic (${status}). Veuillez réessayer.`, showSettings: false };
  }
  // OpenAI (default)
  if (status === 401) return { message: "Clé API OpenAI invalide. Vérifiez votre clé dans les paramètres.", showSettings: true };
  if (status === 429) return { message: "Quota OpenAI dépassé. Vérifiez votre compte sur platform.openai.com.", showSettings: false };
  if (status === 403) return { message: "Clé API non fonctionnelle. Veuillez en générer une nouvelle sur platform.openai.com/api-keys.", showSettings: true };
  if (status === 400 && apiMessage) return { message: `Erreur API OpenAI : ${apiMessage}`, showSettings: false };
  if (status === 500 || status === 503) return { message: "OpenAI est temporairement indisponible. Réessayez dans quelques instants.", showSettings: false };
  return { message: `Erreur API OpenAI (${status}). Veuillez réessayer.`, showSettings: false };
}

// ─── Unified analyzeJob function ───────────────────────────────────────────

export async function analyzeJob(metier: string): Promise<string> {
  const provider = getProvider();
  const apiKey = getApiKey();

  if (!apiKey || !provider) {
    throw Object.assign(new Error("Aucune clé API configurée."), { requireKey: true });
  }

  if (provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Métier : ${metier}` }],
      }),
    });

    if (!response.ok) {
      let apiMessage: string | undefined;
      try {
        const errBody = await response.json();
        apiMessage = errBody?.error?.message ?? undefined;
      } catch { /* ignore */ }
      const errInfo = getApiErrorMessage(response.status, "anthropic", apiMessage);
      throw Object.assign(new Error(errInfo.message), { showSettings: errInfo.showSettings });
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? "";
  }

  // OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Métier : ${metier}` },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    let apiMessage: string | undefined;
    try {
      const errBody = await response.json();
      apiMessage = errBody?.error?.message ?? undefined;
    } catch { /* ignore */ }
    const errInfo = getApiErrorMessage(response.status, "openai", apiMessage);
    throw Object.assign(new Error(errInfo.message), { showSettings: errInfo.showSettings });
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
