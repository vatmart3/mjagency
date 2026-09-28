"use client";
import { create } from "zustand";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/primitives";

/**
 * Confirmation dans la page, à la place de window.confirm()
 * (bloqué dans certains cadres, et plus lisible sur téléphone).
 */
interface Ask {
  message: string;
  action: string;
  danger: boolean;
  resolve: (ok: boolean) => void;
}
const useAsk = create<{ current: Ask | null; set: (a: Ask | null) => void }>((set) => ({ current: null, set: (current) => set({ current }) }));

export function ask(message: string, opts: { action?: string; danger?: boolean } = {}): Promise<boolean> {
  return new Promise((resolve) => useAsk.getState().set({ message, action: opts.action ?? "Confirmer", danger: opts.danger ?? true, resolve }));
}

export function ConfirmHost() {
  const current = useAsk((s) => s.current);
  const set = useAsk((s) => s.set);
  const close = (ok: boolean) => {
    current?.resolve(ok);
    set(null);
  };
  return (
    <Sheet open={!!current} onClose={() => close(false)} title="Confirmer">
      <p className="text-[17px] leading-relaxed">{current?.message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2 pb-2">
        <Button variant="secondary" onClick={() => close(false)}>
          Annuler
        </Button>
        <Button variant={current?.danger ? "danger" : "primary"} onClick={() => close(true)}>
          {current?.action}
        </Button>
      </div>
    </Sheet>
  );
}
