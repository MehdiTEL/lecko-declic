import { AnalysisTask } from "@/types/analysis";

interface WorkflowPreviewProps {
  task: AnalysisTask;
}

// Node types with colors
const NODE_TYPES = {
  trigger: { label: "Declencheur", color: "#10B981", bgLight: "#ECFDF5" },
  preprocess: { label: "Pre-traitement", color: "#2563EB", bgLight: "#EFF6FF" },
  decision: { label: "Decision", color: "#F59E0B", bgLight: "#FFFBEB" },
  action_ia: { label: "Appel IA", color: "#7C3AED", bgLight: "#F5F3FF" },
  action: { label: "Action", color: "#2563EB", bgLight: "#EFF6FF" },
  output: { label: "Sortie", color: "#F97316", bgLight: "#FFF7ED" },
};

// Derive trigger name from ecosystem
function getTriggerLabel(task: AnalysisTask): string {
  const eco = task.ecosysteme;
  if (!eco) return "Evenement";
  const map: Record<string, string> = {
    M365_PowerAutomate: "Trigger Power Automate",
    M365_Copilot: "Prompt Copilot",
    N8N: "Webhook / Cron N8N",
    Make_Zapier: "Watch Module Make",
    Google_AppsScript: "Trigger Apps Script",
    LLM_API: "Webhook + API",
    Agent_IA: "Orchestrateur Agent",
    Notion_Airtable: "Trigger Notion/Airtable",
    Python_Script: "Script cron/webhook",
    RPA: "Trigger RPA Desktop",
    Natif_SaaS: "Regle native",
  };
  return map[eco] ?? "Evenement";
}

// Derive action label from outils_specifiques or solution
function getActionLabel(task: AnalysisTask): string {
  if (task.outils_specifiques?.length) {
    return task.outils_specifiques.slice(0, 2).join(" + ");
  }
  return task.type_outil;
}

// Get output label
function getOutputLabel(task: AnalysisTask): string {
  if (task.exemple_resultat) {
    return task.exemple_resultat.length > 35
      ? task.exemple_resultat.substring(0, 32) + "..."
      : task.exemple_resultat;
  }
  return "Resultat automatise";
}

interface NodeDef {
  type: keyof typeof NODE_TYPES;
  subLabel: string;
}

function buildNodes(task: AnalysisTask): NodeDef[] {
  const nodes: NodeDef[] = [
    { type: "trigger", subLabel: getTriggerLabel(task) },
    { type: "preprocess", subLabel: "Extraire donnees" },
    { type: "decision", subLabel: "Verifier conditions" },
  ];

  if (task.peut_fonctionner_sans_ia === false) {
    nodes.push({ type: "action_ia", subLabel: getActionLabel(task) });
  } else {
    nodes.push({ type: "action", subLabel: getActionLabel(task) });
  }

  nodes.push({ type: "output", subLabel: getOutputLabel(task) });

  return nodes;
}

export default function WorkflowPreview({ task }: WorkflowPreviewProps) {
  const nodes = buildNodes(task);
  const nodeCount = nodes.length;
  const nodeW = 130;
  const nodeH = 60;
  const gap = (800 - nodeCount * nodeW) / (nodeCount + 1);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border p-4 bg-card">
      <svg
        viewBox="0 0 800 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ minWidth: 500 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
          </marker>
        </defs>

        {nodes.map((node, i) => {
          const cfg = NODE_TYPES[node.type];
          const x = gap + i * (nodeW + gap);
          const y = 50;

          return (
            <g key={i}>
              {/* Connector arrow (not for first node) */}
              {i > 0 && (
                <line
                  x1={gap + (i - 1) * (nodeW + gap) + nodeW}
                  y1={y + nodeH / 2}
                  x2={x}
                  y2={y + nodeH / 2}
                  stroke="#94A3B8"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              )}

              {/* Node rect */}
              <rect
                x={x}
                y={y}
                width={nodeW}
                height={nodeH}
                rx={12}
                ry={12}
                fill={cfg.bgLight}
                fillOpacity={0.6}
                stroke={cfg.color}
                strokeWidth={2}
              />

              {/* Type label */}
              <text
                x={x + nodeW / 2}
                y={y + 22}
                textAnchor="middle"
                fontWeight={600}
                fontSize={12}
                fill={cfg.color}
              >
                {cfg.label}
              </text>

              {/* Sub-label (truncated) */}
              <text
                x={x + nodeW / 2}
                y={y + 42}
                textAnchor="middle"
                fontSize={9}
                fill="#64748B"
              >
                {node.subLabel.length > 20
                  ? node.subLabel.substring(0, 18) + "..."
                  : node.subLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
