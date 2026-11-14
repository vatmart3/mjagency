"use client";
import { hero } from "@/content/site";
import { useUI } from "@/lib/store";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowUpRight } from "@/components/ui/Icons";
import { useEffect, useRef } from "react";

export default function ActivityCTA({ slug, name }: { slug: string; name: string }) {
  const openContact = useUI((s) => s.openContact);
  const setContactInView = useUI((s) => s.setContactInView);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setContactInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      setContactInView(false);
    };
  }, [setContactInView]);
  return (
    <section ref={ref} data-hide-cta data-theme="bordeaux" className="on-dark bg-bordeaux py-24 text-blanc md:py-32" aria-labelledby="cta-activite">
      <div className="gutter">
        <p className="mono text-creme/75">PASSER À L&apos;ACTION</p>
        <h2 id="cta-activite" className="display-tight mt-6 max-w-[60rem] text-[clamp(2.8rem,7.5vw,8rem)]">
          Un projet {name} ?<br />
          On lui donne forme<span className="text-creme">.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton variant="creme" onClick={() => openContact(slug)} cursor="↗" className="!px-7 !py-4 text-[1rem]">
            {hero.ctaPrimary} <ArrowUpRight size={16} />
          </MagneticButton>
          <span className="inline-flex items-center gap-2 rounded-full border border-creme/30 px-4 py-2.5 text-[0.9rem] text-creme">
            <span className="h-1.5 w-1.5 rounded-full bg-creme" aria-hidden="true" /> {hero.offer}
          </span>
        </div>
        <p className="mono mt-5 text-creme/80">{hero.reassurance}</p>
      </div>
    </section>
  );
}
