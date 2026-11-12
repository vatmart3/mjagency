/* =========================================================
   MJ AGENCY — Génération de la page /offre-noel

   Fait partie du thème de Noël. Pour retirer le thème : supprimer ce
   fichier, offre-noel.html, et la ligne marquée « THÈME DE NOËL » dans le
   plan du site de build-locales.js.

   La barre de navigation, le menu mobile et le pied de page ne sont PAS
   recopiés ici : ils sont découpés dans index.html à la génération, comme
   le fait déjà build.js. Une seule source, et la page suit automatiquement
   toute retouche du reste du site.

   Les textes (cadeaux, questions, échéance, places) viennent de
   noel-config.js, lu ici dans un bac à sable : le même fichier sert au
   navigateur et au générateur, il n'y a donc jamais deux versions.

   Usage : node build-noel.js   (après build-locales.js)
   ========================================================= */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const racine = __dirname;
const lire = f => fs.readFileSync(path.join(racine, f), 'utf8');
const SITE = 'https://www.mjagency.eu';

/* ---------- La config, lue sans l'exécuter dans notre contexte ---------- */
const bac = { window: {} };
vm.createContext(bac);
vm.runInContext(lire('assets/js/noel-config.js'), bac);
const C = bac.window.MJ_NOEL;
if (!C) throw new Error('noel-config.js n’a pas défini window.MJ_NOEL');

/* ---------- Découpage dans index.html ---------- */
function tranche(html, debut, fin) {
  const d = html.indexOf(debut);
  if (d === -1) throw new Error(`Marqueur introuvable : ${debut}`);
  const f = html.indexOf(fin, d + debut.length);
  if (f === -1) throw new Error(`Fin introuvable : ${fin}`);
  return html.slice(d, f + fin.length);
}
const accueil = lire('index.html');
const NAV    = tranche(accueil, '<header class="nav"', '</header>');
const MENU   = tranche(accueil, '<nav class="mobile-menu"', '</nav>');
const PIED   = tranche(accueil, '<footer class="footer container">', '</footer>');
const AMORCE = tranche(accueil, '<!-- AMORCE DU THÈME DE NOËL', '</script>');

const ech = (C.echeance || '').slice(0, 10);          // 2026-12-31
const debutOffre = ech.slice(0, 4) + '-12-01';

const echappe = v => String(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const VILLES = ['Sète', 'Frontignan', 'Balaruc-les-Bains', 'Montpellier'];

/* ---------- Le document ---------- */
const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<title>Offre de fin d'année — Création de site à Sète | MJAGENCY</title>
<meta name="description" content="Réservez votre créneau de janvier avant le ${C.echeanceTexte} : carte NFC d'avis Google, coffret de livraison et mise en ligne prioritaire offerts. Création de site internet à Sète, Frontignan, Balaruc-les-Bains et Montpellier.">
<link rel="canonical" href="${SITE}/offre-noel">
<meta name="theme-color" content="#FFFFFF">
<meta name="color-scheme" content="light">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="Offre de fin d'année — Création de site à Sète | MJAGENCY">
<meta property="og:description" content="Signez avant le ${C.echeanceTexte}, on livre en janvier. Carte NFC d'avis Google, coffret de livraison et priorité sur le planning.">
<meta property="og:url" content="${SITE}/offre-noel">
<meta property="og:image" content="${SITE}/assets/img/og.png">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFFFFF'/%3E%3Ctext x='50' y='68' font-family='Arial' font-weight='700' font-size='54' fill='%230D0D0F' text-anchor='middle'%3EMJ%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
${AMORCE}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "Offre de fin d'année — création de site internet",
  "description": "Pour toute signature avant le ${C.echeanceTexte} : carte NFC d'avis Google offerte, coffret de livraison MJ Agency, et mise en ligne prioritaire en janvier. Le tarif de la prestation reste inchangé.",
  "url": "${SITE}/offre-noel",
  "category": "Création de site internet",
  "availability": "https://schema.org/LimitedAvailability",
  "availabilityStarts": "${debutOffre}",
  "validFrom": "${debutOffre}",
  "validThrough": "${ech}",
  "eligibleQuantity": { "@type": "QuantitativeValue", "value": ${C.places}, "unitText": "projets" },
  "seller": {
    "@type": "ProfessionalService",
    "name": "MJAGENCY",
    "url": "${SITE}/",
    "telephone": "+33647571370",
    "address": { "@type": "PostalAddress", "addressLocality": "Sète", "postalCode": "34200", "addressCountry": "FR" }
  },
  "areaServed": [
${VILLES.map(v => `    { "@type": "City", "name": "${v}" }`).join(',\n')}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${C.faq.map(q => `    { "@type": "Question", "name": ${JSON.stringify(q.q)},
      "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(q.r)} } }`).join(',\n')}
  ]
}
</script>

