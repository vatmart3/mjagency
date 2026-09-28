"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/primitives";
import { useTable } from "@/lib/data/hooks";
import { useSession } from "@/lib/session";
import { evalCriteria } from "@/content/training";
import { scenarios } from "@/content/scenarios";
import { useAiEnabled } from "@/lib/ai";

export default function TrainingHub() {
  const { rows } = useTable("training_sessions");
  const { rows: reviews } = useTable("flashcard_reviews");
  const { me } = useSession();
  const ai = useAiEnabled();
  const mine = rows.filter((r) => r.state === "done" && r.seller_id === me?.id && r.scores);
  const due = reviews.filter((r) => r.user_id === me?.id && r.due_at <= new Date().toISOString()).length;

  const weakest = useMemo(() => {
    if (!mine.length) return null;
    const avg = evalCriteria.map((c) => {
      const vals = mine.map((m) => m.scores?.[c.id]).filter((v): v is number => typeof v === "number");
      return { c, v: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 5 };
    });
    return avg.sort((a, b) => a.v - b.v)[0];
  }, [mine]);

  const cards = [
    { href: "/entrainement/duo", k: "À deux", t: "Mode Duo", d: `Jeu de rôle entre associés, synchronisé sur les deux téléphones. ${scenarios.length} scénarios + génération aléatoire.`, big: true },
    { href: "/entrainement/flash", k: "Seul", t: "Flashcards d'objections", d: due ? `${due} carte(s) à revoir aujourd'hui.` : "Répondre à voix haute, révéler, s'auto-noter. Répétition espacée." },
    { href: "/entrainement/defi", k: "Seul", t: "Défi 30 secondes", d: "Un secteur tiré au hasard, 30 secondes pour accrocher." },
    ...(ai ? [{ href: "/entrainement/ia", k: "Seul · IA", t: "Prospect IA", d: "Un personnage de la bibliothèque vous répond et vous note à la fin." }] : []),
    { href: "/entrainement/progression", k: "Suivi", t: "Progression", d: "Historique, courbe par compétence, points faibles, comparaison amicale." },
  ];

  return (
    <div>
      <PageHeader
        kicker="Salle d'entraînement"
        title={
          <>
            On s&apos;entraîne ici. <span className="text-ink-3">Pas devant le client.</span>
          </>
        }
        lede={weakest ? `Point à travailler : ${weakest.c.label.toLowerCase()} (${weakest.v.toFixed(1).replace(".", ",")}/5 en moyenne).` : "Première session ? Commencez par un Duo niveau 2, puis enchaînez sur les flashcards."}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div key={c.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={c.big ? "md:row-span-2" : ""}>
            <Link
              href={c.href}
              className={`group flex h-full flex-col justify-between rounded-[28px] p-6 transition-transform active:scale-[0.98] md:p-8 ${c.big ? "min-h-[320px] bg-ink text-white" : "min-h-[160px] bg-mist hover:bg-fog"}`}
            >
              <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${c.big ? "text-white/60" : "text-ink-2"}`}>{c.k}</p>
              <div>
                <p className={`display ${c.big ? "text-[56px] md:text-[80px]" : "text-[32px]"}`}>{c.t}</p>
                <p className={`mt-2 max-w-md text-[15px] leading-relaxed ${c.big ? "text-white/70" : "text-ink-2"}`}>{c.d}</p>
              </div>
              <span className={`mt-4 text-[15px] font-medium ${c.big ? "text-white" : "text-blue"}`}>Commencer →</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
