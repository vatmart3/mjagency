"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { useUI } from "@/lib/store";

/** Lenis, synchronisé avec le ticker GSAP et ScrollTrigger. */
export default function SmoothScroll() {
  const pathname = usePathname();
  const locked = useUI((s) => s.contactOpen || s.menuOpen);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Panneau ou menu ouvert : on fige le défilement de la page.
  useEffect(() => {
    import("@/lib/lenis").then(({ getLenis }) => {
      const l = getLenis();
      if (locked) l?.stop();
      else l?.start();
    });
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [locked]);

  // Changement de page : on remonte en haut et on recalcule les déclencheurs.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
