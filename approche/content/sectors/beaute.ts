import type { SectorSheet } from "../types";

const sheet: SectorSheet = {
  id: "beaute",
  name: "Institut de beauté / onglerie",
  short: "Beauté",
  examples: [
    "institut de beauté (soins visage, épilation, modelages)",
    "onglerie et prothésiste ongulaire",
    "esthéticienne à domicile",
    "bar à sourcils et extensions de cils",
    "spa urbain et soins corps",
    "maquilleuse mariage et événementiel",
  ],
  tagline:
    "Des soins d’une heure en cabine, porte fermée : pendant ce temps-là, le téléphone sonne dans le vide et les messages Instagram s’empilent.",

  reality: {
    rhythm:
      "L’institut ouvre souvent du mardi au samedi, parfois le lundi après-midi, et ferme le dimanche. La gérante travaille en cabine la plupart du temps, souvent seule ou avec une ou deux employées : pendant un soin visage ou une pose de gel, elle ne peut ni décrocher ni sortir. Le matin, on enchaîne épilations et soins ; le midi, les actives viennent pour un sourcil ou un vernis express ; en fin de journée et le samedi, c’est plein. Entre deux clientes, il y a dix minutes pour désinfecter, encaisser, répondre à trois messages et vérifier l’agenda. Les prothésistes ongulaires et les esthéticiennes à domicile gèrent tout depuis leur téléphone, souvent le soir, entre la famille et la comptabilité.",
    pains: [
      "Ne pas pouvoir répondre au téléphone en cabine : la cliente tombe sur la messagerie et ne laisse pas de message.",
      "Les messages Instagram et WhatsApp du soir (« vous avez de la place jeudi pour un semi-permanent ? ») qui prennent une heure après la journée.",
      "Les rendez-vous non honorés sur des soins longs, et la gêne de demander un acompte à des clientes qu’on connaît.",
      "Des tarifs et une carte de soins difficiles à trouver en ligne, donc les mêmes questions posées dix fois par semaine.",
      "La concurrence des ongleries à bas prix et des esthéticiennes qui travaillent chez elles, difficile à expliquer quand on vend de la qualité.",
      "Des cartes de fidélité en carton perdues ou oubliées, et aucune idée de qui n’est pas revenue depuis trois mois.",
      "Le manque de temps pour photographier les poses et les mettre en ligne, alors que les clientes choisissent sur photo.",
    ],
    clientLoss: [
      "La nouvelle cliente ne trouve ni tarifs ni réservation en ligne, et réserve chez l’institut qui affiche tout clairement.",
      "Personne ne répond au téléphone pendant les soins, et personne ne rappelle avant le soir.",
      "Une réponse Instagram qui arrive le lendemain : la cliente a déjà réservé ailleurs pour sa soirée ou son mariage.",
      "Peu d’avis Google, ou quelques avis négatifs sans réponse sur l’hygiène ou l’attente, qui font peur aux nouvelles.",
      "Aucune relance après un premier soin : la cliente satisfaite oublie de revenir pour son remplissage ou son épilation suivante.",
      "Des photos de cabine datées ou prises au flash, qui ne donnent pas envie pour un soin haut de gamme.",
    ],
    seasonality:
      "Le printemps est la grosse saison : épilations avant l’été, mariages, communions, cérémonies. Juin et juillet restent forts avec les estivants et les soirées ; en août sur le littoral, les habituées partent mais les vacancières cherchent une manucure ou une épilation en urgence, et elles passent par Google. À Balaruc-les-Bains, les curistes des thermes (de mars à décembre) cherchent des soins bien-être et des modelages pour compléter leur cure : un institut bien visible en profite. Décembre est très chargé (fêtes, cartes cadeaux, réveillons), tout comme les veilles de Saint-Valentin et de fête des mères. Janvier et février sont calmes : c’est le bon moment pour prospecter, et pour vendre la carte de fidélité et la carte cadeau en ligne avant le printemps.",
    digitalHabits:
      "Beaucoup d’instituts utilisent Planity ou Treatwell pour l’agenda, parfois un logiciel de caisse avec réservation. Les prothésistes ongulaires et les esthéticiennes à domicile vivent surtout sur Instagram et prennent les rendez-vous par message privé ou WhatsApp. Facebook sert à annoncer les promotions et les fermetures. La fiche Google existe en général, mais la carte des soins, les tarifs, le lien de réservation et les photos récentes manquent souvent. Les cartes cadeaux sont encore vendues au comptoir, rarement en ligne. Les avis Google sont peu nombreux par rapport à la clientèle réelle.",
  },

  offers: {
    priority: [
      {
        offer: "site-vitrine",
        pitch:
          "Votre carte de soins claire, avec les tarifs, les photos de la cabine et un bouton pour réserver. Les clientes ne vous posent plus dix fois la même question, et celles qui hésitaient entre deux instituts voient tout de suite ce que vous proposez.",
      },
      {
        offer: "fidelite",
        pitch:
          "Fini la carte en carton oubliée dans un autre sac. La carte est dans le téléphone de la cliente, et quand elle n’est pas revenue depuis six semaines pour son remplissage, elle reçoit un petit rappel. Et le jour où vous avez un trou dans l’agenda, vous prévenez vos fidèles.",
      },
      {
        offer: "reseaux-sociaux",
        pitch:
          "Vos poses et vos soins sont beaux, mais vous n’avez pas le temps de les prendre en photo entre deux clientes. On passe une fois par mois, on photographie, on publie à votre place, et votre Instagram donne envie sans vous prendre vos soirées.",
      },
    ],
    entry: [
      {
        offer: "fiche-google",
        pitch:
          "On remet votre fiche Google à niveau : les bons soins dans les bonnes catégories, les horaires, les photos de la cabine, le lien de réservation. C’est ce que voit la cliente qui tape « institut de beauté {ville} » avant même d’ouvrir Instagram.",
      },
      {
        offer: "nfc-avis",
        pitch:
          "À la fin du soin, la cliente est détendue et contente : c’est le moment. Elle pose son téléphone sur la petite carte à l’accueil et laisse son avis en quelques secondes, sans que vous ayez à insister.",
      },
    ],
    upsell:
      "Après la fiche Google et la carte d’avis, la suite logique est la carte de fidélité digitale, qui relance les clientes au bon moment (remplissage, épilation, soin de saison). Ensuite, le site vitrine avec la carte des soins et la vente de cartes cadeaux en ligne, très utile avant Noël et la fête des mères. Pour les instituts qui reçoivent beaucoup de messages, l’assistant qui répond sur Instagram et WhatsApp, et pour celles qui veulent grandir, la gestion des réseaux sociaux.",
  },

  timing: {
    best: [
      {
        label: "Début d’après-midi en semaine",
        days: [2, 3, 4],
        from: "13:30",
        to: "15:00",
        why: "Après le rush du midi et avant les clientes de fin de journée : c’est souvent le seul creux de l’institut.",
      },
      {
        label: "Milieu de matinée, mardi et mercredi",
        days: [2, 3],
        from: "10:00",
        to: "11:30",
        why: "Début de semaine plus calme, parfois un soin annulé qui libère un moment.",
      },
      {
        label: "Lundi après-midi (si ouvert)",
        days: [1],
        from: "14:00",
        to: "16:00",
        why: "Les instituts ouverts le lundi ont rarement un planning plein ce jour-là.",
      },
    ],
    avoid: [
      {
        label: "Samedi, toute la journée",
        days: [6],
        from: "09:00",
        to: "19:00",
        why: "Journée la plus chargée de la semaine : cabines pleines, accueil débordé.",
      },
      {
        label: "Veilles de fêtes et période de décembre",
        from: "09:00",
        to: "19:30",
        why: "Avant Noël, la Saint-Valentin, la fête des mères ou les mariages, l’institut vend et soigne à flux tendu : vous seriez de trop.",
      },
      {
        label: "Pause déjeuner",
        days: [2, 3, 4, 5],
        from: "12:00",
        to: "13:30",
        why: "Les actives viennent pour un soin express sur leur pause : c’est un moment de rush court mais intense.",
      },
      {
        label: "Fin de journée",
        days: [2, 3, 4, 5],
        from: "17:00",
        to: "19:30",
        why: "Rendez-vous des femmes qui sortent du travail, puis ménage des cabines et caisse.",
      },
    ],
    usuallyClosed: [0, 1],
    phoneNote:
      "Appelez le fixe de l’institut en début d’après-midi. Si la gérante est en cabine, personne ne décrochera : ne laissez pas un long message, rappelez plutôt entre deux soins, à l’heure pile ou à la demi-heure, quand les soins se terminent. Pour une esthéticienne à domicile ou une prothésiste qui travaille seule, un SMS court pour demander un moment d’appel est souvent mieux reçu qu’un appel en plein soin.",
    seasonNote:
      "Meilleure période : janvier-février, puis septembre-octobre, quand l’agenda a de la place. Éviter décembre, les deux semaines avant la fête des mères et le cœur de la saison des mariages (mai-juin). En été sur le littoral, privilégier le début d’après-midi en semaine et rester très bref.",
  },

  scripts: {
    physique: {
      id: "beaute-physique",
      title: "Visite en institut",
      channel: "physique",
      duration: "3 à 6 min (ou 30 s + retour à heure fixe)",
      steps: [
        {
          id: "entree",
          title: "Entrée et repérage du décisionnaire",
          goal: "Savoir si la gérante est disponible ou en cabine, sans gêner les clientes en attente.",
          lines: [
            "Bonjour ! Je ne veux pas vous déranger pendant un soin.",
            "Je suis {prenom}, de MJAGENCY, une agence de Sète. C’est vous la responsable de l’institut ?",
            "Si vous êtes en cabine, pas de souci : à quelle heure votre soin se termine ? Je peux repasser.",
          ],
          tip:
            "Parlez doucement : dans un institut, l’ambiance est calme et les cabines entendent tout. Regardez l’accueil (carte de fidélité en carton, affichette Planity, présentoir de produits, carte cadeau) pour préparer votre constat.",
          branches: [
            {
              if: "Une employée vous répond que la gérante est en soin",
              then: "Merci beaucoup. Elle a un moment entre deux clientes cet après-midi ? Je repasse à l’heure qu’elle préfère, juste cinq minutes.",
            },
            {
              if: "La gérante est en train de faire une pose d’ongles à l’accueil, mains prises",
              then: "Continuez, surtout, je ne vous demande pas de vous arrêter. Je vous explique en une minute pendant que vous travaillez, et si ça vous parle, on trouve un moment plus calme.",
            },
            {
              if: "Des clientes attendent à l’accueil",
              then: "Vous avez du monde, je ne vais pas vous retenir. Je vous laisse ma carte et je repasse mardi en début d’après-midi, ça vous va ?",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche (10 secondes)",
          goal: "Poser en une phrase le problème qu’elle vit tous les jours.",
          lines: [
            "On aide les instituts du coin à ne plus perdre les clientes qui appellent pendant qu’on est en cabine.",
            "Et à faire revenir les clientes au bon moment, sans passer ses soirées sur Instagram.",
            "Je ne viens rien vous vendre aujourd’hui : j’ai juste remarqué deux petites choses sur votre fiche Google en préparant ma tournée.",
          ],
          tip:
            "Le ton est doux et professionnel, jamais insistant. Vous êtes dans un lieu de détente : une voix posée vaut mieux qu’un discours rapide.",
        },
        {
          id: "constat",
          title: "Observation et constat personnalisé",
          goal: "Montrer un point précis et visible sur sa présence en ligne ou dans l’institut.",
          lines: [
            "Quand je tape « institut de beauté {ville} », vous êtes bien là, mais on ne voit ni vos soins ni vos tarifs sur la fiche.",
            "Vous avez de très bons avis, mais les derniers datent un peu, et personne n’y a répondu.",
            "Je vois votre carte de fidélité en carton à l’accueil : vos clientes pensent à la garder sur elles ?",
            "Sur Instagram, vos poses sont très belles, mais la dernière date de plusieurs semaines.",
          ],
          tip:
            "Choisissez un ou deux constats, pas plus. Un compliment sincère avant le point faible : une esthéticienne est très attentive à l’image, elle entendra mieux une remarque si elle sent que vous avez vu la qualité de son travail.",
          branches: [
            {
              if: "Elle répond « je sais, je n’ai pas le temps »",
              then: "C’est normal, vous passez vos journées en cabine. C’est justement ce qu’on peut prendre en charge à votre place.",
            },
            {
              if: "Sa présence en ligne est déjà très soignée",
              then: "Honnêtement, c’est une des fiches les mieux tenues que j’ai vues. Et les clientes qui écrivent le soir sur Instagram, vous arrivez à leur répondre vite ?",
            },
          ],
        },
        {
          id: "question",
          title: "La question qui fait parler",
          goal: "La faire parler de ses appels manqués, de ses messages du soir ou de ses clientes qui ne reviennent pas.",
          lines: [
            "Quand vous êtes en soin et que le téléphone sonne, qui décroche ?",
            "Les messages Instagram pour prendre rendez-vous, vous y répondez à quel moment de la journée ?",
            "Vos clientes d’épilation ou de remplissage, elles reviennent d’elles-mêmes au bon moment, ou il faut parfois les relancer ?",
          ],
          tip:
            "Laissez-la raconter. Si elle parle des soirées passées à répondre aux messages, vous tenez la vraie douleur : ne coupez pas pour proposer tout de suite une solution.",
          branches: [
            {
              if: "Elle parle des messages du soir",
              then: "Ça représente combien de temps par soir, à peu près ? Il y a des façons simples de répondre aux questions de base à votre place, on pourra le regarder ensemble.",
            },
            {
              if: "Elle parle des clientes qui ne reviennent pas",
              then: "Vous savez aujourd’hui qui ne s’est pas présentée depuis deux ou trois mois ? C’est souvent là qu’on récupère le plus facilement de l’activité.",
            },
            {
              if: "Elle parle des lapins",
              then: "Sur un soin d’une heure, c’est dur. Un rappel automatique la veille règle déjà la plupart des oublis, sans avoir à parler d’acompte.",
            },
          ],
        },
        {
          id: "sortie",
          title: "Sortie avec micro-engagement",
          goal: "Repartir avec un rendez-vous de 20 minutes, un numéro direct ou un accord pour l’audit gratuit.",
          lines: [
            "Je vous propose de vous préparer un état des lieux gratuit : votre fiche Google, vos avis, votre Instagram, comparés à deux ou trois instituts du coin.",
            "Je vous le présente en vingt minutes, dans un creux. Mardi à 14 h ou jeudi à 13 h 30, qu’est-ce qui vous arrange ?",
            "Je vous laisse ma carte. Vous avez un numéro où je peux vous envoyer un texto de confirmation ?",
            "Merci pour votre accueil, et bon soin !",
          ],
          tip:
            "Notez tout de suite dans l’app le créneau, le prénom de la gérante et le constat que vous avez fait : c’est ce que vous reprendrez en ouvrant le rendez-vous.",
          branches: [
            {
              if: "Elle dit « je vais réfléchir »",
              then: "Bien sûr. Pour que vous ayez quelque chose de concret à regarder, je vous prépare l’état des lieux quand même, et je passe vous le montrer mardi à 14 h. Si ça ne vous parle pas, on en reste là.",
            },
            {
              if: "Elle accepte l’audit",
              then: "Parfait, je note jeudi 13 h 30. Si une cliente se rajoute sur ce créneau, envoyez-moi juste un texto, je m’adapte.",
            },
          ],
        },
      ],
    },
    telephone: {
      id: "beaute-telephone",
      title: "Appel à l’institut",
      channel: "telephone",
      duration: "1 à 3 min",
      steps: [
        {
          id: "ouverture",
          title: "Ouverture",
          goal: "Se présenter clairement et respecter le fait qu’elle est peut-être entre deux soins.",
          lines: [
            "Bonjour, {commerce} ? Je suis {prenom}, de MJAGENCY, une agence de Sète.",
            "Vous êtes entre deux clientes, je vous prends une minute, ou je rappelle plus tard ?",
          ],
          tip:
            "Voix calme, rythme posé. Si elle répond « c’est pour un rendez-vous ? », dites tout de suite que non, sans détour : elle appréciera la franchise.",
          branches: [
            {
              if: "Elle a une cliente qui attend",
              then: "Je ne vous retiens pas. À quelle heure votre prochain soin se termine ? Je rappelle pile à ce moment-là.",
            },
          ],
        },
        {
          id: "barrage",
          title: "Passer le barrage (employée, accueil)",
          goal: "Obtenir le nom de la gérante et l’heure où elle sort de cabine.",
          lines: [
            "C’est bien {dirigeant} qui s’occupe de l’institut ? Je voulais lui parler deux minutes de votre fiche Google.",
            "Elle est en cabine jusqu’à quelle heure, à peu près ?",
            "Merci beaucoup. Je rappelle à ce moment-là, vous pouvez lui dire que {prenom} a appelé ?",
          ],
          tip:
            "Retenez le prénom de l’employée et utilisez-le au prochain appel : dans un petit institut, c’est elle qui décide si le message passe.",
          branches: [
            {
              if: "On vous répond « elle ne prend pas ce genre d’appel »",
              then: "Je comprends tout à fait. Je ne vends rien au téléphone, je voulais juste lui proposer de lui montrer sa fiche Google. Je peux lui laisser un texto avec mon nom, pour qu’elle décide elle-même ?",
            },
          ],
        },
        {
          id: "accroche",
          title: "Accroche",
          goal: "Donner une raison concrète de continuer, liée à son institut.",
          lines: [
            "Je travaille avec des commerces du Bassin de Thau, et j’ai regardé votre fiche Google en préparant mes visites à {ville}.",
            "Vous avez de très bons avis, mais vos soins et vos tarifs n’apparaissent pas, et je pense que vous perdez des clientes qui cherchent le soir sur leur téléphone. Je peux vous expliquer en une minute ?",
          ],
        },
        {
          id: "decouverte",
          title: "Découverte courte",
          goal: "Deux questions pour confirmer la douleur, sans entrer dans le détail.",
          lines: [
            "Aujourd’hui, vos clientes réservent plutôt par téléphone, par Planity, ou par Instagram ?",
            "Et quand vous êtes en cabine, qui répond au téléphone et aux messages ?",
            "Vous avez une carte de fidélité aujourd’hui ? Elle fonctionne bien ?",
          ],
          tip:
            "Ne cherchez pas à tout savoir au téléphone. Deux réponses suffisent pour justifier le rendez-vous.",
          branches: [
            {
              if: "Elle demande le prix",
              then: "Je préfère ne pas vous donner un prix au hasard : tout dépend de ce qui vous manque vraiment. C’est justement ce qu’on regarde en vingt minutes, et l’état des lieux, lui, est gratuit.",
            },
          ],
        },
        {
          id: "rdv",
          title: "Proposition de rendez-vous (2 créneaux)",
          goal: "Obtenir un rendez-vous de 20 minutes à l’institut, dans un creux.",
          lines: [
            "Le plus simple, c’est que je passe vous montrer ce que j’ai vu, sur mon téléphone, en vingt minutes. C’est gratuit et sans engagement.",
            "Je peux venir mardi à 14 h, ou jeudi à 13 h 30, avant vos rendez-vous de l’après-midi. Qu’est-ce qui vous convient le mieux ?",
          ],
          branches: [
            {
              if: "Aucun des deux créneaux ne va",
              then: "Pas de souci, dites-moi votre moment le plus calme de la semaine prochaine, je m’adapte à votre agenda.",
            },
            {
              if: "Elle travaille à domicile et n’a pas de local",
              then: "Aucun problème, on peut se retrouver dans un café à {ville}, ou je vous appelle en visio vingt minutes. Mardi 14 h ou jeudi 13 h 30 ?",
            },
          ],
        },
        {
          id: "conclusion",
          title: "Conclusion et confirmation",
          goal: "Confirmer le rendez-vous et laisser une porte de sortie simple.",
          lines: [
            "Parfait, je note mardi à 14 h, à l’institut, avec {dirigeant}.",
            "Je vous envoie un texto de confirmation. Si une cliente se rajoute, répondez simplement au message et on décale.",
            "Merci beaucoup, et bonne fin de journée !",
          ],
          tip:
            "Texto dans les cinq minutes, rappel la veille. Montrez par l’exemple ce que vous allez lui proposer pour ses propres clientes.",
        },
      ],
    },
  },

  discovery: [
    {
      type: "S",
      question: "Aujourd’hui, comment vos clientes prennent rendez-vous : téléphone, Planity, Instagram, WhatsApp ?",
      why: "Savoir d’où viennent les demandes et quels outils sont déjà en place.",
    },
    {
      type: "S",
      question: "Quels sont les soins qui vous font le plus travailler, et ceux que vous aimeriez vendre davantage ?",
      why: "Identifier ce qu’il faut mettre en avant en ligne (et les soins à forte valeur à développer).",
    },
    {
      type: "P",
      question: "Pendant un soin d’une heure, qu’est-ce qui se passe avec le téléphone et les messages ?",
      why: "Faire décrire la perte d’appels et le travail du soir, avec ses propres mots.",
    },
    {
      type: "P",
      question: "Vos clientes de remplissage ou d’épilation, elles reviennent toutes au bon rythme, ou certaines disparaissent sans que vous sachiez pourquoi ?",
      why: "Faire émerger la perte silencieuse de clientes régulières.",
    },
    {
      type: "I",
      question: "Le temps passé le soir à répondre aux messages, ça vous prend combien d’heures par semaine, et qu’est-ce que vous en feriez sinon ?",
      why: "Lui faire mesurer le coût personnel de la situation (fatigue, famille, soirées).",
    },
    {
      type: "I",
      question: "Une cliente qui venait tous les mois et qui ne revient plus, sur une année, qu’est-ce que ça représente pour l’institut ?",
      why: "Transformer une impression vague en perte concrète, qu’elle calcule elle-même.",
    },
    {
      type: "N",
      question: "Si vos clientes recevaient un petit rappel au moment de leur remplissage, et que vous n’aviez plus à répondre aux mêmes questions le soir, qu’est-ce que ça changerait pour vous ?",
      why: "La faire formuler le bénéfice : du temps récupéré et un agenda plus régulier.",
    },
  ],

  objections: [
    {
      id: "deja-quelquun",
      objection: "J’ai déjà quelqu’un qui gère ma communication.",
      hidden: "Souvent une amie ou une connaissance, parfois une agence déjà payée ; elle ne veut pas remettre en cause un choix fait ni froisser quelqu’un.",
      accueillir: "Très bien, c’est rare qu’un institut soit déjà accompagné, vous avez de l’avance.",
      questionner: "Cette personne s’occupe de quoi exactement : Instagram, Google, les avis, la fidélité ? Et vous en êtes satisfaite sur tout ?",
      recadrer: "Je ne viens pas prendre la place de quelqu’un qui fait bien son travail. Souvent, un morceau reste de côté, comme la fiche Google ou la relance des clientes : c’est là que je peux compléter.",
      proposer: "Je vous prépare l’état des lieux gratuit, et si tout est couvert, je vous le dirai honnêtement. Mardi 14 h ou jeudi 13 h 30 ?",
    },
    {
      id: "pas-le-temps",
      objection: "Je n’ai vraiment pas le temps, j’enchaîne les clientes.",
      hidden: "Elle est réellement débordée ; elle craint aussi qu’un nouveau projet lui prenne ses rares moments libres.",
      accueillir: "Je le vois bien, et je ne veux surtout pas vous retarder.",
      questionner: "C’est quoi votre moment le plus calme de la semaine, en général ?",
      recadrer: "Justement, ce que je vous propose, c’est de vous rendre du temps : moins de messages le soir, moins d’appels pendant les soins. Mais pour ça, il faut vingt minutes au départ.",
      proposer: "Je passe vingt minutes dans votre creux, mardi à 14 h ou jeudi à 13 h 30. Lequel je note ?",
    },
    {
      id: "trop-cher",
      objection: "C’est trop cher pour un petit institut comme le mien.",
      hidden: "Elle a peur d’un engagement mensuel sans retour, ou elle a déjà payé une plateforme ou un site qui n’a rien apporté.",
      accueillir: "Je comprends, entre les produits, le matériel et le loyer, chaque dépense compte.",
      questionner: "Qu’est-ce que vous avez déjà essayé qui ne vous a pas servi ? Et une cliente fidèle qui vient tous les mois, elle représente quoi sur une année ?",
      recadrer: "L’idée n’est pas d’ajouter une charge, c’est que ça vous ramène plus de clientes que ça ne coûte. Si ce n’est pas le cas pour vous, je vous le dirai franchement.",
      proposer: "On peut commencer par la fiche Google ou la carte d’avis, des petits montants qu’on peut étaler. Et l’audit est gratuit : je vous le montre mardi à 14 h ?",
    },
    {
      id: "amie",
      objection: "Une amie me fait mes visuels et mon Instagram, ça me suffit.",
      hidden: "Elle ne veut pas vexer son amie, et c’est gratuit ; mais l’amie n’a pas toujours le temps.",
      accueillir: "C’est précieux d’avoir une amie qui vous aide, surtout quand elle a du goût.",
      questionner: "Elle passe à l’institut régulièrement pour les photos ? Et votre fiche Google, elle s’en occupe aussi ?",
      recadrer: "En général, le souci n’est pas le talent, c’est la régularité, et la partie Google, que personne ne voit mais que toutes les nouvelles clientes consultent.",
      proposer: "Je vous fais l’état des lieux gratuit, et vous pourrez même le partager avec elle. Mardi 14 h ou jeudi 13 h 30 ?",
    },
    {
      id: "instagram-suffit",
      objection: "Instagram me suffit, toutes mes clientes me trouvent là-dessus.",
      hidden: "Instagram fonctionne pour ses clientes actuelles ; elle ne voit pas celles qui cherchent sur Google et ne la trouvent pas.",
      accueillir: "C’est vrai, dans la beauté, Instagram c’est la vitrine, et vos photos le montrent.",
      questionner: "Une vacancière qui cherche une manucure à {ville} en août, ou une curiste qui veut un modelage, elle tape quoi, à votre avis ?",
      recadrer: "Instagram, c’est pour celles qui vous suivent déjà. Celles qui cherchent un institut près d’elles passent par Google Maps, et elles choisissent sur les avis, les tarifs et les photos, en quelques secondes.",
      proposer: "Je vous montre ce qu’elles voient vraiment quand elles vous cherchent, en vingt minutes. Mardi 14 h ou jeudi 13 h 30 ?",
    },
    {
      id: "bouche-a-oreille",
      objection: "Mes clientes viennent par le bouche-à-oreille, je n’ai pas besoin de plus.",
      hidden: "Elle en est fière, à raison ; elle ne veut pas donner l’impression que l’institut a besoin d’aide.",
      accueillir: "C’est le plus beau compliment pour un institut, ça veut dire que vous travaillez bien.",
      questionner: "Quand une amie de votre cliente entend parler de vous, qu’est-ce qu’elle fait avant de réserver, d’après vous ?",
      recadrer: "Aujourd’hui, le bouche-à-oreille passe presque toujours par une recherche : on tape votre nom, on regarde les avis et les tarifs. Si elle ne trouve pas ce qu’elle cherche, la recommandation se perd.",
      proposer: "La carte d’avis à l’accueil, c’est justement votre bouche-à-oreille rendu visible. Je vous en montre une mardi à 14 h ou jeudi à 13 h 30 ?",
    },
    {
      id: "rappelez-moi",
      objection: "Rappelez-moi plus tard, ou envoyez-moi quelque chose par mail.",
      hidden: "Une façon polie de clore l’échange ; le mail sera lu tard le soir, ou jamais.",
      accueillir: "Bien sûr, je comprends que ce ne soit pas le moment.",
      questionner: "Le soir, après vos rendez-vous, vous avez vraiment le temps de lire vos mails ?",
      recadrer: "Ce que je veux vous montrer, c’est votre propre fiche sur un téléphone : en vrai, c’est beaucoup plus parlant qu’un document, et ça prend vingt minutes.",
      proposer: "Je vous envoie un texto avec mes coordonnées, et on fixe un moment court : mardi 14 h ou jeudi 13 h 30 ? Si ça ne vous parle pas, on s’arrête là.",
    },
    {
      id: "planity-treatwell",
      objection: "Je suis déjà sur Planity, les clientes réservent toutes seules.",
      hidden: "Elle paie déjà un abonnement et pense que tout le digital est couvert ; elle craint de payer deux fois la même chose.",
      accueillir: "Très bien, c’est pratique pour l’agenda et vos clientes ont l’habitude.",
      questionner: "Et les clientes qui écrivent sur Instagram ou qui appellent pendant vos soins, qui leur répond ? Et votre fichier de clientes, vous vous en servez pour les faire revenir ?",
      recadrer: "La plateforme gère les réservations, mais pas votre fiche Google, vos avis, ni la relance de vos fidèles au bon moment. Et sur la plateforme, d’autres instituts sont proposés à côté du vôtre : vos avis et votre fidélité, eux, sont à vous.",
      proposer: "On ne touche pas à votre agenda, on complète autour. Je vous montre ce qui manque en vingt minutes, mardi 14 h ou jeudi 13 h 30 ?",
    },
  ],

  proofs: [
    "En général, une cliente qui cherche un nouvel institut regarde les avis, les photos et les tarifs sur Google avant de réserver.",
    "C’est ce qu’on voit souvent : les clientes satisfaites ne pensent pas à laisser un avis, sauf si on leur propose au bon moment, à la fin du soin, avec un moyen très simple.",
    "Une cliente qui ne trouve pas les tarifs en ligne a tendance à passer à l’institut suivant plutôt que d’appeler pour demander.",
    "Les soins réguliers (épilation, remplissage, semi-permanent) se prêtent très bien aux rappels : la plupart des clientes qui décrochent ont simplement oublié.",
    "Une carte de fidélité dans le téléphone ne se perd pas, contrairement au carton qui reste dans un autre sac.",
    "Pour les estivantes et les curistes de Balaruc, Google Maps est souvent le seul moyen de trouver un institut : elles ne connaissent personne sur place.",
  ],

  buyingSignals: [
    "Elle sort de cabine exprès pour vous écouter, ou demande à une collègue de finir la pose.",
    "Elle vous montre sa fiche Google ou son Instagram sur son téléphone, en disant « je sais, c’est pas à jour ».",
    "Elle raconte spontanément ses soirées à répondre aux messages ou un lapin récent sur un soin long.",
    "Elle demande comment fonctionne la carte de fidélité dans le téléphone, ou si ses clientes âgées sauront l’utiliser.",
    "Elle parle d’une concurrente précise qui « a plein d’avis » ou qui vient d’ouvrir.",
    "Elle demande si l’on peut vendre des cartes cadeaux en ligne avant Noël ou la fête des mères.",
    "Elle regarde son agenda pour vous proposer elle-même un créneau.",
  ],

  research: {
    platforms: ["Google (fiche d’établissement)", "Planity", "Treatwell", "Instagram", "Facebook", "PagesJaunes", "TikTok"],
    questions: [
      "La fiche Google affiche-t-elle la carte des soins, les tarifs, les horaires à jour et un lien de réservation direct ?",
      "Combien d’avis Google, quelle note, quand date le dernier, et la gérante répond-elle aux avis ?",
      "L’institut est-il présent sur Planity ou Treatwell, et quels instituts concurrents sont proposés à côté sur ces plateformes à {ville} ?",
      "Quels sont les deux ou trois instituts ou ongleries qui apparaissent avant lui sur « institut de beauté {ville} » ou « onglerie {ville} » ?",
      "Le compte Instagram montre-t-il des réalisations récentes (poses, sourcils, soins), et à quelle fréquence publie-t-il ?",
      "L’institut a-t-il un site, avec la carte des soins, les tarifs et la vente de cartes cadeaux en ligne ?",
      "Les avis mentionnent-ils des difficultés à joindre l’institut, des retards, ou au contraire des points forts à mettre en avant (accueil, hygiène, douceur) ?",
      "L’institut a-t-il une spécialité ou une marque de soins distinctive qui mériterait d’être plus visible en ligne ?",
      "S’agit-il d’une esthéticienne seule, à domicile ou en local, ou d’une équipe avec plusieurs cabines ?",
    ],
  },

  pitch30s:
    "Bonjour, je suis {prenom}, de MJAGENCY, à Sète. On aide les instituts du coin à ne plus perdre les clientes qui appellent pendant les soins, et à faire revenir les habituées au bon moment. J’ai regardé votre fiche Google : de très bons avis, mais on ne voit ni vos soins ni vos tarifs. Je vous propose un état des lieux gratuit, vingt minutes, dans un creux de votre agenda. Mardi 14 h ou jeudi 13 h 30, qu’est-ce qui vous arrange ?",
};

export default sheet;
