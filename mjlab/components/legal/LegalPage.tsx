import type { ReactNode } from "react";
import SectionMarker from "@/components/ui/SectionMarker";

export default function LegalPage({ index, title, updated, children }: { index: string; title: string; updated: string; children: ReactNode }) {
  return (
    <article data-theme="light" className="relative bg-creme pb-24 pt-32 md:pb-32 md:pt-40">
      <SectionMarker index={index} label="INFORMATIONS LÉGALES" right={`MAJ — ${updated.toUpperCase()}`} className="gutter" />
      <h1 className="display-tight mt-10 text-[clamp(2.8rem,8vw,7.5rem)] gutter">
        {title}
        <span className="text-bordeaux">.</span>
      </h1>
      <div className="legal mt-14 grid grid-cols-12 gap-6 gutter">
        <div className="col-span-12 space-y-12 md:col-span-8 md:col-start-3">{children}</div>
      </div>
    </article>
  );
}

export function LegalBlock({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-beige pt-8">
      <p className="mono text-noir/60">{n}</p>
      <h2 className="mt-2 font-display text-[1.7rem] font-bold tracking-[-0.035em]">{title}</h2>
      <div className="mt-4 space-y-3 text-[1rem] leading-relaxed text-noir/85">{children}</div>
    </section>
  );
}

/** Valeur à compléter : signalée visuellement, jamais inventée. */
export function Todo({ children }: { children: ReactNode }) {
  const v = String(children);
  return v.startsWith("TODO") ? (
    <mark className="rounded bg-beige px-1.5 py-0.5 font-mono text-[0.85em] text-noir">{v}</mark>
  ) : (
    <>{children}</>
  );
}
