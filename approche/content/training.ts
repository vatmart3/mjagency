import type { SectorId, DiscProfile, EvalCriterion } from "./types";

/**
 * Réservoirs pour la salle d'entraînement : le générateur pioche dedans
 * pour fabriquer des scénarios aléatoires, en plus des 40 scénarios écrits
 * à la main (scenarios.ts). Tout est volontairement indépendant de la ville,
 * qui est tirée à part.
 */

/* ------------------------------------------------------------------ */
/* Personnages                                                         */
/* ------------------------------------------------------------------ */

export const firstNames: { name: string; gender: "f" | "m" }[] = [
  { name: "Martine", gender: "f" },
  { name: "Serge", gender: "m" },
  { name: "Nadia", gender: "f" },
  { name: "Karim", gender: "m" },
  { name: "Sandrine", gender: "f" },
  { name: "Jérôme", gender: "m" },
  { name: "Christelle", gender: "f" },
  { name: "Thierry", gender: "m" },
  { name: "Sophie", gender: "f" },
  { name: "Laurent", gender: "m" },
  { name: "Aurélie", gender: "f" },
  { name: "Kévin", gender: "m" },
  { name: "Nathalie", gender: "f" },
  { name: "Frédéric", gender: "m" },
  { name: "Camille", gender: "f" },
  { name: "Mathieu", gender: "m" },
  { name: "Fatima", gender: "f" },
  { name: "Bruno", gender: "m" },
  { name: "Élodie", gender: "f" },
  { name: "Julien", gender: "m" },
  { name: "Virginie", gender: "f" },
  { name: "Rachid", gender: "m" },
  { name: "Mireille", gender: "f" },
  { name: "Pascal", gender: "m" },
  { name: "Lucie", gender: "f" },
  { name: "Romain", gender: "m" },
  { name: "Chantal", gender: "f" },
  { name: "Hugo", gender: "m" },
  { name: "Samia", gender: "f" },
  { name: "Christian", gender: "m" },
  { name: "Justine", gender: "f" },
  { name: "Loïc", gender: "m" },
  { name: "Monique", gender: "f" },
  { name: "Anthony", gender: "m" },
  { name: "Manon", gender: "f" },
  { name: "Gérard", gender: "m" },
  { name: "Sylvie", gender: "f" },
  { name: "Mickaël", gender: "m" },
  { name: "Léa", gender: "f" },
  { name: "Joseph", gender: "m" },
];

export const moods: { label: string; effect: string }[] = [
  {
    label: "Débordé, en plein rush",
    effect: "Répond par monosyllabes et coupe au bout de 30 secondes si l’accroche ne le concerne pas directement.",
  },
  {
    label: "Détendu, c’est l’heure creuse",
    effect: "Prend le temps et pose des questions, mais s’égare facilement : au vendeur de recadrer gentiment.",
  },
  {
    label: "Méfiant, déjà démarché cette semaine",
    effect: "Teste le vendeur d’entrée et ne se détend que s’il sent qu’on ne cherche pas à lui vendre quelque chose tout de suite.",
  },
  {
    label: "Fatigué, fin de saison",
    effect: "Écoute d’une oreille et propose volontiers de « voir ça plus tard » : il faut transformer ce report en date précise.",
  },
  {
    label: "Curieux, a déjà réfléchi au sujet",
    effect: "Pose beaucoup de questions précises ; il faut répondre court et vrai, sans noyer le poisson.",
  },
  {
    label: "Inquiet pour sa trésorerie",
    effect: "Se ferme dès qu’on parle d’argent ; s’ouvre si on parle de temps gagné et de petits pas.",
  },
  {
    label: "Fier de son affaire",
    effect: "Aime qu’on remarque ce qui marche bien ; se braque si on commence par critiquer.",
  },
  {
    label: "Vexé par un avis négatif récent",
    effect: "Revient sans arrêt sur cet avis ; il faut l’écouter avant de pouvoir parler d’autre chose.",
  },
  {
    label: "Pressé, sur le départ",
    effect: "Accorde une minute, pas plus. Le seul objectif réaliste : décrocher un rendez-vous.",
  },
  {
    label: "Pense à la retraite",
    effect: "Parle de transmission et doute que ça vaille le coup d’investir ; sensible à la valeur du fonds à la revente.",
  },
  {
    label: "Enthousiaste, un projet en tête",
    effect: "Parle de son projet (ouverture, recrutement, nouveau service) et part dans tous les sens : le vendeur doit prioriser avec lui.",
  },
  {
    label: "Sceptique : « internet, ça ne marche pas pour nous »",
    effect: "Réclame du concret ; se laisse convaincre par un constat sur son propre commerce, jamais par des généralités.",
  },
  {
    label: "Distrait, au téléphone avec quelqu’un d’autre",
    effect: "Décroche régulièrement de la conversation ; une question directe et courte le ramène.",
  },
  {
    label: "Contrarié par un imprévu du jour",
    effect: "Veut qu’on revienne plus tard ; accepte volontiers un rendez-vous si on le propose sans insister.",
  },
];

