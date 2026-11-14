"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { useUI } from "@/lib/store";
import { Wordmark } from "./Logo";
import TransitionLink from "./TransitionLink";
import { ArrowUpRight, Close, MenuIcon } from "./Icons";

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const { openContact, menuOpen, setMenu, contactOpen } = useUI();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 60);
      if (Math.abs(y - last.current) > 6) {
        setHidden(y > last.current && y > 240);
        last.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenu]);

  const show = !hidden || menuOpen;

  return (
    <>
      <a href="#contenu" className="sr-only-focusable fixed left-4 top-4 z-[120] rounded-full bg-noir px-4 py-2 text-creme">
        Aller au contenu
      </a>
      <header
        className="fixed inset-x-0 top-0 z-[80] flex justify-center transition-transform duration-500"
        style={{
          transform: show && !contactOpen ? "translateY(0)" : "translateY(-130%)",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <div
          className={`mt-3 flex w-[calc(100%-1.5rem)] max-w-[1180px] items-center justify-between rounded-full border border-beige bg-creme/80 backdrop-blur-md transition-all duration-500 md:mt-4 ${
            compact ? "max-w-[880px] py-1.5 pl-5 pr-1.5" : "py-2 pl-6 pr-2"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out)" }}
        >
          <TransitionLink href="/" aria-label="MJ LAB — accueil" data-cursor="↗" className="py-1">
            <Wordmark className={`transition-all duration-500 ${compact ? "text-[1.35rem]" : "text-[1.6rem]"}`} />
          </TransitionLink>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-0.5 rounded-full bg-beige/70 p-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className="group relative block rounded-full px-4 py-2 text-[0.875rem] font-medium text-noir transition-colors duration-300 hover:bg-creme"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openContact()}
              aria-label="Ouvrir le panneau contact — lancer un projet"
              data-cursor="↗"
              className={`group flex items-center justify-center rounded-full bg-bordeaux text-blanc transition-all duration-500 hover:bg-bordeaux-light ${
                compact ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
              <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
            </button>
            <button
              type="button"
              onClick={() => setMenu(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-beige text-noir md:hidden"
            >
              {menuOpen ? <Close /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  const { menuOpen, setMenu, openContact } = useUI();
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-theme="bordeaux"
          className="on-dark fixed inset-0 z-[75] flex flex-col justify-between bg-bordeaux px-6 pb-8 pt-28 text-blanc md:hidden"
          initial={{ clipPath: "circle(0% at 92% 6%)" }}
          animate={{ clipPath: "circle(150% at 92% 6%)" }}
          exit={{ clipPath: "circle(0% at 92% 6%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav aria-label="Navigation mobile">
            <ul className="space-y-1">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TransitionLink
                    href={item.href}
                    onClick={() => setMenu(false)}
                    className="flex items-baseline gap-3 font-display text-[3.2rem] font-extrabold leading-[1] tracking-[-0.05em]"
                  >
                    <span className="mono text-creme/60">0{i + 1}</span>
                    <span>
                      {item.label}
                      <span className="text-bordeaux-light">.</span>
                    </span>
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => openContact()}
              className="flex w-full items-center justify-between rounded-full bg-creme px-6 py-4 font-medium text-noir"
            >
              Lancer un projet <ArrowUpRight />
            </button>
            <p className="mono text-creme/70">{site.signature.toUpperCase()} — {site.location.coords}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
