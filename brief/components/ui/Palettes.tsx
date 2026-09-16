"use client";

import { cx } from "@/lib/cx";
import { PALETTES } from "@/lib/options";
import { FieldError, MonoLabel } from "./Label";

export default function Palettes({
  value,
  onChange,
  error,
  label,
}: {
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  label: string;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PALETTES.map((p) => {
          const active = value === p.id;
          return (
            <label
              key={p.id}
              data-cursor="pointer"
              className="group cursor-pointer select-none has-[:focus-visible]:[&_.swatch]:shadow-[0_0_0_2px_var(--color-accent)]"
            >
              <input
                type="radio"
                name="palette"
                checked={active}
                onChange={() => onChange(p.id)}
                className="sr-only"
              />
              <span
                className={cx(
                  "swatch flex h-14 overflow-hidden border transition-[border-color,transform] duration-500 [transition-timing-function:var(--ease-editorial)]",
                  active
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--hair)] group-hover:-translate-y-0.5",
                )}
              >
                {p.colors.map((c) => (
                  <span key={c} className="h-full flex-1" style={{ background: c }} />
                ))}
              </span>
              <span
                className={cx(
                  "mt-2 block font-ui text-[0.82rem]",
                  active ? "text-[var(--color-accent)]" : "text-[var(--muted)]",
                )}
              >
                {p.label}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/* ── Couleurs sur mesure : de une à trois ─────────────────────────────── */

export function CustomColors({
  active,
  colors,
  onActivate,
  onChange,
  error,
}: {
  active: boolean;
  colors: string[];
  onActivate: () => void;
  onChange: (next: string[]) => void;
  error?: string;
}) {
  const set = (i: number, v: string) => {
    const next = [...colors];
    next[i] = v.toUpperCase();
    onChange(next);
  };

  return (
    <div className="border-t border-[var(--hair)] pt-6">
      <button
        type="button"
        data-cursor="pointer"
        onClick={onActivate}
        aria-pressed={active}
        className={cx(
          "font-ui text-[0.95rem] tracking-[-0.01em] transition-colors duration-300",
          active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)] hover:text-[var(--color-accent)]",
        )}
      >
        Choisir mes couleurs
        <span aria-hidden className="ml-2 text-[var(--muted)]">
          {active ? "—" : "+"}
        </span>
      </button>

      {active && (
        <div className="mt-5 flex flex-wrap items-end gap-5">
          {[0, 1, 2].map((i) => {
            const val = colors[i];
            return (
              <div key={i} className="flex items-center gap-3">
                <label
                  data-cursor="pointer"
                  className="relative block h-12 w-12 cursor-pointer overflow-hidden rounded-full border border-[var(--hair-strong)]"
                  style={{ background: val ?? "transparent" }}
                >
                  {!val && (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center text-[var(--muted)]"
                    >
                      +
                    </span>
                  )}
                  <input
                    type="color"
                    value={val ?? "#0071E3"}
                    onChange={(e) => set(i, e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={`Couleur ${i + 1}`}
                  />
                </label>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
                  {val ?? "—"}
                </span>
                {val && (
                  <button
                    type="button"
                    data-cursor="pointer"
                    onClick={() => onChange(colors.filter((_, j) => j !== i))}
                    className="font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[#b3261e]"
                    aria-label={`Retirer la couleur ${i + 1}`}
                  >
                    retirer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <FieldError message={error} />
    </div>
  );
}
