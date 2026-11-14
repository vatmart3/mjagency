"use client";
import { useRef } from "react";
import { protocol } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { RevealLines, useIsoLayoutEffect } from "@/components/ui/Reveal";
import SectionMarker from "@/components/ui/SectionMarker";
import PhaseFigure from "@/components/ui/PhaseFigure";

/** Le protocole : une ligne se trace au scroll et allume les 4 phases. */
export default function Protocol() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = el.querySelectorAll<SVGPathElement>("[data-trace]");
      const nodes = el.querySelectorAll<HTMLElement>("[data-node]");
      const phases = el.querySelectorAll<HTMLElement>("[data-phase]");
      lines.forEach((l) => gsap.set(l, { strokeDasharray: 1, strokeDashoffset: 1 }));
      gsap.set(phases, { autoAlpha: 0.25, y: 20 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.querySelector("[data-track]"), start: "top 78%", end: "bottom 45%", scrub: 0.6 },
      });
      tl.to(lines, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      phases.forEach((p, i) => {
        const at = (i / protocol.length) * 0.92;
        tl.to(p, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, at);
        tl.to(nodes[i], { scale: 1, backgroundColor: "#641E32", borderColor: "#641E32", duration: 0.08 }, at);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="methode"
      data-theme="light"
      aria-labelledby="methode-titre"
      className="relative overflow-hidden bg-creme pb-24 pt-28 md:pb-36 md:pt-36"
    >
      <div className="editorial-grid" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <SectionMarker index="04" label="LA MÉTHODE" right="PROTOCOLE MJ-4" className="relative gutter" />

      <div className="relative mt-14 grid grid-cols-12 gap-6 gutter md:mt-20">
        <RevealLines
          as="h2"
          id="methode-titre"
          lines={["Le protocole", <span key="l2">en 4 phases<span className="text-bordeaux">.</span></span>]}
          className="display-tight col-span-12 text-[clamp(2.9rem,8vw,8.5rem)] md:col-span-8"
        />
        <p className="col-span-12 max-w-[24rem] self-end text-[1rem] leading-relaxed text-noir/80 md:col-span-4 md:justify-self-end">
          Chaque activité du lab suit la même méthode, testée projet après projet. Pas de magie : un protocole.
        </p>
      </div>

      <div data-track className="relative mt-16 gutter md:mt-24">
        {/* ligne horizontale (desktop) */}
        <svg className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[7.25rem] hidden h-[2px] w-[calc(100%-2*var(--gutter))] md:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
          <path d="M0 1H100" stroke="var(--beige)" strokeWidth="2" />
          <path data-trace d="M0 1H100" pathLength={1} stroke="var(--noir)" strokeWidth="2" />
        </svg>
        {/* ligne verticale (mobile) */}
        <svg className="absolute bottom-0 left-[calc(var(--gutter)+0.4rem)] top-0 h-full w-[2px] md:hidden" preserveAspectRatio="none" viewBox="0 0 2 100" aria-hidden="true">
          <path d="M1 0V100" stroke="var(--beige)" strokeWidth="2" />
          <path data-trace d="M1 0V100" pathLength={1} stroke="var(--noir)" strokeWidth="2" />
        </svg>

        <ol className="relative grid gap-12 pl-8 md:grid-cols-4 md:gap-8 md:pl-0">
          {protocol.map((p, i) => (
            <li key={p.phase} data-phase className="relative">
              <PhaseFigure kind={p.figure} className="mb-4 h-24 w-32 md:h-[6.25rem]" />
              <span
                data-node
                className="absolute -left-8 top-[0.4rem] block h-3.5 w-3.5 scale-75 rounded-full border-2 border-noir/30 bg-creme md:left-0 md:top-[6.8rem]"
                aria-hidden="true"
              />
              <div className="md:pt-10">
                <span className="mono text-noir/70">{p.phase}</span>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-none tracking-[-0.04em]">
                  {p.title}
                  <span className="text-bordeaux">.</span>
                </h3>
                <p className="mt-3 max-w-[17rem] text-[0.95rem] leading-relaxed text-noir/80">{p.text}</p>
                <span className="mono mt-4 block text-noir/45">ÉTAPE {String(i + 1).padStart(2, "0")} / 04</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
