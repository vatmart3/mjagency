import * as THREE from "three";

/* =====================================================================
   L'ARCHE — géométrie paramétrique d'un segment de tore.
   ---------------------------------------------------------------------
   Chaque segment est une grille (u le long de l'arc, v autour du tube)
   plus deux bouchons. La forme réelle est calculée dans le vertex shader
   à partir de quatre paramètres, ce qui permet de passer sans couture de
   « une arche entière » à « N segments » puis à « un anneau fermé » :
     uStart / uLen   angle de départ et longueur angulaire de l'arc
     uRoundA / uRoundB   arrondi des extrémités (0 = coupe franche, 1 = biseau)
   Le CPU calcule la même forme (sans le bruit) pour les ombres de contact
   et la boîte englobante.
   ===================================================================== */

export const ARCH = {
  R: 2.2, // rayon de l'arche
  r: 0.56, // rayon du tube (arche épaisse)
  bevel: 0.1, // rayon du biseau des extrémités
};

export const TAU = Math.PI * 2;

/** Géométrie d'un segment. aRow = (u le long de l'arc, k rayon relatif, côté du bouchon) */
export function createSegmentGeometry(rows = 72, radial = 40, capRings = 4) {
  const rowDefs: [number, number, number][] = [];
  // bouchon de départ : du centre vers le bord
  for (let i = 0; i < capRings; i++) rowDefs.push([0, i / capRings, -1]);
  // tube : répartition de Tchebychev, dense aux extrémités pour les biseaux
  for (let i = 0; i <= rows; i++) rowDefs.push([0.5 - 0.5 * Math.cos((Math.PI * i) / rows), 1, 0]);
  // bouchon de fin : du bord vers le centre
  for (let i = capRings - 1; i >= 0; i--) rowDefs.push([1, i / capRings, 1]);

  const cols = radial + 1;
  const count = rowDefs.length * cols;
  const aRow = new Float32Array(count * 3);
  const aPhi = new Float32Array(count);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  rowDefs.forEach(([u, k, cap], ri) => {
    for (let j = 0; j < cols; j++) {
      const idx = ri * cols + j;
      aRow[idx * 3] = u;
      aRow[idx * 3 + 1] = k;
      aRow[idx * 3 + 2] = cap;
      aPhi[idx] = j / radial;
    }
  });
  const indices: number[] = [];
  for (let ri = 0; ri < rowDefs.length - 1; ri++) {
    for (let j = 0; j < radial; j++) {
      const a = ri * cols + j;
      const b = a + cols;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  g.setAttribute("aRow", new THREE.BufferAttribute(aRow, 3));
  g.setAttribute("aPhi", new THREE.BufferAttribute(aPhi, 1));
  g.setIndex(indices);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), ARCH.R + ARCH.r + 1);
  return g;
}

export type SegmentShape = { start: number; len: number; roundA: number; roundB: number };

