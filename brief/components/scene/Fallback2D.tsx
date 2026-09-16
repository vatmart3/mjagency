"use client";

import { useEffect, useRef } from "react";
import { MockupAnimator } from "@/lib/animator";
import { ART_H, ART_W, paintMockup } from "@/lib/painter";
import type { MockupTarget } from "@/lib/mockup";
import { pointer } from "@/lib/pointer";

/**
 * Sans WebGL, la même maquette — peinte par le même code — sur un canvas 2D,
 * inclinée en CSS. Le visiteur ne perd rien du concept, seulement le relief.
 */
export default function Fallback2D({
  target,
  spin,
  reduced,
}: {
  target: MockupTarget;
  spin: boolean;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const animator = useRef<MockupAnimator | null>(null);
  const targetRef = useRef(target);

  targetRef.current = target;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = ART_W * dpr;
    canvas.height = ART_H * dpr;
    ctx.scale(dpr, dpr);

    animator.current = new MockupAnimator(targetRef.current, reduced);

    let raf = 0;
    let previous = performance.now();
    let rot = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      const state = animator.current!.step(dt);
      paintMockup(ctx, state);

      if (shellRef.current) {
        const amp = reduced ? 0 : 1;
        rot += (pointer.x * 6 * amp - rot) * 0.06;
        const tilt = pointer.y * -3 * amp;
        shellRef.current.style.transform = `perspective(1400px) rotateY(${rot}deg) rotateX(${tilt}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    animator.current?.setTarget(target);
  }, [target]);

  useEffect(() => {
    if (!spin || !shellRef.current || reduced) return;
    const el = shellRef.current;
    el.animate(
      [
        { transform: "perspective(1400px) rotateY(0deg)" },
        { transform: "perspective(1400px) rotateY(360deg)" },
      ],
      { duration: 1900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [spin, reduced]);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div ref={shellRef} className="w-full max-w-[640px] will-change-transform">
        <div
          className="overflow-hidden rounded-[14px] bg-white ring-1 ring-black/10"
          style={{ boxShadow: "0 30px 70px -40px rgba(29,29,31,0.55)" }}
        >
          <canvas
            ref={canvasRef}
            className="block h-auto w-full"
            style={{ aspectRatio: `${ART_W} / ${ART_H}` }}
            role="img"
            aria-label="Aperçu de votre futur site, mis à jour au fil de vos réponses"
          />
        </div>
      </div>
    </div>
  );
}
