import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un expert en transformation digitale et automatisation des processus métier, spécialisé dans le conseil aux organisations.

L'utilisateur va te donner un intitulé de métier.

Tu dois :
1. Lister 8 à 12 tâches quotidiennes typiques et réalistes de ce métier
2. Pour chaque tâche, évaluer honnêtement son potentiel d'automatisation
3. Recommander une solution concrète et actionnable d'automatisation
4. Estimer le temps gagné par semaine pour chaque tâche

Sois précis dans les noms d'outils : cite des outils réels (N8N, Make/Zapier, Claude, ChatGPT, Notion AI, Power Automate, etc.).

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks markdown, avec cette structure exacte :
{
  "metier": "string",
  "score_global": number,
  "heures_economisees_semaine": number,
  "taches": [
    {
      "nom": "string",
      "description": "string",
      "categorie": "automatisable" | "partiellement_automatisable" | "difficilement_automatisable",
      "solution": "string",
      "type_outil": "Agent IA" | "Workflow N8N" | "Automatisation No-Code" | "Copilot / Assistant IA" | "Script personnalisé",
      "temps_gagne_heures_semaine": number
    }
  ]
}`;

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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Clé API OpenAI non configurée." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
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
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return new Response(JSON.stringify({ error: `Erreur API IA : ${response.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
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
