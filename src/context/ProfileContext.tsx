import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  UserProfileLocal, loadProfile, saveProfile, getNextProfileQuestion, getPersonalizationHints,
  UserRole, UserSecteur, UserStack,
} from "@/lib/userProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ProfileContextValue {
  profile: UserProfileLocal;
  hints: ReturnType<typeof getPersonalizationHints>;
  pendingQuestion: "role" | "secteur" | "stack" | null;
  answerQuestion: (question: string, value: string) => void;
  dismissQuestion: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfileLocal>(loadProfile);
  const [dismissed, setDismissed] = useState(false);
  const auth = useAuth();

  const hints = getPersonalizationHints(profile);
  const pendingQuestion = dismissed ? null : getNextProfileQuestion(profile);

  const answerQuestion = useCallback((question: string, value: string) => {
    const updated = { ...profile };
    if (question === "role") updated.role = value as UserRole;
    if (question === "secteur") updated.secteur = value as UserSecteur;
    if (question === "stack") updated.stack = value as UserStack;

    // Check if profile complete
    if (updated.role && updated.secteur && updated.stack && !updated.profileCompletedAt) {
      updated.profileCompletedAt = new Date().toISOString();
    }

    saveProfile(updated);
    setProfile(updated);

    // Sync to Supabase if authenticated (fire-and-forget)
    if (auth?.user) {
      (supabase.from("user_profiles") as any)
        .update({ [question]: value })
        .eq("id", auth.user.id)
        .then(() => {})
        .catch(() => {});
    }
  }, [profile, auth]);

  const dismissQuestion = useCallback(() => {
    if (pendingQuestion) {
      try {
        localStorage.setItem(`declic-question-dismissed-${pendingQuestion}`, new Date().toISOString());
      } catch { /* silent */ }
    }
    setDismissed(true);
  }, [pendingQuestion]);

  return (
    <ProfileContext.Provider value={{ profile, hints, pendingQuestion, answerQuestion, dismissQuestion }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
