import type { Metadata } from "next";
import { legal, site } from "@/content/site";
import LegalPage, { LegalBlock, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${site.name}.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage index="L-01" title="Mentions légales" updated={legal.lastUpdate}>
      <LegalBlock n="01" title="Éditeur du site">
        <ul className="space-y-1.5">
          <li>Raison sociale : <Todo>{legal.companyName}</Todo></li>
          <li>Statut juridique : <Todo>{legal.legalForm}</Todo></li>
          <li>SIRET : <Todo>{legal.siret}</Todo></li>
          <li>Siège : <Todo>{legal.address}</Todo></li>
          <li>TVA : <Todo>{legal.vat}</Todo></li>
          <li>E-mail : <a className="underline underline-offset-2" href={`mailto:${legal.email}`}>{legal.email}</a></li>
          <li>Téléphone : {legal.phone}</li>
        </ul>
      </LegalBlock>
      <LegalBlock n="02" title="Responsable de la publication">
        <p><Todo>{legal.publisher}</Todo></p>
      </LegalBlock>
      <LegalBlock n="03" title="Hébergement">
        <ul className="space-y-1.5">
          <li>Hébergeur : {legal.host.name}</li>
          <li>Adresse : <Todo>{legal.host.address}</Todo></li>
          <li>Site : <a className="underline underline-offset-2" href={legal.host.url} target="_blank" rel="noopener">{legal.host.url.replace("https://", "")}</a></li>
        </ul>
      </LegalBlock>
      <LegalBlock n="04" title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus de ce site — textes, images, éléments graphiques, logo, animations et code — est la propriété de {site.name}, sauf mention contraire. Toute reproduction, totale ou partielle, est interdite sans autorisation écrite préalable.
        </p>
      </LegalBlock>
      <LegalBlock n="05" title="Droit applicable">
        <p>Les présentes mentions sont soumises au droit français.</p>
      </LegalBlock>
    </LegalPage>
  );
}