export const budgets: { label: string; level: 1 | 2 | 3 }[] = [
  { label: "Rien de prévu : 100 à 150 € pour essayer, pas plus", level: 1 },
  { label: "200 € maximum, en une seule fois", level: 1 },
  { label: "30 à 50 € par mois, sans engagement long", level: 1 },
  { label: "300 à 500 €, en deux ou trois fois", level: 1 },
  { label: "600 à 900 €, préférerait payer au mois", level: 2 },
  { label: "1 000 à 1 500 €, paiement direct si c’est clair", level: 2 },
  { label: "100 à 200 € par mois s’il voit ce que ça rapporte", level: 2 },
  { label: "2 000 à 3 000 €, à valider avec un associé", level: 3 },
  { label: "Jusqu’à 5 000 €, mais exige un devis détaillé ligne par ligne", level: 3 },
  { label: "Budget large, mais n’achète qu’à quelqu’un en qui il a confiance", level: 3 },
];

export const yesTriggers: string[] = [
  "Qu’on lui montre sur son propre téléphone un problème concret de sa fiche Google (horaires faux, photos absentes, avis sans réponse).",
  "Un prix unique annoncé clairement, sans frais cachés ni petites lignes.",
  "Qu’on propose de commencer petit (fiche Google, carte d’avis) avant de parler d’un gros projet.",
  "Deux créneaux précis de rendez-vous plutôt qu’un « quand vous voulez ».",
  "Qu’on parle de lui faire gagner du temps plutôt que d’avoir plus de clients.",
  "Que le vendeur admette franchement ce qu’il ne sait pas au lieu de bluffer.",
  "Qu’on lui laisse le temps d’en parler à son associé ou à sa famille, avec une date de rappel fixée ensemble.",
  "Qu’on remarque d’abord ce qui marche déjà bien chez lui.",
  "Une démonstration de deux minutes sur l’exemple d’un commerce semblable au sien.",
  "La garantie écrite qu’il reste propriétaire de son site, de son nom de domaine et de ses comptes.",
  "Un paiement étalé sur quelques mois, sans engagement long.",
  "Une prise en main sur place, avec lui, et une personne joignable ensuite.",
  "Qu’on relie la proposition à un projet qui lui tient à cœur : recrutement, transmission, nouvelle activité.",
  "Qu’on respecte sa saison et qu’on propose de tout préparer pendant la période calme.",
  "Un audit gratuit de 20 minutes, sans rien à signer.",
  "Un devis écrit, détaillé ligne par ligne, qu’il pourra comparer tranquillement.",
  "Qu’on l’aide à répondre calmement à l’avis négatif qui l’a blessé.",
  "Qu’on lui parle simplement, sans un seul mot technique.",
  "Que le vendeur accepte un premier « non » sans insister et propose de repasser à une date précise.",
  "Qu’on lui montre comment faire revenir plus souvent ses clients fidèles (carte de fidélité, petit rappel).",
];

