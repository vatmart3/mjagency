"use client";

import { useEffect } from "react";

/** Position normalisée du pointeur, −1 → 1, partagée par toute la page. */
export const pointer = { x: 0, y: 0 };

let listeners = 0;

/**
 * La maquette suit la souris même quand elle survole le formulaire, à gauche :
 * on écoute donc la fenêtre entière, une seule fois.
 */
export function usePointerTracking(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    listeners += 1;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      listeners -= 1;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (listeners === 0) {
        pointer.x = 0;
        pointer.y = 0;
      }
    };
  }, [enabled]);
}

/** WebGL est-il réellement disponible ? On ne se fie pas au user-agent. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
