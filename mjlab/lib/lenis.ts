"use client";
import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (instance = l);
export const getLenis = () => instance;

/** Défilement doux vers une ancre (#id) ou un élément */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return false;
  if (instance) instance.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
