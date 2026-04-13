import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface FooterLink {
  label: string;
  to: string;
}

const footerLinks: FooterLink[] = [
  { label: "Diagnostic", to: "/diagnostic" },
  { label: "Formations", to: "/formations" },
  { label: "Mentions légales", to: "/mentions-legales" },
];

export default function AppFooter() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-xl font-bold text-white tracking-tight"
            >
              <Zap className="h-5 w-5 text-violet-500" />
              DÉCLIC
            </Link>
            <p className="text-sm text-[#55556A] max-w-xs">
              Formation à l&apos;automatisation par l&apos;IA
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[#8A8AA3] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/[0.04]">
          <p className="text-xs text-[#55556A]">
            &copy; 2026 DÉCLIC. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
