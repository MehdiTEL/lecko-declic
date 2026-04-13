import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const allowedOrigin = Deno.env.get("ENVIRONMENT") === "development"
  ? "http://localhost:5173"
  : "https://declic.fr";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { to, nom, metier, score, heures, topTasks, totalTasks, source, entreprise, taille_equipe, stack, secteur, message } = body;

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
        <span style="display:inline-block;width:24px;height:24px;border-radius:6px;background:#4F46E5;color:white;font-size:12px;font-weight:700;text-align:center;line-height:24px;">${i + 1}</span>
        <span style="font-size:14px;color:#374151;">${task}</span>
      </div>`
    ).join("");

    const emailHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827;background:#fff;">
<div style="margin-bottom:32px;"><span style="font-size:20px;font-weight:700;color:#4F46E5;">DECLIC</span><span style="font-size:11px;color:#6B7280;margin-left:8px;"></span></div>
<p style="font-size:15px;line-height:1.6;color:#374151;">${greeting}</p>
<p style="font-size:15px;line-height:1.6;color:#374151;">Voici le récapitulatif de votre diagnostic IA pour le métier de <strong>${metier}</strong>.</p>
<div style="background:#F8FAFC;border-radius:12px;padding:24px;margin:24px 0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#4F46E5;">${score}%</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">Score</div></td>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#111827;">${totalTasks}</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">Tâches</div></td>
<td style="text-align:center;padding:8px;"><div style="font-size:32px;font-weight:700;color:#F59E0B;">${heures}h</div><div style="font-size:11px;color:#6B7280;margin-top:4px;">/ semaine</div></td>
</tr></table></div>
<div style="text-align:center;margin:28px 0;"><a href="https://declic.fr/resultats?metier=${encodeURIComponent(metier)}" style="display:inline-block;padding:12px 28px;background:#4F46E5;color:white;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Voir mon diagnostic complet</a></div>
<p style="font-size:14px;font-weight:600;color:#111827;margin-bottom:12px;">Vos 3 tâches les plus impactantes :</p>
${tasksHtml}
<div style="background:#4F46E5;border-radius:12px;padding:24px;margin:32px 0;text-align:center;">
<p style="font-size:15px;color:white;font-weight:600;margin:0 0 8px 0;">Passer à la mise en oeuvre ?</p>
<p style="font-size:13px;color:rgba(255,255,255,0.75);margin:0 0 16px 0;">Nos consultants peuvent vous accompagner.</p>
<a href="https://calendly.com/declic/decouverte" style="display:inline-block;background:white;color:#4F46E5;font-weight:600;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none;">Prendre rendez-vous</a>
</div>
<p style="font-size:12px;color:#9CA3AF;margin-top:32px;">Diagnostic généré par DÉCLIC — <a href="https://declic.fr" style="color:#4F46E5;">declic.fr</a></p>
</body></html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "DÉCLIC <noreply@declic.fr>",
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

    // ── Send consultant brief if this is a contact request ──
    const CONSULTANT_EMAIL = Deno.env.get("CONSULTANT_NOTIFICATION_EMAIL") ?? "contact@declic.fr";
    const isContactRequest = ["cta_resultats_principal", "declic_contact", "cta_diagnostic"].includes(source ?? "");
    if (isContactRequest) {
      try {
        const briefHtml = buildConsultantBriefHtml({ nom, email: to, metier, score, heures, topTasks: topTasks ?? [], totalTasks: totalTasks ?? 0, source: source ?? "unknown", entreprise, taille_equipe, stack, secteur, message });
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "DECLIC <noreply@declic.fr>",
            to: [CONSULTANT_EMAIL],
            reply_to: to,
            subject: `[DECLIC Lead] ${nom ?? "Anonyme"} — ${metier ?? "?"} — Score ${score ?? "?"}%`,
            html: briefHtml,
          }),
        });
      } catch (briefErr) {
        console.error("Consultant brief send failed:", briefErr);
      }
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-results-email error:", e);
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

function buildConsultantBriefHtml(data: {
  nom: string; email: string; metier: string; score: number; heures: number;
  topTasks: string[]; totalTasks: number; source: string;
  entreprise?: string | null; taille_equipe?: string | null;
  stack?: string | null; secteur?: string | null; message?: string | null;
}): string {
  const scoreColor = data.score >= 65 ? "#10B981" : data.score >= 45 ? "#F59E0B" : "#6B7280";
  const ctx = [
    data.entreprise && ["Entreprise", data.entreprise],
    data.secteur && ["Secteur", data.secteur],
    data.stack && ["Stack", data.stack],
    data.taille_equipe && ["Equipe", data.taille_equipe],
    ["Source", data.source],
    ["Date", new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
  ].filter(Boolean) as [string, string][];

  const tasksHtml = (data.topTasks ?? []).map((t, i) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;">
      <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:#EEF2FF;color:#4F46E5;font-size:10px;font-weight:700;margin-right:8px;">${i+1}</span>
      <span style="font-size:13px;color:#111827;">${t}</span>
    </td></tr>`
  ).join("");

  const ctxHtml = ctx.map(([l, v]) =>
    `<tr><td style="padding:5px 0;font-size:12px;color:#6B7280;width:120px;">${l}</td><td style="padding:5px 0;font-size:12px;color:#111827;font-weight:500;">${v}</td></tr>`
  ).join("");

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:28px 24px;color:#111827;background:#fff;">
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #4F46E5;">
  <div><span style="font-size:16px;font-weight:700;color:#4F46E5;">DECLIC</span><span style="font-size:10px;color:#9CA3AF;margin-left:6px;">Nouveau lead</span></div>
  <span style="font-size:11px;font-weight:600;color:#6B7280;background:#F3F4F6;padding:4px 10px;border-radius:20px;">${data.source}</span>
