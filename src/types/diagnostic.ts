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

// ─── Form data (accumulated across steps) ────────────────────

export interface DiagnosticFormData {
  // Step 1 — Context
  metier: string;
  orgSize: OrgSize | "";
  sector: Sector | "";
  teamSize: string; // "1", "5", "20", etc.

  // Step 2 — Tools
  tools: ToolId[];
  otherTools: string; // free text if "other" selected
  automationExperience: AutomationExperience | "";

  // Step 3 — Daily tasks (core of DÉCLIC "Detect" phase)
  taskDescription: string; // free-text: "Describe your typical day"
  painPoints: string;      // free-text: "What frustrates you the most?"
  timeWasters: string;     // free-text: "What takes too much time?"

  // Step 4 — Optional deep-dive
  priorities: string;      // free-text: "What would you automate first?"
  constraints: string;     // free-text: "Any constraints (budget, security, IT restrictions)?"
  objectives: string;      // free-text: "Your goals (save time, reduce errors, scale)?"
}

export const EMPTY_FORM: DiagnosticFormData = {
  metier: "",
  orgSize: "",
  sector: "",
  teamSize: "",
  tools: [],
  otherTools: "",
  automationExperience: "",
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
