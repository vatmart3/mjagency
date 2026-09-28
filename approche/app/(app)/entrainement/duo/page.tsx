"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Chip, Dots, Field, PageHeader, Segmented, Tag } from "@/components/ui/primitives";
import { celebrate, toast, toastError } from "@/components/ui/Toast";
import { FlipCard } from "@/components/training/FlipCard";
import { SECTORS, getSector } from "@/content/sectors";
import { duoRules, evalCriteria } from "@/content/training";
import type { Channel, EvalCriterion } from "@/content/types";
import { db, useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { generateCode, pickScenario, scenarioFromProspect } from "@/lib/training";
import type { TrainingSession } from "@/lib/types";

type Role = "vendeur" | "prospect";
const KEY = "approche.duo";

function useLocalRole() {
  const [state, setState] = useState<{ id: string; role: Role } | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);
  const save = (v: { id: string; role: Role } | null) => {
    setState(v);
    try {
      if (v) sessionStorage.setItem(KEY, JSON.stringify(v));
      else sessionStorage.removeItem(KEY);
    } catch {}
  };
  return [state, save] as const;
}

function DuoPage() {
  const { rows } = useTable("training_sessions");
  const [local, setLocal] = useLocalRole();
  const session = local ? rows.find((r) => r.id === local.id) : undefined;

  if (local && session && session.state !== "cancelled") return <Room s={session} role={local.role} leave={() => setLocal(null)} />;
  return <Setup onJoined={(id, role) => setLocal({ id, role })} />;
}

/* ------------------------------------------------------------------ Setup */

