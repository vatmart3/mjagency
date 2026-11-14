import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { activities, projects, site } from "@/content/site";
import ActivityHero from "@/components/activity/ActivityHero";
import ActivityCTA from "@/components/activity/ActivityCTA";
import SectionMarker from "@/components/ui/SectionMarker";
import TransitionLink from "@/components/ui/TransitionLink";
import ProjectArt from "@/components/ui/ProjectArt";
import { RevealLines, Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";

type Params = { slug: string };

export function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = activities.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.name,
    description: `${a.pitch} ${site.name} — ${site.signature}.`,
    alternates: { canonical: `/activites/${a.slug}` },
    openGraph: { title: `${a.name} — ${site.name}`, description: a.pitch, url: `/activites/${a.slug}` },
  };
}

export default async function ActivityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = activities.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const a = activities[index];
  const next = activities[(index + 1) % activities.length];
  const related = projects.filter((p) => p.activity === a.slug);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <ActivityHero index={index} />

      {/* description */}
      <section data-theme="light" className="relative bg-creme pb-24 pt-20 md:pb-32 md:pt-28" aria-labelledby="description">
        <div className="editorial-grid" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <SectionMarker index={pad(index + 1)} label="DESCRIPTION" right={a.code} className="relative gutter" />
        <div className="relative mt-12 grid grid-cols-12 gap-6 gutter">
          <h2 id="description" className="sr-only">Description</h2>
          <p className="col-span-12 font-display text-[clamp(1.6rem,3.4vw,3.3rem)] font-semibold leading-[1.08] tracking-[-0.03em] md:col-span-9 md:col-start-3">
            {a.description}
          </p>
        </div>
      </section>

      {/* offres : liste éditoriale numérotée */}
      <section data-theme="light" className="relative bg-beige py-24 md:py-32" aria-labelledby="offres">
        <SectionMarker index={pad(index + 1)} label="OFFRES" right={`${pad(a.offers.length)} PROTOCOLES`} className="gutter" />
        <RevealLines
          as="h2"
          id="offres"
          lines={[<span key="o">Ce qu&apos;on fait<span className="text-bordeaux">.</span></span>]}
          className="display-tight mt-10 text-[clamp(2.6rem,7vw,7rem)] gutter"
        />
        <ol className="mt-12 border-t border-noir/15 gutter md:mt-16">
          {a.offers.map((o, i) => (
            <li key={o.title} className="border-b border-noir/15">
              <Reveal className="grid grid-cols-12 items-baseline gap-4 py-8 md:py-10">
                <span className="mono col-span-2 text-noir/65 md:col-span-1">{pad(i + 1)}</span>
                <h3 className="col-span-10 font-display text-[clamp(1.6rem,3.2vw,3rem)] font-bold leading-none tracking-[-0.04em] md:col-span-5">
                  {o.title}
                </h3>
                <p className="col-span-12 max-w-[30rem] text-[1rem] leading-relaxed text-noir/80 md:col-span-6">{o.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {a.externalUrl && (
          <a
            href={a.externalUrl}
            target="_blank"
            rel="noopener"
            className="mt-10 inline-flex items-center gap-2 border-b border-noir/40 pb-1 font-medium gutter hover:border-bordeaux"
            data-cursor="↗"
          >
            Voir le site de {a.name} <ArrowUpRight size={16} />
          </a>
        )}
      </section>

      {/* projets liés */}
      <section data-theme="light" className="relative bg-creme py-24 md:py-32" aria-labelledby="projets-lies">
        <SectionMarker index={pad(index + 1)} label="PROJETS LIÉS" right={`${pad(related.length)} ENTRÉE(S)`} className="gutter" />
        <h2 id="projets-lies" className="display-tight mt-10 text-[clamp(2.4rem,6vw,6rem)] gutter">
          Dans le carnet<span className="text-bordeaux">.</span>
        </h2>
        {related.length ? (
          <ul className="mt-12 grid gap-6 gutter md:grid-cols-12">
            {related.map((p, i) => (
              <li key={i} className={i % 2 === 0 ? "md:col-span-7" : "md:col-span-4 md:col-start-9 md:mt-24"}>
                <Reveal>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                    <ProjectArt seed={index + i} title={p.title} category={p.category} />
                  </div>
                  <p className="mono mt-4 text-noir/65">{p.year} — {p.category} — {p.place}</p>
                  <h3 className="mt-1 font-display text-[1.6rem] font-bold tracking-[-0.035em]">
                    {p.title}<span className="text-bordeaux">.</span>
                  </h3>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 max-w-[30rem] text-noir/75 gutter">Les premiers projets de cette activité arrivent bientôt dans le carnet.</p>
        )}
      </section>

      <ActivityCTA slug={a.slug} name={a.name} />

      {/* activité suivante */}
      <section data-theme="dark" className="on-dark bg-noir pb-6 pt-16 text-creme">
        <TransitionLink href={`/activites/${next.slug}`} className="group block gutter" data-cursor="VOIR">
          <span className="mono text-creme/60">ACTIVITÉ SUIVANTE — {next.code}</span>
          <span className="display-tight mt-4 flex items-end justify-between gap-6 text-[clamp(3rem,10vw,10rem)] text-creme transition-colors duration-500 group-hover:text-blanc">
            <span>
              {next.name}
              <span className="text-bordeaux-light">.</span>
            </span>
            <ArrowUpRight size={64} className="mb-[0.15em] hidden shrink-0 transition-transform duration-500 group-hover:rotate-45 md:block" />
          </span>
        </TransitionLink>
      </section>
    </>
  );
}
