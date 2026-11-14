"use client";
import { useRef } from "react";
import { manifesto } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, splitWords } from "@/components/ui/Reveal";
import SectionMarker from "@/components/ui/SectionMarker";

/** Section pinnée : les mots passent de beige à noir au rythme du scroll. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  // le point final devient le point bordeaux de la marque
  const words = splitWords(manifesto.text.replace(/\.\s*$/, ""));

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const ws = el.querySelectorAll<HTMLElement>("[data-word]");
    const notes = el.querySelectorAll<HTMLElement>("[data-note]");

    mm.add(
      { desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
      (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: el, start: "top top", end: "+=140%", pin: true, scrub: 0.6 }
            : { trigger: el, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        });
        tl.fromTo(ws, { color: "#D7C5B8" }, { color: "#252326", stagger: 0.12, ease: "none", duration: 0.6 }, 0);
        notes.forEach((n, i) => {
          tl.fromTo(n, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, (i + 0.4) * (ws.length * 0.12) / notes.length);
        });
      }
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="manifeste"
      data-theme="light"
      aria-labelledby="manifeste-titre"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-creme pb-10 pt-28 md:pt-32"
    >
      <div className="editorial-grid" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <SectionMarker index="02" label="MANIFESTE" right="NOTE DE LABO" className="relative gutter" />

      <div className="relative grid grid-cols-12 gap-x-6 gutter">
        <aside className="col-span-12 mb-8 flex gap-6 md:col-span-2 md:mb-0 md:flex-col md:justify-start md:pt-3">
          {manifesto.notes.slice(0, 2).map((n) => (
            <p key={n} data-note className="mono max-w-[11rem] border-l border-bordeaux pl-3 text-noir/75">
              {n}
            </p>
          ))}
        </aside>
        <h2 id="manifeste-titre" className="sr-only">Manifeste</h2>
        <p className="col-span-12 font-display text-[clamp(1.85rem,4.4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-noir md:col-span-9">
          {words.map((w, i) => (
            <span key={i} data-word className="inline">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
          <span className="text-bordeaux">.</span>
        </p>
        <aside className="col-span-12 mt-8 md:col-span-1 md:mt-0 md:flex md:items-end">
          {manifesto.notes[2] && (
            <p data-note className="mono max-w-[11rem] border-l border-bordeaux pl-3 text-noir/75">
              {manifesto.notes[2]}
            </p>
          )}
        </aside>
      </div>

      <div className="relative flex items-end justify-between gutter">
        <span className="mono text-noir/60">FIG. 02 — UNE VISION COMMUNE</span>
        <span className="mono text-noir/60">SCRUB ↓</span>
      </div>
    </section>
  );
}
