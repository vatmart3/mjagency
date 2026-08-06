# MJ Agency — Site vitrine

Site multi-page **sobre, premium, sombre et minimaliste** pour le studio créatif MJ Agency.
HTML/CSS/JS pur, sans framework ni build. Rapide, animé, sans dépendance lourde.

## Pages
- `index.html` — Accueil (hero, savoir-faire, sélection de travaux, CTA)
- `work.html` — Portfolio filtrable
- `studio.html` — Approche, méthode, services
- `contact.html` — Formulaire + calendrier de réservation

## Ce qui casse les codes
- Fond **WebGL** temps réel (flow-field mystérieux qui suit le curseur) — fallback canvas si WebGL indisponible
- **Curseur custom** magnétique avec libellés contextuels
- **Préloader**, **transitions de page** en rideau, **reveals** au scroll
- **Calendrier de réservation** fonctionnel (créneaux, week-ends désactivés, récap live)
- Typographie surdimensionnée, texte outline, marquee, compteurs animés
- Accessible : respecte `prefers-reduced-motion`, responsive mobile complet

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou servir le dossier :
```bash
npx serve .
```

## Personnaliser
- Couleurs / typo : variables CSS en haut de `assets/css/style.css`
- Contenu : directement dans les fichiers `.html`
- Le formulaire de contact est en démo (front) — à brancher sur votre backend / service d'emailing
- Le calendrier est front-only — à connecter à Calendly / Google Calendar pour la prod

## Structure
```
index.html · work.html · studio.html · contact.html
assets/
  css/style.css      → design system
  js/main.js         → interactions (curseur, reveal, calendrier, transitions)
  js/bg.js           → fond WebGL + fallback
```
