"use client";
import { useFill } from "@/lib/useFill";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip, PageHeader } from "@/components/ui/primitives";
import { flashcardTips } from "@/content/training";
import { SECTORS, sectorLabel } from "@/content/sectors";
import { db, useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { allFlashcards, schedule, type Flashcard } from "@/lib/training";

const GRADES: { g: 1 | 2 | 3 | 4; label: string; cls: string }[] = [
  { g: 1, label: "À revoir", cls: "bg-signal/10 text-signal" },
  { g: 2, label: "Difficile", cls: "bg-mist" },
  { g: 3, label: "Bien", cls: "bg-blue-soft text-blue" },
  { g: 4, label: "Facile", cls: "bg-blue text-white" },
];

export default function Flashcards() {
  const { rows: reviews } = useTable("flashcard_reviews");
  const { rows: prospects } = useTable("prospects");
  const { me } = useSession();
  const f = useFill();
  const [sector, setSector] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  const mine = useMemo(() => new Map(reviews.filter((r) => r.user_id === me?.id).map((r) => [r.card_key, r])), [reviews, me?.id]);
  const deck = useMemo(() => {
    const now = new Date().toISOString();
    const cards = allFlashcards(prospects).filter((c) => !sector || c.sector === sector);
    // Cartes dues d'abord, puis les nouvelles, puis le reste (les plus lointaines en dernier)
    return cards
      .filter((c) => !done.includes(c.key))
      .map((c) => ({ c, r: mine.get(c.key) }))
      .sort((a, b) => {
        const da = a.r ? (a.r.due_at <= now ? 0 : 2) : 1;
        const dbb = b.r ? (b.r.due_at <= now ? 0 : 2) : 1;
        return da - dbb || (a.r?.due_at ?? "").localeCompare(b.r?.due_at ?? "");
      });
  }, [prospects, sector, done, mine]);
  const due = deck.filter((d) => !d.r || d.r.due_at <= new Date().toISOString()).length;
  const card = deck[0]?.c;

  async function grade(c: Flashcard, g: 1 | 2 | 3 | 4) {
    const next = schedule(mine.get(c.key), g);
    await db.upsert("flashcard_reviews", { user_id: me!.id, card_key: c.key, ...next }, ["user_id", "card_key"]);
    setShown(false);
    setDone((d) => (g === 1 ? d : [...d, c.key]));
  }

  return (
    <div>
      <PageHeader kicker="Solo · répétition espacée" title={<>Flashcards d&apos;objections.</>} lede={`${due} carte(s) à travailler maintenant. Répondez à voix haute avant de révéler.`} />
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <Chip active={!sector} onClick={() => setSector(null)}>
          Tous les secteurs
        </Chip>
        {SECTORS.map((s) => (
          <Chip key={s.id} active={sector === s.id} onClick={() => setSector(s.id)}>
            {s.short}
          </Chip>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {card ? (
            <motion.div key={card.key} initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, x: -40, rotate: -3 }} className="rounded-[28px] bg-white p-7 shadow-[var(--shadow-lift)] ring-1 ring-line md:p-10">
              <p className="kicker">{sectorLabel(card.sector)}</p>
              <p className="display mt-4 text-[34px] leading-tight md:text-[48px]">« {card.objection} »</p>
              {!shown ? (
                <div className="mt-10">
                  <p className="text-[15px] text-ink-2">Répondez à voix haute : accueillir, questionner, recadrer, proposer.</p>
                  <Button size="lg" className="mt-5 w-full" onClick={() => setShown(true)}>
                    Révéler la réponse modèle
                  </Button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
                  {card.hidden && <p className="text-[14px] text-ink-2">Ce que ça cache : {card.hidden}</p>}
                  {"text" in card.answer ? (
                    <p className="text-[17px] leading-relaxed">{f(card.answer.text)}</p>
                  ) : (
                    (
                      [
                        ["Accueillir", card.answer.accueillir],
                        ["Questionner", card.answer.questionner],
                        ["Recadrer", card.answer.recadrer],
                        ["Proposer", card.answer.proposer],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-blue">{k}</p>
                        <p className="mt-1 text-[17px] leading-relaxed">{f(v)}</p>
                      </div>
                    ))
                  )}
                  <div className="grid grid-cols-4 gap-2 pt-4">
                    {GRADES.map((g) => (
                      <motion.button key={g.g} whileTap={{ scale: 0.94 }} onClick={() => grade(card, g.g)} className={`h-14 rounded-2xl text-[14px] font-semibold ${g.cls}`}>
                        {g.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <p className="display text-[44px]">Paquet terminé.</p>
              <p className="mt-2 text-ink-2">Les cartes reviendront au bon moment.</p>
              <Button className="mt-6" onClick={() => setDone([])}>
                Recommencer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="mt-10 space-y-2 text-[14px] text-ink-2">
          {flashcardTips.map((t, i) => (
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
