import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface ConsultantProfile {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  entreprise: string | null;
  role: "consultant" | "admin";
  actif: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: ConsultantProfile | null;
  session: Session | null;
  loading: boolean;
  isLeckoConsultant: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  inviteConsultant: (email: string, prenom: string, nom: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLeckoConsultant, setIsLeckoConsultant] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id, s.user.email ?? "");
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id, s.user.email ?? "");
      else { setProfile(null); setIsLeckoConsultant(false); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string, email: string) {
    try {
      // Vérifie si l'email est dans la whitelist Lecko
      // @ts-ignore — RPC not in generated types
      const { data: isAllowed } = await supabase
        .rpc("is_lecko_consultant", { check_email: email });

      setIsLeckoConsultant(!!isAllowed);

      if (!isAllowed) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Charge le profil depuis user_profiles
      // @ts-ignore
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Charge le rôle depuis lecko_consultants
      // @ts-ignore
      const { data: consultantData } = await supabase
        .from("lecko_consultants")
        .select("role, actif, prenom, nom")
        .eq("email", email)
        .single();

      if (data) {
        setProfile({
          ...data,
          role: consultantData?.role ?? "consultant",
          actif: consultantData?.actif ?? true,
        } as ConsultantProfile);
      } else if (consultantData) {
        // Pas de user_profiles mais dans la whitelist
        setProfile({
          id: userId,
          email,
          prenom: consultantData.prenom ?? "",
          nom: consultantData.nom ?? "",
          entreprise: "Lecko",
          role: consultantData.role ?? "consultant",
          actif: consultantData.actif ?? true,
        });
      }
    } catch {
      // Ignore les erreurs de profil
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    // Vérifie d'abord si l'email est autorisé AVANT de tenter la connexion
    // @ts-ignore
    const { data: isAllowed } = await supabase
      .rpc("is_lecko_consultant", { check_email: email.toLowerCase().trim() });

    if (!isAllowed) {
      return { error: "Accès réservé aux consultants Lecko. Contactez votre administrateur." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login")) {
        return { error: "Email ou mot de passe incorrect." };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "Confirmez votre email avant de vous connecter." };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsLeckoConsultant(false);
  };

  const inviteConsultant = async (email: string, prenom: string, nom: string) => {
    if (profile?.role !== "admin") {
      return { error: "Accès refusé — réservé aux administrateurs." };
    }

    // @ts-ignore
    const { error: wlError } = await supabase
      .from("lecko_consultants")
      .insert({ email: email.toLowerCase().trim(), prenom, nom, invited_by: user?.id });

    if (wlError) {
      if (wlError.message?.includes("unique")) {
        return { error: "Ce consultant est déjà invité." };
      }
      return { error: wlError.message };
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading, isLeckoConsultant,
      signIn, signOut, inviteConsultant
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
