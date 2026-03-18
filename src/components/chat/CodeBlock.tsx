import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function isN8nJson(code: string): boolean {
  try {
    const parsed = JSON.parse(code);
    return !!(parsed.nodes || parsed.meta || parsed.connections);
  } catch {
    return false;
  }
}

function isMakeJson(code: string): boolean {
  try {
    const parsed = JSON.parse(code);
    return !!(parsed.modules || parsed.scenario || parsed.flow);
  } catch {
    return false;
  }
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const isJson = language === "json" || language === "";
  const n8n = isJson && isN8nJson(code);
  const make = isJson && isMakeJson(code);
  const isWorkflow = n8n || make;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${n8n ? "n8n" : "make"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg overflow-hidden my-2 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(220,15%,13%)]">
        <span className="text-xs text-slate-400 font-mono">
          {isWorkflow
            ? n8n
              ? "📥 Workflow N8N importable"
              : "📥 Workflow Make importable"
            : language || "code"}
        </span>
        <div className="flex items-center gap-2">
          {isWorkflow && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/10"
            >
              <Download size={11} />
              Télécharger .json
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/10"
          >
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="bg-[hsl(220,15%,10%)] overflow-x-auto">
        <pre className="p-3 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {code}
        </pre>
      </div>

      {/* N8N import hint */}
      {isWorkflow && (
        <div className="bg-[hsl(220,15%,10%)] border-t border-white/5 px-3 py-2">
          <p className="text-[10px] text-slate-500">
            {n8n
              ? "Pour importer : N8N → ⋯ Menu → Import from File → sélectionnez ce fichier"
              : "Pour importer : Make → Scénarios → Importer le scénario"}
          </p>
        </div>
      )}
    </div>
  );
}
