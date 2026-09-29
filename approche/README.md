# APPROCHE

L'outil de prospection interne de **MJAGENCY** (Sète, Bassin de Thau), réservé à Jérémy et Matheis.

Il couvre six modules :

1. **Terrain** : générateur de tournée qui tient compte des créneaux de chaque métier, méthode de visite en 5 temps, « que faire si », débrief en 30 secondes.
2. **Téléphone** : planificateur de sessions et **mode Appel** plein écran (fiche, téléprompteur, issues en un geste, chrono, dictée), relances automatiques, scripts génériques, règles d'or, conformité.
3. **Scripts** : 16 fiches métier complètes, avec recherche plein texte, favoris, édition, variantes et téléprompteur.
4. **Méthode** : 4 profils de prospect, thermomètre d'intérêt, lecture en direct (50 signaux, règles fixes, sans IA), charte éthique.
5. **Entraînement** : Duo synchronisé entre deux téléphones avec carte secrète 3D et 40 scénarios, flashcards à répétition espacée, défi de 30 secondes, prospect IA en option, progression.
6. **Clients** : dossiers (vue liste, pipeline ou carte 3D), **prompt de recherche unique** par entreprise et versionné, lecture automatique du rapport collé.

S'y ajoutent le **Brief du jour** (accueil), les **Objectifs** (calculateur inverse vers les 3 000 €/mois, indicateurs, classement des secteurs) et les **Réglages** (prix, secteurs, villes, 3D, exports).

L'app vit dans le dossier `approche/` du dépôt, à côté du site vitrine, sans rien partager avec lui.

---

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- Supabase : authentification par email et mot de passe, Postgres avec Row Level Security, Storage pour les photos, Realtime pour le mode Duo
- Framer Motion pour les animations, React Three Fiber et drei pour la 3D
- Zustand pour l'état local (session d'appels, préférences de l'appareil)
- `@anthropic-ai/sdk`, uniquement si `ANTHROPIC_API_KEY` est défini

Le contenu commercial est versionné en TypeScript dans `content/`. Les scripts modifiés depuis l'interface vont dans la table `custom_scripts` et s'appliquent par-dessus, sans jamais écraser les fichiers.

```
approche/
├── app/
│   ├── (app)/            pages avec le dock : Brief, clients, terrain, telephone,
│   │                     scripts, methode, entrainement, tableau, reglages
│   ├── (focus)/          plein écran sans dock : telephone/session (mode Appel)
│   ├── login/            connexion
│   └── api/ai/           pont optionnel vers l'API Claude
├── components/           Dock, Teleprompter, DebriefForm, three/ (3D + repli 2D), clients/, training/, ui/
├── content/              LE contenu : sectors/ (16 fiches), field-method, phone-method,
│                         profiles, thermometer, signals, ethics, scenarios, training,
│                         offers, cities, agency
├── lib/                  données (Supabase ou démo), prompt.ts, report.ts, stats.ts, timing.ts…
├── store/                Zustand
└── supabase/
    ├── migrations/               schéma complet + RLS + stockage + realtime (horodatées)
    ├── config.toml              configuration (inscriptions fermées)
    └── seed.sql                   8 prospects fictifs (facultatif)
```

---

## Démarrer en local

```bash
cd approche
npm install
npm run dev          # http://localhost:3000
```

**Sans rien configurer**, l'app démarre en **mode démo** : on choisit Jérémy ou Matheis sur l'écran de connexion, et 8 prospects fictifs répartis sur le Bassin de Thau sont chargés avec leur historique. Tout est stocké dans le navigateur. On peut remettre la démo à zéro dans **Réglages → Compte**.

Pour tester le mode Duo en local, ouvrez deux onglets. L'un crée la session, l'autre la rejoint avec le code. En mode démo, les onglets se synchronisent entre eux (BroadcastChannel).

---

## Mise en service avec Supabase

> **État actuel** : le projet Supabase **« approche »** (organisation MJAGENCY, Paris, réf. `glgczlkecncpivublwlu`) existe déjà, avec les deux migrations appliquées, et il est relié au dépôt GitHub. L'app est déployée par un projet Vercel dédié (Root Directory `approche`, branche de production `claude/funny-keller-rgmjgv`). Les étapes ci-dessous servent à recréer un projet de zéro.

### Intégration GitHub (branches Supabase)

