import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "immobilier",
  name: "Agence immobilière",
  short: "Immobilier",
  examples: [
    "agence indépendante de transaction",
    "agence franchisée d’un réseau national",
    "agence de location saisonnière (Sète, Marseillan-plage, Frontignan-plage)",
    "gestion locative et location à l’année",
    "agence spécialisée biens de prestige et vue mer",
    "agent immobilier indépendant avec vitrine",
  ],
  tagline:
    "Un métier où tout se joue sur le mandat : les vendeurs choisissent leur agence sur internet bien avant de pousser la porte, et les acheteurs écrivent le soir, quand l’agence est fermée.",

  reality: {
    rhythm:
      "L’agence ouvre vers 9 h. Le lundi matin, dans beaucoup d’agences, c’est la réunion d’équipe : point sur les mandats, les visites de la semaine, les offres en cours. La matinée sert au téléphone (rappeler les acheteurs, relancer les vendeurs), aux annonces à mettre à jour sur les portails et aux rendez-vous chez le notaire. Pause de 12 h à 14 h. L’après-midi, les négociateurs partent en visites et en estimations, le directeur ou le titulaire de la carte reste souvent à l’agence pour le suivi des compromis, la gestion locative et l’accueil. À partir de 17 h, les visites s’enchaînent pour les acheteurs qui sortent du travail, jusqu’à 19 h ou plus. Le samedi est le plus gros jour de visites de la semaine. Les demandes arrivent le soir et le week-end, via les portails, le site et les messages : c’est souvent le lendemain matin qu’on les découvre. Dans les agences franchisées, le directeur d’agence décide localement, mais le site et une partie de la communication dépendent du réseau. Les négociateurs sont souvent des agents commerciaux indépendants : ils ne décident pas des outils de l’agence, mais ils en parlent.",
    pains: [
      "Trouver des mandats de vente : c’est le nerf de la guerre, et la concurrence est forte entre agences, réseaux de mandataires et vente entre particuliers.",
      "Le coût des portails d’annonces, qui augmente, pour des contacts de qualité très variable.",
      "Des dizaines de demandes à trier : curieux, acheteurs sans financement, locataires hors critères, vendeurs qui veulent juste un prix. Beaucoup de temps passé pour peu de dossiers sérieux.",
      "Les demandes du soir et du week-end qui attendent le lendemain : pendant ce temps, l’acheteur a déjà écrit à trois autres agences.",
      "Un marché qui a ralenti avec les taux de crédit : moins de ventes, plus d’efforts pour chacune, et des vendeurs qui ont du mal à baisser leur prix.",
      "Les contraintes réglementaires qui s’empilent (DPE, logements énergivores, mentions obligatoires sur les annonces) et qu’il faut expliquer aux propriétaires.",
      "Le turnover des négociateurs, qui partent parfois avec leurs contacts vendeurs.",
    ],
    clientLoss: [
      "Le vendeur qui tape « estimation maison {ville} » ou « agence immobilière {ville} » compare les avis, le site et la présence locale : il appelle l’agence qui lui inspire le plus confiance, pas forcément la plus proche.",
      "Une demande d’acheteur ou de locataire arrivée le samedi soir et traitée le lundi : le client est déjà en contact avec une autre agence.",
      "Un site daté, lent sur téléphone, sans estimation en ligne : le vendeur passe par un simulateur en ligne ou un mandataire qui récupère son contact.",
      "Des photos de biens moyennes et aucune vidéo, alors que la concurrence publie des visites filmées sur Instagram : le bien semble moins attractif, et le vendeur le remarque.",
      "Des avis Google peu nombreux ou sans réponse, alors que c’est souvent ce que regarde un vendeur avant de confier son bien.",
      "Un propriétaire bailleur mal informé ou peu rappelé en gestion locative, qui part chez l’agence d’à côté au moment du renouvellement.",
    ],
    seasonality:
      "Le printemps est la grande saison des transactions : les vendeurs mettent en vente, les familles veulent déménager avant la rentrée. L’été sur le littoral, c’est double activité : les agences de location saisonnière de Sète, Marseillan-plage ou Frontignan-plage tournent à plein (arrivées, départs, ménage, clés), et les acheteurs de résidences secondaires visitent pendant leurs vacances. À la fin de l’été, vers Montpellier et Sète, la location à l’année explose avec les étudiants et les mutations. À Balaruc-les-Bains, la location de courte durée pour les curistes des thermes (cures de trois semaines, de mars à décembre) fait une activité à part. L’hiver est plus calme : moins de visites, c’est le moment où les agences réfléchissent à leur communication et à leur site pour préparer le printemps. Les meilleures périodes pour prospecter : de fin septembre à mi-décembre et de janvier à début mars. Évitez juillet-août pour les agences saisonnières et fin août - mi-septembre pour la location à l’année.",
    digitalHabits:
      "Toutes les agences publient sur les portails (SeLoger, Leboncoin, Bien’ici, Logic-Immo) via leur logiciel de transaction, qui fournit souvent aussi un site standard, correct mais identique à celui de dizaines d’autres agences. Les agences franchisées ont une page sur le portail du réseau, avec peu de marge de manœuvre. La fiche Google existe, avec parfois beaucoup d’avis demandés après une vente, parfois presque rien. Instagram et Facebook servent à publier les nouveaux biens et les « vendu », de façon irrégulière ; les vidéos de visite montent en puissance mais sont rarement bien faites. Les demandes arrivent par e-mail depuis les portails et se traitent à la main. L’estimation en ligne, quand elle existe, est un simple formulaire. Le directeur est à l’aise avec le digital en général, mais n’a pas le temps de s’en occuper lui-même.",
  },

  offers: {
    priority: [
      {
        offer: "site-premium",
        pitch:
          "Votre site, c’est ce que regarde un vendeur avant de vous confier sa maison. Un site à votre image, avec de belles photos, des visites en vidéo et surtout une estimation en ligne qui vous ramène des contacts vendeurs directement, pas via un portail.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Un assistant qui répond aux demandes le soir et le week-end, pendant que vous êtes en visite ou chez vous. Il demande à l’acheteur son budget, son financement et ses critères, au locataire ses revenus et sa date d’entrée, au vendeur l’adresse et le type de bien, et le lundi matin vous avez des dossiers triés.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Les vendeurs regardent comment vous mettez les biens en valeur. On filme vos biens en courtes vidéos pour Instagram et Facebook, on publie régulièrement, et vos futurs vendeurs voient une agence active et soignée.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit un vendeur qui cherche une agence à {ville} : votre fiche Google, votre site sur téléphone, vos avis, et je vous compare aux trois agences les plus proches. Vous repartez avec trois actions concrètes. C’est gratuit.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Quand un propriétaire tape « agence immobilière » à {ville}, c’est votre fiche Google qu’il voit en premier. On la complète, on met des photos de l’équipe et de l’agence, et on répond à vos avis, pour que le vendeur ait envie de vous appeler vous.",
      },
    ],
    upsell:
      "Après l’audit et la fiche Google, la suite logique est l’agent IA qui qualifie les demandes le soir et le week-end, parce qu’il fait gagner du temps dès le premier mois. Ensuite, le site premium avec estimation en ligne, à lancer en fin d’hiver pour être prêt au printemps. Pour une petite agence indépendante, un site vitrine Signature avec estimation en ligne peut être une étape avant le premium. Puis la gestion des réseaux sociaux avec une séance vidéo par mois sur les plus beaux biens. Pour une agence qui fait de la gestion locative ou de la location saisonnière, un logiciel sur mesure pour le suivi des propriétaires, des états des lieux ou des arrivées peut venir ensuite.",
  },

  timing: {
    best: [
      {
        label: "Milieu de matinée",
        days: [2, 3, 4, 5],
        from: "09:30",
        to: "11:00",
        why: "La réunion et les premiers appels sont passés, les visites n’ont pas commencé : le directeur est à l’agence, derrière son bureau.",
      },
      {
        label: "Début d’après-midi",
        days: [1, 2, 3, 4, 5],
        from: "14:00",
        to: "15:30",
        why: "Retour de pause, avant le départ en visites de fin de journée : c’est souvent le moment le plus calme à l’agence.",
      },
      {
        label: "Téléphone en milieu de semaine",
        days: [2, 3, 4],
        from: "10:00",
        to: "11:00",
        why: "Le mardi, mercredi et jeudi matin, le directeur est en général joignable sur le fixe de l’agence.",
      },
    ],
    avoid: [
      {
        label: "Réunion du lundi matin",
        days: [1],
        from: "09:00",
        to: "11:00",
        why: "Dans beaucoup d’agences, c’est le point hebdomadaire de l’équipe : personne ne vous recevra.",
      },
      {
        label: "Fin de journée",
        from: "17:00",
        to: "19:30",
        why: "Les visites s’enchaînent pour les acheteurs qui sortent du travail : l’agence est vide ou sous pression.",
      },
      {
        label: "Samedi",
        days: [6],
        from: "09:00",
        to: "18:00",
        why: "C’est le plus gros jour de visites de la semaine : ne passez jamais le samedi.",
      },
      {
        label: "Pause déjeuner",
        from: "12:00",
        to: "14:00",
        why: "L’agence est souvent fermée, ou le directeur déjeune avec un client ou un notaire.",
      },
    ],
    usuallyClosed: [0],
    phoneNote:
      "Appelez le fixe de l’agence, entre 9 h 30 et 11 h ou entre 14 h et 15 h 30, du mardi au vendredi. C’est souvent l’assistante ou un négociateur qui décroche : demandez le directeur ou le titulaire de la carte par son nom (il figure dans les mentions légales du site et sur la vitrine). Ne demandez pas un négociateur : il ne décide pas des outils de l’agence. Évitez le portable personnel d’un négociateur trouvé sur une annonce : c’est un contact pour les clients, pas pour les prestataires. Certaines agences ferment le lundi matin ou le lundi entier : vérifiez la fiche Google avant de vous déplacer.",
    seasonNote:
      "Prospectez de fin septembre à mi-décembre et de janvier à début mars, quand l’agence prépare le printemps. Oubliez juillet-août pour les agences de location saisonnière, et fin août - mi-septembre pour celles qui font de la location à l’année (rentrée étudiante). Au printemps, visez plutôt le début d’après-midi en semaine.",
  },

  scripts: {
    physique: {
      id: "immobilier-physique",
      title: "Visite en agence",
      channel: "physique",
      duration: "4 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer poliment, identifier le directeur ou le titulaire de la carte, et ne pas passer pour un client.",
          lines: [
            "Bonjour ! Je ne cherche pas à acheter, je vous rassure tout de suite.",
            "Je voulais dire un mot au directeur de l’agence, c’est vous ?",
            "Pas de souci. Il ou elle est plutôt là à quel moment ? Je repasse, j’en ai pour cinq minutes.",
          ],
          tip: "Tenue soignée : dans ce métier, on juge sur l’apparence. Regardez la vitrine en entrant (qualité des photos, barème d’honoraires, mention de la carte professionnelle) : ce sera votre matière pour le constat.",
          branches: [
            {
              if: "C’est un négociateur ou l’assistante",
              then: "Soyez aimable, demandez le nom du directeur et le meilleur moment. Laissez votre carte avec un mot écrit : « Passé au sujet de vos demandes du week-end, je repasse jeudi vers 10 h. {prenom} ».",
            },
            {
              if: "Le directeur est en rendez-vous vendeur",
              then: "Ne restez pas dans l’agence à attendre en écoutant. Dites : « Je ne vais pas vous gêner, je repasse. Il est plus disponible le matin ou en début d’après-midi ? »",
            },
            {
              if: "C’est le directeur",
              then: "Passez directement à l’accroche, en lui serrant la main et en l’appelant par son nom si vous l’avez vu sur la vitrine.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Se présenter et obtenir trente secondes d’attention, en parlant de mandats et de demandes, pas de technique.",
          lines: [
            "Enchanté, {prenom}, de MJAGENCY, une agence de Sète. On aide les agences du coin à capter plus de vendeurs en direct et à ne plus laisser dormir les demandes du week-end.",
            "Je ne viens rien vous vendre aujourd’hui. J’ai regardé comment {commerce} apparaît quand un propriétaire cherche une agence à {ville}, et il y a un point qui m’a interpellé. Je vous montre, trente secondes ?",
          ],
          tip: "Parlez son langage : mandats, vendeurs, estimation, demandes qualifiées. Ne dites jamais « visibilité » tout seul : il en entend parler tous les jours par les portails.",
          branches: [
            {
              if: "« On est déjà démarchés tous les jours »",
              then: "« Je m’en doute, et je ne vais pas vous parler de portail. Je vous montre juste un point précis, et vous me dites si c’est réglé. »",
            },
            {
              if: "« Je n’ai pas le temps, j’ai une visite »",
              then: "« Je vous laisse filer. Je repasse mardi à 10 h ou jeudi à 14 h 30, qu’est-ce qui vous arrange ? »",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN point concret, visible sur sa fiche ou son site, sans critiquer son travail d’agent.",
          lines: [
            "Regardez : quand je tape « estimation appartement {ville} », vous n’apparaissez pas, ce sont un simulateur national et un réseau de mandataires qui sortent. Le vendeur leur laisse ses coordonnées.",
            "Votre site, sur téléphone, met du temps à charger, et le formulaire d’estimation, c’est un simple champ « message ». Le vendeur ne sait pas ce qu’il va obtenir.",
            "Et sur vos annonces, le contact se fait par un formulaire ou par le téléphone de l’agence. Le samedi soir ou le dimanche, personne ne répond avant le lundi. Entre-temps, l’acheteur a souvent écrit à d’autres agences.",
            "Vos avis Google sont très bons, mais il y en a peu de récents, et pas de réponse. C’est ce que regarde un vendeur avant de choisir entre deux agences.",
          ],
          tip: "Un seul constat, le plus parlant, vérifié avant d’entrer. N’envoyez jamais de fausse demande pour tester l’agence : parlez des demandes du week-end sans reproche, c’est le cas de presque toutes les agences.",
          branches: [
            {
              if: "Agence franchisée : « Le site, c’est le réseau »",
              then: "« Oui, et c’est normal. Mais la fiche Google de votre agence, vos avis, vos vidéos de biens et les réponses aux demandes du soir, c’est vous qui les avez en main. C’est là que je peux vous aider. »",
            },
            {
              if: "Le site et la fiche sont déjà très bons",
              then: "Félicitez sincèrement, puis basculez sur les demandes : « Et le tri des demandes, les curieux, les dossiers sans financement, ça vous prend combien de temps par semaine ? »",
            },
            {
              if: "« Les simulateurs, ça ne donne rien de sérieux »",
              then: "« C’est vrai, mais le vendeur, lui, laisse son numéro. L’idée, c’est qu’il le laisse chez vous, et que ce soit vous qui le rappeliez. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de ses mandats, de ses demandes et de son temps.",
          lines: [
            "Aujourd’hui, vos nouveaux mandats de vente, ils viennent surtout d’où : recommandation, vitrine, portails, internet ?",
            "Les demandes qui arrivent le soir et le week-end, qui les traite, et quand ?",
            "Sur dix demandes d’acheteurs, combien sont vraiment des dossiers sérieux, d’après vous ?",
          ],
          tip: "Une seule question, puis silence. Un directeur d’agence aime parler de son marché : laissez-le faire, notez les mots qu’il emploie et réutilisez-les.",
          branches: [
            {
              if: "Il parle du coût des portails",
              then: "« C’est justement l’intérêt d’une estimation en ligne sur votre propre site : des vendeurs qui arrivent chez vous, sans payer le contact. »",
            },
            {
              if: "Il parle du tri des demandes",
              then: "« C’est exactement ce que fait un assistant de qualification : il pose les bonnes questions à votre place, à toute heure, et vous ne rappelez que les dossiers solides. »",
            },
            {
              if: "Il parle du marché qui ralentit",
              then: "« Raison de plus pour être celui que les vendeurs appellent en premier. Quand il y a moins de biens, c’est le mandat qui fait la différence. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous d’audit, ou au moins le nom et le numéro du directeur.",
          lines: [
            "Je vous propose quelque chose de simple : un audit gratuit de ce que voit un vendeur qui cherche une agence à {ville}, avec une comparaison avec trois agences proches.",
            "Vingt minutes, ici à l’agence. Je repasse mardi à 10 h ou jeudi à 14 h 30, qu’est-ce qui vous arrange ?",
            "Je note votre nom et votre ligne directe, au cas où je doive décaler ?",
          ],
          tip: "Proposez des créneaux en milieu de matinée ou en début d’après-midi, jamais en fin de journée ni le samedi. Notez le rendez-vous devant lui.",
          branches: [
            {
              if: "« Envoyez-moi une proposition par mail »",
              then: "« Volontiers après l’audit, mais une proposition sans avoir vu vos chiffres, ce serait du vent. Vingt minutes, mardi 10 h ou jeudi 14 h 30 ? »",
            },
            {
              if: "« Il faut que j’en parle à mon associé / au réseau »",
              then: "« Bien sûr. Le plus simple, c’est que je vous présente l’audit à tous les deux. Il est là plutôt quel jour ? »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte : le jour où vous voulez récupérer les vendeurs qui passent par les simulateurs, vous saurez qui appeler. Bonne journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "immobilier-telephone",
      title: "Appel à l’agence",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement, dire tout de suite que ce n’est pas pour un bien, et vérifier le moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Je ne vous appelle pas pour un bien, je préfère vous le dire tout de suite. Je vous prends deux minutes, c’est possible ?",
          ],
          tip: "Dites que ce n’est pas pour un bien dès la deuxième phrase : sinon on va vous passer un négociateur, et il se sentira piégé.",
          branches: [
            {
              if: "« J’allais partir en visite »",
              then: "« Je vous laisse filer. Je vous rappelle demain vers 10 h, ça vous va ? »",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le directeur ou le titulaire de la carte, ou au moins son nom et son créneau.",
          lines: [
            "Je souhaiterais parler à {dirigeant}, le directeur de l’agence. C’est au sujet de la façon dont l’agence ressort sur Google quand un propriétaire cherche une estimation.",
            "Il est plus facile à joindre à quel moment, le matin ou en début d’après-midi ?",
          ],
          tip: "Utilisez le nom du directeur trouvé sur les mentions légales du site ou sur la vitrine. L’assistante filtre beaucoup de démarchages de portails : ne ressemblez pas à un portail.",
          branches: [
            {
              if: "« C’est pour de la publicité ? On a déjà nos portails »",
              then: "« Non, je ne vends pas d’annonces. C’est pour lui signaler un point précis sur sa fiche Google et ses demandes vendeurs. »",
            },
            {
              if: "« Il est en rendez-vous »",
              then: "« Pas de souci. Je peux le rappeler mardi vers 10 h, ou vous préférez que je passe à l’agence ? »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète et liée aux mandats de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. En préparant mon appel, j’ai tapé « estimation maison {ville} », et ce sont des simulateurs nationaux qui sortent, pas les agences du coin.",
            "Ces vendeurs-là laissent leurs coordonnées ailleurs. On aide les agences du Bassin de Thau à les récupérer en direct, et à répondre aux demandes du soir sans y passer leurs soirées.",
          ],
          tip: "Un seul constat, vérifié avant l’appel. Parlez de vendeurs et de mandats, c’est ce qui intéresse un directeur.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Qualifier en une ou deux questions.",
          lines: [
            "Aujourd’hui, votre site vous amène des demandes d’estimation, ou c’est surtout la vitrine et la recommandation ?",
            "Et les demandes qui arrivent le week-end, elles sont traitées quand ?",
          ],
          tip: "Deux questions maximum. S’il parle beaucoup, laissez-le : notez tout pour le rendez-vous.",
          branches: [
            {
              if: "« Le site, c’est le réseau, je n’ai pas la main »",
              then: "« Je comprends. Ce que je veux vous montrer, c’est justement ce que vous pouvez faire à côté : fiche Google, avis, réponses aux demandes. »",
            },
            {
              if: "« On traite tout le lundi »",
              then: "« C’est le cas de beaucoup d’agences. C’est un des points que je veux vous montrer. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes à l’agence, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, à l’agence. C’est gratuit, et vous repartez avec trois actions concrètes, comparées à trois agences proches.",
            "Je peux passer mardi à 10 h, ou jeudi à 14 h 30. Qu’est-ce qui vous arrange ?",
          ],
          tip: "Jamais de prix au téléphone. Un directeur d’agence respecte ça : lui non plus ne donne pas un prix de vente sans avoir visité.",
          branches: [
            {
              if: "« C’est combien ? »",
              then: "« Le rendez-vous et l’audit sont gratuits. Pour le reste, c’est comme une estimation : je ne donne pas de chiffre sans avoir vu. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Dites-moi le jour qui vous arrange, en milieu de matinée ou en début d’après-midi, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une image professionnelle.",
          lines: [
            "Parfait, je note jeudi à 14 h 30 à l’agence, avec vous, {dirigeant}.",
            "Je vous envoie un e-mail de confirmation avec mes coordonnées, et un petit SMS la veille.",
            "Merci pour votre temps, et bonnes visites.",
          ],
          tip: "Dans l’immobilier, un e-mail de confirmation propre est attendu. Envoyez-le dans l’heure, avec l’adresse de l’agence et l’heure exacte.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos mandats de vente viennent surtout d’où : recommandation, vitrine, portails, site, prospection ?",
      why: "Comprendre sa source de mandats et la place réelle d’internet dans son activité vendeurs.",
    },
    {
      type: "S",
      question: "Les demandes des portails, du site et des réseaux, qui les traite chez vous, et à quel moment ?",
      why: "Repérer le traitement manuel, les délais du week-end et une ouverture pour l’agent IA.",
    },
    {
      type: "P",
      question: "Sur toutes les demandes que vous recevez, combien vous font perdre du temps : curieux, pas de financement, locataires hors critères ?",
      why: "Lui faire mesurer lui-même le temps perdu au tri.",
    },
    {
      type: "P",
      question: "Ça vous arrive de rappeler un acheteur ou un vendeur le lundi, et d’apprendre qu’il a déjà vu une autre agence ?",
      why: "Faire émerger le coût des réponses tardives.",
    },
    {
      type: "I",
      question: "Un vendeur de {ville} qui fait une estimation sur un simulateur national, d’après vous, à qui va son mandat ensuite ?",
      why: "Faire réaliser que les mandats se jouent avant même le premier contact, sans avancer de chiffre.",
    },
    {
      type: "I",
      question: "Si les portails continuent d’augmenter leurs tarifs, comment vous voyez votre budget annonces dans deux ou trois ans ?",
      why: "Lui faire mesurer la dépendance aux portails et l’intérêt d’une source de contacts à lui.",
    },
    {
      type: "N",
      question: "Si chaque lundi matin vous aviez vos demandes du week-end déjà triées, avec budget, financement et critères, et quelques demandes d’estimation arrivées directement par votre site, qu’est-ce que ça changerait pour l’agence ?",
      why: "Lui faire formuler lui-même le bénéfice combiné du site avec estimation et de l’agent IA.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "On a déjà un site, il est fourni avec notre logiciel de transaction.",
      hidden: "Le site existe, donc le sujet lui semble réglé. Souvent, il sait qu’il est standard, mais n’a jamais mesuré ce qu’il rapporte.",
      accueillir: "C’est très pratique, les annonces se mettent à jour toutes seules, c’est un vrai confort.",
      questionner: "Et ce site, il vous amène combien de demandes d’estimation par mois, à peu près ? Il ressemble à celui des autres agences qui ont le même logiciel ?",
      recadrer: "Le site du logiciel fait bien le travail d’annonces. Ce qui fait signer un vendeur, c’est ce qui vous distingue : l’image de l’agence, l’estimation en ligne, les vidéos de biens. On peut garder le flux d’annonces et construire autour.",
      proposer: "Je vous fais l’audit gratuit, et on regarde ce que votre site apporte côté vendeurs par rapport à trois agences proches. Mardi 10 h ou jeudi 14 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je suis en visite toute la journée.",
      hidden: "Il est vraiment sous l’eau, et il a peur d’un projet de plus à suivre.",
      accueillir: "Je comprends, c’est un métier où on est plus souvent dehors qu’au bureau.",
      questionner: "Justement, les demandes qui arrivent pendant vos visites, et le soir, qui s’en occupe ?",
      recadrer: "Ce que je vous propose, c’est de vous faire gagner du temps, pas de vous en prendre : un assistant qui trie les demandes pendant que vous visitez, et un site qu’on gère pour vous.",
      proposer: "Vingt minutes un matin, avant vos visites. Mardi 10 h ou jeudi 10 h, qu’est-ce qui vous arrange ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, on paie déjà les portails, et le marché est difficile.",
      hidden: "Le budget annonces pèse lourd, et il n’a pas envie d’ajouter une ligne de dépense sans être sûr du retour.",
      accueillir: "Je comprends, avec les portails et un marché plus lent, chaque dépense est regardée de près.",
      questionner: "Un mandat de vente de plus sur l’année, ça représente combien d’honoraires pour vous ?",
      recadrer: "L’idée n’est pas d’ajouter un portail de plus, mais d’avoir des contacts vendeurs à vous, qui ne coûtent rien par contact. Et on peut commencer petit, par la fiche Google ou l’assistant, au mois.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui peut vous rapporter un mandat et ce qui ne vaut pas la peine, et vous décidez ensuite.",
    },
    {
      id: "neveu",
      objection: "C’est ma stagiaire qui fait nos Instagram, et mon fils nous aide pour le site.",
      hidden: "Il veut garder la main et ne pas dépenser. Souvent, la publication dépend de la présence de la stagiaire.",
      accueillir: "C’est bien d’impliquer l’équipe, ils connaissent les biens mieux que personne.",
      questionner: "Et quand la stagiaire termine son stage, qui prend le relais ? Les vidéos de biens, elles sont faites comment aujourd’hui ?",
      recadrer: "Publier, c’est une chose. Ce qui convainc un vendeur, c’est une présence régulière et soignée, avec des vidéos qui mettent vraiment les biens en valeur, et ça tient dans la durée.",
      proposer: "Je vous laisse l’audit gratuit, votre équipe pourra s’en servir comme feuille de route. Et si un jour vous voulez déléguer, vous saurez à qui.",
    },
    {
      id: "instagram-suffit",
      objection: "On publie nos biens sur Instagram et Facebook, ça nous suffit.",
      hidden: "Il a l’impression d’être déjà bien présent en ligne.",
      accueillir: "C’est très bien, beaucoup d’agences ne le font même pas.",
      questionner: "Et un propriétaire qui veut vendre et qui ne vous connaît pas, il vous trouve comment ? Il cherche sur Instagram, ou il tape « agence immobilière {ville} » sur Google ?",
      recadrer: "Instagram, c’est parfait pour montrer vos biens à ceux qui vous suivent. Le vendeur qui ne vous connaît pas, lui, cherche en général sur Google, et c’est là qu’il choisit à qui confier son estimation.",
      proposer: "Gardez vos réseaux, on n’y touche pas. Je vous montre juste ce que voit un vendeur sur Google, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici, les mandats viennent de la réputation et de la recommandation, pas d’internet.",
      hidden: "La fierté d’un réseau local construit sur des années, et l’idée que le digital, c’est pour les réseaux de mandataires.",
      accueillir: "C’est la meilleure source de mandats qui soit, et ça se mérite.",
      questionner: "Quand un ancien client vous recommande à un voisin qui veut vendre, vous savez ce que fait ce voisin juste avant de vous appeler ?",
      recadrer: "En général, il vérifie : il regarde vos avis, votre site, vos biens vendus. La recommandation ouvre la porte, votre présence en ligne la confirme ou la referme.",
      proposer: "Je vous propose de regarder ensemble ce que ce voisin voit de vous. Vingt minutes, gratuitement. Mardi 10 h ou jeudi 14 h 30 ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi une présentation par mail.",
      hidden: "Souvent un refus poli, parfois une vraie journée chargée.",
      accueillir: "Bien sûr, je comprends que ce ne soit pas le moment.",
      questionner: "Pour ne pas vous déranger au mauvais moment, vous êtes plus disponible en milieu de matinée ou en début d’après-midi ?",
      recadrer: "Une présentation générale, vous en recevez tous les jours de la part des portails. Ce que j’ai à vous montrer est propre à votre agence, et ça se voit beaucoup mieux à l’écran.",
      proposer: "Je passe jeudi à 14 h 30, vingt minutes, et si ça ne vous parle pas, je ne vous relance plus. Ça vous va ?",
    },
    {
      id: "reseau-franchise",
      objection: "Le réseau gère déjà notre site et notre communication, je n’ai pas la main.",
      hidden: "Il pense qu’il n’a pas le droit de faire autre chose, ou il a peur d’aller contre la charte du réseau.",
      accueillir: "C’est normal, c’est un des avantages d’être dans un réseau : vous n’avez pas à gérer le site.",
      questionner: "Et la fiche Google de votre agence, vos avis, les réponses aux demandes du soir et les vidéos de vos biens, c’est le réseau qui s’en occupe, ou c’est vous ?",
      recadrer: "Le réseau porte la marque au niveau national. Ce qui fait signer un vendeur à {ville}, c’est votre agence : votre équipe, vos avis, votre réactivité. Tout ça, vous l’avez en main, dans le respect de la charte.",
      proposer: "Je vous fais l’audit gratuit, uniquement sur ce qui dépend de vous, et on vérifie ensemble ce que la charte du réseau autorise. Mardi 10 h ou jeudi 14 h 30 ?",
    },
  ],

  proofs: [
    "En général, un propriétaire qui veut vendre commence par chercher une estimation ou une agence sur internet, bien avant de pousser la porte d’une agence.",
    "Les avis Google comptent beaucoup quand un vendeur hésite entre deux agences : c’est la preuve que d’autres propriétaires leur ont fait confiance.",
    "Une demande qui reçoit une réponse rapide, même le soir, a beaucoup plus de chances d’aboutir : l’acheteur contacte souvent plusieurs agences en même temps.",
    "Poser deux ou trois questions dès la première demande (budget, financement, date de projet) permet de ne rappeler que les dossiers sérieux.",
    "Les vidéos de visite courtes attirent davantage l’attention que les photos seules sur les réseaux, et les vendeurs regardent comment une agence met les biens en valeur.",
    "Un site à l’image de l’agence, avec ses biens vendus et son équipe, rassure un vendeur plus qu’un site standard identique à celui de dizaines d’autres agences.",
    "Les contacts vendeurs qui arrivent par votre propre site ne dépendent pas du tarif d’un portail.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour tester lui-même la recherche « estimation {ville} » ou pour regarder sa fiche Google.",
    "Il se plaint spontanément du prix des portails ou de la qualité des contacts qu’ils envoient.",
    "Il vous raconte un mandat perdu au profit d’un mandataire ou d’une autre agence, ou un acheteur perdu faute de réponse rapide.",
    "Question : « Et votre assistant, il pourrait demander le financement et la date de projet avant de me transmettre ? »",
    "Il vous montre les sites d’agences concurrentes qu’il trouve réussis.",
    "Il évoque un projet : ouverture d’une deuxième agence, sortie d’un réseau, lancement de la gestion locative ou de la location saisonnière, arrivée d’un nouveau négociateur.",
    "Il appelle un associé ou un négociateur pour qu’il écoute la fin de la conversation.",
    "Il demande si vous travaillez déjà avec d’autres agences, et lesquelles (pour vérifier que ce ne sont pas ses concurrents directs).",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "SeLoger",
      "Leboncoin",
      "Bien’ici",
      "Logic-Immo",
      "Portail du réseau de franchise",
      "Site internet de l’agence",
      "Instagram",
      "Facebook",
    ],
    questions: [
      "L’agence est-elle indépendante ou franchisée, et que contient sa page sur le portail du réseau ?",
      "Son site est-il standard (fourni par un logiciel de transaction) ou sur mesure, rapide sur téléphone, et propose-t-il une estimation en ligne ?",
      "Sur la recherche « estimation maison {ville} » ou « agence immobilière {ville} », où sort {commerce} par rapport aux trois agences proches et aux simulateurs nationaux ?",
      "La fiche Google est-elle complète (photos de l’équipe et de l’agence, horaires, services : transaction, location, gestion, saisonnier), et combien d’avis récents avec réponses ?",
      "Combien de biens sont en ligne sur les portails, quelle est la qualité des photos, y a-t-il des visites vidéo ?",
      "Le compte Instagram publie-t-il régulièrement, avec des vidéos de biens, et quand date la dernière publication ?",
      "Les mentions légales obligatoires sont-elles présentes sur le site : numéro de carte professionnelle, garant financier, barème d’honoraires ?",
      "L’agence fait-elle de la location saisonnière ou de la gestion locative, et comment les propriétaires bailleurs peuvent-ils la contacter ?",
      "Que disent les avis négatifs : manque de suivi, pas de rappel, estimation surévaluée, gestion locative ?",
      "Y a-t-il des signes d’un projet récent : nouvelle agence, nouveau directeur, changement de réseau, recrutement de négociateurs ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les agences immobilières du Bassin de Thau à capter plus de vendeurs en direct, sans passer par les portails, et à ne plus laisser dormir les demandes du week-end. En général, ça se joue sur trois choses : une fiche Google avec des avis récents, une estimation en ligne sur votre site, et une réponse rapide à chaque demande, même le soir. J’ai regardé {commerce} en préparant ma visite, il y a deux ou trois points à gagner. Je vous les montre en vingt minutes, gratuitement, mardi ou jeudi ?",

  compliance:
    "Loi Hoguet : sur le site, la fiche et tous les supports, afficher le numéro de carte professionnelle (mention T pour transaction, G pour gestion), la CCI qui l’a délivrée, le nom et l’adresse du garant financier et le montant de la garantie ; ne jamais créer de contenu pour une activité que la carte ne couvre pas (pas de page gestion locative sans carte G). Le barème des honoraires doit être affiché en vitrine et accessible sur le site, et les honoraires pratiqués ne doivent pas le dépasser. Chaque annonce doit indiquer le montant des honoraires TTC et à la charge de qui ils sont (acquéreur ou vendeur), avec le prix hors honoraires et le pourcentage lorsqu’ils sont à la charge de l’acquéreur, ainsi que la classe énergie et climat du DPE et l’estimation des dépenses énergétiques. Pour la location : loyer, charges, dépôt de garantie, surface habitable et honoraires locataire (plafonnés) ; les logements classés G ne peuvent plus être proposés en nouvelle location. En location saisonnière, afficher le numéro d’enregistrement du meublé de tourisme dans les communes qui l’exigent. L’agent IA ne doit jamais donner d’estimation ferme ni d’avis juridique, et ne doit poser aucune question discriminatoire aux candidats locataires (origine, situation familiale, santé…) : seulement les critères autorisés (revenus, garanties, date d’entrée). Formulaires d’estimation et de contact : consentement clair au traitement des données et mention du médiateur de la consommation sur le site. Photos et vidéos de biens : accord écrit du propriétaire, aucune personne ni objet personnel identifiable.",
};

export default sheet;
