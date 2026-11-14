"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ARCH,
  applyShape,
  bakeSegment,
  createArchMaterial,
  createSegmentGeometry,
  segmentShape,
  type ArchMaterial,
  type SegmentShape,
} from "./archCore";

export type SegmentPose = {
  shape: SegmentShape;
  /** point de pivot (espace de l'arche) — généralement le milieu du segment */
  pivot: THREE.Vector3;
  offset: THREE.Vector3;
  rot: THREE.Euler;
  scale: number;
  dim: number;
};

export function makePose(): SegmentPose {
  return {
    shape: { start: Math.PI, len: Math.PI, roundA: 1, roundB: 1 },
    pivot: new THREE.Vector3(),
    offset: new THREE.Vector3(),
    rot: new THREE.Euler(),
    scale: 1,
    dim: 0,
  };
}

/** Milieu de l'arc d'une forme, sur le rayon R */
export function midPoint(s: SegmentShape, out: THREE.Vector3) {
  const m = s.start + s.len / 2;
  return out.set(Math.cos(m) * ARCH.R, Math.sin(m) * ARCH.R, 0);
}

type Props = {
  count: number;
  /** remplit pose pour le segment i à chaque image */
  pose: (i: number, p: SegmentPose, t: number) => void;
  quality?: "high" | "low";
  edge?: string;
  edgeAmt?: number;
  breath?: number;
  /** rayon du tube (par défaut ARCH.r) */
  tube?: number;
  /** forme « au repos » calculée sur CPU (ombres de contact) */
  bakeShape?: (i: number) => SegmentShape;
};

/** N segments d'arche pilotés image par image, sans rendu React. */
export default function Arch({ count, pose, quality = "high", edge, edgeAmt, breath = 1, bakeShape, tube }: Props) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const poses = useMemo(() => Array.from({ length: count }, makePose), [count]);

  const parts = useMemo(() => {
    const rows = quality === "high" ? Math.max(28, Math.round(120 / count)) : Math.max(16, Math.round(60 / count));
    const radial = quality === "high" ? 44 : 24;
    return Array.from({ length: count }, (_, i) => {
      const g = createSegmentGeometry(rows, radial, quality === "high" ? 4 : 2);
      // forme de repos (arche entière) : sert aux ombres de contact
      bakeSegment(g, bakeShape ? bakeShape(i) : segmentShape(i, count));
      const m = createArchMaterial({ edge, edgeAmt });
      m.userData.uniforms.uBreath.value = breath;
      if (tube) m.userData.uniforms.uTube.value = tube;
      return { g, m };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, quality, edge, edgeAmt, breath, tube]);

  useEffect(
    () => () => {
      parts.forEach(({ g, m }) => {
        g.dispose();
        m.dispose();
      });
    },
    [parts]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = poses[i];
      pose(i, p, t);
      const grp = groups.current[i];
      const mesh = meshes.current[i];
      const u = (parts[i].m as ArchMaterial).userData.uniforms;
      applyShape(u, p.shape);
      u.uTime.value = t;
      u.uDim.value = p.dim;
      if (grp && mesh) {
        mesh.position.copy(p.pivot).multiplyScalar(-1);
        grp.position.copy(p.pivot).add(p.offset);
        grp.rotation.copy(p.rot);
        grp.scale.setScalar(p.scale);
      }
    }
  });

  return (
    <>
      {parts.map(({ g, m }, i) => (
        <group key={i} ref={(el) => void (groups.current[i] = el)}>
          <mesh
            ref={(el) => void (meshes.current[i] = el)}
            geometry={g}
            material={m}
            frustumCulled={false}
            castShadow={false}
          />
        </group>
      ))}
    </>
  );
}
