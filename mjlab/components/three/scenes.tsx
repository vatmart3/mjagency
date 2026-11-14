"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Arch, { midPoint, type SegmentPose } from "./Arch";
import { ARCH, createArchMaterial, segmentShape, smooth, clamp01, easeOut } from "./archCore";
import { archState } from "@/lib/archState";
import { heroClip } from "@/lib/heroClip";
import { heroLayout } from "@/lib/heroLayout";

const OUTER = ARCH.R + ARCH.r;
const lerp = THREE.MathUtils.lerp;

/* ---------------------------------------------------------------------
   Studio : key light chaude, rim light crème, environnement fait main
   (aucune HDR téléchargée).
   --------------------------------------------------------------------- */
export function Studio({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.25 : 0.5} color="#F5F0E9" />
      {/* key light chaude */}
      <directionalLight position={[-4, 6, 6]} intensity={dark ? 2.2 : 2.6} color="#FFF4EA" />
      {/* rim light crème, à contre-jour */}
      <directionalLight position={[3, 2.5, -6]} intensity={dark ? 3.2 : 2.2} color="#F5F0E9" />
      <directionalLight position={[5, -3, 3]} intensity={0.5} color="#D7C5B8" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#FFFFFF" position={[-3, 4, 4]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#F5F0E9" position={[4, 1, -3]} scale={[3, 6, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#D7C5B8" position={[0, -3, 3]} scale={3} />
      </Environment>
    </>
  );
}

/** Parallaxe/inclinaison amortie au curseur (quelques degrés) */
function usePointerTilt(strength = 1) {
  const ref = useRef<THREE.Group>(null);
  const cur = useRef({ x: 0, y: 0 });
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0015, dt); // lerp indépendant du framerate
    cur.current.x += (archState.pointer.x - cur.current.x) * k * 0.6;
    cur.current.y += (archState.pointer.y - cur.current.y) * k * 0.6;
    if (ref.current) {
      ref.current.rotation.y = cur.current.x * 0.1 * strength;
      ref.current.rotation.x = -cur.current.y * 0.06 * strength;
      ref.current.position.x = cur.current.x * 0.08 * strength;
    }
  });
  return ref;
}

/* =====================================================================
   HERO — une vision : l'arche entière, ouverte vers le haut.
   ===================================================================== */
export function HeroScene({ count, mobile }: { count: number; mobile: boolean }) {
  const tilt = usePointerTilt(mobile ? 0 : 1);
  const { camera, size, gl } = useThree();
  const tmp = useMemo(
    () => ({ c: new THREE.Vector3(), z: new THREE.Vector3(), radial: new THREE.Vector3(), view: new THREE.Vector3(), p: new THREE.Vector3(), m: new THREE.Matrix4() }),
    []
  );

  // cadrage : l'arche fait ~110 % de la largeur (plus sur mobile), base vers le bas du hero
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const { widthFactor, baseAt } = heroLayout(size.width, size.height);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const d = (2 * OUTER) / widthFactor / (2 * tanHalf * aspect);
    const visH = 2 * d * tanHalf;
    const camY = -OUTER + visH / 2 - (1 - baseAt) * visH;
    cam.position.set(0, camY + d * 0.07, d);
    cam.lookAt(0, camY, 0);
    cam.updateProjectionMatrix();
  });

  // découpe du titre : la partie du titre posée sur l'arche passe en crème
  useFrame(() => {
    const el = heroClip.el;
    const g = tilt.current;
    if (!el || !g) return;
    const canvasRect = gl.domElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    g.updateWorldMatrix(true, false);
    const pts: string[] = [];
    const STEPS = 40;
    const push = (th: number, side: 1 | -1) => {
      tmp.c.set(Math.cos(th) * ARCH.R, Math.sin(th) * ARCH.R, 0).applyMatrix4(g.matrixWorld);
      tmp.radial.set(Math.cos(th), Math.sin(th), 0).transformDirection(g.matrixWorld);
      tmp.view.copy(camera.position).sub(tmp.c).normalize();
      tmp.z.set(0, 0, 1).transformDirection(g.matrixWorld);
      // silhouette du tube : direction de la section (radial, z) orthogonale au rayon de vue
      const a = tmp.z.dot(tmp.view);
      const b = tmp.radial.dot(tmp.view);
      tmp.radial.multiplyScalar(a).addScaledVector(tmp.z, -b).normalize();
      if (tmp.radial.x * Math.cos(th) + tmp.radial.y * Math.sin(th) < 0) tmp.radial.multiplyScalar(-1);
      tmp.p.copy(tmp.c).addScaledVector(tmp.radial, side * ARCH.r * (side > 0 ? 0.985 : 0.995)).project(camera);
      const x = ((tmp.p.x + 1) / 2) * canvasRect.width + canvasRect.left - r.left;
      const y = ((1 - tmp.p.y) / 2) * canvasRect.height + canvasRect.top - r.top;
      pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
    };
    for (let s = 0; s <= STEPS; s++) push(Math.PI + (Math.PI * s) / STEPS, 1);
    for (let s = STEPS; s >= 0; s--) push(Math.PI + (Math.PI * s) / STEPS, -1);
    el.style.clipPath = `polygon(${pts.join(",")})`;
  });

  const pose = (i: number, p: SegmentPose) => {
    p.shape = segmentShape(i, count);
    midPoint(p.shape, p.pivot);
    p.offset.set(0, 0, 0);
    p.rot.set(0, 0, 0);
    p.scale = 1;
    p.dim = 0;
  };

  return (
    <>
      <Studio />
      <group ref={tilt}>
        <Arch count={count} pose={pose} quality={mobile ? "low" : "high"} edgeAmt={0.2} />
      </group>
      <ContactShadows
        position={[0, -OUTER - 0.005, 0]}
        scale={14}
        blur={2.6}
        far={2.2}
        opacity={0.32}
        resolution={mobile ? 256 : 512}
        color="#252326"
        frames={1}
      />
    </>
  );
}

