"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { enregistrer, lire, type FicheHistorique } from "@/lib/db.ts";
import type { PhotoPreparee } from "@/lib/image.ts";
import type { Annonce, Reglages } from "@/lib/schema.ts";
import { Analyse } from "./Analyse";
import { IconeEtincelle, IconeGauche } from "./icones";
import { depuisInfos, InfosFacultatives, INFOS_VIDES, versInfos, type InfosSaisies } from "./Infos";
import { Photos } from "./Photos";
import { Resultat } from "./Resultat";
import { Bouton, useToast } from "./ui";

const Cintre3D = dynamic(() => import("./Cintre3D"), {
  ssr: false,
  loading: () => <div className="size-full" />,
});

type Phase = "saisie" | "analyse" | "resultat";

export function NouvelleAnnonce({
  reglages,
  aOuvrir,
  onEnregistre,
}: {
  reglages: Reglages;
  aOuvrir: FicheHistorique | null; // une fiche de l'historique à rouvrir
  onEnregistre: () => void;
}) {
  const [photos, setPhotos] = useState<PhotoPreparee[]>([]);
  const [infos, setInfos] = useState<InfosSaisies>(INFOS_VIDES);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [phase, setPhase] = useState<Phase>("saisie");
  const [regeneration, setRegeneration] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const fiche = useRef<{ id: string; creeLe: number; statut: FicheHistorique["statut"] } | null>(null);
  const annulation = useRef<AbortController | null>(null);
  const reduit = useReducedMotion() ?? false;
  const toast = useToast();

  // Rouvrir une annonce de l'historique.
  useEffect(() => {
    if (!aOuvrir) return;
    setPhotos((anciennes) => {
      anciennes.forEach((p) => URL.revokeObjectURL(p.url));
      return aOuvrir.photos.map((blob, i) => ({
        id: crypto.randomUUID(),
        blob,
        miniature: i === 0 ? aOuvrir.miniature : blob,
        url: URL.createObjectURL(blob),
        largeur: 0,
        hauteur: 0,
      }));
    });
    setInfos(depuisInfos(aOuvrir.infos));
    setAnnonce(aOuvrir.annonce);
    fiche.current = { id: aOuvrir.id, creeLe: aOuvrir.creeLe, statut: aOuvrir.statut };
    setErreur(null);
    setPhase("resultat");
    window.scrollTo({ top: 0 });
  }, [aOuvrir]);

  // Chaque retouche de l'annonce est sauvegardée, après une courte pause.
  useEffect(() => {
    if (!annonce || !fiche.current || photos.length === 0) return;
    const t = setTimeout(async () => {
      const f = fiche.current!;
      // Le statut a pu changer depuis l'historique entre-temps : on garde le sien.
      const existant = await lire(f.id).catch(() => undefined);
      enregistrer({
        id: f.id,
        creeLe: f.creeLe,
        modifieLe: Date.now(),
        annonce,
        infos: versInfos(infos),
        photos: photos.map((p) => p.blob),
        miniature: photos[0].miniature,
        statut: existant?.statut ?? f.statut,
      })
        .then(onEnregistre)
        .catch(() => toast("Sauvegarde dans l'historique impossible (stockage plein ?)", "erreur"));
    }, 500);
    return () => clearTimeout(t);
    // infos et photos ne changent pas en phase résultat ; l'annonce, si.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annonce]);

  async function analyser(opts: { consigne?: string; precedente?: Annonce } = {}) {
    if (!photos.length) return;
    setErreur(null);
    const regen = Boolean(opts.precedente);
    if (regen) setRegeneration(true);
    else setPhase("analyse");
    window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });

    const corps = new FormData();
    photos.forEach((p, i) => corps.append("photos", p.blob, `photo-${i + 1}.jpg`));
    corps.append("infos", JSON.stringify(versInfos(infos)));
    corps.append("reglages", JSON.stringify(reglages));
    if (opts.consigne) corps.append("consigne", opts.consigne);
    if (opts.precedente) corps.append("precedente", JSON.stringify(opts.precedente));

    annulation.current = new AbortController();
    try {
      const rep = await fetch("/api/analyze", { method: "POST", body: corps, signal: annulation.current.signal });
      if (rep.status === 401) {
        window.location.href = "/login";
        return;
      }
      const json = await rep.json().catch(() => null);
      if (!rep.ok || !json?.annonce) {
        throw new Error(json?.erreur ?? `Erreur ${rep.status}. Réessaie.`);
      }
      if (!fiche.current) fiche.current = { id: crypto.randomUUID(), creeLe: Date.now(), statut: "brouillon" };
      setAnnonce(json.annonce as Annonce);
      setPhase("resultat");
      if (regen) toast("Nouvelle version prête");
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setPhase(regen ? "resultat" : "saisie");
        return;
      }
      const message = navigator.onLine ? (e as Error).message : "Pas de connexion internet.";
      if (regen) toast(message, "erreur");
      else {
        setErreur(message);
        setPhase("saisie");
      }
    } finally {
      setRegeneration(false);
      annulation.current = null;
    }
  }

  function nouveau() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setInfos(INFOS_VIDES);
    setAnnonce(null);
    setErreur(null);
    fiche.current = null;
    setPhase("saisie");
    window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
  }

  const afficherCintre = phase === "analyse" || (phase === "saisie" && photos.length === 0);

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {afficherCintre && (
          <motion.div
            key="cintre"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: phase === "analyse" ? 240 : 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="-mx-4 overflow-hidden"
          >
            <Cintre3D actif={phase === "analyse"} reduit={reduit} className="size-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "saisie" && (
          <motion.div
            key="saisie"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {photos.length === 0 && (
              <div className="text-center">
                <h1
                  className="font-display text-[34px] leading-[1.05] font-semibold tracking-[-0.03em]"
                  style={{ fontVariationSettings: '"SOFT" 100, "opsz" 96' }}
                >
                  Une photo,
                  <br />
                  <span className="text-accent italic">une annonce.</span>
                </h1>
                <p className="mx-auto mt-2 max-w-[30ch] text-encre-2">
                  Titre, description et prix, prêts à coller dans Vinted.
                </p>
              </div>
            )}

            <Photos photos={photos} onChange={setPhotos} />

            <AnimatePresence>
              {erreur && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="rounded-2xl bg-alerte-fond px-4 py-3 text-[15px] font-semibold text-alerte"
                >
                  {erreur}
                </motion.p>
              )}
            </AnimatePresence>

            <InfosFacultatives valeur={infos} onChange={setInfos} />

            {annonce && (
              <button type="button" onClick={() => setPhase("resultat")} className="flex items-center gap-1 text-sm font-semibold text-encre-2">
                <IconeGauche taille={16} /> Revenir à l'annonce sans relancer
              </button>
            )}

            {photos.length > 0 && (
              <>
                <div className="h-20" aria-hidden />
                <div className="pointer-events-none fixed inset-x-0 z-30 bg-gradient-to-t from-papier via-papier/80 to-transparent px-4 pt-8 pb-3" style={{ bottom: "calc(env(safe-area-inset-bottom) + 64px)" }}>
                  <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pointer-events-auto mx-auto max-w-xl">
                    <Bouton variante="accent" taille="lg" className="w-full" onClick={() => analyser()}>
                      <IconeEtincelle taille={20} />
                      {annonce ? "Relancer l'analyse" : "Créer l'annonce"}
                    </Bouton>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {phase === "analyse" && (
          <motion.div key="analyse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Analyse nbPhotos={photos.length} apercus={photos.map((p) => p.url)} />
            <div className="mt-6 text-center">
              <Bouton variante="fantome" taille="sm" onClick={() => annulation.current?.abort()}>
                Annuler
              </Bouton>
            </div>
          </motion.div>
        )}

        {phase === "resultat" && annonce && (
          <motion.div key="resultat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              type="button"
              onClick={() => setPhase("saisie")}
              className="mb-3 flex items-center gap-1 text-sm font-semibold text-encre-2"
            >
              <IconeGauche taille={16} /> Photos et infos
            </button>
            <Resultat
              annonce={annonce}
              onChange={setAnnonce}
              onRegenerer={(consigne) => analyser({ consigne, precedente: annonce })}
              onNouveau={nouveau}
              regeneration={regeneration}
              couverture={photos[0]?.url}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {regeneration && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed inset-x-0 z-40 flex justify-center"
            style={{ top: "calc(env(safe-area-inset-top) + 72px)" }}
          >
            <div className="flex items-center gap-2.5 rounded-full bg-encre py-2 pr-2 pl-4 text-sm font-semibold text-papier shadow-carte">
              <motion.span
                className="size-3 rounded-full border-2 border-papier/30 border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              Nouvelle version…
              <button type="button" onClick={() => annulation.current?.abort()} className="rounded-full bg-papier/15 px-3 py-1">
                Annuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
