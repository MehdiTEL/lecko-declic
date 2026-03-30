import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Briefcase, Library, Settings, LogOut, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Masquée sur les pages client et entretien live
  const hidden = ["/client/", "/entretien/", "/login"].some(p => location.pathname.startsWith(p))
    || location.pathname.match(/\/missions\/[^/]+\/entretien\//);
  if (hidden) return null;

  const navLinks = [
    { to: "/missions",    label: "Mes missions",  icon: Briefcase },
    { to: "/bibliotheque", label: "Bibliothèque", icon: Library },
  ];

  const isActive = (to: string) => location.pathname.startsWith(to);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate("/login");
  };

  const initials = profile
    ? (profile.prenom?.[0] ?? "") + (profile.nom?.[0] ?? "")
    : "?";

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-slate-950 dark:bg-slate-950
                         border-b border-slate-800 flex items-center px-6 gap-6">

        {/* Logo */}
        <Link to="/missions" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logo-declic.png"
            alt="DÉCLIC"
            style={{ height: "24px", filter: "brightness(0) invert(1)" }}
            className="transition-opacity group-hover:opacity-80"
          />
          <span className="hidden sm:block text-slate-600 text-xs font-mono
                           border-l border-slate-800 pl-3">
            Espace consultant
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                isActive(to)
                  ? "bg-lecko-blue/15 text-white font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}>
              <Icon size={15} strokeWidth={1.5}
                className={isActive(to) ? "text-lecko-blue" : ""} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="ml-auto flex items-center gap-2">

          {/* Toggle thème */}
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all">
            {theme === "dark"
              ? <Sun size={15} strokeWidth={1.5} />
              : <Moon size={15} strokeWidth={1.5} />}
          </button>

          {/* Menu utilisateur */}
          {profile && (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg
                           text-slate-300 hover:bg-slate-800 transition-all text-sm">
                <div className="w-6 h-6 rounded-md bg-lecko-blue/25 flex items-center justify-center
                                text-lecko-blue text-[10px] font-bold font-mono shrink-0">
                  {initials.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-slate-300">{profile.prenom}</span>
                <ChevronDown size={12} strokeWidth={1.5} className="text-slate-600" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900
                                  border border-slate-800 rounded-xl shadow-2xl shadow-black/50
                                  overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white">
                        {profile.prenom} {profile.nom}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Consultant Lecko
                      </p>
                    </div>
                    <Link to="/parametres" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400
                                 hover:text-white hover:bg-slate-800 transition-all">
                      <Settings size={14} strokeWidth={1.5} />
                      Paramètres
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                                 text-slate-400 hover:text-red-400 hover:bg-red-950/30
                                 transition-all border-t border-slate-800">
                      <LogOut size={14} strokeWidth={1.5} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Burger mobile */}
          <button onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center
                       text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1 z-40">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive(to)
                  ? "bg-lecko-blue/15 text-white font-medium"
                  : "text-slate-400"
              )}>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
