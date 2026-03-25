import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  entreprise: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, prenom: string, nom: string, entreprise?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    try {
      const { data } = await (supabase.from("user_profiles") as any)
        .select("*")
        .eq("id", userId)
        .single();
      if (data) setProfile(data);
    } catch { /* profile may not exist yet */ }
  }

  const signUp = async (email: string, password: string, prenom: string, nom: string, entreprise?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom, nom, entreprise: entreprise ?? "" },
        // Skip email confirmation — auto-confirm on signup
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return { error: "Un compte existe deja avec cet email." };
      }
      return { error: error.message };
    }

    // Create profile
    if (data.user) {
      await (supabase.from("user_profiles") as any).insert({
        id: data.user.id,
        email,
        prenom,
        nom,
        entreprise: entreprise ?? null,
      });
    }

    // If Supabase returned a session, the user is auto-confirmed
    if (data.session) {
      return { error: null };
    }

    // If no session, Supabase requires email confirmation
    // Workaround: try signing in immediately (works if autoconfirm is enabled in Supabase)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      // Email confirmation is enforced by Supabase — inform the user clearly
      return { error: null, needsConfirmation: true } as any;
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login")) {
        return { error: "Email ou mot de passe incorrect." };
      }
      return { error: error.message };
    }
    // Link anon_id to profile for email features
    const anonId = localStorage.getItem("declic-anon-id");
    if (anonId && data.user) {
      (supabase.from("user_profiles") as any)
        .update({ anon_id_link: anonId })
        .eq("id", data.user.id)
        .then(() => {}).catch(() => {});
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