export const hiddenObjections: string[] = [
  "Il s’est déjà fait avoir par un contrat de « référencement » sur plusieurs années, et il paie encore.",
  "Il ne sait pas qui détient son nom de domaine ni les accès à son site.",
  "Il ne peut rien décider sans son associé ou son conjoint, mais ne veut pas l’avouer.",
  "Il a peur de ne pas savoir se servir de l’outil et d’avoir l’air bête.",
  "La trésorerie est tendue ce mois-ci : toute mensualité l’inquiète.",
  "Un proche (enfant, neveu, ami) s’occupe déjà du site ou des réseaux, et il ne veut pas le vexer.",
  "Il craint d’attirer encore plus d’avis négatifs en devenant plus visible.",
  "Il n’a pas besoin de plus de clients : son vrai problème, c’est le temps ou le personnel.",
  "Il pense vendre son affaire dans quelques années et doute que ça vaille le coup d’investir.",
  "Il est encore engagé avec une autre agence jusqu’à une date précise.",
  "Il a peur de perdre ses comptes Instagram ou Facebook s’il donne ses accès.",
  "Il craint que ses clients âgés ne suivent pas s’il passe au numérique.",
  "Il doute que ce soit autorisé dans sa profession (déontologie, loi Évin, règles de son ordre).",
  "Il a déjà payé de la publicité en ligne sans aucun résultat.",
  "Il croit qu’un site l’obligerait à vendre en ligne et à expédier des colis.",
  "Il compte le faire lui-même « un jour » et refuse de payer pour ça.",
  "Une panne passée (site en rade, réservations perdues) l’a marqué : il ne veut plus toucher à rien.",
  "Il trouve que « se vendre » ne colle pas à son image d’artisan honnête.",
  "Il pense que son emplacement suffit et que les clients passeront toujours devant.",
  "Il a peur de dépendre de l’agence pour la moindre modification.",
];

export const hiddenWhens: string[] = [
  "Seulement après que le vendeur a parlé de prix.",
  "Dès que le vendeur prononce le mot « site ».",
  "Quand le vendeur propose de fixer un rendez-vous.",
  "Seulement si le vendeur demande « qu’est-ce qui vous retient ? » ou une question équivalente.",
  "Quand le vendeur parle de réseaux sociaux.",
  "Quand le vendeur parle d’abonnement ou de paiement mensuel.",
  "Seulement si le vendeur a posé au moins trois questions ouvertes avant de proposer quoi que ce soit.",
  "Quand le vendeur parle des avis Google.",
  "Au moment précis où le vendeur tente de conclure.",
  "Seulement si le vendeur remarque un détail du commerce (vitrine, autocollant, affiche) et en parle.",
];

export const quirks: string[] = [
  "Sert un client au milieu d’une phrase, puis demande « on en était où ? »",
  "Répond « faut voir » à presque tout",
  "Regarde sa montre ostensiblement",
  "Tutoie très vite",
  "Répète à voix haute chaque chiffre annoncé",
  "Demande « c’est-à-dire ? » dès qu’un mot est flou",
  "Propose un café ou quelque chose à goûter",
  "Parle de sa famille à tout propos",
  "Croise les bras et recule d’un pas",
  "Consulte son téléphone quand il s’ennuie",
  "Coupe la parole par enthousiasme",
  "Laisse de longs silences sans rien dire",
  "Dit « envoyez-moi un mail » pour écourter",
  "Pose une question piège pour tester le vendeur",
  "Compare sans arrêt avec un concurrent : « et lui, il fait comment ? »",
  "Raconte une anecdote de client à chaque occasion",
  "Répète « on a toujours fait sans »",
  "Reformule tout : « si je vous comprends bien… »",
  "Se plaint de la saison, de la météo ou des travaux dans la rue",
  "Prend à témoin un employé ou un habitué présent",
  "Note des mots sur un coin de papier",
  "Soupire en entendant le mot « internet »",
  "Hoche la tête même quand il n’a pas compris",
  "Demande « et vous, vous êtes d’où ? »",
];

/* ------------------------------------------------------------------ */
/* Commerces                                                           */
/* ------------------------------------------------------------------ */

