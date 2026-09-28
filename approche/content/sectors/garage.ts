import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "garage",
  name: "Garage / carrosserie",
  short: "Garage",
  examples: [
    "garage de mécanique générale indépendant",
    "carrosserie et peinture",
    "centre de contrôle technique",
    "centre pneus et géométrie",
    "garage moto et scooter",
    "garage franchisé d’un réseau (Motrio, AD, Top Garage, Eurorepar…)",
    "entretien et mécanique de bateaux (ports de Sète, Mèze, Marseillan)",
  ],
  tagline:
    "Un patron qui a les mains dans le moteur, un téléphone qui sonne pour des prix, et des clients qui choisissent leur garage sur Google dès qu’ils ne sont pas du coin.",

  reality: {
    rhythm:
      "Ouverture vers 8 h : c’est le défilé des clients qui déposent leur voiture avant d’aller travailler, clés sur le comptoir, ordre de réparation griffonné. Vers 8 h 45 - 9 h, le planning est lancé et le patron file à l’atelier. De 9 h 30 à midi c’est le cœur du travail : diagnostic, démontage, commandes de pièces chez le distributeur, et le téléphone qui sonne sans arrêt pendant qu’il est sous un pont (« c’est combien un embrayage ? », « vous avez de la place jeudi ? », « ma voiture est prête ? »). Pause de 12 h à 14 h, souvent atelier fermé. L’après-midi : réparations, livraisons de pièces, essais routiers, appels aux clients pour valider les devis. De 17 h à 18 h 30, les clients récupèrent leur voiture : factures, explications, encaissement. La paperasse (devis, factures, commandes, relances) se fait après la fermeture ou le samedi matin. Beaucoup de garages ouvrent le samedi matin et ferment le samedi après-midi et le dimanche ; certains ferment le lundi matin. Dans les petits garages, c’est souvent le conjoint ou une secrétaire à mi-temps qui tient l’accueil, le téléphone et la comptabilité : c’est une personne clé, qui voit tout passer. En carrosserie, une bonne partie du travail arrive via les assurances et les experts ; au contrôle technique, tout se joue sur le planning de rendez-vous ; au port, le mécanicien marine travaille sur les pontons autant qu’à l’atelier.",
    pains: [
      "Le téléphone qui sonne toute la journée pendant qu’il a les mains dans le moteur : soit il décroche et perd le fil, soit il ne décroche pas et perd le client.",
      "Les appels « c’est combien un embrayage ? » ou « c’est combien une vidange ? » qui prennent du temps et qui, souvent, ne débouchent sur rien parce que le client compare cinq garages.",
      "Recruter un bon mécanicien ou un carrossier qualifié : c’est devenu très difficile, et chaque absence désorganise tout le planning.",
      "Les plateformes de réservation en ligne qui ramènent du monde mais prennent une commission et imposent des remises, avec des clients qui ne reviennent pas.",
      "Les délais de pièces et le planning qui explose : une voiture bloquée sur le pont trois jours, c’est une place de moins pour tout le monde.",
      "La concurrence des centres auto de zone commerciale qui affichent leurs forfaits en ligne, et des concessions qui rappellent leurs clients pour l’entretien.",
      "Des avis injustes (« trop cher », « pas rappelé ») restés sans réponse, alors que la plupart des clients sont contents mais ne l’écrivent jamais.",
    ],
    clientLoss: [
      "L’automobiliste en panne ou le vacancier tape « garage près de moi » et appelle le premier qui a une bonne note et qui décroche. S’il tombe sur la messagerie, il appelle le suivant.",
      "Le client qui veut un devis le soir, depuis son canapé, ne trouve ni site ni formulaire : il réserve chez un centre auto ou sur une plateforme où il voit un prix.",
      "Des horaires faux sur Google (ouvert le samedi après-midi, fermé entre midi et deux non indiqué) qui envoient des gens devant un rideau baissé, puis un avis négatif.",
      "Les nouveaux habitants et les jeunes conducteurs n’ont pas de « garagiste attitré » : ils choisissent sur les avis, les photos et la facilité à prendre rendez-vous.",
      "Aucun rappel d’entretien ou de contrôle technique : le client oublie, et c’est la concession ou le centre auto qui le relance à votre place.",
      "Des avis négatifs sans réponse qui laissent penser qu’on ne tient pas compte des clients, et qui font fuir ceux qui hésitaient.",
    ],
    seasonality:
      "Sur le littoral, l’été amène une clientèle de passage : vacanciers en panne, climatisations à recharger, camping-cars et remorques, voitures de location. Juin et début juillet, c’est la révision avant les départs : les ateliers sont pleins et le patron n’a pas une minute. Beaucoup de petits garages ferment deux ou trois semaines en août. À la rentrée, le rythme reprend avec les contrôles techniques et les entretiens repoussés. L’hiver est plus calme sur la mécanique, sauf batteries et démarreurs par temps froid. Côté moto et scooter, la saison démarre au printemps, et le contrôle technique des deux-roues, en place depuis 2024, a amené une nouvelle clientèle. Côté bateaux, sur les ports de Sète, Mèze ou Marseillan, le calendrier est inversé : hivernage d’octobre à décembre, remise à l’eau et révisions de mars à mai (le rush), pannes en plein été. Les meilleures périodes pour prospecter : de mi-septembre à fin novembre et de janvier à mars pour la mécanique et la carrosserie ; de décembre à février pour les mécaniciens marine.",
    digitalHabits:
      "La fiche Google existe presque toujours, souvent avec pas mal d’avis, mais rarement tenue : horaires approximatifs, photos prises par des clients, avis sans réponse. Les garages franchisés ont une page sur le site du réseau, et pensent que le réseau s’occupe de tout. Certains sont inscrits sur iDGarage ou Vroomly, souvent sans bien savoir ce que ça leur rapporte. Une page Facebook sert surtout à montrer des véhicules d’occasion ou une carrosserie refaite. Le site internet est rare, ou une vieille page sans prix, sans formulaire et illisible sur téléphone. Les devis se font au téléphone ou au comptoir, les rendez-vous sur un agenda papier ou dans le logiciel de gestion du garage. Le client est prévenu par un SMS ou un appel quand sa voiture est prête. Le patron regarde son téléphone le soir, et répond aux messages quand il y pense.",
  },

  offers: {
    priority: [
      {
        offer: "fiche-google",
        pitch:
          "Quand une voiture tombe en panne, les gens tapent « garage » sur leur téléphone et appellent le premier qui inspire confiance. On remet vos horaires justes, samedi après-midi compris, on met des photos de votre atelier et de vos réparations, et on répond à vos avis à votre place.",
      },
      {
        offer: "site-vitrine",
        pitch:
          "Une page simple avec vos prestations, vos marques, vos horaires, et surtout un bouton « demander un devis » ou « prendre rendez-vous ». Le client remplit le soir chez lui, avec sa plaque et le problème, et vous le retrouvez le matin sans avoir décroché le téléphone sous une voiture.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Un assistant qui répond à votre place aux questions qui reviennent tout le temps : « c’est combien un embrayage ? », « vous êtes ouverts samedi ? », « ma voiture est prête ? ». Il donne une fourchette que vous avez validée, prend la plaque et le numéro, et vous transmet les vraies demandes.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte sur le comptoir, là où le client récupère ses clés et paie. Il pose son téléphone dessus et il arrive directement sur la page pour laisser un avis. Vos clients sont contents, il faut juste que ça se voie sur Google.",
      },
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit un automobiliste qui cherche un garage à {ville}, je vous compare aux trois garages et centres auto les plus proches, et je vous laisse trois choses à corriger, dont une que vous pouvez faire seul. C’est gratuit.",
      },
    ],
    upsell:
      "Après la carte d’avis et la fiche Google, la suite logique est le site vitrine avec demande de devis et prise de rendez-vous en ligne, puis l’agent IA branché dessus pour filtrer les appels de prix et répondre le soir et le week-end. Pour un garage qui vend aussi des véhicules d’occasion, une page d’annonces à jour sur le site. Pour un garage qui a du volume, un petit logiciel sur mesure pour les rappels d’entretien et de contrôle technique par SMS. Pour une carrosserie ou un mécanicien marine, une gestion des réseaux sociaux sur quelques mois avec des vidéos avant-après, qui marchent très bien dans ce métier.",
  },

  timing: {
    best: [
      {
        label: "Juste après les dépôts du matin",
        days: [2, 3, 4, 5],
        from: "08:15",
        to: "09:00",
        why: "Les voitures du jour sont déposées, le planning est fait, le patron boit son café avant de filer à l’atelier : il a cinq minutes, pas plus.",
      },
      {
        label: "Fin de journée avant les retraits",
        days: [1, 2, 3, 4],
        from: "17:00",
        to: "18:00",
        why: "Les réparations du jour sont bouclées, il prépare les factures : il est à l’accueil et plus disponible, mais repartez dès que les clients arrivent pour leurs clés.",
      },
      {
        label: "Téléphone en début d’après-midi",
        days: [2, 3, 4],
        from: "14:00",
        to: "14:30",
        why: "À la reprise, avant de replonger dans une réparation, c’est souvent le moment où l’accueil décroche et peut vous donner un créneau.",
      },
    ],
    avoid: [
      {
        label: "Cœur de matinée",
        from: "09:30",
        to: "12:00",
        why: "Le patron est sous un pont ou en plein diagnostic : il ne viendra pas vous parler les mains pleines de cambouis, ou le fera en soupirant.",
      },
      {
        label: "Pause déjeuner",
        from: "12:00",
        to: "14:00",
        why: "Atelier souvent fermé, et c’est le seul moment où il souffle : ne l’en privez pas.",
      },
      {
        label: "Samedi",
        days: [6],
        from: "08:00",
        to: "18:00",
        why: "Le samedi matin est chargé en particuliers et en paperasse, et l’après-midi le garage est en général fermé.",
      },
      {
        label: "Lundi matin",
        days: [1],
        from: "08:00",
        to: "12:00",
        why: "Les pannes du week-end, les dépanneuses et le planning de la semaine à caler : c’est la matinée la plus chargée.",
      },
    ],
    usuallyClosed: [0],
    phoneNote:
      "Appelez le fixe du garage entre 8 h 15 et 9 h, ou entre 14 h et 14 h 30. C’est souvent le conjoint ou la secrétaire qui décroche : soyez très aimable, demandez le prénom du patron et le meilleur moment pour passer, et proposez de venir plutôt que de le faire sortir de l’atelier. Si personne ne décroche, ne laissez pas trois messages : repassez en fin de journée. Beaucoup de garages ferment le samedi après-midi et le dimanche, certains le lundi matin : vérifiez sur la fiche Google avant de vous déplacer. Au port, le mécanicien marine est souvent sur les pontons : appelez son portable professionnel s’il est affiché, tôt le matin.",
    seasonNote:
      "Prospectez de mi-septembre à fin novembre et de janvier à mars. Évitez juin et début juillet (révisions avant départ, climatisations), vérifiez les congés en août, et évitez les deux semaines avant Noël. Pour l’entretien de bateaux, prospectez de décembre à février et oubliez mars à mai (remises à l’eau).",
  },

  scripts: {
    physique: {
      id: "garage-physique",
      title: "Visite au garage",
      channel: "physique",
      duration: "3 à 5 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer par l’accueil, sans gêner l’atelier, et savoir qui décide.",
          lines: [
            "Bonjour ! Je ne suis pas là pour une voiture aujourd’hui, rassurez-vous.",
            "Je cherchais le patron, c’est vous ?",
            "Pas de souci, il est à l’atelier ? Surtout ne le dérangez pas s’il est sur une voiture, je peux attendre deux minutes ou repasser.",
            "Il est plus tranquille à quel moment, en général ? Plutôt tôt le matin ou vers 17 h ?",
          ],
          tip: "Passez toujours par l’accueil ou le bureau, jamais directement dans l’atelier : c’est une question de sécurité et de respect. Tenue simple, pas de costume : vous parlez à un artisan.",
          branches: [
            {
              if: "C’est le conjoint ou la secrétaire à l’accueil",
              then: "Présentez-vous à elle ou lui aussi : c’est souvent la personne qui gère le téléphone, les avis et l’administratif. Demandez : « C’est vous qui vous occupez de la fiche Google, ou c’est votre mari / le patron ? »",
            },
            {
              if: "Le patron sort de l’atelier en s’essuyant les mains",
              then: "Soyez très bref : « Je vous prends deux minutes, pas plus. Si je tombe mal, dites-le-moi, je repasse. »",
            },
            {
              if: "C’est un chantier naval ou un mécanicien au port",
              then: "Demandez à l’accueil de la capitainerie ou au chantier où le trouver, et attendez qu’il remonte du ponton. Ne l’interrompez jamais sur un bateau.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Se présenter et obtenir trente secondes d’attention, sans vendre.",
          lines: [
            "Enchanté, {prenom}, de MJAGENCY, une agence de Sète. On aide les garages du coin à être bien trouvés sur Google et à moins subir le téléphone.",
            "Je ne viens rien vous vendre aujourd’hui. En arrivant, j’ai regardé votre fiche Google, et il y a un détail qui peut vous faire perdre des clients. Je vous montre, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} ouverte sur votre téléphone avant d’entrer, et tournez l’écran vers lui. Parlez de « clients » et de « téléphone », pas de « visibilité » ni de « digital ».",
          branches: [
            {
              if: "« J’ai une voiture sur le pont, là »",
              then: "« Je comprends, je ne vous retiens pas. Je repasse demain à 8 h 30 ou jeudi vers 17 h 15, qu’est-ce qui vous arrange ? »",
            },
            {
              if: "« Internet, c’est pas pour nous »",
              then: "« Justement, je vous montre juste ce que les gens voient de vous quand ils vous cherchent. Après, vous jugez. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible, sans juger son travail.",
          lines: [
            "Regardez : quand je tape « garage » ici, à {ville}, vous sortez après deux centres auto et un garage qui a plus d’avis récents.",
            "Et là, vos horaires indiquent ouvert le samedi toute la journée. Vous fermez à midi, c’est bien ça ? Celui qui arrive à 15 h avec son voyant allumé, il trouve le rideau baissé.",
            "Vous avez de bons avis, mais personne n’y répond, y compris à celui qui dit « trop cher ». Les autres clients lisent ça aussi.",
            "Et les photos, ce sont surtout des photos de clients, un peu floues. Votre atelier est propre et bien équipé, ça, ça rassure les gens.",
          ],
          tip: "Choisissez le constat le plus parlant, pas les quatre. Commencez par un compliment sincère : l’atelier bien rangé, une belle carrosserie en cours, le matériel de diagnostic.",
          branches: [
            {
              if: "Garage franchisé : « C’est le réseau qui gère ça »",
              then: "« Le réseau vous fait une page sur son site, oui. Mais la fiche Google, les photos et les réponses aux avis, en général c’est vous. On regarde ensemble qui fait quoi ? »",
            },
            {
              if: "La fiche est déjà impeccable",
              then: "Félicitez sincèrement (« C’est une des mieux tenues du coin ») et basculez sur le téléphone : « Et les appels pour des prix, vous en avez beaucoup dans la journée ? »",
            },
            {
              if: "« Ah bon, c’est marqué ça ? »",
              then: "« Oui, Google remplit tout seul quand personne ne le fait. Ça se corrige en quelques minutes. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de ce qui l’embête vraiment : le téléphone, le planning, les plateformes.",
          lines: [
            "Dans une journée, des appels du genre « c’est combien un embrayage ? », vous en avez combien, à peu près ?",
            "Et quand vous êtes sous une voiture et que ça sonne, vous faites comment ?",
            "Les clients de passage, les vacanciers en panne l’été, ils vous trouvent comment, d’après vous ?",
          ],
          tip: "Posez une seule question, puis taisez-vous. Un garagiste parle volontiers de son téléphone et des plateformes : laissez-le vider son sac.",
          branches: [
            {
              if: "Il râle contre le téléphone",
              then: "« C’est exactement ce qu’on règle avec un assistant qui répond aux questions de prix et d’horaires à votre place, et qui ne vous passe que les vraies demandes. »",
            },
            {
              if: "Il parle de Vroomly ou iDGarage",
              then: "« Et ces clients-là, ils reviennent chez vous, ou ils repassent par la plateforme ? L’idée, c’est d’avoir votre propre prise de rendez-vous, sans commission. »",
            },
            {
              if: "Il parle du recrutement",
              then: "Écoutez, compatissez, ne vendez rien là-dessus. Puis : « Raison de plus pour ne pas passer une heure par jour au téléphone. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose un truc simple : je vous fais un audit gratuit de ce que voient les automobilistes quand ils vous cherchent, et je vous montre les trois choses à corriger en priorité.",
            "Vingt minutes, pas plus. Je repasse mardi à 8 h 30 ou jeudi à 17 h 15, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Et je vous laisse une carte d’avis à tester sur le comptoir, vous me direz si vos clients l’utilisent.",
          ],
          tip: "Toujours deux créneaux précis, tôt le matin ou en fin de journée. Notez le rendez-vous devant lui et envoyez le SMS de confirmation en sortant.",
          branches: [
            {
              if: "« Envoyez-moi ça par mail »",
              then: "« Un mail, vous allez le lire entre deux factures de pièces. Je préfère vous le montrer à l’écran, c’est plus clair. Mardi 8 h 30 ou jeudi 17 h 15 ? »",
            },
            {
              if: "« Voyez avec ma femme, c’est elle qui gère »",
              then: "« Très bien. Elle est là plutôt quand ? Si vous pouvez être là tous les deux cinq minutes, c’est encore mieux. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et si un jour le téléphone vous rend fou, vous savez qui appeler. Bonne journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "garage-telephone",
      title: "Appel au garage",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’on ne tombe pas au mauvais moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Je ne vous appelle pas pour une voiture. Je vous prends deux minutes, ça va, là ?",
          ],
          tip: "Dites tout de suite que ce n’est pas pour une réparation : sinon la personne va chercher le planning et se sentira piégée ensuite.",
          branches: [
            {
              if: "« Là, j’ai un client au comptoir »",
              then: "« Je vous rappelle dans un quart d’heure, ça vous va ? » Et rappelez vraiment.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le patron, ou au moins son prénom et le bon moment pour le voir.",
          lines: [
            "Je voudrais parler au patron, c’est au sujet de la fiche Google du garage, les horaires et les avis.",
            "Il est à l’atelier ? Surtout ne le faites pas sortir. Vous pouvez me dire son prénom, et quand il est le plus facile à voir ?",
            "Et c’est vous ou lui qui vous occupez des avis et de la fiche Google ?",
          ],
          tip: "La personne à l’accueil est souvent le conjoint ou l’associé administratif : c’est parfois elle qui décide pour tout ce qui n’est pas mécanique. Traitez-la comme une décisionnaire.",
          branches: [
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est d’abord pour vous signaler un souci sur votre fiche Google : les horaires du samedi, notamment. Ça envoie des clients devant un garage fermé. »",
            },
            {
              if: "« C’est moi qui gère tout ça »",
              then: "Parfait, passez directement à l’accroche avec elle ou lui.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "J’ai regardé votre fiche Google en préparant mon appel : vos horaires indiquent ouvert le samedi après-midi, alors que vous êtes fermés, c’est bien ça ?",
            "Et vous avez une trentaine d’avis, plutôt bons, mais aucun n’a de réponse. On aide les garages du Bassin de Thau à corriger ça et à être celui qu’on appelle quand on tombe en panne.",
          ],
          tip: "Un seul constat, précis, que vous avez vraiment vu. Si vous ne l’avez pas vérifié, ne l’inventez pas.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, les demandes de devis, elles arrivent surtout par téléphone, ou vous en avez par internet ?",
            "Vous êtes sur une plateforme comme Vroomly ou iDGarage, ou pas du tout ?",
          ],
          tip: "Deux questions maximum au téléphone. Le reste se fera sur place, devant l’écran.",
          branches: [
            {
              if: "« Tout par téléphone, et ça sonne tout le temps »",
              then: "« C’est ce que me disent presque tous les garages. C’est justement une des choses que je veux vous montrer. »",
            },
            {
              if: "« On est sur Vroomly, ça marche bien »",
              then: "« Très bien. Je vous montrerai comment avoir aussi vos propres demandes en direct, sans commission, en complément. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes au garage, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, à l’accueil. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 8 h 30, ou jeudi à 17 h 15. Qu’est-ce qui vous arrange ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande, ramenez au rendez-vous.",
          branches: [
            {
              if: "« C’est combien votre truc ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, c’est comme un devis chez vous : je ne donne pas de prix sans avoir vu la voiture. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Dites-moi le jour qui vous arrange, tôt le matin ou en fin de journée, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 17 h 15 au garage. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un SMS de confirmation avec mon nom. En cas d’imprévu, vous répondez dessus, tout simplement.",
            "Merci, et bon courage pour la journée à l’atelier.",
          ],
          tip: "SMS de confirmation dans les cinq minutes, rappel la veille. Arrivez à l’heure pile : un garagiste juge sur la ponctualité.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "En dehors de vos habitués, les nouveaux clients, ils arrivent chez vous comment aujourd’hui ?",
      why: "Savoir s’il a conscience du rôle de Google Maps, des plateformes et du bouche-à-oreille dans sa clientèle nouvelle.",
    },
    {
      type: "S",
      question: "Les demandes de devis et de rendez-vous, vous les recevez comment : téléphone, comptoir, messages, plateforme ?",
      why: "Repérer le tout-téléphone, l’agenda papier, et une ouverture pour le site avec prise de rendez-vous.",
    },
    {
      type: "P",
      question: "Quand vous êtes sous une voiture et que le téléphone sonne, qu’est-ce qui se passe ?",
      why: "Faire émerger les appels manqués et le temps perdu à répondre à des demandes de prix.",
    },
    {
      type: "P",
      question: "Ça vous arrive d’avoir des clients qui disent qu’ils ont trouvé porte close, ou un avis qui parle d’un rappel qui n’est jamais venu ?",
      why: "Lui faire toucher du doigt le coût des horaires faux et des rappels oubliés.",
    },
    {
      type: "I",
      question: "Un automobiliste en panne qui tombe sur votre messagerie, d’après vous, il fait quoi juste après ?",
      why: "Lui faire réaliser lui-même que l’appel manqué part chez le concurrent, sans avancer de chiffre.",
    },
    {
      type: "I",
      question: "Et les clients qui passent par une plateforme, une fois la commission et la remise déduites, qu’est-ce qu’il vous reste vraiment sur une vidange ?",
      why: "Lui faire mesurer ce que lui coûte la dépendance aux plateformes.",
    },
    {
      type: "N",
      question: "Si les questions de prix et d’horaires étaient traitées sans vous, et que vous retrouviez le matin les demandes de devis écrites avec la plaque et le problème, qu’est-ce que ça changerait dans vos journées ?",
      why: "Lui faire formuler lui-même le bénéfice du site avec devis en ligne et de l’agent IA.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "On est déjà sur Vroomly, et le réseau s’occupe de notre page.",
      hidden: "Il pense que le digital est réglé parce qu’il paie déjà quelque chose. Souvent, il ne sait pas vraiment ce que la plateforme ou le réseau fait pour lui.",
      accueillir: "Très bien, ça veut dire que vous avez déjà pensé à internet, c’est plutôt un bon point.",
      questionner: "Et la fiche Google, les photos, les réponses aux avis, c’est le réseau qui le fait, ou c’est à vous ? Les clients de la plateforme, ils reviennent en direct ensuite ?",
      recadrer: "Je ne viens remplacer personne. La plateforme vous amène des clients à elle, avec une commission ; la fiche Google et votre propre prise de rendez-vous, ça vous amène des clients à vous.",
      proposer: "Je vous fais l’audit gratuit et on regarde ensemble qui fait quoi. Si tout est déjà couvert, vous aurez au moins vérifié. Mardi 8 h 30 ou jeudi 17 h 15 ?",
    },
    {
      id: "pas-le-temps",
      objection: "J’ai pas le temps, j’ai trois voitures qui attendent.",
      hidden: "Il est vraiment débordé, et il a peur qu’on lui ajoute une tâche de plus.",
      accueillir: "Je vois bien, l’atelier est plein, c’est plutôt bon signe.",
      questionner: "Justement, dans une journée, combien de fois vous êtes interrompu par le téléphone pour des questions de prix ou d’horaires ?",
      recadrer: "L’idée, c’est de vous en enlever, pas de vous en rajouter. Vous validez une fois vos tarifs et vos horaires, et c’est nous qui faisons le reste.",
      proposer: "Je repasse un matin à 8 h 30, avant que vous attaquiez, vingt minutes. Mardi ou jeudi ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, je suis un petit garage, pas une concession.",
      hidden: "La pression sur les marges, les pièces et le matériel de diagnostic qui coûtent cher. Souvent, il n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, entre les pièces, les valises de diagnostic et les charges, chaque euro compte.",
      questionner: "Une réparation d’embrayage ou une carrosserie de plus par mois, ça représente quoi pour vous ?",
      recadrer: "On a des solutions qui commencent petit, au mois, et une partie de ce que je vais vous montrer, vous pouvez la faire seul et gratuitement. L’idée, c’est que ça se rembourse avec quelques clients de plus, sans commission.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez après.",
    },
    {
      id: "neveu",
      objection: "Mon fils s’y connaît en ordinateur, il va me faire un site.",
      hidden: "L’envie de ne pas dépenser et la confiance dans la famille. Souvent, le projet traîne depuis des mois.",
      accueillir: "C’est bien d’avoir quelqu’un dans la famille qui s’y connaît.",
      questionner: "Il a déjà commencé ? Et il pourra aussi mettre à jour vos horaires, répondre aux avis et gérer les demandes de devis toutes les semaines ?",
      recadrer: "Faire un site, c’est une chose. Ce qui fait venir des clients, c’est le suivi : la fiche Google à jour, les avis, les demandes qui arrivent au bon endroit. C’est ça qui lâche en général au bout de deux mois.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et s’il manque de temps un jour, vous saurez où me trouver.",
    },
    {
      id: "facebook-suffit",
      objection: "J’ai ma page Facebook, j’y mets mes occasions, ça suffit.",
      hidden: "Il a l’impression d’avoir déjà fait sa part du digital.",
      accueillir: "C’est très bien, pour les véhicules d’occasion Facebook marche souvent bien.",
      questionner: "Et quelqu’un qui tombe en panne en vacances à {ville}, il cherche un garage sur Facebook, ou il tape « garage » sur son téléphone ?",
      recadrer: "Facebook, ça parle à ceux qui vous suivent déjà. Celui qui a un voyant allumé et qui ne vous connaît pas, en général, il va sur Google Maps et il appelle le premier qui inspire confiance.",
      proposer: "Gardez Facebook, on n’y touche pas. Je vous montre juste ce que voit un automobiliste qui ne vous connaît pas, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici tout le monde me connaît, ça marche au bouche-à-oreille depuis vingt ans.",
      hidden: "La fierté d’une réputation construite sur la confiance, et le sentiment que ça suffira toujours.",
      accueillir: "C’est la meilleure publicité pour un garagiste, la confiance, et vous l’avez gagnée.",
      questionner: "Quand un client recommande votre garage à un collègue, vous savez ce que fait ce collègue juste après ?",
      recadrer: "En général, il vérifie sur Google : l’adresse, les horaires, et les avis. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tout le monde.",
      proposer: "La carte d’avis sur le comptoir, c’est exactement ça : faire parler vos clients contents au moment où ils récupèrent leurs clés. Je vous en laisse une à tester ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli, parfois un vrai coup de feu à l’atelier à ce moment-là.",
      accueillir: "Bien sûr, je vois que ce n’est pas le moment.",
      questionner: "Pour ne pas tomber au mauvais moment, vous êtes plus tranquille tôt le matin ou en fin de journée ?",
      recadrer: "Un mail, honnêtement, il va se perdre entre les factures de pièces et les devis d’assurance. Ce que j’ai à vous montrer tient sur un écran, c’est beaucoup plus clair en face.",
      proposer: "Je passe jeudi à 17 h 15, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "habitues",
      objection: "Mes clients, ce sont des habitués, pas des gens d’internet.",
      hidden: "Il associe internet aux clients qui comparent les prix et négocient, et il n’a pas envie de ceux-là. Parfois aussi, la peur que sa clientèle vieillisse sans être remplacée.",
      accueillir: "C’est une vraie force, une clientèle fidèle qui vous fait confiance les yeux fermés.",
      questionner: "Et ces habitués, quand ils changent de voiture, ou quand leurs enfants passent le permis, vous êtes sûr qu’ils viennent chez vous ? Et quand un habitué déménage, qui le remplace ?",
      recadrer: "Même vos habitués regardent vos horaires sur Google. Et l’idée n’est pas d’attirer des chasseurs de prix : c’est au contraire de filtrer les appels de prix et de faire venir des gens du quartier qui cherchent un garagiste de confiance.",
      proposer: "Je vous montre en vingt minutes à quoi ressemble votre garage pour quelqu’un qui vient d’emménager à {ville}. Mardi 8 h 30 ou jeudi 17 h 15 ?",
    },
  ],

  proofs: [
    "En général, quand on tombe en panne loin de chez soi ou qu’on vient d’emménager, on tape « garage » dans Google Maps et on appelle un des premiers qui ont de bons avis.",
    "Un appel manqué pour une panne part souvent chez le garage suivant de la liste : l’automobiliste en difficulté ne rappelle pas, il cherche une solution tout de suite.",
    "Beaucoup d’automobilistes préfèrent demander un devis le soir, par écrit, plutôt que d’appeler en journée : un formulaire simple capte ces demandes-là.",
    "Des photos récentes d’un atelier propre et bien équipé rassurent : c’est une question de confiance, et c’est ce qu’on cherche d’abord chez un garagiste.",
    "Répondre calmement à un avis négatif « trop cher » en expliquant la réparation montre aux autres clients qu’il y a un professionnel sérieux derrière.",
    "Des horaires justes sur Google, samedi et jours fériés compris, c’est la correction la plus simple et celle qui évite le plus d’avis négatifs.",
    "Les clients contents laissent rarement un avis d’eux-mêmes ; leur demander au moment où ils récupèrent leurs clés, avec une carte sur le comptoir, change beaucoup de choses.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour regarder sa propre fiche Google avec vous, ou appelle l’accueil pour qu’on vienne voir.",
    "Il vous raconte un avis négatif qui l’a touché, ou un client qui s’est plaint de ne pas avoir été rappelé.",
    "Il se plaint spontanément du téléphone ou des appels « c’est combien » : c’est une porte ouverte pour l’agent IA.",
    "Il vous parle de ce que lui coûte une plateforme de réservation, ou d’un contrat avec le réseau qu’il trouve cher pour ce qu’il apporte.",
    "Question : « Et le client, il pourrait prendre rendez-vous tout seul, sur mon planning ? »",
    "Le conjoint ou la secrétaire se rapproche pour écouter, ou dit « ça, ça m’aiderait ».",
    "Il évoque un projet : reprise du garage, agrandissement, nouveau pont, embauche d’un apprenti, lancement du contrôle technique moto ou d’une activité occasion.",
    "Il demande si vous travaillez déjà avec d’autres garages ou carrosseries du coin.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "PagesJaunes",
      "iDGarage",
      "Vroomly",
      "Site du réseau (Motrio, AD, Top Garage, Eurorepar, Point S…)",
      "Facebook",
      "Leboncoin (véhicules d’occasion)",
      "Site internet du garage",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, et les horaires sont-ils justes (samedi après-midi, pause de midi, lundi matin, congés d’août, jours fériés) ?",
      "Combien d’avis, quelle note, de quand date le dernier avis, et le gérant y répond-il ?",
      "Que disent les avis négatifs : prix, délais, voiture pas prête, pas rappelé, accueil ?",
      "Les catégories et services de la fiche sont-ils complets (mécanique, carrosserie, pneus, climatisation, contrôle technique, moto, marine) ?",
      "Les photos montrent-elles l’atelier, l’équipe et des réparations, ou seulement la façade, et qui les a publiées ?",
      "Sur la recherche « garage {ville} » ou « carrosserie {ville} », où sort {commerce} par rapport aux trois concurrents les plus proches et aux centres auto ?",
      "Le garage appartient-il à un réseau de franchise, et que contient sa page sur le site du réseau (prise de rendez-vous, prix, avis) ?",
      "Est-il présent sur iDGarage ou Vroomly, avec quels tarifs affichés et quels avis ?",
      "Existe-t-il un site propre, lisible sur téléphone, avec un bouton d’appel, une demande de devis ou une prise de rendez-vous ?",
      "Vend-il des véhicules d’occasion (Leboncoin, Facebook), et fait-il de l’entretien de bateaux ou de motos à mettre en avant ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les garages du Bassin de Thau à être celui qu’on appelle quand on tombe en panne, et à moins subir le téléphone. En général, ça se joue sur trois choses : des horaires justes sur Google, des avis récents avec des réponses, et un moyen simple de demander un devis sans vous appeler sous une voiture. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi matin ou jeudi en fin de journée ?",

  compliance:
    "Les garages doivent afficher leurs prix de façon visible à l’accueil (taux horaire de main-d’œuvre TTC, prix des forfaits courants) : les tarifs publiés sur un site, une fiche Google ou donnés par un agent IA doivent être cohérents avec cet affichage, et présentés comme indicatifs sous réserve de diagnostic ou de devis. Un agent IA ne doit jamais s’engager sur un prix ferme ou un délai sans validation du garagiste. Pour un garage franchisé, vérifier la charte du réseau avant d’utiliser son logo ou son nom sur un site ou une publication. Pour un centre de contrôle technique, respecter les mentions et la présentation liées à l’agrément. Sur les photos de réparations ou de véhicules, flouter les plaques d’immatriculation et demander l’accord du client avant de publier sa voiture ou son bateau. Ne jamais acheter d’avis ni filtrer les avis négatifs.",
};

export default sheet;
