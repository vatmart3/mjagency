/* =========================================================
   MJ AGENCY — pages locales

   Génère une page par ville depuis les données ci-dessous.

   ATTENTION : Google sanctionne les « pages satellites », c'est-à-dire
   des pages quasi identiques où seul le nom de la ville change. Chaque
   entrée ci-dessous a donc son propre contexte, ses propres besoins et
   sa propre FAQ. Si vous ajoutez une ville, écrivez du contenu réel —
   dupliquer une ville existante en changeant le nom ferait plus de mal
   que de bien.

   Usage : node build-locales.js
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.mjagency.fr';
const TEL_AFF = '06 11 71 83 68';
const TEL_URI = '+33611718368';
const MAIL = 'mjagency.officiel@gmail.com';

const VILLES = [
  {
    slug: 'creation-site-internet-sete',
    ville: 'Sète',
    lienPied: 'Site internet à Sète',
    titre: 'Création de site internet à Sète — MJ Agency',
    desc: "Création de site internet à Sète (34200) : sites vitrines, e-commerce et refonte. Studio installé sur place, déplacement gratuit dans le bassin de Thau.",
    h1: 'Création de<br>site internet<br>à Sète',
    intro: "Nous sommes installés à Sète. Pas de plateforme à distance ni de commercial de passage : on se voit, on regarde votre activité, et on construit un site qui vous ressemble.",
    geo: [43.4053, 3.6969],
    contexte: [
      "Sète vit du port, de la pêche, du tourisme et d'un centre-ville commerçant dense. Trois économies avec trois publics différents — un restaurant des quais, un artisan du quartier Haut et une entreprise du port n'ont pas les mêmes besoins en ligne.",
      "Le tourisme est saisonnier et concentré : votre site doit être irréprochable au moment précis où les visiteurs cherchent. Sur mobile, en terrasse, avec une connexion moyenne."
    ],
    besoins: [
      ['Restaurants &amp; commerces', "Carte à jour, horaires visibles, réservation en un geste. La plupart des recherches se font sur mobile, à moins de dix minutes de chez vous."],
      ['Artisans &amp; indépendants', "Un site simple qui prouve votre sérieux et donne envie d'appeler. Photos de vos réalisations, zone d'intervention, devis en ligne."],
      ['Entreprises du port', "Un site professionnel en français et en anglais, pensé pour des interlocuteurs qui ne sont pas forcément dans la région."]
    ],
    faq: [
      ["Combien de temps pour un site à Sète&nbsp;?",
       "Comptez trois à quatre semaines pour un site vitrine, à partir du moment où nous avons vos textes et vos photos. Une refonte complète avec e-commerce demande plutôt six à huit semaines."],
      ["Vous vous déplacez dans Sète&nbsp;?",
       "Oui, sans frais. Nous préférons même commencer par un rendez-vous chez vous : voir votre local, vos produits et votre façon de travailler change tout au moment de concevoir le site."],
      ["Le référencement est-il compris&nbsp;?",
       "Les bases le sont toujours : structure, vitesse, balises, données locales, et l'aide à la mise en place de votre fiche Google Business Profile. Le référencement local se gagne surtout là, plus que dans le code."]
    ]
  },
  {
    slug: 'agence-web-montpellier',
    ville: 'Montpellier',
    lienPied: 'Agence web Montpellier',
    titre: 'Agence web à Montpellier — création de site internet | MJ Agency',
    desc: "Agence web pour Montpellier : création de site internet, refonte et identité de marque. Studio basé à Sète, à 30 minutes, déplacement sur rendez-vous.",
    h1: 'Agence web<br>à Montpellier',
    intro: "Montpellier est à trente minutes. Nous y intervenons avec un avantage simple : les tarifs d'un studio indépendant, et un interlocuteur unique qui répond au téléphone.",
    geo: [43.6108, 3.8767],
    contexte: [
      "Le marché montpelliérain est dense et concurrentiel. Sur la plupart des métiers, être bien placé sur Google ne suffit plus : il faut un site qui convainc en quelques secondes, sinon le visiteur repart chez le concurrent d'à côté.",
      "C'est précisément là que le design fait la différence. Entre deux prestataires équivalents, celui dont le site inspire confiance décroche le rendez-vous."
    ],
    besoins: [
      ['Se démarquer', "Sur un marché saturé, un site générique vous range parmi les autres. Une identité forte vous en sort."],
      ['Professions libérales', "Avocats, thérapeutes, architectes : un site sobre, rassurant, avec prise de rendez-vous en ligne."],
      ['Jeunes entreprises', "Une première image crédible sans budget d'agence parisienne, et une base qui pourra grandir avec vous."]
    ],
    faq: [
      ["Vous êtes à Sète, est-ce un problème&nbsp;?",
       "Non. Nous nous déplaçons à Montpellier sur rendez-vous, et le reste du suivi se fait en visio et par téléphone — comme avec la plupart des agences montpelliéraines, qui travaillent déjà ainsi."],
      ["Vos tarifs sont-ils ceux d'une agence montpelliéraine&nbsp;?",
       "Ils sont généralement plus bas, à qualité équivalente : nous sommes un studio indépendant, sans les frais de structure d'une grosse agence."],
      ["Reprenez-vous un site existant&nbsp;?",
       "Oui. Beaucoup de nos demandes sont des refontes : le site existe, il fonctionne, mais il date ou ne convertit pas. On repart de ce qui marche plutôt que de tout jeter."]
    ]
  },
  {
    slug: 'creation-site-internet-frontignan-bassin-de-thau',
    ville: 'Frontignan et le bassin de Thau',
    lienPied: 'Frontignan &amp; bassin de Thau',
    villeCourt: 'Frontignan',
    titre: 'Création de site internet à Frontignan et autour du bassin de Thau | MJ Agency',
    desc: "Site internet pour les vignerons, conchyliculteurs, artisans et commerces de Frontignan, Balaruc, Bouzigues, Mèze et Marseillan. Studio à Sète, à dix minutes.",
    h1: 'Sites internet<br>autour du<br>bassin de Thau',
    intro: "Frontignan, Balaruc, Bouzigues, Mèze, Marseillan : nous sommes à dix minutes de chez vous. Le bassin vit de produits qui se voient et se goûtent — votre site doit leur rendre justice.",
    geo: [43.4483, 3.7553],
    contexte: [
      "Ici, les activités sont souvent familiales et enracinées : domaines viticoles, mas conchylicoles, caveaux, artisans. Le point commun, c'est un produit dont on est fier et qu'on vend surtout en direct.",
      "Ce type d'activité gagne énormément à la vente en ligne, mais butte souvent sur la même chose : personne n'a le temps de gérer une boutique compliquée. Nous livrons des outils volontairement simples."
    ],
    besoins: [
      ['Domaines &amp; caveaux', "Présentation du domaine, des cuvées, et vente en ligne avec expédition. Une boutique qu'on met à jour en cinq minutes entre deux vendanges."],
      ['Conchyliculteurs', "Vos huîtres et vos moules en vitrine, avec commande, retrait sur place et horaires du mas. Simple, y compris sur mobile."],
      ['Commerces &amp; artisans', "Un site clair qui vous rend trouvable sur Google quand quelqu'un cherche votre métier dans votre commune."]
    ],
    faq: [
      ["Peut-on vendre en ligne depuis un domaine viticole&nbsp;?",
       "Oui, et c'est souvent le meilleur investissement. Nous mettons en place la boutique, les frais de port et les mentions obligatoires liées à l'alcool. Vous gérez vos stocks depuis votre téléphone."],
      ["Notre activité est très saisonnière, est-ce adapté&nbsp;?",
       "C'est justement l'intérêt. On peut ouvrir et fermer la vente en ligne selon la saison, afficher un message d'attente hors période, et concentrer vos efforts au bon moment."],
      ["Nous ne sommes pas à l'aise avec l'informatique.",
       "C'est le cas de la plupart de nos clients. Nous livrons une interface réduite au strict nécessaire et nous vous formons sur place, une heure suffit généralement."]
    ]
  },
  {
    slug: 'agence-web-agde-cap-d-agde',
    ville: "Agde et le Cap d'Agde",
    lienPied: "Agde &amp; Cap d'Agde",
    villeCourt: 'Agde',
    titre: "Agence web à Agde et au Cap d'Agde — création de site internet | MJ Agency",
    desc: "Création de site internet à Agde et au Cap d'Agde : hôtels, campings, restaurants, locations saisonnières. Site multilingue et réservation en ligne.",
    h1: "Sites internet<br>à Agde et<br>au Cap d'Agde",
    intro: "Agde vit du tourisme, et le tourisme se décide en ligne, souvent des mois à l'avance et depuis un autre pays. Votre site est votre première impression — parfois la seule.",
    geo: [43.3108, 3.4758],
    contexte: [
      "Hôtels, campings, restaurants, locations, activités nautiques : sur cette zone, la réservation se joue en grande partie avant l'arrivée du visiteur, sur son téléphone, dans sa langue.",
      "L'enjeu est aussi de réduire votre dépendance aux plateformes de réservation et à leurs commissions. Un site qui convertit en direct récupère une part de marge que personne ne vous prendra."
    ],
    besoins: [
      ['Hébergements', "Photos qui donnent envie, disponibilités claires, réservation directe. Chaque réservation en direct est une commission économisée."],
      ['Restaurants', "Carte, horaires, réservation. En saison, tout doit se lire en dix secondes sur un téléphone, en plein soleil."],
      ['Multilingue', "Vos visiteurs viennent d'Allemagne, des Pays-Bas, du Royaume-Uni. Un site en plusieurs langues élargit franchement votre audience."]
    ],
    faq: [
      ["Peut-on faire un site en plusieurs langues&nbsp;?",
       "Oui. Français et anglais au minimum, souvent allemand et néerlandais sur ce secteur. Le tout dans un seul site, avec un sélecteur de langue, sans multiplier les coûts."],
      ["Peut-on prendre les réservations en direct&nbsp;?",
       "Oui, et c'est généralement le cœur du projet. Nous branchons un moteur de réservation ou un système de demande, selon votre volume et vos habitudes."],
      ["Faut-il un site si nous sommes déjà sur les plateformes&nbsp;?",
       "Oui, justement. Beaucoup de voyageurs découvrent un établissement sur une plateforme puis cherchent son site pour réserver moins cher. Sans site, cette réservation part ailleurs."]
    ]
  }
];

/* ---------- Gabarit ---------- */

