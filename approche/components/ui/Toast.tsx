"use client";
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";

interface ToastItem {
  id: number;
  text: string;
  sub?: string;
  kind: "info" | "error" | "celebrate";
}
interface ToastStore {
  items: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  drop: (id: number) => void;
}
const useToasts = create<ToastStore>((set) => ({
  items: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items.slice(-2), { ...t, id }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((i) => i.id !== id) })), t.kind === "celebrate" ? 4200 : 2800);
  },
  drop: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

export const toast = (text: string, sub?: string) => useToasts.getState().push({ text, sub, kind: "info" });
export const toastError = (text: string, sub?: string) => useToasts.getState().push({ text, sub, kind: "error" });
/** Célébration discrète (RDV décroché, signature…) : une onde bleue + un message. */
export const celebrate = (text: string, sub?: string) => {
  useToasts.getState().push({ text, sub, kind: "celebrate" });
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([12, 40, 18]);
};

export function Toaster() {
  const items = useToasts((s) => s.items);
  const drop = useToasts((s) => s.drop);
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-2 px-4"
      style={{ top: "max(16px, env(safe-area-inset-top))" }}
      aria-live="polite"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            onClick={() => drop(t.id)}
            className="sheet pointer-events-auto relative flex max-w-md items-center gap-3 overflow-hidden rounded-full py-2.5 pl-3 pr-5 text-left shadow-[var(--shadow-lift)]"
          >
            {t.kind === "celebrate" && (
              <motion.span
                className="absolute left-5 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/25"
                initial={{ scale: 0.5, opacity: 0.9 }}
                animate={{ scale: 22, opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span
              className={`relative grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white ${
                t.kind === "error" ? "bg-signal" : "bg-blue"
              }`}
            >
              {t.kind === "error" ? "!" : t.kind === "celebrate" ? "✓" : "i"}
            </span>
            <span className="relative">
              <span className="block text-[15px] font-semibold leading-tight">{t.text}</span>
              {t.sub && <span className="block text-[13px] text-ink-2">{t.sub}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
