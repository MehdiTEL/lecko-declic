import { supabase } from "@/integrations/supabase/client";

export function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `DECLIC-${rand}`;
}

function getAnonId(): string {
  const KEY = "declic-anon-id";
  let id = localStorage.getItem(KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
  return id;
}

export async function createTeamSession(nom: string): Promise<string> {
  const code = generateSessionCode();
  const { error } = await (supabase.from("team_sessions") as any).insert({
    code, nom, created_by: getAnonId(),
  });
  if (error) throw new Error(error.message);
  return code;
}

export async function joinTeamSession(code: string, metier: string, count: number): Promise<string> {
  // Get session
  const { data: session, error: sErr } = await (supabase.from("team_sessions") as any)
    .select("id").eq("code", code.toUpperCase().trim()).single();
  if (sErr || !session) throw new Error("Session introuvable. Verifiez le code.");

  // Insert member
  const { data: member, error: mErr } = await (supabase.from("team_members") as any)
    .insert({ session_id: session.id, metier, count, anon_id: getAnonId() })
    .select("id").single();
  if (mErr) throw new Error(mErr.message);
  return member.id;
}

export async function loadTeamSession(code: string): Promise<{ session: any; members: any[] }> {
  const { data: session, error: sErr } = await (supabase.from("team_sessions") as any)
    .select("*").eq("code", code.toUpperCase().trim()).single();
  if (sErr || !session) throw new Error("Session introuvable.");

  const { data: members, error: mErr } = await (supabase.from("team_members") as any)
    .select("*").eq("session_id", session.id).order("joined_at", { ascending: true });
  if (mErr) throw new Error(mErr.message);

  return { session, members: members ?? [] };
}

export async function updateMemberResult(memberId: string, result: object): Promise<void> {
  const { error } = await (supabase.from("team_members") as any)
    .update({ result }).eq("id", memberId);
  if (error) throw new Error(error.message);
}
