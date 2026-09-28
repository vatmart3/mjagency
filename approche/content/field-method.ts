/**
 * Méthode terrain : le porte-à-porte chez les commerçants du Bassin de Thau.
 * Tout ce qu’il faut pour préparer sa tournée, mener une visite de 2 minutes,
 * gérer les imprévus et débriefer à chaud.
 */

export interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  group: "tenue" | "materiel" | "preparation";
}

export const checklist: ChecklistItem[] = [
  {
    id: "tenue-propre",
    label: "Tenue soignée, sans être déguisé",
    detail:
      "Chemise ou polo propre, pantalon correct, chaussures confortables et propres. Pas de costume-cravate : chez un poissonnier de Sète, vous passeriez pour un banquier. L’idée, c’est d’avoir l’air sérieux et abordable.",
    group: "tenue",
  },
  {
    id: "tenue-badge",
    label: "Logo MJAGENCY visible",
    detail:
      "Un polo brodé ou un badge discret. Le commerçant doit comprendre en une seconde que vous êtes une entreprise d’ici, pas un démarcheur anonyme.",
    group: "tenue",
  },
  {
    id: "tenue-mains",
    label: "Mains libres, pas de sac encombrant",
    detail:
      "Une sacoche légère en bandoulière. Les mains libres pour saluer, tendre une carte ou montrer le téléphone. On n’entre jamais avec un café ou une cigarette à la main.",
    group: "tenue",
  },
  {
    id: "cartes-visite",
    label: "Cartes de visite (au moins 30)",
    detail:
      "Rangées dans un porte-cartes, pas cornées au fond d’une poche. Écrivez au dos, devant le commerçant, ce que vous avez remarqué chez lui : il la garde plus volontiers.",
    group: "materiel",
  },
  {
    id: "telephone-realisations",
    label: "Téléphone chargé, 2 ou 3 réalisations prêtes",
    detail:
      "Ouvertes dans des onglets ou en favoris, pour les montrer en 2 secondes sans chercher. Idéalement une réalisation proche du métier de la journée (restaurant, commerce, artisan). Luminosité à fond, mode avion désactivé, notifications coupées.",
    group: "materiel",
  },
  {
    id: "demo-nfc",
    label: "Carte NFC d’avis de démonstration",
    detail:
      "Testée le matin même sur un iPhone et un Android. On la fait essayer au commerçant avec son propre téléphone : c’est souvent le moment où la conversation démarre vraiment.",
    group: "materiel",
  },
  {
    id: "flyer-audit",
    label: "Flyers avec QR code vers l’audit gratuit",
    detail:
      "Une quinzaine, pour les commerçants absents ou débordés. Vérifiez que le QR code s’ouvre bien et que le lien mène à la bonne page. Un flyer ne remplace jamais une conversation : c’est une porte de sortie, pas un objectif.",
    group: "materiel",
  },
  {
    id: "batterie-externe",
    label: "Batterie externe et câble",
    detail:
      "L’app, les photos, la démo et le GPS vident la batterie avant midi. Un téléphone à 5 % au moment de montrer une réalisation, c’est une visite gâchée.",
    group: "materiel",
  },
  {
    id: "carnet-stylo",
    label: "Petit carnet et stylo qui écrit",
    detail:
      "Pour noter devant le commerçant son nom, son créneau préféré ou ce qu’il vient de dire. Prendre des notes montre qu’on l’écoute. Le débrief complet se fait ensuite dans l’app.",
    group: "materiel",
  },
  {
    id: "eau-pause",
    label: "Eau et quelque chose à grignoter",
    detail:
      "En été sur le littoral, la chaleur use vite. Un vendeur fatigué et assoiffé perd son sourire vers la dixième visite, et le commerçant le sent.",
    group: "materiel",
  },
  {
    id: "fiche-prospects",
    label: "Fiche des prospects du jour relue",
    detail:
      "Pour chaque commerce : nom du gérant s’il est connu, note Google et nombre d’avis, état du site, dernière visite ou dernier appel. Deux minutes de lecture la veille évitent les questions bêtes sur place.",
    group: "preparation",
  },
  {
    id: "itineraire",
    label: "Itinéraire à pied préparé",
    detail:
      "Garez-vous une fois, puis enchaînez à pied rue par rue. Repérez le parking et les commerces voisins non listés : ils peuvent devenir des visites bonus.",
    group: "preparation",
  },
  {
    id: "horaires-secteur",
    label: "Créneaux calmes de chaque métier vérifiés",
    detail:
      "Pas de restaurant entre 11 h 45 et 14 h 30, pas de boulangerie à 8 h ni à 12 h 30, pas de coiffeur un samedi matin. Planifiez la tournée sur les creux, pas sur votre agenda.",
    group: "preparation",
  },
  {
    id: "objectif-jour",
    label: "Objectif du jour fixé et écrit",
    detail:
      "Un objectif chiffré sur ce que vous maîtrisez : par exemple 12 visites, 8 vraies conversations avec un décisionnaire, 2 rendez-vous ou audits. Le nombre de signatures ne se décide pas le matin.",
    group: "preparation",
  },
  {
    id: "agenda-creneaux",
    label: "Agenda ouvert, 4 créneaux libres repérés",
    detail:
      "Pour proposer tout de suite deux dates précises quand quelqu’un dit oui. Un « je vous rappelle pour fixer une date » fait perdre la moitié des rendez-vous.",
    group: "preparation",
  },
  {
    id: "etat-esprit",
    label: "État d’esprit : curieux, pas vendeur",
    detail:
      "Vous venez voir comment ça se passe chez eux et proposer un coup de main, pas placer un produit. Un refus concerne le moment, jamais vous. Relisez les règles d’or avant la première porte.",
    group: "preparation",
  },
];

