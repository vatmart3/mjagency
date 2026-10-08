"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { useRef, useState } from "react";
import { ErreurImage, preparerPhoto, type PhotoPreparee } from "@/lib/image.ts";
import { PHOTOS_MAX } from "@/lib/vinted.ts";
import { IconeAppareil, IconeCroix, IconeGalerie, IconeGauche, IconeDroite, IconePlus, IconePoignee } from "./icones";
import { useToast } from "./ui";

export function Photos({
  photos,
  onChange,
}: {
  photos: PhotoPreparee[];
  onChange: (p: PhotoPreparee[]) => void;
}) {
  const galerie = useRef<HTMLInputElement>(null);
  const appareil = useRef<HTMLInputElement>(null);
  const [survol, setSurvol] = useState(false);
  const [enCours, setEnCours] = useState(0);
  const toast = useToast();
  const restantes = PHOTOS_MAX - photos.length;

  async function ajouter(fichiers: FileList | File[] | null) {
    if (!fichiers?.length) return;
    const images = Array.from(fichiers).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!images.length) return toast("Ce ne sont pas des images.", "erreur");
    const retenues = images.slice(0, restantes);
    if (images.length > restantes) toast(`${PHOTOS_MAX} photos maximum : ${images.length - restantes} ignorée(s).`, "erreur");

    setEnCours(retenues.length);
    const pretes: PhotoPreparee[] = [];
    for (const f of retenues) {
      try {
        pretes.push(await preparerPhoto(f));
      } catch (e) {
        toast(e instanceof ErreurImage ? e.message : "Une photo n'a pas pu être lue.", "erreur");
      }
      setEnCours((n) => n - 1);
    }
    onChange([...photos, ...pretes]);
  }

  function retirer(id: string) {
    const p = photos.find((x) => x.id === id);
    if (p) URL.revokeObjectURL(p.url);
    onChange(photos.filter((x) => x.id !== id));
  }

  function deplacer(i: number, sens: -1 | 1) {
    const j = i + sens;
    if (j < 0 || j >= photos.length) return;
    const l = [...photos];
    [l[i], l[j]] = [l[j], l[i]];
    onChange(l);
  }

  const champs = (
    <>
      <input
        ref={galerie}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          ajouter(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={appareil}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          ajouter(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );

  const zoneDepot = {
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      setSurvol(true);
    },
    onDragLeave: () => setSurvol(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setSurvol(false);
      ajouter(e.dataTransfer.files);
    },
  };

  if (photos.length === 0 && enCours === 0) {
    return (
      <div
        {...zoneDepot}
        className={`relative rounded-carte border-2 border-dashed p-5 transition-colors ${
          survol ? "border-accent bg-accent/5" : "border-ligne-forte bg-carte/60"
        }`}
      >
        {champs}
        <p className="mb-4 text-center text-sm text-encre-2">
          1 à {PHOTOS_MAX} photos du même article. La première sert de couverture.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => appareil.current?.click()}
            className="flex flex-col items-center gap-2 rounded-2xl bg-encre px-3 py-5 font-semibold text-papier transition active:scale-[0.97]"
          >
            <IconeAppareil taille={26} />
            Prendre une photo
          </button>
          <button
            type="button"
            onClick={() => galerie.current?.click()}
            className="flex flex-col items-center gap-2 rounded-2xl bg-carte px-3 py-5 font-semibold ring-1 ring-ligne-forte transition active:scale-[0.97]"
          >
            <IconeGalerie taille={26} />
            Galerie
          </button>
        </div>
        <p className="mt-4 hidden text-center text-sm text-encre-3 sm:block">…ou glisse tes photos ici.</p>
      </div>
    );
  }

  return (
    <div {...zoneDepot} className={`rounded-carte transition ${survol ? "ring-2 ring-accent" : ""}`}>
      {champs}
      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-1">
        <Reorder.Group axis="x" values={photos} onReorder={onChange} className="flex gap-2.5">
          {photos.map((p, i) => (
            <Vignette
              key={p.id}
              photo={p}
              index={i}
              total={photos.length}
              onRetirer={() => retirer(p.id)}
              onDeplacer={(s) => deplacer(i, s)}
            />
          ))}
          <AnimatePresence>
            {Array.from({ length: enCours }).map((_, i) => (
              <motion.li
                key={`chargement-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-32 w-24 shrink-0 animate-pulse rounded-2xl bg-creux"
              />
            ))}
          </AnimatePresence>
          {restantes > 0 && enCours === 0 && (
            <li className="flex h-32 w-24 shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() => appareil.current?.click()}
                aria-label="Prendre une autre photo"
                className="flex flex-1 items-center justify-center rounded-2xl bg-encre text-papier transition active:scale-95"
              >
                <IconeAppareil taille={22} />
              </button>
              <button
                type="button"
                onClick={() => galerie.current?.click()}
                aria-label="Ajouter depuis la galerie"
                className="flex flex-1 items-center justify-center rounded-2xl bg-carte ring-1 ring-ligne-forte transition active:scale-95"
              >
                <IconePlus taille={22} />
              </button>
            </li>
          )}
        </Reorder.Group>
      </div>
      <p className="mt-2 text-[13px] text-encre-3">
        {photos.length}/{PHOTOS_MAX} · glisse la poignée pour réordonner
      </p>
    </div>
  );
}

function Vignette({
  photo,
  index,
  total,
  onRetirer,
  onDeplacer,
}: {
  photo: PhotoPreparee;
  index: number;
  total: number;
  onRetirer: () => void;
  onDeplacer: (sens: -1 | 1) => void;
}) {
  const controles = useDragControls();
  return (
    <Reorder.Item
      value={photo}
      dragListener={false}
      dragControls={controles}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileDrag={{ scale: 1.06, zIndex: 10, boxShadow: "0 18px 40px -16px rgba(0,0,0,.45)" }}
      className="group relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-creux ring-1 ring-ligne"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={`Photo ${index + 1}`} className="size-full object-cover" draggable={false} />
      {index === 0 && (
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-sur-accent">
          Couverture
        </span>
      )}
      <button
        type="button"
        onClick={onRetirer}
        aria-label={`Retirer la photo ${index + 1}`}
        className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
      >
        <IconeCroix taille={14} strokeWidth={2.4} />
      </button>
      <button
        type="button"
        onPointerDown={(e) => controles.start(e)}
        aria-label={`Déplacer la photo ${index + 1}`}
        className="absolute top-1 left-1 flex size-7 cursor-grab touch-none items-center justify-center rounded-full bg-black/55 text-white backdrop-blur active:cursor-grabbing"
      >
        <IconePoignee taille={14} />
      </button>
      {/* Repli au clavier (et pour qui préfère taper que glisser). */}
      <div className="absolute inset-x-1 bottom-1 hidden justify-between group-focus-within:flex">
        {index > 0 && (
          <button type="button" onClick={() => onDeplacer(-1)} aria-label="Avancer" className="flex size-6 items-center justify-center rounded-full bg-black/55 text-white">
            <IconeGauche taille={14} />
          </button>
        )}
        {index < total - 1 && (
          <button type="button" onClick={() => onDeplacer(1)} aria-label="Reculer" className="ml-auto flex size-6 items-center justify-center rounded-full bg-black/55 text-white">
            <IconeDroite taille={14} />
          </button>
        )}
      </div>
    </Reorder.Item>
  );
}
