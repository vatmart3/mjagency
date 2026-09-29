import { SECTORS, getSector } from "@/content/sectors";
import type { Channel, Script, ScriptStep, SectorSheet } from "@/content/types";
import type { CustomScript } from "@/lib/types";
import { normalize } from "@/content/cities";

export const baseKey = (sector: string, channel: Channel) => `${sector}:${channel}`;

/** Script effectif : la dernière surcharge enregistrée depuis l'interface, sinon celui de /content. */
export function effectiveScript(sector: SectorSheet, channel: Channel, customs: CustomScript[]): { script: Script; custom: CustomScript | null } {
  const override = customs
    .filter((c) => c.base_key === baseKey(sector.id, channel))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  if (override) return { script: { id: override.id, title: override.title, channel, duration: sector.scripts[channel].duration, steps: override.steps }, custom: override };
  return { script: sector.scripts[channel], custom: null };
}

export function variantsOf(sectorId: string, customs: CustomScript[]) {
  return customs.filter((c) => c.sector === sectorId && !c.base_key && !c.prospect_id);
}

/** Script sur mesure d'un client pour un canal (issu de l'analyse), s'il existe. */
export function prospectScript(prospectId: string | null | undefined, channel: Channel, customs: CustomScript[]) {
  if (!prospectId) return null;
  return customs.filter((c) => c.prospect_id === prospectId && c.channel === channel).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0] ?? null;
}

export interface PrompterSection {
  title: string;
  lines: string[];
  tip?: string;
}

export function stepsToSections(steps: ScriptStep[]): PrompterSection[] {
  return steps.map((s) => ({ title: s.title, lines: s.lines, tip: s.tip }));
}

export interface SearchHit {
  sector: SectorSheet;
  kind: "secteur" | "script" | "objection" | "question" | "preuve";
  label: string;
  excerpt: string;
  anchor: string;
}

function excerpt(text: string, q: string) {
  const n = normalize(text);
  const i = n.indexOf(q.split("-")[0]);
  if (i < 0) return text.slice(0, 140);
  const start = Math.max(0, i - 50);
  return (start > 0 ? "…" : "") + text.slice(start, start + 160) + (start + 160 < text.length ? "…" : "");
}

/** Recherche plein texte sur toute la bibliothèque (normalisée, sans accents). */
export function searchLibrary(query: string, customs: CustomScript[] = []): SearchHit[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const terms = q.split("-").filter(Boolean);
  const match = (t: string) => {
    const n = normalize(t);
    return terms.every((x) => n.includes(x));
  };
  const hits: SearchHit[] = [];
  for (const s of SECTORS) {
    if (match(s.name + " " + s.examples.join(" "))) hits.push({ sector: s, kind: "secteur", label: s.name, excerpt: s.tagline, anchor: "" });
    for (const ch of ["physique", "telephone"] as const) {
      for (const step of s.scripts[ch].steps) {
        const text = [step.title, ...step.lines, step.tip ?? ""].join(" ");
        if (match(text)) hits.push({ sector: s, kind: "script", label: `${s.short} · ${ch === "physique" ? "Terrain" : "Téléphone"} · ${step.title}`, excerpt: excerpt(step.lines.join(" "), q), anchor: `#script-${ch}` });
      }
    }
    for (const o of s.objections) {
      const text = [o.objection, o.hidden, o.accueillir, o.questionner, o.recadrer, o.proposer].join(" ");
      if (match(text)) hits.push({ sector: s, kind: "objection", label: `${s.short} · « ${o.objection} »`, excerpt: excerpt(o.recadrer, q), anchor: `#obj-${o.id}` });
    }
    for (const d of s.discovery) if (match(d.question)) hits.push({ sector: s, kind: "question", label: `${s.short} · Question ${d.type}`, excerpt: d.question, anchor: "#decouverte" });
    for (const p of s.proofs) if (match(p)) hits.push({ sector: s, kind: "preuve", label: `${s.short} · Argument`, excerpt: p, anchor: "#preuves" });
  }
  for (const c of customs) {
    if (c.prospect_id) continue; // les scripts d'un client vivent dans son dossier
    const s = getSector(c.sector);
    if (!s) continue;
    const text = [c.title, ...c.steps.flatMap((x) => [x.title, ...x.lines])].join(" ");
    if (match(text)) hits.push({ sector: s, kind: "script", label: `${s.short} · ${c.title} (perso)`, excerpt: excerpt(c.steps.flatMap((x) => x.lines).join(" "), q), anchor: `#custom-${c.id}` });
  }
  return hits.slice(0, 80);
}
