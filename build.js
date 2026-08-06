/* =========================================================
   MJ AGENCY — build du fichier unique
   Assemble les 4 pages + CSS + JS en un seul onepage.html
   autonome (navigation interne via le routeur de main.js).

   Usage : node build.js
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const PAGES = [
  ['index.html', 'home'],
  ['work.html', 'work'],
  ['studio.html', 'studio'],
  ['contact.html', 'contact'],
];

/* Extrait le contenu entre deux marqueurs (bornes incluses en option) */
function slice(html, startMarker, endMarker, { keepMarkers = false } = {}) {
  const s = html.indexOf(startMarker);
  if (s === -1) throw new Error(`Marqueur introuvable : ${startMarker}`);
  const e = html.indexOf(endMarker, s + startMarker.length);
  if (e === -1) throw new Error(`Fin introuvable : ${endMarker}`);
  return keepMarkers
    ? html.slice(s, e + endMarker.length)
    : html.slice(s + startMarker.length, e);
}

/* Les liens inter-pages deviennent des cibles du routeur */
function toRouterLinks(html) {
  return html.replace(
    /href="(index|work|studio|contact)\.html"/g,
    (_, name) => `href="#" data-go="${name === 'index' ? 'home' : name}"`
  );
}

const index = read('index.html');

const nav        = toRouterLinks(slice(index, '<header class="nav">', '</header>', { keepMarkers: true }));
const mobileMenu = toRouterLinks(slice(index, '<nav class="mobile-menu">', '</nav>', { keepMarkers: true }));
const loader     = slice(index, '<div class="loader">', '</div>\n</div>', { keepMarkers: true });
const footer     = toRouterLinks(slice(index, '<footer class="footer container">', '</footer>', { keepMarkers: true }));

const bodies = PAGES.map(([file, name]) => {
  const inner = slice(read(file), '<main class="wrap">', '</main>');
  return `<div class="page${name === 'home' ? ' active' : ''}" id="page-${name}">\n${toRouterLinks(inner)}\n</div>`;
}).join('\n\n');

const out = `<title>MJ Agency — Studio créatif digital</title>

<script>
/* Ce build est injecté dans un <head> fourni par l'hôte : sans balise viewport,
   un téléphone rendrait la page sur une largeur de 980 px. On la pose nous-mêmes,
   le plus tôt possible, et seulement si elle manque. */
(function(){
  if (document.querySelector('meta[name="viewport"]')) return;
  var m = document.createElement('meta');
  m.name = 'viewport';
  m.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  document.head.appendChild(m);
})();
</script>

<style>
${read('assets/css/style.css')}
/* Le build en fichier unique n'affiche qu'une page à la fois */
.page{display:none}
.page.active{display:block}
</style>

${loader}

<div class="curtain"></div>
<canvas id="bg-canvas"></canvas>
<div class="work-preview"><div class="ph ph-1"></div></div>

${nav}

${mobileMenu}

<main class="wrap">

${bodies}

</main>

${footer}

<script>
${read('assets/js/bg.js')}
</script>
<script>
${read('assets/js/main.js')}
</script>
`;

fs.writeFileSync(path.join(root, 'onepage.html'), out);
console.log(`onepage.html généré — ${(out.length / 1024).toFixed(1)} Ko`);
