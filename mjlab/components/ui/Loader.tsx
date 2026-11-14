"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useUI } from "@/lib/store";

const KEY = "mjlab-visited";

function heroGo() {
  (window as unknown as { __mjHeroGo?: boolean }).__mjHeroGo = true;
  window.dispatchEvent(new Event("mj:hero-reveal"));
}

/** Première visite uniquement (≈ 1,8 s) : compteur 000 → 100, « MJ » s'écrit,
    le point tombe avec un rebond, grossit jusqu'à remplir l'écran, puis se retire. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const setLoaderDone = useUI((s) => s.setLoaderDone);

  useEffect(() => {
    const el = root.current;
    let visited = false;
    try {
      visited = localStorage.getItem(KEY) === "1";
      localStorage.setItem(KEY, "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      setDone(true);
      setLoaderDone();
    };
    if (!el || visited || reduced || document.documentElement.dataset.visited === "1") {
      finish();
      heroGo();
      return;
    }

    const count = el.querySelector<HTMLElement>("[data-count]")!;
    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    const dot = el.querySelector<HTMLElement>("[data-dot]")!;
    const flood = el.querySelector<HTMLElement>("[data-flood]")!;
    const counter = { v: 0 };

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(counter, {
      v: 100,
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, "0")),
    }, 0)
      .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.05)
      .fromTo(dot, { y: "-60vh", scale: 1 }, { y: 0, duration: 0.65, ease: "bounce.out" }, 0.45)
      .add(() => {
        // le point devient le cercle qui remplit l'écran
        const r = dot.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
        gsap.set(flood, { left: cx, top: cy, width: r.width, height: r.width, autoAlpha: 1 });
        gsap.to(flood, { scale: (R * 2.1) / r.width, duration: 0.45, ease: "power3.in" });
      }, 1.2)
      .set(el.querySelector("[data-stage]"), { autoAlpha: 0 }, 1.66)
      .set(el, { backgroundColor: "transparent" }, 1.66)
      .add(heroGo, 1.66)
      .to(flood, { scale: 0, duration: 0.6, ease: "power3.inOut" }, 1.68)
      .add(finish);

    return () => {
      tl.kill();
    };
  }, [setLoaderDone]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="mj-loader fixed inset-0 z-[110] bg-creme"
      role="status"
      aria-live="polite"
      aria-label="Chargement de MJ LAB"
    >
      <div data-stage className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative inline-flex items-end font-display text-[clamp(6rem,22vw,17rem)] font-bold leading-[0.82] tracking-[-0.06em] text-noir">
            <span className="inline-block overflow-hidden pb-[0.04em]"><span data-letter className="inline-block">M</span></span>
            <span className="inline-block overflow-hidden pb-[0.04em]"><span data-letter className="inline-block">J</span></span>
            <span data-dot className="mb-[0.07em] ml-[0.04em] inline-block h-[0.17em] w-[0.17em] rounded-full bg-bordeaux" />
          </span>
        </div>
        <div className="absolute bottom-5 left-5 flex items-baseline gap-3 md:bottom-8 md:left-8">
          <span data-count className="font-mono text-[clamp(2rem,5vw,3.5rem)] leading-none text-noir">000</span>
          <span className="mono text-noir/60">CHARGEMENT DU LAB</span>
        </div>
        <span className="mono absolute bottom-5 right-5 text-noir/60 md:bottom-8 md:right-8">43.40°N / 3.69°E</span>
      </div>
      <div data-flood className="invisible absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-bordeaux" />
    </div>
  );
}
