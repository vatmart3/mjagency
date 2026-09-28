"use client";
import { useMemo } from "react";
import { nav, useRoute, useRouteParams } from "../router";

export function useRouter() {
  return useMemo(
    () => ({
      push: (href: string) => nav.push(href),
      replace: (href: string) => nav.replace(href),
      back: () => nav.back(),
      forward: () => undefined,
      refresh: () => undefined,
      prefetch: () => undefined,
    }),
    [],
  );
}
export function usePathname() {
  return useRoute().path;
}
export function useSearchParams() {
  const { query } = useRoute();
  return useMemo(() => new URLSearchParams(query), [query]);
}
export function useParams<T extends Record<string, string>>() {
  return useRouteParams() as T;
}
