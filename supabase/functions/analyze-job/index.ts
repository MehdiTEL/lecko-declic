import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS — restrict to production domain, allow localhost in dev
const allowedOrigin = Deno.env.get("ENVIRONMENT") === "development"
  ? "http://localhost:5173"
  : "https://declic.fr";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Full enriched SYSTEM_PROMPT — identical to src/lib/aiProvider.ts
const SYSTEM_PROMPT = `Tu es un expert en transformation digitale et automatisation des processus métier spécialisé dans la plateforme DÉCLIC. Tu appliques la méthode DÉCLIC.

L'utilisateur va te donner un intitulé de métier.

Tu dois :
1. Lister 8 à 12 tâches quotidiennes typiques et réalistes de ce métier
2. Pour chaque tâche, évaluer les 5 critères DÉCLIC (true/false)
3. Recommander une solution concrète avec des outils PRÉCIS (pas de recommandation vague)
4. Estimer le temps gagné par semaine
5. Indiquer si la tâche peut fonctionner SANS IA
6. Attribuer un NIVEAU D'ACCOMPAGNEMENT :
   - "express" : l'utilisateur peut le faire seul en quelques heures avec un tuto.
   - "guide" : l'utilisateur peut le faire avec l'aide du DÉCLIC Copilot en quelques jours.
   - "consultant" : nécessite un accompagnement expert (intégration SI, conduite du changement).
7. Indiquer l'ÉCOSYSTÈME D'OUTILS précis et les outils spécifiques
8. Estimer la COMPLEXITÉ de mise en place et le TEMPS en jours ouvrés
9. Lister les PRÉREQUIS techniques
10. Évaluer la DIMENSION ORGANISATIONNELLE (perimetre_impact, niveau_changement, risque_adoption)

RÈGLE COMMERCIALE : ~35% express, ~35% guide, ~30% consultant.

Les 5 critères DÉCLIC (true/false) :
- recurrence, energie, scalabilite, fiabilite, penibilite

Principe "Sans IA d'abord" : peut_fonctionner_sans_ia = true si des règles simples suffisent.

Écosystèmes : M365_PowerAutomate, M365_Copilot, N8N, Make_Zapier, Google_AppsScript, LLM_API, Agent_IA, Notion_Airtable, Python_Script, RPA, Natif_SaaS

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
      "solution": "string",
      "type_outil": "Agent IA" | "Workflow N8N" | "Automatisation No-Code" | "Copilot / Assistant IA" | "Script personnalisé",
      "ecosysteme": "M365_PowerAutomate" | "M365_Copilot" | "N8N" | "Make_Zapier" | "Google_AppsScript" | "LLM_API" | "Agent_IA" | "Notion_Airtable" | "Python_Script" | "RPA" | "Natif_SaaS",
      "outils_specifiques": ["string"],
      "temps_gagne_heures_semaine": number,
      "peut_fonctionner_sans_ia": boolean,
      "raison_ia": "string ou null",
      "niveau_accompagnement": "express" | "guide" | "consultant",
      "raison_accompagnement": "string",
      "complexite": "faible" | "moyenne" | "elevee",
      "temps_mise_en_place_jours": number,
      "prerequis": ["string"],
      "perimetre_impact": "moi_seul" | "mon_equipe" | "multi_services" | "externe",
      "niveau_changement": "transparent" | "leger" | "moyen" | "fort",
      "risque_adoption": "faible" | "moyen" | "eleve",
      "actions_conduite_changement": "string ou null"
    }
  ]
}`;

// Call Anthropic API (Claude)
async function callAnthropic(metier: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 5000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Métier : ${metier}` }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Anthropic error:", response.status, errText);
    throw new Error(`Erreur API Anthropic : ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

// Call OpenAI API (GPT-4o)
async function callOpenAI(metier: string, apiKey: string): Promise<string> {
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
    const errText = await response.text();
    console.error("OpenAI error:", response.status, errText);
    throw new Error(`Erreur API OpenAI : ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { metier } = await req.json();
    if (!metier || typeof metier !== "string") {
      return new Response(JSON.stringify({ error: "Le métier est requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try Anthropic first, then OpenAI as fallback
    const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!ANTHROPIC_KEY && !OPENAI_KEY) {
      return new Response(JSON.stringify({ error: "Aucune clé API configurée sur le serveur." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let content: string;
    if (ANTHROPIC_KEY) {
      content = await callAnthropic(metier, ANTHROPIC_KEY);
    } else {
      content = await callOpenAI(metier, OPENAI_KEY!);
    }

    // Parse JSON from AI response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON invalide retourné par l'IA.");
      parsed = JSON.parse(match[0]);
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-job error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
