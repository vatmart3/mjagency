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
    ├── migrations/0001_init.sql   schéma complet + RLS + stockage + realtime
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

### 1. Créer le projet

1. Sur [supabase.com](https://supabase.com), créez un projet (région : Europe, par exemple `eu-west-3` Paris).
2. **Avant toute chose**, ouvrez `supabase/migrations/0001_init.sql` et remplacez les deux adresses de la table `associates` par vos vraies adresses :
   ```sql
   insert into public.associates (email, display_name) values
     ('jeremy@votre-domaine.fr', 'Jérémy'),
     ('matheis@votre-domaine.fr', 'Matheis')
   ```
3. Dans **SQL Editor**, collez tout le fichier et lancez-le. On peut le relancer sans risque.
4. *(Facultatif)* Lancez `supabase/seed.sql` pour avoir les 8 prospects de démonstration.

### 2. Fermer les inscriptions

Dans **Authentication → Sign In / Providers → Email** :

- désactivez **Allow new users to sign up** : seuls les comptes que vous créez vous-mêmes existeront ;
- désactivez **Confirm email** si vous ne voulez pas d'email de confirmation.

Même si quelqu'un obtenait un compte, les règles d'accès ne s'ouvrent qu'aux adresses de la table `associates`. Un compte étranger ne voit rien et ne peut rien écrire, photos comprises.

### 3. Créer les 2 comptes

**Authentication → Users → Add user → Create new user**, une fois pour chacun :

| Email | Mot de passe | Auto Confirm User |
|---|---|---|
| l'adresse de Jérémy (identique à `associates`) | au choix, 12 caractères minimum | coché |
| l'adresse de Matheis | au choix | coché |

Le profil (nom affiché, couleur) est créé automatiquement à la création du compte.

Pour ajouter une personne plus tard : `insert into public.associates values ('email@…', 'Prénom');`, puis créez son compte.

### 4. Brancher l'app

Copiez `.env.example` en `.env.local` et remplissez les deux valeurs de **Project Settings → API** :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
```

Relancez `npm run dev` : l'écran de connexion demande maintenant un email et un mot de passe.

### 5. *(Facultatif)* API Claude

Ajoutez `ANTHROPIC_API_KEY=sk-ant-…` pour activer :

- **Lancer la recherche ici** sur un dossier client (modèle `claude-opus-5` avec recherche web, compter 1 à 3 minutes) ;
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
5. *(Conseillé)* Ajoutez un sous-domaine, par exemple `approche.mjagency.eu`, dans **Settings → Domains**.
6. Dans Supabase → **Authentication → URL Configuration**, mettez l'URL Vercel (ou le sous-domaine) comme **Site URL**.

Sur le téléphone, ouvrez l'app dans Safari ou Chrome, puis choisissez **Partager → Sur l'écran d'accueil** : elle s'ouvre alors en plein écran, comme une app.

Si la recherche IA dépasse le temps alloué sur le plan gratuit de Vercel, la route demande déjà 300 secondes (`maxDuration`). Sur le plan Hobby, la limite peut être plus basse : utilisez alors le copier-coller vers claude.ai.

---

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
