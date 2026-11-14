"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "./Reveal";
import { SIGNATURE_PATH, SIGNATURE_VIEWBOX } from "./signaturePath";

/** La signature se dessine au scroll (stroke-dashoffset), puis se remplit. */
export default function Signature({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  useIsoLayoutEffect(() => {
    const svg = root.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stroke = svg.querySelector<SVGPathElement>("[data-stroke]")!;
    const fill = svg.querySelector<SVGPathElement>("[data-fill]")!;
    const len = stroke.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(fill, { opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 92%", end: "bottom 55%", scrub: 0.8 } })
        .to(stroke, { strokeDashoffset: 0, ease: "none", duration: 1 })
        .to(fill, { opacity: 1, duration: 0.25, ease: "none" }, 0.8);
    }, svg);
    return () => ctx.revert();
  }, []);
  return (
    <svg ref={root} viewBox={SIGNATURE_VIEWBOX} className={className} role="img" aria-label="Signature : Jérémy & Matheis">
      <path data-fill d={SIGNATURE_PATH} fill="var(--noir)" />
      <path data-stroke d={SIGNATURE_PATH} fill="none" stroke="var(--noir)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
