import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "comptable",
  name: "Cabinet d’expertise comptable",
  short: "Comptable",
  examples: [
    "expert-comptable indépendant",
    "petit cabinet de 2 à 10 collaborateurs",
    "cabinet spécialisé commerçants et artisans",
    "cabinet orienté professions libérales",
    "cabinet orienté associations et SCI",
  ],
  tagline:
    "Ils croulent sous les pièces manquantes et les relances clients : ce qu’ils achètent, c’est du temps et des dossiers complets, pas de la visibilité.",

  reality: {
    rhythm:
      "L’expert-comptable arrive tôt, souvent vers 8 h, et traite les urgences avant que les téléphones sonnent. La journée alterne rendez-vous clients, révision des dossiers, réponses aux mails et supervision des collaborateurs. Une grande partie du temps part en relances : pièces manquantes, relevés bancaires, factures d’achat, questions de clients qui auraient pu attendre. De janvier à mi-mai, c’est la période fiscale : clôtures au 31 décembre, bilans, liasses, déclarations de revenus, avec des semaines à rallonge et parfois le samedi. De juin à décembre, le rythme redevient soutenable : c’est là qu’on réfléchit à l’organisation du cabinet, aux outils et au recrutement. Le vendredi après-midi est souvent plus calme, et beaucoup de cabinets ferment le week-end.",
    pains: [
      "Les pièces justificatives qui arrivent en vrac, en retard, par mail, par WhatsApp ou dans une boîte à chaussures, avec des relances sans fin.",
      "La période fiscale de janvier à mai, épuisante, avec des collaborateurs sous tension et des erreurs qui guettent.",
      "Le téléphone et les mails de clients qui posent des questions simples (« je peux déduire ça ? », « c’est quand l’échéance de TVA ? ») et coupent la concentration.",
      "La difficulté à recruter et à garder des collaborateurs comptables, ce qui limite la croissance du cabinet.",
      "Des prospects qui ne correspondent pas au cabinet (trop petits, hors zone, activité non suivie) et qui font perdre du temps en premier rendez-vous.",
      "La pression sur les honoraires face aux offres en ligne à bas prix.",
      "La facturation électronique qui arrive et oblige à revoir les process avec chaque client.",
    ],
    clientLoss: [
      "Un créateur d’entreprise cherche un comptable sur Google, trouve un cabinet sans site ou avec un site daté, et va chez le concurrent ou chez un cabinet en ligne.",
      "Les demandes de contact arrivent pendant la période fiscale, personne n’a le temps d’y répondre, et le prospect part ailleurs.",
      "Des clients qui se sentent peu suivis, faute d’échanges en dehors du bilan annuel, et qui changent de cabinet.",
      "Un process de collecte des pièces pénible pour le client, qui finit par trouver plus simple une solution en ligne.",
      "Une fiche Google sans avis ou avec des horaires faux, qui donne l’impression d’un cabinet peu accessible.",
    ],
    seasonality:
      "La saisonnalité est fiscale, pas touristique : de janvier à mi-mai, le cabinet est en apnée (clôtures, bilans, liasses fiscales, déclarations de revenus). De mi-mai à juin, on souffle et on termine les derniers dossiers. De juin à décembre, c’est la période où l’expert-comptable a la tête disponible pour investir dans son cabinet. Sur le Bassin de Thau, beaucoup de clients sont des commerçants, restaurateurs et hébergeurs saisonniers : leur comptabilité suit la saison, avec beaucoup de créations d’entreprise et de questions au printemps, avant l’ouverture. Les étudiants et jeunes créateurs de Montpellier forment aussi une clientèle qui cherche beaucoup sur internet.",
    digitalHabits:
      "La plupart des cabinets ont un logiciel de production comptable et parfois un portail client fourni par l’éditeur, souvent peu utilisé par les clients. Le site internet, quand il existe, est souvent un modèle proposé par un prestataire spécialisé, générique et peu personnalisé. La fiche Google existe mais est rarement travaillée, avec peu d’avis. LinkedIn est utilisé par les experts-comptables les plus jeunes ou les plus orientés développement. La collecte des pièces se fait encore beaucoup par mail et par dépôt physique.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site d’image sobre et clair, qui dit tout de suite qui vous accompagnez, dans quelle zone, et comment ça se passe. Un créateur d’entreprise qui vous cherche doit comprendre en dix secondes s’il est au bon endroit.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Un assistant qui pré-qualifie les demandes à votre place : type d’activité, forme juridique, chiffre d’affaires approximatif, besoin. Vous ne prenez en rendez-vous que les dossiers qui correspondent à votre cabinet, et il répond aussi aux questions pratiques des clients sur les échéances.",
      },
      {
        offer: "logiciel",
        pitch:
          "Un outil de collecte des pièces taillé pour vos clients : ils prennent la facture en photo, elle arrive au bon endroit, et les relances partent toutes seules. Moins de relances, des dossiers complets avant la période fiscale.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je vous propose un audit gratuit de vingt minutes : ce que voit un créateur d’entreprise qui cherche un comptable à {ville}, et où vous vous situez par rapport aux autres cabinets.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Beaucoup de créateurs tapent « expert-comptable » et le nom de leur ville sur Google. Une fiche complète, avec vos spécialités, vos horaires et quelques avis, c’est souvent ce qui décide du premier appel.",
      },
    ],
    upsell:
      "Après le site ou la fiche Google : l’agent IA de pré-qualification branché sur le formulaire de contact, puis le logiciel de collecte de pièces avec relances automatiques, idéalement livré à l’automne pour être rodé avant la période fiscale. Pour les cabinets qui veulent se développer, une présence LinkedIn régulière peut suivre.",
  },

  timing: {
    best: [
      {
        label: "Début de matinée",
        days: [1, 2, 3, 4, 5],
        from: "09:00",
        to: "10:00",
        why: "L’expert-comptable est arrivé, a traité ses urgences, et les rendez-vous clients n’ont pas encore commencé.",
      },
      {
        label: "Fin de journée",
        days: [1, 2, 3, 4],
        from: "17:00",
        to: "18:00",
        why: "Les collaborateurs partent, le téléphone se calme, et le dirigeant est plus disponible pour parler de l’organisation du cabinet.",
      },
      {
        label: "Vendredi en début d’après-midi",
        days: [5],
        from: "14:00",
        to: "15:30",
        why: "Souvent plus calme en fin de semaine, hors période fiscale.",
      },
    ],
    avoid: [
      {
        label: "Période fiscale (janvier à mi-mai)",
        from: "08:00",
        to: "19:00",
        why: "En plein rush des bilans et des déclarations, toute sollicitation est perçue comme une gêne : ne prospectez pas du tout sur cette période.",
      },
      {
        label: "Lundi matin",
        days: [1],
        from: "08:00",
        to: "11:00",
        why: "Traitement des mails du week-end, réunion d’équipe, planification de la semaine.",
      },
      {
        label: "Pause déjeuner",
        from: "12:00",
        to: "14:00",
        why: "Le cabinet est souvent fermé ou en accueil réduit, et c’est un moment de rendez-vous clients au restaurant.",
      },
    ],
    usuallyClosed: [0, 6],
    phoneNote:
      "Appelez le standard du cabinet : vous tomberez presque toujours sur une assistante ou une secrétaire. Soyez clair sur l’objet (l’organisation du cabinet, la collecte des pièces, les demandes de nouveaux clients), jamais évasif. Demandez l’expert-comptable associé par son nom, trouvé sur l’annuaire de l’Ordre ou sur le site.",
    seasonNote:
      "Ne prospectez jamais de janvier à mi-mai : c’est la période fiscale, et vous seriez mal reçu à coup sûr. La fenêtre idéale va de juin à décembre. Septembre-octobre est le meilleur moment : le cabinet a digéré l’été, et il reste le temps de mettre en place un outil de collecte avant les clôtures. En décembre, on peut encore prendre un rendez-vous pour juin, mais pas lancer un projet.",
  },

  scripts: {
    physique: {
      id: "comptable-physique",
      title: "Visite au cabinet (juin à décembre)",
      channel: "physique",
      duration: "3 à 5 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Se présenter à l’accueil avec respect du cadre professionnel et identifier l’associé ou le titulaire du cabinet.",
          lines: [
            "Bonjour, {prenom}, de MJAGENCY, une agence web ici à Sète. Je n’ai pas de rendez-vous, je passais pour me présenter.",
            "Je souhaiterais échanger deux minutes avec {dirigeant}, ou l’expert-comptable associé, s’il est disponible.",
            "S’il est en rendez-vous, aucun problème : je vous laisse ma carte et je le rappellerai.",
          ],
          tip: "Tenue soignée, ton posé. Un cabinet comptable est un lieu de confidentialité : ne regardez pas les dossiers sur le bureau, ne parlez pas fort si des clients attendent.",
          branches: [
            {
              if: "L’assistante vous dit qu’il est occupé",
              then: "Je comprends tout à fait. Quel serait le meilleur moment pour l’appeler, plutôt en début de matinée ou en fin de journée ? Et je peux avoir son adresse mail pour lui envoyer un mot avant ?",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Parler de son problème à lui (temps, pièces, prospects), pas de marketing.",
          lines: [
            "On aide les cabinets comptables à gagner du temps sur deux choses : la collecte des pièces clients et le tri des nouvelles demandes.",
            "Et à être trouvés par les créateurs d’entreprise qui cherchent un comptable sur Google.",
          ],
          tip: "Un expert-comptable raisonne en temps et en rentabilité. Évitez les mots « visibilité » ou « marketing », parlez d’organisation et de dossiers complets.",
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer que vous avez regardé le cabinet en ligne, avec un constat factuel.",
          lines: [
            "J’ai regardé le cabinet sur Google avant de venir. Quand je tape « expert-comptable {ville} », vous n’apparaissez pas dans les trois premiers.",
            "Et sur votre site, on ne voit pas vraiment quel type de clients vous accompagnez : commerçants, professions libérales, associations ?",
            "Pour quelqu’un qui crée son entreprise, c’est souvent ce qu’il cherche en premier.",
          ],
          tip: "Un seul constat factuel, vérifiable sur son téléphone. Un analytique respecte les faits, pas les impressions.",
          branches: [
            {
              if: "Il répond qu’il ne cherche pas de nouveaux clients",
              then: "C’est une bonne situation. Dans ce cas, c’est plutôt le temps passé sur les relances de pièces qui pourrait vous intéresser : ça, tous les cabinets le vivent.",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de ce qui lui coûte le plus de temps.",
          lines: [
            "Aujourd’hui, vos clients vous envoient leurs pièces comment : mail, portail, dépôt au cabinet ?",
            "Et pendant la période fiscale, les relances pour pièces manquantes, ça vous prend combien de temps à vous et à l’équipe ?",
          ],
          tip: "Laissez-le détailler. S’il parle de ses collaborateurs débordés ou de clients qui envoient tout en mars, vous tenez le vrai sujet.",
          branches: [
            {
              if: "Il dit qu’il a déjà un portail client",
              then: "Et vos clients l’utilisent vraiment ? C’est souvent là que ça coince : le portail existe, mais les commerçants préfèrent envoyer une photo par WhatsApp.",
            },
            {
              if: "Il parle des prospects qui ne correspondent pas",
              then: "Combien de premiers rendez-vous, à peu près, n’aboutissent pas parce que le dossier ne colle pas au cabinet ? C’est exactement ce qu’un assistant de pré-qualification peut trier en amont.",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Obtenir un rendez-vous de vingt minutes, de préférence en dehors des heures de production.",
          lines: [
            "Je vous propose un échange de vingt minutes, sans engagement, où je vous montre concrètement comment d’autres cabinets organisent la collecte des pièces, et ce que voit un créateur qui vous cherche en ligne.",
            "Mardi à 9 h ou jeudi à 17 h 15, qu’est-ce qui vous convient le mieux ?",
            "Je vous laisse ma carte, et je vous confirme par mail.",
          ],
          tip: "Ne parlez pas de prix. Si c’est en novembre ou décembre, proposez de caler le projet pour qu’il soit prêt avant janvier, ou de reporter à juin : il appréciera que vous respectiez sa période fiscale.",
          branches: [
            {
              if: "Il dit qu’il verra après la période fiscale",
              then: "C’est tout à fait logique. Je vous propose de noter dès maintenant un rendez-vous en juin, mardi 3 ou jeudi 5 par exemple, et je vous envoie une confirmation la semaine d’avant.",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "comptable-telephone",
      title: "Appel au cabinet (juin à décembre)",
      channel: "telephone",
      duration: "2 à 4 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et professionnellement.",
          lines: [
            "Bonjour, {prenom}, de MJAGENCY, une agence web basée à Sète.",
            "Je souhaiterais parler à {dirigeant}, s’il vous plaît.",
          ],
          tip: "Ton posé, débit calme. Un cabinet reçoit beaucoup d’appels commerciaux : la clarté vous distingue.",
        },
        {
          id: "barrage",
          title: "Passer le secrétariat",
          goal: "Donner un objet précis et crédible pour être transféré, ou obtenir le bon créneau.",
          lines: [
            "C’est au sujet de l’organisation de la collecte des pièces clients et des demandes de nouveaux clients qui arrivent par internet.",
            "Ce n’est pas urgent : s’il est en rendez-vous, quel est le meilleur moment pour le joindre, plutôt 9 h ou en fin de journée ?",
            "Et vous, vous êtes sans doute celle qui gère une partie des relances de pièces, non ?",
          ],
          tip: "L’assistante vit les relances au quotidien : si elle se reconnaît dans le problème, elle deviendra votre meilleure alliée pour obtenir le rendez-vous.",
          branches: [
            {
              if: "On vous demande d’envoyer un mail",
              then: "Bien sûr. À quelle adresse, et à l’attention de qui ? Je mets en objet « collecte des pièces clients », et je rappelle jeudi pour savoir s’il a eu le temps de le lire.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison d’écouter.",
          lines: [
            "Merci de me prendre. On aide les cabinets comptables à gagner du temps sur les relances de pièces et sur le tri des nouvelles demandes.",
            "Je vous appelle maintenant, en dehors de la période fiscale, parce que c’est le moment où l’on peut mettre quelque chose en place tranquillement.",
          ],
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Deux questions pour qualifier le besoin principal.",
          lines: [
            "Aujourd’hui, ce qui vous prend le plus de temps, c’est plutôt les relances de pièces, ou les demandes de prospects qui ne correspondent pas au cabinet ?",
            "Et vos clients passent par un portail, ou tout arrive par mail ?",
          ],
          branches: [
            {
              if: "Il demande le prix",
              then: "Ça dépend vraiment de votre fonctionnement actuel, je préfère ne pas vous donner un chiffre au hasard. C’est justement l’objet du rendez-vous : on regarde ensemble, et je vous fais une proposition chiffrée ensuite.",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un créneau précis de vingt minutes.",
          lines: [
            "Je vous propose vingt minutes au cabinet, ou en visio si vous préférez. Mardi à 9 h ou jeudi à 17 h 15, qu’est-ce qui vous arrange ?",
          ],
          tip: "Jamais de prix au téléphone. Vous vendez vingt minutes de son temps, et vous le respectez.",
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous.",
          lines: [
            "C’est noté pour jeudi à 17 h 15. Je vous envoie une invitation par mail avec mes coordonnées.",
            "Si vous pouvez penser à deux ou trois exemples de clients qui vous envoient leurs pièces au dernier moment, ça nous aidera à être concrets.",
            "Merci, bonne fin de journée.",
          ],
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Comment vos clients vous transmettent-ils leurs pièces aujourd’hui, et à quel rythme ?",
      why: "Comprendre le process de collecte et repérer les frictions.",
    },
    {
      type: "S",
      question: "D’où viennent vos nouveaux clients aujourd’hui : recommandation, banque, Google, partenaires ?",
      why: "Mesurer la part du digital dans l’acquisition et le potentiel de progression.",
    },
    {
      type: "P",
      question: "Pendant la période fiscale, combien de temps passez-vous, vous et l’équipe, à relancer des pièces manquantes ?",
      why: "Faire émerger le coût caché des relances.",
    },
    {
      type: "P",
      question: "Il vous arrive de passer un premier rendez-vous avec un prospect qui, finalement, ne correspond pas au cabinet ?",
      why: "Mettre le doigt sur le temps perdu en rendez-vous non qualifiés.",
    },
    {
      type: "I",
      question: "Quand les pièces arrivent en retard, qu’est-ce que ça provoque sur les délais, sur l’équipe, et sur la relation avec le client ?",
      why: "Relier le problème de collecte à la fatigue de l’équipe et au risque de perdre des clients.",
    },
    {
      type: "I",
      question: "Si vous ne pouvez pas recruter l’an prochain, comment le cabinet absorbe-t-il les nouveaux dossiers ?",
      why: "Faire le lien entre gain de temps et capacité de croissance.",
    },
    {
      type: "N",
      question: "Si vos dossiers étaient complets fin février au lieu de fin avril, qu’est-ce que ça changerait pour vous et vos collaborateurs ?",
      why: "Le laisser formuler lui-même le bénéfice d’un outil de collecte.",
    },
  ],

  objections: [
    {
      id: "recommandation",
      objection: "Mes clients viennent par recommandation, je n’ai pas besoin d’internet.",
      hidden: "Image du métier fondée sur la confiance, méfiance envers tout ce qui ressemble à de la publicité.",
      accueillir: "C’est le meilleur canal pour un cabinet, la confiance ne s’achète pas.",
      questionner: "Et quand quelqu’un vous recommande, qu’est-ce que fait la personne recommandée avant de vous appeler ?",
      recadrer: "En général, elle tape votre nom sur Google pour vérifier. Si elle tombe sur un site daté ou une fiche vide, la recommandation perd un peu de sa force. Le site ne remplace pas le bouche-à-oreille, il le confirme.",
      proposer: "Je vous propose de regarder ensemble, en vingt minutes, ce que voit quelqu’un à qui on vient de vous recommander.",
    },
    {
      id: "deja-quelquun",
      objection: "On a déjà un prestataire pour le site, fourni avec notre logiciel.",
      hidden: "Solution par défaut, jamais remise en question, pas envie de changer.",
      accueillir: "C’est pratique d’avoir un site fourni avec l’outil, beaucoup de cabinets fonctionnent comme ça.",
      questionner: "Et ce site, il dit clairement quels clients vous accompagnez et qu’est-ce qui vous différencie des autres cabinets de {ville} ?",
      recadrer: "Ces sites sont souvent les mêmes d’un cabinet à l’autre. Ce qu’on propose, c’est surtout de vous faire gagner du temps sur la collecte des pièces et le tri des demandes : ça, votre prestataire de site ne le fait pas.",
      proposer: "On peut commencer par l’audit gratuit, sans rien toucher à l’existant.",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps de m’occuper de ça.",
      hidden: "Surcharge chronique, peur d’un projet chronophage.",
      accueillir: "Je le comprends parfaitement, c’est même pour ça que je vous appelle maintenant et pas en mars.",
      questionner: "Qu’est-ce qui vous prend le plus de temps dans une semaine qui ne devrait pas vous le prendre ?",
      recadrer: "Le projet est justement conçu pour vous rendre du temps. De votre côté, c’est un atelier au départ, puis des validations : c’est nous qui faisons le travail.",
      proposer: "Vingt minutes pour voir si ça vaut le coup : mardi à 9 h ou jeudi à 17 h 15 ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour un cabinet de notre taille.",
      hidden: "Réflexe de calcul de rentabilité, veut voir le retour sur investissement.",
      accueillir: "Vous avez raison de le regarder comme un investissement, c’est votre métier.",
      questionner: "Combien d’heures par an, à votre avis, votre équipe passe à relancer des pièces ou à traiter des demandes qui n’aboutissent pas ?",
      recadrer: "Si l’outil rend quelques heures par semaine en période fiscale, le calcul se fait assez vite. Et on peut étaler le paiement pour que ça reste léger en trésorerie.",
      proposer: "Faisons le calcul ensemble pendant le rendez-vous. Si ce n’est pas rentable pour vous, je vous le dirai.",
    },
    {
      id: "neveu",
      objection: "Mon fils fait des études d’informatique, il peut nous faire quelque chose.",
      hidden: "Envie d’économiser et de faire plaisir à la famille.",
      accueillir: "C’est une bonne idée de l’impliquer, et c’est formateur pour lui.",
      questionner: "Il pourra aussi assurer la maintenance, la sécurité des données clients et les évolutions dans deux ou trois ans ?",
      recadrer: "Pour un cabinet, un outil qui manipule des données financières de clients doit être hébergé et sauvegardé proprement. C’est surtout la durée et la sécurité qui comptent.",
      proposer: "Faites l’audit avec nous : vous aurez un cahier des charges clair, qu’il pourra utiliser s’il s’en occupe.",
    },
    {
      id: "pas-besoin",
      objection: "Un site, ça ne sert à rien dans notre métier. LinkedIn me suffit.",
      hidden: "Pense que le site n’est qu’une plaquette, n’a jamais relié site et gain de temps.",
      accueillir: "LinkedIn, c’est un bon outil pour le réseau, vous avez raison.",
      questionner: "Quand un créateur d’entreprise de {ville} cherche un comptable, il passe par LinkedIn ou par Google, à votre avis ?",
      recadrer: "Le site n’est pas une plaquette : c’est l’endroit où le prospect se pré-qualifie tout seul, où le client trouve ses échéances, et d’où partent les pièces. C’est un outil de production autant qu’une vitrine.",
      proposer: "Je vous montre en vingt minutes à quoi ça ressemble chez un cabinet de votre taille.",
    },
    {
      id: "bouche-a-oreille",
      objection: "Le bouche-à-oreille, ça marche très bien, on est déjà plein.",
      hidden: "Cabinet à capacité maximale, pas de souhait de croissance.",
      accueillir: "Tant mieux, c’est une situation confortable.",
      questionner: "Et si vous êtes plein, c’est parce que vous avez assez de clients, ou parce que l’équipe ne peut pas en prendre plus ?",
      recadrer: "Si c’est la capacité qui bloque, le sujet n’est pas d’avoir plus de clients, c’est de gagner du temps sur chaque dossier. C’est là qu’un outil de collecte et un assistant qui répond aux questions pratiques changent les choses.",
      proposer: "On peut en parler vingt minutes, sans rien vendre sur la visibilité. Mardi à 9 h ou jeudi à 17 h 15 ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi après la période fiscale.",
      hidden: "Vraie indisponibilité, ou façon polie de repousser indéfiniment.",
      accueillir: "Bien sûr, c’est tout à fait légitime, je ne veux surtout pas vous déranger en pleine période.",
      questionner: "Pour être sûr de vous rappeler au bon moment, c’est plutôt début juin, ou après les congés de juillet ?",
      recadrer: "Si on veut que l’outil soit prêt pour la prochaine période fiscale, le bon moment pour en parler, c’est entre juin et septembre.",
      proposer: "Je vous propose de fixer dès maintenant un créneau en juin : mardi 9 h ou jeudi 17 h 15 la première semaine ? Je vous enverrai un rappel la semaine d’avant.",
    },
  ],

  proofs: [
    "En général, une personne recommandée vérifie le cabinet sur Google avant d’appeler : le site et la fiche confirment ou affaiblissent la recommandation.",
    "Les créateurs d’entreprise, surtout les plus jeunes, cherchent souvent leur comptable en ligne et comparent plusieurs cabinets avant de prendre contact.",
    "Un outil de collecte simple, utilisable depuis le téléphone, est en général bien mieux adopté par les commerçants qu’un portail complexe.",
    "Pré-qualifier les demandes en amont évite une bonne partie des premiers rendez-vous qui ne débouchent sur rien.",
    "Des relances automatiques et régulières donnent souvent de meilleurs résultats que des relances manuelles groupées en mars.",
    "Répondre aux questions simples des clients (échéances, documents à fournir) sans mobiliser un collaborateur libère du temps pour la production.",
  ],

  buyingSignals: [
    "Il parle spontanément de ses collaborateurs débordés ou d’un départ récent.",
    "Il vous demande si l’outil de collecte peut s’intégrer à son logiciel de production.",
    "Il sort des chiffres : nombre de dossiers, nombre de clients qui envoient tout en retard.",
    "Il évoque la facturation électronique et ce qu’elle va changer pour ses clients.",
    "Il demande combien de temps il faut pour être prêt avant la prochaine clôture.",
    "Il appelle son associé ou son assistante pour qu’ils assistent à la discussion.",
    "Il dit vouloir développer une clientèle précise (professions libérales, restaurateurs, créateurs).",
    "Il pose des questions précises sur l’hébergement et la sécurité des données clients.",
  ],

  research: {
    platforms: [
      "Google (fiche établissement et résultats « expert-comptable {ville} »)",
      "Annuaire de l’Ordre des experts-comptables",
      "LinkedIn (cabinet et associés)",
      "Site internet du cabinet",
      "PagesJaunes",
      "Societe.com ou Pappers (taille, date de création, dirigeants)",
    ],
    questions: [
      "Le cabinet est-il bien inscrit à l’Ordre des experts-comptables, et qui en sont les associés ou le titulaire ?",
      "Combien de personnes travaillent au cabinet (estimation via LinkedIn, le site ou les données légales) ?",
      "Le site indique-t-il clairement les types de clients accompagnés et les spécialités du cabinet ?",
      "Le site propose-t-il un formulaire de contact, un espace client, une prise de rendez-vous en ligne ?",
      "Le cabinet apparaît-il dans les premiers résultats Google pour « expert-comptable » suivi du nom de la ville ?",
      "La fiche Google est-elle complète (horaires, photos, catégorie, services) et combien d’avis a-t-elle ?",
      "Les associés sont-ils actifs sur LinkedIn, et sur quels sujets ?",
      "Quel logiciel de production ou portail client le cabinet semble-t-il utiliser (mention sur le site, lien espace client) ?",
      "Le cabinet recrute-t-il en ce moment (offres d’emploi en ligne) ?",
      "Quels sont les deux ou trois cabinets concurrents les mieux positionnés dans la même ville ?",
    ],
  },

  pitch30s:
    "Bonjour, {prenom}, de MJAGENCY, une agence web à Sète. On aide les cabinets comptables du Bassin de Thau à gagner du temps sur ce qui les épuise en période fiscale : les pièces qui arrivent en retard et les demandes de nouveaux clients qui ne correspondent pas au cabinet. Concrètement, un outil où vos clients envoient leurs pièces en photo avec relances automatiques, et un assistant qui trie les demandes avant qu’elles arrivent sur votre bureau. Je vous propose vingt minutes, en dehors de votre période fiscale, pour voir si ça a du sens chez vous.",

  compliance:
    "Les experts-comptables peuvent communiquer et faire connaître leur cabinet : l’Ordre des experts-comptables autorise la publicité et la communication, à condition qu’elles restent loyales, dignes et respectueuses du secret professionnel. On reste donc sur de l’information : spécialités, zone, types de clients accompagnés, façon de travailler. Pas de promesse de résultat fiscal, pas de dénigrement des confrères, pas de comparaison agressive avec d’autres cabinets, et pas de démarchage abusif ou insistant de la part du cabinet. On ne cite jamais un client ou un dossier sans son accord écrit. Le site doit comporter les mentions obligatoires : dénomination du cabinet, inscription au tableau de l’Ordre et région de rattachement, forme juridique, coordonnées, assurance responsabilité civile professionnelle, ainsi que les mentions légales classiques et une politique de confidentialité. Pour l’outil de collecte de pièces et l’agent IA : données financières et personnelles des clients, donc hébergement en Europe, accès sécurisé, sauvegardes, conformité RGPD, et l’agent ne donne jamais de conseil fiscal personnalisé, il renvoie vers l’expert-comptable. En cas de doute sur un contenu, on invite le cabinet à le valider avec son Conseil régional de l’Ordre avant la mise en ligne.",
};

export default sheet;
