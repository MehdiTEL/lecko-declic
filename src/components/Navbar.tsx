import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, History, Users, Sparkles, CheckSquare, LogOut, User } from "lucide-react";
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
    { to: "/equipe", label: "Équipe", icon: <Users size={14} strokeWidth={1.5} /> },
    { to: "/historique", label: "Historiques", icon: <History size={14} strokeWidth={1.5} /> },
    ...(hasProgress ? [{ to: "/mes-automations", label: "Automations", icon: <CheckSquare size={14} strokeWidth={1.5} /> }] : []),
    { to: "/notre-histoire", label: "Notre histoire" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <header className="sticky top-0 z-50 bg-white/98 dark:bg-card/98 backdrop-blur-sm">
      {/* Main bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 h-[60px] flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <DeclicLogo size="sm" className="transition-opacity group-hover:opacity-80" />
            {location.search.includes("demo=1") && (
              <span className="text-[10px] font-bold tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase">
                Démo
              </span>
            )}
          </Link>

          {/* Desktop Nav — centre */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium
                  ${isActive(link.to)
                    ? "text-foreground bg-muted"
                    : "text-foreground-muted hover:text-foreground hover:bg-muted/60"
                  }`}
              >
                {link.icon && <span className="opacity-70">{link.icon}</span>}
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary opacity-70" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">

            {/* Consultant IA */}
            <button
              onClick={() => openChat()}
              className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Consultant IA"
            >
              <Sparkles size={14} strokeWidth={1.5} />
              <span>Consultant IA</span>
              {!hasSeenNew && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-card animate-pulse" />
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200"
              aria-label="Changer de thème"
            >
              {theme === "light"
                ? <Sun size={16} strokeWidth={1.5} />
                : <Moon size={16} strokeWidth={1.5} />
              }
            </button>

            {/* User avatar or login link */}
            {profile ? (
              <div className="flex items-center gap-1 pl-1 border-l border-border/60 ml-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {profile.prenom?.charAt(0).toUpperCase()}{profile.nom?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground-secondary">
                    {profile.prenom}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-200"
                  aria-label="Déconnexion"
                  title="Déconnexion"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                <User size={14} strokeWidth={1.5} />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile — right actions */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => openChat()}
              className="relative p-2 rounded-full bg-primary text-white shadow-sm"
              aria-label="Consultant IA"
            >
              <Sparkles size={17} strokeWidth={1.5} />
              {!hasSeenNew && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-card" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-muted hover:bg-muted transition-colors"
              aria-label="Changer de thème"
            >
              {theme === "light" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground-muted"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {hasProgress && (
        <div className="relative h-[3px] bg-muted">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
            style={{ width: `${globalProgress.percent}%`, backgroundColor: currentMaturity.color }}
          />
          <Link
            to="/mon-parcours"
            className="absolute right-4 -top-3 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            style={{ color: currentMaturity.color }}
          >
            {currentMaturity.label} · {globalProgress.percent}%
            {progressState.streak.currentStreak >= 2 && (
              <span className="text-amber-500 ml-0.5">{progressState.streak.currentStreak}j</span>
            )}
          </Link>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-card border-b border-border/50 px-4 py-3 flex flex-col gap-0.5 animate-fade-in shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors
                ${isActive(link.to)
                  ? "bg-muted text-foreground"
                  : "text-foreground-secondary hover:bg-muted/60 hover:text-foreground"
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openChat(); }}
            className="flex items-center gap-2.5 text-sm font-semibold px-3 py-2.5 rounded-lg text-primary hover:bg-primary/5 transition-colors text-left mt-1"
          >
            <Sparkles size={14} strokeWidth={1.5} />
            Consultant IA
          </button>
          {profile ? (
            <div className="border-t border-border/50 pt-3 mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {profile.prenom?.charAt(0).toUpperCase()}{profile.nom?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground-secondary">
                  {profile.prenom} {profile.nom}
                </span>
              </div>
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                <LogOut size={13} strokeWidth={1.5} />
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="border-t border-border/50 mt-2 pt-3 flex items-center gap-2 text-sm font-medium text-primary px-1"
            >
              <User size={14} strokeWidth={1.5} />
              Se connecter
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
