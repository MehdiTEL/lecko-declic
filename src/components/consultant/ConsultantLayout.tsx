import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  MessageSquare,
  Layers,
  GitBranch,
  Download,
  Settings,
  Briefcase,
  Library,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mission, MissionStatut } from "@/types/consultant";
import { MISSION_STATUT_COLORS, MISSION_STATUT_LABELS } from "@/types/consultant";

interface ConsultantLayoutProps {
  mission?: Mission | null;
  activeSection?: string;
  children: ReactNode;
}

export default function ConsultantLayout({
  mission,
  activeSection,
  children,
}: ConsultantLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compute progress
  const entretiens = mission?.entretiens ?? [];
  const nbEntretiensTotal = entretiens.length;
  const nbEntretiensTermines = entretiens.filter((e) => e.statut === "termine").length;
  const nbChantiers = mission?.chantiers?.length ?? 0;

  const handleExportPdf = async () => {
    if (!mission) return;
    const { generateConsultantPdf } = await import("@/lib/consultantPdf");
    await generateConsultantPdf(mission, mission.entretiens ?? [], mission.chantiers ?? []);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background font-consultant">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          "w-[240px] flex-shrink-0 flex flex-col bg-consultant-sidebar border-r border-consultant-border",
          "fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo + retour app */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-consultant-border">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo-declic.png"
              alt="DÉCLIC"
              style={{ height: "22px", filter: "brightness(0) invert(1)", opacity: 0.9 }}
            />
          </Link>
          <Link
            to="/missions"
            className="text-consultant-muted hover:text-consultant-text transition-colors text-xs flex items-center gap-1"
          >
            <LayoutGrid size={13} strokeWidth={1.5} />
            Missions
          </Link>
        </div>

        {/* Client actif */}
        {mission && (
          <div className="px-4 py-4 border-b border-consultant-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-blue/20 text-brand-blue text-xs font-bold font-mono flex-shrink-0">
                {mission.client_organisation.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-consultant-text text-sm font-semibold truncate leading-tight">
                  {mission.client_nom}
                </p>
                <p className="text-consultant-muted text-xs truncate">
                  {mission.client_organisation}
                </p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-consultant-muted font-mono">Progression</span>
                <span className="text-consultant-text font-mono font-medium">
                  {nbEntretiensTermines}/{nbEntretiensTotal}
                </span>
              </div>
              <div className="h-1 bg-consultant-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round(
                      (nbEntretiensTermines / Math.max(nbEntretiensTotal, 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Badge statut mission */}
            <div className="mt-3">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${MISSION_STATUT_COLORS[mission.statut]}18`,
                  color: MISSION_STATUT_COLORS[mission.statut],
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: MISSION_STATUT_COLORS[mission.statut] }}
                />
                {MISSION_STATUT_LABELS[mission.statut]}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {mission ? (
            <NavSection label="Mission">
              <NavItem
                to={`/missions/${mission.id}`}
                icon={BarChart3}
                label="Vue d'ensemble"
                active={activeSection === "overview"}
              />
              <NavItem
                to={`/missions/${mission.id}?tab=entretiens`}
                icon={MessageSquare}
                label="Entretiens"
                active={activeSection === "entretiens"}
                badge={nbEntretiensTermines}
              />
              <NavItem
                to={`/missions/${mission.id}?tab=chantiers`}
                icon={Layers}
                label="Chantiers"
                active={activeSection === "chantiers"}
                badge={nbChantiers}
              />
              <NavItem
                to={`/missions/${mission.id}/roadmap`}
                icon={GitBranch}
                label="Feuille de route"
                active={activeSection === "roadmap"}
              />
            </NavSection>
          ) : (
            <NavSection label="Espace consultant">
              <NavItem
                to="/missions"
                icon={Briefcase}
                label="Mes missions"
                active={activeSection === "missions"}
              />
              <NavItem
                to="/bibliotheque"
                icon={Library}
                label="Ma bibliothèque"
                active={activeSection === "bibliotheque"}
              />
            </NavSection>
          )}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-consultant-border">
          {mission && (
            <button
              onClick={handleExportPdf}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-consultant-muted hover:text-consultant-text hover:bg-consultant-hover transition-all text-xs font-mono"
            >
              <Download size={13} strokeWidth={1.5} />
              Exporter PDF
            </button>
          )}
          <Link
            to="/parametres"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mt-1 text-consultant-muted hover:text-consultant-text hover:bg-consultant-hover transition-all text-xs font-mono"
          >
            <Settings size={13} strokeWidth={1.5} />
            Paramètres
          </Link>
        </div>
      </aside>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden h-14 flex items-center px-4 border-b border-border bg-card">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} strokeWidth={1.5} className="text-slate-600" />
          </button>
          <span className="ml-3 text-sm font-consultant font-semibold text-slate-800">
            {mission ? mission.client_organisation : "Espace consultant"}
          </span>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

/* ── Composants internes ── */

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-[10px] font-mono font-medium uppercase tracking-widest text-consultant-muted/60">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  active,
  badge,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
        active
          ? "bg-brand-blue/15 text-consultant-text font-medium"
          : "text-consultant-muted hover:text-consultant-text hover:bg-consultant-hover"
      )}
    >
      <Icon size={15} strokeWidth={1.5} className={active ? "text-brand-blue" : ""} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue">
          {badge}
        </span>
      )}
    </Link>
  );
}
