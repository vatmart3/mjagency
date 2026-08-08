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

### Alerte WhatsApp ou SMS (facultative)

En plus de l'email, chaque demande peut déclencher une notification. Sans
les variables ci-dessous, rien ne change — seul l'email part.

| `ALERTE_CANAL` | Canal | Coût | Mise en route |
|---|---|---|---|
| `callmebot` | WhatsApp | gratuit | Écrire `I allow callmebot to send me messages` au **+34 644 51 95 23** sur WhatsApp ; il répond avec la clé → `CALLMEBOT_APIKEY` |
| `twilio` | WhatsApp ou SMS | payant | Compte Twilio → `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM` |
| `free-mobile` | SMS | gratuit | Réservé aux abonnés Free Mobile. Espace abonné → Mes Options → Notifications par SMS → `FREE_USER`, `FREE_PASS` |

Plus `ALERTE_TEL` (le numéro destinataire, format `+33…`).

**Diagnostiquer.** Ouvrir `/api/contact` dans un navigateur affiche l'état :
canal reconnu ou non, variables manquantes, mode de détail. Aucune valeur
n'est révélée, seulement leur présence.

Pour un envoi d'essai sans passer par le formulaire, poser
`ALERTE_TEST_CLE=<un mot au hasard>` puis :

```bash
curl -X POST "https://www.mjagency.eu/api/contact?test=<ce même mot>"
```

La réponse contient le code et le message renvoyés par le fournisseur —
c'est là qu'on lit pourquoi rien n'arrive. Sans `ALERTE_TEST_CLE`, la route
n'existe pas : sinon n'importe qui pourrait faire sonner le téléphone en
boucle.

L'alerte **ne peut jamais faire échouer un envoi** : elle est tentée après
que l'email est parti, avec un délai maximum de 5 secondes, et ses ratés
partent dans les journaux sans que le visiteur en sache rien.

Par défaut (`ALERTE_DETAIL=minimal`) le message ne contient que le nom et le
créneau — les coordonnées du prospect restent dans l'email, qui passe par un
prestataire en règle. `ALERTE_DETAIL=complet` y ajoute email, société, budget
et message : c'est faire transiter des données personnelles par le service
choisi, ce qui se décide en connaissance de cause. CallMeBot en particulier
est un service gratuit sans engagement contractuel — parfait pour un simple
« quelqu'un a rempli le formulaire », discutable pour y verser un fichier
prospects.

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
