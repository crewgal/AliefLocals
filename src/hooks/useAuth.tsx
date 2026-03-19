import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import {
  getCurrentUser,
  getStoredSession,
  persistSession,
  signIn as apiSignIn,
  signUp as apiSignUp,
  type AuthSession,
  type AuthUser,
} from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const storedSession = getStoredSession();

      if (!storedSession) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      setSession(storedSession);
      setUser(storedSession.user);

      try {
        const currentUser = await getCurrentUser();
        if (!active) return;

        const nextSession = { token: storedSession.token, user: currentUser };
        persistSession(nextSession);
        setSession(nextSession);
        setUser(currentUser);
      } catch {
        if (!active) return;
        persistSession(null);
        setSession(null);
        setUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  const signIn = async (input: { email: string; password: string }) => {
    const nextSession = await apiSignIn(input);
    persistSession(nextSession);
    setSession(nextSession);
    setUser(nextSession.user);
  };

  const signUp = async (input: { name: string; email: string; password: string }) => {
    const nextSession = await apiSignUp(input);
    persistSession(nextSession);
    setSession(nextSession);
    setUser(nextSession.user);
  };

  const signOut = async () => {
    persistSession(null);
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