export interface VisitStep {
  id: string;
  n: number;
  title: string;
  duration: string;
  goal: string;
  do: string[];
  say: string[];
  avoid: string[];
}

export const visitSteps: VisitStep[] = [
  {
    id: "entree",
    n: 1,
    title: "Entrée et repérage du décisionnaire",
    duration: "0 – 15 s",
    goal: "Entrer calmement, lire la situation et savoir à qui parler avant d’ouvrir la bouche pour vendre.",
    do: [
      "Regardez par la vitrine avant d’entrer : s’il y a une file ou un client en train de payer, attendez dehors ou revenez dans dix minutes.",
      "Entrez, souriez, dites bonjour à tout le monde, y compris à l’employé et aux clients.",
      "Repérez qui donne les consignes, qui est à la caisse, qui porte une tenue différente : c’est souvent le patron ou la patronne.",
      "Si vous avez le nom du gérant dans la fiche, demandez-le par son nom.",
    ],
    say: [
      "Bonjour ! Je voudrais voir le responsable, s’il est là. C’est rapide.",
      "Bonjour, c’est bien vous {dirigeant} ?",
      "Bonjour, je ne vous dérange pas longtemps, vous êtes le gérant ?",
    ],
    avoid: [
      "Entrer en plein coup de feu et attendre au milieu de la boutique.",
      "Commencer votre présentation à l’employé qui n’a aucun pouvoir de décision.",
      "Arriver téléphone à la main ou avec une pile de flyers bien visibles.",
      "Vous excuser trois fois d’être là : vous venez proposer un service, pas quémander.",
    ],
  },
  {
    id: "accroche",
    n: 2,
    title: "Accroche en 10 secondes",
    duration: "10 s",
    goal: "Dire qui vous êtes, que vous êtes d’ici, et pourquoi vous passez chez lui en particulier.",
    do: [
      "Présentez-vous avec votre prénom et MJAGENCY, en précisant que l’agence est à Sète.",
      "Donnez tout de suite la raison concrète de votre visite chez lui, pas une généralité.",
      "Annoncez la durée : deux minutes, et tenez-la.",
      "Tendez votre carte pendant que vous parlez : ça occupe les mains et ça rassure.",
    ],
    say: [
      "Je suis {prenom}, de MJAGENCY, on est une agence web ici à Sète. Je passe voir les commerces de la rue pour leur visibilité sur Google. Deux minutes, pas plus.",
      "{prenom}, de MJAGENCY à Sète. J’ai regardé votre fiche Google avant de venir et j’ai vu un ou deux trucs qui vous font sûrement perdre des clients. Je peux vous montrer ?",
      "Bonjour, {prenom}, MJAGENCY. On aide les commerçants du coin à se faire trouver sur internet. Je ne vous vends rien aujourd’hui, je voulais juste vous montrer un truc sur votre fiche.",
    ],
    avoid: [
      "Raconter l’histoire de l’agence ou votre parcours.",
      "Dire « je ne vous dérange pas ? » : ça appelle un « si ».",
      "Parler de site internet, de prix ou d’abonnement à ce stade.",
      "Réciter : si vous avez l’air de lire un texte, il décroche.",
    ],
  },
  {
    id: "constat",
    n: 3,
    title: "Observation et constat personnalisé",
    duration: "30 – 60 s",
    goal: "Montrer un fait concret sur SON commerce, qu’il peut vérifier lui-même, pour passer de « démarcheur » à « quelqu’un qui a regardé ».",
    do: [
      "Sortez votre téléphone avec sa fiche Google déjà ouverte et montrez-lui l’écran.",
      "Pointez un seul point précis : horaires faux, photos absentes ou vieilles, avis sans réponse, pas de site, pas de lien de réservation.",
      "Complimentez sincèrement quelque chose de vrai dans la boutique (la vitrine, l’accueil, un produit).",
      "Faites essayer la carte NFC d’avis s’il a peu d’avis : il tape sa carte sur son téléphone et voit le résultat.",
    ],
    say: [
      "Regardez, quand on tape votre nom sur Google, les horaires affichés disent que vous êtes fermé le lundi. C’est toujours le cas ?",
      "Vous avez une très bonne note sur Google, mais peu d’avis. Celui d’à côté en a beaucoup plus, et c’est souvent lui que les touristes choisissent quand ils comparent sur leur téléphone.",
      "Votre vitrine est superbe, mais sur Google il n’y a qu’une photo, et elle est floue. Les gens décident souvent sur les photos avant de se déplacer.",
      "Tenez, essayez avec votre téléphone : vous posez ça sur le comptoir, le client approche son téléphone, et il arrive direct sur la page pour laisser un avis.",
    ],
    avoid: [
      "Critiquer : on constate un fait, on ne juge pas son travail.",
      "Aligner cinq défauts d’un coup : un seul, bien choisi, suffit.",
      "Inventer un chiffre pour impressionner : restez sur ce qu’il voit à l’écran.",
      "Garder le téléphone dans votre main loin de lui : mettez l’écran sous ses yeux.",
    ],
  },
  {
    id: "question",
    n: 4,
    title: "La question qui fait parler",
    duration: "30 s – 2 min",
    goal: "Le faire parler de son activité, de ses clients et de ce qui l’embête, pour savoir s’il y a un vrai besoin.",
    do: [
      "Posez une question ouverte, puis taisez-vous vraiment, même si le silence dure.",
      "Écoutez ce qu’il dit de ses clients, de la saison, de ses soucis : c’est la matière du rendez-vous.",
      "Reformulez en une phrase ce qu’il vient de dire pour vérifier que vous avez compris.",
      "Notez le mot exact qu’il emploie pour son problème : vous le réutiliserez.",
    ],
    say: [
      "Aujourd’hui, vos nouveaux clients, ils vous trouvent comment, à votre avis ?",
      "Et l’été, avec les touristes, ça se passe comment pour vous ?",
      "Qu’est-ce qui vous prend le plus de temps en dehors de votre métier ?",
      "Si vous pouviez régler une seule chose côté clients cette année, ce serait quoi ?",
      "Si je comprends bien, le souci c’est surtout l’hiver, quand la clientèle de passage disparaît. C’est ça ?",
    ],
    avoid: [
      "Enchaîner avec votre argumentaire dès qu’il ouvre la bouche.",
      "Poser des questions fermées à la suite comme un questionnaire.",
      "Contredire sa vision de son propre commerce.",
      "Répondre à la question du prix en détail : renvoyez-la à l’audit.",
    ],
  },
  {
    id: "sortie",
    n: 5,
    title: "Sortie avec un micro-engagement",
    duration: "20 – 30 s",
    goal: "Repartir avec quelque chose de concret : un rendez-vous, un numéro direct, un créneau d’audit, ou au minimum l’accord pour repasser.",
    do: [
      "Proposez l’audit gratuit de 20 minutes avec deux créneaux précis, pas une question ouverte.",
      "S’il hésite, descendez d’une marche : son numéro direct, ou l’accord pour lui envoyer l’audit par SMS.",
      "Notez le créneau devant lui, remerciez, et partez avant qu’il ne s’impatiente.",
      "Faites le débrief dans l’app sur le trottoir, avant la visite suivante.",
    ],
    say: [
      "Je vous propose un petit audit gratuit, 20 minutes, je vous montre tout sur votre fiche et ce qu’on peut améliorer. Mardi 15 h ou jeudi 10 h 30, qu’est-ce qui vous arrange ?",
      "Je ne veux pas vous prendre plus de temps maintenant. Je peux vous envoyer l’audit par SMS ? Vous me donnez le bon numéro ?",
      "Pas de souci, je repasse. Quel est le moment le plus calme pour vous dans la semaine ?",
      "Merci pour votre accueil, {dirigeant}. Je note jeudi 10 h 30, je serai à l’heure.",
    ],
    avoid: [
      "Partir sur un vague « je repasserai un de ces jours ».",
      "Laisser juste une carte en espérant qu’il appelle.",
      "Rester dix minutes de plus parce que ça se passe bien : sortez sur une bonne note.",
      "Forcer un oui : un non franc aujourd’hui vaut mieux qu’un faux rendez-vous annulé.",
    ],
  },
];