export const businessNames: Record<SectorId, string[]> = {
  boulangerie: [
    "Au Pain de la Colline",
    "Boulangerie Le Fournil des Salins",
    "Maison Garrigou, boulanger",
    "La Fougasse Dorée",
    "Le Four à Bois du Port",
  ],
  restaurant: [
    "La Table des Parqueurs",
    "Le Bistrot de la Jetée",
    "Chez Mémé Lucienne",
    "L’Étang Gourmand",
    "La Brasucade du Quai",
  ],
  "bar-cafe": [
    "Le Café des Joutes",
    "Bar de la Marine",
    "Le Comptoir du Canal",
    "Café du Marché Couvert",
    "Le Zinc du Môle",
  ],
  "food-truck": [
    "La Roulotte à Tielles",
    "Le Camion Gourmand",
    "Crêpes et Compagnie",
    "Le Burger Nomade",
    "Le Wok Voyageur",
  ],
  coiffeur: [
    "Salon Ciseaux d’Or",
    "L’Atelier Coiffure de Julie",
    "Coiff’ Lagune",
    "Barbier du Canal",
    "Salon Mèches et Marées",
  ],
  beaute: [
    "Institut Pure Beauté",
    "L’Écrin Beauté",
    "Studio Ongles et Cils",
    "Institut Belle Escale",
    "Rivage Bien-Être",
  ],
  sport: [
    "Salle Horizon Fitness",
    "Club Glisse de l’Étang",
    "Studio Pilates Rive Gauche",
    "Boxing Club du Littoral",
    "Centre de Plongée Posidonie",
  ],
  garage: [
    "Garage de la Corniche",
    "Auto Service Thau",
    "Carrosserie du Pont-Levis",
    "Garage Martinez et Fils",
    "Centre Pneus Méditerranée",
  ],
  "artisan-btp": [
    "Menuiserie Vidal",
    "Plomberie Chauffage Ribes",
    "Électricité Bonnafous",
    "Peinture et Façades du Littoral",
    "Carrelages Espinasse",
  ],
  immobilier: [
    "Thau Immobilier Conseil",
    "Agence de la Lagune",
    "Cabinet Immobilier du Port",
    "Rivage Transactions",
    "L’Adresse du Littoral",
  ],
  commerce: [
    "Fleurs de la Marine",
    "Boutique Sel et Coton",
    "Le Bazar du Port",
    "Optique de la Place",
    "Jouets et Merveilles",
  ],
  caviste: [
    "La Cave des Amphores",
    "Le Cellier de Thau",
    "Vins et Muscats",
    "Comptoir des Vignes",
    "La Cave à Bulles",
  ],
  hebergement: [
    "Hôtel Les Mouettes",
    "Chambres d’hôtes Le Mas des Oliviers",
    "Camping Les Salicornes",
    "Gîtes du Vignoble",
    "Résidence Les Sources",
  ],
  comptable: [
    "Cabinet Delmas Expertise",
    "Thau Conseil Comptable",
    "Cabinet Estrade et Associés",
    "Compta Littoral",
    "Cabinet Roussel, expertise comptable",
  ],
  sante: [
    "Cabinet d’ostéopathie du Lido",
    "Cabinet de kinésithérapie de la Plage",
    "Cabinet d’orthophonie Les Pins",
    "Cabinet dentaire de la Place",
    "Podologie du Centre",
  ],
  juridique: [
    "Cabinet de Maître Julie Arnaud, avocate",
    "Cabinet Serres et Associés, avocats",
    "Étude de Maître Roques, commissaire de justice",
    "Cabinet Ferrer, avocats d’affaires",
    "Cabinet Castel, droit de la famille",
  ],
};

