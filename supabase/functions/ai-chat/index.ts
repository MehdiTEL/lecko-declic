import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const DAILY_LIMIT_ANON = 20;
const DAILY_LIMIT_AUTH = 50;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    const { messages, sessionId, context } = await req.json();

    // Rate limiting
    const today = new Date().toISOString().split("T")[0];
    const { count } = await supabase
      .from("ai_usage")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00Z`)
      .or(userId ? `user_id.eq.${userId}` : `session_id.eq.${sessionId}`);

    const limit = userId ? DAILY_LIMIT_AUTH : DAILY_LIMIT_ANON;
    if ((count ?? 0) >= limit) {
      return new Response(
        JSON.stringify({ error: "rate_limit", message: "Limite quotidienne atteinte." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `Tu es un assistant pédagogique spécialisé en IA pour la plateforme DÉCLIC. Tu aides les utilisateurs à comprendre les concepts de leurs formations et à appliquer l'IA dans leur métier. Sois concis, pratique et encourageant. Réponds en français.${context ? `\n\nContexte de la formation en cours : ${context}` : ""}`,
        messages: messages.slice(-10), // Keep last 10 messages
      }),
    });

    const data = await response.json();

    // Track usage
    await supabase.from("ai_usage").insert({
      user_id: userId,
      session_id: userId ? null : sessionId,
      tokens_used: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    });

    return new Response(
      JSON.stringify({
        content: data.content?.[0]?.text ?? "Désolé, je n'ai pas pu répondre.",
        remaining: limit - (count ?? 0) - 1,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "server_error", message: "Erreur serveur." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
