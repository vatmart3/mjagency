import {
  ASSET_KEYS,
  ASSET_STATES,
  AUDIENCES,
  BUDGETS,
  CONTACT_PREFS,
  FEATURES,
  GOALS,
  NEEDS,
  PALETTES,
  REFERRALS,
  SECTORS,
  STYLES,
  TIMINGS,
  TIME_SLOTS,
  labelOf,
  labelsOf,
} from "./options";
import { normalizePhone, normalizeUrl, type BriefValues } from "./schema";
import { recapLine, recapSentence } from "./summary";

const INK = "#1D1D1F";
const ACCENT = "#0071E3";
const MIST = "#F5F5F7";
const HAIR = "#E3E3E8";
const MUTED = "#6E6E73";
const SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const e = escapeHtml;

/* ── Briques de mise en page ──────────────────────────────────────────── */

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title></head>
<body style="margin:0;padding:0;background:${MIST};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MIST};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#FFFFFF;border:1px solid ${HAIR};">
${body}
</table>
<p style="margin:20px 0 0;font:400 11px/1.6 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">
MJAGENCY — Sète · mjagency.eu</p>
</td></tr></table></body></html>`;
}

function header(kicker: string, headline: string, sub?: string): string {
  return `<tr><td style="padding:40px 40px 0;">
<p style="margin:0 0 22px;font:400 11px/1 ${MONO};letter-spacing:.2em;text-transform:uppercase;color:${ACCENT};">${e(kicker)}</p>
<h1 style="margin:0;font:400 34px/1.1 ${SERIF};letter-spacing:-.02em;color:${INK};">${headline}</h1>
${sub ? `<p style="margin:12px 0 0;font:400 13px/1.5 ${MONO};letter-spacing:.06em;color:${MUTED};">${e(sub)}</p>` : ""}
</td></tr>`;
}

function lead(text: string): string {
  return `<tr><td style="padding:22px 40px 0;">
<p style="margin:0;font:italic 400 19px/1.45 ${SERIF};color:${INK};">${e(text)}</p></td></tr>`;
}

function section(title: string, rows: [string, string][]): string {
  const visible = rows.filter(([, v]) => v && v !== "—");
  if (!visible.length) return "";
  const cells = visible
    .map(
      ([k, v]) => `<tr>
<td style="padding:11px 0;border-bottom:1px solid ${HAIR};font:400 12px/1.5 ${MONO};letter-spacing:.06em;color:${MUTED};width:38%;vertical-align:top;">${e(k)}</td>
<td style="padding:11px 0;border-bottom:1px solid ${HAIR};font:400 15px/1.5 ${SANS};color:${INK};">${v}</td>
</tr>`,
    )
    .join("");
  return `<tr><td style="padding:34px 40px 0;">
<p style="margin:0 0 6px;font:400 11px/1 ${MONO};letter-spacing:.2em;text-transform:uppercase;color:${INK};">${e(title)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};">${cells}</table>
</td></tr>`;
}

function spacer(h = 40): string {
  return `<tr><td style="height:${h}px;line-height:${h}px;font-size:0;">&nbsp;</td></tr>`;
}

function cta(href: string, label: string): string {
  return `<tr><td style="padding:30px 40px 0;">