export interface WhatIf {
  id: string;
  situation: string;
  read: string;
  do: string[];
  say: string;
}

export const whatIf: WhatIf[] = [
  {
    id: "gerant-absent",
    situation: "Si le gérant n’est pas là",
    read: "C’est le cas le plus fréquent. L’employé n’est pas un obstacle : c’est votre meilleur allié pour savoir quand revenir.",
    do: [
      "Demandez le prénom du gérant et le meilleur moment pour le trouver.",
      "Demandez le prénom de l’employé et notez-le : vous le saluerez par son prénom la prochaine fois.",
      "Laissez une carte avec un mot écrit au dos, adressé au gérant par son prénom.",
      "Programmez le « Repasser » dans l’app au créneau indiqué.",
    ],
    say: "Pas de souci. Vous pouvez me dire quand je peux le trouver tranquillement ? Et c’est quoi son prénom, que je le demande correctement la prochaine fois ?",
  },
  {
    id: "clients-presents",
    situation: "S’il y a des clients",
    read: "Le client passe toujours avant vous. Si vous le respectez, le commerçant le remarque et vous en sait gré.",
    do: [
      "Restez en retrait, près de la porte, sans regarder l’écran de caisse.",
      "S’il y a plus de deux clients, faites un signe et ressortez : revenez dans dix minutes.",
      "Quand le dernier client part, passez juste après, sans attendre qu’un autre entre.",
      "Si un client revient pendant votre échange, arrêtez-vous net et faites-lui signe de passer.",
    ],
    say: "Je vois que vous êtes occupé, occupez-vous de vos clients, je repasse dans dix minutes.",
  },
  {
    id: "recadre",
    situation: "Si on vous recadre : « On ne veut pas de démarcheurs »",
    read: "Il a déjà été harcelé par des vendeurs d’annuaires ou de publicités. Ce n’est pas contre vous, c’est une protection.",
    do: [
      "Ne vous justifiez pas longuement et ne discutez pas la règle.",
      "Montrez en une phrase que vous êtes d’ici et que vous ne restez pas.",
      "Laissez une carte seulement s’il l’accepte.",
      "Notez « Abandonner » ou « Relancer après la saison » selon le ton, et respectez-le.",
    ],
    say: "Je comprends très bien, vous devez en voir passer. Je suis d’ici, à Sète, je ne vous embête pas plus. Je vous laisse juste ma carte, si un jour vous avez une question sur Google. Bonne journée.",
  },
  {
    id: "repassez-plus-tard",
    situation: "S’il dit « repassez plus tard »",
    read: "Parfois c’est vrai, parfois c’est une façon polie de dire non. Un créneau précis fait la différence entre les deux.",
    do: [
      "Demandez un jour et une heure précis, pas « plus tard ».",
      "Répétez le créneau à voix haute et notez-le devant lui.",
      "Revenez exactement à ce moment-là : la ponctualité est votre meilleur argument.",
      "S’il reste vague deux fois de suite, proposez l’audit par SMS à la place.",
    ],
    say: "Avec plaisir. Plutôt demain en fin de matinée ou jeudi après-midi ? Je note et je reviens à l’heure pile.",
  },
  {
    id: "employe-repond",
    situation: "Si c’est un employé qui répond",
    read: "Il peut transmettre, ou oublier. Il faut lui donner envie de faire passer le message et savoir qui décide vraiment.",
    do: [
      "Soyez aussi aimable avec lui qu’avec le patron : il sera là la prochaine fois.",
      "Ne lui faites pas l’argumentaire complet, il ne pourra pas le restituer.",
      "Demandez qui s’occupe de la communication : parfois ce n’est pas le gérant mais la conjointe ou un associé.",
      "Obtenez un prénom et un moment, c’est tout.",
    ],
    say: "Merci. C’est qui qui s’occupe de Google, des avis, de tout ça chez vous ? Et je peux le trouver quand, sans le déranger ?",
  },
  {
    id: "gerant-telephone",
    situation: "Si le gérant est au téléphone",
    read: "Il ne peut pas vous écouter, mais il vous voit. Vous avez l’occasion de montrer que vous savez attendre.",
    do: [
      "Faites un petit signe de la main et reculez, sans lui mettre la pression du regard.",
      "Attendez une minute ou deux maximum en regardant la boutique.",
      "Si l’appel dure, posez votre carte sur le comptoir avec un mot et faites signe que vous repassez.",
      "Notez l’heure : il est peut-être plus disponible à ce moment-là un autre jour.",
    ],
    say: "Je vous laisse, je repasse dans la semaine. Je vous ai laissé ma carte, c’est pour votre fiche Google.",
  },
  {
    id: "laisser-plaquette",
    situation: "Si on vous demande de laisser une plaquette",
    read: "Souvent une façon de vous faire partir. Une plaquette seule finit dans un tiroir : il faut l’accrocher à un contact.",
    do: [
      "Laissez le flyer, mais demandez ce qui l’intéresserait le plus pour savoir quoi préparer.",
      "Demandez un numéro ou un créneau pour en reparler cinq minutes.",
      "Écrivez au dos un constat précis sur son commerce, à la main.",
      "Programmez un rappel à J+3, pas plus tard.",
    ],
    say: "Bien sûr, je vous la laisse. Je vous ai noté au dos ce que j’ai vu sur votre fiche. Je vous appelle jeudi pour savoir ce que vous en pensez, c’est quel numéro le plus simple ?",
  },
  {
    id: "agressif",
    situation: "S’il est agressif",
    read: "Mauvaise journée, mauvaise expérience passée ou simple tempérament. Ce n’est jamais le moment d’argumenter.",
    do: [
      "Restez calme, baissez le volume de votre voix, gardez le sourire.",
      "Ne répondez pas sur le fond, ne vous justifiez pas.",
      "Sortez tout de suite, poliment, en le remerciant.",
      "Notez l’attitude dans le débrief et laissez passer au moins trois mois, ou abandonnez.",
    ],
    say: "Je comprends, je ne vous dérange pas plus. Excusez-moi pour le dérangement, bonne fin de journée.",
  },
  {
    id: "ancien-prestataire",
    situation: "S’il parle de son ancien prestataire",
    read: "Il a payé pour un site qu’il ne peut pas modifier, ou un contrat qu’il n’arrivait pas à arrêter. C’est une vraie douleur, et une vraie ouverture.",
    do: [
      "Laissez-le raconter jusqu’au bout, sans l’interrompre.",
      "Ne dites jamais de mal du prestataire, même s’il en dit.",
      "Demandez ce qui lui a le plus manqué : c’est exactement ce qu’il faudra lui garantir.",
      "Rassurez sur les points concrets : vous êtes à Sète, joignables, et il reste propriétaire de ce qu’il paie.",
    ],
    say: "Je comprends, c’est une situation qu’on entend souvent. Qu’est-ce qui vous a le plus manqué avec eux ? Parce que c’est justement ce qu’on doit vous garantir si on travaille ensemble.",
  },
  {
    id: "pas-de-demarchage",
    situation: "Si la porte affiche « pas de démarchage »",
    read: "Le commerçant a posé sa règle. La respecter montre que vous êtes différent des autres.",
    do: [
      "N’entrez pas pour vendre. Point.",
      "Si vous êtes client (un café, un pain), vous pouvez acheter normalement, sans glisser d’argumentaire.",
      "Notez le commerce pour une prise de contact téléphonique ou par courrier, polie et une seule fois.",
      "Seulement si c’est lui qui vous interroge sur votre activité, répondez par la réplique ci-dessous, sans insister.",
    ],
    say: "J’ai vu votre affiche, je ne suis pas venu vous démarcher. Je travaille dans une agence web à Sète, voilà ma carte si un jour ça vous sert.",
  },
  {
    id: "deja-quelqu-un",
    situation: "S’il dit « j’ai déjà quelqu’un »",
    read: "Il est équipé, ou un proche s’en occupe. Inutile de dénigrer : proposez un regard extérieur gratuit.",
    do: [
      "Félicitez-le d’avoir déjà quelqu’un : il a pris le sujet au sérieux.",
      "Proposez l’audit comme un deuxième avis, sans engagement.",
      "Demandez s’il est satisfait des résultats, pas du prestataire.",
      "S’il est vraiment content, restez-en là et notez-le en « Relancer après la saison ».",
    ],
    say: "Très bien, c’est déjà une bonne chose. Et vous en êtes content, niveau appels et clients qui arrivent par Google ? Si un jour vous voulez un deuxième avis, l’audit est gratuit, ça ne vous engage à rien.",
  },
];

