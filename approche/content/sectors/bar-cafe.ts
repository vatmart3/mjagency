import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "bar-cafe",
  name: "Bar / café",
  short: "Bar",
  examples: [
    "bar de quartier et café du coin",
    "bar-tabac et bar PMU",
    "bar à vin, cave à manger",
    "bar de plage ouvert à la saison",
    "bar de centre-ville avec terrasse et retransmissions sportives",
    "bar musical ou bar à tapas en soirée",
  ],
  tagline:
    "Un comptoir qui vit du café du matin à l’apéro du soir, des habitués qu’on connaît par leur prénom, et des nouveaux clients qui cherchent « bar » sur leur téléphone sans jamais pousser votre porte par hasard.",

  reality: {
    rhythm:
      "Au bar-tabac ou au café de quartier, on ouvre tôt, vers 6 h 30 - 7 h : café, croissant, journal, tabac, jeux, et le rush des actifs jusqu’à 9 h 30. Ensuite vient le creux du milieu de matinée (9 h 30 - 11 h) : réassort, livraisons de boissons, habitués retraités au comptoir. Le midi, certains servent un plat du jour, d’autres voient simplement passer l’apéritif et les cafés d’après repas. Le milieu d’après-midi (14 h 30 - 17 h) est le moment le plus calme, sauf quand la terrasse est pleine l’été ou les jours de courses au PMU. L’apéro de 18 h à 20 h est le vrai coup de feu, puis la soirée : fermeture vers 20 h pour le bar-tabac, beaucoup plus tard pour le bar à vin, le bar de plage ou le bar musical, surtout les soirs de match ou de concert. Sur la semaine : un jour de fermeture fréquent (souvent le lundi pour les bars de quartier, dimanche et lundi pour beaucoup de bars à vin, dimanche après-midi pour les bars-tabacs), et les vendredis et samedis soir sont les plus gros. Le décideur est presque toujours derrière le comptoir : le patron ou le couple de patrons, parfois un gérant salarié quand le bar de plage appartient à un groupe.",
    pains: [
      "Des journées très longues, souvent de 7 h à tard le soir, avec peu de personnel et beaucoup de rotation, surtout en saison.",
      "Des soirées matchs, concerts ou dégustations qui coûtent (abonnement, groupe, produits) et qui ne se remplissent pas faute d’avoir été annoncées.",
      "La peur de mal faire avec la loi Évin : on ne sait pas ce qu’on a le droit de publier sur l’alcool, alors on ne publie rien.",
      "Des marges serrées sur les boissons, des charges qui montent (énergie, loyer, licence), et un volume de tabac et de jeux en baisse pour les bars-tabacs.",
      "Une activité qui dépend énormément de la météo et de la terrasse : une semaine de vent ou de pluie et le chiffre s’effondre.",
      "Les relations avec le voisinage et la mairie (bruit, horaires, terrasse) qui limitent ce qu’on peut organiser.",
      "Des habitués fidèles mais vieillissants, et peu de nouveaux clients réguliers pour prendre le relais.",
    ],
    clientLoss: [
      "Le nouvel habitant, l’étudiant de Montpellier ou le touriste tape « bar », « bar à vin » ou « où voir le match » sur son téléphone et va là où il voit des photos, des horaires et une ambiance, pas forcément au plus près.",
      "La soirée match ou concert n’est annoncée que sur une affiche dans la vitrine : ceux qui ne passent pas devant n’en savent rien et vont ailleurs.",
      "Google indique fermé ou affiche de mauvais horaires : le client ne vient même pas vérifier.",
      "Les habitués déménagent, vieillissent ou changent d’habitudes, et personne ne vient les remplacer faute de visibilité.",
      "Le client de passage a passé un bon moment mais n’a aucune raison particulière de revenir chez vous plutôt qu’au bar d’à côté.",
      "Des avis négatifs sans réponse sur l’accueil ou les prix, qui font hésiter ceux qui ne vous connaissent pas encore.",
    ],
    seasonality:
      "Sur le littoral, la saison fait l’année. D’avril à septembre, les terrasses des quais à Sète, les bars de plage de Frontignan et Marseillan et les bars des ports tournent à plein, avec un pic de juillet à la Saint-Louis fin août : les joutes, les fêtes et les soirées d’été occupent le patron jour et nuit. L’Escale à Sète au printemps des années paires et les grands tournois de football ou de rugby à la télévision sont des pics à part. À Balaruc-les-Bains, les curistes (mars à décembre) font une clientèle de café régulière, en journée. L’hiver est très calme : les bars de plage ferment, les bars de quartier vivent de leurs habitués et des soirs de match, et les patrons prennent souvent leurs congés en janvier ou février. Les meilleures périodes pour prospecter : fin septembre à fin novembre (le patron fait le bilan de l’été et cherche à remplir l’hiver) et février à avril (on prépare la saison, les événements, la terrasse). Pour un bar de plage, c’est février-mars, avant la réouverture.",
    digitalHabits:
      "La fiche Google existe presque toujours, souvent créée automatiquement, avec des horaires approximatifs et des photos de clients prises de nuit. Une page Facebook ouverte il y a longtemps, surtout utilisée pour annoncer un match, un concert ou une fermeture exceptionnelle. Instagram chez les bars à vin, les bars de plage et les jeunes repreneurs, alimenté par à-coups. Beaucoup communiquent par une affiche dans la vitrine, une ardoise sur le trottoir, ou un groupe de messages avec les habitués. Le site internet est rare. Presque personne ne demande d’avis. Et la plupart des patrons évitent de publier sur l’alcool par crainte de la loi Évin, sans vraiment savoir ce qui est permis.",
  },

  offers: {
    priority: [
      {
        offer: "reseaux-sociaux",
        pitch:
          "Vos soirées, vos matchs, votre terrasse au coucher de soleil : on les annonce à l’avance, régulièrement, et on connaît les règles de la loi Évin, donc vous publiez sans prendre de risque. Vous, vous restez derrière le comptoir.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Quand quelqu’un cherche « bar » ou « où voir le match » autour de lui, c’est Google qui répond. On remet vos horaires justes, saison et fermetures comprises, de belles photos de votre salle et de la terrasse, et on répond aux avis à votre place.",
      },
      {
        offer: "fidelite",
        pitch:
          "Une carte de fidélité dans le téléphone de vos clients : le dixième café offert, une planche pour les fidèles, et un petit message pour prévenir d’un match ou d’une soirée. Ceux qui sont passés une fois ont une raison de revenir.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée sur le comptoir : le client content approche son téléphone et laisse un avis en dix secondes. Vos habitués vous adorent, il faut juste que ça se voie pour ceux qui ne vous connaissent pas encore.",
      },
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit quelqu’un qui cherche un bar ici, je vous compare aux trois bars les plus proches, et je vous laisse trois choses à corriger, dont une que vous pouvez faire seul. C’est gratuit.",
      },
    ],
    upsell:
      "Après la carte d’avis et la fiche Google, la suite logique est la gestion des réseaux sociaux pour annoncer les soirées et les matchs, à lancer avant la saison ou avant un grand tournoi. Ensuite, la carte de fidélité digitale pour garder les clients gagnés l’été pendant l’hiver. Pour un bar à vin ou un bar de plage qui prend des réservations de groupe ou organise des événements, un site vitrine simple avec l’agenda et un formulaire de réservation. Et pour un bar qui reçoit beaucoup de messages (privatisation, horaires, match diffusé ou non), un agent IA qui répond à sa place.",
  },

  timing: {
    best: [
      {
        label: "Milieu d’après-midi",
        days: [1, 2, 3, 4, 5],
        from: "14:30",
        to: "17:00",
        why: "Le café d’après repas est passé, l’apéro n’a pas commencé : le patron est au comptoir, disponible, sauf si la terrasse est pleine.",
      },
      {
        label: "Milieu de matinée",
        days: [1, 2, 3, 4, 5],
        from: "09:30",
        to: "11:00",
        why: "Le rush du café est fini, il reste quelques habitués au comptoir : moment idéal pour un bar-tabac ou un café de quartier.",
      },
      {
        label: "Téléphone en semaine",
        days: [2, 3, 4],
        from: "15:00",
        to: "16:30",
        why: "En général les après-midi les plus calmes de la semaine, sans match ni événement.",
      },
    ],
    avoid: [
      {
        label: "Rush du café",
        from: "07:00",
        to: "09:30",
        why: "Actifs pressés, tabac, journaux, jeux : le patron sert à la chaîne et ne vous écoutera pas.",
      },
      {
        label: "Midi",
        from: "12:00",
        to: "14:00",
        why: "Plat du jour, apéritif et cafés d’après repas : c’est un vrai moment de service dans beaucoup de bars.",
      },
      {
        label: "Apéro du soir",
        from: "18:00",
        to: "20:00",
        why: "Le coup de feu de la journée : entrer pour parler affaires à ce moment, c’est se griller pour de bon.",
      },
      {
        label: "Soirs de match et d’événement",
        from: "19:30",
        to: "23:30",
        why: "Un soir de match ou de concert, la salle est pleine et le patron ne quitte pas les pompes à bière : vérifiez le calendrier sportif avant d’appeler ou de passer.",
      },
      {
        label: "Week-end",
        days: [0, 6],
        from: "09:00",
        to: "20:00",
        why: "Marché, terrasse, courses au PMU, familles : ce sont les plus gros jours, ne passez pas.",
      },
    ],
    usuallyClosed: [1],
    phoneNote:
      "Pour un bar, la visite vaut mieux que l’appel : on y entre comme un client, on prend un café, et la conversation vient naturellement. Si vous appelez, faites-le entre 15 h et 16 h 30 en semaine, sur le fixe du bar, jamais un soir de match ni pendant l’apéro. Les jours de fermeture varient beaucoup (lundi pour beaucoup de bars de quartier, dimanche et lundi pour les bars à vin, dimanche après-midi pour les bars-tabacs) : vérifiez sur la fiche Google avant de vous déplacer.",
    seasonNote:
      "Prospectez de fin septembre à fin novembre et de février à avril ; pour les bars de plage, en février-mars avant la réouverture. Oubliez juillet-août jusqu’à la Saint-Louis, l’Escale à Sète, les semaines de grands tournois sportifs et les fêtes de fin d’année. En janvier-février, vérifiez les congés annuels.",
  },

  scripts: {
    physique: {
      id: "bar-cafe-physique",
      title: "Visite au comptoir",
      channel: "physique",
      duration: "4 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer comme un client, s’installer au comptoir et savoir qui est le patron.",
          lines: [
            "Bonjour ! Un café, s’il vous plaît.",
            "C’est agréable ici, c’est calme à cette heure-ci. Vous êtes là depuis longtemps ?",
            "Je voulais dire un mot au patron ou à la patronne, c’est vous ?",
            "Pas de souci. Il ou elle est là plutôt à quelle heure ? Je repasse, j’en ai pour deux minutes.",
          ],
          tip: "Consommez toujours, au comptoir plutôt qu’en salle, et payez tout de suite. Attendez qu’il n’y ait plus personne à servir avant de parler de votre activité, jamais devant un habitué qui écoute.",
          branches: [
            {
              if: "C’est un serveur ou un gérant salarié",
              then: "Demandez qui décide pour la communication et quand il est là. Laissez votre carte avec un mot manuscrit : « Passé vous voir pour votre fiche Google, je repasse jeudi vers 15 h. {prenom} ».",
            },
            {
              if: "C’est le patron, et il discute avec des habitués",
              then: "Buvez votre café tranquillement, participez à la conversation si on vous y invite, et attendez qu’il revienne vers vous.",
            },
            {
              if: "La terrasse est pleine",
              then: "Ne dites rien de commercial. Demandez simplement : « Vous êtes plus tranquille à quelle heure ? Je repasse. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les commerces du coin, et pas mal de bars, à être trouvés par les gens qui ne les connaissent pas encore.",
            "Je ne viens rien vous vendre aujourd’hui. En venant, j’ai cherché un bar ici sur mon téléphone, et il y a un détail sur {commerce} qui m’a interpellé. Je peux vous montrer, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} et la recherche « bar {ville} » déjà ouvertes. Posez le téléphone sur le comptoir, tourné vers lui.",
          branches: [
            {
              if: "« Je n’ai pas le temps »",
              then: "« Je comprends, je vois que ça bouge. Je repasse mardi vers 15 h ou jeudi en milieu de matinée, qu’est-ce qui vous arrange ? »",
            },
            {
              if: "« Moi, internet, ce n’est pas mon truc »",
              then: "« Justement, vous n’aurez rien à faire. Je vous montre juste ce que voient les autres, et vous jugez. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible, sans juger le bar.",
          lines: [
            "Regardez : quand je tape « bar » ici, à {ville}, vous sortez après des bars qui ont plus de photos et d’avis récents.",
            "Et là, Google dit que vous fermez à 20 h le samedi, alors que vous êtes ouverts plus tard, c’est bien ça ? Quelqu’un qui cherche un verre à 21 h ne viendra même pas voir.",
            "Vos photos, ce sont surtout des photos de clients prises de nuit. Alors que votre terrasse en fin d’après-midi, c’est ça qui donne envie de venir.",
            "Et votre soirée match de samedi, je ne l’ai vue nulle part en ligne, seulement sur l’affiche de la vitrine.",
          ],
          tip: "Un seul constat, le plus parlant. Commencez par un compliment sincère : l’ambiance, la terrasse, le café, la déco.",
          branches: [
            {
              if: "La fiche est déjà bien tenue",
              then: "Félicitez sincèrement, puis basculez sur les soirées : « Et vos matchs et vos soirées, vous les annoncez comment aujourd’hui ? »",
            },
            {
              if: "« Ah bon ? Je ne savais pas »",
              then: "« C’est très courant, Google remplit tout seul si personne ne le fait. Ça se corrige vite. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le patron de ce qui l’embête vraiment.",
          lines: [
            "Vos soirées, vos matchs, aujourd’hui vous les annoncez comment ?",
            "En dehors des habitués, les nouveaux clients, vous avez l’impression qu’ils vous trouvent comment ?",
            "Et l’hiver, quand la terrasse est vide, qu’est-ce qui fait venir du monde ?",
          ],
          tip: "Une seule question, puis silence. Le patron de bar aime raconter : laissez-le parler, c’est là qu’il vous donne vos arguments.",
          branches: [
            {
              if: "Il parle de la loi Évin (« on n’a pas le droit de parler d’alcool »)",
              then: "« Vous avez raison d’y faire attention. Il y a des règles précises, mais on peut parler de l’ambiance, du match, de la terrasse, des planches, et donner des informations objectives sur les vins. C’est justement notre travail de rester dans les clous. »",
            },
            {
              if: "Il parle d’une soirée qui n’a pas marché",
              then: "« C’est souvent une question d’annonce : une affiche dans la vitrine, ça ne touche que ceux qui passent devant. »",
            },
            {
              if: "Il parle du personnel ou du voisinage",
              then: "Écoutez, compatissez, notez. Ne vendez rien là-dessus. Revenez ensuite : « Et côté clients, ça tourne comme vous voulez ? »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose un truc simple : un audit gratuit de ce que voit quelqu’un qui cherche un bar ici, comparé aux trois bars les plus proches, avec trois choses à corriger en priorité.",
            "Ça prend vingt minutes. Je repasse mardi à 15 h ou jeudi à 10 h, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci, et merci pour le café. Je reviendrai, c’est sûr.",
          ],
          tip: "Proposez deux créneaux précis, un en milieu d’après-midi, un en milieu de matinée. Notez le rendez-vous devant lui et laissez un pourboire correct.",
          branches: [
            {
              if: "« Envoyez-moi ça par mail »",
              then: "« Je préfère vous le montrer sur l’écran, ici au comptoir, c’est plus parlant. Vingt minutes, mardi ou jeudi ? »",
            },
            {
              if: "« Il faut que j’en parle à ma femme, c’est elle qui fait Facebook »",
              then: "« Bien sûr. Elle est là plutôt quand ? Je passe quand vous êtes tous les deux, c’est mieux pour décider. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et je repasserai boire un café en ami. Bonne fin de journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "bar-cafe-telephone",
      title: "Appel au bar",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier que ce n’est pas un moment de rush.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, à Sète.",
            "Je ne vous prends pas en plein coup de feu, là ?",
          ],
          tip: "Appelez entre 15 h et 16 h 30 en semaine, jamais pendant l’apéro ni un soir de match. On entend le bruit de la salle : s’il y a du monde, abrégez.",
          branches: [
            {
              if: "« Si, c’est plein »",
              then: "« Je vous rappelle demain vers 15 h, ça vous va ? » Et rappelez vraiment à l’heure dite.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le patron, ou au moins son prénom et le bon moment.",
          lines: [
            "Je voudrais parler au patron ou à la patronne, c’est au sujet de la fiche Google du bar.",
            "Vous pouvez me dire son prénom ? Et il est plus facile à joindre à quel moment de la journée ?",
          ],
          tip: "Soyez aimable avec le serveur : il transmettra votre message, ou pas.",
          branches: [
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler un point sur sa fiche Google, les horaires notamment. Ça peut lui faire perdre des clients le soir. »",
            },
            {
              if: "« Passez plutôt le voir »",
              then: "« Avec plaisir. Il est là plutôt en milieu de matinée ou en milieu d’après-midi ? » Et passez-y vraiment.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. En cherchant un bar à {ville} sur mon téléphone, j’ai vu que vos horaires sur Google s’arrêtent à 20 h le samedi, alors que vous êtes ouverts plus tard, c’est bien ça ?",
            "C’est le genre de détail qui fait passer les clients du soir chez le voisin. On aide les bars et les commerces du Bassin de Thau à corriger ça et à mieux annoncer leurs soirées.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, vos soirées et vos matchs, vous les annoncez où ?",
            "Et la fiche Google, les avis, c’est vous qui vous en occupez, ou quelqu’un d’autre ?",
          ],
          tip: "Deux questions maximum au téléphone. Le reste se fera au comptoir.",
          branches: [
            {
              if: "« Nulle part, les gens savent »",
              then: "« Les habitués, oui. Ce sont les autres qui ne savent pas, et c’est justement là qu’on peut vous aider. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes au bar, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, au comptoir, en vingt minutes. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 15 h, ou jeudi à 10 h en milieu de matinée. Qu’est-ce qui vous arrange ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande : « Ça dépend de ce dont vous avez besoin, c’est justement ce qu’on verra ensemble. »",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, ça dépend de votre situation, et je ne veux pas vous dire un chiffre au hasard. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Pas de souci, dites-moi le moment calme qui vous arrange, en milieu de matinée ou d’après-midi, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note mardi à 15 h au bar. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un petit SMS de confirmation avec mon nom. Si un imprévu arrive, vous me répondez dessus, tout simplement.",
            "Merci, et bonne soirée.",
          ],
          tip: "Envoyez le SMS de confirmation dans les cinq minutes, et un rappel la veille, jamais pendant l’apéro.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, votre clientèle, c’est plutôt des habitués, des gens de passage, ou ça dépend beaucoup de la saison ?",
      why: "Comprendre d’où vient le chiffre et quel poids a le client qui ne connaît pas encore le bar.",
    },
    {
      type: "S",
      question: "Vos soirées, vos matchs, vos événements, vous les annoncez comment en ce moment ?",
      why: "Repérer l’affiche dans la vitrine, la page Facebook abandonnée, et l’ouverture pour les réseaux sociaux.",
    },
    {
      type: "P",
      question: "Ça vous est déjà arrivé de préparer une soirée ou un match, et que la salle ne se remplisse pas comme prévu ?",
      why: "Faire toucher du doigt le coût d’un événement mal annoncé.",
    },
    {
      type: "P",
      question: "Publier sur vos vins, vos bières ou vos cocktails, c’est quelque chose que vous évitez, par peur de la loi Évin ?",
      why: "Faire émerger le blocage réglementaire, et se positionner comme celui qui connaît les règles.",
    },
    {
      type: "I",
      question: "Si, d’ici quelques années, une partie de vos habitués ne vient plus, qui les remplace aujourd’hui ?",
      why: "Faire réaliser que la clientèle fidèle s’érode doucement et qu’il faut une source de nouveaux habitués.",
    },
    {
      type: "I",
      question: "L’été, quelqu’un qui cherche « bar » ou « où voir le match » à {ville} et tombe sur le voisin, ça vous coûte combien de tables sur une saison, à votre avis ?",
      why: "Lui faire estimer lui-même le manque à gagner, sans avancer de chiffre.",
    },
    {
      type: "N",
      question: "Si vos clients de l’été avaient votre carte de fidélité dans leur téléphone, et que vous pouviez les prévenir d’un match ou d’une soirée en hiver, qu’est-ce que ça changerait pour vous ?",
      why: "Lui faire formuler lui-même le bénéfice de la fidélité digitale et des annonces régulières.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de ma page.",
      hidden: "Souvent un ami ou un prestataire qui publie de temps en temps. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous y ayez pensé.",
      questionner: "Il s’occupe aussi de la fiche Google et des avis ? Et vos horaires du soir, il les a vérifiés récemment ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur permet juste de vérifier que tout est à jour, par exemple vos horaires du samedi soir sur Google.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à la personne qui s’en occupe. S’il corrige tout, tant mieux. Mardi 15 h ou jeudi 10 h ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je suis derrière le comptoir de 7 h à minuit.",
      hidden: "La fatigue, et la peur d’avoir encore une chose à gérer en plus du service.",
      accueillir: "Je sais, vous faites des journées que peu de gens tiendraient.",
      questionner: "Aujourd’hui, annoncer une soirée ou répondre à un avis, vous le feriez à quel moment ?",
      recadrer: "C’est justement l’idée : que ça tourne sans vous. Vous nous dites ce qui se passe au bar, on s’occupe du reste, et on reste dans les règles de la loi Évin.",
      proposer: "Je vous prends vingt minutes dans un moment calme, pas plus. Jeudi à 10 h, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour un bar, on ne gagne pas grand-chose sur un café.",
      hidden: "Des marges vraiment serrées, et il ne voit pas encore ce qu’une salle pleine un soir de match peut rapporter.",
      accueillir: "Je comprends, sur un café ou une pression, la marge ne fait pas de miracle.",
      questionner: "Une soirée match bien remplie, par rapport à une soirée à moitié vide, ça fait quelle différence pour vous ?",
      recadrer: "On a des solutions qui démarrent très petit, comme la carte d’avis sur le comptoir, et une partie de l’audit, vous pouvez la faire seul gratuitement. En général, quelques soirées mieux remplies suffisent à s’y retrouver.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "neveu",
      objection: "Mon neveu fait ça, il est sur Instagram toute la journée.",
      hidden: "L’envie de ne pas dépenser et la confiance dans la famille. Souvent, le neveu a promis mais publie rarement.",
      accueillir: "C’est bien d’avoir quelqu’un de la famille qui s’y connaît.",
      questionner: "Il publie toutes les semaines ? Il connaît les règles de la loi Évin sur ce qu’on peut dire de l’alcool ?",
      recadrer: "Être sur Instagram pour soi, ce n’est pas la même chose que communiquer pour un bar : il y a la régularité, la fiche Google, et des règles précises sur l’alcool, qu’on ne connaît pas forcément.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et s’il manque de temps un jour, vous saurez où me trouver.",
    },
    {
      id: "facebook-suffit",
      objection: "J’ai ma page Facebook, j’y mets les matchs, ça suffit.",
      hidden: "Le sentiment d’avoir déjà fait sa part, et quelques « j’aime » d’habitués qui rassurent.",
      accueillir: "C’est très bien, vos habitués savent où regarder.",
      questionner: "Et quelqu’un qui vient d’arriver dans le quartier, ou un touriste, il tape quoi sur son téléphone pour trouver où voir le match ?",
      recadrer: "Facebook parle à ceux qui vous suivent déjà. Les autres cherchent en général sur Google Maps, et c’est là qu’ils choisissent.",
      proposer: "Gardez Facebook, on ne touche à rien. Je vous montre juste ce que voit ce nouveau client, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici tout le monde se connaît, ça marche au bouche-à-oreille.",
      hidden: "La fierté d’un lieu de vie reconnu dans le quartier, et l’idée que le digital ne colle pas à l’esprit du bar.",
      accueillir: "C’est ce qui fait l’âme d’un bar comme le vôtre, vous avez raison d’y tenir.",
      questionner: "Quand un habitué parle de vous à un collègue ou à un cousin de passage, vous savez ce que fait cette personne juste après ?",
      recadrer: "En général, elle vérifie sur Google : l’adresse, les horaires, les photos, les avis. Les avis, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tous.",
      proposer: "La carte d’avis sur le comptoir, c’est exactement ça : faire parler vos habitués. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi après la saison, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai rush à cet instant.",
      accueillir: "Bien sûr, je ne veux pas vous déranger en plein service.",
      questionner: "Pour ne pas vous tomber dessus au mauvais moment, c’est plus calme le mardi après-midi ou le jeudi matin ?",
      recadrer: "Un mail, honnêtement, il va se perdre. Ce que j’ai à vous montrer tient sur un écran, au comptoir c’est beaucoup plus clair, et en plus j’aurai un bon café.",
      proposer: "Je passe jeudi à 10 h, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "habitues",
      objection: "Mes clients, ce sont des habitués, ils n’ont pas besoin d’internet pour venir.",
      hidden: "Il ne se voit pas comme un commerce qui a besoin d’être trouvé, et craint de dénaturer l’esprit du bar. Souvent, il sent pourtant que les habitués sont moins nombreux qu’avant.",
      accueillir: "C’est une vraie richesse, des habitués fidèles, beaucoup de bars n’ont pas cette chance.",
      questionner: "Vos habitués d’aujourd’hui, vous les avez connus comment, au départ ? Et ces dernières années, il y en a beaucoup de nouveaux ?",
      recadrer: "Vos habitués, eux, n’ont pas besoin d’internet, on est d’accord. Mais les habitués de demain sont aujourd’hui des nouveaux voisins ou des gens de passage, et en général ils vous découvrent d’abord sur leur téléphone.",
      proposer: "On ne change rien à l’esprit du bar. Je vous montre juste comment un nouveau voisin vous trouve aujourd’hui, vingt minutes, mardi ou jeudi ?",
    },
  ],

  proofs: [
    "En général, quand on ne connaît pas le quartier, on cherche « bar », « bar à vin » ou « où voir le match » sur son téléphone avant de choisir, surtout le soir.",
    "Des horaires justes, notamment le soir et hors saison, c’est la correction la plus simple et celle qui évite le plus de clients perdus.",
    "Une soirée annoncée quelques jours avant, régulièrement et au même endroit, attire en général plus de monde qu’une affiche vue seulement par ceux qui passent devant.",
    "Les clients contents laissent rarement un avis d’eux-mêmes ; leur rendre la chose facile au comptoir rééquilibre souvent une note.",
    "Répondre aux avis, même en deux lignes, montre qu’il y a un patron présent et attentif, ce que regardent souvent ceux qui hésitent.",
    "On peut communiquer pour un bar tout en respectant la loi Évin : l’ambiance, la terrasse, les matchs, les planches et des informations objectives sur les boissons.",
    "Une carte de fidélité dans le téléphone ne se perd pas, et permet de prévenir les clients de l’été quand le bar organise quelque chose en hiver.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour regarder sa fiche Google ou ses avis avec vous, au comptoir.",
    "Il vous parle d’une soirée ou d’un match qui n’a pas marché comme prévu.",
    "Question : « Et sur l’alcool, qu’est-ce qu’on a le droit de publier, exactement ? »",
    "Il évoque un projet : reprise récente, nouvelle terrasse, travaux, soirées concerts à lancer, abonnement aux matchs pris récemment.",
    "« Et vous pourriez annoncer les matchs de la saison pour moi ? »",
    "Il appelle son associé ou sa compagne pour qu’il ou elle vienne écouter.",
    "Il demande si vous travaillez déjà avec d’autres bars du quartier ou du port.",
    "Il vous offre le café, ou vous ressert sans que vous ayez demandé.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Facebook",
      "Instagram",
      "TripAdvisor",
      "PagesJaunes",
      "Site internet",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, et les horaires sont-ils justes (horaires du soir, jour de fermeture, fermeture d’hiver pour un bar de plage) ?",
      "Quelle catégorie Google est utilisée (bar, café, bar à vin, bar-tabac, bar sportif) et est-elle la plus adaptée ?",
      "Combien d’avis, quelle note, de quand date le dernier avis, et le patron y répond-il ?",
      "Que reprochent les avis négatifs : accueil, prix, bruit, attente, propreté ?",
      "Les photos sont-elles récentes, publiées par le propriétaire ou par des clients, et montrent-elles la salle, la terrasse, l’ambiance ?",
      "Y a-t-il une page Facebook ou un compte Instagram, de quand date la dernière publication, et les soirées ou matchs y sont-ils annoncés ?",
      "Les publications existantes respectent-elles la loi Évin (pas d’association de l’alcool à la fête ou à la séduction, message sanitaire présent) ?",
      "Le bar organise-t-il des événements réguliers (retransmissions sportives, concerts, dégustations, quiz) qui mériteraient d’être annoncés ?",
      "Sur la recherche « bar {ville} » ou « bar à vin {ville} », où sort {commerce} par rapport aux trois bars les plus proches ?",
      "Des avis mentionnent-ils un changement de propriétaire ou une réouverture récente ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les bars du Bassin de Thau à être trouvés par ceux qui ne les connaissent pas encore : nouveaux voisins, étudiants, touristes qui cherchent où boire un verre ou voir le match. En général, ça se joue sur des horaires justes, de belles photos, des avis récents et des soirées annoncées à l’avance, dans le respect de la loi Évin. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi ou jeudi ?",

  compliance:
    "Loi Évin (Code de la santé publique) : toute communication sur une boisson alcoolique, y compris sur Instagram, Facebook, la fiche Google ou un site, doit se limiter à des informations objectives (nom, degré, origine, appellation, composition, mode d’élaboration, prix, conditions de vente, mode de consommation) et ne jamais associer l’alcool à la fête, à la séduction, à la réussite, au sport ou à la performance. Chaque visuel ou publication qui met en avant une boisson alcoolique doit porter le message sanitaire « L’abus d’alcool est dangereux pour la santé, à consommer avec modération ». Sur les réseaux : pas de personnes qui trinquent ou boivent à l’image dans un registre festif, pas de mise en scène de jeunes, pas de publication visant les mineurs, et prudence avec les jeux-concours et le contenu repartagé par les clients ; on peut en revanche parler librement de l’ambiance, de la terrasse, des matchs, des concerts et de la cuisine, sans montrer l’alcool comme argument. Happy hour : ne pas en faire un argument incitatif ; si le bar propose des boissons alcoolisées à prix réduit sur une période, il doit proposer aussi des boissons sans alcool à prix réduit, et l’annoncer sobrement. Les open bars (alcool à volonté gratuit ou au forfait) sont interdits, tout comme la vente d’alcool aux mineurs. Fidélité : privilégier des récompenses sans alcool (café, soft, planche) plutôt qu’un verre d’alcool offert. Licence : vérifier la licence détenue (licence III, IV, petite licence restaurant) et ne mettre en avant que ce que le bar a le droit de servir. Bar-tabac : aucune publicité ni mise en avant des produits du tabac ou du vapotage ; pour les jeux (PMU, FDJ), rester sur l’information factuelle, sans incitation. Retransmissions : vérifier que le bar a bien un abonnement professionnel pour diffuser les matchs en public, et ne pas utiliser les logos de compétitions ou de clubs sans autorisation. Avant de publier une photo où l’on reconnaît un client ou un salarié, demander son accord écrit.",
};

export default sheet;
