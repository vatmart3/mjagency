"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { PrompterSection } from "@/lib/scripts";

/**
 * Téléprompteur : texte grand, défilement automatique ou au doigt,
 * surlignage de la phrase en cours. Espace / flèches au clavier.
 */
export function Teleprompter({
  sections,
  compact = false,
  autoStart = false,
}: {
  sections: PrompterSection[];
  compact?: boolean;
  autoStart?: boolean;
}) {
  const flat = useMemo(() => {
    const out: { text: string; section: number; first: boolean }[] = [];
    sections.forEach((s, si) =>
      s.lines.forEach((l, li) => {
        // Découpe en phrases pour un surlignage fin
        const sentences = l.match(/[^.!?…]+[.!?…]+[»"]?\s*|[^.!?…]+$/g) ?? [l];
        sentences.forEach((t, k) => out.push({ text: t.trim(), section: si, first: li === 0 && k === 0 }));
      }),
    );
    return out.filter((x) => x.text);
  }, [sections]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoStart);
  const [wpm, setWpm] = useState(150);
  const [size, setSize] = useState(compact ? 26 : 38);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(flat.length - 1, i))), [flat.length]);

  // Défilement vers la phrase courante
  useEffect(() => {
    const el = refs.current[index];
    const container = box.current;
    if (!el || !container) return;
    const target = el.offsetTop - container.clientHeight * 0.32;
    container.scrollTo({ top: target, behavior: "smooth" });
  }, [index]);

  // Lecture automatique : durée proportionnelle au nombre de mots
  useEffect(() => {
    if (!playing) return;
    const words = flat[index]?.text.split(/\s+/).length ?? 5;
    const ms = Math.max(1100, (words / wpm) * 60000 + 350);
    const t = setTimeout(() => (index >= flat.length - 1 ? setPlaying(false) : setIndex(index + 1)), ms);
    return () => clearTimeout(t);
  }, [playing, index, wpm, flat]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const currentSection = flat[index]?.section ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-3">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => go(flat.findIndex((f) => f.section === i))}
            className={`h-8 shrink-0 rounded-full px-3 text-[13px] font-medium transition-colors ${i === currentSection ? "bg-ink text-white" : "bg-mist text-ink-2"}`}
          >
            {i + 1}. {s.title.replace(/\s*\(.*\)$/, "")}
          </button>
        ))}
      </div>

      <div ref={box} className="prompter-mask relative min-h-0 flex-1 overflow-y-auto scroll-smooth" onClick={() => go(index + 1)}>
        <div className="py-[30vh]" style={{ fontSize: size, lineHeight: 1.28 }}>
          {sections.map((s, si) => (
            <div key={si} className="mb-[0.9em]">
              <p className="kicker mb-3" style={{ fontSize: Math.max(11, size * 0.32) }}>
                {s.title}
              </p>
              <p className="font-semibold tracking-tight">
                {flat.map((f, fi) =>
                  f.section === si ? (
                    <span
                      key={fi}
                      ref={(el) => {
                        refs.current[fi] = el;
                      }}
                      className="transition-colors duration-300"
                      style={{ color: fi === index ? "#1d1d1f" : fi < index ? "#c7c7cc" : "#a1a1a6" }}
                    >
                      {fi === index ? <mark className="rounded-md bg-blue-soft px-1 text-ink [box-decoration-break:clone]">{f.text}</mark> : f.text}{" "}
                    </span>
                  ) : null,
                )}
              </p>
              {s.tip && si === currentSection && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-[15px] font-normal italic text-blue" style={{ fontSize: Math.max(14, size * 0.42) }}>
                  {s.tip}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <button onClick={() => go(index - 1)} className="grid size-11 place-items-center rounded-full bg-mist" aria-label="Phrase précédente">
            <Icon name="back" size={18} />
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setPlaying(!playing)}
            className="grid size-14 place-items-center rounded-full bg-blue text-white shadow-[0_8px_20px_rgba(0,113,227,0.3)]"
            aria-label={playing ? "Pause" : "Lecture"}
          >
            <Icon name={playing ? "pause" : "play"} size={22} />
          </motion.button>
          <button onClick={() => go(index + 1)} className="grid size-11 place-items-center rounded-full bg-mist" aria-label="Phrase suivante">
            <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-ink-2">
          <label className="flex items-center gap-2">
            Vitesse
            <input type="range" min={100} max={220} step={10} value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-20 accent-[#0071e3]" />
          </label>
          <label className="flex items-center gap-2">
            Taille
            <input type="range" min={20} max={60} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-20 accent-[#0071e3]" />
          </label>
          <span className="num">
            {index + 1}/{flat.length}
          </span>
        </div>
      </div>
    </div>
  );
}
