"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Le cintre de FRIPE : un tube suivant le contour d'un cintre, une étiquette
// de prix en carton qui pend au bout d'un fil. Tout est construit ici, sans
// modèle ni texture à télécharger.

type Props = {
  actif?: boolean; // pendant l'analyse : il tourne, un anneau le « scanne »
  reduit?: boolean; // prefers-reduced-motion : image fixe
  className?: string;
};

export default function Cintre3D({ actif = false, reduit = false, className }: Props) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 3.4], fov: 32 }}
        frameloop={reduit ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2.5, 3, 2]} intensity={1.6} />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.2} position={[0, 2, 3]} scale={[4, 1.5, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#ffd9c4" position={[-3, 0, 1]} scale={[1.5, 3, 1]} />
          <Lightformer form="ring" intensity={0.8} position={[3, 1, -2]} scale={1.5} />
        </Environment>

        <Float speed={reduit ? 0 : 1.4} rotationIntensity={reduit ? 0 : 0.25} floatIntensity={reduit ? 0 : 0.5}>
          <Cintre actif={actif} reduit={reduit} />
        </Float>

        <ContactShadows position={[0, -1.15, 0]} opacity={0.28} scale={4} blur={2.6} far={2} />
      </Canvas>
    </div>
  );
}

function Cintre({ actif, reduit }: { actif: boolean; reduit: boolean }) {
  const groupe = useRef<THREE.Group>(null);
  const etiquette = useRef<THREE.Group>(null);
  const anneau = useRef<THREE.Mesh>(null);
  const vitesse = useRef(0);

  const { corps, crochet } = useMemo(() => {
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    // Les épaules : un triangle aux angles adoucis, refermé sur le col.
    const epaules = new THREE.CatmullRomCurve3(
      [v(0, 0.5), v(-0.45, 0.22), v(-0.92, -0.08), v(-0.96, -0.2), v(-0.86, -0.25), v(0, -0.25), v(0.86, -0.25), v(0.96, -0.2), v(0.92, -0.08), v(0.45, 0.22)],
      true,
      "centripetal",
      0.5,
    );
    // Le crochet : il monte du col puis s'enroule.
    const boucle = new THREE.CatmullRomCurve3(
      [v(0, 0.5), v(0, 0.66), v(0.03, 0.78), v(0.13, 0.86), v(0.17, 0.98), v(0.08, 1.08), v(-0.05, 1.06), v(-0.1, 0.97)],
      false,
      "centripetal",
    );
    return {
      corps: new THREE.TubeGeometry(epaules, 220, 0.035, 14, true),
      crochet: new THREE.TubeGeometry(boucle, 90, 0.026, 12, false),
    };
  }, []);

  const formeEtiquette = useMemo(() => {
    // Étiquette de prix : rectangle à coins arrondis, pointe en haut, trou.
    const s = new THREE.Shape();
    const l = 0.17;
    const h = 0.42;
    const r = 0.03;
    s.moveTo(0, 0);
    s.lineTo(l, -0.11);
    s.lineTo(l, -h + r);
    s.quadraticCurveTo(l, -h, l - r, -h);
    s.lineTo(-l + r, -h);
    s.quadraticCurveTo(-l, -h, -l, -h + r);
    s.lineTo(-l, -0.11);
    s.closePath();
    const trou = new THREE.Path();
    trou.absarc(0, -0.08, 0.025, 0, Math.PI * 2, true);
    s.holes.push(trou);
    return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
  }, []);

  const texteEtiquette = useMemo(() => {
    // Un « € » dessiné dans un canvas : pas de police à charger depuis un CDN.
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#d6b27f";
    ctx.fillRect(0, 0, 256, 512);
    ctx.fillStyle = "#17150f";
    ctx.textAlign = "center";
    ctx.font = "600 150px Georgia, serif";
    ctx.fillText("€", 128, 330);
    ctx.fillRect(58, 400, 140, 6);
    ctx.fillRect(78, 425, 100, 6);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  // Les UV de ExtrudeGeometry suivent les coordonnées de la forme : on les
  // ramène dans [0, 1] pour que la texture couvre exactement la face.
  useMemo(() => {
    const uv = formeEtiquette.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (uv.getX(i) + 0.17) / 0.34, (uv.getY(i) + 0.42) / 0.42);
    }
    uv.needsUpdate = true;
  }, [formeEtiquette]);

  useFrame((state, delta) => {
    if (reduit || !groupe.current) return;
    const t = state.clock.elapsedTime;
    vitesse.current = THREE.MathUtils.damp(vitesse.current, actif ? 2.4 : 0.25, 3, delta);
    groupe.current.rotation.y += delta * vitesse.current;
    groupe.current.rotation.z = Math.sin(t * 0.8) * 0.04;
    if (etiquette.current) {
      etiquette.current.rotation.z = Math.sin(t * 1.6 + 0.6) * (actif ? 0.22 : 0.12);
      etiquette.current.rotation.x = Math.sin(t * 1.1) * 0.08;
    }
    if (anneau.current) {
      const m = anneau.current.material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.damp(m.opacity, actif ? 0.85 : 0, 4, delta);
      anneau.current.position.y = Math.sin(t * 2.2) * 0.62 + 0.35;
    }
  });

  return (
    <group ref={groupe} position={[0, -0.2, 0]} scale={1.05}>
      <mesh geometry={corps}>
        <meshPhysicalMaterial color="#c8925c" roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh geometry={crochet}>
        <meshStandardMaterial color="#c9c3b8" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* fil + étiquette, accrochés à la barre */}
      <group position={[0.42, -0.25, 0]}>
        <group ref={etiquette}>
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.18, 6]} />
            <meshStandardMaterial color="#17150f" />
          </mesh>
          <mesh geometry={formeEtiquette} position={[0, -0.1, -0.006]}>
            <meshStandardMaterial map={texteEtiquette} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* anneau de « scan », visible seulement pendant l'analyse */}
      <mesh ref={anneau} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.008, 8, 120]} />
        <meshBasicMaterial color="#ff5b2e" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}
