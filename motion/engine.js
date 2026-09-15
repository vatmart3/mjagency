/* =========================================================
   MJ AGENCY — moteur des séquences animées
   Partagé par tous les films. Il ne connaît aucun décor :
   chaque film lui donne une partition et une remise à zéro.

       Motion.jouer({ partition, remiseAZero })

   Ce qu'il apporte, et qu'on ne veut pas réécrire deux fois :
   la mise à l'échelle plein écran, l'horloge unique, la
   poussière, les compteurs qui montent et le vol d'une donnée
   d'un point de la scène à un autre.
   ========================================================= */
'use strict';

const Motion = (function () {

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const stage  = $('#stage');
  const camera = $('#camera');
  const deck   = $('#deck');
  const replay = $('#replay');
  const FLY    = $('#fly');

  const SOFT   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE = matchMedia('(pointer: coarse)').matches;

  /* ---------------------------------------------------------
     Mise à l'échelle de la scène

     La scène prend toute la fenêtre : on lui donne exactement la
     proportion de l'écran, puis on l'agrandit. L'échelle est choisie
     pour qu'il reste toujours au moins 1240 × 720 d'espace de dessin,
     de sorte que rien ne sorte du cadre — le décor, lui, s'étale
     jusqu'aux bords. Aucune bande noire, aucune déformation.
     --------------------------------------------------------- */
  const DESIGN_W = 1240, DESIGN_H = 720;

  function fit() {
    const vw = innerWidth, vh = innerHeight;

    /* Sur un écran tactile tenu debout, la scène pivote d'un quart de
       tour : couchée sur un écran debout, elle ne remplirait qu'un
       bandeau au milieu. La condition exclut les écrans à souris, pour
       qu'une fenêtre de navigateur étroite ne bascule jamais. */
    const turn = COARSE && vh > vw * 1.15;
    const fw = turn ? vh : vw;      /* la largeur utile, scène tournée */
    const fh = turn ? vw : vh;

    const k = Math.min(fw / DESIGN_W, fh / DESIGN_H);
    const w = fw / k, h = fh / k;

    stage.style.width      = w + 'px';
    stage.style.height     = h + 'px';
    stage.style.marginLeft = (-w / 2) + 'px';
    stage.style.marginTop  = (-h / 2) + 'px';
    stage.style.transform  = (turn ? 'rotate(90deg) ' : '') + `scale(${k})`;
  }
  addEventListener('resize', fit);
  addEventListener('orientationchange', fit);
  fit();

  /* ---------------------------------------------------------
     Poussière
     --------------------------------------------------------- */
  (function dust() {
    const box = $('#dust');
    if (!box) return;
    const n = SOFT ? 0 : 14;
    let html = '';
    for (let i = 0; i < n; i++) {
      const d = (6 + Math.random() * 10).toFixed(1);
      html += `<i style="left:${(Math.random() * 100).toFixed(2)}%;`
            + `top:${(Math.random() * 110).toFixed(2)}%;`
            + `animation-duration:${d}s;`
            + `animation-delay:-${(Math.random() * d).toFixed(1)}s;`
            + `opacity:${(.25 + Math.random() * .6).toFixed(2)}"></i>`;
    }
    box.innerHTML = html;
  })();

  /* ---------------------------------------------------------
     Petits utilitaires
     --------------------------------------------------------- */
  const on  = (el, c = 'on') => el && el.classList.add(c);
  const off = (el, c = 'on') => el && el.classList.remove(c);

  /* La caméra ne fait que translater : changer son échelle obligerait
     le navigateur à redessiner toute la scène pendant toute la
     transition, alors qu'une translation déplace une texture prête. */
  const cam = (t) => { camera.style.transform = t; };

  const euros = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
  const entier = new Intl.NumberFormat('fr-FR');

  /* Numéro de la lecture en cours. Tout ce qui survit d'une lecture à
     l'autre — compteurs, atterrissages — s'y réfère avant d'agir. */
  let gen = 0;

  /* Un compteur qui monte, en sortie douce */
  function countUp(el, to, dur, fmt, from = 0) {
    if (!el) return;
    const mine = gen, t0 = performance.now();
    let vu = null;
    (function step(now) {
      if (mine !== gen) return;            /* une autre lecture a commencé */
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const txt = fmt(from + (to - from) * e);
      /* Sur un écran à 120 Hz, réécrire le texte à chaque image referait
         la mise en page pour rien : on n'écrit qu'au changement. */
      if (txt !== vu) { el.textContent = vu = txt; }
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* Échelle réelle de la scène à cet instant (scène × caméra) */
  const liveScale = () => deck.getBoundingClientRect().width / deck.offsetWidth;

  /* Centre d'un élément, en coordonnées locales de la scène */
  function centre(el, dRect, k) {
    const r = el.getBoundingClientRect();
    return {
      x: (r.left + r.width  / 2 - dRect.left) / k,
      y: (r.top  + r.height / 2 - dRect.top ) / k
    };
  }

  /* ---------------------------------------------------------
     Le vol d'une donnée, d'un point de la scène à un autre

     Les deux positions sont mesurées en coordonnées de scène, ce
     qui laisse la caméra bouger pendant le vol sans décaler
     l'atterrissage. `arrivee` est appelée quand l'étiquette se pose.
     --------------------------------------------------------- */
  function fly(src, dst, { etiquette = '', valeur = '', classe = '', duree = 850, arrivee } = {}) {
    if (!src || !dst) return;

    const k  = liveScale();
    const dR = deck.getBoundingClientRect();
    const a  = centre(src, dR, k);
    const b  = centre(dst, dR, k);
    const mine = gen;

    const contenu = (etiquette ? `<b>${etiquette}</b>` : '') + valeur;
    const faire = (cls) => {
      const el = document.createElement('span');
      el.className = cls;
      el.innerHTML = contenu;
      el.style.left = a.x + 'px';
      el.style.top  = a.y + 'px';
      el.style.transform = 'translate(-50%,-50%)';
      FLY.appendChild(el);
      return el;
    };

    const trail = faire('flychip flytrail ' + classe);  /* la traîne, en retard et floutée */
    const chip  = faire('flychip ' + classe);

    /* Une image pour que la position de départ soit prise en compte */
    const pose = `translate(-50%,-50%) translate(${(b.x - a.x).toFixed(1)}px,${(b.y - a.y).toFixed(1)}px)`;
    requestAnimationFrame(() => {
      chip.style.transform = pose;
      trail.style.transform = pose;
    });

    setTimeout(() => {
      if (mine !== gen) { chip.remove(); trail.remove(); return; }
      chip.style.opacity = '0';
      trail.style.opacity = '0';
      setTimeout(() => { chip.remove(); trail.remove(); }, 340);
      if (arrivee) arrivee();
    }, duree);
  }

  /* ---------------------------------------------------------
     L'horloge

     Une seule horloge, relue à chaque image, plutôt qu'une
     trentaine de minuteurs posés au lancement. Trois choses en
     découlent :

     — si une image saute, les repères suivants restent à l'heure
       au lieu de dériver les uns par rapport aux autres ;
     — dans un onglet en arrière-plan, le navigateur cesse
       d'appeler l'horloge : on la met en pause et on la reprend au
       retour, au lieu de voir toute la séquence se jouer d'un bloc ;
     — un rejeu remet le compteur à zéro, sans minuteur en retard
       qui viendrait rallumer un élément déjà éteint.
     --------------------------------------------------------- */
  const SPEED = SOFT ? 2.8 : 1;   /* animations réduites : on abrège */

  let partition = [], remiseAZero = () => {};
  let raf = 0, cue = 0, start = 0, held = 0;

  function frame(now) {
    const t = (now - start) / 1000 * SPEED;
    while (cue < partition.length && partition[cue][0] <= t) partition[cue++][1]();
    raf = cue < partition.length ? requestAnimationFrame(frame) : 0;
  }

  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  /* Onglet masqué : on gèle le temps écoulé, on repart d'ici au retour. */
  addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (raf) { held = performance.now() - start; stop(); }
    } else if (held) {
      start = performance.now() - held;
      held = 0;
      if (cue < partition.length) raf = requestAnimationFrame(frame);
    }
  });

  function play() {
    gen++;                 /* tout ce qui traîne de la lecture d'avant expire */
    stop();
    cue = 0; held = 0;
    FLY.innerHTML = '';
    off(replay);
    remiseAZero();
    /* Une image de battement, pour que la remise à zéro soit peinte
       avant que la première transition ne parte. */
    requestAnimationFrame(() => {
      start = performance.now();
      raf = requestAnimationFrame(frame);
    });
  }

  if (replay) replay.addEventListener('click', play);
  addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); play(); }
  });

  return {
    $, $$, on, off, cam, fly, countUp, euros, entier, replay, SOFT,
    jouer(film) {
      partition   = film.partition;
      remiseAZero = film.remiseAZero || (() => {});
      play();
    }
  };
})();
