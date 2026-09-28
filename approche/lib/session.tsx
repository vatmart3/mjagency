"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabase } from "@/lib/supabase/client";
import { DEMO_USERS } from "@/lib/data/demo";
import type { Profile } from "@/lib/types";

interface SessionValue {
  me: Profile | null;
  profiles: Profile[];
  loading: boolean;
  demo: boolean;
  nameOf: (id: string | null | undefined) => string;
  partner: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInDemo: (id: string) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<SessionValue | null>(null);
const DEMO_KEY = "approche.demoUser";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(isSupabaseConfigured ? [] : DEMO_USERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured) {
        let id: string | null = null;
        try {
          id = localStorage.getItem(DEMO_KEY);
        } catch {}
        if (!cancelled) {
          setMe(DEMO_USERS.find((u) => u.id === id) ?? null);
          setLoading(false);
        }
        return;
      }
      const sb = getSupabase();
      const { data } = await sb.auth.getUser();
      const user = data.user;
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data: rows } = await sb.from("profiles").select("*");
      const list = (rows ?? []) as Profile[];
      if (!cancelled) {
        setProfiles(list);
        setMe(
          list.find((p) => p.id === user.id) ?? {
            id: user.id,
            email: user.email ?? "",
            display_name: user.email?.split("@")[0] ?? "Moi",
            color: "#0071E3",
          },
        );
        setLoading(false);
      }
    }
    void load();
    let unsub: (() => void) | undefined;
    if (isSupabaseConfigured) {
      const { data } = getSupabase().auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") setMe(null);
        if (event === "SIGNED_IN") void load();
      });
      unsub = () => data.subscription.unsubscribe();
    }
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      me,
      profiles,
      loading,
      demo: !isSupabaseConfigured,
      partner: profiles.find((p) => p.id !== me?.id) ?? null,
      nameOf: (id) => profiles.find((p) => p.id === id)?.display_name ?? "—",
      async signIn(email, password) {
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error.message);
      },
      signInDemo(id) {
        try {
          localStorage.setItem(DEMO_KEY, id);
        } catch {}
        setMe(DEMO_USERS.find((u) => u.id === id) ?? null);
      },
      async signOut() {
        if (isSupabaseConfigured) await getSupabase().auth.signOut();
        try {
          localStorage.removeItem(DEMO_KEY);
        } catch {}
        setMe(null);
      },
    }),
    [me, profiles, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession hors SessionProvider");
  return v;
}
