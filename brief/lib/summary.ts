import {
  BUDGETS,
  FEATURES,
  GOALS,
  NEEDS,
  SECTORS,
  STYLES,
  TIMINGS,
  labelOf,
  type GoalId,
} from "./options";
import type { BriefValues } from "./schema";

const GOAL_CLAUSE: Record<GoalId, string> = {
  appels: "pensé pour faire sonner le téléphone",
  reservations: "pensé pour générer des réservations",
  vendre: "pensé pour vendre en ligne",
  google: "pensé pour être trouvé sur Google",
  credibilite: "pensé pour inspirer confiance dès la première seconde",
};

/**
 * La phrase de récapitulation : « Un site Luxe éditorial pour Chez Léon,
 * pensé pour générer des réservations. » Un seul trait, tiré des réponses.
 */
export function recapSentence(v: Partial<BriefValues>): string {
  const style = v.style ? labelOf(STYLES, v.style) : "sur mesure";
  const company = (v.company ?? "").trim() || "votre entreprise";
  const clause = v.goal ? GOAL_CLAUSE[v.goal] : "pensé pour votre activité";
  return `Un site ${style} pour ${company}, ${clause}.`;
}

/** Une seconde ligne, plus factuelle, pour l'email de l'agence. */
export function recapLine(v: Partial<BriefValues>): string {
  const bits = [
    v.need ? labelOf(NEEDS, v.need) : null,
    v.sector ? (v.sector === "autre" ? v.sectorOther || "Autre" : labelOf(SECTORS, v.sector)) : null,
    v.budget ? labelOf(BUDGETS, v.budget) : null,
    v.timing ? labelOf(TIMINGS, v.timing) : null,
  ].filter(Boolean);
  return bits.join(" · ");
}

/** Les trois fonctionnalités les plus structurantes, pour l'accroche de l'email. */
export function headlineFeatures(v: Partial<BriefValues>): string {
  if (v.featuresAdvice) return "à définir ensemble";
  const list = (v.features ?? []).map((f) => labelOf(FEATURES, f).toLowerCase());
  if (!list.length) return "à définir ensemble";
  if (list.length <= 3) return list.join(", ");
  return `${list.slice(0, 3).join(", ")} (+${list.length - 3})`;
}

export const GOAL_LABELS = GOALS;
