import type { DefaultValues } from "react-hook-form";
import { z } from "zod";
import {
  ASSET_STATES,
  AUDIENCES,
  BUDGETS,
  CONTACT_PREFS,
  FEATURES,
  GOALS,
  NEEDS,
  PALETTES,
  REFERRALS,
  SECTORS,
  STYLES,
  TIMINGS,
  TIME_SLOTS,
  type AssetStateId,
  type AudienceId,
  type BudgetId,
  type FeatureId,
  type GoalId,
  type NeedId,
  type SectorId,
  type StyleId,
  type TimingId,
} from "./options";

/** Un tableau de libellés → le tuple non vide attendu par `z.enum`. */
const tuple = <T extends string>(list: readonly { id: T }[]) =>
  list.map((o) => o.id) as [T, ...T[]];

const sectorIds = tuple<SectorId>(SECTORS);
const needIds = tuple<NeedId>(NEEDS);
const goalIds = tuple<GoalId>(GOALS);
const audienceIds = tuple<AudienceId>(AUDIENCES);
const featureIds = tuple<FeatureId>(FEATURES);
const styleIds = tuple<StyleId>(STYLES);
const assetStateIds = tuple<AssetStateId>(ASSET_STATES);
const budgetIds = tuple<BudgetId>(BUDGETS);
const timingIds = tuple<TimingId>(TIMINGS);
const contactPrefIds = tuple(CONTACT_PREFS);
const timeSlotIds = tuple(TIME_SLOTS);
const referralIds = tuple(REFERRALS);
const paletteIds = PALETTES.map((p) => p.id) as [string, ...string[]];

const CHOOSE = "Un choix est attendu ici.";

/** Téléphone français : 06 12 34 56 78, 06.12.34.56.78, +33 6 12 34 56 78… */
export const FR_PHONE = /^(?:(?:\+|00)33[\s.-]?(?:\(0\)[\s.-]?)?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const httpUrl = z
  .string()
  .trim()
  .refine(
    (v) => {
      try {
        const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
        return Boolean(u.hostname) && u.hostname.includes(".");
      } catch {
        return false;
      }
    },
    { error: "Cette adresse ne ressemble pas à un site." },
  );

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Couleur invalide." });

export const briefSchema = z
  .object({
    // 00 · Accueil
    firstName: z
      .string()
      .trim()
      .min(2, { error: "Votre prénom, simplement." })
      .max(40, { error: "40 caractères, c'est déjà beaucoup." }),

    // 01 · Le projet
    company: z
      .string()
      .trim()
      .min(2, { error: "Le nom de votre entreprise." })
      .max(80, { error: "80 caractères maximum." }),
    sector: z.enum(sectorIds, { error: CHOOSE }),
    sectorOther: z.string().trim().max(60, { error: "60 caractères maximum." }),
    need: z.enum(needIds, { error: CHOOSE }),
    currentUrl: z.union([z.literal(""), httpUrl]),

    // 02 · L'objectif
    goal: z.enum(goalIds, { error: CHOOSE }),
    audience: z
      .array(z.enum(audienceIds))
      .min(1, { error: "Au moins un type de clientèle." }),

    // 03 · Les fonctionnalités
    features: z.array(z.enum(featureIds)),
    featuresAdvice: z.boolean(),

    // 04 · Le style
    style: z.enum(styleIds, { error: "Choisissez l'ambiance qui vous parle." }),
    bold: z.number().min(0).max(100),
    modern: z.number().min(0).max(100),

    // 05 · Les couleurs
    palette: z.union([z.enum(paletteIds), z.literal("custom")], {
      error: "Choisissez une palette, ou composez la vôtre.",
    }),
    customColors: z.array(hexColor).max(3, { error: "Trois couleurs au maximum." }),
    hasBrand: z.boolean(),

    // 06 · Les inspirations
    inspirations: z.array(httpUrl).max(3, { error: "Trois sites au maximum." }),
    avoid: z.string().trim().max(150, { error: "150 caractères maximum." }),

    // 07 · Ce que vous avez déjà
    assets: z.object({
      logo: z.enum(assetStateIds, { error: CHOOSE }),
      photos: z.enum(assetStateIds, { error: CHOOSE }),
      textes: z.enum(assetStateIds, { error: CHOOSE }),
      domaine: z.enum(assetStateIds, { error: CHOOSE }),
    }),

    // 08 · Budget & délai
    budget: z.enum(budgetIds, { error: CHOOSE }),
    timing: z.enum(timingIds, { error: CHOOSE }),

    // 09 · On vous recontacte
    fullName: z
      .string()
      .trim()
      .min(3, { error: "Votre nom complet." })
      .max(80, { error: "80 caractères maximum." }),
    email: z.email({ error: "Un email valide, pour vous répondre." }),
    phone: z
      .string()
      .trim()
      .regex(FR_PHONE, { error: "Un numéro français : 06 12 34 56 78." }),
    contactPref: z.enum(contactPrefIds, { error: CHOOSE }),
    timeSlot: z.enum(timeSlotIds, { error: CHOOSE }),
    referral: z.enum(referralIds, { error: CHOOSE }),
    rgpd: z.boolean().refine((v) => v === true, {
      error: "Cet accord est nécessaire pour vous recontacter.",
    }),

    /** Piège à robots : un humain le laisse vide. Vérifié côté serveur. */
    website: z.string().max(200).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.sector === "autre" && v.sectorOther.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["sectorOther"],
        message: "Dites-nous en deux mots.",
      });
    }
    if (!v.featuresAdvice && v.features.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["features"],
        message: "Choisissez au moins une fonctionnalité, ou demandez conseil.",
      });
    }
    if (v.palette === "custom" && v.customColors.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["customColors"],
        message: "Ajoutez au moins une couleur.",
      });
    }
  });

export type BriefValues = z.infer<typeof briefSchema>;

/**
 * Les champs à choix restent `undefined` tant que rien n'est sélectionné :
 * c'est ce qui permet à Zod de réclamer un choix, et à l'UI de ne rien
 * pré-cocher à la place du visiteur.
 */
export const BRIEF_DEFAULTS: DefaultValues<BriefValues> = {
  firstName: "",
  company: "",
  sectorOther: "",
  currentUrl: "",
  audience: [],
  features: [],
  featuresAdvice: false,
  bold: 35,
  modern: 55,
  customColors: [],
  hasBrand: false,
  inspirations: [],
  avoid: "",
  assets: {},
  rgpd: false,
  website: "",
};

/* ── Pièces jointes ───────────────────────────────────────────────────── */

export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const ACCEPTED_MIME = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "application/pdf",
] as const;
export const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".svg", ".pdf"] as const;

export function checkFiles(files: { name: string; type: string; size: number }[]): string | null {
  if (files.length > MAX_FILES) return `Trois fichiers au maximum.`;
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES) return "4 Mo au total, pas plus.";
  const bad = files.find(
    (f) =>
      !(ACCEPTED_MIME as readonly string[]).includes(f.type) &&
      !ACCEPTED_EXT.some((e) => f.name.toLowerCase().endsWith(e)),
  );
  if (bad) return `« ${bad.name} » n'est pas un jpg, png, svg ou pdf.`;
  return null;
}

/** `06 12 34 56 78` — lisible dans l'email et sur le téléphone de l'agence. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "").replace(/^\+330?/, "0").replace(/^0033/, "0");
  if (/^\d{10}$/.test(digits)) return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  return raw.trim();
}

/** Ajoute le protocole si le visiteur l'a oublié. */
export function normalizeUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}
