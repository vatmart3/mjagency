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

## L'interface embarquée — `/spider`

Une page à part, hors du site : on l'ouvre au téléphone, on autorise la
caméra, et l'écran devient une couche de données par-dessus le réel. Elle
n'est liée depuis aucune autre page et porte `noindex`.

Rien n'est déguisé et rien n'est plaqué sur le visage : ce que le suivi
produit sert à l'interface, pas à un costume.

- **Les mains commandent la page.** Elles sont suivies et dessinées en
  filaire — on voit ce que la machine voit, donc on comprend pourquoi un
  geste passe ou non. Deux commandes, et deux seulement :
  **balayer** horizontalement change de profil, **pincer** le pouce et
  l'index ouvre le micro d'IRIS.
- **Un viseur** verrouille le visage : quatre équerres, une ligne de
  balayage, une croix sur l'arête du nez, et un relevé d'inclinaison et de
  distance. Il se coupe d'un bouton.
- **Quatre profils** — Écarlate, Azur, Ambre, Viride. Un profil n'est
  qu'une couleur d'accent : toute l'interface la reprend d'un coup.
- **Météo réelle** de la position, heure, date, batterie, images/seconde.
- **IRIS**, à qui l'on parle au micro et qui répond à voix haute.

### Ce qui sort de l'appareil

Rien de la caméra. Le suivi tourne en local (MediaPipe Tasks Vision, chargé
depuis un CDN) et aucune image n'est transmise. Partent seulement :

| Vers | Quoi |
|---|---|
| `/api/iris` → Claude | les mots dictés, plus heure, ville, météo et profil en contexte |
| `/api/meteo` → Open-Meteo | des coordonnées arrondies |

### Mise en service

Une seule variable, dans Vercel → **Settings → Environment Variables** :

| Nom | Valeur | Requis |
|---|---|---|
| `ANTHROPIC_API_KEY` | la clé `sk-ant-…` de [console.anthropic.com](https://console.anthropic.com) | pour IRIS |

La météo ne demande aucune clé. Sans `ANTHROPIC_API_KEY`, la page fonctionne
toujours : `/api/iris` répond `503 SANS-CLE` et l'interface bascule sur un
mode hors ligne qui sait encore donner l'heure, la météo, la position et le
profil.

`vercel.json` accorde 60 secondes à `/api/iris` — le modèle réfléchit avant
de répondre, et la limite de 10 secondes par défaut le couperait.

**Une limite à connaître : `/api/iris` n'a pas de limitation de débit.** La
route refuse les requêtes venant d'une autre origine, et l'absence d'en-têtes
CORS empêche déjà tout navigateur tiers de l'appeler — mais un script qui
connaît l'URL peut consommer le quota de la clé. Tant que la page reste un
usage personnel, le garde-fou pratique est le plafond de dépense fixé dans
la console Anthropic. Pour une mise en avant publique, il faudrait un vrai
compteur par IP (Vercel KV ou équivalent).

### Ce qui peut manquer, et ce qu'il se passe alors

Chaque brique tombe seule, sans emporter les autres :

| Absent | Conséquence |
|---|---|
| MediaPipe (CDN injoignable) | plus de gestes ni de viseur, mais caméra, heure, météo et dialogue continuent |
| Reconnaissance vocale (Firefox, certains Android) | le bouton micro et le pincement se désactivent, on tape dans le champ |
| Synthèse vocale | les réponses restent lisibles à l'écran |
| `ANTHROPIC_API_KEY` | mode hors ligne, réponses courtes tirées des capteurs |
| Géolocalisation refusée | position déduite de l'adresse IP par le serveur |

### À savoir

- **HTTPS obligatoire** : `getUserMedia` refuse de s'ouvrir autrement. Le
  site déployé convient ; en local il faut `localhost`, pas une IP.
- **Sur iPhone**, ajouter la page à l'écran d'accueil donne un vrai plein
  écran, sans barre de navigateur.
- Les deux modèles de suivi pèsent une dizaine de mégaoctets ; ils se
  chargent l'un après l'autre — les mains d'abord, puisque ce sont elles
  qui commandent, le viseur ensuite.
- Un profil n'est qu'une entrée dans `PROFILS`, en tête de
  `assets/js/spider.js` : deux couleurs et un nom. Toute l'interface suit,
  parce que la feuille de style entière découle de `--accent`.

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
spider.html            → interface embarquée (hors site, noindex)
api/contact.js         → réception du formulaire (Resend)
api/iris.js            → dialogue d'IRIS (Claude)
api/meteo.js           → météo réelle (Open-Meteo)
assets/
  css/style.css        → design system
  css/fonts.css        → pile typographique système
  css/spider.css       → interface embarquée
  js/main.js           → reveals, calendrier, formulaire, menu
  js/bg.js             → objet 3D en fond + repli
  js/spider.js         → suivi, viseur, gestes, profils, IRIS
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
