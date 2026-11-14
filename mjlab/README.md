# MJ LAB — site officiel

> Une vision · plusieurs possibilités — *Des idées qui prennent forme.*

Site de **MJ LAB**, la marque qui réunit les activités de Jérémy Vatuone et Matheis Farrieux (Sète / Frontignan). Projet **indépendant** du site MJ Agency (racine du dépôt) : il a sa propre application, son propre contenu et son propre déploiement.

**Stack :** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Three.js via @react-three/fiber + drei (+ postprocessing) · GSAP + ScrollTrigger · Lenis · Framer Motion (micro-interactions uniquement) · Zustand.

---

## 1. Lancer en local

Prérequis : Node.js 20 ou plus.

```bash
cd mjlab
npm install
npm run dev          # http://localhost:3000
```

Version de production :

```bash
npm run build
npm start
```

Captures d'écran de contrôle (desktop 1440 px + mobile 390 px), serveur lancé sur le port 3000 :

```bash
node scripts/screenshots.mjs        # → screenshots/
```

---

## 2. Modifier les contenus — `content/site.ts`

**Tous** les textes, chiffres, liens et listes vivent dans `content/site.ts`. Aucun composant n'est à toucher pour :

| Bloc | Objet |
|---|---|
| Nom, signature, coordonnées, réseaux, navigation | `site` |
| Titre, sous-titre, CTA, offre « appel découverte » | `hero` |
| Manifeste et notes de labo | `manifesto` |
| Activités (2 à 8) | `activities` |
| Méthode en 4 phases | `protocol` |
| Chiffres | `stats` |
| Carnet de labo (projets) | `projects` |
| CTA final, choix du formulaire | `finalCta`, `form` |
| Rareté (désactivée par défaut) | `scarcity` |
| Mentions légales | `legal` |

### Les valeurs `TODO` — rien n'est inventé

- **Chiffres** : les entrées `todo: true` affichent un badge « À COMPLÉTER ». Mettre la vraie valeur et retirer `todo`. Le nombre d'activités est calculé automatiquement.
- **Duo** : rôles (`focus`) et phrases (`quote`) de Jérémy et Matheis.
- **Réseaux sociaux** : une entrée sans `url` s'affiche « bientôt » et n'est pas cliquable.
- **Mentions légales** : raison sociale, statut, SIRET, adresse, TVA, responsable de publication, adresse de Vercel. Les champs `TODO` apparaissent surlignés sur `/mentions-legales` et `/confidentialite`.
- **Domaine** : `NEXT_PUBLIC_SITE_URL` (voir § 5), utilisé pour le SEO, le sitemap et l'image OG.

### Rareté

`scarcity.enabled = true` affiche un message du type « 3 créneaux ce mois-ci » près des CTA. **À n'activer que si c'est vrai.**

---

## 3. Ajouter (ou retirer) une activité

1. Dans `content/site.ts`, ajouter un objet au tableau `activities` (copier une entrée existante) :
   - `slug` : identifiant d'URL → `/activites/<slug>`
   - `name`, `code` (`EXP-06`…), `pitch`, `description`, `tags` (3), `offers`, `formLabel`
   - `mockup` : `"browser" | "shop" | "box" | "app" | "live"` (visuel provisoire)
2. C'est tout. Automatiquement :
   - l'**arche 3D se découpe** en autant de segments (2 à 8),
   - la section Activités, sa navigation latérale, le formulaire (étape 1), le footer, le sitemap et la page `/activites/<slug>` suivent.

L'ordre du tableau = l'ordre des segments de l'arche, de gauche à droite.

---

## 4. Remplacer les placeholders d'images

| Visuel | Où | Comment |
|---|---|---|
| Portraits du duo | `public/portraits/jeremy.webp`, `matheis.webp` | remplacer les fichiers (format portrait ~3:4) ou changer `portrait` dans `site.founders` |
| Projets | `public/projets/…` | déposer l'image puis renseigner `image: "/projets/mon-projet.jpg"` dans `projects`, et retirer `placeholder: true` |
| Visuel d'une activité | `public/…` | champ `image` de l'activité (sinon le mockup dessiné reste affiché) |

Formats conseillés : WebP ou AVIF, 1600 px de large maximum. Les images passent par `next/image`, qui les optimise.

---

## 5. Formulaire de contact — `/api/contact`

