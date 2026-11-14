"use client";
import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent as RMouseEvent } from "react";
import { gsap } from "@/lib/gsap";

type Variant = "bordeaux" | "beige" | "creme" | "noir" | "outline-creme";

const styles: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  bordeaux: { base: "bg-bordeaux text-blanc", fill: "bg-bordeaux-light", hoverText: "group-data-[hover=1]/mb:text-blanc" },
  beige: { base: "bg-beige text-noir", fill: "bg-noir", hoverText: "group-data-[hover=1]/mb:text-creme" },
  creme: { base: "bg-creme text-noir", fill: "bg-noir", hoverText: "group-data-[hover=1]/mb:text-creme" },
  noir: { base: "bg-noir text-creme", fill: "bg-bordeaux", hoverText: "group-data-[hover=1]/mb:text-blanc" },
  "outline-creme": { base: "border border-creme/40 text-creme", fill: "bg-creme", hoverText: "group-data-[hover=1]/mb:text-noir" },
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  cursor?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** rayon d'attraction en px autour du bouton */
  radius?: number;
};

/** Bouton magnétique : suit le curseur dans un rayon de ~60 px et se remplit
    d'un disque qui part de la position d'entrée du curseur. */
export default function MagneticButton({
  children,
  variant = "bordeaux",
  href,
  onClick,
  className = "",
  ariaLabel,
  cursor,
  type = "button",
  disabled,
  radius = 60,
}: Props) {
  const zone = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const s = styles[variant];

  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: RMouseEvent) => {
    if (!fine() || !inner.current) return;
    const r = inner.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(inner.current, { x: dx * 0.3, y: dy * 0.35, duration: 0.5, ease: "power3.out" });
    if (label.current) gsap.to(label.current, { x: dx * 0.1, y: dy * 0.12, duration: 0.5, ease: "power3.out" });
  };
  const onLeaveZone = () => {
    if (!inner.current) return;
    gsap.to([inner.current, label.current], { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)" });
  };

  const placeFill = (e: RMouseEvent, enter: boolean) => {
    if (!inner.current || !fill.current) return;
    const r = inner.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const d = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
    gsap.set(fill.current, { left: x, top: y, width: d, height: d });
    gsap.to(fill.current, { scale: enter ? 1 : 0, duration: enter ? 0.45 : 0.35, ease: "power3.out" });
    inner.current.dataset.hover = enter ? "1" : "0";
  };

  const content = (
    <span
      ref={inner}
      data-hover="0"
      onMouseEnter={(e) => placeFill(e, true)}
      onMouseLeave={(e) => placeFill(e, false)}
      className={`group/mb relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-300 ${s.base} ${className}`}
    >
      <span
        ref={fill}
        aria-hidden="true"
        className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full ${s.fill}`}
      />
      <span
        ref={label}
        className={`relative z-[1] inline-flex items-center gap-2.5 transition-colors duration-300 ${s.hoverText}`}
      >
        {children}
      </span>
    </span>
  );

  const zoneStyle = { padding: radius / 2, margin: -radius / 2 };
  const common = {
    "aria-label": ariaLabel,
    "data-cursor": cursor,
    className: "relative inline-flex rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bordeaux",
  };

  return (
    <span ref={zone} onMouseMove={onMove} onMouseLeave={onLeaveZone} style={zoneStyle} className="inline-flex">
      {href ? (
        href.startsWith("/") && !href.startsWith("/#") ? (
          <Link href={href} {...common} onClick={onClick}>
            {content}
          </Link>
        ) : (
          <a href={href} {...common} onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}>
            {content}
          </a>
        )
      ) : (
        <button type={type} disabled={disabled} onClick={onClick} {...common}>
          {content}
        </button>
      )}
    </span>
  );
}
