import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "sante",
  name: "Profession de santé libérale",
  short: "Santé",
  examples: [
    "masseur-kinésithérapeute en cabinet ou en cabinet de groupe",
    "ostéopathe",
    "sage-femme libérale",
    "orthophoniste",
    "diététicien-nutritionniste",
    "pédicure-podologue",
    "psychologue en libéral",
    "maison de santé pluriprofessionnelle",
  ],
  tagline:
    "L’agenda est plein, le problème n’est pas de trouver des patients : c’est le téléphone qui sonne pendant les séances et les mêmes questions pratiques cent fois par semaine. On parle d’organisation et d’information, jamais de publicité.",

  reality: {
    rhythm:
      "Le praticien enchaîne les séances de 8 h à 12 h 30, puis de 13 h 30 à 19 h ou 20 h, souvent toutes les trente ou quarante-cinq minutes, sans vrai temps mort. Entre deux patients, il a deux minutes : il note sa séance, il rappelle un patient, il désinfecte la table. La pause de midi sert à manger vite, à rappeler les messages de la matinée et à faire un peu d’administratif. Le soir, après le dernier patient, il reste la facturation, la télétransmission, les comptes rendus, les courriers aux médecins. Beaucoup n’ont pas de secrétaire : soit ils décrochent entre deux séances, soit ils ont un télésecrétariat ou un agenda en ligne type Doctolib, soit le téléphone sonne dans le vide pendant les soins. Le samedi matin est travaillé chez beaucoup de kinés et d’ostéopathes, le mercredi est souvent chargé chez les orthophonistes (enfants). Dans les cabinets de groupe, chacun gère son agenda, et les décisions communes (site, fiche Google du cabinet) se prennent à plusieurs, souvent lors d’une réunion mensuelle.",
    pains: [
      "Le téléphone qui sonne pendant les séances : soit on décroche et on coupe le soin, soit on ne décroche pas et on passe la pause à rappeler.",
      "Les mêmes questions pratiques toute la journée : l’adresse, le parking, l’étage, l’accès en fauteuil, les documents à apporter, les tarifs, le remboursement.",
      "Le secrétariat ou le télésecrétariat qui coûte cher et ne sait pas répondre aux questions propres au cabinet.",
      "Les demandes qui ne relèvent pas de sa pratique (mauvaise spécialité, mauvais type de prise en charge) et qu’il faut réorienter une par une.",
      "Les rendez-vous non honorés et les annulations de dernière minute, qui laissent des trous dans un agenda pourtant plein.",
      "La liste d’attente (très fréquente chez les orthophonistes et les kinés), avec des patients ou des parents qui rappellent chaque semaine pour savoir où ils en sont.",
      "La peur de mal faire vis-à-vis de l’Ordre ou de la déontologie dès qu’on parle d’internet, ce qui fait qu’on ne fait rien du tout.",
    ],
    clientLoss: [
      "Un nouveau patient appelle trois fois, tombe sur la messagerie pendant les séances, et prend rendez-vous chez le confrère qui a un lien de prise de rendez-vous en ligne.",
      "La fiche Google affiche de mauvais horaires ou une ancienne adresse après un déménagement de cabinet : le patient se déplace pour rien, surtout les personnes âgées.",
      "Les congés et les remplacements ne sont indiqués nulle part : le patient pense que le cabinet a fermé et va ailleurs.",
      "Le médecin prescripteur ou le patient ne sait pas que le praticien a une orientation particulière (rééducation périnéale, sport, pédiatrie, troubles du langage écrit…) : les patients concernés partent ailleurs.",
      "L’accès au cabinet est mal expliqué (entrée par la cour, deuxième étage sans ascenseur, pas de parking) : retards, séances raccourcies, patients qui ne reviennent pas.",
    ],
    seasonality:
      "Sur le Bassin de Thau, l’activité est régulière toute l’année, mais le littoral ajoute des variations. L’été, les vacanciers de Sète, Frontignan ou Marseillan cherchent un kiné ou un ostéopathe en urgence depuis leur location (entorse, lumbago après la route) : ils tapent « kiné » ou « ostéopathe » sur Google Maps et appellent le premier qui répond. Août est aussi le mois des congés et des remplaçants, avec des horaires Google rarement mis à jour. À Balaruc-les-Bains, la présence des thermes (mars à décembre) fait vivre beaucoup de praticiens et amène une patientèle de curistes qui cherche un soignant sur place, souvent depuis son téléphone. La rentrée de septembre est chargée : reprise du sport, bilans d’orthophonie demandés par les écoles, listes d’attente qui s’allongent. Janvier et le printemps sont des pics chez les diététiciens (bonnes résolutions, préparation de l’été). Les meilleures périodes pour prospecter : octobre-novembre et février-avril. Évitez août (congés) et les deux premières semaines de septembre.",
    digitalHabits:
      "L’agenda en ligne (Doctolib ou équivalent) est très répandu chez les kinés, ostéopathes et sages-femmes, moins chez les orthophonistes, souvent saturés. Le site internet est rare, ou c’est une page générée par la plateforme d’agenda, ou un vieux site fait par un proche. La fiche Google existe presque toujours, souvent créée automatiquement, avec des avis de patients que le praticien n’ose pas toucher. Les annuaires publics (annuaire santé de l’Assurance Maladie, annuaire de l’Ordre quand il y en a un) sont remplis mais jamais consultés par le praticien. Peu de réseaux sociaux, par prudence déontologique, sauf chez quelques ostéopathes, diététiciens et psychologues plus jeunes, sur Instagram. Les messages patients arrivent par SMS, par la messagerie de l’agenda en ligne ou sur le portable personnel, ce qui mélange vie pro et vie privée.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Un site d’information, sobre et conforme : qui vous êtes, vos domaines de prise en charge, l’accès au cabinet, les tarifs conventionnels, ce qu’il faut apporter, et le lien direct vers votre prise de rendez-vous. Le patient trouve la réponse avant d’appeler, et on le fait valider par votre Ordre avant la mise en ligne.",
      },
      {
        offer: "agent-ia",
        pitch:
          "Un assistant qui répond uniquement aux questions pratiques : adresse, parking, accès, horaires, documents à apporter, lien de rendez-vous. Il ne pose aucune question sur la santé du patient et ne donne aucun conseil médical : si on lui en parle, il renvoie vers vous, ou vers le 15 en cas d’urgence.",
      },
      {
        offer: "fiche-google",
        pitch:
          "On remet votre fiche Google au propre : bonne adresse, bons horaires, congés, accès, lien de rendez-vous. Sans publicité, sans « meilleur kiné de la ville » : de l’information juste, pour que le patient ne se déplace pas pour rien.",
      },
    ],
    entry: [
      {
        offer: "audit",
        pitch:
          "Je vous propose un audit gratuit de vingt minutes : ce que voit un patient qui vous cherche sur internet, les informations fausses ou manquantes, et trois corrections simples, toutes compatibles avec votre déontologie. Aucune obligation derrière.",
      },
    ],
    upsell:
      "Après l’audit, la suite logique est la fiche Google corrigée, puis le site d’information avec le lien vers l’agenda en ligne. Une fois le site en place, l’agent IA pour les questions pratiques, qui soulage le téléphone et la pause de midi. Pour une maison de santé ou un cabinet de groupe, un site commun avec une page par praticien. La carte NFC d’avis n’est proposée qu’aux professions sans Ordre, et seulement si le praticien est à l’aise avec ça, ou après validation écrite de son Ordre : on ne la pousse jamais.",
  },

  timing: {
    best: [
      {
        label: "Pause de midi (téléphone)",
        days: [1, 2, 3, 4, 5],
        from: "12:30",
        to: "13:30",
        why: "Le seul moment de la journée où le praticien n’a pas de patient sur la table : il rappelle ses messages, il peut prendre deux minutes.",
      },
      {
        label: "Fin de journée",
        days: [1, 2, 4],
        from: "18:30",
        to: "19:00",
        why: "Dernières séances terminées ou presque : il fait sa facturation et accepte plus volontiers un échange court, surtout pour caler un rendez-vous.",
      },
      {
        label: "Passage au secrétariat",
        days: [2, 4],
        from: "11:00",
        to: "12:00",
        why: "Dans un cabinet avec secrétaire, c’est un bon moment pour déposer une carte et demander quand rappeler, sans jamais demander à voir le praticien.",
      },
    ],
    avoid: [
      {
        label: "Créneaux de séances du matin",
        from: "08:00",
        to: "12:30",
        why: "Le praticien est avec un patient : l’appeler, c’est interrompre un soin, et il ne vous le pardonnera pas.",
      },
      {
        label: "Créneaux de séances de l’après-midi",
        from: "13:30",
        to: "18:30",
        why: "Séances enchaînées toutes les trente à quarante-cinq minutes : aucune place pour une discussion, et la salle d’attente est pleine.",
      },
      {
        label: "Samedi matin",
        days: [6],
        from: "08:00",
        to: "13:00",
        why: "Souvent la matinée la plus chargée pour les patients qui travaillent en semaine.",
      },
      {
        label: "Mercredi chez les orthophonistes",
        days: [3],
        from: "08:00",
        to: "19:00",
        why: "Journée des enfants : agenda saturé du matin au soir.",
      },
    ],
    usuallyClosed: [0],
    phoneNote:
      "Appelez uniquement entre 12 h 30 et 13 h 30, ou entre 18 h 30 et 19 h. Si vous tombez sur un télésecrétariat, ne pitchez pas : donnez votre nom, l’objet en une phrase (« l’information pratique aux patients et les appels pendant les séances ») et demandez à quel moment rappeler. Si le praticien décroche entre deux patients, proposez tout de suite de le rappeler à la pause : « Vous êtes avec un patient ? Je vous rappelle à 12 h 45. » N’utilisez jamais une ligne réservée aux patients ou aux urgences pour démarcher.",
    seasonNote:
      "Prospectez d’octobre à novembre et de février à avril. Évitez août (congés, remplaçants), la première quinzaine de septembre (rentrée, reprise des patients) et la dernière semaine avant Noël. En janvier, les diététiciens sont débordés, mais les kinés et les sages-femmes sont accessibles.",
  },

  scripts: {
    physique: {
      id: "sante-physique",
      title: "Passage au cabinet (secrétariat ou carte)",
      channel: "physique",
      duration: "1 à 3 min",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Passer par le secrétariat ou laisser une carte, sans jamais déranger une séance ni parler devant les patients.",
          lines: [
            "Bonjour, je suis {prenom}, de MJAGENCY, une agence web à Sète. Je ne suis pas patient, rassurez-vous, je ne vous prends pas de place.",
            "Je voulais simplement laisser un mot à {dirigeant}. Il ou elle est plus disponible à quel moment pour un appel de deux minutes, à la pause de midi ou en fin de journée ?",
            "Je vous laisse ma carte, avec un petit mot. Merci beaucoup.",
          ],
          tip: "Parlez à voix basse, restez près de l’accueil, ne regardez ni l’écran ni l’agenda. Ne pitchez jamais en salle d’attente : les patients sont là pour se soigner, pas pour vous entendre.",
          branches: [
            {
              if: "Il n’y a pas de secrétaire, juste une salle d’attente",
              then: "Ne frappez pas à la porte de la salle de soins. Déposez une carte avec un mot écrit à la main : « Passé vous voir au sujet des appels pendant les séances et de l’information pratique aux patients. Je vous appelle mardi à 12 h 45. {prenom} » Et appelez vraiment mardi à 12 h 45.",
            },
            {
              if: "Le praticien sort raccompagner un patient et vous voit",
              then: "« Bonjour, je ne vous retiens pas, vous avez quelqu’un. Je suis {prenom}, agence web à Sète. Je peux vous appeler à 12 h 45 demain, deux minutes ? » Puis partez.",
            },
            {
              if: "La secrétaire dit que le praticien ne reçoit pas les commerciaux",
              then: "« Je comprends très bien. Je laisse juste ma carte, et si un jour il se pose la question des appels pendant les séances, il saura qui appeler. Merci à vous. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Parler de son problème à lui : le téléphone et les questions répétitives, pas la visibilité.",
          lines: [
            "On aide les praticiens libéraux à être moins dérangés pendant les séances : les patients trouvent les réponses pratiques avant d’appeler.",
            "Rien de publicitaire : de l’information claire, validée avec votre Ordre avant la mise en ligne.",
          ],
          tip: "Évitez les mots « visibilité », « marketing », « attirer des patients ». Un soignant a déjà trop de patients : il veut du calme et de la conformité.",
          branches: [
            {
              if: "« Je n’ai pas le droit de faire de la pub »",
              then: "« Vous avez raison, et on ne vous en proposera pas. On parle d’information pratique : accès, horaires, tarifs, lien de rendez-vous. C’est justement ce que la déontologie permet. »",
            },
          ],
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer un constat factuel sur l’information disponible, sans jamais juger sa pratique.",
          lines: [
            "J’ai regardé ce que trouve un patient qui cherche le cabinet sur Google. Les horaires indiqués ne correspondent pas à ceux de la plaque, en bas.",
            "Et on ne trouve nulle part comment accéder au cabinet : l’étage, le parking, l’accès en fauteuil. C’est typiquement la question qu’on vous pose au téléphone.",
            "Il n’y a pas non plus de lien vers votre prise de rendez-vous depuis la fiche : le patient est obligé d’appeler.",
          ],
          tip: "Un seul constat, sur l’information pratique. Ne commentez jamais les avis de patients ni la qualité des soins.",
          branches: [
            {
              if: "« C’est Doctolib qui gère tout ça »",
              then: "« Doctolib gère l’agenda, et c’est très bien. Mais le patient qui tape votre nom sur Google tombe d’abord sur la fiche, et c’est elle qui est fausse. »",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "Le faire parler de ce que le téléphone lui coûte vraiment.",
          lines: [
            "Dans une journée, le téléphone sonne combien de fois pendant vos séances, à peu près ?",
            "Et sur ces appels, combien sont de vraies demandes de soins, et combien sont des questions pratiques ?",
          ],
          tip: "Posez la question, puis taisez-vous. S’il parle de sa pause de midi passée à rappeler, vous tenez le sujet.",
          branches: [
            {
              if: "Il parle de sa liste d’attente",
              then: "« Et les patients en attente rappellent souvent pour savoir où ils en sont ? Une page claire qui explique le fonctionnement de la liste, ça évite une bonne partie de ces appels. »",
            },
            {
              if: "Il parle du coût du télésecrétariat",
              then: "« Et il sait répondre aux questions propres à votre cabinet, l’accès, les documents à apporter ? Souvent, c’est là qu’il renvoie tout vers vous. »",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un créneau d’appel ou un audit gratuit accepté, en dehors des séances.",
          lines: [
            "Je vous propose un audit gratuit : je regarde ce que voit un patient qui vous cherche, et je vous laisse trois corrections, toutes compatibles avec votre déontologie.",
            "Je vous le présente en vingt minutes, à votre pause ou en fin de journée : mardi à 12 h 45 ou jeudi à 18 h 30, qu’est-ce qui vous arrange ?",
            "Je vous laisse ma carte, et je vous confirme par SMS la veille.",
          ],
          tip: "Ne parlez pas de prix. Proposez des créneaux en dehors des séances, c’est ce qui prouve que vous avez compris son métier.",
          branches: [
            {
              if: "« Il faut que j’en parle à mes associés »",
              then: "« Bien sûr, c’est une décision de cabinet. Vous avez une réunion bientôt ? Je peux venir présenter l’audit à tout le monde en quinze minutes. »",
            },
            {
              if: "« Envoyez-moi un mail »",
              then: "« Avec plaisir. Je vous envoie l’audit par mail, et je vous appelle jeudi à 12 h 45 pour en parler deux minutes, ça vous va ? »",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "sante-telephone",
      title: "Appel à la pause de midi",
      channel: "telephone",
      duration: "2 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter et vérifier qu’il n’est pas avec un patient.",
          lines: [
            "Bonjour, je suis {prenom}, de MJAGENCY, une agence web à Sète. Je ne vous appelle pas pour un rendez-vous de soins.",
            "Vous n’êtes pas avec un patient, là ? Sinon je vous rappelle à l’heure qui vous arrange.",
          ],
          tip: "Appelez uniquement entre 12 h 30 et 13 h 30 ou entre 18 h 30 et 19 h. Dites tout de suite que vous n’êtes pas un patient : il se met en mode soin sinon.",
          branches: [
            {
              if: "« Si, j’ai quelqu’un »",
              then: "« Pardon, je vous rappelle à 12 h 45 ou ce soir à 18 h 45 ? » Et rappelez à l’heure dite.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le secrétariat ou le télésecrétariat",
          goal: "Laisser un objet clair et obtenir le bon moment pour joindre le praticien.",
          lines: [
            "Je souhaiterais joindre {dirigeant}. C’est au sujet de l’information pratique aux patients et des appels qui tombent pendant les séances.",
            "Ce n’est pas une demande de soins et ce n’est pas urgent. À quel moment est-il le plus facile à joindre, plutôt à midi ou en fin de journée ?",
          ],
          tip: "Le télésecrétariat ne transfère pas les commerciaux : obtenez un créneau, pas un transfert. Ne laissez jamais un message sur une ligne réservée aux patients.",
          branches: [
            {
              if: "« Laissez vos coordonnées, il vous rappellera »",
              then: "« Merci. Je laisse mon numéro, et pour ne pas encombrer sa liste de rappels, je me permets de rappeler jeudi à 12 h 45 si je n’ai pas de nouvelles. »",
            },
            {
              if: "« C’est pour vendre quelque chose ? »",
              then: "« C’est pour lui proposer un audit gratuit de l’information que trouvent ses patients en ligne. Ça peut réduire les appels pendant les séances. »",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète d’écouter trente secondes.",
          lines: [
            "Merci de me prendre sur votre pause, je serai bref. On aide les praticiens libéraux du Bassin de Thau à recevoir moins d’appels pendant les séances.",
            "En regardant votre fiche Google, j’ai vu qu’il n’y avait ni l’accès au cabinet ni le lien de rendez-vous : c’est souvent ce qui fait sonner le téléphone.",
          ],
          tip: "Adaptez le constat à ce que vous avez vraiment vu en préparant l’appel. Rien sur la qualité des soins, rien sur les avis.",
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Deux questions pour qualifier le vrai problème.",
          lines: [
            "Aujourd’hui, pendant vos séances, les appels vont où : sur votre portable, sur un télésecrétariat, sur une messagerie ?",
            "Et ce qu’on vous demande le plus souvent, c’est plutôt de l’information pratique ou de vraies demandes de rendez-vous ?",
          ],
          branches: [
            {
              if: "Il demande le prix",
              then: "« Je préfère ne pas vous donner un chiffre au hasard, ça dépend de ce que vous avez déjà. Je vous montre l’audit, qui est gratuit, et je vous fais une proposition écrite ensuite, que vous pourrez faire relire à votre Ordre si vous le souhaitez. »",
            },
            {
              if: "« Et l’Ordre, il en dit quoi ? »",
              then: "« C’est la bonne question. On reste sur de l’information loyale et objective, sans publicité ni témoignages, et on valide ensemble avec votre Ordre avant toute mise en ligne. »",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous",
          goal: "Obtenir un créneau de vingt minutes en dehors des séances.",
          lines: [
            "Je vous propose vingt minutes pour vous présenter l’audit, au cabinet ou en visio : mardi à 12 h 45 ou jeudi à 18 h 30, qu’est-ce qui vous convient ?",
          ],
          tip: "Jamais de prix au téléphone. Vous vendez vingt minutes de sa pause : respectez-les à la minute.",
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Verrouiller le rendez-vous et préparer l’échange.",
          lines: [
            "C’est noté pour jeudi à 18 h 30. Je vous envoie une confirmation par SMS la veille.",
            "Si vous pouvez noter d’ici là les trois questions qu’on vous pose le plus au téléphone, ça nous permettra d’être très concrets.",
            "Merci, et bonne fin de pause.",
          ],
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, comment les patients prennent-ils rendez-vous : agenda en ligne, téléphone, secrétariat, ou un peu tout ?",
      why: "Comprendre le circuit des demandes et repérer où ça coince.",
    },
    {
      type: "S",
      question: "Qui répond au téléphone pendant que vous êtes en séance ?",
      why: "Savoir s’il y a une secrétaire, un télésecrétariat ou personne, et donc qui subit les appels.",
    },
    {
      type: "P",
      question: "Quelles sont les questions qu’on vous pose le plus souvent au téléphone et qui n’ont rien à voir avec le soin ?",
      why: "Faire émerger le volume de questions pratiques répétitives, que l’information en ligne peut absorber.",
    },
    {
      type: "P",
      question: "Il vous arrive de recevoir des demandes qui ne relèvent pas de votre pratique, et qu’il faut réorienter ?",
      why: "Mettre le doigt sur le temps perdu à réorienter, et sur l’intérêt de bien présenter ses domaines de prise en charge.",
    },
    {
      type: "I",
      question: "Quand vous passez votre pause de midi à rappeler des patients, qu’est-ce que ça vous coûte, sur la journée et sur la semaine ?",
      why: "Relier les appels à la fatigue et à l’absence de vraie coupure.",
    },
    {
      type: "I",
      question: "Et un patient qui n’arrive pas à vous joindre, ou qui se trompe d’adresse, qu’est-ce qu’il fait en général ?",
      why: "Lui faire réaliser que les patients perdus ou en retard viennent souvent d’une information manquante.",
    },
    {
      type: "N",
      question: "Si la moitié des questions pratiques trouvaient leur réponse avant l’appel, qu’est-ce que vous feriez de ce temps ?",
      why: "Le laisser formuler lui-même le bénéfice : une vraie pause, moins d’interruptions, des séances plus sereines.",
    },
  ],

  objections: [
    {
      id: "ordre-publicite",
      objection: "Mon Ordre m’interdit la publicité, je ne peux pas faire ça.",
      hidden: "Peur réelle d’une sanction disciplinaire, et assimilation de tout ce qui est en ligne à de la publicité commerciale.",
      accueillir: "Vous avez raison d’y faire attention, et je ne vous proposerai rien de publicitaire.",
      questionner: "Ce qui vous inquiète, c’est plutôt la promotion de votre activité, ou le simple fait d’avoir un site et une fiche Google ?",
      recadrer: "Depuis quelques années, les règles de déontologie permettent aux soignants de communiquer une information loyale, objective et non comparative : accès, horaires, tarifs, domaines de prise en charge. Pas de promesse de résultat, pas de témoignages de patients, pas de comparaison avec les confrères. C’est exactement ce qu’on fait.",
      proposer: "On prépare le contenu ensemble, et vous le faites valider par votre Ordre avant la mise en ligne. Si l’Ordre demande une modification, on la fait, sans discussion.",
    },
    {
      id: "deja-quelquun",
      objection: "J’ai déjà Doctolib, ça me suffit.",
      hidden: "Pense que l’agenda en ligne règle tout, et ne veut pas d’un outil de plus à gérer.",
      accueillir: "C’est un très bon outil pour l’agenda, et vous avez bien fait de le mettre en place.",
      questionner: "Et les questions sur l’accès, le parking, les documents à apporter ou le remboursement, elles arrivent où aujourd’hui ?",
      recadrer: "L’agenda gère les créneaux, pas l’information. Le patient qui vous cherche tombe d’abord sur Google, et c’est souvent là que l’information est fausse ou absente. On ne remplace pas votre agenda, on envoie les patients vers lui.",
      proposer: "Je vous montre dans l’audit gratuit ce que voit un patient avant d’arriver sur votre agenda.",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai pas le temps, j’enchaîne les patients toute la journée.",
      hidden: "Surcharge réelle, peur d’un projet qui mange les soirées.",
      accueillir: "Je le sais, c’est pour ça que je vous appelle à la pause et pas pendant vos séances.",
      questionner: "Combien de temps, par jour, vous passez à rappeler des patients pour des questions pratiques ?",
      recadrer: "C’est justement ce temps-là qu’on cherche à vous rendre. De votre côté, c’est un échange au départ et une relecture des textes : c’est nous qui faisons le travail.",
      proposer: "Vingt minutes pour voir si ça vaut le coup : mardi à 12 h 45 ou jeudi à 18 h 30 ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour un libéral, avec mes charges.",
      hidden: "Charges lourdes, tarifs conventionnés fixes, difficulté à voir le retour pour quelqu’un qui a déjà assez de patients.",
      accueillir: "Je comprends, vos tarifs sont fixés et vos charges ne baissent pas.",
      questionner: "Aujourd’hui, qu’est-ce qui vous coûte le plus : le télésecrétariat, les rendez-vous manqués, ou le temps passé à rappeler ?",
      recadrer: "L’idée n’est pas de dépenser plus, mais de comparer à ce que ces appels vous coûtent déjà. Et on peut étaler le paiement pour que ça reste léger chaque mois.",
      proposer: "Commençons par l’audit gratuit. Vous verrez ce qui est vraiment utile, et vous déciderez ensuite, sans engagement.",
    },
    {
      id: "neveu",
      objection: "Ma fille s’y connaît en informatique, elle va me faire une page.",
      hidden: "Envie d’économiser, et confiance familiale.",
      accueillir: "C’est une bonne idée, et elle connaît bien votre façon de travailler.",
      questionner: "Elle connaît aussi les règles de votre Ordre sur la communication, et la question des données de santé ?",
      recadrer: "Pour un soignant, le site doit respecter des règles précises : pas de témoignages, pas de promesse de résultat, les bonnes mentions, et surtout aucun formulaire qui collecte des informations médicales sans hébergement adapté. C’est là que les pages faites maison posent problème.",
      proposer: "Faites l’audit avec nous : vous aurez une liste claire de ce qu’il faut et ne faut pas mettre, qu’elle pourra utiliser si elle s’en occupe.",
    },
    {
      id: "facebook",
      objection: "On a une page Facebook du cabinet, ça suffit bien.",
      hidden: "Pense que la présence en ligne est déjà réglée, et n’a pas envie d’en faire plus.",
      accueillir: "C’est bien d’avoir déjà un point d’information pour les patients.",
      questionner: "Quand un patient de {ville} cherche un kiné ou un ostéopathe, il va plutôt sur Facebook ou sur Google Maps, à votre avis ?",
      recadrer: "En général, le patient tape la profession et la ville sur Google, et il ne va pas plus loin que la fiche. Si l’accès, les horaires et le lien de rendez-vous n’y sont pas, il appelle. Et une page Facebook, c’est aussi des commentaires publics à surveiller, ce qui est délicat pour un soignant.",
      proposer: "Je vous montre dans l’audit ce qu’un patient voit vraiment, c’est vingt minutes.",
    },
    {
      id: "bouche-a-oreille",
      objection: "Je suis plein, j’ai une liste d’attente, je n’ai pas besoin de patients.",
      hidden: "Croit qu’on vient lui vendre de nouveaux patients, alors que son problème est l’organisation.",
      accueillir: "C’est une vraie reconnaissance de votre travail, et je ne viens pas vous amener des patients.",
      questionner: "Justement, cette liste d’attente, elle génère combien d’appels de relance dans la semaine ?",
      recadrer: "Quand on est plein, le sujet devient d’être moins dérangé : expliquer le fonctionnement de la liste d’attente, les domaines que vous prenez en charge, et répondre aux questions pratiques sans vous. Ça rend service aux patients qui attendent, et à vous.",
      proposer: "On en parle vingt minutes, uniquement sous l’angle organisation. Mardi à 12 h 45 ou jeudi à 18 h 30 ?",
    },
    {
      id: "rappelez-moi",
      objection: "Envoyez-moi quelque chose par mail, je regarderai.",
      hidden: "Façon polie de clore l’appel, ou vraie envie de vérifier avant de s’engager.",
      accueillir: "Bien sûr, c’est normal de vouloir regarder tranquillement.",
      questionner: "Pour vous envoyer quelque chose d’utile, ce qui vous intéresse le plus, c’est la conformité, ou les appels pendant les séances ?",
      recadrer: "Un mail générique, vous ne le lirez pas, et c’est normal. Un audit fait sur votre cabinet, avec vos vraies informations en ligne, c’est plus parlant.",
      proposer: "Je vous envoie l’audit par mail, et je vous appelle jeudi à 12 h 45 pour deux minutes de questions. Ça vous va ?",
    },
  ],

  proofs: [
    "En général, un patient qui cherche un praticien tape la profession et la ville sur Google Maps, et lit la fiche avant d’appeler.",
    "Une bonne partie des appels reçus par un cabinet concernent souvent des questions pratiques (accès, horaires, documents, remboursement) qu’une information claire en ligne peut absorber.",
    "Les patients âgés et leurs proches vérifient souvent l’adresse et l’accès avant de se déplacer : une information fausse se traduit en retard ou en déplacement pour rien.",
    "Un lien direct vers l’agenda en ligne depuis la fiche Google évite en général un appel au patient qui veut juste un créneau.",
    "Présenter clairement ses domaines de prise en charge aide les médecins prescripteurs et les patients à s’adresser au bon praticien, et réduit les réorientations.",
    "Une communication d’information sobre, sans publicité ni témoignages, reste dans ce que les règles de déontologie permettent, à condition de la faire valider.",
    "Un assistant limité aux questions pratiques, qui ne demande rien sur la santé du patient, soulage le téléphone sans toucher au secret médical.",
  ],

  buyingSignals: [
    "Il sort son téléphone pour vous montrer le nombre d’appels manqués de la matinée.",
    "Il vous demande si c’est conforme à son Ordre, et comment se passe la validation.",
    "Il parle du coût de son télésecrétariat ou d’une secrétaire qui part.",
    "Il vous demande si le site peut renvoyer directement vers son agenda en ligne.",
    "Il évoque un déménagement de cabinet, une installation en maison de santé ou l’arrivée d’un collaborateur.",
    "Il demande un exemple de site d’un autre praticien de la même profession.",
    "Il parle de sa liste d’attente et des parents ou patients qui rappellent chaque semaine.",
    "Il vous demande comment sont gérées et hébergées les données, sans que vous en ayez parlé.",
  ],

  research: {
    platforms: [
      "Google (fiche établissement et résultats « kiné {ville} », « ostéopathe {ville} »…)",
      "Doctolib ou autre agenda en ligne (présence, spécialités affichées, lien de rendez-vous)",
      "Annuaire santé de l’Assurance Maladie (ameli)",
      "Annuaire de l’Ordre de la profession, quand il existe (kinés, sages-femmes, pédicures-podologues)",
      "Annuaire Santé public (identifiant RPPS)",
      "Site internet du cabinet ou de la maison de santé",
      "PagesJaunes",
      "Facebook ou Instagram du cabinet",
    ],
    questions: [
      "Quelle est la profession exacte du praticien, et relève-t-elle d’un Ordre (kiné, sage-femme, pédicure-podologue) ou d’un titre protégé sans Ordre (ostéopathe, psychologue) ?",
      "Le praticien exerce-t-il seul, en cabinet de groupe ou en maison de santé, et avec combien de confrères ?",
      "La fiche Google est-elle revendiquée, et les horaires, l’adresse et le téléphone correspondent-ils à ceux de l’agenda en ligne ?",
      "Le cabinet utilise-t-il un agenda en ligne, et un lien de prise de rendez-vous est-il visible depuis Google ?",
      "L’accès au cabinet (étage, parking, accessibilité fauteuil) est-il expliqué quelque part en ligne ?",
      "Les tarifs et la situation conventionnelle sont-ils indiqués en ligne ?",
      "Le site existant contient-il des éléments délicats au regard de la déontologie (témoignages, promesses de résultat, comparaisons) ?",
      "Quels domaines de prise en charge particuliers le praticien met-il en avant (sport, périnée, pédiatrie, langage écrit…) ?",
      "Les avis Google mentionnent-ils des difficultés à joindre le cabinet ou à trouver l’adresse ?",
      "Le cabinet a-t-il déménagé récemment, ou un nouveau praticien s’est-il installé ?",
    ],
  },

  pitch30s:
    "Bonjour, {prenom}, de MJAGENCY, une agence web à Sète. Je ne viens pas vous amener des patients, vous en avez déjà. On aide les praticiens libéraux du Bassin de Thau à être moins dérangés pendant les séances : un site d’information sobre avec l’accès, les tarifs et le lien de rendez-vous, une fiche Google juste, et si besoin un assistant qui répond aux questions pratiques, jamais médicales. Tout est validé avec votre Ordre avant la mise en ligne. Je vous propose vingt minutes, à votre pause, pour vous montrer l’audit gratuit.",

  compliance:
    "Secteur à forte contrainte : relisez ce paragraphe avant chaque rendez-vous. Professions à Ordre (masseurs-kinésithérapeutes, sages-femmes, pédicures-podologues, infirmiers, médecins, chirurgiens-dentistes) : la publicité commerciale reste encadrée par leur code de déontologie. Depuis la réforme de 2020, ces codes autorisent les praticiens à communiquer au public des informations loyales, claires, honnêtes, objectives et non comparatives sur leurs compétences et leur pratique. Concrètement, on peut publier : identité, qualification et titres reconnus, domaines de prise en charge, adresse, accès, horaires, situation conventionnelle et tarifs, lien de prise de rendez-vous, informations pratiques. On ne publie jamais : promesse de résultat ou de guérison, superlatifs (« le meilleur », « le spécialiste n°1 »), comparaison avec les confrères, photos avant/après, témoignages ou avis de patients utilisés comme argument publicitaire, titres ou diplômes non reconnus par l’Ordre. On ne cite aucun article de code précis au prospect : on renvoie vers son Ordre. Carte NFC d’avis : ne pas la proposer aux professions à Ordre, ou seulement après validation écrite de leur Ordre. Fiche Google : information uniquement ; les réponses aux avis ne doivent jamais confirmer qu’une personne est patiente du cabinet ni évoquer un soin, secret médical oblige : réponse neutre et courte, ou pas de réponse. Secret médical et données de santé : l’agent IA ne répond qu’aux questions pratiques, ne demande jamais de symptômes, de motif de consultation ni d’antécédents, rappelle au patient de ne pas partager d’informations de santé, et renvoie vers le praticien, ou vers le 15 ou le 112 en cas d’urgence. Si une donnée de santé devait être collectée ou stockée (formulaire, pièce jointe, historique de conversation), l’hébergement doit être certifié HDS (hébergeur de données de santé) : dans ce cas, on ne le met pas en place sans solution certifiée, sinon on supprime le champ. RGPD dans tous les cas : mentions légales, politique de confidentialité, hébergement en Europe, pas de traceurs publicitaires sur le site. Ostéopathes et psychologues (titre protégé, sans Ordre), orthophonistes et diététiciens (professions réglementées sans Ordre) : on applique les mêmes précautions par prudence, et on s’appuie sur les recommandations de leurs organisations professionnelles. Phrase à dire systématiquement : « On valide ensemble avec votre Ordre avant la mise en ligne. » Pour les professions sans Ordre : « On relit ensemble avec vos règles professionnelles avant la mise en ligne. »",
};

export default sheet;
