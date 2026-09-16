import { PALETTES, type FeatureId, type SectorId, type StyleId } from "./options";
import type { BriefValues } from "./schema";

export type Rgb = [number, number, number];

export type MockupTarget = {
  /** Le titre du héros : « Le site de Julie ». */
  headline: string;
  /** Le logo texte, en haut à gauche. */
  logo: string;
  /** Le nom de domaine fictif, dans la barre du navigateur. */
  domain: string;
  sector: SectorId;
  style: StyleId;
  /** 0 = sobre, 1 = audacieux. */
  bold: number;
  /** 0 = classique, 1 = moderne. */
  modern: number;
  /** fond, encre, accent, appui. */
  colors: [Rgb, Rgb, Rgb, Rgb];
  features: FeatureId[];
  /** Progression du parcours, 0 → 1 : la maquette se remplit au fil des étapes. */
  build: number;
};

export const DEFAULT_PALETTE: [string, string, string, string] = [
  "#FFFFFF",
  "#1D1D1F",
  "#0071E3",
  "#E8E8ED",
];

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbCss([r, g, b]: Rgb, alpha = 1): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v)));
  return alpha >= 1 ? `rgb(${c(r)} ${c(g)} ${c(b)})` : `rgb(${c(r)} ${c(g)} ${c(b)} / ${alpha})`;
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function luminance([r, g, b]: Rgb): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Les quatre couleurs actives : palette choisie, couleurs perso, ou défaut maison. */
export function resolveColors(
  palette: string | undefined,
  custom: string[] | undefined,
): [string, string, string, string] {
  if (palette === "custom" && custom?.length) {
    const [a, b, c] = custom;
    const accent = a ?? DEFAULT_PALETTE[2];
    const ink = b ?? DEFAULT_PALETTE[1];
    const soft = c ?? mixHex(accent, "#FFFFFF", 0.82);
    return [DEFAULT_PALETTE[0], ink, accent, soft];
  }
  const found = PALETTES.find((p) => p.id === palette);
  return found ? ([...found.colors] as [string, string, string, string]) : DEFAULT_PALETTE;
}

export function mixHex(a: string, b: string, t: number): string {
  const m = mixRgb(hexToRgb(a), hexToRgb(b), t);
  return `#${m.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

const CAP = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** `Chez Léon & Fils` → `chez-leon-fils.fr` */
export function fakeDomain(company: string): string {
  const slug = company
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return slug ? `${slug}.fr` : "votre-site.fr";
}

/** Traduit les réponses en une maquette. Tout est optionnel : le formulaire se remplit petit à petit. */
export function deriveTarget(v: Partial<BriefValues>, stepIndex: number, totalSteps: number): MockupTarget {
  const firstName = (v.firstName ?? "").trim();
  const company = (v.company ?? "").trim();
  const colors = resolveColors(v.palette, v.customColors).map(hexToRgb) as [Rgb, Rgb, Rgb, Rgb];

  return {
    headline: firstName ? `Le site de ${CAP(firstName)}` : "Votre futur site",
    logo: (company || "Votre marque").slice(0, 22),
    domain: fakeDomain(company),
    sector: (v.sector ?? "autre") as SectorId,
    style: (v.style ?? "epure") as StyleId,
    bold: (v.bold ?? 35) / 100,
    modern: (v.modern ?? 55) / 100,
    colors,
    features: v.features ?? [],
    build: Math.min(1, stepIndex / Math.max(1, totalSteps - 1)),
  };
}

/* ── Traits de style ──────────────────────────────────────────────────── */

export type StyleTraits = {
  /** 0 → angles vifs, 1 → très arrondi. */
  radius: number;
  /** 0 → beaucoup d'air, 1 → dense. */
  density: number;
  /** Famille du titre : la variable CSS à lire. */
  display: "serif" | "sans" | "mono";
  /** Graisse du titre. */
  weight: number;
  /** Interlettrage du titre, en em. */
  tracking: number;
  italic: boolean;
  uppercase: boolean;
};

const STYLE_TRAITS: Record<StyleId, StyleTraits> = {
  epure: { radius: 0.25, density: 0.2, display: "sans", weight: 500, tracking: -0.03, italic: false, uppercase: false },
  chaleureux: { radius: 0.75, density: 0.5, display: "serif", weight: 400, tracking: -0.01, italic: false, uppercase: false },
  luxe: { radius: 0.06, density: 0.25, display: "serif", weight: 400, tracking: -0.02, italic: true, uppercase: false },
  audacieux: { radius: 0.0, density: 0.75, display: "sans", weight: 800, tracking: -0.05, italic: false, uppercase: true },
  naturel: { radius: 1.0, density: 0.4, display: "serif", weight: 400, tracking: 0.0, italic: false, uppercase: false },
  tech: { radius: 0.35, density: 0.65, display: "mono", weight: 500, tracking: -0.02, italic: false, uppercase: false },
};

export function traitsOf(style: StyleId): StyleTraits {
  return STYLE_TRAITS[style] ?? STYLE_TRAITS.epure;
}

/* ── Les compositions abstraites par secteur ──────────────────────────── */

export type SectorShape = "plates" | "beams" | "grid" | "arcs" | "cross" | "skyline" | "horizon" | "blocks";

export const SECTOR_SHAPE: Record<SectorId, SectorShape> = {
  restaurant: "plates",
  artisan: "beams",
  commerce: "grid",
  beaute: "arcs",
  sante: "cross",
  immobilier: "skyline",
  tourisme: "horizon",
  autre: "blocks",
};

/** Libellés courts, tels qu'ils apparaissent dans la maquette. */
export const FEATURE_TAG: Record<FeatureId, string> = {
  galerie: "Galerie",
  reservation: "Réserver",
  rdv: "Prendre RDV",
  "click-collect": "Click & collect",
  carte: "La carte",
  avis: "Avis",
  devis: "Devis",
  blog: "Actualités",
  multilingue: "FR / EN",
  "espace-client": "Mon compte",
};

/** Le glyphe vectoriel dessiné dans chaque tuile de fonctionnalité. */
export const FEATURE_GLYPH: Record<FeatureId, "frames" | "calendar" | "clock" | "bag" | "list" | "stars" | "quote" | "lines" | "globe" | "key"> = {
  galerie: "frames",
  reservation: "calendar",
  rdv: "clock",
  "click-collect": "bag",
  carte: "list",
  avis: "stars",
  devis: "quote",
  blog: "lines",
  multilingue: "globe",
  "espace-client": "key",
};
