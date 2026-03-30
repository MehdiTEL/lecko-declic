import { useState } from "react";
import { User, Mail, Building2, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ContactSection() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !prenom.trim() || !nom.trim()) return;
    setSending(true);
    setErr(null);
    try {
      // @ts-ignore — leads table not in generated types
      const { error } = await supabase.from("leads").insert({
        nom: `${prenom.trim()} ${nom.trim()}`,
        email: email.trim(),
        message: entreprise.trim() ? `Entreprise : ${entreprise.trim()}` : null,
        source: "declic_contact",
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setErr("Une erreur est survenue. Reessayez ou ecrivez-nous a contact@lecko.fr");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-gr33t-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-gr33t-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">Message envoye !</h3>
        <p className="text-foreground-secondary">Notre equipe vous recontactera dans les 48h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Prenom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input required value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Jean"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Nom *</label>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input required value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Email *</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jean.dupont@entreprise.fr"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Entreprise</label>
        <div className="relative">
          <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" strokeWidth={1.5} />
          <input value={entreprise} onChange={e => setEntreprise(e.target.value)} placeholder="Nom de votre organisation"
            className="w-full h-11 pl-9 pr-3 text-sm bg-background border border-border/70 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground" />
        </div>
      </div>
      {err && <p className="sm:col-span-2 text-sm text-destructive">{err}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={!email.trim() || !prenom.trim() || !nom.trim() || sending}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50 active:scale-[0.98]">
          <Send size={15} />
          {sending ? "Envoi en cours..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
