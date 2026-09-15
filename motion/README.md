# MJ Agency — séquences animées

Deux films, un moteur commun. HTML/CSS/JS, aucune dépendance, aucune
étape de build. `Espace` ou `Entrée` rejoue, comme le bouton en bas à
droite.

| | |
|---|---|
| `index.html` | **Du mail au planning** — un mail de demande de devis devient fiche client, devis, signature, planning, automatisations et tableau de bord, sans une seule ressaisie. |
| `fidelite/` | **La carte du boucher** — le programme de fidélité de la Boucherie Vatuone : le code scanné en caisse, le montant tapé, les points qui tombent sur le téléphone du client. |

```
motion/
  engine.js     moteur commun  — échelle plein écran, horloge, poussière,
                                 compteurs, vol d'une donnée d'un point à l'autre
  stage.css     décor commun   — scène, caméra, étiquettes volantes, « Rejouer »
  index.html    film 1         + mjagency.css · mjagency.js
  fidelite/     film 2         + fidelite.css · fidelite.js · vatuone.png
```

Un film ne fournit que deux choses au moteur : une **partition**, liste de
`[seconde, ce qui se passe]`, et une **remise à zéro**. Tout le reste —
la mise à l'échelle, l'horloge, les vols — est écrit une fois.

---

# Film 1 — « Du mail au planning »

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
| 15,3 | Envoi. Le devis s'écarte et rapetisse, le téléphone du client entre |
| 16,9 | Devis accepté, notification verte |
| 18,6 | Planning de la semaine, la pose tombe au mardi 13 |
| 20,7 | Les cinq automatisations s'enchaînent, reliées entre elles |
| 23,8 | Tableau de bord : 18 devis envoyés, 11 acceptés, 7 chantiers, 0 ressaisie |
| 28,0 | Signature MJ Agency |

---

# Film 2 — « La carte du boucher »

Le programme de fidélité de la **Boucherie Vatuone** (Sète), réalisé par
MJ Agency. Le film suit un seul achat, du code scanné aux points crédités.

## La séquence — 31 s

| s | Plan |
|---|---|
| 0,1 | La carte dans le téléphone du client : 1 529 points, statut Ambassadeur, code à scanner |
| 3,0 | La caisse entre par la droite, le téléphone s'écarte |
| 4,4 | « Scanner » : le code s'envole vers le champ, la fiche de Mehdi Nasri s'ouvre |
| 6,1 | Récompense disponible : 30 € de remise + le colis du boucher |
| 7,4 | Le montant se compose touche par touche — 4, 2, 5, 0 — en centimes, par la droite |
| 9,4 | Raison de la venue : « Habitué » |
| 11,0 | On encaisse. Les points s'envolent vers la carte : 1 529 → 1 572 |
| 13,4 | Côté client : cinq récompenses débloquées, la jauge est pleine |
| 16,2 | Les anniversaires du mois : 50 points offerts en un geste |
| 20,4 | Tableau de bord — et « Pourquoi ils viennent », la mesure qui dit si les SMS rapportent |
| 26,2 | Signature |

## Ce qui est vrai, et ce qui est mis en scène

L'achat filmé est **celui qui amène réellement** Mehdi Nasri à l'état
qu'affiche l'application : 42,50 €, +43 points, 1 529 → 1 572 points,
29 → 30 passages, et on le retrouve en fin de film dans les meilleurs
clients avec 1 672 points cumulés et 1 629 € d'achats. Les chiffres du
tableau de bord (16 clients, 293 passages, 15 723 € encaissés, 53,66 €
de panier moyen), les récompenses, les statuts et les libellés viennent
du projet lui-même.

Deux choses sont illustratives, parce que le jeu de démonstration ne les
porte pas : les **dates d'anniversaire** (la fonction existe, les dates
non) et le **compte des raisons de venue** — leur total, 288, reste
cohérent avec les 293 passages. Le **code à scanner** est dessiné : un
vrai QR encoderait une adresse qui n'existe pas.

L'interface est montrée telle qu'elle est — claire, rouge et ambre, aux
valeurs exactes de la boutique — posée dans la même nuit que le premier
film.

