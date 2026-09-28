"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Item {
  href: string;
  label: string;
  icon: IconName;
  mobile: boolean;
}

const ITEMS: Item[] = [
  { href: "/", label: "Brief", icon: "brief", mobile: true },
  { href: "/clients", label: "Clients", icon: "clients", mobile: true },
  { href: "/terrain", label: "Terrain", icon: "terrain", mobile: true },
  { href: "/telephone", label: "Téléphone", icon: "phone", mobile: true },
  { href: "/scripts", label: "Scripts", icon: "scripts", mobile: false },
  { href: "/methode", label: "Méthode", icon: "method", mobile: false },
  { href: "/entrainement", label: "Entraînement", icon: "training", mobile: false },
  { href: "/tableau", label: "Objectifs", icon: "dashboard", mobile: false },
  { href: "/reglages", label: "Réglages", icon: "settings", mobile: false },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));

/** Navigation principale : un dock flottant en bas d'écran, desktop et mobile. */
export function Dock() {
  const path = usePathname();
  const [more, setMore] = useState(false);
  const moreActive = ITEMS.some((i) => !i.mobile && isActive(path, i.href));

  return (
    <>
      <nav
        aria-label="Navigation principale"
        className="no-print fixed inset-x-0 z-50 flex justify-center px-3"
        style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
          className="sheet flex items-center gap-0.5 rounded-[26px] p-1.5 shadow-[var(--shadow-dock)] ring-1 ring-black/5"
        >
          {ITEMS.map((item) => (
            <DockLink key={item.href} item={item} active={isActive(path, item.href)} className={item.mobile ? "" : "hidden md:flex"} />
          ))}
          <button
            onClick={() => setMore(true)}
            className={`group relative flex h-14 w-[62px] flex-col items-center justify-center gap-0.5 rounded-[20px] md:hidden ${
              moreActive ? "text-blue" : "text-ink-2"
            }`}
            aria-label="Plus de sections"
          >
            {moreActive && <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-[20px] bg-blue-soft" />}
            <Icon name="more" size={24} strokeWidth={2.6} className="relative" />
            <span className="relative text-[10.5px] font-medium">Plus</span>
          </button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {more && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <motion.div className="absolute inset-0 bg-black/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMore(false)} />
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="sheet absolute inset-x-3 grid grid-cols-3 gap-2 rounded-[28px] p-3 shadow-[var(--shadow-lift)]"
              style={{ bottom: "calc(max(12px, env(safe-area-inset-bottom)) + 84px)" }}
            >
              {ITEMS.filter((i) => !i.mobile).map((item, k) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * k }}>
                  <Link
                    href={item.href}
                    onClick={() => setMore(false)}
                    className={`flex h-24 flex-col items-center justify-center gap-2 rounded-[20px] ${
                      isActive(path, item.href) ? "bg-blue text-white" : "bg-white text-ink"
                    }`}
                  >
                    <Icon name={item.icon} size={26} />
                    <span className="text-[13px] font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function DockLink({ item, active, className }: { item: Item; active: boolean; className: string }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-14 w-[62px] flex-col items-center justify-center gap-0.5 rounded-[20px] md:w-[74px] ${
        active ? "text-blue" : "text-ink-2 hover:text-ink"
      } ${className}`}
    >
      {active && <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-[20px] bg-blue-soft" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
      <motion.span className="relative" whileHover={{ y: -2 }} whileTap={{ scale: 0.88 }}>
        <Icon name={item.icon} size={24} />
      </motion.span>
      <span className="relative text-[10.5px] font-medium tracking-tight">{item.label}</span>
    </Link>
  );
}
