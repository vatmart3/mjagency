"use client";

import { useId } from "react";
import { cx } from "@/lib/cx";
import type { Option } from "@/lib/options";
import { FieldError, MonoLabel } from "./Label";

/* ── Chips : un choix unique, en ligne ────────────────────────────────── */

export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  name,
  error,
  columns,
}: {
  label: string;
  options: readonly Option<T>[];
  value?: T;
  onChange: (v: T) => void;
  name: string;
  error?: string;
  columns?: boolean;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className={cx("flex flex-wrap gap-2.5", columns && "flex-col items-start")}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <label
              key={o.id}
              data-cursor="pointer"
              className={cx(
                "group relative cursor-pointer select-none rounded-full border px-5 py-2.5 transition-[border-color,color,background-color] duration-300 [transition-timing-function:var(--ease-editorial)]",
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--hair-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                "has-[:focus-visible]:shadow-[0_0_0_1.5px_#fff,0_0_0_3.5px_var(--color-accent)]",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={active}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span className="font-ui text-[0.95rem] tracking-[-0.01em]">{o.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/* ── Multi-sélection : mêmes chips, sans exclusivité ──────────────────── */

export function ChipMulti<T extends string>({
  label,
  options,
  values,
  onToggle,
  error,
}: {
  label: string;
  options: readonly Option<T>[];
  values: T[];
  onToggle: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = values.includes(o.id);
          return (
            <label
              key={o.id}
              data-cursor="pointer"
              className={cx(
                "cursor-pointer select-none rounded-full border px-5 py-2.5 transition-[border-color,color,background-color] duration-300 [transition-timing-function:var(--ease-editorial)]",
                active
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                  : "border-[var(--hair-strong)] hover:border-[var(--color-ink)]",
                "has-[:focus-visible]:shadow-[0_0_0_1.5px_#fff,0_0_0_3.5px_var(--color-accent)]",
              )}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(o.id)}
                className="sr-only"
              />
              <span className="font-ui text-[0.95rem] tracking-[-0.01em]">{o.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/* ── Choix unique en lignes : un libellé, une note, un filet ──────────── */

export function ListChoice<T extends string>({
  label,
  options,
  value,
  onChange,
  name,
  error,
}: {
  label: string;
  options: readonly Option<T>[];
  value?: T;
  onChange: (v: T) => void;
  name: string;
  error?: string;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className="border-t border-[var(--hair)]">
        {options.map((o, i) => {
          const active = value === o.id;
          return (
            <label
              key={o.id}
              data-cursor="pointer"
              className={cx(
                "group flex cursor-pointer items-baseline gap-4 border-b border-[var(--hair)] py-3.5 transition-colors duration-300",
                "has-[:focus-visible]:shadow-[inset_2px_0_0_var(--color-accent)]",
                active ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={active}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cx(
                  "font-mono text-[11px] tabular-nums transition-colors duration-300",
                  active ? "text-[var(--color-accent)]" : "text-[var(--muted)]",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span
                  className={cx(
                    "font-display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-tight tracking-[-0.01em]",
                    active && "italic",
                  )}
                >
                  {o.label}
                </span>
                {o.note && (
                  <span className="ml-3 font-ui text-[0.85rem] text-[var(--muted)]">{o.note}</span>
                )}
              </span>
              <span
                aria-hidden
                className={cx(
                  "h-px w-8 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-editorial)]",
                  active
                    ? "w-14 bg-[var(--color-accent)]"
                    : "bg-[var(--hair-strong)] group-hover:w-12",
                )}
              />
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/* ── Tuiles typographiques : la multi-sélection des fonctionnalités ───── */

export function TileMulti<T extends string>({
  options,
  values,
  onToggle,
  error,
  label,
}: {
  options: readonly Option<T>[];
  values: T[];
  onToggle: (v: T) => void;
  error?: string;
  label: string;
}) {
  return (
    <fieldset className="w-full">
      <MonoLabel as="legend" className="mb-4 block">
        {label}
      </MonoLabel>
      <div className="grid grid-cols-2 gap-px bg-[var(--hair)] sm:grid-cols-3">
        {options.map((o) => {
          const active = values.includes(o.id);
          return (
            <label
              key={o.id}
              data-cursor="pointer"
              style={{
                background: active ? "var(--color-ink)" : "var(--color-paper)",
                color: active ? "#fff" : undefined,
              }}
              className={cx(
                "group relative flex min-h-[72px] cursor-pointer items-end p-3.5 transition-colors duration-300 [transition-timing-function:var(--ease-editorial)]",
                !active && "hover:bg-[var(--color-mist)]",
                "has-[:focus-visible]:z-10 has-[:focus-visible]:shadow-[inset_0_0_0_2px_var(--color-accent)]",
              )}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(o.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cx(
                  "absolute right-3 top-3 h-1.5 w-1.5 rounded-full transition-all duration-300",
                  active ? "scale-100 bg-[var(--color-accent)]" : "scale-0 bg-transparent",
                )}
              />
              <span className="font-ui text-[0.95rem] leading-tight tracking-[-0.015em]">
                {o.label}
              </span>
            </label>
          );
        })}
        {/* Cases de remplissage : la dernière rangée reste pleine en trois colonnes. */}
        {Array.from({ length: (3 - (options.length % 3)) % 3 }).map((_, i) => (
          <span key={`fill-${i}`} aria-hidden className="hidden bg-[var(--color-paper)] sm:block" />
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/* ── Sélecteur segmenté : Oui / Non / En cours ────────────────────────── */

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: readonly Option<T>[];
  value?: T;
  onChange: (v: T) => void;
  error?: string;
}) {
  const name = useId();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hair)] py-4">
      <span className="font-display text-[clamp(1.15rem,2.2vw,1.5rem)] tracking-[-0.01em]">
        {label}
      </span>
      <div className="flex overflow-hidden rounded-full border border-[var(--hair-strong)]">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <label
              key={o.id}
              data-cursor="pointer"
              className={cx(
                "cursor-pointer select-none px-4 py-2 font-ui text-[0.85rem] transition-colors duration-300",
                active ? "bg-[var(--color-ink)] text-white" : "hover:bg-[var(--color-mist)]",
                "has-[:focus-visible]:shadow-[inset_0_0_0_2px_var(--color-accent)]",
              )}
            >
              <input
                type="radio"
                name={name}
                checked={active}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="w-full font-mono text-[11px] text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}
