"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

/** Le point bordeaux grossit depuis le clic, couvre l'écran, puis se retire. */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const dot = useRef<HTMLDivElement>(null);
  const pending = useRef(false);

  useEffect(() => {
    const onNav = (e: Event) => {
      const { href, x, y } = (e as CustomEvent<{ href: string; x: number; y: number }>).detail;
      const el = dot.current;
      if (!el) return router.push(href);
      const cx = x || window.innerWidth / 2;
      const cy = y || window.innerHeight / 2;
      const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
      pending.current = true;
      gsap.killTweensOf(el);
      gsap.set(el, { left: cx, top: cy, width: 12, height: 12, scale: 1, autoAlpha: 1 });
      gsap.to(el, {
        scale: (r * 2) / 12 + 2,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => router.push(href),
      });
    };
    window.addEventListener("mj:navigate", onNav);
    return () => window.removeEventListener("mj:navigate", onNav);
  }, [router]);

  useEffect(() => {
    if (!pending.current || !dot.current) return;
    pending.current = false;
    const el = dot.current;
    // la nouvelle page est montée : le point se rétracte au centre
    gsap.set(el, { left: innerWidth / 2, top: innerHeight / 2 });
    gsap.to(el, { scale: 0, duration: 0.8, ease: "power3.inOut", delay: 0.1, onComplete: () => { gsap.set(el, { autoAlpha: 0 }); } });
  }, [pathname]);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed z-[95] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bordeaux opacity-0 invisible"
    />
  );
}
