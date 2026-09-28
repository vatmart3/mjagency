/**
 * Villes de prospection et géographie stylisée du Bassin de Thau.
 * Les coordonnées servent à la carte 3D / 2D et au tri des tournées.
 */

export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Petite note terrain affichée dans le générateur de tournée. */
  note: string;
}

export const CITIES: City[] = [
  { id: "sete", name: "Sète", lat: 43.4028, lng: 3.6967, note: "Centre-ville et canaux le matin en semaine ; quartier haut et Corniche plus résidentiels. Parking difficile : garer une fois, tout faire à pied." },
  { id: "frontignan", name: "Frontignan", lat: 43.4483, lng: 3.7561, note: "Centre ancien compact autour de l'église, zone commerciale en entrée de ville ; la plage vit surtout l'été." },
  { id: "balaruc-les-bains", name: "Balaruc-les-Bains", lat: 43.4414, lng: 3.6778, note: "Rythme dicté par les thermes : curistes de mars à décembre, commerces calmes en janvier-février." },
  { id: "balaruc-le-vieux", name: "Balaruc-le-Vieux", lat: 43.4617, lng: 3.6853, note: "Grande zone commerciale et artisanale : idéale pour enchaîner garages, artisans et enseignes indépendantes." },
  { id: "meze", name: "Mèze", lat: 43.4253, lng: 3.6053, note: "Port et centre piéton ; beaucoup de conchyliculteurs et de restaurants saisonniers." },
  { id: "marseillan", name: "Marseillan", lat: 43.3567, lng: 3.5283, note: "Deux mondes : le village et le port (à l'année), la plage et les campings (d'avril à septembre)." },
  { id: "bouzigues", name: "Bouzigues", lat: 43.4481, lng: 3.6572, note: "Petit village conchylicole : dégustations et restaurants de bord d'étang." },
  { id: "montpellier", name: "Montpellier", lat: 43.6108, lng: 3.8767, note: "Volume énorme mais concurrence d'agences forte : cibler les quartiers (Beaux-Arts, Boutonnet, Antigone, Port Marianne) plutôt que l'Écusson saturé." },
];

export const CITY_NAMES = CITIES.map((c) => c.name);

export function cityByName(name?: string | null): City | undefined {
  if (!name) return undefined;
  const n = normalize(name);
  return CITIES.find((c) => normalize(c.name) === n || c.id === n);
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Contour stylisé de l'étang de Thau (lat, lng), sens horaire depuis Marseillan.
 * Volontairement simplifié : c'est une carte d'ambiance, pas un relevé IGN.
 */
export const THAU_LAGOON: [number, number][] = [
  [43.345, 3.536], [43.362, 3.553], [43.382, 3.575], [43.401, 3.598], [43.417, 3.617],
  [43.432, 3.632], [43.444, 3.652], [43.452, 3.672], [43.456, 3.688], [43.448, 3.699],
  [43.433, 3.703], [43.418, 3.696], [43.410, 3.684], [43.401, 3.667], [43.388, 3.642],
  [43.372, 3.614], [43.356, 3.585], [43.341, 3.558], [43.334, 3.541],
];

/** Trait de côte stylisé (lido de Marseillan à Sète, puis vers Frontignan et Palavas). */
export const COASTLINE: [number, number][] = [
  [43.300, 3.480], [43.312, 3.505], [43.325, 3.535], [43.340, 3.565], [43.357, 3.598],
  [43.372, 3.628], [43.385, 3.655], [43.394, 3.680], [43.398, 3.700], [43.402, 3.715],
  [43.412, 3.735], [43.425, 3.760], [43.438, 3.790], [43.452, 3.820], [43.468, 3.855],
  [43.487, 3.890], [43.505, 3.925], [43.520, 3.960],
];

/** Emprise de la carte (lat min/max, lng min/max). */
export const MAP_BOUNDS = { latMin: 43.29, latMax: 43.64, lngMin: 3.47, lngMax: 3.95 };

/** Position déterministe autour du centre-ville quand le prospect n'est pas géolocalisé. */
export function jitteredPosition(seed: string, city?: string | null): { lat: number; lng: number } {
  const c = cityByName(city) ?? CITIES[0];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const a = ((h >>> 0) % 3600) / 3600 * Math.PI * 2;
  const r = 0.004 + (((h >>> 12) % 1000) / 1000) * 0.008;
  return { lat: c.lat + Math.sin(a) * r * 0.75, lng: c.lng + Math.cos(a) * r };
}

/** Distance en km (haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
