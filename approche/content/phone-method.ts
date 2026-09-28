/**
 * Méthode téléphone : scripts d’appel, SMS, règles d’or, cadre légal
 * et relances automatiques après chaque appel.
 * Au téléphone, on ne vend jamais le prix : on vend le rendez-vous.
 */

export interface PhoneScript {
  id: string;
  title: string;
  context: string;
  lines: string[];
  tip?: string;
  maxDuration?: string;
}

export const phoneScripts: PhoneScript[] = [
  {
    id: "ouverture",
    title: "Ouverture",
    context:
      "Premier appel au gérant, sur la ligne du commerce, à un moment calme de son métier. Objectif unique : obtenir 20 minutes pour l’audit gratuit, pas vendre.",
    lines: [
      "Bonjour, je suis bien à {commerce} ? Je peux parler à {dirigeant}, s’il vous plaît ?",
      "Bonjour {dirigeant}, {prenom}, de MJAGENCY, une agence web ici à Sète. Je vous prends trente secondes et vous me dites si ça vaut le coup d’aller plus loin, ça vous va ?",
      "Je vous appelle parce que j’ai regardé la fiche Google de {commerce}, et il y a deux ou trois choses simples qui vous font sûrement perdre des clients, notamment sur les horaires et les photos.",
      "D’ailleurs, votre fiche Google, c’est vous qui vous en occupez, ou quelqu’un le fait pour vous ?",
      "D’accord. Ce que je vous propose, c’est un audit gratuit de 20 minutes, chez vous : je vous montre ce que voient vos clients avant de venir, et ce qu’on peut corriger facilement.",
      "Je suis sur {ville} {creneau1} ou {creneau2}, qu’est-ce qui vous arrange le mieux ?",
    ],
    tip: "La phrase qui compte, c’est la troisième : un constat précis sur SA fiche. Ayez la fiche ouverte sous les yeux pendant l’appel pour pouvoir répondre s’il demande « quoi, exactement ? ».",
    maxDuration: "2 min",
  },
  {
    id: "barrage-secretaire",
    title: "Barrage : secrétaire ou accueil",
    context:
      "Cabinet, agence immobilière, garage, hôtel : une personne filtre les appels. Elle fait son travail, elle n’est pas un obstacle mais une source d’information.",
    lines: [
      "Bonjour, {prenom}, de MJAGENCY à Sète. Je souhaiterais parler à {dirigeant}, s’il vous plaît.",
      "C’est au sujet de la fiche Google de {commerce} : j’ai repéré deux ou trois choses que je voulais lui signaler. Il est disponible ?",
      "Je comprends qu’il soit pris. À quel moment je peux le joindre le plus facilement : plutôt en début de matinée ou en fin de journée ?",
      "Et c’est vous qui gérez un peu la communication, les avis, la fiche Google ? Ou c’est vraiment lui qui décide de tout ça ?",
      "Parfait, je le rappelle donc {creneau1}. Merci beaucoup. Vous pouvez me redire votre prénom, que je vous demande la prochaine fois ?",
    ],
    tip: "Notez son prénom dans la fiche et saluez-la par son prénom au rappel : la deuxième fois, c’est souvent elle qui vous passe le patron.",
    maxDuration: "1 min",
  },
  {
    id: "barrage-conjoint",
    title: "Barrage : le conjoint ou l’associé",
    context:
      "Commerce tenu en couple ou en famille (boulangerie, restaurant, commerce de bouche). Celui qui décroche est souvent celui qui décide de la communication.",
    lines: [
      "Bonjour, {prenom}, de MJAGENCY à Sète. Je cherchais à joindre {dirigeant}.",
      "Vous tenez {commerce} ensemble ? Alors ça vous concerne tout autant.",
      "Je vous appelle au sujet de votre fiche Google : les horaires, les photos, les avis. Souvent, c’est celui ou celle qui gère la boutique et les commandes qui s’en occupe. C’est vous ?",
      "Je vous propose de passer vous montrer ça en 20 minutes, c’est gratuit. Vous préférez qu’on voie ça avec vous, ou avec vous deux ?",
      "{creneau1} ou {creneau2}, qu’est-ce qui est le plus calme pour vous ?",
    ],
    tip: "Ne demandez jamais « vous êtes la femme du patron ? ». Demandez s’ils tiennent le commerce ensemble, et traitez la personne comme co-décisionnaire.",
    maxDuration: "1 min 30",
  },
  {
    id: "barrage-employe",
    title: "Barrage : un employé décroche",
    context:
      "Vendeur, serveur ou apprenti qui répond entre deux clients. Il n’a ni le temps ni le pouvoir de décider : on récupère un prénom et un créneau, c’est tout.",
    lines: [
      "Bonjour, {prenom}, de MJAGENCY. Je voulais parler au responsable de {commerce}, il est là ?",
      "Pas de souci. Vous pouvez me dire son prénom, que je le demande correctement ?",
      "Et quel est le moment le plus calme pour le joindre, sans tomber en plein service ?",
      "C’est au sujet de votre fiche Google, rien d’urgent. Je le rappelle donc {creneau1}.",
      "Merci beaucoup, et vous, c’est quoi votre prénom ? Bonne journée !",
    ],
    tip: "Ne faites pas l’argumentaire à l’employé : il ne pourra pas le répéter, et vous grillez votre accroche pour le vrai appel.",
    maxDuration: "45 s",
  },
  {
    id: "messagerie",
    title: "Message sur répondeur",
    context:
      "Le gérant ne décroche pas. Un message court, souriant, avec une raison précise de rappeler. Au-delà de 25 secondes, personne n’écoute jusqu’au bout.",
    lines: [
      "Bonjour {dirigeant}, c’est {prenom}, de MJAGENCY, l’agence web de Sète.",
      "J’ai regardé la fiche Google de {commerce} et j’ai repéré deux choses simples qui vous font sûrement perdre des clients.",
      "Je vous propose d’en parler vingt minutes chez vous, c’est gratuit et sans engagement.",
      "Je vous rappelle jeudi matin, ou rappelez-moi directement à ce numéro. Bonne journée !",
    ],
    tip: "Parlez plus lentement que d’habitude et souriez : ça s’entend. Ne laissez pas plus d’un message par semaine, et envoyez le SMS juste après.",
    maxDuration: "25 s",
  },
  {
    id: "prise-rdv",
    title: "Prise de rendez-vous",
    context:
      "Le gérant écoute et montre un peu d’intérêt. On ne parle ni de prix ni de solution détaillée : on fixe l’audit, toujours avec deux créneaux précis.",
    lines: [
      "Ce que je vous propose, c’est de passer vous voir vingt minutes, avec votre fiche Google et votre site sous les yeux.",
      "Je vous montre ce que voient vos clients avant de venir, ce qui marche et ce qui vous fait perdre du monde. Ensuite vous décidez, sans engagement.",
      "J’ai {creneau1} ou {creneau2}, qu’est-ce qui vous arrange ?",
      "Aucun des deux ? Pas de souci : plutôt le matin ou l’après-midi, et quel jour est le plus calme pour vous ?",
      "Parfait, je note. Je viens directement à {commerce}, c’est bien ça ?",
      "Je vous envoie un petit SMS de confirmation, et un rappel la veille. Ça vous va ?",
    ],
    tip: "S’il demande le prix : « Ça dépend vraiment de ce dont vous avez besoin, ça peut aller d’une petite correction à un site complet. C’est justement l’intérêt des 20 minutes : vous repartez avec une idée claire, sans engagement. »",
    maxDuration: "1 min",
  },
  {
    id: "conclusion",
    title: "Conclusion de l’appel",
    context:
      "Le rendez-vous est pris. On verrouille les détails en quelques phrases, puis on raccroche proprement, sans relancer la discussion.",
    lines: [
      "Je récapitule : on se voit {creneau1}, à {commerce}, pour vingt minutes.",
      "Si vous pouvez avoir votre téléphone avec vous, on regardera votre fiche ensemble, ce sera plus parlant.",
      "Je vous envoie la confirmation sur ce numéro-là, ou il y en a un meilleur ?",
      "Si vous avez un empêchement, un simple SMS suffit, on décale sans problème.",
      "Merci {dirigeant}, bonne fin de journée, et à bientôt.",
    ],
    tip: "Laissez-le raccrocher en premier, puis notez tout dans l’app avant de composer le numéro suivant.",
    maxDuration: "45 s",
  },
  {
    id: "rappel-demande",
    title: "Rappel demandé",
    context:
      "Il vous avait dit « rappelez-moi » à une date ou une heure donnée. Vous rappelez exactement au moment convenu : c’est votre première preuve de sérieux.",
    lines: [
      "Bonjour {dirigeant}, c’est {prenom}, de MJAGENCY. Vous m’aviez dit de vous rappeler aujourd’hui, c’est un bon moment ?",
      "Pas de souci, je vous rappelle quand : plutôt demain matin ou demain en fin de journée ?",
      "On avait parlé de votre fiche Google et de vos avis. Vous avez eu le temps d’y repenser ?",
      "Je vous propose toujours de passer vingt minutes vous montrer tout ça, gratuitement et sans engagement.",
      "{creneau1} ou {creneau2}, qu’est-ce qui vous arrange ?",
    ],
    tip: "Relisez la note du premier appel avant de composer, et reprenez un mot qu’il avait employé : il voit que vous l’avez écouté.",
    maxDuration: "1 min 30",
  },
  {
    id: "sms-apres-messagerie",
    title: "SMS après un message vocal",
    context:
      "À envoyer juste après avoir laissé un message. Premier SMS non sollicité : on se présente clairement et on mentionne la possibilité de ne plus être contacté.",
    lines: [
      "Bonjour {dirigeant}, {prenom} de MJAGENCY, agence web à Sète. Je viens de vous laisser un message au sujet de la fiche Google de {commerce}. Je vous propose un audit gratuit de 20 min, je vous rappelle dans la semaine. Bonne journée. (STOP pour ne plus être contacté)",
      "Bonjour {dirigeant}, c’est {prenom}, de MJAGENCY à Sète. J’ai essayé de vous joindre au sujet de votre visibilité sur Google. Quel est le meilleur moment pour vous rappeler ? Merci ! (STOP pour ne plus être contacté)",
      "Bonjour {dirigeant}, {prenom} de MJAGENCY (Sète). Suite à mon appel : j’ai repéré deux points simples à améliorer sur la fiche Google de {commerce}. Ce qu’on propose : {lien}. Je vous rappelle jeudi. (STOP pour ne plus être contacté)",
    ],
    tip: "Envoyez-le dans les 5 minutes qui suivent le message vocal, pour que les deux se répondent.",
  },
  {
    id: "sms-confirmation-rdv",
    title: "SMS de confirmation de rendez-vous",
    context:
      "Le premier juste après l’appel, le deuxième la veille du rendez-vous. Il limite les oublis et laisse une porte simple pour décaler.",
    lines: [
      "Bonjour {dirigeant}, c’est {prenom} de MJAGENCY. Je vous confirme notre rendez-vous {creneau1} à {commerce}, pour 20 min. En cas d’empêchement, un petit SMS suffit. À bientôt !",
      "Bonjour {dirigeant}, petit rappel : on se voit demain, {creneau1}, à {commerce}. Toujours bon pour vous ? {prenom}, MJAGENCY",
      "Bonjour {dirigeant}, merci pour votre accueil au téléphone. C’est noté pour {creneau1} à {commerce}. Pensez à avoir votre téléphone, on regardera votre fiche Google ensemble. {prenom}, MJAGENCY",
    ],
    tip: "La veille, envoyez le rappel entre 17 h et 19 h, jamais pendant son coup de feu.",
  },
  {
    id: "sms-apres-visite",
    title: "SMS après une visite en boutique",
    context:
      "Le soir même ou le lendemain matin d’une visite où il vous a laissé son numéro. On remercie, on tient la promesse faite sur place, on propose le pas suivant.",
    lines: [
      "Bonjour {dirigeant}, merci pour votre accueil tout à l’heure à {commerce}. Comme promis, voici quelques réalisations : {lien}. Je reste disponible pour l’audit gratuit. {prenom}, MJAGENCY",
      "Bonjour {dirigeant}, c’est {prenom}, passé vous voir aujourd’hui. Je vous confirme {creneau1} pour l’audit à {commerce}. À bientôt ! MJAGENCY",
      "Bonjour {dirigeant}, merci pour l’échange de tout à l’heure. Si vous voulez qu’on regarde ensemble votre fiche Google, je vous propose {creneau1} ou {creneau2}. Répondez simplement 1 ou 2. {prenom}, MJAGENCY",
    ],
    tip: "Reprenez dans le SMS le point précis dont vous avez parlé en boutique : il se souviendra de vous, pas d’une agence parmi d’autres.",
  },
  {
    id: "sms-relance-douce",
    title: "SMS de relance douce",
    context:
      "Plusieurs semaines ou mois après un refus poli ou un « pas maintenant », souvent avant ou après la saison. Un seul message, sans pression. S’il ne répond pas, on n’insiste pas.",
    lines: [
      "Bonjour {dirigeant}, {prenom} de MJAGENCY à Sète. On avait échangé il y a quelques mois au sujet de {commerce}. La saison approche : si vous voulez un point gratuit sur votre fiche Google, je suis là. Bonne journée. (STOP pour ne plus recevoir de message)",
      "Bonjour {dirigeant}, j’espère que la saison s’est bien passée à {commerce}. Si vous avez 20 min cet automne pour faire le point sur votre visibilité, ce sera avec plaisir. {prenom}, MJAGENCY (STOP pour ne plus être contacté)",
      "Bonjour {dirigeant}, {prenom} de MJAGENCY. Je repensais à notre échange : on vient de refaire la fiche Google d’un commerce près de chez vous, je peux vous montrer le résultat si ça vous intéresse. Bonne journée. (STOP pour ne plus être contacté)",
    ],
    tip: "N’envoyez la troisième variante que si c’est vrai : on ne cite jamais une réalisation qui n’existe pas.",
  },
];

