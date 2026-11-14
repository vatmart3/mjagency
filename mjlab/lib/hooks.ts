"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeMQ(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMQ(query),
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
export function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

let webglCache: boolean | null = null;
export function hasWebGL() {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** null tant qu'on ne sait pas (SSR), puis true/false : 3D possible et souhaitée */
export function useCan3D() {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    setOk(!reduced && hasWebGL());
  }, [reduced]);
  return ok;
}

/** Monte un élément seulement quand il approche du viewport */
export function useNearViewport<T extends Element>(ref: React.RefObject<T | null>, margin = "200px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

/** false au rendu serveur et à l'hydratation, true ensuite (évite les écarts SSR / localStorage) */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