export const sellerContexts: Record<SectorId, string[]> = {
  boulangerie: [
    "Fiche Google non revendiquée, 4,3 avec 38 avis ; les horaires affichés ne correspondent pas à ceux de la porte. Pas de site, pas de réseaux sociaux.",
    "Note Google 4,7 avec 120 avis, mais aucune réponse du commerce depuis deux ans. Une page Facebook où la dernière publication annonce la galette des rois de l’an dernier.",
    "File d’attente sur le trottoir le dimanche matin. Les commandes de gâteaux se prennent sur un carnet au comptoir. Aucune photo des pâtisseries sur Google.",
  ],
  restaurant: [
    "Note Google 4,2 avec 260 avis ; les photos de la carte datent de trois ans avec les anciens prix. Réservation uniquement par téléphone.",
    "Site internet dont la carte est un PDF illisible sur téléphone. Présent sur une plateforme de réservation qui prend une commission. Terrasse pleine le midi, vide le soir hors saison.",
    "Aucun site. Instagram abandonné depuis 2022. Plusieurs avis récents disent « impossible de joindre le restaurant ».",
  ],
  "bar-cafe": [
    "Fiche Google 4,1 avec 45 avis, aucune photo récente. Un tableau noir annonce des soirées concerts, dont on ne trouve la trace nulle part en ligne.",
    "Clientèle d’habitués au comptoir, terrasse très prisée l’été. Pas de carte de fidélité. Page Facebook avec 300 abonnés, une publication par mois environ.",
    "Horaires Google faux (indique fermé le dimanche alors que le bar est ouvert). Quelques avis se plaignent de l’accueil, sans réponse.",
  ],
  "food-truck": [
    "Instagram actif, mais les emplacements ne sont annoncés qu’en story, qui disparaît au bout de 24 h. Fiche Google avec une adresse fixe qui ne correspond à rien.",
    "Présent sur les marchés et quelques zones d’activités le midi. Aucun moyen de commander à l’avance. Numéro de téléphone peint sur le camion.",
    "Page Facebook avec de bonnes photos, pas de fiche Google. Propose des prestations pour événements, mais rien ne l’indique en ligne.",
  ],
  coiffeur: [
    "Rendez-vous uniquement par téléphone. Fiche Google 4,8 avec 30 avis, aucune photo de coupe. Instagram ouvert avec trois publications.",
    "Réservation via une application nationale payante. Beaucoup d’avis positifs, mais aucune réponse du salon. Le salon cherche un ou une coiffeuse (affichette en vitrine).",
    "Pas de site, pas de tarifs en ligne. Note Google 4,0 avec 22 avis, dont deux se plaignent d’attente sans rendez-vous.",
  ],
  beaute: [
    "Rendez-vous par messages privés Instagram et Facebook. Pas de fiche Google. Des bons cadeaux papier sont proposés en vitrine.",
    "Site avec réservation en ligne, mais pas de tarifs affichés. Fiche Google 4,5 avec 90 avis. Publie une promotion sur Facebook de temps en temps.",
    "Institut discret à l’étage, pas de vitrine sur rue. Fiche Google 5,0 avec 11 avis. Aucun moyen de réserver en dehors des heures d’ouverture.",
  ],
  sport: [
    "Instagram dynamique avec des vidéos de séances. Site d’une page sans tarifs ni planning. Demandes de séance d’essai par messages.",
    "Fiche Google 4,6 avec 60 avis. Planning des cours affiché en PDF, pas à jour. Inscriptions sur papier à l’accueil.",
    "Activité très saisonnière (location, cours l’été). Site uniquement en français. Réservations par téléphone et par mail.",
  ],
  garage: [
    "Garage indépendant, fiche Google 4,5 avec 50 avis, aucune réponse aux avis. Pas de site. Panneau peint à la main à l’entrée.",
    "Site vitrine vieillissant, pas de demande de devis en ligne. Quelques avis négatifs récents sur les délais.",
    "Fiche Google avec seulement deux photos, dont une floue de la façade. Pas de tarifs indicatifs. Un centre auto de chaîne est installé à quelques centaines de mètres.",
  ],
  "artisan-btp": [
    "Pas de site. Camionnette floquée avec un numéro de portable. Fiche Google 4,9 avec 8 avis.",
    "Site qui n’a pas bougé depuis plusieurs années et affiche un ancien numéro de fixe. Aucune photo de réalisations récentes.",
    "Fiche Google 3,9 avec 20 avis, dont un très négatif sans réponse. Les certifications et labels n’apparaissent nulle part en ligne.",
  ],
  immobilier: [
    "Agence indépendante, site fourni par le logiciel métier, pas de page d’estimation. Fiche Google 4,6 avec 60 avis.",
    "Belle vitrine, site sobre uniquement en français. Instagram avec de belles photos mais peu de réactions.",
    "Gère aussi des locations saisonnières. Plusieurs avis mentionnent des difficultés à joindre l’agence le samedi.",
  ],
  commerce: [
    "Boutique indépendante, Instagram actif avec des vidéos, mais pas de site : les ventes à distance se font par message et virement.",
    "Fiche Google 4,7 avec 30 avis, un seul jeu d’horaires pour l’été et l’hiver. Pas de site.",
    "Commerce familial concurrencé par les grandes surfaces voisines. Aucun site. Beaucoup d’avis saluent les conseils du vendeur.",
  ],
  caviste: [
    "Dégustations organisées régulièrement, inscriptions sur un carnet près de la caisse. Le site affiche « bientôt en ligne » depuis des mois.",
    "Fiche Google 4,8 avec 70 avis, dont plusieurs en anglais. Aucune vente en ligne ni retrait en boutique.",
    "Beaucoup de passage l’été, très calme l’hiver. Page Facebook qui annonce les arrivages, sans régularité.",
  ],
  hebergement: [
    "Présent sur une grande plateforme de réservation qui prend une commission. Pas de site propre. Fiche Google 4,9 avec 35 avis.",
    "Site vieillissant : réservation par formulaire, puis confirmation par mail. Des avis mentionnent la difficulté à réserver.",
    "Fiche Google 4,0 avec plusieurs centaines d’avis, très peu de réponses. Site uniquement en français alors que les avis sont souvent en anglais ou en allemand.",
  ],
  comptable: [
    "Cabinet de taille moyenne, site institutionnel sobre. Une offre d’emploi est en ligne depuis plusieurs mois.",
    "Pas de site, juste une fiche Google avec une dizaine d’avis. Clientèle d’artisans et de commerçants locaux.",
    "Site daté, sans espace client ni prise de rendez-vous. Numéro unique, souvent occupé d’après les avis.",
  ],
  sante: [
    "Professionnel de santé installé dans un pôle de santé. Pas de site. Rendez-vous par une plateforme médicale nationale.",
    "Fiche Google 3,6 avec une vingtaine d’avis, plusieurs se plaignent de ne pas réussir à joindre le cabinet. Pas de site.",
    "Informations pratiques introuvables en ligne : accès, parking, accessibilité, spécialités. Horaires Google incomplets.",
  ],
  juridique: [
    "Avocat installé seul, site d’une page réalisé par un annuaire professionnel. Pas de prise de rendez-vous en ligne.",
    "Cabinet de deux associés, site de plusieurs années illisible sur téléphone. Fiche Google 4,5 avec une dizaine d’avis.",
    "Aucune information sur les honoraires ni sur le déroulé d’un premier rendez-vous. Fiche Google sans photo.",
  ],
};

