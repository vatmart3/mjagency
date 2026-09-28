import { COASTLINE, THAU_LAGOON } from "@/content/cities";

export const CENTER = { lat: 43.43, lng: 3.68 };
export const K = 62;

/** Projection équirectangulaire locale : (lat, lng) → (x, y) en unités de scène, y vers le nord. */
export function project(lat: number, lng: number): [number, number] {
  return [(lng - CENTER.lng) * Math.cos((CENTER.lat * Math.PI) / 180) * K, (lat - CENTER.lat) * K];
}

export const LAGOON = THAU_LAGOON.map(([la, ln]) => project(la, ln));
export const COAST = COASTLINE.map(([la, ln]) => project(la, ln));
/** La mer : sous le trait de côte, fermée par des coins lointains au sud-est. */
export const SEA: [number, number][] = [...COAST, project(43.2, 4.2), project(43.1, 4.2), project(43.1, 3.3), project(43.3, 3.3)];