/** Même calcul que le shader (sans bruit) — remplit position/normal sur CPU. */
export function bakeSegment(g: THREE.BufferGeometry, s: SegmentShape) {
  const row = g.getAttribute("aRow") as THREE.BufferAttribute;
  const phiA = g.getAttribute("aPhi") as THREE.BufferAttribute;
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const nor = g.getAttribute("normal") as THREE.BufferAttribute;
  const { R, r, bevel } = ARCH;
  const arcLen = Math.max(s.len * R, 1e-4);
  for (let i = 0; i < row.count; i++) {
    const u = row.getX(i), k = row.getY(i), cap = row.getZ(i);
    const phi = phiA.getX(i) * TAU;
    const th = s.start + u * s.len;
    const c = Math.cos(th), sn = Math.sin(th);
    const N = [c * Math.cos(phi), sn * Math.cos(phi), Math.sin(phi)];
    const T = [-sn, c, 0];
    const bA = Math.min(bevel * s.roundA, arcLen * 0.45);
    const bB = Math.min(bevel * s.roundB, arcLen * 0.45);
    let rho = r, nx = N[0], ny = N[1], nz = N[2];
    const sA = u * arcLen, sB = (1 - u) * arcLen;
    if (cap === 0) {
      if (bA > 0 && sA < bA) {
        const a = (bA - sA) / bA, q = Math.sqrt(Math.max(1 - a * a, 0));
        rho = r - bA + bA * q;
        nx = N[0] * q - T[0] * a; ny = N[1] * q - T[1] * a; nz = N[2] * q - T[2] * a;
      } else if (bB > 0 && sB < bB) {
        const a = (bB - sB) / bB, q = Math.sqrt(Math.max(1 - a * a, 0));
        rho = r - bB + bB * q;
        nx = N[0] * q + T[0] * a; ny = N[1] * q + T[1] * a; nz = N[2] * q + T[2] * a;
      }
    } else {
      const b = cap < 0 ? bA : bB;
      rho = (r - b) * k - 0.006 * (1 - Math.min(1, b * 60));
      nx = T[0] * cap; ny = T[1] * cap; nz = 0;
    }
    const len = Math.hypot(nx, ny, nz) || 1;
    pos.setXYZ(i, c * R + N[0] * rho, sn * R + N[1] * rho, N[2] * rho);
    nor.setXYZ(i, nx / len, ny / len, nz / len);
  }
  pos.needsUpdate = true;
  nor.needsUpdate = true;
}

/* ---------------------------------------------------------------------
   MATÉRIAU — MeshPhysicalMaterial satiné (clearcoat + sheen),
   dégradé #641E32 → #8D3048, bords translucides simulés (fresnel),
   respiration très lente par bruit simplex dans le vertex shader.
   --------------------------------------------------------------------- */

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export type ArchUniforms = {
  uStart: { value: number };
  uLen: { value: number };
  uRoundA: { value: number };
  uRoundB: { value: number };
  uTime: { value: number };
  uBreath: { value: number };
  uDim: { value: number };
  uR: { value: number };
  uTube: { value: number };
  uBevel: { value: number };
  uColA: { value: THREE.Color };
  uColB: { value: THREE.Color };
  uEdge: { value: THREE.Color };
  uEdgeAmt: { value: number };
};

export type ArchMaterial = THREE.MeshPhysicalMaterial & { userData: { uniforms: ArchUniforms } };

