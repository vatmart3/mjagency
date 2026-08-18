# Au Bon Pain — Sète

Site vitrine + commande pour la boulangerie **Au Bon Pain**, 36 rue Paul Bousquet, 34200 Sète.
HTML / CSS / JS purs, aucune dépendance, aucun build, aucune image bitmap.

```
au-bon-pain/
  index.html
  assets/css/style.css   → design system
  assets/js/app.js       → horaires, cadran du four, sac, configurateur, recherche
  assets/fonts/          → Baloo 2 et Nunito, auto-hébergées (SIL OFL, licences incluses)
```

Ouvrir `index.html`, ou servir le dossier : `npx serve .`
En production, la page répond sur `/au-bon-pain/` (`cleanUrls` est déjà actif dans `vercel.json`).

## La direction

Vitrine à bonbons : violet profond, rose vif, jaune de dorure, crème. Tout est rond —
les cartes, les boutons, les pastilles — et les blocs de couleur se relient par des
**coulées de pâte** dessinées en SVG. Chaque carte porte un contour d'encre et une ombre
franche, sans dégradé, dans l'esprit des interfaces « sticker ».

Deux polices, **auto-hébergées** depuis `assets/fonts/`, jamais depuis un CDN :
**Baloo 2** pour les titres et **Nunito** pour le texte, toutes deux sous licence SIL Open
Font (les licences sont dans le dossier). Environ 87 Ko en woff2.

Les seize illustrations, les coulées, les éclats et les décors sont dessinés en SVG ou
peints par le navigateur : aucune photo, aucun droit à payer, page très légère.

> En ouvrant `index.html` directement depuis le disque, la console signale un blocage
> CORS sur le préchargement des polices : c'est une limite du protocole `file://`. Les
> polices s'affichent quand même, et le message disparaît dès que la page est servie en http.

## Ce que le site apporte à une boulangerie

L'information qui compte dans une boulangerie n'est pas « artisan depuis 1930 », c'est
**est-ce ouvert, qu'est-ce qui vient de sortir, et vais-je faire la queue**.

- **La carte du fournil** (héro) — les quatre pastilles parcourent la matinée. À l'arrivée,
  c'est la fournée de l'heure qu'il est qui s'affiche, avec son pain de tête, ses
  caractéristiques et son prix ; ensuite le visiteur choisit.
- **Le cadran du four** — un arc de 7 h à 13 h, l'aiguille à l'heure réelle du visiteur,
  un point par fournée. Au centre : « prochaine fournée dans 24 min », « sorti du four à
  8 h 30 », ou « fermeture dans 20 min » quand la dernière fournée est passée. Rien n'est
  écrit en dur, tout est calculé.
- **« Tout chaud »** — chaque produit porte sa fournée (`data-fournee`). Pendant les
  75 minutes qui suivent, sa carte se signale, et le haut de la carte résume ce qui vient
  de sortir. Le cadran et la carte lisent la même horloge : une seule vérité, deux affichages.
- **La pastille d'état** dans la barre — Ouvert / Ferme bientôt / Fermé, avec l'heure
  exacte, et le jour du jour surligné dans le tableau des horaires.
- **Le sac** — panier persistant (`localStorage`), créneaux de retrait par quart d'heure
  générés depuis les horaires, jamais moins de 20 minutes après maintenant, et report
  automatique au prochain jour ouvré quand la journée est finie.
- **Composez votre sandwich** — quatre étapes, prix en direct, le sandwich se dessine
  pendant qu'on le choisit, et « ce qu'il vous faut » se réécrit à chaque choix.
- **La recherche** (la loupe de la barre) — elle ne mène nulle part : elle filtre la carte
  sur place, sur le nom et la description, et dit combien de produits restent.
- **La barre du sac** — sur téléphone, le total et l'accès au sac restent sous le pouce
  dès qu'il y a quelque chose dedans.

## Les photos

**Le site attend de vraies photos, et il est déjà câblé pour les recevoir.** Déposez les
fichiers dans `assets/img/produits/`, nommés comme l'identifiant du produit
(`tradition.jpg`, `croissant.jpg`…) : rien d'autre à faire, le site les prend au
rechargement. `assets/img/README.md` donne la liste exacte, le format et quelques
conseils de prise de vue.

