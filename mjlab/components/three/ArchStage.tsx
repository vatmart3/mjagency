"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCan3D } from "@/lib/hooks";
import type { ArchSceneName } from "./ArchCanvas";

const ArchCanvas = dynamic(() => import("./ArchCanvas"), { ssr: false });

/** Affiche le repli (SSR, immédiat) puis fond la 3D par-dessus quand elle est prête. */
export default function ArchStage({
  scene,
  count,
  index,
  fallback,
  background,
  post,
  className = "",
}: {
  scene: ArchSceneName;
  count: number;
  index?: number;
  fallback: ReactNode;
  background?: string;
  post?: boolean;
  className?: string;
}) {
  const can3D = useCan3D();
  const [ready, setReady] = useState(false);
  const [mount, setMount] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // la 3D ne se monte qu'à l'approche du viewport, et jamais avant que la page
  // soit au repos : le titre HTML (LCP) et l'interactivité passent d'abord.
  useEffect(() => {
    if (!can3D || mount) return;
    const el = root.current;
    if (!el) return;
    let idle = false;
    let near = false;
    const tryMount = () => idle && near && setMount(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const onIdle = () => {
      idle = true;
      tryMount();
    };
    const start = () => (w.requestIdleCallback ? w.requestIdleCallback(onIdle, { timeout: 2000 }) : setTimeout(onIdle, 900));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        tryMount();
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("load", start);
    };
  }, [can3D, mount]);

  return (
    <div ref={root} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 0 : 1 }}>
        {fallback}
      </div>
      {can3D && mount && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
          <ArchCanvas
            scene={scene}
            count={count}
            index={index}
            background={background}
            post={post}
            onReady={() => requestAnimationFrame(() => setTimeout(() => setReady(true), 120))}
          />
        </div>
      )}
    </div>
  );
}
