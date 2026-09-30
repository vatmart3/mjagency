# Brief site web · MJAGENCY

Formulaire en ligne que les prospects de MJAGENCY remplissent pour décrire le
site qu'ils veulent : 8 étapes, une maquette qui se construit en direct, une
signature, puis un PDF récapitulatif brandé à télécharger et à nous envoyer.

- Un seul fichier `index.html` (HTML + CSS + JS vanilla), sans build.
- Seule dépendance : jsPDF 2.5.1, chargé depuis cdnjs.
- Le brouillon reste dans le navigateur du client (`localStorage`, clé
  `mjBriefDraft_v1`). Rien ne part tant que le client n'a pas validé et
  cliqué sur « Envoyer à MJAGENCY ».
- Une seule fonction serverless, `api/send-brief.js`, pour l'envoi.
- Page non indexée (`noindex, nofollow` en balise meta et en en-tête HTTP).

## L'envoi à MJAGENCY

Une fois le brief validé, le bouton « Envoyer à MJAGENCY » fabrique le PDF
et le poste à `/api/send-brief`, qui l'envoie via **Resend** à
`mjagency.officiel@gmail.com`, en pièce jointe, avec un résumé dans le corps
du message. « Répondre » écrit directement au client.

Si l'envoi échoue (service non configuré, hors ligne, page ouverte en
local), le PDF est téléchargé et un bouton ouvre la messagerie du client,
déjà adressée à `mjagency.officiel@gmail.com`.

Variables à poser dans Vercel → **Settings → Environment Variables** :

| Nom | Valeur | Requis |
|---|---|---|
| `RESEND_API_KEY` | la clé `re_…` (la même que pour le site principal convient) | oui |
| `MAIL_FROM` | `MJAGENCY <brief@mjagency.eu>` | après vérification du domaine chez Resend |
| `MAIL_TO` | destinataire, si autre que `mjagency.officiel@gmail.com` | non |

Puis redéployer : les variables ne sont lues qu'au déploiement suivant.

**Important.** Sans `MAIL_FROM`, les messages partent de
`onboarding@resend.dev`, qui **n'écrit qu'à l'adresse du compte Resend**.
Pour recevoir les briefs sur `mjagency.officiel@gmail.com`, il faut soit
vérifier `mjagency.eu` dans Resend → **Domains** (et poser `MAIL_FROM`),
soit que le compte Resend soit ouvert avec cette adresse.

Diagnostic : ouvrir `/api/send-brief` dans un navigateur indique si la
fonction est déployée et si la clé est posée (sans jamais afficher de valeur).

## Tester en 10 secondes

Ajoutez `#exemple` à l'adresse, par exemple `https://brief.mjagency.eu/#exemple`.
Le formulaire se remplit avec un client fictif (Maison Levain, boulangerie à
Frontignan, signature comprise). Allez à l'étape 8, cliquez sur
« Valider mon brief », puis « Télécharger le PDF » ou « Envoyer à MJAGENCY ».
L'envoi part vraiment : le brief d'exemple arrivera dans la boîte.

Attention : l'exemple remplace le brouillon enregistré dans ce navigateur.

En local :

```bash
npx serve .
# puis http://localhost:3000/#exemple
```

En local, `/api/send-brief` n'existe pas : l'envoi bascule sur le repli
(PDF téléchargé + messagerie). Pour tester la vraie fonction : `npx vercel dev`.

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
