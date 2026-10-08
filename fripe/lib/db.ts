import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { REGLAGES_DEFAUT, ReglagesSchema, type Annonce, type Infos, type Reglages } from "./schema.ts";

// Tout reste dans le navigateur (IndexedDB) : historique et réglages.
// Aucune base externe en v1.

export type Statut = "brouillon" | "publiee" | "vendue";

export type FicheHistorique = {
  id: string;
  creeLe: number;
  modifieLe: number;
  annonce: Annonce;
  infos: Infos;
  photos: Blob[]; // JPEG compressés, dans l'ordre choisi
  miniature: Blob; // couverture, en petit
  statut: Statut;
};

interface FripeDB extends DBSchema {
  annonces: { key: string; value: FicheHistorique; indexes: { parDate: number } };
  reglages: { key: string; value: Reglages };
}

let dbPromise: Promise<IDBPDatabase<FripeDB>> | null = null;

function db() {
  dbPromise ??= openDB<FripeDB>("fripe", 1, {
    upgrade(base) {
      const annonces = base.createObjectStore("annonces", { keyPath: "id" });
      annonces.createIndex("parDate", "modifieLe");
      base.createObjectStore("reglages");
    },
  });
  return dbPromise;
}

export async function enregistrer(fiche: FicheHistorique) {
  await (await db()).put("annonces", fiche);
}

export async function lister(): Promise<FicheHistorique[]> {
  const toutes = await (await db()).getAllFromIndex("annonces", "parDate");
  return toutes.reverse();
}

export async function lire(id: string) {
  return (await db()).get("annonces", id);
}

export async function supprimer(id: string) {
  await (await db()).delete("annonces", id);
}

export async function toutEffacer() {
  await (await db()).clear("annonces");
}

export async function lireReglages(): Promise<Reglages> {
  const brut = await (await db()).get("reglages", "courant");
  const r = ReglagesSchema.safeParse({ ...REGLAGES_DEFAUT, ...brut });
  return r.success ? r.data : REGLAGES_DEFAUT;
}

export async function ecrireReglages(r: Reglages) {
  await (await db()).put("reglages", r, "courant");
}
