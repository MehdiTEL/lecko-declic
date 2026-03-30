import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Library, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Masquée sur les pages client publiques et sur l'entretien live
  const hiddenPaths = ["/client/", "/entretien/", "/login"];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;
  // Masquée sur les routes /missions/:id/entretien (mode projeté)
  if (location.pathname.match(/\/missions\/[^/]+\/entretien\//)) return null;

  const navLinks = [
    { to: "/missions", label: "Mes missions", icon: Briefcase },
    { to: "/bibliotheque", label: "Bibliothèque", icon: Library },
  ];

  const isActive = (to: string) =>
    to === "/missions"
      ? location.pathname.startsWith("/missions")
      : location.pathname.startsWith(to);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-slate-950 border-b border-slate-800
                       flex items-center px-6 gap-6">
      {/* Logo */}
      <Link to="/missions" className="flex items-center gap-2 shrink-0">
        <img src="/logo-declic.png" alt="DÉCLIC"
          style={{ height: "22px", filter: "brightness(0) invert(1)" }} />
        <span className="text-slate-600 text-xs font-mono hidden sm:block">
          Espace consultant
        </span>
      </Link>

      {/* Nav desktop */}
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

      {/* User menu */}
      <div className="ml-auto flex items-center gap-2">
        {profile && (
          <div className="relative">
            <button onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                         text-slate-300 hover:bg-slate-800 transition-all text-sm">
              <div className="w-6 h-6 rounded-md bg-lecko-blue/20 flex items-center
                              justify-center text-lecko-blue text-[10px] font-bold font-mono">
                {(profile.prenom?.[0] ?? "") + (profile.nom?.[0] ?? "")}
              </div>
              <span className="hidden sm:block">{profile.prenom}</span>
              <ChevronDown size={13} strokeWidth={1.5} className="text-slate-500" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900
                                border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">
                      {profile.prenom} {profile.nom}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">{profile.role}</p>
                  </div>
                  <Link to="/parametres" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400
                               hover:text-white hover:bg-slate-800 transition-all">
                    <Settings size={14} strokeWidth={1.5} />
                    Paramètres
                  </Link>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400
                               hover:text-red-400 hover:bg-slate-800 transition-all">
                    <LogOut size={14} strokeWidth={1.5} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile menu */}
        <button onClick={() => setMenuOpen(v => !v)}
          className="md:hidden text-slate-400 hover:text-white p-1.5">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-slate-950 border-b border-slate-800
                        md:hidden px-4 py-3 space-y-1 z-50">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                isActive(to) ? "bg-lecko-blue/15 text-white" : "text-slate-400"
              )}>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
