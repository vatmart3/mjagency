"use client";
import Image from "next/image";
import { useRef } from "react";
import { projects, activities } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { RevealLines, Reveal } from "@/components/ui/Reveal";
import SectionMarker from "@/components/ui/SectionMarker";
import ProjectArt from "@/components/ui/ProjectArt";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@/components/ui/Icons";

/* Emplacements de la grille éditoriale (12 colonnes), en boucle :
   tailles et décalages volontairement irréguliers. */
const SLOTS = [
  "md:col-start-1 md:col-span-7",
  "md:col-start-9 md:col-span-4 md:mt-40",
  "md:col-start-2 md:col-span-4 md:-mt-6",
  "md:col-start-7 md:col-span-3 md:mt-28",
  "md:col-start-4 md:col-span-6 md:mt-10",
  "md:col-start-10 md:col-span-3 md:mt-48",
];
const ASPECT: Record<string, string> = {
  xl: "aspect-[4/3]",
  lg: "aspect-[16/10]",
  md: "aspect-[5/4]",
  sm: "aspect-square",
  tall: "aspect-[3/4]",
};

export default function Projects() {
  return (
    <section
      id="projets"
      data-theme="light"
      aria-labelledby="projets-titre"
      className="relative overflow-hidden bg-creme pb-28 pt-28 md:pb-40 md:pt-36"
    >
      <div className="editorial-grid" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <SectionMarker index="07" label="CARNET DE LABO" right={`${String(projects.length).padStart(2, "0")} ENTRÉES`} className="relative gutter" />
      <div className="relative mt-14 grid grid-cols-12 gap-6 gutter md:mt-20">
        <RevealLines
          as="h2"
          id="projets-titre"
          lines={["Carnet", <span key="l">de labo<span className="text-bordeaux">.</span></span>]}
          className="display-tight col-span-12 text-[clamp(3rem,9vw,9.5rem)] md:col-span-7"
        />
        <p className="col-span-12 max-w-[24rem] self-end text-[1rem] leading-relaxed text-noir/80 md:col-span-4 md:col-start-9">
          Chaque projet est une expérience documentée. Les entrées marquées « à venir » seront remplacées par nos prochaines preuves.
        </p>
      </div>
      <ul className="relative mt-16 grid grid-cols-1 gap-x-6 gap-y-12 gutter md:mt-24 md:grid-cols-12 md:gap-y-16">
        {projects.map((p, i) => (
          <li key={i} className={SLOTS[i % SLOTS.length]}>
            <ProjectCard p={p} i={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const activity = activities.find((a) => a.slug === p.activity);
  const fid = `disp-${i}`;

  const animate = (on: boolean) => {
    if (!disp.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(disp.current, { attr: { scale: on ? 26 : 0 }, duration: on ? 0.9 : 0.6, ease: "power3.out" });
    if (turb.current) gsap.to(turb.current, { attr: { baseFrequency: on ? "0.008 0.018" : "0.004 0.01" }, duration: 1.2, ease: "power2.out" });
  };

  const body = (
    <>
      <div
        className={`relative overflow-hidden rounded-[18px] bg-beige ${ASPECT[p.size] ?? "aspect-[4/3]"}`}
        onMouseEnter={() => animate(true)}
        onMouseLeave={() => animate(false)}
      >
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <filter id={fid} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.004 0.01" numOctaves="2" seed={i + 3} />
            <feDisplacementMap ref={disp} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="absolute inset-[-4%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]" style={{ filter: `url(#${fid})` }}>
          {p.image ? (
            <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <ProjectArt seed={i} title={p.title} category={p.category} />
          )}
        </div>
        {p.placeholder && (
          <span className="mono absolute right-3 top-3 rounded-full bg-creme/90 px-2 py-1 text-[10px] text-noir">À VENIR</span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="mono text-noir/65">
            {p.year} — {p.category} — {p.place}
          </p>
          <h3 className="mt-1.5 font-display text-[clamp(1.35rem,2vw,1.9rem)] font-bold leading-tight tracking-[-0.035em]">
            {p.title}
            <span className="text-bordeaux">.</span>
          </h3>
        </div>
        {activity && <span className="mono mt-0.5 shrink-0 text-noir/55">{activity.code}</span>}
      </div>
    </>
  );

  return (
    <Reveal y={40}>
      {p.url ? (
        <a href={p.url} target="_blank" rel="noopener" data-cursor="VOIR" className="group block" aria-label={`${p.title} — voir le projet (nouvel onglet)`}>
          {body}
        </a>
      ) : activity ? (
        <TransitionLink href={`/activites/${activity.slug}`} data-cursor="VOIR" className="group block">
          {body}
        </TransitionLink>
      ) : (
        <div className="group">{body}</div>
      )}
      {p.url && (
        <span className="mono mt-2 inline-flex items-center gap-1 text-bordeaux">
          EN LIGNE <ArrowUpRight size={12} />
        </span>
      )}
    </Reveal>
  );
}