export const debriefObjections: string[] = [
  "Aucune objection",
  "Déjà équipé",
  "Un proche s’en occupe",
  "Pas le temps",
  "Trop cher",
  "Réseaux sociaux suffisent",
  "Bouche-à-oreille suffit",
  "Rappeler plus tard",
  "Pas décisionnaire",
  "Mauvaise expérience agence",
  "Pas prioritaire / saison",
  "Pas convaincu par internet",
  "Commerce en vente ou en fin d’activité",
  "Refus de parler",
];

export const nextActions: { id: string; label: string; defaultDelayDays: number }[] = [
  { id: "rappeler", label: "Rappeler", defaultDelayDays: 3 },
  { id: "repasser", label: "Repasser", defaultDelayDays: 7 },
  { id: "envoyer-audit", label: "Envoyer l’audit", defaultDelayDays: 1 },
  { id: "rdv-fixe", label: "RDV fixé", defaultDelayDays: 0 },
  { id: "envoyer-sms", label: "Envoyer SMS", defaultDelayDays: 0 },
  { id: "envoyer-realisations", label: "Envoyer réalisations", defaultDelayDays: 1 },
  { id: "relancer-saison", label: "Relancer après la saison", defaultDelayDays: 90 },
  { id: "abandonner", label: "Abandonner", defaultDelayDays: 0 },
];

