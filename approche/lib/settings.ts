"use client";
import { DEFAULT_OFFERS } from "@/content/offers";
import { CITY_NAMES } from "@/content/cities";
import { agency } from "@/content/agency";
import type { SettingsData } from "@/lib/types";
import { useMemo } from "react";
import { db, useTable } from "@/lib/data/hooks";

export const ALL_SECTOR_IDS = [
  "boulangerie", "restaurant", "bar-cafe", "food-truck", "coiffeur", "beaute", "sport", "garage",
  "artisan-btp", "immobilier", "commerce", "caviste", "hebergement", "comptable", "sante", "juridique",
];

export const DEFAULT_SETTINGS: SettingsData = {
  offers: DEFAULT_OFFERS,
  activeSectors: ALL_SECTOR_IDS,
  cities: CITY_NAMES,
  callSessionMinutes: 45,
  goalPerPerson: agency.goalPerMonth,
  defaultBasket: 950,
  defaultRates: { pickup: 0.45, meeting: 0.12, close: 0.3, visitMeeting: 0.15 },
  workingDaysPerWeek: 5,
  highlightOffers: ["site-vitrine", "fiche-google", "nfc-avis"],
};

export function mergeSettings(data: Partial<SettingsData> | undefined): SettingsData {
  const d = data ?? {};
  // Les offres enregistrées écrasent les défauts, offre par offre (une nouvelle offre du catalogue apparaît quand même).
  const saved = d.offers ?? [];
  const offers = DEFAULT_OFFERS.map((o) => saved.find((s) => s.id === o.id) ?? o);
  return {
    ...DEFAULT_SETTINGS,
    ...d,
    offers,
    defaultRates: { ...DEFAULT_SETTINGS.defaultRates, ...(d.defaultRates ?? {}) },
  };
}

export function useSettings() {
  const { rows, loading } = useTable("app_settings");
  const data = rows[0]?.data;
  // Même objet tant que la ligne ne change pas : évite les boucles dans les effets qui en dépendent
  const settings = useMemo(() => mergeSettings(data), [data]);
  return { settings, loading };
}

export async function saveSettings(patch: Partial<SettingsData>, current: SettingsData) {
  const data = { ...current, ...patch };
  await db.upsert("app_settings", { id: 1, data } as never, ["id"]);
}
