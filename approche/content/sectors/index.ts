import type { SectorId, SectorSheet } from "../types";
import boulangerie from "./boulangerie";
import restaurant from "./restaurant";
import barCafe from "./bar-cafe";
import foodTruck from "./food-truck";
import coiffeur from "./coiffeur";
import beaute from "./beaute";
import sport from "./sport";
import garage from "./garage";
import artisanBtp from "./artisan-btp";
import immobilier from "./immobilier";
import commerce from "./commerce";
import caviste from "./caviste";
import hebergement from "./hebergement";
import comptable from "./comptable";
import sante from "./sante";
import juridique from "./juridique";

export const SECTORS: SectorSheet[] = [
  boulangerie, restaurant, barCafe, foodTruck, coiffeur, beaute, sport, garage,
  artisanBtp, immobilier, commerce, caviste, hebergement, comptable, sante, juridique,
];

export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map((s) => [s.id, s])) as Record<SectorId, SectorSheet>;

export function getSector(id: string | null | undefined): SectorSheet | undefined {
  return id ? SECTOR_BY_ID[id as SectorId] : undefined;
}

/** Nom lisible d'un secteur, y compris un secteur libre saisi à la main. */
export function sectorLabel(id: string | null | undefined): string {
  if (!id) return "—";
  return getSector(id)?.short ?? id;
}
