import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "caviste",
  name: "Caviste / épicerie fine",
  short: "Caviste",
  examples: [
    "cave à vins indépendante",
    "cave et bar à vins avec dégustation sur place",
    "épicerie fine et produits régionaux",
    "producteur de muscat de Frontignan en vente directe au caveau",
    "domaine viticole avec caveau de dégustation",
    "conchyliculteur avec dégustation au mas (Bouzigues, Mèze)",
    "boutique de cave coopérative",
  ],
  tagline:
    "Des métiers de goût et de conseil, où le touriste de juillet repart avec six bouteilles, et ne sait plus où les recommander en novembre.",

  reality: {
    rhythm:
      "Le caviste ouvre vers 9 h 30 - 10 h. La matinée sert aux arrivages, à la mise en rayon, aux commandes auprès des domaines, aux livraisons des restaurants clients, et aux visites des commerciaux de domaines qui viennent faire goûter. Beaucoup de caves ferment entre 12 h 30 et 15 h, parfois 15 h 30. L’après-midi reste calme jusqu’à 17 h, puis les clients arrivent pour l’apéritif et le dîner jusqu’à la fermeture, vers 19 h 30. Le vendredi soir et le samedi sont les plus gros moments de la semaine, c’est aussi là qu’ont lieu les dégustations. Certaines caves ouvrent le dimanche matin, jour de marché, et ferment le lundi. Chez le producteur de muscat, la journée se partage entre la vigne, le chai et le caveau, souvent tenu par un membre de la famille ou un salarié ; le vigneron lui-même est rarement au caveau le matin. Chez le conchyliculteur, la journée commence à l’aube sur les tables de l’étang : récolte, tri, lavage et expéditions le matin, puis dégustation au mas de la fin de matinée à l’après-midi, surtout l’été et le week-end. Dans tous les cas, c’est le patron ou le couple qui décide, mais c’est souvent le conjoint qui tient les comptes et la communication.",
    pains: [
      "Une grosse partie de l’année se joue en décembre : le stock à financer à l’avance, et la peur de rater les fêtes.",
      "Les foires aux vins de la grande distribution à l’automne, et des clients qui comparent les prix sur internet.",
      "La loi Évin qui fait peur : on ne sait pas ce qu’on a le droit de publier sur le vin, alors on ne publie rien.",
      "Les touristes de l’été qui adorent, achètent trois bouteilles et ne peuvent plus recommander une fois rentrés : pas de site, expédition compliquée à organiser.",
      "Un stock lourd, des références qui tournent lentement, de la trésorerie immobilisée dans la cave.",
      "Chez les producteurs : une seule personne pour la vigne, le chai, le caveau et la vente, et les vendanges qui prennent tout le temps disponible.",
      "Chez les conchyliculteurs : les aléas de l’étang, comme la malaïgue l’été ou les fermetures sanitaires temporaires, qu’il faut pouvoir annoncer vite à ses clients, puis la réouverture.",
    ],
    clientLoss: [
      "Le touriste tape « dégustation huîtres Bouzigues », « caviste Sète » ou « muscat Frontignan domaine » sur son téléphone et va chez celui qui a des photos, des horaires et des avis récents.",
      "Le client de l’été, rentré chez lui, veut recommander le muscat ou le vin qu’il a aimé : faute de site, il achète autre chose en ligne ou au supermarché.",
      "Des horaires Google faux, surtout les horaires d’hiver des caveaux et des mas, qui envoient des visiteurs devant une porte fermée.",
      "Les coffrets de Noël et les cadeaux d’entreprise partent chez le caviste qui a un site et un formulaire de commande.",
      "Les habitués ne sont pas prévenus d’une dégustation ou de l’arrivée d’une cuvée rare : ils l’apprennent trop tard, ou jamais.",
      "Pas de réservation possible en ligne pour une dégustation au mas ou au caveau : les groupes et les familles vont chez le voisin.",
    ],
    seasonality:
      "L’été, c’est la saison des dégustations : touristes au caveau, mas de Bouzigues et de Mèze pleins, visiteurs qui repartent avec leurs bouteilles de muscat de Frontignan. Les producteurs vendangent de fin août à fin septembre, et le muscat commence souvent tôt : à ce moment-là, oubliez-les complètement. Septembre-octobre, ce sont les foires aux vins de la grande distribution, qui pèsent sur les cavistes. Novembre prépare les fêtes, et décembre est le mois le plus important de l’année pour les cavistes, les épiceries fines et les huîtres : ne passez jamais. Janvier est très calme, après les fêtes et avec les résolutions de début d’année ; c’est l’inventaire et le bilan. À Balaruc-les-Bains, les curistes (mars à décembre) achètent volontiers des produits régionaux à offrir. Au printemps, l’Escale à Sète les années paires amène beaucoup de visiteurs. Meilleures périodes pour prospecter : de mi-janvier à mars pour tous (calme, bilan, on prépare la saison), octobre et début novembre pour les producteurs une fois les vendanges rentrées, et avril-mai pour les producteurs et conchyliculteurs qui préparent l’été (fiche Google, horaires, réservation des dégustations).",
    digitalHabits:
      "La fiche Google existe presque toujours, avec des photos de visiteurs et des horaires rarement adaptés à la saison. Les producteurs ont souvent un site fait il y a des années, sans vente en ligne, ou avec un bon de commande à imprimer et un règlement par chèque. Facebook sert à annoncer les dégustations et les événements ; Instagram est très présent chez les jeunes cavistes, notamment ceux orientés vins nature. Les vins du domaine apparaissent sur Vivino avec des notes de clients que le producteur ne regarde pas toujours. Les commandes à distance se font par téléphone et virement, gérées à la main. La peur de la loi Évin pousse beaucoup à ne rien publier. Les mentions dans le guide Hachette ou les brochures de l’office de tourisme sont affichées au caveau mais rarement mises en avant en ligne. La fidélité, c’est un carnet d’adresses, un fichier d’e-mails jamais utilisé ou une carte en carton.",
  },

  offers: {
    priority: [
      {
        offer: "site-ecommerce",
        pitch:
          "Vos clients de l’été repartent à Lyon ou à Bruxelles avec trois bouteilles, et en novembre ils en voudraient pour Noël. Avec une petite boutique en ligne, ils recommandent depuis chez eux et vous expédiez, avec la vérification de l’âge prévue dès le départ. Et ceux d’ici réservent et passent chercher.",
      },
      {
        offer: "fidelite",
        pitch:
          "Vos habitués, vous les connaissez par leur prénom. Avec la carte dans leur téléphone, vous les prévenez d’une dégustation ou d’un arrivage d’un simple message, sans imprimer un seul flyer.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Une dégustation, un arrivage, le vigneron qui passe, les huîtres qui sortent de l’eau : c’est ça qui fait venir. On s’en occupe en respectant la loi Évin, on parle du produit, du terroir et du cépage, et vous n’avez plus à vous demander si vous avez le droit.",
      },
    ],
    entry: [
      {
        offer: "nfc-avis",
        pitch:
          "Une petite carte posée sur le comptoir de dégustation : le client qui vient de se régaler approche son téléphone et laisse un avis en dix secondes. C’est le meilleur moment pour le demander, il a encore le goût en bouche.",
      },
      {
        offer: "fiche-google",
        pitch:
          "Les touristes vous cherchent sur Google Maps depuis leur location. On met vos horaires justes, été et hiver, des photos de la cave ou du mas qui donnent envie de venir, et on répond aux avis pour vous.",
      },
    ],
    upsell:
      "Après la carte d’avis et la fiche Google, la suite logique est la carte de fidélité digitale, pour prévenir les habitués des dégustations et des arrivages. Le gros projet est la boutique en ligne avec expédition et retrait sur place, à signer en septembre ou début octobre pour être prête avant les fêtes, avec les coffrets cadeaux et les commandes d’entreprise. Pour les producteurs et les conchyliculteurs, un site vitrine avec réservation des dégustations se prépare au printemps, avant la saison. Ensuite, la gestion des réseaux sociaux sur la saison, et un agent IA pour répondre aux questions répétitives : horaires, dégustation sans réservation, expédition possible ou non.",
  },

  timing: {
    best: [
      {
        label: "Fin de matinée",
        days: [2, 3, 4, 5],
        from: "10:00",
        to: "11:30",
        why: "Arrivages rangés, pas encore de clients pour l’apéritif : le caviste a le temps de parler, il aime ça.",
      },
      {
        label: "Milieu d’après-midi",
        days: [2, 3, 4],
        from: "15:00",
        to: "17:00",
        why: "La cave vient de rouvrir et reste calme jusqu’à l’arrivée des clients du soir.",
      },
      {
        label: "Téléphone en semaine",
        days: [2, 3],
        from: "10:00",
        to: "11:30",
        why: "Le mardi et le mercredi matin sont en général les moments les plus calmes de la semaine.",
      },
    ],
    avoid: [
      {
        label: "Vendredi soir",
        days: [5],
        from: "17:00",
        to: "20:00",
        why: "Le moment où tout le monde vient chercher sa bouteille pour le week-end, souvent avec une dégustation en cours.",
      },
      {
        label: "Samedi",
        days: [6],
        from: "09:30",
        to: "19:30",
        why: "Le plus gros jour de la semaine, dégustations et conseils non-stop.",
      },
      {
        label: "Dimanche matin",
        days: [0],
        from: "09:00",
        to: "13:00",
        why: "Jour de marché pour les caves ouvertes le dimanche, et affluence au mas chez les conchyliculteurs.",
      },
      {
        label: "Pause de midi",
        from: "12:30",
        to: "15:00",
        why: "Beaucoup de caves sont fermées, et au mas c’est le coup de feu des dégustations du midi.",
      },
      {
        label: "Apéritif en semaine",
        from: "17:30",
        to: "19:30",
        why: "Les clients passent après le travail, le caviste doit être à eux.",
      },
    ],
    usuallyClosed: [1],
    phoneNote:
      "Appelez le fixe de la cave ou du caveau entre 10 h et 11 h 30, en milieu de semaine. Chez un producteur, c’est souvent un membre de la famille ou un salarié du caveau qui décroche : demandez le prénom du vigneron et quand il est au caveau, et ne l’appelez jamais sur son portable en période de vendanges. Chez un conchyliculteur, n’appelez pas tôt le matin, il est sur l’étang ; préférez la fin de matinée. Vérifiez les horaires d’hiver sur la fiche Google avant de vous déplacer.",
    seasonNote:
      "Prospectez de mi-janvier à mars, en octobre et début novembre (après les vendanges), et en avril-mai pour les producteurs et conchyliculteurs. Oubliez tout décembre et les semaines avant les fêtes, l’été pour les caveaux et les mas de dégustation, et les vendanges de fin août à fin septembre pour les producteurs.",
  },

  scripts: {
    physique: {
      id: "caviste-physique",
      title: "Visite à la cave ou au caveau",
      channel: "physique",
      duration: "4 à 6 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Entrer comme un client, demander un conseil et savoir à qui parler.",
          lines: [
            "Bonjour ! Je cherche un blanc pour des huîtres ce week-end, qu’est-ce que vous me conseillez ?",
            "Parfait, je vous prends celui-là. Vous travaillez directement avec le domaine ?",
            "C’est vous le patron de la cave ?",
            "Pas de souci. Il est là plutôt quels jours ? Je repasse, j’en ai pour deux minutes.",
          ],
          tip: "Demandez un conseil et achetez une bouteille : un caviste aime conseiller, c’est la meilleure entrée en matière. Attendez qu’aucun client ne soit en train de se faire conseiller.",
          branches: [
            {
              if: "C’est un salarié ou un membre de la famille au caveau",
              then: "Demandez le prénom du vigneron ou du patron et quand il est là, laissez votre carte avec un mot : « Passé pour votre fiche Google, je repasse mardi vers 10 h 30. {prenom} ».",
            },
            {
              if: "Chez un conchyliculteur, au mas",
              then: "Venez hors du service de dégustation. « Je ne veux surtout pas vous déranger pendant le service. Vous êtes plus tranquille à quelle heure ? »",
            },
            {
              if: "C’est le patron",
              then: "Passez à l’accroche, en rebondissant sur le conseil qu’il vient de vous donner.",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Dire qui vous êtes et obtenir trente secondes d’attention, sans rien vendre.",
          lines: [
            "Enchanté, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les commerces du coin à être trouvés sur internet et à garder le lien avec leurs clients.",
            "Je ne viens rien vous vendre aujourd’hui. En venant, j’ai regardé votre fiche Google, et il y a un détail qui m’a interpellé. Je vous montre, trente secondes ?",
          ],
          tip: "Ayez la fiche Google de {commerce} ouverte sur votre téléphone. Tournez l’écran vers lui, ne lui demandez pas de chercher.",
          branches: [
            {
              if: "« Je n’ai pas le temps »",
              then: "« Je comprends. Je repasse mardi à 10 h 30 ou jeudi à 15 h 30, qu’est-ce qui vous arrange ? »",
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
          goal: "Montrer UN problème concret et visible, sans juger.",
          lines: [
            "Regardez : vos horaires sur Google sont ceux de l’été. En ce moment vous fermez à 18 h 30 et le lundi, c’est bien ça ? C’est le visiteur qui se déplace pour rien.",
            "Vous avez de très bons avis, qui parlent de vos conseils, mais le dernier date de plusieurs mois et personne n’y a répondu.",
            "Quand je tape « dégustation » ici, à {ville}, vous sortez après des domaines qui ont des photos de caveau et de vignes. Chez vous, ce sont surtout des photos de bouteilles prises par des clients.",
            "Et si je suis un touriste qui a adoré votre muscat en juillet, une fois rentré chez moi, je ne peux pas vous en recommander.",
          ],
          tip: "Un compliment sincère sur ce que vous avez goûté ou vu, puis un seul constat, le plus parlant.",
          branches: [
            {
              if: "La fiche est déjà impeccable",
              then: "Félicitez sincèrement, puis basculez sur la vente à distance aux clients de l’été ou sur la fidélité.",
            },
            {
              if: "« Ah bon ? Je ne savais pas »",
              then: "« C’est très courant, surtout pour les horaires d’hiver. Ça se corrige en quelques minutes. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Faire parler le commerçant de ce qui l’embête vraiment.",
          lines: [
            "Les clients de l’été, une fois rentrés chez eux, ils vous recommandent comment, aujourd’hui ?",
            "Vos dégustations, vous prévenez vos habitués comment ?",
            "Qu’est-ce qui vous prend le plus la tête en ce moment : préparer les fêtes, faire venir du monde hors saison, ou le temps pour tout faire ?",
          ],
          tip: "Une seule question, puis silence. Un caviste ou un vigneron qui parle de ses clients, c’est un bon signe : laissez-le aller au bout.",
          branches: [
            {
              if: "Il parle des commandes par téléphone et virement",
              then: "« Donc la demande existe déjà. Une boutique en ligne, c’est juste la même chose, sans que vous passiez vos soirées au téléphone. »",
            },
            {
              if: "Il parle de la loi Évin",
              then: "« Vous avez raison d’y faire attention. On peut parler du vin tant qu’on parle du produit, du terroir, du cépage, avec le message sanitaire. C’est exactement ce qu’on fait. »",
            },
            {
              if: "Il parle des foires aux vins et des supermarchés",
              then: "« Eux, ils ont le prix. Vous, vous avez le conseil et des vins qu’on ne trouve pas ailleurs. Il faut que vos clients puissent y revenir facilement. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous, un numéro ou un audit gratuit accepté.",
          lines: [
            "Je vous propose quelque chose de simple : un audit gratuit de ce que voit un client qui vous cherche sur internet, comparé à trois caves ou domaines du coin, avec trois choses à corriger en priorité.",
            "Ça prend vingt minutes. Je repasse mardi à 10 h 30 ou jeudi à 15 h 30, qu’est-ce qui vous arrange ?",
            "Je note votre prénom et un numéro, au cas où je doive décaler ?",
            "Merci pour le conseil, je vous dirai ce que ça donne avec les huîtres.",
          ],
          tip: "Deux créneaux précis, dans les creux de la semaine. Notez le rendez-vous devant lui.",
          branches: [
            {
              if: "« Envoyez-moi ça par mail »",
              then: "« Je préfère vous le montrer sur l’écran, c’est bien plus parlant. Mardi ou jeudi ? »",
            },
            {
              if: "« Il faut que j’en parle à ma femme, c’est elle qui gère ça »",
              then: "« Bien sûr. Elle est là quand ? Je passe quand vous êtes tous les deux, c’est mieux pour tout le monde. »",
            },
            {
              if: "Refus net",
              then: "« Aucun souci. Je vous laisse ma carte, et si un jour vous voulez vendre à vos clients de l’été, vous saurez qui appeler. Bonne journée. »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "caviste-telephone",
      title: "Appel à la cave ou au domaine",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et vérifier que c’est un bon moment.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Je ne vous prends pas en pleine dégustation, là ?",
          ],
          tip: "Appelez entre 10 h et 11 h 30 en semaine. Jamais le vendredi soir ni le samedi.",
          branches: [
            {
              if: "« Si, j’ai des clients »",
              then: "« Je vous rappelle dans une demi-heure, ça vous va ? » Et rappelez vraiment.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage",
          goal: "Obtenir le patron ou le vigneron, ou au moins son prénom et le bon moment.",
          lines: [
            "Je voudrais parler au patron, ou au vigneron, c’est au sujet de votre fiche Google.",
            "Vous pouvez me dire son prénom ? Il est plus facile à joindre à quel moment ?",
          ],
          tip: "Au caveau, c’est souvent la famille qui décroche : soyez chaleureux, c’est elle qui transmettra.",
          branches: [
            {
              if: "« Il est dans les vignes » ou « il est sur l’étang »",
              then: "« Bien sûr, je ne veux pas le déranger. Il repasse au caveau plutôt en fin de matinée ou l’après-midi ? »",
            },
            {
              if: "« On est en pleines vendanges »",
              then: "« Alors je vous laisse tranquilles. Je rappelle en octobre, vendanges rentrées. Bonne récolte ! »",
            },
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour signaler un souci sur la fiche Google, les horaires d’hiver notamment. Ça peut faire perdre des visiteurs. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer l’appel.",
          lines: [
            "Merci de me prendre deux minutes. J’ai regardé votre fiche Google, et vos horaires sont encore ceux de l’été, alors que vous fermez le lundi en ce moment, c’est bien ça ?",
            "C’est le genre de détail qui envoie des visiteurs devant une porte fermée. On aide les caves et les producteurs du Bassin de Thau à corriger ça, et à continuer de vendre aux clients de l’été une fois rentrés chez eux.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Un seul constat, précis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Poser une ou deux questions pour qualifier, sans interroger.",
          lines: [
            "Aujourd’hui, qui s’occupe de la fiche Google et des réseaux, chez vous ?",
            "Et vous expédiez déjà un peu, à des clients qui vous appellent de loin ?",
          ],
          tip: "Deux questions maximum. Le reste se fera en face.",
          branches: [
            {
              if: "« Oui, par téléphone et virement »",
              then: "« Très bien, donc la demande est là. On en parle en face, il y a sûrement moyen de vous simplifier la vie. »",
            },
            {
              if: "« Personne, on n’a pas le temps »",
              then: "« C’est le cas de presque tous les domaines que je vois. C’est justement pour ça qu’on existe. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un rendez-vous de vingt minutes sur place, sans parler de prix.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ça sur l’écran, vingt minutes, dans un moment calme. C’est gratuit, et vous repartez avec trois actions concrètes.",
            "Je peux passer mardi à 10 h 30 ou jeudi à 15 h 30. Qu’est-ce qui vous arrange le mieux ?",
          ],
          tip: "Jamais de prix au téléphone. Si on vous le demande, ramenez au rendez-vous.",
          branches: [
            {
              if: "« C’est combien, un site pour vendre en ligne ? »",
              then: "« Ça dépend vraiment de votre catalogue et de l’expédition, je ne veux pas vous dire un chiffre au hasard. Le rendez-vous et l’audit sont gratuits. Mardi ou jeudi ? »",
            },
            {
              if: "Aucun des deux créneaux",
              then: "« Pas de souci, dites-moi le jour qui vous arrange en semaine, le matin ou en milieu d’après-midi, je m’adapte. »",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et laisser une bonne impression.",
          lines: [
            "Parfait, je note jeudi à 15 h 30 à la cave. C’est bien avec vous, {dirigeant} ?",
            "Je vous envoie un SMS de confirmation avec mon nom. Si un imprévu arrive, vous me répondez dessus, tout simplement.",
            "Merci, et bonne journée.",
          ],
          tip: "SMS de confirmation dans les cinq minutes, rappel la veille. Avant le rendez-vous, regardez aussi le domaine sur Vivino et dans les guides.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, vos nouveaux clients, ils vous découvrent comment : en passant, par l’office de tourisme, par Google, par le bouche-à-oreille ?",
      why: "Savoir d’où vient la clientèle nouvelle, et s’il a conscience du rôle de Google Maps chez les touristes.",
    },
    {
      type: "S",
      question: "Il vous arrive d’expédier des bouteilles ou des colis à des clients qui vous appellent de loin ? Comment ça se passe ?",
      why: "Repérer une vente à distance déjà existante, gérée à la main, et une ouverture pour l’e-commerce.",
    },
    {
      type: "P",
      question: "Les commandes par téléphone, les virements à vérifier, les colis à préparer, ça vous prend combien de temps quand ça arrive ?",
      why: "Faire émerger le temps perdu et les erreurs d’une vente à distance artisanale.",
    },
    {
      type: "P",
      question: "Quand vous organisez une dégustation ou qu’une cuvée rare arrive, comment vous prévenez vos habitués ?",
      why: "Lui faire réaliser qu’il n’a pas de moyen simple de faire revenir ses clients.",
    },
    {
      type: "I",
      question: "Tous les clients de l’été qui ont aimé votre vin et qui ne peuvent pas en recommander, d’après vous, ils finissent par acheter quoi à Noël ?",
      why: "Lui faire mesurer lui-même les ventes qui partent ailleurs, sans avancer de chiffre.",
    },
    {
      type: "I",
      question: "Et si vous ne publiez rien de peur de la loi Évin, pendant que d’autres domaines le font dans les règles, qui les touristes trouvent-ils en premier ?",
      why: "Montrer que l’autocensure a un coût, et qu’une communication conforme est possible.",
    },
    {
      type: "N",
      question: "Si vos clients de l’été pouvaient recommander en trois clics depuis chez eux, avec l’expédition et la vérification de l’âge gérées, qu’est-ce que ça changerait pour vos mois d’hiver ?",
      why: "Lui faire formuler lui-même le bénéfice de la boutique en ligne sur la saison creuse.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui a fait mon site.",
      hidden: "Souvent un site fait il y a des années, sans vente en ligne, jamais mis à jour. Parfois une façon polie de clore.",
      accueillir: "Très bien, c’est plutôt bon signe que vous ayez déjà un site.",
      questionner: "Il permet de commander en ligne ? Et votre fiche Google, vos avis, c’est aussi lui qui s’en occupe ?",
      recadrer: "Je ne viens remplacer personne. Un regard extérieur permet juste de vérifier ce que voit vraiment un client, par exemple vos horaires d’hiver sur Google.",
      proposer: "Je vous fais l’audit gratuit, et vous le montrez à votre prestataire. S’il corrige tout, tant mieux. Mardi 10 h 30 ou jeudi 15 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, entre la vigne, le chai et le caveau.",
      hidden: "La fatigue, et la peur d’ajouter une tâche de plus à des journées déjà trop pleines.",
      accueillir: "Je vous crois, vous faites trois métiers à la fois.",
      questionner: "Aujourd’hui, si vous deviez vous occuper de votre fiche Google ou de vos réseaux vous-même, vous le feriez quand ?",
      recadrer: "C’est justement l’idée : que ça tourne sans vous. Vous validez une fois, et c’est nous qui faisons le reste.",
      proposer: "Vingt minutes au caveau, un matin calme, et je vous montre ce qu’on ferait à votre place. Mardi 10 h 30, ça irait ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher, j’ai déjà tout mon stock à financer.",
      hidden: "La trésorerie immobilisée dans la cave, et la peur de dépenser sans retour. Souvent, il n’a pas encore vu ce que ça peut rapporter.",
      accueillir: "Je comprends, avec le stock à payer avant les fêtes, chaque euro compte.",
      questionner: "Qu’est-ce qui vous paraîtrait raisonnable pour vendre un peu plus hors saison, ou aux clients de l’été ?",
      recadrer: "On a des solutions qui commencent très petit, au mois, et une partie de l’audit, vous pouvez la faire seul gratuitement. L’idée, c’est que ça se rembourse avec quelques cartons de plus.",
      proposer: "Commençons par l’audit gratuit : vous verrez ce qui vaut le coup et ce qui ne le vaut pas, et vous décidez ensuite.",
    },
    {
      id: "neveu",
      objection: "Mon fils s’y connaît, il va me faire ça.",
      hidden: "L’envie de ne pas dépenser et la confiance dans la famille. Souvent, il a promis mais n’a pas le temps, surtout pendant les vendanges.",
      accueillir: "C’est bien d’avoir la relève dans la famille.",
      questionner: "Il connaît aussi les règles pour vendre du vin en ligne : la vérification de l’âge, la loi Évin, les mentions obligatoires, l’expédition ?",
      recadrer: "Faire un site, c’est une chose. Vendre de l’alcool en ligne dans les règles et le faire vivre toute l’année, c’est ce qui demande du temps, et c’est ce qui lâche en général au bout de quelques mois.",
      proposer: "Je vous laisse l’audit gratuit, il pourra s’en servir comme feuille de route. Et si un jour il n’a plus le temps, vous saurez où me trouver.",
    },
    {
      id: "facebook-suffit",
      objection: "J’ai ma page Facebook, j’y mets mes dégustations, ça me suffit.",
      hidden: "Il a l’impression d’avoir déjà fait sa part du digital.",
      accueillir: "C’est très bien, vos habitués vous y suivent sûrement.",
      questionner: "Et un touriste qui ne vous connaît pas, dans sa location à Marseillan, il tape quoi sur son téléphone pour trouver une dégustation ?",
      recadrer: "Facebook, ça parle à ceux qui vous connaissent déjà. Les nouveaux clients cherchent en général sur Google Maps. Et Facebook ne permet pas à un client de Lyon de vous commander six bouteilles.",
      proposer: "Gardez Facebook, on ne touche à rien. Je vous montre juste ce que voit un nouveau client sur Google, vingt minutes, mardi ou jeudi ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Ici, ça marche au bouche-à-oreille, les gens viennent de la part des autres.",
      hidden: "La fierté d’une clientèle fidèle et d’un produit reconnu, et l’idée que le vin, ça ne se vend pas comme le reste.",
      accueillir: "Et c’est la meilleure publicité qui soit, surtout pour un produit comme le vôtre.",
      questionner: "Quand quelqu’un vient de la part d’un ami, vous savez ce qu’il fait juste avant de venir ?",
      recadrer: "En général, il vérifie sur Google : l’adresse, les horaires, les avis. Les avis Google, c’est le bouche-à-oreille d’aujourd’hui, écrit et visible par tout le monde.",
      proposer: "La carte d’avis sur le comptoir de dégustation, c’est exactement ça : faire parler vos clients contents au moment où ils se régalent. Je vous en montre une ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi après les fêtes, ou envoyez-moi un mail.",
      hidden: "Souvent un refus poli. Parfois un vrai manque de temps à l’approche d’une grosse période.",
      accueillir: "Bien sûr, je ne veux pas vous prendre du temps au mauvais moment.",
      questionner: "Pour ne pas vous rappeler au mauvais moment, qu’est-ce qui est le plus calme pour vous, le mardi ou le mercredi matin ?",
      recadrer: "Un mail, honnêtement, il va se perdre entre les commandes et les factures. Et si on attend après les fêtes, vos clients de l’été auront acheté ailleurs pour Noël.",
      proposer: "Je passe mardi à 10 h 30, vingt minutes, et si ça ne vous parle pas, je ne vous embête plus. Ça vous va ?",
    },
    {
      id: "vin-se-goute",
      objection: "Le vin, ça se goûte, ça ne se vend pas sur internet.",
      hidden: "L’attachement au conseil et à la relation, la peur de devenir un entrepôt, et souvent la crainte de la logistique : casse, expédition, règles sur l’alcool.",
      accueillir: "Vous avez raison, le vin, c’est d’abord une histoire de goût et de conseil, c’est ce qui fait votre métier.",
      questionner: "Vos clients qui ont déjà goûté chez vous cet été, quand ils veulent en racheter depuis chez eux, ils font comment aujourd’hui ?",
      recadrer: "Le site ne remplace pas la dégustation : il sert à ceux qui ont déjà goûté. Ils vous connaissent, ils savent ce qu’ils veulent, il leur manque juste un moyen de commander.",
      proposer: "Je vous montre à quoi ça pourrait ressembler pour vous, avec l’expédition et la vérification de l’âge prévues dès le départ. Mardi 10 h 30 ou jeudi 15 h 30 ?",
    },
  ],

  proofs: [
    "En général, les touristes cherchent « dégustation » ou « caviste » sur Google Maps depuis leur location, et choisissent sur les photos, les horaires et les avis.",
    "Des horaires justes, été comme hiver, c’est la correction la plus simple et celle qui évite le plus de visiteurs déçus devant un caveau fermé.",
    "Les clients qui ont aimé un vin en vacances cherchent souvent à le racheter une fois rentrés : sans site, ils ne peuvent pas, ou ils passent par un autre revendeur.",
    "Le meilleur moment pour demander un avis, c’est pendant la dégustation, quand le client est content : une carte sur le comptoir rend ça naturel.",
    "On peut communiquer sur le vin dans le respect de la loi Évin : parler du produit, du cépage, du terroir, de la façon de le faire, avec le message sanitaire.",
    "Une carte de fidélité dans le téléphone permet de prévenir les habitués d’une dégustation ou d’un arrivage, sans imprimer ni poster un seul flyer.",
    "Une récompense ou un prix dans un guide, affiché en ligne, rassure le client qui ne connaît pas encore le domaine.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour regarder sa fiche Google ou ses notes sur Vivino avec vous.",
    "Il vous raconte un client de Paris ou de Belgique qui l’appelle chaque année pour recommander.",
    "Question : « Et l’expédition, les cartons, la casse, ça se passe comment ? »",
    "Question : « Et avec la loi Évin, on a le droit de publier quoi, exactement ? »",
    "Il parle des fêtes à préparer, des coffrets de Noël ou des commandes d’entreprise.",
    "Il évoque un projet : nouvelle cuvée, reprise du domaine par la génération suivante, agrandissement du caveau, bar à vins.",
    "Il vous fait goûter quelque chose sans que vous l’ayez demandé.",
    "Il demande si vous travaillez déjà avec d’autres caves ou domaines du coin.",
  ],

  research: {
    platforms: [
      "Google (fiche et Maps)",
      "Instagram",
      "Facebook",
      "Vivino",
      "Site du producteur ou de la cave",
      "Guide Hachette des vins et autres guides",
      "Office de tourisme (Sète, Frontignan, Thau)",
      "TripAdvisor (dégustations au mas)",
    ],
    questions: [
      "La fiche Google est-elle revendiquée, et les horaires sont-ils justes pour la saison en cours (horaires d’hiver, jour de fermeture, dégustations sur réservation) ?",
      "Combien d’avis, quelle note, de quand date le dernier avis, et le gérant y répond-il ?",
      "Que disent les avis : qualité du conseil, accueil, prix, dégustation, horaires ?",
      "Les photos montrent-elles la cave, le caveau, les vignes ou le mas, ou seulement des bouteilles prises par des clients ?",
      "Sur la recherche « caviste {ville} », « dégustation {ville} » ou « huîtres Bouzigues », où sort {commerce} par rapport à ses trois concurrents les plus proches ?",
      "Existe-t-il un site, permet-il de commander en ligne, et si oui : vérification de l’âge, message sanitaire et mentions légales sont-ils présents ?",
      "Les vins du domaine sont-ils présents sur Vivino, avec quelle note et combien d’avis ?",
      "Le domaine a-t-il une mention dans un guide ou une médaille à valoriser (guide Hachette, concours), ou un label comme Vignobles & Découvertes ?",
      "Le commerce est-il référencé par l’office de tourisme, et la fiche est-elle à jour ?",
      "Les publications Facebook ou Instagram respectent-elles la loi Évin (pas d’ambiance de fête, message sanitaire), et de quand date la dernière ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, une agence de Sète. On aide les caves et les producteurs du Bassin de Thau à être trouvés par les touristes, et surtout à continuer de leur vendre une fois qu’ils sont rentrés chez eux, en restant dans les règles de la loi Évin. En général, ça commence simplement : des horaires justes, de belles photos, des avis récents. J’ai regardé {commerce} en venant, il y a deux ou trois points faciles à corriger. Je vous les montre en vingt minutes, gratuitement, mardi ou jeudi ?",

  compliance:
    "Loi Évin (communication sur l’alcool, y compris sur internet et les réseaux) : on ne peut publier que des informations objectives sur le produit, c’est-à-dire son degré, son origine, son appellation, son cépage, sa composition, son mode d’élaboration, son terroir, ses distinctions, sa description gustative et la façon de le déguster. Aucune association à la fête, à la séduction, au sport, à la réussite sociale ou à la performance, pas de visuels de personnes en train de faire la fête, rien qui vise les jeunes. Chaque publication, visuel ou page de site qui parle d’alcool porte le message sanitaire : « L’abus d’alcool est dangereux pour la santé, à consommer avec modération. » Pas d’alcool offert en récompense d’une carte de fidélité, d’un jeu ou d’un avis : la distribution gratuite à des fins de promotion est interdite, en dehors des dégustations en vue de la vente ; privilégier une remise, une invitation à une dégustation ou un produit d’épicerie. Vente en ligne d’alcool : le vendeur doit détenir la licence de vente à emporter adaptée (à vérifier auprès de la mairie ou de la douane selon le cas) ; la vente aux mineurs est interdite, donc vérification de l’âge à l’entrée du site ou à la commande, rappel de l’interdiction sur le site, et contrôle d’identité au retrait en click & collect ou à la livraison. L’expédition de vin est encadrée (droits d’accise, documents d’accompagnement, règles propres au pays de destination hors de France) : faire valider avec la douane ou un transporteur spécialisé. Mentions obligatoires du site marchand : mentions légales, conditions générales de vente, droit de rétractation de quatorze jours (les coquillages frais, périssables, en sont exclus), politique de confidentialité et consentement pour les notifications de la carte de fidélité (RGPD). Pour les conchyliculteurs : ne jamais minimiser une fermeture sanitaire de l’étang, relayer les informations officielles et n’annoncer la réouverture qu’une fois l’autorisation effective.",
};

export default sheet;
