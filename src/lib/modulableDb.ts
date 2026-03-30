import { supabase } from "@/integrations/supabase/client";
import type {
  MissionTemplate,
  QuestionnaireTemplate,
  ChantierLibraryItem,
  StackConfig,
  CustomMetier,
  MissionConfig,
  PortailClient,
  CommentaireClient,
  ValidationClient,
  ValidationStatut,
  DEFAULT_MISSION_CONFIG as DEFAULT_MISSION_CONFIG_TYPE,
} from "@/types/modulable";
import { DEFAULT_MISSION_CONFIG } from "@/types/modulable";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function handleError(res: { error: unknown }): void {
  if (res.error) throw res.error;
}

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

async function getConsultantId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

// ─── MISSION TEMPLATES ───────────────────────────────────────────────────────

export async function getMissionTemplates(): Promise<MissionTemplate[]> {
  const res = await // @ts-ignore
  supabase.from("mission_templates")
    .select("*")
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as MissionTemplate[];
}

export async function createMissionTemplate(
  data: Omit<MissionTemplate, "id" | "consultant_id" | "created_at" | "updated_at">
): Promise<MissionTemplate> {
  const consultant_id = await getConsultantId();
  const res = await // @ts-ignore
  supabase.from("mission_templates")
    .insert({ ...data, consultant_id })
    .select()
    .single();
  handleError(res);
  return res.data as MissionTemplate;
}

export async function updateMissionTemplate(
  id: string,
  data: Partial<Omit<MissionTemplate, "id" | "consultant_id" | "created_at">>
): Promise<MissionTemplate> {
  const res = await // @ts-ignore
  supabase.from("mission_templates")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as MissionTemplate;
}

export async function deleteMissionTemplate(id: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("mission_templates").delete().eq("id", id);
  handleError(res);
}

// ─── QUESTIONNAIRES ──────────────────────────────────────────────────────────

export async function getQuestionnaires(): Promise<QuestionnaireTemplate[]> {
  const res = await // @ts-ignore
  supabase.from("questionnaire_templates")
    .select("*")
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as QuestionnaireTemplate[];
}

export async function getQuestionnaire(id: string): Promise<QuestionnaireTemplate> {
  const res = await // @ts-ignore
  supabase.from("questionnaire_templates")
    .select("*")
    .eq("id", id)
    .single();
  handleError(res);
  return res.data as QuestionnaireTemplate;
}

export async function createQuestionnaire(
  data: Omit<QuestionnaireTemplate, "id" | "consultant_id" | "created_at" | "updated_at">
): Promise<QuestionnaireTemplate> {
  const consultant_id = await getConsultantId();
  const res = await // @ts-ignore
  supabase.from("questionnaire_templates")
    .insert({ ...data, consultant_id })
    .select()
    .single();
  handleError(res);
  return res.data as QuestionnaireTemplate;
}

export async function updateQuestionnaire(
  id: string,
  data: Partial<Omit<QuestionnaireTemplate, "id" | "consultant_id" | "created_at">>
): Promise<QuestionnaireTemplate> {
  const res = await // @ts-ignore
  supabase.from("questionnaire_templates")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as QuestionnaireTemplate;
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("questionnaire_templates").delete().eq("id", id);
  handleError(res);
}

// ─── CHANTIER LIBRARY ────────────────────────────────────────────────────────

export async function getChantierLibrary(
  filters?: { categorie?: string; secteur?: string; tags?: string[] }
): Promise<ChantierLibraryItem[]> {
  let query = // @ts-ignore
  supabase.from("chantier_library")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.categorie) {
    query = query.eq("categorie", filters.categorie);
  }
  if (filters?.secteur) {
    query = query.eq("secteur", filters.secteur);
  }
  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps("tags", filters.tags);
  }

  const res = await query;
  handleError(res);
  return res.data as ChantierLibraryItem[];
}

export async function createChantierLibraryItem(
  data: Omit<ChantierLibraryItem, "id" | "consultant_id" | "created_at" | "updated_at">
): Promise<ChantierLibraryItem> {
  const consultant_id = await getConsultantId();
  const res = await // @ts-ignore
  supabase.from("chantier_library")
    .insert({ ...data, consultant_id })
    .select()
    .single();
  handleError(res);
  return res.data as ChantierLibraryItem;
}

export async function updateChantierLibraryItem(
  id: string,
  data: Partial<Omit<ChantierLibraryItem, "id" | "consultant_id" | "created_at">>
): Promise<ChantierLibraryItem> {
  const res = await // @ts-ignore
  supabase.from("chantier_library")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as ChantierLibraryItem;
}

