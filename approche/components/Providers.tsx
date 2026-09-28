"use client";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { SessionProvider } from "@/lib/session";
import { usePrefs } from "@/store/prefs";
import { Toaster } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const motion = usePrefs((s) => s.motion);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  return (
    <MotionConfig reducedMotion={motion ? "user" : "always"} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </MotionConfig>
  );
}
