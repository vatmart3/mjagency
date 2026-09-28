/**
 * Encart éthique affiché avec la lecture de l’attitude.
 * Lire les signaux sert à mieux servir le prospect, jamais à le manipuler.
 */
export const ethics: {
  title: string;
  intro: string;
  principles: { title: string; detail: string }[];
  never: string[];
} = {
  title: "Lire pour mieux servir, pas pour manipuler",
  intro:
    "Repérer qu’un commerçant est pressé, méfiant ou curieux, c’est de la politesse professionnelle : ça permet de lui parler comme il aime qu’on lui parle et de ne pas lui faire perdre son temps. Ce n’est pas une technique pour lui faire dire oui malgré lui. Un client qui signe sous la pression, c’est un client qui ne recommande pas MJAGENCY, et sur le bassin de Thau, tout se sait vite.",
  principles: [
    {
      title: "Son temps d’abord",
      detail:
        "S’il est en plein service, qu’il regarde sa montre ou que des clients attendent, on s’efface et on propose de revenir. Un bon moment choisi vaut mieux que dix minutes volées.",
    },
    {
      title: "Un non est une réponse",
      detail:
        "Un prospect glacé ou qui dit clairement non, on le remercie et on sort. On ne rappelle pas quelqu’un qui a demandé à ne plus être dérangé.",
    },
    {
      title: "La vérité, même quand elle ne vend pas",
      detail:
        "Aucun chiffre inventé, aucun résultat garanti qu’on ne maîtrise pas. Si une offre ne lui sert à rien, on le dit, et on lui propose ce qui est vraiment utile, même si c’est gratuit.",
    },
    {
      title: "Le prix clair, au bon moment",
      detail:
        "On ne cache pas le prix, on ne le gonfle pas pour faire une fausse remise. Au téléphone on vend le rendez-vous, en face à face on donne une fourchette honnête, et tout est écrit dans le devis.",
    },
    {
      title: "Le temps de réfléchir",
      detail:
        "S’il veut en parler à son associé, à son conjoint ou dormir dessus, c’est normal. On propose de revenir avec l’autre décideur, pas de décider à sa place.",
    },
    {
      title: "Le profil est une piste, pas une étiquette",
      detail:
        "Fonceur, analytique, relationnel, prudent : ce sont des tendances pour s’adapter, pas des cases. On reste attentif à la personne en face, qui peut changer d’humeur, de rythme ou d’avis.",
    },
  ],
  never: [
    "Inventer une fausse urgence : « offre valable aujourd’hui seulement », « plus que deux places ce mois-ci ».",
    "Annoncer une statistique ou un résultat inventé pour impressionner.",
    "Utiliser une confidence personnelle (famille, santé, difficultés) pour faire pression.",
    "Dénigrer un concurrent ou l’ancien prestataire du commerçant.",
    "Faire signer quelqu’un qui hésite encore ou qui n’a visiblement pas compris ce qu’il achète.",
    "Rester dans la boutique quand on vous a demandé de partir, ou insister devant ses clients.",
    "Rappeler en boucle quelqu’un qui a dit non ou demandé à ne plus être contacté.",
    "Cacher une durée d’engagement, des frais ou un renouvellement dans les petites lignes.",
  ],
};