<noscript><style>
  .reveal,.rs>*{opacity:1!important;transform:none!important}
</style></noscript>
</head>
<body class="p-offre">

<canvas id="bg-canvas" aria-hidden="true"></canvas>

${NAV}

${MENU}

<main class="wrap">

  <!-- HERO -->
  <section class="hero container">
    <span class="eyebrow noel-eyebrow reveal">Offre de fin d'année · Bassin de Thau</span>
    <h1 class="display hero__title reveal">2027 commence avec<br>un site qui vend.</h1>
    <div class="hero__meta">
      <p class="lead reveal">Réservez avant le ${C.echeanceTexte}, on livre en janvier — pendant que vos concurrents dorment encore.</p>
      <div class="hero__actions reveal">
        <a href="${C.lienDevis}" class="btn btn--glow">Réserver mon créneau de janvier <span class="arw" aria-hidden="true">↗</span></a>
        <a href="#calendrier" class="link-t">Ouvrir la case du jour <span class="arw" aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>

  <!-- CE QUE NOUS OFFRONS -->
  <section class="container pad-y sep noel-sec" id="offre">
    <div class="sec-head reveal">
      <span class="eyebrow noel-eyebrow">Ce qui est offert</span>
      <h2 class="h2">Signez avant le 31 décembre,<br>on vous offre&nbsp;:</h2>
    </div>
    <div class="noel-offre">
      <ul class="noel-dons reveal">
        <li class="noel-don"><span class="noel-don__n">1</span><div>
          <b>Votre carte NFC d'avis Google</b>
          <span>Posée près de la caisse. Le client approche son téléphone, l'avis s'ouvre. C'est ce qui transforme une bonne journée en avis écrit.</span></div></li>
        <li class="noel-don"><span class="noel-don__n">2</span><div>
          <b>Le coffret de livraison MJ&nbsp;Agency</b>
          <span>Votre contrat, la carte NFC de votre site, et deux ou trois choses qu'on préfère vous laisser découvrir le jour de la mise en ligne.</span></div></li>
        <li class="noel-don"><span class="noel-don__n">3</span><div>
          <b>La mise en ligne prioritaire en janvier</b>
          <span>Le planning se remplit dans l'ordre des signatures. Signer en décembre, c'est être en ligne avant les autres.</span></div></li>
      </ul>
      <div class="coffret reveal" aria-hidden="true"><div class="coffret__scene">
        <div class="coffret__lueur"></div><div class="coffret__corps"></div>
        <div class="coffret__couvercle"></div><div class="coffret__noeud"></div>
      </div></div>
    </div>
    <p class="noel-mention">Ce n'est pas une remise&nbsp;: le tarif de la prestation ne change pas. Offre valable pour toute signature avant le <span data-noel="echeance">${C.echeanceTexte}</span>, dans la limite de <span data-noel="places">${C.places}</span> projets.</p>
  </section>

  <!-- CALENDRIER DE L'AVENT
       Masqué par défaut : hors période le script du thème n'est pas chargé,
       et une façade vide au milieu de la page n'aurait aucun sens. -->
  <section class="container pad-y sep noel-sec" id="calendrier" data-noel-saison hidden>
    <div class="sec-head reveal">
      <span class="eyebrow noel-eyebrow">Calendrier de l'avent</span>
      <h2 class="h2">24 conseils pour vendre plus<br>en 2027.</h2>
      <p class="lead">Une fenêtre par jour, un conseil applicable le jour même. Pensés pour les commerçants du bassin de Thau, pas pour les start-up.</p>
    </div>
    <div data-avent class="reveal"></div>
  </section>

  <!-- QUESTIONS -->
  <section class="container pad-y sep noel-sec" id="questions">
    <div class="sec-head reveal">
      <span class="eyebrow noel-eyebrow">Questions fréquentes</span>
      <h2 class="h2">Ce qu'on nous demande<br>avant de signer.</h2>
    </div>
    <div class="faq reveal">
${C.faq.map(q => `      <details class="faq__item">
        <summary class="faq__q"><h3>${echappe(q.q)}</h3></summary>
        <p class="faq__a">${echappe(q.r)}</p>
      </details>`).join('\n')}
    </div>
  </section>

  <!-- APPEL -->
  <section class="container pad-y sep">
    <div class="cta-band reveal">
      <span class="eyebrow noel-eyebrow">Réponse sous 24&nbsp;h</span>
      <h2 class="h2">Il reste <span data-noel="places">${C.places}</span> places<br>pour janvier.</h2>
      <a href="${C.lienDevis}" class="btn btn--glow">Réserver mon créneau <span class="arw" aria-hidden="true">↗</span></a>
    </div>
  </section>

</main>

${PIED}

<script src="assets/js/bg.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(racine, 'offre-noel.html'), page);
console.log(`  offre-noel.html — ${C.faq.length} questions, ${C.cases.length} cases en config`);
