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

export const SYSTEM_PROMPT = `Tu es un expert en transformation digitale et automatisation des processus métier spécialisé dans la plateforme DÉCLIC. Tu appliques la méthode DÉCLIC.

L'utilisateur va te donner un intitulé de métier.

Tu dois :
1. Lister 8 à 12 tâches quotidiennes typiques et réalistes de ce métier
2. Pour chaque tâche, évaluer les 5 critères DÉCLIC (true/false)
3. Recommander une solution concrète avec des outils PRÉCIS (pas de recommandation vague)
4. Estimer le temps gagné par semaine
5. Indiquer si la tâche peut fonctionner SANS IA
6. NOUVEAU — Attribuer un NIVEAU D'ACCOMPAGNEMENT :
   - "express" : l'utilisateur peut le faire seul en quelques heures avec un tuto. Typiquement : activer une fonctionnalité native (règles Outlook, filtres Gmail), configurer un Zap simple, utiliser Copilot/Claude pour une tâche ponctuelle.
   - "guide" : l'utilisateur peut le faire avec l'aide du DÉCLIC Copilot (notre assistant IA intégré) en quelques jours. Typiquement : créer un workflow N8N/Make de complexité moyenne, configurer Power Automate avec 3-5 étapes, intégrer une API LLM.
   - "consultant" : nécessite l'accompagnement d'un accompagnement expert. Typiquement : intégration système complexe (ERP, SIRH, SI métier), conduite du changement organisationnel, architecture d'agents IA multi-étapes, connexion à des APIs internes sécurisées, refonte de processus touchant plusieurs équipes.
7. NOUVEAU — Indiquer l'ÉCOSYSTÈME D'OUTILS précis et les outils spécifiques
8. NOUVEAU — Estimer la COMPLEXITÉ de mise en place et le TEMPS en jours ouvrés
9. NOUVEAU — Lister les PRÉREQUIS techniques

RÈGLE COMMERCIALE IMPORTANTE :
- Environ 30-40% des tâches doivent être "express" (victoires rapides, l'utilisateur est autonome)
- Environ 30-40% doivent être "guide" (le DÉCLIC Copilot suffit)
- Environ 20-30% doivent être "consultant" (nécessitant un accompagnement expert)
Cette répartition est réaliste et honnête — ne pas forcer artificiellement vers "consultant".

Les 5 critères DÉCLIC (true/false) :
- recurrence : la tâche revient régulièrement (>3 fois/mois)
- energie : elle consomme un temps ou énergie significative
- scalabilite : elle deviendrait ingérable si l'activité doublait
- fiabilite : l'humain oublie ou se trompe régulièrement
- penibilite : elle est mentalement pénible ou démotivante

Principe "Sans IA d'abord" : peut_fonctionner_sans_ia = true si des règles simples "si X alors Y" suffisent.

Écosystèmes d'outils disponibles :
- "M365_PowerAutomate" : Power Automate, Power Apps, SharePoint, Forms
- "M365_Copilot" : Microsoft Copilot dans Word, Excel, Teams, Outlook, PowerPoint
- "N8N" : N8N self-hosted ou cloud
- "Make_Zapier" : Make (ex-Integromat) ou Zapier
- "Google_AppsScript" : Google Workspace (Sheets, Docs, Gmail scripts)
- "LLM_API" : API Claude, API OpenAI, LangChain, agents custom
- "Agent_IA" : Agents autonomes multi-étapes (CrewAI, AutoGPT, n8n + LLM)
- "Notion_Airtable" : Bases no-code + automations intégrées
- "Python_Script" : Scripts Python custom (pandas, requests, selenium)
- "RPA" : UiPath, Power Automate Desktop, robots logiciels
- "Natif_SaaS" : Fonctionnalité déjà disponible dans l'outil en place (règles mail, templates, macros)

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks :
{
  "metier": "string",
  "score_global": number,
  "heures_economisees_semaine": number,
  "taches": [
    {
      "nom": "string",
      "description": "string",
      "criteres": { "recurrence": bool, "energie": bool, "scalabilite": bool, "fiabilite": bool, "penibilite": bool },
      "score_criteres": number,
      "categorie": "automatisable" | "partiellement_automatisable" | "difficilement_automatisable",
      "solution": "string (description concrète avec noms d'outils réels)",
      "type_outil": "Agent IA" | "Workflow N8N" | "Automatisation No-Code" | "Copilot / Assistant IA" | "Script personnalisé",
      "ecosysteme": "M365_PowerAutomate" | "M365_Copilot" | "N8N" | "Make_Zapier" | "Google_AppsScript" | "LLM_API" | "Agent_IA" | "Notion_Airtable" | "Python_Script" | "RPA" | "Natif_SaaS",
      "outils_specifiques": ["string", ...],
      "temps_gagne_heures_semaine": number,
      "peut_fonctionner_sans_ia": boolean,
      "raison_ia": "string ou null",
      "niveau_accompagnement": "express" | "guide" | "consultant",
      "raison_accompagnement": "string (1 phrase justifiant le niveau)",
      "complexite": "faible" | "moyenne" | "elevee",
      "temps_mise_en_place_jours": number,
      "prerequis": ["string", ...]
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

// ─── Edge Function proxy (server-side API call, no user key needed) ────────

import { supabase } from "@/integrations/supabase/client";

export async function analyzeJobViaEdge(metier: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("analyze-job", {
    body: { metier },
  });
  if (error) throw new Error(error.message ?? "Erreur du serveur d'analyse.");
  return typeof data === "string" ? data : JSON.stringify(data);
}

// ─── Unified analyzeJob function ───────────────────────────────────────────
// Priority: user's own key (direct call) > Edge Function (server-side key)

export async function analyzeJob(metier: string): Promise<string> {
  const provider = getProvider();
  const apiKey = getApiKey();

  // If no user key configured, try the Edge Function (uses server-side key)
  if (!apiKey || !provider) {
    return analyzeJobViaEdge(metier);
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
        max_tokens: 5000,
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
      max_tokens: 5000,
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

// ─── Workflow JSON generation ────────────────────────────────────────

import type { AnalysisTask } from "@/types/analysis";

const WORKFLOW_SYSTEM_PROMPT = `Tu es un expert en automatisation. Tu generes des workflows JSON importables.

