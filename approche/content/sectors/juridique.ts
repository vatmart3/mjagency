import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "juridique",
  name: "Profession juridique",
  short: "Juridique",
  examples: [
    "avocat indépendant",
    "petit cabinet d’avocats de 2 à 6 associés",
    "office notarial",
    "étude de commissaire de justice",
    "médiateur ou avocat-médiateur",
    "cabinet orienté droit de la famille, droit du travail ou droit immobilier",
  ],
  tagline:
    "Ils vivent de la confiance et de la recommandation : ce qu’ils achètent, c’est une image sobre qui rassure et moins de temps perdu avec des demandes mal qualifiées, pas de la publicité.",

  reality: {
    rhythm:
      "L’avocat part souvent au tribunal dès 8 h 30 ou 9 h pour les audiences, à Sète ou à Montpellier, et revient en fin de matinée ou en début d’après-midi. L’après-midi alterne rendez-vous clients, rédaction de conclusions, appels aux confrères, avec des délais de procédure qui ne se négocient pas. La fin de journée sert aux mails et aux dossiers de fond, souvent tard. Chez le notaire, la journée tourne autour des signatures d’actes (ventes, successions, donations), calées en fin de matinée et l’après-midi, avec des clercs qui préparent les dossiers en amont. Le commissaire de justice est souvent dehors le matin (significations, constats) et au bureau l’après-midi. Dans tous les cas, le secrétariat filtre les appels, tient les agendas et prend les premières demandes. Le vendredi après-midi est souvent plus calme, et les cabinets ferment le week-end.",
    pains: [
      "Des demandes de contact mal qualifiées : des gens qui cherchent un conseil gratuit, une affaire hors du domaine du cabinet, ou hors de la zone.",
      "Le secrétariat qui passe beaucoup de temps au téléphone à expliquer les mêmes choses : premier rendez-vous, honoraires, documents à apporter.",
      "Une image en ligne qui ne reflète pas le sérieux du cabinet : site daté, fiche Google incomplète, voire des avis laissés par des parties adverses mécontentes.",
      "La crainte de mal faire vis-à-vis de la déontologie dès qu’il s’agit de communication, qui pousse à ne rien faire.",
      "La concurrence des plateformes juridiques en ligne et des grands cabinets de Montpellier sur les dossiers simples.",
      "La difficulté à expliquer clairement les honoraires ou les frais avant le premier rendez-vous, source de malentendus et de rendez-vous inutiles.",
      "Le temps passé à vérifier les conflits d’intérêts et à réorienter des demandes vers des confrères.",
    ],
    clientLoss: [
      "Une personne recommandée tape le nom du cabinet sur Google, tombe sur une fiche vide ou un site d’un autre âge, et doute avant d’appeler.",
      "Un particulier en situation urgente (garde d’enfants, licenciement, litige locatif) appelle trois cabinets : il retient celui qui répond et qui explique clairement comment se passe le premier rendez-vous.",
      "Le site ne dit pas dans quels domaines le cabinet intervient : le prospect ne sait pas s’il est au bon endroit et va voir ailleurs.",
      "L’absence d’information sur les honoraires ou les modalités de premier rendez-vous fait peur, et le prospect se tourne vers une plateforme en ligne qui affiche un prix.",
      "Les demandes arrivées par mail ou formulaire restent sans réponse pendant les audiences ou les périodes de signature, et le prospect ne relance pas.",
    ],
    seasonality:
      "La saisonnalité est judiciaire et immobilière plus que touristique. Pour les avocats, l’activité des juridictions ralentit pendant les vacations judiciaires de mi-juillet à fin août, et la rentrée de septembre est dense. Sur le Bassin de Thau, l’après-saison amène son lot de dossiers : litiges de travail saisonnier, contentieux locatifs, conflits de voisinage liés aux locations de vacances. Pour les notaires, le marché des résidences secondaires à Sète, Marseillan ou Balaruc fait vivre des printemps et des étés chargés en ventes, et décembre est un mois de rush pour signer avant la fin de l’année. Les commissaires de justice voient passer des constats liés aux locations saisonnières et aux états des lieux. Les meilleures périodes pour prospecter : de mi-septembre à fin novembre, et de janvier à mars. Évitez la deuxième quinzaine de décembre et la période juillet-août, où beaucoup sont en congés.",
    digitalHabits:
      "La plupart des avocats ont une fiche sur l’annuaire de leur barreau et sur l’annuaire national du CNB, et parfois un profil sur une plateforme de mise en relation. Le site, quand il existe, est souvent un modèle générique, ou un site fait il y a dix ans, peu lisible sur téléphone. Les notaires ont une fiche sur l’annuaire des notaires, souvent plus complète que leur propre site. La fiche Google existe presque toujours, rarement revendiquée ou tenue à jour, avec parfois des avis négatifs sans réponse. LinkedIn est utilisé par les avocats les plus jeunes ou orientés entreprises. Les premiers contacts arrivent par téléphone au secrétariat, par formulaire ou par mail, et sont triés à la main.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site d’image sobre, qui dit clairement dans quels domaines vous intervenez, comment se passe un premier rendez-vous et quelles sont vos modalités d’honoraires, avec la prise de rendez-vous en ligne. On le rédige dans le respect de vos règles professionnelles, et on le valide avec vous et votre Ordre ou votre Chambre avant la mise en ligne.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Un assistant qui pré-qualifie les demandes à la place du secrétariat : domaine concerné, urgence, lieu, disponibilités. Il ne donne jamais de conseil juridique : il recueille la demande, explique comment se passe le premier rendez-vous, et vous la transmet. Vous ne recevez que des demandes qui correspondent au cabinet.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Beaucoup de gens tapent « avocat » ou « notaire » suivi de la ville. Une fiche complète et juste, avec vos domaines d’intervention, vos horaires et l’accès, c’est souvent ce qui confirme une recommandation. Et on vous aide à répondre aux avis avec la retenue qu’impose le secret professionnel.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je vous propose un audit gratuit de vingt minutes : ce que voit une personne à qui l’on vient de vous recommander quand elle tape votre nom, ce qui manque ou ce qui est inexact, et trois corrections compatibles avec votre déontologie.",
      },
    ],
    upsell:
      "Après l’audit : la fiche Google remise au propre, puis le site d’image sobre avec la prise de rendez-vous en ligne. Une fois le site en place, l’agent IA de pré-qualification branché sur le formulaire de contact, qui soulage le secrétariat. Pour un cabinet de plusieurs associés ou un office notarial important, un site plus complet avec une page par associé, voire un outil sur mesure pour la collecte des pièces clients. La carte NFC d’avis n’est jamais proposée d’office : la question des avis clients est délicate dans ces professions, on n’en parle que si le professionnel l’aborde lui-même, et après avis de son Ordre ou de sa Chambre.",
  },

  timing: {
    best: [
      {
        label: "Début de matinée",
        days: [1, 2, 3, 4, 5],
        from: "09:00",
        to: "10:00",
        why: "Le cabinet ouvre, les signatures et les rendez-vous n’ont pas commencé ; pour les avocats, uniquement les jours sans audience, à vérifier auprès du secrétariat.",
      },
      {
        label: "Fin de journée",
        days: [1, 2, 3, 4],
        from: "17:30",
        to: "18:30",
        why: "Les rendez-vous sont terminés, le secrétariat se calme, et le professionnel est plus disponible pour un échange court.",
      },
      {
        label: "Vendredi en début d’après-midi",
        days: [5],
        from: "14:00",
        to: "15:30",
        why: "Souvent le moment le plus calme de la semaine, hors rush de fin d’année chez les notaires.",
      },
    ],
    avoid: [
      {
        label: "Matinées d’audience (avocats)",
        from: "08:30",
        to: "12:30",
        why: "L’avocat est au tribunal ou prépare l’audience : même s’il décroche, il n’a pas la tête à vous écouter.",
      },
      {
        label: "Pause déjeuner",
        from: "12:00",
        to: "14:00",
        why: "Accueil souvent fermé, et c’est un moment de déjeuners professionnels.",
      },
      {
        label: "Créneaux de signature (notaires)",
        from: "10:30",
        to: "12:00",
        why: "Les signatures d’actes se calent souvent en fin de matinée : le notaire est en rendez-vous avec les parties.",
      },
      {
        label: "Lundi matin",
        days: [1],
        from: "08:30",
        to: "11:00",
        why: "Point d’équipe, courrier et mails du week-end, organisation des audiences de la semaine.",
      },
    ],
    usuallyClosed: [0, 6],
    phoneNote:
      "Appelez le standard du cabinet : vous tomberez presque toujours sur un secrétariat. Donnez un objet précis (« la pré-qualification des demandes de nouveaux clients et l’image du cabinet en ligne ») et demandez « Maître {dirigeant} » par son nom, trouvé sur l’annuaire du barreau, l’annuaire des notaires ou le site. Pour un avocat, demandez à l’assistante quels jours il n’a pas d’audience, et rappelez ces jours-là. Ne cherchez jamais à obtenir le portable personnel.",
    seasonNote:
      "Prospectez de mi-septembre à fin novembre et de janvier à mars. Évitez juillet-août (vacations judiciaires et congés), la deuxième quinzaine de décembre chez les notaires (signatures de fin d’année), et les premiers jours de septembre, très chargés pour les avocats.",
  },

  scripts: {
    physique: {
      id: "juridique-physique",
      title: "Passage au cabinet ou à l’étude",
      channel: "physique",
      duration: "2 à 4 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Se présenter au secrétariat avec la retenue qu’impose un lieu confidentiel, et identifier l’associé ou le titulaire.",
          lines: [
            "Bonjour, je suis {prenom}, de MJAGENCY, une agence web à Sète. Je n’ai pas de rendez-vous, je passais pour me présenter.",
            "Je souhaiterais laisser un mot à Maître {dirigeant}. Est-il plus facile à joindre en début de matinée ou en fin de journée ?",
            "Je ne veux surtout pas le déranger : je vous laisse ma carte, et je l’appellerai au moment que vous m’indiquerez.",
          ],
          tip: "Tenue soignée, ton posé, voix basse. Ne regardez aucun dossier, ne parlez pas de votre objet si des clients attendent. Ne demandez jamais à voir le professionnel sans rendez-vous.",
          branches: [
            {
              if: "L’assistante vous dit qu’il est en audience ou en signature",
              then: "« Bien sûr. Quels sont les jours où il est le plus au cabinet ? Et je peux avoir l’adresse mail du secrétariat pour lui envoyer un mot avant de l’appeler ? »",
            },
            {
              if: "Le professionnel passe à l’accueil et vous salue",
              then: "« Bonjour Maître, je ne vous retiens pas. {prenom}, agence web à Sète : je travaille avec des cabinets sur la pré-qualification des demandes. Je peux vous appeler jeudi à 17 h 45 ? »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Parler de son problème à lui : le temps perdu et l’image, pas la publicité.",
          lines: [
            "On aide les cabinets à trier les demandes de nouveaux clients avant qu’elles arrivent sur le bureau, et à avoir une présence en ligne sobre, à la hauteur du cabinet.",
            "Toujours dans le cadre de vos règles professionnelles : on valide ensemble avec votre Ordre ou votre Chambre avant la mise en ligne.",
          ],
          tip: "Évitez les mots « marketing », « visibilité », « attirer des clients ». Parlez de confiance, de sobriété, de temps gagné.",
          branches: [
            {
              if: "« Notre déontologie ne permet pas ça »",
              then: "« Vous avez raison d’y veiller. On reste sur de l’information : domaines d’intervention, modalités de rendez-vous, accès. C’est ce que vos règles permettent, et on les respecte à la lettre. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer un constat factuel sur ce que voit un prospect, sans commenter la qualité du cabinet.",
          lines: [
            "J’ai regardé ce que voit quelqu’un qui tape le nom du cabinet sur Google. La fiche n’indique ni vos domaines d’intervention ni vos horaires.",
            "Et sur le site, on ne comprend pas comment se passe un premier rendez-vous ni comment sont fixés les honoraires : c’est souvent la question que pose le secrétariat au téléphone.",
            "Pour une personne à qui l’on vient de vous recommander, c’est ce qui fait la différence entre appeler tout de suite et hésiter.",
          ],
          tip: "Un seul constat, vérifiable sur son téléphone. Ne commentez jamais les avis, surtout s’il y en a de négatifs : c’est un sujet sensible.",
          branches: [
            {
              if: "« Nos clients viennent par recommandation »",
              then: "« C’est le meilleur canal. Et justement, la personne recommandée vérifie presque toujours le nom du cabinet sur Google avant d’appeler. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler du temps perdu avec les demandes mal qualifiées.",
          lines: [
            "Sur les demandes de nouveaux clients qui arrivent chaque semaine, combien correspondent vraiment à ce que fait le cabinet ?",
            "Et aujourd’hui, qui fait le tri : vous, ou le secrétariat ?",
          ],
          tip: "Laissez-le détailler. S’il parle des gens qui veulent « juste une question rapide » ou des dossiers hors domaine, vous tenez le vrai sujet.",
          branches: [
            {
              if: "Il parle des demandes de conseil gratuit",
              then: "« C’est exactement ce qu’un assistant de pré-qualification règle : il explique dès le départ comment se passe une consultation, sans donner de conseil, et ne transmet que les vraies demandes. »",
            },
            {
              if: "Il parle de la concurrence des plateformes en ligne",
              then: "« Elles ont la clarté du prix. Vous, vous avez la proximité et la compétence. Un site qui explique clairement vos modalités, c’est ce qui rééquilibre. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Obtenir un rendez-vous de vingt minutes ou l’accord pour l’audit gratuit.",
          lines: [
            "Je vous propose un audit gratuit : ce que voit une personne recommandée qui cherche le cabinet, et trois corrections compatibles avec votre déontologie.",
            "Je vous le présente en vingt minutes : mardi à 9 h 15 ou jeudi à 17 h 45, qu’est-ce qui vous convient le mieux ?",
            "Je vous laisse ma carte, et je confirme par mail au secrétariat.",
          ],
          tip: "Ne parlez pas de prix. Pour un avocat, vérifiez avec l’assistante que le créneau proposé n’est pas un jour d’audience.",
          branches: [
            {
              if: "« Il faut que j’en parle à mes associés »",
              then: "« Bien sûr, c’est une décision collective. Vous avez un point d’associés prochainement ? Je peux venir présenter l’audit à tout le monde en un quart d’heure. »",
            },
            {
              if: "Refus poli",
              then: "« Je vous remercie de m’avoir reçu. Je laisse ma carte au secrétariat, si la question des demandes non qualifiées revient sur la table. Bonne fin de journée, Maître. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "juridique-telephone",
      title: "Appel au cabinet",
      channel: "telephone",
      duration: "2 à 4 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et professionnellement.",
          lines: [
            "Bonjour, je suis {prenom}, de MJAGENCY, une agence web basée à Sète. Je ne vous appelle pas pour un dossier.",
            "Je souhaiterais parler à Maître {dirigeant}, s’il vous plaît.",
          ],
          tip: "Précisez tout de suite que vous n’êtes pas un client : le secrétariat saura où vous classer, et vous gagnerez en crédibilité.",
        },
        {
          id: "barrage",
          title: "Passer le secrétariat",
          goal: "Donner un objet précis et crédible, et obtenir le bon créneau.",
          lines: [
            "C’est au sujet de la pré-qualification des demandes de nouveaux clients et de la présentation du cabinet en ligne.",
            "Ce n’est pas urgent. S’il est en audience ou en rendez-vous, quel est le meilleur moment pour le joindre, plutôt 9 h ou en fin de journée ?",
            "Et vous, c’est sans doute vous qui recevez les appels de gens qui cherchent un conseil rapide ou qui ne sont pas au bon endroit ?",
          ],
          tip: "L’assistante vit les appels mal qualifiés au quotidien : si elle se reconnaît dans le problème, elle devient votre alliée.",
          branches: [
            {
              if: "On vous demande d’envoyer un mail",
              then: "« Bien sûr. À quelle adresse, et à l’attention de qui ? Je mets en objet “pré-qualification des demandes”, et je rappelle jeudi à 17 h 45 pour savoir s’il a eu le temps de le lire. »",
            },
            {
              if: "« Maître ne reçoit pas de sollicitations commerciales »",
              then: "« Je le comprends. Je vous propose simplement de lui transmettre un audit gratuit de ce que voient ses futurs clients en ligne. S’il ne l’intéresse pas, je ne rappellerai pas. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète d’écouter trente secondes.",
          lines: [
            "Merci de me prendre, Maître, je serai bref. On aide les cabinets du Bassin de Thau à recevoir moins de demandes mal qualifiées, et à avoir une présence en ligne sobre, dans le respect de leurs règles professionnelles.",
            "En regardant votre fiche Google, j’ai vu qu’elle n’indiquait pas vos domaines d’intervention : c’est souvent ce qui fait arriver des demandes qui ne vous concernent pas.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, factuel.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Deux questions pour qualifier le besoin principal.",
          lines: [
            "Aujourd’hui, ce qui vous prend le plus de temps, c’est plutôt le tri des demandes, ou les questions répétitives sur les honoraires et le premier rendez-vous ?",
            "Et les nouveaux clients arrivent surtout par recommandation, par les annuaires, ou par Google ?",
          ],
          branches: [
            {
              if: "Il demande le prix",
              then: "« Je préfère ne pas vous donner un chiffre au hasard, cela dépend de votre existant. C’est l’objet du rendez-vous : on regarde ensemble, et je vous fais une proposition écrite ensuite. »",
            },
            {
              if: "« Et la déontologie ? »",
              then: "« C’est la première chose qu’on regarde. On reste sur une information sincère et sobre, sans mention de résultats ni comparaison, et on valide ensemble avec votre Ordre avant la mise en ligne. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un créneau précis de vingt minutes.",
          lines: [
            "Je vous propose vingt minutes au cabinet, ou en visio si vous préférez : mardi à 9 h 15 ou jeudi à 17 h 45, qu’est-ce qui vous arrange ?",
          ],
          tip: "Jamais de prix au téléphone. Vous vendez vingt minutes de son temps : proposez des créneaux hors audience et hors signature.",
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et préparer l’échange.",
          lines: [
            "C’est noté pour jeudi à 17 h 45. Je vous envoie une confirmation par mail, en copie au secrétariat.",
            "Si vous pouvez penser à deux ou trois exemples de demandes récentes qui ne correspondaient pas au cabinet, ça nous aidera à être concrets.",
            "Merci, Maître, bonne fin de journée.",
          ],
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "D’où viennent vos nouveaux clients aujourd’hui : recommandation de clients, de confrères, annuaires, Google ?",
      why: "Mesurer la part du digital dans l’arrivée des dossiers, sans remettre en cause la recommandation.",
    },
    {
      type: "S",
      question: "Quand une nouvelle demande arrive, qui la reçoit et comment est-elle triée ?",
      why: "Comprendre le circuit de qualification et le rôle du secrétariat.",
    },
    {
      type: "P",
      question: "Sur les demandes que vous recevez, quelle part ne correspond pas au cabinet : mauvais domaine, conseil gratuit, hors zone ?",
      why: "Faire émerger le volume de demandes mal qualifiées.",
    },
    {
      type: "P",
      question: "Les gens vous posent-ils souvent la question des honoraires ou du déroulement du premier rendez-vous avant de venir ?",
      why: "Mettre le doigt sur les questions répétitives qu’une information claire peut absorber.",
    },
    {
      type: "I",
      question: "Un premier rendez-vous qui n’aboutit pas, ça vous coûte combien de temps, entre la prise de contact, l’entretien et la réorientation ?",
      why: "Relier les demandes mal qualifiées au temps facturable perdu.",
    },
    {
      type: "I",
      question: "Et quand une personne recommandée tombe sur une fiche vide ou un site daté, qu’est-ce que ça dit du cabinet, à votre avis ?",
      why: "Lui faire réaliser que l’image en ligne confirme ou affaiblit la recommandation.",
    },
    {
      type: "N",
      question: "Si vous ne receviez que des demandes déjà qualifiées, avec le domaine, l’urgence et les disponibilités, qu’est-ce que ça changerait pour vous et votre secrétariat ?",
      why: "Le laisser formuler lui-même le bénéfice d’une pré-qualification.",
    },
  ],

  objections: [
    {
      id: "deontologie",
      objection: "Notre déontologie ne permet pas ça.",
      hidden: "Crainte réelle d’un manquement, et assimilation de toute présence en ligne à du démarchage ou de la publicité agressive.",
      accueillir: "Vous avez tout à fait raison d’y veiller, c’est votre crédibilité qui est en jeu.",
      questionner: "Ce qui vous gêne, c’est plutôt l’idée de publicité, ou la présence en ligne en elle-même ?",
      recadrer: "Vos règles encadrent la communication, elles ne l’interdisent pas : une information sincère sur vos domaines d’intervention, vos modalités d’honoraires et l’accès au cabinet, c’est ce qu’elles permettent. Pas de mention de résultats obtenus, pas de nom de client, pas de comparaison avec les confrères : on s’y tient.",
      proposer: "On rédige le contenu ensemble, et on le valide avec votre Ordre ou votre Chambre avant la mise en ligne. S’ils demandent une modification, on la fait.",
    },
    {
      id: "deja-quelquun",
      objection: "On est déjà sur l’annuaire du barreau et sur une plateforme, ça suffit.",
      hidden: "Solution par défaut, jamais évaluée, et pas envie de gérer un prestataire de plus.",
      accueillir: "C’est bien d’y être, ce sont des références sérieuses.",
      questionner: "Et quand quelqu’un tape directement le nom du cabinet sur Google, il tombe sur quoi ?",
      recadrer: "Les annuaires listent tous les confrères de la même façon : ils ne disent pas ce qui vous distingue ni comment vous travaillez. Et sur une plateforme, vous êtes à côté de vos concurrents. Votre fiche et votre site, c’est le seul endroit où vous parlez en votre nom.",
      proposer: "Je vous montre dans l’audit gratuit ce que voit une personne recommandée, en vingt minutes.",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, entre les audiences et les dossiers.",
      hidden: "Surcharge réelle, peur d’un projet qui mange les soirées.",
      accueillir: "Je le comprends parfaitement, c’est pour ça que je vous propose un format très court.",
      questionner: "Combien de temps par semaine passez-vous, vous ou votre secrétariat, sur des demandes qui n’aboutissent pas ?",
      recadrer: "Le projet est justement conçu pour vous rendre ce temps. De votre côté, c’est un entretien au départ et des relectures : c’est nous qui rédigeons et qui construisons.",
      proposer: "Vingt minutes pour voir si ça vaut le coup : mardi à 9 h 15 ou jeudi à 17 h 45 ?",
    },
    {
      id: "trop-cher",
      objection: "C’est un budget qu’on n’a pas prévu.",
      hidden: "Réflexe de prudence sur les charges, veut voir le retour avant de s’engager.",
      accueillir: "C’est normal de le regarder de près, c’est une charge du cabinet.",
      questionner: "Combien vous coûte, en temps, un premier rendez-vous qui ne débouche sur rien ?",
      recadrer: "Si quelques rendez-vous inutiles par mois sont évités, le calcul se fait vite. Et on peut étaler le paiement pour que ce soit léger en trésorerie. Notre rémunération reste forfaitaire, jamais liée à vos dossiers ou à vos honoraires.",
      proposer: "Commençons par l’audit gratuit. Vous déciderez ensuite, sans engagement.",
    },
    {
      id: "neveu",
      objection: "Mon fils s’y connaît, il peut nous faire un site.",
      hidden: "Envie d’économiser, et confiance familiale.",
      accueillir: "C’est une bonne idée, et il connaît bien le cabinet.",
      questionner: "Il connaît aussi les règles de votre profession sur la communication, le nom de domaine et les mentions obligatoires ?",
      recadrer: "Pour un cabinet, le site doit respecter des règles précises, et un formulaire de contact reçoit des informations confidentielles : il faut un hébergement et une sécurité à la hauteur du secret professionnel. C’est là que les sites faits maison posent problème.",
      proposer: "Faites l’audit avec nous : vous aurez une liste claire de ce qu’il faut prévoir, qu’il pourra utiliser s’il s’en occupe.",
    },
    {
      id: "linkedin",
      objection: "LinkedIn me suffit, c’est là que sont mes clients.",
      hidden: "Clientèle d’entreprises, pense que le site n’est qu’une plaquette.",
      accueillir: "LinkedIn, c’est un bon outil pour le réseau et les entreprises, vous avez raison.",
      questionner: "Et un particulier ou un chef d’entreprise de {ville} qui cherche un avocat en urgence, il passe par LinkedIn ou par Google ?",
      recadrer: "LinkedIn entretient votre réseau, Google confirme votre sérieux. Le site n’est pas une plaquette : c’est là que le prospect comprend si vous êtes le bon interlocuteur, et que sa demande est triée avant d’arriver chez vous.",
      proposer: "Je vous montre en vingt minutes ce que ça donnerait pour un cabinet de votre taille.",
    },
    {
      id: "bouche-a-oreille",
      objection: "Tout marche à la recommandation chez nous, on n’a pas besoin d’internet.",
      hidden: "Image du métier fondée sur la confiance, méfiance envers tout ce qui ressemble à de la publicité.",
      accueillir: "C’est le meilleur canal pour un cabinet, la confiance ne s’achète pas.",
      questionner: "Et quand un client ou un confrère vous recommande, qu’est-ce que fait la personne avant de vous appeler ?",
      recadrer: "En général, elle tape votre nom sur Google pour vérifier. Si elle tombe sur une fiche vide ou un site daté, la recommandation perd de sa force. Le site ne remplace pas le bouche-à-oreille, il le confirme.",
      proposer: "Je vous propose de regarder ensemble, en vingt minutes, ce que voit une personne à qui l’on vient de vous recommander.",
    },
    {
      id: "rappelez-moi",
      objection: "Envoyez-moi une documentation, je verrai.",
      hidden: "Façon polie de clore, ou vrai besoin de lire avant de s’engager (profil très analytique).",
      accueillir: "Bien sûr, c’est normal de vouloir lire avant de décider.",
      questionner: "Pour vous envoyer quelque chose d’utile, ce qui vous intéresse le plus, c’est le tri des demandes ou l’image du cabinet en ligne ?",
      recadrer: "Une plaquette générique ne vous apprendra pas grand-chose. Un audit fait sur votre cabinet, avec ce que voient vraiment vos futurs clients, c’est plus parlant.",
      proposer: "Je vous envoie l’audit par mail, et je vous appelle jeudi à 17 h 45 pour deux minutes de questions. Ça vous convient ?",
    },
  ],

  proofs: [
    "En général, une personne recommandée vérifie le nom du cabinet sur Google avant d’appeler : la fiche et le site confirment ou affaiblissent la recommandation.",
    "Un particulier en situation urgente contacte souvent plusieurs cabinets et retient celui qui lui explique clairement comment se passe le premier rendez-vous.",
    "Expliquer dès le site les domaines d’intervention et les modalités d’honoraires évite en général une bonne partie des demandes hors sujet.",
    "Une pré-qualification en amont, sans conseil juridique, fait gagner du temps au secrétariat comme au professionnel.",
    "Les annuaires professionnels présentent tous les confrères de la même façon : le site est le seul endroit où le cabinet parle en son nom.",
    "Une présence en ligne sobre et informative reste dans ce que permettent les règles professionnelles, à condition de la faire valider.",
  ],

  buyingSignals: [
    "Il vous demande comment se passe la validation avec l’Ordre ou la Chambre, et qui s’en charge.",
    "Il parle spontanément des gens qui appellent pour « une question rapide » ou pour un conseil gratuit.",
    "Il appelle son assistante ou un associé pour qu’ils assistent à la discussion.",
    "Il évoque l’arrivée d’un nouvel associé, un changement de structure ou un déménagement de cabinet.",
    "Il demande si l’assistant peut vérifier les conflits d’intérêts ou recueillir les pièces avant le rendez-vous.",
    "Il pose des questions précises sur l’hébergement et la confidentialité des messages reçus.",
    "Il dit vouloir développer un domaine précis (droit du travail, droit de la famille, droit immobilier).",
    "Il vous montre lui-même un site de confrère qu’il trouve réussi.",
  ],

  research: {
    platforms: [
      "Google (fiche établissement et résultats « avocat {ville} », « notaire {ville} »…)",
      "Annuaire du barreau local et annuaire national du CNB (avocats)",
      "Annuaire des notaires de France (notaires)",
      "Annuaire de la Chambre des commissaires de justice",
      "LinkedIn (cabinet et associés)",
      "Plateformes de mise en relation juridique",
      "Site internet du cabinet ou de l’office",
      "Societe.com ou Pappers (structure, date de création, associés)",
    ],
    questions: [
      "Quelle est la profession exacte (avocat, notaire, commissaire de justice, médiateur) et à quel barreau ou quelle Chambre le professionnel est-il rattaché ?",
      "Combien d’associés et de collaborateurs compte le cabinet ou l’office ?",
      "Quels domaines d’intervention sont affichés, et le professionnel mentionne-t-il une spécialisation reconnue ou seulement des domaines d’activité ?",
      "Le site indique-t-il les modalités d’honoraires ou le déroulement du premier rendez-vous ?",
      "Le site propose-t-il un formulaire de contact ou une prise de rendez-vous en ligne, et fonctionne-t-il bien sur téléphone ?",
      "La fiche Google est-elle revendiquée, complète (horaires, catégorie, domaines) et y a-t-il des avis sans réponse ?",
      "Le cabinet apparaît-il dans les premiers résultats pour la profession suivie du nom de la ville ?",
      "Le professionnel est-il présent sur une plateforme de mise en relation, et comment y est-il présenté ?",
      "Les associés sont-ils actifs sur LinkedIn, et sur quels sujets ?",
      "Le site actuel contient-il des éléments délicats au regard des règles de la profession (mention de résultats, comparaisons, nom de domaine générique) ?",
    ],
  },

  pitch30s:
    "Bonjour, {prenom}, de MJAGENCY, une agence web à Sète. On aide les cabinets d’avocats, les offices notariaux et les études du Bassin de Thau sur deux choses : une présence en ligne sobre, qui confirme la recommandation au lieu de l’affaiblir, et un assistant qui trie les demandes de nouveaux clients avant qu’elles arrivent sur votre bureau, sans jamais donner de conseil juridique. Tout est rédigé dans le respect de vos règles professionnelles et validé avec votre Ordre ou votre Chambre avant la mise en ligne. Je vous propose vingt minutes pour vous présenter l’audit gratuit.",

  compliance:
    "Secteur à forte contrainte : relisez ce paragraphe avant chaque rendez-vous. Avocats : la publicité personnelle et la sollicitation personnalisée sont autorisées, mais encadrées par le règlement intérieur national de la profession et par les règles du barreau. La communication doit rester sincère, digne et loyale : information sur les domaines d’intervention, les modalités d’honoraires et de rendez-vous, l’accès au cabinet. Interdits : la mention de résultats obtenus ou de dossiers gagnés, la mention du chiffre d’affaires ou de l’identité des clients sans leur accord, toute comparaison avec les confrères ou tout dénigrement, les promesses de résultat. Le titre de « spécialiste » n’est utilisable qu’avec un certificat de spécialisation reconnu : sinon, on parle de « domaines d’activité » ou de « domaines d’intervention ». Le nom de domaine et le site sont soumis aux règles de la profession (en général, le nom de domaine doit reprendre le nom de l’avocat ou du cabinet et ne pas se réduire à un terme générique du droit) : on vérifie avant toute réservation, et l’avocat informe son Conseil de l’ordre de la création du site ou du nom de domaine lorsque les règles de son barreau l’exigent. Notaires : officiers publics, leur communication est plus strictement encadrée par le règlement national du notariat et privilégie une communication institutionnelle ; on reste sur l’information et l’accessibilité (équipe, services, accès, horaires, prise de rendez-vous), sans aucune démarche de sollicitation, et on valide avec la Chambre des notaires. Commissaires de justice : officiers publics également, ils suivent les règles de leur Chambre ; même prudence, contenu informatif uniquement. Médiateurs : pas d’Ordre commun, mais s’ils sont aussi avocats ou inscrits sur une liste de médiateurs auprès d’une cour d’appel, ce sont ces règles qui s’appliquent ; mêmes précautions dans tous les cas. Agent IA : il pré-qualifie uniquement (domaine, urgence, lieu, disponibilités, éventuellement le nom de la partie adverse si le cabinet veut vérifier les conflits d’intérêts) et ne donne jamais de conseil ni d’avis juridique, même général : il renvoie vers un rendez-vous avec le professionnel. Il rappelle qu’aucune relation client n’est créée par l’échange. Les messages reçus sont couverts par la confidentialité : hébergement en Europe, accès restreint, conservation limitée, conformité RGPD, politique de confidentialité et mentions légales complètes. Notre rémunération est toujours forfaitaire, jamais indexée sur les dossiers ou les honoraires obtenus. Avis clients : on ne propose pas la carte NFC d’avis, et les réponses aux avis ne doivent jamais confirmer qu’une personne est cliente ni évoquer un dossier, secret professionnel oblige. Phrase à dire systématiquement : « On valide ensemble avec votre Ordre ou votre Chambre avant la mise en ligne. »",
};

export default sheet;
