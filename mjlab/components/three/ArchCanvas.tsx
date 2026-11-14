"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { HeroScene, ActivitiesScene, RingScene, SegmentScene } from "./scenes";

export type ArchSceneName = "hero" | "activities" | "ring" | "segment";

type Props = {
  scene: ArchSceneName;
  count: number;
  index?: number;
  className?: string;
  /** couleur de fond rendue dans le canvas (sinon transparent) */
  background?: string;
  post?: boolean;
  onReady?: () => void;
};

/** Canvas WebGL : chargé en lazy, mis en pause hors écran, allégé sur mobile. */
export default function ArchCanvas({ scene, count, index = 0, className = "", background, post = false, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const withPost = post && !mobile;

  return (
    <div ref={wrap} className={`absolute inset-0 ${className}`} aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ fov: 30, near: 0.1, far: 100, position: [0, 0, 10] }}
        gl={{
          antialias: !withPost,
          alpha: !background,
          powerPreference: "high-performance",
          toneMapping: THREE.NeutralToneMapping,
        }}
        onCreated={() => onReady?.()}
        style={{ pointerEvents: "none" }}
      >
        {background && <color attach="background" args={[background]} />}
        <Suspense fallback={null}>
          {scene === "hero" && <HeroScene count={count} mobile={mobile} />}
          {scene === "activities" && <ActivitiesScene count={count} />}
          {scene === "ring" && <RingScene count={count} mobile={mobile} />}
          {scene === "segment" && <SegmentScene index={index} count={count} mobile={mobile} />}
        </Suspense>
        {withPost && (
          <EffectComposer multisampling={4}>
            <Vignette offset={0.32} darkness={0.42} />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