REGLES :
- Reponds UNIQUEMENT avec du JSON valide, sans texte avant ou apres, sans backticks
- Le JSON doit etre directement importable dans l'outil cible
- Utilise des noms de noeuds en francais
- Inclus des commentaires dans les descriptions de noeuds
- Configure les credentials en placeholder (l'utilisateur les remplira)`;

const N8N_PROMPT = `Genere un workflow JSON N8N (format n8n export) pour cette tache.
Le JSON doit avoir la structure : { "meta": {...}, "nodes": [...], "connections": {...} }
Chaque noeud doit avoir : type, name, parameters, position (x,y pour le canvas).
Utilise les vrais types de noeuds n8n (n8n-nodes-base.webhook, n8n-nodes-base.httpRequest, etc.)`;

const MAKE_PROMPT = `Genere un blueprint Make (ex-Integromat) pour cette tache.
Le JSON doit avoir la structure : { "name": "...", "flow": [...], "modules": [...] }
Chaque module doit avoir : module (type), mapper, metadata.`;

export async function generateWorkflowJson(
  task: AnalysisTask,
  metier: string,
  format: "n8n" | "make"
): Promise<string> {
  const provider = getProvider();
  const apiKey = getApiKey();

  if (!apiKey || !provider) {
    throw new Error("Cle API requise pour generer des workflows.");
  }

  const formatPrompt = format === "n8n" ? N8N_PROMPT : MAKE_PROMPT;

  const userMessage = `Metier : ${metier}
Tache : ${task.nom}
Description : ${task.description}
Solution : ${task.solution}
Outils : ${task.outils_specifiques?.join(", ") ?? task.type_outil}
Ecosysteme : ${task.ecosysteme ?? "N8N"}

${formatPrompt}`;

  if (provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: WORKFLOW_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API Anthropic (${response.status})`);
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? "";
  }

  // OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 4096,
      messages: [
        { role: "system", content: WORKFLOW_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur API OpenAI (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ─── Personalized analysis (from diagnostic form) ───────────────────

import { buildPersonalizedSystemPrompt, buildUserMessage } from "@/lib/diagnosticPrompt";
import type { DiagnosticFormData } from "@/types/diagnostic";

export async function analyzeJobPersonalized(formData: DiagnosticFormData): Promise<string> {
  const provider = getProvider();
  const apiKey = getApiKey();

  if (!apiKey || !provider) {
    throw Object.assign(new Error("Aucune clé API configurée."), { requireKey: true });
  }

  const systemPrompt = buildPersonalizedSystemPrompt();
  const userMessage = buildUserMessage(formData);

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
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      let apiMessage: string | undefined;
      try { const errBody = await response.json(); apiMessage = errBody?.error?.message; } catch { /* ignore */ }
      const errInfo = getApiErrorMessage(response.status, "anthropic", apiMessage);
      throw Object.assign(new Error(errInfo.message), { showSettings: errInfo.showSettings });
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? "";
  }

  // OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 6000,
    }),
  });

  if (!response.ok) {
    let apiMessage: string | undefined;
    try { const errBody = await response.json(); apiMessage = errBody?.error?.message; } catch { /* ignore */ }
    const errInfo = getApiErrorMessage(response.status, "openai", apiMessage);
    throw Object.assign(new Error(errInfo.message), { showSettings: errInfo.showSettings });
  }

  const data2 = await response.json();
  return data2.choices?.[0]?.message?.content ?? "";
}
