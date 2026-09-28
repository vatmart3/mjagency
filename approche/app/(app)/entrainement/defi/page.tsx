"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dots, PageHeader } from "@/components/ui/primitives";
import { toast } from "@/components/ui/Toast";
import { SECTORS } from "@/content/sectors";
import { pitchChallengeTips } from "@/content/training";
import type { SectorSheet } from "@/content/types";
import { db } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";

type Phase = "idle" | "ready" | "go" | "done";

export default function Defi() {
  const { me } = useSession();
  const [sector, setSector] = useState<SectorSheet | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(30);
  const [grade, setGrade] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function draw() {
    setSector(SECTORS[Math.floor(Math.random() * SECTORS.length)]);
    setPhase("ready");
    setGrade(null);
    setLeft(30);
  }
  function start() {
    setPhase("go");
    setLeft(30);
    timer.current = setInterval(() => setLeft((l) => l - 1), 1000);
  }
  useEffect(() => {
    if (phase === "go" && left <= 0) {
      if (timer.current) clearInterval(timer.current);
      setPhase("done");
      if ("vibrate" in navigator) navigator.vibrate?.(200);
    }
  }, [left, phase]);
  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  async function save() {
    if (!sector || !grade) return;
    await db.insert("training_sessions", {
      mode: "defi",
      sector: sector.id,
      state: "done",
      seller_id: me?.id,
      scores: { accroche: grade },
      duration_sec: 30 - Math.max(0, left),
    });
    toast("Défi enregistré");
    draw();
  }

  const pct = left / 30;
  return (
    <div>
      <PageHeader kicker="Solo · chronométré" title="Défi 30 secondes." lede="Un secteur au hasard. Trente secondes pour donner envie au commerçant de vous en accorder cinq de plus." />
      <div className="mx-auto max-w-2xl text-center">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Button size="lg" onClick={draw}>
                Tirer un secteur
              </Button>
            </motion.div>
          )}
          {sector && phase !== "idle" && (
            <motion.div key={sector.id + phase} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="kicker">Vous entrez chez</p>
              <p className="display mt-2 text-[48px] md:text-[72px]">{sector.name}</p>
              <p className="mt-2 text-ink-2">{sector.tagline}</p>
              <div className="relative mx-auto mt-10 size-56">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ebebef" strokeWidth="6" />
                  <motion.circle cx="50" cy="50" r="45" fill="none" stroke={left <= 5 && phase === "go" ? "#d70015" : "#0071e3"} strokeWidth="6" strokeLinecap="round" strokeDasharray={283} animate={{ strokeDashoffset: 283 * (1 - pct) }} transition={{ ease: "linear", duration: 1 }} />
                </svg>
                <span className="num display absolute inset-0 grid place-items-center text-[72px]">{Math.max(0, left)}</span>
              </div>
              {phase === "ready" && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button size="lg" onClick={start}>
                    Top chrono
                  </Button>
                  <Button size="lg" variant="secondary" onClick={draw}>
                    Autre secteur
                  </Button>
                </div>
              )}
              {phase === "go" && (
                <Button size="lg" variant="ink" className="mt-8" onClick={() => setLeft(0)}>
                  J&apos;ai fini
                </Button>
              )}
              {phase === "done" && (
                <div className="mt-8 text-left">
                  <p className="kicker">Le pitch modèle</p>
                  <p className="mt-2 rounded-2xl bg-mist p-5 text-[17px] leading-relaxed">{sector.pitch30s}</p>
                  <p className="mt-6 text-[15px] font-semibold">Votre auto-évaluation</p>
                  <div className="mt-3">
                    <Dots value={grade} onChange={setGrade} />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button onClick={save} disabled={!grade}>
                      Enregistrer et rejouer
                    </Button>
                    <Button variant="secondary" onClick={draw}>
                      Rejouer sans noter
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="mx-auto mt-14 max-w-lg space-y-2 text-left text-[14px] text-ink-2">
          {pitchChallengeTips.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-blue">—</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
