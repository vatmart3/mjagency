import type { Metadata } from "next";
import { legal, site } from "@/content/site";
import LegalPage, { LegalBlock, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: `Politique de confidentialité du site ${site.name}.`,
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage index="L-02" title="Confidentialité" updated={legal.lastUpdate}>
      <LegalBlock n="01" title="Responsable du traitement">
        <p><Todo>{legal.companyName}</Todo> — <Todo>{legal.address}</Todo> — <a className="underline underline-offset-2" href={`mailto:${legal.email}`}>{legal.email}</a></p>
      </LegalBlock>
      <LegalBlock n="02" title="Données collectées">
        <p>
          Via le formulaire « Lancer un projet » uniquement : activité concernée, description du projet, budget et délai indicatifs, prénom, adresse e-mail et, si vous le souhaitez, numéro de téléphone.
        </p>
        <p>
          Pendant que vous remplissez le formulaire, vos réponses sont gardées dans le stockage local de votre navigateur pour que vous puissiez reprendre plus tard. Elles ne quittent votre appareil qu&apos;au moment de l&apos;envoi.
        </p>
      </LegalBlock>
      <LegalBlock n="03" title="Finalité et base légale">
        <p>Répondre à votre demande et vous recontacter à son sujet (mesures précontractuelles prises à votre demande).</p>
      </LegalBlock>
      <LegalBlock n="04" title="Destinataires et sous-traitants">
        <p>
          Les demandes sont transmises par e-mail via Resend (envoi) et le site est hébergé par Vercel. Aucune donnée n&apos;est vendue ni cédée.
        </p>
      </LegalBlock>
      <LegalBlock n="05" title="Durée de conservation">
        <p><Todo>TODO — durée de conservation des demandes (ex. 3 ans après le dernier contact)</Todo></p>
      </LegalBlock>
      <LegalBlock n="06" title="Cookies et mesure d'audience">
        <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d&apos;audience. Une seule valeur locale retient que le chargement d&apos;introduction a déjà été vu.</p>
      </LegalBlock>
      <LegalBlock n="07" title="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de limitation. Écrivez à{" "}
          <a className="underline underline-offset-2" href={`mailto:${legal.email}`}>{legal.email}</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).
        </p>
      </LegalBlock>
    </LegalPage>
  );
}
