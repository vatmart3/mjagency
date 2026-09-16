"use client";

import { useId } from "react";

/**
 * Curseur custom : un rail d'un pixel, une portion remplie en accent, un
 * repère carré. Le `<input type=range>` reste dessous, donc les flèches du
 * clavier fonctionnent et les lecteurs d'écran annoncent la valeur.
 */
export default function Slider({
  left,
  right,
  value,
  onChange,
  label,
}: {
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const id = useId();
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className={pct < 45 ? "text-[var(--color-ink)]" : "text-[var(--muted)]"}>{left}</span>
        <span className={pct > 55 ? "text-[var(--color-ink)]" : "text-[var(--muted)]"}>{right}</span>
      </div>

      <div className="relative h-8" data-cursor="grab">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--hair-strong)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-accent)] transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
        {/* Graduations : cinq repères, comme sur un plan. */}
        {[0, 25, 50, 75, 100].map((t) => (
          <div
            key={t}
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-2 w-px -translate-y-1/2 bg-[var(--hair-strong)]"
            style={{ left: `calc(${t}% - 0.5px)` }}
          />
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--color-ink)] bg-[var(--color-paper)] transition-[left] duration-150"
          style={{ left: `${pct}%` }}
        />
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pct}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={`${pct} sur 100, entre ${left} et ${right}`}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
      </div>
    </div>
  );
}
