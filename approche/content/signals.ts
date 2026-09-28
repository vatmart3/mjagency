import type { Signal, NextLineRule, DiscProfile, Temperature } from "./types";
import { heatToTemperature } from "./thermometer";

/**
 * Lecture de l’attitude : on coche ce qu’on observe, l’app en déduit une
 * tendance de profil, une température et la meilleure phrase à dire ensuite.
 * Règles 100 % déterministes : mêmes signaux cochés = même réponse.
 *
 * On lit les signaux pour mieux servir le prospect et ne pas lui faire perdre
 * son temps, jamais pour le manipuler (voir ./ethics).
 */

/* ------------------------------------------------------------------ */
/* Signaux                                                             */
/* ------------------------------------------------------------------ */

export const signals: Signal[] = [
  /* --------------------------- Verbal ------------------------------ */
  { id: "demande-prix", label: "Demande le prix tout de suite", category: "verbal", disc: { fonceur: 3 }, heat: 1 },
  { id: "combien-par-mois", label: "Demande « c’est combien par mois ? »", category: "verbal", disc: { prudent: 2, analytique: 1 }, heat: 2 },
  { id: "ancien-prestataire", label: "Parle de son ancien prestataire", category: "verbal", disc: { prudent: 2, analytique: 1 }, heat: 0 },
  { id: "questions-delais", label: "Pose des questions sur les délais", category: "verbal", disc: { fonceur: 2, analytique: 1 }, heat: 2 },
  { id: "demande-exemples", label: "Demande des exemples de réalisations", category: "verbal", disc: { analytique: 2, prudent: 1 }, heat: 2 },
  { id: "deja-fait-le-coup", label: "Dit « on m’a déjà fait le coup »", category: "verbal", disc: { prudent: 3 }, heat: -1 },
  { id: "parle-famille", label: "Parle de sa famille, de son histoire", category: "verbal", disc: { relationnel: 3 }, heat: 1 },
  { id: "coupe-parole", label: "Vous coupe la parole", category: "verbal", disc: { fonceur: 3 }, heat: 0 },
  { id: "qui-etes-vous", label: "Demande qui vous êtes, depuis quand vous existez", category: "verbal", disc: { prudent: 2, analytique: 1 }, heat: 0 },
  { id: "compare-concurrent", label: "Compare avec un concurrent", category: "verbal", disc: { analytique: 2, fonceur: 1 }, heat: 1 },
  { id: "avis-negatifs", label: "Se plaint de ses avis négatifs", category: "verbal", disc: { relationnel: 1, fonceur: 1 }, heat: 2 },
  { id: "question-technique", label: "Pose une question technique précise", category: "verbal", disc: { analytique: 3 }, heat: 2 },
  { id: "doit-en-parler", label: "Dit « je dois en parler à… »", category: "verbal", disc: { prudent: 2, relationnel: 1 }, heat: 1 },
  { id: "demande-garantie", label: "Demande une garantie, un engagement", category: "verbal", disc: { prudent: 3 }, heat: 1 },
  { id: "budget-serre", label: "Parle de budget serré", category: "verbal", disc: { prudent: 2 }, heat: -1 },
  { id: "vous-etes-dou", label: "Demande « vous êtes d’où ? »", category: "verbal", disc: { relationnel: 2, prudent: 1 }, heat: 1 },
  { id: "etapes-concretes", label: "Demande les étapes concrètes", category: "verbal", disc: { analytique: 2, fonceur: 1 }, heat: 3 },
  { id: "reponse-tout-de-suite", label: "Veut une réponse tout de suite", category: "verbal", disc: { fonceur: 3 }, heat: 1 },
  { id: "c-est-interessant", label: "Dit « c’est intéressant »", category: "verbal", disc: { relationnel: 1 }, heat: 1 },
  { id: "monosyllabes", label: "Répond par monosyllabes", category: "verbal", disc: { prudent: 1, fonceur: 1 }, heat: -2 },
  { id: "pas-le-temps", label: "Dit « j’ai pas le temps »", category: "verbal", disc: { fonceur: 2 }, heat: -2 },
  { id: "on-commence-quand", label: "Demande « on commence quand ? »", category: "verbal", disc: { fonceur: 2 }, heat: 3 },

  /* ------------------------- Non-verbal ---------------------------- */
  { id: "regarde-montre", label: "Regarde sa montre", category: "non-verbal", disc: { fonceur: 2 }, heat: -1 },
  { id: "montre-telephone", label: "Vous montre quelque chose sur son téléphone", category: "non-verbal", disc: { relationnel: 2, fonceur: 1 }, heat: 2 },
  { id: "croise-bras", label: "Croise les bras", category: "non-verbal", disc: { prudent: 2 }, heat: -1 },
  { id: "sert-sans-regarder", label: "Continue à servir sans vous regarder", category: "non-verbal", disc: { fonceur: 1 }, heat: -2 },
  { id: "propose-cafe", label: "Vous propose un café ou de vous asseoir", category: "non-verbal", disc: { relationnel: 3 }, heat: 2 },
  { id: "range-carte", label: "Prend votre carte et la range soigneusement", category: "non-verbal", disc: { analytique: 2, prudent: 1 }, heat: 1 },
  { id: "prend-notes", label: "Prend des notes", category: "non-verbal", disc: { analytique: 3 }, heat: 2 },
  { id: "hoche-tete", label: "Hoche la tête, se penche en avant", category: "non-verbal", disc: { relationnel: 1 }, heat: 2 },
  { id: "reste-comptoir", label: "Recule ou reste derrière le comptoir", category: "non-verbal", disc: { prudent: 2 }, heat: -1 },
  { id: "sourit-plaisante", label: "Sourit, plaisante", category: "non-verbal", disc: { relationnel: 3 }, heat: 1 },
  { id: "montre-site", label: "Montre son site ou son Instagram spontanément", category: "non-verbal", disc: { relationnel: 1, fonceur: 1 }, heat: 2 },
  { id: "appelle-associe", label: "Appelle un associé ou son conjoint", category: "non-verbal", disc: { relationnel: 1, prudent: 1 }, heat: 2 },
  { id: "sort-agenda", label: "Sort son agenda pour caler une date", category: "non-verbal", disc: { fonceur: 1, analytique: 1 }, heat: 3 },

  /* ------------------------- Téléphone ----------------------------- */
  { id: "silence-long", label: "Silence long au téléphone", category: "telephone", disc: { prudent: 2, analytique: 1 }, heat: -1 },
  { id: "ton-sec", label: "Ton sec au téléphone", category: "telephone", disc: { fonceur: 2 }, heat: -2 },
  { id: "envoyez-mail", label: "Dit « envoyez-moi un mail »", category: "telephone", disc: { analytique: 1, prudent: 1 }, heat: -2 },
  { id: "demande-numero", label: "Demande comment vous avez eu son numéro", category: "telephone", disc: { prudent: 2 }, heat: -2 },
  { id: "rappelez-plus-tard", label: "Dit « rappelez-moi plus tard »", category: "telephone", disc: { prudent: 1, fonceur: 1 }, heat: -1 },
  { id: "bruit-fond", label: "Bruit de fond, il est en plein service", category: "telephone", disc: { fonceur: 1 }, heat: -1 },
  { id: "reste-en-ligne", label: "Reste en ligne et pose des questions", category: "telephone", disc: { analytique: 1, relationnel: 1 }, heat: 2 },
  { id: "propose-creneau", label: "Propose lui-même un moment pour se voir", category: "telephone", disc: { fonceur: 1, relationnel: 1 }, heat: 3 },

  /* -------------------------- Contexte ----------------------------- */
  { id: "saison-touristes", label: "Parle de la saison, des touristes", category: "contexte", disc: { relationnel: 1, fonceur: 1 }, heat: 1 },
  { id: "commerce-plein", label: "Des clients attendent au comptoir", category: "contexte", disc: { fonceur: 1 }, heat: -2 },
  { id: "deco-personnelle", label: "Photos, souvenirs, déco très personnelle", category: "contexte", disc: { relationnel: 2 }, heat: 0 },
  { id: "commerce-range", label: "Tout est rangé, étiqueté, classé", category: "contexte", disc: { analytique: 2, prudent: 1 }, heat: 0 },
  { id: "plusieurs-affaires", label: "Gère plusieurs choses à la fois", category: "contexte", disc: { fonceur: 2 }, heat: 0 },
  { id: "vient-ouvrir", label: "Vient d’ouvrir ou de reprendre l’affaire", category: "contexte", disc: { fonceur: 1, relationnel: 1 }, heat: 1 },
  { id: "affiche-avis", label: "Affiche déjà ses avis ou un QR code en vitrine", category: "contexte", disc: { analytique: 1, fonceur: 1 }, heat: 1 },
];

