"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MockupAnimator } from "@/lib/animator";
import { ART_H, ART_W, paintMockup } from "@/lib/painter";
import { rgbCss, type MockupTarget } from "@/lib/mockup";
import { pointer } from "@/lib/pointer";

const SHELL_TINT = new THREE.Color("#f2f2f5");

const SCREEN_W = 3.6;
const SCREEN_H = (SCREEN_W * ART_H) / ART_W;
const BEZEL = 0.09;

/** Un dégradé radial, dessiné une fois : l'ombre douce sous la maquette. */
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(29,29,31,0.36)");
    g.addColorStop(0.55, "rgba(29,29,31,0.12)");
    g.addColorStop(1, "rgba(29,29,31,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

type MockupProps = {
  target: MockupTarget;
  spin: boolean;
  reduced: boolean;
  onSpinDone?: () => void;
};

function Mockup({ target, spin, reduced, onSpinDone }: MockupProps) {
  const group = useRef<THREE.Group>(null);
  const shadowTex = useShadowTexture();
  const invalidate = useThree((s) => s.invalidate);

  const { texture, ctx, animator } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = ART_W;
    canvas.height = ART_H;
    const context = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearFilter;
    return { texture: tex, ctx: context, animator: new MockupAnimator(target, reduced) };
    // La maquette n'est construite qu'une fois : ensuite elle est pilotée par setTarget.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    animator.setTarget(target);
    invalidate();
  }, [target, animator, invalidate]);

  useEffect(() => {
    animator.reduced = reduced;
  }, [reduced, animator]);

  useEffect(() => () => texture.dispose(), [texture]);

  const spinState = useRef({ active: false, t: 0, from: 0 });
  useEffect(() => {
    if (spin) {
      spinState.current = { active: true, t: 0, from: group.current?.rotation.y ?? 0 };
    }
  }, [spin]);

  const last = useRef(0);
  const materials = useRef<{ body: THREE.MeshStandardMaterial | null }>({ body: null });
  /** Une fois le tour d'honneur terminé, la maquette reste de face. */
  const settled = useRef(false);

  useFrame((state, delta) => {
    const s = animator.step(delta);

    // 30 images par seconde suffisent pour une texture : on épargne le CPU.
    last.current += delta;
    if (last.current > 1 / 30) {
      last.current = 0;
      paintMockup(ctx, s);
      texture.needsUpdate = true;
    }

    if (!group.current) return;
    const g = group.current;

    // Parallaxe : la maquette s'incline doucement vers le pointeur.
    const amp = reduced ? 0 : 1;
    const base = settled.current ? 0 : -0.2;
    const targetRotY = base + pointer.x * (settled.current ? 0.1 : 0.22) * amp;
    const targetRotX = (settled.current ? 0 : 0.04) + pointer.y * 0.12 * amp;
    const ease = 1 - Math.exp(-3.2 * delta);

    const sp = spinState.current;
    if (sp.active) {
      sp.t = Math.min(1, sp.t + delta / (reduced ? 0.4 : 1.9));
      const e = 1 - Math.pow(1 - sp.t, 4);
      // Un tour complet, puis la maquette se pose de face : y finit à 2π ≡ 0.
      g.rotation.y = sp.from + (Math.PI * 2 - sp.from) * e;
      g.rotation.x = g.rotation.x * (1 - e);
      g.position.y = Math.sin(sp.t * Math.PI) * 0.16;
      if (sp.t >= 1) {
        sp.active = false;
        settled.current = true;
        g.rotation.set(0, 0, 0);
        g.position.y = 0;
        onSpinDone?.();
      }
    } else {
      g.rotation.y += (targetRotY - g.rotation.y) * ease;
      g.rotation.x += (targetRotX - g.rotation.x) * ease;
      g.position.y += (Math.sin(state.clock.elapsedTime * 0.7) * 0.035 * amp - g.position.y) * ease;
    }

    if (materials.current.body) {
      materials.current.body.color.set(rgbCss(s.colors[1])).lerp(SHELL_TINT, 0.86);
    }

  });

  return (
    <group ref={group}>
      {/* Le corps de l'écran */}
      <RoundedBox
        args={[SCREEN_W + BEZEL * 2, SCREEN_H + BEZEL * 2, 0.16]}
        radius={0.075}
        smoothness={4}
        position={[0, 0, -0.085]}
        castShadow
      >
        <meshStandardMaterial
          ref={(m) => {
            materials.current.body = m as THREE.MeshStandardMaterial;
          }}
          color="#f2f2f5"
          roughness={0.42}
          metalness={0.08}
        />
      </RoundedBox>

      {/* L'écran lui-même : la maquette, peinte image par image */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* L'ombre portée */}
      <mesh position={[0, -SCREEN_H * 0.72, -0.4]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <planeGeometry args={[SCREEN_W * 1.5, SCREEN_W * 0.9]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.75} />
      </mesh>
    </group>
  );
}

export type Scene3DProps = {
  target: MockupTarget;
  spin: boolean;
  reduced: boolean;
  onSpinDone?: () => void;
};

export default function Scene3D({ target, spin, reduced, onSpinDone }: Scene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0, 8.4] }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 6]} intensity={1.5} />
      <directionalLight position={[-5, -2, 2]} intensity={0.35} color="#dfe6f2" />
      <Mockup target={target} spin={spin} reduced={reduced} onSpinDone={onSpinDone} />
    </Canvas>
  );
}
