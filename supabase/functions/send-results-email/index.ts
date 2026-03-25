import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigin = Deno.env.get("ENVIRONMENT") === "development"
  ? "http://localhost:5173"
  : "https://declic.lecko.fr";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { to, nom, metier, score, heures, topTasks, totalTasks } = await req.json();

    if (!to) {
      return new Response(JSON.stringify({ error: "Email requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — lead captured, email not sent.");
      return new Response(JSON.stringify({ sent: false, reason: "email_service_not_configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prenom = nom?.split(" ")[0] ?? "";
    const greeting = prenom ? `Bonjour ${prenom},` : "Bonjour,";

    const tasksHtml = topTasks.map((task: string, i: number) =>
      `<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #F3F4F6;">
        <span style="display:inline-block;width:24px;height:24px;border-radius:6px;background:#2563EB;color:white;font-size:12px;font-weight:700;text-align:center;line-height:24px;">${i + 1}</span>
        <span style="font-size:14px;color:#374151;">${task}</span>
      </div>`
    ).join("");

    const emailHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;background:#fff;">
<div style="margin-bottom:32px;"><span style="font-size:20px;font-weight:700;color:#2563EB;">DECLIC</span><span style="font-size:11px;color:#6B7280;margin-left:8px;">by Lecko</span></div>
<p style="font-size:15px;line-height:1.6;color:#374151;">${greeting}</p>
<p style="font-size:15px;line-height:1.6;color:#374151;">Voici le récapitulatif de votre diagnostic IA pour le métier de <strong>${metier}</strong>.</p>
<div style="background:#F8FAFC;border-radius:12px;padding:24px;margin:24px 0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#2563EB;">${score}%</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">Score</div></td>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#111827;">${totalTasks}</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">Tâches</div></td>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#F59E0B;">${heures}h</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">/ semaine</div></td>
</tr></table></div>
<div style="text-align:center;margin:28px 0;"><a href="https://declic.lecko.fr/resultats?metier=${encodeURIComponent(metier)}" style="display:inline-block;padding:12px 28px;background:#2563EB;color:white;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Voir mon diagnostic complet</a></div>
<p style="font-size:14px;font-weight:600;color:#111827;margin-bottom:12px;">Vos 3 tâches les plus impactantes :</p>
${tasksHtml}
<div style="background:#2563EB;border-radius:12px;padding:24px;margin:32px 0;text-align:center;">
<p style="font-size:15px;color:white;font-weight:600;margin:0 0 8px 0;">Passer à la mise en oeuvre ?</p>
<p style="font-size:13px;color:rgba(255,255,255,0.75);margin:0 0 16px 0;">Nos consultants peuvent vous accompagner.</p>
<a href="https://calendly.com/lecko/decouverte" style="display:inline-block;background:white;color:#2563EB;font-weight:600;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none;">Prendre rendez-vous</a>
</div>
<p style="font-size:12px;color:#9CA3AF;margin-top:32px;">Diagnostic généré par DÉCLIC — <a href="https://lecko.fr" style="color:#2563EB;">lecko.fr</a></p>
</body></html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "DECLIC by Lecko <noreply@lecko.fr>",
        to: [to],
        subject: `Votre diagnostic IA - ${metier} - ${score}% automatisable`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend error:", response.status, errText);
      return new Response(JSON.stringify({ sent: false }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-results-email error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
