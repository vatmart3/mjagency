/** Réglages par défaut et fusion : utilisables côté serveur comme côté navigateur. */
import { DEFAULT_OFFERS, pricingSummary } from "@/content/offers";
import { CITY_NAMES } from "@/content/cities";
import { agency } from "@/content/agency";
import type { SettingsData } from "@/lib/types";

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


/** Grille de prix en texte, pour les briefs envoyés à l'IA. */
export function pricingOfOffers(settings: SettingsData): string {
  return settings.offers.map((o) => `- ${o.name} : ${pricingSummary(o)}`).join("\n");
}