Tant qu'un fichier manque, la fiche affiche l'illustration dessinée à la main à sa place.
Le visiteur ne voit jamais de vignette cassée — mais il ne voit pas non plus le produit.
**Sur un site de bouche, la photo n'est pas une décoration : c'est l'argument de vente.**
Les seize photos se font en une demi-heure un jour de fournée, avec un téléphone près
d'une fenêtre.

Un mot sur les photos de banque : une baguette trouvée sur une banque d'images est libre
de droits, mais ce n'est pas *votre* baguette. Le client qui vient chercher le pain de la
photo et repart avec un autre s'en aperçoit. À utiliser en dépannage seulement, en notant
source et licence dans `assets/img/README.md`.

## Comment la commande arrive au commerçant

Le site n'a pas de back-end : **il n'y a donc pas de paiement en ligne**. Le bouton
« Envoyer la commande » ouvre l'application SMS du client avec un récapitulatif déjà rédigé
(articles, quantités, créneau, prénom, total), adressé au 04 67 53 59 31. Le paiement se
fait au comptoir. C'est volontaire : c'est ce qui demande le moins de travail au commerçant,
et ça marche dès aujourd'hui, sans abonnement.

Deux évolutions possibles quand le besoin sera là :

1. brancher `#envoyer` sur un service d'e-mail / webhook (Formspree, Vercel Functions…) pour
   recevoir les commandes dans une boîte plutôt qu'en SMS ;
2. ajouter un encaissement (Stripe / SumUp) — là, un back-end devient nécessaire.

## À faire valider par le commerçant avant mise en ligne

Le contenu factuel vient de la fiche Google (adresse, téléphone, note 4,3/5 sur 79 avis,
fourchette 1–10 €). **Le reste est une proposition et doit être corrigé avec lui :**

| À vérifier | Où |
| --- | --- |
| Horaires (posés à 7 h – 13 h du lundi au samedi, fermé le dimanche) | `app.js` → `HORAIRES`, et le tableau de `index.html` |
| Heures des fournées | `app.js` → `FOURNEES`, et la section `#four` |
| Quel produit sort de quelle fournée — c'est ce qui déclenche « tout chaud » | attribut `data-fournee` (liste séparée par des virgules) |
| Noms des produits, descriptions et **prix** | attribut `data-prix` de chaque `<article class="plat">`, et des quatre cartes de `#selection` |
| Options et prix du configurateur, et le « +2,60 € » de la formule midi | section `#recette`, attributs `data-prix` |
| **Caractéristiques de chaque produit** (poids, cuisson, température) : ce sont des ordres de grandeur plausibles, **pas des mesures** | blocs `.specs` de `index.html` |
| Chiffres de la section `#maison` : farine d'un seul moulin de l'Hérault, 18 h de levain, four à sole à 250°. **Ce sont des hypothèses de rédaction**, à confirmer ou remplacer par les vraies réponses du boulanger | section `#maison` |
| Domaine — la page est hébergée sous `mjagency.eu/au-bon-pain` ; à changer le jour où la boulangerie prend son propre nom de domaine | balise `<link rel="canonical">` |
| Lien « Laisser un avis » | il attend le `placeid` Google de l'établissement |

Le pain affiché dans le héro, celui de la sélection et celui de la carte partagent leur
`data-id` : le sac les regroupe sur une seule ligne. Si vous changez la mise en avant,
gardez l'identifiant du produit d'origine.

Aucun avis n'a été inventé : la section avis affiche la note agrégée publiée par Google
et renvoie chez eux. Des témoignages fabriqués auraient été plus jolis et malhonnêtes.

## Accessibilité et performance

- Contrastes vérifiés, y compris le texte clair posé sur les blocs violets.
- Focus visible en rose, navigation clavier complète.
- Le tiroir du sac est un `dialog` : `Échap` le ferme, le focus y reste piégé tant qu'il
  est ouvert. `Échap` ferme aussi la recherche.
- `prefers-reduced-motion` coupe toutes les animations, y compris les badges flottants.
- Polices en woff2 avec `font-display:swap` et préchargement : le texte s'affiche tout de
  suite, sans décaler la mise en page.
- Données structurées `schema.org/Bakery` pour le référencement local.
