"use client";
/**
 * Routeur en mémoire pour la version « page unique » (artefact claude.ai).
 * Même URL que l'app Next.js (« /clients/123?nouveau=1 »), mais sans toucher
 * à l'adresse du navigateur : le cadre de l'artefact ne transmet pas l'URL.
 */
import { createContext, useContext, useSyncExternalStore } from "react";

const KEY = "approche.route";
type Listener = () => void;
const listeners = new Set<Listener>();
let stack: string[] = [initial()];

function initial(): string {
  try {
    return sessionStorage.getItem(KEY) || "/";
  } catch {
    return "/";
  }
}
function emit() {
  try {
    sessionStorage.setItem(KEY, current());
  } catch {}
  listeners.forEach((l) => l());
}
export const current = () => stack[stack.length - 1];

export const nav = {
  push(href: string) {
    if (href === current()) return;
    stack = [...stack, href];
    emit();
  },
  replace(href: string) {
    stack = [...stack.slice(0, -1), href];
    emit();
  },
  back() {
    if (stack.length > 1) stack = stack.slice(0, -1);
    else stack = ["/"];
    emit();
  },
};

export function useRoute() {
  const href = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    current,
    current,
  );
  const [pathAndQuery, anchor = ""] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  return { href, path: path || "/", query, anchor };
}

export const ParamsContext = createContext<Record<string, string>>({});
export const useRouteParams = () => useContext(ParamsContext);

/** « /clients/:id/imprimer » → { id } */
export function match(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}
