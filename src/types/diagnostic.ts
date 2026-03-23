// ═══════════════════════════════════════════════════════════
// DIAGNOSTIC FORM TYPES
// ═══════════════════════════════════════════════════════════

export type OrgSize = "solo" | "small" | "medium" | "large" | "enterprise";
export type Sector = "public" | "private" | "nonprofit" | "education" | "health";

export const ORG_SIZE_LABELS: Record<OrgSize, string> = {
  solo: "Indépendant / Freelance",
  small: "TPE (1-10 personnes)",
  medium: "PME (11-250 personnes)",
  large: "ETI (251-5000 personnes)",
  enterprise: "Grande entreprise (5000+)",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  public: "Secteur public / Collectivité",
  private: "Entreprise privée",
  nonprofit: "Association / ONG",
  education: "Éducation / Formation",
  health: "Santé / Médico-social",
};

export const TOOL_OPTIONS = [
  { id: "m365", label: "Microsoft 365 (Outlook, Teams, SharePoint)" },
  { id: "google", label: "Google Workspace (Gmail, Drive, Sheets)" },
  { id: "notion", label: "Notion" },
  { id: "slack", label: "Slack" },
  { id: "hubspot", label: "HubSpot" },
  { id: "salesforce", label: "Salesforce" },
  { id: "jira", label: "Jira / Confluence" },
  { id: "trello", label: "Trello / Asana" },
  { id: "sap", label: "SAP / ERP" },
  { id: "sage", label: "Sage / Cegid" },
  { id: "other", label: "Autre" },
] as const;

export type ToolId = (typeof TOOL_OPTIONS)[number]["id"];

export const AUTOMATION_EXPERIENCE_OPTIONS = [
  { id: "none", label: "Aucune — je débute complètement" },
  { id: "curious", label: "Curieux — j'ai lu/vu des démos" },
  { id: "beginner", label: "Débutant — j'ai testé 1-2 outils" },
  { id: "intermediate", label: "Intermédiaire — j'utilise déjà des automatisations" },
  { id: "advanced", label: "Avancé — j'ai créé mes propres workflows" },
] as const;

export type AutomationExperience = (typeof AUTOMATION_EXPERIENCE_OPTIONS)[number]["id"];

// ─── IT Constraints ──────────────────────────────────────────

export type ContrainteIT =
  | "m365_only"
  | "google_only"
  | "no_external_tools"
  | "no_external_api"
  | "cloud_only"
  | "on_premise_only"
  | "budget_zero"
  | "validation_dsi"
  | "donnees_sensibles"
  | "aucune";

export const CONTRAINTE_LABELS: Record<ContrainteIT, {
  label: string;
  detail: string;
  impact: string;
}> = {
  m365_only: {
    label: "Environnement Microsoft 365 uniquement",
    detail: "Seuls les outils M365 sont autorisés.",
    impact: "Recommander exclusivement Power Automate, Power Apps, Copilot M365, SharePoint, Power BI. Pas de N8N, Make, Zapier.",
  },
  google_only: {
    label: "Environnement Google Workspace uniquement",
    detail: "Seuls les outils Google sont autorisés.",
    impact: "Recommander Google Apps Script, AppSheet, Google Sheets, Gmail filters. Pas d'outils Microsoft ni tiers.",
  },
  no_external_tools: {
    label: "Pas d'outils tiers non approuvés",
    detail: "La DSI n'autorise pas les outils non référencés.",
    impact: "Privilégier les fonctionnalités natives. Mentionner pour chaque outil tiers qu'une validation DSI est nécessaire.",
  },
  no_external_api: {
    label: "Pas d'envoi de données vers l'extérieur",
    detail: "Les données ne doivent pas quitter l'infrastructure.",
    impact: "Ne PAS recommander Claude API, OpenAI API. Privilégier Copilot M365, LLM on-premise, ou des automatisations sans IA.",
  },
  cloud_only: {
    label: "Solutions cloud/SaaS uniquement",
    detail: "Pas d'installation locale ni de serveur dédié.",
    impact: "Recommander les versions cloud : N8N Cloud, Make, Zapier. Pas de self-hosted.",
  },
  on_premise_only: {
    label: "Solutions on-premise uniquement",
    detail: "Tout doit tourner dans l'infrastructure interne.",
    impact: "Recommander N8N self-hosted, Power Automate on-premise, scripts locaux. Pas de SaaS externe.",
  },
  budget_zero: {
    label: "Budget nul — solutions gratuites uniquement",
    detail: "Uniquement des outils gratuits ou déjà dans la licence.",
    impact: "Recommander les tiers gratuits et exploiter les fonctionnalités natives des outils déjà payés.",
  },
  validation_dsi: {
    label: "Validation DSI requise pour tout nouvel outil",
    detail: "Chaque nouvel outil doit être approuvé par la DSI.",
    impact: "Indiquer pour chaque outil s'il est déjà dans l'écosystème ou nécessite une validation DSI.",
  },
  donnees_sensibles: {
    label: "Données sensibles / RGPD renforcé",
    detail: "Données confidentielles (RH, finance, santé, juridique).",
    impact: "Privilégier les solutions dans le périmètre de l'organisation. Mentionner les implications RGPD pour tout outil cloud.",
  },
  aucune: {
    label: "Pas de contrainte particulière",
    detail: "Tous les outils sont envisageables.",
    impact: "",
  },
};

// ─── Form data (accumulated across steps) ────────────────────

export interface DiagnosticFormData {
  // Step 1 — Context
  metier: string;
  orgSize: OrgSize | "";
  sector: Sector | "";
  teamSize: string;

  // Step 2 — Tools + IT constraints
  tools: ToolId[];
  otherTools: string;
  automationExperience: AutomationExperience | "";
  contraintesIT: ContrainteIT[];

  // Step 3 — Daily tasks (core of DÉCLIC "Detect" phase)
  taskDescription: string;
  painPoints: string;
  timeWasters: string;

  // Step 4 — Optional deep-dive
  priorities: string;
  constraints: string;
  objectives: string;
}

export const EMPTY_FORM: DiagnosticFormData = {
  metier: "",
  orgSize: "",
  sector: "",
  teamSize: "",
  tools: [],
  otherTools: "",
  automationExperience: "",
  contraintesIT: [],
  taskDescription: "",
  painPoints: "",
  timeWasters: "",
  priorities: "",
  constraints: "",
  objectives: "",
};

export const STEP_LABELS = [
  "Contexte",
  "Outils",
  "Quotidien",
  "Approfondir",
] as const;
