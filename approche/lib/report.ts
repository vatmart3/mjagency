/** Découpe un rapport collé (titres fixes) et le range dans la fiche. */
import type { ParsedReport } from "@/lib/types";
import { REPORT_SECTIONS } from "./prompt";

const strip = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Mots-clés de reconnaissance, tolérants aux variantes d'intitulés. */
const MATCHERS: { key: (typeof REPORT_SECTIONS)[number]["key"]; words: string[] }[] = [
  { key: "synthese", words: ["synthese", "resume"] },
  { key: "presence", words: ["presence digitale", "presence en ligne"] },
  { key: "site", words: ["site web", "site internet", "qualite du site"] },
  { key: "reseaux", words: ["reseaux sociaux", "reseaux"] },
  { key: "avis", words: ["avis google", "avis"] },
  { key: "concurrents", words: ["concurrent"] },
  { key: "saisonnalite", words: ["saisonnalite", "saison"] },
  { key: "opportunites", words: ["opportunite"] },
  { key: "problemes", words: ["problemes", "probleme"] },
  { key: "offre", words: ["offre"] },
  { key: "accroche", words: ["accroche"] },
  { key: "questions", words: ["questions"] },
  { key: "objections", words: ["objection"] },
  { key: "budget", words: ["budget"] },
  { key: "manquants", words: ["non trouvees", "manquant", "non verifie"] },
];

function keyForHeading(h: string): (typeof REPORT_SECTIONS)[number]["key"] | null {
  const s = strip(h);
  // Un numéro en tête (« 11. … ») est l'indice le plus fiable
  const n = s.match(/^(\d{1,2})\b/);
  if (n) {
    const idx = Number(n[1]) - 1;
    if (REPORT_SECTIONS[idx]) return REPORT_SECTIONS[idx].key;
  }
  for (const m of MATCHERS) if (m.words.some((w) => s.includes(w))) return m.key;
  return null;
}

export function parseReport(raw: string): ParsedReport {
  const lines = raw.replace(/\r/g, "").split("\n");
  const buckets = new Map<string, string[]>();
  let current: string | null = null;
  for (const l of lines) {
    const h = l.match(/^\s*(?:#{1,4}\s*|\*\*\s*)(.+?)\s*(?:\*\*)?\s*:?\s*$/);
    const looksHeading = h && (l.trim().startsWith("#") || /^\s*\*\*\d{1,2}\./.test(l));
    if (looksHeading && h) {
      const k = keyForHeading(h[1].replace(/\*\*/g, ""));
      if (k) {
        current = k;
        if (!buckets.has(k)) buckets.set(k, []);
        continue;
      }
    }
    if (current) buckets.get(current)!.push(l);
  }
  const text = (k: string) => (buckets.get(k)?.join("\n").trim() || undefined);

  const questions = (text("questions") ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim())
    .filter((l) => l.length > 8);

  const objections: { objection: string; reponse: string }[] = [];
  const objText = text("objections") ?? "";
  const blocks = objText.split(/\n(?=\s*(?:[-*•]|\d+[.)])?\s*\**\s*objection)/i);
  for (const b of blocks) {
    const o = b.match(/objection\s*\**\s*:?\s*\**\s*(.+)/i);
    const r = b.match(/r[ée]ponse\s*\**\s*:?\s*\**\s*([\s\S]+)/i);
    if (o) {
      objections.push({
        objection: o[1].replace(/[«»"*]/g, "").trim(),
        reponse: (r?.[1] ?? "").replace(/\s+/g, " ").replace(/\*/g, "").trim(),
      });
    }
  }

  const accroche = text("accroche")?.replace(/^[«"\s]+|[»"\s]+$/g, "").replace(/\*/g, "").trim();

  const found = REPORT_SECTIONS.filter((s) => buckets.has(s.key)).map((s) => s.key);
  const missing = REPORT_SECTIONS.filter((s) => !buckets.has(s.key)).map((s) => s.title);

  return {
    synthese: text("synthese"),
    presence: text("presence"),
    site: text("site"),
    reseaux: text("reseaux"),
    avis: text("avis"),
    concurrents: text("concurrents"),
    saisonnalite: text("saisonnalite"),
    opportunites: text("opportunites"),
    problemes: text("problemes"),
    offre: text("offre"),
    accroche,
    questions: questions.slice(0, 7),
    objections: objections.slice(0, 5),
    budget: text("budget"),
    manquants: text("manquants"),
    found,
    missing,
  };
}
