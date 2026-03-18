import { useState } from "react";
import { Eye, EyeOff, ExternalLink, Key } from "lucide-react";
import { saveApiKey } from "@/lib/apiKey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (key: string) => void;
  initialValue?: string;
}

export default function ApiKeyModal({ open, onClose, onSaved, initialValue = "" }: ApiKeyModalProps) {
  const [value, setValue] = useState(initialValue);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed.startsWith("sk-") || trimmed.length < 20) {
      setError("La clé doit commencer par « sk- » et contenir au moins 20 caractères.");
      return;
    }
    saveApiKey(trimmed);
    onSaved(trimmed);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Key size={18} className="text-lecko-blue" />
            Clé API requise
          </DialogTitle>
          <DialogDescription className="text-foreground-secondary text-sm leading-relaxed">
            Pour fonctionner, cette application utilise l'API OpenAI pour analyser votre métier.
            Vous devez fournir votre propre clé API OpenAI. Vos données restent privées : la clé
            est stockée uniquement dans votre navigateur et n'est jamais envoyée à nos serveurs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-lecko-blue hover:text-lecko-orange transition-colors"
          >
            <ExternalLink size={13} />
            Comment obtenir une clé API OpenAI ?
          </a>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="sk-..."
              className="w-full h-11 px-4 pr-11 text-sm bg-background border-2 border-border rounded-xl outline-none focus:border-lecko-blue transition-colors text-foreground placeholder:text-foreground-muted font-mono"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
              aria-label={showKey ? "Masquer la clé" : "Afficher la clé"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive font-medium">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="w-full h-11 rounded-xl font-bold text-sm bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enregistrer et lancer l'analyse
          </button>

          <p className="text-xs text-foreground-muted leading-relaxed bg-muted/50 rounded-lg px-3 py-2.5">
            💡 Votre clé est stockée localement dans votre navigateur (localStorage). Elle n'est jamais
            transmise à Lecko ni à aucun tiers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