/* ------------------------------------------------------------------ */
/* Premières répliques                                                 */
/* ------------------------------------------------------------------ */

export const openings: Record<DiscProfile, string[]> = {
  fonceur: [
    "Oui, c’est pour quoi ? J’ai deux minutes.",
    "Si vous vendez quelque chose, allez droit au but.",
    "Je vous arrête tout de suite : combien ça coûte ?",
    "On est en plein service, faites vite.",
    "Vous êtes le troisième de la semaine. Qu’est-ce que vous avez de plus que les autres ?",
  ],
  analytique: [
    "Bonjour. C’est à quel sujet exactement ?",
    "Vous êtes de quelle société ? Vous pouvez me redonner le nom ?",
    "Je vous écoute, mais j’aurai besoin de précisions écrites.",
    "Avant tout, comment avez-vous eu mon numéro ?",
    "D’accord. Et vous faites quoi, concrètement ?",
  ],
  relationnel: [
    "Bonjour ! Entrez, entrez, je peux vous aider ?",
    "Oh, bonjour ! Vous êtes du coin, vous ?",
    "Allô oui ? Excusez le bruit, c’est la folie aujourd’hui !",
    "Installez-vous, je finis avec madame et je suis à vous.",
    "Bonjour ! Vous cherchez quelque chose en particulier ?",
  ],
  prudent: [
    "Bonjour… C’est pour quoi ?",
    "Si c’est pour de la publicité, on a déjà ce qu’il faut.",
    "Je ne sais pas si c’est vraiment le moment.",
    "Il faudrait voir avec mon associé, je ne décide pas seul.",
    "On a déjà été démarchés plusieurs fois, vous savez.",
  ],
};

/* ------------------------------------------------------------------ */
/* Évaluation                                                          */
/* ------------------------------------------------------------------ */

