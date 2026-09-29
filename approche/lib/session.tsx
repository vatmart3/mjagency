"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { isSharedAccount, isSupabaseConfigured } from "@/lib/supabase/config";
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
  /**
   * Connexion. Avec le compte commun, renvoie les associés à choisir ensuite
   * (la session commune est refermée aussitôt) ; sinon, liste vide : c'est fait.
   */
  signIn: (email: string, password: string) => Promise<Profile[]>;
  /** Deuxième temps : ouvre le compte de l'associé choisi, avec le même mot de passe. */
  signInAs: (person: Profile, password: string) => Promise<void>;
  signInDemo: (id: string) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<SessionValue | null>(null);
const DEMO_KEY = "approche.demoUser";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>(isSupabaseConfigured ? [] : DEMO_USERS);
  const [loading, setLoading] = useState(true);
  // Vrai pendant la connexion au compte commun : load() ne doit pas la refermer en parallèle.
  const opening = useRef(false);

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
      // Le compte commun ne sert qu'à entrer : une session restée ouverte dessus renvoie au choix.
      if (isSharedAccount(user.email) && list.some((p) => !isSharedAccount(p.email))) {
        if (opening.current) return;
        await sb.auth.signOut({ scope: "local" });
        if (!cancelled) {
          setMe(null);
          setLoading(false);
        }
        return;
      }
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

  // Les associés, sans le compte commun (qui ne sert qu'à entrer)
  const people = useMemo(() => {
    const list = profiles.filter((p) => !isSharedAccount(p.email));
    return list.length ? list : profiles;
  }, [profiles]);

  const value = useMemo<SessionValue>(
    () => ({
      me,
      profiles: people,
      loading,
      demo: !isSupabaseConfigured,
      partner: people.find((p) => p.id !== me?.id) ?? null,
      nameOf: (id) => profiles.find((p) => p.id === id)?.display_name ?? "—",
      async signIn(email, password) {
        const sb = getSupabase();
        opening.current = true;
        try {
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw new Error(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error.message);
          if (!isSharedAccount(email)) return [];
          const { data: rows } = await sb.from("profiles").select("*");
          const people = ((rows ?? []) as Profile[]).filter((p) => !isSharedAccount(p.email)).sort((a, b) => a.display_name.localeCompare(b.display_name));
          if (people.length) await sb.auth.signOut({ scope: "local" });
          return people;
        } finally {
          opening.current = false;
        }
      },
      async signInAs(person, password) {
        const { error } = await getSupabase().auth.signInWithPassword({ email: person.email, password });
        if (error) throw new Error(`Le compte de ${person.display_name} ne s'ouvre pas avec ce mot de passe.`);
      },
      signInDemo(id) {
        try {
          localStorage.setItem(DEMO_KEY, id);
        } catch {}
        setMe(DEMO_USERS.find((u) => u.id === id) ?? null);
      },
      async signOut() {
        if (isSupabaseConfigured) await getSupabase().auth.signOut({ scope: "local" });
        try {
          localStorage.removeItem(DEMO_KEY);
        } catch {}
        setMe(null);
      },
    }),
    [me, profiles, people, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession hors SessionProvider");
  return v;
}
