"use client";
import { useSession } from "@/lib/session";
import { fillPlaceholders } from "@/lib/format";

/** Remplit {prenom} avec l'utilisateur connecté ; les autres variables deviennent des libellés lisibles. */
export function useFill(vars: Parameters<typeof fillPlaceholders>[1] = {}) {
  const { me } = useSession();
  return (t: string) => fillPlaceholders(t, { prenom: me?.display_name, ...vars });
}
