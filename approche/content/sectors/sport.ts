import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "sport",
  name: "Salle de sport / coach",
  short: "Sport",
  examples: [
    "salle de sport indépendante (musculation, cardio, cours collectifs)",
    "box de crossfit ou de cross-training",
    "studio de yoga ou de pilates",
    "coach sportif à domicile ou en extérieur",
    "club nautique : paddle, voile, kayak sur l’étang de Thau",
    "studio de boxe, arts martiaux ou danse fitness",
  ],
  tagline:
    "Des inscriptions qui se jouent sur trois moments de l’année, et des demandes d’essai qui arrivent le soir, quand plus personne ne répond.",

  reality: {
    rhythm:
      "La journée commence tôt : premiers cours ou premières séances de coaching vers 7 h pour les actifs, puis une vague de 9 h à 10 h avec les retraités, les parents et les indépendants. Le vrai creux, c’est de 9 h 30 - 10 h à 11 h 30 : le gérant fait l’administratif, les inscriptions, le planning, l’entretien des machines. Rush du midi de 12 h à 14 h avec les actifs qui s’entraînent pendant la pause. Nouveau creux de 14 h à 16 h - 17 h, où la salle est presque vide. Le gros de la journée, c’est de 17 h 30 à 20 h 30 : cours collectifs pleins, accueil débordé, coachs sur le plateau. Le samedi matin est souvent chargé (cours collectifs, séances d’essai), le dimanche fermé ou en accès libre. Dans une salle indépendante, le gérant est souvent aussi coach : il donne des cours, tient l’accueil, gère les réseaux et la compta. Le coach à domicile, lui, enchaîne les séances chez ses clients en voiture, avec des trous au milieu de la journée. Les clubs nautiques vivent au rythme de la météo et du vent, avec une saison d’avril à octobre.",
    pains: [
      "Les pics d’inscriptions à la rentrée et en janvier, puis des abonnés qui décrochent au bout de deux ou trois mois.",
      "Les demandes d’essai et de tarifs qui arrivent en message le soir et le week-end, quand personne ne peut répondre : le prospect a déjà écrit à une autre salle le lendemain.",
      "La concurrence des chaînes à bas prix, ouvertes tard, avec des abonnements sans engagement et de gros budgets de publicité.",
      "Remplir les créneaux creux (milieu de matinée, début d’après-midi) alors que les cours du soir débordent.",
      "Le gérant qui est à la fois coach, commercial, comptable et community manager, et qui n’a le temps de rien faire à fond.",
      "Des séances d’essai qui ne se transforment pas en abonnement, faute de suivi ou de relance après la séance.",
      "Pour les clubs nautiques, une saison courte, dépendante de la météo, avec des réservations prises au téléphone et beaucoup d’annulations.",
    ],
    clientLoss: [
      "La personne qui cherche « salle de sport », « yoga » ou « coach sportif » près de chez elle sur Google tombe d’abord sur la chaîne qui a des centaines d’avis.",
      "La demande d’essai envoyée un dimanche soir sur Instagram reste sans réponse deux jours : entre-temps, elle a réservé ailleurs.",
      "Pas de planning des cours visible en ligne, ou un PDF illisible sur téléphone : on ne sait pas si le cours de pilates du mardi soir existe encore.",
      "Pas de moyen simple de réserver une séance d’essai : il faut appeler aux heures de cours, et personne ne décroche.",
      "L’abonné qui décroche en novembre ou en mars ne reçoit aucune relance, aucun message : il ne revient pas.",
      "Des avis peu nombreux ou anciens, alors que les adhérents sont très contents : rien ne rassure le nouveau venu qui hésite.",
    ],
    seasonality:
      "Le sport vit au rythme de trois vagues : la rentrée de septembre, les bonnes résolutions de janvier, et une plus petite au printemps, quand on prépare l’été. Pendant ces périodes, le gérant est débordé et n’a pas la tête à un rendez-vous. Le bon moment pour prospecter, c’est AVANT : en juin pour préparer la rentrée, et de mi-novembre à mi-décembre pour préparer janvier. Sur le littoral, l’été vide les salles de ville : les adhérents sont à la plage, les étudiants de Montpellier rentrent chez eux, certaines salles réduisent leurs horaires ou ferment deux semaines en août. À l’inverse, les clubs nautiques de paddle, de voile ou de kayak sur l’étang de Thau sont en pleine saison d’avril à octobre, avec un gros pic en juillet-août : on les prospecte d’octobre à mars, quand ils préparent la saison suivante. À Balaruc-les-Bains, les curistes des thermes (mars à décembre) sont une clientèle possible pour l’aquagym, le yoga doux ou la marche nordique.",
    digitalHabits:
      "Instagram est le réseau principal, souvent très actif chez les box de crossfit et les studios de yoga : vidéos d’exercices, photos de cours, stories. Facebook sert encore pour les salles plus anciennes et les clubs associatifs. TikTok chez les coachs plus jeunes. La fiche Google existe presque toujours, avec des horaires d’ouverture mais rarement le planning des cours ou un lien de réservation. Beaucoup de salles utilisent déjà un logiciel de gestion et de réservation (Resamania, Deciplus ou équivalent) pour les adhérents, mais le nouveau venu n’a aucun chemin clair pour réserver un essai. Certaines sont sur ClassPass ou Gymlib pour remplir les heures creuses. Les demandes arrivent en messages privés, à toute heure, et sont traitées le soir, quand le gérant a fini ses cours.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site clair sur téléphone avec votre planning des cours à jour, vos coachs, vos formules, et surtout un bouton « Réserver ma séance d’essai ». La personne choisit son créneau à 23 h, et vous la retrouvez le lendemain sur le tapis.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Les demandes d’essai arrivent le soir, quand vous êtes en cours. L’assistant répond tout de suite, sur Instagram ou sur le site : tarifs, horaires, cours débutants, et il propose un créneau d’essai. Vous, vous gardez la main pour tout le reste.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Vous avez des choses à montrer : l’ambiance, les coachs, les progrès. On vient filmer une fois par mois, on prépare les publications et les stories, et on cale le calendrier sur la rentrée et janvier.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit quelqu’un qui cherche une salle ou un coach à {ville}, je vous compare aux trois concurrents les plus proches, chaîne comprise, et je vous laisse trois choses à corriger, dont une que vous pouvez faire seul. C’est gratuit.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Quand quelqu’un tape « salle de sport » ou « yoga » près de chez lui, c’est la fiche Google qui décide. On la met au propre : horaires justes, photos de vos cours, vos activités bien renseignées et un lien direct pour réserver un essai.",
      },
    ],
    upsell:
      "Après l’audit et la fiche Google, la suite naturelle est le site avec réservation de séance d’essai et planning, à mettre en ligne avant la rentrée ou avant janvier. Ensuite, l’agent IA pour répondre aux demandes du soir et du week-end, puis la gestion des réseaux sociaux sur les périodes clés. Pour garder les adhérents, la carte de fidélité digitale avec des relances quand quelqu’un ne vient plus. La carte NFC d’avis à l’accueil pour faire parler les adhérents contents. Pour une salle avec plusieurs coachs ou un club nautique, un logiciel sur mesure pour les réservations, la météo et les annulations.",
  },

  timing: {
    best: [
      {
        label: "Creux de milieu de matinée",
        days: [1, 2, 3, 4, 5],
        from: "09:30",
        to: "11:30",
        why: "Les cours du matin sont finis, ceux du midi n’ont pas commencé : le gérant fait l’administratif et la salle est calme.",
      },
      {
        label: "Début d’après-midi",
        days: [1, 2, 3, 4, 5],
        from: "14:00",
        to: "16:00",
        why: "La salle est presque vide après le rush du midi : c’est le meilleur moment pour une vraie conversation.",
      },
      {
        label: "Téléphone aux coachs indépendants",
        days: [2, 3, 4],
        from: "14:30",
        to: "15:30",
        why: "Les coachs à domicile ont souvent un trou en début d’après-midi entre deux clients.",
      },
    ],
    avoid: [
      {
        label: "Premiers cours du matin",
        from: "06:30",
        to: "09:30",
        why: "Cours et séances des actifs avant le travail : le gérant est sur le plateau ou chez un client.",
      },
      {
        label: "Rush du midi",
        from: "12:00",
        to: "14:00",
        why: "Les actifs viennent pendant leur pause : accueil et coachs sont pris.",
      },
      {
        label: "Rush du soir",
        from: "17:30",
        to: "20:30",
        why: "Cours collectifs pleins, accueil débordé : c’est le cœur de la journée, personne ne vous écoutera.",
      },
      {
        label: "Samedi matin",
        days: [6],
        from: "08:30",
        to: "12:30",
        why: "Cours collectifs et séances d’essai du week-end : la salle tourne à plein.",
      },
    ],
    usuallyClosed: [0],
    phoneNote:
      "Pour une salle, appelez le fixe de l’accueil entre 10 h et 11 h 30 ou entre 14 h et 16 h, et demandez le gérant par son prénom (souvent visible sur Instagram ou dans les avis). Pour un coach à domicile, le numéro est son portable : il est en séance à l’heure pile, appelez plutôt vers la demie. S’il ne décroche pas, un SMS court avec votre prénom et le sujet vaut mieux qu’un long message. Pour les clubs nautiques, évitez les jours de beau temps en saison : ils sont sur l’eau.",
    seasonNote:
      "Prospectez les salles et les coachs en juin (pour préparer la rentrée) et de mi-novembre à mi-décembre (pour préparer janvier). Oubliez les trois premières semaines de septembre et tout le mois de janvier : ce sont les pics d’inscriptions. Les clubs nautiques se prospectent d’octobre à mars. En août, vérifiez que la salle n’est pas fermée pour congés avant de vous déplacer.",
  },

  scripts: {
    physique: {
      id: "sport-physique",
      title: "Visite à la salle ou au studio",
      channel: "physique",
      duration: "3 à 5 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Se présenter honnêtement à l’accueil et savoir qui décide.",
          lines: [
            "Bonjour ! Rassurez-vous, je ne viens pas m’inscrire aujourd’hui, même si ça me ferait du bien.",
            "Je voulais dire un mot au gérant ou à la gérante. C’est vous ?",
            "Pas de souci. Il ou elle est là plutôt à quel moment ? Je repasse, j’en ai pour deux minutes.",
          ],
          tip: "Ne coupez jamais un cours ou une séance. Dans un studio de yoga ou de pilates, attendez la fin du cours en silence, près de l’entrée. Parlez doucement, les gens s’entraînent à côté.",
          branches: [
            {
              if: "C’est un coach ou la personne de l’accueil",
              then: "Demandez gentiment le prénom du gérant et l’heure où il est là, laissez votre carte avec un mot : « Passé vous voir pour votre fiche Google et vos demandes d’essai, je repasse jeudi vers 10 h. {prenom} ».",
            },
            {
              if: "Le gérant donne un cours",
              then: "« Surtout ne le dérangez pas. Son cours finit à quelle heure ? J’attends ou je repasse, comme ça vous arrange. »",
            },
            {
              if: "C’est le gérant",
              then: "Passez à l’accroche. Dans une salle indépendante, c’est presque toujours lui qui décide de tout, souvent avec son associé.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les salles et les coachs du coin à être trouvés et à remplir leurs séances d’essai.",
            "Je ne viens rien vous vendre maintenant. En venant, j’ai fait la recherche qu’un nouveau client ferait, et il y a un détail qui m’a interpellé. Je vous montre, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} et son Instagram déjà ouverts sur votre téléphone. Tournez l’écran vers lui, ne lui demandez pas de chercher.",
          branches: [
            {
              if: "« J’ai un cours dans cinq minutes »",
              then: "« Alors je vous laisse. Je peux repasser mardi à 10 h ou jeudi à 14 h 30, quand la salle est calme. Qu’est-ce qui vous arrange ? »",
            },
            {
              if: "« On a déjà tout ce qu’il faut »",
              then: "« Tant mieux. Je vous montre juste le détail, et vous me direz si c’est déjà réglé. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible, sans juger.",
          lines: [
            "Regardez : quand je tape « salle de sport » ici, à {ville}, vous sortez après la chaîne de la zone commerciale, qui a beaucoup plus d’avis.",
            "Sur votre fiche, il n’y a ni le planning des cours ni de lien pour réserver un essai. La personne qui vous trouve ne sait pas quoi faire ensuite, à part appeler aux heures de cours.",
            "Sur Instagram, vous avez de super vidéos, mais le lien dans votre profil mène à un PDF du planning, difficile à lire sur téléphone.",
            "Vous avez des adhérents très contents, ça se voit, mais le dernier avis Google date de plusieurs mois.",
          ],
          tip: "Choisissez le constat le plus parlant, pas les quatre. Commencez par un compliment sincère : l’ambiance, le matériel, la qualité des vidéos.",
          branches: [
            {
              if: "Sa présence est déjà très bien tenue",
              then: "Félicitez sincèrement (« C’est une des mieux tenues du coin ») et basculez sur les demandes d’essai du soir et l’agent IA.",
            },
            {
              if: "« Ah, je ne savais pas »",
              then: "« C’est très courant, on se concentre sur Instagram et Google reste de côté. Ça se corrige vite. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le gérant de ce qui l’embête vraiment.",
          lines: [
            "Quand quelqu’un vous écrit un dimanche soir pour une séance d’essai, il a une réponse quand, en général ?",
            "Sur les personnes qui viennent faire un essai, vous avez l’impression qu’une bonne partie s’inscrit, ou pas tant que ça ?",
            "Qu’est-ce qui vous prend le plus la tête : faire venir de nouveaux adhérents, garder ceux qui sont là, ou remplir les créneaux creux ?",
          ],
          tip: "Posez une seule question, puis taisez-vous. Les gérants de salle aiment parler de leur projet : laissez-les faire, c’est là qu’ils se livrent.",
          branches: [
            {
              if: "Il parle de la chaîne à bas prix",
              then: "« Eux, ils ont le prix. Vous, vous avez le suivi, les coachs qui connaissent les prénoms. Il faut que ça se voie avant même que la personne pousse la porte. »",
            },
            {
              if: "Il parle des abonnés qui décrochent",
              then: "« Et quand quelqu’un ne vient plus depuis trois semaines, aujourd’hui, il se passe quoi ? »",
            },
            {
              if: "Il parle des messages en retard",
              then: "« C’est exactement ce que fait un assistant : il répond tout de suite, propose un créneau d’essai, et vous passe la main s’il faut. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose un truc simple : je vous fais un audit gratuit de ce que voit un nouveau client quand il vous cherche, comparé aux trois salles les plus proches, et je vous montre les trois choses à corriger en priorité.",
            "Ça prend vingt minutes, dans un creux. Je repasse mardi à 10 h ou jeudi à 14 h 30, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci, et bravo pour l’ambiance, ça se sent dès l’entrée.",
          ],
          tip: "Proposez toujours deux créneaux dans les creux (milieu de matinée ou début d’après-midi). Si vous êtes en juin ou en novembre, rappelez que c’est le bon moment pour être prêt avant la rentrée ou janvier, sans en faire trop.",
          branches: [
            {
              if: "« Envoyez-moi plutôt ça par mail »",
              then: "« Je vais vous le montrer en face, c’est plus parlant avec l’écran sous les yeux. Mardi ou jeudi ? »",
            },
            {
              if: "« Je dois en parler à mon associé »",
              then: "« Bien sûr. Il est là plutôt quand ? Je peux passer quand vous êtes tous les deux, c’est mieux pour tout le monde. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et si un jour vous voulez remplir votre rentrée plus facilement, vous saurez qui appeler. Bonne séance. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "sport-telephone",
      title: "Appel à la salle ou au coach",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’il n’est pas en cours.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, à Sète.",
            "Je ne vous prends pas entre deux cours, là ?",
          ],
          tip: "Souriez en parlant, ça s’entend. Appelez uniquement entre 10 h et 11 h 30 ou entre 14 h et 16 h.",
          branches: [
            {
              if: "« Si, je commence un cours »",
              then: "« Je vous rappelle à la fin, vers quelle heure ? » Et rappelez vraiment à l’heure dite.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le gérant, ou au moins son prénom et le bon moment.",
          lines: [
            "Je voudrais parler au gérant ou à la gérante, c’est au sujet de la fiche Google de la salle et des demandes de séances d’essai.",
            "Vous pouvez me dire son prénom ? Et il ou elle est plus facile à joindre à quel moment ?",
          ],
          tip: "Soyez aimable avec l’accueil ou le coach qui décroche : c’est souvent lui qui voit arriver les demandes d’essai, et il peut devenir votre allié.",
          branches: [
            {
              if: "« Il est en cours toute la journée »",
              then: "« Je comprends. Il a un creux en milieu de matinée ou en début d’après-midi ? Je rappelle à ce moment-là. »",
            },
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler que sur sa fiche Google, il n’y a aucun moyen de réserver un essai. Ça peut lui faire perdre des inscriptions. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. En préparant mon appel, j’ai fait la recherche qu’un nouveau client ferait, et sur votre fiche Google il n’y a ni planning ni lien pour réserver un essai.",
            "On aide les salles et les coachs du Bassin de Thau à transformer ces recherches en séances d’essai, surtout avant la rentrée et janvier.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, les demandes d’essai vous arrivent surtout comment : Instagram, téléphone, en passant devant ?",
            "Et quand elles arrivent le soir ou le week-end, qui y répond ?",
          ],
          tip: "Deux questions maximum au téléphone. Le reste se fera en face.",
          branches: [
            {
              if: "« Moi, le soir, quand j’ai fini mes cours »",
              then: "« C’est ce que me disent presque tous les gérants que je rencontre. C’est justement là qu’on peut vous faire gagner du temps et des inscriptions. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes à la salle, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, dans un creux. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 10 h, ou jeudi à 14 h 30. Qu’est-ce qui vous arrange le mieux ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande : « Ça dépend de ce dont vous avez besoin, c’est justement ce qu’on verra ensemble. »",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, ça dépend vraiment de votre salle, et je ne veux pas vous dire un chiffre au hasard. Mardi ou jeudi ? »",
            },
            {
              if: "Coach à domicile sans local",
              then: "« Pas de souci, on peut se voir où vous voulez : un café entre deux clients, ou sur votre lieu d’entraînement en extérieur. Mardi 14 h 30 ou jeudi 10 h ? »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 14 h 30 à la salle. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un SMS de confirmation avec mon nom. Si un cours se rajoute, vous me répondez dessus et on décale.",
            "Merci, et bonnes séances cet après-midi.",
          ],
          tip: "Envoyez le SMS dans les cinq minutes, et un rappel la veille.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos nouveaux adhérents, ils arrivent surtout comment : bouche-à-oreille, Instagram, Google, en passant devant ?",
      why: "Savoir d’où vient la clientèle nouvelle et s’il a conscience du rôle de Google dans la recherche locale.",
    },
    {
      type: "S",
      question: "Pour réserver une séance d’essai chez vous, concrètement, la personne doit faire quoi ?",
      why: "Repérer le parcours flou (appeler aux heures de cours, écrire en message) et l’ouverture pour le site avec réservation.",
    },
    {
      type: "P",
      question: "Les messages qui arrivent le soir et le week-end, vous arrivez à y répondre le jour même ?",
      why: "Faire émerger le délai de réponse et les prospects qui partent ailleurs entre-temps.",
    },
    {
      type: "P",
      question: "Après une séance d’essai, il se passe quoi avec les personnes qui ne s’inscrivent pas tout de suite ?",
      why: "Faire apparaître l’absence de relance et les essais qui ne se transforment pas.",
    },
    {
      type: "I",
      question: "Si à la rentrée ou en janvier, une partie des demandes d’essai part chez la chaîne parce qu’elle a répondu plus vite, ça représente combien d’abonnements sur une année ?",
      why: "Lui faire calculer lui-même le manque à gagner, sans que vous avanciez de chiffre.",
    },
    {
      type: "I",
      question: "Et le temps que vous passez le soir à répondre aux mêmes questions sur les tarifs et les horaires, c’est du temps pris sur quoi ?",
      why: "Faire réaliser le coût en fatigue et en vie personnelle, et préparer l’agent IA.",
    },
    {
      type: "N",
      question: "Si chaque demande d’essai recevait une réponse tout de suite, avec un créneau proposé, même à 23 h, qu’est-ce que ça changerait pour votre rentrée ?",
      why: "Lui faire formuler lui-même le bénéfice du site avec réservation et de l’assistant.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de ça.",
      hidden: "Souvent un logiciel de gestion qu’il confond avec sa visibilité, ou un prestataire qu’on ne voit plus. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous y ayez pensé.",
      questionner: "Il s’occupe de quoi exactement : les réseaux, le site, la fiche Google, les réponses aux demandes d’essai ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur, ça permet juste de vérifier ce que voit un nouveau client, par exemple qu’il n’a aucun moyen de réserver un essai depuis Google.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à la personne qui s’en occupe. Si elle corrige tout, tant mieux pour vous. Mardi 10 h ou jeudi 14 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je donne des cours toute la journée.",
      hidden: "La peur d’ajouter une tâche de plus, et la fatigue d’un gérant qui fait tout.",
      accueillir: "Je vois bien, entre les cours, l’accueil et la gestion, vos journées sont pleines.",
      questionner: "Les réseaux et les messages, aujourd’hui, vous les faites à quel moment ?",
      recadrer: "C’est justement l’idée : que ça tourne pendant que vous êtes sur le plateau. Vous validez une fois, et c’est nous qui faisons le reste.",
      proposer: "Je vous prends vingt minutes dans un creux, pas plus. Jeudi 14 h 30, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour une petite salle comme la mienne.",
      hidden: "Une trésorerie serrée entre deux vagues d’inscriptions, et il n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, entre le loyer, le matériel et les salaires des coachs, chaque euro compte.",
      questionner: "Combien vous rapporte un adhérent qui reste un an chez vous, à peu près ?",
      recadrer: "On a des solutions qui commencent petit, au mois. Et en général, quelques abonnements de plus sur une rentrée suffisent à rembourser l’essentiel.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "adherent-fait-ca",
      objection: "Un de mes adhérents fait des sites, il va m’arranger ça.",
      hidden: "L’envie de ne pas dépenser et la confiance dans la communauté de la salle. Souvent, l’adhérent a proposé mais n’a pas commencé.",
      accueillir: "C’est bien d’avoir une communauté où chacun apporte quelque chose.",
      questionner: "Il a déjà commencé ? Il s’occupera aussi de mettre à jour le planning à chaque changement de cours, et de répondre aux demandes d’essai ?",
      recadrer: "Faire un site, c’est une chose. Ce qui remplit une rentrée, c’est le suivi : le planning juste, les réponses rapides, les relances. C’est ça qui lâche en général au bout de quelques mois.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et si un jour il n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "instagram-suffit",
      objection: "Les gens viennent par Instagram, pas par Google. Instagram me suffit.",
      hidden: "Il voit ses abonnés et ses likes, pas les recherches qu’il rate. Et il est fier de son contenu.",
      accueillir: "Votre Instagram est bien tenu, c’est vrai, et c’est une vraie force.",
      questionner: "Quelqu’un qui vient d’emménager à {ville} et qui cherche une salle, il ne vous suit pas encore. Il tape quoi, à votre avis ?",
      recadrer: "Instagram parle à ceux qui vous connaissent déjà. Ceux qui ne vous connaissent pas cherchent en général « salle de sport » ou « yoga » sur Google Maps, et c’est là que la chaîne passe devant.",
      proposer: "Gardez Instagram, on ne touche à rien. Je vous montre juste ce que voit un nouveau client sur Google, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Chez nous, ça marche au bouche-à-oreille, les adhérents ramènent leurs amis.",
      hidden: "La fierté d’une communauté soudée, et l’idée que le marketing, c’est pour les chaînes.",
      accueillir: "C’est la meilleure preuve que vous faites du bon travail, vous avez raison d’en être fier.",
      questionner: "Quand un adhérent parle de vous à un ami, vous savez ce que fait cet ami juste après ?",
      recadrer: "En général, il vous cherche sur son téléphone : il regarde les avis, les photos, et s’il peut réserver un essai facilement. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, visible par tout le monde.",
      proposer: "Une carte d’avis à l’accueil, et vos adhérents contents vous le disent en trente secondes après leur séance. Je vous montre, avec l’audit gratuit ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai manque de temps, un cours commence.",
      accueillir: "Bien sûr, je ne veux pas vous prendre sur votre temps de cours.",
      questionner: "Pour ne pas tomber au mauvais moment, vous êtes plus tranquille en milieu de matinée ou en début d’après-midi ?",
      recadrer: "Un mail, honnêtement, il va se perdre au milieu des demandes d’inscription. Ce que j’ai à vous montrer tient sur un écran, en face c’est beaucoup plus clair.",
      proposer: "Je passe jeudi à 14 h 30, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça marche ?",
    },
    {
      id: "chaines-low-cost",
      objection: "De toute façon, les grandes chaînes à bas prix cassent tout, je ne peux pas lutter.",
      hidden: "Le découragement face à des budgets de publicité énormes, et parfois la tentation de baisser ses prix.",
      accueillir: "C’est vrai, sur le prix, vous ne jouerez jamais dans la même catégorie, et vous n’avez pas à le faire.",
      questionner: "Ceux qui viennent chez vous plutôt que chez eux, ils vous disent quoi, en général ?",
      recadrer: "Vos adhérents viennent pour le suivi, les coachs, l’ambiance. Le problème, c’est que ça ne se voit pas en ligne : sur Google, la personne compare des photos, des avis et un bouton « essai gratuit ». Si le vôtre n’y est pas, elle va au moins cher.",
      proposer: "Je vous montre comment faire ressortir ce qui vous distingue, là où les gens cherchent. Vingt minutes, mardi 10 h ou jeudi 14 h 30 ?",
    },
  ],

  proofs: [
    "En général, quand on cherche une salle, un cours de yoga ou un coach près de chez soi, on commence par Google Maps et on compare les avis et les photos.",
    "Une demande d’essai à laquelle on répond dans l’heure a beaucoup plus de chances de se transformer qu’une demande qui attend deux jours : la personne est motivée au moment où elle écrit.",
    "Pouvoir réserver sa séance d’essai soi-même, à n’importe quelle heure, enlève la gêne d’appeler et la barrière des horaires.",
    "Un planning des cours lisible sur téléphone répond à la question que tout le monde se pose avant de venir : « est-ce que ça tombe sur mes horaires ? ».",
    "Des adhérents contents laissent rarement un avis d’eux-mêmes. Leur demander au bon moment, juste après une bonne séance, c’est ce qui fait la différence.",
    "Préparer sa visibilité en juin pour la rentrée, et en novembre pour janvier, c’est arriver prêt au moment où les gens cherchent, plutôt que courir après.",
    "Des vidéos et des photos de vrais cours, avec les vrais coachs, rassurent souvent plus un débutant que des images de catalogue.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour vous montrer ses messages en attente ou ses statistiques Instagram.",
    "Il vous raconte spontanément une rentrée ou un mois de janvier moins bon que prévu.",
    "Il se plaint de répondre aux mêmes questions sur les tarifs tous les soirs.",
    "Question : « Et ça se brancherait sur mon logiciel de réservation ? »",
    "Question : « L’assistant, il répondrait aussi sur Instagram ? »",
    "Il parle d’un projet : nouvelle salle, nouveau cours, nouveau coach, agrandissement, ouverture d’une activité nautique.",
    "Il évoque la chaîne qui vient d’ouvrir dans la zone commerciale.",
    "L’associé ou un coach vient se joindre à la conversation.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Instagram",
      "Facebook",
      "TikTok",
      "ClassPass",
      "Gymlib",
      "Resamania",
      "Deciplus",
      "Site internet",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, avec les bons horaires (y compris l’été et les jours fériés), les bonnes catégories et les activités proposées ?",
      "La fiche Google et le site affichent-ils un lien pour réserver une séance d’essai, et ce parcours fonctionne-t-il sur téléphone ?",
      "Le planning des cours est-il visible en ligne, lisible sur téléphone et à jour ?",
      "Combien d’avis Google, quelle note, de quand date le dernier avis, et le gérant y répond-il ?",
      "Que disent les avis : ambiance, coachs, propreté, matériel, affluence aux heures de pointe, difficulté à résilier ?",
      "Quels sont l’activité et le rythme sur Instagram, Facebook et TikTok (dernière publication, vidéos de cours, stories), et où mène le lien du profil ?",
      "La salle utilise-t-elle un logiciel de réservation (Resamania, Deciplus ou autre) et est-elle présente sur ClassPass ou Gymlib ?",
      "Quelles chaînes ou salles concurrentes se trouvent à moins de dix minutes, et comment {commerce} se positionne-t-il face à elles (suivi, spécialité, communauté) ?",
      "Y a-t-il une spécialité ou un argument à valoriser : coachs diplômés, cours pour débutants ou seniors, sport-santé, activité sur l’étang, petits groupes ?",
      "Des avis ou publications mentionnent-ils une ouverture récente, un changement de propriétaire ou un déménagement ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les salles de sport et les coachs du Bassin de Thau à transformer les recherches sur Google et les messages Instagram en séances d’essai. En général, ça se joue sur trois choses : une fiche Google bien tenue, un bouton pour réserver un essai, et une réponse rapide, même le soir. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi matin ou jeudi après-midi ?",

  compliance:
    "Pour enseigner, animer ou encadrer une activité physique contre rémunération, il faut un diplôme reconnu et une carte professionnelle d’éducateur sportif : ne mettre en avant sur le site ou les réseaux que des diplômes et qualifications réels, sans en inventer ni en exagérer. Ne jamais promettre de résultats chiffrés (« moins 10 kilos en un mois ») ni de bienfaits médicaux (« soigne le mal de dos ») : c’est trompeur et engage la responsabilité du gérant. Ne parler de sport-santé ou de sport sur ordonnance que si la structure y est réellement habilitée. Les photos « avant / après » doivent être authentiques, avec l’accord écrit de la personne. Les conditions de la séance d’essai et d’abonnement (engagement, résiliation) doivent être claires. Pour les activités nautiques, ne pas minimiser les conditions de sécurité ni promettre des sorties quelle que soit la météo.",
};

export default sheet;
