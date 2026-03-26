import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Shield, ExternalLink, CheckCircle } from "lucide-react";
import { saveProviderAndKey, type AIProvider } from "@/lib/aiProvider";

const OPENAI_STEPS = [
  { num: 1, title: "Créez un compte gratuit", detail: "Rendez-vous sur platform.openai.com et inscrivez-vous avec votre email professionnel.", link: "https://platform.openai.com/signup", linkLabel: "Ouvrir platform.openai.com" },
  { num: 2, title: "Générez une clé API", detail: "Dashboard > API Keys > Create new secret key. Nommez-la \"DECLIC\" et copiez-la. Elle commence par sk-...", link: "https://platform.openai.com/api-keys", linkLabel: "Ouvrir la page API Keys" },
  { num: 3, title: "Vérifiez vos crédits", detail: "Les nouveaux comptes ont souvent des crédits offerts. Un diagnostic coûte environ 0,01 €. Ajoutez un moyen de paiement si nécessaire.", link: "https://platform.openai.com/settings/organization/billing/overview", linkLabel: "Ouvrir Billing" },
];

const ANTHROPIC_STEPS = [
  { num: 1, title: "Créez un compte gratuit", detail: "Rendez-vous sur console.anthropic.com et inscrivez-vous. Un crédit de démarrage est souvent offert.", link: "https://console.anthropic.com/", linkLabel: "Ouvrir console.anthropic.com" },
  { num: 2, title: "Générez une clé API", detail: "Settings > API Keys > Create Key. Nommez-la \"DECLIC\" et copiez-la. Elle commence par sk-ant-...", link: "https://console.anthropic.com/settings/keys", linkLabel: "Ouvrir la page API Keys" },
  { num: 3, title: "Vérifiez vos crédits", detail: "Un diagnostic coûte environ 0,02 €. Vérifiez votre solde dans Plans & Billing.", link: "https://console.anthropic.com/settings/billing", linkLabel: "Ouvrir Billing" },
];

export default function ConfigurerApi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const metierParam = searchParams.get("metier") ?? "";
  const redirectParam = searchParams.get("redirect") ?? "diagnostic";

  const [provider, setProvider] = useState<AIProvider | null>(null);
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const isValid = provider === "openai"
    ? key.startsWith("sk-") && key.length > 20
    : provider === "anthropic"
    ? key.startsWith("sk-ant-") && key.length > 20
    : false;
  const showError = key.length > 5 && !isValid;

  const handleContinue = () => {
    if (!provider || !isValid) return;
    saveProviderAndKey(provider, key);
    const dest = redirectParam === "diagnostic"
      ? metierParam ? `/diagnostic?metier=${encodeURIComponent(metierParam)}` : "/diagnostic"
      : "/";
    navigate(dest);
  };

  const steps = provider === "openai" ? OPENAI_STEPS : provider === "anthropic" ? ANTHROPIC_STEPS : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between max-w-[680px] w-full mx-auto">
        <Link to="/" className="font-heading text-xl font-bold text-primary tracking-tight">
          DÉCLIC
        </Link>
        <button onClick={() => navigate(-1)} className="text-sm text-foreground-muted hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Retour
        </button>
      </div>

      <main className="flex-1 px-4 pb-16 max-w-[680px] w-full mx-auto">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Pour un diagnostic personnalisé, DÉCLIC a besoin d'accéder à une IA générative.
          </h1>
        </motion.div>

        {/* Explainer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="lecko-card p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Pourquoi une clé API ?</p>
          <p className="text-sm text-foreground-secondary leading-relaxed mb-2">
            DÉCLIC utilise l'intelligence artificielle pour analyser votre quotidien et générer des recommandations sur-mesure. La clé API connecte DÉCLIC au modèle IA.
          </p>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            Votre clé reste dans votre navigateur. Aucune donnée n'est stockée par DÉCLIC.
          </p>
        </motion.div>

        {/* Provider selection */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <p className="text-sm font-semibold text-foreground mb-3">Choisissez votre fournisseur :</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {([
              { id: "openai" as AIProvider, letter: "O", letterBg: "#10B981", name: "OpenAI", model: "GPT-4o", desc: "Rapide et polyvalent", cost: "~0,01 € par diagnostic" },
              { id: "anthropic" as AIProvider, letter: "A", letterBg: "#F59E0B", name: "Anthropic", model: "Claude", desc: "Analyse approfondie", cost: "~0,02 € par diagnostic" },
            ]).map((p) => (
              <button
                key={p.id}
                onClick={() => { setProvider(p.id); setKey(""); }}
                className={`lecko-card p-5 text-left border-2 transition-all hover:shadow-md ${
                  provider === p.id ? "border-primary bg-primary/5" : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: p.letterBg }}>
                    {p.letter}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-foreground-muted">{p.model}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground-secondary mb-1">{p.desc}</p>
                <p className="text-xs text-foreground-muted">{p.cost}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Instructions + key input */}
        <AnimatePresence mode="wait">
          {provider && (
            <motion.div key={provider} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              {/* Steps */}
              <p className="text-sm font-semibold text-foreground mb-4">Comment obtenir votre clé en 3 étapes :</p>
              <div className="lecko-card p-5 mb-6 space-y-5">
                {steps.map((s) => (
                  <div key={s.num} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{s.num}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{s.title}</p>
                      <p className="text-xs text-foreground-secondary mt-0.5 leading-relaxed">{s.detail}</p>
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1.5">
                        {s.linkLabel} <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key input */}
              <div className="lecko-card p-5 mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">Collez votre clé API ici :</label>
                <div className="relative mb-3">
                  <input
                    type={showKey ? "text" : "password"}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={provider === "openai" ? "sk-proj-..." : "sk-ant-api03-..."}
                    className={`w-full h-11 px-4 pr-10 text-sm bg-background border-2 rounded-xl outline-none transition-colors ${
                      isValid ? "border-green-500 focus:border-green-500" : showError ? "border-red-400 focus:border-red-400" : "border-border focus:border-primary"
                    }`}
                  />
                  {isValid && (
                    <CheckCircle size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                  <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors" type="button">
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {isValid && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mb-2">
                    <CheckCircle size={12} /> Clé valide
                  </p>
                )}
                {showError && (
                  <p className="text-xs text-red-500 mb-2">
                    {provider === "openai" ? "La clé OpenAI doit commencer par sk- et contenir au moins 20 caractères." : "La clé Anthropic doit commencer par sk-ant- et contenir au moins 20 caractères."}
                  </p>
                )}
                <p className="text-xs text-foreground-secondary flex items-center gap-1.5">
                  <Shield size={13} className="text-primary shrink-0" />
                  Votre clé reste stockée uniquement dans votre navigateur. DÉCLIC ne la transmet jamais.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleContinue}
                disabled={!isValid}
                className="w-full h-12 rounded-full font-semibold text-sm text-white bg-primary hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] mb-4"
              >
                Continuer vers le diagnostic
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback */}
        <div className="text-center mt-4">
          <p className="text-sm text-foreground-muted mb-1">Pas de clé API ?</p>
          <Link to={metierParam ? `/resultats?metier=${encodeURIComponent(metierParam)}&source=local` : "/"} className="text-sm font-semibold text-primary hover:underline">
            Lancer un diagnostic express gratuit
          </Link>
        </div>
      </main>
    </div>
  );
}
