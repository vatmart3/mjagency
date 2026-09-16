"use client";

import type { BriefValues } from "./schema";

const KEY = "mjagency.brief.v1";

export type Saved = {
  values: Partial<BriefValues>;
  step: number;
  at: number;
};

/** Les fichiers ne sont pas sérialisables : la progression seule est conservée. */
export function saveProgress(values: Partial<BriefValues>, step: number) {
  try {
    const payload: Saved = { values, step, at: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Navigation privée, quota plein : tant pis, on continue sans filet.
  }
}

export function loadProgress(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (typeof parsed?.step !== "number" || typeof parsed?.values !== "object") return null;
    // Au-delà de trente jours, le brief a vécu.
    if (Date.now() - parsed.at > 30 * 24 * 3600 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* rien à faire */
  }
}
