# Brief projet — MJAGENCY

Un parcours guidé en dix écrans où un prospect décrit le site qu'il veut,
pendant qu'une maquette 3D se construit à côté de lui, en direct, à partir
de ses réponses. À l'envoi, deux emails partent : le récapitulatif complet
vers l'agence, une confirmation vers le client.

Application autonome, à déployer comme **projet Vercel distinct** du site
statique qui vit à la racine de ce dépôt (voir « Mise en ligne »).

## Démarrer

```bash
cd brief
npm install
cp .env.example .env.local   # puis y coller la clé Resend
npm run dev                  # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Sert le build |
| `npm run typecheck` | `tsc --noEmit` |

## La pile

| Brique | Usage |
|---|---|
| Next.js 16 (App Router) + TypeScript | Structure, route API |
| Tailwind CSS 4 | Jetons de style déclarés en CSS (`app/globals.css`) |
| `@react-three/fiber` + `drei` + `three` | La maquette 3D |
| Framer Motion | Transitions d'écran par masque `clip-path` |
| Lenis | Défilement lissé (désactivé si `prefers-reduced-motion`) |
| React Hook Form + Zod | Un seul formulaire, validé étape par étape |
| Resend | Envoi des deux emails, côté serveur uniquement |

`.npmrc` fixe `legacy-peer-deps=true` : `@react-three/fiber` déclare des
pairs optionnels Expo qui bloquent sinon l'installation.

## Direction artistique

Blanc `#FFFFFF`, gris `#F5F5F7`, encre `#1D1D1F`, et **un seul** accent,
le bleu `#0071E3`, réservé à la sélection, à la progression et au bouton
principal. Trois familles : **Instrument Serif** pour les questions (en
très grand corps, italique sur le mot qui compte), **Geist** pour l'interface,
**Geist Mono** pour les petits labels techniques — numéro d'étape, compteurs,
repères.

L'écran est coupé en deux : la question à gauche (45 %), la maquette à
droite (55 %). Sur mobile, la maquette devient un bandeau collant de 35 vh
qui reste visible pendant qu'on répond. Le fond porte un grain SVG léger,
la grille est rappelée par des filets d'un pixel et quelques croix de
repère, façon plan d'architecte. Le curseur est dessiné par la page : un
point plein doublé d'un anneau qui grossit sur les éléments cliquables et
s'étire en barre sur les champs texte — sauf au doigt, où le curseur natif
reprend la main.

Tout ce qui bouge s'arrête net si le visiteur a demandé
`prefers-reduced-motion` : transitions, parallaxe, défilement lissé,
interpolations de la maquette.

## « Votre site prend forme »

La scène de droite n'est pas une illustration : c'est une maquette de
navigateur peinte image par image sur un canvas, puis appliquée comme
texture sur un écran 3D légèrement incliné qui suit le pointeur.

| Réponse | Effet sur la maquette |
|---|---|
| Prénom | Titre du héros — « Le site de Julie » |
| Nom d'entreprise | Logo texte, et nom de domaine dans la barre du navigateur |
| Secteur | Composition abstraite dédiée (assiettes, poutres, rayonnage, arcs, croix, volumes, horizon) |
| Style | Famille typographique, graisse, interlettrage, rayons d'angle, densité |
| Curseurs sobre ↔ audacieux, classique ↔ moderne | Corps du titre, contraste, marges, second bouton |
| Palette | Les quatre couleurs, recolorées par interpolation |
| Fonctionnalités | Tuiles qui s'assemblent, glyphes dessinés, libellé du bouton principal, entrées de navigation |

