import { mixRgb, traitsOf, type MockupTarget, type Rgb } from "./mockup";
import type { PaintFeature, PaintState } from "./painter";
import type { FeatureId } from "./options";

/** Rapprochement exponentiel, indépendant de la fréquence d'écran. */
function approach(current: number, target: number, dt: number, speed: number): number {
  const t = 1 - Math.exp(-speed * dt);
  const next = current + (target - current) * t;
  return Math.abs(target - next) < 0.0005 ? target : next;
}

function approachRgb(c: Rgb, t: Rgb, dt: number, speed: number): Rgb {
  return [
    approach(c[0], t[0], dt, speed),
    approach(c[1], t[1], dt, speed),
    approach(c[2], t[2], dt, speed),
  ];
}

function cssFont(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/**
 * Tient la maquette entre deux états : on lui donne une cible, elle s'en
 * approche à chaque image. Rien ne change jamais d'un coup — sauf si le
 * visiteur a demandé moins d'animations.
 */
export class MockupAnimator {
  private target: MockupTarget;
  private colors: [Rgb, Rgb, Rgb, Rgb];
  private bold: number;
  private modern: number;
  private radius: number;
  private density: number;
  private weight: number;
  private tracking: number;
  private build: number;
  private swap = 0;
  private style: MockupTarget["style"];
  private order: FeatureId[] = [];
  private progress = new Map<FeatureId, number>();
  private time = 0;
  private fonts: PaintState["fonts"];
  /** Rotation supplémentaire demandée par l'écran final, en tours. */
  reduced: boolean;

  constructor(target: MockupTarget, reduced = false) {
    this.target = target;
    this.reduced = reduced;
    const tr = traitsOf(target.style);
    this.colors = [...target.colors] as [Rgb, Rgb, Rgb, Rgb];
    this.bold = target.bold;
    this.modern = target.modern;
    this.radius = tr.radius;
    this.density = tr.density;
    this.weight = tr.weight;
    this.tracking = tr.tracking;
    this.build = target.build;
    this.style = target.style;
    this.order = [...target.features];
    for (const f of target.features) this.progress.set(f, 1);
    this.fonts = {
      serif: cssFont("--font-instrument", "Georgia, serif"),
      sans: cssFont("--font-geist", "system-ui, sans-serif"),
      mono: cssFont("--font-geist-mono", "ui-monospace, monospace"),
    };
  }

  setTarget(next: MockupTarget) {
    if (next.style !== this.target.style) this.swap = 1;
    for (const f of next.features) {
      if (!this.order.includes(f)) this.order.push(f);
      if (!this.progress.has(f)) this.progress.set(f, 0);
    }
    this.target = next;
  }

  /** Avance d'une image et renvoie l'état à peindre. */
  step(dt: number): PaintState {
    const d = Math.min(dt, 0.1);
    this.time += d;
    const t = this.target;
    const tr = traitsOf(t.style);
    const snap = this.reduced;
    const s = (speed: number) => (snap ? 1000 : speed);

    this.bold = approach(this.bold, t.bold, d, s(6));
    this.modern = approach(this.modern, t.modern, d, s(6));
    this.radius = approach(this.radius, tr.radius, d, s(5));
    this.density = approach(this.density, tr.density, d, s(5));
    this.weight = approach(this.weight, tr.weight, d, s(7));
    this.tracking = approach(this.tracking, tr.tracking, d, s(7));
    this.build = approach(this.build, t.build, d, s(3));
    this.swap = approach(this.swap, 0, d, s(2.4));
    this.style = t.style;

    for (let i = 0; i < 4; i++) {
      this.colors[i] = approachRgb(this.colors[i], t.colors[i], d, s(4.5));
    }

    const features: PaintFeature[] = [];
    for (const id of this.order) {
      const wanted = t.features.includes(id) ? 1 : 0;
      const p = approach(this.progress.get(id) ?? 0, wanted, d, s(wanted ? 5.5 : 9));
      this.progress.set(id, p);
      if (p > 0.001) features.push({ id, p });
    }
    // On oublie les fonctionnalités décochées une fois l'animation terminée.
    this.order = this.order.filter((id) => (this.progress.get(id) ?? 0) > 0.001 || t.features.includes(id));

    return {
      headline: t.headline,
      logo: t.logo,
      domain: t.domain,
      sector: t.sector,
      style: this.style,
      bold: this.bold,
      modern: this.modern,
      colors: this.colors,
      radius: this.radius,
      density: this.density,
      weight: this.weight,
      tracking: this.tracking,
      italic: tr.italic,
      uppercase: tr.uppercase,
      features,
      build: this.build,
      swap: this.swap,
      time: this.time,
      fonts: this.fonts,
    };
  }

  /** Couleur moyenne du fond — sert à teinter l'ombre portée sous la maquette. */
  get backdrop(): Rgb {
    return mixRgb(this.colors[0], this.colors[3], 0.5);
  }
}