/* =====================================================================
   ACTIVITÉS — plusieurs possibilités : l'arche se fragmente, chaque
   segment se détache tour à tour et devient le support d'une activité.
   ===================================================================== */
export function ActivitiesScene({ count }: { count: number }) {
  const tilt = usePointerTilt(0.6);
  const root = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const focusSmooth = useRef<number[]>(Array(count).fill(0));
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    cam.position.set(0, 0.2, 11);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    const visH = 2 * 11 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const visW = visH * aspect;
    if (root.current) {
      const s = Math.min(0.92, (visW * 0.42) / (2 * OUTER));
      root.current.scale.setScalar(s);
      root.current.position.set(visW / 2 - OUTER * s - visW * 0.1, visH * 0.22, 0);
    }
    // lissage des poids de focus
    const p = archState.activities.progress;
    const f = clamp01((p - 0.08) / 0.92) * count - 0.5;
    const k = 1 - Math.pow(0.002, dt);
    for (let i = 0; i < count; i++) {
      // plateau : le segment reste pleinement présenté au centre de sa fenêtre
      const w = clamp01(1 - (Math.abs(f - i) - 0.3) / 0.4);
      const presence = smooth(0.04, 0.12, p);
      focusSmooth.current[i] += (easeOut(w) * presence - focusSmooth.current[i]) * k;
    }
    void state;
  });

  const pose = (i: number, p: SegmentPose, t: number) => {
    const prog = archState.activities.progress;
    const split = smooth(0.0, 0.07, prog);
    p.shape = segmentShape(i, count, { gap: split * 0.07 });
    midPoint(p.shape, p.pivot);
    const mid = p.shape.start + p.shape.len / 2;
    const w = focusSmooth.current[i];
    const presence = smooth(0.04, 0.12, prog);
    // éclatement léger quand l'arche se découpe
    const out = split * 0.16;
    const base = target.set(Math.cos(mid) * out, Math.sin(mid) * out, -presence * (1 - w) * 0.35);
    // position de présentation : au centre du creux de l'arche, devant, vue de face
    const tx = -p.pivot.x;
    const ty = -0.5 - p.pivot.y;
    p.offset.set(lerp(base.x, tx, w), lerp(base.y, ty, w), lerp(base.z, 1.8, w));
    p.rot.set(
      lerp(0, 0.12 + Math.sin(t * 0.6 + i) * 0.05, w),
      lerp(0, Math.sin(t * 0.45 + i) * 0.28, w),
      lerp(0, (3 * Math.PI) / 2 - mid, w)
    );
    p.scale = lerp(1, 1.3, w);
    p.dim = presence * (1 - w) * 0.62;
  };

  return (
    <>
      <Studio dark />
      <group ref={root}>
        <group ref={tilt}>
          <Arch count={count} pose={pose} edge="#F5F0E9" edgeAmt={0.2} tube={0.42} />
        </group>
      </group>
    </>
  );
}

/* =====================================================================
   CTA FINAL — clôture : les segments se réassemblent, l'arche se ferme
   en anneau complet et le point vient se placer au centre.
   ===================================================================== */
