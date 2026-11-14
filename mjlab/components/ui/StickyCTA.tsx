"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useUI, isInProgress } from "@/lib/store";
import { useHydrated } from "@/lib/hooks";
import { ArrowUpRight } from "./Icons";

/** Pilule persistante après le hero. Disparaît quand la section contact (ou le pied
    de page) est visible. Projet commencé dans le formulaire : « Reprendre votre projet ». */
export default function StickyCTA() {
  const [past, setPast] = useState(false);
  const [covered, setCovered] = useState(false);
  const pathname = usePathname();
  const { openContact, contactOpen, contactInView, menuOpen } = useUI();
  const form = useForm();
  const hydrated = useHydrated();
  const resume = hydrated && isInProgress(form);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // zones où la pilule s'efface : contact, CTA d'activité, pied de page
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setCovered(visible.size > 0);
      },
      { threshold: 0.15 }
    );
    const t = setTimeout(() => document.querySelectorAll("#contact, #footer, [data-hide-cta]").forEach((el) => io.observe(el)), 300);
    return () => {
      clearTimeout(t);
      io.disconnect();
      setCovered(false);
    };
  }, [pathname]);

  const visible = past && !covered && !contactOpen && !contactInView && !menuOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 z-[70] md:bottom-6 md:right-6"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() => openContact()}
            data-cursor="↗"
            className="group flex items-center gap-3 rounded-full border border-creme/25 bg-bordeaux py-1.5 pl-4 pr-1.5 text-[0.875rem] font-medium text-blanc shadow-[0_18px_40px_-18px_rgba(37,35,38,.55)] transition-colors duration-300 hover:bg-bordeaux-light md:py-2 md:pl-5 md:pr-2 md:text-[0.9375rem]"
          >
            {resume && <span className="h-2 w-2 animate-pulse rounded-full bg-creme" aria-hidden="true" />}
            {resume ? "Reprendre votre projet" : "Lancer un projet"}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-creme text-bordeaux transition-transform duration-300 group-hover:rotate-45 md:h-9 md:w-9">
              <ArrowUpRight size={16} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