export const fieldRules: string[] = [
  "Le client du commerçant passe toujours avant vous : s’il y a du monde, vous ressortez et vous revenez, sans soupirer.",
  "Vous ne vendez rien sur le pas de la porte : vous vendez l’audit gratuit de 20 minutes, rien de plus.",
  "Un seul constat précis sur son commerce, montré sur l’écran, vaut mieux que dix arguments sur le digital en général.",
  "Deux minutes annoncées, deux minutes tenues : c’est comme ça qu’on vous ouvre la porte la fois suivante.",
  "Posez votre question, puis taisez-vous : celui qui parle le plus pendant la visite doit être le commerçant.",
  "Ne repartez jamais sans un prochain pas précis : un créneau, un numéro, ou l’accord pour revenir un jour donné.",
  "Soyez aussi aimable avec l’employé qu’avec le patron : c’est lui qui décide si votre message arrive ou pas.",
  "Ne dites jamais de mal d’un concurrent ou d’un ancien prestataire, même quand le commerçant s’en charge pour vous.",
  "Un non est une réponse respectable : remerciez, notez-le, et ne revenez pas avant au moins trois mois.",
  "Débriefez chaque visite sur le trottoir, dans les 30 secondes : après trois commerces, tout se mélange.",
];

export const tourAdvice: string[] = [
  "Regroupez vos visites par rue ou par quartier et faites la tournée à pied : on se gare une fois, on enchaîne, on ne perd pas 15 minutes à chercher une place à chaque commerce.",
  "Commencez par un commerce « facile » (un contact déjà chaud, un commerçant sympathique) pour vous mettre en voix avant les visites plus difficiles.",
  "Calez la tournée sur les heures creuses des métiers visés : commerces et artisans en milieu de matinée, restaurants entre 15 h et 17 h 30, jamais pendant les coups de feu.",
  "Pas plus de 12 à 15 visites par demi-journée : au-delà, votre écoute baisse et les commerçants le sentent.",
  "Débriefez chaque visite dans l’app dans les 30 secondes, sur le trottoir, avant d’entrer dans le commerce suivant.",
  "Prévoyez 3 ou 4 commerces de réserve dans le même secteur pour remplacer ceux qui sont fermés ou débordés.",
  "Évitez juillet, août et les grosses semaines d’événements comme la Saint-Louis à Sète : les commerçants du littoral n’ont pas une minute. Visez plutôt l’automne et la fin d’hiver.",
];
