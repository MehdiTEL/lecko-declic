import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://declic.fr",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("anon_id, progress_data");

  const emailsToSend: any[] = [];

  for (const row of progressRows ?? []) {
    const progress = row.progress_data as any;
    if (!progress?.trackedTasks) continue;

    const doneTasks = progress.trackedTasks.filter((t: any) => t.status === "done");
    const inProgressTasks = progress.trackedTasks.filter((t: any) => t.status === "in_progress");
    const todoTasks = progress.trackedTasks.filter((t: any) => t.status === "todo");

    if (doneTasks.length === 0 && inProgressTasks.length === 0) continue;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("email, prenom, nom, email_monthly_opt_in")
      .eq("anon_id_link", row.anon_id)
      .single();

    if (!profile?.email || profile.email_monthly_opt_in === false) continue;

    emailsToSend.push({
      email: profile.email,
      prenom: profile.prenom ?? "",
      doneTasks: doneTasks.length,
      inProgressTasks: inProgressTasks.length,
      estimatedHours: doneTasks.length * 2,
      nextTasks: todoTasks.slice(0, 3).map((t: any) => t.taskName),
      streak: progress.streak?.currentStreak ?? 0,
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ processed: emailsToSend.length, sent: 0, reason: "no_resend_key" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let sent = 0;
  for (const data of emailsToSend) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "DÉCLIC <noreply@declic.fr>",
          to: data.email,
          subject: `${data.prenom || "Bonjour"}, vous avez recupere ~${data.estimatedHours}h depuis votre diagnostic`,
          html: buildHtml(data),
        }),
      });
      await supabase.from("email_log").insert({ recipient_email: data.email, type: "monthly_progress" });
      sent++;
    } catch { /* continue */ }
  }

  return new Response(
    JSON.stringify({ processed: emailsToSend.length, sent }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

function buildHtml(d: any): string {
  const greeting = d.prenom ? `Bonjour ${d.prenom},` : "Bonjour,";
  const nextHtml = d.nextTasks.length > 0
    ? `<div style="margin:24px 0;"><p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em;">Prochaines etapes</p>${d.nextTasks.map((t: string, i: number) => `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F3F4F6;"><span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:#EEF2FF;color:#4F46E5;font-size:11px;font-weight:700;">${i + 1}</span><span style="font-size:13px;color:#374151;">${t}</span></div>`).join("")}</div>`
    : "";

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;padding:32px 24px;color:#111827;background:#fff;">
<div style="margin-bottom:32px;"><span style="font-size:18px;font-weight:700;color:#4F46E5;">DECLIC</span><span style="font-size:10px;color:#9CA3AF;margin-left:8px;"></span></div>
<p style="font-size:15px;color:#374151;margin:0 0 6px;">${greeting}</p>
<p style="font-size:15px;color:#374151;margin:0 0 24px;line-height:1.6;">Voici un point sur vos automatisations en cours.</p>
<div style="background:#F8FAFC;border-radius:14px;padding:20px;margin:0 0 24px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="text-align:center;padding:8px 12px;"><div style="font-size:28px;font-weight:700;color:#10B981;">${d.doneTasks}</div><div style="font-size:11px;color:#6B7280;margin-top:3px;">Terminees</div></td>
<td style="text-align:center;padding:8px 12px;"><div style="font-size:28px;font-weight:700;color:#4F46E5;">${d.inProgressTasks}</div><div style="font-size:11px;color:#6B7280;margin-top:3px;">En cours</div></td>
<td style="text-align:center;padding:8px 12px;"><div style="font-size:28px;font-weight:700;color:#F59E0B;">~${d.estimatedHours}h</div><div style="font-size:11px;color:#6B7280;margin-top:3px;">Recuperees</div></td>
</tr></table></div>
${nextHtml}
<div style="text-align:center;margin:28px 0;"><a href="https://declic.fr/mes-automations" style="display:inline-block;padding:13px 28px;background:#4F46E5;color:#fff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">Voir mes automations</a></div>
<p style="font-size:12px;color:#9CA3AF;text-align:center;margin:32px 0 0;line-height:1.6;">Vous recevez cet email car vous avez un diagnostic actif sur DECLIC.<br><a href="https://declic.fr/parametres" style="color:#9CA3AF;">Se desabonner</a></p>
</body></html>`;
}
