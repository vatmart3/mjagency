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

const SITE = 'https://www.mjagency.eu';
const TEL_AFF = '06 11 71 83 68';
const TEL_URI = '+33611718368';
const MAIL = 'mjagency.officiel@gmail.com';

const VILLES = [
  {
    slug: 'creation-site-internet-sete',
    ville: 'Sète',
    lienPied: 'Site internet à Sète',
    titre: 'Création de site internet à Sète — agence web | MJ Agency',
    desc: "Agence web et digitale à Sète (34200) : création de site internet, refonte et e-commerce. Studio installé sur place, déplacement gratuit dans le bassin de Thau.",
    h1: 'Agence web à Sète,<br>création de<br>site internet',
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
       "Les bases le sont toujours : structure, vitesse, balises, données locales, et l'aide à la mise en place de votre fiche Google Business Profile. Le référencement local se gagne surtout là, plus que dans le code."],
      ["Agence web, agence digitale, agence de communication : laquelle êtes-vous&nbsp;?",
       "Les trois mots désignent le même métier, et chacun est tapé par des gens différents. Ce qui compte est le périmètre : nous faisons les sites internet, l'identité de marque, le design d'interface, le motion et la 3D. Nous ne faisons pas d'achat publicitaire ni de gestion de réseaux sociaux — nous préférons le dire que le sous-traiter."],
      ["Reprenez-vous un site existant&nbsp;?",
       "Oui, la refonte représente une bonne moitié de notre activité à Sète. Nous récupérons vos contenus, redirigeons les anciennes adresses vers les nouvelles pour ne perdre aucun positionnement acquis, et remettons le site aux standards de vitesse et de mobile."]
    ]
  },
  {
    slug: 'agence-web-montpellier',
    ville: 'Montpellier',
    lienPied: 'Agence web Montpellier',
    titre: 'Agence web à Montpellier — site internet | MJ Agency',
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
    titre: 'Site internet à Frontignan et bassin de Thau | MJ Agency',
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
    titre: "Agence web à Agde et Cap d'Agde — site internet | MJ Agency",
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


/* =========================================================
   PAGES LÉGALES

   Un site professionnel français doit publier des mentions légales
   (LCEN, art. 6-III) et informer sur le traitement des données
   personnelles (RGPD, art. 13). Le formulaire de contact collecte des
   données : les deux pages sont obligatoires.

   TOUT CE QUI MANQUE SE REMPLIT CI-DESSOUS, ET NULLE PART AILLEURS.
   Une valeur laissée à null s'affiche en clair comme « à compléter » :
   c'est volontaire. Mieux vaut un visiteur qui voit un trou qu'une
   information inventée dans un document qui engage juridiquement.
   Tant qu'il reste un null, le site n'est pas en règle.
   ========================================================= */
const IDENTITE = {
  denomination: 'MJ Agency',
  forme:        null,   // ex. 'Entreprise individuelle (EI)', 'SAS', 'SASU'
  capital:      null,   // ex. '1 000 €' — uniquement pour une société
  siege:        null,   // adresse postale complète du siège
  siret:        null,   // 14 chiffres
  rcs:          null,   // ex. 'RCS Montpellier 123 456 789' — si société
  tva:          null,   // ex. 'FR12345678901' — ou 'Non assujetti à la TVA'
  publication:  null,   // nom du responsable de la publication
  mail:         MAIL,
  telAff:       TEL_AFF,
  telUri:       TEL_URI,
  // Nom certain, adresse à recopier depuis vercel.com : je ne l'ai pas
  // vérifiée moi-même et une adresse fausse dans des mentions légales est
  // pire que pas d'adresse du tout.
  hebergeur:    'Vercel Inc.',
  hebergeurAdr: null,
};

const aRemplir = (v, quoi) =>
  v ? v : `<mark class="aremplir" title="Information obligatoire, à renseigner dans build-locales.js">${quoi} à compléter</mark>`;

function pageLegale({ slug, titre, desc, h1, chapo, corps }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<title>${titre} | MJ Agency</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${slug}">
<meta name="theme-color" content="#FFFFFF">
<meta name="color-scheme" content="light">
<meta name="robots" content="index, follow">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFFFFF'/%3E%3Ctext x='50' y='68' font-family='Arial' font-weight='700' font-size='54' fill='%230D0D0F' text-anchor='middle'%3EMJ%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
<noscript><style>.reveal,.rs>*{opacity:1!important;transform:none!important}.masque>span,.hero__title .line>span{transform:none!important}</style></noscript>
</head>
<body>
<canvas id="bg-canvas" aria-hidden="true"></canvas>

${NAV}

<main class="wrap">
  <section class="container" style="padding-top:clamp(120px,16vh,180px);padding-bottom:clamp(28px,4vw,44px)">
    <div class="legal-tete">
      <span class="eyebrow reveal">Informations légales</span>
      <h1 class="h2 reveal">${h1}</h1>
      <p class="lead reveal">${chapo}</p>
    </div>
  </section>

  <section class="container sep" style="padding-top:var(--sec);padding-bottom:var(--sec)">
    <div class="legal reveal">
${corps}
    </div>
  </section>
</main>

<footer class="footer container">
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
  <div class="footer__bottom">
    <span>© 2026 MJ Agency — Sète, Hérault</span>
    <span class="footer__legal"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a></span>
  </div>
</footer>

<script src="assets/js/recherche-index.js"></script>
<script src="assets/js/bg.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;
}


/* ---------- Contenu des deux pages légales ---------- */
const MENTIONS = [
  ['Éditeur du site', `
      <p>Le présent site est édité par&nbsp;:</p>
      <ul>
        <li><b>Dénomination</b> : ${IDENTITE.denomination}</li>
        <li><b>Forme juridique</b> : ${aRemplir(IDENTITE.forme, 'Forme juridique')}</li>
        <li><b>Capital social</b> : ${aRemplir(IDENTITE.capital, 'Capital social (si société)')}</li>
        <li><b>Siège social</b> : ${aRemplir(IDENTITE.siege, 'Adresse du siège')}</li>
        <li><b>SIRET</b> : ${aRemplir(IDENTITE.siret, 'SIRET')}</li>
        <li><b>Immatriculation</b> : ${aRemplir(IDENTITE.rcs, 'RCS ou répertoire des métiers')}</li>
        <li><b>TVA intracommunautaire</b> : ${aRemplir(IDENTITE.tva, 'Numéro de TVA (ou mention de non-assujettissement)')}</li>
        <li><b>Téléphone</b> : <a href="tel:${IDENTITE.telUri}">${IDENTITE.telAff}</a></li>
        <li><b>Courriel</b> : <a href="mailto:${IDENTITE.mail}">${IDENTITE.mail}</a></li>
      </ul>`],

  ['Responsable de la publication', `
      <p>${aRemplir(IDENTITE.publication, 'Nom du responsable de la publication')}, joignable à
      l’adresse <a href="mailto:${IDENTITE.mail}">${IDENTITE.mail}</a>.</p>`],

  ['Hébergement', `
      <p>Le site est hébergé par&nbsp;:</p>
      <ul>
        <li><b>Hébergeur</b> : ${IDENTITE.hebergeur}</li>
        <li><b>Adresse</b> : ${aRemplir(IDENTITE.hebergeurAdr, 'Adresse de l’hébergeur, à recopier depuis vercel.com')}</li>
        <li><b>Site</b> : <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a></li>
      </ul>`],

  ['Propriété intellectuelle', `
      <p>L’ensemble des contenus de ce site — textes, images, éléments graphiques,
      animations, code — est la propriété de ${IDENTITE.denomination}, sauf mention
      contraire. Toute reproduction, représentation ou adaptation, totale ou
      partielle, est interdite sans autorisation écrite préalable.</p>
      <p>Les projets présentés dans la rubrique Réalisations restent la propriété de
      leurs commanditaires respectifs et sont montrés à titre de référence, avec
      leur accord.</p>`],

  ['Liens vers d’autres sites', `
      <p>Ce site renvoie vers des sites que nous avons réalisés et vers ceux de nos
      prestataires. Nous n’exerçons aucun contrôle sur leur contenu et n’en assumons
      pas la responsabilité.</p>`],

  ['Droit applicable', `
      <p>Les présentes mentions sont soumises au droit français. En cas de litige, et
      à défaut de résolution amiable, les tribunaux français sont seuls compétents.</p>`],

  ['Signalement d’un contenu', `
      <p>Pour signaler un contenu que vous estimez illicite, écrivez à
      <a href="mailto:${IDENTITE.mail}">${IDENTITE.mail}</a> en précisant l’adresse de
      la page concernée et le motif du signalement.</p>`],
];

const CONFIDENTIALITE = [
  ['En deux lignes', `
      <p>Ce site ne dépose <b>aucun cookie</b>, n’utilise <b>aucun outil de mesure
      d’audience</b> et ne contient <b>aucun traceur publicitaire</b>. Les seules
      données que nous recevons sont celles que vous nous transmettez volontairement
      par le formulaire de contact.</p>
      <p>Deux préférences d’affichage sont conservées dans votre navigateur, et n’en
      sortent jamais&nbsp;: le thème que vous avez choisi, et le fait que vous avez lu
      l’avis en bas de page. Nous n’y avons pas accès.</p>`],

  ['Responsable du traitement', `
      <p>${IDENTITE.denomination} — ${aRemplir(IDENTITE.siege, 'Adresse du siège')} —
      <a href="mailto:${IDENTITE.mail}">${IDENTITE.mail}</a>.</p>`],

  ['Données collectées', `
      <p>Le formulaire de prise de rendez-vous collecte&nbsp;:</p>
      <ul>
        <li>votre <b>nom</b> et votre <b>adresse électronique</b> (obligatoires, pour vous répondre)&nbsp;;</li>
        <li>votre <b>société</b> et votre <b>budget indicatif</b> (facultatifs)&nbsp;;</li>
        <li>la <b>description de votre projet</b> (facultative)&nbsp;;</li>
        <li>la <b>date et l’heure</b> du créneau que vous choisissez.</li>
      </ul>
      <p>Aucune autre donnée n’est collectée. Nous ne recueillons ni votre adresse IP
      à des fins de suivi, ni votre historique de navigation.</p>`],

  ['Pourquoi, et sur quelle base', `
      <p>Ces données servent <b>uniquement</b> à vous recontacter, préparer notre
      échange et établir une proposition. Elles ne sont jamais vendues, louées ni
      cédées à des fins commerciales.</p>
      <p>La base légale est l’<b>exécution de mesures précontractuelles</b> prises à
      votre demande (article 6.1.b du RGPD)&nbsp;: vous nous écrivez pour obtenir une
      proposition.</p>`],

  ['Qui d’autre y a accès', `
      <p>Pour acheminer votre message, nous faisons appel à des sous-traitants&nbsp;:</p>
      <ul>
        <li><b>Vercel Inc.</b> — hébergement du site et de la fonction qui reçoit le formulaire.</li>
        <li><b>Resend</b> (Plus Five Five, Inc.) — acheminement du courriel vers notre boîte.</li>
      </ul>
      <p>Ces deux prestataires sont établis aux États-Unis. Les transferts s’effectuent
      sur la base des <b>clauses contractuelles types</b> de la Commission européenne
      et, le cas échéant, du <b>cadre de protection des données UE–États-Unis</b>.
      Aucun autre destinataire ne reçoit vos données.</p>`],

  ['Combien de temps', `
      <p>Les échanges liés à une demande sans suite sont supprimés au bout de
      <b>trois ans</b> à compter du dernier contact. Les données liées à un projet
      effectivement mené sont conservées pendant la durée de la relation, puis selon
      les obligations comptables et fiscales applicables (dix ans pour les pièces
      comptables).</p>`],

  ['Vos droits', `
      <p>Vous disposez d’un droit d’<b>accès</b>, de <b>rectification</b>,
      d’<b>effacement</b>, de <b>limitation</b>, d’<b>opposition</b> et de
      <b>portabilité</b> sur vos données. Pour l’exercer, écrivez à
      <a href="mailto:${IDENTITE.mail}">${IDENTITE.mail}</a>&nbsp;: nous répondons sous
      un mois au plus.</p>
      <p>Si notre réponse ne vous satisfait pas, vous pouvez saisir la
      <b>CNIL</b> — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —
      <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>.</p>`],

  ['Cookies et stockage local', `
      <p>Aucun cookie n’est déposé sur votre appareil, ni par nous ni par un tiers.
      Aucun traceur, aucune mesure d’audience.</p>
      <p>Le site conserve deux valeurs dans le stockage local de votre navigateur&nbsp;:
      <code>mj-theme</code>, le thème clair ou sombre que vous avez choisi, et
      <code>mj-avis-stockage</code>, qui évite de vous remontrer l’avis déjà lu. Ces
      valeurs restent sur votre appareil, ne sont jamais transmises et ne permettent
      pas de vous identifier.</p>
      <p>C’est la raison pour laquelle aucune bannière de consentement ne vous est
      présentée&nbsp;: une préférence d’affichage que vous avez vous-même demandée est
      <b>exemptée de consentement</b>, et il n’y a rien d’autre à consentir. Pour les
      effacer, videz les données de site pour ce domaine dans votre navigateur.</p>`],

  ['Sécurité', `
      <p>Le site est servi exclusivement en HTTPS. Les clés d’accès aux services
      d’envoi sont conservées côté serveur et n’apparaissent jamais dans les pages.
      Le formulaire est protégé contre les envois automatisés.</p>`],
];

const enSections = (blocs) => blocs.map(([t, c]) =>
  `      <section class="legal__bloc">\n        <h2>${t}</h2>${c}\n      </section>`).join('\n');

const PAGES_LEGALES = [
  { slug: 'mentions-legales',
    titre: 'Mentions légales',
    desc: 'Mentions légales de MJ Agency, agence web à Sète : éditeur, hébergeur, propriété intellectuelle et droit applicable.',
    h1: 'Mentions légales',
    chapo: 'Les informations que tout site professionnel doit rendre publiques, réunies sur une page.',
    corps: enSections(MENTIONS) },
  { slug: 'confidentialite',
    titre: 'Politique de confidentialité',
    desc: 'Comment MJ Agency traite les données du formulaire de contact : finalité, destinataires, durée de conservation et vos droits.',
    h1: 'Politique de confidentialité',
    chapo: 'Ce que nous recevons, pourquoi, qui y a accès, combien de temps — et comment reprendre la main.',
    corps: enSections(CONFIDENTIALITE) },
];

/* Bandeau et menu, une seule fois pour toutes les pages générées. */
const NAV = `<header class="nav">
  <a href="index.html" class="nav__logo"><span class="dot"></span> MJ <em>Agency</em></a>
  <nav class="nav__links" aria-label="Navigation principale">
    <a href="work.html">Réalisations</a>
    <a href="studio.html">Le studio</a>
    <a href="contact.html">Contact</a>
  </nav>
  <a href="contact.html" class="nav__cta" data-magnetic="0.3">Parlons de votre projet <span aria-hidden="true">↗</span></a>
  <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
</header>

<nav class="mobile-menu" aria-label="Menu mobile">
  <a href="work.html"><small>01</small>Réalisations</a>
  <a href="studio.html"><small>02</small>Le studio</a>
  <a href="contact.html"><small>03</small>Contact</a>
  <a href="contact.html" class="btn btn--glow mobile-menu__cta">Parlons de votre projet <span class="arw" aria-hidden="true">↗</span></a>
</nav>`;

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
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
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
<meta name="color-scheme" content="light">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFFFFF'/%3E%3Ctext x='50' y='68' font-family='Arial' font-weight='700' font-size='54' fill='%230D0D0F' text-anchor='middle'%3EMJ%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
<noscript><style>
  .reveal,.rs>*{opacity:1!important;transform:none!important}
  .masque>span,.hero__title .line>span{transform:none!important}
  .loader{display:none}
</style></noscript>

<script type="application/ld+json">${JSON.stringify(serviceLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
</head>
<body>

${NAV}

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
      <a href="contact.html" class="btn btn--glow" data-magnetic="0.3" data-cursor="Réserver">Parlons de votre projet <span class="arw" aria-hidden="true">↗</span></a>
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
  <div class="footer__bottom">
    <span>© 2026 MJ Agency — Sète, Hérault</span>
    <span class="footer__legal"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a></span>
  </div>
</footer>

<script src="assets/js/recherche-index.js"></script>
<script src="assets/js/bg.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;
}


/* =========================================================
   INDEX DE RECHERCHE

   Construit à partir du contenu réel des pages, pas d'une liste tenue à
   la main : une page ajoutée est indexée sans qu'on y pense, et un texte
   modifié l'est aussi. Le fichier produit est un simple tableau, chargé
   avec le reste — pas de service, pas de requête.

   On indexe les titres et un extrait par section : de quoi retrouver une
   page, sans embarquer le site entier dans un fichier JavaScript.
   ========================================================= */
function indexer() {
  const PAGES = [
    ['index.html', 'Accueil'],
    ['work.html', 'Réalisations'],
    ['studio.html', 'Le studio'],
    ['contact.html', 'Contact'],
    ...VILLES.map(v => [v.slug + '.html', v.ville]),
    ['mentions-legales.html', 'Mentions légales'],
    ['confidentialite.html', 'Confidentialité'],
  ];

  const nu = (h) => h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é').replace(/&agrave;/g, 'à')
    .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();

  const entrees = [];
  PAGES.forEach(([fichier, section]) => {
    let html;
    try { html = fs.readFileSync(path.join(__dirname, fichier), 'utf8'); }
    catch { return; }

    const corps = (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0];
    const titre = nu((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1])
      .replace(/\s*\|\s*MJ Agency$/, '');
    const url = fichier.replace(/\.html$/, '') === 'index' ? 'index.html' : fichier;

    // Une entrée pour la page elle-même
    entrees.push({ u: url, s: section, t: titre, x: nu(corps).slice(0, 180) });

    // Une entrée par titre, avec le texte de SA section — pas celui de la
    // suivante. Sans la coupure au titre suivant, une carte sans descriptif
    // se décrivait avec la bannière d'appel qui la suit dans la source.
    const blocs = [...corps.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)];
    blocs.forEach(m => {
      const t = nu(m[2]);
      if (!t || t.length < 3) return;
      // Une section se termine aussi par sa balise : un chapeau en <span>
      // n'est pas un titre et ne couperait pas le texte.
      const coupe = /<h[23][\s>]|<\/section>|<section[\s>]/i;
      let x = nu(corps.slice(m.index + m[0].length).split(coupe)[0]).slice(0, 170);
      // Une carte porte son descriptif AVANT son titre : rien d'utile après,
      // on reprend donc ce qui précède immédiatement le titre.
      if (x.replace(/[^\p{L}\p{N}]/gu, '').length < 24) {
        // split() mange la balise de coupure : le fragment commence alors au
        // milieu d'un <section ...>, dont les attributs se liraient comme du
        // texte. On jette ce reste de balise ouvrante.
        const avant = corps.slice(0, m.index).split(coupe).pop().replace(/^[^<>]*>/, '');
        x = nu(avant).slice(-170);
      }
      // Un titre de section suivi directement de ses sous-titres n'a ni texte
      // après (coupé au premier <h3>) ni avant (juste un chapeau). On rouvre
      // alors jusqu'à la fin de la section : ses sous-titres la décrivent bien.
      if (x.replace(/[^\p{L}\p{N}]/gu, '').length < 24) {
        const large = corps.slice(m.index + m[0].length).split(/<\/section>|<section[\s>]/i)[0];
        const y = nu(large).slice(0, 170);
        if (y.length > x.length) x = y;
      }
      entrees.push({ u: url, s: section, t, x });
    });
  });

  fs.writeFileSync(path.join(__dirname, 'assets/js/recherche-index.js'),
    '/* Généré par build-locales.js — ne pas modifier à la main. */\n' +
    'window.MJ_INDEX = ' + JSON.stringify(entrees) + ';\n');
  console.log('  assets/js/recherche-index.js — ' + entrees.length + ' entrées');
}

/* ---------- Écriture ---------- */
PAGES_LEGALES.forEach(o => {
  fs.writeFileSync(path.join(__dirname, o.slug + '.html'), pageLegale(o));
  console.log('  ' + o.slug + '.html');
});

VILLES.forEach(v => {
  fs.writeFileSync(path.join(__dirname, v.slug + '.html'), page(v));
  console.log('  ' + v.slug + '.html');
});

/* ---------- Plan du site ---------- */
/* Ce tableau est la seule source du plan du site : toute page ajoutée au
   dépôt doit être déclarée ici, sinon la prochaine génération l'oublie. */
const urls = [
  ['/', 'monthly', '1.0'],
  ['/work', 'monthly', '0.8'],
  ['/studio', 'yearly', '0.7'],
  ['/contact', 'yearly', '0.9'],
  ...VILLES.map(v => ['/' + v.slug, 'monthly', '0.8']),
  ['/mentions-legales', 'yearly', '0.3'],
  ['/confidentialite', 'yearly', '0.3'],
  ['/au-bon-pain', 'monthly', '0.6'],        /* site client hébergé ici */
];
/* La date de dernière modification aide Google à hiérarchiser ses passages.
   On prend celle du fichier lui-même : une date inventée, ou remise à
   aujourd'hui à chaque génération, perd toute valeur de signal. */
function dateFichier(u) {
  const nom = u === '/' ? 'index.html'
            : u === '/au-bon-pain' ? 'au-bon-pain/index.html'
            : u.slice(1) + '.html';
  try { return fs.statSync(path.join(__dirname, nom)).mtime.toISOString().slice(0, 10); }
  catch { return null; }
}

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, f, p]) => {
  const d = dateFichier(u);
  return `  <url>
    <loc>${SITE}${u}</loc>${d ? `\n    <lastmod>${d}</lastmod>` : ''}
    <changefreq>${f}</changefreq>
    <priority>${p}</priority>
  </url>`;
}).join('\n')}
</urlset>
`);

indexer();
console.log(`${VILLES.length} pages locales + sitemap.xml (${urls.length} URL)`);
