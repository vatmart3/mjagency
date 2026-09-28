"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Ring({ progress, animate }: { progress: number; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shown = useRef(0);
  const arc = useRef<THREE.Mesh>(null);
  const target = Math.max(0.001, Math.min(1, progress));
  const geos = useMemo(() => {
    // Précalcule 60 paliers pour animer le remplissage sans recréer la géométrie à chaque image
    return Array.from({ length: 61 }, (_, i) => new THREE.TorusGeometry(1.35, 0.16, 32, 160, Math.max(0.001, (i / 60) * Math.PI * 2)));
  }, []);
  useFrame(({ clock }, dt) => {
    shown.current = animate ? shown.current + (target - shown.current) * Math.min(1, dt * 2.2) : target;
    if (arc.current) arc.current.geometry = geos[Math.round(shown.current * 60)];
    if (group.current) {
      group.current.rotation.x = animate ? -0.55 + Math.sin(clock.elapsedTime * 0.6) * 0.05 : -0.55;
      group.current.rotation.y = animate ? Math.sin(clock.elapsedTime * 0.4) * 0.12 : 0;
    }
  });
  return (
    <group ref={group} rotation={[-0.55, 0, 0]}>
      <mesh>
        <torusGeometry args={[1.35, 0.16, 32, 160]} />
        <meshStandardMaterial color="#ebebef" roughness={0.6} />
      </mesh>
      <mesh ref={arc} rotation={[0, 0, Math.PI / 2]} scale={[-1, 1, 1]} position={[0, 0, 0.01]} geometry={geos[0]}>
        <meshPhysicalMaterial color="#0071e3" roughness={0.25} metalness={0.35} clearcoat={1} clearcoatRoughness={0.2} emissive="#0071e3" emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

export default function GoalRing3D({ progress, animate, size = 240 }: { progress: number; animate: boolean; size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.6], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#bcd7f5" />
        <Ring progress={progress} animate={animate} />
      </Canvas>
    </div>
  );
}
