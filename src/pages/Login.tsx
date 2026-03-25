import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Tab = "connexion" | "inscription";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState<Tab>("connexion");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Connexion fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Inscription fields
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputClass =
    "w-full h-11 px-4 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary transition-all";
  const btnClass =
    "w-full h-11 font-semibold text-sm text-white rounded-xl bg-primary hover:opacity-90 transition-opacity disabled:opacity-40";

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
    setSuccessMsg(null);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate("/");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (signupPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: err } = await signUp(signupEmail, signupPassword, prenom, nom, entreprise || undefined);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      // Auto-login after signup (no email confirmation required)
      const { error: loginErr } = await signIn(signupEmail, signupPassword);
      if (!loginErr) {
        navigate("/");
      } else {
        setSuccessMsg("Compte cree. Vous pouvez vous connecter.");
      }
    }
  }

  const tabBtnClass = (active: boolean) =>
    `flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
      active
        ? "bg-primary text-white"
        : "text-foreground-secondary hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo-declic.png" alt="DECLIC" style={{ height: "40px" }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6">
          <button className={tabBtnClass(tab === "connexion")} onClick={() => switchTab("connexion")}>
            Connexion
          </button>
          <button className={tabBtnClass(tab === "inscription")} onClick={() => switchTab("inscription")}>
            Inscription
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm">
            {successMsg}
          </div>
        )}

        {/* Connexion form */}
        {tab === "connexion" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className={inputClass}
            />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <button
              type="button"
              className="text-xs text-foreground-muted hover:text-primary transition-colors mt-1"
              onClick={() => {/* TODO: password reset flow */}}
            >
              Mot de passe oublie ?
            </button>
          </form>
        )}

        {/* Inscription form */}
        {tab === "inscription" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Entreprise (optionnel)"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Mot de passe (min. 8 caracteres)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Inscription..." : "Creer un compte"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
