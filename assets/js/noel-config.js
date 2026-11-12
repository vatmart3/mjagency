/* =========================================================
   MJ AGENCY — Configuration du thème de Noël

   TOUT ce qui se règle d'une année sur l'autre est ici. Pour rejouer la
   saison prochaine, il suffit de changer les dates et l'année de
   l'échéance ci-dessous : aucun autre fichier n'a besoin d'être touché.

   Pour retirer le thème définitivement : supprimer assets/js/noel.js,
   assets/js/noel-config.js, assets/css/noel.css, la page offre-noel.html,
   et le bloc « AMORCE DU THÈME DE NOËL » dans le <head> des pages. Le site
   revient exactement à son état d'origine.
   ========================================================= */
window.MJ_NOEL = {

  /* ---------------- Période d'activation ----------------
     Dates de calendrier en heure de Paris, bornes incluses. Le thème
     s'allume le 1er décembre à 00:00 et s'éteint le 6 janvier à 23:59. */
  debut: { mois: 12, jour: 1 },    // 1er décembre
  fin:   { mois: 1,  jour: 6 },    // 6 janvier (année suivante)

  /* ---------------- Échéance de l'offre ----------------
     Instant exact du compte à rebours. Le décalage +01:00 est celui de
     Paris en décembre (CET) : l'heure d'été ne commence qu'en mars, donc
     il n'y a pas d'ambiguïté à l'écrire en dur. */
  echeance: '2026-12-31T23:59:00+01:00',
  echeanceTexte: '31 décembre 2026',

  /* ---------------- Places de janvier ----------------
     Le seul chiffre à tenir à jour pendant l'opération. Il s'affiche dans
     le bandeau, le hero et la mention légale de l'offre. */
  places: 4,

  /* ---------------- Réglages ---------------- */
  neigeParDefaut: true,    // la neige tombe-t-elle à l'arrivée ?
  sonParDefaut: false,     // les grelots : désactivés par défaut, comme demandé
  flocons: { bureau: 140, mobile: 60 },   // plafonds de particules

  /* ---------------- Liens ---------------- */
  lienDevis:      'contact.html#booking',
  lienCalendrier: 'offre-noel.html#calendrier',
  lienOffre:      'offre-noel.html',
  lienInstagram:  'https://www.instagram.com/mjagency.eu/',

  /* =========================================================
     LES 24 CASES DU CALENDRIER DE L'AVENT

     Un conseil par jour, concret, applicable le jour même par un
     commerçant du bassin de Thau. Pas de généralités : chaque case dit
     quoi faire, pas pourquoi c'est important.

     bonus: true  → case cadeau (8, 16 et 24), fond doré et offre réelle.
     ========================================================= */
  cases: [
    { j: 1,  titre: 'Vos horaires de fêtes sur Google',
      conseil: 'C’est la première chose qu’un client vérifie le 24 à 17 h. Une fiche qui annonce « ouvert » alors que le rideau est baissé, c’est un client perdu et souvent un avis en moins.',
      action: 'Ouvrez votre fiche Google Business, section Horaires, et déclarez les horaires exceptionnels du 24, 25, 31 et 1er.' },

    { j: 2,  titre: 'Trois photos récentes, pas trois ans',
      conseil: 'Google met en avant les fiches dont les photos bougent. Et une devanture datée de 2023 donne l’impression d’un commerce qui a fermé.',
      action: 'Publiez trois photos prises cette semaine : la devanture éclairée, un produit, et l’intérieur.' },

    { j: 3,  titre: 'Répondez à tous les avis, même les bons',
      conseil: 'Un avis sans réponse, c’est une conversation qu’on laisse tomber devant tout le monde. Google valorise les fiches où le commerçant répond.',
      action: 'Remontez à vos dix derniers avis et répondez à chacun en deux lignes, avec le prénom de la personne.' },

    { j: 4,  titre: 'Le bon moment pour demander un avis',
      conseil: 'Ce n’est pas au moment de payer. C’est juste après le compliment — quand le client vous dit que c’était bien.',
      action: 'Préparez une phrase courte à dire à ce moment-là, et testez-la trois fois aujourd’hui.' },

    { j: 5,  titre: 'Une publication Google par semaine',
      conseil: 'La section Actualités de votre fiche est vide chez 9 commerçants sur 10. Elle s’affiche pourtant directement dans les résultats de recherche.',
      action: 'Publiez votre offre de fin d’année en photo, avec une date de fin. Comptez trois minutes.' },

    { j: 6,  titre: 'Votre numéro doit être cliquable',
      conseil: 'Sur un téléphone, un numéro écrit en texte oblige à le recopier. La moitié des gens abandonnent là.',
      action: 'Vérifiez que le numéro de votre site s’appelle en un toucher. Sinon, dites-le-nous, c’est une ligne de code.' },

    { j: 7,  titre: 'Le poids de vos photos',
      conseil: 'Une photo sortie du téléphone pèse 4 Mo. Sur le réseau du port un jour de marché, la page ne s’affiche jamais.',
      action: 'Avant de publier, passez vos images en 1 600 px de large maximum. Votre site doit s’ouvrir en moins de 2 secondes.' },

    { j: 8,  titre: 'Votre fiche Google passée au crible',
      conseil: 'Catégorie principale, zone desservie, attributs, photos, questions : six points qui décident si vous sortez ou non dans « près de moi ».',
      action: 'On regarde votre fiche et on vous renvoie les corrections à faire, classées par impact. Offert, et sans suite commerciale.',
      bonus: true, bonusTitre: 'Audit de votre fiche Google, offert' },

    { j: 9,  titre: 'La bio Instagram qui sert à quelque chose',
      conseil: 'Trois informations suffisent : ce que vous vendez, où vous êtes, comment on vous joint. Le reste est du décor.',
      action: 'Réécrivez votre bio en une ligne, et mettez un vrai lien vers votre site — pas vers une page de liens.' },

    { j: 10, titre: 'Les stories à la une, votre vitrine',
      conseil: 'Un nouveau visiteur regarde les bulles avant les publications. S’il n’y a rien, il part.',
      action: 'Créez trois bulles : Horaires, Produits, Où nous trouver. Une photo chacune, c’est suffisant pour commencer.' },

    { j: 11, titre: 'Le point exact sur la carte',
      conseil: 'Beaucoup de fiches pointent au milieu de la rue, parfois dans l’eau. Le client tourne, s’agace, et ne vient pas.',
      action: 'Dans Google Business, faites glisser le repère pile sur votre porte, puis vérifiez l’itinéraire depuis chez vous.' },

    { j: 12, titre: 'Activez la messagerie de votre fiche',
      conseil: 'Une question posée est un client déjà intéressé. Sans messagerie, il va la poser au commerce d’à côté.',
      action: 'Activez les messages dans Google Business et branchez les notifications sur votre téléphone.' },

    { j: 13, titre: 'Cinq secondes pour comprendre',
      conseil: 'Ouvrez votre page d’accueil sur un téléphone. Sans faire défiler, on doit savoir ce que vous vendez et où.',
      action: 'Si ce n’est pas le cas, le titre est à réécrire. Un bon titre dit le métier et la ville.' },

    { j: 14, titre: 'Écrivez le nom de votre ville',
      conseil: '« Poissonnerie » ne vous situe nulle part. « Poissonnerie à Sète » vous place sur la carte, pour Google comme pour le lecteur.',
      action: 'Ajoutez votre ville dans le titre de la page d’accueil et dans deux ou trois titres de sections.' },

    { j: 15, titre: 'Commander ou réserver en deux gestes',
      conseil: 'Chaque étape en plus fait tomber la moitié des gens. Un formulaire en six champs ne sert à personne.',
      action: 'Comptez les clics entre votre page d’accueil et la commande. Au-delà de trois, il y a du gras à enlever.' },

    { j: 16, titre: 'Votre carte NFC d’avis Google',
      conseil: 'Une carte posée près de la caisse : le client approche son téléphone, l’avis s’ouvre. C’est ce qui transforme une bonne journée en avis écrit.',
      action: 'On vous l’offre, configurée sur votre fiche, pour toute signature avant le 31 décembre.',
      bonus: true, bonusTitre: 'Carte NFC d’avis offerte' },

    { j: 17, titre: 'Publiez quand vos clients regardent',
      conseil: 'Pour un commerce du bassin, c’est le matin avant l’ouverture et le soir vers 19 h. Pas à 15 h un mardi.',
      action: 'Regardez vos statistiques Instagram, onglet Audience, et calez vos deux prochaines publications dessus.' },

    { j: 18, titre: 'Testez votre site avec le pouce',
      conseil: 'Huit visiteurs sur dix sont sur mobile, debout, à une main. Un bouton trop petit ou trop bas ne sera jamais pressé.',
      action: 'Parcourez votre site d’une seule main. Tout ce que vous ratez du pouce est à corriger.' },

    { j: 19, titre: 'Trois produits, trois photos',
      conseil: 'On n’achète pas une liste. On achète ce qu’on voit.',
      action: 'Choisissez vos trois meilleures ventes et photographiez-les à la lumière du jour, fond neutre.' },

    { j: 20, titre: 'Dites où vous livrez',
      conseil: 'Sète, Frontignan, Balaruc, Mèze : si ce n’est pas écrit, le client suppose que non et referme la page.',
      action: 'Ajoutez une ligne « Nous livrons à… » visible sans faire défiler, et la même information sur votre fiche Google.' },

    { j: 21, titre: 'Les questions de votre fiche',
      conseil: 'N’importe qui peut poser une question sur votre fiche — et n’importe qui peut y répondre à votre place.',
      action: 'Posez vous-même les cinq questions qu’on vous pose tous les jours, et répondez-y. Parking, horaires, paiement, accès, livraison.' },

    { j: 22, titre: 'Gardez le contact avec vos clients',
      conseil: 'Vos clients fidèles sont votre meilleur canal, et il ne coûte rien. Encore faut-il avoir leur adresse.',
      action: 'Mettez un carnet près de la caisse et commencez à recueillir les emails, avec leur accord écrit.' },

    { j: 23, titre: 'Le même nom partout',
      conseil: 'Nom, adresse, téléphone : la moindre variation entre votre site, votre fiche Google et les annuaires fait baisser votre position locale.',
      action: 'Comparez les trois, au caractère près. « 12 rue » et « 12, rue » comptent comme deux adresses différentes.' },

    { j: 24, titre: 'Votre site, un mois pour le refaire',
      conseil: 'Janvier est le mois le plus calme de l’année pour un commerce. C’est le seul moment où refaire son site ne coûte pas de chiffre d’affaires.',
      action: 'Réservez votre créneau de janvier avant ce soir minuit. Le coffret de livraison vous attend.',
      bonus: true, bonusTitre: 'Mise en ligne prioritaire en janvier' },
  ],

  /* ---------------- Les cinq questions de la page offre ---------------- */
  faq: [
    { q: 'Quels sont les délais si je signe en décembre ?',
      r: 'Nous démarrons la première semaine de janvier et mettons en ligne sous trois à quatre semaines pour un site vitrine, six à huit pour une boutique en ligne. Le délai court à partir du moment où nous avons vos textes et vos photos — c’est presque toujours là que les projets prennent du retard, et nous vous accompagnons pour les réunir.' },
    { q: 'Qu’est-ce qui est compris dans l’offre ?',
      r: 'La conception et la création du site, les fondations du référencement local, la mise en ligne et la formation pour que vous soyez autonome. S’y ajoutent, pour toute signature avant le 31 décembre : la carte NFC d’avis Google, le coffret de livraison, et le passage en priorité sur le planning de janvier.' },
    { q: 'Comment se passe le paiement ?',
      r: 'Virement, chèque ou carte. Pour un site vitrine, 30 % à la signature du devis et le solde à la mise en ligne. Pour une boutique ou une refonte complète, en trois versements. Une facture accompagne chaque versement et nous ne mettons aucun prélèvement automatique en place.' },
    { q: 'Que se passe-t-il si je signe après le 31 décembre ?',
      r: 'Le tarif ne change pas : ce n’est pas une remise, c’est une offre de lancement d’année. Vous perdez en revanche les trois cadeaux et la priorité sur le planning de janvier, qui se remplit dans l’ordre des signatures.' },
    { q: 'Vous déplacez-vous jusqu’à chez moi ?',
      r: 'Oui, sans frais, à Sète, Frontignan, Balaruc-les-Bains, Mèze, Marseillan et Montpellier. Voir votre local, vos produits et votre façon de travailler change tout au moment de concevoir le site. Partout ailleurs, nous travaillons entièrement à distance.' },
  ],
};
