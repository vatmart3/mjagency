import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "restaurant",
  name: "Restaurant",
  short: "Restaurant",
  examples: [
    "restaurant de coquillages et de poisson sur les quais du canal à Sète",
    "mas conchylicole ou dégustation d’huîtres à Bouzigues et Mèze",
    "brasserie de centre-ville avec formule du midi",
    "pizzeria sur place et à emporter",
    "restaurant de plage ouvert à la saison",
    "restaurant traditionnel ou bistronomique de quartier",
  ],
  tagline:
    "Deux services par jour, une coupure de l’après-midi qui est le seul moment pour parler, et des clients qui choisissent leur table sur Google Maps avant même d’avoir faim.",

  reality: {
    rhythm:
      "Le patron arrive vers 9 h - 9 h 30 : livraisons (poissonnier, maraîcher, huîtres de l’étang), mise en place, carte du jour à l’ardoise. Ouverture vers 11 h 30, service du midi jusqu’à 14 h 30, parfois plus tard l’été en bord de canal. Ensuite plonge, repas de l’équipe, et la coupure de 15 h à 17 h 30 : c’est là que le patron fait ses commandes, sa compta, rappelle les fournisseurs, ou souffle simplement en terrasse avec un café. Vers 17 h 30 - 18 h, mise en place du soir, puis service de 19 h à 22 h 30, fermeture vers minuit. Sur la semaine, hors saison, un ou deux jours de fermeture (très souvent lundi et mardi, ou dimanche soir et lundi) ; l’été, beaucoup passent à sept jours sur sept. Les vendredis soir, samedis et dimanches midi sont les gros services. Très souvent un binôme : le chef en cuisine, et un associé ou la patronne en salle. C’est en général la personne de salle qui gère les réservations, les avis et les réseaux sociaux, donc c’est elle qu’il faut convaincre.",
    pains: [
      "Trouver et garder du personnel, surtout des saisonniers fiables pour l’été : chaque absence désorganise un service entier.",
      "Le téléphone qui sonne pour réserver en plein coup de feu : on ne décroche pas, ou on décroche et une assiette attend au passe.",
      "Les réservations non honorées, surtout les tables de groupe un samedi soir d’été : une table vide qu’on a refusée à d’autres.",
      "Les commissions des plateformes de réservation et de livraison, qui grignotent une marge déjà serrée par le prix des produits et de l’énergie.",
      "Les avis injustes ou excessifs sur Google et TripAdvisor, qu’on lit le soir après le service et qui gâchent la nuit.",
      "Une carte qui change avec l’arrivage et la saison, jamais à jour en ligne : le client arrive pour un plat qui n’existe plus.",
      "Une saison courte à rentabiliser, et une activité qui dépend énormément de la météo et du vent.",
    ],
    clientLoss: [
      "Le touriste sur le quai tape « restaurant » ou « huîtres » sur son téléphone et choisit sur la note, le nombre d’avis et les photos des assiettes, souvent sans même regarder la façade.",
      "Le menu n’est pas en ligne, ou c’est un PDF illisible sur téléphone : le client ne sait pas ce qu’il va payer et part chez le voisin qui affiche sa carte.",
      "Impossible de réserver le soir à 23 h depuis le canapé : le client réserve ailleurs, là où c’est possible en deux clics.",
      "Le téléphone sonne dans le vide pendant le service : le client ne rappelle pas, il appelle le suivant sur la liste.",
      "Google indique ouvert alors que le restaurant est fermé pour l’hiver ou le lundi : un client déçu et, souvent, un avis à une étoile.",
      "Des avis négatifs sans réponse, qui laissent le dernier mot au client mécontent aux yeux de tous ceux qui hésitent.",
    ],
    seasonality:
      "Sur le Bassin de Thau, le restaurant vit au rythme de la saison. D’avril à septembre, les quais du canal à Sète, la corniche et les plages de Frontignan et Marseillan se remplissent, les restaurants de plage rouvrent (souvent entre avril et mai) et tournent à plein en juillet-août : le patron n’a plus une minute jusqu’à la Saint-Louis fin août. L’Escale à Sète au printemps des années paires et les grands week-ends de mai sont des pics à part. À Balaruc-les-Bains, les curistes des thermes (mars à décembre) font une belle clientèle du midi, régulière et fidèle. L’hiver est très calme : restaurants de plage fermés, beaucoup de restaurants de quartier fermés deux jours par semaine et en congés en janvier ou février ; seules les huîtres et les fêtes de fin d’année font un vrai pic en décembre. Les meilleures périodes pour prospecter : fin septembre à fin novembre (on fait le bilan de la saison, on a le temps d’écouter) et février à avril (on prépare l’été : carte en ligne, photos, fiche Google, réservation). Pour un restaurant de plage, c’est février-mars ou rien : après l’ouverture, c’est trop tard.",
    digitalHabits:
      "La fiche Google existe presque toujours, avec beaucoup de photos prises par les clients (parfois peu flatteuses) et rarement celles du propriétaire. Beaucoup sont sur TheFork pour la réservation, et les pizzerias et brasseries sur Uber Eats ou Deliveroo pour la livraison. TripAdvisor est encore très regardé par les touristes étrangers. Une page Facebook et un compte Instagram existent souvent, alimentés par un serveur ou un enfant du patron quand il y pense, avec des pics l’été et plus rien l’hiver. Le site internet, quand il existe, est vieux, lent sur téléphone, avec une carte en PDF ou en photo floue. Les réservations se prennent surtout au téléphone et sur un cahier. Les avis sont lus, parfois avec beaucoup d’émotion, mais on y répond rarement, ou à chaud.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site simple où votre carte se lit d’un coup d’œil sur un téléphone, avec vos photos d’assiettes, et un bouton pour réserver directement chez vous. La réservation arrive sans commission, et le téléphone sonne moins pendant le service.",
      },
      {
        offer: "fiche-google",
        pitch:
          "C’est là que les gens choisissent leur restaurant avant de sortir. On remet vos horaires justes, fermeture d’hiver comprise, on met vos vraies photos d’assiettes et votre menu, et on répond aux avis à votre place, calmement, dans votre ton.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "L’arrivage du jour, le plat de la semaine, la terrasse au coucher de soleil : on vient faire les photos une fois par mois, on publie régulièrement, et vous, vous restez en cuisine.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée sur la table ou avec l’addition : le client content approche son téléphone et laisse son avis tout de suite, pendant qu’il est encore content. C’est ce qui fait remonter une note, doucement mais sûrement.",
      },
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit un touriste qui cherche un restaurant ici, je vous compare aux trois tables les plus proches, et je vous laisse trois choses à corriger, dont une que vous pouvez faire seul ce soir. C’est gratuit.",
      },
    ],
    upsell:
      "Après la fiche Google et la carte d’avis, la suite logique est le site vitrine avec menu lisible et réservation en direct, idéalement en place avant avril. Ensuite, la gestion des réseaux sociaux sur la saison, de mars à septembre. Pour un restaurant qui croule sous les appels, un agent IA qui répond aux questions (horaires, allergènes, disponibilités) et prend les réservations la nuit. Pour une pizzeria qui livre beaucoup, un site de commande en ligne en retrait sur place pour reprendre une partie des commandes aux plateformes. Et pour fidéliser la clientèle locale l’hiver, la carte de fidélité digitale.",
  },

  timing: {
    best: [
      {
        label: "Coupure de l’après-midi",
        days: [3, 4, 5],
        from: "15:00",
        to: "17:30",
        why: "Le service du midi est fini, la mise en place du soir n’a pas commencé : le patron est au calme, souvent en train de faire ses commandes.",
      },
      {
        label: "Après-midi de début de semaine",
        days: [1, 2],
        from: "15:00",
        to: "17:00",
        why: "Les restaurants ouverts le lundi ou le mardi y vivent leurs services les plus calmes ; vérifiez sur la fiche Google qu’ils ne sont pas fermés ce jour-là.",
      },
      {
        label: "Téléphone en semaine",
        days: [2, 3, 4],
        from: "15:30",
        to: "17:00",
        why: "La plonge est terminée, l’équipe a mangé, le patron décroche plus volontiers et n’a pas encore la tête au soir.",
      },
    ],
    avoid: [
      {
        label: "Mise en place et livraisons du matin",
        from: "09:00",
        to: "11:30",
        why: "Réception des produits, épluchage, ardoise du jour : tout le monde court et la tête est déjà au midi.",
      },
      {
        label: "Service du midi",
        from: "11:30",
        to: "14:30",
        why: "C’est le cœur du chiffre de la journée : entrer à ce moment, c’est prendre une table sans consommer et passer pour quelqu’un qui ne connaît pas le métier.",
      },
      {
        label: "Mise en place du soir",
        from: "17:30",
        to: "19:00",
        why: "La cuisine se relance, la salle se dresse : le patron n’a plus la tête disponible.",
      },
      {
        label: "Service du soir",
        from: "19:00",
        to: "22:30",
        why: "Deuxième coup de feu de la journée, le plus long en saison : jamais de visite ni d’appel.",
      },
      {
        label: "Week-end",
        days: [0, 6],
        from: "11:00",
        to: "22:30",
        why: "Samedi et dimanche sont les plus gros services, avec des groupes et des familles : ne passez pas, même pendant la coupure.",
      },
    ],
    usuallyClosed: [1, 2],
    phoneNote:
      "Appelez le fixe du restaurant entre 15 h 30 et 17 h en semaine. Pendant la coupure, il arrive que personne ne décroche ou que ce soit un serveur : demandez le prénom du patron et le bon moment pour le joindre. Ne laissez jamais un long message sur le répondeur, rappelez le lendemain à la même heure. N’appelez jamais entre 11 h 30 et 14 h 30 ni après 19 h : vous seriez l’appel qui fait brûler une sauce. Hors saison, vérifiez les jours de fermeture sur la fiche Google avant d’appeler ou de vous déplacer.",
    seasonNote:
      "Prospectez de fin septembre à fin novembre et de février à avril. Pour les restaurants de plage, visez février-mars, avant la réouverture. Oubliez juillet-août jusqu’à la Saint-Louis, les grands week-ends de mai et de Pâques, l’Escale à Sète, et les deux semaines avant les réveillons. En janvier-février, vérifiez les congés annuels avant de vous déplacer.",
  },

  scripts: {
    physique: {
      id: "restaurant-physique",
      title: "Visite pendant la coupure",
      channel: "physique",
      duration: "4 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer pendant la coupure sans déranger, et savoir qui décide pour la salle et la communication.",
          lines: [
            "Bonjour ! Je vois que vous êtes en pause, je ne viens pas manger aujourd’hui, rassurez-vous. Mais la terrasse donne envie, je reviendrai.",
            "Je voulais dire un mot rapide au patron ou à la patronne. C’est vous ?",
            "Pas de souci. Il ou elle est là à quelle heure l’après-midi, en général ? J’en ai pour deux minutes.",
          ],
          tip: "Entrez entre 15 h et 17 h, jamais pendant un service. Si l’équipe mange, attendez qu’ils aient fini ou repassez : on ne coupe pas le repas du personnel.",
          branches: [
            {
              if: "C’est un serveur ou un plongeur",
              then: "Demandez gentiment le prénom du patron et le meilleur moment pour le voir. Laissez votre carte avec un mot manuscrit : « Passé vous voir pour votre fiche Google, je repasse jeudi vers 15 h 30. {prenom} ».",
            },
            {
              if: "Le chef est en cuisine en train de faire ses commandes",
              then: "« Surtout ne le dérangez pas. Et c’est qui qui s’occupe des réservations et des avis, ici ? » Très souvent, c’est la personne de salle qui décide.",
            },
            {
              if: "Le patron est en terrasse avec un café",
              then: "Approchez-vous doucement, présentez-vous debout, sans vous asseoir tant qu’il ne vous y invite pas.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les restaurants du coin à être choisis sur Google, par les touristes comme par les gens d’ici.",
            "Je ne viens rien vous vendre aujourd’hui. En arrivant, j’ai cherché un restaurant ici comme le ferait un touriste, et il y a un détail sur {commerce} qui m’a interpellé. Je peux vous montrer, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} et la recherche « restaurant {ville} » déjà ouvertes sur votre téléphone. Tournez l’écran vers lui.",
          branches: [
            {
              if: "« Je n’ai pas le temps, je fais mes commandes »",
              then: "« Je comprends, c’est le seul moment calme de votre journée. Je repasse jeudi à 15 h 30 ou vendredi à 16 h, qu’est-ce qui vous arrange ? »",
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
          goal: "Montrer UN problème concret et visible, sans juger le restaurant.",
          lines: [
            "Regardez : quand je tape « restaurant » ici, à {ville}, vous sortez après des tables qui ont plus d’avis récents et plus de photos d’assiettes.",
            "Et vos photos, ce sont surtout celles des clients, prises le soir avec un flash. Alors que vos plateaux de fruits de mer, en vrai, ils sont superbes.",
            "Là, votre menu n’apparaît pas sur la fiche : un touriste ne sait pas s’il en aura pour vingt ou pour soixante euros, et c’est souvent là qu’il passe au suivant.",
            "Et ici, un avis un peu dur du mois dernier, sans réponse. Ceux qui hésitent lisent souvent justement celui-là.",
          ],
          tip: "Un seul constat, le plus parlant. Commencez par un compliment sincère : la terrasse, la vue sur le canal, un plat que vous avez vu passer.",
          branches: [
            {
              if: "La fiche est déjà très bien tenue",
              then: "Félicitez sincèrement, puis basculez sur la réservation : « Et quand quelqu’un veut réserver à 23 h depuis son canapé, il fait comment chez vous ? »",
            },
            {
              if: "Il s’énerve sur l’avis négatif",
              then: "« Je comprends, ça fait mal quand on se donne autant. Justement, une réponse calme et polie, c’est souvent ce qui rassure le plus ceux qui lisent. »",
            },
            {
              if: "« Ah bon ? Je ne savais pas »",
              then: "« C’est très courant, Google remplit tout seul avec les photos des clients si personne ne le fait. Ça se reprend en main assez vite. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le patron de ce qui l’embête vraiment.",
          lines: [
            "Aujourd’hui, les réservations, elles arrivent surtout comment : téléphone, TheFork, ou les gens passent directement ?",
            "Pendant le service, quand le téléphone sonne, qui décroche ?",
            "Et l’été, vous avez l’impression que les touristes vous trouvent facilement, ou c’est surtout les habitués et le passage sur le quai ?",
          ],
          tip: "Une seule question, puis silence. Le restaurateur a toujours une histoire à raconter : laissez-le la raconter.",
          branches: [
            {
              if: "Il parle des commissions des plateformes",
              then: "« Justement, l’idée n’est pas de tout arrêter, mais de faire en sorte que ceux qui vous connaissent déjà réservent directement chez vous, sans commission. »",
            },
            {
              if: "Il parle du personnel",
              then: "Écoutez, compatissez, notez. Ne vendez rien là-dessus. Revenez ensuite : « Et côté réservations, ça tourne comme vous voulez ? »",
            },
            {
              if: "Il parle des tables qui ne viennent pas",
              then: "« Une réservation en ligne avec confirmation et rappel la veille, en général, ça limite pas mal ce genre de mauvaise surprise. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose quelque chose de simple : un audit gratuit de ce que voit un client qui vous cherche, comparé aux trois restaurants les plus proches, avec trois choses à corriger en priorité.",
            "Ça prend vingt minutes, pendant votre coupure. Je repasse mardi à 15 h 30 ou jeudi à 16 h, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci pour votre temps. Et je reviendrai goûter, ce n’est pas une formule de politesse.",
          ],
          tip: "Proposez toujours deux créneaux précis pendant la coupure, un jour d’ouverture. Notez le rendez-vous devant lui.",
          branches: [
            {
              if: "« Envoyez-moi ça par mail »",
              then: "« Je préfère vous le montrer sur l’écran, c’est beaucoup plus parlant avec vos concurrents à côté. Vingt minutes, mardi ou jeudi ? »",
            },
            {
              if: "« C’est mon associé qui s’occupe de la salle »",
              then: "« Très bien. Il est là plutôt quand ? Je passe quand vous êtes tous les deux, c’est plus simple pour décider. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte. Si un jour un avis vous empêche de dormir, vous saurez qui appeler. Bon service ce soir. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "restaurant-telephone",
      title: "Appel pendant la coupure",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’on n’appelle pas en plein service.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, à Sète.",
            "Je ne vous dérange pas en pleine mise en place, là ?",
          ],
          tip: "Appelez uniquement entre 15 h 30 et 17 h, un jour d’ouverture. Souriez en parlant, ça s’entend.",
          branches: [
            {
              if: "« Si, on prépare le soir »",
              then: "« Je vous rappelle demain à 15 h 30, ça vous va mieux ? » Et rappelez vraiment à l’heure dite.",
            },
            {
              if: "Il croit que vous appelez pour réserver",
              then: "« Non, pas cette fois, même si c’est tentant. J’appelle au sujet de votre fiche Google, j’en ai pour deux minutes. »",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le patron ou la personne qui gère la salle, ou au moins son prénom et le bon moment.",
          lines: [
            "Je voudrais parler au patron ou à la personne qui s’occupe des réservations et des avis, c’est au sujet de la fiche Google du restaurant.",
            "Vous pouvez me dire son prénom ? Et il est plus facile à joindre à quel moment de l’après-midi ?",
          ],
          tip: "Soyez très aimable avec le serveur qui décroche : c’est lui qui transmettra, ou non, votre message.",
          branches: [
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler un point sur sa fiche Google, les photos et le menu notamment. Ça peut lui faire perdre des tables. »",
            },
            {
              if: "« Il n’est pas là, rappelez »",
              then: "« Merci. Il sera là demain vers 16 h ? Je note son prénom, comme ça je le demande directement. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. En cherchant un restaurant à {ville} comme le ferait un touriste, j’ai vu que votre menu n’apparaît pas sur votre fiche Google, et que la plupart des photos viennent des clients.",
            "C’est souvent sur ces deux points qu’un client hésite et part chez le voisin. On aide les restaurants du Bassin de Thau à corriger ça.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis et vérifiable.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, vos réservations arrivent surtout par téléphone, ou par une plateforme comme TheFork ?",
            "Et la fiche Google, les avis, c’est vous qui vous en occupez, ou quelqu’un de l’équipe ?",
          ],
          tip: "Deux questions maximum au téléphone. Le reste se fera en face, pendant la coupure.",
          branches: [
            {
              if: "« Personne, on n’a pas le temps »",
              then: "« C’est le cas de presque tous les restaurants que je vois. Entre deux services, ce n’est jamais la priorité, et c’est normal. »",
            },
            {
              if: "« On est sur TheFork, ça suffit »",
              then: "« Très bien, on n’y touche pas. Justement, je vous montrerai comment faire réserver en direct ceux qui vous connaissent déjà. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes au restaurant pendant la coupure, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, en vingt minutes, pendant votre coupure. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mercredi à 15 h 30, ou jeudi à 16 h. Qu’est-ce qui vous arrange le mieux ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande : « Ça dépend vraiment de ce dont vous avez besoin, c’est ce qu’on verra ensemble. »",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, ça dépend de votre situation, et je ne veux pas vous dire un chiffre au hasard. Mercredi ou jeudi ? »",
            },
            {
              if: "« Là on est fermés mercredi »",
              then: "« Pas de souci, dites-moi le jour d’ouverture qui vous arrange, vers 15 h 30, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 16 h au restaurant. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un petit SMS de confirmation avec mon nom. Si un imprévu arrive, vous me répondez dessus, tout simplement.",
            "Merci, et bon service ce soir.",
          ],
          tip: "Envoyez le SMS de confirmation dans les cinq minutes, et un rappel la veille, jamais pendant un service.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos réservations arrivent comment : téléphone, TheFork, messages, ou les gens passent directement ?",
      why: "Mesurer la dépendance au téléphone et aux plateformes, et repérer l’ouverture pour une réservation en direct.",
    },
    {
      type: "S",
      question: "Sur une journée d’été, vous diriez que vos clients sont plutôt des habitués, des gens d’ici, ou des touristes de passage ?",
      why: "Savoir d’où vient le chiffre et quel poids ont Google Maps et les avis dans la saison.",
    },
    {
      type: "P",
      question: "Pendant le service, quand le téléphone sonne pour une réservation, comment ça se passe concrètement ?",
      why: "Faire émerger les appels manqués, les erreurs de cahier et le stress en salle.",
    },
    {
      type: "P",
      question: "Ça vous arrive d’avoir des tables réservées qui ne viennent pas, ou des clients qui arrivent pour un plat qui n’est plus à la carte ?",
      why: "Faire toucher du doigt les pertes liées aux réservations non confirmées et au menu pas à jour en ligne.",
    },
    {
      type: "I",
      question: "Si, sur une saison, une partie des touristes qui passent sur le quai choisissent le voisin parce qu’il a plus de photos et d’avis, ça représente combien de couverts pour vous ?",
      why: "Lui faire estimer lui-même le manque à gagner, sans avancer de chiffre à sa place.",
    },
    {
      type: "I",
      question: "Et les commissions de TheFork ou d’Uber Eats sur des clients qui vous connaissaient déjà, sur une année, vous l’avez déjà calculé ?",
      why: "Faire réaliser qu’une partie des commissions est payée sur des clients qui auraient pu réserver en direct.",
    },
    {
      type: "N",
      question: "Si demain vos habitués pouvaient réserver en deux clics chez vous, sans commission, et que votre téléphone sonnait moins pendant le service, qu’est-ce que ça changerait pour vous ?",
      why: "Lui faire formuler lui-même le bénéfice du site avec réservation en direct.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de mon site et de mes réseaux.",
      hidden: "Souvent un prestataire payé il y a des années qu’on ne voit plus, ou un site figé. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous y ayez pensé.",
      questionner: "Il s’occupe de quoi exactement : le site, la fiche Google, les avis ? Et votre carte en ligne, elle a été mise à jour quand pour la dernière fois ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur permet juste de vérifier que ce qui est payé est bien fait, par exemple que le menu est lisible sur un téléphone.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à votre prestataire. S’il corrige tout, tant mieux pour vous. Mercredi 15 h 30 ou jeudi 16 h ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je fais deux services par jour, sept jours sur sept l’été.",
      hidden: "La fatigue et la peur d’ajouter une tâche de plus à une coupure déjà trop courte.",
      accueillir: "Je sais, vos journées sont plus longues que les miennes, et de loin.",
      questionner: "Aujourd’hui, répondre aux avis ou mettre votre carte à jour en ligne, vous le feriez à quel moment de la journée ?",
      recadrer: "C’est exactement l’idée : que ça tourne sans vous. Vous validez une fois, on vient faire les photos pendant la coupure, et c’est nous qui faisons le reste.",
      proposer: "Je vous prends vingt minutes pendant votre coupure, pas plus. Jeudi à 16 h, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, avec le prix du poisson et de l’électricité, je n’ai pas de budget pour ça.",
      hidden: "Une marge vraiment serrée, et surtout il ne voit pas encore ce que ça peut rapporter en couverts.",
      accueillir: "Je comprends, avec ce que coûtent les produits aujourd’hui, chaque euro compte.",
      questionner: "Combien de tables en plus par semaine il faudrait, selon vous, pour que ça vaille le coup ?",
      recadrer: "On a des solutions qui démarrent très petit, au mois, et une partie de l’audit, vous pouvez la faire seul gratuitement. En général, quelques couverts de plus par mois suffisent à s’y retrouver, et sans commission.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "neveu",
      objection: "C’est mon fils, ou un serveur, qui fait l’Instagram, ça va très bien.",
      hidden: "L’envie de ne pas dépenser et la confiance dans l’équipe. Souvent, ça tient l’été et ça s’arrête dès septembre.",
      accueillir: "C’est bien d’avoir quelqu’un de motivé dans l’équipe, c’est précieux.",
      questionner: "Il s’occupe aussi de la fiche Google, des réponses aux avis et des horaires d’hiver ? Et quand il part en fin de saison, qui prend le relais ?",
      recadrer: "Publier de temps en temps, c’est une chose. Ce qui fait la différence, c’est la régularité toute l’année et la fiche Google, et c’est souvent ce qui lâche quand la saison se termine.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et si un jour il n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "instagram-suffit",
      objection: "J’ai mon Instagram et ma page Facebook, ça me suffit.",
      hidden: "Le sentiment d’avoir déjà fait sa part du digital, et de voir des « j’aime » qui rassurent.",
      accueillir: "C’est très bien, vos habitués vous y suivent sûrement, et ça fait plaisir de voir vos plats.",
      questionner: "Et un touriste qui arrive sur le quai à 19 h et ne vous connaît pas, il tape quoi sur son téléphone pour choisir où manger ?",
      recadrer: "Instagram parle à ceux qui vous suivent déjà. Celui qui ne vous connaît pas cherche en général sur Google Maps, compare les notes et les photos, et décide en une minute.",
      proposer: "Gardez Instagram, on ne touche à rien. Je vous montre juste ce que voit ce touriste-là, vingt minutes, mercredi ou jeudi pendant la coupure ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici on est connus, ça marche au bouche-à-oreille depuis vingt ans.",
      hidden: "La fierté d’une réputation construite, et l’impression que le digital, c’est pour les restaurants qui ont besoin de se vendre.",
      accueillir: "Et c’est la meilleure des réputations, vous avez raison d’en être fier.",
      questionner: "Quand un client vous recommande à un ami, vous savez ce que fait cet ami juste après ?",
      recadrer: "En général, il vérifie sur Google : l’adresse, les photos, le menu, les avis. Les avis, c’est le bouche-à-oreille d’aujourd’hui, écrit et lu par tout le monde, y compris les touristes.",
      proposer: "La carte d’avis sur la table, c’est exactement ça : faire parler vos clients contents au moment où ils le sont. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi après la saison, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai coup de feu à cet instant.",
      accueillir: "Bien sûr, je ne veux surtout pas vous déranger en pleine saison.",
      questionner: "Pour vous rappeler au bon moment, votre coupure la plus calme, c’est plutôt le mercredi ou le jeudi ?",
      recadrer: "Un mail, honnêtement, il va se perdre entre les factures fournisseurs. Ce que j’ai à vous montrer tient sur un écran, en face c’est beaucoup plus clair, et l’hiver se prépare maintenant pour l’été.",
      proposer: "Je passe jeudi à 16 h, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "thefork-suffit",
      objection: "TheFork et Uber Eats me suffisent, les clients me trouvent déjà là-dessus.",
      hidden: "Il a délégué sa visibilité aux plateformes et n’a pas envie de gérer un outil de plus. Souvent, il grogne sur les commissions mais ne voit pas d’alternative.",
      accueillir: "C’est vrai, ces plateformes amènent du monde, surtout des touristes. Vous avez eu raison d’y aller.",
      questionner: "Et vos habitués, ceux qui vous connaissent déjà, ils réservent aussi par TheFork ? Vous payez la commission sur eux aussi ?",
      recadrer: "L’idée n’est pas de quitter les plateformes, mais de ne plus leur laisser vos propres clients. Avec une réservation en direct sur votre site et votre fiche Google, ceux qui vous connaissent réservent chez vous, et les données clients restent à vous.",
      proposer: "Je vous montre en vingt minutes comment ça s’articule avec TheFork, sans rien casser. Mercredi 15 h 30 ou jeudi 16 h ?",
    },
  ],

  proofs: [
    "En général, un touriste qui cherche où manger compare la note, le nombre d’avis et les photos sur Google Maps avant de choisir, souvent sans même voir la façade.",
    "Un menu lisible sur téléphone, avec les prix, rassure : beaucoup de clients préfèrent savoir ce qu’ils vont payer avant de s’asseoir.",
    "Les photos d’assiettes publiées par le restaurant lui-même donnent en général une bien meilleure image que les photos prises au flash par les clients.",
    "Répondre aux avis, y compris aux négatifs, calmement et en deux lignes, montre qu’il y a quelqu’un derrière et rassure ceux qui hésitent.",
    "Les clients contents laissent rarement un avis d’eux-mêmes ; leur demander au bon moment, avec l’addition, rééquilibre souvent une note.",
    "Une réservation en direct, c’est une réservation sans commission, et un client dont vous gardez le contact.",
    "Des horaires justes, fermeture hebdomadaire et congés d’hiver compris, c’est la correction la plus simple et celle qui évite le plus d’avis à une étoile.",
  ],

  buyingSignals: [
    "Il sort son propre téléphone pour regarder sa fiche Google ou ses avis avec vous.",
    "Il vous lit ou vous raconte un avis injuste qui l’a touché.",
    "Il se plaint spontanément des commissions de TheFork, d’Uber Eats ou de Deliveroo.",
    "Le chef sort de la cuisine pour écouter, ou la patronne vient s’asseoir à la table.",
    "Question : « Et le menu, je pourrais le changer moi-même quand l’arrivage change ? »",
    "« Et les réservations en ligne, ça marche comment avec mon cahier ? »",
    "Il parle d’un projet : reprise récente, nouvelle terrasse, nouveau chef, travaux, ouverture de la saison à préparer.",
    "Il demande si vous travaillez déjà avec d’autres restaurants du quai ou du coin.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "TheFork",
      "Uber Eats",
      "Deliveroo",
      "TripAdvisor",
      "Instagram",
      "Facebook",
      "PagesJaunes",
      "Site internet",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, les horaires sont-ils justes (jours de fermeture hors saison, fermeture d’hiver, services midi et soir) ?",
      "Le menu est-il visible sur la fiche Google et sur le site, avec les prix, et est-il lisible sur un téléphone (pas un PDF ou une photo floue) ?",
      "Combien d’avis sur Google et sur TripAdvisor, quelle note, de quand date le dernier avis, et le gérant y répond-il (et sur quel ton) ?",
      "Que reprochent les avis négatifs : attente, accueil, prix, fraîcheur, bruit, réservation non respectée ?",
      "Les photos sont-elles publiées par le propriétaire ou par les clients, et montrent-elles les plats, la salle, la terrasse ou la vue ?",
      "Le restaurant est-il sur TheFork, Uber Eats ou Deliveroo, et peut-on réserver ou commander en direct sans passer par une plateforme ?",
      "Sur la recherche « restaurant {ville} » ou sur sa spécialité (huîtres, fruits de mer, pizza, brasserie), où sort {commerce} par rapport aux trois tables les plus proches ?",
      "Y a-t-il un compte Instagram ou Facebook, et de quand date la dernière publication, notamment hors saison ?",
      "Y a-t-il un atout à valoriser : vue sur le canal ou la mer, producteur local, huîtres de Bouzigues, fait maison, titre ou guide ?",
      "Des avis mentionnent-ils un changement de propriétaire, de chef ou une réouverture récente ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les restaurants du Bassin de Thau à être la table qu’on choisit quand on cherche où manger sur son téléphone, touristes comme gens d’ici. En général, ça se joue sur trois choses : un menu lisible, de vraies photos d’assiettes et des avis récents avec des réponses. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes pendant votre coupure, gratuitement, mercredi ou jeudi ?",

  compliance:
    "Sur un menu en ligne, un site ou une fiche Google, l’information sur les 14 allergènes réglementaires doit être disponible : les indiquer par plat ou préciser clairement comment l’obtenir. La mention « fait maison » (et son logo) ne s’emploie que pour des plats réellement élaborés sur place à partir de produits bruts : ne jamais l’ajouter de notre propre initiative. L’origine des viandes bovines doit être indiquée. Pour les vins et cocktails, la loi Évin s’applique aussi en ligne : rester sur des informations objectives (appellation, origine, prix), sans associer l’alcool à la fête ou à la séduction, avec le message « L’abus d’alcool est dangereux pour la santé, à consommer avec modération ». Les faux avis et les avis achetés sont interdits (pratique commerciale trompeuse) et Google interdit de récompenser un client en échange d’un avis : la carte NFC sert à faciliter l’avis, jamais à l’acheter ni à le filtrer. Avant de publier une photo où l’on reconnaît un client ou un salarié, demander son accord écrit.",
};

export default sheet;
