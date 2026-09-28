"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Scenario } from "@/content/types";
import { profileById } from "@/content/profiles";
import { getSector } from "@/content/sectors";

/**
 * Carte « personnage prospect » en 3D (CSS) : légère inclinaison au doigt,
 * se retourne pour révéler le rôle. Seul le joueur « prospect » la voit.
 */
export function FlipCard({ scenario, flipped, onFlip }: { scenario: Scenario; flipped: boolean; onFlip: () => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });
  const c = scenario.character;
  const p = profileById[c.disc];

  return (
    <div
      className="perspective mx-auto w-full max-w-[420px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => (mx.set(0), my.set(0))}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="preserve-3d">
        <motion.button
          type="button"
          onClick={onFlip}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="preserve-3d relative block aspect-[3/4.4] w-full text-left"
          aria-label={flipped ? "Cacher la carte" : "Révéler le rôle"}
        >
          {/* Dos */}
          <div className="backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-7 text-white shadow-[var(--shadow-lift)]">
            <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              <span>Carte secrète</span>
              <span>Niveau {scenario.difficulty}</span>
            </div>
            <div className="relative">
              <div className="absolute -left-10 -top-24 size-64 rounded-full border border-white/10" />
              <div className="absolute -right-16 top-4 size-48 rounded-full border border-white/10" />
              <p className="display relative text-[52px] leading-none">Votre rôle.</p>
              <p className="relative mt-3 text-[15px] text-white/60">Touchez pour retourner. Ne montrez pas l&apos;écran.</p>
            </div>
            <p className="text-[12px] text-white/40">APPROCHE · Salle d&apos;entraînement</p>
          </div>
          {/* Face */}
          <div
            className="backface-hidden absolute inset-0 overflow-y-auto rounded-[28px] bg-white p-6 shadow-[var(--shadow-lift)] ring-1 ring-line"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: p.color }}>
              {p.name}
            </p>
            <p className="display mt-2 text-[34px]">
              {c.firstName}, {c.age} ans
            </p>
            <p className="text-[14px] text-ink-2">
              {c.role} · {scenario.seller.business} · {getSector(scenario.sector)?.short}
            </p>
            <dl className="mt-4 space-y-3 text-[14px] leading-snug">
              <Row k="Humeur">{c.mood}</Row>
              <Row k="Budget réel">{c.budget}</Row>
              <Row k="Histoire">{c.backstory}</Row>
              <Row k="Objection cachée" strong>
                « {c.hiddenObjection} »<span className="mt-1 block text-[13px] font-normal text-ink-2">{c.hiddenWhen}</span>
              </Row>
              <Row k="Vous dites oui si" strong>
                {c.yesTrigger}
              </Row>
              <Row k="Jeu">{c.quirks.join(" · ")}</Row>
              <Row k="Première réplique">« {c.opening} »</Row>
            </dl>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

function Row({ k, children, strong }: { k: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{k}</dt>
      <dd className={strong ? "font-semibold" : ""}>{children}</dd>
    </div>
  );
}
