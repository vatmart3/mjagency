/* Cadrage commun du hero : la scène 3D, le repli SVG et le titre HTML
   lisent les mêmes valeurs, pour que le titre chevauche toujours la base. */
const R = 2.2;
const r = 0.56;
export const OUTER = R + r;
export const TUBE_RATIO = (2 * r) / (2 * OUTER); // épaisseur du tube / largeur de l'arche
export const INNER_RATIO = (R - r) / OUTER;

export function heroLayout(w: number, h: number) {
  const aspect = w / h;
  let widthFactor = aspect < 1 ? 1.8 : 1.1;
  const maxTube = h * (aspect < 1 ? 0.2 : 0.34);
  if (w * widthFactor * TUBE_RATIO > maxTube) widthFactor = maxTube / (w * TUBE_RATIO);
  const archW = w * widthFactor;
  const tube = archW * TUBE_RATIO;
  const baseAt = aspect < 1 ? 0.6 : 0.74;
  return { widthFactor, baseAt, archW, tube, baseY: h * baseAt };
}

/** Polygone (px, relatif à `origin`) du demi-anneau vu de face — pour le repli SVG */
export function annulusPolygon(cx: number, cy: number, ro: number, ri: number, ox: number, oy: number, steps = 40) {
  const pts: string[] = [];
  for (let s = 0; s <= steps; s++) {
    const a = Math.PI + (Math.PI * s) / steps;
    pts.push(`${(cx + Math.cos(a) * ro - ox).toFixed(1)}px ${(cy - Math.sin(a) * ro - oy).toFixed(1)}px`);
  }
  for (let s = steps; s >= 0; s--) {
    const a = Math.PI + (Math.PI * s) / steps;
    pts.push(`${(cx + Math.cos(a) * ri - ox).toFixed(1)}px ${(cy - Math.sin(a) * ri - oy).toFixed(1)}px`);
  }
  return `polygon(${pts.join(",")})`;
}
