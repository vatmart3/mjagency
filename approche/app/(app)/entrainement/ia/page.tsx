"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, PageHeader } from "@/components/ui/primitives";
import { toastError } from "@/components/ui/Toast";
import { SECTORS, getSector } from "@/content/sectors";
import { evalCriteria } from "@/content/training";
import type { Scenario } from "@/content/types";
import { aiCall, useAiEnabled } from "@/lib/ai";
import { db } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { AI_EVAL_SYSTEM, aiProspectSystem, parseAiEval, pickScenario } from "@/lib/training";

type Msg = { role: "user" | "assistant"; content: string };

export default function AiProspect() {
  const ai = useAiEnabled();
  const { me } = useSession();
  const [sector, setSector] = useState<string | null>(null);
  const [sc, setSc] = useState<Scenario | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ scores: Record<string, number>; comment: string } | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs.length]);

  if (!ai)
    return (
      <div>
        <PageHeader kicker="Solo · IA" title="Prospect IA." lede="Ce mode nécessite une clé API Claude (ANTHROPIC_API_KEY) côté serveur. Le reste de la salle d'entraînement fonctionne sans." />
        <ButtonLink href="/entrainement/duo">Faire un Duo à la place</ButtonLink>
      </div>
    );

  function begin() {
    const s = pickScenario({ sector, channel: null, difficulty: null });
    setSc(s);
    setResult(null);
    // L'API exige un premier message utilisateur : on ouvre la scène côté vendeur
    setMsgs([{ role: "user", content: s.channel === "telephone" ? "(Le téléphone sonne, vous décrochez.)" : "(Le vendeur entre dans votre commerce.)" }, { role: "assistant", content: s.character.opening }]);
  }

  async function send() {
    if (!sc || !text.trim()) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next);
    setText("");
    setBusy(true);
    try {
      const { text: reply } = await aiCall<{ text: string }>({ mode: "chat", system: aiProspectSystem(sc), messages: next });
      setMsgs([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toastError("Pas de réponse", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    if (!sc) return;
    setBusy(true);
    try {
      const transcript = msgs.slice(1).map((m) => `${m.role === "user" ? "Vendeur" : "Prospect"} : ${m.content}`).join("\n");
      const card = JSON.stringify(sc.character);
      const { text: out } = await aiCall<{ text: string }>({ mode: "chat", system: AI_EVAL_SYSTEM, messages: [{ role: "user", content: `Fiche secrète : ${card}\n\nTranscription :\n${transcript}` }] });
      const r = parseAiEval(out);
      setResult(r);
      await db.insert("training_sessions", { mode: "ia", sector: sc.sector, channel: sc.channel, difficulty: sc.difficulty, scenario: sc, seller_id: me?.id, state: "done", scores: r.scores, comment: r.comment });
    } catch (e) {
      toastError("Évaluation impossible", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader kicker="Solo · IA" title="Prospect IA." lede="Un personnage de la bibliothèque joue le commerçant. Écrivez comme vous parleriez. Quand vous avez fini, demandez la note." />
      {!sc ? (
        <div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!sector} onClick={() => setSector(null)}>
              Au hasard
            </Chip>
            {SECTORS.map((s) => (
              <Chip key={s.id} active={sector === s.id} onClick={() => setSector(s.id)}>
                {s.short}
              </Chip>
            ))}
          </div>
          <Button size="lg" className="mt-6" onClick={begin}>
            Commencer
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-mist p-4">
            <p className="font-semibold">
              {sc.seller.business} · {getSector(sc.sector)?.short} · {sc.seller.city}
            </p>
            <p className="text-[14px] text-ink-2">{sc.seller.context}</p>
          </div>
          <div className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {msgs.slice(1).map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <p className={`max-w-[85%] rounded-[20px] px-4 py-3 text-[16px] leading-relaxed ${m.role === "user" ? "bg-blue text-white" : "bg-mist"}`}>{m.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {busy && <p className="text-[14px] text-ink-3">…</p>}
            <div ref={end} />
          </div>
          {!result ? (
            <form
              className="sticky mt-6 flex gap-2 bg-white py-3"
              style={{ bottom: "calc(var(--dock-h) + env(safe-area-inset-bottom) + 16px)" }}
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <input className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre réplique…" disabled={busy} />
              <Button type="submit" disabled={busy || !text.trim()}>
                Envoyer
              </Button>
              <Button type="button" variant="secondary" onClick={finish} disabled={busy || msgs.length < 4}>
                Noter
              </Button>
            </form>
          ) : (
            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-[var(--shadow-lift)] ring-1 ring-line">
              <p className="kicker">Évaluation</p>
              <div className="mt-4 space-y-2">
                {evalCriteria.map((c) => (
                  <div key={c.id} className="grid grid-cols-[130px_1fr_24px] items-center gap-3 text-[14px]">
                    <span>{c.label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-mist">
                      <div className="h-full rounded-full bg-blue" style={{ width: `${((result.scores[c.id] ?? 0) / 5) * 100}%` }} />
                    </div>
                    <span className="num font-semibold">{result.scores[c.id] ?? "—"}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 whitespace-pre-wrap text-[16px] leading-relaxed">{result.comment}</p>
              <p className="mt-4 text-[14px] text-ink-2">
                Carte secrète : objection cachée « {sc.character.hiddenObjection} » — déclencheur : {sc.character.yesTrigger}
              </p>
              <Button className="mt-5" onClick={() => setSc(null)}>
                Nouveau prospect
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
