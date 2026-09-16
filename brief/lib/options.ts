/**
 * Les listes de choix du brief.
 *
 * On stocke des identifiants ASCII (`restaurant`) et on affiche des libellés
 * français (`Restaurant / Bar`). Les emails, le localStorage et la maquette 3D
 * parlent tous la même langue : celle des identifiants.
 */

export type Option<T extends string = string> = {
  id: T;
  label: string;
  /** Une ligne de contexte, affichée en petit sous le libellé. */
  note?: string;
};

export const SECTORS = [
  { id: "restaurant", label: "Restaurant / Bar" },
  { id: "artisan", label: "Artisan / BTP" },
  { id: "commerce", label: "Commerce" },
  { id: "beaute", label: "Beauté / Bien-être" },
  { id: "sante", label: "Santé" },
  { id: "immobilier", label: "Immobilier" },
  { id: "tourisme", label: "Tourisme" },
  { id: "autre", label: "Autre" },
] as const satisfies readonly Option[];

export const NEEDS = [
  { id: "creation", label: "Création", note: "Premier site" },
  { id: "refonte", label: "Refonte", note: "Un site existe déjà" },
  { id: "ecommerce", label: "E-commerce", note: "Vendre en ligne" },
  { id: "landing", label: "Landing page", note: "Une page, un objectif" },
] as const satisfies readonly Option[];

export const GOALS = [
  { id: "appels", label: "Plus d'appels" },
  { id: "reservations", label: "Des réservations / RDV" },
  { id: "vendre", label: "Vendre en ligne" },
  { id: "google", label: "Être trouvé sur Google" },
  { id: "credibilite", label: "Paraître plus pro" },
] as const satisfies readonly Option[];

export const AUDIENCES = [
  { id: "particuliers", label: "Particuliers" },
  { id: "professionnels", label: "Professionnels" },
  { id: "touristes", label: "Touristes" },
  { id: "locale", label: "Clientèle locale" },
] as const satisfies readonly Option[];

export const FEATURES = [
  { id: "galerie", label: "Galerie photo" },
  { id: "reservation", label: "Réservation en ligne" },
  { id: "rdv", label: "Prise de RDV" },
  { id: "click-collect", label: "Click & collect" },
  { id: "carte", label: "Carte / tarifs" },
  { id: "avis", label: "Avis Google" },
  { id: "devis", label: "Formulaire de devis" },
  { id: "blog", label: "Blog / actualités" },
  { id: "multilingue", label: "Multilingue" },
  { id: "espace-client", label: "Espace client" },
] as const satisfies readonly Option[];

export const STYLES = [
  {
    id: "epure",
    label: "Épuré",
    note: "Beaucoup de blanc, peu d'éléments, tout respire.",
  },
  {
    id: "chaleureux",
    label: "Chaleureux artisanal",
    note: "Matières, terre cuite, gestes de la main.",
  },
  {
    id: "luxe",
    label: "Luxe éditorial",
    note: "Grandes serif, silences, mise en page de magazine.",
  },
  {
    id: "audacieux",
    label: "Audacieux",
    note: "Typographie énorme, contrastes francs, aplats.",
  },
  {
    id: "naturel",
    label: "Naturel",
    note: "Verts doux, courbes, lumière du matin.",
  },
  {
    id: "tech",
    label: "Tech moderne",
    note: "Grilles nettes, mono, précision d'interface.",
  },
] as const satisfies readonly Option[];

export const ASSET_KEYS = [
  { id: "logo", label: "Un logo" },
  { id: "photos", label: "Des photos pro" },
  { id: "textes", label: "Les textes" },
  { id: "domaine", label: "Un nom de domaine" },
] as const satisfies readonly Option[];

export const ASSET_STATES = [
  { id: "oui", label: "Oui" },
  { id: "non", label: "Non" },
  { id: "en-cours", label: "En cours" },
] as const satisfies readonly Option[];

export const BUDGETS = [
  { id: "moins-800", label: "Moins de 800 €" },
  { id: "800-1500", label: "800 – 1 500 €" },
  { id: "1500-3000", label: "1 500 – 3 000 €" },
  { id: "plus-3000", label: "Plus de 3 000 €" },
  { id: "inconnu", label: "Je ne sais pas encore" },
] as const satisfies readonly Option[];

export const TIMINGS = [
  { id: "asap", label: "Dès que possible" },
  { id: "1-mois", label: "Sous 1 mois" },
  { id: "1-3-mois", label: "1 à 3 mois" },
  { id: "pas-presse", label: "Pas pressé" },
] as const satisfies readonly Option[];

export const CONTACT_PREFS = [
  { id: "appel", label: "Appel" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
] as const satisfies readonly Option[];

export const TIME_SLOTS = [
  { id: "matin", label: "Matin" },
  { id: "midi", label: "Midi" },
  { id: "apres-midi", label: "Après-midi" },
  { id: "soir", label: "Soir" },
] as const satisfies readonly Option[];

export const REFERRALS = [
  { id: "google", label: "Google" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "bouche-a-oreille", label: "Bouche-à-oreille" },
  { id: "autre", label: "Autre" },
] as const satisfies readonly Option[];

/** Les huit palettes proposées, quatre couleurs chacune : fond, encre, accent, appui. */
export const PALETTES = [
  { id: "encre", label: "Encre & papier", colors: ["#FFFFFF", "#1D1D1F", "#0071E3", "#E8E8ED"] },
  { id: "sable", label: "Sable & terre", colors: ["#FBF7F1", "#2A211B", "#C0693C", "#E6D8C6"] },
  { id: "olive", label: "Olive & lin", colors: ["#F4F3EC", "#23281F", "#6B7A4B", "#DCDDCB"] },
  { id: "nuit", label: "Nuit & or", colors: ["#14161A", "#F2EFE9", "#C9A227", "#2B2F36"] },
  { id: "corail", label: "Corail & craie", colors: ["#FFF8F5", "#2B1B1B", "#E4573D", "#F6D9CE"] },
  { id: "lagune", label: "Lagune", colors: ["#F2F7F8", "#12262B", "#1E7A8C", "#CFE3E6"] },
  { id: "prune", label: "Prune", colors: ["#FAF6F9", "#241627", "#6D3B7A", "#E5D6E8"] },
  { id: "graphite", label: "Graphite", colors: ["#F5F5F7", "#1D1D1F", "#5A5A60", "#D9D9DE"] },
] as const;

export type SectorId = (typeof SECTORS)[number]["id"];
export type NeedId = (typeof NEEDS)[number]["id"];
export type GoalId = (typeof GOALS)[number]["id"];
export type AudienceId = (typeof AUDIENCES)[number]["id"];
export type FeatureId = (typeof FEATURES)[number]["id"];
export type StyleId = (typeof STYLES)[number]["id"];
export type AssetKeyId = (typeof ASSET_KEYS)[number]["id"];
export type AssetStateId = (typeof ASSET_STATES)[number]["id"];
export type BudgetId = (typeof BUDGETS)[number]["id"];
export type TimingId = (typeof TIMINGS)[number]["id"];
export type PaletteId = (typeof PALETTES)[number]["id"];

export function labelOf(list: readonly Option[], id: string | undefined | null): string {
  if (!id) return "—";
  return list.find((o) => o.id === id)?.label ?? id;
}

export function labelsOf(list: readonly Option[], values: readonly string[] | undefined): string[] {
  if (!values?.length) return [];
  return values.map((v) => labelOf(list, v));
}
