"use client";
import { useEffect, useLayoutEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type LinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** "scroll" : se déclenche à l'entrée dans le viewport. "manual" : attend l'évènement mj:hero-reveal */
  trigger?: "scroll" | "manual";
  id?: string;
};

/** Titre révélé ligne par ligne : masque + translateY, stagger. */
export function RevealLines({
  lines,
  as: Tag = "div",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  trigger = "scroll",
  id,
}: LinesProps) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const inners = el.querySelectorAll<HTMLElement>(".line-inner");
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 115, rotate: 2.5 });
      const play = () =>
        gsap.to(inners, { yPercent: 0, rotate: 0, duration: 1.15, ease: "expo.out", stagger, delay });
      if (trigger === "manual") {
        const onGo = () => play();
        if ((window as unknown as { __mjHeroGo?: boolean }).__mjHeroGo) play();
        else window.addEventListener("mj:hero-reveal", onGo, { once: true });
      } else {
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
      }
    }, el);
    return () => ctx.revert();
  }, [trigger, delay, stagger]);

  return (
    <Tag ref={root} className={className} id={id}>
      {lines.map((l, i) => (
        <span key={i} className={`line-mask ${lineClassName}`}>
          <span className="line-inner">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Fondu + montée simple pour un bloc, au scroll. */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const root = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", delay }),
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}

/** Découpe maison d'un texte en mots (pas de plugin payant). */
export function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}