/* ------------------------------------------------------------------ */
/* Règles « prochaine phrase »                                         */
/* ------------------------------------------------------------------ */

/** Signaux qui indiquent qu’on est au téléphone (utile pour ne jamais y vendre le prix). */
const PHONE_SIGNALS = signals.filter((s) => s.category === "telephone").map((s) => s.id);

/** Signaux qui ne s’observent qu’en face à face : là seulement, on peut donner une fourchette de prix. */
const IN_PERSON_SIGNALS = signals
  .filter((s) => s.category === "non-verbal" || s.category === "contexte")
  .map((s) => s.id);

/** Deux créneaux précis, toujours les mêmes, pour que l’app reste cohérente. */
const SLOTS = "mardi 15 h ou jeudi 10 h 30";
const SLOTS_CAP = "Mardi 15 h ou jeudi 10 h 30";

export const nextLineRules: NextLineRule[] = [
  /* ---------- Signaux très précis (priorité 9-10) ---------- */
  {
    id: "prix-au-telephone",
    when: { allSignals: ["demande-prix"], anySignals: PHONE_SIGNALS },
    line: `Je préfère ne pas vous donner un chiffre au hasard au téléphone, ça dépend de ce que vous avez déjà. En 20 minutes sur place, je vous donne un prix précis. Plutôt ${SLOTS} ?`,
    why: "Au téléphone, on ne vend jamais le prix : on vend le rendez-vous. Un chiffre sans contexte ne sert qu’à se faire raccrocher au nez.",
    priority: 10,
  },
  {
    id: "on-commence-quand",
    when: { anySignals: ["on-commence-quand", "sort-agenda"], minHeat: 4 },
    line: "On peut démarrer dès cette semaine. Je vous envoie le devis ce soir, vous le lisez tranquillement, et on cale la première séance de travail. Plutôt mardi ou jeudi ?",
    why: "Il a déjà décidé. Continuer à argumenter, c’est risquer de le refroidir : on passe au premier pas concret.",
    priority: 10,
  },
  {
    id: "deja-fait-le-coup",
    when: { anySignals: ["deja-fait-le-coup"] },
    line: "Je comprends, et vous avez raison de vous méfier. Qu’est-ce qui s’était passé, la dernière fois ?",
    why: "La méfiance vient d’une mauvaise expérience réelle. On la fait raconter avant de parler de soi : c’est lui qui vous dira ce qu’il ne faut surtout pas refaire.",
    priority: 10,
  },
  {
    id: "demande-numero",
    when: { anySignals: ["demande-numero"] },
    line: "Je l’ai trouvé sur votre fiche Google, c’est le numéro du commerce. Si je vous dérange, dites-le-moi franchement et je ne rappellerai pas.",
    why: "Transparence totale sur la source du numéro. Lui laisser la porte de sortie désamorce le reproche.",
    priority: 10,
  },
  {
    id: "coup-de-feu",
    when: { anySignals: ["commerce-plein", "sert-sans-regarder"] },
    line: "Je vois que c’est le coup de feu, je ne vous embête pas. Je repasse vers 15 h, quand c’est plus calme ?",
    why: "Personne n’écoute un vendeur avec des clients qui attendent. Partir vite et proposer un meilleur moment, c’est déjà gagner du crédit.",
    priority: 9,
  },
  {
    id: "en-plein-service-telephone",
    when: { anySignals: ["bruit-fond"] },
    line: `Je vous entends occupé, je ne vous retiens pas. Je vous rappelle quand c’est plus calme : ${SLOTS} ?`,
    why: "S’il est en plein service, chaque seconde en ligne joue contre vous. On raccroche vite, avec un créneau précis pour rappeler.",
    priority: 9,
  },
  {
    id: "combien-par-mois",
    when: { anySignals: ["combien-par-mois"], minHeat: 1 },
    line: "Il y a deux façons de faire : tout payer d’un coup, ou étaler par mois. Beaucoup de commerçants préfèrent étaler, ça évite de sortir une grosse somme. On regarde ensemble ce qui vous va le mieux ?",
    why: "Parler au mois, c’est penser à sa trésorerie : il se projette déjà. On répond sur la formule avant le chiffre, et on garde le détail pour le rendez-vous.",
    priority: 9,
  },
  {
    id: "doit-en-parler",
    when: { anySignals: ["doit-en-parler"] },
    line: `C’est normal. Le plus simple, c’est qu’on se voie avec lui, comme ça il a les réponses directement. Il pourrait être là ${SLOTS} ?`,
    why: "Une décision à deux se prend à deux. Inclure l’autre décideur évite le message déformé et le « finalement, non » par téléphone.",
    priority: 9,
  },
  {
    id: "appelle-associe",
    when: { anySignals: ["appelle-associe"], minHeat: 2 },
    line: "Bonjour, {prenom}, de MJAGENCY. Je vous résume en trente secondes ce qu’on regardait, et après c’est vous qui posez les questions.",
    why: "Il fait venir le décideur : c’est un excellent signe. Un résumé très court, puis on laisse la parole au nouveau venu.",
    priority: 9,
  },
  {
    id: "envoyez-mail-froid",
    when: { anySignals: ["envoyez-mail"], maxHeat: 0 },
    line: "Je vous l’envoie. Pour ne pas vous envoyer une plaquette de plus, je mets quoi dedans : plutôt votre fiche Google, ou vos avis ?",
    why: "« Envoyez-moi un mail » est souvent une façon polie de clore. Une seule question de tri rend le mail utile et relance l’échange, sans insister.",
    priority: 9,
  },
  {
    id: "envoyez-mail-tiede",
    when: { anySignals: ["envoyez-mail"], minHeat: 1 },
    line: "Je vous envoie ça ce soir. Et pour qu’on en parle de vive voix, je vous rappelle jeudi ou vendredi en fin de matinée, qu’est-ce qui vous arrange ?",
    why: "Il est intéressé mais veut lire d’abord : on respecte ça, et on fixe tout de suite le moment du rappel.",
    priority: 9,
  },
  {
    id: "garantie-prudent",
    when: { anySignals: ["demande-garantie"] },
    line: "Ce que je peux vous garantir, c’est ce qui est écrit dans le devis : ce qu’on livre, la date, et le prix. Rien de caché. Et vous avez nos coordonnées, on est à Sète, pas au bout du monde.",
    why: "Le prudent veut du tangible. On ne promet pas de résultats chiffrés : on garantit ce qu’on maîtrise, par écrit, et on rappelle la proximité.",
    priority: 9,
  },

  /* ---------- Signaux ciblés (priorité 7-8) ---------- */
  {
    id: "prix-fonceur",
    when: { profile: "fonceur", allSignals: ["demande-prix"], anySignals: IN_PERSON_SIGNALS },
    line: `Réponse directe : un site vitrine, c’est entre 490 et 1 900 €, selon ce qu’il y a dedans. Pour le prix exact, il me faut 20 minutes chez vous. ${SLOTS_CAP} ?`,
    why: "Le fonceur déteste qu’on esquive. En face à face, une fourchette honnête tout de suite (jamais au téléphone), puis le rendez-vous comme moyen d’avoir le chiffre exact.",
    priority: 8,
  },
  {
    id: "prix-general",
    when: { anySignals: ["demande-prix"] },
    line: "Ça dépend vraiment de ce dont vous avez besoin, et je ne veux pas vous annoncer un chiffre au hasard. Le mieux, c’est l’audit gratuit : en 20 minutes, je vous dis ce qui vous est utile, et combien ça coûte.",
    why: "On ne cache pas le prix, on le relie au besoin. Valable en face à face comme au téléphone : l’audit gratuit évite d’annoncer un montant sans savoir ce qu’on vend.",
    priority: 7,
  },
  {
    id: "ancien-prestataire",
    when: { anySignals: ["ancien-prestataire"] },
    line: "Et avec lui, qu’est-ce qui n’allait pas, concrètement ? Que je ne refasse pas la même erreur.",
    why: "Ce qu’il reproche à l’ancien, c’est exactement ce qu’il attend de vous. On écoute, on ne critique jamais le confrère.",
    priority: 8,
  },
  {
    id: "exemples",
    when: { anySignals: ["demande-exemples"] },
    line: "Je vous montre deux réalisations sur mon téléphone. Vous préférez voir un commerce proche du vôtre, ou quelque chose de plus différent ?",
    why: "Il veut des preuves, pas des promesses. Montrer du réel, et le laisser choisir, l’implique dans la démonstration.",
    priority: 8,
  },
  {
    id: "question-technique",
    when: { anySignals: ["question-technique"] },
    line: "Bonne question. Je vous réponds précisément, et si je n’ai pas la réponse exacte, je vous l’écris ce soir plutôt que de vous dire une bêtise.",
    why: "L’analytique teste votre sérieux. Répondre avec précision, ou avouer qu’on vérifie, vaut mieux qu’une réponse floue.",
    priority: 8,
  },
  {
    id: "etapes-delais",
    when: { anySignals: ["etapes-concretes", "questions-delais"] },
    line: `Concrètement, c’est trois étapes : l’audit de 20 minutes, un devis écrit avec les dates, puis la mise en place. On fait l’audit ${SLOTS} ?`,
    why: "Il se projette dans la réalisation. Des étapes claires le rassurent, et la première étape devient le rendez-vous.",
    priority: 8,
  },
  {
    id: "regarde-montre",
    when: { anySignals: ["regarde-montre", "pas-le-temps"] },
    line: "Je vois que vous êtes pris, je ne vous retiens pas. Je repasse à quelle heure, quand c’est plus calme ?",
    why: "Respecter son temps, c’est la meilleure façon de pouvoir revenir. On lui laisse choisir l’heure.",
    priority: 8,
  },
  {
    id: "cafe-famille",
    when: { anySignals: ["propose-cafe", "parle-famille"] },
    line: "Volontiers. Et vous, ça fait longtemps que vous êtes ici ? Racontez-moi comment ça a commencé.",
    why: "Le relationnel ouvre la porte : on prend le temps de l’écouter. La confiance vient avant l’offre.",
    priority: 8,
  },
  {
    id: "avis-negatifs",
    when: { anySignals: ["avis-negatifs"] },
    line: "C’est frustrant, surtout quand un seul client mécontent prend toute la place. Vos clients contents, ils laissent des avis, ou jamais ?",
    why: "Il exprime lui-même la douleur. On la reconnaît, puis on l’amène vers la vraie cause : les clients satisfaits ne pensent pas à laisser d’avis.",
    priority: 8,
  },
  {
    id: "compare-concurrent",
    when: { anySignals: ["compare-concurrent"] },
    line: "Vous avez raison de comparer. Qu’est-ce qui vous plaît, chez eux ? Je vous dirai franchement si on fait mieux ou pas.",
    why: "Comparer, c’est déjà envisager d’acheter. On fait parler ses critères au lieu de dénigrer l’autre.",
    priority: 8,
  },
  {
    id: "qui-etes-vous",
    when: { anySignals: ["qui-etes-vous"] },
    line: "Je suis {prenom}, de MJAGENCY, une agence de Sète. On est deux associés, on se déplace chez les commerçants du coin. Je peux vous montrer ce qu’on a fait pas loin d’ici.",
    why: "Il vérifie à qui il a affaire. On répond simplement, sans se survendre, et on propose des preuves locales.",
    priority: 8,
  },
  {
    id: "budget-serre",
    when: { anySignals: ["budget-serre"] },
    line: "Je comprends, et je ne vais pas vous proposer un gros site si vous n’en avez pas besoin. On peut commencer petit, par ce qui rapporte le plus vite. L’audit est gratuit, ça vous permet de voir sans rien engager.",
    why: "Le budget serré est une contrainte réelle, pas une objection à contourner. On propose une première marche à sa portée.",
    priority: 8,
  },
  {
    id: "montre-site",
    when: { anySignals: ["montre-site", "montre-telephone"] },
    line: "Merci de me montrer. Et vous, vous en pensez quoi ? Qu’est-ce que vous aimeriez qu’il fasse de mieux ?",
    why: "Il vous ouvre son univers. On le laisse formuler lui-même ce qui manque : c’est son besoin, pas le vôtre.",
    priority: 8,
  },
  {
    id: "rappelez-plus-tard",
    when: { anySignals: ["rappelez-plus-tard"] },
    line: `Pas de problème. Je vous rappelle ${SLOTS}, qu’est-ce qui vous arrange le mieux ?`,
    why: "« Plus tard » sans date, c’est jamais. Deux créneaux précis transforment l’esquive en engagement léger.",
    priority: 8,
  },
  {
    id: "glace-sortie",
    when: { anySignals: ["monosyllabes", "ton-sec"], maxHeat: -3 },
    line: "Je vous sens occupé, je ne vous retiens pas. Je vous laisse mes coordonnées, et bonne journée.",
    why: "Le mur est là. Insister ne ferait que fermer la porte pour de bon : on sort proprement, en laissant une bonne image.",
    priority: 8,
  },
  {
    id: "saison-touristes",
    when: { anySignals: ["saison-touristes"] },
    line: "Justement, un touriste qui arrive à {ville}, il ne vous connaît pas : il tape sur Google et il va souvent chez celui qui a les meilleurs avis. Vous l’avez déjà remarqué ?",
    why: "Il amène lui-même le sujet de la saison. On le relie à la façon dont les visiteurs choisissent, sans chiffre inventé.",
    priority: 7,
  },
  {
    id: "vous-etes-dou",
    when: { anySignals: ["vous-etes-dou"] },
    line: "De Sète, juste à côté. On travaille avec des commerces de {ville} et de tout le bassin de Thau. Et vous, vous êtes d’ici depuis longtemps ?",
    why: "Il cherche un point commun. La proximité rassure ; on renvoie la question pour le faire parler de lui.",
    priority: 7,
  },
  {
    id: "silence-telephone",
    when: { anySignals: ["silence-long"] },
    line: "Je vous ai peut-être pris de court. Dites-moi franchement, qu’est-ce qui vous fait hésiter ?",
    why: "Au téléphone, le silence n’est pas un non : il réfléchit ou il doute. On nomme le doute avec douceur plutôt que de remplir le vide.",
    priority: 7,
  },
  {
    id: "c-est-interessant",
    when: { anySignals: ["c-est-interessant"], maxHeat: 2 },
    line: "Qu’est-ce qui vous parle le plus, dans ce que je vous ai montré ?",
    why: "« C’est intéressant » peut être sincère ou simplement poli. Une question ouverte fait la différence et révèle ce qui compte pour lui.",
    priority: 7,
  },
  {
    id: "coupe-parole-fonceur",
    when: { profile: "fonceur", anySignals: ["coupe-parole"] },
    line: `Je vais droit au but : votre fiche Google peut vous ramener des clients, et je vous montre comment en 20 minutes. ${SLOTS_CAP} ?`,
    why: "S’il coupe, c’est que vous êtes trop long. Une phrase, un bénéfice, deux créneaux.",
    priority: 7,
  },
  {
    id: "bras-croises-prudent",
    when: { anySignals: ["croise-bras", "reste-comptoir"], maxHeat: 0 },
    line: "Je ne viens rien vous vendre aujourd’hui. Je voulais juste vous montrer ce que voient vos clients quand ils cherchent {commerce} sur Google. Ça prend une minute.",
    why: "Il se protège. On baisse la pression, on retire l’enjeu de décision, et on propose quelque chose de court et d’utile.",
    priority: 7,
  },
  {
    id: "prend-notes",
    when: { anySignals: ["prend-notes", "range-carte"], minHeat: 1 },
    line: "Si vous voulez, je vous envoie aussi un récapitulatif écrit ce soir, avec les étapes et les prix, pour que vous l’ayez sous les yeux.",
    why: "Il garde une trace : il veut réfléchir sérieusement. Lui fournir l’écrit, c’est lui faire gagner du temps.",
    priority: 6,
  },

  /* ---------- Profil + température (priorité 5-6) ---------- */
  {
    id: "fonceur-chaud",
    when: { profile: "fonceur", minHeat: 3 },
    line: `Voilà ce que je vous propose : je passe ${SLOTS}, je vous montre le résultat en 20 minutes, et vous décidez sur place.`,
    why: "Le fonceur veut garder la main et aller vite : un rendez-vous court où c’est lui qui tranche.",
    priority: 6,
  },
  {
    id: "analytique-chaud",
    when: { profile: "analytique", minHeat: 3 },
    line: `Je vous prépare un devis écrit, détaillé ligne par ligne, avec les délais. On le regarde ensemble ${SLOTS} ?`,
    why: "L’analytique décide sur pièces. Un document précis et un temps pour le relire ensemble.",
    priority: 6,
  },
  {
    id: "relationnel-chaud",
    when: { profile: "relationnel", minHeat: 3 },
    line: `J’ai l’impression qu’on se comprend bien. Je repasse ${SLOTS}, on prend le temps de regarder ça ensemble, tranquillement ?`,
    why: "Le relationnel achète une relation. On propose de continuer la conversation, pas de signer un contrat.",
    priority: 6,
  },
  {
    id: "prudent-chaud",
    when: { profile: "prudent", minHeat: 2 },
    line: "On peut commencer par une seule chose, la fiche Google par exemple, et vous voyez le résultat avant d’aller plus loin. Ça vous irait ?",
    why: "Le prudent avance par petits pas. Une première étape limitée réduit le risque perçu.",
    priority: 6,
  },
  {
    id: "fonceur-froid",
    when: { profile: "fonceur", maxHeat: -1 },
    line: "Une seule chose, et je vous laisse : tapez {commerce} sur Google comme un client. Si ce que vous voyez ne vous plaît pas, appelez-moi.",
    why: "Le fonceur froid n’écoutera pas un argumentaire. Un constat qu’il vérifie seul, et c’est lui qui garde le contrôle.",
    priority: 5,
  },
  {
    id: "analytique-froid",
    when: { profile: "analytique", maxHeat: -1 },
    line: "Je ne vous demande rien aujourd’hui. Je peux vous envoyer par SMS trois points précis que j’ai relevés sur votre fiche Google, et vous jugerez par vous-même.",
    why: "L’analytique se méfie des discours. Des faits vérifiables, sans rien demander, laissent une porte ouverte.",
    priority: 5,
  },
  {
    id: "relationnel-froid",
    when: { profile: "relationnel", maxHeat: -1 },
    line: "Je comprends, ce n’est pas le moment. Je suis de Sète, juste à côté, je repasserai vous dire bonjour un jour plus calme.",
    why: "Avec le relationnel, la relation compte plus que la vente du jour. On laisse un bon souvenir.",
    priority: 5,
  },
  {
    id: "prudent-froid",
    when: { profile: "prudent", maxHeat: -1 },
    line: "Aucun souci, je ne vous demande aucune décision. Je vous laisse ma carte, et si un jour vous voulez qu’on regarde votre fiche Google ensemble, c’est gratuit et sans engagement.",
    why: "Le prudent a besoin de temps et d’aucune pression. On laisse une option sans risque, qu’il pourra saisir plus tard.",
    priority: 5,
  },
  {
    id: "fonceur-tiede",
    when: { profile: "fonceur", minHeat: 0, maxHeat: 2 },
    line: `En 20 minutes, je vous montre ce qui vous fait perdre des clients sur Google, et comment le régler. C’est gratuit. ${SLOTS_CAP} ?`,
    why: "Le fonceur tiède attend un bénéfice clair et rapide. On va à l’essentiel et on propose le rendez-vous.",
    priority: 5,
  },
  {
    id: "relationnel-tiede",
    when: { profile: "relationnel", minHeat: 0, maxHeat: 2 },
    line: "Et vos clients, ils vous connaissent comment, en général ? Par le bouche-à-oreille, ou ils vous trouvent sur internet ?",
    why: "Le relationnel aime parler de ses clients. Une question ouverte sur eux fait avancer la découverte en douceur.",
    priority: 5,
  },

  /* ---------- Repli par température, sans profil (priorité 3-4) ---------- */
  {
    id: "temp-glace",
    when: { maxHeat: -4 },
    line: "Pas de souci, je ne vous dérange pas plus. Bonne fin de journée.",
    why: "Glacé : ne pas insister. On sort proprement en moins de 20 secondes, en laissant une bonne image.",
    priority: 4,
  },
  {
    id: "temp-glace-carte",
    when: { maxHeat: -4 },
    line: "Je vous laisse juste ma carte, si un jour vous en avez besoin. Bonne continuation.",
    why: "Si la carte est acceptée, c’est une trace. Si elle est refusée, on n’insiste pas.",
    priority: 3,
  },
  {
    id: "temp-froid",
    when: { minHeat: -3, maxHeat: -1 },
    line: "Je vous laisse juste une chose à regarder : tapez {commerce} sur Google, comme un client. Si vous voulez, je vous envoie par SMS ce que j’y ai remarqué.",
    why: "Froid : semer une graine, pas vendre. Un constat utile, sans rien demander en échange.",
    priority: 4,
  },
  {
    id: "temp-froid-rappel",
    when: { minHeat: -3, maxHeat: -1 },
    line: "Je comprends que ce ne soit pas le moment. Je repasse dans quelques semaines, à un moment plus calme pour vous ?",
    why: "Froid : le moment n’est peut-être pas le bon. On propose de revenir, sans pression.",
    priority: 3,
  },
  {
    id: "temp-neutre",
    when: { minHeat: 0, maxHeat: 0 },
    line: "Aujourd’hui, vos nouveaux clients, ils vous trouvent comment, en général ?",
    why: "Rien n’est encore joué : on ouvre par une question de situation pour le faire parler de son commerce.",
    priority: 4,
  },
  {
    id: "temp-tiede",
    when: { minHeat: 1, maxHeat: 2 },
    line: `Le plus simple, c’est que je vous fasse l’audit gratuit : 20 minutes, je vous montre ce que voient vos clients sur Google. ${SLOTS_CAP} ?`,
    why: "Tiède : c’est le moment de proposer l’audit, avec deux créneaux précis. Pas de prix détaillé ici.",
    priority: 4,
  },
  {
    id: "temp-tiede-question",
    when: { minHeat: 1, maxHeat: 2 },
    line: "Si vous pouviez changer une seule chose dans la façon dont les clients vous trouvent, ce serait quoi ?",
    why: "Tiède : une question qui fait parler de ses priorités, pour ajuster l’offre.",
    priority: 3,
  },
  {
    id: "temp-chaud",
    when: { minHeat: 3, maxHeat: 5 },
    line: `On se pose 30 minutes pour regarder ça ensemble, avec la personne qui décide avec vous si besoin. ${SLOTS_CAP} ?`,
    why: "Chaud : fixer le rendez-vous maintenant, avec tous les décideurs.",
    priority: 4,
  },
  {
    id: "temp-chaud-sms",
    when: { minHeat: 3, maxHeat: 5 },
    line: "Je vous confirme tout ça par SMS tout à l’heure, avec la date et ce qu’on regardera ensemble.",
    why: "Chaud : confirmer par écrit dans la foulée évite que l’envie retombe.",
    priority: 3,
  },
  {
    id: "temp-brulant",
    when: { minHeat: 6 },
    line: "Parfait. Je récapitule ce qu’on a décidé, je vous envoie le devis ce soir avec le prix et la date de livraison, et on fixe le premier rendez-vous de travail.",
    why: "Brûlant : arrêter d’argumenter. Récapituler, donner le prix et les modalités, fixer le premier pas concret.",
    priority: 4,
  },
  {
    id: "temp-brulant-paiement",
    when: { minHeat: 6 },
    line: "Pour le paiement, vous préférez tout régler d’un coup ou étaler par mois ? Les deux sont possibles, je le mets dans le devis.",
    why: "Brûlant : on règle les modalités pratiques, c’est la dernière marche avant la signature.",
    priority: 3,
  },

  /* ---------- Défaut absolu (toujours applicables) ---------- */
  {
    id: "defaut-situation",
    when: {},
    line: "Ça fait longtemps que vous êtes installé ici, à {ville} ?",
    why: "Question de situation simple : elle met à l’aise et vous donne de quoi rebondir.",
    priority: 1,
  },
  {
    id: "defaut-ecoute",
    when: {},
    line: "Qu’est-ce qui marche le mieux pour faire venir du monde, chez vous ?",
    why: "Question ouverte : on écoute avant de proposer quoi que ce soit.",
    priority: 0,
  },
];

