import { activities, site } from "@/content/site";
import Submark from "@/components/ui/Submark";
import TransitionLink from "@/components/ui/TransitionLink";

export default function Footer() {
  return (
    <footer id="footer" data-theme="dark" className="on-dark relative overflow-hidden bg-noir pt-20 text-creme">
      <div className="grid grid-cols-12 gap-y-10 gutter">
        <div className="col-span-12 md:col-span-4">
          <Submark dark size={128} />
          <p className="mt-6 max-w-[20rem] text-[0.95rem] leading-relaxed text-creme/75">
            {site.description.split(":")[0].trim()}.
          </p>
        </div>
        <nav aria-label="Activités" className="col-span-6 md:col-span-3">
          <p className="mono mb-4 text-creme/55">ACTIVITÉS</p>
          <ul className="space-y-2">
            {activities.map((a) => (
              <li key={a.slug}>
                <TransitionLink href={`/activites/${a.slug}`} className="text-[0.95rem] text-creme/90 transition-colors hover:text-bordeaux-light">
                  {a.name}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 md:col-span-3">
          <p className="mono mb-4 text-creme/55">RÉSEAUX</p>
          <ul className="space-y-2">
            {site.social.map((s) => (
              <li key={s.label} className="text-[0.95rem]">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener" className="text-creme/90 transition-colors hover:text-bordeaux-light">
                    {s.label}
                  </a>
                ) : (
                  <span className="text-creme/55">
                    {s.label} <span className="mono text-[9px]">BIENTÔT</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-2">
          <p className="mono mb-4 text-creme/55">LE LAB</p>
          <ul className="space-y-2 text-[0.95rem]">
            <li><a href={`mailto:${site.contact.email}`} className="text-creme/90 hover:text-bordeaux-light">E-mail</a></li>
            <li><a href={site.contact.phoneHref} className="text-creme/90 hover:text-bordeaux-light">Téléphone</a></li>
            <li><TransitionLink href="/mentions-legales" className="text-creme/90 hover:text-bordeaux-light">Mentions légales</TransitionLink></li>
            <li><TransitionLink href="/confidentialite" className="text-creme/90 hover:text-bordeaux-light">Confidentialité</TransitionLink></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 gutter" data-cursor="↗">
        <p
          aria-label="MJ LAB."
          className="outline-fill select-none whitespace-nowrap font-display text-[21.5vw] font-extrabold leading-[0.78] tracking-[-0.065em]"
        >
          MJ LAB.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-creme/10 py-5 gutter md:flex-row md:items-center md:justify-between">
        <p className="mono text-creme/60">© 2026 MJ LAB — {site.signature.toUpperCase()}</p>
        <p className="mono text-creme/60">{site.location.coords} — SÈTE · FRONTIGNAN</p>
      </div>
    </footer>
  );
}