const villesAutres = (courant) => VILLES.filter(v => v.slug !== courant);

function page(v) {
  const url = `${SITE}/${v.slug}`;
  const court = v.villeCourt || v.ville;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: v.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, ''),
      acceptedAnswer: { '@type': 'Answer', text: a.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '') }
    }))
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Création de site internet',
    provider: { '@type': 'ProfessionalService', name: 'MJ Agency', '@id': `${SITE}/#agence` },
    areaServed: { '@type': 'City', name: court },
    url,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE}/contact`,
      servicePhone: { '@type': 'ContactPoint', telephone: TEL_URI, contactType: 'sales' }
    }
  };

  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: `Site internet à ${court}`, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${v.titre}</title>
<meta name="description" content="${v.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="FR-34">
<meta name="geo.placename" content="${court}">
<meta name="geo.position" content="${v.geo[0]};${v.geo[1]}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="MJ Agency">
<meta property="og:title" content="${v.titre}">
<meta property="og:description" content="${v.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFFFFF'/%3E%3Ctext x='50' y='68' font-family='Arial' font-weight='700' font-size='54' fill='%230D0D0F' text-anchor='middle'%3EMJ%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
<noscript><style>
  .reveal,.rs>*{opacity:1!important;transform:none!important}
  .loader{display:none}
</style></noscript>

<script type="application/ld+json">${JSON.stringify(serviceLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
</head>
<body>

<header class="nav">
  <a href="index.html" class="nav__logo"><span class="dot"></span> MJ <em>Agency</em></a>
  <nav class="nav__links" aria-label="Navigation principale">
    <a href="work.html">Réalisations</a>
    <a href="studio.html">Le studio</a>
    <a href="contact.html">Contact</a>
  </nav>
  <a href="contact.html" class="nav__cta" data-magnetic="0.3">Prendre RDV <span aria-hidden="true">↗</span></a>
  <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
</header>

<nav class="mobile-menu" aria-label="Menu mobile">
  <a href="work.html"><small>01</small>Réalisations</a>
  <a href="studio.html"><small>02</small>Le studio</a>
  <a href="contact.html"><small>03</small>Contact</a>
  <a href="contact.html" class="btn btn--glow mobile-menu__cta">Réserver un appel <span class="arw" aria-hidden="true">↗</span></a>
</nav>

<main class="wrap">

  <section class="container" style="padding-top:clamp(130px,18vh,200px);padding-bottom:clamp(36px,5vw,60px)">
    <div class="stack">
      <span class="eyebrow reveal">Agence web · ${court}, Hérault</span>
      <h1 class="display reveal">${v.h1}</h1>
      <p class="lead reveal">${v.intro}</p>
      <a href="contact.html" class="btn btn--glow reveal" data-magnetic="0.25">Demander un devis <span class="arw" aria-hidden="true">↗</span></a>
    </div>
  </section>

  <section class="container pad-y sep">
    <div class="split">
      <div class="reveal">
        <span class="eyebrow">Le contexte</span>
        <h2 class="h2 mt-m">Travailler<br>à ${court}</h2>
      </div>
      <div class="reveal">
        ${v.contexte.map((p, i) => `<p class="lead${i ? ' mt-m dim' : ''}">${p}</p>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="container pad-y sep">
    <div class="sec-head">
      <div class="sec-head__t reveal">
        <span class="eyebrow">Vos besoins</span>
        <h2 class="h2">Ce que nous<br>voyons le plus</h2>
      </div>
    </div>
    <div class="steps rs">
      ${v.besoins.map(([t, d]) => `<div class="step"><h3 class="step__name">${t}</h3><p class="step__desc">${d}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section class="container pad-y sep">
    <div class="sec-head">
      <div class="sec-head__t reveal">
        <span class="eyebrow">Ce que nous livrons</span>
        <h2 class="h2">Inclus dans<br>chaque projet</h2>
      </div>
    </div>
    <div class="cap-list reveal">
      <div class="cap"><h3 class="cap__name">Design<br>sur-mesure</h3><span class="cap__desc">Aucun thème acheté, aucun gabarit recyclé. Le site est dessiné pour votre activité et pour vos clients.</span></div>
      <div class="cap"><h3 class="cap__name">Mobile<br>d'abord</h3><span class="cap__desc">La majorité de vos visiteurs arrivent depuis un téléphone. C'est là que nous concevons en premier, pas en dernier.</span></div>
      <div class="cap"><h3 class="cap__name">Référencement<br>local</h3><span class="cap__desc">Structure, vitesse, données locales et accompagnement sur votre fiche Google Business Profile.</span></div>
      <div class="cap"><h3 class="cap__name">Formation<br>et suivi</h3><span class="cap__desc">Vous repartez en sachant modifier vos textes, vos photos et vos horaires vous-même.</span></div>
    </div>
  </section>

  <section class="container pad-y sep">
    <div class="sec-head">
      <div class="sec-head__t reveal">
        <span class="eyebrow">Questions fréquentes</span>
        <h2 class="h2">Vous vous<br>demandez</h2>
      </div>
    </div>
    <div class="faq reveal">
      ${v.faq.map(([q, a]) => `<div class="faq__item"><h3 class="faq__q">${q}</h3><p class="faq__a">${a}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section class="container pad-y sep">
    <div class="sec-head">
      <div class="sec-head__t reveal">
        <span class="eyebrow">Ailleurs dans l'Hérault</span>
        <h2 class="h2">Autres villes</h2>
      </div>
    </div>
    <ul class="towns reveal">
      ${villesAutres(v.slug).map(o => `<li><a href="${o.slug}.html">${o.villeCourt || o.ville}</a></li>`).join('\n      ')}
      <li><a href="index.html#zone">Toute la zone</a></li>
    </ul>
  </section>

  <section class="container pad-y sep">
    <div class="cta-band reveal">
      <span class="eyebrow">Devis gratuit · Réponse sous 24 h</span>
      <h2 class="h2">Un projet<br>à ${court}&nbsp;?</h2>
      <a href="contact.html" class="btn btn--glow" data-magnetic="0.3" data-cursor="Réserver">Réserver un appel <span class="arw" aria-hidden="true">↗</span></a>
      <p class="dim" style="font-size:14px">ou appelez directement le <a href="tel:${TEL_URI}" style="color:var(--accent-2)">${TEL_AFF}</a></p>
    </div>
  </section>

</main>

<footer class="footer container">
  <div class="footer__big reveal"><a href="contact.html" data-cursor="Écrire">Parlons-en <span class="arw" aria-hidden="true">↗</span></a></div>
  <div class="footer__cols">
    <div class="footer__col">
      <a href="index.html" class="nav__logo" style="margin-bottom:16px"><span class="dot"></span> MJ Agency</a>
      <p class="dim" style="max-width:34ch">Agence web et studio créatif à Sète. Sites internet, identité de marque et design pour les entreprises de l'Hérault.</p>
    </div>
    <div class="footer__col">
      <h4>Navigation</h4>
      <a href="work.html">Réalisations</a>
      <a href="studio.html">Le studio</a>
      <a href="contact.html">Contact</a>
      <a href="index.html#zone">Zone d'intervention</a>
    </div>
    <div class="footer__col">
      <h4>Nos zones</h4>
${VILLES.map(o => `      <a href="${o.slug}.html">${o.lienPied}</a>`).join('\n')}
    </div>

    <div class="footer__col">
      <h4>Nous trouver</h4>
      <address class="nap">
        <span class="nap__line">34200 Sète, Hérault</span>
        <a href="tel:${TEL_URI}">${TEL_AFF}</a>
        <a href="mailto:${MAIL}">${MAIL}</a>
      </address>
      <p class="dim" style="font-size:13px">Lun — Ven · 9 h à 18 h</p>
    </div>
  </div>
  <div class="footer__bottom"><span>© 2026 MJ Agency — Sète, Hérault</span><span>Conçu avec intention.</span></div>
</footer>

<script src="assets/js/bg.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;
}

/* ---------- Écriture ---------- */
VILLES.forEach(v => {
  fs.writeFileSync(path.join(__dirname, v.slug + '.html'), page(v));
  console.log('  ' + v.slug + '.html');
});

/* ---------- Plan du site ---------- */
const urls = [
  ['/', 'monthly', '1.0'],
  ['/work', 'monthly', '0.8'],
  ['/studio', 'yearly', '0.7'],
  ['/contact', 'yearly', '0.9'],
  ...VILLES.map(v => ['/' + v.slug, 'monthly', '0.8'])
];
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, f, p]) => `  <url>
    <loc>${SITE}${u}</loc>
    <changefreq>${f}</changefreq>
    <priority>${p}</priority>
  </url>`).join('\n')}
</urlset>
`);

console.log(`${VILLES.length} pages locales + sitemap.xml (${urls.length} URL)`);