/* ------------------------------------------------------------------ */
/* Analyse                                                             */
/* ------------------------------------------------------------------ */

export interface SignalAnalysis {
  profile: DiscProfile | null;
  profileScores: Record<DiscProfile, number>;
  confidence: number;
  heat: number;
  temperature: Temperature;
  line: { text: string; why: string };
  alternatives: { text: string; why: string }[];
  advice: string[];
}

const PROFILE_ORDER: DiscProfile[] = ["fonceur", "analytique", "relationnel", "prudent"];

const signalById: Record<string, Signal> = Object.fromEntries(signals.map((s) => [s.id, s]));

const PROFILE_ADVICE: Record<DiscProfile, string> = {
  fonceur: "Tendance Fonceur : soyez bref, allez au résultat, laissez-le décider.",
  analytique: "Tendance Analytique : des faits, des étapes, du concret par écrit. Pas d’à-peu-près.",
  relationnel: "Tendance Relationnel : prenez le temps d’écouter, la confiance passe avant l’offre.",
  prudent: "Tendance Prudent : zéro pression, rassurez, proposez une petite première étape.",
};

const TEMPERATURE_ADVICE: Record<Temperature, string> = {
  glace: "Glacé : n’insistez pas, sortez proprement en moins de 20 secondes.",
  froid: "Froid : semez une graine utile, ne cherchez pas à vendre aujourd’hui.",
  tiede: "Tiède : proposez l’audit gratuit avec deux créneaux précis.",
  chaud: "Chaud : fixez le rendez-vous maintenant, avec tous les décideurs.",
  brulant: "Brûlant : arrêtez d’argumenter, récapitulez et concluez.",
};

