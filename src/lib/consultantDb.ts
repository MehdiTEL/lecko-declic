import { supabase } from "@/integrations/supabase/client";
import type {
  Mission,
  Entretien,
  Chantier,
  MissionStatut,
  EntretienStatut,
  EntretienMode,
  Priorite,
  Horizon,
  computePriorite,
  computeImpactAnnuel,
} from "@/types/consultant";
import type { AnalysisResult, AnalysisTask } from "@/types/analysis";

// ─── Helpers ──────────────────────────────────────────────────────────────

function handleError(res: { error: unknown }): void {
  if (res.error) throw res.error;
}

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// ─── MISSIONS ─────────────────────────────────────────────────────────────

export async function getMissions(): Promise<Mission[]> {
  const res = await (supabase.from("missions") as any)
    .select("*")
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as Mission[];
}

export async function getMission(id: string): Promise<Mission> {
  const res = await (supabase.from("missions") as any)
    .select("*, entretiens(*), chantiers(*)")
    .eq("id", id)
    .single();
  handleError(res);
  return res.data as Mission;
}

export async function createMission(
  data: Omit<Mission, "id" | "consultant_id" | "created_at" | "updated_at" | "entretiens" | "chantiers">
): Promise<Mission> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const res = await (supabase.from("missions") as any)
    .insert({ ...data, consultant_id: user.id })
    .select()
    .single();
  handleError(res);
  return res.data as Mission;
}

export async function updateMission(
  id: string,
  data: Partial<Omit<Mission, "id" | "consultant_id" | "created_at" | "entretiens" | "chantiers">>
): Promise<Mission> {
  const res = await (supabase.from("missions") as any)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as Mission;
}

export async function deleteMission(id: string): Promise<void> {
  const res = await (supabase.from("missions") as any).delete().eq("id", id);
  handleError(res);
}

// ─── ENTRETIENS ───────────────────────────────────────────────────────────

export async function createEntretien(
  data: Omit<Entretien, "id" | "created_at" | "async_token" | "async_expires_at" | "async_completed_at" | "resultats">
): Promise<Entretien> {
  const res = await (supabase.from("entretiens") as any)
    .insert(data)
    .select()
    .single();
  handleError(res);
  return res.data as Entretien;
}

export async function updateEntretien(
  id: string,
  data: Partial<Omit<Entretien, "id" | "mission_id" | "created_at">>
): Promise<Entretien> {
  const res = await (supabase.from("entretiens") as any)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as Entretien;
}

export async function getEntretienByToken(token: string): Promise<Entretien | null> {
  const res = await (supabase.from("entretiens") as any)
    .select("*")
    .eq("async_token", token)
    .gt("async_expires_at", new Date().toISOString())
    .maybeSingle();
  handleError(res);
  return res.data as Entretien | null;
}

export async function generateAsyncLink(
  entretienId: string,
  expiresInDays = 7
): Promise<{ token: string; expiresAt: string }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 86_400_000).toISOString();

  const res = await (supabase.from("entretiens") as any)
    .update({
      async_token: token,
      async_expires_at: expiresAt,
      mode: "async" as EntretienMode,
      statut: "lien_envoye" as EntretienStatut,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entretienId)
    .select()
    .single();
  handleError(res);

  return { token, expiresAt };
}

// ─── CHANTIERS ────────────────────────────────────────────────────────────

export async function createChantier(
  data: Omit<Chantier, "id" | "created_at">
): Promise<Chantier> {
  const res = await (supabase.from("chantiers") as any)
    .insert(data)
    .select()
    .single();
  handleError(res);
  return res.data as Chantier;
}

export async function updateChantier(
  id: string,
  data: Partial<Omit<Chantier, "id" | "mission_id" | "created_at">>
): Promise<Chantier> {
  const res = await (supabase.from("chantiers") as any)
    .update(data)
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as Chantier;
}

export async function deleteChantier(id: string): Promise<void> {
  const res = await (supabase.from("chantiers") as any).delete().eq("id", id);
  handleError(res);
}

export async function reorderChantiers(
  items: { id: string; ordre: number }[]
): Promise<void> {
  const updates = items.map((item) =>
    (supabase.from("chantiers") as any)
      .update({ ordre: item.ordre })
      .eq("id", item.id)
  );
  const results = await Promise.all(updates);
  results.forEach(handleError);
}

// ─── IMPORT TASKS → CHANTIERS ─────────────────────────────────────────────

export async function importTasksAsChantiers(
  missionId: string,
  entretienId: string,
  serviceName: string,
  metier: string,
  tasks: AnalysisTask[]
): Promise<Chantier[]> {
  const rows = tasks.map((task, index) => ({
    mission_id: missionId,
    entretien_id: entretienId,
    titre: task.nom,
    description: task.description,
    service_concerne: serviceName,
    metier_source: metier,
    categorie: task.categorie,
    type_outil: task.type_outil,
    ecosysteme: task.ecosysteme ?? null,
    niveau_accompagnement: task.niveau_accompagnement ?? null,
    temps_gagne_heures_semaine: task.temps_gagne_heures_semaine,
    nb_personnes_impactees: 1,
    score_impact: 3,
    score_effort: 3,
    priorite: "normale",
    statut: "identifie",
    prerequis: task.prerequis ?? [],
    ordre: index,
  }));

  const res = await (supabase.from("chantiers") as any)
    .insert(rows)
    .select();
  handleError(res);
  return res.data as Chantier[];
}
