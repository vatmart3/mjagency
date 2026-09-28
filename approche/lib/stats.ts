import type { Interaction, Prospect, SettingsData } from "@/lib/types";
import { addDays, todayISO } from "@/lib/format";

const CALL_OUTCOMES = new Set(["pas_de_reponse", "messagerie", "barrage", "refus", "rappel", "rdv"]);
const PICKED = new Set(["barrage", "refus", "rappel", "rdv"]);

export interface PersonStats {
  calls: number;
  pickups: number;
  visits: number;
  rdv: number;
  rdvFromCalls: number;
  rdvFromVisits: number;
  signed: number;
  revenue: number; // CA signé sur la période
  pickupRate: number | null;
  rdvRate: number | null; // RDV / (appels + visites)
  callRdvRate: number | null;
  visitRdvRate: number | null;
  closeRate: number | null; // signatures / RDV
  callsSinceLastRdv: number;
}

export function isCall(i: Interaction) {
  return i.channel === "telephone" && i.outcome !== null && CALL_OUTCOMES.has(i.outcome);
}
export function isVisit(i: Interaction) {
  return i.channel === "physique";
}
export function isRdv(i: Interaction) {
  return i.outcome === "rdv" || (i.channel === "physique" && i.next_action === "RDV fixé");
}

export function monthStart(d = new Date()) {
  return todayISO(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function computeStats(
  interactions: Interaction[],
  prospects: Prospect[],
  opts: { userId?: string | null; since?: string } = {},
): PersonStats {
  const mine = interactions.filter(
    (i) => (!opts.userId || i.user_id === opts.userId) && (!opts.since || i.created_at.slice(0, 10) >= opts.since),
  );
  const calls = mine.filter(isCall);
  const visits = mine.filter(isVisit);
  const rdvCalls = calls.filter((c) => c.outcome === "rdv").length;
  const rdvVisits = visits.filter(isRdv).length;
  const signedProspects = prospects.filter(
    (p) =>
      p.status === "signe" &&
      (!opts.userId || p.signed_by === opts.userId) &&
      (!opts.since || (p.signed_at ?? p.updated_at).slice(0, 10) >= opts.since),
  );
  const rdv = rdvCalls + rdvVisits;
  const sortedCalls = [...calls].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const lastRdvIdx = sortedCalls.findIndex((c) => c.outcome === "rdv");
  return {
    calls: calls.length,
    pickups: calls.filter((c) => PICKED.has(c.outcome!)).length,
    visits: visits.length,
    rdv,
    rdvFromCalls: rdvCalls,
    rdvFromVisits: rdvVisits,
    signed: signedProspects.length,
    revenue: signedProspects.reduce((s, p) => s + (Number(p.signed_amount) || 0), 0),
    pickupRate: calls.length ? calls.filter((c) => PICKED.has(c.outcome!)).length / calls.length : null,
    rdvRate: calls.length + visits.length ? rdv / (calls.length + visits.length) : null,
    callRdvRate: calls.length ? rdvCalls / calls.length : null,
    visitRdvRate: visits.length ? rdvVisits / visits.length : null,
    closeRate: rdv ? Math.min(1, signedProspects.length / rdv) : null,
    callsSinceLastRdv: lastRdvIdx === -1 ? sortedCalls.length : lastRdvIdx,
  };
}

/** Panier moyen : deals signés, sinon valeur par défaut des réglages. */
export function averageBasket(prospects: Prospect[], settings: SettingsData, userId?: string | null) {
  const signed = prospects.filter((p) => p.status === "signe" && Number(p.signed_amount) > 0 && (!userId || p.signed_by === userId));
  if (signed.length < 2) return { value: settings.defaultBasket, fromData: false, n: signed.length };
  return { value: signed.reduce((s, p) => s + Number(p.signed_amount), 0) / signed.length, fromData: true, n: signed.length };
}

export interface Plan {
  goal: number;
  basket: number;
  basketFromData: boolean;
  sales: number;
  rdv: number;
  contacts: number;
  callsPerWeek: number;
  visitsPerWeek: number;
  perDay: number;
  rates: { close: number; callRdv: number; visitRdv: number; closeFromData: boolean; rdvFromData: boolean };
}

/**
 * Calculateur inverse : objectif mensuel → ventes → RDV → appels / visites par semaine,
 * avec les taux réels de la personne quand il y a assez d'historique (sinon ceux des réglages).
 */
export function inversePlan(stats: PersonStats, basket: { value: number; fromData: boolean }, settings: SettingsData, goal = settings.goalPerPerson): Plan {
  const d = settings.defaultRates;
  const closeFromData = stats.rdv >= 3 && stats.closeRate !== null && stats.closeRate > 0;
  const close = closeFromData ? stats.closeRate! : d.close;
  const callRdvFromData = stats.calls >= 20 && (stats.callRdvRate ?? 0) > 0;
  const visitRdvFromData = stats.visits >= 8 && (stats.visitRdvRate ?? 0) > 0;
  const callRdv = callRdvFromData ? stats.callRdvRate! : d.pickup * d.meeting;
  const visitRdv = visitRdvFromData ? stats.visitRdvRate! : d.visitMeeting;

  const sales = Math.max(1, Math.ceil(goal / Math.max(1, basket.value)));
  const rdv = Math.ceil(sales / Math.max(0.01, close));
  // Répartition terrain / téléphone selon l'habitude réelle (50/50 par défaut)
  const mixCalls = stats.calls + stats.visits > 10 ? stats.rdvFromCalls / Math.max(1, stats.rdv) || 0.5 : 0.5;
  const rdvByCalls = rdv * mixCalls;
  const rdvByVisits = rdv - rdvByCalls;
  const weeks = 4.33;
  const callsPerWeek = Math.ceil(rdvByCalls / Math.max(0.005, callRdv) / weeks);
  const visitsPerWeek = Math.ceil(rdvByVisits / Math.max(0.01, visitRdv) / weeks);
  return {
    goal,
    basket: basket.value,
    basketFromData: basket.fromData,
    sales,
    rdv,
    contacts: Math.ceil(rdvByCalls / callRdv + rdvByVisits / visitRdv),
    callsPerWeek,
    visitsPerWeek,
    perDay: Math.ceil((callsPerWeek + visitsPerWeek) / settings.workingDaysPerWeek),
    rates: { close, callRdv, visitRdv, closeFromData, rdvFromData: callRdvFromData || visitRdvFromData },
  };
}

/** « Tu es à X appels d'un RDV » selon le taux réel de conversion appel → RDV. */
export function callsToNextRdv(stats: PersonStats, settings: SettingsData) {
  const rate = stats.calls >= 10 && (stats.callRdvRate ?? 0) > 0 ? stats.callRdvRate! : settings.defaultRates.pickup * settings.defaultRates.meeting;
  const per = Math.max(1, Math.round(1 / rate));
  return { remaining: Math.max(1, per - stats.callsSinceLastRdv), per, fromData: stats.calls >= 10 };
}

/** Série de jours consécutifs avec au moins une action de prospection (le dimanche ne casse pas la série). */
export function streak(interactions: Interaction[], userId: string | null | undefined) {
  const days = new Set(interactions.filter((i) => !userId || i.user_id === userId).map((i) => i.created_at.slice(0, 10)));
  let d = todayISO();
  if (!days.has(d)) d = addDays(d, -1);
  let n = 0;
  for (let guard = 0; guard < 400; guard++) {
    const dow = new Date(d + "T12:00:00").getDay();
    if (days.has(d)) n++;
    else if (dow !== 0) break;
    d = addDays(d, -1);
  }
  return { days: n, today: days.has(todayISO()) };
}

export function sectorRanking(interactions: Interaction[], prospects: Prospect[]) {
  const byId = new Map(prospects.map((p) => [p.id, p]));
  const rows = new Map<string, { sector: string; contacts: number; rdv: number; signed: number; revenue: number }>();
  const row = (s: string) => {
    if (!rows.has(s)) rows.set(s, { sector: s, contacts: 0, rdv: 0, signed: 0, revenue: 0 });
    return rows.get(s)!;
  };
  for (const i of interactions) {
    const p = byId.get(i.prospect_id);
    if (!p || !(isCall(i) || isVisit(i))) continue;
    const r = row(p.sector);
    r.contacts++;
    if (isRdv(i)) r.rdv++;
  }
  for (const p of prospects) {
    if (p.status === "signe") {
      const r = row(p.sector);
      r.signed++;
      r.revenue += Number(p.signed_amount) || 0;
    }
  }
  return [...rows.values()]
    .map((r) => ({ ...r, rate: r.contacts ? r.rdv / r.contacts : 0 }))
    .sort((a, b) => b.signed - a.signed || b.rate - a.rate || b.contacts - a.contacts);
}
