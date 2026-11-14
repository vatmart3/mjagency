"use client";
import { useRef } from "react";
import { stats } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/components/ui/Reveal";
import SectionMarker from "@/components/ui/SectionMarker";

/** Bandeau bordeaux : compteurs qui s'incrémentent à l'entrée dans le viewport.
    Les valeurs viennent de content/site.ts — aucune n'est inventée. */
export default function Numbers() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const target = Number(n.dataset.count);
        const o = { v: 0 };
        n.textContent = "0";
        ScrollTrigger.create({
          trigger: n,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(o, { v: target, duration: 1.6, ease: "power3.out", onUpdate: () => (n.textContent = String(Math.round(o.v))) }),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="chiffres"
      data-theme="bordeaux"
      aria-labelledby="chiffres-titre"
      className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-bordeaux py-24 text-blanc md:py-28"
    >
      <SectionMarker index="05" label="LES CHIFFRES" right="DONNÉES DU LAB" dark className="relative gutter" />
      <div className="relative mt-12 grid grid-cols-12 gap-6 gutter">
        <h2 id="chiffres-titre" className="display-tight col-span-12 text-[clamp(2.8rem,7vw,7.5rem)] text-blanc md:col-span-8">
          La preuve
          <br />
          par les chiffres<span className="text-creme">.</span>
        </h2>
        <p className="col-span-12 max-w-[22rem] self-end text-[1rem] leading-relaxed text-creme/85 md:col-span-4 md:justify-self-end">
          Des données vérifiables, mises à jour au fil des projets. Rien d&apos;arrondi, rien d&apos;inventé.
        </p>
      </div>
      <dl className="relative mt-12 grid grid-cols-1 border-t border-creme/20 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`relative flex flex-col justify-between gap-10 border-b border-creme/20 px-[var(--gutter)] py-10 lg:border-b-0 ${
              i > 0 ? "lg:border-l" : ""
            } ${i % 2 === 1 ? "sm:border-l" : ""}`}
          >
            <dt className="mono order-2 flex items-center gap-2 text-creme/80">
              {s.label}
              {s.todo && (
                <span className="rounded-full border border-creme/40 px-1.5 py-0.5 text-[9px] text-creme/80" title="Valeur à compléter dans content/site.ts">
                  À COMPLÉTER
                </span>
              )}
            </dt>
            <dd className="order-1 font-display text-[clamp(5rem,11vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.06em]">
              <span data-count={s.value}>{s.value}</span>
              {s.suffix && <span className="text-creme/70">{s.suffix}</span>}
              <span className="mono absolute right-[var(--gutter)] top-4 font-normal tracking-normal text-creme/40" aria-hidden="true">
                D-{String(i + 1).padStart(2, "0")}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mono relative mt-10 gutter text-creme/70">FIG. 05 — CHAQUE PROJET EST UNE PREUVE</p>
    </section>
  );
}