---

# Ce qui vaut pour les deux

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
| décor plié dans le fond | 46,9 |
| caméra sans changement d'échelle | **57** |
| film 2, mêmes règles dès le départ | **59** |

Puis la caméra a cessé de changer d'échelle : un facteur d'échelle qui
varie oblige à redessiner toute la scène pendant toute la transition,
là où une translation déplace une texture déjà prête. Les plans
inactifs passent en `visibility: hidden` plutôt que d'être seulement
transparents, `optimizeLegibility` disparaît, et l'animation de hauteur
du graphique est confinée par `contain: layout`.

Ce qu'il reste à faire par image, mesuré au protocole DevTools :

| | par image |
|---|---|
| script | 0,04 ms |
| calcul des styles | 0,20 ms |
| mise en page | 0,03 ms |
| **total fil principal** | **0,27 ms** |

Un écran à 120 Hz laisse 8,3 ms par image : il reste trente fois la
marge nécessaire. Le reste du travail est de la composition, faite par
la carte graphique. À noter : le navigateur ne peut pas dépasser le
rafraîchissement de l'écran — 120 images par seconde supposent un écran
à 120 Hz. Le but n'est donc pas d'« atteindre 120 », mais de tenir
largement sous les 8,3 ms, ce qui est le cas.

Les règles qui en découlent, si la séquence doit évoluer :

- pas de `backdrop-filter` — les panneaux sont opaques à 90 %, ce qui
  donne le même rendu sur un fond en dégradé ;
- pas de `filter: blur()` sur un élément qui se déplace ;
- la caméra ne translate, jamais elle ne change d'échelle ;
- un calque plein écran de plus se paie à chaque image : le mettre dans
  le fond de `.stage` s'il est fixe ;
- `will-change: transform, opacity` sur ce qui bouge, et rien d'autre ;
- un élément invisible mais toujours dessiné se paie aussi :
  `visibility: hidden`, pas seulement `opacity: 0`.

## Rien ne doit être tranché par le bord

Deux plans faisaient sortir du texte de l'écran : le mail qui recule et
le devis qui s'écarte pour laisser entrer le téléphone. Les deux
restent désormais entiers dans le cadre — le mail recule en
rapetissant, le devis aussi.

La règle : aux proportions les plus étroites, la scène ne fait que
**1 240 de large**, soit 620 de part et d'autre du centre. Tout élément
visible doit tenir dans cette demi-largeur, échelle de la caméra
comprise. Un détecteur vérifie la séquence entière, à quatre
proportions d'écran, et signale ce qui reste tranché plus d'une
demi-seconde — le passage fugace d'un élément qui entre ou sort ne
compte pas. Il ne signale plus rien.

## Comment c'est fait

- **Le décor** est écrit en entier dans le HTML, tous plans confondus.
  Rien n'est créé en cours de route sauf les étiquettes volantes.
- **Les états sont des classes** (`.in`, `.show`, `.on`, `.gone`), les
  apparitions sont des transitions. La caméra n'applique que des
  translations : c'est cette contrainte qui rend le calcul des vols exact.
- **`engine.js`** relit la partition à chaque image par une **horloge
  unique** plutôt que par une trentaine de minuteurs posés au lancement. Trois choses en découlent : si une image
  saute, les repères suivants restent à l'heure au lieu de dériver les
  uns par rapport aux autres ; dans un onglet en arrière-plan l'horloge
  se met en pause et reprend au retour, au lieu de jouer toute la
  séquence d'un bloc ; un rejeu remet le compteur à zéro sans laisser
  traîner de minuteur en retard.
- **`fly()`** mesure la position de départ et celle d'arrivée en
  coordonnées de scène, ce qui laisse la caméra bouger pendant le vol
  sans décaler l'atterrissage, et anime une étiquette — doublée d'une
  traîne floutée — de l'une à l'autre.

Ce qui survit d'une lecture à l'autre — compteurs qui montent,
atterrissage des étiquettes — porte le numéro de sa lecture et expire
tout seul quand on rejoue.

`prefers-reduced-motion` coupe la poussière et joue la séquence en
accéléré.
