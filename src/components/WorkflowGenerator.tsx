import { useState } from "react";
import { AnalysisTask } from "@/types/analysis";
import { getApiKey, getProvider } from "@/lib/aiProvider";
import { generateWorkflowJson } from "@/lib/aiProvider";
import { CodeBlock } from "@/components/chat/CodeBlock";
import { Loader2 } from "lucide-react";

interface WorkflowGeneratorProps {
  task: AnalysisTask;
  metier: string;
}

export default function WorkflowGenerator({ task, metier }: WorkflowGeneratorProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (format: "n8n" | "make") => {
    const apiKey = getApiKey();
    const provider = getProvider();

    if (!apiKey || !provider) {
      setError("Configurez votre clé API dans les paramètres pour générer des workflows.");
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const json = await generateWorkflowJson(task, metier, format);
      setResult(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleGenerate("n8n")}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 bg-gradient-to-r from-orange-500 to-red-500"
        >
          Générer JSON N8N
        </button>
        <button
          onClick={() => handleGenerate("make")}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          Générer Blueprint Make
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generation en cours...
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Result */}
      {result && (
        <CodeBlock code={result} language="json" />
      )}
    </div>
  );
}