Le formulaire en 4 étapes poste en JSON sur `app/api/contact/route.ts`, qui envoie un e-mail via **[Resend](https://resend.com)**. La clé reste côté serveur.

### Variables d'environnement

| Nom | Rôle | Requis |
|---|---|---|
| `RESEND_API_KEY` | clé `re_…` générée dans Resend → API Keys | **oui** |
| `CONTACT_TO` | destinataire(s), séparés par des virgules (défaut : `site.contact.email`) | non |
| `CONTACT_FROM` | expéditeur, ex. `MJ LAB <contact@mondomaine.fr>`, sur un domaine **vérifié** chez Resend | conseillé |
| `NEXT_PUBLIC_SITE_URL` | URL publique, ex. `https://www.mjlab.fr` | conseillé |

En local : copier `.env.example` en `.env.local` et remplir les valeurs. Le fichier `.env.local` est exclu de Git.

Sans `CONTACT_FROM`, l'envoi part de `onboarding@resend.dev`, une adresse de test qui **n'écrit qu'au titulaire du compte Resend**. Pour envoyer depuis votre domaine : Resend → Domains → ajouter le domaine, puis poser les enregistrements DNS indiqués.

### Comportement

- `GET /api/contact` renvoie l'état de la configuration (`configured: true/false`) sans révéler aucune valeur.
- Sans clé, la route répond `503` : le visiteur voit un message et un lien `mailto:` déjà rempli avec ses réponses. Rien n'est perdu.
- Protections : champ piège anti-robots, validation serveur, longueurs bornées, retours à la ligne retirés du sujet, HTML échappé, limite de 5 envois / 10 min / IP (par instance).
- Les réponses sont gardées dans le navigateur (`localStorage`, clé `mjlab-projet`) tant que le projet n'est pas envoyé. Si le visiteur ferme en cours de route, la pilule devient « Reprendre votre projet ».

---

## 6. Déployer sur Vercel

1. Importer le dépôt dans Vercel.
2. **Settings → General → Root Directory : `mjlab`** (le site MJ Agency reste à la racine du dépôt et garde son propre projet Vercel).
3. Framework : Next.js (détecté automatiquement). Commande `npm run build`.
4. **Settings → Environment Variables** : ajouter les variables du § 5.
5. Déployer, puis brancher le domaine dans Settings → Domains.

Après tout changement de variable d'environnement, il faut redéployer.

---

## 7. Architecture

```
mjlab/
  content/site.ts            ← tout le contenu éditable
  app/
    layout.tsx               polices (next/font), métadonnées, JSON-LD, providers
    page.tsx                 one-page : sections 01 → 08
    activites/[slug]/        template des pages activités (SSG)
    mentions-legales/, confidentialite/
    api/contact/route.ts     envoi Resend
    opengraph-image.tsx      image OG générée aux couleurs de la charte
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  components/
    three/                   l'Arche : géométrie, matériau, scènes, canvas, repli SVG
    sections/                Hero, Manifesto, Activities, Protocol, Numbers, Duo, Projects, FinalCTA, Footer
    contact/ContactPanel     formulaire en 4 étapes
    ui/                      header, curseur, loader, boutons magnétiques, reveals, icônes sur mesure…
  lib/                       store (zustand), état 3D partagé, cadrage du hero, gsap, lenis, hooks
  scripts/screenshots.mjs    captures Playwright
```

### L'Arche (`components/three`)

- `archCore.ts` : un segment de tore est une grille paramétrique. Sa forme réelle est calculée **dans le vertex shader** à partir de l'angle de départ, de la longueur d'arc et de l'arrondi des extrémités. Le même objet passe donc sans couture de « une arche entière » à « N segments », puis à « un anneau fermé ». Le matériau est un `MeshPhysicalMaterial` (clearcoat, sheen) enrichi par `onBeforeCompile` : dégradé #641E32 → #8D3048, bords translucides simulés par effet fresnel (moins coûteux qu'une vraie transmission), respiration lente par bruit simplex.
- `scenes.tsx` : quatre mises en scène. **Hero** : arche entière, parallaxe au curseur, ombre de contact. **Activités** : fragmentation pilotée par ScrollTrigger. **CTA final** : réassemblage, fermeture en anneau, le point tombe au centre. **Page activité** : le segment extrait en grand.
- Le titre du hero passe **devant** l'arche. La partie posée sur l'arche bascule en crème grâce à une copie du titre découpée, à chaque image, à la silhouette projetée de l'arche.
- Repli : sans WebGL, ou avec `prefers-reduced-motion`, une arche SVG statique s'affiche avec la même silhouette. Les canvas sont chargés en différé (`dynamic`, `ssr: false`), mis en pause hors écran, et allégés sur mobile (géométrie réduite, DPR ≤ 1,5, sans post-traitement).

### Accessibilité et mouvement

- `prefers-reduced-motion` coupe le scrub, le pin, la 3D animée, Lenis et le curseur custom ; tous les contenus s'affichent directement.
- Navigation clavier complète, focus visibles en bordeaux, panneau de contact modal avec piège de focus et arrière-plan inerte, `aria-label` sur les boutons-icônes, un seul `h1` par page.
- Le beige ne sert qu'au décor et aux grands textes (contraste).

---

## 8. Charte

| Token | Hex | Usage |
|---|---|---|
| `--bordeaux` | #641E32 | signature, CTA principal |
| `--bordeaux-light` | #8D3048 | hover, accents, matière 3D |
| `--creme` | #F5F0E9 | fond principal |
| `--beige` | #D7C5B8 | blocs secondaires, séparateurs |
| `--noir` | #252326 | texte, sections sombres |
| `--blanc` | #FFFFFF | texte sur bordeaux / noir |

Les tokens sont définis dans `app/globals.css` (variables CSS + `@theme` Tailwind : `bg-bordeaux`, `text-creme`…). Typographies : **Poppins** 600/700/800 (titres), **Inter** 400/500 (textes), **Geist Mono** (repères, index, données).

La signature manuscrite du Duo est un tracé SVG généré une fois à partir de la police libre *Mrs Saint Delafield* (SIL OFL) : aucune police supplémentaire n'est chargée.
