# Brief site web · MJAGENCY

Formulaire en ligne que les prospects de MJAGENCY remplissent pour décrire le
site qu'ils veulent : 8 étapes, une maquette qui se construit en direct, une
signature, puis un PDF récapitulatif brandé à télécharger et à nous envoyer.

- Un seul fichier `index.html` (HTML + CSS + JS vanilla), sans build.
- Seule dépendance : jsPDF 2.5.1, chargé depuis cdnjs.
- Aucun serveur : le brouillon reste dans le navigateur du client
  (`localStorage`, clé `mjBriefDraft_v1`). Rien n'est envoyé tant que le
  client ne nous transmet pas son PDF.
- Page non indexée (`noindex, nofollow` en balise meta et en en-tête HTTP).

## Tester en 10 secondes

Ajoutez `#exemple` à l'adresse, par exemple `https://brief.mjagency.eu/#exemple`.
Le formulaire se remplit avec un client fictif (Maison Levain, boulangerie à
Frontignan, signature comprise). Allez à l'étape 8, cliquez sur
« Valider mon brief » puis « Télécharger le PDF ».

Attention : l'exemple remplace le brouillon enregistré dans ce navigateur.

En local :

```bash
npx serve .
# puis http://localhost:3000/#exemple
```

## Redéployer

Le projet Vercel `mjagency-brief` est relié au dépôt GitHub : chaque push sur
`main` part en production automatiquement.

```bash
git add -A && git commit -m "…" && git push
```

Déploiement manuel, depuis ce dossier :

```bash
npx vercel --prod
```

Réglages Vercel : framework « Other », pas de commande de build, dossier de
sortie à la racine. Les en-têtes HTTP sont dans `vercel.json`.