export function createArchMaterial(opts: { edge?: string; edgeAmt?: number } = {}): ArchMaterial {
  const uniforms: ArchUniforms = {
    uStart: { value: Math.PI },
    uLen: { value: Math.PI },
    uRoundA: { value: 1 },
    uRoundB: { value: 1 },
    uTime: { value: 0 },
    uBreath: { value: 1 },
    uDim: { value: 0 },
    uR: { value: ARCH.R },
    uTube: { value: ARCH.r },
    uBevel: { value: ARCH.bevel },
    uColA: { value: new THREE.Color("#641E32") },
    uColB: { value: new THREE.Color("#8D3048") },
    uEdge: { value: new THREE.Color(opts.edge ?? "#F5F0E9") },
    uEdgeAmt: { value: opts.edgeAmt ?? 0.22 },
  };

  const mat = new THREE.MeshPhysicalMaterial({
    color: "#641E32",
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.32,
    sheen: 0.8,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color("#8D3048"),
    envMapIntensity: 0.55,
  }) as ArchMaterial;
  mat.userData.uniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
attribute vec3 aRow;
attribute float aPhi;
uniform float uStart, uLen, uRoundA, uRoundB, uTime, uBreath, uR, uTube, uBevel;
varying float vGrad;
varying float vPhi;
${SIMPLEX}`
      )
      .replace(
        "#include <beginnormal_vertex>",
        /* glsl */ `
float u = aRow.x; float k = aRow.y; float cap = aRow.z;
float phi = aPhi * 6.28318530718;
float th = uStart + u * uLen;
vec3 Rd = vec3(cos(th), sin(th), 0.0);
vec3 Nn = vec3(Rd.xy * cos(phi), sin(phi));
vec3 Tn = vec3(-Rd.y, Rd.x, 0.0);
float arcLen = max(uLen * uR, 1e-4);
float bA = min(uBevel * uRoundA, arcLen * 0.45);
float bB = min(uBevel * uRoundB, arcLen * 0.45);
float rho = uTube;
vec3 nrm = Nn;
float sA = u * arcLen; float sB = (1.0 - u) * arcLen;
if (cap == 0.0) {
  if (bA > 0.0 && sA < bA) {
    float a = (bA - sA) / bA; float q = sqrt(max(1.0 - a * a, 0.0));
    rho = uTube - bA + bA * q; nrm = Nn * q - Tn * a;
  } else if (bB > 0.0 && sB < bB) {
    float a = (bB - sB) / bB; float q = sqrt(max(1.0 - a * a, 0.0));
    rho = uTube - bB + bB * q; nrm = Nn * q + Tn * a;
  }
} else {
  float b = cap < 0.0 ? bA : bB;
  rho = (uTube - b) * k - 0.006 * (1.0 - clamp(b * 60.0, 0.0, 1.0)); nrm = Tn * cap;
}
vec3 center = Rd * uR;
// respiration : bruit lent, amplitude faible, pas d'effet gélatine
float n = snoise(vec3(center.xy * 0.55, uTime * 0.12)) * 0.5 + snoise(vec3(Nn * 1.3 + uTime * 0.08)) * 0.5;
rho *= 1.0 + n * 0.022 * uBreath;
vec3 archPos = center + Nn * rho;
if (cap != 0.0) archPos = center + Nn * rho;
vec3 objectNormal = normalize(nrm);
vGrad = clamp(0.5 + 0.38 * cos(phi) * -1.0 + 0.25 * sin(th * 1.0 + 0.6), 0.0, 1.0);
vPhi = phi;
#ifdef USE_TANGENT
  vec3 objectTangent = vec3( tangent.xyz );
#endif`
      )
      .replace("#include <begin_vertex>", "vec3 transformed = archPos;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
uniform vec3 uColA, uColB, uEdge;
uniform float uDim, uEdgeAmt;
varying float vGrad;
varying float vPhi;`
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
diffuseColor.rgb = mix(uColA, uColB, vGrad);
diffuseColor.rgb *= 1.0 - uDim * 0.72;`
      )
      .replace(
        "#include <opaque_fragment>",
        /* glsl */ `
// bords translucides simulés : la lumière traverse la matière au bord du volume
float fres = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.6);
outgoingLight = mix(outgoingLight, uEdge * (0.55 + 0.45 * vGrad), fres * uEdgeAmt * (1.0 - uDim * 0.8));
#include <opaque_fragment>`
      );
  };
  // un seul programme pour toutes les instances
  mat.customProgramCacheKey = () => "mj-arch-v1";
  return mat;
}

/** Configuration « arche » (demi-anneau ouvert vers le haut) ou « anneau » pour le segment i/N. */
export function segmentShape(i: number, n: number, opts: { ring?: number; gap?: number } = {}): SegmentShape {
  const ring = opts.ring ?? 0;
  const gap = opts.gap ?? 0; // en radians, réparti de chaque côté
  const total = Math.PI + ring * Math.PI; // π → 2π
  const step = total / n;
  const start = Math.PI + i * step + gap / 2;
  const len = Math.max(step - gap, 0.001);
  const inner = Math.min(1, gap * 30); // arrondi des coupes intérieures quand ça s'ouvre
  const roundA = i === 0 ? Math.max(1 - ring, inner) : inner;
  const roundB = i === n - 1 ? Math.max(1 - ring, inner) : inner;
  return { start, len, roundA, roundB };
}

export function applyShape(u: ArchUniforms, s: SegmentShape) {
  u.uStart.value = s.start;
  u.uLen.value = s.len;
  u.uRoundA.value = s.roundA;
  u.uRoundB.value = s.roundB;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
