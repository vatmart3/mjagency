"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { enregistrer, lister, supprimer, type FicheHistorique, type Statut } from "@/lib/db.ts";
import { formatPrix } from "@/lib/format.ts";
import { IconeCintre, IconeCorbeille } from "./icones";
import { useToast } from "./ui";

const STATUTS: { valeur: Statut; libelle: string; style: string }[] = [
  { valeur: "brouillon", libelle: "À publier", style: "bg-creux text-encre-2" },
  { valeur: "publiee", libelle: "En ligne", style: "bg-accent/15 text-accent-fonce" },
  { valeur: "vendue", libelle: "Vendue", style: "bg-ok/15 text-ok" },
];

const dateCourte = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export function Historique({ version, onOuvrir }: { version: number; onOuvrir: (f: FicheHistorique) => void }) {
  const [fiches, setFiches] = useState<FicheHistorique[] | null>(null);
  const [filtre, setFiltre] = useState<Statut | "tout">("tout");
  const toast = useToast();

  useEffect(() => {
    lister()
      .then(setFiches)
      .catch(() => setFiches([]));
  }, [version]);

  // Une object URL par miniature, libérées quand la liste change.
  const miniatures = useMemo(() => new Map((fiches ?? []).map((f) => [f.id, URL.createObjectURL(f.miniature)])), [fiches]);
  useEffect(() => () => miniatures.forEach((u) => URL.revokeObjectURL(u)), [miniatures]);

  const visibles = (fiches ?? []).filter((f) => filtre === "tout" || f.statut === filtre);
  const totalVendu = (fiches ?? []).filter((f) => f.statut === "vendue").reduce((s, f) => s + f.annonce.prix.conseille, 0);

  async function changerStatut(f: FicheHistorique) {
    const i = STATUTS.findIndex((s) => s.valeur === f.statut);
    const suivant = STATUTS[(i + 1) % STATUTS.length].valeur;
    const maj = { ...f, statut: suivant, modifieLe: Date.now() };
    setFiches((l) => l?.map((x) => (x.id === f.id ? maj : x)) ?? null);
    await enregistrer(maj);
  }

  async function effacer(f: FicheHistorique) {
    setFiches((l) => l?.filter((x) => x.id !== f.id) ?? null);
    await supprimer(f.id);
    toast("Annonce supprimée");
  }

  if (fiches === null) return <div className="h-40" />;

  if (fiches.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 pt-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-creux text-encre-2">
          <IconeCintre taille={30} />
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Rien pour l'instant</h2>
        <p className="mt-1 max-w-[28ch] text-encre-2">Tes annonces s'enregistrent ici, sur ce téléphone, dès qu'elles sont créées.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="font-display text-[32px] leading-none font-semibold tracking-[-0.03em]">Historique</h1>
        {totalVendu > 0 && (
          <p className="text-right text-sm text-encre-2">
            Vendu
            <span className="block font-display text-xl font-semibold text-ok">{formatPrix(totalVendu)}</span>
          </p>
        )}
      </div>

      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        {[{ valeur: "tout" as const, libelle: `Tout · ${fiches.length}` }, ...STATUTS].map((s) => (
          <button
            key={s.valeur}
            type="button"
            onClick={() => setFiltre(s.valeur)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              filtre === s.valeur ? "bg-encre text-papier" : "bg-creux text-encre-2"
            }`}
          >
            {s.libelle}
          </button>
        ))}
      </div>

      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {visibles.map((f) => {
            const statut = STATUTS.find((s) => s.valeur === f.statut)!;
            return (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                className="overflow-hidden rounded-carte bg-carte shadow-carte ring-1 ring-ligne"
              >
                <div className="flex items-center gap-3 p-2.5">
                  <button type="button" onClick={() => onOuvrir(f)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={miniatures.get(f.id)} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{f.annonce.nom}</span>
                      <span className="block truncate text-sm text-encre-2">{f.annonce.titre}</span>
                      <span className="mt-0.5 block text-[13px] text-encre-3">
                        {dateCourte.format(f.modifieLe)} · <span className="font-semibold text-encre">{formatPrix(f.annonce.prix.conseille)}</span>
                      </span>
                    </span>
                  </button>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => changerStatut(f)}
                      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${statut.style}`}
                      aria-label={`Statut : ${statut.libelle}. Toucher pour changer.`}
                    >
                      {statut.libelle}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Supprimer « ${f.annonce.nom} » ?`)) effacer(f);
                      }}
                      aria-label={`Supprimer ${f.annonce.nom}`}
                      className="flex size-8 items-center justify-center rounded-full text-encre-3 transition hover:bg-creux hover:text-alerte"
                    >
                      <IconeCorbeille taille={17} />
                    </button>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {visibles.length === 0 && <p className="py-10 text-center text-encre-2">Aucune annonce dans cette catégorie.</p>}
    </div>
  );
}
