# MJ Agency — séquences animées

Deux films, un moteur commun. HTML/CSS/JS, aucune dépendance, aucune
étape de build. `Espace` ou `Entrée` rejoue, comme le bouton en bas à
droite.

| | |
|---|---|
| `index.html` | **Du mail au planning** — un mail de demande de devis devient fiche client, devis, signature, planning, automatisations et tableau de bord, sans une seule ressaisie. |
| `fidelite/` | **La carte de fidélité** — le code scanné en caisse, le montant tapé au pavé, les points qui tombent sur le téléphone du client. |

```
motion/
  engine.js     moteur commun  — échelle plein écran, horloge, poussière,
                                 compteurs, vol d'une donnée d'un point à l'autre
  stage.css     décor commun   — scène, caméra, étiquettes volantes, « Rejouer »
  index.html    film 1         + mjagency.css · mjagency.js
  fidelite/     film 2         + fidelite.css · fidelite.js
  outils/       exportation    — bruitage.py (le son) · rendu.js (la vidéo)
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

# Film 2 — « La carte de fidélité »

Un programme de fidélité vu des deux côtés du comptoir. Le film suit un
seul achat, du code scanné aux points crédités. Rien n'y désigne une
enseigne : c'est « Votre commerce », comme le premier film montre
« Votre outil ».

## La séquence — 31 s

| s | Plan |
|---|---|
| 0,1 | La carte dans le téléphone de la cliente : 1 529 points, statut Ambassadeur, code à scanner |
| 3,0 | La caisse entre par la droite, le téléphone s'écarte |
| 4,4 | « Scanner » : le code s'envole vers le champ, la fiche de Camille Fabre s'ouvre |
| 6,1 | Récompense disponible : 30 € de remise |
| 7,4 | Le montant se compose touche par touche — 4, 2, 5, 0 — en centimes, par la droite |
| 9,4 | Raison de la visite : « Habitué » |
| 11,0 | On encaisse. Les points s'envolent vers la carte : 1 529 → 1 572 |
| 13,4 | Côté cliente : cinq récompenses débloquées, la jauge est pleine |
| 16,2 | Les anniversaires du mois : 50 points offerts en un geste |
| 20,4 | Tableau de bord — et « Pourquoi ils viennent », la mesure qui dit si les SMS rapportent |
| 26,2 | Signature |

Les chiffres se répondent d'un plan à l'autre : 42,50 € encaissés donnent
+43 points, la carte passe de 1 529 à 1 572, les passages de 29 à 30, et
la cliente reparaît au tableau de bord avec 1 672 points cumulés pour
1 629 € d'achats. Le code à scanner est dessiné : un vrai QR encoderait
une adresse qui n'existe pas.

L'interface reste claire, avec l'or pour accent — les points et les
récompenses s'y lisent d'eux-mêmes — posée dans la même nuit que le
premier film.

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

## Quand la machine ne suit pas

Impossible de savoir d'avance ce que tiendra l'ordinateur qui lit le
film. Plutôt qu'un réglage écrit à l'aveugle, `engine.js` mesure les
premières images et retire ce qu'il ne peut pas tenir :

| classe sur `<html>` | ce qui part |
|---|---|
| `eco` (sous ~48 i/s) | la poussière, les traînées derrière les données qui volent, les lueurs les plus larges |
| `eco-2` (sous ~33 i/s) | les mouvements de caméra, le grain et la vignette du fond |

`?eco` ou `?eco=2` dans l'adresse force le niveau, pour comparer sans
attendre la mesure.

## Le son

Chaque film a son bruitage, synthétisé et calé à la seconde sur la même
partition que l'image : `outils/bruitage.py`. Pas de banque de sons, pas
de fichier extérieur — des clics, des souffles, des carillons et un lit
très bas, construits à partir de bruit filtré et de sinusoïdes.

La hiérarchie compte plus que les sons eux-mêmes. Mesurée sur les
mixages finaux, fenêtre de 8 ms :

| | film 1 | film 2 |
|---|---|---|
| le fond, entre deux gestes | −22 dB | *silence* |
| un clic, une touche de pavé | −14 dB | −20 dB |
| une donnée qui se pose, un carillon | −8 dB | −20 dB |
| le choc de la signature | −5 dB | −17 dB |
| sonie intégrée | −16,7 LUFS | −26,9 LUFS |

Les deux films ne sont pas au même niveau, et c'est voulu : le second
n'a **pas de lit sonore** — le bourdon s'y entendait pour lui-même au
lieu de porter les bruitages — et il est mixé moitié plus bas. Seuls les
gestes sonnent, le reste est silencieux.

Deux pièges rencontrés en chemin : un lit trop haut masque les clics —
il a fallu le descendre de huit décibels sur le premier film ; et un
souffle d'entrée doit **enfler** jusqu'à l'arrivée, alors qu'une
enveloppe décroissante le fait mourir avant d'arriver, six décibels sous
le lit, c'est-à-dire inaudible.

## Exporter le film en vidéo

Le détail est dans `outils/README.md`. En résumé, trois pièges :
l'enregistreur du navigateur ne capte que **25 images par seconde**, la
fenêtre réelle ne fait pas la taille demandée (d'où une bande grise en
bas de l'image), et l'enregistrement commence avant le film.

La parade : jouer le film au quart de sa vitesse — transitions CSS
comprises — imposer les dimensions, retenir le départ, puis accélérer au
montage. Mesuré sur un passage en mouvement continu, images distinctes
par seconde :

| | film 1 | film 2 |
|---|---|---|
| captation directe, 25 i/s étirée à 30 | 20,4 | 20,4 |
| ralenti ×4, rendu à 60 i/s | **47,2** | **41,6** |

Ralentir davantage (×8) n'apporte rien : le plafond vient alors du rendu
de la machine qui filme, plus de la méthode.

La synchronisation se vérifie, elle ne se suppose pas : on cherche dans
la vidéo l'instant d'un repère connu — le compteur de points qui se met
à monter, les sous-totaux qui apparaissent — et on recoupe l'amorce
jusqu'à tomber juste. Les deux films sont calés à une image près.

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
