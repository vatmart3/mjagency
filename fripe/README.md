# FRIPE

Un assistant personnel qui transforme les photos d'un article en annonce Vinted
prête à copier-coller : **nom, titre, description, prix conseillé** (avec
fourchette de négociation) et la fiche du formulaire (catégorie, marque, taille,
état, couleur, matière). Chaque bloc a son bouton « Copier », et « Tout copier »
rend l'ensemble dans l'ordre de saisie de Vinted.

Next.js (App Router) · TypeScript · Tailwind CSS 4 · API Anthropic (Claude) ·
IndexedDB · React Three Fiber · Framer Motion · PWA.

## Parcours

1. **Photos** — 1 à 8, par l'appareil photo (`capture="environment"`), la galerie
   ou un glisser-déposer. Réordonnables par la poignée ; la première sert de
   couverture. Compressées dans le navigateur avant l'envoi (côté long 1500 px,
   JPEG 0,85, qualité réduite au besoin pour rester sous ~600 Ko).
2. **Infos facultatives** (repliées) — marque, taille, état Vinted, défauts, prix
   d'achat, mesures, précision libre. Ce qui est saisi prime sur ce que l'IA devine.
3. **Analyse** — quelques secondes, cintre 3D qui tourne, annulable.
4. **Résultat** — tout est modifiable sur place ; « À vérifier avant de publier »
   liste ce que les photos ne permettent pas de confirmer. « Régénérer » relance
   avec une consigne (« plus court », « prix plus bas »…).
5. **Historique** — chaque annonce est enregistrée sur l'appareil, avec ses photos,
   et peut être rouverte. Statut « À publier / En ligne / Vendue » au toucher.
6. **Réglages** — ton, tutoiement, emojis, hashtags, stratégie de prix (vendre
   vite / équilibre / meilleur prix), signature ajoutée en fin de description.

## Architecture

| Fichier | Rôle |
|---|---|
| `app/api/analyze/route.ts` | Route d'analyse : session, origine, limite de débit, validation des photos et des champs, appel à Claude |
| `lib/claude.ts` | Appel à l'API (serveur uniquement), sortie structurée, retry, traduction des erreurs |
| `lib/prompt.ts` | Prompt système (fixe, donc mis en cache) et message utilisateur |
| `lib/schema.ts` | Schémas Zod : infos, réglages, annonce ; normalisation des prix |
| `lib/auth.ts`, `proxy.ts` | Mot de passe, cookie de session signé, garde de toutes les routes |
| `lib/rate-limit.ts` | Limite de débit à fenêtre glissante |
| `lib/image.ts` | Compression des photos dans le navigateur |
| `lib/db.ts` | IndexedDB (`idb`) : historique et réglages |
| `components/` | Interface ; `Cintre3D.tsx` est la scène React Three Fiber |
| `public/sw.js` | Service worker : statiques en cache, pages réseau d'abord, page hors ligne |

### La sortie de Claude

- Modèle `claude-sonnet-5-5` par défaut, modifiable par `ANTHROPIC_MODEL`.
- **Sortie structurée** (`output_config.format` en JSON Schema, généré depuis le
  schéma Zod) : la réponse est toujours un JSON conforme. Les contraintes que l'API
  ne sait pas imposer (longueur du titre, de la description…) sont revérifiées
  par Zod côté serveur.
- **Retry automatique** : JSON illisible, contrainte non respectée ou réponse
  coupée → nouvel appel avec la liste précise des problèmes, jusqu'à 3 essais.
  Les incohérences de prix (plancher au-dessus du prix affiché…) sont corrigées
  sans relancer.
- Réflexion adaptative, effort `low` par défaut pour la vitesse
  (`ANTHROPIC_EFFORT=medium` affine les prix délicats).
- Si un filtre de sécurité refuse à tort, l'API relance d'elle-même sur un autre
  modèle (`fallbacks: "default"`) ; `ANTHROPIC_FALLBACKS=off` le désactive.
- Pas de scraping de Vinted : le prix est une estimation du modèle à partir de la
  marque, du type, de l'état et du marché de la seconde main.

## Sécurité

- `ANTHROPIC_API_KEY` n'est lue que dans `lib/claude.ts` (`import "server-only"`) :
  elle ne peut pas finir dans le code envoyé au navigateur.
- Toute l'app est derrière `APP_PASSWORD`. Après connexion, cookie `httpOnly`,
  `SameSite=Lax`, `Secure` en production, signé en HMAC-SHA256, valable 30 jours.
  Changer le mot de passe déconnecte tous les appareils. Sans `APP_PASSWORD`, l'app
  reste fermée.
- La route d'analyse revérifie la session elle-même et refuse les requêtes venant
  d'une autre origine.
- Limites de débit par IP : 6 analyses/minute et 150/jour (réglables), 8 essais de
  mot de passe par quart d'heure. Elles vivent en mémoire, donc par instance de
  fonction sur Vercel : suffisant contre une boucle ou un script, le vrai verrou
  restant le mot de passe.

## Lancer en local

```bash
cd fripe
npm install
cp .env.example .env.local   # puis remplir ANTHROPIC_API_KEY et APP_PASSWORD
npm run dev                  # http://localhost:3000
```

Vérifications : `npm run lint` (types), `npm test` (tests unitaires), `npm run build`.

## Déployer sur Vercel

FRIPE vit dans le dossier `fripe/` du dépôt du site de l'agence. Créer un
**projet Vercel distinct** sur le même dépôt :

1. *Add New → Project*, choisir le dépôt, **Root Directory : `fripe`**
   (le framework Next.js est détecté).
2. Variables d'environnement : `ANTHROPIC_API_KEY`, `APP_PASSWORD`
   (et au besoin celles de `.env.example`).
3. Déployer, ouvrir l'URL sur le téléphone, se connecter.

Le `.vercelignore` à la racine du dépôt exclut `fripe/` du déploiement du site de
l'agence.

## Installer sur le téléphone

- **iPhone** (Safari) : Partager → *Sur l'écran d'accueil*.
- **Android** (Chrome) : menu ⋮ → *Installer l'application*.

L'app s'ouvre alors en plein écran, comme une app native. L'historique reste
consultable sans réseau ; l'analyse, elle, en a besoin.
