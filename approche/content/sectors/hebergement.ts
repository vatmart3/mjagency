import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "hebergement",
  name: "Hôtel, camping et location saisonnière",
  short: "Hébergement",
  examples: [
    "hôtel indépendant",
    "camping de Marseillan-plage ou de Frontignan",
    "chambres d’hôtes",
    "gîte et meublé de tourisme",
    "conciergerie de locations saisonnières",
    "résidence pour curistes à Balaruc-les-Bains",
  ],
  tagline:
    "Ils remplissent l’été sans effort, mais chaque réservation Booking ou Airbnb leur coûte une commission : la réservation directe, c’est leur marge.",

  reality: {
    rhythm:
      "En saison (juin à septembre), tout se joue entre 8 h et 11 h pour les départs, le ménage et les petits-déjeuners, puis de 16 h à 19 h pour les arrivées : c’est le coup de feu, le téléphone sonne, les clients cherchent le code de la boîte à clés. Entre les deux, l’exploitant gère le linge, les pannes, les messages Booking et Airbnb, souvent depuis son téléphone. Le soir, il répond encore aux questions des futurs clients (« il y a un parking ? », « on peut venir avec le chien ? »). Hors saison, le rythme retombe complètement : les campings ferment de novembre à mars, les hôtels tournent au ralenti, et c’est le moment où l’on fait les travaux, les comptes, et où l’on réfléchit à la saison suivante. À Balaruc, les résidences pour curistes suivent un rythme à part : des séjours de trois semaines, de mars à décembre, avec des arrivées très régulières.",
    pains: [
      "Les commissions des plateformes : sur chaque nuit vendue via Booking ou Airbnb, une part non négligeable part en frais, et ça pèse lourd sur une saison.",
      "Les mêmes questions répétées toute la journée par message et par téléphone : horaires d’arrivée, parking, animaux, draps fournis ou pas, distance de la plage.",
      "Un site ancien ou inexistant, qui ne permet pas de réserver directement : le client qui l’a trouvé repart sur Booking pour réserver.",
      "Les annulations de dernière minute et les no-shows, difficiles à gérer sans conditions claires et sans acompte.",
      "Le calendrier à synchroniser entre plusieurs plateformes, avec la peur permanente de la double réservation.",
      "Les avis : un seul avis négatif sur la propreté ou le bruit peut peser sur tout le reste de la saison.",
      "Les ailes de saison (mai, juin, septembre, octobre) difficiles à remplir, alors que l’été affiche complet.",
    ],
    clientLoss: [
      "Le client trouve l’établissement sur Google, clique sur le site, ne voit ni prix ni disponibilités, et va réserver ailleurs ou sur une plateforme.",
      "Une question envoyée le soir reste sans réponse jusqu’au lendemain : entre-temps, le client a réservé chez le voisin.",
      "Des photos datées ou sombres qui ne montrent pas la vraie qualité des chambres ou des emplacements.",
      "Une fiche Google avec des horaires faux ou une mauvaise catégorie (« camping » au lieu de « camping avec mobil-homes », par exemple).",
      "Aucun lien avec les anciens clients : ceux qui ont adoré leur séjour ne reçoivent jamais rien pour revenir en direct l’année suivante.",
      "Pour les curistes, l’absence d’informations pratiques claires (distance des thermes, navette, séjour de trois semaines, tarifs cure) : ils appellent, tombent sur la messagerie, et passent à la résidence suivante.",
    ],
    seasonality:
      "Sur le Bassin de Thau, la saison fait tout : l’essentiel du chiffre d’affaires se fait en juillet-août, avec des ailes de saison de mai à septembre. Les campings de Marseillan-plage et de Frontignan ferment généralement de novembre à mars. Les hôtels de Sète vivent aussi des événements (Escale à Sète au printemps les années paires, la Saint-Louis fin août) et d’une clientèle affaires à l’année vers Montpellier. À Balaruc-les-Bains, les thermes font tourner les résidences et hôtels de mars à décembre avec une clientèle de curistes fidèles, souvent plus âgés, qui réservent longtemps à l’avance et d’une année sur l’autre. Pour prospecter, l’hiver est le seul moment où ils ont vraiment la tête à investir.",
    digitalHabits:
      "Presque tous sont sur Booking et/ou Airbnb, souvent Abritel pour les locations. La fiche Google existe mais est rarement travaillée. Le site, quand il existe, a souvent été fait il y a des années, sans moteur de réservation, ou avec un simple formulaire de contact. Beaucoup gèrent tout depuis les applications des plateformes sur leur téléphone. Les conciergeries sont plus équipées (logiciel de gestion, channel manager) mais peu visibles sur Google en leur nom propre. Instagram est utilisé par les chambres d’hôtes et quelques hôtels de charme, de façon irrégulière.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site avec réservation directe, c’est une nuit vendue sans commission. On ne vous demande pas de quitter Booking : on vous aide à récupérer en direct les clients qui vous connaissent déjà, ceux qui reviennent et ceux qui vous trouvent sur Google.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Les questions sur le parking, le chien, l’heure d’arrivée, vous les avez cent fois par saison. Un assistant y répond à votre place, jour et nuit, sur votre site ou sur WhatsApp, et vous passe la main dès que c’est une vraie demande de réservation.",
      },
      {
        offer: "site-premium",
        pitch:
          "Pour un hôtel de charme ou une belle maison d’hôtes, le site, c’est la première impression. Un site premium avec de vraies photos et la réservation intégrée permet de vendre votre ambiance, pas juste un prix à la nuit comme sur une plateforme.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je vous propose un audit gratuit de vingt minutes : on regarde ensemble ce que voit un client qui vous cherche sur Google, et combien de réservations passent par les plateformes alors qu’elles pourraient venir en direct.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Beaucoup de voyageurs tapent le nom de l’établissement sur Google avant de réserver. Si votre fiche est complète, avec de belles photos et un lien vers la réservation directe, une partie d’entre eux réserve chez vous plutôt que sur la plateforme.",
      },
    ],
    upsell:
      "Après le site ou la fiche Google : la carte NFC d’avis à la réception pour récolter des avis Google au moment du départ, l’agent IA pour absorber les questions de la saison, puis un fichier d’anciens clients relancés chaque hiver pour réserver en direct l’été suivant. Pour les conciergeries et les campings, un logiciel sur mesure (planning ménage, états des lieux, check-in) peut suivre.",
  },

  timing: {
    best: [
      {
        label: "Fin de matinée en semaine",
        days: [1, 2, 3, 4, 5],
        from: "10:00",
        to: "12:00",
        why: "Les départs et le ménage sont passés, les arrivées ne commencent pas avant l’après-midi : le gérant a une vraie fenêtre de calme.",
      },
      {
        label: "Début d’après-midi en semaine",
        days: [1, 2, 3, 4],
        from: "14:00",
        to: "16:00",
        why: "Avant le rush des arrivées, la réception est calme et le gérant est souvent sur place pour l’administratif.",
      },
      {
        label: "Mardi et jeudi en hiver",
        days: [2, 4],
        from: "10:00",
        to: "11:30",
        why: "D’octobre à mars, en milieu de semaine, les exploitants préparent la saison suivante et sont réceptifs aux idées pour réduire les commissions.",
      },
    ],
    avoid: [
      {
        label: "Heures d’arrivée",
        from: "16:00",
        to: "19:00",
        why: "C’est le coup de feu des check-in : personne n’a une minute, et vous passeriez pour quelqu’un qui ne connaît pas le métier.",
      },
      {
        label: "Départs et petits-déjeuners",
        from: "07:30",
        to: "10:00",
        why: "Petits-déjeuners, départs, états des lieux, lancement du ménage : c’est la matinée la plus chargée.",
      },
      {
        label: "Week-ends",
        days: [5, 6, 0],
        from: "15:00",
        to: "20:00",
        why: "Le vendredi et le samedi concentrent les rotations : grosse charge, zéro disponibilité.",
      },
    ],
    usuallyClosed: [],
    phoneNote:
      "Appelez le numéro de la réception, pas le portable perso trouvé sur une plateforme. Présentez-vous tout de suite comme une agence locale et pas comme un client, sinon vous grillez la confiance. Dans un hôtel, demandez le propriétaire ou le directeur ; dans un camping, le gérant ; dans une conciergerie, la personne qui gère le développement. Jamais d’appel en juillet-août.",
    seasonNote:
      "Prospectez d’octobre à mars : c’est le seul moment où les exploitants ont du temps et réfléchissent à la saison suivante. Octobre-novembre, ils font le bilan de l’été et voient ce que les commissions leur ont coûté : c’est le meilleur moment. Janvier-février, ils préparent l’ouverture : on peut encore livrer un site à temps. Oubliez complètement juillet et août, et évitez avril à juin sauf pour une relance déjà prévue. Pour les résidences de curistes à Balaruc, visez décembre à février, quand les thermes sont fermés.",
  },

  scripts: {
    physique: {
      id: "hebergement-physique",
      title: "Visite à la réception (hors saison)",
      channel: "physique",
      duration: "4 à 7 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Savoir en quelques secondes si la personne à l’accueil est le propriétaire ou un salarié, et obtenir le bon interlocuteur.",
          lines: [
            "Bonjour ! Je ne suis pas là pour une chambre, rassurez-vous. {prenom}, de MJAGENCY, on est une agence web à Sète.",
            "C’est vous qui gérez {commerce}, ou je peux voir le propriétaire ?",
            "Je ne veux pas vous prendre de temps pendant un check-in : c’est un bon moment, là, ou je repasse ?",
          ],
          tip: "Regardez l’accueil en entrant : présentoir de flyers, affiche Booking ou Airbnb, écran avec le planning, QR code d’avis. Ce sont vos munitions pour l’étape du constat.",
          branches: [
            {
              if: "C’est un salarié et le patron n’est pas là",
              then: "Pas de souci. Il passe à quelle heure en général ? Je peux vous laisser ma carte avec un petit mot pour lui : c’est à propos des réservations en direct, il comprendra.",
            },
            {
              if: "Des clients arrivent à la réception",
              then: "Faites un pas de côté et dites : Je vous laisse, occupez-vous d’eux. Puis attendez tranquillement, ou proposez de repasser.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Donner une raison concrète d’écouter : moins de commissions, moins de questions répétitives.",
          lines: [
            "On aide les hôtels et les campings du coin à prendre plus de réservations en direct, pour payer moins de commissions à Booking et Airbnb.",
            "Je ne vous demande pas de quitter les plateformes : juste de récupérer les clients qui vous connaissent déjà.",
          ],
          tip: "Parlez calmement et souriez : l’exploitant est démarché toute l’année par des plateformes et des channel managers. Montrez que vous êtes local et que vous comprenez son métier.",
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer que vous avez regardé sa présence en ligne avant de venir, sans juger.",
          lines: [
            "J’ai regardé {commerce} sur Google avant de venir : vous avez de très bons avis, franchement.",
            "Par contre, quand je clique pour réserver, je ne peux pas le faire en direct : on me renvoie vers Booking, ou il n’y a qu’un formulaire.",
            "Et les photos sur la fiche Google datent un peu, elles ne rendent pas justice à ce que je vois ici.",
            "Pour les curistes, je n’ai pas trouvé les infos sur les séjours de trois semaines : c’est souvent la question qu’ils se posent en premier.",
          ],
          tip: "Choisissez un seul constat, le plus parlant, et formulez-le comme une observation de client, jamais comme une critique. Adaptez : la ligne curistes ne vaut qu’à Balaruc.",
          branches: [
            {
              if: "Il a déjà un site avec réservation directe",
              then: "Très bien, vous êtes en avance sur beaucoup. Et vous avez une idée de la part de réservations qui passe par le site, par rapport aux plateformes ?",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le propriétaire de ses commissions ou de sa charge de messages, avec ses propres mots.",
          lines: [
            "Sur une saison, à peu près, combien de vos réservations passent par Booking ou Airbnb, et combien en direct ?",
            "Et les clients qui reviennent chaque année, ils réservent comment ?",
            "Les questions par message, le soir, c’est vous qui y répondez ?",
          ],
          tip: "Posez une question, puis taisez-vous. S’il se met à calculer ses commissions à voix haute, laissez-le faire : c’est lui qui se convainc.",
          branches: [
            {
              if: "Il dit que presque tout passe par les plateformes",
              then: "C’est ce qu’on voit souvent. Et les habitués, ceux qui reviennent, ils repassent aussi par la plateforme ? Parce que ceux-là, vous pourriez les avoir en direct.",
            },
            {
              if: "Il se plaint des messages le soir",
              then: "Et en saison, ça représente combien de temps par jour, à votre avis ? Il existe des assistants qui répondent aux questions pratiques à votre place, je peux vous montrer comment ça marche.",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous daté, ou au minimum un accord pour l’audit gratuit.",
          lines: [
            "Je vous propose quelque chose de simple : un audit gratuit de vingt minutes, où je vous montre ce que voit un voyageur qui vous cherche, et ce qu’on peut récupérer en direct.",
            "C’est le bon moment, avant la saison. Mardi 10 h ou jeudi 14 h 30, ça vous irait ?",
            "Je vous laisse ma carte. Je note votre numéro pour vous envoyer la confirmation ?",
          ],
          tip: "Ne parlez pas de prix. Si l’hiver est calme chez lui, proposez de faire l’audit sur place, dans son salon ou à la réception : c’est plus concret.",
          branches: [
            {
              if: "Il hésite ou dit qu’il doit réfléchir",
              then: "Bien sûr. L’audit ne vous engage à rien, c’est juste un état des lieux. Je vous le propose pour que vous ayez les chiffres en main avant de décider quoi que ce soit.",
            },
            {
              if: "Il dit oui tout de suite",
              then: "Parfait. Préparez juste, si vous l’avez, votre nombre de réservations de l’été dernier par plateforme : on regardera ensemble ce que ça représente.",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "hebergement-telephone",
      title: "Appel à la réception (hors saison)",
      channel: "telephone",
      duration: "2 à 4 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement comme une agence locale, pas comme un client.",
          lines: [
            "Bonjour, {prenom} de MJAGENCY, une agence web à Sète. Je ne vous appelle pas pour une réservation, rassurez-vous.",
            "Je cherche à parler au propriétaire ou au gérant de {commerce}, c’est bien vous ?",
          ],
          tip: "Souriez en parlant, ça s’entend. Dites tout de suite que vous n’êtes pas un client : le réceptionniste respectera votre honnêteté.",
        },
        {
          id: "barrage",
          title: "Passer la réception",
          goal: "Obtenir le décideur ou le bon moment pour le rappeler, avec l’aide du réceptionniste.",
          lines: [
            "C’est au sujet des réservations en direct et des commissions des plateformes. C’est plutôt le propriétaire qui voit ça, non ?",
            "Il est joignable à quel moment en général, en fin de matinée ?",
            "Vous pouvez me donner son prénom, pour que je le demande directement la prochaine fois ?",
          ],
          tip: "Le réceptionniste est un allié, pas un obstacle. Notez son prénom et remerciez-le : c’est lui qui transmettra votre message.",
          branches: [
            {
              if: "On vous répond d’envoyer un mail",
              then: "Avec plaisir. Je l’envoie à quelle adresse, et à l’attention de qui ? Je rappellerai ensuite pour savoir s’il l’a bien reçu.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison d’écouter en une phrase.",
          lines: [
            "Merci de me prendre. On aide les hôtels et les campings du Bassin de Thau à prendre plus de réservations en direct, sans quitter Booking ni Airbnb.",
            "Je voulais vous proposer un audit gratuit de votre présence en ligne, avant la prochaine saison.",
          ],
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser deux questions maximum pour qualifier : part des plateformes et réservation directe.",
          lines: [
            "Aujourd’hui, vos réservations passent surtout par les plateformes, ou vous en avez une bonne part en direct ?",
            "Et sur votre site, un client peut réserver directement, ou il doit vous écrire ?",
          ],
          tip: "Ne creusez pas trop au téléphone. Deux questions, vous reformulez, et vous passez au rendez-vous.",
          branches: [
            {
              if: "Il donne une réponse précise sur ses commissions",
              then: "D’accord, c’est une somme sur une saison. Justement, c’est exactement ce qu’on regarde pendant l’audit.",
            },
            {
              if: "Il demande combien ça coûte",
              then: "Ça dépend vraiment de ce que vous avez déjà ; l’audit est gratuit, et c’est lui qui dira s’il y a quelque chose à faire. Je préfère ne pas vous donner un chiffre au hasard.",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Proposer deux créneaux précis.",
          lines: [
            "Je vous propose de passer vous montrer ça, vingt minutes, sur place. Mardi à 10 h 30 ou jeudi à 14 h 30, qu’est-ce qui vous arrange le mieux ?",
            "Si vous préférez, on peut aussi le faire en visio, même durée.",
          ],
          tip: "Ne parlez jamais de prix au téléphone : vous vendez le rendez-vous, rien d’autre.",
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et préparer la rencontre.",
          lines: [
            "Parfait, je note jeudi à 14 h 30 à {commerce}. Je vous envoie un SMS de confirmation sur ce numéro ?",
            "Si vous avez sous la main le nombre de réservations de l’été dernier par plateforme, ce sera utile, mais ce n’est pas obligatoire.",
            "Merci beaucoup, bonne fin de journée !",
          ],
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, comment se répartissent vos réservations entre Booking, Airbnb, votre site et le téléphone ?",
      why: "Mesurer sa dépendance aux plateformes et savoir s’il existe déjà un canal direct.",
    },
    {
      type: "S",
      question: "Vos clients fidèles, ceux qui reviennent chaque année ou les curistes, ils réservent comment ?",
      why: "Identifier les réservations qui pourraient passer en direct sans effort commercial.",
    },
    {
      type: "P",
      question: "Qu’est-ce qui vous prend le plus de temps en saison, en dehors de l’accueil et du ménage ?",
      why: "Faire émerger la charge des messages, des questions répétées et du calendrier.",
    },
    {
      type: "P",
      question: "Il vous arrive de perdre une réservation parce que vous n’avez pas pu répondre assez vite, le soir ou pendant les arrivées ?",
      why: "Faire prendre conscience du coût d’une réponse tardive.",
    },
    {
      type: "I",
      question: "Si vous faites le calcul sur l’été dernier, les commissions sur les clients qui vous connaissaient déjà, ça représente quoi ?",
      why: "Lui faire chiffrer lui-même ce que coûte la dépendance aux plateformes, sans qu’on avance de chiffre.",
    },
    {
      type: "I",
      question: "Et si les ailes de saison restent aussi calmes, qu’est-ce que ça change pour votre année ?",
      why: "Relier le problème de visibilité à sa rentabilité globale.",
    },
    {
      type: "N",
      question: "Si une partie de vos habitués réservait directement sur votre site l’été prochain, qu’est-ce que ça vous permettrait de faire ?",
      why: "Le laisser formuler lui-même le bénéfice : marge, investissement, moins de dépendance.",
    },
  ],

  objections: [
    {
      id: "booking-remplit",
      objection: "Booking me remplit déjà, je n’ai pas besoin d’autre chose.",
      hidden: "Peur de perdre le volume des plateformes, ou de devoir gérer un canal de plus.",
      accueillir: "C’est une très bonne chose d’être plein, beaucoup aimeraient être à votre place.",
      questionner: "Et parmi ces clients, combien vous connaissaient déjà, ou reviennent d’une année sur l’autre ?",
      recadrer: "On ne vous propose pas de quitter Booking : il vous apporte des nouveaux clients, c’est son rôle. L’idée, c’est de ne plus payer de commission sur ceux qui vous cherchent déjà par votre nom.",
      proposer: "Je vous propose l’audit gratuit : on regarde ensemble combien de réservations pourraient passer en direct, et vous décidez ensuite.",
    },
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de mon site.",
      hidden: "Fidélité à un prestataire, ou gêne de reconnaître que le site ne rapporte pas grand-chose.",
      accueillir: "Très bien, c’est important d’avoir quelqu’un de confiance.",
      questionner: "Et aujourd’hui, votre site vous permet de prendre des réservations en direct, avec paiement ou acompte ?",
      recadrer: "Si c’est le cas, parfait. Sinon, ce n’est pas une question de prestataire, c’est une question de fonctionnalité : on peut même travailler avec la personne qui s’en occupe.",
      proposer: "L’audit est gratuit et ne remet personne en cause. Vous pourrez même le transmettre à votre prestataire.",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps pour ça.",
      hidden: "Surcharge réelle, ou peur d’un projet qui va lui prendre des heures.",
      accueillir: "Je comprends, dans l’hébergement, on n’a jamais vraiment de temps libre.",
      questionner: "Ce qui vous prend le plus de temps, ce ne serait pas justement les messages et les questions des clients ?",
      recadrer: "Justement, ce qu’on met en place est fait pour vous en faire gagner : c’est nous qui faisons le travail, vous validez.",
      proposer: "Vingt minutes cet hiver, au moment où c’est calme. Mardi 10 h ou jeudi 14 h 30 ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, je ne peux pas investir en ce moment.",
      hidden: "Trésorerie tendue après la saison, ou pas encore convaincu du retour.",
      accueillir: "C’est normal de faire attention, surtout après la saison et avant les travaux d’hiver.",
      questionner: "Vous avez une idée de ce que vous avez payé en commissions l’été dernier ?",
      recadrer: "L’objectif n’est pas une dépense de plus : c’est de récupérer une partie de ce qui part en commissions. Et on peut étaler en mensualités pour que ça reste léger.",
      proposer: "On commence par l’audit gratuit, et on regarde ensemble si le calcul tient pour vous. Si ce n’est pas rentable, je vous le dirai.",
    },
    {
      id: "neveu",
      objection: "Mon neveu s’y connaît, il va me faire un site.",
      hidden: "Envie d’économiser, attachement familial.",
      accueillir: "C’est bien d’avoir quelqu’un de la famille qui s’y connaît.",
      questionner: "Il a prévu la réservation en ligne avec synchronisation du calendrier Booking et Airbnb ?",
      recadrer: "Un site pour un hébergement, c’est surtout un moteur de réservation, un calendrier synchronisé, des conditions d’annulation claires : c’est là que les doubles réservations arrivent si c’est mal fait.",
      proposer: "Faites l’audit avec nous : vous aurez une liste claire des points à prévoir, que vous pourrez donner à votre neveu si vous restez avec lui.",
    },
    {
      id: "pas-besoin",
      objection: "Avec Instagram et les plateformes, je n’ai pas besoin d’un site.",
      hidden: "Ne voit pas la différence entre visibilité et réservation directe.",
      accueillir: "Instagram, c’est très bien pour montrer l’ambiance, vous avez raison.",
      questionner: "Quand quelqu’un vous découvre sur Instagram, il réserve comment ensuite ?",
      recadrer: "Souvent, il va sur Booking, et vous payez la commission sur un client que vous avez trouvé vous-même. Le site, c’est l’endroit où il peut réserver chez vous directement.",
      proposer: "Je vous montre pendant l’audit comment on relie votre Instagram à une page de réservation directe.",
    },
    {
      id: "bouche-a-oreille",
      objection: "Mes clients reviennent par le bouche-à-oreille, ça marche très bien.",
      hidden: "Satisfaction réelle, mais n’a pas mesuré combien de ces clients passent quand même par une plateforme.",
      accueillir: "C’est le plus beau compliment, des clients qui reviennent et qui en parlent.",
      questionner: "Et ceux qui vous recommandent, ils disent à leurs amis de réserver comment ?",
      recadrer: "Bien souvent, l’ami tape votre nom, tombe sur Booking en premier, et réserve là. Le bouche-à-oreille marche, mais c’est la plateforme qui encaisse la commission.",
      proposer: "On peut vérifier ensemble ce que trouve quelqu’un qui tape {commerce} sur Google, ça prend deux minutes.",
    },
    {
      id: "rappelez-moi",
      objection: "Envoyez-moi un mail, je regarderai.",
      hidden: "Politesse pour clore l’échange, ou vraie volonté mais pas le moment.",
      accueillir: "Avec plaisir, je vous envoie ça.",
      questionner: "Pour que le mail vous soit vraiment utile, c’est plutôt la question des commissions ou celle des messages clients qui vous intéresse ?",
      recadrer: "Un mail, on le lit entre deux arrivées et on l’oublie. Vingt minutes ensemble, vous repartez avec vos chiffres.",
      proposer: "Je vous envoie le mail aujourd’hui, et je vous propose déjà un créneau : mardi 10 h ou jeudi 14 h 30 ? Vous pourrez toujours décaler.",
    },
  ],

  proofs: [
    "En général, une bonne partie des voyageurs regardent la fiche Google et le site de l’établissement avant de réserver, même quand ils finissent sur une plateforme.",
    "Les clients qui reviennent d’une année sur l’autre sont souvent prêts à réserver en direct, à condition que ce soit aussi simple que sur Booking.",
    "Une réservation en direct, c’est une nuit sans commission : sur une saison, l’économie peut devenir réelle, même avec une petite part de réservations directes.",
    "Répondre vite aux questions, surtout le soir, fait souvent la différence entre deux hébergements comparables.",
    "Des photos récentes et lumineuses sur la fiche Google et le site changent en général la perception de la qualité, avant même de lire les avis.",
    "Avoir ses propres coordonnées clients permet de les relancer l’hiver pour la saison suivante, ce que les plateformes ne permettent pas.",
    "Pour les curistes, qui réservent souvent longtemps à l’avance, une page claire avec les infos pratiques rassure et évite beaucoup d’appels.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour vous montrer ses relevés de commissions ou son tableau de réservations.",
    "Il demande si le site peut se synchroniser avec son calendrier Booking ou Airbnb.",
    "Il évoque la saison prochaine avec des dates précises : ouverture, travaux, nouveaux mobil-homes.",
    "Il se plaint spontanément des messages du soir ou des mêmes questions répétées.",
    "Il vous demande combien de temps il faut pour mettre en place un site avant l’ouverture.",
    "Il parle de ses habitués ou de ses curistes fidèles, et de comment les garder.",
    "Il appelle son associé ou son conjoint pour qu’il vienne écouter.",
    "Il demande si on peut gérer l’acompte ou le paiement en ligne.",
  ],

  research: {
    platforms: [
      "Google (fiche établissement, Google Hotels)",
      "Booking.com",
      "Airbnb",
      "Abritel",
      "TripAdvisor",
      "Office de tourisme (Archipel de Thau, Sète, Frontignan, Balaruc-les-Bains, Marseillan)",
      "Instagram",
      "Site internet de l’établissement",
    ],
    questions: [
      "L’établissement propose-t-il la réservation directe sur son site, avec disponibilités et paiement ou acompte ?",
      "Sur quelles plateformes est-il présent (Booking, Airbnb, Abritel), avec quelle note et combien d’avis sur chacune ?",
      "La fiche Google est-elle complète : photos récentes, catégorie exacte, lien vers le site, prix affichés dans Google Hotels ?",
      "Quels sont les reproches récurrents dans les avis (propreté, bruit, accueil, parking, réponse aux messages) ?",
      "Le propriétaire répond-il aux avis sur Google et sur les plateformes ? Dans quel ton ?",
      "L’établissement est-il référencé sur le site de l’office de tourisme local, avec des informations à jour ?",
      "Pour une résidence à Balaruc : les informations curistes (séjours de trois semaines, distance des thermes, tarifs) sont-elles visibles ?",
      "Pour un meublé de tourisme : le numéro d’enregistrement est-il affiché sur les annonces et le site ?",
      "Quelles sont les périodes d’ouverture et de fermeture annuelles (campings notamment) ?",
      "Comment se positionnent les deux ou trois hébergements concurrents les plus proches sur Google et Booking ?",
    ],
  },

  pitch30s:
    "Bonjour, {prenom}, de MJAGENCY, une agence web ici à Sète. On travaille avec des hôtels et des campings du Bassin de Thau sur une question simple : payer moins de commissions. On ne vous demande pas de quitter Booking ou Airbnb. On vous aide à récupérer en direct les clients qui vous connaissent déjà, avec un site où l’on réserve en deux clics et un assistant qui répond aux questions pratiques le soir à votre place. Je vous propose un audit gratuit de vingt minutes cet hiver, avant la saison. Mardi ou jeudi, ça vous irait ?",

  compliance:
    "Taxe de séjour : le site de réservation directe doit l’afficher clairement et prévoir sa collecte, car en réservation directe c’est l’hébergeur qui la perçoit et la reverse à la commune ou à l’intercommunalité (les plateformes la collectent souvent à sa place, ce qui n’est plus le cas en direct). Meublés de tourisme : dans les communes qui l’exigent, le numéro d’enregistrement délivré par la mairie doit figurer sur toutes les annonces, y compris sur le site ; vérifier avec le propriétaire qu’il l’a bien et qu’il est à jour, les règles ayant évolué ces dernières années. Conditions de réservation : afficher de façon claire les prix toutes taxes comprises, l’acompte, les conditions d’annulation et de remboursement, les horaires d’arrivée et de départ, et prévoir des conditions générales de vente ainsi que des mentions légales. Données personnelles : formulaire de réservation conforme au RGPD, avec consentement explicite pour recevoir des offres (on ne relance pas les anciens clients sans leur accord). Classement étoilé : n’afficher des étoiles que si l’établissement est effectivement classé. En cas de doute sur un point réglementaire, on invite le client à vérifier auprès de sa mairie ou de l’office de tourisme avant la mise en ligne.",
};

export default sheet;