export function RingScene({ count, mobile }: { count: number; mobile: boolean }) {
  const tilt = usePointerTilt(mobile ? 0 : 0.8);
  const spin = useRef<THREE.Group>(null);
  const dot = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const dotMat = useMemo(() => {
    const m = createArchMaterial({ edge: "#F5F0E9", edgeAmt: 0.55 });
    m.userData.uniforms.uColA.value = new THREE.Color("#8D3048");
    return m;
  }, []);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);

  useFrame((state, dt) => {
    const q = archState.ring.progress;
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const need = OUTER * 2.5;
    const d = Math.max(need / (2 * tanHalf), need / (2 * tanHalf * aspect));
    cam.position.set(0, 0, d);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    if (spin.current) {
      // une fois fermé, l'anneau tourne doucement sur lui-même
      const ring = smooth(0.42, 0.82, q);
      spin.current.rotation.z += dt * 0.12 * ring;
      spin.current.position.y = lerp(OUTER * 0.35, 0, ring);
    }
    if (dot.current) {
      const a = smooth(0.78, 1, q);
      const drop = easeOutBounce(a);
      dot.current.position.set(0, lerp(OUTER * 2.2, 0, drop), 0.1);
      dot.current.scale.setScalar(ARCH.r * 0.95 * Math.min(1, a * 3));
      dot.current.visible = a > 0.001;
      dotMat.userData.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const pose = (i: number, p: SegmentPose, t: number) => {
    const q = archState.ring.progress;
    const assemble = easeOut(smooth(0.0, 0.42, q));
    const ring = smooth(0.42, 0.82, q);
    p.shape = segmentShape(i, count, { ring, gap: (1 - assemble) * 0.12 });
    midPoint(p.shape, p.pivot);
    const mid = p.shape.start + p.shape.len / 2;
    const spread = (1 - assemble) * 1.4;
    const seed = i * 1.7 + 0.3;
    p.offset.set(Math.cos(mid) * spread, Math.sin(mid) * spread - spread * 0.2, Math.sin(seed) * spread);
    p.rot.set(Math.sin(seed + t * 0.3) * (1 - assemble) * 0.9, Math.cos(seed) * (1 - assemble) * 0.9, 0);
    p.scale = 1;
    p.dim = 0;
  };

  return (
    <>
      <Studio dark />
      <group ref={tilt}>
        <group ref={spin}>
          <Arch count={count} pose={pose} quality={mobile ? "low" : "high"} edge="#F5F0E9" edgeAmt={0.3} />
        </group>
        <mesh ref={dot} geometry={sphere} material={dotMat} visible={false} />
      </group>
    </>
  );
}

function easeOutBounce(x: number) {
  const n1 = 7.5625, d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

/* =====================================================================
   PAGE ACTIVITÉ — l'arche en retrait, le segment de l'activité extrait
   et présenté en grand au premier plan.
   ===================================================================== */
export function SegmentScene({ index, count, mobile }: { index: number; count: number; mobile: boolean }) {
  const tilt = usePointerTilt(mobile ? 0 : 1.2);
  const root = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const intro = useRef(0);

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const d = aspect < 1 ? 15 : 10.5;
    cam.position.set(0, 0.6, d);
    cam.lookAt(0, -0.3, 0);
    cam.updateProjectionMatrix();
    intro.current = Math.min(1, intro.current + dt * 0.55);
    if (root.current) root.current.position.set(0, 0.9, 0);
  });

  const pose = (i: number, p: SegmentPose, t: number) => {
    const w = i === index ? easeOut(intro.current) : 0;
    p.shape = segmentShape(i, count, { gap: 0.07 * easeOut(intro.current) });
    midPoint(p.shape, p.pivot);
    const mid = p.shape.start + p.shape.len / 2;
    p.offset.set(
      lerp(Math.cos(mid) * 0.12, -p.pivot.x, w),
      lerp(Math.sin(mid) * 0.12, -1.0 - p.pivot.y, w),
      lerp(-0.4 * easeOut(intro.current), 2.4, w)
    );
    p.rot.set(
      lerp(0, 0.18 + Math.sin(t * 0.5) * 0.05, w),
      lerp(0, Math.sin(t * 0.35) * 0.4, w),
      lerp(0, (3 * Math.PI) / 2 - mid, w)
    );
    p.scale = lerp(1, 1.45, w);
    p.dim = i === index ? 0 : 0.5 * easeOut(intro.current);
  };

  return (
    <>
      <Studio />
      <group ref={root}>
        <group ref={tilt}>
          <Arch count={count} pose={pose} quality={mobile ? "low" : "high"} edgeAmt={0.2} tube={0.46} />
        </group>
      </group>
    </>
  );
}
