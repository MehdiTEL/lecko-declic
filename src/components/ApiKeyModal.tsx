import { useState } from "react";
import { Eye, EyeOff, ExternalLink, Key } from "lucide-react";
import { saveProviderAndKey, AIProvider } from "@/lib/aiProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (provider: AIProvider, key: string) => void;
  initialProvider?: AIProvider | null;
  initialValue?: string;
}

const PROVIDERS: {
  id: AIProvider;
  name: string;
  subtitle: string;
  keyHint: string;
  placeholder: string;
  link: string;
  linkLabel: string;
}[] = [
  {
    id: "openai",
    name: "OpenAI (GPT-4o)",
    subtitle: "Recommandé — rapide et polyvalent",
    keyHint: "Clé commençant par sk-...",
    placeholder: "sk-proj-...",
    link: "https://platform.openai.com/api-keys",
    linkLabel: "platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    subtitle: "Analyse approfondie et nuancée",
    keyHint: "Clé commençant par sk-ant-...",
    placeholder: "sk-ant-api03-...",
    link: "https://console.anthropic.com/settings/keys",
    linkLabel: "console.anthropic.com/settings/keys",
  },
];

export default function ApiKeyModal({
  open,
  onClose,
  onSaved,
  initialProvider = null,
  initialValue = "",
}: ApiKeyModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(initialProvider);
  const [value, setValue] = useState(initialValue);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const currentProviderInfo = PROVIDERS.find((p) => p.id === selectedProvider);

  const handleSave = () => {
    if (!selectedProvider) {
      setError("Veuillez sélectionner un fournisseur IA.");
      return;
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 20) {
      setError("La clé doit contenir au moins 20 caractères.");
      return;
    }
    saveProviderAndKey(selectedProvider, trimmed);
    onSaved(selectedProvider, trimmed);
    onClose();
  };

  const canSave = !!selectedProvider && value.trim().length >= 20;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Key size={18} className="text-primary" />
            Clé API requise
          </DialogTitle>
          <DialogDescription className="text-foreground-secondary text-sm leading-relaxed">
            Pour fonctionner, cette application utilise une IA pour analyser votre métier.
            Choisissez votre fournisseur et fournissez votre propre clé API. Vos données restent
            privées : la clé est stockée uniquement dans votre navigateur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Provider selector */}
          <div>
            <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">
              Choisissez votre fournisseur IA
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PROVIDERS.map((p) => {
                const isSelected = selectedProvider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setSelectedProvider(p.id); setError(""); setValue(""); }}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <p className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {p.name}
                    </p>
                    <p className="text-xs text-foreground-muted mt-0.5">{p.subtitle}</p>
                    <p className="text-xs text-foreground-muted mt-1 opacity-70">{p.keyHint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help link */}
          {currentProviderInfo && (
            <a
              href={currentProviderInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={13} />
              Obtenir une clé → {currentProviderInfo.linkLabel}
            </a>
          )}

          {/* Key input */}
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={currentProviderInfo?.placeholder ?? "sk-..."}
              disabled={!selectedProvider}
              className="w-full h-11 px-4 pr-11 text-sm bg-background border-2 border-border rounded-xl outline-none focus:border-primary transition-colors text-foreground placeholder:text-foreground-muted font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus={false}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              disabled={!selectedProvider}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors disabled:opacity-40"
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
            disabled={!canSave}
            className="w-full h-11 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
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
