"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useRef, useState, type ButtonHTMLAttributes } from "react";
import { copier } from "@/lib/clipboard.ts";
import { IconeCoche, IconeCopier } from "./icones";

// ---------------------------------------------------------------------------
// Bouton
// ---------------------------------------------------------------------------

type Variante = "plein" | "accent" | "contour" | "fantome";

const VARIANTES: Record<Variante, string> = {
  plein: "bg-encre text-papier",
  accent: "bg-accent text-sur-accent shadow-[0_8px_24px_-10px_var(--accent)]",
  contour: "bg-carte text-encre ring-1 ring-ligne-forte",
  fantome: "text-encre-2 hover:text-encre hover:bg-creux",
};

export function Bouton({
  variante = "plein",
  taille = "md",
  className = "",
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; taille?: "sm" | "md" | "lg" }) {
  const tailles = { sm: "h-9 px-3.5 text-sm gap-1.5", md: "h-11 px-5 text-[15px] gap-2", lg: "h-14 px-6 text-base gap-2.5" };
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-[transform,background-color,color,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${tailles[taille]} ${VARIANTES[variante]} ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Bouton « Copier » : l'icône bascule en coche, puis revient.
// ---------------------------------------------------------------------------

export function BoutonCopier({
  texte,
  libelle = "Copier",
  quoi,
  feminin = false,
  variante = "contour",
  taille = "sm",
  className = "",
}: {
  texte: string;
  libelle?: string;
  quoi: string; // pour le toast et les lecteurs d'écran : « Titre copié »
  feminin?: boolean; // « Description copiée »
  variante?: Variante;
  taille?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [copie, setCopie] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();

  async function surClic() {
    const ok = await copier(texte);
    if (!ok) {
      toast("La copie a échoué : sélectionne le texte à la main.", "erreur");
      return;
    }
    setCopie(true);
    toast(`${quoi} copié${feminin ? "e" : ""}`);
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => setCopie(false), 1600);
  }

  return (
    <Bouton
      type="button"
      variante={copie ? "plein" : variante}
      taille={taille}
      onClick={surClic}
      aria-label={`${libelle} — ${quoi}`}
      className={className}
    >
      <span className="relative inline-flex size-4 items-center justify-center">
        <AnimatePresence initial={false} mode="popLayout">
          {copie ? (
            <motion.span key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <IconeCoche taille={16} strokeWidth={2.4} />
            </motion.span>
          ) : (
            <motion.span key="copier" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <IconeCopier taille={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {copie ? "Copié" : libelle}
    </Bouton>
  );
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

type Toast = { id: number; texte: string; ton: "info" | "erreur" };
const ContexteToast = createContext<(texte: string, ton?: Toast["ton"]) => void>(() => {});

export function useToast() {
  return useContext(ContexteToast);
}

export function FournisseurToasts({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const id = useRef(0);

  const pousser = useCallback((texte: string, ton: Toast["ton"] = "info") => {
    const t = { id: ++id.current, texte, ton };
    setToasts((l) => [...l.slice(-2), t]);
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== t.id)), ton === "erreur" ? 4200 : 1800);
  }, []);

  return (
    <ContexteToast.Provider value={pousser}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ y: -16, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 34 }}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-carte ${
                t.ton === "erreur" ? "bg-alerte-fond text-alerte ring-1 ring-alerte/30" : "bg-encre text-papier"
              }`}
            >
              {t.texte}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ContexteToast.Provider>
  );
}

// ---------------------------------------------------------------------------
// Petits éléments de formulaire
// ---------------------------------------------------------------------------

export const classeChamp =
  "w-full rounded-xl bg-carte px-3.5 py-3 text-encre placeholder:text-encre-3 ring-1 ring-ligne-forte outline-none transition focus:ring-2 focus:ring-accent";

export function Etiquette({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-encre-2">
      {children}
    </label>
  );
}

export function Interrupteur({
  actif,
  onChange,
  libelle,
  aide,
}: {
  actif: boolean;
  onChange: (v: boolean) => void;
  libelle: string;
  aide?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      onClick={() => onChange(!actif)}
      className="flex w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span>
        <span className="block font-semibold">{libelle}</span>
        {aide && <span className="block text-sm text-encre-2">{aide}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${actif ? "bg-accent" : "bg-creux ring-1 ring-ligne-forte"}`}>
        <motion.span
          className="absolute top-1 left-1 size-5 rounded-full bg-carte shadow"
          animate={{ x: actif ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
        />
      </span>
    </button>
  );
}

export function Segments<T extends string>({
  valeur,
  options,
  onChange,
  nom,
}: {
  valeur: T;
  options: { valeur: T; libelle: string }[];
  onChange: (v: T) => void;
  nom: string;
}) {
  return (
    <div role="radiogroup" aria-label={nom} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-creux p-1">
      {options.map((o) => {
        const actif = o.valeur === valeur;
        return (
          <button
            key={o.valeur}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => onChange(o.valeur)}
            className={`relative h-9 rounded-full px-2 text-sm font-semibold transition-colors ${actif ? "text-encre" : "text-encre-2"}`}
          >
            {actif && (
              <motion.span
                layoutId={`seg-${nom}`}
                className="absolute inset-0 rounded-full bg-carte shadow-carte"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{o.libelle}</span>
          </button>
        );
      })}
    </div>
  );
}
