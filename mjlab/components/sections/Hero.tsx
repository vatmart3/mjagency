"use client";
import { useEffect, useRef, useState } from "react";
import { activities, hero, site, scarcity } from "@/content/site";
import { useUI } from "@/lib/store";
import { heroClip } from "@/lib/heroClip";
import { annulusPolygon, heroLayout, INNER_RATIO } from "@/lib/heroLayout";
import { scrollToTarget } from "@/lib/lenis";
import { gsap } from "@/lib/gsap";
import ArchStage from "@/components/three/ArchStage";
import ArchFallback from "@/components/three/ArchFallback";
import MagneticButton from "@/components/ui/MagneticButton";
import { RevealLines } from "@/components/ui/Reveal";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";

type Layout = ReturnType<typeof heroLayout> & { w: number; h: number };

function TitleLines() {
  return hero.titleLines.map((l, i) =>
    i === hero.titleLines.length - 1 ? (
      <span key={i}>
        {l}
        <span className="text-bordeaux">.</span>
      </span>
    ) : (
      l
    )
  );
}

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const below = useRef<HTMLDivElement>(null);
  const [lay, setLay] = useState<Layout | null>(null);
  const openContact = useUI((s) => s.openContact);

  // cadrage partagé avec la scène 3D
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setLay({ ...heroLayout(w, h), w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // découpe du titre pour le repli SVG (la scène 3D la remplace ensuite à chaque image)
  useEffect(() => {
    heroClip.el = copy.current;
    if (!lay || !copy.current || !section.current) return;
    const s = section.current.getBoundingClientRect();
    const c = copy.current.getBoundingClientRect();
    const ro = lay.archW / 2;
    copy.current.style.clipPath = annulusPolygon(
      lay.w / 2,
      lay.baseY - ro,
      ro * 0.995,
      ro * INNER_RATIO * 1.005,
      c.left - s.left,
      c.top - s.top
    );
    return () => {
      heroClip.el = null;
    };
  }, [lay]);

  // le bas du hero apparaît après le titre
  useEffect(() => {
    const el = below.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = el.querySelectorAll("[data-hero-item]");
    gsap.set(items, { autoAlpha: 0, y: 18 });
    const go = () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, delay: 0.45, ease: "expo.out" });
    if ((window as unknown as { __mjHeroGo?: boolean }).__mjHeroGo) go();
    else window.addEventListener("mj:hero-reveal", go, { once: true });
    return () => window.removeEventListener("mj:hero-reveal", go);
  }, []);

  const titleBottom = lay ? lay.h - (lay.baseY - lay.tube * 0.3) : undefined;
  const fallbackStyle: React.CSSProperties | undefined = lay
    ? {
        position: "absolute",
        width: lay.archW * 1.04,
        height: lay.archW * 0.56,
        left: (lay.w - lay.archW * 1.04) / 2,
        top: lay.baseY - lay.archW / 2 - lay.archW * 0.01,
      }
    : { position: "absolute", width: "110%", left: "-5%", bottom: "26%" };

  return (
    <section
      ref={section}
      id="top"
      data-theme="light"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-creme"
    >
      <ArchStage
        scene="hero"
        count={activities.length}
        fallback={<ArchFallback style={fallbackStyle} />}
      />

      {/* repère de labo, dans le creux de l'arche */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center gutter"
        style={{ top: lay ? Math.max(lay.h * 0.17, 96) : "18%" }}
      >
        <span className="mono flex items-center gap-2 text-noir/70">
          <span className="h-1.5 w-1.5 rounded-full bg-bordeaux" aria-hidden="true" />
          EXP-00 · LA VISION — {site.location.cities.join(" · ").toUpperCase()}
        </span>
      </div>

      {/* titre : la partie posée sur l'arche passe en crème (copie découpée) */}
      <div
        className="absolute inset-x-0 z-10 gutter"
        style={{ bottom: titleBottom ?? "34%" }}
      >
        <div className="grid">
          <RevealLines
            as="h1"
            id="hero-title"
            trigger="manual"
            delay={0.05}
            lines={TitleLines()}
            className="display-tight col-start-1 row-start-1 text-center text-[clamp(3.1rem,9.4vw,10.5rem)] text-noir"
          />
          <div ref={copy} aria-hidden="true" className="col-start-1 row-start-1">
            <RevealLines
              trigger="manual"
              delay={0.05}
              lines={hero.titleLines.map((l, i) =>
                i === hero.titleLines.length - 1 ? (
                  <span key={i}>
                    {l}
                    <span className="text-creme">.</span>
                  </span>
                ) : (
                  l
                )
              )}
              className="display-tight text-center text-[clamp(3.1rem,9.4vw,10.5rem)] text-creme"
            />
          </div>
        </div>
      </div>

      {/* sous le pied de l'arche */}
      <div
        ref={below}
        className="absolute inset-x-0 z-10 flex flex-col gap-6 gutter md:flex-row md:items-end md:justify-between"
        style={{ top: lay ? lay.baseY + Math.min(36, lay.h * 0.035) : "76%" }}
      >
        <p data-hero-item className="max-w-[30rem] text-[0.98rem] leading-relaxed text-noir/80 md:text-[1.05rem]">
          {hero.subtitle}
        </p>
        <div data-hero-item className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton
              variant="beige"
              href="#activites"
              onClick={() => scrollToTarget("#activites")}
              cursor="↓"
            >
              {hero.ctaSecondary}
              <ArrowDown />
            </MagneticButton>
            <MagneticButton variant="bordeaux" onClick={() => openContact()} cursor="↗">
              {hero.ctaPrimary}
              <ArrowUpRight size={16} />
            </MagneticButton>
          </div>
          <p className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-noir/70">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-bordeaux" aria-hidden="true" />
              {hero.offer}
            </span>
            <span>{hero.reassurance}</span>
            {scarcity.enabled && <span className="text-bordeaux">{scarcity.label}</span>}
          </p>
        </div>
      </div>

      {/* pied de page du hero */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gutter pb-4 md:pb-5">
        <span className="mono text-noir/70">
          {site.signature.toUpperCase()} — SCROLL <span aria-hidden="true">↓</span>
        </span>
        <span className="mono hidden text-noir/70 sm:inline">
          {site.location.coords} — {site.location.label.toUpperCase()}
        </span>
      </div>
    </section>
  );
}
