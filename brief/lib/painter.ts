import {
  FEATURE_GLYPH,
  FEATURE_TAG,
  SECTOR_SHAPE,
  luminance,
  mixRgb,
  rgbCss,
  type Rgb,
} from "./mockup";
import type { FeatureId, SectorId, StyleId } from "./options";

/** Repère logique du dessin. Tout est exprimé dans ces unités, puis mis à l'échelle. */
export const ART_W = 1200;
export const ART_H = 760;

export type PaintFeature = { id: FeatureId; p: number };

export type PaintState = {
  headline: string;
  logo: string;
  domain: string;
  sector: SectorId;
  style: StyleId;
  bold: number;
  modern: number;
  colors: [Rgb, Rgb, Rgb, Rgb];
  radius: number;
  density: number;
  weight: number;
  tracking: number;
  italic: boolean;
  uppercase: boolean;
  features: PaintFeature[];
  build: number;
  /** Balayage joué au changement de style : 1 → 0. */
  swap: number;
  /** Horloge, en secondes — anime les détails internes. */
  time: number;
  fonts: { serif: string; sans: string; mono: string };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function fillRR(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
) {
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
}

function displayFamily(s: PaintState): string {
  const t = s.style;
  if (t === "tech") return s.fonts.mono;
  if (t === "luxe" || t === "chaleureux" || t === "naturel") return s.fonts.serif;
  return s.fonts.sans;
}

function setFont(
  ctx: CanvasRenderingContext2D,
  family: string,
  size: number,
  weight = 400,
  italic = false,
) {
  ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
}

/** Retour à la ligne au mot, sur `maxLines` lignes au plus. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) return lines;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

/** Dessine du texte lettre par lettre pour respecter l'interlettrage demandé. */
function trackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  size: number,
) {
  if (!tracking) {
    ctx.fillText(text, x, y);
    return ctx.measureText(text).width;
  }
  const step = tracking * size;
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + step;
  }
  return cx - x;
}

/* ── Compositions abstraites, une par secteur ─────────────────────────── */

