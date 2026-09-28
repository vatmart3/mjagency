"use client";
/**
 * Couche d'accès aux données.
 * Deux implémentations derrière la même interface :
 *  - Supabase (production) : Postgres + RLS + Storage + Realtime
 *  - Démo (sans configuration) : localStorage + BroadcastChannel entre onglets
 * Le reste de l'app ne sait pas laquelle tourne.
 */
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabase } from "@/lib/supabase/client";
import type { TableName, Tables } from "@/lib/types";
import { buildDemoData, DEMO_VERSION } from "./demo";

type Row<T extends TableName> = Tables[T];
type Match<T extends TableName> = Partial<Row<T>>;

export interface Repo {
  mode: "supabase" | "demo";
  list<T extends TableName>(t: T): Promise<Row<T>[]>;
  get<T extends TableName>(t: T, id: string): Promise<Row<T> | null>;
  insert<T extends TableName>(t: T, row: Partial<Row<T>>): Promise<Row<T>>;
  update<T extends TableName>(t: T, id: string, patch: Partial<Row<T>>): Promise<Row<T>>;
  upsert<T extends TableName>(t: T, row: Partial<Row<T>>, keys: (keyof Row<T>)[]): Promise<Row<T>>;
  remove<T extends TableName>(t: T, id: string): Promise<void>;
  removeWhere<T extends TableName>(t: T, match: Match<T>): Promise<void>;
  subscribe(t: TableName, cb: () => void): () => void;
  uploadPhoto(prospectId: string, file: File): Promise<string>;
  photoUrl(path: string): Promise<string>;
  removePhoto(path: string): Promise<void>;
}

const ORDERED: TableName[] = [
  "prospects",
  "interactions",
  "tasks",
  "research_prompts",
  "research_reports",
  "custom_scripts",
  "favorites",
  "tours",
  "call_sessions",
  "training_sessions",
];

/* ------------------------------------------------------------------ */
/* Supabase                                                            */
/* ------------------------------------------------------------------ */

function supabaseRepo(): Repo {
  const sb = () => getSupabase();
  const fail = (e: { message: string } | null) => {
    if (e) throw new Error(e.message);
  };
  return {
    mode: "supabase",
    async list(t) {
      let q = sb().from(t).select("*");
      if (ORDERED.includes(t)) q = q.order("created_at", { ascending: false });
      const { data, error } = await q.limit(5000);
      fail(error);
      return (data ?? []) as never;
    },
    async get(t, id) {
      const { data, error } = await sb().from(t).select("*").eq("id", id).maybeSingle();
      fail(error);
      return (data ?? null) as never;
    },
    async insert(t, row) {
      const { data, error } = await sb().from(t).insert(row as never).select("*").single();
      fail(error);
      return data as never;
    },
    async update(t, id, patch) {
      const { data, error } = await sb().from(t).update(patch as never).eq("id", id).select("*").single();
      fail(error);
      return data as never;
    },
    async upsert(t, row, keys) {
      const { data, error } = await sb()
        .from(t)
        .upsert(row as never, { onConflict: keys.join(",") })
        .select("*")
        .single();
      fail(error);
      return data as never;
    },
    async remove(t, id) {
      const { error } = await sb().from(t).delete().eq("id", id);
      fail(error);
    },
    async removeWhere(t, match) {
      const { error } = await sb().from(t).delete().match(match as Record<string, unknown>);
      fail(error);
    },
    subscribe(t, cb) {
      const ch = sb()
        .channel(`db-${t}-${Math.random().toString(36).slice(2)}`)
        .on("postgres_changes", { event: "*", schema: "public", table: t }, () => cb())
        .subscribe();
      return () => {
        sb().removeChannel(ch);
      };
    },
    async uploadPhoto(prospectId, file) {
      const blob = await downscale(file, 1600);
      const path = `${prospectId}/${Date.now()}.jpg`;
      const { error } = await sb().storage.from("prospect-photos").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });
      fail(error);
      return path;
    },
    async photoUrl(path) {
      const { data, error } = await sb().storage.from("prospect-photos").createSignedUrl(path, 3600);
      fail(error);
      return data?.signedUrl ?? "";
    },
    async removePhoto(path) {
      const { error } = await sb().storage.from("prospect-photos").remove([path]);
      fail(error);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Démo locale                                                         */
/* ------------------------------------------------------------------ */

const PREFIX = "approche.db.";
const bus: BroadcastChannel | null =
  typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("approche-db") : null;
const localListeners = new Map<TableName, Set<() => void>>();

function emit(t: TableName, broadcast = true) {
  localListeners.get(t)?.forEach((cb) => cb());
  if (broadcast) bus?.postMessage({ table: t });
}
if (bus) bus.onmessage = (e: MessageEvent<{ table: TableName }>) => emit(e.data.table, false);
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key?.startsWith(PREFIX)) emit(e.key.slice(PREFIX.length) as TableName, false);
  });
}