export const goldenRules: { title: string; detail: string }[] = [
  {
    title: "Souriez avant de décrocher",
    detail:
      "Le sourire s’entend dans la voix. Un visage fermé donne une voix plate, et le commerçant raccroche avant la deuxième phrase.",
  },
  {
    title: "Appelez debout",
    detail:
      "Debout, la voix porte mieux et vous êtes plus dynamique. Marchez un peu si ça vous aide, mais gardez la fiche du prospect sous les yeux.",
  },
  {
    title: "Laissez des silences",
    detail:
      "Après une question, taisez-vous, même trois secondes. Le silence n’est pas un échec : c’est le moment où il réfléchit et où il se met à parler.",
  },
  {
    title: "Reformulez ce qu’il dit",
    detail:
      "« Si je comprends bien, l’hiver c’est calme et vous voudriez plus d’habitués. » Il se sent écouté, et vous vérifiez que vous avez bien compris.",
  },
  {
    title: "Ne vendez jamais le prix au téléphone",
    detail:
      "Un prix sans contexte fait toujours peur. Au téléphone, vous vendez 20 minutes d’audit gratuit. Le prix se discute en face, une fois le besoin compris.",
  },
  {
    title: "Proposez toujours deux créneaux précis",
    detail:
      "« Mardi 15 h ou jeudi 10 h 30 ? » plutôt que « quand êtes-vous disponible ? ». On choisit plus facilement entre deux options qu’on ne cherche dans son agenda.",
  },
  {
    title: "Préparez la fiche avant de composer",
    detail:
      "Trente secondes suffisent : nom du gérant, note et avis Google, site ou pas, historique des contacts. Vous devez avoir un constat précis prêt à dire.",
  },
  {
    title: "Notez pendant l’appel",
    detail:
      "Le prénom de la personne qui décroche, le bon moment pour rappeler, le mot exact qu’il emploie pour son problème. Ce qui n’est pas noté est perdu.",
  },
  {
    title: "Une seule idée par appel",
    detail:
      "Vous appelez pour un audit, pas pour présenter le site, la carte NFC, la fidélité et les réseaux sociaux. Une idée claire se retient, cinq se mélangent.",
  },
  {
    title: "Raccrochez proprement",
    detail:
      "Même après un non, remerciez et souhaitez une bonne journée. Laissez-le raccrocher en premier. Vous recroiserez peut-être ce commerçant dans la rue.",
  },
];

