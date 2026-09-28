import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "commerce",
  name: "Commerce de détail / boutique",
  short: "Boutique",
  examples: [
    "boutique de prêt-à-porter femme, homme ou enfant",
    "boutique de décoration et d’objets pour la maison",
    "boutique de cadeaux, souvenirs et créateurs locaux",
    "fleuriste",
    "librairie indépendante",
    "opticien indépendant",
    "concept-store (mode, déco, épicerie, créateurs)",
    "dépôt-vente de vêtements et d’objets",
  ],
  tagline:
    "Des boutiques qui vivent de leur vitrine et de leurs habitués, face à des clients qui regardent tout sur leur téléphone avant de pousser la porte, ou à la place de la pousser.",

  reality: {
    rhythm:
      "Ouverture vers 9 h 30 - 10 h, après la mise en place : vitrine, caisse, réception des colis, étiquetage des nouveautés. La matinée en semaine est calme : quelques habituées, des retraités, des curistes à Balaruc, et c’est le moment où la gérante fait son réassort et ses commandes. Beaucoup de boutiques ferment entre 12 h 30 et 14 h, parfois jusqu’à 14 h 30 : la gérante déjeune, fait ses courses, va à la banque. L’après-midi reprend doucement, reste calme jusqu’à 16 h, puis la fréquentation monte de 17 h à 19 h avec la sortie des bureaux et des écoles. Le samedi est en général le plus gros jour de la semaine. Le dimanche est fermé, sauf l’été dans les rues touristiques et les dimanches autorisés de décembre ; le lundi est souvent fermé le matin, parfois toute la journée. Très souvent, la gérante est seule ou avec une vendeuse : impossible de quitter la boutique. Les achats se font des mois à l’avance, sur les salons professionnels ou avec les représentants, et le soir elle fait les photos pour Instagram, répond aux messages et tient les comptes. Chaque métier a ses propres pics : le fleuriste avec la Saint-Valentin, la fête des mères, la Toussaint et les mariages ; la librairie avec la rentrée littéraire et Noël ; l’opticien avec la rentrée scolaire et les solaires au printemps.",
    pains: [
      "Moins de passage en semaine dans les centres-villes, pendant que la zone commerciale et Montpellier attirent les clients avec parking et grandes enseignes.",
      "Le stock : une collection achetée six mois à l’avance, de la trésorerie immobilisée, et des invendus à brader en fin de saison.",
      "Les clients qui essaient ou regardent en boutique, prennent une photo de l’étiquette, puis cherchent moins cher sur internet.",
      "Seule en boutique toute la journée : pas le temps de faire des photos, de publier, ni de répondre aux messages « vous l’avez en 38 ? ».",
      "Instagram qui prend des heures le soir, pour des résultats irréguliers qu’on ne comprend pas toujours.",
      "Le loyer et les charges du centre-ville, avec des mois creux en hiver où l’on se demande comment payer les factures.",
      "Des horaires Google qui ne mentionnent ni la pause de midi ni le lundi matin : des clients trouvent porte close et ne reviennent pas.",
    ],
    clientLoss: [
      "Quelqu’un tape « boutique cadeau {ville} » ou « fleuriste ouvert » sur son téléphone et va chez celle qui a des photos, des horaires justes et des avis récents.",
      "La cliente qui a vu un article sur Instagram envoie un message pour savoir s’il reste sa taille, n’a pas de réponse avant le soir, et a déjà commandé ailleurs.",
      "Le touriste qui a adoré la boutique en juillet rentre chez lui : il n’a aucun moyen de recommander, alors il achète autre chose en ligne.",
      "Les habituées ne savent pas que les nouveautés sont arrivées : il n’y a aucun lien entre deux visites, et elles finissent par aller flâner ailleurs.",
      "Le client qui veut vérifier qu’un article est disponible avant de se déplacer ne peut pas le faire, et ne se déplace pas.",
      "Des avis négatifs sur l’accueil ou les horaires restés sans réponse, qui découragent les nouveaux clients.",
    ],
    seasonality:
      "Sur le littoral, l’été porte une bonne partie de l’année pour les boutiques de cadeaux, de déco et de mode : à Sète sur les quais et dans le centre, à Marseillan ou à Frontignan, les flâneurs et les touristes entrent pour le plaisir et repartent avec un souvenir. Certaines boutiques de station n’ouvrent que d’avril à octobre. À Balaruc-les-Bains, les curistes (mars à décembre) font une clientèle de semaine, qui flâne et offre des cadeaux. Deux périodes à ne jamais toucher : les soldes (d’hiver de mi-janvier à mi-février, d’été de fin juin à fin juillet), où la gérante vend à marge réduite et n’a pas une minute, et décembre, le mois le plus important de l’année, souvent ouvert le dimanche. Septembre est calme après la rentrée, et c’est le bon moment pour préparer Noël : une boutique en ligne se construit en quatre à six semaines, il faut donc la lancer en octobre. Meilleures périodes pour prospecter : mi-septembre à début novembre (on prépare les fêtes) et mi-février à mai (on prépare l’été et la saison touristique).",
    digitalHabits:
      "Instagram est le canal principal pour la mode, la déco et les concept-stores : la gérante publie elle-même le soir, les ventes se font souvent par message privé et au téléphone. Facebook reste utile pour la clientèle plus âgée et les événements. La fiche Google existe presque toujours, avec surtout des photos de clients et des horaires qui oublient la pause de midi. Le site internet est rare, ou c’est une boutique en ligne commencée un jour et abandonnée faute de temps. Certaines écoulent leurs fins de série sur Vinted ou Leboncoin, les dépôts-ventes y sont très actifs. TikTok arrive chez les concept-stores tenus par des plus jeunes. La fidélité, c’est une carte en carton à tamponner, ou un fichier clients dans le logiciel de caisse qui ne sert jamais à rien. Beaucoup ont une liste d’habituées sur WhatsApp, tenue à la main.",
  },

  offers: {
    priority: [
      {
        offer: "site-ecommerce",
        pitch:
          "Vos clientes de l’été rentrent chez elles à Lyon ou à Toulouse, et elles vous oublient. Avec une petite boutique en ligne, elles recommandent ce qu’elles ont vu chez vous, et les gens d’ici réservent sur le site et passent chercher en boutique, c’est le click & collect. Et pas de commission sur chaque vente comme sur une plateforme.",
      },
      {
        offer: "fidelite",
        pitch:
          "La carte en carton, elle dort dans un tiroir. Là, elle est dans le téléphone de vos clientes, et le jour où la nouvelle collection arrive, vous leur envoyez un petit message. Elles passent voir, c’est tout ce qu’on veut.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Vous avez de très belles choses, mais le soir après la fermeture, qui a encore l’énergie de faire des photos ? On vient une fois par mois photographier et filmer les nouveautés, et on publie pour vous toute la semaine.",
      },
    ],
    entry: [
      {
        offer: "fiche-google",
        pitch:
          "Quand quelqu’un cherche une boutique comme la vôtre à {ville}, c’est d’abord votre fiche Google qu’il voit. On y met vos vrais horaires, pause de midi et lundi compris, des photos de votre vitrine et de vos nouveautés, et on répond aux avis pour vous.",
      },
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée près de la caisse : la cliente contente approche son téléphone et laisse un avis en dix secondes. Vos clientes vous adorent, il faut juste que ça se voie sur internet.",
      },
    ],
    upsell:
      "Après la fiche Google et la carte d’avis, la suite logique est la carte de fidélité digitale, pour prévenir les habituées des nouveautés et remplir les jours creux. Ensuite, la gestion des réseaux sociaux, à démarrer avant la saison ou avant les fêtes. Le gros projet, c’est la boutique en ligne avec click & collect, à signer en septembre ou octobre pour être prête avant Noël, ou en mars pour les touristes de l’été. Pour les boutiques qui reçoivent beaucoup de messages sur Instagram, un agent IA peut répondre aux questions simples : horaires, disponibilité d’une taille, retrait en boutique.",
  },

  timing: {
    best: [
      {
        label: "Milieu de matinée",
        days: [2, 3, 4, 5],
        from: "10:00",
        to: "11:00",
        why: "La mise en place est finie, la boutique est calme et la gérante est souvent seule, disponible pour parler.",
      },
      {
        label: "Début d’après-midi",
        days: [2, 3, 4],
        from: "14:30",
        to: "16:00",
        why: "La boutique vient de rouvrir, la sortie des bureaux n’a pas commencé : c’est le deuxième creux de la journée.",
      },
      {
        label: "Téléphone en semaine",
        days: [2, 3, 4],
        from: "10:00",
        to: "11:00",
        why: "En milieu de semaine le matin, la gérante décroche sans avoir de clientes devant elle.",
      },
    ],
    avoid: [
      {
        label: "Samedi",
        days: [6],
        from: "09:30",
        to: "19:30",
        why: "Le plus gros jour de la semaine : passer un samedi, c’est montrer qu’on ne connaît pas le commerce.",
      },
      {
        label: "Lundi matin",
        days: [1],
        from: "09:00",
        to: "14:00",
        why: "Souvent fermé, ou ouverture tardive pour la réception des commandes et la compta.",
      },
      {
        label: "Ouverture",
        from: "09:30",
        to: "10:00",
        why: "Vitrine, caisse, colis à déballer : la gérante est en pleine mise en place.",
      },
      {
        label: "Pause de midi",
        from: "12:30",
        to: "14:00",
        why: "Beaucoup de boutiques ferment, et celles qui restent ouvertes ont leur seul moment pour manger.",
      },
      {
        label: "Fin de journée",
        from: "17:00",
        to: "19:30",
        why: "Sortie des bureaux et des écoles : c’est là que les clientes arrivent, la gérante doit être à elles.",
      },
    ],
    usuallyClosed: [0, 1],
    phoneNote:
      "Appelez le fixe de la boutique ou le numéro de la fiche Google entre 10 h et 11 h, du mardi au jeudi. Si une vendeuse décroche, demandez le prénom de la gérante et ses jours de présence. Le lundi, beaucoup de boutiques ouvrent seulement l’après-midi, et certaines ferment toute la journée : vérifiez sur la fiche avant de vous déplacer. Pour une boutique franchisée ou une enseigne, demandez tout de suite si les décisions se prennent sur place ou au siège.",
    seasonNote:
      "Prospectez de mi-septembre à début novembre et de mi-février à mai. Oubliez les soldes d’hiver (mi-janvier à mi-février), les soldes d’été (fin juin à fin juillet), tout le mois de décembre et, sur le littoral, le cœur de l’été. Pour un fleuriste, évitez aussi la semaine de la Saint-Valentin, de la fête des mères et de la Toussaint ; pour une librairie, la rentrée littéraire début septembre.",
  },

  scripts: {
    physique: {
      id: "commerce-physique",
      title: "Visite en boutique",
      channel: "physique",
      duration: "4 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer comme un client, regarder la boutique et savoir à qui parler.",
          lines: [
            "Bonjour ! Je regarde un peu, c’est vraiment joli chez vous.",
            "Ça, c’est une marque que vous avez depuis longtemps ? Je ne la connaissais pas.",
            "Dites-moi, c’est vous la gérante de la boutique ?",
            "Pas de souci. Elle est là plutôt quels jours ? Je repasse, j’en ai pour deux minutes.",
          ],
          tip: "Prenez une minute pour vraiment regarder la boutique : une marque, une vitrine, un objet qui vous plaît. Attendez qu’il n’y ait plus de clientes en caisse ou en cabine avant de dire un mot commercial.",
          branches: [
            {
              if: "C’est une vendeuse",
              then: "Demandez le prénom de la gérante et ses jours de présence, laissez votre carte avec un mot à la main : « Passé pour votre fiche Google, je repasse mardi vers 10 h 30. {prenom} ».",
            },
            {
              if: "C’est une franchise ou une enseigne",
              then: "« Chez vous, tout ce qui est site et réseaux, c’est géré par le siège, ou vous avez la main en local ? » Si tout est au siège, remerciez et partez : ce n’est pas votre client.",
            },
            {
              if: "C’est la gérante",
              then: "Passez à l’accroche, avec un vrai compliment sur ce que vous venez de voir.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les boutiques du coin à être trouvées sur internet et à garder le lien avec leurs clientes.",
            "Je ne viens rien vous vendre aujourd’hui. En venant, j’ai regardé votre fiche Google, et il y a un détail que je voulais vous montrer. Trente secondes ?",
          ],
          tip: "Ayez la fiche Google et le compte Instagram de {commerce} déjà ouverts sur votre téléphone. Tournez l’écran vers elle.",
          branches: [
            {
              if: "« Je n’ai pas le temps »",
              then: "« Je comprends, vous êtes seule en boutique. Je repasse mardi vers 10 h 30 ou jeudi à 14 h 30, qu’est-ce qui vous arrange ? »",
            },
            {
              if: "Une cliente entre",
              then: "« Je vous en prie, occupez-vous d’elle, je regarde en attendant. » Et attendez vraiment, sans vous impatienter.",
            },
          ],
        },
        {
          id: "constat",
          title: "Constat personnalisé",
          goal: "Montrer UN problème concret et visible, sans juger.",
          lines: [
            "Regardez : sur Google, vos horaires disent ouvert de 10 h à 19 h sans pause. Or vous fermez le midi, c’est bien ça ? C’est la cliente qui vient à 13 h et qui trouve porte close.",
            "Les photos de votre fiche, ce sont surtout des photos de clients, un peu sombres. Alors que votre vitrine, là, elle donne vraiment envie d’entrer.",
            "Sur Instagram, vos photos sont très belles, mais la dernière date d’il y a trois semaines. J’imagine que c’est le temps qui manque le soir ?",
            "Et si je suis une touriste qui a craqué pour cette lampe en juillet, une fois rentrée chez moi, je ne peux pas la commander.",
          ],
          tip: "Commencez par un compliment sincère, puis un seul constat, le plus parlant. Ne critiquez jamais ses photos : c’est souvent elle qui les a faites.",
          branches: [
            {
              if: "Tout est déjà bien tenu",
              then: "« Franchement, c’est une des boutiques les mieux présentées que j’ai vues. » Puis basculez sur la fidélité ou la vente en ligne.",
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
          goal: "Faire parler la gérante de ce qui l’embête vraiment.",
          lines: [
            "Les clientes de l’été, une fois rentrées chez elles, vous avez encore des nouvelles, ou c’est fini jusqu’à l’année suivante ?",
            "Les messages sur Instagram, du genre « vous l’avez en 38 ? », vous y répondez quand, dans la journée ?",
            "Qu’est-ce qui vous prend le plus la tête en ce moment : le passage en boutique, le stock, ou le temps pour tout faire ?",
          ],
          tip: "Une seule question, puis silence. Les commerçantes de boutique aiment en général raconter leur métier : laissez-les faire.",
          branches: [
            {
              if: "Elle parle d’Amazon ou des grandes enseignes",
              then: "« Eux, ils ont le prix. Vous, vous avez le choix, le conseil et des pièces qu’on ne trouve pas ailleurs. Il faut juste que ça se sache. »",
            },
            {
              if: "Elle parle du stock ou des invendus",
              then: "« Une boutique en ligne, c’est aussi une deuxième vitrine pour écouler ce qui reste, toute l’année, sans attendre les soldes. »",
            },
            {
              if: "Elle parle du manque de temps",
              then: "« C’est exactement pour ça qu’on existe : vous validez, et c’est nous qui faisons les photos et les publications. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose quelque chose de simple : un audit gratuit de ce que voit une cliente qui vous cherche sur internet, comparé à trois boutiques du coin, avec trois choses à corriger en priorité.",
            "Ça prend vingt minutes, ici, dans un moment calme. Je repasse mardi à 10 h 30 ou jeudi à 14 h 30, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci pour l’accueil, et je reviendrai en client, promis.",
          ],
          tip: "Deux créneaux précis, dans les creux du matin ou du début d’après-midi. Notez le rendez-vous devant elle.",
          branches: [
            {
              if: "« Envoyez-moi ça par mail »",
              then: "« Je préfère vous le montrer sur l’écran, c’est beaucoup plus parlant, et ça ne vous prend pas plus de temps. Mardi ou jeudi ? »",
            },
            {
              if: "« Il faut que j’en parle à mon associée »",
              then: "« Bien sûr. Elle est là quels jours ? Je peux passer quand vous êtes toutes les deux. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et si un jour vous voulez vendre en ligne ou avant Noël, vous saurez qui appeler. Bonne journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "commerce-telephone",
      title: "Appel à la boutique",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier que c’est un bon moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Vous n’avez pas une cliente devant vous, là ? Je ne veux pas vous déranger.",
          ],
          tip: "Appelez entre 10 h et 11 h, du mardi au jeudi. Si elle est occupée, rappelez vraiment à l’heure dite.",
          branches: [
            {
              if: "« Si, j’ai du monde »",
              then: "« Je vous rappelle dans une demi-heure, ça vous va ? »",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir la gérante, ou au moins son prénom et ses jours de présence.",
          lines: [
            "Je voudrais parler à la gérante, c’est au sujet de la fiche Google de la boutique.",
            "Vous pouvez me dire son prénom ? Elle est là plutôt quels jours ?",
          ],
          tip: "Soyez très aimable avec la vendeuse : c’est elle qui transmettra le message, ou pas.",
          branches: [
            {
              if: "« Elle est aux achats, sur un salon »",
              then: "« Pas de souci, je rappelle. Elle revient quand ? Je note pour la rappeler le matin, c’est plus calme ? »",
            },
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui signaler un souci sur sa fiche Google, les horaires notamment. Ça peut lui faire perdre des clientes. »",
            },
            {
              if: "« C’est géré par le siège »",
              then: "« Merci, c’est très clair. Bonne journée. » Notez-le et passez au suivant.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. J’ai regardé votre fiche Google, et vos horaires indiquent ouvert le midi et le lundi matin, alors que vous êtes fermée, c’est bien ça ?",
            "C’est le genre de détail qui envoie des clientes devant une porte close. On aide les boutiques du Bassin de Thau à corriger ça, et à garder le lien avec leurs clientes, y compris celles de l’été.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, qui s’occupe de la fiche Google et d’Instagram, chez vous ?",
            "Et vous vendez déjà un peu à distance, par messages ou par téléphone, ou uniquement en boutique ?",
          ],
          tip: "Deux questions maximum. Le reste se fera en face.",
          branches: [
            {
              if: "« C’est moi, le soir, quand j’ai le temps »",
              then: "« C’est le cas de presque toutes les boutiques que je vois. C’est justement pour ça qu’on existe. »",
            },
            {
              if: "« Je vends déjà par messages Instagram »",
              then: "« Très bien, ça veut dire que la demande est là. On en parle en face, il y a sûrement moyen de vous faire gagner du temps. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes en boutique, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, dans un moment calme. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 10 h 30 ou jeudi à 14 h 30. Qu’est-ce qui vous arrange le mieux ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande, ramenez au rendez-vous.",
          branches: [
            {
              if: "« C’est combien, un site ? »",
              then: "« Ça dépend vraiment de ce dont vous avez besoin, et je ne veux pas vous dire un chiffre au hasard. Le rendez-vous et l’audit sont gratuits. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Pas de souci, dites-moi le matin qui vous arrange en semaine, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 14 h 30 à la boutique. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un SMS de confirmation avec mon nom. Si un imprévu arrive, vous me répondez dessus, tout simplement.",
            "Merci, et bonne journée.",
          ],
          tip: "SMS de confirmation dans les cinq minutes, rappel la veille. Avant le rendez-vous, regardez aussi son Instagram en détail.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos nouvelles clientes, elles vous découvrent comment : en passant devant, par Instagram, par Google ?",
      why: "Savoir d’où vient sa clientèle nouvelle, et si elle a conscience du rôle de Google Maps.",
    },
    {
      type: "S",
      question: "Il vous arrive de vendre à distance : un message Instagram, un article mis de côté, un envoi par la poste ?",
      why: "Repérer une demande de vente à distance déjà là, gérée à la main, et une ouverture pour l’e-commerce.",
    },
    {
      type: "P",
      question: "Les messages du genre « il vous reste le modèle en 38 ? », vous arrivez à y répondre dans la journée ?",
      why: "Faire émerger les ventes perdues faute de réponse rapide, et le temps passé le soir sur le téléphone.",
    },
    {
      type: "P",
      question: "Entre deux collections, comment vous prévenez vos habituées que les nouveautés sont arrivées ?",
      why: "Lui faire réaliser qu’elle n’a pas de moyen simple de garder le lien avec ses clientes.",
    },
    {
      type: "I",
      question: "Les touristes qui ont aimé la boutique cet été et qui voudraient racheter depuis chez eux, aujourd’hui, qu’est-ce qu’ils font ?",
      why: "Lui faire mesurer elle-même les ventes qui partent ailleurs, sans avancer de chiffre.",
    },
    {
      type: "I",
      question: "Et si les habituées passent un peu moins souvent parce qu’elles ne savent pas ce qui est arrivé, qu’est-ce que ça change sur une saison creuse ?",
      why: "Relier le manque de lien au chiffre de l’hiver, qui est souvent le vrai souci.",
    },
    {
      type: "N",
      question: "Si vous pouviez prévenir vos meilleures clientes d’un seul message quand la collection arrive, et que celles de l’été puissent commander depuis chez elles, qu’est-ce que ça changerait pour vous ?",
      why: "Lui faire formuler elle-même le bénéfice de la fidélité digitale et de la boutique en ligne.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui s’occupe de mon site.",
      hidden: "Souvent un site fait il y a des années et jamais mis à jour, ou un prestataire qu’on ne voit plus. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous ayez déjà un site.",
      questionner: "Il s’occupe aussi de votre fiche Google et de vos avis ? Et la dernière mise à jour du site, elle date de quand ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur permet juste de vérifier ce que voit vraiment une cliente, par exemple vos horaires du midi sur Google.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à votre prestataire. S’il corrige tout, tant mieux. Mardi 10 h 30 ou jeudi 14 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, je suis seule en boutique du matin au soir.",
      hidden: "La peur d’ajouter une tâche de plus, et la fatigue des soirées passées sur Instagram.",
      accueillir: "Je vois bien, vous ne pouvez même pas quitter la caisse pour aller boire un café.",
      questionner: "Aujourd’hui, les photos et les publications, vous les faites quand ?",
      recadrer: "C’est justement l’idée : vous rendre vos soirées. Vous validez une fois, et c’est nous qui faisons le reste.",
      proposer: "Vingt minutes ici même, un matin calme, et je vous montre ce qu’on ferait à votre place. Mardi 10 h 30, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, avec le loyer et le stock je n’ai pas de budget pour ça.",
      hidden: "La trésorerie immobilisée dans le stock, et un hiver qui fait peur. Souvent, elle n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, entre le loyer et la collection payée d’avance, la trésorerie est tendue.",
      questionner: "Qu’est-ce qui vous paraîtrait raisonnable pour faire revenir vos clientes plus souvent, ou vendre un peu hors saison ?",
      recadrer: "On a des solutions qui commencent très petit, au mois, et une partie de l’audit, vous pouvez la faire seule gratuitement. L’idée, c’est que ça se rembourse avec quelques ventes de plus.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "amie",
      objection: "Une amie s’y connaît, elle va me faire un site.",
      hidden: "L’envie de ne pas dépenser et la confiance dans son entourage. Souvent, l’amie a promis mais n’a pas le temps.",
      accueillir: "C’est précieux d’avoir quelqu’un de confiance.",
      questionner: "Elle s’occuperait aussi de mettre les nouveautés en ligne, de gérer les stocks et les commandes, et de répondre aux avis ?",
      recadrer: "Faire un site, c’est une chose. Le faire vivre toutes les semaines, avec les produits à jour, c’est ça qui fait vendre, et c’est ce qui lâche en général au bout de quelques mois.",
      proposer: "Je vous laisse l’audit gratuit, elle pourra s’en servir comme feuille de route. Et si un jour elle n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "instagram-suffit",
      objection: "Instagram me suffit, c’est là que mes clientes me suivent.",
      hidden: "Elle a l’impression d’avoir déjà fait sa part du digital, et c’est vrai qu’elle y met beaucoup d’énergie.",
      accueillir: "Et votre compte est vraiment joli, on voit que vous y mettez du cœur.",
      questionner: "Et quelqu’un qui ne vous connaît pas encore, qui cherche « boutique déco à {ville} » sur son téléphone, il tombe sur vous ?",
      recadrer: "Instagram, ça parle à celles qui vous suivent déjà. Les nouvelles clientes cherchent en général sur Google. Et votre compte appartient à Instagram : s’ils changent les règles, vous perdez tout. Un site, c’est chez vous.",
      proposer: "Gardez Instagram, on ne touche à rien. Je vous montre juste ce que voit une nouvelle cliente sur Google, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici, ça marche au bouche-à-oreille, mes clientes me connaissent.",
      hidden: "La fierté d’une clientèle fidèle, et l’idée que le digital, c’est pour les grandes enseignes.",
      accueillir: "C’est la meilleure publicité qui soit, et ça montre que vous faites bien votre métier.",
      questionner: "Quand une cliente vous recommande à une amie, vous savez ce que fait cette amie juste après ?",
      recadrer: "En général, elle regarde sur Google : l’adresse, les horaires, les photos, les avis. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tout le monde.",
      proposer: "La carte d’avis près de la caisse, c’est exactement ça : faire parler vos clientes contentes. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi après les fêtes, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai manque de temps, surtout à l’approche d’une grosse période.",
      accueillir: "Bien sûr, je ne veux pas vous prendre du temps au mauvais moment.",
      questionner: "Pour ne pas vous rappeler au mauvais moment, qu’est-ce qui est le plus calme pour vous, le mardi ou le jeudi matin ?",
      recadrer: "Un mail, honnêtement, il va se perdre entre les factures des fournisseurs. Et si on attend après les fêtes, on passe à côté de Noël, alors que c’est justement là qu’une boutique en ligne sert le plus.",
      proposer: "Je passe mardi à 10 h 30, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça vous va ?",
    },
    {
      id: "amazon",
      objection: "De toute façon, les gens achètent sur Amazon.",
      hidden: "Du découragement, le sentiment de mener une bataille perdue, et la peur d’investir dans une boutique en ligne qui ne vendrait rien.",
      accueillir: "C’est vrai, Amazon a changé beaucoup de choses, et vous le vivez tous les jours au comptoir.",
      questionner: "Et vos clientes qui viennent quand même chez vous, d’après vous, elles viennent pour quoi ?",
      recadrer: "Amazon vend du prix et de la rapidité. Vous, vous vendez un choix, un conseil, des pièces qu’on ne trouve pas ailleurs. Le but n’est pas de faire comme Amazon, c’est que ceux qui cherchent une boutique comme la vôtre vous trouvent, et que ceux qui vous aiment puissent revenir ou commander chez vous.",
      proposer: "Je vous montre en vingt minutes ce que voit quelqu’un qui cherche une boutique comme la vôtre à {ville}. Mardi 10 h 30 ou jeudi 14 h 30 ?",
    },
  ],

  proofs: [
    "En général, avant de se déplacer dans une boutique qu’on ne connaît pas, on regarde sur Google : l’adresse, les horaires, les photos et les avis.",
    "Des horaires justes, pause de midi et lundi compris, c’est la correction la plus simple, et celle qui évite le plus de clients déçus devant une porte close.",
    "Les clientes contentes laissent rarement un avis d’elles-mêmes, les mécontentes si. Demander au bon moment, c’est ce qui rééquilibre une note.",
    "Le click & collect rassure beaucoup de clients : ils vérifient que l’article est disponible, le réservent, et viennent le chercher sans risque de se déplacer pour rien.",
    "Les touristes qui ont aimé une boutique en vacances cherchent souvent à racheter une fois rentrés : sans site, ils ne peuvent tout simplement pas.",
    "Une carte de fidélité dans le téléphone ne se perd pas, et elle permet de prévenir les habituées d’une nouveauté sans imprimer un seul flyer.",
    "Un site à vous, c’est une vitrine qui ne dépend pas des changements de règles d’Instagram ou de Facebook.",
  ],

  buyingSignals: [
    "Elle sort son téléphone pour regarder sa fiche Google ou son Instagram avec vous.",
    "Elle vous raconte une cliente de l’été qui lui a demandé si elle vendait en ligne.",
    "Question : « Et les stocks, ça se met à jour comment sur le site ? »",
    "Question : « Je pourrais mettre mes fins de série en ligne toute l’année ? »",
    "Elle parle de Noël à préparer, ou d’une nouvelle collection qui arrive bientôt.",
    "Elle évoque un projet : agrandissement, deuxième boutique, reprise récente, nouvelle marque.",
    "Elle vous montre son cahier de clientes ou sa liste WhatsApp d’habituées.",
    "Elle demande si vous travaillez déjà avec d’autres boutiques de la rue.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Instagram",
      "Facebook",
      "TikTok",
      "Site internet ou boutique en ligne",
      "Leboncoin",
      "Vinted (dépôt-vente, fins de série)",
      "Marketplaces (Etsy, Amazon, Cdiscount…)",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, et les horaires sont-ils justes (pause de midi, lundi, dimanches d’été et de décembre) ?",
      "Combien d’avis, quelle note, de quand date le dernier avis, et la gérante y répond-elle ?",
      "Que disent les avis : accueil, choix, prix, conseil, horaires ? Y a-t-il un avis qui parle de porte close ?",
      "Les photos de la fiche montrent-elles la vitrine et les produits, ou surtout des photos de clients prises à la volée ?",
      "Sur la recherche du métier et de la ville (« boutique déco {ville} », « fleuriste {ville} », « librairie {ville} »…), où sort {commerce} par rapport aux trois boutiques concurrentes les plus proches ?",
      "Le compte Instagram est-il actif : date de la dernière publication, régularité, stories, ventes par message privé mentionnées ?",
      "Existe-t-il un site internet, permet-il d’acheter ou de réserver en ligne, et est-il lisible sur téléphone ?",
      "La boutique vend-elle déjà sur une marketplace, Vinted ou Leboncoin, ce qui montre une envie de vendre à distance ?",
      "La boutique fait-elle partie d’une franchise ou d’une enseigne, qui déciderait à sa place pour le digital ?",
      "Y a-t-il un élément local ou d’image à valoriser : créateurs du coin, produits sétois, reprise récente, anniversaire de la boutique ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les boutiques du Bassin de Thau à être trouvées quand quelqu’un cherche sur son téléphone, et à garder le lien avec leurs clientes, y compris les touristes de l’été une fois rentrés chez eux. En général, ça commence par des choses simples : des horaires justes, de belles photos, des avis récents. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi ou jeudi ?",

  compliance:
    "Soldes : uniquement pendant les périodes officielles (hiver et été), sur des articles proposés à la vente depuis au moins un mois ; sur le site comme en publication, le prix barré doit être le prix le plus bas pratiqué dans les trente jours précédant la réduction. Boutique en ligne : mentions légales, conditions générales de vente, droit de rétractation de quatorze jours (sauf exceptions, comme les fleurs ou les articles personnalisés), politique de confidentialité et gestion des cookies. Carte de fidélité et notifications : consentement du client et respect du RGPD. Pour un opticien, la vente en ligne de verres correcteurs et de lentilles est encadrée (ordonnance, contrôle par un opticien diplômé) : se limiter aux solaires et accessoires tant que le cadre n’est pas vérifié. N’utiliser les visuels d’une marque qu’avec son accord, et demander l’accord écrit avant de publier une photo où l’on reconnaît une cliente ou une vendeuse.",
};

export default sheet;
