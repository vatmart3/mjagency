import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "boulangerie",
  name: "Boulangerie-pâtisserie",
  short: "Boulangerie",
  examples: [
    "boulangerie de quartier",
    "boulangerie-pâtisserie artisanale",
    "pâtisserie fine et chocolaterie",
    "boulangerie avec snacking (sandwichs, formules midi, tielles)",
    "boulangerie bio ou au levain",
    "boulangerie de bord de plage ouverte en saison",
  ],
  tagline:
    "Des journées qui commencent à 4 h, un chiffre qui se fait en trois pics, et des clients qui choisissent leur boulangerie sur Google Maps bien plus qu’on ne le croit.",

  reality: {
    rhythm:
      "Le boulanger est au fournil vers 3 h ou 4 h pour la première fournée, le pâtissier arrive vers 5 h. Ouverture autour de 6 h 30 - 7 h, premier rush jusqu’à 9 h 30 (actifs, café-croissant, baguettes). Creux de 10 h à 11 h 30 : réassort, pâtisseries, commandes fournisseurs. Deuxième rush de 11 h 45 à 14 h avec les sandwichs et les formules. L’après-midi est le vrai temps calme : le boulanger dort souvent, c’est la patronne ou la vendeuse qui tient la boutique, fait les commandes et la paperasse. Troisième pic à la sortie d’école (16 h 30) puis la baguette du soir jusqu’à 19 h 30. Sur la semaine : un jour de fermeture (souvent lundi ou mercredi), et les samedis et dimanches matin sont les plus gros jours, avec les commandes de gâteaux. Très souvent c’est un couple : lui au fournil, elle en boutique et à la gestion, et c’est souvent elle qui décide pour tout ce qui touche à la communication.",
    pains: [
      "Des journées de 12 à 14 heures, six jours sur sept : le digital passe toujours après la fournée, donc il ne passe jamais.",
      "Recruter et garder des vendeuses et des apprentis : beaucoup de rotation, et chaque départ désorganise la boutique.",
      "Les coûts qui montent (farine, beurre, énergie des fours) et la peur de monter les prix face aux habitués.",
      "Les invendus : produire trop un jour de pluie, pas assez un dimanche de soleil, et jeter en fin de journée.",
      "Les commandes de gâteaux prises au téléphone en plein rush, notées sur un carnet : oublis, erreurs de prénom, de date ou de nombre de parts.",
      "La concurrence des chaînes de boulangerie en zone commerciale et des terminaux de cuisson qui cassent les prix de la baguette.",
      "Des horaires faux sur Google (jour de fermeture, congés annuels) qui envoient des clients devant une porte close, puis un avis à une étoile.",
    ],
    clientLoss: [
      "Le client de passage ou le touriste tape « boulangerie » sur son téléphone et va à celle qui a le plus d’avis et les plus belles photos, même 200 mètres plus loin.",
      "Porte close un jour où Google indiquait ouvert : ce client-là ne revient pas, et il le dit dans un avis.",
      "Les commandes de gâteaux d’anniversaire, de communion ou de fêtes partent chez le pâtissier qui montre ses créations en ligne et prend les commandes facilement.",
      "L’attente trop longue aux heures de pointe : les gens pressés basculent vers la chaîne avec parking ou la station-service.",
      "Le nouvel habitant du quartier n’a aucune raison particulière de revenir chez vous plutôt qu’ailleurs : pas de fidélité, pas de lien.",
      "Des avis négatifs restés sans réponse, qui donnent l’impression qu’il n’y a personne derrière le comptoir.",
    ],
    seasonality:
      "Sur le littoral, l’été change tout : à Sète, Frontignan-plage ou Marseillan-plage, la clientèle se multiplie, la file déborde sur le trottoir et les touristes cherchent « boulangerie » sur Google Maps depuis leur location, le matin. De juillet à la Saint-Louis fin août, le patron n’a pas une minute : ce n’est pas le moment de prospecter. À Balaruc-les-Bains, les curistes des thermes (mars à décembre) font une clientèle régulière et matinale, fidèle le temps de leur cure. L’hiver est calme : certaines boulangeries de plage ferment, les autres prennent leurs congés en janvier ou février. Les pics de commandes à connaître : bûches de Noël, galettes des rois en janvier, chocolats de Pâques, communions et mariages en mai-juin. Les meilleures périodes pour prospecter : mi-septembre à fin novembre (bilan de saison, le patron souffle) et février à avril (on prépare l’été : fiche Google, avis, photos).",
    digitalHabits:
      "La fiche Google existe presque toujours, souvent créée automatiquement, rarement revendiquée ou tenue à jour. Une page Facebook ouverte il y a des années, alimentée par à-coups (la photo de la galette, l’annonce des congés). Instagram chez les pâtissiers plus jeunes ou en reprise récente. Le site internet est rare, ou vieux et pas lisible sur téléphone. Les commandes se prennent au téléphone et au carnet. Certains utilisent une application anti-gaspillage pour les invendus. Les avis ne sont presque jamais demandés activement. La patronne gère tout ça le soir sur son téléphone, quand elle a le temps.",
  },

  offers: {
    priority: [
      {
        offer: "fiche-google",
        pitch:
          "C’est là que les gens vous cherchent avant de venir. On remet vos horaires justes, jours fériés et congés compris, on met des photos de votre vitrine qui donnent faim, et on répond aux avis à votre place, dans votre ton.",
      },
      {
        offer: "fidelite",
        pitch:
          "La carte de fidélité en carton, elle finit dans la machine à laver. Là, elle est dans le téléphone du client, et vous pouvez lui envoyer un petit message quand les galettes ou les bûches sont disponibles, ou un mardi calme.",
      },
      {
        offer: "site-vitrine",
        pitch:
          "Une page simple avec vos horaires, vos spécialités et surtout vos gâteaux sur commande : le client choisit, remplit le formulaire, et vous recevez une commande écrite, sans erreur de prénom sur le gâteau.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée à côté de la caisse : le client content approche son téléphone et il arrive directement sur la page pour laisser un avis. Vos habitués vous adorent, il faut juste leur rendre ça facile.",
      },
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit un client qui vous cherche sur internet, je vous compare aux trois boulangeries les plus proches, et je vous laisse trois choses à corriger, dont une que vous pouvez faire seul ce soir. C’est gratuit.",
      },
    ],
    upsell:
      "Après la fiche Google et la carte d’avis, la suite naturelle est la carte de fidélité digitale pour garder les nouveaux clients gagnés. Ensuite, un site vitrine avec la page commandes de gâteaux, à lancer avant les fêtes de fin d’année. Pour une pâtisserie haut de gamme, un site e-commerce en retrait en boutique pour les bûches, les galettes et les chocolats de Pâques. Et en fin d’hiver, une gestion des réseaux sociaux sur la saison pour préparer l’été.",
  },

  timing: {
    best: [
      {
        label: "Creux de l’après-midi",
        days: [2, 3, 4, 5],
        from: "14:30",
        to: "16:00",
        why: "Le rush du midi est passé, la sortie d’école n’a pas commencé : la patronne est en boutique, disponible, souvent seule.",
      },
      {
        label: "Fin de matinée calme",
        days: [2, 3, 4],
        from: "11:00",
        to: "11:40",
        why: "Entre le réassort et les premiers sandwichs, il y a un petit creux en semaine ; restez bref et repartez avant midi.",
      },
      {
        label: "Téléphone en début de semaine",
        days: [2, 3],
        from: "15:00",
        to: "16:00",
        why: "Les mardis et mercredis après-midi sont en général les plus calmes de la semaine au comptoir.",
      },
    ],
    avoid: [
      {
        label: "Fournée et rush du matin",
        from: "05:00",
        to: "11:00",
        why: "Fournil en pleine production puis file des actifs : personne ne vous écoutera, et vous passerez pour quelqu’un qui ne connaît pas le métier.",
      },
      {
        label: "Rush du midi",
        from: "12:00",
        to: "14:00",
        why: "Sandwichs, formules, desserts : c’est le deuxième gros moment de chiffre de la journée.",
      },
      {
        label: "Sortie d’école et baguette du soir",
        from: "16:30",
        to: "19:30",
        why: "Goûters puis pain du soir : la boutique se remplit jusqu’à la fermeture.",
      },
      {
        label: "Week-end",
        days: [0, 6],
        from: "06:00",
        to: "19:30",
        why: "Samedi et dimanche sont les plus gros jours, avec le retrait des gâteaux commandés : ne passez jamais.",
      },
    ],
    usuallyClosed: [1, 3],
    phoneNote:
      "Appelez le fixe de la boutique entre 14 h 30 et 16 h : c’est souvent la vendeuse qui décroche, demandez le prénom du patron ou de la patronne et le meilleur moment pour passer. N’appelez jamais le portable du boulanger l’après-midi : il dort, il s’est levé à 3 h. Le jour de fermeture (souvent lundi ou mercredi), vérifiez-le sur la fiche Google avant de vous déplacer.",
    seasonNote:
      "Prospectez de mi-septembre à fin novembre et de février à avril. Oubliez juillet-août (jusqu’à la Saint-Louis), les deux semaines avant Noël, la première quinzaine de janvier (galettes) et la semaine de Pâques. En janvier-février, vérifiez les congés annuels avant de vous déplacer.",
  },

  scripts: {
    physique: {
      id: "boulangerie-physique",
      title: "Visite en boutique",
      channel: "physique",
      duration: "3 à 5 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer comme un client, attendre que la boutique se vide et savoir à qui parler.",
          lines: [
            "Bonjour ! Je vais vous prendre une tradition, s’il vous plaît.",
            "Elle a une belle couleur. C’est fait ici, sur place ?",
            "Je voulais aussi dire un mot au patron ou à la patronne. C’est vous ?",
            "Pas de souci. Il ou elle est là plutôt à quelle heure ? Je repasse, j’en ai pour deux minutes.",
          ],
          tip: "Achetez toujours quelque chose et attendez qu’il n’y ait plus personne au comptoir. Jamais un mot commercial devant une file de clients.",
          branches: [
            {
              if: "C’est une vendeuse",
              then: "Demandez gentiment le prénom du patron et l’heure où il est là, laissez votre carte avec un mot écrit à la main : « Passé vous voir pour votre fiche Google, je repasse jeudi vers 15 h. {prenom} ».",
            },
            {
              if: "Le patron est au fournil",
              then: "Ne demandez pas à le déranger. Dites : « Surtout ne le dérangez pas, je repasse. Il est plus tranquille vers quelle heure ? »",
            },
            {
              if: "C’est la patronne",
              then: "Passez directement à l’accroche, c’est très souvent elle qui décide pour tout ce qui touche aux clients et à la communication.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les commerces du coin à être bien trouvés sur Google.",
            "Je ne viens rien vous vendre aujourd’hui. En arrivant j’ai regardé votre fiche Google, et il y a un détail qui m’a interpellé. Je peux vous montrer, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} déjà ouverte sur votre téléphone avant d’entrer. Tournez l’écran vers elle, ne lui demandez pas de chercher.",
          branches: [
            {
              if: "« Je n’ai pas le temps »",
              then: "« Je comprends, vous êtes seule en boutique. Je repasse jeudi vers 15 h ou vendredi à la même heure, qu’est-ce qui vous arrange ? »",
            },
            {
              if: "« On a déjà tout ce qu’il faut »",
              then: "« Tant mieux. Alors je vous montre juste le détail, et vous me direz si c’est déjà réglé. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible sur sa fiche, sans juger.",
          lines: [
            "Regardez : quand je tape « boulangerie » ici, à {ville}, vous sortez en quatrième, derrière des boulangeries qui ont plus d’avis récents.",
            "Et là, vos horaires disent ouvert le lundi. Or vous êtes fermés ce jour-là, c’est bien ça ? C’est typiquement le client qui se déplace pour rien.",
            "Vous avez de très bons avis, mais le dernier date de plusieurs mois, et il n’y a pas de réponse de votre part.",
            "Et les photos, c’est surtout la devanture. Alors que votre vitrine de pâtisseries, là, c’est ça qui donne envie de venir.",
          ],
          tip: "Choisissez le constat le plus parlant, pas les quatre. Commencez par un compliment sincère sur un produit que vous avez vu ou goûté.",
          branches: [
            {
              if: "La fiche est déjà impeccable",
              then: "Félicitez sincèrement (« C’est une des mieux tenues du coin ») et basculez sur la fidélité ou les commandes de gâteaux.",
            },
            {
              if: "« Ah bon ? Je ne savais pas »",
              then: "« C’est très courant, Google remplit tout seul si personne ne le fait. Ça se corrige en quelques minutes. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le commerçant de ce qui l’embête vraiment.",
          lines: [
            "Et les commandes de gâteaux pour le week-end, aujourd’hui elles arrivent comment ?",
            "L’été, les touristes, vous avez l’impression qu’ils vous trouvent facilement, ou c’est surtout les habitués ?",
            "Qu’est-ce qui vous prend le plus la tête en ce moment : trouver du personnel, les invendus, ou faire venir de nouveaux clients ?",
          ],
          tip: "Posez une seule question, puis taisez-vous. Laissez le silence travailler, même s’il dure cinq secondes.",
          branches: [
            {
              if: "Elle parle du personnel",
              then: "Écoutez, compatissez, notez. Ne vendez rien là-dessus. Revenez ensuite : « Et côté clients, ça va comme vous voulez ? »",
            },
            {
              if: "Il parle de la chaîne en zone commerciale",
              then: "« Eux, ils ont le prix. Vous, vous avez le goût et la relation. La fidélité, c’est exactement là que vous gagnez. »",
            },
            {
              if: "Elle parle des erreurs de commande",
              then: "« C’est exactement ce qu’on règle avec une page de commande en ligne : tout arrive écrit, avec la date et le prénom. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose un truc simple : je vous fais un audit gratuit de votre présence sur Google, et je vous montre les trois choses à corriger en priorité, dont au moins une que vous pouvez faire seule.",
            "Ça prend vingt minutes. Je repasse mardi à 15 h ou jeudi à 15 h 30, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci, et je repars avec ma tradition, c’est déjà une bonne visite.",
          ],
          tip: "Proposez toujours deux créneaux précis dans le creux de l’après-midi. Notez le rendez-vous devant elle.",
          branches: [
            {
              if: "« Envoyez-moi plutôt ça par mail »",
              then: "« Je vais vous le déposer en main propre, c’est plus parlant avec l’écran sous les yeux. Mardi ou jeudi ? »",
            },
            {
              if: "« Il faut que j’en parle à mon mari »",
              then: "« Bien sûr. Il est là plutôt quand ? Je peux passer quand vous êtes tous les deux, c’est mieux pour tout le monde. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et si un jour vos horaires Google vous jouent un tour, vous saurez qui appeler. Bonne fin de journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "boulangerie-telephone",
      title: "Appel à la boutique",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier que c’est un bon moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, à Sète.",
            "Je ne vous prends pas au moment d’un coup de feu, là ?",
          ],
          tip: "Souriez en parlant, ça s’entend. Appelez uniquement entre 14 h 30 et 16 h.",
          branches: [
            {
              if: "« Si, il y a du monde »",
              then: "« Je vous rappelle dans vingt minutes, ça vous va ? » Et rappelez vraiment dans vingt minutes.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le patron ou la patronne, ou au moins son prénom et le bon moment.",
          lines: [
            "Je voudrais parler au patron ou à la patronne, c’est au sujet de la fiche Google de la boulangerie.",
            "Vous pouvez me dire son prénom ? Et il ou elle est plus facile à joindre à quel moment ?",
          ],
          tip: "Soyez aimable avec la vendeuse : c’est elle qui transmettra, ou non, le message.",
          branches: [
            {
              if: "« Il dort, il travaille la nuit »",
              then: "« Bien sûr, surtout ne le réveillez pas. Et madame, elle est là parfois l’après-midi ? »",
            },
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler un souci sur la fiche Google, les horaires notamment. Ça peut lui faire perdre des clients. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. J’ai regardé votre fiche Google, et j’ai vu que vos horaires indiquent ouvert le lundi, alors que vous êtes fermés, c’est bien ça ?",
            "C’est le genre de détail qui envoie des clients devant une porte close. On aide les commerces du Bassin de Thau à corriger ça et à être mieux trouvés.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, qui s’occupe de la fiche Google et des avis, chez vous ?",
            "Et les commandes de gâteaux, elles arrivent surtout par téléphone ?",
          ],
          tip: "Au téléphone, deux questions maximum. Le reste se fera en face.",
          branches: [
            {
              if: "« Personne, on n’a pas le temps »",
              then: "« C’est le cas de presque toutes les boulangeries que je vois. C’est justement pour ça qu’on existe. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes en boutique, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, en vingt minutes, dans le calme de l’après-midi. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 15 h, ou jeudi à 15 h 30. Qu’est-ce qui vous arrange le mieux ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande : « Ça dépend de ce dont vous avez besoin, c’est justement ce qu’on verra ensemble. »",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, ça dépend vraiment de votre situation, et je ne veux pas vous dire un chiffre au hasard. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Pas de souci, dites-moi le jour qui vous arrange en début d’après-midi, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 15 h 30 à la boutique. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un petit SMS de confirmation avec mon nom. Si un imprévu arrive, vous me répondez dessus, tout simplement.",
            "Merci, et bonne fin de journée à toute l’équipe.",
          ],
          tip: "Envoyez le SMS de confirmation dans les cinq minutes, et un rappel la veille.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "En dehors des habitués, comment les nouveaux clients vous découvrent, aujourd’hui ?",
      why: "Savoir s’il a conscience du rôle de Google Maps, et d’où vient sa clientèle nouvelle.",
    },
    {
      type: "S",
      question: "Les commandes de gâteaux, vous les prenez comment en ce moment : téléphone, comptoir, messages ?",
      why: "Repérer le carnet, le téléphone en plein rush, et une ouverture pour le site vitrine.",
    },
    {
      type: "P",
      question: "Ça vous arrive d’avoir des clients qui disent avoir trouvé porte close, ou un avis qui parle des horaires ?",
      why: "Lui faire toucher du doigt le coût d’une fiche Google fausse.",
    },
    {
      type: "P",
      question: "Pendant le rush, quand le téléphone sonne pour une commande, comment ça se passe ?",
      why: "Faire émerger les erreurs, les oublis et le stress des commandes prises à la volée.",
    },
    {
      type: "I",
      question: "Si l’été, une partie des touristes passe devant chez vous pour aller à celle qui a plus d’avis, ça représente quoi sur une saison ?",
      why: "Lui faire mesurer lui-même le manque à gagner, sans que vous avanciez de chiffre.",
    },
    {
      type: "I",
      question: "Et si quelques habitués glissent petit à petit vers la chaîne en zone commerciale, vous le voyez venir comment ?",
      why: "Faire réaliser que l’érosion est silencieuse et qu’il n’a aucun moyen de garder le lien.",
    },
    {
      type: "N",
      question: "Si vos clients fidèles avaient votre carte dans leur téléphone, et que vous pouviez leur dire « les galettes sont là dès samedi », qu’est-ce que ça changerait pour vous ?",
      why: "Lui faire formuler lui-même le bénéfice de la fidélité digitale.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de ça.",
      hidden: "Souvent un prestataire qu’on ne voit plus, ou un site payé il y a des années. Parfois simplement une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous y ayez pensé.",
      questionner: "Il s’occupe de quoi exactement : la fiche Google, les avis, le site ? Et vous l’avez vu passer quand, pour la dernière fois ?",
      recadrer: "Je ne viens pas remplacer qui que ce soit. Un regard extérieur, ça permet juste de vérifier que ce qui est payé est bien fait, par exemple vos horaires qui indiquent ouvert le lundi.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à votre prestataire. S’il corrige tout, tant mieux pour vous. Mardi 15 h ou jeudi 15 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps pour ça, je suis au fournil depuis 4 h du matin.",
      hidden: "La peur d’ajouter une tâche de plus à des journées déjà trop longues.",
      accueillir: "Je sais, vos journées sont plus longues que les miennes, et de loin.",
      questionner: "Aujourd’hui, si vous deviez vous en occuper vous-même, vous le feriez quand ?",
      recadrer: "C’est justement l’idée : que ça tourne sans vous. Vous, vous validez une fois, et c’est nous qui faisons le reste.",
      proposer: "Je vous prends vingt minutes un après-midi, pas plus, et je vous montre ce qu’on ferait à votre place. Jeudi 15 h 30, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour une boulangerie, on ne fait pas des marges de fou.",
      hidden: "La pression sur les coûts, la farine et l’énergie. Et souvent, il n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, avec le prix du beurre et de l’électricité, chaque euro compte.",
      questionner: "Qu’est-ce qui vous paraîtrait raisonnable pour faire venir quelques clients de plus chaque semaine ?",
      recadrer: "On a des solutions qui commencent très petit, au mois, et une partie de l’audit, vous pouvez même la faire seul gratuitement. L’idée, c’est que ça se rembourse avec quelques baguettes et un gâteau de plus.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "neveu",
      objection: "Mon neveu s’y connaît, il va me faire ça.",
      hidden: "L’envie de ne pas dépenser, et la confiance dans la famille. Souvent, le neveu a promis mais n’a pas le temps.",
      accueillir: "C’est bien d’avoir quelqu’un de confiance dans la famille.",
      questionner: "Il a déjà commencé ? Il s’occuperait aussi de répondre aux avis et de mettre à jour les horaires à chaque congé ?",
      recadrer: "Créer, c’est une chose. Ce qui fait la différence sur Google, c’est le suivi toutes les semaines, et c’est ça qui lâche en général au bout de deux mois.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et si un jour il n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "facebook-suffit",
      objection: "J’ai ma page Facebook, ça me suffit.",
      hidden: "Il a l’impression d’avoir déjà fait sa part du digital.",
      accueillir: "C’est très bien, vos habitués vous y suivent sûrement.",
      questionner: "Et quelqu’un qui ne vous connaît pas, un touriste ou un nouveau voisin, il tape quoi sur son téléphone pour trouver une boulangerie ?",
      recadrer: "Facebook, ça parle à ceux qui vous connaissent déjà. Les nouveaux clients, eux, cherchent en général sur Google Maps, et c’est là que tout se joue.",
      proposer: "Gardez Facebook, on ne touche à rien. Je vous montre juste ce que voit un nouveau client sur Google, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici ça marche au bouche-à-oreille, depuis toujours.",
      hidden: "La fierté d’avoir une clientèle fidèle, et le sentiment que le digital, c’est pour les autres.",
      accueillir: "Et c’est la meilleure publicité qui soit, vous avez raison d’en être fier.",
      questionner: "Aujourd’hui, quand un client vous recommande à quelqu’un, vous savez ce que fait cette personne juste après ?",
      recadrer: "En général, elle vérifie sur Google : l’adresse, les horaires, les avis. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tout le monde.",
      proposer: "La carte d’avis à côté de la caisse, c’est exactement ça : faire parler vos clients contents. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai manque de temps à cet instant.",
      accueillir: "Bien sûr, je ne veux pas vous déranger.",
      questionner: "Pour ne pas vous rappeler au mauvais moment, qu’est-ce qui est le plus calme pour vous, le mardi ou le jeudi après-midi ?",
      recadrer: "Un mail, honnêtement, il va se perdre entre les factures de farine. Ce que j’ai à vous montrer tient sur un écran, en face c’est beaucoup plus clair.",
      proposer: "Je passe jeudi à 15 h 30, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "trop-de-monde",
      objection: "J’ai déjà trop de monde, je n’arrive pas à suivre, je n’ai pas besoin de plus de clients.",
      hidden: "La fatigue et la peur d’être débordé. Souvent un souci d’organisation plus que de clientèle.",
      accueillir: "C’est une très belle situation, beaucoup de boulangers aimeraient la vivre.",
      questionner: "Ce qui vous déborde, c’est plutôt la file au comptoir, le téléphone, ou les commandes de gâteaux ?",
      recadrer: "L’idée n’est pas forcément d’avoir plus de monde, mais d’avoir mieux : des commandes écrites qui arrivent toutes seules, des clients qui viennent aux heures calmes, un peu moins de téléphone.",
      proposer: "Je vous montre comment d’autres commerces ont soulagé leur téléphone avec une page de commande simple. Vingt minutes, mardi ou jeudi après-midi ?",
    },
  ],

  proofs: [
    "En général, quand on ne connaît pas le quartier, on tape « boulangerie » dans Google Maps avant de se déplacer : touristes, curistes, nouveaux habitants.",
    "Sur une fiche Google, les gens choisissent avec les yeux : des photos récentes de la vitrine et des pâtisseries donnent beaucoup plus envie qu’une photo de devanture.",
    "Les clients contents laissent rarement un avis d’eux-mêmes, les mécontents si. Demander au bon moment, c’est ce qui rééquilibre une note.",
    "Répondre aux avis, même en deux lignes, montre qu’il y a quelqu’un derrière le comptoir. C’est ce que regardent souvent les nouveaux clients.",
    "Des horaires à jour, jours fériés et congés compris, c’est la correction la plus simple et celle qui évite le plus d’avis négatifs.",
    "Une carte de fidélité dans le téléphone ne se perd pas et ne finit pas dans la machine à laver comme le carton.",
    "Une commande de gâteau prise par écrit, c’est moins d’erreurs de date, de prénom ou de nombre de parts que sur un carnet en plein rush.",
  ],

  buyingSignals: [
    "Elle sort son propre téléphone pour regarder sa fiche Google avec vous.",
    "Il vous raconte spontanément un avis négatif qui l’a touché, ou un client qui a trouvé porte close.",
    "Le patron sort du fournil pour écouter la conversation.",
    "Question : « Et moi, ça me prendrait combien de temps par semaine ? »",
    "« Et pour les commandes de gâteaux, vous pourriez faire quoi ? »",
    "Elle parle d’un projet : reprise récente, travaux de la boutique, nouveau vendeur, second point de vente.",
    "Il demande si vous travaillez déjà avec d’autres boulangeries du coin.",
    "Elle évoque la saison à préparer, les galettes ou les bûches à venir.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Facebook",
      "Instagram",
      "PagesJaunes",
      "Site internet",
      "Application anti-gaspillage (Too Good To Go)",
      "TripAdvisor",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, et les horaires sont-ils justes (jour de fermeture hebdomadaire, congés annuels, jours fériés) ?",
      "Combien d’avis, quelle note, de quand date le dernier avis, et le gérant y répond-il ?",
      "Que disent les avis négatifs : attente, accueil, porte close, prix, qualité ?",
      "Les photos sont-elles récentes, montrent-elles les produits ou seulement la devanture, et sont-elles publiées par le propriétaire ou par des clients ?",
      "Sur la recherche « boulangerie {ville} », où sort {commerce} par rapport aux trois boulangeries les plus proches ?",
      "Y a-t-il une page Facebook ou Instagram, et de quand date la dernière publication ?",
      "Existe-t-il un site internet, est-il lisible sur téléphone, et permet-il de commander un gâteau ?",
      "Y a-t-il un titre, un label ou un concours à valoriser (artisan boulanger, meilleure baguette, pain bio, spécialité locale comme la tielle) ?",
      "Des avis mentionnent-ils un changement de propriétaire récent ?",
      "Le commerce est-il sur une application anti-gaspillage pour ses invendus ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les boulangeries du Bassin de Thau à être celle qu’on trouve en premier quand quelqu’un tape « boulangerie » sur son téléphone : touristes, curistes, nouveaux voisins. En général, ça se joue sur trois choses simples : des horaires justes, des photos qui donnent faim et des avis récents. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi ou jeudi après-midi ?",

  compliance:
    "Les mots « boulanger » et « boulangerie » sont réservés aux professionnels qui pétrissent, façonnent et cuisent leur pain sur place (loi de 1998) : ne jamais les employer dans un site, une fiche ou une publication pour un dépôt de pain ou un point chaud avec terminal de cuisson. Pour les produits vendus sans emballage, l’information sur les allergènes doit être disponible : sur une carte de gâteaux en ligne, indiquer les allergènes ou préciser où les consulter. Avant de publier une photo où l’on reconnaît un salarié ou un client, demander son accord écrit.",
};

export default sheet;
