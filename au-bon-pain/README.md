# Au Bon Pain — Sète

Site vitrine + commande pour la boulangerie **Au Bon Pain**, 36 rue Paul Bousquet, 34200 Sète.
HTML / CSS / JS purs, aucune dépendance, aucun build, aucune image bitmap.

```
au-bon-pain/
  index.html
  assets/css/style.css   → design system
  assets/js/app.js       → horaires, cadran du four, sac, configurateur, recherche
```

Ouvrir `index.html`, ou servir le dossier : `npx serve .`
En production, la page répond sur `/au-bon-pain/` (`cleanUrls` est déjà actif dans `vercel.json`).

## La direction

Sombre : chocolat profond, or, cuivre. Le fond est la nuit de l'atelier avant l'ouverture,
et la lumière ne vient que de deux endroits — le four et l'or. Une seule couleur d'accent,
des cartes arrondies légèrement soulevées, une linéale forte pour les titres.

Le décor (halos qui dérivent, grain) et les seize illustrations sont peints par le
navigateur : aucune photo, aucun droit à payer, page très légère.

## Ce que le site apporte à une boulangerie

L'information qui compte dans une boulangerie n'est pas « artisan depuis 1930 », c'est
**est-ce ouvert, qu'est-ce qui vient de sortir, et vais-je faire la queue**.

- **Le cadran du four** (héro) — un arc de 7 h à 13 h, l'aiguille à l'heure réelle du
  visiteur, un point par fournée. Au centre : « prochaine fournée dans 24 min », « sorti du
  four à 8 h 30 », ou « fermeture dans 20 min » quand la dernière fournée est passée.
  Rien n'est écrit en dur, tout est calculé.
- **« Tout chaud »** — chaque produit porte sa fournée (`data-fournee`). Pendant les
  75 minutes qui suivent, sa carte se réchauffe et porte une pastille, et le haut de la
  carte résume ce qui vient de sortir. Le cadran et la carte lisent la même horloge :
  une seule vérité, deux affichages.
- **La pastille d'état** dans la barre — Ouvert / Ferme bientôt / Fermé, avec l'heure
  exacte, et le jour du jour surligné dans le tableau des horaires.
- **Le sac** — panier persistant (`localStorage`), créneaux de retrait par quart d'heure
  générés depuis les horaires, jamais moins de 20 minutes après maintenant, et report
  automatique au prochain jour ouvré quand la journée est finie.
- **Composez votre sandwich** — quatre étapes, prix en direct, le sandwich se dessine
  pendant qu'on le choisit, et le choix est relu en mots sous le dessin.
- **La recherche** (la loupe de la barre) — elle ne mène nulle part : elle filtre la carte
  sur place, sur le nom et la description, et dit combien de produits restent.
- **La barre du sac** — sur téléphone, le total et l'accès au sac restent sous le pouce
  dès qu'il y a quelque chose dedans.

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
| Noms des produits, descriptions et **prix** | attribut `data-prix` de chaque `<article class="plat">`, et des trois cartes de `#populaires` |
| Options et prix du configurateur | section `#atelier`, attributs `data-prix` |
| Section « La maison » : farine T65 d'un seul moulin de l'Hérault, 18 h de levain, four à sole à 250°. **Ce sont des hypothèses de rédaction**, à confirmer ou remplacer par les vraies réponses du boulanger | section `#maison` |
| Domaine — la page est hébergée sous `mjagency.eu/au-bon-pain` ; à changer le jour où la boulangerie prend son propre nom de domaine | balise `<link rel="canonical">` |
| Lien « Laisser un avis » | il attend le `placeid` Google de l'établissement |

Un produit mis en avant dans `#populaires` et le même produit dans la carte partagent leur
`data-id` : le sac les regroupe sur une seule ligne. Si vous ajoutez une mise en avant,
gardez l'identifiant du produit d'origine.

Aucun avis n'a été inventé : la section avis affiche la note agrégée publiée par Google
et renvoie chez eux. Des témoignages fabriqués auraient été plus jolis et malhonnêtes.

## Accessibilité et performance

- Contrastes conformes sur fond sombre, focus visible en or, navigation clavier complète.
- Le tiroir du sac est un `dialog` : `Échap` le ferme, le focus y reste piégé tant qu'il
  est ouvert. `Échap` ferme aussi la recherche.
- `prefers-reduced-motion` coupe les animations, y compris les halos du décor.
- Police système : aucun téléchargement, aucun décalage au chargement.
- Données structurées `schema.org/Bakery` pour le référencement local.
