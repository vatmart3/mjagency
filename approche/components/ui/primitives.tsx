"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

export function Chip({
  active,
  onClick,
  children,
  className = "",
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium transition-colors ${
        active ? "bg-ink text-white" : "bg-mist text-ink hover:bg-fog"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={`inline-flex rounded-full bg-mist p-1 ${className}`} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`relative rounded-full font-medium transition-colors ${
            size === "sm" ? "h-8 px-3 text-[13px]" : "h-9 px-4 text-[14px]"
          } ${value === o.value ? "text-ink" : "text-ink-2"}`}
        >
          {value === o.value && (
            <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-soft)]" />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Feuille qui monte du bas (mobile) / fenêtre centrée (desktop). */
export function Sheet({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
          <motion.div
            className="absolute inset-0 bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-white shadow-[var(--shadow-lift)] md:rounded-[28px] ${
              wide ? "md:max-w-3xl" : "md:max-w-lg"
            }`}
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 pb-3 pt-4 backdrop-blur">
              <div className="mx-auto h-1 w-10 rounded-full bg-fog md:hidden absolute left-1/2 top-2 -translate-x-1/2" />
              <h2 className="text-[19px] font-semibold tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full bg-mist text-ink-2 hover:bg-fog"
                aria-label="Fermer"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="px-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
  group,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  /** Pour une rangée de boutons / puces : pas de <label> (qui déclencherait le premier bouton au clic). */
  group?: boolean;
}) {
  const inner = (
    <>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-ink-3">{hint}</span>}
    </>
  );
  if (group)
    return (
      <div role="group" aria-label={label} className={`block ${className}`}>
        {inner}
      </div>
    );
  return <label className={`block ${className}`}>{inner}</label>;
}

/** Note de 1 à 5 en points. */
export function Dots({
  value,
  onChange,
  max = 5,
  label,
}: {
  value: number | null;
  onChange?: (v: number) => void;
  max?: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-1.5" role={onChange ? "radiogroup" : undefined} aria-label={label}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <motion.button
          key={n}
          type="button"
          disabled={!onChange}
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange?.(n)}
          aria-label={`${n} sur ${max}`}
          aria-checked={value === n}
          role={onChange ? "radio" : undefined}
          className={`grid size-10 place-items-center rounded-full text-[15px] font-semibold transition-colors ${
            value !== null && n <= value ? "bg-blue text-white" : "bg-mist text-ink-3"
          } ${onChange ? "" : "size-3 text-[0px]"}`}
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line px-6 py-10 text-center">
      <p className="text-[17px] font-semibold">{title}</p>
      {children && <div className="mt-2 text-[15px] text-ink-2">{children}</div>}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lede,
  actions,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="pb-8 pt-10 md:pb-12 md:pt-16">
      <p className="kicker">{kicker}</p>
      <h1 className="display mt-3 text-[44px] md:text-[76px]">{title}</h1>
      {lede && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2 md:text-[19px]">{lede}</p>}
      {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ kicker, title, children }: { kicker?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="mt-1 text-[24px] font-semibold tracking-tight md:text-[30px]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-soft)] ring-1 ring-line ${className}`}>{children}</div>;
}

export function Tag({ children, tone = "mist", className = "" }: { children: ReactNode; tone?: "mist" | "blue" | "ink" | "signal" | "ok"; className?: string }) {
  const tones = {
    mist: "bg-mist text-ink-2",
    blue: "bg-blue-soft text-blue",
    ink: "bg-ink text-white",
    signal: "bg-signal/10 text-signal",
    ok: "bg-ok/10 text-ok",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${tones[tone]} ${className}`}>{children}</span>;
}
