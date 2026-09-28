"use client";
/**
 * Enveloppes qui choisissent entre 3D (chargée à la demande) et repli 2D en SVG.
 * La 3D n'est jamais bloquante : chargement différé, désactivable dans Réglages.
 */
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";
import { CITIES } from "@/content/cities";
import { use3D } from "./use3d";
import { COAST, LAGOON, project } from "./geo";
import type { MapPoint } from "./ThauMap3D";

const ThauMap3D = dynamic(() => import("./ThauMap3D"), { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-[inherit] bg-mist" /> });
const GoalRing3D = dynamic(() => import("./GoalRing3D"), { ssr: false });

export type { MapPoint };

export function ThauMap({ points, height = 420, onOpen }: { points: MapPoint[]; height?: number; onOpen?: (id: string) => void }) {
  const { enabled, ready, animate } = use3D();
  if (!ready) return <div style={{ height }} className="w-full" />;
  if (enabled) return <ThauMap3D points={points} animate={animate} height={height} onOpen={onOpen} />;
  return <ThauMap2D points={points} height={height} onOpen={onOpen} />;
}

function ThauMap2D({ points, height, onOpen }: { points: MapPoint[]; height: number; onOpen?: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${(-y).toFixed(2)}`).join(" ") + "Z";
  const coast = COAST.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${(-y).toFixed(2)}`).join(" ");
  return (
    <svg viewBox="-12 -13 26 20" style={{ height }} className="w-full" role="img" aria-label="Carte du Bassin de Thau">
      <path d={`${coast} L 30,20 L -30,20 Z`} fill="#dfeaf6" />
      <path d={toPath(LAGOON)} fill="#cfe3f8" />
      {CITIES.map((c) => {
        const [x, y] = project(c.lat, c.lng);
        return (
          <g key={c.id}>
            <circle cx={x} cy={-y} r={0.08} fill="#1d1d1f" />
            <text x={x} y={-y + 0.6} fontSize={0.42} textAnchor="middle" fill="#6e6e73">
              {c.name}
            </text>
          </g>
        );
      })}
      {points.map((p) => {
        const [x, y] = project(p.lat, p.lng);
        return (
          <g key={p.id} onClick={() => (sel === p.id && onOpen ? onOpen(p.id) : setSel(p.id))} className="cursor-pointer">
            <circle cx={x} cy={-y} r={p.hot ? 0.5 : 0.35} fill={p.color} opacity={0.18} />
            <circle cx={x} cy={-y} r={sel === p.id ? 0.24 : 0.17} fill={p.color} />
            {sel === p.id && (
              <text x={x} y={-y - 0.45} fontSize={0.45} fontWeight={600} textAnchor="middle" fill="#1d1d1f">
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function GoalRing({ progress, size = 240 }: { progress: number; size?: number }) {
  const { enabled, ready, animate } = use3D();
  if (!ready) return <div style={{ width: size, height: size }} />;
  if (enabled) return <GoalRing3D progress={progress} animate={animate} size={size} />;
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ebebef" strokeWidth="8" />
      <motion.circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#0071e3"
        strokeWidth="8"
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - Math.min(1, progress)) }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