- **Supabase directory** (Project Settings → Integrations → GitHub) : `approche`, le dossier qui contient `supabase/`.
- Branche de production : la branche par défaut du dépôt. Les migrations de `approche/supabase/migrations/` s'appliquent quand APPROCHE y est fusionnée. Les pull requests ouvrent une base de prévisualisation, remplie avec `seed.sql`.
- Les noms des migrations reprennent l'historique du projet (`20260929075620_…`, `20260929075726_…`) : elles ne sont pas rejouées. Toute nouvelle migration se crée avec `npx supabase migration new <nom>`.

### 1. Créer le projet

1. Sur [supabase.com](https://supabase.com), créez un projet (région : Europe, par exemple `eu-west-3` Paris).
2. La table `associates` de `supabase/migrations/20260929075620_approche_init.sql` autorise `mjagency.officiel@gmail.com`. Pour donner à chacun son propre compte (et ses propres chiffres), ajoutez les adresses :
   ```sql
   insert into public.associates (email, display_name) values
     ('jeremy@…', 'Jérémy'),
     ('matheis@…', 'Matheis');
   ```
3. Dans **SQL Editor**, collez les fichiers de `supabase/migrations/` dans l'ordre et lancez-les. On peut les relancer sans risque.
4. *(Facultatif)* Lancez `supabase/seed.sql` pour avoir les 8 prospects de démonstration.

### 2. Fermer les inscriptions

Dans **Authentication → Sign In / Providers → Email** :

- désactivez **Allow new users to sign up** : seuls les comptes que vous créez vous-mêmes existeront ;
- désactivez **Confirm email** si vous ne voulez pas d'email de confirmation.

Même si quelqu'un obtenait un compte, les règles d'accès ne s'ouvrent qu'aux adresses de la table `associates`. Un compte étranger ne voit rien et ne peut rien écrire, photos comprises.

### 3. Créer les comptes

La connexion se fait en deux temps : le **compte commun** de l'agence (`mjagency.officiel@gmail.com`) ouvre la porte, puis on choisit **Jérémy** ou **Matheis**. L'app bascule alors sur le compte personnel de l'associé choisi, pour que chacun ait ses propres chiffres. La session du compte commun est refermée aussitôt.

**Authentication → Users → Add user → Create new user**, trois fois, avec **le même mot de passe** et « Auto Confirm User » coché :

| Email | Rôle |
|---|---|
| `mjagency.officiel@gmail.com` | compte commun, ouvre la porte |
| `mjagency.officiel+jeremy@gmail.com` | Jérémy |
| `mjagency.officiel+matheis@gmail.com` | Matheis |

Les trois adresses figurent dans `associates` (migrations `…_approche_init` et `…_approche_comptes_associes`). Le profil (nom affiché, couleur) est créé automatiquement à la création du compte. Pour changer le mot de passe, changez-le sur les trois comptes.

Pour ajouter une personne plus tard : `insert into public.associates values ('mjagency.officiel+prenom@gmail.com', 'Prénom');`, puis créez son compte avec le même mot de passe. Elle apparaît d'elle-même dans le choix.

### 4. Brancher l'app

Copiez `.env.example` en `.env.local` et remplissez les deux valeurs de **Project Settings → API** :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
```

Relancez `npm run dev` : l'écran de connexion demande maintenant un email et un mot de passe.

### 5. Analyse automatique des nouveaux clients (API Claude)

Avec `ANTHROPIC_API_KEY` (sur Vercel : **Settings → Environment Variables**, puis redéployer), chaque nouveau dossier client déclenche tout seul une **analyse approfondie** :

1. prompt de recherche unique (fiche, secteur, historique, grille de prix) ;
2. recherche sur le web par Claude, rapport rangé dans l'onglet **Intel** ;
3. rédaction d'un **script terrain et d'un script téléphone uniques** pour ce client, dans l'onglet **Script**. Le téléprompteur et le mode Appel les utilisent en priorité.

Le travail tourne côté serveur (1 à 2 minutes : 2 à 5 recherches web ciblées, puis le script ; jamais plus de 4 min 30, sinon la fiche le signale) et l'avancement s'affiche en temps réel dans la fiche. On peut quitter la page. Le bouton **Refaire l'analyse** relance le tout après ajout d'informations.

Sans clé API, le même onglet **Script** se remplit dès qu'on colle le rapport obtenu via claude.ai ou ChatGPT : le script est alors assemblé automatiquement à partir des constats, questions et objections du rapport.

### 6. *(Facultatif)* API Claude : autres usages

Ajoutez `ANTHROPIC_API_KEY=sk-ant-…` pour activer :

- **Lancer la recherche ici** sur un dossier client (modèle `claude-opus-5-5` avec recherche web, compter 1 à 3 minutes) ;
- le **Prospect IA** en salle d'entraînement.

La route `/api/ai` vérifie la session Supabase et l'appartenance à `associates` avant chaque appel. Si la requête est déclinée par un filtre de sécurité, le repli serveur (`fallbacks: "default"`) relance automatiquement la même requête sur un autre modèle. Sans clé, rien ne casse : les boutons « Copier le prompt », « Ouvrir Claude » et « Ouvrir ChatGPT » suffisent.

---

## Déploiement sur Vercel

L'app est un **projet Vercel distinct** du site vitrine, dans le même dépôt GitHub.

1. Vercel → **Add New → Project** → importez le dépôt `mjagency`.
2. **Root Directory** : `approche`. Le framework Next.js est détecté tout seul.
3. **Environment Variables** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY` (facultatif)
4. **Deploy**. Chaque push sur la branche principale redéploie ensuite l'app.
   Sans les deux variables Supabase, un déploiement Vercel refuse tout accès (le mode démo sans mot de passe ne fonctionne qu'en local).
5. *(Conseillé)* Ajoutez un sous-domaine, par exemple `approche.mjagency.eu`, dans **Settings → Domains**.
6. Dans Supabase → **Authentication → URL Configuration**, mettez l'URL Vercel (ou le sous-domaine) comme **Site URL**.

Sur le téléphone, ouvrez l'app dans Safari ou Chrome, puis choisissez **Partager → Sur l'écran d'accueil** : elle s'ouvre alors en plein écran, comme une app.

Si la recherche IA dépasse le temps alloué sur le plan gratuit de Vercel, la route demande déjà 300 secondes (`maxDuration`). Sur le plan Hobby, la limite peut être plus basse : utilisez alors le copier-coller vers claude.ai.

---

## Version page unique (artefact claude.ai)

```bash
npm run build:artifact   # → artifact/dist/approche.html (≈ 2 Mo, tout est inclus)
```

Construit l'app entière en un seul fichier HTML qui s'ouvre sans serveur, par exemple publié comme artefact claude.ai et ouvert dans Safari. Les mêmes pages sont réutilisées ; seuls le routage (`artifact/router.tsx`) et trois modules Next.js (`artifact/shims/`) sont remplacés.

Cette version est toujours en **mode démo** : les données restent dans le navigateur de chaque appareil, le Duo ne se synchronise qu'entre onglets du même navigateur, et l'impression PDF, l'export CSV et l'API Claude n'y sont pas disponibles.

## Faire évoluer le contenu

| Pour… | Modifier |
|---|---|
| un script, une objection, un créneau | `content/sectors/<secteur>.ts`, ou directement dans l'app (Scripts → Modifier) |
| la méthode terrain | `content/field-method.ts` |
| les scripts téléphone génériques et les relances | `content/phone-method.ts` |
| les signaux et la « prochaine phrase » | `content/signals.ts` (règles fixes, testables) |
| les scénarios Duo | `content/scenarios.ts` et `content/training.ts` |
| les prix | Réglages → Offres et prix (les défauts sont dans `content/offers.ts`) |
| le contexte agence injecté dans les prompts | `content/agency.ts` |

Le format du rapport attendu par le parseur (15 titres fixes) est défini dans `lib/prompt.ts` (`REPORT_SECTIONS`). Si vous changez un titre, le parseur `lib/report.ts` le reconnaît encore par son numéro et par ses mots-clés.

## Commandes

```bash
npm run dev         # développement
npm run build       # build de production
npm run start       # servir le build
npm run typecheck   # vérification TypeScript
```

## Données et conformité

Les fiches prospects sont des données professionnelles, traitées sur la base de l'intérêt légitime (prospection B2B). Le droit d'opposition est mentionné dans les SMS types et dans l'export PDF. Supprimer un dossier supprime aussi son historique, ses prompts et ses rapports. L'onglet **Téléphone → Règles** rappelle les points Bloctel, horaires et RGPD.
