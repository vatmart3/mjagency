"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/** Équivalent GSAP de cubic-bezier(0.22, 1, 0.36, 1) */
export const EASE = "power4.out";
export { gsap, ScrollTrigger };
