# « Du mail au planning » — motion design

Reproduction, en HTML/CSS/JS, de la séquence animée filmée sur la vidéo
de référence : un mail de demande de devis qui se transforme en fiche
client, devis, signature, planning et facturation, sans ressaisie.

Ouvrir `motion/index.html`, ou `https://…/motion` une fois en ligne.
`Espace` ou `Entrée` rejoue la séquence, comme le bouton en bas à droite.

## La séquence — 32 s

| s | Plan |
|---|---|
| 0,1 | Boîte de réception, quatre mails qui se posent l'un après l'autre |
| 2,6 | Le mail de Martin Leroy s'ouvre, ligne à ligne |
| 4,5 | Badge « IA · lecture du mail… », les six données s'allument dans le texte |
| 6,3 | Le mail recule, la fenêtre de l'outil entre par la droite |
| 7,6 | Les six données s'envolent et se posent dans les champs de la fiche |
| 9,6 | « Créé automatiquement », étiquette prospect, journal horodaté |
| 11,4 | Devis N° 2026-0142 : trois lignes, puis le total qui grimpe à 9 561,20 € |
| 15,3 | Envoi. Le téléphone du client arrive, le devis est accepté |
| 17,8 | Notification verte, passage au planning, la pose se pose au mardi 13 |
| 20,7 | Les cinq automatisations s'enchaînent, reliées entre elles |
| 23,8 | Tableau de bord : compteurs, dont « Ressaisies : 0 » |
| 28,0 | Signature — « Du mail au planning, sans rien ressaisir. » |

## Comment c'est fait

Trois fichiers, aucune dépendance ni étape de build.

- `index.html` — le décor complet, tous plans confondus. Rien n'est créé
  en cours de route sauf les étiquettes volantes.
- `motion.css` — la scène mesure 1280 × 720 ; tous les états sont des
  classes (`.in`, `.show`, `.on`, `.gone`) et toutes les apparitions des
  transitions. La caméra n'applique que des translations et une échelle
  uniforme : c'est ce qui rend le calcul des vols exact.
- `motion.js` — une partition : une liste `[seconde, action]` posée en
  `setTimeout` au lancement. `flyOne()` mesure la position de départ dans
  le mail et celle d'arrivée dans le champ, en coordonnées de scène, et
  anime une étiquette de l'une à l'autre.

La scène est mise à l'échelle par `transform: scale()` sur `#stage`, donc
elle occupe toujours la fenêtre sans jamais se déformer. `prefers-reduced-
motion` coupe la poussière et la respiration du fond, et accélère la
séquence.

La police est Poppins, chargée depuis Google Fonts ; sans elle, la pile
système prend le relais sans casser la mise en page.
