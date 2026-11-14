"use client";
import { useEffect, useRef } from "react";
import { activities, finalCta, hero, scarcity, site } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { archState } from "@/lib/archState";
import { useForm, useUI, isInProgress } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { RevealLines, useIsoLayoutEffect } from "@/components/ui/Reveal";
import ArchStage from "@/components/three/ArchStage";
import ArchFallback from "@/components/three/ArchFallback";
import SectionMarker from "@/components/ui/SectionMarker";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowUpRight } from "@/components/ui/Icons";

/** Clôture : l'arche se referme en anneau, le point se place au centre. */
export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  const openContact = useUI((s) => s.openContact);
  const setContactInView = useUI((s) => s.setContactInView);
  const form = useForm();

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      archState.ring.progress = 1;
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "center 55%",
        scrub: true,
        onUpdate: (s) => (archState.ring.progress = s.progress),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setContactInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      setContactInView(false);
    };
  }, [setContactInView]);

  const hydrated = useHydrated();
  const resume = hydrated && isInProgress(form);

  return (
    <section
      ref={root}
      id="contact"
      data-theme="bordeaux"
      aria-labelledby="contact-titre"
      className="on-dark relative min-h-[100svh] overflow-hidden bg-bordeaux pb-16 pt-28 text-blanc md:pb-20 md:pt-32"
    >
      <div className="absolute inset-x-0 top-0 h-[62svh] md:inset-0 md:left-[38%] md:h-auto" aria-hidden="true">
        <ArchStage
          scene="ring"
          count={activities.length}
          fallback={<ArchFallback variant="ring" className="absolute left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2 opacity-70" />}
        />
      </div>

      <div className="relative z-10 flex min-h-[calc(100svh-12rem)] flex-col justify-between gutter">
        <SectionMarker index="08" label="CONTACT" right="FIN DE L'EXPÉRIENCE — L'ANNEAU SE FERME" dark />

        <div className="mt-[38vh] max-w-[46rem] md:mt-0">
          <RevealLines
            as="h2"
            id="contact-titre"
            lines={[finalCta.title[0], <span key="l">{finalCta.title[1]}<span className="text-creme">.</span></span>]}
            className="display-tight text-[clamp(3rem,8vw,8.6rem)] text-blanc"
          />
          <p className="mt-6 max-w-[30rem] text-[1.05rem] leading-relaxed text-creme/90">{finalCta.text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton variant="creme" onClick={() => openContact()} cursor="↗" className="!px-7 !py-4 text-[1rem]">
              {resume ? "Reprendre votre projet" : hero.ctaPrimary}
              <ArrowUpRight size={16} />
            </MagneticButton>
            <span className="inline-flex items-center gap-2 rounded-full border border-creme/30 px-4 py-2.5 text-[0.9rem] text-creme">
              <span className="h-1.5 w-1.5 rounded-full bg-creme" aria-hidden="true" />
              {hero.offer}
            </span>
          </div>
          <p className="mono mt-5 text-creme/80">
            {hero.reassurance}
            {scarcity.enabled && <span className="ml-3 text-creme">· {scarcity.label.toUpperCase()}</span>}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="mono text-creme/65">OU DIRECTEMENT</span>
            <a href={`mailto:${site.contact.email}`} className="text-[1.05rem] text-blanc underline decoration-creme/40 underline-offset-4 hover:decoration-creme">
              {site.contact.email}
            </a>
            <a href={site.contact.phoneHref} className="text-[1.05rem] text-blanc underline decoration-creme/40 underline-offset-4 hover:decoration-creme">
              {site.contact.phone}
            </a>
          </div>
          <span className="mono text-creme/65">{site.location.coords} — {site.location.region.toUpperCase()}</span>
        </div>
      </div>
    </section>
  );
}
