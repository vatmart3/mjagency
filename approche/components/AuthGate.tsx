"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";

/** Côté client : renvoie vers /login si personne n'est connecté (le middleware couvre déjà le mode Supabase). */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { me, loading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !me) router.replace("/login");
  }, [loading, me, router]);
  if (loading || !me)
    return (
      <div className="grid min-h-dvh place-items-center">
        <span className="kicker animate-pulse">APPROCHE</span>
      </div>
    );
  return <>{children}</>;
}
