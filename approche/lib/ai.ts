"use client";
import { useEffect, useState } from "react";
import { IS_ARTIFACT } from "@/lib/target";

let cached: Promise<boolean> | null = null;

/** L'API Claude est-elle branchée côté serveur ? (clé présente dans .env.local / Vercel) */
export function useAiEnabled() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (IS_ARTIFACT) return; // pas de serveur dans la version page unique
    cached ??= fetch("/api/ai")
      .then((r) => r.json())
      .then((j: { enabled?: boolean }) => Boolean(j.enabled))
      .catch(() => false);
    void cached.then(setOn);
  }, []);
  return on;
}

export async function aiCall<T = { text: string }>(body: unknown): Promise<T> {
  const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Erreur IA");
  return j as T;
}