export async function deleteChantierLibraryItem(id: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("chantier_library").delete().eq("id", id);
  handleError(res);
}

export async function importChantierToMission(
  libraryItemId: string,
  missionId: string
): Promise<void> {
  // 1. Read the library item
  const libRes = await // @ts-ignore
  supabase.from("chantier_library")
    .select("*")
    .eq("id", libraryItemId)
    .single();
  handleError(libRes);
  const item = libRes.data as ChantierLibraryItem;

  // 2. Insert into chantiers with mission_id and copied fields
  const res = await // @ts-ignore
  supabase.from("chantiers")
    .insert({
      mission_id: missionId,
      titre: item.titre,
      description: item.description,
      categorie: item.categorie,
      type_outil: item.type_outil,
      ecosysteme: item.ecosysteme,
      niveau_accompagnement: item.niveau_accompagnement,
      temps_gagne_heures_semaine: item.temps_gagne_heures_semaine,
      score_impact: item.score_impact,
      score_effort: item.score_effort,
      horizon: item.horizon,
      budget_estime: item.budget_estime,
      prerequis: item.prerequis,
      statut: "identifie",
      priorite: "normale",
      ordre: 0,
    })
    .select()
    .single();
  handleError(res);
}

// ─── STACK CONFIGS ───────────────────────────────────────────────────────────

export async function getStackConfigs(): Promise<StackConfig[]> {
  const res = await // @ts-ignore
  supabase.from("stack_configs")
    .select("*")
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as StackConfig[];
}

export async function createStackConfig(
  data: Omit<StackConfig, "id" | "consultant_id" | "created_at" | "updated_at">
): Promise<StackConfig> {
  const consultant_id = await getConsultantId();
  const res = await // @ts-ignore
  supabase.from("stack_configs")
    .insert({ ...data, consultant_id })
    .select()
    .single();
  handleError(res);
  return res.data as StackConfig;
}

export async function updateStackConfig(
  id: string,
  data: Partial<Omit<StackConfig, "id" | "consultant_id" | "created_at">>
): Promise<StackConfig> {
  const res = await // @ts-ignore
  supabase.from("stack_configs")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as StackConfig;
}

// ─── CUSTOM METIERS ──────────────────────────────────────────────────────────

export async function getCustomMetiers(): Promise<CustomMetier[]> {
  const res = await // @ts-ignore
  supabase.from("custom_metiers")
    .select("*")
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as CustomMetier[];
}

export async function createCustomMetier(
  data: Omit<CustomMetier, "id" | "consultant_id" | "created_at" | "updated_at">
): Promise<CustomMetier> {
  const consultant_id = await getConsultantId();
  const res = await // @ts-ignore
  supabase.from("custom_metiers")
    .insert({ ...data, consultant_id })
    .select()
    .single();
  handleError(res);
  return res.data as CustomMetier;
}

export async function updateCustomMetier(
  id: string,
  data: Partial<Omit<CustomMetier, "id" | "consultant_id" | "created_at">>
): Promise<CustomMetier> {
  const res = await // @ts-ignore
  supabase.from("custom_metiers")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as CustomMetier;
}

export async function deleteCustomMetier(id: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("custom_metiers").delete().eq("id", id);
  handleError(res);
}

// ─── MISSION CONFIG ──────────────────────────────────────────────────────────

export async function getMissionConfig(missionId: string): Promise<MissionConfig> {
  const res = await // @ts-ignore
  supabase.from("missions")
    .select("config")
    .eq("id", missionId)
    .single();
  handleError(res);

  const stored = (res.data?.config ?? {}) as Partial<MissionConfig>;

  // Deep merge with defaults
  return {
    scoring: {
      ...DEFAULT_MISSION_CONFIG.scoring,
      ...stored.scoring,
      criteres: stored.scoring?.criteres ?? DEFAULT_MISSION_CONFIG.scoring.criteres,
    },
    affichage: {
      ...DEFAULT_MISSION_CONFIG.affichage,
      ...stored.affichage,
    },
    export: {
      ...DEFAULT_MISSION_CONFIG.export,
      ...stored.export,
    },
    portail: {
      ...DEFAULT_MISSION_CONFIG.portail,
      ...stored.portail,
      sections_visibles:
        stored.portail?.sections_visibles ?? DEFAULT_MISSION_CONFIG.portail.sections_visibles,
    },
  };
}