function ensureSeeded() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(PREFIX + "__version") === DEMO_VERSION) return;
    const data = buildDemoData();
    for (const [t, rows] of Object.entries(data)) localStorage.setItem(PREFIX + t, JSON.stringify(rows));
    localStorage.setItem(PREFIX + "__version", DEMO_VERSION);
  } catch {
    /* stockage indisponible : l'app fonctionnera en mémoire */
  }
}

const memory = new Map<string, unknown[]>();
function read<T extends TableName>(t: T): Row<T>[] {
  ensureSeeded();
  try {
    const raw = localStorage.getItem(PREFIX + t);
    return raw ? (JSON.parse(raw) as Row<T>[]) : [];
  } catch {
    return (memory.get(t) as Row<T>[]) ?? [];
  }
}
function write<T extends TableName>(t: T, rows: Row<T>[]) {
  try {
    localStorage.setItem(PREFIX + t, JSON.stringify(rows));
  } catch {
    memory.set(t, rows);
  }
  emit(t);
}

const DEFAULTS: Partial<Record<TableName, Record<string, unknown>>> = {
  prospects: {
    photos: [],
    status: "a_contacter",
    to_visit: true,
  },
  tasks: { done: false, kind: "rappel", done_at: null, preferred_slot: null },
  training_sessions: { state: "lobby" },
};

function currentUserId(): string | null {
  try {
    return localStorage.getItem("approche.demoUser");
  } catch {
    return null;
  }
}

function matches(row: Record<string, unknown>, match: Record<string, unknown>) {
  return Object.entries(match).every(([k, v]) => row[k] === v);
}

function demoRepo(): Repo {
  return {
    mode: "demo",
    async list(t) {
      const rows = read(t);
      if (ORDERED.includes(t)) {
        return [...rows].sort((a, b) =>
          String((b as { created_at?: string }).created_at ?? "").localeCompare(
            String((a as { created_at?: string }).created_at ?? ""),
          ),
        );
      }
      return rows;
    },
    async get(t, id) {
      return read(t).find((r) => (r as { id?: string }).id === id) ?? null;
    },
    async insert(t, row) {
      const now = new Date().toISOString();
      const uid = currentUserId();
      const full = {
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        created_by: uid,
        user_id: uid,
        ...DEFAULTS[t],
        ...row,
      } as unknown as Row<typeof t>;
      write(t, [...read(t), full]);
      return full;
    },
    async update(t, id, patch) {
      const rows = read(t);
      const i = rows.findIndex((r) => (r as { id?: string }).id === id);
      if (i < 0) throw new Error("Introuvable");
      rows[i] = { ...rows[i], ...patch, updated_at: new Date().toISOString() };
      write(t, rows);
      return rows[i];
    },
    async upsert(t, row, keys) {
      const rows = read(t);
      const match = Object.fromEntries(keys.map((k) => [k, (row as Record<string, unknown>)[k as string]]));
      const i = rows.findIndex((r) => matches(r as unknown as Record<string, unknown>, match));
      const now = new Date().toISOString();
      if (i >= 0) {
        rows[i] = { ...rows[i], ...row, updated_at: now };
        write(t, rows);
        return rows[i];
      }
      const full = { created_at: now, updated_at: now, user_id: currentUserId(), ...row } as unknown as Row<typeof t>;
      write(t, [...rows, full]);
      return full;
    },
    async remove(t, id) {
      write(
        t,
        read(t).filter((r) => (r as { id?: string }).id !== id),
      );
    },
    async removeWhere(t, match) {
      write(
        t,
        read(t).filter((r) => !matches(r as unknown as Record<string, unknown>, match as Record<string, unknown>)),
      );
    },
    subscribe(t, cb) {
      if (!localListeners.has(t)) localListeners.set(t, new Set());
      localListeners.get(t)!.add(cb);
      return () => localListeners.get(t)?.delete(cb);
    },
    async uploadPhoto(_prospectId, file) {
      const blob = await downscale(file, 900);
      return await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
    },
    async photoUrl(path) {
      return path;
    },
    async removePhoto() {},
  };
}

/** Réinitialise les données de démo (Réglages). */
export function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* rien */
  }
  ensureSeeded();
  (Object.keys(buildDemoData()) as TableName[]).forEach((t) => emit(t));
}

/* ------------------------------------------------------------------ */

async function downscale(file: File, max: number): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.82));
  } catch {
    return file;
  }
}

let repo: Repo | null = null;
export function getRepo(): Repo {
  if (!repo) repo = isSupabaseConfigured ? supabaseRepo() : demoRepo();
  return repo;
}
