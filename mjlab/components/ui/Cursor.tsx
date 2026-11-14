"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** Le point du logo devient curseur. Labels via data-cursor="VOIR" | "GLISSER" | "↗". */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"light" | "dark" | "bordeaux">("light");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    const el = dot.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let lastTarget: Element | null = null;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      setHidden(false);
      const t = e.target as Element | null;
      if (t === lastTarget) return;
      lastTarget = t;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const clickable = t?.closest("a, button, [role='button'], input, textarea, label, select");
      setLabel(labelled?.dataset.cursor ?? (clickable ? "•" : ""));
      const theme = t?.closest<HTMLElement>("[data-theme]")?.dataset.theme;
      setMode(theme === "dark" ? "dark" : theme === "bordeaux" ? "bordeaux" : "light");
    };
    const onLeave = () => setHidden(true);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  const big = label !== "" && label !== "•";
  const hover = label === "•";
  const size = big ? 84 : hover ? 34 : 10;
  const color =
    mode === "light" ? "var(--bordeaux)" : mode === "dark" ? "var(--creme)" : "var(--creme)";

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ mixBlendMode: mode === "dark" ? "difference" : "normal" }}
    >
      <div
        className="flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          background: hover ? "transparent" : color,
          border: hover ? `1.5px solid ${color}` : "none",
          opacity: hidden ? 0 : 1,
          transition:
            "width .35s var(--ease-out), height .35s var(--ease-out), background-color .25s, opacity .25s",
        }}
      >
        {big && (
          <span
            className="mono text-[10px] tracking-[0.08em]"
            style={{ color: mode === "light" ? "var(--blanc)" : "var(--noir)" }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
