"use client";
import { useEffect, useState } from "react";
import { usePrefs } from "@/store/prefs";

/** 3D seulement si : activée sur cet appareil, WebGL dispo. Le mouvement suit prefers-reduced-motion. */
export function use3D() {
  const three = usePrefs((s) => s.three);
  const motionPref = usePrefs((s) => s.motion);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(Boolean(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return { enabled: three && webgl === true, ready: webgl !== null, animate: motionPref && !reduced };
}
