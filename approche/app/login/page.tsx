"use client";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";
import { DEMO_USERS } from "@/lib/data/demo";
import type { Profile } from "@/lib/types";

/** Les deux cartes « qui prospecte aujourd'hui ? ». */
function PersonPicker({ people, busyId, onPick }: { people: Profile[]; busyId?: string | null; onPick: (p: Profile) => void }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {people.map((u) => (
        <motion.button
          key={u.id}
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          disabled={Boolean(busyId)}
          onClick={() => onPick(u)}
          className="rounded-[22px] bg-mist p-5 text-left transition-colors hover:bg-fog disabled:opacity-60"
        >
          <span className="grid size-11 place-items-center rounded-full text-[17px] font-semibold text-white" style={{ background: u.color }}>
            {u.display_name[0]}
          </span>
          <span className="mt-4 block text-[19px] font-semibold">{u.display_name}</span>
          <span className="text-[13px] text-ink-2">{busyId === u.id ? "Ouverture…" : "Entrer"}</span>
        </motion.button>
      ))}
    </div>
  );
}

function LoginInner() {
  const { demo, signIn, signInAs, signInDemo } = useSession();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Après le compte commun : choix de l'associé
  const [people, setPeople] = useState<Profile[] | null>(null);
  const [opening, setOpening] = useState<string | null>(null);

  function enter() {
    router.replace(next);
    router.refresh();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const list = await signIn(email.trim(), password);
      if (list.length) setPeople(list);
      else enter();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function pick(person: Profile) {
    setOpening(person.id);
    setError(null);
    try {
      await signInAs(person, password);
      enter();
    } catch (err) {
      setError((err as Error).message);
      setOpening(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <p className="kicker">MJAGENCY · usage interne</p>
        <h1 className="display mt-3 text-[64px]">
          Approche<span className="text-blue">.</span>
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">
          Prospecter mieux, pas plus fort. Le terrain, le téléphone, les scripts et l&apos;entraînement, au même endroit.
        </p>

        {demo ? (
          <div className="mt-10">
            <p className="text-[15px] text-ink-2">
              Mode démo : Supabase n&apos;est pas encore configuré. Les données restent dans ce navigateur.
            </p>
            <PersonPicker
              people={DEMO_USERS}
              onPick={(u) => {
                signInDemo(u.id);
                router.replace(next);
              }}
            />
          </div>
        ) : people ? (
          <motion.div className="mt-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <p className="kicker">Connecté · MJAGENCY</p>
            <p className="mt-2 text-[22px] font-semibold tracking-tight">Qui prospecte aujourd&apos;hui&nbsp;?</p>
            <PersonPicker people={people} busyId={opening} onPick={pick} />
            {error && <p className="mt-4 text-[14px] text-signal">{error}</p>}
            <button
              type="button"
              className="mt-6 text-[14px] text-ink-2 hover:text-ink"
              onClick={() => {
                setPeople(null);
                setPassword("");
                setError(null);
              }}
            >
              ← Changer de compte
            </button>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-3">
            <input className="field" type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
              className="field"
              type="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-[14px] text-signal">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        )}
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
