# Pistes audio de la vidéo promo

Déposer ici les fichiers, puis les référencer dans `promo/index.html` :

```js
audio: { music: 'assets/audio/musique.mp3', … }
…
{ type:'logo', t:2.6, vo:{ at:0.25, src:'assets/audio/vo-01.mp3', text:'…' } }
```

## Musique
Un seul fichier, en boucle, mixé sous la voix (le volume baisse
automatiquement pendant chaque phrase — `CONFIG.audio.duck`).
Format : MP3 ou M4A, 44,1 kHz. Vérifier la licence : une musique
protégée bloque la vidéo sur YouTube, Instagram et Meta Ads.

## Voix off
Un fichier par plan, nommé dans l'ordre du montage (`vo-01` … `vo-12`).
Le texte de chaque phrase est déjà écrit dans `CONFIG` : il sert de
sous-titre et de script à lire.

Contrainte : une phrase ne doit pas dépasser la durée de son plan
(champ `t`). Si une prise est plus longue, augmenter le `t` du plan —
la durée du chapitre et celle de la vidéo se recalculent seules.

Les fichiers doivent être servis depuis la même origine que la page
(ou avec un en-tête CORS) pour être mixés dans l'export.

## Effets sonores
Ils ne sont pas des fichiers : le moteur les synthétise en Web Audio
(souffle de transition panoramiqué dans le sens de la coupe, clic à chaque
apparition, texture de défilement dans les maquettes, impact grave à
l'ouverture d'un chapitre, accord sur le plan de contact).

Réglage : `CONFIG.audio.sfx` entre 0 et 1 — `0` les coupe.
Touche `S` pendant la lecture pour les couper à la volée.
Ils passent par le même bus que la musique : ils sont donc dans l'export.
