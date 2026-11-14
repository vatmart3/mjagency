"use client";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { RevealLines } from "@/components/ui/Reveal";
import SectionMarker from "@/components/ui/SectionMarker";
import Signature from "@/components/ui/Signature";

/** Le duo : écran partagé, le côté survolé s'élargit (60/40), l'autre passe en gris. */
export default function Duo() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section
      id="duo"
      data-theme="light"
      aria-labelledby="duo-titre"
      className="relative overflow-hidden bg-beige pb-20 pt-28 md:pb-28 md:pt-32"
    >
      <SectionMarker index="06" label="LE DUO" right="2 FONDATEURS · 1 VISION" className="gutter" />
      <div className="mt-12 grid grid-cols-12 gap-6 gutter md:mt-16">
        <RevealLines
          as="h2"
          id="duo-titre"
          lines={["Deux associés,", <span key="l">un seul lab<span className="text-bordeaux">.</span></span>]}
          className="display-tight col-span-12 text-[clamp(2.7rem,7vw,7.5rem)] md:col-span-9"
        />
        <p className="col-span-12 max-w-[22rem] self-end text-[1rem] leading-relaxed text-noir/80 md:col-span-3">
          {site.founders[0].firstName} et {site.founders[1].firstName} portent chaque activité du lab, ensemble, depuis Sète et Frontignan.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-3 gutter md:mt-16 md:h-[min(82vh,46rem)] md:flex-row" onMouseLeave={() => setHover(null)}>
        {site.founders.map((f, i) => {
          const grow = hover === null ? 1 : hover === i ? 1.5 : 1;
          const muted = hover !== null && hover !== i;
          return (
            <figure
              key={f.firstName}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              tabIndex={0}
              data-cursor={f.firstName.toUpperCase()}
              className="group relative min-h-[30rem] overflow-hidden rounded-[22px] bg-creme outline-none transition-[flex-grow] duration-700 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-bordeaux md:min-h-0"
              style={{ flexGrow: grow, flexBasis: 0 }}
            >
              <Image
                src={f.portrait}
                alt={`Portrait de ${f.firstName} ${f.lastName}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-[50%_30%] transition-[filter,transform] duration-700 ease-[var(--ease-out)]"
                style={{ filter: muted ? "grayscale(1) contrast(1.05)" : "none", transform: hover === i ? "scale(1.03)" : "scale(1)" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noir/80 to-transparent" aria-hidden="true" />
              <span className="mono absolute left-5 top-5 rounded-full bg-creme/90 px-2.5 py-1 text-noir">
                F-0{i + 1} · {f.role.toUpperCase()}
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-creme md:p-7">
                <p className="mono text-creme/80">{f.focus.toUpperCase()}</p>
                <p className="mt-2 font-display text-[clamp(2.2rem,4.4vw,4.4rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-blanc">
                  {f.firstName}
                  <span className="text-bordeaux-light">.</span>
                </p>
                <p className="mt-1 text-[0.95rem] text-creme/85">{f.lastName}</p>
                <blockquote className="mt-4 max-w-[26rem] text-[0.98rem] leading-relaxed text-creme/90">« {f.quote} »</blockquote>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-start gap-4 gutter md:mt-20 md:flex-row md:items-end md:justify-between">
        <Signature className="h-auto w-[min(34rem,88vw)]" />
        <span className="mono text-noir/65">SIGNÉ — SÈTE / FRONTIGNAN, 2026</span>
      </div>
    </section>
  );
}
