import { useState } from "react";
import { Key, Eye, EyeOff, RotateCcw, RefreshCw, Sun, Moon } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getApiKey,
  getProvider,
  saveProviderAndKey,
  deleteProviderAndKey,
  maskApiKey,
  AIProvider,
} from "@/lib/aiProvider";
import { useTheme } from "@/hooks/useTheme";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI GPT-4o",
  anthropic: "Anthropic Claude",
};

export default function Settings() {
  const { user, signOut } = useAuth();
  const [apiKey, setApiKeyState] = useState<string | null>(getApiKey());
  const [provider, setProviderState] = useState<AIProvider | null>(getProvider());
  const [editKeyMode, setEditKeyMode] = useState(false);
  const [showChangeProviderModal, setShowChangeProviderModal] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [editError, setEditError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const { theme, toggleTheme, resetTheme } = useTheme();

  const handleSaveKey = () => {
    const trimmed = newKey.trim();
    if (!provider) return;
    if (trimmed.length < 20) {
      setEditError("La clé doit contenir au moins 20 caractères.");
      return;
    }
    saveProviderAndKey(provider, trimmed);
    setApiKeyState(trimmed);
    setEditKeyMode(false);
    setNewKey("");
    setEditError("");
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleDeleteKey = () => {
    deleteProviderAndKey();
    setApiKeyState(null);
    setProviderState(null);
    setConfirmDelete(false);
  };

  const handleReset = () => {
    deleteProviderAndKey();
    resetTheme();
    setApiKeyState(null);
    setProviderState(null);
    setConfirmReset(false);
  };

  const handleProviderModalSaved = (newProvider: AIProvider, newApiKey: string) => {
    setApiKeyState(newApiKey);
    setProviderState(newProvider);
    setShowChangeProviderModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="max-w-2xl mx-auto w-full px-4 py-10 space-y-6 flex-1">
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>

        {/* ── Fournisseur IA & Clé API ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Key size={18} className="text-blue-500" />
            <h2 className="font-bold text-foreground">Fournisseur IA &amp; Clé API</h2>
            {apiKey && provider ? (
              <span className="ml-auto text-xs font-semibold text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Configurée
              </span>
            ) : (
              <span className="ml-auto text-xs font-semibold text-red-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Non configurée
              </span>
            )}
          </div>

          {provider && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Fournisseur actuel :</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                provider === "openai" ? "bg-slate-700" : "bg-orange-500"
              }`}>
                {PROVIDER_LABELS[provider]}
              </span>
            </div>
          )}

          {apiKey && provider && !editKeyMode && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
              <code className="text-sm font-mono text-foreground flex-1">{maskApiKey(apiKey)}</code>
              <button onClick={() => setShowChangeProviderModal(true)}
                className="text-xs font-bold text-muted-foreground hover:text-blue-500 transition-colors flex items-center gap-1">
                <RefreshCw size={11} />Changer
              </button>
              <button onClick={() => { setEditKeyMode(true); setNewKey(""); }}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
                Modifier la clé
              </button>
              <button onClick={() => setConfirmDelete(true)}
                className="text-xs font-bold text-red-500 hover:opacity-70 transition-opacity">
                Supprimer
              </button>
            </div>
          )}

          {editKeyMode && provider && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Fournisseur actuel : <strong>{PROVIDER_LABELS[provider]}</strong>
              </p>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={newKey}
                  onChange={(e) => { setNewKey(e.target.value); setEditError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
                  placeholder={provider === "anthropic" ? "sk-ant-api03-..." : "sk-proj-..."}
                  className="w-full h-11 px-4 pr-11 text-sm bg-background border-2 border-border rounded-xl outline-none focus:border-blue-500 transition-colors text-foreground placeholder:text-muted-foreground font-mono"
                />
                <button type="button" onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {editError && <p className="text-xs text-red-500 font-medium">{editError}</p>}
              <div className="flex gap-2">
                <button onClick={handleSaveKey} disabled={!newKey.trim()}
                  className="flex-1 h-10 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {savedFeedback ? "Enregistrée !" : "Enregistrer la clé"}
                </button>
                <button onClick={() => { setEditKeyMode(false); setNewKey(""); setEditError(""); }}
                  className="px-4 h-10 rounded-xl font-bold text-sm border-2 border-border text-muted-foreground hover:border-blue-500 hover:text-blue-500 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {!apiKey && !editKeyMode && (
            <button onClick={() => setShowChangeProviderModal(true)}
              className="w-full h-10 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all">
              Configurer un fournisseur IA
            </button>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            Votre clé est stockée localement dans votre navigateur. Elle n'est jamais transmise à nos serveurs.
          </p>
        </section>

        {/* ── Thème ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            {theme === "dark" ? <Moon size={18} className="text-blue-500" /> : <Sun size={18} className="text-blue-500" />}
            <h2 className="font-bold text-foreground">Apparence</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Mode sombre</p>
              <p className="text-xs text-muted-foreground mt-0.5">Bascule entre le thème clair et sombre</p>
            </div>
            <button onClick={toggleTheme}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                theme === "dark" ? "bg-blue-600" : "bg-slate-300"
              }`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                theme === "dark" ? "left-[22px]" : "left-0.5"
              }`} />
            </button>
          </div>
        </section>

        {/* ── Réinitialiser ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw size={18} className="text-red-500" />
            <h2 className="font-bold text-foreground">Réinitialisation</h2>
          </div>
          <button onClick={() => setConfirmReset(true)}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-xl font-semibold text-sm border-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            <RotateCcw size={14} />
            Réinitialiser tous les paramètres
          </button>
          <p className="text-xs text-muted-foreground">
            Supprime la clé API, le fournisseur IA et réinitialise le thème.
          </p>
        </section>
      </main>

      {/* Change provider modal */}
      <ApiKeyModal
        open={showChangeProviderModal}
        onClose={() => setShowChangeProviderModal(false)}
        onSaved={handleProviderModalSaved}
        initialProvider={provider}
        initialValue=""
      />

      {/* Confirm delete key */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la configuration IA ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous devrez reconfigurer votre fournisseur et clé pour les analyses IA.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKey} className="bg-red-600 hover:bg-red-500">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm full reset */}
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser tous les paramètres ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprime votre clé API, le fournisseur IA et réinitialise le thème. Elle est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-500">
              Tout réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
