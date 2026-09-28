import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "food-truck",
  name: "Food-truck",
  short: "Food-truck",
  examples: [
    "food-truck burger ou sandwich maison",
    "camion pizza au feu de bois",
    "food-truck de spécialités locales (tielles, fruits de mer, poisson)",
    "cuisine du monde (tacos, bao, poke, crêpes, fish and chips)",
    "food-truck de zone d’activité, présent le midi en semaine",
    "camion de plage ou de festival, surtout actif l’été",
  ],
  tagline:
    "Un restaurant qui change d’adresse tous les jours : si les clients ne savent pas où il est aujourd’hui, ils mangent ailleurs.",

  reality: {
    rhythm:
      "La journée commence tôt par les courses (grossiste, marché, boucher) puis la préparation au laboratoire ou dans le camion, de 8 h à 10 h 30 environ. Départ vers l’emplacement du jour, installation entre 10 h 30 et 11 h 15 : branchement, mise en chauffe, ardoise. Service du midi de 11 h 30 à 14 h, avec un vrai coup de feu de 12 h à 13 h 15, surtout en zone d’activité où les gens n’ont que 45 minutes. Rangement, nettoyage, retour au labo vers 14 h 30 - 15 h : c’est le moment où le patron souffle, fait ses comptes et répond aux messages. Pour ceux qui font le soir, nouvelle mise en place vers 17 h 30 et service de 18 h 30 à 21 h 30. Sur la semaine, un emplacement par jour, souvent fixe d’une semaine à l’autre : lundi une zone d’activité, mardi un marché de village, mercredi un parking d’entreprise, etc., chacun avec son permis de stationnement municipal ou son accord privé. Le week-end, ce sont les marchés, les événements et les privatisations (mariages, anniversaires, comités d’entreprise). Très souvent le patron est seul ou en couple, avec un saisonnier l’été, et il gère tout lui-même : cuisine, caisse, planning, papiers, réseaux sociaux le soir sur son téléphone.",
    pains: [
      "Les clients qui ne savent pas où il est : « vous êtes où demain ? » revient sans arrêt en message et en commentaire, et il répond un par un, le soir.",
      "Obtenir et garder de bons emplacements : dossiers de permis de stationnement en mairie, places limitées, concurrence avec les autres camions sur les mêmes zones.",
      "La météo qui fait tout : un midi de pluie ou de mistral, la zone d’activité se vide et la marchandise préparée est perdue.",
      "La file d’attente au coup de feu : des gens pressés qui repartent en voyant dix personnes devant eux, et le patron qui court seul entre la plaque et la caisse.",
      "Les coûts qui montent (matière première, gaz, carburant, entretien du camion) sur un ticket moyen qu’on n’ose pas augmenter.",
      "Des journées très longues, six jours sur sept l’été, avec l’administratif et les réseaux sociaux qui passent après tout le reste.",
      "La dépendance à une ou deux personnes : si le patron est malade ou si le camion tombe en panne, il n’y a pas de chiffre du tout.",
    ],
    clientLoss: [
      "Le client qui l’a aimé au marché ne sait pas où le retrouver la semaine suivante, et finit par l’oublier.",
      "Le touriste ou le salarié qui cherche « food truck » ou « manger à emporter » sur Google Maps ne le trouve pas, ou trouve une fiche avec l’adresse du domicile et des horaires faux.",
      "Les gens pressés du midi repartent devant la file, faute de pouvoir précommander et récupérer à l’heure dite.",
      "Un changement d’emplacement ou une annulation pour cause de météo annoncé trop tard, ou seulement en story : les habitués se déplacent pour rien.",
      "Les organisateurs de mariages, d’anniversaires ou de séminaires choisissent le camion qui a de belles photos, des avis et un moyen simple de le contacter.",
      "Pas de carte de fidélité, ou un carton qu’on oublie : rien ne pousse le client à revenir plutôt que d’essayer le camion d’à côté.",
    ],
    seasonality:
      "Sur le littoral, l’été est la saison qui fait l’année : parkings de plage à Frontignan ou Marseillan, soirées en bord d’étang, marchés nocturnes et festivals à Sète, jusqu’aux fêtes de la Saint-Louis fin août. De juin à fin août, le patron enchaîne midi et soir, parfois sept jours sur sept : aucune chance d’avoir son attention. À la rentrée, il revient sur ses emplacements réguliers de semaine (zones d’activité, marchés de village, parkings d’entreprise), et la clientèle devient locale et fidèle. L’hiver est calme sur la côte : certains réduisent à trois ou quatre jours, d’autres ferment un ou deux mois, souvent en janvier. Le printemps est le moment où tout se prépare : demandes d’emplacements d’été, candidatures aux festivals et aux marchés nocturnes, et à Sète les années paires, l’Escale à Sète au printemps attire beaucoup de monde sur les quais. Les meilleures périodes pour prospecter : mi-septembre à fin novembre (bilan de saison, retour au rythme de semaine) et février à avril (préparation de l’été).",
    digitalHabits:
      "Instagram et Facebook sont souvent le seul outil : une story ou une publication « aujourd’hui on est à… » faite en vitesse avant le service, quand il y pense. Le planning de la semaine est posté en image, parfois épinglé, rarement à jour. La fiche Google existe dans un cas sur deux, souvent avec l’adresse du domicile ou du labo et des horaires fixes qui ne correspondent à rien. Pas de site, ou un site fait par un proche jamais mis à jour. Quelques-uns sont sur Uber Eats pour les soirs, ou référencés sur une application de food-trucks ou l’agenda d’un marché. Les précommandes, quand elles existent, passent par messages privés ou SMS. Les avis ne sont presque jamais demandés. Le patron gère tout ça seul, le soir, depuis son téléphone.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Une seule page, simple, avec votre planning de la semaine : lundi ici, mardi là, et le message du jour si vous annulez pour la pluie. Les gens la mettent en favori, et ils peuvent précommander pour venir chercher sans faire la queue.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Vous, vous êtes derrière la plaque. Nous, on prépare vos publications de la semaine, les photos qui donnent faim et les stories « aujourd’hui on est à… », pour que vos clients vous suivent d’un emplacement à l’autre.",
      },
      {
        offer: "fidelite",
        pitch:
          "La carte de fidélité est dans le téléphone du client, elle le suit partout. Et vous pouvez lui envoyer un petit message : « ce midi on est à la zone de Balaruc » ou « nouvelle recette vendredi au marché ».",
      },
    ],
    entry: [
      {
        offer: "fiche-google",
        pitch:
          "Quand quelqu’un cherche où manger autour de lui, il regarde Google Maps. On met votre fiche au propre : pas l’adresse de chez vous, des horaires qui ne trompent personne, des photos de vos plats et un lien vers votre planning.",
      },
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée sur le comptoir du camion : le client qui attend sa commande approche son téléphone et laisse un avis en trente secondes. C’est le moment parfait, il a faim et il sent déjà l’odeur.",
      },
    ],
    upsell:
      "Après la fiche Google et la carte d’avis, la suite logique est la page planning avec précommande, à lancer avant la saison. Ensuite, la carte de fidélité digitale pour garder les habitués d’un emplacement à l’autre, puis la gestion des réseaux sociaux au printemps et pendant l’été, quand le patron n’a plus une minute. Pour ceux qui font beaucoup de privatisations, un formulaire de demande de devis pour les mariages et les entreprises, et pour les soirs, la précommande avec paiement en ligne (site e-commerce) pour ne plus dépendre d’une plateforme qui prend une commission.",
  },

  timing: {
    best: [
      {
        label: "Après le service du midi",
        days: [2, 3, 4, 5],
        from: "14:30",
        to: "16:30",
        why: "Le coup de feu est fini, le camion se range ou le patron est rentré au labo : il souffle et peut parler en nettoyant.",
      },
      {
        label: "Avant l’installation",
        days: [2, 3, 4, 5],
        from: "09:30",
        to: "11:00",
        why: "Il prépare ou arrive sur l’emplacement : disponible quelques minutes, mais restez bref et partez avant la mise en chauffe.",
      },
      {
        label: "Téléphone en début de matinée",
        days: [2, 3, 4],
        from: "08:30",
        to: "09:30",
        why: "Avant d’attaquer la préparation, souvent entre deux courses : il décroche plus facilement et a l’esprit libre.",
      },
    ],
    avoid: [
      {
        label: "Mise en place et service du midi",
        from: "11:00",
        to: "14:00",
        why: "Installation puis coup de feu : il est seul entre la plaque et la caisse, personne ne vous écoutera.",
      },
      {
        label: "Mise en place et service du soir",
        from: "17:30",
        to: "21:30",
        why: "Deuxième installation de la journée puis service jusqu’à la nuit : même règle que le midi.",
      },
      {
        label: "Week-end",
        days: [0, 6],
        from: "08:00",
        to: "22:00",
        why: "Marchés, événements et privatisations : ce sont souvent les plus grosses journées de la semaine.",
      },
    ],
    usuallyClosed: [1],
    phoneNote:
      "Presque toujours, le numéro est le portable du patron : appelez entre 8 h 30 et 9 h 30, ou entre 15 h et 16 h 30, jamais pendant un service. S’il ne décroche pas, ne laissez pas de long message : un SMS court avec votre prénom et « au sujet de votre fiche Google et de votre planning » fonctionne mieux. Avant de vous déplacer, regardez son Instagram ou son Facebook pour savoir où il est ce jour-là, et vérifiez qu’il n’a pas annulé pour la météo.",
    seasonNote:
      "Prospectez de mi-septembre à fin novembre et de février à avril, quand il prépare ses emplacements d’été. Oubliez juin, juillet et août jusqu’à la Saint-Louis, ainsi que les jours de pluie ou de gros vent (il annule, ou il est de mauvaise humeur). En janvier, vérifiez qu’il n’est pas en pause d’hiver avant de le chercher.",
  },

  scripts: {
    physique: {
      id: "food-truck-physique",
      title: "Visite au camion",
      channel: "physique",
      duration: "3 à 5 min",
      steps: [
        {
          id: "entree",
          title: "Approche du camion et repérage du décisionnaire",
          goal: "Arriver au bon moment, par la fenêtre de service, et vérifier qu’on parle au patron.",
          lines: [
            "Bonjour ! Vous êtes encore ouvert ? Il vous reste un dessert ou un café ?",
            "Ça sentait bon depuis le parking. C’est vous qui avez monté le camion ?",
            "Je ne veux pas vous retarder dans le rangement. Vous avez deux minutes, ou je repasse sur un autre emplacement ?",
          ],
          tip: "Présentez-vous toujours par la fenêtre de service, jamais par la porte de la cuisine. Si vous arrivez à la fin du service, achetez quelque chose. Si vous arrivez avant l’installation, demandez d’abord si c’est le bon moment.",
          branches: [
            {
              if: "C’est un saisonnier ou un employé",
              then: "Demandez le prénom du patron et sur quel emplacement il sera cette semaine. Laissez votre carte avec un mot : « Passé vous voir pour votre fiche Google et votre planning. {prenom} ».",
            },
            {
              if: "Il est en pleine mise en chauffe",
              then: "« Je vois que vous attaquez, je ne vous embête pas. Vous êtes où jeudi ? Je passe après le service, vers 14 h 30. »",
            },
            {
              if: "C’est le patron ou la patronne",
              then: "Passez à l’accroche. Dans un food-truck, c’est presque toujours la personne derrière la plaque qui décide de tout.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les commerces du coin à être trouvés facilement sur internet.",
            "Je ne viens rien vous vendre maintenant. En venant, j’ai essayé de savoir où vous seriez aujourd’hui, et ça n’a pas été simple. Je vous montre, trente secondes ?",
          ],
          tip: "Ayez déjà ouvert sur votre téléphone sa fiche Google et son dernier post Instagram. Tournez l’écran vers lui, ne lui demandez pas de chercher.",
          branches: [
            {
              if: "« Je n’ai pas le temps, je range »",
              then: "« Pas de souci, je vous laisse ranger. Je peux repasser mardi après le service ou jeudi à 10 h avant votre installation, vous êtes où ces jours-là ? »",
            },
            {
              if: "« Tout le monde sait où je suis »",
              then: "« Vos habitués, sûrement. Je vous montre juste ce que voit quelqu’un qui ne vous connaît pas encore, et vous me direz. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible, sans juger.",
          lines: [
            "Regardez : quand je tape « food truck » ou « manger à emporter » ici, à {ville}, vous n’apparaissez pas, alors que vous êtes juste là.",
            "Et votre fiche Google indique une adresse et des horaires fixes, du lundi au vendredi. Quelqu’un qui s’y fie arrive peut-être devant chez vous, pas devant le camion.",
            "Sur Instagram, votre dernier planning date de trois semaines. Et en dessous, il y a des gens qui demandent « vous êtes où jeudi ? ».",
            "Vos photos, c’est surtout le camion. Alors que votre burger, là, c’est ça qui fait venir.",
          ],
          tip: "Choisissez le constat le plus parlant, pas les quatre. Commencez par un compliment sincère sur ce que vous avez goûté ou vu.",
          branches: [
            {
              if: "Sa présence est déjà très bien tenue",
              then: "Félicitez sincèrement (« Vous êtes un des rares à avoir un planning à jour ») et basculez sur la précommande ou la fidélité.",
            },
            {
              if: "« Ah, je ne savais pas pour Google »",
              then: "« C’est très courant, Google remplit parfois tout seul, et pour un camion qui bouge c’est encore plus piégeux. Ça se règle. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le patron de ce qui l’embête vraiment.",
          lines: [
            "Les « vous êtes où demain ? », vous en recevez combien par semaine, à peu près ?",
            "Au coup de feu de midi, il y a des gens qui repartent en voyant la file ?",
            "Qu’est-ce qui vous prend le plus la tête en ce moment : les emplacements, la météo, ou faire revenir les clients d’une semaine sur l’autre ?",
          ],
          tip: "Une seule question, puis taisez-vous. Il est fatigué après le service : laissez-le parler, c’est souvent là qu’il se livre.",
          branches: [
            {
              if: "Il parle des permis et des emplacements",
              then: "Écoutez, ne promettez rien sur les mairies. Revenez ensuite : « Et une fois sur place, les clients vous trouvent bien ? »",
            },
            {
              if: "Il parle de la file d’attente",
              then: "« C’est exactement ce que règle la précommande : les gens commandent à 11 h, passent à 12 h 15, et vous préparez tranquillement. »",
            },
            {
              if: "Il parle des privatisations",
              then: "« Et les organisateurs de mariages ou d’entreprises, ils vous trouvent comment aujourd’hui ? Ils voient vos photos et vos avis quelque part ? »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose un truc simple : je vous fais un audit gratuit de ce qu’on voit de vous sur internet, et je vous montre les trois choses à corriger en priorité, dont une que vous pouvez faire seul ce soir.",
            "Ça prend vingt minutes, après votre service. Je passe mardi à 14 h 30 sur votre emplacement, ou jeudi à 15 h, qu’est-ce qui vous arrange ?",
            "Je note votre numéro, au cas où vous annuleriez pour la météo ?",
            "Merci, et c’était vraiment bon. Je reviendrai pour autre chose que le travail.",
          ],
          tip: "Proposez des créneaux juste après le service, sur un de ses emplacements : il n’aura pas à se déplacer. Notez le rendez-vous devant lui.",
          branches: [
            {
              if: "« Envoyez-moi ça par message »",
              then: "« Je vous l’apporte, c’est plus parlant avec l’écran sous les yeux. Dites-moi juste où vous êtes mardi ou jeudi. »",
            },
            {
              if: "« Je verrai ça cet hiver »",
              then: "« Justement, cet hiver c’est le bon moment pour préparer l’été. Je passe en février, avant vos demandes d’emplacements ? Je note une date. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et le jour où vous en aurez assez de répondre “vous êtes où demain ?”, vous saurez qui appeler. Bon courage pour le rangement. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "food-truck-telephone",
      title: "Appel au patron du camion",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’il n’est pas en préparation ou en service.",
          lines: [
            "Bonjour, c’est bien {commerce} ? Je suis {prenom}, de MJAGENCY, à Sète.",
            "Je ne vous prends pas en pleine préparation, là ?",
          ],
          tip: "Appelez entre 8 h 30 et 9 h 30 ou entre 15 h et 16 h 30. S’il est au volant, proposez de rappeler plutôt que de parler pendant qu’il conduit.",
          branches: [
            {
              if: "« Si, je suis en train de préparer »",
              then: "« Je vous rappelle cet après-midi vers 15 h 30, après votre service ? » Et rappelez vraiment à 15 h 30.",
            },
            {
              if: "« Je conduis »",
              then: "« Alors surtout on raccroche. Je vous rappelle à quelle heure ? »",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Joindre le patron quand c’est le conjoint, un employé ou la messagerie qui répond.",
          lines: [
            "Je voudrais parler à la personne qui s’occupe du camion, c’est au sujet de sa fiche Google et de son planning d’emplacements.",
            "Vous pouvez me dire son prénom, et quand il est le plus tranquille pour un appel de deux minutes ?",
          ],
          tip: "Sur messagerie, pas de long message. Raccrochez et envoyez un SMS de deux lignes : prénom, agence, sujet, et « je vous rappelle jeudi vers 15 h ».",
          branches: [
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler que sa fiche Google indique des horaires fixes, alors que le camion bouge. Ça peut envoyer des clients au mauvais endroit. »",
            },
            {
              if: "« Il est sur le marché, il ne peut pas »",
              then: "« Bien sûr, je ne vais pas le déranger en plein service. Il finit vers quelle heure, d’habitude ? »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. En préparant mon appel, j’ai cherché où vous trouver cette semaine, et je n’ai trouvé le planning nulle part, ni sur Google ni en haut de votre Instagram.",
            "On aide les commerces du Bassin de Thau à être trouvés facilement, et pour un camion, le plus important c’est que les gens sachent où vous êtes aujourd’hui.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, vous prévenez vos clients de vos emplacements comment : stories, publication, bouche-à-oreille ?",
            "Et quand vous annulez pour la pluie, ils le savent à temps ?",
          ],
          tip: "Deux questions maximum au téléphone. Le reste se fera en face, après un service.",
          branches: [
            {
              if: "« Je fais une story le matin, quand j’y pense »",
              then: "« C’est ce que font presque tous les camions que je vois. Le souci, c’est le “quand j’y pense”. C’est justement là qu’on peut vous soulager. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes après un service, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, après votre service. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux venir mardi à 14 h 30 sur votre emplacement, ou jeudi à 15 h. Vous êtes où ces jours-là ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande : « Ça dépend de ce dont vous avez besoin, c’est justement ce qu’on verra ensemble. »",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, ça dépend vraiment de votre façon de travailler, et je ne veux pas vous dire un chiffre au hasard. Mardi ou jeudi ? »",
            },
            {
              if: "« Je suis sur la route toute la semaine »",
              then: "« Justement, c’est moi qui me déplace. Dites-moi où vous serez, je viens à la fin du service. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et le lieu exact.",
          lines: [
            "Parfait, je note jeudi à 15 h, sur votre emplacement de {ville}. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un SMS de confirmation. S’il pleut et que vous annulez le service, répondez-moi simplement dessus et on décale.",
            "Merci, et bon service ce midi.",
          ],
          tip: "Envoyez le SMS dans les cinq minutes, et vérifiez la météo et ses stories la veille du rendez-vous.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Sur une semaine type, vous êtes sur combien d’emplacements différents, et ils changent souvent ?",
      why: "Comprendre sa tournée, ses emplacements fixes et ce qu’il faut afficher dans un planning.",
    },
    {
      type: "S",
      question: "Aujourd’hui, comment vos clients savent où vous êtes le jour même ?",
      why: "Repérer la story faite en vitesse, le planning jamais à jour, et l’ouverture pour une page planning.",
    },
    {
      type: "P",
      question: "Ça vous arrive d’avoir des habitués qui vous disent « je vous ai cherché la semaine dernière, je ne savais pas où vous étiez » ?",
      why: "Lui faire toucher du doigt les clients perdus entre deux emplacements.",
    },
    {
      type: "P",
      question: "Au coup de feu, entre 12 h et 13 h, il y a des gens qui repartent devant la file ?",
      why: "Faire émerger le manque à gagner lié à l’attente et l’intérêt de la précommande.",
    },
    {
      type: "I",
      question: "Si chaque midi, quelques personnes repartent sans commander, ça représente quoi pour vous sur un mois de zone d’activité ?",
      why: "Lui faire calculer lui-même la perte, sans avancer de chiffre à sa place.",
    },
    {
      type: "I",
      question: "Et les soirs où vous répondez aux messages « vous êtes où demain ? » au lieu de vous reposer, ça vous prend combien de temps ?",
      why: "Faire réaliser le coût en temps et en fatigue d’un planning qui n’est affiché nulle part.",
    },
    {
      type: "N",
      question: "Si vos clients avaient une page avec votre planning à jour, et pouvaient commander à 11 h pour récupérer à 12 h 15, qu’est-ce que ça changerait pour votre service ?",
      why: "Lui faire formuler lui-même le bénéfice de la page planning avec précommande.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui me fait mes publications.",
      hidden: "Souvent un proche ou un ancien prestataire qui publie de temps en temps. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est rare dans les food-trucks d’avoir déjà quelqu’un, c’est une bonne chose.",
      questionner: "Il s’occupe aussi de votre fiche Google et de votre planning ? Et quand vous changez d’emplacement au dernier moment, il est prévenu à temps ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur, ça permet de voir ce qui manque, par exemple une fiche Google qui envoie les gens à une adresse fixe.",
      proposer: "Je vous fais l’audit gratuit, vous le montrez à la personne qui s’en occupe, et elle corrige si elle veut. Mardi 14 h 30 ou jeudi 15 h, après votre service ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je suis seul dans le camion, je fais tout.",
      hidden: "L’épuisement et la peur d’ajouter une tâche de plus à des journées qui commencent à 7 h.",
      accueillir: "Je vois bien, entre les courses, la préparation, le service et le rangement, vos journées sont déjà pleines.",
      questionner: "Les réseaux et les messages, aujourd’hui, vous les faites à quel moment ?",
      recadrer: "C’est justement l’idée : que ça tourne sans vous. Vous nous envoyez votre planning une fois par semaine, et on s’occupe du reste.",
      proposer: "Je vous prends vingt minutes après un service, pas plus, là où vous êtes. Jeudi 15 h, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour moi, un camion ça ne marge pas tant que ça.",
      hidden: "Les coûts qui montent et une trésorerie serrée, surtout en hiver. Et il n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, entre le gaz, le carburant et la marchandise, chaque euro compte.",
      questionner: "Qu’est-ce qui vous paraîtrait raisonnable pour faire revenir vos clients d’une semaine sur l’autre ?",
      recadrer: "On a des solutions qui démarrent petit, au mois, et une partie de l’audit, vous pouvez la faire seul gratuitement. L’idée, c’est que ça se rembourse avec quelques repas de plus par semaine.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous déciderez à tête reposée.",
    },
    {
      id: "un-ami",
      objection: "Un pote m’a dit qu’il me ferait un site.",
      hidden: "L’envie de ne pas dépenser et la confiance dans l’entourage. Souvent, l’ami a promis mais n’a pas commencé.",
      accueillir: "C’est bien d’avoir quelqu’un de confiance autour de vous.",
      questionner: "Il a déjà commencé ? Et le planning, qui le mettra à jour chaque semaine, et le jour où vous annulez pour la pluie ?",
      recadrer: "Faire un site, c’est une chose. Pour un camion, ce qui compte c’est que le planning soit juste tous les jours, et c’est souvent ce qui lâche au bout de quelques semaines.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et si un jour il n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "instagram-suffit",
      objection: "J’ai Instagram et Facebook, je mets une story tous les matins, ça suffit.",
      hidden: "Il a l’impression d’avoir déjà fait sa part du digital, et ses abonnés le lui confirment.",
      accueillir: "C’est très bien, et vos abonnés vous suivent sûrement de près.",
      questionner: "Et quelqu’un qui ne vous suit pas encore, un touriste ou un salarié qui vient d’arriver dans la zone, il tape quoi pour savoir où manger ?",
      recadrer: "Instagram parle à ceux qui vous connaissent déjà, et une story disparaît en vingt-quatre heures. Les nouveaux clients, eux, cherchent en général sur Google Maps, là où ils sont.",
      proposer: "Gardez vos stories, elles marchent. Je vous montre juste ce que voit un nouveau client sur Google, vingt minutes après un service, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Moi, ça marche au bouche-à-oreille, les gens se passent le mot.",
      hidden: "La fierté d’avoir une clientèle fidèle, et l’idée que le digital, c’est pour les gros.",
      accueillir: "Et c’est la meilleure publicité qui soit, vous avez raison d’en être fier.",
      questionner: "Quand un client vous recommande à un collègue, vous savez comment ce collègue fait pour savoir où vous êtes ce jour-là ?",
      recadrer: "En général, il cherche sur son téléphone : votre nom, vos avis, votre emplacement. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tout le monde.",
      proposer: "La carte d’avis posée sur le comptoir du camion, c’est exactement ça : faire parler vos clients contents pendant qu’ils attendent. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi un message.",
      hidden: "Souvent un refus poli. Parfois un vrai manque de temps, il est en pleine préparation.",
      accueillir: "Bien sûr, je ne veux pas vous déranger en pleine préparation.",
      questionner: "Pour ne pas tomber au mauvais moment, vous êtes plus tranquille tôt le matin ou vers 15 h, après le service ?",
      recadrer: "Un message, honnêtement, il va se perdre au milieu des « vous êtes où demain ? ». Ce que j’ai à vous montrer tient sur un écran, en face c’est beaucoup plus clair.",
      proposer: "Je passe jeudi à 15 h sur votre emplacement, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "je-bouge",
      objection: "Je bouge tout le temps, internet ne sert à rien pour moi, les gens me voient passer.",
      hidden: "L’idée qu’internet, c’est pour les commerces avec une adresse fixe. Et souvent, la peur de devoir tenir quelque chose à jour en plus.",
      accueillir: "Je comprends, vous n’avez pas une vitrine qui attend les clients, c’est vous qui allez vers eux.",
      questionner: "Justement, quand vous changez d’endroit, comment vos clients de la veille savent où vous retrouver ?",
      recadrer: "C’est parce que vous bougez qu’internet compte encore plus : une boulangerie, on la retrouve toujours au même coin de rue. Vous, si les gens ne savent pas où vous êtes aujourd’hui, ils mangent ailleurs.",
      proposer: "Je vous montre une page planning toute simple, que vous mettez à jour en une minute depuis votre téléphone. Vingt minutes après un service, mardi ou jeudi ?",
    },
  ],

  proofs: [
    "En général, quand on a faim et qu’on ne connaît pas le coin, on cherche sur Google Maps ou sur Instagram ce qu’il y a autour de soi.",
    "Pour un camion, la question numéro un des clients, c’est « vous êtes où aujourd’hui ? ». Un planning à jour au même endroit y répond une fois pour toutes.",
    "Une story « aujourd’hui on est à… » publiée juste avant le service tombe au moment où les gens se demandent où manger : c’est souvent ce qui les fait bouger.",
    "La précommande, c’est en général moins de file au coup de feu et moins de clients pressés qui repartent sans rien.",
    "Une carte de fidélité dans le téléphone suit le client d’un emplacement à l’autre, le carton, lui, reste dans l’autre veste.",
    "Devant un camion qu’on ne connaît pas, des avis récents et des photos des plats rassurent beaucoup plus qu’une photo du camion.",
    "Les organisateurs de mariages, d’anniversaires ou de séminaires regardent souvent les photos et les avis avant de contacter un food-truck pour une privatisation.",
  ],

  buyingSignals: [
    "Il vous montre son planning griffonné sur une ardoise ou dans son téléphone.",
    "Il se plaint spontanément des messages « vous êtes où demain ? » auxquels il répond le soir.",
    "Question : « Et la précommande, les gens paient comment ? »",
    "Il sort son téléphone pour vous montrer son Instagram ou ses statistiques.",
    "Il parle de développer les privatisations : mariages, entreprises, anniversaires.",
    "Il évoque un nouvel emplacement obtenu, un deuxième camion ou un projet de restaurant fixe.",
    "Question : « Vous pourriez faire mes stories quand je suis en service ? »",
    "Il parle de la saison à préparer : festivals, marchés nocturnes, plages.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Instagram",
      "Facebook",
      "Uber Eats",
      "Applications et annuaires de food-trucks",
      "Agendas des marchés et marchés nocturnes (mairies, offices de tourisme)",
      "Site internet",
    ],
    questions: [
      "Existe-t-il une fiche Google, avec quelle adresse (domicile, laboratoire, emplacement principal) et quels horaires, et correspond-elle à la réalité d’un camion qui change d’emplacement ?",
      "Le planning de la semaine est-il publié quelque part (Instagram, Facebook, site, fiche Google), à un endroit fixe, et est-il à jour ?",
      "De quand datent la dernière publication et la dernière story sur Instagram et Facebook, et indiquent-elles l’emplacement du jour ?",
      "Combien d’avis Google, quelle note, de quand date le dernier avis, et le gérant y répond-il ?",
      "Que disent les avis négatifs : attente, prix, quantités, camion introuvable ou absent ?",
      "Est-il possible de précommander (formulaire, message, téléphone, plateforme), et est-il présent sur Uber Eats ou une autre plateforme de livraison ?",
      "Le food-truck est-il référencé sur une application de food-trucks ou sur l’agenda d’un marché ou d’une mairie du Bassin de Thau ?",
      "Propose-t-il des privatisations (mariages, entreprises, anniversaires), et est-ce visible avec un moyen simple de le contacter ?",
      "Quels sont ses emplacements réguliers (zones d’activité, marchés, plages), et quels autres food-trucks occupent les mêmes secteurs ?",
      "A-t-il une spécialité ou un argument à valoriser (produits locaux, recette maison, poisson de l’étang, fait maison) ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les food-trucks du Bassin de Thau à régler leur question numéro un : « vous êtes où aujourd’hui ? ». En général, ça tient à trois choses simples : un planning à jour au même endroit, une fiche Google qui n’envoie personne au mauvais endroit, et des avis récents. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, après votre service mardi ou jeudi ?",

  compliance:
    "Pour les plats vendus sans emballage, l’information sur les allergènes doit être disponible : sur une page de précommande ou une carte en ligne, indiquer les allergènes ou préciser où les consulter. N’annoncer sur le site, la fiche Google ou les réseaux que des emplacements pour lesquels le commerçant a bien une autorisation (permis de stationnement de la mairie ou accord du propriétaire privé). En cas de précommande avec paiement en ligne, prévoir des conditions de vente claires (retrait, annulation pour météo, remboursement). Avant de publier une photo où l’on reconnaît un client ou un salarié, demander son accord.",
};

export default sheet;
