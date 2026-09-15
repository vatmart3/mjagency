# MJ Agency — « Du mail au planning »

Séquence animée en HTML/CSS/JS : un mail de demande de devis qui devient
fiche client, devis, signature, planning, automatisations et tableau de
bord — sans une seule ressaisie.

Ouvrir `motion/index.html`, ou `https://www.mjagency.eu/motion` une fois
en ligne. `Espace` ou `Entrée` rejoue la séquence, comme le bouton en bas
à droite.

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
| 15,3 | Envoi. Le devis s'efface à gauche, le téléphone du client entre |
| 16,9 | Devis accepté, notification verte |
| 18,6 | Planning de la semaine, la pose tombe au mardi 13 |
| 20,7 | Les cinq automatisations s'enchaînent, reliées entre elles |
| 23,8 | Tableau de bord : 18 devis envoyés, 11 acceptés, 7 chantiers, 0 ressaisie |
| 28,0 | Signature MJ Agency |

## Plein écran, vraiment

`motion.js` donne à la scène l'exacte proportion de la fenêtre, puis
l'agrandit. L'échelle est choisie pour qu'il reste toujours au moins
1 240 × 720 d'espace de dessin : le décor s'étale jusqu'aux bords, rien
n'est rogné, aucune bande noire, aucune déformation.

Sur un écran **tactile** tenu debout — téléphone, tablette — la scène
pivote d'un quart de tour : couchée sur un écran debout, elle ne
remplirait qu'un bandeau au milieu. La condition exclut les écrans à
souris, pour qu'une fenêtre de navigateur étroite ne bascule jamais.
Elle tient en une ligne de `fit()` (`COARSE && vh > vw * 1.15`) ; la
mettre à `false` supprime la rotation.

## Direction artistique

La charte MJ Agency, en version nuit : `#0071E3` en accent, pile
typographique système (SF Pro), unité de 8 px, coins arrondis, ombres
douces. La profondeur vient du fond de la scène — grain, vignette,
lueur bleue, nuit de base — et d'une poussière qui monte lentement.

## Fluidité

Tout le décor est peint **une seule fois**, dans le fond de `.stage` :
sept couches de `background-image` plutôt que quatre calques empilés.
Chaque calque plein écran coûtait un passage de composition par image,
et la première version en empilait quatre, plus un `backdrop-filter` sur
chaque panneau. Résultat mesuré en 1920 × 1080, rendu logiciel :

| | images / s |
|---|---|
| première version | 6,1 |
| sans `backdrop-filter` ni grain animé | 21,6 |
| décor plié dans le fond (état actuel) | **46,9** |

Les règles qui en découlent, si la séquence doit évoluer :

- pas de `backdrop-filter` — les panneaux sont opaques à 90 %, ce qui
  donne le même rendu sur un fond en dégradé ;
- pas de `filter: blur()` sur un élément qui se déplace ;
- un calque plein écran de plus se paie à chaque image : le mettre dans
  le fond de `.stage` s'il est fixe ;
- `will-change: transform, opacity` sur ce qui bouge, et rien d'autre.

## Comment c'est fait

Trois fichiers, aucune dépendance ni étape de build.

- `index.html` — le décor complet, tous plans confondus. Rien n'est créé
  en cours de route sauf les étiquettes volantes.
- `motion.css` — tous les états sont des classes (`.in`, `.show`, `.on`,
  `.gone`), toutes les apparitions des transitions. La caméra n'applique
  que des translations et une échelle uniforme : c'est cette contrainte
  qui rend le calcul des vols exact.
- `motion.js` — une partition : une liste `[seconde, action]`, relue à
  chaque image par une **horloge unique** plutôt que par une trentaine de
  minuteurs posés au lancement. Trois choses en découlent : si une image
  saute, les repères suivants restent à l'heure au lieu de dériver les
  uns par rapport aux autres ; dans un onglet en arrière-plan l'horloge
  se met en pause et reprend au retour, au lieu de jouer toute la
  séquence d'un bloc ; un rejeu remet le compteur à zéro sans laisser
  traîner de minuteur en retard. `flyOne()` mesure la position de départ
  dans le mail et celle d'arrivée dans le champ, en coordonnées de scène,
  et anime une étiquette — doublée d'une traîne floutée — de l'une à
  l'autre.

Ce qui survit d'une lecture à l'autre — compteurs qui montent,
atterrissage des étiquettes — porte le numéro de sa lecture et expire
tout seul quand on rejoue.

`prefers-reduced-motion` coupe la poussière et joue la séquence en
accéléré.