</div>
<div style="background:#F8FAFC;border-radius:12px;padding:18px;margin-bottom:20px;">
  <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 4px;">${data.nom ?? "Anonyme"}</p>
  <p style="font-size:13px;color:#4F46E5;margin:0 0 12px;"><a href="mailto:${data.email}" style="color:#4F46E5;">${data.email}</a></p>
  <p style="font-size:13px;color:#374151;margin:0;">Metier : <strong>${data.metier ?? "Non precise"}</strong></p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
  <tr style="background:#EEF2FF;">
    <td style="text-align:center;padding:16px 12px;"><div style="font-size:32px;font-weight:700;color:${scoreColor};">${data.score ?? "?"}%</div><div style="font-size:11px;color:#6B7280;">Score</div></td>
    <td style="text-align:center;padding:16px 12px;border-left:1px solid #E5E7EB;"><div style="font-size:32px;font-weight:700;color:#F59E0B;">${data.heures ?? "?"}h</div><div style="font-size:11px;color:#6B7280;">/ semaine</div></td>
    <td style="text-align:center;padding:16px 12px;border-left:1px solid #E5E7EB;"><div style="font-size:32px;font-weight:700;color:#111827;">${data.totalTasks ?? "?"}</div><div style="font-size:11px;color:#6B7280;">Taches</div></td>
  </tr>
</table>
${tasksHtml ? `<p style="font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Top taches automatisables</p><table width="100%" style="margin-bottom:20px;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;">${tasksHtml}</table>` : ""}
${ctx.length > 0 ? `<p style="font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Contexte</p><table width="100%" style="margin-bottom:20px;padding:14px 16px;background:#F8FAFC;border-radius:10px;">${ctxHtml}</table>` : ""}
${data.message ? `<p style="font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Message</p><div style="padding:14px 16px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;font-size:13px;color:#374151;line-height:1.6;margin-bottom:20px;">${data.message}</div>` : ""}
<div style="text-align:center;padding:20px 0;">
  <a href="mailto:${data.email}?subject=Suite de votre cartographie DECLIC — ${data.metier}" style="display:inline-block;padding:12px 28px;background:#4F46E5;color:#fff;font-size:13px;font-weight:600;border-radius:9px;text-decoration:none;">Repondre a ${(data.nom ?? "").split(" ")[0] || "ce lead"}</a>
</div>
<p style="font-size:11px;color:#D1D5DB;text-align:center;margin-top:16px;">Lead genere via DÉCLIC</p>
</body></html>`;
}