export const evalCriteria: {
  id: EvalCriterion;
  label: string;
  question: string;
  lookFor: string[];
}[] = [
  {
    id: "accroche",
    label: "Accroche",
    question: "Dans les 20 premières secondes, est-ce que j’ai eu envie de l’écouter plutôt que de m’en débarrasser ?",
    lookFor: [
      "Se présente clairement : prénom, agence, locale",
      "Parle d’un constat précis sur MON commerce, pas d’une généralité",
      "Demande la permission de continuer ou vérifie que le moment convient",
      "Ton calme et souriant, sans réciter",
    ],
  },
  {
    id: "ecoute",
    label: "Écoute",
    question: "Est-ce que je me suis senti écouté, ou est-ce qu’il attendait juste son tour pour parler ?",
    lookFor: [
      "Laisse finir les phrases sans couper",
      "Reformule ce que j’ai dit avec mes mots",
      "Rebondit sur un détail que j’ai donné",
      "Supporte les silences sans les remplir",
    ],
  },
  {
    id: "decouverte",
    label: "Découverte",
    question: "Est-ce qu’il a compris mon vrai problème avant de me proposer quoi que ce soit ?",
    lookFor: [
      "Pose des questions ouvertes (comment, qu’est-ce qui, racontez-moi)",
      "Fait parler de l’impact : temps perdu, clients perdus, fatigue",
      "Trouve l’objection cachée ou s’en approche",
      "Ne propose une solution qu’après au moins trois questions",
    ],
  },
  {
    id: "objections",
    label: "Objections",
    question: "Quand j’ai résisté, est-ce qu’il m’a respecté et aidé à y voir clair, sans me forcer la main ?",
    lookFor: [
      "Accueille l’objection sans se justifier ni contredire",
      "Pose une question pour comprendre ce qu’elle cache",
      "Recadre avec un argument honnête, sans fausse statistique",
      "Propose une suite concrète adaptée à l’objection",
    ],
  },
  {
    id: "offre",
    label: "Clarté de l’offre",
    question: "Est-ce que je pourrais expliquer à mon conjoint ce qu’il m’a proposé, en une phrase, avec le prix ?",
    lookFor: [
      "Une seule offre principale, reliée à mon problème",
      "Des mots simples, pas de jargon ni d’anglicismes",
      "Prix ou fourchette annoncé clairement (en face à face uniquement)",
      "Ce que j’obtiens concrètement et en combien de temps",
    ],
  },
  {
    id: "conclusion",
    label: "Conclusion",
    question: "Est-ce qu’on s’est quittés avec une prochaine étape claire, datée, que j’ai vraiment acceptée ?",
    lookFor: [
      "Propose deux créneaux précis plutôt qu’un « je vous rappelle »",
      "Récapitule ce qui a été décidé",
      "Accepte un « non » proprement et laisse la porte ouverte",
      "Aucune fausse urgence ni pression",
    ],
  },
  {
    id: "attitude",
    label: "Attitude",
    question: "Est-ce que j’aurais envie de le revoir, même si je n’ai rien acheté ?",
    lookFor: [
      "Vouvoiement tenu, politesse sincère",
      "Énergie adaptée à mon humeur et à mon rythme",
      "Respecte mon temps et mon travail en cours",
      "Reste honnête, y compris quand il ne sait pas",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Conseils et règles                                                  */
/* ------------------------------------------------------------------ */

export const pitchChallengeTips: string[] = [
  "Commencez par le commerçant, pas par vous : un constat précis sur son commerce vaut mieux que la présentation de l’agence.",
  "Une seule idée par pitch. Si vous parlez de trois offres, il n’en retiendra aucune.",
  "Terminez toujours par une question simple, par exemple : « ça vous parle ? » ou « c’est un sujet chez vous ? ».",
  "Parlez comme au comptoir : phrases courtes, vouvoiement, zéro jargon.",
  "Pas de chiffre inventé : dites « en général » ou « c’est ce qu’on voit souvent », jamais une statistique sortie de nulle part.",
  "Chronométrez-vous, puis refaites-le en coupant 10 secondes : ce qui saute était rarement indispensable.",
];

export const flashcardTips: string[] = [
  "Répondez à voix haute avant de retourner la carte : on retient mieux ce qu’on a dit que ce qu’on a lu.",
  "Reformulez avec vos propres mots ; une réponse récitée sonne faux devant un commerçant.",
  "Cinq minutes par jour valent mieux qu’une heure le dimanche.",
  "Mettez de côté les cartes ratées et reprenez-les en premier le lendemain.",
  "Entre deux commerces, révisez les cartes du secteur que vous allez prospecter.",
];

export const duoRules: string[] = [
  "Le « prospect » lit sa carte secrète en entier avant de commencer, et le vendeur ne voit que ce qui est observable.",
  "L’objection cachée ne sort qu’au moment indiqué sur la carte, jamais avant, même si le vendeur rame.",
  "Le « prospect » dit oui dès que le vendeur trouve le vrai déclencheur honnêtement ; pas de résistance gratuite pour le plaisir.",
  "Pas de pause pendant la scène : on joue jusqu’au bout, même en cas de trou, comme sur le terrain.",
  "Dix minutes maximum, puis débrief : le « prospect » note les sept critères et révèle sa carte.",
  "On inverse les rôles à chaque scénario, et le débrief commence toujours par ce qui a bien marché.",
];
