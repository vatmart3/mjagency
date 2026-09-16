"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { MockupTarget } from "@/lib/mockup";
import { hasWebGL } from "@/lib/pointer";
import Fallback2D from "./Fallback2D";

// Le canvas 3D n'est chargé qu'une fois la page interactive : le formulaire
// s'affiche et se remplit sans attendre three.js.
const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

function StageSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-[46%] w-[72%] max-w-[560px] animate-pulse rounded-xl bg-[var(--color-ink)]/[0.04]" />
    </div>
  );
}

export default function MockupStage({
  target,
  spin = false,
  reduced = false,
  onSpinDone,
}: {
  target: MockupTarget;
  spin?: boolean;
  reduced?: boolean;
  onSpinDone?: () => void;
}) {
  const [mode, setMode] = useState<"pending" | "webgl" | "flat">("pending");

  useEffect(() => {
    // Un temps d'avance laissé au formulaire avant d'allumer la 3D.
    const id = window.setTimeout(() => setMode(hasWebGL() ? "webgl" : "flat"), 120);
    return () => window.clearTimeout(id);
  }, []);

  if (mode === "pending") return <StageSkeleton />;
  if (mode === "flat") return <Fallback2D target={target} spin={spin} reduced={reduced} />;
  return <Scene3D target={target} spin={spin} reduced={reduced} onSpinDone={onSpinDone} />;
}
