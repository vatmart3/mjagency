import type { SectorTiming, TimeWindow, Weekday } from "@/content/types";
import { getSector } from "@/content/sectors";
import { distanceKm, jitteredPosition } from "@/content/cities";
import type { Prospect } from "@/lib/types";
import { fromMinutes, toMinutes } from "@/lib/format";

/** Créneaux par défaut pour un secteur libre (non présent dans la bibliothèque). */
export const GENERIC_TIMING: SectorTiming = {
  best: [
    { label: "Milieu de matinée", from: "10:00", to: "11:30", why: "L'ouverture est passée, le rush du midi pas encore là." },
    { label: "Milieu d'après-midi", from: "14:30", to: "16:30", why: "Le creux de la journée pour la plupart des commerces." },
  ],
  avoid: [
    { label: "Ouverture", from: "08:00", to: "09:30", why: "Mise en place, livraisons, premiers clients." },
    { label: "Déjeuner", from: "12:00", to: "14:00", why: "Rush ou pause : personne n'a la tête à vous écouter." },
    { label: "Samedi", days: [6], from: "00:00", to: "23:59", why: "Le jour où ils font leur chiffre." },
  ],
  usuallyClosed: [0],
  phoneNote: "Appeler le fixe du commerce aux heures creuses ; ne jamais insister au premier « je suis avec un client ».",
  seasonNote: "Sur le littoral, éviter juillet-août pour tout ce qui vit du tourisme ; octobre à mars est la meilleure période pour prendre le temps d'échanger.",
};

export function timingFor(sector: string): SectorTiming {
  return getSector(sector)?.timing ?? GENERIC_TIMING;
}

function inWindow(w: TimeWindow, day: Weekday, minutes: number) {
  if (w.days && !w.days.includes(day)) return false;
  return minutes >= toMinutes(w.from) && minutes < toMinutes(w.to);
}

export type SlotVerdict = "ideal" | "ok" | "eviter" | "ferme";

export function slotVerdict(sector: string, date: Date): { verdict: SlotVerdict; window?: TimeWindow } {
  const t = timingFor(sector);
  const day = date.getDay() as Weekday;
  const m = date.getHours() * 60 + date.getMinutes();
  if (t.usuallyClosed.includes(day)) return { verdict: "ferme" };
  const avoid = t.avoid.find((w) => inWindow(w, day, m));
  if (avoid) return { verdict: "eviter", window: avoid };
  const best = t.best.find((w) => inWindow(w, day, m));
  if (best) return { verdict: "ideal", window: best };
  return { verdict: "ok" };
}

export const VERDICT_LABEL: Record<SlotVerdict, string> = {
  ideal: "Créneau idéal",
  ok: "Correct",
  eviter: "À éviter",
  ferme: "Souvent fermé",
};

/** Prochain créneau idéal à partir d'une date (sur 7 jours). */
export function nextBestSlot(sector: string, from: Date): Date | null {
  const t = timingFor(sector);
  for (let d = 0; d < 8; d++) {
    const day = new Date(from);
    day.setDate(from.getDate() + d);
    const dow = day.getDay() as Weekday;
    if (t.usuallyClosed.includes(dow)) continue;
    for (const w of t.best) {
      if (w.days && !w.days.includes(dow)) continue;
      const start = new Date(day);
      start.setHours(Math.floor(toMinutes(w.from) / 60), toMinutes(w.from) % 60, 0, 0);
      const end = new Date(day);
      end.setHours(Math.floor(toMinutes(w.to) / 60), toMinutes(w.to) % 60, 0, 0);
      if (end > from) return start > from ? start : from;
    }
  }
  return null;
}

export interface TourStop {
  prospect: Prospect;
  eta: string; // HH:MM
  verdict: SlotVerdict;
  window?: TimeWindow;
  travelMin: number;
  km: number;
}

export interface TourPlan {
  stops: TourStop[];
  skipped: { prospect: Prospect; reason: string }[];
  endsAt: string;
}