<a href="${e(href)}" style="display:inline-block;background:${INK};color:#FFFFFF;text-decoration:none;font:400 15px/1 ${SANS};padding:15px 28px;border-radius:999px;">${e(label)}</a>
</td></tr>`;
}

function swatches(colors: readonly string[]): string {
  return colors
    .map(
      (c) =>
        `<span style="display:inline-block;width:22px;height:22px;background:${e(c)};border:1px solid ${HAIR};margin-right:4px;vertical-align:middle;"></span>`,
    )
    .join("");
}

/* ── Les valeurs, rendues lisibles ────────────────────────────────────── */

function paletteCell(v: BriefValues): string {
  if (v.palette === "custom") {
    const list = v.customColors ?? [];
    return list.length
      ? `${swatches(list)} <span style="font:400 13px ${MONO};color:${MUTED};">${e(list.join(" · "))}</span>`
      : "Sur mesure";
  }
  const p = PALETTES.find((x) => x.id === v.palette);
  return p ? `${swatches(p.colors)} ${e(p.label)}` : "—";
}

function linkList(urls: string[]): string {
  if (!urls.length) return "—";
  return urls
    .map((u) => {
      const href = normalizeUrl(u);
      return `<a href="${e(href)}" style="color:${ACCENT};text-decoration:none;">${e(u)}</a>`;
    })
    .join("<br>");
}

function sectorLabel(v: BriefValues): string {
  return v.sector === "autre" ? v.sectorOther || "Autre" : labelOf(SECTORS, v.sector);
}

function featureList(v: BriefValues): string {
  if (v.featuresAdvice) return "Le client demande conseil";
  const list = labelsOf(FEATURES, v.features);
  return list.length ? e(list.join(", ")) : "—";
}

function assetsRows(v: BriefValues): [string, string][] {
  return ASSET_KEYS.map((a) => [
    a.label,
    e(labelOf(ASSET_STATES, v.assets[a.id as keyof BriefValues["assets"]])),
  ]);
}

/* ── L'email de l'agence ──────────────────────────────────────────────── */

export function agencyEmail(v: BriefValues, fileNames: string[]) {
  const phone = normalizePhone(v.phone);
  const subject = `Brief — ${v.company} · ${labelOf(NEEDS, v.need)} · ${labelOf(BUDGETS, v.budget)}`;

  const body = [
    header("Nouveau brief", e(v.company), recapLine(v)),
    lead(recapSentence(v)),
    section("Contact", [
      ["Nom", e(v.fullName)],
      ["Email", `<a href="mailto:${e(v.email)}" style="color:${ACCENT};text-decoration:none;">${e(v.email)}</a>`],
      ["Téléphone", `<a href="tel:${e(v.phone.replace(/\s+/g, ""))}" style="color:${ACCENT};text-decoration:none;">${e(phone)}</a>`],
      ["Préférence", `${e(labelOf(CONTACT_PREFS, v.contactPref))} — ${e(labelOf(TIME_SLOTS, v.timeSlot))}`],
      ["Origine", e(labelOf(REFERRALS, v.referral))],
    ]),
    section("Le projet", [
      ["Entreprise", e(v.company)],
      ["Secteur", e(sectorLabel(v))],
      ["Besoin", e(labelOf(NEEDS, v.need))],
      ["Site actuel", v.currentUrl ? linkList([v.currentUrl]) : "—"],
      ["Objectif", e(labelOf(GOALS, v.goal))],
      ["Clientèle", e(labelsOf(AUDIENCES, v.audience).join(", "))],
    ]),
    section("Le site", [
      ["Fonctionnalités", featureList(v)],
      ["Style", e(labelOf(STYLES, v.style))],
      ["Sobre → audacieux", `${v.bold} / 100`],
      ["Classique → moderne", `${v.modern} / 100`],
      ["Palette", paletteCell(v)],
    ]),
    section("Inspirations", [
      ["Sites aimés", linkList(v.inspirations ?? [])],
      ["À éviter", v.avoid ? e(v.avoid) : "—"],
    ]),
    section("Existant", assetsRows(v)),
    section("Cadre", [
      ["Budget", e(labelOf(BUDGETS, v.budget))],
      ["Délai", e(labelOf(TIMINGS, v.timing))],
      ["Pièces jointes", fileNames.length ? e(fileNames.join(", ")) : "—"],
    ]),
    cta(`mailto:${encodeURIComponent(v.email)}?subject=${encodeURIComponent(`Votre projet — ${v.company}`)}`, "Répondre au client"),
    spacer(),
  ].join("");

  const text = [
    `NOUVEAU BRIEF — ${v.company}`,
    recapSentence(v),
    "",
    `${v.fullName} · ${v.email} · ${phone}`,
    `Préférence : ${labelOf(CONTACT_PREFS, v.contactPref)} — ${labelOf(TIME_SLOTS, v.timeSlot)}`,
    `Origine : ${labelOf(REFERRALS, v.referral)}`,
    "",
    `Secteur : ${sectorLabel(v)}`,
    `Besoin : ${labelOf(NEEDS, v.need)}${v.currentUrl ? ` (${v.currentUrl})` : ""}`,
    `Objectif : ${labelOf(GOALS, v.goal)}`,
    `Clientèle : ${labelsOf(AUDIENCES, v.audience).join(", ")}`,
    `Fonctionnalités : ${v.featuresAdvice ? "demande conseil" : labelsOf(FEATURES, v.features).join(", ")}`,
    `Style : ${labelOf(STYLES, v.style)} — sobre/audacieux ${v.bold}, classique/moderne ${v.modern}`,
    `Palette : ${v.palette === "custom" ? (v.customColors ?? []).join(" ") : labelOf(PALETTES as unknown as { id: string; label: string }[], v.palette)}`,
    `Inspirations : ${(v.inspirations ?? []).join(" ") || "—"}`,
    `À éviter : ${v.avoid || "—"}`,
    ...ASSET_KEYS.map(
      (a) => `${a.label} : ${labelOf(ASSET_STATES, v.assets[a.id as keyof BriefValues["assets"]])}`,
    ),
    `Budget : ${labelOf(BUDGETS, v.budget)} — Délai : ${labelOf(TIMINGS, v.timing)}`,
    `Pièces jointes : ${fileNames.join(", ") || "—"}`,
  ].join("\n");

  return { subject, html: shell(subject, body), text };
}

/* ── L'email du client ────────────────────────────────────────────────── */

export function clientEmail(v: BriefValues) {
  const first = v.firstName.trim();
  const subject = `C'est reçu, ${first} — votre brief est entre nos mains`;

  const steps = [
    ["01", "On étudie votre brief", "Ligne par ligne, avec vos inspirations sous les yeux."],
    ["02", "On vous appelle sous 24 h ouvrées", `Par ${labelOf(CONTACT_PREFS, v.contactPref).toLowerCase()}, plutôt ${labelOf(TIME_SLOTS, v.timeSlot).toLowerCase()}.`],
    ["03", "Première direction visuelle offerte", "Une piste dessinée pour vous, sans engagement."],
  ]
    .map(
      ([n, t, d]) => `<tr>
<td style="padding:14px 0;border-bottom:1px solid ${HAIR};width:44px;vertical-align:top;font:400 12px/1.5 ${MONO};color:${ACCENT};">${n}</td>
<td style="padding:14px 0;border-bottom:1px solid ${HAIR};">
<span style="display:block;font:400 16px/1.4 ${SANS};color:${INK};">${e(t)}</span>
<span style="display:block;margin-top:3px;font:400 14px/1.5 ${SANS};color:${MUTED};">${e(d)}</span>
</td></tr>`,
    )
    .join("");

  const body = [
    header("Brief reçu", `C'est reçu, <span style="font-style:italic;">${e(first)}</span>.`),
    lead(recapSentence(v)),
    `<tr><td style="padding:26px 40px 0;">
<p style="margin:0;font:400 15px/1.65 ${SANS};color:${MUTED};">
Merci d'avoir pris ces quelques minutes. Tout ce que vous avez décrit est arrivé chez nous —
y compris vos inspirations et ce que vous ne voulez surtout pas voir.</p></td></tr>`,
    `<tr><td style="padding:30px 40px 0;">
<p style="margin:0 0 6px;font:400 11px/1 ${MONO};letter-spacing:.2em;text-transform:uppercase;color:${INK};">La suite</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};">${steps}</table>
</td></tr>`,
    section("Ce que nous avons retenu", [
      ["Entreprise", e(v.company)],
      ["Style", e(labelOf(STYLES, v.style))],
      ["Palette", paletteCell(v)],
      ["Fonctionnalités", featureList(v)],
      ["Budget", e(labelOf(BUDGETS, v.budget))],
      ["Délai", e(labelOf(TIMINGS, v.timing))],
    ]),
    `<tr><td style="padding:26px 40px 0;">
<p style="margin:0;font:400 14px/1.6 ${SANS};color:${MUTED};">
Une précision à ajouter ? Répondez simplement à cet email : il arrive directement chez nous.</p></td></tr>`,
    cta("https://mjagency.eu", "Visiter mjagency.eu"),
    spacer(),
  ].join("");

  const text = [
    `C'est reçu, ${first}.`,
    recapSentence(v),
    "",
    "La suite :",
    "01 — On étudie votre brief.",
    "02 — On vous appelle sous 24 h ouvrées.",
    "03 — Première direction visuelle offerte.",
    "",
    "Une précision à ajouter ? Répondez à cet email.",
    "MJAGENCY — Sète · mjagency.eu",
  ].join("\n");

  return { subject, html: shell(subject, body), text };
}