/** Conseils attachés aux signaux les plus parlants. */
const SIGNAL_ADVICE: Record<string, string> = {
  "demande-prix": "Il parle prix : fourchette honnête en face à face, jamais de prix au téléphone.",
  "combien-par-mois": "Il pense trésorerie : présentez l’abonnement ou le paiement mixte.",
  "deja-fait-le-coup": "Il a été déçu : faites-le raconter avant de parler de vous.",
  "ancien-prestataire": "Ne critiquez jamais l’ancien prestataire, écoutez ce qui a manqué.",
  "doit-en-parler": "Il y a un autre décideur : proposez de le voir avec lui.",
  "appelle-associe": "Le décideur arrive : résumez en 30 secondes et laissez-le poser ses questions.",
  "envoyez-mail": "« Envoyez-moi un mail » : une seule question de tri, puis un rappel daté.",
  "demande-garantie": "Garantissez ce que vous maîtrisez, par écrit. Aucun résultat promis.",
  "budget-serre": "Budget serré : proposez une première étape à sa portée, pas le catalogue.",
  "etapes-concretes": "Il se projette : détaillez les étapes et fixez la première.",
  "on-commence-quand": "Il a décidé : passez au devis et à la date, sans rajouter d’arguments.",
  "sort-agenda": "Il sort son agenda : calez la date tout de suite.",
  "propose-creneau": "Il propose lui-même un moment : acceptez et confirmez par SMS.",
  "commerce-plein": "Clients en attente : proposez de repasser, ne restez pas dans le passage.",
  "sert-sans-regarder": "Il ne vous regarde pas : ce n’est pas le moment, repassez plus tard.",
  "ton-sec": "Ton sec : faites court, une phrase utile puis proposez de rappeler.",
  "demande-numero": "Dites d’où vient le numéro et proposez de ne plus rappeler si ça dérange.",
  "monosyllabes": "Monosyllabes : posez une seule question ouverte, sinon sortez poliment.",
  "pas-le-temps": "Il n’a pas le temps : respectez-le, demandez quand repasser.",
  "avis-negatifs": "Il parle de ses avis : c’est sa douleur, creusez avec des questions.",
  "question-technique": "Question technique : répondez précisément ou promettez la réponse par écrit.",
  "prend-notes": "Il prend des notes : envoyez un récapitulatif écrit le soir même.",
  "propose-cafe": "Il vous offre un café : acceptez, et écoutez plus que vous ne parlez.",
  "croise-bras": "Bras croisés : baissez la pression, retirez l’enjeu de décision.",
  "silence-long": "Silence au téléphone : ne le comblez pas, demandez ce qui le fait hésiter.",
};

