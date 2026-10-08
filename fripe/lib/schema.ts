import { z } from "zod";
import { DESCRIPTION_MAX, ETATS, TITRE_MAX } from "./vinted.ts";

// ---------------------------------------------------------------------------
// Ce que j'envoie : les infos facultatives et mes réglages
// ---------------------------------------------------------------------------

const texteCourt = (max: number) => z.string().trim().max(max).optional().default("");

export const InfosSchema = z.object({
  marque: texteCourt(60),
  taille: texteCourt(40),
  etat: z.enum(ETATS).optional(),
  defauts: texteCourt(500),
  prixAchat: z.number().positive().max(100000).optional(),
  mesures: texteCourt(300),
  precisions: texteCourt(500),
});
export type Infos = z.infer<typeof InfosSchema>;

export const TONS = ["naturel", "pro", "enjoue"] as const;
export const STRATEGIES = ["rapide", "equilibre", "max"] as const;

export const ReglagesSchema = z.object({
  ton: z.enum(TONS).default("naturel"),
  tutoiement: z.boolean().default(true),
  emojis: z.boolean().default(true),
  hashtags: z.boolean().default(true),
  strategie: z.enum(STRATEGIES).default("equilibre"),
  signature: z.string().max(400).default(""),
});
export type Reglages = z.infer<typeof ReglagesSchema>;

export const REGLAGES_DEFAUT: Reglages = {
  ton: "naturel",
  tutoiement: true,
  emojis: true,
  hashtags: true,
  strategie: "equilibre",
  signature:
    "📦 Envoi rapide et soigné.\nN'hésite pas à regarder mes autres articles pour un lot, tu économises les frais de port !",
};

// ---------------------------------------------------------------------------
// Ce que Claude renvoie
//
// Ce schéma sert deux fois : converti en JSON Schema, il contraint la sortie
// du modèle (structured outputs) ; côté serveur, il revalide la réponse —
// longueurs comprises, que l'API ne sait pas imposer — avant tout retry.
// ---------------------------------------------------------------------------

export const AnnonceSchema = z.object({
  nom: z
    .string()
    .min(2)
    .max(60)
    .describe("Nom court de l'article, 2 à 5 mots, ex. « Sweat à capuche Nike »"),
  titre: z
    .string()
    .min(5)
    .max(TITRE_MAX)
    .describe("Titre Vinted optimisé pour la recherche, sans emoji"),
  description: z
    .string()
    .min(40)
    .max(DESCRIPTION_MAX)
    .describe("Description complète prête à coller, avec retours à la ligne"),
  prix: z.object({
    conseille: z.number().describe("Prix à afficher sur l'annonce, en euros"),
    plancher: z.number().describe("Offre la plus basse à accepter, en euros"),
    marche_bas: z.number().describe("Bas de la fourchette observée en seconde main, en euros"),
    marche_haut: z.number().describe("Haut de la fourchette observée en seconde main, en euros"),
    justification: z.string().max(400).describe("Une ou deux phrases qui expliquent le prix"),
  }),
  fiche: z.object({
    categorie: z.string().max(120).describe("Chemin de catégorie Vinted, ex. « Hommes > Sweats et pulls > Sweats à capuche »"),
    marque: z.string().max(60).describe("Marque, ou « Sans marque » si elle n'est pas identifiable"),
    taille: z.string().max(40).describe("Taille lue ou fournie, ou « À vérifier »"),
    etat: z.enum(ETATS),
    couleurs: z.array(z.string().max(30)).max(2).describe("Une ou deux couleurs, au vocabulaire Vinted"),
    matiere: z.string().max(60).describe("Matière principale, ou « À vérifier » si l'étiquette n'est pas lisible"),
  }),
  a_verifier: z
    .array(z.string().max(160))
    .max(5)
    .describe("Points que les photos ne permettent pas de confirmer et que je dois vérifier avant de publier"),
  confiance: z.enum(["faible", "moyenne", "haute"]).describe("Confiance globale dans l'identification"),
});
export type Annonce = z.infer<typeof AnnonceSchema>;

// Remet de l'ordre dans les prix sans relancer le modèle : un plancher
// au-dessus du prix affiché ou une fourchette à l'envers se corrigent
// à coup sûr, inutile de payer un appel de plus.
export function normaliserAnnonce(a: Annonce): Annonce {
  const arrondi = (n: number) => (n < 10 ? Math.round(n * 2) / 2 : Math.round(n));
  const positif = (n: number) => Math.max(1, Number.isFinite(n) ? n : 1);

  let conseille = arrondi(positif(a.prix.conseille));
  let plancher = arrondi(positif(a.prix.plancher));
  if (plancher > conseille) [plancher, conseille] = [conseille, plancher];

  let bas = arrondi(positif(a.prix.marche_bas));
  let haut = arrondi(positif(a.prix.marche_haut));
  if (bas > haut) [bas, haut] = [haut, bas];

  return {
    ...a,
    nom: a.nom.trim(),
    titre: a.titre.replace(/\s+/g, " ").trim(),
    description: a.description.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim(),
    prix: { ...a.prix, conseille, plancher, marche_bas: bas, marche_haut: haut },
    fiche: { ...a.fiche, couleurs: a.fiche.couleurs.filter(Boolean) },
  };
}

export const ConsigneSchema = z.string().trim().max(300).optional().default("");
