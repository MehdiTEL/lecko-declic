import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building2, Lock, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SaveState = "idle" | "saving" | "success" | "error";

export default function Profil() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  // Info fields
  const [prenom, setPrenom] = useState(profile?.prenom ?? "");
  const [nom, setNom] = useState(profile?.nom ?? "");
  const [entreprise, setEntreprise] = useState(profile?.entreprise ?? "");
  const [infoState, setInfoState] = useState<SaveState>("idle");
  const [infoError, setInfoError] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwState, setPwState] = useState<SaveState>("idle");
  const [pwError, setPwError] = useState<string | null>(null);

  const inputClass =
    "w-full h-11 px-4 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-foreground-light";

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setInfoError(null);
    setInfoState("saving");

    const trimPrenom = prenom.trim();
    const trimNom = nom.trim();
    const trimEntreprise = entreprise.trim();

    if (!trimPrenom || !trimNom) {
      setInfoError("Le prénom et le nom sont requis.");
      setInfoState("error");
      return;
    }
    if (trimPrenom.length > 100 || trimNom.length > 100) {
      setInfoError("Le prénom et le nom ne doivent pas dépasser 100 caractères.");
      setInfoState("error");
      return;
    }

    try {
      const { error } = await (supabase.from("user_profiles") as any)
        .update({ prenom: trimPrenom, nom: trimNom, entreprise: trimEntreprise || null })
        .eq("id", user.id);

      if (error) throw error;
      setInfoState("success");
      setTimeout(() => setInfoState("idle"), 3000);
    } catch (err: any) {
      setInfoError(err.message ?? "Une erreur est survenue.");
      setInfoState("error");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwState("saving");

    if (newPassword.length < 8) {
      setPwError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      setPwState("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Les mots de passe ne correspondent pas.");
      setPwState("error");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwState("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwState("idle"), 3000);
    } catch (err: any) {
      setPwError(err.message ?? "Une erreur est survenue.");
      setPwState("error");
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-foreground-muted mb-4">Vous devez être connecté pour accéder à cette page.</p>
            <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${profile.prenom?.charAt(0).toUpperCase() ?? ""}${profile.nom?.charAt(0).toUpperCase() ?? ""}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Retour
          </button>

          <div className="flex items-center gap-5">
            {/* Avatar large */}
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">{initials}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {profile.prenom} {profile.nom}
              </h1>
              <p className="text-sm text-foreground-muted mt-0.5">{profile.email}</p>
              {profile.entreprise && (
                <p className="text-xs text-foreground-muted mt-0.5 flex items-center gap-1">
                  <Building2 size={11} strokeWidth={1.5} />
                  {profile.entreprise}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 1 — Informations personnelles */}
        <section className="bg-white dark:bg-card border border-border/60 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
              <User size={15} strokeWidth={1.5} className="text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Informations personnelles</h2>
          </div>

          <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground-muted">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  maxLength={100}
                  required
                  className={inputClass}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground-muted">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  maxLength={100}
                  required
                  className={inputClass}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted flex items-center gap-1">
                <Mail size={11} strokeWidth={1.5} />
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={`${inputClass} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-foreground-light">L'email ne peut pas être modifié pour l'instant.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted flex items-center gap-1">
                <Building2 size={11} strokeWidth={1.5} />
                Entreprise
                <span className="text-foreground-light ml-1">(optionnel)</span>
              </label>
              <input
                type="text"
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                maxLength={200}
                className={inputClass}
                placeholder="Votre entreprise"
              />
            </div>

            {infoError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} strokeWidth={1.5} />
                {infoError}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {infoState === "success" && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={14} strokeWidth={1.5} />
                  Modifications enregistrées
                </span>
              )}
              {infoState !== "success" && <span />}
              <button
                type="submit"
                disabled={infoState === "saving"}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={14} strokeWidth={1.5} />
                {infoState === "saving" ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>

        {/* Section 2 — Mot de passe */}
        <section className="bg-white dark:bg-card border border-border/60 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
              <Lock size={15} strokeWidth={1.5} className="text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Changer le mot de passe</h2>
          </div>

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass}
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Répétez le mot de passe"
              />
            </div>

            {pwError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} strokeWidth={1.5} />
                {pwError}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {pwState === "success" && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={14} strokeWidth={1.5} />
                  Mot de passe mis à jour
                </span>
              )}
              {pwState !== "success" && <span />}
              <button
                type="submit"
                disabled={pwState === "saving"}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={14} strokeWidth={1.5} />
                {pwState === "saving" ? "Mise à jour..." : "Changer"}
              </button>
            </div>
          </form>
        </section>

        {/* Section 3 — Danger zone */}
        <section className="border border-border/60 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Session</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground-muted">Connecté en tant que <strong className="text-foreground">{profile.email}</strong></p>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground-muted border border-border/60 rounded-xl hover:bg-muted hover:text-foreground transition-all"
            >
              Se déconnecter
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
