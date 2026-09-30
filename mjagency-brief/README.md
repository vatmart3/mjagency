# Brief site web · MJAGENCY

Formulaire en ligne que les prospects de MJAGENCY remplissent pour décrire
le site qu'ils veulent. Il compte 8 étapes, avec un aperçu du futur site qui
se construit en direct. À la fin, le client signe, valide, puis télécharge
un PDF récapitulatif aux couleurs de MJAGENCY, à nous envoyer.

- Site 100 % statique : un seul `index.html` (HTML, CSS et JS), sans build.
- Bibliothèque unique : jsPDF 2.5.1, chargée depuis cdnjs.
- Aucun serveur, aucune donnée transmise. Le brouillon reste dans le
  navigateur du client (`localStorage`, clé `mjBriefDraft_v1`).
- Page non indexée : balise `robots` et en-tête `X-Robots-Tag` (voir `vercel.json`).

## Tester en 10 secondes

Ouvrez l'URL suivie de `#exemple`, par exemple `https://brief.mjagency.eu/#exemple`.

Le formulaire se remplit avec un exemple fictif (« Maison Levain (exemple) »,
Frontignan) et s'ouvre directement sur l'étape 8. Cliquez sur
« Valider mon brief », puis sur « Télécharger le PDF ».

En local :

```bash
npx serve .
# puis http://localhost:3000/#exemple
```

## Redéployer

Le projet Vercel est lié au dépôt GitHub : chaque `git push` sur `main`
redéploie automatiquement.

Pour forcer un déploiement à la main :

```bash
npx vercel --prod
```
