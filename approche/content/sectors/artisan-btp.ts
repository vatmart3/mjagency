import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "artisan-btp",
  name: "Artisan du bâtiment",
  short: "Artisan BTP",
  examples: [
    "plombier chauffagiste",
    "électricien",
    "maçon",
    "peintre en bâtiment",
    "installateur de climatisation et pompe à chaleur",
    "pisciniste",
    "carreleur, menuisier, couvreur",
  ],
  tagline: "Il a plus de travail qu’il ne peut en faire, mais pas forcément le bon : on l’aide à trier les demandes et à rendre le soir aux devis.",

  reality: {
    rhythm:
      "Levé vers 6 h, passage au fournisseur (Point P, Cedeo, Rexel, Gedimat) à l’ouverture, sur chantier de 8 h à 17 h avec une pause déjeuner au camion. Le téléphone sonne toute la journée mais il ne décroche pas sous un évier ou sur un toit : il rappelle le soir, quand il y pense. Retour vers 17 h 30 – 18 h, puis devis, factures, commandes de matériel et rappels jusqu’à 20 h, souvent sur la table de la cuisine. Le samedi matin sert aux visites de devis chez les particuliers et à rattraper la paperasse. Dans beaucoup de petites entreprises, c’est le conjoint qui tient l’administratif à mi-temps depuis la maison : c’est souvent lui ou elle qui voit passer les demandes et qui paie les factures des fournisseurs.",
    pains: [
      "Les devis se font le soir ou le dimanche, parfois avec une semaine de retard, et pendant ce temps le client a signé ailleurs.",
      "Les appels manqués en journée : il ne peut pas décrocher sur un chantier, et la plupart des gens ne laissent pas de message, ils appellent le suivant sur Google.",
      "Les déplacements pour rien : des particuliers qui veulent « juste un prix » pour comparer, des devis faits à la main et jamais signés.",
      "Les plateformes de mise en relation payantes, où la même demande est souvent envoyée à plusieurs artisans et où il faut rappeler en dix minutes pour avoir une chance.",
      "Le suivi administratif : acomptes à relancer, factures impayées, situations de chantier tenues dans un carnet ou dans la tête.",
      "Son travail est beau mais invisible : des centaines de photos avant/après dans le téléphone, jamais montrées à personne.",
      "Le planning qui explose : un fournisseur en retard, un mistral qui arrête le chantier de toiture, un client qui change d’avis, et toute la semaine est à refaire.",
    ],
    clientLoss: [
      "Il rappelle trop tard : le particulier a contacté trois artisans, c’est souvent celui qui rappelle en premier qui obtient la visite.",
      "Sa fiche Google est vide ou n’a que quelques vieux avis, alors que le concurrent juste au-dessus a des dizaines d’avis et des photos de chantiers.",
      "Il n’a ni site ni photos de réalisations : pour un chantier de plusieurs milliers d’euros, le client ne peut pas se rassurer avant d’appeler.",
      "Le devis part tard, sur une feuille peu lisible, sans relance : le client ne comprend pas ce qu’il paie et choisit le devis le plus clair.",
      "La messagerie est pleine ou le numéro affiché n’est plus le bon, sur une vieille annonce d’annuaire.",
      "Aucune mention de l’assurance décennale ni de qualification visible : avec tous les faux dépanneurs, le client prudent passe son chemin.",
    ],
    seasonality:
      "Sur le littoral, tout dépend du métier. Climatisation et piscine : rush d’avril à juillet pour être prêt avant l’été, puis urgences de pannes en juillet-août, impossible de les voir à ce moment-là. Plomberie : urgences toute l’année, pic en hiver avec les chauffe-eau et les fuites. Peinture et maçonnerie : gros volume du printemps à l’automne, l’hiver est plus calme et tourné vers l’intérieur. Les propriétaires de résidences secondaires et de locations saisonnières (Marseillan-Plage, Frontignan-Plage, Balaruc, la Corniche à Sète) font faire leurs travaux entre octobre et mars pour être prêts pour la saison, et beaucoup demandent leurs devis à distance depuis Lyon ou Paris : ils choisissent sur Google et par écrit. Beaucoup d’artisans ferment deux à trois semaines en août. La meilleure période pour prospecter : de novembre à février, quand ils ont le temps de réfléchir à l’année et de faire le point sur leur administratif.",
    digitalHabits:
      "Le numéro pro est souvent le portable perso. Les échanges avec les clients passent par texto et WhatsApp (photos de la fuite, du tableau électrique). Une page Facebook existe parfois, créée par un proche et plus mise à jour depuis longtemps. La fiche Google a souvent été créée automatiquement et n’a jamais été revendiquée. Les devis se font sur Word ou Excel, sur un logiciel de devis basique, ou encore sur carnet à souche. Certains paient une plateforme de mise en relation ou un annuaire avec un abonnement mensuel pour un site ancien qu’ils ne peuvent pas modifier. Les jeunes artisans, surtout piscinistes et peintres, commencent à poster des avant/après sur Instagram.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site avec vos photos de chantiers et un formulaire de demande de devis qui trie pour vous : type de travaux, commune, photos du problème, délai souhaité. Vous voyez tout de suite si ça vaut le déplacement, et le propriétaire de Lyon qui a une maison à Marseillan vous trouve.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Quand un chauffe-eau lâche ou qu’une clim tombe en panne, les gens tapent leur problème et leur ville sur le téléphone, et ils appellent un des premiers. Une fiche complète, avec vos photos, vos zones d’intervention et vos avis, c’est ce qui vous met dans ces premiers-là.",
      },
      {
        offer: "logiciel",
        pitch:
          "Un outil simple sur votre téléphone : vous faites le devis chez le client, il signe sur l’écran, la demande d’acompte part toute seule, et le suivi du chantier est au même endroit. Vous rendez vos soirées à votre famille au lieu de recopier des devis.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je regarde en vingt minutes ce que voit un client qui vous cherche sur Google, je vous compare à trois artisans du coin et je vous donne trois choses à corriger. C’est gratuit, et il y en a au moins une que vous pourrez faire seul.",
      },
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte que vous tendez au client en fin de chantier, quand il est content : il pose son téléphone dessus et il arrive directement sur la page pour laisser son avis. C’est le moment où il est le plus satisfait, c’est dommage de le laisser passer.",
      },
    ],
    upsell:
      "On commence par la fiche Google et la carte d’avis pour rendre l’artisan visible et crédible. Quand les demandes arrivent, on installe le site avec formulaire de devis qui trie les demandes. Ensuite, deux suites naturelles : le logiciel de devis et de suivi de chantier pour celui qui passe ses soirées sur la paperasse, et l’agent IA qui répond le soir aux demandes, pose les bonnes questions et propose un créneau de visite. Pour les piscinistes et les installateurs de clim, la gestion des réseaux sociaux avec des avant/après marche bien au printemps.",
  },

  timing: {
    best: [
      {
        label: "Retour de chantier",
        days: [1, 2, 3, 4],
        from: "17:30",
        to: "19:00",
        why: "Il est rentré, il fait ses devis ou décharge le camion : c’est le seul moment où il a la tête disponible, et le meilleur créneau au téléphone.",
      },
      {
        label: "Avant le chantier",
        days: [1, 2, 3, 4, 5],
        from: "07:30",
        to: "08:15",
        why: "Au dépôt ou devant le camion pendant qu’il charge : il a cinq minutes, pas plus, idéal pour se présenter et obtenir un numéro ou un rendez-vous du soir.",
      },
      {
        label: "Bureau tenu par le conjoint",
        days: [2, 3, 4],
        from: "09:30",
        to: "11:30",
        why: "Quand l’entreprise a un bureau ou un secrétariat, c’est l’heure de l’administratif : on se présente à la personne qui gère les devis et on obtient un rendez-vous avec le patron.",
      },
    ],
    avoid: [
      {
        label: "En journée sur chantier",
        days: [1, 2, 3, 4, 5],
        from: "08:30",
        to: "17:00",
        why: "Il ne peut pas décrocher, et s’il décroche il est les mains prises et agacé : vous brûlez le contact pour rien.",
      },
      {
        label: "Lundi matin",
        days: [1],
        from: "07:00",
        to: "10:00",
        why: "Planning de la semaine, commandes de matériel et urgences du week-end : aucune écoute.",
      },
      {
        label: "Vendredi fin de journée",
        days: [5],
        from: "15:00",
        to: "19:30",
        why: "Chantiers à boucler avant le week-end, équipe à payer, tête ailleurs.",
      },
    ],
    usuallyClosed: [0, 6],
    phoneNote:
      "Appelez le portable affiché sur le camion, la fiche Google ou le devis, plutôt en fin de journée entre 17 h 30 et 19 h. S’il décroche avec du bruit de chantier derrière, ne lancez pas votre présentation : demandez à quelle heure le rappeler et tenez cette heure à la minute. Laissez un message court avec votre prénom et le motif : les artisans rappellent les numéros inconnus, ça peut être un client.",
    seasonNote:
      "Prospectez de novembre à février, quand les chantiers ralentissent et que l’artisan prépare son année. Oubliez les climaticiens et piscinistes d’avril à fin août : ils sont débordés. Les plombiers sont joignables toute l’année sauf pendant les vagues de froid. En septembre-octobre, parlez aux artisans qui travaillent pour les résidences secondaires : c’est le moment où les propriétaires lancent leurs travaux d’hiver.",
  },

  scripts: {
    physique: {
      id: "artisan-btp-physique",
      title: "Visite : croiser l’artisan au dépôt, au camion ou au bureau",
      channel: "physique",
      duration: "3 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Trouver le patron ou la personne qui gère les devis, sans jamais le déranger chez un client.",
          lines: [
            "Bonjour, excusez-moi, j’ai vu le camion : c’est vous {commerce} ?",
            "Je suis {prenom}, de MJAGENCY, une agence de Sète. Je vous prends deux minutes, pas plus, je vois bien que vous chargez.",
            "Au bureau : Bonjour, je cherche {dirigeant}. C’est vous qui gérez les devis et l’administratif pour {commerce} ?",
          ],
          tip: "Jamais sur un chantier chez un particulier : c’est son client, pas le vôtre. On l’aborde au dépôt, devant le camion garé chez lui le soir, ou au bureau s’il en a un. Restez à distance du camion, ne touchez à rien.",
          branches: [
            {
              if: "C’est le conjoint ou la secrétaire qui vous reçoit",
              then: "Parfait, c’est souvent vous qui voyez passer les demandes de devis et les appels manqués : c’est justement de ça que je voulais parler. Vous avez deux minutes ?",
            },
            {
              if: "« Il est sur un chantier »",
              then: "Pas de souci, je ne veux surtout pas le déranger. Il rentre vers quelle heure en général ? Je repasse ou je l’appelle vers 18 h, qu’est-ce qui l’arrange le mieux ?",
            },
            {
              if: "Il est visiblement pressé, moteur allumé",
              then: "Je vois que vous partez, je ne vous retiens pas. Donnez-moi juste le meilleur moment pour vous appeler ce soir, cinq minutes suffisent.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire en une phrase pourquoi on est là, avec un bénéfice qui parle à un artisan.",
          lines: [
            "Je travaille avec des artisans du bassin de Thau sur une seule chose : que les bons clients vous trouvent, et que les demandes de devis arrivent déjà triées.",
            "Je ne viens rien vendre aujourd’hui. Je vous ai cherché sur Google hier soir et j’ai vu un truc que je voulais vous montrer.",
          ],
          tip: "Parlez son langage : chantiers, devis, déplacements, pas « visibilité » ni « digital ». Montrez l’écran de votre téléphone, pas une plaquette.",
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer un fait précis et vérifiable sur sa présence en ligne, sans le juger.",
          lines: [
            "Quand je tape votre métier et {ville} sur mon téléphone, vous apparaissez, mais votre fiche n’a presque pas de photos et les derniers avis datent un peu.",
            "Juste au-dessus, il y a un concurrent avec beaucoup plus d’avis et des photos de chantiers. Votre travail est sûrement aussi bon, mais le client, lui, ne peut pas le savoir.",
            "Et il n’y a aucun moyen de vous demander un devis à 22 h, quand les gens cherchent tranquillement depuis leur canapé.",
          ],
          tip: "Préparez ce constat avant la visite avec l’écran de recherche. Un fait précis vaut mieux que dix généralités. Terminez toujours par un point positif sur son travail.",
          branches: [
            {
              if: "Il a déjà un site",
              then: "Votre site existe, c’est déjà bien. Par contre sur téléphone, le numéro n’est pas cliquable tout de suite et je n’ai pas trouvé de photos récentes de vos réalisations.",
            },
            {
              if: "Sa fiche Google est excellente",
              then: "Franchement, votre fiche est très bien tenue, c’est rare. Là où vous perdez du temps, à mon avis, c’est sur le traitement des demandes : qui rappelle, quand, et combien de devis partent pour rien.",
            },
            {
              if: "Il ne sait même pas qu’il a une fiche Google",
              then: "C’est très courant : Google crée la fiche tout seul à partir de votre SIRET. Le problème, c’est que n’importe qui peut proposer une modification dessus, et personne ne répond aux avis.",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de son quotidien : d’où viennent ses chantiers et ce que lui coûtent ses soirées de devis.",
          lines: [
            "Aujourd’hui, vos nouveaux chantiers, ils arrivent surtout comment ? Bouche-à-oreille, Google, une plateforme ?",
            "Et les devis, c’est vous qui les faites le soir ? Ça vous prend combien de soirées par semaine, à peu près ?",
            "Si vous pouviez choisir, vous prendriez plus de quel type de chantier ?",
          ],
          tip: "Posez une question, puis taisez-vous. Un artisan qui parle de ses soirées de devis ou d’un client qui l’a baladé est en train de vous dire ce qu’il faut lui proposer. Notez ses mots exacts.",
          branches: [
            {
              if: "« J’ai déjà trop de travail »",
              then: "Justement, alors l’enjeu ce n’est pas d’en avoir plus, c’est d’avoir les bons chantiers et d’arrêter les déplacements pour rien. C’est exactement ce que fait un formulaire de devis bien pensé.",
            },
            {
              if: "Il se plaint des plateformes payantes",
              then: "Beaucoup d’artisans nous disent la même chose : payer pour une demande envoyée à quatre autres, c’est rageant. L’idée, c’est que les clients viennent directement chez vous.",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous du soir, un numéro ou un accord pour l’audit gratuit.",
          lines: [
            "Je vous propose un truc simple : un audit gratuit de votre présence sur internet. Vingt minutes, je vous montre ce que voient vos clients et trois choses à corriger, dont une que vous pouvez faire seul.",
            "Je passe un soir vers 18 h ? Mardi ou jeudi, qu’est-ce qui vous arrange ?",
            "Sinon, donnez-moi le meilleur numéro, je vous envoie le résultat par texto et on en parle au téléphone quand vous êtes rentré.",
          ],
          tip: "Proposez toujours deux créneaux précis, en fin de journée. Notez le prénom du conjoint s’il gère l’administratif : il faudra l’inviter au rendez-vous.",
          branches: [
            {
              if: "« Je n’ai pas le temps pour un rendez-vous »",
              then: "Aucun problème, je le fais sans vous et je vous envoie le résumé par texto. Vous le lirez quand vous voudrez, et si ça vous parle, on s’appelle cinq minutes.",
            },
            {
              if: "« Il faut que j’en parle à ma femme / mon mari »",
              then: "Bien sûr, c’est souvent elle ou lui qui gère les devis, c’est normal. Je peux passer quand vous êtes tous les deux, mardi 18 h 30 ou jeudi 18 h ?",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "artisan-btp-telephone",
      title: "Appel en fin de journée : décrocher un rendez-vous du soir",
      channel: "telephone",
      duration: "2 à 4 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier qu’il peut parler, sans le piéger.",
          lines: [
            "Bonjour, {dirigeant} ? C’est {prenom}, de MJAGENCY, une agence web de Sète.",
            "Je vous appelle en fin de journée exprès, pour ne pas vous déranger sur le chantier. Vous avez deux minutes, ou je vous rappelle plus tard ?",
          ],
          tip: "Souriez en parlant, ça s’entend. S’il y a du bruit de chantier ou de route, proposez tout de suite de rappeler.",
          branches: [
            {
              if: "« Je suis au volant »",
              then: "Alors je ne vous retiens pas, ce n’est pas prudent. Je vous rappelle à quelle heure, 18 h 30 ou demain 18 h ?",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage (conjoint, secrétariat, messagerie)",
          goal: "Faire de la personne qui décroche une alliée, pas un obstacle.",
          lines: [
            "Bonjour, je suis {prenom}, de MJAGENCY à Sète. Je cherchais à joindre {dirigeant}. C’est vous qui gérez les devis et le bureau ?",
            "Je vous explique en deux mots : j’aide des artisans du coin à recevoir des demandes de devis plus claires et à moins courir après les appels manqués.",
            "À quel moment je peux le joindre facilement ? Ou c’est plutôt vous que je dois voir ?",
          ],
          tip: "Le conjoint qui tient l’administratif est souvent le vrai décideur sur ce type d’achat. Traitez-le comme tel : prénom, respect, et proposez-lui d’être au rendez-vous.",
          branches: [
            {
              if: "« Envoyez un mail »",
              then: "Volontiers. Pour ne pas vous envoyer un mail de plus qui se perd, je préfère vous montrer quelque chose de concret sur {commerce}. Je vous laisse mon numéro et je rappelle jeudi vers 18 h, ça vous va ?",
            },
            {
              if: "Messagerie",
              then: "Bonjour {dirigeant}, c’est {prenom}, de MJAGENCY à Sète, au sujet de vos demandes de devis sur Google. Rien d’urgent, je vous rappelle demain vers 18 h. Bonne soirée.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer la conversation.",
          lines: [
            "Je vous ai cherché sur Google en tapant votre métier et {ville}. Vous êtes là, mais vous passez après des concurrents qui ont plus d’avis et des photos de chantiers.",
            "Et quand quelqu’un cherche à vous demander un devis le soir, il n’a pas vraiment de moyen de le faire à part appeler.",
          ],
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser deux questions maximum pour trouver la douleur principale.",
          lines: [
            "Aujourd’hui, vos nouveaux clients, ils viennent surtout par le bouche-à-oreille ou par Google ?",
            "Et les appels que vous ne pouvez pas prendre en journée, vous arrivez à tous les rappeler ?",
          ],
          tip: "Deux questions, pas plus au téléphone. Reprenez sa réponse avec ses mots avant de proposer le rendez-vous.",
          branches: [
            {
              if: "Il demande le prix",
              then: "Honnêtement, ça dépend vraiment de ce dont vous avez besoin, et je ne veux pas vous vendre un truc inutile. C’est pour ça que je préfère vous montrer l’audit en vingt minutes : vous aurez un prix clair, par écrit, ce jour-là.",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous avec deux créneaux",
          goal: "Obtenir un rendez-vous de vingt minutes, en fin de journée, avec deux options précises.",
          lines: [
            "Ce que je vous propose : je passe vous montrer l’audit gratuit, vingt minutes, avec ce que voient vos clients et trois choses à corriger.",
            "Je peux venir mardi à 18 h ou jeudi à 18 h 30, chez vous ou au dépôt. Qu’est-ce qui vous arrange ?",
          ],
          tip: "Ne parlez jamais de prix au téléphone. Vous vendez vingt minutes de son temps, pas un site.",
          branches: [
            {
              if: "« Ni l’un ni l’autre »",
              then: "Pas de souci, dites-moi votre soir le plus calme de la semaine prochaine et je m’adapte.",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et prévoir la présence du conjoint si besoin.",
          lines: [
            "Parfait, c’est noté : jeudi 18 h 30. Je vous envoie un texto de confirmation avec mon nom.",
            "Si c’est votre conjoint qui gère les devis, ce serait bien qu’il ou elle soit là aussi, c’est souvent la personne la plus concernée.",
            "Merci {dirigeant}, bonne soirée, et à jeudi.",
          ],
          tip: "Envoyez le texto dans les cinq minutes. La veille, un second texto court : « À demain 18 h 30, {prenom} de MJAGENCY ».",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos nouveaux chantiers arrivent surtout comment : bouche-à-oreille, Google, architectes, plateformes ?",
      why: "Savoir d’où vient son travail et à quel point il dépend d’une seule source.",
    },
    {
      type: "S",
      question: "Qui s’occupe des devis et des factures chez vous, et à quel moment de la journée ?",
      why: "Identifier le vrai décideur (souvent le conjoint) et le temps passé le soir.",
    },
    {
      type: "P",
      question: "Sur une semaine normale, combien d’appels vous ne pouvez pas prendre parce que vous êtes sur un chantier ?",
      why: "Lui faire mesurer lui-même les appels manqués, sans avancer de chiffre à sa place.",
    },
    {
      type: "P",
      question: "Combien de devis vous faites qui ne sont jamais signés, et qu’est-ce qui manque en général pour qu’ils le soient ?",
      why: "Faire émerger les déplacements inutiles et les demandes mal qualifiées.",
    },
    {
      type: "I",
      question: "Quand un particulier n’arrive pas à vous joindre, à votre avis, il fait quoi ?",
      why: "Lui faire dire lui-même qu’il appelle le concurrent suivant.",
    },
    {
      type: "I",
      question: "Toutes ces soirées de devis, sur une année, ça représente quoi pour vous et pour votre famille ?",
      why: "Relier la paperasse à un coût personnel concret, pas seulement à de l’argent.",
    },
    {
      type: "N",
      question: "Si les demandes arrivaient déjà avec les photos, l’adresse et le type de travaux, et que vous faisiez le devis chez le client sur votre téléphone, qu’est-ce que ça changerait pour vous ?",
      why: "Lui faire formuler le bénéfice avec ses mots : c’est lui qui se vend la solution.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un pour mon site, c’est l’annuaire qui s’en occupe.",
      hidden: "Il paie souvent un abonnement depuis des années sans savoir ce qu’il y a derrière, et n’a pas envie de se replonger dans un sujet qu’il croit réglé.",
      accueillir: "Très bien, c’est plutôt une bonne nouvelle, ça veut dire que vous avez déjà pensé à votre présence sur internet.",
      questionner: "Vous savez combien de demandes de devis ce site vous a apportées cette année ? Et est-ce que vous pouvez changer les photos vous-même ?",
      recadrer: "Beaucoup d’artisans qu’on rencontre paient un abonnement pour un site qu’ils ne voient jamais et qui ne leur ramène rien de mesurable. Je ne dis pas que c’est votre cas, mais ça vaut le coup de vérifier.",
      proposer: "Je vous fais l’audit gratuit en comparant votre site actuel à deux concurrents du coin. Si le vôtre fait le travail, je vous le dirai franchement et on en reste là.",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je suis sur les chantiers du matin au soir.",
      hidden: "Il a peur qu’on lui rajoute une corvée de plus, alors qu’il est déjà débordé par l’administratif.",
      accueillir: "Je vous crois, et c’est justement pour ça que je passe à cette heure-ci et pas en pleine journée.",
      questionner: "Le temps qui vous manque le plus, c’est sur les chantiers ou le soir, sur les devis et les rappels ?",
      recadrer: "Ce que je propose, c’est l’inverse d’une corvée en plus : c’est pour vous enlever des soirées de paperasse et des déplacements pour rien. De votre côté, il faut juste vingt minutes pour commencer.",
      proposer: "Je fais l’audit sans vous et je vous envoie le résumé par texto. Si ça vous parle, on se voit vingt minutes un soir, mardi ou jeudi, à 18 h 30.",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, un site, je n’ai pas le budget pour ça.",
      hidden: "Il compare à un devis de matériel, il ne voit pas le retour, ou il a déjà payé cher un site inutile.",
      accueillir: "Je comprends, l’argent qui ne sert pas à un chantier, on le regarde à deux fois, et c’est normal.",
      questionner: "Un chantier moyen chez vous, ça représente combien à peu près ? Et combien vous en faudrait-il en plus sur l’année pour que ça vaille le coup ?",
      recadrer: "En général, un seul chantier signé grâce à Google ou au formulaire couvre l’investissement. Et on peut étaler le paiement sur plusieurs mois, comme vous le faites parfois avec vos clients.",
      proposer: "Commençons petit : la fiche Google optimisée et la carte d’avis, pour un montant très raisonnable. Vous voyez ce que ça donne, et on parle du site seulement si ça marche.",
    },
    {
      id: "neveu",
      objection: "Mon neveu est doué en informatique, il va me le faire.",
      hidden: "Il veut éviter de dépenser, et c’est parfois une façon polie de dire non ; souvent le projet du neveu traîne depuis des mois.",
      accueillir: "C’est bien d’avoir quelqu’un de confiance dans la famille, ça rassure.",
      questionner: "Il a commencé ? Et il pourra s’en occuper dans la durée, répondre aux avis, mettre à jour les photos de chantiers ?",
      recadrer: "Faire un site, beaucoup de gens savent le faire. Ce qui fait venir les demandes, c’est ce qu’il y a autour : la fiche Google, les avis, le formulaire qui trie. C’est notre métier au quotidien.",
      proposer: "Je vous fais l’audit gratuit, et vous pouvez le donner à votre neveu : il aura la liste de ce qu’il faut faire. Si finalement il n’a pas le temps, vous savez où me trouver.",
    },
    {
      id: "facebook",
      objection: "J’ai ma page Facebook, ça me suffit.",
      hidden: "Il ne voit pas la différence entre être visible pour ses amis et être trouvé par un inconnu qui cherche un artisan.",
      accueillir: "Très bien, et si elle vous amène déjà des clients, il faut la garder.",
      questionner: "Quand quelqu’un qui ne vous connaît pas cherche un artisan à {ville} sur son téléphone, vous pensez qu’il va sur Facebook ou sur Google ?",
      recadrer: "En général, Facebook sert à ceux qui vous connaissent déjà. Le client qui a une fuite ou qui veut refaire sa salle de bains, lui, tape sa recherche sur Google, et il appelle un des premiers résultats.",
      proposer: "On peut réutiliser les photos de votre page pour votre fiche Google, c’est rapide. Je vous montre la différence pendant l’audit gratuit : mardi 18 h ou jeudi 18 h 30 ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Moi je marche au bouche-à-oreille, et ça marche très bien.",
      hidden: "Il est fier de sa réputation, à juste titre, et n’aime pas l’idée de faire de la publicité.",
      accueillir: "C’est la meilleure publicité qui existe, et ça veut dire que vous faites du bon travail.",
      questionner: "Quand quelqu’un vous recommande à un ami, vous savez ce que fait l’ami avant de vous appeler ?",
      recadrer: "Aujourd’hui, la plupart des gens vérifient sur Google même quand on leur a donné le nom. Si la fiche est vide ou a peu d’avis, le bouche-à-oreille se perd en route. Le but, c’est de le rendre visible, pas de le remplacer.",
      proposer: "La carte d’avis sert exactement à ça : transformer vos clients contents en avis que tout le monde peut lire. On la met en place en une semaine.",
    },
    {
      id: "rappelez-mail",
      objection: "Envoyez-moi un mail, je regarderai quand j’aurai le temps.",
      hidden: "C’est souvent une façon polie de mettre fin à la conversation ; le mail ne sera jamais ouvert.",
      accueillir: "Bien sûr, je comprends, vous n’allez pas décider là, maintenant, et c’est normal.",
      questionner: "Pour que le mail vous serve vraiment, qu’est-ce qui vous intéresserait le plus : les avis Google, les demandes de devis, ou la paperasse ?",
      recadrer: "Un mail général, vous allez le survoler et c’est normal. Ce qui est utile, c’est de voir votre propre situation sur votre propre fiche.",
      proposer: "Je vous envoie un texto avec trois captures de votre fiche et de celle d’un concurrent, et je vous rappelle jeudi vers 18 h pour en parler cinq minutes. Ça vous va ?",
    },
    {
      id: "trop-de-travail",
      objection: "J’ai déjà trop de travail, je refuse des chantiers, je n’ai pas besoin de clients en plus.",
      hidden: "Il est débordé et fatigué ; il pense qu’on veut lui amener du volume alors qu’il cherche surtout à souffler et à mieux choisir.",
      accueillir: "C’est une très bonne position, beaucoup aimeraient être à votre place. Et je ne viens pas vous amener plus de travail.",
      questionner: "Parmi les chantiers que vous faites, il y en a que vous préféreriez ne plus faire ? Et combien de temps vous perdez sur les demandes qui ne donnent rien ?",
      recadrer: "Quand on a trop de demandes, le vrai sujet, c’est de choisir : mieux trier, monter un peu ses prix, arrêter les déplacements pour rien et finir les devis plus vite. C’est là qu’un bon formulaire et un outil de devis changent la vie.",
      proposer: "Je vous propose de regarder ensemble comment filtrer vos demandes et gagner vos soirées. Vingt minutes, mardi 18 h ou jeudi 18 h 30, et vous jugerez vous-même.",
    },
  ],

  proofs: [
    "En général, quand un particulier a une urgence, il appelle un des trois ou quatre premiers artisans qu’il voit sur Google, pas le dixième.",
    "C’est ce qu’on voit souvent : l’artisan qui rappelle le premier obtient la visite, même s’il n’est pas le moins cher.",
    "La plupart des clients lisent les avis avant d’appeler, et les avis récents comptent plus que les anciens.",
    "Un formulaire qui demande le type de travaux, la commune et des photos évite en général une bonne partie des déplacements inutiles.",
    "Pour un chantier de plusieurs milliers d’euros, les clients cherchent à se rassurer : photos de réalisations, assurance visible, avis détaillés.",
    "Un devis clair, envoyé vite et signable en ligne, est en général mieux compris par le client et plus souvent signé qu’un devis manuscrit reçu une semaine après.",
    "Les propriétaires de résidences secondaires qui habitent loin choisissent presque toujours leur artisan sur internet, parce qu’ils ne peuvent pas demander autour d’eux.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour regarder sa propre fiche Google pendant que vous parlez.",
    "Il vous parle spontanément d’un client qui l’a baladé avec un devis jamais signé.",
    "Il appelle son conjoint ou lui dit « viens voir » pour qu’il écoute.",
    "Il demande si le formulaire peut demander des photos du problème ou le budget du client.",
    "Il se plaint de ce qu’il paie à une plateforme ou à un annuaire.",
    "Il demande combien de temps ça prend à mettre en place, ou si ce serait prêt avant le printemps.",
    "Il vous montre ses photos de chantiers dans son téléphone.",
    "Il vous demande si vous travaillez déjà avec d’autres artisans du coin.",
  ],

  research: {
    platforms: [
      "Google (fiche d’établissement et avis)",
      "PagesJaunes",
      "Habitatpresto",
      "Houzz",
      "Annuaire des professionnels RGE (France Rénov’)",
      "Qualibat, Qualit’EnR, Qualifelec",
      "Facebook",
      "Instagram",
      "Societe.com ou Pappers (SIRET, date de création, effectif)",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, avec des photos de réalisations récentes, des zones d’intervention et des horaires à jour ?",
      "Combien d’avis Google a-t-il, de quand date le dernier, et répond-il aux avis ?",
      "A-t-il un site ? Est-il lisible sur téléphone, avec un numéro cliquable dès l’ouverture ?",
      "Peut-on demander un devis en ligne, et le formulaire demande-t-il le type de travaux, la commune et des photos ?",
      "Y a-t-il des photos de réalisations ou d’avant/après, sur le site, Google ou Instagram ?",
      "L’assurance décennale, le SIRET et les éventuels labels (RGE, Qualibat) sont-ils affichés ?",
      "Est-il présent sur des plateformes de mise en relation payantes (Habitatpresto, PagesJaunes) ?",
      "Qui sont les trois concurrents les mieux placés sur Google pour son métier et sa ville, et combien d’avis ont-ils ?",
      "L’entreprise a-t-elle des salariés, et depuis quand existe-t-elle ?",
      "Voit-on des signes de débordement : avis mentionnant des délais, messagerie pleine, horaires absents ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY à Sète. Je travaille avec des artisans du bassin de Thau sur un problème que vous connaissez sûrement : les appels manqués en journée et les soirées passées sur les devis. On met en place une fiche Google qui vous fait trouver, un site avec un formulaire qui trie les demandes avant que vous vous déplaciez, et si besoin un outil pour faire vos devis chez le client. Je vous propose un audit gratuit de vingt minutes, un soir, pour voir ce que voient vos clients.",

  compliance:
    "Assurance décennale : pour les travaux qui y sont soumis, l’artisan doit indiquer sur ses devis et factures son assureur, les coordonnées du contrat et la couverture géographique ; on l’affiche aussi sur le site, c’est attendu par les clients et c’est un gage de sérieux. Mentions légales du site obligatoires : nom ou raison sociale, SIRET, numéro au répertoire des métiers, adresse, numéro de TVA, hébergeur, et coordonnées du médiateur de la consommation. Labels : n’afficher un logo RGE, Qualibat ou autre que s’il est en cours de validité, avec le bon domaine de qualification. Devis : obligatoire au-delà d’un certain montant pour les dépannages et réparations, et les contrats signés au domicile du client ouvrent un droit de rétractation de 14 jours à mentionner. Avis : jamais de faux avis ni d’avis achetés, c’est une pratique commerciale trompeuse. De notre côté, une micro-entreprise démarchée hors de ses locaux peut aussi bénéficier d’un délai de rétractation quand l’achat sort de son activité principale : le dire, c’est gagner sa confiance.",
};

export default sheet;
