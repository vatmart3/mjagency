"use client";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { nav } from "../router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; scroll?: boolean; replace?: boolean };

/** next/link pour la page unique : les liens internes passent par le routeur en mémoire. */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch, scroll, replace, onClick, ...rest }, ref) {
  void prefetch;
  void scroll;
  const internal = href.startsWith("/");
  return (
    <a
      ref={ref}
      href={internal ? `#${href.replace(/[^a-zA-Z0-9._~-]/g, "-")}` : href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        if (replace) nav.replace(href);
        else nav.push(href);
      }}
      {...rest}
    />
  );
});
export default Link;
