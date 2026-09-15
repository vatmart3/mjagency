/* =========================================================
   « Du mail au planning » — moteur d'animation
   Une scène de 1280 × 720 mise à l'échelle, pilotée par une
   liste de repères temporels. Aucune dépendance.
   ========================================================= */
'use strict';

(function () {

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const stage  = $('#stage');
  const camera = $('#camera');
  const deck   = $('#deck');
  const replay = $('#replay');

  const SOFT = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Mise à l'échelle de la scène
     --------------------------------------------------------- */
  function fit() {
    const k = Math.min(innerWidth / 1280, innerHeight / 720);
    stage.style.transform = `translate(-50%,-50%) scale(${k})`;
  }
  addEventListener('resize', fit);
  fit();

  /* ---------------------------------------------------------
     Poussière
     --------------------------------------------------------- */
  (function dust() {
    const box = $('#dust');
    const n = SOFT ? 0 : 46;
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
  const on   = (el, c = 'on')    => el && el.classList.add(c);
  const off  = (el, c = 'on')    => el && el.classList.remove(c);
  const cam  = (t)               => { camera.style.transform = t; };

  const nf = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });

  /* Un compteur qui monte, en sortie douce */
  function countUp(el, to, dur, fmt) {
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
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
     Le vol d'une donnée : du mail vers le champ de la fiche
     --------------------------------------------------------- */
  const FLY = $('#fly');
  const LABELS = {
    client: 'Client', projet: 'Projet', surface: 'Surface',
    pose: 'Pose',     echeance: 'Échéance', lieu: 'Lieu'
  };
  const VALUES = {
    client: 'Martin Leroy', projet: 'Rénovation cuisine', surface: '12 m²',
    pose: 'Incluse',        echeance: '15 octobre',       lieu: 'Liège'
  };

  function flyOne(key) {
    const src = $(`.ent[data-ent="${key}"]`);
    const fld = $(`.field[data-field="${key}"]`);
    if (!src || !fld) return;

    const k  = liveScale();
    const dR = deck.getBoundingClientRect();
    const a  = centre(src, dR, k);
    const b  = centre(fld, dR, k);

    const chip = document.createElement('span');
    chip.className = 'flychip';
    chip.innerHTML = `<b>${LABELS[key]}</b>${VALUES[key]}`;
    chip.style.left = a.x + 'px';
    chip.style.top  = a.y + 'px';
    chip.style.transform = 'translate(-50%,-50%)';
    FLY.appendChild(chip);

    src.classList.add('spent');

    /* Une image pour que la position de départ soit prise en compte */
    requestAnimationFrame(() => {
      chip.style.transform =
        `translate(-50%,-50%) translate(${(b.x - a.x).toFixed(1)}px,${(b.y - a.y).toFixed(1)}px)`;
    });

    setTimeout(() => {
      fld.classList.add('hit');
      on($('.v', fld));
      chip.style.opacity = '0';
      setTimeout(() => chip.remove(), 320);
      setTimeout(() => fld.classList.remove('hit'), 700);
    }, 850);
  }

  /* ---------------------------------------------------------
     Navigation de l'outil
     --------------------------------------------------------- */
  function goto(name) {
    $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.nav === name));
    $$('.view').forEach(v => v.classList.toggle('on', v.dataset.view === name));
  }

  /* ---------------------------------------------------------
     La partition
     --------------------------------------------------------- */
  const mail    = $('#mail');
  const app     = $('#app');
  const phone   = $('#phone');
  const flow    = $('#flow');
  const toast   = $('#toast');
  const outro   = $('#outro');
  const cta     = $('#cta');
  const accept  = $('#accept');

  const rows  = $$('#mailList .row');
  const lns   = $$('.mo-body .ln');
  const lines = $$('#lines .line');
  const sums  = $$('#sums p');
  const stats = $$('.stat');
  const cards = $$('#flow .fc');

  const ENTS = ['projet', 'surface', 'pose', 'echeance', 'lieu', 'client'];

  const score = [

    /* 1 — La boîte de réception */
    [0.10, () => { cam('scale(1.05) translateY(6px)'); on(mail, 'in'); }],
    ...rows.map((r, i) => [0.55 + i * 0.13, () => on(r, 'show')]),

    /* 2 — Le mail s'ouvre */
    [2.60, () => { on($('#mailList'), 'out'); on(mail, 'open'); on($('#mailOpen'), 'in');
                   cam('scale(1.09) translateY(2px)'); }],
    ...lns.map((l, i) => [2.95 + i * 0.15, () => on(l, 'show')]),

    /* 3 — L'IA lit le mail */
    [4.45, () => { on(mail, 'reading'); on($('#aiBadge')); }],
    ...ENTS.map((e, i) => [4.85 + i * 0.2, () => on($(`.ent[data-ent="${e}"]`))]),

    /* 4 — Les données s'envolent vers la fiche */
    [6.30, () => { on(mail, 'away'); on(app, 'in'); goto('clients');
                   cam('scale(1) translate(0,0)'); }],
    ...ENTS.map((e, i) => [7.60 + i * 0.14, () => flyOne(e)]),

    /* 5 — La fiche client est créée */
    [9.55, () => on($('#chipAuto'))],
    [9.85, () => on($('#tagProspect'))],
    [10.00, () => on($$('#log li')[0], 'show')],
    [10.15, () => on($$('#log li')[1], 'show')],

    /* 6 — Le devis */
    [11.40, () => { goto('devis'); on(app, 'mid'); off(mail, 'away'); on(mail, 'gone');
                    cam('scale(1.03) translateY(-4px)'); }],
    ...lines.map((l, i) => [11.85 + i * 0.16, () => on(l, 'show')]),
    [12.65, () => on(sums[0], 'show')],
    [12.80, () => on(sums[1], 'show')],
    [12.95, () => { on(sums[2], 'show');
                    countUp($('#total'), 9561.20, 1100, v => nf.format(v) + ' €'); }],
    [14.30, () => on(cta, 'show')],

    /* 7 — Envoi, puis acceptation sur le téléphone */
    [15.30, () => on(cta, 'tap')],
    [15.55, () => off(cta, 'tap')],
    [15.60, () => { on(app, 'aside'); on(phone, 'in'); cam('scale(1) translateY(4px)'); }],
    [16.90, () => on(accept, 'tap')],
    [17.15, () => { off(accept, 'tap'); on(accept, 'done'); }],
    [17.80, () => on(toast)],

    /* 8 — Le planning */
    [18.60, () => { goto('planning'); off(app, 'aside'); on(phone, 'gone');
                    cam('scale(1) translate(0,-8px)'); }],
    [19.20, () => on($('#evPose'), 'show')],
    [19.60, () => on($('#evLivr'), 'show')],
    [20.20, () => off(toast)],

    /* 9 — Les automatisations */
    [20.60, () => cam('scale(.98) translate(0,-26px)')],
    ...cards.flatMap((c, i) => [
      [20.75 + i * 0.34, () => on(c, 'show')],
      [21.05 + i * 0.34, () => on(c, 'link')]
    ]),

    /* 10 — Le tableau de bord */
    [23.80, () => { cards.forEach(c => { off(c, 'show'); off(c, 'link'); });
                    cam('scale(1) translate(0,0)'); }],
    [24.20, () => goto('dash')],
    ...stats.map((s, i) => [24.45 + i * 0.16, () => {
      on(s, 'show');
      const v = $('.s-v', s);
      countUp(v, +v.dataset.to, 900, x => String(Math.round(x)));
    }]),
    [25.40, () => on($('#chart'), 'grow')],
    [26.20, () => cam('scale(1.04) translateY(-6px)')],

    /* 11 — La signature */
    [28.00, () => { on(app, 'gone'); on(mail, 'gone'); cam('scale(1.1)'); }],
    [28.80, () => on(outro)],
    [31.80, () => on(replay)]
  ];

  /* ---------------------------------------------------------
     Horloge
     --------------------------------------------------------- */
  let timers = [];

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    FLY.innerHTML = '';
    off(replay);

    [mail, app, phone, toast, outro].forEach(el =>
      el.className = el.className.split(' ')[0]);
    $('#mailList').className = 'mail-list';
    $('#mailOpen').className = 'mail-open';
    off($('#aiBadge')); off($('#chipAuto')); off($('#tagProspect'));
    off($('#chart'), 'grow');
    cta.className = 'cta'; accept.className = 'accept';
    $('#total').textContent = '0,00 €';

    $$('.ent').forEach(e => { off(e); off(e, 'spent'); });
    $$('.field').forEach(f => { off(f, 'hit'); off($('.v', f)); });
    [...rows, ...lns, ...lines, ...sums, ...stats, ...$$('#log li'),
     $('#evPose'), $('#evLivr')].forEach(el => off(el, 'show'));
    cards.forEach(c => { off(c, 'show'); off(c, 'link'); });
    $$('.s-v').forEach(v => v.textContent = '0');
    $$('.nav').forEach(n => off(n));
    $$('.view').forEach(v => off(v));
    cam('scale(1.06) translateY(12px)');
  }

  function play() {
    reset();
    /* Une image de battement, pour que la remise à zéro soit peinte */
    requestAnimationFrame(() => {
      score.forEach(([t, fn]) =>
        timers.push(setTimeout(fn, (SOFT ? t * 0.35 : t) * 1000)));
    });
  }

  replay.addEventListener('click', play);
  addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') play(); });

  play();
})();
