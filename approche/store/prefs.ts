"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Préférences propres à CET appareil (un vieux téléphone peut couper la 3D sans toucher l'ordinateur). */
interface Prefs {
  three: boolean;
  motion: boolean;
  set: (p: Partial<Pick<Prefs, "three" | "motion">>) => void;
}

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      three: true,
      motion: true,
      set: (p) => set(p),
    }),
    { name: "approche.prefs" },
  ),
);