Aucune valeur ne saute : `lib/animator.ts` rapproche chaque nombre de sa
cible à chaque image (interpolation exponentielle, indépendante de la
fréquence d'écran), et un balayage masque le changement de famille
typographique. À l'envoi, la maquette fait un tour complet puis se pose
de face.

Le canvas 3D est chargé en `dynamic({ ssr: false })` : le formulaire est
utilisable avant que three.js n'arrive. Sans WebGL, `Fallback2D` peint
**exactement la même maquette** avec le même code, sur un canvas 2D incliné
en CSS — le concept tient, seul le relief disparaît.

## Le parcours

Dix écrans, `00` à `09`, décrits dans `lib/steps.ts`. Un seul formulaire
React Hook Form couvre l'ensemble ; chaque étape ne valide que ses propres
champs (`trigger(fields)`), ce qui laisse Zod arbitrer les règles croisées
(« Autre » exige une précision, « Refonte » demande l'URL actuelle, une
palette sur mesure exige au moins une couleur).

- Barre de progression d'un pixel, compteur mono `03 / 09`, temps restant
  recalculé à chaque étape à partir des durées de `lib/steps.ts`.
- Entrée valide et avance ; un choix unique qui complète l'étape la fait
  passer seule après 400 ms ; la flèche revient en arrière.
- Progression écrite dans `localStorage` (sans les fichiers, non
  sérialisables) ; au retour, un bandeau discret propose de reprendre.
- Leviers d'engagement : première question minuscule, prénom réutilisé
  dans les questions suivantes, usages courants du secteur rappelés à
  l'étape des fonctionnalités, maquette qui devient « la sienne », cadre
  rassurant sur le budget et sur l'appel unique.

> Les promesses affichées — rappel sous 24 h ouvrées, première direction
> visuelle offerte, devis gratuit, paiement en plusieurs fois au-delà de
> 1 500 € — sont des engagements commerciaux. À relire et à ajuster avant
> la mise en ligne : elles vivent dans `components/steps/*.tsx` et dans
> `lib/email.ts`.

## L'envoi

`POST /api/brief`, en `multipart/form-data` : un champ `payload` (le brief
en JSON) et jusqu'à trois fichiers.

La route re-valide **tout** avec le même schéma Zod que le navigateur,
puis envoie via Resend l'email de l'agence (avec les pièces jointes, et
`replyTo` pointant sur le client), puis la confirmation du client. Si la
confirmation échoue, le brief n'est pas perdu pour autant : l'email de
l'agence est déjà parti et la requête répond `ok`.

Garde-fous : cinq envois par adresse IP et par dix minutes, un champ piège
invisible (rempli par un robot → réponse `ok`, rien n'est envoyé), trois
fichiers au plus, 4 Mo au total, jpg/png/svg/pdf uniquement.

## Mise en ligne

La racine de ce dépôt est un site statique déjà déployé. Le brief est une
application Next.js : il lui faut **son propre projet Vercel**, pointé sur
le dossier `brief/`. Rien à changer au site existant.

1. **GitHub** — pousser la branche, puis la fusionner dans la branche
   servie par Vercel.
2. **Vercel** → *Add New… → Project* → importer `vatmart3/mjagency`.
   Dans *Configure Project*, régler **Root Directory** sur `brief`.
   Le framework (Next.js), la commande de build et la sortie sont détectés
   seuls.
3. **Variables d'environnement** — dans *Settings → Environment Variables*,
   pour *Production* et *Preview* :

   | Nom | Valeur |
   |---|---|
   | `RESEND_API_KEY` | la clé `re_…` de https://resend.com/api-keys |
   | `BRIEF_TO_EMAIL` | `jeremyvatuonepro@gmail.com` |
   | `BRIEF_FROM_EMAIL` | `MJAGENCY <brief@mjagency.eu>` — une fois le domaine vérifié |
   | `NEXT_PUBLIC_LEGAL_URL` | l'URL des mentions légales (facultatif) |

   La page de mentions légales n'existe pas encore sur `mjagency.eu` : tant
   qu'elle n'est pas publiée, pointer `NEXT_PUBLIC_LEGAL_URL` sur une page
   existante, ou publier la page avant la mise en ligne du brief. Le lien
   de la case RGPD ne doit pas tomber dans le vide.

   Puis redéployer : les variables ne sont lues qu'au déploiement suivant.
4. **Domaine d'envoi chez Resend** — *Domains → Add Domain* → `mjagency.eu`,
   puis poser chez le registrar les enregistrements affichés (DKIM, SPF,
   et le `MX` du domaine de retour). Tant que Resend n'affiche pas
   *Verified*, laisser `BRIEF_FROM_EMAIL` vide : l'application part alors
   de `onboarding@resend.dev`, qui **n'écrit qu'au titulaire du compte
   Resend** — le client, lui, ne recevrait rien.
5. **Vérifier** — remplir le brief en production, confirmer l'arrivée des
   deux emails, et regarder *Resend → Emails* en cas de doute. Les erreurs
   de la route sont journalisées dans *Vercel → Logs*, préfixées `[brief]`.

Pour servir le brief depuis `mjagency.eu/brief`, ajouter dans le
`vercel.json` du site statique une réécriture vers le déploiement du
projet brief — ou, plus simple, lui donner un sous-domaine
(`brief.mjagency.eu`) dans *Settings → Domains*.

## Repères dans le code

```
app/
  layout.tsx            polices, métadonnées
  page.tsx              → BriefExperience
  api/brief/route.ts    validation, Resend, garde-fous
components/
  BriefExperience.tsx   orchestration : étapes, sauvegarde, envoi
  Chrome.tsx            progression, barre du haut, repères de grille
  CustomCursor.tsx      le curseur dessiné
  scene/                MockupStage → Scene3D | Fallback2D
  steps/                un fichier par écran
  ui/                   champs, chips, tuiles, curseurs, palettes, dépôt de fichiers
lib/
  options.ts            toutes les listes de choix
  schema.ts             Zod, partagé navigateur ↔ serveur
  steps.ts              étapes, champs validés, durées
  mockup.ts             réponses → modèle de maquette
  painter.ts            le dessin de la maquette (canvas)
  animator.ts           l'interpolation entre deux états
  email.ts              les deux emails, en HTML et en texte
  summary.ts            la phrase de récapitulation
```
