"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CITIES } from "@/content/cities";
import { LAGOON, SEA, project } from "./geo";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  color: string;
  label: string;
  sub?: string;
  hot?: boolean;
}

/** Décalage des noms de villes (x, z) pour éviter les chevauchements autour de Balaruc. */
const LABEL_OFFSET: Record<string, [number, number]> = {
  "balaruc-le-vieux": [0.4, -0.45],
  bouzigues: [-1.1, -0.35],
  "balaruc-les-bains": [0.2, 0.55],
  sete: [0.6, 0.5],
  frontignan: [0.2, 0.5],
};

/**
 * Étiquette dessinée dans une texture (pas de <Html> de drei : ses racines React
 * se démontent mal lors d'une navigation, et le texte reste net en 3D).
 */
function Label({ text, sub, position, size = 0.55, strong = false }: { text: string; sub?: string; position: [number, number, number]; size?: number; strong?: boolean }) {
  const { tex, aspect } = useMemo(() => {
    const scale = 4;
    const font = `${strong ? 600 : 500} ${28 * scale}px -apple-system, "SF Pro Text", "Geist", system-ui, sans-serif`;
    const subFont = `400 ${24 * scale}px -apple-system, "SF Pro Text", "Geist", system-ui, sans-serif`;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    ctx.font = font;
    const w1 = ctx.measureText(text).width;
    ctx.font = subFont;
    const w2 = sub ? ctx.measureText("  " + sub).width : 0;
    const padX = strong ? 22 * scale : 4 * scale;
    c.width = Math.ceil(w1 + w2 + padX * 2);
    c.height = 48 * scale;
    if (strong) {
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      const r = c.height / 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, c.width, c.height, r);
      ctx.fill();
    }
    ctx.textBaseline = "middle";
    ctx.font = font;
    ctx.fillStyle = strong ? "#1d1d1f" : "#6e6e73";
    ctx.fillText(text, padX, c.height / 2 + scale);
    if (sub) {
      ctx.font = subFont;
      ctx.fillStyle = "#6e6e73";
      ctx.fillText("  " + sub, padX + w1, c.height / 2 + scale);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { tex: t, aspect: c.width / c.height };
  }, [text, sub, strong]);
  return (
    <sprite position={position} scale={[size * aspect, size, 1]} renderOrder={strong ? 10 : 5}>
      <spriteMaterial map={tex} transparent depthTest={!strong} toneMapped={false} />
    </sprite>
  );
}

function shapeFrom(points: [number, number][]) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return new THREE.ShapeGeometry(s, 24);
}

function Flat({ points, color, y, opacity = 1 }: { points: [number, number][]; color: string; y: number; opacity?: number }) {
  const geo = useMemo(() => shapeFrom(points), [points]);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <meshBasicMaterial color={color} transparent={opacity < 1} opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function Point({ p, onSelect, selected, animate }: { p: MapPoint; onSelect: (id: string) => void; selected: boolean; animate: boolean }) {
  const [x, y] = project(p.lat, p.lng);
  const halo = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 10, [p.id]);
  useFrame(({ clock }) => {
    if (!halo.current) return;
    const t = animate ? (clock.elapsedTime * 0.8 + seed / 10) % 1 : 0.5;
    halo.current.scale.setScalar(1 + t * (p.hot ? 3.2 : 2));
    (halo.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (p.hot ? 0.55 : 0.3);
  });
  const color = new THREE.Color(p.color);
  return (
    <group position={[x, 0, -y]}>
      <mesh
        position={[0, 0.18, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(p.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <sphereGeometry args={[selected ? 0.26 : 0.19, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} roughness={0.3} />
      </mesh>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.2, 0.26, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      {selected && <Label text={p.label} sub={p.sub} position={[0, 0.9, 0]} size={0.62} strong />}
    </group>
  );
}

function Scene({ points, animate, onSelect, selected }: { points: MapPoint[]; animate: boolean; onSelect: (id: string) => void; selected: string | null }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current && animate) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08;
  });
  return (
    <group ref={group}>
      {/* Terre */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshBasicMaterial color="#fbfbfd" toneMapped={false} />
      </mesh>
      <Flat points={SEA} color="#e6f0fb" y={0} />
      <Flat points={LAGOON} color="#c6ddf7" y={0.01} />
      {CITIES.map((c) => {
        const [x, y] = project(c.lat, c.lng);
        return (
          <group key={c.id} position={[x, 0.02, -y]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.07, 16]} />
              <meshBasicMaterial color="#1d1d1f" />
            </mesh>
            <Label text={c.name} position={[LABEL_OFFSET[c.id]?.[0] ?? 0, 0.05, LABEL_OFFSET[c.id]?.[1] ?? 0.5]} size={0.5} />
          </group>
        );
      })}
      {points.map((p) => (
        <Point key={p.id} p={p} animate={animate} onSelect={onSelect} selected={selected === p.id} />
      ))}
    </group>
  );
}

export default function ThauMap3D({
  points,
  animate,
  height = 420,
  onOpen,
}: {
  points: MapPoint[];
  animate: boolean;
  height?: number;
  onOpen?: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{ height }} className="relative w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0.5, 15, 12.5], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 8]} intensity={0.9} />
        <Scene
          points={points}
          animate={animate}
          selected={selected}
          onSelect={(id) => {
            if (selected === id && onOpen) onOpen(id);
            setSelected(id);
          }}
        />
        <OrbitControls
          target={[0.5, 0, -1.5]}
          enablePan
          enableDamping
          minDistance={6}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.6}
          minPolarAngle={0.2}
          touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }}
          mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
        />
      </Canvas>
      {selected && onOpen && (
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] text-ink-3">Touchez à nouveau pour ouvrir le dossier</p>
      )}
    </div>
  );
}
