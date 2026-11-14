"use client";
import { activities } from "@/content/site";
import ArchStage from "@/components/three/ArchStage";
import SegmentGlyph from "@/components/ui/SegmentGlyph";
import TransitionLink from "@/components/ui/TransitionLink";
import { RevealLines } from "@/components/ui/Reveal";
import { useEffect } from "react";

/** Hero d'une activité : son segment de l'arche, en grand. */
export default function ActivityHero({ index }: { index: number }) {
  const a = activities[index];
  const N = activities.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  // pas de loader ici : le titre se révèle directement
  useEffect(() => {
    (window as unknown as { __mjHeroGo?: boolean }).__mjHeroGo = true;
    window.dispatchEvent(new Event("mj:hero-reveal"));
  }, []);

  return (
    <section data-theme="light" className="relative min-h-[100svh] overflow-hidden bg-creme" aria-labelledby="activite-titre">
      <div className="absolute inset-x-0 bottom-0 top-[30%] md:left-[40%] md:top-0">
        <ArchStage
          scene="segment"
          count={N}
          index={index}
          fallback={<SegmentGlyph index={index} count={N} className="absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2" />}
        />
      </div>
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between pb-10 pt-28 gutter md:pt-32">
        <nav aria-label="Fil d'Ariane" className="mono flex flex-wrap items-center gap-2 text-noir/70">
          <TransitionLink href="/" className="hover:text-bordeaux">MJ LAB</TransitionLink>
          <span aria-hidden="true">/</span>
          <TransitionLink href="/#activites" className="hover:text-bordeaux">ACTIVITÉS</TransitionLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-noir">{a.code}</span>
        </nav>
        <div className="max-w-[52rem]">
          <p className="mono mb-5 text-noir/70">
            {pad(index + 1)} / {pad(N)} · SEGMENT {pad(index + 1)} DE L&apos;ARCHE
          </p>
          <RevealLines
            as="h1"
            id="activite-titre"
            trigger="manual"
            lines={[<span key="n">{a.name}<span className="text-bordeaux">.</span></span>]}
            className="display-tight text-[clamp(3.4rem,11vw,11rem)]"
          />
          <p className="mt-6 max-w-[30rem] text-[1.1rem] leading-relaxed text-noir/80">{a.pitch}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {a.tags.map((t) => (
              <li key={t} className="mono rounded-full border border-noir/20 px-3 py-1.5 text-noir/80">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