export const compliance: { title: string; points: string[] }[] = [
  {
    title: "Prospection B2B",
    points: [
      "Appeler un professionnel pour lui proposer un service en lien avec son activité est autorisé : c’est le cas quand on parle de la visibilité de son commerce.",
      "Privilégiez toujours le numéro professionnel : celui de la fiche Google, de la devanture ou du site du commerce.",
      "Présentez-vous clairement dès le début : votre prénom, MJAGENCY, et la raison de l’appel.",
      "S’il demande à ne plus être appelé, notez-le immédiatement dans l’app et ne le rappelez plus, ni vous ni votre associé.",
    ],
  },
  {
    title: "Bloctel",
    points: [
      "Bloctel est la liste d’opposition au démarchage téléphonique des consommateurs, c’est-à-dire des particuliers.",
      "Une ligne de commerce n’est en principe pas concernée, mais un micro-entrepreneur, un artisan ou un indépendant joignable sur son portable personnel peut être considéré comme un particulier sur ce numéro.",
      "Les consommateurs inscrits sur Bloctel ne doivent pas être démarchés. En cas de doute sur la nature du numéro, ne l’appelez pas : passez sur place ou utilisez le numéro professionnel.",
      "Si vous deviez un jour appeler des numéros de particuliers, faites d’abord vérifier votre liste auprès de Bloctel ; sans cette vérification, abstenez-vous.",
    ],
  },
  {
    title: "Créneaux et fréquence",
    points: [
      "Pour les consommateurs, le démarchage téléphonique n’est permis que les jours ouvrables, de 10 h à 13 h et de 14 h à 20 h.",
      "Pas d’appel de prospection le samedi, le dimanche ni les jours fériés pour les consommateurs.",
      "Au maximum 4 appels par période de 30 jours à une même personne, et pas de nouvelle sollicitation pendant un certain temps après un refus clair.",
      "Par prudence et par respect, appliquez le même bon sens aux professionnels : pas plus de 4 appels par mois au même commerce, et jamais pendant ses heures de rush.",
    ],
  },
  {
    title: "RGPD",
    points: [
      "Vous pouvez contacter un professionnel sur la base de l’intérêt légitime, à condition que la démarche concerne son activité.",
      "Au premier contact, informez-le de qui vous êtes et de son droit de s’opposer à être recontacté : c’est le rôle de la mention STOP dans le premier SMS.",
      "Sur simple demande, supprimez ses données de l’app et confirmez-lui que c’est fait.",
      "Conservez les données d’un prospect au maximum 3 ans après votre dernier contact avec lui ; au-delà, supprimez-les.",
      "Ne notez que ce qui sert la relation commerciale : pas de remarques sur sa santé, sa vie privée ou des jugements personnels.",
    ],
  },
];

