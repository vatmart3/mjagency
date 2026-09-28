import type { TemperatureLevel, Temperature } from "./types";

/**
 * Thermomètre d’intérêt : de Glacé à Brûlant.
 * Il sert à une seule chose : faire la bonne action au bon moment,
 * sans forcer un prospect froid ni laisser filer un prospect chaud.
 */
export const temperatures: TemperatureLevel[] = [
  {
    id: "glace",
    name: "Glacé",
    verbal: [
      "« Ça ne m’intéresse pas. »",
      "« On ne veut pas de démarcheurs. »",
      "Répond par monosyllabes : « Non. », « Ouais. », « Peut-être. »",
      "« J’ai pas le temps, là. »",
      "« Laissez-moi tranquille. »",
    ],
    nonVerbal: [
      "Ne lève pas les yeux, continue à servir ou à ranger.",
      "Reste derrière le comptoir, bras croisés, corps tourné vers ailleurs.",
      "Soupire, regarde la porte ou sa montre.",
      "Ne prend pas la carte que vous tendez, ou la pose sans la regarder.",
      "Visage fermé, aucun sourire en retour.",
    ],
    phone: [
      "Ton sec, voix basse ou agacée dès les premiers mots.",
      "Aucune question posée, il ne parle que pour couper.",
      "Il parle moins de 10 % du temps, ou coupe au bout de quelques secondes.",
      "« Vous avez eu mon numéro comment ? » sur un ton de reproche.",
    ],
    action: "Ne pas insister. Remerciez, laissez éventuellement une carte si elle est acceptée, et sortez proprement en moins de 20 secondes. Notez le contexte : ce n’était peut-être pas le bon moment, pas la bonne personne.",
    line: "Pas de souci, je ne vous dérange pas plus. Bonne fin de journée.",
  },
  {
    id: "froid",
    name: "Froid",
    verbal: [
      "« Envoyez-moi un mail. »",
      "« On a déjà quelqu’un. »",
      "« C’est pas le moment, on est en pleine saison. »",
      "« Mes clients me connaissent, j’ai pas besoin de ça. »",
      "« Laissez une plaquette. »",
    ],
    nonVerbal: [
      "Écoute d’une oreille, en faisant autre chose.",
      "Garde la distance, reste de profil.",
      "Regard poli mais qui décroche vite.",
      "Prend votre carte mais la pose sur le comptoir sans la lire.",
    ],
    phone: [
      "Ton neutre, poli mais pressé.",
      "Répond aux questions sans en poser.",
      "Réponses courtes, il parle à peine un tiers du temps.",
      "Cherche à clore : « bon, écoutez… », « envoyez-moi ça ».",
    ],
    action: "Semer une graine, pas vendre. Laissez un seul constat précis et utile sur son commerce (sa fiche Google, ses avis), sans rien demander en échange. Proposez au maximum de lui envoyer ce constat par SMS, et rappelez dans quelques semaines.",
    line: "Je vous laisse juste une chose à regarder : tapez {commerce} sur Google, comme un client. Si vous voulez, je vous envoie par SMS ce que j’y ai remarqué, sans engagement.",
  },
  {
    id: "tiede",
    name: "Tiède",
    verbal: [
      "« Ah oui ? Montrez-moi. »",
      "« Et ça coûte combien, ce genre de truc ? »",
      "« Mon neveu devait s’en occuper, mais bon… »",
      "« C’est vrai qu’on a quelques mauvais avis. »",
      "« Ça m’intéresse, mais pas tout de suite. »",
    ],
    nonVerbal: [
      "Lève les yeux, s’arrête de faire ce qu’il faisait.",
      "Regarde votre téléphone quand vous montrez quelque chose.",
      "Tête légèrement penchée, expression curieuse.",
      "Prend votre carte et la lit.",
      "Commence à poser les mains sur le comptoir, face à vous.",
    ],
    phone: [
      "Ton qui se détend après la première minute.",
      "Pose une ou deux questions : « c’est quoi, votre audit ? ».",
      "Parle à peu près autant que vous.",
      "Accepte de rester en ligne au-delà de 2 minutes.",
    ],
    action: "Proposer l’audit gratuit. C’est le bon moment pour une question qui fait parler (ses clients, sa saison, ses avis), puis pour proposer les 20 minutes d’audit avec deux créneaux précis. Pas de prix détaillé ici.",
    line: "Le plus simple, c’est que je vous fasse l’audit gratuit : 20 minutes, je vous montre ce que voient vos clients sur Google. Mardi 15 h ou jeudi 10 h 30 ?",
  },
  {
    id: "chaud",
    name: "Chaud",
    verbal: [
      "« Vous pouvez faire quoi, pour moi, exactement ? »",
      "« Et ça prendrait combien de temps ? »",
      "« Vous avez des exemples de ce que vous avez fait ? »",
      "« C’est combien par mois ? »",
      "« Il faudrait que j’en parle à mon associé. »",
    ],
    nonVerbal: [
      "Se penche en avant, hoche la tête.",
      "Vous montre spontanément son site, son Instagram ou sa fiche Google.",
      "Vous propose un café ou de vous asseoir.",
      "Prend des notes ou photographie votre écran.",
      "Appelle un associé ou son conjoint pour qu’il écoute.",
    ],
    phone: [
      "Ton engagé, il pose des questions précises.",
      "Parle plus que vous, raconte sa situation.",
      "Demande les étapes, les délais, les exemples.",
      "Propose lui-même un moment pour se voir.",
    ],
    action: "Fixer le rendez-vous, maintenant. Deux créneaux précis, noter le prénom de chaque décideur, confirmer par SMS dans la foulée. S’il demande le prix, donnez une fourchette honnête et renvoyez le détail au rendez-vous.",
    line: "On se pose 30 minutes pour regarder ça ensemble, avec la personne qui décide avec vous si besoin. Mardi 15 h ou jeudi 10 h 30 ?",
  },
  {
    id: "brulant",
    name: "Brûlant",
    verbal: [
      "« On commence quand ? »",
      "« Il vous faut quoi de ma part ? »",
      "« Ok, on fait comme ça. »",
      "« Vous prenez la carte ou il faut un virement ? »",
      "« Et pour la carte NFC, vous l’apportez quand ? »",
    ],
    nonVerbal: [
      "Sort son agenda ou son téléphone pour caler une date.",
      "Parle au futur : « quand le site sera en ligne… ».",
      "Détendu, souriant, il plaisante avec vous.",
      "Présente le décideur ou l’associé avec enthousiasme.",
      "Vous raccompagne jusqu’à la porte en continuant à parler du projet.",
    ],
    phone: [
      "Ton enthousiaste, rythme rapide.",
      "Questions de mise en œuvre : paiement, accès, délais.",
      "Il mène la conversation, vous n’avez plus qu’à répondre.",
      "Demande le devis ou le lien de paiement tout de suite.",
    ],
    action: "Conclure. Arrêtez d’argumenter : récapitulez ce qui est décidé, donnez le prix et les modalités clairement, et fixez le premier pas concret (signature, acompte, date de livraison). Continuer à vendre à ce stade, c’est prendre le risque de le refroidir.",
    line: "Parfait. Je récapitule : fiche Google et carte NFC, avec la date de livraison écrite dans le devis. Je vous envoie le devis ce soir, et je repasse lundi pour la carte.",
  },
];

/**
 * Convertit la chaleur cumulée des signaux en niveau de température.
 * <= -4 glacé, -3..-1 froid, 0..2 tiède, 3..5 chaud, >= 6 brûlant.
 */
export function heatToTemperature(heat: number): Temperature {
  if (heat <= -4) return "glace";
  if (heat < 0) return "froid";
  if (heat < 3) return "tiede";
  if (heat < 6) return "chaud";
  return "brulant";
}
