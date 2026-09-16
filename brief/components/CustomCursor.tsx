"use client";

import { useEffect, useRef } from "react";

/**
 * Le curseur : un point plein, doublé d'un anneau qui suit avec un léger
 * retard. Il grossit sur les éléments cliquables, s'étire en barre sur les
 * champs texte. Absent au doigt et au stylet — et sobre si le visiteur a
 * demandé moins d'animations.
 */
export default function CustomCursor({ reduced }: { reduced: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let mode: "default" | "pointer" | "text" | "grab" = "default";
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = (el?.dataset.cursor as typeof mode) ?? "default";
      if (next !== mode) {
        mode = next;
        applyMode();
      }
    };

    const applyMode = () => {
      if (!ring.current || !dot.current || !visible) return;
      const r = ring.current.style;
      const d = dot.current.style;
      if (mode === "pointer") {
        r.width = r.height = "44px";
        r.borderColor = "var(--color-accent)";
        d.opacity = "0";
      } else if (mode === "text") {
        r.width = "2px";
        r.height = "26px";
        r.borderRadius = "1px";
        r.borderColor = "var(--color-accent)";
        d.opacity = "0";
      } else if (mode === "grab") {
        r.width = r.height = "30px";
        r.borderColor = "var(--color-ink)";
        d.opacity = "1";
      } else {
        r.width = r.height = "26px";
        r.borderRadius = "9999px";
        r.borderColor = "rgba(29,29,31,0.35)";
        d.opacity = "1";
      }
      if (mode !== "text") r.borderRadius = "9999px";
    };

    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };

    const loop = () => {
      const k = reduced ? 1 : 0.18;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    applyMode();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 rounded-full border opacity-0 transition-[width,height,border-color,opacity] duration-300 [transition-timing-function:var(--ease-editorial)]"
        style={{ width: 26, height: 26, borderColor: "rgba(29,29,31,0.35)" }}
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-[var(--color-ink)] opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
