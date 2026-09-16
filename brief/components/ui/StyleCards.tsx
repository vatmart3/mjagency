"use client";

import { cx } from "@/lib/cx";
import { STYLES, type StyleId } from "@/lib/options";
import { FieldError, MonoLabel } from "./Label";

/**
 * Six ambiances, chacune démontrée par une petite composition typographique
 * vivante — pas une image, pas une capture : le style se montre en s'écrivant.
 */

type Composition = {
  frame: string;
  render: React.ReactNode;
};

const COMPOSITIONS: Record<StyleId, Composition> = {
  epure: {
    frame: "bg-white",
    render: (
      <div className="flex h-full flex-col justify-between p-4">
        <span className="font-ui text-[2.6rem] font-light leading-none tracking-[-0.04em] text-[#1D1D1F]">
          Aa
        </span>
        <div className="space-y-1.5">
          <div className="h-px w-2/3 bg-[#1D1D1F]/15" />
          <div className="h-px w-1/3 bg-[#1D1D1F]/15" />
        </div>
      </div>
    ),
  },
  chaleureux: {
    frame: "bg-[#FBF7F1]",
    render: (
      <div className="relative h-full p-4">
        <div className="absolute right-3 top-3 h-11 w-11 rounded-full bg-[#C0693C]/85" />
        <span className="font-display text-[2.5rem] leading-none text-[#2A211B]">Aa</span>
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-[#2A211B]/12" />
          <div className="h-1.5 w-1/2 rounded-full bg-[#2A211B]/12" />
        </div>
      </div>
    ),
  },
  luxe: {
    frame: "bg-white",
    render: (
      <div className="flex h-full flex-col justify-between p-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1D1D1F]/45">
          Maison
        </span>
        <span className="font-display text-[2.9rem] italic leading-none tracking-[-0.02em] text-[#1D1D1F]">
          Aa
        </span>
        <div className="h-px w-full bg-[#1D1D1F]/25" />
      </div>
    ),
  },
  audacieux: {
    frame: "bg-[#1D1D1F]",
    render: (
      <div className="flex h-full flex-col justify-between p-4">
        <span className="font-ui text-[3.1rem] font-extrabold uppercase leading-[0.82] tracking-[-0.06em] text-white">
          Aa
        </span>
        <div className="flex gap-1.5">
          <div className="h-3 w-3/5 bg-[#0071E3]" />
          <div className="h-3 flex-1 bg-white/25" />
        </div>
      </div>
    ),
  },
  naturel: {
    frame: "bg-[#F4F3EC]",
    render: (
      <div className="relative h-full overflow-hidden p-4">
        <div className="absolute -bottom-7 -right-5 h-20 w-20 rounded-full bg-[#6B7A4B]/70" />
        <span className="font-display text-[2.5rem] leading-none text-[#23281F]">Aa</span>
        <div className="absolute bottom-5 left-4 h-1.5 w-1/2 rounded-full bg-[#23281F]/15" />
      </div>
    ),
  },
  tech: {
    frame: "bg-[#F5F5F7]",
    render: (
      <div className="relative h-full p-4">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(29,29,31,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(29,29,31,0.07)_1px,transparent_1px)] [background-size:18px_18px]" />
        <span className="relative font-mono text-[2.2rem] leading-none tracking-[-0.04em] text-[#1D1D1F]">
          Aa
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <div className="h-2 w-2 bg-[#0071E3]" />
          <div className="h-px flex-1 bg-[#1D1D1F]/20" />
          <span className="font-mono text-[9px] text-[#1D1D1F]/45">01</span>
        </div>
      </div>
    ),
  },
};

export default function StyleCards({
  value,
  onChange,
  error,
  label,
}: {
  value?: StyleId;
  onChange: (v: StyleId) => void;
  error?: string;
  label: string;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {STYLES.map((s) => {
          const active = value === s.id;
          const comp = COMPOSITIONS[s.id];
          return (
            <label
              key={s.id}
              data-cursor="pointer"
              className={cx(
                "group cursor-pointer select-none",
                "has-[:focus-visible]:[&_.card]:shadow-[0_0_0_2px_var(--color-accent)]",
              )}
            >
              <input
                type="radio"
                name="style"
                checked={active}
                onChange={() => onChange(s.id)}
                className="sr-only"
              />
              <span
                className={cx(
                  "card block aspect-[4/3] overflow-hidden border transition-[border-color,transform] duration-500 [transition-timing-function:var(--ease-editorial)]",
                  comp.frame,
                  active
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--hair)] group-hover:-translate-y-0.5 group-hover:border-[var(--hair-strong)]",
                )}
              >
                {comp.render}
              </span>
              <span className="mt-2.5 flex items-baseline gap-2">
                <span
                  className={cx(
                    "font-ui text-[0.9rem] tracking-[-0.01em]",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                  )}
                >
                  {s.label}
                </span>
              </span>
              <span className="mt-0.5 block font-ui text-[0.78rem] leading-snug text-[var(--muted)]">
                {s.note}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}