export type CallOutcome = "pas_de_reponse" | "messagerie" | "barrage" | "refus" | "rappel" | "rdv";

export const outcomes: { id: CallOutcome; label: string; hint: string }[] = [
  {
    id: "pas_de_reponse",
    label: "Pas de réponse",
    hint: "Ça sonne dans le vide ou c’est occupé. On retente au même créneau, puis on en change.",
  },
  {
    id: "messagerie",
    label: "Messagerie",
    hint: "Répondeur : message de 25 secondes maximum, puis SMS dans la foulée.",
  },
  {
    id: "barrage",
    label: "Barrage",
    hint: "Secrétaire, conjoint ou employé. Notez son prénom et le moment conseillé pour rappeler.",
  },
  {
    id: "refus",
    label: "Refus",
    hint: "Non clair du décisionnaire. On remercie, on note la raison, relance douce dans trois mois au plus tôt.",
  },
  {
    id: "rappel",
    label: "Rappel",
    hint: "Il demande à être rappelé. Fixez le jour et l’heure avec lui et tenez-les à la minute.",
  },
  {
    id: "rdv",
    label: "RDV",
    hint: "Audit fixé. Récapitulez, envoyez la confirmation par SMS, puis le rappel la veille.",
  },
];

export const followUpRules: {
  outcome: CallOutcome;
  afterCount: number;
  action: string;
  delayDays: number;
  smsScriptId?: string;
  changeSlot?: boolean;
}[] = [
  { outcome: "pas_de_reponse", afterCount: 1, action: "Réessayer au même créneau", delayDays: 2 },
  { outcome: "pas_de_reponse", afterCount: 3, action: "Changer de créneau", delayDays: 3, changeSlot: true },
  { outcome: "pas_de_reponse", afterCount: 4, action: "Passer sur place plutôt que rappeler", delayDays: 5 },
  {
    outcome: "messagerie",
    afterCount: 1,
    action: "SMS envoyé, rappeler",
    delayDays: 3,
    smsScriptId: "sms-apres-messagerie",
  },
  { outcome: "messagerie", afterCount: 2, action: "Rappeler à un autre créneau", delayDays: 4, changeSlot: true },
  { outcome: "messagerie", afterCount: 3, action: "Passer sur place", delayDays: 5 },
  { outcome: "barrage", afterCount: 1, action: "Rappeler au moment conseillé par le barrage", delayDays: 1 },
  { outcome: "barrage", afterCount: 3, action: "Passer sur place pour rencontrer le gérant", delayDays: 3 },
  { outcome: "rappel", afterCount: 1, action: "Rappel demandé", delayDays: 0 },
  {
    outcome: "refus",
    afterCount: 1,
    action: "Relance douce",
    delayDays: 90,
    smsScriptId: "sms-relance-douce",
  },
  {
    outcome: "rdv",
    afterCount: 1,
    action: "SMS de confirmation la veille",
    delayDays: 0,
    smsScriptId: "sms-confirmation-rdv",
  },
];

export const sessionTips: string[] = [
  "Préparez votre liste avant de commencer : 15 à 20 numéros d’un même métier, fiches relues, pour ne pas chercher entre deux appels.",
  "Choisissez le créneau calme du métier appelé : un restaurateur vers 15 h, un commerçant en milieu de matinée, jamais pendant le rush.",
  "Coupez les notifications, installez-vous debout avec de l’eau, et faites le premier appel à un prospect déjà chaud pour vous mettre en voix.",
  "Enchaînez sans pause entre les appels : notez le résultat dans l’app en 20 secondes, puis composez le suivant tout de suite.",
  "Après un refus sec, respirez dix secondes et passez au suivant : le prochain commerçant n’a rien à voir avec le précédent.",
  "Visez un objectif réaliste : sur 45 minutes, une quinzaine d’appels et quelques vraies conversations, c’est une bonne séance. Un rendez-vous, c’est une très bonne séance.",
  "Terminez par cinq minutes de nettoyage : SMS envoyés, rappels programmés, notes relues. Une séance non débriefée est à moitié perdue.",
];
