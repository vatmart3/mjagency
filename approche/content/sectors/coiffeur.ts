import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "coiffeur",
  name: "Coiffeur / barbier",
  short: "Coiffeur",
  examples: [
    "salon de coiffure mixte de quartier",
    "salon femme (couleur, balayage, soins)",
    "barbier / barber shop",
    "coiffeur à domicile",
    "salon avec une ou deux apprenties",
    "coiffeur spécialisé mariage et chignons",
  ],
  tagline:
    "Un métier où les mains sont toujours prises : le téléphone sonne pendant la couleur, et chaque rendez-vous non honoré est une heure perdue.",

  reality: {
    rhythm:
      "Le salon est généralement fermé le dimanche et le lundi. Le mardi et le mercredi matin sont souvent les moments les plus calmes : quelques retraitées, des couleurs longues, parfois un trou dans le planning. Le mercredi après-midi, ce sont les enfants. À partir du jeudi, ça monte, et le vendredi et le samedi le planning est plein du matin au soir, souvent sans vraie pause déjeuner. Une journée type : ouverture vers 9 h, première cliente en couleur, pendant le temps de pose on coupe quelqu’un d’autre, le téléphone sonne toutes les demi-heures et c’est l’apprentie ou le gérant, ciseaux à la main, qui décroche. Le soir, fermeture vers 19 h, ménage, caisse, et c’est souvent là qu’on répond aux messages Instagram et qu’on commande les produits.",
    pains: [
      "Répondre au téléphone pendant une coupe ou une couleur : on s’interrompt, on se lave les mains, on cherche le planning, et la cliente dans le fauteuil attend.",
      "Les rendez-vous non honorés (les « lapins ») : un créneau d’une heure perdu sans prévenir, surtout sur les couleurs et les mèches.",
      "Les créneaux vides en début de semaine alors que le samedi est saturé et qu’on refuse du monde.",
      "Les messages Instagram et Facebook qui s’accumulent le soir (« vous avez de la place samedi ? », « c’est combien un balayage ? ») et auxquels on répond trop tard.",
      "La dépendance à une plateforme de réservation qui a les coordonnées des clientes et qui met en avant les salons concurrents juste à côté.",
      "Les avis Google : peu nombreux alors que les clientes sont contentes, et un seul avis négatif qui reste en haut pendant des mois.",
      "Le manque de temps pour prendre en photo les réalisations et les publier, alors que c’est ce qui fait venir les nouvelles clientes.",
    ],
    clientLoss: [
      "La cliente appelle, personne ne décroche parce que tout le monde a les mains dans les cheveux, et elle appelle le salon suivant sur Google.",
      "Une fiche Google avec des horaires faux (surtout l’été ou pendant les congés) : la cliente se déplace, trouve porte close, et ne revient pas.",
      "Pas de réservation en ligne ou un lien caché : les jeunes clientes et les nouveaux arrivants réservent chez celui où ça prend trente secondes sur le téléphone.",
      "Des photos de salon vieilles ou inexistantes : pour une couleur ou une coupe homme, les gens veulent voir le travail avant de confier leur tête.",
      "Aucune relance : la cliente qui venait toutes les six semaines décroche au bout de trois mois sans que personne ne s’en rende compte.",
      "Un barbier ou une franchise qui ouvre à côté avec une vitrine Instagram soignée et qui capte les 18-35 ans.",
    ],
    seasonality:
      "Sur le Bassin de Thau, deux pics nets : les mois qui précèdent l’été (mai-juin, mariages, communions, coupes courtes avant la plage) et décembre (fêtes, réveillons). Juillet-août, les habitués partent mais les estivants, les propriétaires de résidences secondaires et les mariages compensent sur Sète, Marseillan et Frontignan : c’est là que Google et la réservation en ligne comptent, car ces clients ne connaissent personne. À Balaruc, les curistes des thermes (de mars à décembre) restent environ trois semaines et cherchent un coiffeur pour une coupe ou un brushing pendant leur séjour : un salon bien visible sur Google en profite directement. Fin août, la Saint-Louis à Sète remplit le samedi. Janvier et février sont les mois creux : c’est le meilleur moment pour prospecter, le gérant a du temps et il voit ses trous de planning.",
    digitalHabits:
      "La majorité des salons utilisent aujourd’hui une plateforme de réservation, le plus souvent Planity, parfois Treatwell ou un logiciel de caisse avec agenda. Beaucoup gardent en parallèle la prise de rendez-vous au téléphone, pendant la coupe, et un agenda papier pour les habituées. Instagram est la vitrine principale pour les barbiers et les coloristes, souvent tenu par le gérant ou l’apprentie, de façon irrégulière. Facebook sert surtout à annoncer les fermetures. La fiche Google existe presque toujours, mais elle est rarement complète : photos anciennes, pas de lien de réservation, horaires d’été oubliés, avis sans réponse. Peu de salons ont un site à eux, et quand il existe il date souvent de plusieurs années.",
  },

  offers: {
    priority: [
      {
        offer: "agent-ia",
        pitch:
          "Vous avez les mains dans une couleur, le téléphone sonne : l’assistant répond à votre place, donne vos horaires et vos disponibilités, et prend le rendez-vous. Vous n’avez plus à lâcher les ciseaux, et vous ne perdez plus la cliente qui tombe sur la messagerie.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Dans la coiffure, les gens choisissent sur photo. On passe une fois par mois au salon, on prend vos plus belles réalisations, et on publie régulièrement à votre place. Vous, vous coiffez, votre Instagram vit tout seul.",
      },
      {
        offer: "fidelite",
        pitch:
          "Une carte de fidélité dans le téléphone de vos clientes, sans appli à télécharger. Et surtout, le mardi où votre planning est vide, vous envoyez un petit message aux fidèles : c’est comme ça qu’on remplit les jours creux sans casser les prix.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Au moment où la cliente se regarde dans le miroir et vous dit que c’est parfait, elle pose son téléphone sur la petite carte au comptoir et elle laisse son avis en dix secondes. C’est le meilleur moment pour le demander, et c’est tout de suite plus facile.",
      },
      {
        offer: "audit",
        pitch:
          "On regarde ensemble, en vingt minutes, ce que voit une personne qui cherche un coiffeur à {ville} sur son téléphone : votre fiche, vos avis, vos photos, et les deux ou trois salons qui passent devant vous. Vous repartez avec trois actions concrètes, dont une que vous pouvez faire seul, gratuitement.",
      },
    ],
    upsell:
      "Après la carte d’avis, la suite naturelle c’est la fiche Google optimisée (lien de réservation, photos des réalisations, horaires d’été), puis la carte de fidélité pour remplir le début de semaine. Pour un salon qui tourne bien ou un barbier qui veut se démarquer, on passe à la gestion d’Instagram, puis à l’assistant qui répond aux appels et aux messages. Le site vitrine vient en dernier, quand le salon veut une image à lui et ne plus dépendre uniquement de Planity.",
  },

  timing: {
    best: [
      {
        label: "Mardi et mercredi, milieu de matinée",
        days: [2, 3],
        from: "09:30",
        to: "11:00",
        why: "Début de semaine calme, souvent une couleur en pose : le gérant peut vous accorder deux minutes entre deux gestes.",
      },
      {
        label: "Jeudi, milieu de matinée",
        days: [4],
        from: "09:30",
        to: "11:00",
        why: "Encore gérable avant que le rythme de fin de semaine ne démarre.",
      },
      {
        label: "Début d’après-midi en début de semaine",
        days: [2, 3],
        from: "14:00",
        to: "15:00",
        why: "Petit creux après la reprise, avant les sorties d’école et les clientes du soir.",
      },
    ],
    avoid: [
      {
        label: "Samedi, toute la journée",
        days: [6],
        from: "08:30",
        to: "19:30",
        why: "Planning plein, salle d’attente pleine : vous seriez au mieux ignoré, au pire mal vu.",
      },
      {
        label: "Fin de journée",
        days: [2, 3, 4, 5],
        from: "17:00",
        to: "19:30",
        why: "Les clientes qui sortent du travail enchaînent, puis c’est le ménage et la caisse : personne n’a la tête à ça.",
      },
      {
        label: "Pause déjeuner des actifs",
        days: [2, 3, 4, 5],
        from: "12:00",
        to: "13:30",
        why: "Les clients qui viennent sur leur pause sont pressés, et le gérant mange souvent debout entre deux.",
      },
      {
        label: "Vendredi après-midi",
        days: [5],
        from: "14:00",
        to: "19:00",
        why: "Le week-end commence au salon : brushings, mariages du lendemain, rush.",
      },
    ],
    usuallyClosed: [0, 1],
    phoneNote:
      "Appelez le fixe du salon, pas le portable personnel. C’est souvent l’apprentie ou une coiffeuse qui décroche, les mains mouillées : soyez très bref, demandez quand le ou la gérante a une minute, et rappelez à l’heure dite. Ne jamais appeler le lundi (fermé) ni le samedi.",
    seasonNote:
      "Meilleure période : janvier à mars, puis septembre à novembre, quand les plannings ont des trous et que le gérant y pense. Éviter décembre, la quinzaine avant Noël, et la période mai-juin des mariages. En juillet-août sur le littoral, préférer le mardi matin et rester très court.",
  },

  scripts: {
    physique: {
      id: "coiffeur-physique",
      title: "Visite en salon",
      channel: "physique",
      duration: "3 à 6 min (ou 30 s + retour à heure fixe)",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Identifier le ou la gérante sans interrompre une cliente, et obtenir le droit de rester deux minutes.",
          lines: [
            "Bonjour ! Je ne vous dérange pas longtemps, je vois que vous êtes en plein travail.",
            "C’est vous qui gérez le salon ? Je m’appelle {prenom}, je suis de MJAGENCY, une agence de Sète.",
            "Je peux attendre que vous ayez posé votre couleur, ou repasser à l’heure qui vous arrange : qu’est-ce que vous préférez ?",
          ],
          tip:
            "Restez près de l’entrée, pas au milieu du salon, et ne parlez pas plus fort que le sèche-cheveux. Regardez le planning, le comptoir, la carte Planity collée à la vitre : tout ça nourrit votre constat.",
          branches: [
            {
              if: "C’est l’apprentie ou une employée qui vous accueille",
              then: "Merci beaucoup. C’est bien {dirigeant} qui s’occupe du salon ? À quel moment de la matinée il ou elle a deux minutes, en général ?",
            },
            {
              if: "Le gérant est en pleine coupe et ne peut pas lâcher",
              then: "Pas de souci, je ne vous prends pas votre temps maintenant. Je repasse mardi vers 10 h, ou mercredi à la même heure, qu’est-ce qui est le plus calme pour vous ?",
            },
            {
              if: "La salle d’attente est pleine",
              then: "Vous êtes complet, je ne vais pas vous embêter. Je vous laisse ma carte et je repasse un matin de début de semaine, ça vous va ?",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire en une phrase pourquoi on est là, sous l’angle de son quotidien et pas de notre produit.",
          lines: [
            "On aide les salons du coin à ne plus perdre les clientes qui appellent pendant qu’on a les mains prises.",
            "Et à remplir les mardis et mercredis, qui sont souvent plus calmes que le samedi.",
            "Je ne viens rien vous vendre aujourd’hui, je voulais juste vous montrer un truc que j’ai remarqué sur votre fiche Google.",
          ],
          tip:
            "Pendant qu’il ou elle continue de travailler, vous pouvez parler : un coiffeur écoute très bien en coupant. Ne lui demandez pas de poser les ciseaux.",
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer que vous avez regardé son salon à lui, avec un point précis et vérifiable.",
          lines: [
            "En venant, j’ai tapé « coiffeur {ville} » sur mon téléphone. Vous apparaissez, mais après deux autres salons.",
            "Vous avez de très bons avis, mais il y en a peu par rapport au monde que vous voyez passer, et les derniers n’ont pas de réponse.",
            "Et je n’ai pas trouvé de bouton pour réserver directement depuis Google : il faut passer par la plateforme, qui affiche aussi vos voisins.",
            "Vos réalisations sont superbes sur Instagram, mais la dernière publication date de plusieurs semaines.",
          ],
          tip:
            "Choisissez un ou deux constats maximum, préparés avant d’entrer. Montrez l’écran de votre téléphone si le gérant a une seconde : c’est plus fort que n’importe quelle phrase.",
          branches: [
            {
              if: "Sa fiche Google est déjà très bien tenue",
              then: "Franchement, votre fiche est une des mieux tenues du coin, bravo. La question, c’est plutôt le téléphone : combien d’appels vous manquez un samedi ?",
            },
            {
              if: "Il répond « je sais, j’ai pas le temps de m’en occuper »",
              then: "C’est exactement ce qu’on entend dans tous les salons. Vous êtes coiffeur, pas community manager, c’est normal.",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de sa douleur principale avec ses propres mots.",
          lines: [
            "Dites-moi, quand le téléphone sonne et que vous êtes en pleine couleur, comment ça se passe ?",
            "Et les lapins, les clientes qui ne viennent pas sans prévenir, ça vous arrive souvent ?",
            "Votre planning, il est plus rempli en fin de semaine qu’en début, j’imagine ?",
          ],
          tip:
            "Posez une question, puis taisez-vous. S’il raconte une anecdote (« la semaine dernière, trois lapins le même jour »), relancez dessus : c’est là que se trouve le rendez-vous.",
          branches: [
            {
              if: "Il parle des appels manqués",
              then: "Vous avez une idée de combien de ces appels rappellent vraiment ? En général, une cliente qui tombe sur la messagerie essaie le salon suivant.",
            },
            {
              if: "Il parle des lapins",
              then: "Une couleur non honorée, c’est une heure et demie de fauteuil vide. Il y a des façons simples de rappeler le rendez-vous la veille, on pourra en parler.",
            },
            {
              if: "Il dit que tout va bien",
              then: "Tant mieux, ça fait plaisir. Et si vous pouviez remplir un peu plus le mardi, ça vous intéresserait ou vous êtes bien comme ça ?",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous précis, un numéro direct ou un accord pour l’audit gratuit.",
          lines: [
            "Je vous propose une chose simple : je vous prépare un petit état des lieux gratuit de votre présence sur Google et Instagram, avec trois actions concrètes.",
            "Je vous le présente en vingt minutes, un matin calme. Mardi 10 h ou mercredi 9 h 30, qu’est-ce qui vous va le mieux ?",
            "Je vous laisse ma carte. Vous avez un numéro où je peux vous joindre directement, sans tomber sur le salon en plein rush ?",
            "Merci, bonne fin de matinée, et désolé encore pour l’interruption !",
          ],
          tip:
            "Remerciez aussi l’apprentie ou la cliente en partant : dans un salon, tout le monde vous a vu, et l’ambiance compte. Notez tout de suite dans l’app le créneau obtenu.",
          branches: [
            {
              if: "Il dit « laissez-moi votre carte, je vous rappellerai »",
              then: "Avec plaisir. Pour ne pas que ça se perde dans la semaine, je repasse mardi à 10 h, ça ne vous prendra que cinq minutes, d’accord ?",
            },
            {
              if: "Il accepte l’audit",
              then: "Parfait. Je note mardi 10 h. Si d’ici là vous avez un imprévu, voici mon numéro, un simple texto suffit.",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "coiffeur-telephone",
      title: "Appel au salon",
      channel: "telephone",
      duration: "1 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’on ne tombe pas au pire moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Je vous appelle à un mauvais moment, vous êtes en pleine coupe ?",
          ],
          tip:
            "Parlez lentement et avec le sourire : au salon, il y a du bruit, le sèche-cheveux, la musique. Si la personne répond « oui c’est pour un rendez-vous ? », ne jouez pas le client, dites tout de suite qui vous êtes.",
          branches: [
            {
              if: "La personne est visiblement débordée",
              then: "Je ne vous retiens pas. À quelle heure je peux rappeler demain matin pour avoir {dirigeant} deux minutes ?",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage (apprentie, coiffeuse)",
          goal: "Obtenir le nom du gérant et un moment précis où le joindre, sans forcer.",
          lines: [
            "C’est {dirigeant} qui gère le salon ? Je voulais lui parler deux minutes au sujet de votre fiche Google.",
            "Il ou elle a un moment plus calme dans la matinée, en général ? Plutôt vers 10 h ?",
            "Merci beaucoup, vous êtes gentille. Je rappelle à 10 h, vous pouvez lui dire que {prenom} a appelé ?",
          ],
          tip:
            "L’apprentie n’est pas un obstacle, c’est une alliée : soyez poli, retenez son prénom, et remerciez-la. La prochaine fois, c’est elle qui vous passera le gérant.",
          branches: [
            {
              if: "On vous dit « il est en rendez-vous toute la journée »",
              then: "Je comprends. Demain matin, le salon ouvre à quelle heure ? Je rappellerai juste avant la première cliente.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète et locale de poursuivre l’appel.",
          lines: [
            "Je travaille avec des commerces du Bassin de Thau, et j’ai regardé votre fiche Google en préparant mes visites à {ville}.",
            "Vous avez de très bons avis, mais je pense que vous perdez des clientes à deux ou trois endroits, surtout sur le téléphone et la réservation. Je peux vous prendre une minute pour vous expliquer ?",
          ],
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser deux questions pour confirmer la douleur, pas plus.",
          lines: [
            "Aujourd’hui, vos clientes réservent plutôt par téléphone ou par Planity ?",
            "Et quand vous êtes tous occupés, qui décroche ?",
            "Les mardis et mercredis, votre planning est plein, ou il reste des trous ?",
          ],
          tip:
            "Au téléphone, deux questions suffisent. Si le gérant commence à détailler, notez tout, et gardez le reste pour le rendez-vous.",
          branches: [
            {
              if: "Il demande « c’est combien ? »",
              then: "Ça dépend vraiment de ce dont vous avez besoin, et je ne veux pas vous donner un prix au hasard. C’est justement l’objet des vingt minutes : on regarde, et je vous dis ce qui vaut le coup ou pas.",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous (2 créneaux)",
          goal: "Obtenir un rendez-vous de 20 minutes au salon, sur un créneau calme.",
          lines: [
            "Le plus simple, c’est que je passe au salon vous montrer ce que j’ai vu, sur mon téléphone, en vingt minutes. C’est gratuit et ça ne vous engage à rien.",
            "Je peux venir mardi à 10 h, ou mercredi à 9 h 30, avant vos premières clientes. Qu’est-ce qui vous arrange ?",
          ],
          branches: [
            {
              if: "Aucun des deux créneaux ne va",
              then: "Pas de souci. Quel est votre matin le plus calme de la semaine prochaine ? Je m’adapte.",
            },
            {
              if: "Il préfère qu’on lui envoie quelque chose",
              then: "Je peux, mais honnêtement, un document de plus, vous n’allez pas avoir le temps de le lire entre deux couleurs. Vingt minutes au salon, c’est plus rapide pour vous. Mardi 10 h, ça irait ?",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser un moyen simple d’annuler.",
          lines: [
            "Parfait, je note mardi à 10 h au salon, {commerce}, avec {dirigeant}.",
            "Je vous envoie un petit texto de confirmation avec mon nom. Si vous avez un imprévu, répondez simplement au message.",
            "Merci, et bonne journée au salon !",
          ],
          tip:
            "Envoyez le texto dans les cinq minutes, pas le soir. Et la veille, un rappel court : vous montrez que vous faites vous-même ce que vous allez lui conseiller contre les lapins.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos clientes prennent rendez-vous comment : téléphone, Planity, Instagram, en passant au salon ?",
      why: "Savoir où arrivent les demandes, et si une plateforme est déjà en place, avant de proposer quoi que ce soit.",
    },
    {
      type: "S",
      question: "Qui s’occupe du téléphone et d’Instagram au salon, et à quel moment de la journée ?",
      why: "Mesurer le temps et la personne qui portent la charge, souvent le gérant lui-même, le soir.",
    },
    {
      type: "P",
      question: "Quand vous êtes en pleine couleur et que le téléphone sonne, qu’est-ce qui se passe concrètement ?",
      why: "Faire décrire la scène de l’appel manqué ou de l’interruption, avec ses propres mots.",
    },
    {
      type: "P",
      question: "Les rendez-vous non honorés, ça vous arrive combien de fois sur une semaine normale ?",
      why: "Faire émerger une douleur chiffrable par lui-même, pas par nous.",
    },
    {
      type: "I",
      question: "Une couleur qui ne vient pas un samedi, c’est combien de temps de fauteuil perdu, et est-ce que vous arrivez à le remplir ?",
      why: "Lui faire réaliser le coût réel d’un lapin, qu’il connaît mieux que nous.",
    },
    {
      type: "I",
      question: "Et une nouvelle cliente qui tombe sur la messagerie, vous pensez qu’elle rappelle, ou qu’elle essaie le salon suivant sur Google ?",
      why: "Relier l’appel manqué à une perte de nouvelle clientèle, pas seulement à un désagrément.",
    },
    {
      type: "N",
      question: "Si le mardi et le mercredi étaient aussi remplis que le jeudi, sans baisser vos prix, qu’est-ce que ça changerait pour vous ?",
      why: "Le faire formuler lui-même le bénéfice : c’est lui qui se vend la solution.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de ça.",
      hidden: "Souvent un logiciel de caisse ou Planity, parfois une connaissance qui a fait la fiche une fois ; il n’a pas envie de comparer ni de vexer quelqu’un.",
      accueillir: "C’est très bien, vous êtes déjà en avance sur beaucoup de salons.",
      questionner: "Il s’occupe de quoi exactement : la réservation, la fiche Google, Instagram ? Et vous en êtes content sur tout ?",
      recadrer: "Je ne viens pas remplacer quelqu’un qui fait bien son travail. Souvent, il reste un trou : les appels pendant la coupe, ou les avis. C’est là que je peux vous être utile.",
      proposer: "Je vous propose l’état des lieux gratuit : si tout est bien couvert, je vous le dirai franchement. Mardi 10 h ou mercredi 9 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, vous voyez bien, j’ai une cliente.",
      hidden: "C’est souvent vrai sur le moment ; ça veut dire « pas maintenant », rarement « jamais ».",
      accueillir: "Vous avez raison, votre cliente passe avant, je ne vais pas vous retenir.",
      questionner: "C’est quoi votre matinée la plus calme de la semaine, en général ?",
      recadrer: "Justement, ce que je propose, c’est de vous faire gagner du temps, pas de vous en prendre : moins de téléphone pendant les coupes, moins de messages le soir.",
      proposer: "Je repasse vingt minutes, mardi à 10 h ou mercredi à 9 h 30, à l’heure où vous êtes tranquille. Lequel je note ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, ces trucs-là, on n’a pas les moyens.",
      hidden: "Il craint un abonnement qui tourne sans résultat, ou il a déjà payé pour quelque chose qui n’a rien donné.",
      accueillir: "Je comprends, un salon a déjà beaucoup de charges, les produits, le loyer, les salaires.",
      questionner: "Qu’est-ce que vous avez déjà payé qui ne vous a pas servi ? Et un rendez-vous non honoré, ça représente combien pour vous ?",
      recadrer: "L’idée n’est pas de dépenser plus, c’est que ça rapporte au moins une ou deux clientes par mois de plus que ce que ça coûte. Si ce n’est pas le cas, ça ne vaut pas le coup, et je vous le dirai.",
      proposer: "On peut commencer tout petit, avec la carte d’avis au comptoir, qui coûte moins qu’une coupe par mois et qui s’étale. Et l’audit, lui, est gratuit : je vous le présente mardi ?",
    },
    {
      id: "neveu",
      objection: "Mon neveu s’y connaît, c’est lui qui m’a fait mon Instagram.",
      hidden: "Il veut faire plaisir à la famille, et ça ne lui coûte rien ; mais le neveu n’est pas toujours disponible.",
      accueillir: "C’est super d’avoir quelqu’un dans la famille qui s’en occupe, c’est précieux.",
      questionner: "Il passe souvent au salon prendre des photos ? La dernière publication, elle date de quand ?",
      recadrer: "Le souci, en général, ce n’est pas le savoir-faire, c’est la régularité : les études, le travail, la vie, et le compte s’arrête au bout de quelques mois. Pour une coiffeuse, les photos régulières, c’est ce qui fait venir les nouvelles clientes.",
      proposer: "On peut même travailler avec lui : je vous fais l’état des lieux gratuit, et vous lui donnez les trois actions. Je vous le montre mercredi 9 h 30 ou jeudi 10 h ?",
    },
    {
      id: "instagram-suffit",
      objection: "Instagram me suffit, mes clientes me trouvent là-dessus.",
      hidden: "Instagram marche pour ses habituées et les jeunes ; il ne voit pas les gens qui cherchent sur Google et ne le trouvent jamais.",
      accueillir: "C’est vrai que dans la coiffure, Instagram, c’est la vitrine. Et vos réalisations sont belles.",
      questionner: "Une personne qui vient d’arriver à {ville}, ou une curiste, elle tape quoi à votre avis pour trouver un coiffeur ?",
      recadrer: "Instagram, c’est pour ceux qui vous connaissent déjà ou qui tombent sur vous par hasard. Les gens qui cherchent « coiffeur près de moi », eux, passent par Google, et ils choisissent en trente secondes sur les avis et les photos.",
      proposer: "Je vous montre en vingt minutes ce qu’ils voient vraiment quand ils vous cherchent. Mardi 10 h ou mercredi 9 h 30 ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Le bouche-à-oreille, ça marche très bien pour moi.",
      hidden: "C’est vrai et il en est fier ; il n’a pas envie d’entendre que son salon a besoin d’aide.",
      accueillir: "C’est le meilleur compliment pour un salon, ça veut dire que vous travaillez bien.",
      questionner: "Et quand une amie de votre cliente entend parler de vous, qu’est-ce qu’elle fait avant de venir, à votre avis ?",
      recadrer: "Aujourd’hui, le bouche-à-oreille passe presque toujours par Google : on vous recommande, la personne tape votre nom, et regarde les avis et les photos. Si elle y trouve peu d’avis ou des horaires faux, la recommandation se perd en route.",
      proposer: "La carte d’avis au comptoir, c’est justement du bouche-à-oreille rendu visible. Je vous en montre une mardi à 10 h ou mercredi à 9 h 30 ?",
    },
    {
      id: "rappelez-moi",
      objection: "Envoyez-moi un mail, je regarderai.",
      hidden: "Poliment, il veut clore la conversation ; le mail finira sous les factures de produits.",
      accueillir: "Bien sûr, je peux vous envoyer quelque chose.",
      questionner: "Honnêtement, le soir après la fermeture, vous avez le temps de lire vos mails ?",
      recadrer: "Ce que j’ai à vous montrer, c’est votre fiche à vous, sur un téléphone : c’est beaucoup plus parlant en vrai qu’en pièce jointe, et ça prend vingt minutes.",
      proposer: "Je vous envoie un texto avec mes coordonnées, et on garde un créneau court : mardi 10 h ou mercredi 9 h 30 ? Si ça ne vous parle pas, on s’arrête là.",
    },
    {
      id: "planity",
      objection: "Planity fait déjà tout : les réservations, les rappels, tout.",
      hidden: "Il paie déjà un abonnement et ne veut pas en rajouter un ; il pense que « le digital » est réglé.",
      accueillir: "Planity, c’est très bien pour l’agenda, beaucoup de salons l’utilisent et en sont contents.",
      questionner: "Et vos clientes qui appellent au lieu de réserver en ligne, ou qui vous écrivent sur Instagram, qui leur répond ? Et sur la page Planity, vous voyez quels autres salons sont proposés à côté du vôtre ?",
      recadrer: "Planity gère l’agenda, mais pas votre fiche Google, vos avis, votre téléphone pendant la coupe, ni la relance des fidèles le mardi. Et la plateforme met aussi en avant vos concurrents : ce qui est à vous, ce sont vos avis Google et votre fichier clientes.",
      proposer: "On ne touche pas à Planity, on le complète. Je vous montre en vingt minutes ce qui manque autour : mardi 10 h ou mercredi 9 h 30 ?",
    },
  ],

  proofs: [
    "En général, la plupart des gens regardent les avis et les photos sur Google avant de choisir un nouveau coiffeur, surtout pour une couleur.",
    "Dans les salons, c’est ce qu’on voit souvent : les clientes contentes ne pensent pas à laisser un avis, sauf si on leur demande au bon moment, devant le miroir.",
    "Une cliente qui tombe sur la messagerie rappelle rarement : le plus souvent, elle essaie le salon suivant dans la liste.",
    "Un simple rappel la veille du rendez-vous réduit en général nettement les oublis ; la plupart des lapins sont des oublis, pas de la mauvaise volonté.",
    "Pour les nouveaux arrivants, les estivants ou les curistes de Balaruc, Google est souvent le seul moyen de trouver un salon : ils ne connaissent personne pour leur en recommander un.",
    "Les fidèles reviennent plus souvent quand on leur envoie un petit signe au bon moment, plutôt que d’attendre qu’elles y pensent.",
  ],

  buyingSignals: [
    "Il ou elle pose les ciseaux, ou vous demande d’attendre la fin de la coupe pour continuer à parler.",
    "Il sort son téléphone pour vous montrer sa fiche Google, son Instagram ou son agenda Planity.",
    "Il raconte spontanément un lapin récent ou un samedi où le téléphone n’arrêtait pas de sonner.",
    "Il demande « et ça marche comment, la carte au comptoir ? » ou veut la toucher.",
    "Il prend l’apprentie à témoin : « tu vois, c’est ce que je te disais pour les avis ».",
    "Il compare avec un salon concurrent précis : « le barbier d’en face, il a combien d’avis, lui ? »",
    "Il demande si c’est possible de relancer les clientes qui ne sont pas venues depuis longtemps.",
    "Il ouvre son agenda pour vous trouver un créneau lui-même.",
  ],

  research: {
    platforms: ["Google (fiche d’établissement)", "Planity", "Treatwell", "Instagram", "Facebook", "PagesJaunes", "TikTok"],
    questions: [
      "Le salon a-t-il une fiche Google complète : horaires à jour (y compris l’été et les jours fériés), catégories, photos récentes des réalisations ?",
      "Combien d’avis Google, quelle note, quelle date pour le dernier avis, et le gérant répond-il aux avis, positifs comme négatifs ?",
      "Le salon est-il sur Planity ou Treatwell, et y a-t-il un bouton de réservation directement depuis la fiche Google ?",
      "Quels sont les deux ou trois salons ou barbiers qui apparaissent avant lui sur « coiffeur {ville} », et qu’ont-ils de plus (avis, photos, réservation) ?",
      "Le compte Instagram existe-t-il, à quelle fréquence publie-t-il, montre-t-il des avant/après, et quand date la dernière publication ?",
      "Le salon a-t-il un site à lui, fonctionne-t-il correctement sur téléphone, et affiche-t-il les tarifs et un lien de réservation ?",
      "Les avis mentionnent-ils des problèmes de joignabilité (« impossible de les avoir au téléphone »), d’attente ou de rendez-vous oubliés ?",
      "Le salon a-t-il une spécialité visible (couleur, barbe, mariage, cheveux bouclés) qui mériterait d’être mise en avant en ligne ?",
      "Combien de coiffeuses et d’apprenties travaillent au salon (photos, avis, Instagram), pour estimer le volume d’appels ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, à Sète. On aide les salons du coin à ne plus perdre les clientes qui appellent pendant qu’on a les mains dans une couleur, et à remplir les débuts de semaine. En venant, j’ai regardé votre fiche Google : de très bons avis, mais peu nombreux, et pas de réservation directe. Je vous propose un état des lieux gratuit, vingt minutes, un matin calme. Mardi 10 h ou mercredi 9 h 30, qu’est-ce qui vous arrange ?",
};

export default sheet;
