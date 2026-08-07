# Au Bon Pain — Sète

Site vitrine + commande pour la boulangerie **Au Bon Pain**, 36 rue Paul Bousquet, 34200 Sète.
HTML / CSS / JS purs, aucune dépendance, aucun build, aucune image bitmap.

```
au-bon-pain/
  index.html
  assets/css/style.css   → design system
  assets/js/app.js       → horaires, cadran du four, sac, configurateur
```

Ouvrir `index.html`, ou servir le dossier : `npx serve .`
En production, la page répond sur `/au-bon-pain/` (`cleanUrls` est déjà actif dans `vercel.json`).

## Ce que le site apporte à une boulangerie

Tout part d'une idée : dans une boulangerie, l'information qui compte n'est pas
« nous sommes artisans depuis 1930 », c'est **est-ce ouvert, qu'est-ce qui vient de sortir,
et est-ce que je vais faire la queue**.

- **Le cadran du four** (héro) — un arc de 7 h à 13 h, l'aiguille à l'heure réelle du visiteur,
  un point par fournée. Au centre : « prochaine fournée dans 24 min », « sorti du four à 8 h 30 »,
  ou « fermeture dans 20 min » quand la dernière fournée est passée. Rien n'est écrit en dur,
  tout est calculé.
- **La pastille d'état** dans la barre — Ouvert / Ferme bientôt / Fermé, avec l'heure exacte,
  et le jour du jour surligné dans le tableau des horaires.
- **Le sac** — panier persistant (`localStorage`), créneaux de retrait par quart d'heure
  générés depuis les horaires, jamais moins de 20 minutes après maintenant, et report
  automatique au prochain jour ouvré quand la journée est finie.
- **Composez votre sandwich** — quatre étapes, prix en direct, et le sandwich se dessine
  à l'écran pendant qu'on le choisit (la garniture prend sa couleur, la sauce apparaît).
- **Zéro photo** — les illustrations sont des SVG dessinés à la main, le décor est un
  dégradé animé avec grain. Pas de banque d'images, pas de droits à payer, page très légère.

## Comment la commande arrive au commerçant

Le site n'a pas de back-end : **il n'y a donc pas de paiement en ligne**. Le bouton
« Envoyer la commande » ouvre l'application SMS du client avec un récapitulatif déjà rédigé
(articles, quantités, créneau, prénom, total), adressé au 04 67 53 59 31. Le paiement se fait
au comptoir. C'est volontaire : c'est ce qui demande le moins de travail au commerçant, et
ça marche dès aujourd'hui, sans abonnement.

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
| Heures des fournées | `app.js` → `FOURNEES`, et la section `#four` de `index.html` |
| Noms des produits, descriptions et **prix** | `index.html`, attribut `data-prix` de chaque `<article class="plat">` |
| Options et prix du configurateur | `index.html`, section `#composer`, attributs `data-prix` |
| Domaine — la page est hébergée sous `mjagency.fr/au-bon-pain` ; à changer le jour où la boulangerie prend son propre nom de domaine | balise `<link rel="canonical">` |
| Lien « Laisser un avis » | il attend le `placeid` Google de l'établissement |

Aucun avis n'a été inventé : la section avis affiche la note agrégée publiée par Google
et renvoie chez eux. Des témoignages fabriqués auraient été plus jolis et malhonnêtes.

## Accessibilité et performance

- Contrastes conformes, focus visible, navigation clavier complète.
- Le tiroir du sac est un `dialog` : `Échap` le ferme, le focus y reste piégé tant qu'il est ouvert.
- `prefers-reduced-motion` coupe les animations, y compris le décor.
- Polices système (romaine + linéale) : aucun téléchargement, aucun décalage au chargement.
- Données structurées `schema.org/Bakery` pour le référencement local.
