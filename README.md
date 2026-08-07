# MJ Agency — Site

Site multi-page pour le studio créatif MJ Agency (Sète, Hérault).
HTML/CSS/JS pur, sans framework ni étape de build. Une seule fonction
serverless, pour l'envoi du formulaire.

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil — savoir-faire, réalisations, méthode, ancrage local |
| `work.html` | Portfolio filtrable |
| `studio.html` | Le studio, la méthode, les services |
| `contact.html` | Calendrier de réservation + formulaire |
| `creation-site-internet-sete.html` *et 3 autres* | Pages locales, générées |
| `au-bon-pain/` | Site client, servi depuis `/au-bon-pain` |

## Direction artistique

Charte claire, dans l'esprit Apple : blanc dominant, `#0071E3` en accent,
pile typographique système (SF Pro), pilules, ombres douces, unité de 8 px.
Les valeurs sont des variables CSS en tête de `assets/css/style.css`.

Deux objets 3D, tous deux calculés dans le navigateur, sans image ni
bibliothèque :

- **Le fond** (`assets/js/bg.js`) — un ruban torsadé décrit par une fonction
  de distance et rendu par lancer de rayons, éclairé en studio. Il tourne et
  dérive avec le défilement. Repli en dégradé fixe sans WebGL, ou si le
  visiteur a demandé moins d'animations.
- **Le gyroscope** du bloc « Motion & 3D » — transformations CSS 3D.

## Le formulaire

Le navigateur poste sur `/api/contact` (`api/contact.js`), qui relaie à
**Resend**. La clé d'API reste côté serveur : elle n'apparaît jamais dans le
code de la page.

### Mise en service

1. Créer un compte sur [resend.com](https://resend.com) et générer une clé
   dans **API Keys**.
2. Dans Vercel → **Settings → Environment Variables**, ajouter :

   | Nom | Valeur | Requis |
   |---|---|---|
   | `RESEND_API_KEY` | la clé `re_…` | oui |
   | `MAIL_FROM` | `MJ Agency <contact@mjagency.eu>` | après vérification du domaine |
   | `MAIL_TO` | destinataire, si autre que `vatmart3@gmail.com` | non |

3. Redéployer — les variables ne sont lues qu'au déploiement suivant.

Tant que `MAIL_FROM` n'est pas défini, les messages partent de
`onboarding@resend.dev`, l'adresse de test de Resend : elle **n'écrit qu'au
titulaire du compte**. Pour envoyer depuis `@mjagency.eu`, vérifier le
domaine dans Resend → **Domains** et poser les enregistrements DNS proposés
chez le registrar.

### Ce qui est protégé

- Champ piège (`site`), vérifié côté serveur — rempli, la requête renvoie un
  succès de façade sans rien envoyer.
- Validation du nom et de l'email, longueurs bornées.
- Retours à la ligne retirés du sujet, message échappé dans la version HTML.
- Les erreurs Resend restent dans les journaux Vercel ; le visiteur ne reçoit
  qu'un message neutre, avec un lien `mailto:` déjà rempli en porte de sortie.

`/api/contact` n'existe que sur le site déployé : ouvert en fichier local ou
dans un aperçu qui bloque les requêtes sortantes, le formulaire affichera
toujours le repli.

## Lancer en local

```bash
npx serve .
```

Ouvrir `index.html` directement fonctionne aussi, à l'exception du
formulaire.

## Générer les fichiers dérivés

```bash
node build.js           # → onepage.html (aperçu en fichier unique)
node build-locales.js   # → 4 pages locales + sitemap.xml
```

À relancer après toute modification du contenu ou du CSS.

## Structure

```
index.html · work.html · studio.html · contact.html
api/contact.js         → réception du formulaire (Resend)
assets/
  css/style.css        → design system
  css/fonts.css        → pile typographique système
  js/main.js           → reveals, calendrier, formulaire, menu
  js/bg.js             → objet 3D en fond + repli
build.js               → aperçu en fichier unique
build-locales.js       → pages locales + sitemap
vercel.json            → URL sans extension, en-têtes de sécurité
```

## Reste à faire

- Pages légales (mentions, confidentialité) — en attente du statut juridique,
  du SIRET et de l'adresse du siège.
- Remplacer les visuels de projets par de vraies photos.
- Le calendrier est front-only : les créneaux sont simulés, à connecter à un
  agenda réel pour éviter les doubles réservations.
