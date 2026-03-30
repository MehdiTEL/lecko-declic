import { useState } from "react";
import { Trash2, Key, Eye, EyeOff, RotateCcw, History, RefreshCw, Sparkles, Bot } from "lucide-react";
import { FREE_JOB_LABELS } from "@/data/jobDatabase";
import Navbar from "@/components/Navbar";
import {
  getApiKey,
  getProvider,
  saveProviderAndKey,
  deleteProviderAndKey,
  maskApiKey,
  AIProvider,
} from "@/lib/aiProvider";
import { clearHistory } from "@/lib/history";
import { useTheme } from "@/hooks/useTheme";
import ApiKeyModal from "@/components/ApiKeyModal";
import { supabase } from "@/integrations/supabase/client";
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
  const { user } = useAuth();
  const [apiKey, setApiKeyState] = useState<string | null>(getApiKey());
  const [provider, setProviderState] = useState<AIProvider | null>(getProvider());
  const [editKeyMode, setEditKeyMode] = useState(false);
  const [showChangeProviderModal, setShowChangeProviderModal] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [editError, setEditError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const { resetTheme } = useTheme();

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

  const handleClearHistory = () => {
    clearHistory();
    setConfirmClearHistory(false);
  };

  const handleReset = () => {
    deleteProviderAndKey();
    clearHistory();
    resetTheme();
    setApiKeyState(null);
    setProviderState(null);
    setConfirmReset(false);
  };

  const handleProviderModalSaved = (newProvider: AIProvider, newKey: string) => {
    setApiKeyState(newKey);
    setProviderState(newProvider);
    setShowChangeProviderModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="declic-deco-square" aria-hidden />

      <main className="max-w-2xl mx-auto w-full px-4 py-10 space-y-6 flex-1">
        <h1 className="text-2xl font-bold font-heading text-foreground">Paramètres</h1>

        {/* AI Provider & API Key section */}
        <section className="lecko-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Key size={18} className="text-primary" />
            <h2 className="font-bold font-heading text-foreground">Fournisseur IA &amp; Clé API</h2>
            {apiKey && provider ? (
              <span className="ml-auto text-xs font-semibold text-gr33t-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gr33t-500 inline-block" />
                Configurée
              </span>
            ) : (
              <span className="ml-auto text-xs font-semibold text-destructive flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                Non configurée
              </span>
            )}
          </div>

          {/* Current provider badge */}
          {provider && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-muted">Fournisseur actuel :</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full text-primary-foreground ${
                  provider === "openai" ? "bg-foreground" : "bg-lecko-orange"
                }`}
              >
                {PROVIDER_LABELS[provider]}
              </span>
            </div>
          )}

          {apiKey && provider && !editKeyMode && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
              <code className="text-sm font-mono text-foreground flex-1">{maskApiKey(apiKey)}</code>
              <button
                onClick={() => setShowChangeProviderModal(true)}
                className="text-xs font-bold text-foreground-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <RefreshCw size={11} />
                Changer
              </button>
              <button
                onClick={() => { setEditKeyMode(true); setNewKey(""); }}
                className="text-xs font-bold text-primary hover:text-lecko-orange transition-colors"
              >
                Modifier la clé
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-bold text-destructive hover:opacity-70 transition-opacity"
              >
                Supprimer
              </button>
            </div>
          )}

          {/* Edit key only (no provider change) */}
          {editKeyMode && provider && (
            <div className="space-y-3">
              <p className="text-xs text-foreground-muted">
                Fournisseur actuel : <strong>{PROVIDER_LABELS[provider]}</strong>
              </p>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={newKey}
                  onChange={(e) => { setNewKey(e.target.value); setEditError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
                  placeholder={provider === "anthropic" ? "sk-ant-api03-..." : "sk-proj-..."}
                  className="w-full h-11 px-4 pr-11 text-sm bg-background border-2 border-border rounded-xl outline-none focus:border-primary transition-colors text-foreground placeholder:text-foreground-muted font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {editError && <p className="text-xs text-destructive font-medium">{editError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveKey}
                  disabled={!newKey.trim()}
                  className="flex-1 h-10 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-lecko-orange transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {savedFeedback ? "✓ Enregistrée !" : "Enregistrer la clé"}
                </button>
                <button
                  onClick={() => { setEditKeyMode(false); setNewKey(""); setEditError(""); }}
                  className="px-4 h-10 rounded-xl font-bold text-sm border-2 border-border text-foreground-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* No key configured */}
          {!apiKey && !editKeyMode && (
            <button
              onClick={() => setShowChangeProviderModal(true)}
              className="w-full h-10 rounded-full font-bold text-sm bg-primary text-primary-foreground hover:bg-lecko-orange transition-all duration-300"
            >
              Configurer un fournisseur IA
            </button>
          )}

          <p className="text-xs text-foreground-muted leading-relaxed">
            Votre clé est stockée localement dans votre navigateur. Elle n'est jamais transmise à DÉCLIC.
          </p>
        </section>

        {/* Local data section */}
        <section className="lecko-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <History size={18} className="text-primary" />
            <h2 className="font-bold font-heading text-foreground">Données locales</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setConfirmClearHistory(true)}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-semibold text-sm border-2 border-border text-foreground-secondary hover:border-destructive hover:text-destructive transition-colors"
            >
              <Trash2 size={14} />
              Vider l'historique
            </button>
            <button
              onClick={() => setConfirmReset(true)}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-semibold text-sm border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
              Réinitialiser tout
            </button>
          </div>

          <p className="text-xs text-foreground-muted">
            "Réinitialiser tout" supprime le fournisseur IA, la clé API, l'historique des analyses et la préférence de thème.
          </p>
        </section>

        {/* Analysis mode section */}
        <section className="lecko-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bot size={18} className="text-primary" />
            <h2 className="font-bold font-heading text-foreground">Mode d'analyse</h2>
          </div>

          <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
            {apiKey && provider ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Bot size={11} />
                  API — {provider === "openai" ? "OpenAI GPT-4o" : "Anthropic Claude"}
                </span>
                <span className="text-xs text-foreground-muted flex-1">Analyses personnalisées activées</span>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs font-semibold text-foreground-secondary hover:text-destructive transition-colors"
                >
                  Repasser en mode gratuit
                </button>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground-muted border border-border">
                  <Sparkles size={11} />
                  Gratuit — Base locale
                </span>
                <span className="text-xs text-foreground-muted flex-1">15 métiers disponibles</span>
                <button
                  onClick={() => setShowChangeProviderModal(true)}
                  className="text-xs font-semibold text-primary hover:text-lecko-orange transition-colors"
                >
                  Configurer une clé API
                </button>
              </>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-foreground-muted uppercase mb-2">Métiers disponibles gratuitement</p>
            <div className="flex flex-wrap gap-1.5">
              {FREE_JOB_LABELS.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border border-border bg-muted/50 text-foreground-secondary"
                >
                  <Sparkles size={9} className="text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Email notifications */}
        {user && (
          <section className="lecko-card p-5 md:p-6">
            <h2 className="font-heading text-base font-bold text-foreground mb-4">Notifications email</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Rapport mensuel de progression</p>
                <p className="text-xs text-foreground-muted mt-0.5">Recevez chaque mois un recapitulatif de vos automations en cours</p>
              </div>
              <button
                onClick={async () => {
                  const newVal = !emailOptIn;
                  setEmailOptIn(newVal);
                  await (supabase.from("user_profiles") as any).update({ email_monthly_opt_in: newVal }).eq("id", user.id);
                }}
                className={`relative w-10 h-5 rounded-full transition-colors ${emailOptIn ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${emailOptIn ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            {import.meta.env.DEV && (
              <button
                onClick={async () => {
                  await supabase.functions.invoke("monthly-progress-email", { body: { test: true } });
                  alert("Email de test envoye");
                }}
                className="mt-3 text-xs text-foreground-muted hover:text-primary transition-colors"
              >
                [DEV] Tester l'email de progression
              </button>
            )}
          </section>
        )}
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
              Êtes-vous sûr ? Vous devrez reconfigurer votre fournisseur et clé pour utiliser l'application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKey} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm clear history */}
      <AlertDialog open={confirmClearHistory} onOpenChange={setConfirmClearHistory}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vider l'historique ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes vos analyses sauvegardées seront supprimées définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">
              Vider
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
              Cette action supprime définitivement votre fournisseur IA, votre clé API, votre historique d'analyses et réinitialise le thème. Elle est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              Tout réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
