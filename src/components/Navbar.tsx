import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, History, Users, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useChatContext } from "@/context/ChatContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { openChat, hasSeenNew } = useChatContext();

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/methode", label: "Méthode" },
    { to: "/equipe", label: "Équipe", icon: <Users size={14} /> },
    { to: "/historique", label: "Historique", icon: <History size={14} /> },
  ];

  const linkClass = (to: string) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-lecko-blue ${
      location.pathname === to ? "text-lecko-blue" : "text-foreground-secondary"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-lecko-blue tracking-tight">lecko.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Coach IA */}
          <button
            onClick={() => openChat()}
            className="relative flex items-center gap-1.5 text-sm font-medium text-foreground-secondary hover:text-lecko-blue transition-colors duration-200"
            aria-label="Coach Automatisation"
          >
            <MessageCircle size={16} />
            <span>Coach IA</span>
            {!hasSeenNew && (
              <span className="absolute -top-1.5 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-lecko-green text-white leading-3">
                Nouveau
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground-muted hover:text-foreground"
            aria-label="Changer de thème"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => openChat()}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-foreground-muted"
            aria-label="Coach Automatisation"
          >
            <MessageCircle size={18} />
            {!hasSeenNew && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lecko-green" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-muted"
            aria-label="Changer de thème"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground-muted"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — slide down */}
      {menuOpen && (
        <div className="md:hidden bg-card border-b border-border px-5 py-4 flex flex-col gap-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2.5 transition-colors ${
                location.pathname === link.to ? "text-lecko-blue" : "text-foreground-secondary"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openChat(); }}
            className="flex items-center gap-2 text-sm font-medium py-2.5 text-foreground-secondary hover:text-lecko-blue transition-colors text-left"
          >
            <MessageCircle size={14} />
            Coach IA
          </button>
        </div>
      )}
    </header>
  );
}
