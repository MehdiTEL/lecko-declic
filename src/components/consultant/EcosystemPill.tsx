const ECOSYSTEM_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  M365_PowerAutomate: { bg: "#EEF2FF", text: "#4F46E5", label: "Power Automate" },
  M365_Copilot: { bg: "#EEF2FF", text: "#4F46E5", label: "M365 Copilot" },
  N8N: { bg: "#FFF7ED", text: "#C2410C", label: "N8N" },
  Make_Zapier: { bg: "#FFF7ED", text: "#C2410C", label: "Make / Zapier" },
  Google_AppsScript: { bg: "#F0FDF4", text: "#166534", label: "Google Apps" },
  LLM_API: { bg: "#FDF4FF", text: "#7C3AED", label: "LLM API" },
  Agent_IA: { bg: "#FDF4FF", text: "#7C3AED", label: "Agent IA" },
  Notion_Airtable: { bg: "#FEF9C3", text: "#854D0E", label: "Notion / Air." },
  Python_Script: { bg: "#F1F5F9", text: "#475569", label: "Python" },
  RPA: { bg: "#F1F5F9", text: "#475569", label: "RPA" },
  Natif_SaaS: { bg: "#ECFDF5", text: "#065F46", label: "Natif SaaS" },
};

export function EcosystemPill({ ecosysteme }: { ecosysteme: string }) {
  const config = ECOSYSTEM_COLORS[ecosysteme] ?? {
    bg: "#F1F5F9",
    text: "#475569",
    label: ecosysteme,
  };
  return (
    <span
      className="text-[10px] font-mono px-2 py-0.5 rounded-md font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
