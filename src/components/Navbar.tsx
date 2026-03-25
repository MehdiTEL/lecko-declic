import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, History, Users, Sparkles, Trophy, CheckSquare } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useChatContext } from "@/context/ChatContext";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import DeclicLogo from "@/components/DeclicLogo";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { openChat, hasSeenNew } = useChatContext();
  const { globalProgress, currentMaturity, state: progressState } = useProgress();
  const { profile, signOut } = useAuth();
  const hasProgress = globalProgress.total > 0;

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/methode", label: "Méthode" },
    { to: "/equipe", label: "Équipe", icon: <Users size={15} strokeWidth={1.5} /> },
    { to: "/historique", label: "Mes diagnostics", icon: <History size={15} strokeWidth={1.5} /> },
    ...(hasProgress ? [{ to: "/mes-automations", label: "Mes automations", icon: <CheckSquare size={15} strokeWidth={1.5} /> }] : []),
    { to: "/notre-histoire", label: "Notre histoire" },
  ];

  const linkClass = (to: string) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-primary ${
      location.pathname === to ? "text-primary" : "text-foreground-secondary"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo DÉCLIC */}
        <Link to="/" className="flex items-center gap-2">
          <DeclicLogo size="sm" />
          {location.search.includes("demo=1") && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
              DÉMO
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Consultant IA — pill button with Sparkles */}
          <button
            onClick={() => openChat()}
            className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Consultant IA"
          >
            <Sparkles size={15} strokeWidth={1.5} />
            <span>Consultant IA</span>
            {!hasSeenNew && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gr33t-500 border-2 border-white dark:border-card animate-pulse" />
            )}
          </button>

          {/* User info + logout */}
          {profile && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-muted">{profile.prenom}</span>
              <button onClick={signOut} className="text-xs text-foreground-muted hover:text-foreground transition-colors">
                Deconnexion
              </button>
            </div>
          )}

          {/* Theme toggle — styled as the DÉCLIC orange dot */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center"
            style={{ backgroundColor: theme === "light" ? "hsl(var(--muted))" : "hsl(221 83% 30%)" }}
            aria-label="Changer de thème"
          >
            <div
              className="absolute w-4 h-4 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center"
              style={{
                backgroundColor: "#F59E0B",
                left: theme === "light" ? "2px" : "calc(100% - 18px)",
              }}
            >
              {theme === "light"
                ? <Sun size={10} className="text-white" strokeWidth={2.5} />
                : <Moon size={10} className="text-white" strokeWidth={2.5} />
              }
            </div>
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => openChat()}
            className="relative p-2 rounded-full bg-primary text-white shadow-sm"
            aria-label="Consultant IA"
          >
            <Sparkles size={18} strokeWidth={1.5} />
            {!hasSeenNew && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gr33t-500 border-2 border-white dark:border-card" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center"
            style={{ backgroundColor: theme === "light" ? "hsl(var(--muted))" : "hsl(221 83% 30%)" }}
            aria-label="Changer de thème"
          >
            <div
              className="absolute w-4 h-4 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center"
              style={{
                backgroundColor: "#F59E0B",
                left: theme === "light" ? "2px" : "calc(100% - 18px)",
              }}
            >
              {theme === "light"
                ? <Sun size={10} className="text-white" strokeWidth={2.5} />
                : <Moon size={10} className="text-white" strokeWidth={2.5} />
              }
            </div>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-muted"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-card border-b border-border/60 px-5 py-4 flex flex-col gap-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2.5 transition-colors ${
                location.pathname === link.to ? "text-primary" : "text-foreground-secondary"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openChat(); }}
            className="flex items-center gap-2 text-sm font-semibold py-2.5 text-primary hover:text-primary/80 transition-colors text-left"
          >
            <Sparkles size={15} strokeWidth={1.5} />
            Consultant IA
          </button>
          {profile && (
            <div className="border-t border-border/60 pt-3 mt-2 flex items-center justify-between">
              <span className="text-xs text-foreground-muted">{profile.prenom} {profile.nom}</span>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                Deconnexion
              </button>
            </div>
          )}
        </div>
      )}
      {/* Progress bar — only if user has tracked tasks */}
      {hasProgress && (
        <div className="relative h-1 bg-muted">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-r-full"
            style={{
              width: `${globalProgress.percent}%`,
              backgroundColor: currentMaturity.color,
            }}
          />
          <Link
            to="/mon-parcours"
            className="absolute right-2 -top-3.5 flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-card border border-border/60 shadow-sm hover:shadow-md transition-shadow"
            style={{ color: currentMaturity.color }}
          >
            {currentMaturity.label} · {globalProgress.percent}%
            {progressState.streak.currentStreak >= 2 && (
              <span className="text-amber-500 ml-1">{progressState.streak.currentStreak}j</span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
