# Outils — exporter les films

Deux scripts, à lancer depuis `motion/`.

## `rendu.js` — la vidéo

```
node outils/rendu.js file://$PWD/index.html 32.6 /tmp/prise
```

Trois pièges, tous rencontrés, tous contournés ici :

1. **L'enregistreur du navigateur ne capte que 25 images par seconde.**
   Une animation à 60 i/s captée ainsi puis ré-encodée en 30 donne un
   fichier qui saccade, alors que la page est fluide. Le script joue donc
   le film au quart de sa vitesse (`?vitesse=0.25`, qui ralentit aussi
   les transitions CSS) ; le montage accélère d'autant.
2. **La fenêtre réelle ne fait pas la taille demandée** — 1920 × 993 au
   lieu de 1920 × 1080 — et l'enregistreur comble par une bande grise en
   bas de l'image. `Emulation.setDeviceMetricsOverride` l'impose.
3. **L'enregistrement commence avant le film.** `?capture` retient le
   départ, le script déclenche lui-même ; il reste à mesurer l'amorce sur
   le fichier produit et à la recouper.

Montage :

```
ffmpeg -i prise.webm -vf "setpts=PTS/4,fps=60,format=yuv420p" \
       -c:v libx264 -preset slow -crf 17 -movflags +faststart brut.mp4
# mesurer l'amorce sur brut.mp4, puis :
ffmpeg -ss <amorce> -i brut.mp4 -t <durée> -vf "fps=60" \
       -c:v libx264 -preset slow -crf 17 -movflags +faststart film.mp4
```

Vérifier ensuite qu'un repère connu tombe à la bonne seconde : la
synchronisation du son en dépend.

## Le son

Il n'y en a pas. Une bande a été synthétisée puis retirée : elle ne
convenait pas, et je n'ai aucun moyen de juger un son à l'oreille — je
ne peux qu'en mesurer les niveaux, ce qui évite qu'il écrête mais ne dit
rien de sa qualité.

Les repères sont dans le README principal, plan par plan et à la
seconde : de quoi caler des sons existants sur l'image sans avoir à
retrouver la partition.