function Setup({ onJoined }: { onJoined: (id: string, role: Role) => void }) {
  const params = useSearchParams();
  const { rows: prospects } = useTable("prospects");
  const { rows: sessions } = useTable("training_sessions");
  const { me } = useSession();
  const fromProspect = prospects.find((p) => p.id === params.get("prospect"));
  const [role, setRole] = useState<Role>("vendeur");
  const [sector, setSector] = useState<string | null>(null);
  const [channel, setChannel] = useState<Channel>("physique");
  const [difficulty, setDifficulty] = useState<number | null>(2);
  const [random, setRandom] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const scenario = fromProspect ? scenarioFromProspect(fromProspect, channel) : pickScenario({ sector, channel, difficulty }, random);
    const row = await db.insert("training_sessions", {
      code: generateCode(),
      mode: "duo",
      sector: scenario.sector,
      channel: scenario.channel,
      difficulty: scenario.difficulty,
      scenario,
      seller_id: role === "vendeur" ? me?.id : null,
      player_id: role === "prospect" ? me?.id : null,
      state: "lobby",
      source_prospect_id: fromProspect?.id ?? null,
    });
    setBusy(false);
    onJoined(row.id, role);
  }

  async function join() {
    const s = sessions.find((x) => x.code === code.trim() && ["lobby", "running"].includes(x.state));
    if (!s) return toastError("Code introuvable", "Vérifiez les 4 chiffres affichés sur l'autre téléphone.");
    const myRole: Role = s.seller_id && !s.player_id ? "prospect" : !s.seller_id ? "vendeur" : "prospect";
    await db.update("training_sessions", s.id, myRole === "prospect" ? { player_id: me?.id } : { seller_id: me?.id });
    onJoined(s.id, myRole);
  }

  return (
    <div>
      <PageHeader
        kicker="Mode Duo"
        title={
          <>
            Un vend, <span className="text-ink-3">l&apos;autre résiste.</span>
          </>
        }
        lede="Celui qui joue le prospect reçoit une carte secrète. Le vendeur ne voit que le commerce. À la fin, le prospect note la prestation."
      />
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {fromProspect && (
            <div className="rounded-2xl bg-blue-soft p-4">
              <p className="kicker text-blue">Scénario tiré d&apos;un vrai dossier</p>
              <p className="mt-1 text-[18px] font-semibold">{fromProspect.name}</p>
              <p className="text-[14px] text-ink-2">{fromProspect.intel ? "Objections et déclencheur issus du rapport de recherche." : "Pas encore de rapport : scénario construit depuis la fiche."}</p>
            </div>
          )}
          <Field label="Je joue" group>
            <Segmented
              value={role}
              onChange={setRole}
              options={[
                { value: "vendeur", label: "Le vendeur" },
                { value: "prospect", label: "Le prospect" },
              ]}
            />
          </Field>
          <Field label="Canal" group>
            <Segmented
              value={channel}
              onChange={setChannel}
              options={[
                { value: "physique", label: "En boutique" },
                { value: "telephone", label: "Au téléphone" },
              ]}
            />
          </Field>
          {!fromProspect && (
            <>
              <Field label="Secteur" group>
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
              </Field>
              <Field label={`Difficulté${difficulty ? ` : ${difficulty}/5` : " : au hasard"}`} group>
                <div className="flex items-center gap-3">
                  <Dots value={difficulty} onChange={setDifficulty} />
                  <button className="text-[13px] text-ink-3" onClick={() => setDifficulty(null)}>
                    hasard
                  </button>
                </div>
              </Field>
              <Field label="Scénario" group>
                <Segmented
                  value={random ? "gen" : "lib"}
                  onChange={(v) => setRandom(v === "gen")}
                  options={[
                    { value: "lib", label: "Bibliothèque (40)" },
                    { value: "gen", label: "Génération aléatoire" },
                  ]}
                />
              </Field>
            </>
          )}
          <Button size="lg" onClick={create} disabled={busy}>
            Créer la session
          </Button>
        </div>
        <div className="space-y-8">
          <div className="rounded-[28px] bg-ink p-6 text-white">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/60">Rejoindre</p>
            <p className="mt-2 text-[15px] text-white/70">Entrez le code affiché sur le téléphone de votre associé.</p>
            <input
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="num mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-center text-[40px] font-semibold tracking-[0.4em] text-white outline-none placeholder:text-white/20 focus:bg-white/15"
              placeholder="0000"
              aria-label="Code de session"
            />
            <Button className="mt-4 w-full" onClick={join} disabled={code.length !== 4}>
              Rejoindre
            </Button>
          </div>
          <div>
            <p className="kicker">Règles du jeu</p>
            <ul className="mt-3 space-y-2">
              {duoRules.map((r, i) => (
                <li key={i} className="flex gap-2 text-[15px] leading-snug">
                  <span className="text-blue">—</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Room */

function useElapsed(from: string | null, running: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  if (!from) return 0;
  return Math.max(0, Math.floor((now - new Date(from).getTime()) / 1000));
}
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Room({ s, role, leave }: { s: TrainingSession; role: Role; leave: () => void }) {
  const { nameOf } = useSession();
  const sc = s.scenario!;
  const [flipped, setFlipped] = useState(false);
  const elapsed = useElapsed(s.started_at, s.state === "running");
  const both = !!s.seller_id && !!s.player_id;
  const sector = getSector(sc.sector);

  async function start() {
    await db.update("training_sessions", s.id, { state: "running", started_at: new Date().toISOString() });
  }
  async function stop() {
    const dur = s.started_at ? Math.round((Date.now() - new Date(s.started_at).getTime()) / 1000) : null;
    await db.update("training_sessions", s.id, { state: "evaluating", ended_at: new Date().toISOString(), duration_sec: dur });
  }
  async function cancel() {
    if (s.state !== "done") await db.update("training_sessions", s.id, { state: "cancelled" });
    leave();
  }

  return (
    <div className="pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker">
            Duo · {role === "vendeur" ? "vous vendez" : "vous jouez le prospect"} · niveau {sc.difficulty}
          </p>
          <p className="mt-1 text-[15px] text-ink-2">
            {s.seller_id ? nameOf(s.seller_id) : "…"} vend · {s.player_id ? nameOf(s.player_id) : "…"} joue le prospect
          </p>
        </div>
        <Button variant="quiet" size="sm" onClick={cancel}>
          Quitter
        </Button>
      </div>

      {s.state === "lobby" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 text-center">
          <p className="kicker">Code de session</p>
          <p className="display num mt-3 text-[96px] tracking-[0.15em] text-blue md:text-[140px]">{s.code}</p>
          <p className="mt-2 text-[16px] text-ink-2">{both ? "Les deux joueurs sont là." : "En attente de votre associé : Entraînement → Duo → Rejoindre."}</p>
          <Button size="lg" className="mt-8" onClick={start} disabled={!both}>
            Lancer le chrono
          </Button>
          {!both && <p className="mt-3 text-[13px] text-ink-3">Pour tester seul : ouvrez un second onglet, Entraînement → Duo → Rejoindre avec ce code.</p>}
        </motion.div>
      )}

      {(s.state === "lobby" || s.state === "running") && (
        <div className="mt-10">
          {s.state === "running" && (
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="num display text-[64px]">{mmss(elapsed)}</span>
              <Button variant="ink" onClick={stop}>
                Terminer l&apos;échange
              </Button>
            </div>
          )}
          {role === "prospect" ? (
            <FlipCard scenario={sc} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          ) : (
            <div className="mx-auto max-w-2xl rounded-[28px] bg-white p-7 shadow-[var(--shadow-lift)] ring-1 ring-line">
              <p className="kicker">{sc.channel === "telephone" ? "Vous appelez" : "Vous entrez chez"}</p>
              <p className="display mt-2 text-[40px] md:text-[56px]">{sc.seller.business}</p>
              <p className="mt-1 text-[16px] text-ink-2">
                {sector?.name} · {sc.seller.city}
              </p>
              <p className="mt-5 text-[17px] leading-relaxed">{sc.seller.context}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink href={`/scripts/${sc.sector}`} variant="secondary" size="sm">
                  Relire la fiche {sector?.short}
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      )}

      {s.state === "evaluating" && (role === "prospect" ? <Evaluate s={s} /> : <Waiting />)}
      {s.state === "done" && <Results s={s} role={role} onAgain={leave} />}
    </div>
  );
}

function Waiting() {
  return (
    <div className="mt-16 text-center">
      <motion.div className="mx-auto size-16 rounded-full border-4 border-blue border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
      <p className="display mt-6 text-[36px]">Le prospect vous note…</p>
      <p className="mt-2 text-ink-2">En attendant : qu&apos;auriez-vous fait autrement ?</p>
    </div>
  );
}

function Evaluate({ s }: { s: TrainingSession }) {
  const [scores, setScores] = useState<Partial<Record<EvalCriterion, number>>>({});
  const [comment, setComment] = useState("");
  const complete = evalCriteria.every((c) => scores[c.id]);
  async function submit() {
    await db.update("training_sessions", s.id, { scores, comment: comment.trim() || null, state: "done" });
    toast("Évaluation envoyée");
  }
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <p className="kicker">Grille d&apos;évaluation</p>
      <h2 className="display mt-2 text-[40px]">Comment a-t-il vendu ?</h2>
      <div className="mt-8 space-y-7">
        {evalCriteria.map((c) => (
          <div key={c.id}>
            <p className="text-[18px] font-semibold">{c.label}</p>
            <p className="text-[14px] text-ink-2">{c.question}</p>
            <div className="mt-3">
              <Dots value={scores[c.id] ?? null} onChange={(v) => setScores({ ...scores, [c.id]: v })} label={c.label} />
            </div>
          </div>
        ))}
        <Field label="Commentaire (ce qui a marché, le point à travailler)">
          <textarea className="field min-h-28" value={comment} onChange={(e) => setComment(e.target.value)} />
        </Field>
        <Button size="lg" className="w-full" onClick={submit} disabled={!complete}>
          Envoyer la note
        </Button>
      </div>
    </div>
  );
}

function Results({ s, role, onAgain }: { s: TrainingSession; role: Role; onAgain: () => void }) {
  const [reveal, setReveal] = useState(false);
  const avg = useMemo(() => {
    const v = Object.values(s.scores ?? {}).filter((x): x is number => typeof x === "number");
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  }, [s.scores]);
  useEffect(() => {
    if (role === "vendeur" && avg >= 4) celebrate("Belle prestation", `${avg.toFixed(1).replace(".", ",")}/5 de moyenne`);
  }, [role, avg]);
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <p className="kicker">Résultat · {s.duration_sec ? mmss(s.duration_sec) : ""}</p>
      <p className="display mt-2 text-[80px] text-blue">
        {avg.toFixed(1).replace(".", ",")}
        <span className="text-[32px] text-ink-3">/5</span>
      </p>
      <div className="mt-6 space-y-3">
        {evalCriteria.map((c) => {
          const v = s.scores?.[c.id] ?? 0;
          return (
            <div key={c.id} className="grid grid-cols-[130px_1fr_28px] items-center gap-3">
              <span className="text-[14px]">{c.label}</span>
              <div className="h-2 overflow-hidden rounded-full bg-mist">
                <motion.div className="h-full rounded-full bg-blue" initial={{ width: 0 }} animate={{ width: `${(v / 5) * 100}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="num text-right text-[14px] font-semibold">{v}</span>
            </div>
          );
        })}
      </div>
      {s.comment && <blockquote className="mt-8 border-l-2 border-blue pl-5 text-[18px] leading-relaxed">« {s.comment} »</blockquote>}
      {role === "vendeur" && s.scenario && (
        <div className="mt-10">
          <Button variant="secondary" onClick={() => setReveal(!reveal)}>
            <Icon name="eye" size={18} /> {reveal ? "Cacher" : "Voir"} la carte secrète
          </Button>
          <AnimatePresence>
            {reveal && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                <FlipCard scenario={s.scenario} flipped onFlip={() => undefined} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <div className="mt-10 flex flex-wrap gap-2">
        <Button onClick={onAgain}>Rejouer</Button>
        <ButtonLink href="/entrainement/progression" variant="secondary">
          Ma progression
        </ButtonLink>
        <Link href="/entrainement/flash" className="self-center px-3 text-[15px] text-blue">
          Enchaîner sur les flashcards
        </Link>
      </div>
      <p className="mt-6 text-[13px] text-ink-3">
        <Tag>{getSector(s.sector)?.short}</Tag>
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <DuoPage />
    </Suspense>
  );
}