function paintSectorArt(
  ctx: CanvasRenderingContext2D,
  s: PaintState,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const [, ink, accent, soft] = s.colors;
  const shape = SECTOR_SHAPE[s.sector] ?? "blocks";
  const r = 26 * s.radius + 4;
  const drift = Math.sin(s.time * 0.6) * 3 * (0.4 + s.modern * 0.8);
  const inkSoft = rgbCss(ink, 0.08);

  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = rgbCss(soft);
  ctx.fillRect(x, y, w, h);

  const cx = x + w / 2;
  const cy = y + h / 2 + drift;

  switch (shape) {
    case "plates": {
      // Restaurant : des cercles concentriques, comme une table dressée.
      for (let i = 3; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(cx, cy, (h * 0.42) * (0.38 + i * 0.21), 0, Math.PI * 2);
        ctx.fillStyle = i === 1 ? rgbCss(accent, 0.9) : rgbCss(ink, 0.06 + i * 0.02);
        ctx.fill();
      }
      ctx.fillStyle = rgbCss(soft);
      ctx.beginPath();
      ctx.arc(cx, cy, h * 0.1, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "beams": {
      // Artisan : des poutres diagonales qui se croisent.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 9);
      for (let i = -2; i <= 2; i++) {
        const bw = w * 0.9;
        const bh = 20 + s.density * 16;
        fillRR(ctx, -bw / 2, i * (bh + 22) - bh / 2, bw, bh, s.radius * 8, i === 0 ? rgbCss(accent) : inkSoft);
      }
      ctx.restore();
      break;
    }
    case "grid": {
      // Commerce : un rayonnage régulier.
      const cols = 3 + Math.round(s.density * 2);
      const rows = 3;
      const gx = 18;
      const cw = (w - gx * (cols + 1)) / cols;
      const ch = (h - gx * (rows + 1)) / rows;
      for (let i = 0; i < cols * rows; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const on = (i * 7) % 5 === 0;
        fillRR(
          ctx,
          x + gx + col * (cw + gx),
          y + gx + row * (ch + gx) + (col % 2 ? drift : -drift) * 0.6,
          cw,
          ch,
          r * 0.5,
          on ? rgbCss(accent, 0.92) : inkSoft,
        );
      }
      break;
    }
    case "arcs": {
      // Beauté : des arcs souples, imbriqués.
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(x + w * 0.5, y + h + 20, (h * 0.34) * (1 + i * 0.42), Math.PI, 0);
        ctx.lineWidth = 16 - i * 2;
        ctx.strokeStyle = i === 0 ? rgbCss(accent) : rgbCss(ink, 0.1);
        ctx.stroke();
      }
      break;
    }
    case "cross": {
      // Santé : une croix pleine, posée au centre.
      const arm = h * 0.46;
      const bar = arm * 0.34;
      fillRR(ctx, cx - bar / 2, cy - arm / 2, bar, arm, bar * s.radius * 0.5, rgbCss(accent));
      fillRR(ctx, cx - arm / 2, cy - bar / 2, arm, bar, bar * s.radius * 0.5, rgbCss(accent));
      ctx.beginPath();
      ctx.arc(cx, cy, arm * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle = rgbCss(ink, 0.12);
      ctx.lineWidth = 8;
      ctx.stroke();
      break;
    }
    case "skyline": {
      // Immobilier : des volumes alignés sur un sol.
      const n = 5;
      const bw = (w - 40) / n - 12;
      for (let i = 0; i < n; i++) {
        const bh = h * (0.28 + ((i * 3) % 5) * 0.12);
        fillRR(
          ctx,
          x + 20 + i * (bw + 12),
          y + h - 26 - bh,
          bw,
          bh,
          r * 0.4,
          i === 2 ? rgbCss(accent) : inkSoft,
        );
      }
      ctx.fillStyle = rgbCss(ink, 0.14);
      ctx.fillRect(x + 12, y + h - 26, w - 24, 2);
      break;
    }
    case "horizon": {
      // Tourisme : une ligne d'horizon et un soleil bas.
      ctx.beginPath();
      ctx.arc(cx + w * 0.16, y + h * 0.46, h * 0.19, 0, Math.PI * 2);
      ctx.fillStyle = rgbCss(accent);
      ctx.fill();
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const base = y + h * (0.62 + i * 0.12);
        ctx.moveTo(x, base + drift * (i + 1) * 0.5);
        ctx.bezierCurveTo(
          x + w * 0.3,
          base - 18 + drift,
          x + w * 0.7,
          base + 18 - drift,
          x + w,
          base + drift * (i + 1) * 0.5,
        );
        ctx.lineWidth = 10 - i * 2;
        ctx.strokeStyle = rgbCss(ink, 0.12 - i * 0.03);
        ctx.stroke();
      }
      break;
    }
    default: {
      // Neutre : trois volumes décalés.
      fillRR(ctx, x + 32, y + 40, w * 0.42, h - 80, r * 0.6, rgbCss(accent, 0.9));
      fillRR(ctx, x + w * 0.52, y + 40, w * 0.34, h * 0.38, r * 0.6, inkSoft);
      fillRR(ctx, x + w * 0.52, y + h * 0.5, w * 0.34, h * 0.32, r * 0.6, inkSoft);
    }
  }
  ctx.restore();
}

/* ── Glyphes des fonctionnalités ──────────────────────────────────────── */

function paintGlyph(
  ctx: CanvasRenderingContext2D,
  id: FeatureId,
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number,
) {
  const g = FEATURE_GLYPH[id];
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.08);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const u = size;

  switch (g) {
    case "frames":
      rr(ctx, 0, u * 0.12, u * 0.62, u * 0.62, radius * 4);
      ctx.stroke();
      rr(ctx, u * 0.34, u * 0.3, u * 0.62, u * 0.62, radius * 4);
      ctx.stroke();
      break;
    case "calendar":
      rr(ctx, 0, u * 0.14, u, u * 0.8, radius * 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, u * 0.4);
      ctx.lineTo(u, u * 0.4);
      ctx.moveTo(u * 0.28, u * 0.04);
      ctx.lineTo(u * 0.28, u * 0.24);
      ctx.moveTo(u * 0.72, u * 0.04);
      ctx.lineTo(u * 0.72, u * 0.24);
      ctx.stroke();
      ctx.fillRect(u * 0.22, u * 0.56, u * 0.18, u * 0.16);
      break;
    case "clock":
      ctx.beginPath();
      ctx.arc(u * 0.5, u * 0.52, u * 0.44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(u * 0.5, u * 0.52);
      ctx.lineTo(u * 0.5, u * 0.26);
      ctx.moveTo(u * 0.5, u * 0.52);
      ctx.lineTo(u * 0.72, u * 0.6);
      ctx.stroke();
      break;
    case "bag":
      rr(ctx, u * 0.06, u * 0.3, u * 0.88, u * 0.64, radius * 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(u * 0.5, u * 0.32, u * 0.22, Math.PI, 0);
      ctx.stroke();
      break;
    case "list":
      for (let i = 0; i < 3; i++) {
        const yy = u * (0.22 + i * 0.26);
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(u * (i === 1 ? 0.62 : 0.86), yy);
        ctx.stroke();
      }
      break;
    case "stars":
      for (let i = 0; i < 3; i++) {
        star(ctx, u * (0.16 + i * 0.34), u * 0.52, u * 0.16);
        ctx.fill();
      }
      break;
    case "quote":
      rr(ctx, 0, u * 0.14, u, u * 0.62, radius * 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(u * 0.2, u * 0.76);
      ctx.lineTo(u * 0.14, u * 0.96);
      ctx.lineTo(u * 0.4, u * 0.76);
      ctx.stroke();
      break;
    case "lines":
      for (let i = 0; i < 4; i++) {
        const yy = u * (0.14 + i * 0.24);
        ctx.fillRect(0, yy, u * (i === 3 ? 0.5 : 1), Math.max(1.4, u * 0.06));
      }
      break;
    case "globe":
      ctx.beginPath();
      ctx.arc(u * 0.5, u * 0.52, u * 0.44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(u * 0.5, u * 0.52, u * 0.18, u * 0.44, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(u * 0.06, u * 0.52);
      ctx.lineTo(u * 0.94, u * 0.52);
      ctx.stroke();
      break;
    case "key":
      ctx.beginPath();
      ctx.arc(u * 0.3, u * 0.42, u * 0.24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(u * 0.46, u * 0.56);
      ctx.lineTo(u * 0.92, u * 0.96);
      ctx.moveTo(u * 0.72, u * 0.7);
      ctx.lineTo(u * 0.86, u * 0.62);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.44 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}

/* ── La maquette ──────────────────────────────────────────────────────── */

/** Le libellé du bouton principal, déduit des fonctionnalités cochées. */
function ctaLabel(features: PaintFeature[]): string {
  const on = features.filter((f) => f.p > 0.35).map((f) => f.id);
  if (on.includes("reservation")) return "Réserver une table";
  if (on.includes("rdv")) return "Prendre rendez-vous";
  if (on.includes("click-collect")) return "Commander";
  if (on.includes("devis")) return "Demander un devis";
  return "Nous contacter";
}

export function paintMockup(ctx: CanvasRenderingContext2D, s: PaintState) {
  const [bg, ink, accent, soft] = s.colors;
  const dark = luminance(bg) < 0.45;
  const onAccent = luminance(accent) > 0.62 ? ink : ([255, 255, 255] as Rgb);
  const sans = s.fonts.sans;
  const mono = s.fonts.mono;
  const display = displayFamily(s);
  const R = (v: number) => v * (0.15 + s.radius * 1.85);

  ctx.clearRect(0, 0, ART_W, ART_H);
  ctx.textBaseline = "alphabetic";

  /* Barre du navigateur */
  const chrome = 52;
  ctx.fillStyle = rgbCss(mixRgb(bg, ink, dark ? 0.1 : 0.05));
  ctx.fillRect(0, 0, ART_W, chrome);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(30 + i * 20, chrome / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = rgbCss(ink, 0.16);
    ctx.fill();
  }
  fillRR(ctx, 108, chrome / 2 - 14, 360, 28, 14, rgbCss(bg, dark ? 0.35 : 0.9));
  setFont(ctx, mono, 15, 400);
  ctx.fillStyle = rgbCss(ink, 0.45);
  ctx.fillText(s.domain, 128, chrome / 2 + 5);

  ctx.fillStyle = rgbCss(ink, 0.1);
  ctx.fillRect(0, chrome - 1, ART_W, 1);

  /* Page */
  ctx.fillStyle = rgbCss(bg);
  ctx.fillRect(0, chrome, ART_W, ART_H - chrome);

  const pad = lerp(84, 44, s.density);
  const headerY = chrome + lerp(64, 44, s.density);

  /* En-tête : logo texte + navigation */
  setFont(ctx, display, 26, s.weight >= 700 ? 700 : 500, s.italic && s.style === "luxe");
  ctx.fillStyle = rgbCss(ink);
  const logoText = s.uppercase || s.style === "luxe" ? s.logo.toUpperCase() : s.logo;
  trackedText(ctx, logoText, pad, headerY, s.style === "luxe" ? 0.18 : 0.02, 26);

  const navItems = ["Accueil"];
  const active = s.features.filter((f) => f.p > 0.4).map((f) => f.id);
  if (active.includes("carte")) navItems.push("La carte");
  if (active.includes("galerie")) navItems.push("Galerie");
  if (active.includes("blog")) navItems.push("Journal");
  navItems.push("Contact");
  if (active.includes("multilingue")) navItems.push("EN");

  setFont(ctx, sans, 16, 500);
  let navX = ART_W - pad;
  for (const item of [...navItems].reverse()) {
    const w = ctx.measureText(item).width;
    navX -= w;
    ctx.fillStyle = rgbCss(ink, item === "Accueil" ? 0.85 : 0.45);
    ctx.fillText(item, navX, headerY);
    navX -= 34 - s.density * 10;
  }
  ctx.fillStyle = rgbCss(ink, 0.08);
  ctx.fillRect(pad, headerY + 26, ART_W - pad * 2, 1);

  /* Héros — la partie qui réagit le plus aux curseurs */
  const heroTop = headerY + lerp(96, 58, s.density);
  const heroW = ART_W * lerp(0.52, 0.46, s.modern) - pad;
  const size = lerp(52, 88, s.bold) * lerp(0.94, 1.06, s.modern);

  ctx.save();
  if (s.swap > 0.001) {
    // Balayage au changement de style : la colonne se redessine de gauche à droite.
    const p = easeOut(1 - s.swap);
    ctx.beginPath();
    ctx.rect(pad - 12, heroTop - size, (heroW + 24) * p, 520);
    ctx.clip();
    ctx.globalAlpha = 0.35 + p * 0.65;
  }

  setFont(ctx, display, size, s.weight, s.italic);
  ctx.fillStyle = rgbCss(ink);
  const head = s.uppercase ? s.headline.toUpperCase() : s.headline;
  const lines = wrap(ctx, head, heroW, 2);
  const lh = size * lerp(1.16, 0.98, s.bold);
  lines.forEach((line, i) => {
    trackedText(ctx, line, pad, heroTop + i * lh, s.tracking, size);
  });

  const afterHead = heroTop + (lines.length - 1) * lh + size * 0.5;

  // Deux lignes de texte fictif : des filets, jamais du faux latin.
  const barW = [heroW * 0.86, heroW * 0.62];
  barW.forEach((w, i) => {
    fillRR(ctx, pad, afterHead + 28 + i * 22, w * (0.4 + s.build * 0.6), 9, 4.5, rgbCss(ink, 0.13));
  });

  // Bouton principal
  const btnLabel = ctaLabel(s.features);
  setFont(ctx, sans, 17, 600);
  const btnW = ctx.measureText(btnLabel).width + 56;
  const btnH = lerp(52, 60, s.bold);
  const btnY = afterHead + 86;
  fillRR(ctx, pad, btnY, btnW, btnH, R(btnH / 2), rgbCss(accent));
  ctx.fillStyle = rgbCss(onAccent);
  ctx.fillText(btnLabel, pad + 28, btnY + btnH / 2 + 6);

  if (s.bold > 0.45) {
    // Au-delà d'un certain aplomb, un second bouton, en contour.
    const ghost = "Voir nos réalisations";
    setFont(ctx, sans, 17, 500);
    const gw = ctx.measureText(ghost).width + 48;
    rr(ctx, pad + btnW + 16, btnY, gw, btnH, R(btnH / 2));
    ctx.strokeStyle = rgbCss(ink, 0.22);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = rgbCss(ink, 0.7);
    ctx.fillText(ghost, pad + btnW + 40, btnY + btnH / 2 + 6);
  }
  ctx.restore();

  /* Tuiles de fonctionnalités — l'animation d'assemblage.
     La grille se pose au-dessus du pied de page ; la composition de secteur,
     dessinée juste après, s'arrête là où la grille commence. */
  const visible = s.features.filter((f) => f.p > 0.001).slice(0, 6);
  const cols = Math.min(3, Math.max(1, visible.length || 1));
  const gap = lerp(26, 16, s.density);
  const tileW = (ART_W - pad * 2 - gap * (cols - 1)) / cols;
  const tileH = lerp(78, 88, s.modern);
  const rows = Math.min(2, Math.ceil(visible.length / cols));
  const gridY = ART_H - 76 - rows * tileH - Math.max(0, rows - 1) * gap;

  /* Composition de secteur, à droite du héros */
  const artX = pad + heroW + lerp(48, 28, s.density);
  const artY = heroTop - size * 0.82;
  const artCeiling = visible.length ? gridY - 62 : ART_H - 76;
  const artH = Math.max(150, Math.min(lerp(300, 344, s.modern), artCeiling - artY - 18));
  paintSectorArt(ctx, s, artX, artY, ART_W - artX - pad, artH);

  if (visible.length) {

    ctx.fillStyle = rgbCss(ink, 0.08);
    ctx.fillRect(pad, gridY - 34, ART_W - pad * 2, 1);
    setFont(ctx, mono, 13, 400);
    ctx.fillStyle = rgbCss(ink, 0.4);
    trackedText(ctx, "CE QUE LE SITE SAIT FAIRE", pad, gridY - 52, 0.12, 13);

    visible.forEach((f, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const p = easeOut(f.p);
      const x = pad + col * (tileW + gap);
      const y = gridY + row * (tileH + gap) + (1 - p) * 26;

      ctx.save();
      ctx.globalAlpha = p;
      const scale = 0.94 + p * 0.06;
      ctx.translate(x + tileW / 2, y + tileH / 2);
      ctx.scale(scale, scale);
      ctx.translate(-tileW / 2, -tileH / 2);

      const featured = i === 0 && s.bold > 0.55;
      fillRR(ctx, 0, 0, tileW, tileH, R(18), featured ? rgbCss(accent, 0.95) : rgbCss(soft, 0.9));
      if (!featured) {
        rr(ctx, 0.75, 0.75, tileW - 1.5, tileH - 1.5, R(18));
        ctx.strokeStyle = rgbCss(ink, 0.08);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const fg = featured ? onAccent : ink;
      if (p > 0.35) {
        ctx.globalAlpha = p * (featured ? 1 : 0.8);
        paintGlyph(ctx, f.id, 26, tileH / 2 - 16, 32, rgbCss(fg, featured ? 0.95 : 0.55), s.radius);
      }
      ctx.globalAlpha = p;
      setFont(ctx, sans, 17, 600);
      ctx.fillStyle = rgbCss(fg, featured ? 1 : 0.9);
      ctx.fillText(FEATURE_TAG[f.id], 82, tileH / 2 + 6);
      ctx.restore();
    });
  }

  /* Pied : un filet et la signature, en mono */
  ctx.fillStyle = rgbCss(ink, 0.08);
  ctx.fillRect(pad, ART_H - 46, ART_W - pad * 2, 1);
  setFont(ctx, mono, 12, 400);
  ctx.fillStyle = rgbCss(ink, 0.32);
  trackedText(ctx, `© ${new Date().getFullYear()} — ${s.domain}`, pad, ART_H - 24, 0.06, 12);
}
