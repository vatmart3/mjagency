"use client";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { TableName, Tables } from "@/lib/types";
import { getRepo } from "./repo";

/**
 * Cache minimal par table : une seule requête partagée entre tous les
 * composants, rafraîchie après chaque écriture et en temps réel.
 * Volume visé : quelques centaines de lignes, tout tient en mémoire.
 */
interface Entry {
  rows: unknown[];
  loaded: boolean;
  error: string | null;
  inflight: Promise<void> | null;
  listeners: Set<() => void>;
  unsub: (() => void) | null;
  snapshot: { rows: unknown[]; loaded: boolean; error: string | null };
}

const store = new Map<TableName, Entry>();
const EMPTY = { rows: [] as unknown[], loaded: false, error: null as string | null };

function entry(t: TableName): Entry {
  let e = store.get(t);
  if (!e) {
    e = { rows: [], loaded: false, error: null, inflight: null, listeners: new Set(), unsub: null, snapshot: EMPTY };
    store.set(t, e);
  }
  return e;
}

function publish(e: Entry) {
  e.snapshot = { rows: e.rows, loaded: e.loaded, error: e.error };
  e.listeners.forEach((l) => l());
}

export function refresh(t: TableName): Promise<void> {
  const e = entry(t);
  if (e.inflight) return e.inflight;
  e.inflight = getRepo()
    .list(t)
    .then((rows) => {
      e.rows = rows;
      e.loaded = true;
      e.error = null;
    })
    .catch((err: Error) => {
      e.error = err.message;
      e.loaded = true;
    })
    .finally(() => {
      e.inflight = null;
      publish(e);
    });
  return e.inflight;
}

function subscribe(t: TableName, cb: () => void) {
  const e = entry(t);
  e.listeners.add(cb);
  if (!e.unsub) e.unsub = getRepo().subscribe(t, () => void refresh(t));
  if (!e.loaded && !e.inflight) void refresh(t);
  return () => {
    e.listeners.delete(cb);
  };
}

export function useTable<T extends TableName>(t: T) {
  const snap = useSyncExternalStore(
    useCallback((cb) => subscribe(t, cb), [t]),
    () => entry(t).snapshot,
    () => EMPTY,
  );
  useEffect(() => {
    const onFocus = () => void refresh(t);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [t]);
  return {
    rows: snap.rows as Tables[T][],
    loading: !snap.loaded,
    error: snap.error,
    refresh: () => refresh(t),
  };
}

/* Écritures : passent par le repo puis invalident le cache. */
export const db = {
  async insert<T extends TableName>(t: T, row: Partial<Tables[T]>) {
    const r = await getRepo().insert(t, row);
    await refresh(t);
    return r;
  },
  async update<T extends TableName>(t: T, id: string, patch: Partial<Tables[T]>) {
    const r = await getRepo().update(t, id, patch);
    await refresh(t);
    return r;
  },
  async upsert<T extends TableName>(t: T, row: Partial<Tables[T]>, keys: (keyof Tables[T])[]) {
    const r = await getRepo().upsert(t, row, keys);
    await refresh(t);
    return r;
  },
  async remove<T extends TableName>(t: T, id: string) {
    await getRepo().remove(t, id);
    await refresh(t);
  },
  async removeWhere<T extends TableName>(t: T, match: Partial<Tables[T]>) {
    await getRepo().removeWhere(t, match);
    await refresh(t);
  },
  get: <T extends TableName>(t: T, id: string) => getRepo().get(t, id),
};