export function positionOf(p: Prospect) {
  return p.lat !== null && p.lng !== null ? { lat: p.lat, lng: p.lng } : jitteredPosition(p.id, p.city);
}

/**
 * Tournée ordonnée : plus proche voisin pondéré par les créneaux du secteur.
 * Un arrêt dans un créneau « à éviter » est repoussé ; on attend au besoin
 * jusqu'à 20 minutes si c'est la seule option.
 */
export function planTour(candidates: Prospect[], opts: { date: string; start: string; durationMin: number; visitMin?: number }): TourPlan {
  const visitMin = opts.visitMin ?? 12;
  const endLimit = toMinutes(opts.start) + opts.durationMin;
  const day = new Date(opts.date + "T12:00:00").getDay() as Weekday;
  const remaining = [...candidates];
  const stops: TourStop[] = [];
  const skipped: TourPlan["skipped"] = [];

  // Écarte d'emblée les commerces habituellement fermés ce jour-là
  for (let i = remaining.length - 1; i >= 0; i--) {
    if (timingFor(remaining[i].sector).usuallyClosed.includes(day)) {
      skipped.push({ prospect: remaining[i], reason: "Souvent fermé ce jour-là" });
      remaining.splice(i, 1);
    }
  }

  let now = toMinutes(opts.start);
  let pos: { lat: number; lng: number } | null = null;
  let waited = 0;
  while (remaining.length && now < endLimit) {
    let bestIdx = -1;
    let bestScore = Infinity;
    let bestInfo: { travel: number; km: number; verdict: SlotVerdict; window?: TimeWindow } | null = null;
    remaining.forEach((p, idx) => {
      const pp = positionOf(p);
      const km = pos ? distanceKm(pos, pp) : 0;
      // En ville : ~3 min de base + ~3 min/km (à pied ou en voiture avec stationnement)
      const travel = pos ? Math.round(3 + km * 3) : 0;
      const at = new Date(opts.date + "T00:00:00");
      at.setMinutes(now + travel);
      const { verdict, window } = slotVerdict(p.sector, at);
      const score = travel + (verdict === "eviter" ? 1000 : verdict === "ideal" ? -15 : 0) + (verdict === "ferme" ? 5000 : 0);
      if (score < bestScore) {
        bestScore = score;
        bestIdx = idx;
        bestInfo = { travel, km, verdict, window };
      }
    });
    if (bestIdx === -1 || !bestInfo) break;
    const info: { travel: number; km: number; verdict: SlotVerdict; window?: TimeWindow } = bestInfo;
    if (info.verdict === "eviter" && waited < 60) {
      now += 20;
      waited += 20;
      continue;
    }
    waited = 0;
    const p = remaining.splice(bestIdx, 1)[0];
    const eta = now + info.travel;
    if (eta + visitMin > endLimit) {
      skipped.push({ prospect: p, reason: "Plus assez de temps" });
      continue;
    }
    stops.push({ prospect: p, eta: fromMinutes(eta), verdict: info.verdict, window: info.window, travelMin: info.travel, km: info.km });
    now = eta + visitMin;
    pos = positionOf(p);
  }
  for (const p of remaining) skipped.push({ prospect: p, reason: "Hors du temps disponible ou créneau défavorable" });
  return { stops, skipped, endsAt: fromMinutes(now) };
}

/** Liens Google Maps multi-étapes (10 étapes max par lien, comme l'app Maps). */
export function mapsLinks(stops: Prospect[]): string[] {
  const addr = (p: Prospect) => [p.name, p.address, p.city].filter(Boolean).join(", ");
  const links: string[] = [];
  for (let i = 0; i < stops.length; i += 9) {
    const chunk = stops.slice(Math.max(0, i - (i ? 1 : 0)), i + 9);
    if (!chunk.length) break;
    const dest = chunk[chunk.length - 1];
    const waypoints = chunk.slice(0, -1).map(addr).join("|");
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set("destination", addr(dest));
    if (waypoints) url.searchParams.set("waypoints", waypoints);
    url.searchParams.set("travelmode", "driving");
    links.push(url.toString());
  }
  return links;
}
