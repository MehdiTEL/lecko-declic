import { useState } from "react";
import { Send, CheckCircle, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConsultantContactFormProps {
  contextMessage: string;
  source: string;
  metier?: string;
  score?: number;
  variant?: "inline" | "card" | "modal";
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ConsultantContactForm({
  contextMessage,
  source,
  metier,
  score,
  variant = "card",
  onSuccess,
  onClose,
}: ConsultantContactFormProps) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase.from("leads") as any).insert({
        nom: nom.trim() || null,
        email: email.trim(),
        message: contextMessage,
        metier_analyse: metier ?? null,
        score_global: score ?? null,
        source,
      });
      if (err) throw err;
      setSent(true);
      onSuccess?.();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  // ─── Sent state ──────────────────────────────────────────
  if (sent) {
    return (
      <div className={`flex items-center gap-2 ${variant === "inline" ? "py-1" : "py-4 text-center flex-col"}`}>
        <CheckCircle size={16} className="text-gr33t-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Demande envoyée</p>
          <p className="text-xs text-foreground-muted mt-0.5">Nous revenons vers vous sous 24h.</p>
        </div>
      </div>
    );
  }

  // ─── Inline variant ──────────────────────────────────────
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          className="h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors flex-1 min-w-0"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email *"
          className="h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors flex-1 min-w-0"
        />
        <button
          type="submit"
          disabled={!email.trim() || sending}
          className="h-9 px-4 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
        >
          {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {sending ? "Envoi..." : "Être recontacté"}
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    );
  }

  // ─── Card / Modal variant ────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Échanger avec un consultant</p>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 text-foreground-muted hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
      {contextMessage && (
        <p className="text-xs text-foreground-muted leading-relaxed">{contextMessage}</p>
      )}
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email *"
        className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={!email.trim() || sending}
        className="w-full h-9 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        {sending ? "Envoi..." : "Être recontacté"}
      </button>
      <p className="text-[10px] text-foreground-muted text-center">
        Votre demande inclura votre diagnostic.
      </p>
    </form>
  );
}
