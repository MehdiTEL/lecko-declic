import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: "Diagnostic", to: "/diagnostic" },
  { label: "Formations", to: "/formations" },
  { label: "Tableau de bord", to: "/dashboard" },
];

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/80 backdrop-blur-lg border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-bold text-white tracking-tight"
          >
            DÉCLIC
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[#8A8AA3] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
            >
              Tester mon niveau
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-[#8A8AA3] hover:text-white transition-colors duration-200"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0A0A0F]/95 backdrop-blur-lg border-t border-white/[0.06] px-4 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#8A8AA3] hover:text-white py-3 px-2 rounded-lg hover:bg-white/[0.04] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 px-2">
            <Link
              to="/diagnostic"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
            >
              Tester mon niveau
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
