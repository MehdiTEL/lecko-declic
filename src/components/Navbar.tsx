import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, History, Settings, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { getApiKey, getProvider, AIProvider } from "@/lib/aiProvider";

const PROVIDER_BADGE: Record<AIProvider, string> = {
  openai: "GPT ✓",
  anthropic: "Claude ✓",
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasKey, setHasKey] = useState<boolean>(!!getApiKey());
  const [provider, setProvider] = useState<AIProvider | null>(getProvider());
  const location = useLocation();

  useEffect(() => {
    setHasKey(!!getApiKey());
    setProvider(getProvider());
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/historique", label: "Historique" },
  ];

  const ProviderDot = () => (
    <span
      className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold px-1 rounded-full leading-4 ${
        hasKey
          ? "bg-lecko-green text-primary-foreground"
          : "bg-destructive text-primary-foreground"
      }`}
      style={{ minWidth: "auto" }}
    >
      {hasKey && provider ? PROVIDER_BADGE[provider] : "API ✗"}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-lecko-blue tracking-tight">lecko.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-lecko-blue ${
                location.pathname === link.to ? "text-lecko-blue" : "text-foreground-secondary"
              }`}
            >
              {link.label === "Historique" && <History size={14} />}
              {link.label}
            </Link>
          ))}

          {/* Settings with provider indicator */}
          <Link
            to="/parametres"
            className={`relative p-2 rounded-lg hover:bg-muted transition-colors ${
              location.pathname === "/parametres"
                ? "text-lecko-blue"
                : "text-foreground-secondary hover:text-lecko-blue"
            }`}
            aria-label="Paramètres"
          >
            <Settings size={18} />
            <ProviderDot />
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-secondary hover:text-lecko-blue"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/parametres"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-foreground-secondary"
            aria-label="Paramètres"
          >
            <Settings size={18} />
            <ProviderDot />
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-secondary"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-secondary"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-semibold py-2 transition-colors ${
                location.pathname === link.to ? "text-lecko-blue" : "text-foreground-secondary"
              }`}
            >
              {link.label === "Historique" && <History size={14} />}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
