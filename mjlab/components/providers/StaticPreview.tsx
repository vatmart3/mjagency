"use client";
import { useEffect } from "react";
import { scrollToTarget } from "@/lib/lenis";

/* Aperçu statique (export hébergé hors de Vercel, ex. page privée claude.ai).
   Actif seulement si NEXT_PUBLIC_STATIC_PREVIEW=1 au build. Les pages sont des
   fichiers .html : les liens internes deviennent des chargements de page. */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

function rootUrl() {
  return (window as unknown as { __MJ_ROOT?: string }).__MJ_ROOT || new URL("./", location.href).href;
}

function mapHref(href: string) {
  const [path, hash] = href.split("#");
  const clean = path.replace(/\/$/, "");
  const file = clean === "" ? "index.html" : `${clean.slice(1)}.html`;
  return new URL(file + (hash ? `#${hash}` : ""), rootUrl());
}

export default function StaticPreview() {
  useEffect(() => {
    if (!STATIC_PREVIEW) return;
    const rewrite = () =>
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
        const h = a.getAttribute("href")!;
        a.dataset.route = h;
        a.setAttribute("href", mapHref(h).href);
      });
    rewrite();
    const mo = new MutationObserver(rewrite);
    mo.observe(document.body, { childList: true, subtree: true });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-route]");
      if (!a) return;
      const url = mapHref(a.dataset.route!);
      e.preventDefault();
      e.stopPropagation();
      const samePage = url.pathname === location.pathname;
      if (samePage && url.hash) {
        scrollToTarget(url.hash);
        return;
      }
      window.dispatchEvent(new CustomEvent("mj:static-nav", { detail: { href: url.href, x: e.clientX, y: e.clientY } }));
    };
    window.addEventListener("click", onClick, true);
    return () => {
      mo.disconnect();
      window.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
