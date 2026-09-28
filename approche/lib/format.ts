export const eur = (n: number | null | undefined, digits = 0) =>
  n === null || n === undefined || Number.isNaN(n)
    ? "—"
    : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: digits }).format(n);

export const pct = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n) ? "—" : `${Math.round(n * 100)} %`;

export const num = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
export const dayName = (d: number) => DAYS[d];

export function todayISO(d = new Date()) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return todayISO(d);
}

export function frDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  if (!iso) return "—";
  const d = iso.length <= 10 ? new Date(iso + "T12:00:00") : new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", opts).format(d);
}

export function frTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function relativeDay(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = todayISO();
  const d = iso.slice(0, 10);
  if (d === t) return "aujourd'hui";
  if (d === addDays(t, 1)) return "demain";
  if (d === addDays(t, -1)) return "hier";
  const diff = Math.round((new Date(d + "T12:00:00").getTime() - new Date(t + "T12:00:00").getTime()) / 86400000);
  if (diff < 0) return `il y a ${-diff} j`;
  if (diff < 7) return `dans ${diff} j`;
  return frDate(d);
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};
export const fromMinutes = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
export const hhmmFr = (hhmm: string) => hhmm.replace(":", " h ").replace(/ h 00$/, " h");

const PLACEHOLDER_LABEL = {
  prenom: "[votre prénom]",
  commerce: "[nom du commerce]",
  dirigeant: "[nom du gérant]",
  ville: "[ville]",
  creneau1: "[créneau 1]",
  creneau2: "[créneau 2]",
  lien: "[lien]",
} as const;

/** Remplace les placeholders des scripts ; sans valeur, un libellé lisible entre crochets. */
export function fillPlaceholders(text: string, vars: Partial<Record<"prenom" | "commerce" | "dirigeant" | "ville" | "creneau1" | "creneau2" | "lien", string>>) {
  return text.replace(/\{(prenom|commerce|dirigeant|ville|creneau1|creneau2|lien)\}/g, (_, k: keyof typeof vars) => vars[k] || PLACEHOLDER_LABEL[k]);
}

export function plural(n: number, one: string, many?: string) {
  return `${num(n)} ${n > 1 ? many ?? one + "s" : one}`;
}

export function csvEscape(v: unknown) {
  const s = v === null || v === undefined ? "" : Array.isArray(v) ? v.join(" | ") : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