export async function updateMissionConfig(
  missionId: string,
  config: Partial<MissionConfig>
): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("missions")
    .update({ config, updated_at: new Date().toISOString() })
    .eq("id", missionId);
  handleError(res);
}

// ─── PORTAIL CLIENT ──────────────────────────────────────────────────────────

export async function getOrCreatePortail(missionId: string): Promise<PortailClient> {
  // Try to find existing
  const existing = await // @ts-ignore
  supabase.from("portail_clients")
    .select("*")
    .eq("mission_id", missionId)
    .maybeSingle();
  handleError(existing);

  if (existing.data) {
    return existing.data as PortailClient;
  }

  // Create new
  const token = generateToken();
  const res = await // @ts-ignore
  supabase.from("portail_clients")
    .insert({ mission_id: missionId, token, actif: true })
    .select()
    .single();
  handleError(res);
  return res.data as PortailClient;
}

export async function getPortailByToken(token: string): Promise<PortailClient | null> {
  const res = await // @ts-ignore
  supabase.from("portail_clients")
    .select("*")
    .eq("token", token)
    .eq("actif", true)
    .maybeSingle();
  handleError(res);
  return res.data as PortailClient | null;
}

export async function togglePortailActif(
  missionId: string,
  actif: boolean
): Promise<void> {
  // Update portail_clients
  const res = await // @ts-ignore
  supabase.from("portail_clients")
    .update({ actif })
    .eq("mission_id", missionId);
  handleError(res);

  // Also update the flag on the mission
  const mRes = await // @ts-ignore
  supabase.from("missions")
    .update({ portail_client_actif: actif, updated_at: new Date().toISOString() })
    .eq("id", missionId);
  handleError(mRes);
}

export async function logPortailVisit(token: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("portail_clients")
    .update({
      derniere_visite: new Date().toISOString(),
      // @ts-ignore
      nb_visites: supabase.rpc("increment_nb_visites", { p_token: token }),
    })
    .eq("token", token);

  // Fallback: if RPC not available, do raw increment
  if (res.error) {
    const current = await // @ts-ignore
  supabase.from("portail_clients")
      .select("nb_visites")
      .eq("token", token)
      .single();
    if (!current.error && current.data) {
      await // @ts-ignore
  supabase.from("portail_clients")
        .update({
          derniere_visite: new Date().toISOString(),
          nb_visites: (current.data.nb_visites ?? 0) + 1,
        })
        .eq("token", token);
    }
  }
}

// ─── COMMENTAIRES ────────────────────────────────────────────────────────────

export async function getCommentaires(missionId: string): Promise<CommentaireClient[]> {
  const res = await // @ts-ignore
  supabase.from("commentaires_client")
    .select("*")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as CommentaireClient[];
}

export async function addCommentaire(
  payload: Omit<CommentaireClient, "id" | "reponse_consultant" | "lu" | "created_at">
): Promise<CommentaireClient> {
  const res = await // @ts-ignore
  supabase.from("commentaires_client")
    .insert(payload)
    .select()
    .single();
  handleError(res);
  return res.data as CommentaireClient;
}

export async function repondreCommentaire(
  id: string,
  reponse: string
): Promise<CommentaireClient> {
  const res = await // @ts-ignore
  supabase.from("commentaires_client")
    .update({ reponse_consultant: reponse, lu: true })
    .eq("id", id)
    .select()
    .single();
  handleError(res);
  return res.data as CommentaireClient;
}

export async function marquerLu(id: string): Promise<void> {
  const res = await // @ts-ignore
  supabase.from("commentaires_client")
    .update({ lu: true })
    .eq("id", id);
  handleError(res);
}

// ─── VALIDATIONS ─────────────────────────────────────────────────────────────

export async function getValidations(missionId: string): Promise<ValidationClient[]> {
  const res = await // @ts-ignore
  supabase.from("validations_client")
    .select("*")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: false });
  handleError(res);
  return res.data as ValidationClient[];
}

export async function upsertValidation(
  payload: Omit<ValidationClient, "id" | "created_at">
): Promise<ValidationClient> {
  const res = await // @ts-ignore
  supabase.from("validations_client")
    .upsert(
      {
        ...payload,
        validated_at: payload.statut === "valide" ? new Date().toISOString() : payload.validated_at,
      },
      { onConflict: "mission_id,chantier_id" }
    )
    .select()
    .single();
  handleError(res);
  return res.data as ValidationClient;
}
