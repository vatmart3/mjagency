import type { FieldPath } from "react-hook-form";
import type { BriefValues } from "./schema";

export type StepId =
  | "welcome"
  | "project"
  | "goal"
  | "features"
  | "style"
  | "colors"
  | "inspiration"
  | "assets"
  | "budget"
  | "contact";

export type StepDef = {
  id: StepId;
  /** Le numéro affiché en mono : « 03 ». */
  number: string;
  /** Le titre de section, en petites capitales mono. */
  kicker: string;
  /** Champs validés avant de laisser passer à l'étape suivante. */
  fields: FieldPath<BriefValues>[];
  /** Durée moyenne de l'étape, en secondes — sert au « ≈ 3 min restantes ». */
  seconds: number;
};

export const STEPS: StepDef[] = [
  { id: "welcome", number: "00", kicker: "Accueil", fields: ["firstName"], seconds: 12 },
  {
    id: "project",
    number: "01",
    kicker: "Le projet",
    fields: ["company", "sector", "sectorOther", "need", "currentUrl"],
    seconds: 38,
  },
  { id: "goal", number: "02", kicker: "L'objectif", fields: ["goal", "audience"], seconds: 22 },
  {
    id: "features",
    number: "03",
    kicker: "Les fonctionnalités",
    fields: ["features", "featuresAdvice"],
    seconds: 26,
  },
  { id: "style", number: "04", kicker: "Le style", fields: ["style", "bold", "modern"], seconds: 30 },
  {
    id: "colors",
    number: "05",
    kicker: "Les couleurs",
    fields: ["palette", "customColors"],
    seconds: 22,
  },
  {
    id: "inspiration",
    number: "06",
    kicker: "Les inspirations",
    fields: ["inspirations", "avoid"],
    seconds: 30,
  },
  { id: "assets", number: "07", kicker: "Ce que vous avez déjà", fields: ["assets"], seconds: 18 },
  { id: "budget", number: "08", kicker: "Budget & délai", fields: ["budget", "timing"], seconds: 16 },
  {
    id: "contact",
    number: "09",
    kicker: "On vous recontacte",
    fields: ["fullName", "email", "phone", "contactPref", "timeSlot", "referral", "rgpd"],
    seconds: 42,
  },
];

export const LAST_STEP = STEPS.length - 1;

/** « ≈ 3 min restantes », recalculé à chaque étape — accord compris. */
export function timeLeft(index: number): string {
  const seconds = STEPS.slice(index).reduce((n, s) => n + s.seconds, 0);
  if (seconds <= 45) return "moins d'une minute";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes === 1 ? "≈ 1 min restante" : `≈ ${minutes} min restantes`;
}
