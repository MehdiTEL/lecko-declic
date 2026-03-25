export type UserRole = "salarie" | "manager" | "consultant" | null;
export type UserSecteur =
  | "finance_gestion" | "tech_produit" | "marketing_communication"
  | "management_conseil" | "rh_commercial" | "secteur_public" | null;
export type UserStack = "m365" | "google" | "les_deux" | "autre" | null;

export interface UserProfileLocal {
  role: UserRole;
  secteur: UserSecteur;
  stack: UserStack;
  diagnosticsCount: number;
  lastVisit: string;
  profileCompletedAt?: string;
}

const PROFILE_KEY = "declic-user-profile";

function defaultProfile(): UserProfileLocal {
  return { role: null, secteur: null, stack: null, diagnosticsCount: 0, lastVisit: new Date().toISOString() };
}

export function loadProfile(): UserProfileLocal {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...defaultProfile(), ...JSON.parse(raw) } : defaultProfile();
  } catch { return defaultProfile(); }
}

export function saveProfile(profile: UserProfileLocal): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function incrementDiagnosticsCount(): void {
  const p = loadProfile();
  saveProfile({ ...p, diagnosticsCount: p.diagnosticsCount + 1, lastVisit: new Date().toISOString() });
}

export function getNextProfileQuestion(profile: UserProfileLocal): "role" | "secteur" | "stack" | null {
  // Check dismiss flags (7 day cooldown)
  const isDismissed = (q: string) => {
    try {
      const d = localStorage.getItem(`declic-question-dismissed-${q}`);
      if (!d) return false;
      return (Date.now() - new Date(d).getTime()) < 7 * 24 * 60 * 60 * 1000;
    } catch { return false; }
  };

  if (!profile.role && !isDismissed("role")) return "role";
  if (profile.diagnosticsCount >= 2 && !profile.secteur && !isDismissed("secteur")) return "secteur";
  if (profile.diagnosticsCount >= 4 && !profile.stack && !isDismissed("stack")) return "stack";
  return null;
}

export function getPersonalizationHints(profile: UserProfileLocal): {
  sectorBenchmark: string | null;
  stackFilter: UserStack;
  roleLabel: string | null;
} {
  const sectorMap: Record<string, string> = {
    finance_gestion: "Finance & Gestion",
    tech_produit: "Tech & Produit",
    marketing_communication: "Marketing & Communication",
    management_conseil: "Management & Conseil",
    rh_commercial: "RH & Commercial",
    secteur_public: "Secteur Public",
  };
  const roleLabels: Record<string, string> = {
    salarie: "Salarie",
    manager: "Manager",
    consultant: "Consultant",
  };
  return {
    sectorBenchmark: profile.secteur ? sectorMap[profile.secteur] ?? null : null,
    stackFilter: profile.stack,
    roleLabel: profile.role ? roleLabels[profile.role] ?? null : null,
  };
}