function matches(rule: NextLineRule, profile: DiscProfile | null, heat: number, ids: Set<string>): boolean {
  const w = rule.when;
  if (w.profile !== undefined && w.profile !== profile) return false;
  if (w.minHeat !== undefined && heat < w.minHeat) return false;
  if (w.maxHeat !== undefined && heat > w.maxHeat) return false;
  if (w.anySignals !== undefined && !w.anySignals.some((id) => ids.has(id))) return false;
  if (w.allSignals !== undefined && !w.allSignals.every((id) => ids.has(id))) return false;
  return true;
}

function conditionCount(rule: NextLineRule): number {
  const w = rule.when;
  return (
    (w.profile !== undefined ? 1 : 0) +
    (w.minHeat !== undefined ? 1 : 0) +
    (w.maxHeat !== undefined ? 1 : 0) +
    (w.anySignals !== undefined ? 1 : 0) +
    (w.allSignals !== undefined ? 1 : 0)
  );
}

export function analyzeSignals(ids: string[]): SignalAnalysis {
  // Signaux connus, sans doublon, dans l’ordre du catalogue (résultat stable).
  const idSet = new Set(ids);
  const selected = signals.filter((s) => idSet.has(s.id));
  const known = new Set(selected.map((s) => s.id));

  // Profil
  const profileScores: Record<DiscProfile, number> = { fonceur: 0, analytique: 0, relationnel: 0, prudent: 0 };
  let heat = 0;
  for (const s of selected) {
    heat += s.heat;
    for (const p of PROFILE_ORDER) profileScores[p] += s.disc[p] ?? 0;
  }
  const ranked = [...PROFILE_ORDER].sort((a, b) => profileScores[b] - profileScores[a]);
  const total = PROFILE_ORDER.reduce((sum, p) => sum + profileScores[p], 0);
  const top = profileScores[ranked[0]];
  const second = profileScores[ranked[1]];
  const profile: DiscProfile | null = top > 0 ? ranked[0] : null;
  const confidence = total > 0 ? Math.round(((top - second) / total) * 100) / 100 : 0;

  const temperature = heatToTemperature(heat);

  // Règles
  const candidates = nextLineRules
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => matches(rule, profile, heat, known))
    .sort(
      (a, b) =>
        b.rule.priority - a.rule.priority ||
        conditionCount(b.rule) - conditionCount(a.rule) ||
        a.index - b.index,
    );
  const picked: { text: string; why: string }[] = [];
  const seen = new Set<string>();
  for (const { rule } of candidates) {
    if (seen.has(rule.line)) continue;
    seen.add(rule.line);
    picked.push({ text: rule.line, why: rule.why });
    if (picked.length === 3) break;
  }
  // Les règles « défaut » n’ont aucune condition : picked contient toujours au moins 2 entrées.
  const line = picked[0];
  const alternatives = picked.slice(1);

  // Conseils (2 à 4)
  const advice: string[] = [];
  if (profile) {
    advice.push(
      confidence < 0.2
        ? `${PROFILE_ADVICE[profile]} Tendance encore faible : observez encore avant de trancher.`
        : PROFILE_ADVICE[profile],
    );
  }
  advice.push(TEMPERATURE_ADVICE[temperature]);
  const strong = selected
    .filter((s) => SIGNAL_ADVICE[s.id] !== undefined)
    .sort((a, b) => Math.abs(b.heat) - Math.abs(a.heat));
  for (const s of strong) {
    if (advice.length >= 4) break;
    advice.push(SIGNAL_ADVICE[s.id]);
  }
  if (advice.length < 2) {
    advice.push(
      selected.length === 0
        ? "Aucun signal coché : ouvrez par une question simple et observez sa posture, son ton, ses questions."
        : "Peu de signaux nets : posez une question ouverte et laissez-le parler pour en savoir plus.",
    );
  }

  return { profile, profileScores, confidence, heat, temperature, line, alternatives, advice };
}
