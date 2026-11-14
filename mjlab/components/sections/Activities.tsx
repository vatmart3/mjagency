"use client";
import { useEffect, useRef, useState } from "react";
import { activities } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { archState } from "@/lib/archState";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { getLenis } from "@/lib/lenis";
import { useIsoLayoutEffect } from "@/components/ui/Reveal";
import ArchStage from "@/components/three/ArchStage";
import SectionMarker from "@/components/ui/SectionMarker";
import TransitionLink from "@/components/ui/TransitionLink";
import Mockup from "@/components/ui/Mockup";
import SegmentGlyph from "@/components/ui/SegmentGlyph";
import { ArrowUpRight } from "@/components/ui/Icons";

const N = activities.length;
const pad = (n: number) => String(n).padStart(2, "0");
/** part du scroll consacrée à la découpe initiale de l'arche */
const SPLIT = 0.08;

export default function Activities() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  return mobile || reduced ? <ActivitiesStack /> : <ActivitiesPinned />;
}

/* ---------------------------------------------------------------------
   Desktop : section pinnée, l'arche se fragmente segment par segment.
   --------------------------------------------------------------------- */
function ActivitiesPinned() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const st = useRef<ScrollTrigger | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      st.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * (N * 0.9 + 0.4)}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          archState.activities.progress = self.progress;
          const f = Math.min(N - 1, Math.max(0, Math.floor(((self.progress - SPLIT) / (1 - SPLIT)) * N)));
          archState.activities.active = f;
          setActive((a) => (a === f ? a : f));
        },
      });
    }, el);
    return () => {
      ctx.revert();
      archState.activities.progress = 0;
    };
  }, []);

  const jump = (i: number) => {
    const t = st.current;
    if (!t) return;
    const p = SPLIT + ((i + 0.5) / N) * (1 - SPLIT);
    const y = t.start + (t.end - t.start) * p;
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      id="activites"
      data-theme="dark"
      aria-labelledby="activites-titre"
      className="on-dark relative h-[100svh] overflow-hidden bg-noir text-creme"
    >
      <ArchStage
        scene="activities"
        count={N}
        background="#252326"
        post
        fallback={<SegmentGlyph index={active} count={N} dark className="absolute right-[8%] top-[18%] w-[38%]" />}
      />
      <div className="editorial-grid" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between pb-8 pt-28 gutter">
        <SectionMarker index="03" label="LES ACTIVITÉS" right={`${activities[active].code} / ${pad(active + 1)} — ${pad(N)}`} dark />
        <h2 id="activites-titre" className="sr-only">Les activités de MJ LAB</h2>

        <div className="relative grid flex-1 grid-cols-12 items-center">
          <div className="relative col-span-7 h-[min(30rem,62vh)] lg:col-span-6">
            {activities.map((a, i) => (
              <article
                key={a.slug}
                data-active={i === active}
                aria-hidden={i !== active}
                className="group/act absolute inset-0 flex flex-col justify-center"
                style={{ pointerEvents: i === active ? "auto" : "none" }}
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="mono text-creme/80 transition-all duration-700 ease-[var(--ease-out)] group-data-[active=false]/act:-translate-y-2 group-data-[active=false]/act:opacity-0">
                    {pad(i + 1)} / {pad(N)}
                  </span>
                  <span className="mono rounded-full border border-creme/25 px-2.5 py-1 text-creme/80 transition-all delay-75 duration-700 group-data-[active=false]/act:opacity-0">
                    {a.code}
                  </span>
                </div>
                <h3 className="line-mask display-tight text-[clamp(3.4rem,7.4vw,8.4rem)] text-blanc">
                  <span className="line-inner transition-transform duration-[900ms] ease-[var(--ease-out)] group-data-[active=false]/act:translate-y-[110%]">
                    {a.name}
                    <span className="text-bordeaux-light">.</span>
                  </span>
                </h3>
                <p className="mt-6 max-w-[28rem] text-[1.05rem] leading-relaxed text-creme/85 transition-all delay-100 duration-700 ease-[var(--ease-out)] group-data-[active=false]/act:translate-y-3 group-data-[active=false]/act:opacity-0">
                  {a.pitch}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 transition-all delay-150 duration-700 group-data-[active=false]/act:opacity-0">
                  {a.tags.map((t) => (
                    <li key={t} className="mono rounded-full bg-creme/10 px-3 py-1.5 text-creme/85">
                      {t}
                    </li>
                  ))}
                </ul>
                <TransitionLink
                  href={`/activites/${a.slug}`}
                  tabIndex={i === active ? 0 : -1}
                  data-cursor="VOIR"
                  className="group/link mt-8 inline-flex w-fit items-center gap-2 border-b border-creme/30 pb-1 text-[0.95rem] font-medium text-creme transition-all delay-200 duration-700 hover:border-bordeaux-light group-data-[active=false]/act:opacity-0"
                >
                  Voir l&apos;activité
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/link:rotate-45" />
                </TransitionLink>
              </article>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="mono text-creme/55">FIG. 03 — UNE ARCHE, {N} SEGMENTS</span>
          {/* visuel de l'activité, à côté du segment présenté */}
          <div className="relative mb-16 mr-10 h-[11.5rem] w-[17rem] lg:h-[13rem] lg:w-[20rem]">
            {activities.map((a, i) => (
              <div
                key={a.slug}
                className="absolute inset-0 transition-all duration-700 ease-[var(--ease-out)]"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateY(${i === active ? 0 : i < active ? -16 : 16}px) rotate(${i === active ? -2 : 0}deg)`,
                }}
              >
                <Mockup kind={a.mockup} label={a.name} className="h-full w-full shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* navigation latérale : un point par activité */}
      <nav aria-label="Activités" className="absolute right-[max(0.75rem,calc(var(--gutter)/2))] top-1/2 z-20 -translate-y-1/2">
        <ul className="flex flex-col gap-3.5">
          {activities.map((a, i) => (
            <li key={a.slug}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-label={`Aller à ${a.name}`}
                aria-current={i === active}
                className="group flex h-5 w-5 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    i === active ? "h-3 w-3 bg-bordeaux-light" : "h-1.5 w-1.5 bg-creme/40 group-hover:bg-creme"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

/* ---------------------------------------------------------------------
   Mobile / moins d'animations : empilement vertical fluide.
   --------------------------------------------------------------------- */
function ActivitiesStack() {
  useEffect(() => {
    archState.activities.progress = 0;
  }, []);
  return (
    <section
      id="activites"
      data-theme="dark"
      aria-labelledby="activites-titre"
      className="on-dark relative overflow-hidden bg-noir pb-16 pt-24 text-creme"
    >
      <SectionMarker index="03" label="LES ACTIVITÉS" right={`${pad(N)} EXPÉRIENCES`} dark className="gutter" />
      <h2 id="activites-titre" className="display-tight mt-10 text-[clamp(2.8rem,12vw,6rem)] text-blanc gutter">
        Une arche,
        <br />
        {N} possibilités<span className="text-bordeaux-light">.</span>
      </h2>
      <ol className="mt-12 space-y-4 gutter">
        {activities.map((a, i) => (
          <li key={a.slug} className="rounded-[22px] border border-creme/10 bg-creme/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="mono text-creme/75">
                {pad(i + 1)} / {pad(N)} · {a.code}
              </span>
              <SegmentGlyph index={i} count={N} dark className="w-16" />
            </div>
            <h3 className="display-tight mt-4 text-[clamp(2.4rem,11vw,4rem)] text-blanc">
              {a.name}
              <span className="text-bordeaux-light">.</span>
            </h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-creme/85">{a.pitch}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <li key={t} className="mono rounded-full bg-creme/10 px-3 py-1.5 text-creme/85">
                  {t}
                </li>
              ))}
            </ul>
            <Mockup kind={a.mockup} label={a.name} className="mt-5 aspect-[16/10] w-full" />
            <TransitionLink
              href={`/activites/${a.slug}`}
              className="mt-5 inline-flex items-center gap-2 border-b border-creme/30 pb-1 text-[0.95rem] font-medium"
            >
              Voir l&apos;activité <ArrowUpRight size={16} />
            </TransitionLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
