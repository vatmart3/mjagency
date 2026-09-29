"use client";
import { useEffect, useState } from "react";
import { IS_ARTIFACT } from "@/lib/target";

type AiStatus = { enabled: boolean; analyse: boolean };
let cached: Promise<AiStatus> | null = null;

function load(): Promise<AiStatus> {
  cached ??= fetch("/api/ai")
    .then((r) => r.json())
    .then((j: { enabled?: boolean; analyse?: boolean }) => ({ enabled: Boolean(j.enabled), analyse: Boolean(j.analyse) }))
    .catch(() => ({ enabled: false, analyse: false }));
  return cached;
}

/** L'API Claude est-elle branchée côté serveur ? (clé présente dans .env.local / Vercel) */
export function useAiEnabled() {
  return useAiStatus().enabled;
}

/** { enabled, analyse } : analyse = recherche + script automatiques (clé API ET Supabase). */
export function useAiStatus(): AiStatus {
  const [s, setS] = useState<AiStatus>({ enabled: false, analyse: false });
  useEffect(() => {
    if (IS_ARTIFACT) return; // pas de serveur dans la version page unique
    void load().then(setS);
  }, []);
  return s;
}

export async function aiCall<T = { text: string }>(body: unknown): Promise<T> {
  const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Erreur IA");
  return j as T;
}

/** Lance l'analyse approfondie d'un client (recherche web + script sur mesure), en arrière-plan. */
export const startAnalysis = (prospectId: string) => aiCall<{ started: boolean; running?: boolean }>({ mode: "analyse", prospectId });
