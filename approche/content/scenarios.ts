import type { Scenario } from "./types";

/**
 * Salle d'entraînement : 40 scénarios de jeu de rôle.
 * L'un joue le vendeur (il ne voit que `seller`), l'autre joue le commerçant
 * (il lit la carte secrète `character`). Durée visée : 5 à 10 minutes.
 *
 * Difficulté :
 *  1 = ouvert et bienveillant
 *  3 = occupé, objections classiques
 *  5 = méfiant, pressé ou échaudé, objection cachée coriace
 * Dans tous les cas il existe un chemin honnête vers un oui
 * (ou vers un « non » propre, accepté sans insister).
 */
export const scenarios: Scenario[] = [
  /* ------------------------------------------------------------ */
  /* Boulangerie                                                   */
  /* ------------------------------------------------------------ */
  {
    id: "sc-01",
    sector: "boulangerie",
    channel: "physique",
    difficulty: 1,
    seller: {
      business: "Boulangerie Le Fournil de la Lagune",
      city: "Bouzigues",
      context:
        "Petite boulangerie sur la rue principale, file d’attente le matin, calme vers 15 h. Fiche Google non revendiquée : 4,6 sur 23 avis, mais elle indique « fermé le lundi » alors que la vitrine affiche une fermeture le mercredi. Pas de site, une page Facebook dont la dernière publication date de l’an dernier.",
    },
    character: {
      firstName: "Martine",
      age: 58,
      role: "Boulangère, co-gérante avec son mari (lui au fournil, elle en boutique)",
      disc: "relationnel",
      mood: "Détendue, contente de souffler après le rush de midi, prête à discuter",
      budget: "Rien de prévu. 150 à 200 € sans souci si c’est simple, en une fois, pas d’abonnement",
      backstory:
        "Elle tient la boutique depuis 22 ans avec Gérard, son mari. Elle connaît ses clients par leur prénom. L’été, les touristes qui vont manger des huîtres s’arrêtent en passant, et plusieurs se sont déjà cassé le nez un mercredi. Sa fille Laura s’occupait de Facebook, mais elle fait maintenant ses études à Montpellier.",
      hiddenObjection:
        "Elle a peur de vexer sa fille en confiant « son » Facebook à quelqu’un d’autre.",
      hiddenWhen: "Dès que le vendeur parle de réseaux sociaux ou de reprendre la page Facebook.",
      yesTrigger:
        "Qu’on lui montre sur un téléphone que Google l’annonce fermée le lundi et ouverte le mercredi, et qu’on propose de corriger la fiche Google sans toucher au Facebook de Laura. Un prix unique et clair, et elle dit oui tout de suite.",
      quirks: [
        "Sert un client au milieu de la conversation, puis reprend : « on en était où ? »",
        "Parle souvent de Gérard et de Laura",
        "Propose une chouquette au vendeur",
      ],
      opening: "Bonjour ! Il me reste deux fougasses et des chouquettes, qu’est-ce que je vous mets ?",
    },
  },
  {
    id: "sc-02",
    sector: "boulangerie",
    channel: "telephone",
    difficulty: 3,
    seller: {
      business: "Pâtisserie Boulangerie Les Muscats",
      city: "Frontignan",
      context:
        "Deux boutiques : une en centre-ville, une en entrée de ville. Site internet visiblement fait vers 2017, pas adapté au téléphone, et le formulaire de commande de gâteaux renvoie une erreur. Note Google 4,2 avec 187 avis, beaucoup de remarques sur l’attente le dimanche matin.",
    },
    character: {
      firstName: "Olivier",
      age: 44,
      role: "Gérant, pâtissier de formation",
      disc: "analytique",
      mood: "Au bureau entre deux fournées, poli mais pressé, calculatrice à portée de main",
      budget: "Jusqu’à 1 500 € s’il voit le retour ; exige un devis détaillé ligne par ligne",
      backstory:
        "Il a repris l’affaire de son beau-père en 2015 et ouvert la deuxième boutique en 2019. Il suit ses marges au centime. Les commandes de pièces montées et d’entremets pour les communions et les mariages passent toutes par téléphone, et ça immobilise une vendeuse le samedi.",
      hiddenObjection:
        "Il a déjà payé 2 400 € pour le site actuel à un prestataire qui a disparu, et il ne sait même pas à qui appartient le nom de domaine.",
      hiddenWhen: "Quand le vendeur parle d’un nouveau site ou de « refaire » le site.",
      yesTrigger:
        "Un rendez-vous de 20 minutes pour vérifier ensemble à qui appartient le nom de domaine et chiffrer le temps passé au téléphone sur les commandes de gâteaux. Il accepte si on lui propose deux créneaux précis et qu’on promet un devis détaillé, sans engagement.",
      quirks: [
        "Demande « c’est-à-dire ? » dès qu’un mot est flou",
        "Répète les chiffres annoncés comme s’il les notait",
        "Coupe court si le vendeur parle plus de 30 secondes sans poser de question",
      ],
      opening: "Les Muscats, Olivier, j’écoute.",
    },
  },
  {
    id: "sc-03",
    sector: "boulangerie",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Boulangerie du Quartier Haut",
      city: "Sète",
      context:
        "Boulangerie traditionnelle dans une rue en pente du Quartier Haut. Aucune présence en ligne à part une fiche Google non revendiquée : 3,8 sur 64 avis, plusieurs se plaignent de l’accueil. Un autocollant d’une société de « référencement local » est collé sur la vitrine.",
    },
    character: {
      firstName: "Serge",
      age: 63,
      role: "Boulanger-propriétaire, seul en boutique l’après-midi",
      disc: "prudent",
      mood: "Méfiant d’emblée, bras croisés derrière la caisse : c’est le troisième démarcheur du mois",
      budget: "Rien en tête. 100 € maximum pour essayer, et jamais de prélèvement automatique",
      backstory:
        "Il y a deux ans, il a signé en boutique un contrat de « référencement Google » à 89 € par mois sur 48 mois. Il n’a jamais rien vu de concret et il paie encore. Il compte partir à la retraite dans trois ou quatre ans et voudrait vendre le fonds à un bon prix.",
      hiddenObjection:
        "Il est encore engagé dans ce contrat et il a honte de s’être fait avoir ; pour lui, tous les démarcheurs se valent.",
      hiddenWhen:
        "Seulement si le vendeur remarque l’autocollant de la vitrine, ou s’il demande calmement s’il a déjà eu une mauvaise expérience.",
      yesTrigger:
        "Que le vendeur ne vende rien aujourd’hui, propose de regarder gratuitement son contrat actuel pour voir ce qui est vraiment fait, et parle de la vente du fonds : une bonne réputation en ligne rassure un repreneur. Un « non » propre est aussi une bonne issue : si le vendeur laisse sa carte sans insister, Serge le rappellera peut-être.",
      quirks: [
        "Répond par « mmh » et « on verra »",
        "Regarde la porte chaque fois qu’elle s’ouvre, soulagé d’avoir un prétexte",
        "Se radoucit dès qu’il sent qu’on ne cherche pas à lui faire signer quelque chose",
      ],
      opening: "Si c’est pour Google, j’ai déjà donné, merci.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Restaurant                                                    */
  /* ------------------------------------------------------------ */
  {
    id: "sc-04",
    sector: "restaurant",
    channel: "physique",
    difficulty: 2,
    seller: {
      business: "Le Comptoir des Pêcheurs",
      city: "Marseillan",
      context:
        "Restaurant de poisson sur le port, terrasse d’une quarantaine de couverts, on est début avril. Note Google 4,4 avec 312 avis, mais les photos de la carte datent de 2021 avec les anciens prix. Réservations uniquement par téléphone, et la messagerie était pleine hier soir.",
    },
    character: {
      firstName: "Karim",
      age: 39,
      role: "Chef et propriétaire",
      disc: "fonceur",
      mood: "Pressé mais de bonne humeur, il prépare l’ouverture de la saison",
      budget: "Jusqu’à 1 500 € si ça règle les réservations ; peut payer tout de suite",
      backstory:
        "Ancien second de cuisine à Montpellier, il a ouvert en 2020. L’été, il perd des tables parce que personne ne peut décrocher pendant le service. Il gère tout depuis son téléphone et n’allume jamais l’ordinateur du bureau.",
      hiddenObjection:
        "Il ne veut plus d’une plateforme qui prend une commission par couvert : il en a testé une et l’a quittée.",
      hiddenWhen: "Dès que le vendeur évoque la réservation en ligne sans préciser comment elle marche.",
      yesTrigger:
        "Une solution concrète : réservation en ligne sans commission (sur son site ou depuis la fiche Google), photos et carte à jour avant Pâques. Il dit oui sur place si on annonce un délai clair et un prix fixe, sans détour.",
      quirks: [
        "Regarde sa montre ostensiblement",
        "Dit « ok, et concrètement ? »",
        "Tutoie facilement, mais reste correct si le vendeur garde le vous",
      ],
      opening: "On ouvre à 19 h. Vous avez deux minutes, je vous écoute.",
    },
  },
  {
    id: "sc-05",
    sector: "restaurant",
    channel: "telephone",
    difficulty: 4,
    seller: {
      business: "L’Assiette du Clapas",
      city: "Montpellier",
      context:
        "Bistrot de quartier qui tourne surtout le midi (menu à 17 €). Note Google 4,1 avec 96 avis ; plusieurs réponses du gérant aux avis négatifs sont sèches, voire agressives. Présent sur deux applications de livraison. Instagram actif mais peu suivi.",
    },
    character: {
      firstName: "Céline",
      age: 47,
      role: "Co-gérante (gestion et salle), associée au chef",
      disc: "analytique",
      mood: "Méthodique, en pleine compta du mois, répond depuis le bureau",
      budget: "Abonnement mensuel uniquement, 150 € par mois maximum, résiliable",
      backstory:
        "Ancienne contrôleuse de gestion reconvertie, elle s’est associée avec un chef. Elle a calculé ce que les applications de livraison lui prennent sur chaque commande et ça la rend malade. Elle a déjà trois devis d’agences, comparés dans un tableur.",
      hiddenObjection:
        "Elle sait que le vrai problème, ce sont les réponses agressives de son associé aux avis négatifs, et elle n’ose pas le lui dire ; un outil ne réglera pas ça.",
      hiddenWhen: "Quand le vendeur parle des avis Google ou demande qui répond aux avis.",
      yesTrigger:
        "Un rendez-vous où l’agence propose une méthode de réponse aux avis qu’elle pourra présenter à son associé comme un regard extérieur, plus une comparaison chiffrée entre vente directe et applications. Elle dit oui si le vendeur propose deux créneaux et promet un document écrit.",
      quirks: [
        "Demande « vous avez des références à Montpellier ? »",
        "Fait épeler le nom de l’agence",
        "Dit « je vous arrête » dès que c’est trop général",
      ],
      opening: "Oui, allô ? Si c’est pour réserver, il faut rappeler après 11 h.",
    },
  },
  {
    id: "sc-06",
    sector: "restaurant",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Chez Titou, poissons et tielles",
      city: "Sète",
      context:
        "Restaurant sur les quais, bondé l’été, fermé une partie de l’hiver. On est mi-juillet, 16 h. Note Google 3,9 avec 540 avis ; les avis récents parlent de 45 minutes d’attente. Site correct, mais la carte est un PDF illisible sur téléphone.",
    },
    character: {
      firstName: "Franck",
      age: 52,
      role: "Patron, troisième restaurant de sa carrière",
      disc: "fonceur",
      mood: "Agacé : un fournisseur l’a lâché ce matin, il est au téléphone quand vous entrez",
      budget: "L’argent n’est pas le problème (3 000 € possibles) s’il voit un gain immédiat",
      backstory:
        "Il a déjà revendu deux restaurants. Une agence de Montpellier lui facture des publications Instagram qu’il trouve sans intérêt. Il vit la saison comme un sprint et n’a aucune envie de rendez-vous en juillet.",
      hiddenObjection:
        "Il ne manque pas de clients, il en a trop. Son vrai problème, c’est le personnel qu’il n’arrive ni à recruter ni à garder. Tout ce qui ramène encore plus de monde l’inquiète.",
      hiddenWhen: "Quand le vendeur promet « plus de clients » ou « plus de visibilité ».",
      yesTrigger:
        "Que le vendeur arrête de parler de visibilité et entende le vrai sujet : l’organisation. Une carte lisible sur téléphone avec QR code sur les tables, un assistant qui répond aux questions répétitives (horaires, réservations, allergènes) pour soulager l’équipe. Le oui : un rendez-vous court début octobre. Le vendeur doit accepter ce report sans insister.",
      quirks: [
        "Prend un appel au milieu d’une phrase du vendeur",
        "Dit « abrégez »",
        "Respecte ceux qui lui tiennent tête poliment",
      ],
      opening: "(au téléphone) … Non, demain c’est trop tard ! (au vendeur) Oui, c’est pour quoi ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Bar, café                                                     */
  /* ------------------------------------------------------------ */
  {
    id: "sc-07",
    sector: "bar-cafe",
    channel: "physique",
    difficulty: 1,
    seller: {
      business: "Café de la Promenade",
      city: "Balaruc-les-Bains",
      context:
        "Bar-brasserie face à l’étang, clientèle de curistes l’après-midi. Fiche Google 4,3 avec 58 avis, aucune photo récente. Pas de carte de fidélité. Un tableau noir annonce des concerts le jeudi soir.",
    },
    character: {
      firstName: "Nadia",
      age: 35,
      role: "Gérante, a repris le café avec son compagnon",
      disc: "relationnel",
      mood: "Enjouée, vient de finir le service de midi, essuie les verres",
      budget: "200 € pour démarrer, 40 € par mois possible si ça marche",
      backstory:
        "Elle a repris le café il y a un an. Les curistes reviennent trois semaines chaque année et elle adorerait les fidéliser et les prévenir des soirées concerts. Elle pense que le digital, « c’est pour les jeunes ».",
      hiddenObjection:
        "Elle doute que les curistes, souvent âgés, sachent utiliser une carte de fidélité dans le téléphone.",
      hiddenWhen: "Quand le vendeur parle de carte de fidélité digitale ou de Wallet.",
      yesTrigger:
        "Une réponse honnête : on garde une carte papier pour ceux qui préfèrent, et on lui montre que l’ajout au téléphone se fait en un geste. Elle dit oui à la carte de fidélité et à la mise à jour des photos si on propose de faire l’installation avec elle un après-midi.",
      quirks: [
        "Offre un café au vendeur",
        "Pose des questions personnelles : « vous êtes d’ici ? »",
        "Rit facilement, mais s’inquiète sincèrement pour ses clients âgés",
      ],
      opening: "Installez-vous où vous voulez ! Je vous sers quelque chose ?",
    },
  },
  {
    id: "sc-08",
    sector: "bar-cafe",
    channel: "telephone",
    difficulty: 3,
    seller: {
      business: "Le Petit Zinc, bar à bières",
      city: "Montpellier",
      context:
        "Bar à bières près des facs, très fréquenté le jeudi soir. Instagram à 2 800 abonnés, publications irrégulières. Pas de site, pas de moyen de réserver pour un groupe. Fiche Google 4,5 avec 210 avis. Il est 15 h.",
    },
    character: {
      firstName: "Yann",
      age: 31,
      role: "Co-gérant, s’occupe du bar et de la communication",
      disc: "fonceur",
      mood: "Levé depuis une heure après une fermeture à 2 h, un peu grognon",
      budget: "300 € maximum seul ; au-delà, il faut l’accord de son associé",
      backstory:
        "Il gère le bar avec Mehdi, qui s’occupe des chiffres. Les étudiants réservent leurs anniversaires par message Instagram, et il en perd une bonne partie dans le fil des messages. Il fait tout lui-même, Instagram compris, quand il a le temps.",
      hiddenObjection:
        "Il ne peut rien décider seul au-delà de 300 € : Mehdi valide toutes les dépenses, et Yann n’aime pas l’avouer.",
      hiddenWhen: "Quand le vendeur propose un rendez-vous ou avance un montant.",
      yesTrigger:
        "Un rendez-vous avec les deux associés, en fin d’après-midi avant l’ouverture, sur deux créneaux proposés. L’accroche qui marche : une page simple pour réserver les soirées de groupe, au lieu des messages perdus.",
      quirks: [
        "Répond en trois mots",
        "Dit « envoyez-moi un mail » pour se débarrasser",
        "Change de ton dès qu’on parle des soirées de groupe",
      ],
      opening: "Ouais, allô… Le Petit Zinc. On est fermés, là.",
    },
  },
  {
    id: "sc-09",
    sector: "bar-cafe",
    channel: "physique",
    difficulty: 4,
    seller: {
      business: "Bar-tabac Le Tamaris",
      city: "Mèze",
      context:
        "Bar-tabac-PMU sur une place, clientèle d’habitués, quelques touristes l’été. Fiche Google non revendiquée : 3,6 sur 29 avis, dont un récent qui parle d’un comptoir « pas aimable ». Aucun réseau social.",
    },
    character: {
      firstName: "Bernard",
      age: 61,
      role: "Propriétaire depuis 30 ans",
      disc: "prudent",
      mood: "Fatigué, sur la réserve, les courses hippiques du coin de l’œil",
      budget: "Presque rien : 100 à 150 € une fois, et encore",
      backstory:
        "Ses habitués n’ont pas besoin d’internet pour le trouver. Son fils voudrait qu’il attire les ostréiculteurs le matin et les saisonniers l’été, mais lui ne voit pas l’intérêt. L’avis sur le comptoir « pas aimable » l’a vexé plus qu’il ne le dit.",
      hiddenObjection:
        "Il a peur qu’en devenant plus visible il attire d’autres avis négatifs qu’il ne saura pas gérer.",
      hiddenWhen: "Quand le vendeur parle des avis Google ou lui montre sa note.",
      yesTrigger:
        "Que le vendeur lui explique qu’on peut répondre à un avis calmement, propose de rédiger avec lui une réponse à celui qui l’a blessé, et présente la fiche Google comme un simple moyen d’afficher les bons horaires. Il dit oui à une petite reprise de la fiche, ou accepte « on en reparle avec votre fils » : les deux sont de bonnes issues.",
      quirks: [
        "Répond « faut voir »",
        "Parle à un habitué pendant la conversation",
        "Fait répéter les mots qu’il ne connaît pas, avec méfiance",
      ],
      opening: "Tabac ou café ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Food-truck                                                    */
  /* ------------------------------------------------------------ */
  {
    id: "sc-10",
    sector: "food-truck",
    channel: "telephone",
    difficulty: 2,
    seller: {
      business: "Le Camion de Momo",
      city: "Frontignan",
      context:
        "Food-truck de burgers maison : marché le jeudi, plage l’été, zones d’activités le midi. Instagram actif, mais les emplacements ne sont annoncés qu’en story. La fiche Google indique une adresse fixe qui ne correspond à rien.",
    },
    character: {
      firstName: "Mohamed",
      age: 29,
      role: "Fondateur, seul à bord avec un extra l’été",
      disc: "fonceur",
      mood: "Enthousiaste, fait ses courses chez le grossiste, parle en marchant",
      budget: "500 € maximum, idéalement en deux fois",
      backstory:
        "Ancien commis de cuisine, il a lancé son camion il y a 18 mois. Des clients lui disent souvent « on ne savait pas où vous étiez aujourd’hui ». Il veut se lancer dans les mariages et les soirées privées.",
      hiddenObjection:
        "Il a peur qu’un site soit trop long à mettre à jour chaque semaine avec ses emplacements : il n’a pas le temps.",
      hiddenWhen: "Quand le vendeur propose un site internet.",
      yesTrigger:
        "Un rendez-vous où on lui montre comment afficher le planning de la semaine en deux minutes depuis son téléphone, avec une page de demande de devis pour les événements. Il dit oui vite si on propose deux créneaux, dont un tôt le matin.",
      quirks: [
        "Parle vite et coupe la parole par enthousiasme",
        "Bruits de fond : chariot, bips de caisse",
        "Dit « carrément » à tout bout de champ",
      ],
      opening: "Allô oui ! Attendez, je mets le haut-parleur… Voilà, allez-y !",
    },
  },
  {
    id: "sc-11",
    sector: "food-truck",
    channel: "physique",
    difficulty: 4,
    seller: {
      business: "La Piccola Strada, pâtes fraîches",
      city: "Balaruc-le-Vieux",
      context:
        "Food-truck de pâtes fraîches garé le midi dans la zone commerciale. File correcte à 12 h 15, vide à 13 h 45. Un autre camion s’est installé en face il y a deux mois. Page Facebook à 400 abonnés, pas de fiche Google, pas de commande à l’avance.",
    },
    character: {
      firstName: "Giulia",
      age: 42,
      role: "Gérante, fait les pâtes elle-même chaque matin",
      disc: "relationnel",
      mood: "Chaleureuse mais soucieuse : ses ventes ont baissé depuis l’arrivée du concurrent",
      budget: "300 € au total, en une ou deux fois. Pas d’engagement mensuel",
      backstory:
        "Italienne installée dans la région depuis quinze ans, elle a ouvert le camion après un licenciement. Les salariés de la zone ont 45 minutes de pause et ne veulent pas attendre. Elle a des habitués fidèles mais ne sait pas comment les garder.",
      hiddenObjection:
        "Elle a emprunté pour le camion, le mois est difficile, et elle a très peur de toute dépense qui revient chaque mois.",
      hiddenWhen: "Quand le vendeur parle d’abonnement ou de paiement mensuel.",
      yesTrigger:
        "Une entrée modeste, en paiement unique : fiche Google créée avec emplacement et horaires, et une carte de fidélité pour garder ses habitués. Elle dit oui si le vendeur respecte sa situation et ne pousse pas la commande en ligne tout de suite.",
      quirks: [
        "Parle de ses pâtes avec passion",
        "Glisse quelques mots d’italien",
        "Devient silencieuse et regarde ailleurs quand on parle d’argent",
      ],
      opening: "Ciao ! Il me reste des tagliatelles au pesto, vous voulez goûter ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Coiffeur                                                      */
  /* ------------------------------------------------------------ */
  {
    id: "sc-12",
    sector: "coiffeur",
    channel: "physique",
    difficulty: 1,
    seller: {
      business: "Salon Côté Mèches",
      city: "Bouzigues",
      context:
        "Salon mixte de deux fauteuils au cœur du village. Rendez-vous uniquement par téléphone. Fiche Google 4,8 avec 35 avis, aucune photo de coupe. Compte Instagram créé mais trois publications seulement.",
    },
    character: {
      firstName: "Sabrina",
      age: 33,
      role: "Coiffeuse gérante",
      disc: "relationnel",
      mood: "Souriante, balaie entre deux clientes",
      budget: "30 à 50 € par mois, ou 300 € d’un coup",
      backstory:
        "Elle a ouvert il y a trois ans après avoir été salariée à Montpellier. Le téléphone sonne pendant ses coupes et elle doit s’arrêter, ciseaux à la main. Elle adore faire des balayages et aimerait qu’on le sache.",
      hiddenObjection:
        "Elle a peur que ses clientes âgées ne sachent pas réserver en ligne et se sentent mises de côté.",
      hiddenWhen: "Quand le vendeur parle de réservation en ligne.",
      yesTrigger:
        "Qu’on lui dise que le téléphone reste possible et que la réservation en ligne s’ajoute sans rien remplacer, avec des photos de ses balayages sur la fiche Google. Elle dit oui à un rendez-vous un lundi matin, son jour calme.",
      quirks: [
        "Dit « ah oui, trop bien » souvent",
        "Parle de ses clientes par leur prénom",
        "Jette un œil à l’horloge : sa prochaine cliente arrive dans 15 minutes",
      ],
      opening: "Bonjour ! Vous aviez rendez-vous ? Je n’ai rien de noté à cette heure-là…",
    },
  },
  {
    id: "sc-13",
    sector: "coiffeur",
    channel: "telephone",
    difficulty: 3,
    seller: {
      business: "L’Atelier Barbier Sétois",
      city: "Sète",
      context:
        "Barbier en centre-ville, clientèle jeune. Réservation via une application nationale payante. Fiche Google 4,7 avec 150 avis. Instagram soigné, 1 900 abonnés. Rien d’évident à corriger au premier coup d’œil.",
    },
    character: {
      firstName: "Dylan",
      age: 28,
      role: "Barbier fondateur",
      disc: "fonceur",
      mood: "Tondeuse à la main, a décroché par réflexe",
      budget: "100 € par mois si ça rapporte, mais pas un euro pour « un site qui fait joli »",
      backstory:
        "Il a ouvert il y a deux ans et ça marche. Il paie déjà son application de réservation et se trouve « au top » côté digital. Il veut ajouter un deuxième fauteuil et recruter un barbier.",
      hiddenObjection:
        "Ce qui l’agace vraiment, ce sont les rendez-vous non honorés du samedi. Il n’en parle pas : pour lui, c’est inévitable.",
      hiddenWhen:
        "Seulement si le vendeur lui demande ce qui l’énerve le plus dans sa semaine, ou ce qui lui coûte de l’argent.",
      yesTrigger:
        "Que le vendeur ne lui vende pas un site mais s’intéresse aux rendez-vous manqués et au recrutement. Oui à 20 minutes un lundi pour regarder ce que son application fait déjà et ce qui manque, sur deux créneaux précis.",
      quirks: [
        "Commence à tutoyer, puis se reprend",
        "Met le vendeur en attente dix secondes pour parler à un client",
        "Veut des réponses en une phrase",
      ],
      opening: "Ouais, L’Atelier ? Je suis sur une coupe, faites vite.",
    },
  },
  {
    id: "sc-14",
    sector: "coiffeur",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Maison Delorme Coiffure",
      city: "Montpellier",
      context:
        "Salon haut de gamme de six postes. Site réalisé par une agence, beau mais lent à charger, blog abandonné, aucune page de tarifs. Fiche Google 4,5 avec 420 avis. Vitrine très soignée.",
    },
    character: {
      firstName: "Hélène",
      age: 51,
      role: "Fondatrice et directrice du salon",
      disc: "analytique",
      mood: "Froide et précise, reçoit debout à l’accueil, accorde cinq minutes « par politesse »",
      budget: "5 000 € ou plus, mais exige un retour mesurable et une proposition écrite",
      backstory:
        "Formée à Paris, elle a bâti un salon réputé. Elle travaille avec la même agence depuis cinq ans et paie un forfait sans savoir exactement ce qu’il contient. Elle regarde ses chiffres chaque lundi.",
      hiddenObjection:
        "Son contrat d’agence court jusqu’en mars avec reconduction tacite ; l’an dernier elle a oublié de le dénoncer. Elle ne veut pas refaire l’erreur, mais pas non plus sauter dans le vide.",
      hiddenWhen:
        "Seulement si le vendeur demande ce qui la retient de changer, ou la date de fin de son contrat actuel.",
      yesTrigger:
        "Un audit écrit de son site (vitesse, prise de rendez-vous, tarifs absents) qu’elle pourra comparer au travail de son agence, et un calendrier qui respecte l’échéance du contrat. Le oui : un rendez-vous de restitution de l’audit avant la date de préavis. Le vendeur ne doit jamais dénigrer l’agence actuelle.",
      quirks: [
        "Répond aux affirmations par « sur quoi vous vous basez ? »",
        "Consulte son téléphone quand le vendeur s’égare",
        "Reste debout tant qu’elle n’est pas intéressée, s’assoit si elle l’est",
      ],
      opening: "Je vous accorde cinq minutes. Qu’est-ce que vous faites mieux que mon agence actuelle ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Beauté                                                        */
  /* ------------------------------------------------------------ */
  {
    id: "sc-15",
    sector: "beaute",
    channel: "physique",
    difficulty: 2,
    seller: {
      business: "Institut Fleur de Sel",
      city: "Mèze",
      context:
        "Institut de beauté (soins du visage, épilation, ongles) dans une rue commerçante. Fiche Google 4,9 avec 44 avis. Pas de site. Rendez-vous par téléphone et par messages Facebook. On est fin octobre.",
    },
    character: {
      firstName: "Laetitia",
      age: 37,
      role: "Esthéticienne, seule à son compte",
      disc: "relationnel",
      mood: "Accueillante, un peu fatiguée, a enchaîné six rendez-vous",
      budget: "600 € sur l’année, de préférence étalés au mois",
      backstory:
        "Elle a ouvert il y a cinq ans, la plupart de ses clientes viennent par recommandation. Elle rêve de vendre des bons cadeaux en ligne pour Noël et la fête des mères, mais tout se fait au comptoir, sur un carnet à souches.",
      hiddenObjection:
        "Elle a peur de ne pas être « à la hauteur » techniquement et de devoir appeler quelqu’un à chaque modification.",
      hiddenWhen: "Dès que le vendeur explique une solution avec des mots techniques.",
      yesTrigger:
        "Des bons cadeaux vendus en ligne avant décembre, et la promesse qu’on lui montre, qu’on reste joignable, qu’elle ne sera pas seule. Elle dit oui si le vendeur parle simplement et propose de revenir faire la prise en main sur place.",
      quirks: [
        "Dit en riant « moi, l’informatique… »",
        "Raconte des anecdotes de clientes, sans les nommer",
        "Hoche la tête même quand elle n’a pas compris",
      ],
      opening: "Bonjour ! C’est pour un rendez-vous ou pour un renseignement ?",
    },
  },
  {
    id: "sc-16",
    sector: "beaute",
    channel: "telephone",
    difficulty: 4,
    seller: {
      business: "Institut Eau Vive",
      city: "Balaruc-les-Bains",
      context:
        "Institut et petit spa à deux pas des thermes. Site correct avec réservation en ligne, mais rien de spécifique pour les curistes. Fiche Google 4,4 avec 130 avis. Une promotion publiée sur Facebook chaque mois.",
    },
    character: {
      firstName: "Christophe",
      age: 49,
      role: "Gérant (gestion et commercial), sa femme dirige les soins",
      disc: "analytique",
      mood: "Posé, pèse chaque mot, déteste perdre son temps",
      budget: "2 000 € par an pour la communication, dont une partie déjà dépensée",
      backstory:
        "Une grosse partie de la clientèle vient des curistes, de mars à décembre ; janvier et février sont très creux. Il connaît ses chiffres par cœur et sait quels mois ne sont pas rentables. Il a déjà reçu plusieurs agences.",
      hiddenObjection:
        "Il a déjà dépensé la moitié du budget de l’année en publicité Facebook sans résultat, et il ne veut pas l’admettre au téléphone.",
      hiddenWhen: "Quand le vendeur parle de publicité, de réseaux sociaux ou de budget annuel.",
      yesTrigger:
        "Un rendez-vous centré sur ses mois creux : garder le contact avec les curistes d’une année sur l’autre (carte de fidélité dans le téléphone, message avant leur prochaine cure). Il accepte si le vendeur pose des questions précises sur sa saisonnalité et propose deux créneaux.",
      quirks: [
        "Laisse des silences de plusieurs secondes",
        "Reformule : « si je vous comprends bien… »",
        "Demande combien de clients de l’agence sont dans le bien-être",
      ],
      opening: "Institut Eau Vive, bonjour. Christophe à l’appareil.",
    },
  },
  {
    id: "sc-17",
    sector: "beaute",
    channel: "physique",
    difficulty: 3,
    seller: {
      business: "Studio Ongles & Regard",
      city: "Sète",
      context:
        "Prothésiste ongulaire et extensions de cils, petit local en rez-de-chaussée. Instagram très actif (photos de réalisations, 3 100 abonnés). Aucune fiche Google. Rendez-vous uniquement par messages privés Instagram.",
    },
    character: {
      firstName: "Inès",
      age: 26,
      role: "Prothésiste ongulaire, à son compte",
      disc: "prudent",
      mood: "Timide, concentrée sur une pose de gel, parle sans lever les yeux",
      budget: "150 € maximum pour commencer, pas d’abonnement",
      backstory:
        "Installée depuis un an et demi, elle tire toute sa clientèle d’Instagram, mais passe ses soirées à répondre aux messages. Le compte d’une amie esthéticienne a été piraté le mois dernier.",
      hiddenObjection:
        "Elle a peur de perdre son Instagram, qui est toute son activité, si elle donne ses accès à une agence.",
      hiddenWhen: "Quand le vendeur parle de réseaux sociaux ou de gérer ses comptes.",
      yesTrigger:
        "Que le vendeur précise qu’il ne touchera pas à son Instagram et qu’elle garde ses accès. On commence par une fiche Google pour être trouvée quand on cherche « ongles » dans sa ville, puis un lien de prise de rendez-vous pour ne plus répondre le soir. Elle dit oui à la fiche Google.",
      quirks: [
        "Répond par des phrases très courtes",
        "Dit « je sais pas trop » en rougissant",
        "S’anime dès qu’on parle de ses réalisations",
      ],
      opening: "Bonjour… Je suis sur une cliente, ça vous dérange d’attendre deux minutes ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Sport                                                         */
  /* ------------------------------------------------------------ */
  {
    id: "sc-18",
    sector: "sport",
    channel: "telephone",
    difficulty: 2,
    seller: {
      business: "Garrigue Training",
      city: "Montpellier",
      context:
        "Petite salle d’entraînement fonctionnel dans une zone d’activités. Instagram dynamique avec des vidéos de séances. Site d’une page, sans tarifs ni planning. Fiche Google 4,9 avec 88 avis. On est début septembre.",
    },
    character: {
      firstName: "Julien",
      age: 34,
      role: "Coach fondateur",
      disc: "fonceur",
      mood: "Plein d’énergie, sort d’un cours de 7 h, mange une banane",
      budget: "100 à 200 € par mois, décision immédiate",
      backstory:
        "Ancien militaire devenu coach, il a ouvert il y a trois ans. En septembre et en janvier il reçoit beaucoup de demandes de séance d’essai, qu’il gère à la main par messages. Il veut ouvrir des créneaux le midi pour les salariés.",
      hiddenObjection:
        "Il ne veut surtout pas ressembler à une salle de chaîne : il craint qu’un site trop lisse lui fasse perdre son côté familial.",
      hiddenWhen: "Quand le vendeur parle de site « professionnel » ou cite un exemple très institutionnel.",
      yesTrigger:
        "Un rendez-vous pour automatiser les séances d’essai (formulaire, rappel, relance) en gardant ses vidéos et sa personnalité. Il accepte si le vendeur propose deux créneaux, tôt le matin ou en début d’après-midi.",
      quirks: [
        "Dit « top, top »",
        "Pose sa question avant que le vendeur ait fini",
        "Parle de ses adhérents comme d’une famille",
      ],
      opening: "Julien, Garrigue Training ! J’ai cinq minutes avant mon prochain cours, je vous écoute.",
    },
  },
  {
    id: "sc-19",
    sector: "sport",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Padel Club du Bassin",
      city: "Balaruc-le-Vieux",
      context:
        "Club de padel de quatre terrains ouvert il y a un an. Réservation par une application nationale payante. Site vitrine basique. Fiche Google 4,6 avec 71 avis, dont plusieurs se plaignent de ne pas trouver de créneau libre.",
    },
    character: {
      firstName: "Thomas",
      age: 45,
      role: "Co-fondateur, ancien ingénieur en informatique",
      disc: "analytique",
      mood: "Méfiant : douze démarchages depuis l’ouverture. Reçoit dans son bureau vitré qui donne sur les terrains",
      budget: "Jusqu’à 8 000 € pour un outil, mais tout passe par un vote des trois associés",
      backstory:
        "Il a monté le club avec deux amis après quinze ans dans l’informatique. Il a comparé toutes les applications de réservation du marché. Il aime tester les connaissances techniques de ses interlocuteurs.",
      hiddenObjection:
        "Il se dit qu’il pourrait développer lui-même son outil de réservation le soir et refuse de payer pour ça ; au fond, il sait qu’il n’en aura jamais le temps.",
      hiddenWhen: "Quand le vendeur parle de logiciel sur mesure ou d’outil de réservation.",
      yesTrigger:
        "Que le vendeur ne bluffe pas techniquement, admette ce qu’il ne sait pas, et propose un rendez-vous avec la personne technique de l’agence pour cadrer un besoin précis (tarifs selon les heures creuses, abonnements des membres), avec un devis écrit à présenter aux associés. S’il décide de le faire lui-même, un « non » propre est une bonne issue.",
      quirks: [
        "Pose des questions techniques pièges",
        "Note tout sur une tablette",
        "Dit « intéressant » quand il n’est pas convaincu",
      ],
      opening: "Vous êtes le treizième depuis l’ouverture. Qu’est-ce qui vous différencie des douze autres ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Garage                                                        */
  /* ------------------------------------------------------------ */
  {
    id: "sc-20",
    sector: "garage",
    channel: "physique",
    difficulty: 2,
    seller: {
      business: "Garage des Salins",
      city: "Frontignan",
      context:
        "Garage indépendant (mécanique, pneus, clim) en entrée de ville. Fiche Google 4,5 avec 52 avis, aucune réponse aux avis. Pas de site. Un panneau peint à la main : « Pneus, clim, vidange : on s’occupe de tout ».",
    },
    character: {
      firstName: "Patrick",
      age: 56,
      role: "Garagiste, a repris le garage de son père",
      disc: "prudent",
      mood: "Les mains dans le moteur, poli mais réservé, s’essuie les mains avant de venir",
      budget: "Jusqu’à 800 €, préfère payer en trois fois",
      backstory:
        "Il est honnête et ses clients le savent, mais les nouveaux arrivants vont au centre auto de la zone commerciale. Il ne sait pas comment on répond à un avis et n’a jamais osé. Son apprenti lui dit qu’il « faudrait être sur internet ».",
      hiddenObjection:
        "Il déteste l’idée de devoir « se vendre » : pour lui, la publicité, c’est pour ceux qui trichent.",
      hiddenWhen: "Quand le vendeur utilise des mots comme « marketing », « se démarquer » ou « booster ».",
      yesTrigger:
        "Que le vendeur présente la fiche Google comme un moyen de montrer son honnêteté (tarifs indicatifs, photos de l’atelier, réponses aux avis), pas comme de la publicité. Il dit oui à une fiche Google optimisée et une carte NFC d’avis au comptoir, payées en trois fois.",
      quirks: [
        "Dit « moi je suis pas commerçant, je suis mécano »",
        "Prend son temps avant de répondre",
        "Montre fièrement l’atelier et le pont neuf",
      ],
      opening: "Bonjour, c’est pour une réparation ? Parce que là je suis complet jusqu’à jeudi.",
    },
  },
  {
    id: "sc-21",
    sector: "garage",
    channel: "telephone",
    difficulty: 4,
    seller: {
      business: "Carrosserie des Arceaux",
      city: "Montpellier",
      context:
        "Carrosserie d’une huitaine de salariés, qui travaille avec les assurances. Site vitrine vieillissant, pas de demande de devis en ligne. Fiche Google 4,0 avec 118 avis, plusieurs avis négatifs récents sur les délais.",
    },
    character: {
      firstName: "Alexandre",
      age: 46,
      role: "Patron, a racheté la carrosserie il y a six ans",
      disc: "fonceur",
      mood: "Au volant, en kit mains libres, entre deux rendez-vous d’expert",
      budget: "3 000 € possibles s’il voit clairement le résultat ; décide seul",
      backstory:
        "Il a fait grossir l’entreprise. Sa secrétaire est débordée par des appels pour des devis simples (rayures, pare-chocs). Il a déjà dit non à plusieurs agences qui « parlaient pour ne rien dire ».",
      hiddenObjection:
        "Un assureur partenaire lui a fait remarquer ses avis négatifs sur les délais. Il a peur de perdre ce partenariat et n’en parlera pas facilement.",
      hiddenWhen:
        "Seulement si le vendeur demande ce qui se passerait si sa note baissait encore, ou si ses partenaires regardent sa note.",
      yesTrigger:
        "Un rendez-vous autour de deux choses concrètes : un devis photo en ligne pour désengorger le téléphone, et une méthode pour répondre aux avis et en récolter auprès des clients satisfaits (carte NFC au comptoir). Il faut deux créneaux précis et un appel de moins de deux minutes.",
      quirks: [
        "« Allez, en deux mots »",
        "Râle contre la circulation au milieu d’une phrase",
        "Raccroche si on lui lit un texte",
      ],
      opening: "Oui ? Je suis en voiture, j’ai deux minutes.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Artisan du bâtiment                                           */
  /* ------------------------------------------------------------ */
  {
    id: "sc-22",
    sector: "artisan-btp",
    channel: "telephone",
    difficulty: 1,
    seller: {
      business: "Maçonnerie Ribas et Fils",
      city: "Mèze",
      context:
        "Maçonnerie et rénovation, trois salariés. Pas de site. Fiche Google 4,8 avec 12 avis. Les camions sont floqués avec un numéro de portable. Beaucoup de chantiers de villas autour de l’étang.",
    },
    character: {
      firstName: "Rémi",
      age: 41,
      role: "Maçon, gérant depuis que son père a pris sa retraite",
      disc: "fonceur",
      mood: "Jovial, sur un chantier, parle fort à cause de la bétonnière",
      budget: "1 000 à 1 500 €, paiement direct, aucun souci",
      backstory:
        "Il a trop de travail, mais pas toujours le bon : il voudrait plus de rénovations soignées et moins de petits dépannages. Sa femme, Sandrine, fait les devis le soir. Il a des centaines de photos de chantiers dans son téléphone.",
      hiddenObjection:
        "Pas de vraie objection : il veut juste que ce soit lancé avant l’hiver, quand il a moins de chantiers et du temps pour trier ses photos.",
      hiddenWhen: "Quand le vendeur parle de délais.",
      yesTrigger:
        "Un site simple avec ses réalisations (photos avant-après) et un formulaire qui trie les demandes. Il dit oui dès qu’on propose deux créneaux, tôt le matin ou vers 17 h 30, avec Sandrine présente.",
      quirks: [
        "Crie « quoi ? » à cause du bruit",
        "Rit fort",
        "Dit « voyez avec ma femme » puis continue la conversation quand même",
      ],
      opening: "Ouais allô, Rémi ! Parlez fort, je suis sur un chantier !",
    },
  },
  {
    id: "sc-23",
    sector: "artisan-btp",
    channel: "physique",
    difficulty: 3,
    seller: {
      business: "Plomberie Chauffage Estève",
      city: "Balaruc-le-Vieux",
      context:
        "Plombier-chauffagiste avec un petit dépôt dans la zone d’activités. Le site n’a pas bougé depuis 2020 et affiche encore un numéro fixe qui ne répond plus. Fiche Google 4,2 avec 27 avis. Plusieurs pompes à chaleur en démonstration dans le dépôt.",
    },
    character: {
      firstName: "Gilles",
      age: 54,
      role: "Artisan plombier-chauffagiste, deux salariés",
      disc: "prudent",
      mood: "Poli et prudent, fait l’inventaire du dépôt",
      budget: "Environ 1 200 €, en trois ou quatre fois",
      backstory:
        "Artisan depuis 25 ans, il pose de plus en plus de pompes à chaleur. Les clients lui demandent s’il est certifié pour les aides, et son site ne le dit pas. C’est son neveu, qui vit maintenant à Lyon, qui avait fait le site.",
      hiddenObjection:
        "Il ne sait pas s’il est propriétaire de son site ni où sont les accès, et il n’ose pas froisser son neveu en passant par quelqu’un d’autre.",
      hiddenWhen: "Quand le vendeur propose de refaire le site.",
      yesTrigger:
        "Que le vendeur propose d’abord de récupérer les accès avec lui (en appelant le neveu ensemble s’il le faut), puis une mise à jour honnête : bon numéro, certifications affichées, photos d’installations récentes. Il dit oui si on lui laisse le temps d’en parler au neveu et qu’on fixe tout de suite la date du prochain passage.",
      quirks: [
        "Dit « faut que je réfléchisse »",
        "Pose beaucoup de questions sur les garanties",
        "Parle de ses certifications avec fierté",
      ],
      opening: "Bonjour. Le dépôt, c’est surtout pour les pros, mais dites-moi ce que vous cherchez.",
    },
  },
  {
    id: "sc-24",
    sector: "artisan-btp",
    channel: "telephone",
    difficulty: 5,
    seller: {
      business: "Électricité Générale Pujol",
      city: "Montpellier",
      context:
        "Entreprise d’électricité de six personnes. Site correct. Fiche Google 3,7 avec 45 avis, dont trois très négatifs le mois dernier sur un chantier mal fini. Le gérant y a répondu de façon agressive.",
    },
    character: {
      firstName: "Stéphane",
      age: 50,
      role: "Électricien, gérant",
      disc: "fonceur",
      mood: "Irrité, sort d’un litige avec un client, décroche sèchement",
      budget: "Pas prioritaire ; 500 € s’il est convaincu, décision immédiate",
      backstory:
        "Reconnu dans le métier, il travaille surtout pour des promoteurs et des particuliers exigeants. Un chantier a mal tourné à cause d’un sous-traitant, trois avis négatifs ont suivi, et il a répondu à chaud. Ses réponses font plus de tort que les avis eux-mêmes.",
      hiddenObjection:
        "Il est persuadé que ces avis viennent d’un concurrent et veut qu’on les fasse supprimer. Un vendeur honnête ne peut pas le promettre.",
      hiddenWhen: "Dès que le vendeur parle des avis Google : il demande alors « vous pouvez les faire supprimer ? ».",
      yesTrigger:
        "Que le vendeur refuse franchement de promettre une suppression (on peut seulement signaler un avis contraire aux règles de Google), puis propose de l’aider à reprendre la main : réponses calmes, et récolte d’avis auprès de ses nombreux clients satisfaits. Il respecte la franchise et accepte 20 minutes sur un des deux créneaux proposés. Si le vendeur promet une suppression, Stéphane accepte le rendez-vous, mais le débrief doit relever cette promesse comme une faute.",
      quirks: [
        "Coupe : « oui oui, bon, et alors ? »",
        "Monte le ton, puis se calme si le vendeur reste posé",
        "Dit « vous, les agences… »",
      ],
      opening: "Pujol. Si vous vendez quelque chose, je vous préviens, c’est pas le jour.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Immobilier                                                    */
  /* ------------------------------------------------------------ */
  {
    id: "sc-25",
    sector: "immobilier",
    channel: "telephone",
    difficulty: 3,
    seller: {
      business: "Thau Horizon Immobilier",
      city: "Balaruc-les-Bains",
      context:
        "Agence indépendante : ventes et locations meublées pour curistes. Site avec annonces, fourni par son logiciel métier, mais aucune page d’estimation. Fiche Google 4,6 avec 67 avis. Annonces présentes sur les grands portails.",
    },
    character: {
      firstName: "Valérie",
      age: 48,
      role: "Fondatrice et directrice de l’agence",
      disc: "analytique",
      mood: "Professionnelle, occupée, entre deux visites",
      budget: "1 500 à 2 500 € si le retour est mesurable ; préfère un paiement mixte",
      backstory:
        "Elle a fondé l’agence il y a douze ans. La location aux curistes fait tourner l’agence de mars à décembre. Ce qu’elle cherche vraiment, ce sont des mandats de vente, qui arrivent aujourd’hui presque uniquement par le bouche-à-oreille.",
      hiddenObjection:
        "Son logiciel de transaction impose son propre site : elle croit qu’on ne peut rien ajouter sans tout casser.",
      hiddenWhen: "Quand le vendeur parle de site internet ou de nouvelle page.",
      yesTrigger:
        "Un rendez-vous pour regarder ensemble ce que son logiciel permet (une page d’estimation peut souvent coexister avec le site des annonces) et comment récolter des mandats avec une page « estimer mon bien ». Elle accepte si le vendeur pose des questions sur son logiciel au lieu d’affirmer, et propose deux créneaux.",
      quirks: [
        "Demande « combien ça me coûte pour un mandat, au final ? »",
        "Réclame un exemple concret",
        "Parle vite, avec le vocabulaire du métier : mandat, exclusivité, compromis",
      ],
      opening: "Thau Horizon, Valérie. Je suis entre deux visites, je vous écoute.",
    },
  },
  {
    id: "sc-26",
    sector: "immobilier",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Mont Saint-Clair Immobilier",
      city: "Sète",
      context:
        "Agence de prestige : maisons avec vue mer sur le Mont Saint-Clair et la Corniche. Vitrine très soignée, site sobre uniquement en français. Instagram avec de belles photos, peu de réactions. Fiche Google 4,8 avec 90 avis.",
    },
    character: {
      firstName: "Laurent",
      age: 55,
      role: "Fondateur, négociateur principal",
      disc: "fonceur",
      mood: "Pressé, en costume, sur le départ pour une signature chez le notaire",
      budget: "Large (jusqu’à 10 000 €), mais il n’achète qu’à des gens qu’il respecte",
      backstory:
        "Ancien négociateur parisien installé à Sète depuis quinze ans. Ses acheteurs sont des Parisiens et des étrangers qui cherchent une résidence secondaire. Il a un réseau très solide et pense ne pas avoir besoin d’internet.",
      hiddenObjection:
        "Il perd des acheteurs étrangers parce que son site n’existe qu’en français. C’est sa fille qui le lui a fait remarquer, et il n’aime pas avoir tort.",
      hiddenWhen: "Seulement si le vendeur demande d’où viennent ses acheteurs ou dans quelles langues il travaille.",
      yesTrigger:
        "Un vendeur bref, sûr de lui sans arrogance, qui propose un site haut de gamme bilingue mettant en valeur les biens d’exception. Le oui : un rendez-vous fixé tout de suite, sur un des deux créneaux proposés. S’il entend « petite offre » ou « avis Google », il décroche.",
      quirks: [
        "Regarde sa montre toutes les 30 secondes",
        "Dit « moi, j’ai un réseau »",
        "Teste le vendeur : « vous connaissez le Mont Saint-Clair, au moins ? »",
      ],
      opening: "J’ai une signature dans dix minutes. Vous avez une minute, pas plus.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Commerce de détail                                            */
  /* ------------------------------------------------------------ */
  {
    id: "sc-27",
    sector: "commerce",
    channel: "physique",
    difficulty: 1,
    seller: {
      business: "Librairie-papeterie La Page Blanche",
      city: "Marseillan",
      context:
        "Librairie-papeterie du village, qui vend aussi cartes postales et jeux de plage l’été. Fiche Google 4,7 avec 31 avis, mais un seul jeu d’horaires pour l’été et l’hiver. Pas de site. On est en novembre, la boutique est calme.",
    },
    character: {
      firstName: "Françoise",
      age: 64,
      role: "Libraire, ancienne institutrice",
      disc: "prudent",
      mood: "Calme et bienveillante, prend le temps",
      budget: "300 € maximum, en une fois",
      backstory:
        "Elle a repris la librairie à sa retraite, par passion. L’hiver est très calme ; l’été, les touristes découvrent la boutique par hasard. Elle aimerait que les habitants commandent leurs livres chez elle plutôt que sur les grands sites.",
      hiddenObjection:
        "Elle craint de ne pas savoir faire les mises à jour et n’ose pas dire qu’elle a un vieux téléphone à clapet.",
      hiddenWhen: "Quand le vendeur parle de gérer quelque chose depuis son téléphone.",
      yesTrigger:
        "Une fiche Google avec horaires d’été et d’hiver, un moyen simple de réserver un livre (formulaire ou appel), et l’assurance que l’agence change les horaires pour elle deux fois par an. Elle dit oui gentiment si on ne la presse pas.",
      quirks: [
        "Demande « et vous, vous lisez quoi en ce moment ? »",
        "Réfléchit à voix haute",
        "Remercie beaucoup",
      ],
      opening: "Bonjour, je vous laisse regarder, n’hésitez pas si vous cherchez quelque chose.",
    },
  },
  {
    id: "sc-28",
    sector: "commerce",
    channel: "physique",
    difficulty: 3,
    seller: {
      business: "Boutique Maëlle",
      city: "Sète",
      context:
        "Boutique de prêt-à-porter féminin dans une rue commerçante. Instagram actif (2 400 abonnés) avec des vidéos d’essayage. Pas de site : les ventes à distance se font par message et virement. Fiche Google 4,6 avec 40 avis.",
    },
    character: {
      firstName: "Maëlle",
      age: 38,
      role: "Créatrice et gérante de la boutique",
      disc: "relationnel",
      mood: "Débordée par un colis de réassort qui vient d’arriver, mais contente d’avoir de la visite",
      budget: "1 500 € possibles, mais trésorerie tendue avant les soldes : préfère payer en plusieurs fois",
      backstory:
        "Elle a ouvert il y a quatre ans. Chaque semaine, des clientes Instagram lui demandent si elle expédie. Elle prépare les colis le soir et note les ventes dans un cahier.",
      hiddenObjection:
        "Elle a ouvert il y a deux ans une boutique en ligne gratuite sur une plateforme et ne l’a jamais utilisée ; elle a peur d’être jugée.",
      hiddenWhen: "Quand le vendeur propose une boutique en ligne.",
      yesTrigger:
        "Que le vendeur l’écoute parler de sa fatigue du soir, ne juge pas la boutique abandonnée, et propose de relier Instagram à une boutique en ligne simple avec gestion du stock, en commençant par ses 20 meilleures pièces. Elle dit oui à un rendez-vous un lundi, jour de fermeture.",
      quirks: [
        "Parle en rangeant des cintres",
        "Dit « attendez, je vous montre ! » et sort son téléphone",
        "Se confie facilement sur sa fatigue",
      ],
      opening: "Bonjour ! Excusez le bazar, je reçois la nouvelle collection. Je peux vous aider ?",
    },
  },
  {
    id: "sc-29",
    sector: "commerce",
    channel: "telephone",
    difficulty: 4,
    seller: {
      business: "Quincaillerie-Droguerie du Centre",
      city: "Frontignan",
      context:
        "Quincaillerie familiale, clientèle d’artisans et de particuliers. Aucun site. Fiche Google 4,4 avec 80 avis, beaucoup saluent les conseils. Grandes surfaces de bricolage dans la zone commerciale voisine.",
    },
    character: {
      firstName: "Didier",
      age: 59,
      role: "Gérant, troisième génération",
      disc: "prudent",
      mood: "Sur la défensive, répond depuis le comptoir avec des clients autour",
      budget: "Rien avant d’en parler à sa sœur, co-propriétaire ; 500 € maximum s’ils sont d’accord tous les deux",
      backstory:
        "La quincaillerie est dans la famille depuis trois générations. Il connaît son stock par cœur et donne des conseils que les grandes surfaces ne donnent pas. Il a vu plusieurs commerces du centre fermer ces dernières années.",
      hiddenObjection:
        "Il croit qu’un site l’obligerait à vendre en ligne et à expédier des colis, donc à se battre contre les géants d’internet.",
      hiddenWhen: "Quand le vendeur prononce les mots « site » ou « en ligne ».",
      yesTrigger:
        "Que le vendeur clarifie : pas de vente en ligne, simplement être trouvé quand quelqu’un cherche une quincaillerie dans le coin, avec les rayons, les conseils, et la possibilité de demander si une pièce est en stock. Il accepte un rendez-vous en boutique avec sa sœur, sur deux créneaux proposés hors samedi.",
      quirks: [
        "Dit « attendez » et sert un client",
        "« On a toujours fait sans »",
        "Se radoucit si on salue son métier de conseil",
      ],
      opening: "Quincaillerie, bonjour… (à un client) Les vis de 6, c’est allée 3 ! … Oui, je vous écoute ?",
    },
  },

  /* ------------------------------------------------------------ */
  /* Caviste                                                       */
  /* ------------------------------------------------------------ */
  {
    id: "sc-30",
    sector: "caviste",
    channel: "physique",
    difficulty: 2,
    seller: {
      business: "La Cave du Port",
      city: "Marseillan",
      context:
        "Cave à vins et bières artisanales près du port, dégustations le vendredi soir. Fiche Google 4,8 avec 76 avis. Le site affiche « bientôt en ligne » depuis plus d’un an. Un carnet d’inscription aux dégustations traîne près de la caisse.",
    },
    character: {
      firstName: "Antoine",
      age: 43,
      role: "Caviste, ancien sommelier",
      disc: "analytique",
      mood: "Curieux, range une livraison, prend le temps d’écouter",
      budget: "1 200 € pour un site, en deux fois ; veut un devis détaillé",
      backstory:
        "Il a ouvert sa cave il y a six ans. Il organise une grande dégustation chaque mois et gère les inscriptions sur son carnet. Il a acheté un modèle de site qu’il n’a jamais eu le temps de terminer.",
      hiddenObjection:
        "Il ne sait pas exactement ce que la loi Évin lui permet pour promouvoir ses dégustations en ligne, et il a peur de faire une bêtise.",
      hiddenWhen: "Quand le vendeur parle de réseaux sociaux ou de promouvoir les dégustations.",
      yesTrigger:
        "Que le vendeur connaisse l’existence de la loi Évin, reste sur de l’information factuelle (produits, origines, dates de dégustation, sans incitation), et propose un site avec inscription aux dégustations et retrait en boutique. Il accepte un rendez-vous de cadrage avec devis détaillé.",
      quirks: [
        "Propose de goûter quelque chose (le vendeur peut refuser poliment)",
        "Demande qui sera propriétaire du site et du nom de domaine",
        "Dit « c’est-à-dire, techniquement ? »",
      ],
      opening: "Bonjour ! Vous cherchez une bouteille pour une occasion en particulier ?",
    },
  },
  {
    id: "sc-31",
    sector: "caviste",
    channel: "telephone",
    difficulty: 4,
    seller: {
      business: "Caveau du Mas Pradel, muscat",
      city: "Frontignan",
      context:
        "Caveau de vente d’un petit domaine familial de muscat. Beaucoup de passage l’été, presque personne l’hiver. Fiche Google 4,7 avec 150 avis, dont beaucoup en anglais et en allemand. Pas de vente en ligne, le site renvoie vers un vieux formulaire de contact. Les vendanges viennent de se terminer.",
    },
    character: {
      firstName: "Émilie",
      age: 36,
      role: "Fille du vigneron, gère le caveau et la communication",
      disc: "relationnel",
      mood: "Aimable mais épuisée par les vendanges",
      budget: "2 000 € possibles sur l’année, mais c’est son père qui signe",
      backstory:
        "Elle a repris la partie commerciale du domaine. Des touristes rentrés chez eux lui écrivent pour recommander du muscat : elle répond à la main et envoie des colis quand elle peut. Son père répète que « le vin se vend au caveau ».",
      hiddenObjection:
        "Son père refuse toute dépense « internet » : elle a besoin d’arguments pour le convaincre, et n’ose pas l’avouer au vendeur.",
      hiddenWhen: "Quand le vendeur propose de fixer un rendez-vous ou parle de prix.",
      yesTrigger:
        "Un rendez-vous au domaine avec son père, où le vendeur l’aide à présenter les demandes reçues par écrit comme la preuve concrète que des clients veulent commander. Elle dit oui si le vendeur propose de l’aider à défendre le projet, pas de le vendre par-dessus sa tête.",
      quirks: [
        "Soupire en parlant de la fatigue des vendanges",
        "Parle des clients étrangers avec affection",
        "Dit « il faut que je voie avec mon père »",
      ],
      opening: "Caveau du Mas Pradel, bonjour ! Émilie à l’appareil.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Hébergement                                                   */
  /* ------------------------------------------------------------ */
  {
    id: "sc-32",
    sector: "hebergement",
    channel: "telephone",
    difficulty: 1,
    seller: {
      business: "La Maison des Parcs, chambres d’hôtes",
      city: "Bouzigues",
      context:
        "Maison d’hôtes de quatre chambres avec vue sur l’étang et les parcs à huîtres. Présente sur une grande plateforme de réservation qui prend une commission. Pas de site propre. Fiche Google 4,9 avec 38 avis.",
    },
    character: {
      firstName: "Anne",
      age: 60,
      role: "Propriétaire, tient la maison avec son mari",
      disc: "relationnel",
      mood: "Ravie d’avoir quelqu’un au téléphone, arrose son jardin",
      budget: "Jusqu’à 1 500 €, en deux ou trois fois",
      backstory:
        "Ancienne cadre à Lyon, elle a acheté la maison avec son mari pour une retraite active. Elle adore recevoir. Ses hôtes lui demandent souvent s’ils peuvent réserver en direct la prochaine fois, et elle ne sait pas quoi répondre.",
      hiddenObjection: "Elle a peur que, sans la plateforme, les réservations s’arrêtent net.",
      hiddenWhen: "Quand le vendeur critique les commissions des plateformes.",
      yesTrigger:
        "Qu’on lui explique que son site vient en plus, pour les hôtes qui reviennent et ceux qui la trouvent sur Google, sans quitter la plateforme. Elle dit oui à un rendez-vous chez elle, sur un des deux créneaux proposés.",
      quirks: [
        "Parle longuement de ses hôtes",
        "Demande au vendeur s’il connaît Bouzigues",
        "S’excuse de trop bavarder",
      ],
      opening: "Allô ? Oui, bonjour, La Maison des Parcs ! Vous appelez pour une réservation ?",
    },
  },
  {
    id: "sc-33",
    sector: "hebergement",
    channel: "physique",
    difficulty: 3,
    seller: {
      business: "Résidence Les Pins de Thau",
      city: "Balaruc-les-Bains",
      context:
        "Résidence de 32 studios pour curistes, près des thermes. Site vieillissant : réservation par formulaire, puis confirmation par mail. Fiche Google 4,1 avec 205 avis, avec des remarques sur la difficulté à réserver. Fermée en janvier et février.",
    },
    character: {
      firstName: "Philippe",
      age: 57,
      role: "Directeur salarié, les murs appartiennent à une SCI familiale",
      disc: "analytique",
      mood: "Occupé mais courtois, reçoit à l’accueil pendant un creux entre deux arrivées",
      budget: "4 000 à 6 000 €, à faire valider par les propriétaires",
      backstory:
        "Directeur depuis huit ans. Les curistes réservent leurs trois semaines longtemps à l’avance, souvent par téléphone, avec toujours les mêmes questions : parking, navette, cuisine équipée. La réception croule sous les appels en février et mars.",
      hiddenObjection:
        "Les propriétaires ont refusé un projet de site l’an dernier parce que le devis était « flou ». Il ne veut pas se ridiculiser une deuxième fois.",
      hiddenWhen: "Quand le vendeur parle de budget ou demande qui prend la décision.",
      yesTrigger:
        "Un devis clair, découpé en étapes, avec un bénéfice formulé honnêtement : moins d’appels répétitifs grâce à des réponses en ligne et un assistant qui répond jour et nuit, réservation directe simplifiée. Il dit oui si le vendeur propose de l’aider à préparer la présentation aux propriétaires.",
      quirks: [
        "Sort un classeur avec les taux d’occupation",
        "Dit « chiffrez-moi ça »",
        "Est interrompu par un curiste qui demande l’horaire de la navette",
      ],
      opening: "Bonjour, bienvenue aux Pins de Thau. Vous avez une réservation ?",
    },
  },
  {
    id: "sc-34",
    sector: "hebergement",
    channel: "telephone",
    difficulty: 5,
    seller: {
      business: "Camping Les Roseaux de la Plage",
      city: "Marseillan",
      context:
        "Camping familial trois étoiles près de la plage, 120 emplacements dont 30 mobil-homes. Site avec réservation en ligne via un module externe. Fiche Google 4,0 avec 380 avis, très peu de réponses. Ouvert d’avril à fin septembre. On est début octobre.",
    },
    character: {
      firstName: "Marie-Claude",
      age: 62,
      role: "Co-gérante avec son mari",
      disc: "prudent",
      mood: "Épuisée par la fin de saison, méfiante, fait les comptes",
      budget: "Rien avant janvier ; 3 000 € possibles sur le budget de l’an prochain",
      backstory:
        "Le camping est dans la famille de son mari depuis 1978. Chaque hiver, plusieurs agences les démarchent. Il y a trois ans, une agence a refait le site et la réservation est tombée en panne en plein mois de mai : réservations perdues, clients furieux, des semaines pour s’en remettre.",
      hiddenObjection:
        "Elle a été marquée par cette panne et ne veut plus toucher à rien qui fonctionne, même mal.",
      hiddenWhen: "Quand le vendeur propose de changer le site ou le module de réservation.",
      yesTrigger:
        "Que le vendeur entende la peur, ne propose aucune refonte, et suggère des actions sans risque pour la réservation : réponses aux avis, un assistant qui répond aux questions des campeurs (animaux, taille des emplacements, arrivée tardive), le tout mis en place et testé hors saison. Le oui : un rendez-vous fixé en janvier. Si le vendeur insiste pour « maintenant », elle raccroche poliment.",
      quirks: [
        "Dit « on a déjà donné »",
        "Soupire longuement",
        "Demande « et si ça plante, c’est qui qui paie ? »",
      ],
      opening: "Camping Les Roseaux, bonjour… Si c’est pour la saison prochaine, rappelez en janvier.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Expert-comptable                                              */
  /* ------------------------------------------------------------ */
  {
    id: "sc-35",
    sector: "comptable",
    channel: "telephone",
    difficulty: 2,
    seller: {
      business: "Cabinet Ferrand et Associés, expertise comptable",
      city: "Sète",
      context:
        "Cabinet de neuf personnes, clientèle de commerçants, artisans et TPE du bassin. Site institutionnel sobre. Fiche Google 4,3 avec 19 avis. Une offre d’emploi de collaborateur comptable est en ligne depuis six mois.",
    },
    character: {
      firstName: "Isabelle",
      age: 50,
      role: "Expert-comptable associée",
      disc: "analytique",
      mood: "Précise et courtoise, entre deux rendez-vous clients",
      budget: "3 000 € possibles, à valider avec son associé ; aime payer en deux fois",
      backstory:
        "Associée depuis dix ans. Le cabinet a assez de clients mais n’arrive pas à recruter : les jeunes diplômés de Montpellier ne le connaissent pas. Elle passe aussi beaucoup de temps à répondre aux mêmes questions de clients sur les échéances.",
      hiddenObjection:
        "Elle ne sait pas précisément ce que sa profession autorise en matière de communication et ne veut prendre aucun risque déontologique.",
      hiddenWhen: "Quand le vendeur parle de publicité ou de réseaux sociaux.",
      yesTrigger:
        "Que le vendeur oriente vers le recrutement (une page « nous rejoindre » qui montre la vie du cabinet) et un espace de réponses aux questions fréquentes, en restant sur de l’information factuelle, et suggère de faire valider les contenus au regard des règles de la profession. Oui à un rendez-vous sur deux créneaux précis.",
      quirks: [
        "Demande « vous avez déjà travaillé pour des cabinets ? »",
        "Réclame un récapitulatif écrit après l’appel",
        "Parle posément, ne coupe jamais",
      ],
      opening: "Cabinet Ferrand, Isabelle Ferrand, bonjour.",
    },
  },
  {
    id: "sc-36",
    sector: "comptable",
    channel: "physique",
    difficulty: 4,
    seller: {
      business: "Cabinet Comptable de l’Étang",
      city: "Mèze",
      context:
        "Petit cabinet de trois personnes au premier étage, au-dessus d’une pharmacie. Pas de site, juste une fiche Google 4,6 avec 9 avis. D’après la plaque, beaucoup de clients conchyliculteurs et viticulteurs.",
    },
    character: {
      firstName: "Jean-Pierre",
      age: 63,
      role: "Expert-comptable, fondateur du cabinet",
      disc: "prudent",
      mood: "Poli mais froid, reçoit dans l’entrée sans proposer de s’asseoir",
      budget: "Il dit « aucun ». En réalité 1 500 € s’il est rassuré sur la sécurité",
      backstory:
        "Il a créé le cabinet il y a 30 ans et connaît tous les ostréiculteurs de Bouzigues à Mèze. Il pense vendre le cabinet d’ici trois ans. Ses clients lui déposent encore leurs pièces dans des enveloppes kraft.",
      hiddenObjection:
        "Il a peur des failles de sécurité : la messagerie d’un confrère a été piratée, avec de fausses demandes de virement envoyées aux clients.",
      hiddenWhen: "Quand le vendeur parle d’outil en ligne, de dépôt de documents ou d’assistant automatique.",
      yesTrigger:
        "Que le vendeur prenne la sécurité au sérieux (hébergement en France, accès protégés, aucune promesse miracle) et parle de la valeur du cabinet à la revente : un repreneur regarde aussi l’image et les outils. Le oui : un rendez-vous pour un audit sans engagement, avec sa collaboratrice présente.",
      quirks: [
        "Laisse le vendeur debout",
        "Dit « nous verrons »",
        "Pose une question piège sur la protection des données",
      ],
      opening: "Vous avez rendez-vous ? Non ? Alors je vous écoute, mais je n’ai que quelques minutes.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Santé                                                         */
  /* ------------------------------------------------------------ */
  {
    id: "sc-37",
    sector: "sante",
    channel: "telephone",
    difficulty: 1,
    seller: {
      business: "Cabinet de diététique Marion Aubert",
      city: "Balaruc-le-Vieux",
      context:
        "Diététicienne installée depuis deux ans dans un pôle de santé. Pas de site. Fiche Google 5,0 avec 14 avis. Rendez-vous par une plateforme médicale nationale, l’agenda a encore beaucoup de trous.",
    },
    character: {
      firstName: "Marion",
      age: 31,
      role: "Diététicienne-nutritionniste libérale",
      disc: "analytique",
      mood: "Disponible entre deux consultations, curieuse",
      budget: "600 € maximum, en plusieurs fois : elle est jeune installée",
      backstory:
        "Elle a travaillé quelques années en clinique avant de s’installer. Elle veut développer des ateliers de groupe et les consultations en visio. Elle refuse toute « promesse de perte de poids » et fait très attention à ce qu’elle dit.",
      hiddenObjection:
        "Pas d’objection de fond : elle veut seulement être sûre que rien ne ressemblera à une publicité racoleuse ou à des promesses de résultats.",
      hiddenWhen: "Quand le vendeur propose des idées de contenu ou parle d’« attirer des patients ».",
      yesTrigger:
        "Que le vendeur parle d’information claire (spécialités, déroulé d’une consultation, tarifs, ateliers), sans promesse de résultat ni témoignages de patients. Oui rapide à un rendez-vous sur deux créneaux entre ses consultations.",
      quirks: [
        "Relève les mots employés : « attention, on ne dit pas régime »",
        "Dit « d’accord, je note »",
        "Aime les exemples concrets",
      ],
      opening: "Allô, Marion, diététicienne, bonjour ?",
    },
  },
  {
    id: "sc-38",
    sector: "sante",
    channel: "physique",
    difficulty: 5,
    seller: {
      business: "Cabinet de kinésithérapie des Quais",
      city: "Sète",
      context:
        "Cabinet de trois kinésithérapeutes, salle d’attente pleine, secrétariat téléphonique externalisé. Fiche Google 3,5 avec 21 avis, plusieurs se plaignent de ne jamais réussir à joindre le cabinet. Pas de site.",
    },
    character: {
      firstName: "Sébastien",
      age: 44,
      role: "Kinésithérapeute, associé fondateur",
      disc: "relationnel",
      mood: "Débordé, reçoit dans le couloir entre deux patients, gentil mais épuisé",
      budget: "Aucun besoin de patients ; 1 000 € possibles pour gagner du temps, partagés entre trois associés",
      backstory:
        "Il a monté le cabinet avec deux confrères. Ils refusent des patients chaque semaine. Les appels saturent le secrétariat et les patients se plaignent sur Google. Ces avis le rendent malade, mais il ne peut pas prendre plus de monde.",
      hiddenObjection:
        "Il ne veut surtout pas plus de patients, et les règles de sa profession encadrent strictement la communication : il pense donc que le vendeur n’a rien à lui apporter.",
      hiddenWhen: "Dès que le vendeur parle de visibilité, de nouveaux patients ou de récolter des avis.",
      yesTrigger:
        "Que le vendeur change complètement d’angle : réduire les appels (informations pratiques claires, réponses aux questions fréquentes, orientation vers la prise de rendez-vous en ligne), dans le respect des règles de la profession, et répondre calmement aux avis existants. Le oui : un rendez-vous de 20 minutes un midi avec les trois associés. Un « non merci » propre est une bonne issue si le vendeur reste bloqué sur la visibilité.",
      quirks: [
        "Regarde sans cesse la porte de la salle d’attente",
        "Dit « désolé, je suis vraiment en retard »",
        "Se masse l’épaule, comme s’il avait mal lui-même",
      ],
      opening: "Bonjour, c’est pour un rendez-vous ? On n’a plus rien avant trois semaines, je suis désolé.",
    },
  },

  /* ------------------------------------------------------------ */
  /* Juridique                                                     */
  /* ------------------------------------------------------------ */
  {
    id: "sc-39",
    sector: "juridique",
    channel: "telephone",
    difficulty: 2,
    seller: {
      business: "Cabinet de Maître Aurélie Castan, avocate",
      city: "Montpellier",
      context:
        "Avocate installée seule depuis quatre ans, en droit de la famille. Site d’une page réalisé par un annuaire juridique. Fiche Google 4,8 avec 16 avis. Pas de prise de rendez-vous en ligne.",
    },
    character: {
      firstName: "Aurélie",
      age: 39,
      role: "Avocate en droit de la famille",
      disc: "prudent",
      mood: "Réservée, entre deux dossiers, parle doucement",
      budget: "1 500 € maximum, en deux ou trois fois",
      backstory:
        "Elle a exercé en cabinet avant de s’installer. Ses clients traversent des moments difficiles (divorce, garde d’enfants) et l’appellent parfois en larmes. Elle veut une image rassurante, surtout pas commerciale.",
      hiddenObjection:
        "Elle craint que les règles de sa profession lui interdisent certaines choses et redoute un rappel à l’ordre.",
      hiddenWhen: "Quand le vendeur parle de publicité, d’avis clients ou de « mise en avant ».",
      yesTrigger:
        "Que le vendeur montre qu’il sait que la communication des avocats est encadrée (information loyale, pas de sollicitation agressive), propose un site sobre avec domaines d’intervention, honoraires expliqués et prise de rendez-vous, et lui laisse valider chaque contenu. Oui à un rendez-vous sur deux créneaux.",
      quirks: [
        "Demande « c’est conforme, ça ? »",
        "Laisse de longs silences",
        "Se détend dès qu’on parle de rassurer ses clients",
      ],
      opening: "Cabinet de Maître Castan, bonjour.",
    },
  },
  {
    id: "sc-40",
    sector: "juridique",
    channel: "physique",
    difficulty: 1,
    seller: {
      business: "Cabinet Rouvière et Lambert, avocats",
      city: "Sète",
      context:
        "Deux avocats associés (droit des affaires, droit du travail) en centre-ville. Site vitrine de 2016, illisible sur téléphone. Fiche Google 4,5 avec 11 avis. Beaucoup de clients commerçants et restaurateurs du bassin.",
    },
    character: {
      firstName: "Nicolas",
      age: 45,
      role: "Avocat associé, droit des affaires",
      disc: "relationnel",
      mood: "Chaleureux, vient de raccompagner un client et a un moment libre",
      budget: "2 500 € possibles, décision avec son associée, paiement en deux fois",
      backstory:
        "Sétois de naissance, il a fait ses études à Montpellier. Il conseille beaucoup de commerçants du bassin et connaît tout le monde. Il sait que son site est daté mais « n’a jamais le temps ».",
      hiddenObjection:
        "Il veut que son associée, Claire, soit d’accord : c’est elle la plus exigeante sur l’image du cabinet.",
      hiddenWhen: "Quand le vendeur propose de conclure ou parle de prix.",
      yesTrigger:
        "Un rendez-vous à trois avec Claire, sur deux créneaux proposés, avec quelques exemples de sites sobres de professions réglementées. Il est déjà convaincu : il suffit de ne pas le brusquer et de respecter la place de Claire.",
      quirks: [
        "Demande « vous connaissez le boulanger d’en face ? »",
        "Raconte des anecdotes sétoises",
        "Frôle le tutoiement, puis se reprend",
      ],
      opening: "Entrez, entrez ! Vous êtes de l’agence qui passe dans les commerces du quartier ? On m’a parlé de vous.",
    },
  },
];
