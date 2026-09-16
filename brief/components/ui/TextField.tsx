"use client";

import { forwardRef, useId } from "react";
import { cx } from "@/lib/cx";
import { FieldError, MonoLabel } from "./Label";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  /** Champ de titre : très grand corps, typographie display. */
  display?: boolean;
};

/**
 * Un champ texte sans boîte : un filet dessous qui s'épaissit et vire à
 * l'accent quand on écrit dedans.
 */
const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, hint, error, display, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <div className="w-full">
      <label htmlFor={id} className="block">
        <MonoLabel className="mb-3 block">{label}</MonoLabel>
      </label>
      <div className="group relative">
        <input
          id={id}
          ref={ref}
          data-cursor="text"
          aria-invalid={error ? true : undefined}
          className={cx(
            "peer w-full appearance-none border-0 bg-transparent pb-3 outline-none placeholder:font-normal",
            display
              ? "font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-[1.06] tracking-[-0.02em]"
              : "font-ui text-[clamp(1.05rem,2vw,1.35rem)] tracking-[-0.01em]",
            className,
          )}
          {...props}
        />
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px",
            error ? "bg-[#b3261e]/60" : "bg-[var(--hair-strong)]",
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 [transition-timing-function:var(--ease-editorial)] peer-focus:scale-x-100"
        />
      </div>
      {hint && !error && (
        <p className="mt-2 font-mono text-[11px] tracking-[0.04em] text-[var(--muted)]">{hint}</p>
      )}
      <FieldError message={error} />
    </div>
  );
});

export default TextField;
