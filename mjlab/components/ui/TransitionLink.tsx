"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/lenis";

type Props = ComponentProps<typeof Link> & { href: string };

/** Lien interne : le point bordeaux remplit l'écran avant la nouvelle page.
    Les ancres de la page courante défilent en douceur. */
export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const [path, hash] = href.split("#");
    const target = path || pathname;
    if (target === pathname) {
      if (hash && scrollToTarget(`#${hash}`)) {
        e.preventDefault();
        history.replaceState(null, "", `#${hash}`);
      }
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("mj:navigate", { detail: { href, x: e.clientX, y: e.clientY } })
    );
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
