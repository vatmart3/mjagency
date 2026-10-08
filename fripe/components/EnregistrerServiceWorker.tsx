"use client";

import { useEffect } from "react";

export function EnregistrerServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // sans service worker l'app marche quand même, simplement pas hors ligne
    });
  }, []);
  return null;
}
