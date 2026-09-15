/* =========================================================
   « La carte du boucher » — la partition de ce film.

   L'achat mis en scène est celui qui amène réellement Mehdi
   Nasri à l'état qu'affiche l'application : 42,50 €, +43 points,
   1 529 → 1 572 points, 29 → 30 passages. Les chiffres du
   tableau de bord sont ceux du jeu de démonstration du projet.
   ========================================================= */
'use strict';

(function () {

  const { $, $$, on, off, cam, fly, countUp, euros, entier, replay } = Motion;

  const phone  = $('#phone'), app = $('#app'), toast = $('#toast'), outro = $('#outro');
  const carte  = $('#carte'), qr = $('#qr'), valider = $('#valider');
  const touches = $$('#pave span');
  const recs    = $$('#recs li');
  const annivs  = $$('#annivs li');
  const tuiles  = $$('.tuile');

  const AVANT = 1529, APRES = 1572;       /* points, avant et après l'achat */
  const MONTANT = 42.50, POINTS = 43;

  /* Un code à scanner, dessiné : un vrai QR encoderait une adresse
     qui n'existe pas. Le motif est fixe, pour que l'image ne
     scintille pas d'une lecture à l'autre. */
  (function dessinerQR() {
    const N = 29;
    let g = 1, rnd = () => (g = (g * 1103515245 + 12345) % 2147483648) / 2147483648;
    let d = '';
    const reserve = (x, y) =>
      (x < 9 && y < 9) || (x > N - 10 && y < 9) || (x < 9 && y > N - 10);
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++)
        if (!reserve(x, y) && rnd() > .5) d += `M${x} ${y}h1v1h-1z`;
    /* Les trois repères d'angle */
    const oeil = (x, y) =>
      `M${x} ${y}h7v7h-7z M${x+1} ${y+1}h5v5h-5z` .replace(/z/g, 'z') +
      `M${x+2} ${y+2}h3v3h-3z`;
    let yeux = '';
    [[0,0],[N-7,0],[0,N-7]].forEach(([x,y]) => {
      yeux += `M${x} ${y}h7v1h-7z M${x} ${y+6}h7v1h-7z M${x} ${y}h1v7h-1z M${x+6} ${y}h1v7h-1z`
            + `M${x+2} ${y+2}h3v3h-3z`;
    });
    $('#qrArt').innerHTML = `<path d="${d + yeux}" fill="#151517"/>`;
  })();

  function onglet(nom) {
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.nav === nom));
    $$('.view').forEach(v => v.classList.toggle('on', v.dataset.view === nom));
  }

  /* Une touche du pavé s'enfonce, et le montant se remplit par la droite —
     en centimes, comme sur un terminal bancaire. */
  const SAISIE = ['4', '2', '5', '0'];
  let tape = '';
  function frapper(i) {
    const c = SAISIE[i];
    const t = touches.find(e => e.textContent === c);
    on(t, 'tap'); setTimeout(() => off(t, 'tap'), 190);
    tape += c;
    const v = (+tape) / 100;
    $('#mVal').textContent = euros.format(v) + ' €';
    const pts = Math.round(v);
    $('#mPts').textContent = pts ? `+${pts} points pour Mehdi` : '1 point par euro';
    $('#mPts').classList.toggle('credit', !!pts);
  }

  /* ---------------------------------------------------------
     La partition — [seconde, ce qui se passe]
     --------------------------------------------------------- */
  const partition = [

    /* 1 — La carte, dans la poche du client */
    [0.10, () => { cam('translateY(10px)'); on(phone, 'in'); }],
    [1.30, () => on($('#jauge'))],
    [1.55, () => $('#barre').style.width = '78%'],

    /* 2 — La caisse s'ouvre, le code part au scan */
    [3.00, () => { on(phone, 'aside'); on(app, 'in'); onglet('caisse');
                   cam('translate(0,0)'); }],
    [4.40, () => on($('#btnScan'), 'tap')],
    [4.70, () => { off($('#btnScan'), 'tap'); on($('#champ'), 'hot');
                   fly(qr, $('#champ'), { etiquette: 'Carte', valeur: 'n° 1011',
                     arrivee() { on($('#fiche')); off($('#champ'), 'hot'); } }); }],
    [5.10, () => on(qr, 'out')],

    /* 3 — La fiche du client s'ouvre */
    [6.10, () => on($('#dispo'))],
    [6.50, () => { on($('#montant')); on($('#pave')); }],

    /* 4 — Le montant se compose, touche par touche */
    ...SAISIE.map((_, i) => [7.40 + i * 0.42, () => frapper(i)]),
    [9.40, () => on($('.raisons [data-r="habitue"]'), 'pick')],
    [9.90, () => on(valider)],

    /* 5 — On encaisse : les points s'envolent vers la carte */
    [11.00, () => on(valider, 'tap')],
    [11.26, () => off(valider, 'tap')],
    [11.35, () => fly(valider, carte, {
      etiquette: 'Points', valeur: '+' + POINTS, classe: 'gros',
      arrivee() {
        on(carte, 'credit');
        countUp($('#ptsCarte'), APRES, 900, v => entier.format(Math.round(v)), AVANT);
        $('#ficheM').textContent = `n° 1011 · ${entier.format(APRES)} pts · 30 passages`;
        $('#barre').style.width = '100%';
        $('#jaugeT').textContent = 'Toutes les récompenses sont débloquées';
        setTimeout(() => off(carte, 'credit'), 950);
      }
    })],
    [12.60, () => on(toast)],

    /* 6 — Ce que ça débloque, côté client */
    [13.40, () => on($('#reward'))],
    ...[0, 1, 2].map(i => [13.80 + i * 0.22, () => on(recs[i], 'show')]),
    [15.20, () => off(toast)],

    /* 7 — L'anniversaire du mois */
    [16.20, () => { onglet('anniv'); on(phone, 'gone'); on(app, 'mid');
                    cam('translateY(-6px)'); }],
    ...annivs.map((l, i) => [16.80 + i * 0.2, () => on(l, 'show')]),
    [18.40, () => on($('.offrir', annivs[0]), 'tap')],
    [18.66, () => { off($('.offrir', annivs[0]), 'tap'); on(annivs[0], 'donne');
                    $('.offrir', annivs[0]).textContent = '50 points offerts'; }],

    /* 8 — Pourquoi ils viennent */
    [20.40, () => { onglet('dash'); cam('translateY(-10px)'); }],
    ...tuiles.map((t, i) => [20.90 + i * 0.16, () => {
      on(t, 'show');
      const v = $('.t-v', t), to = +v.dataset.to;
      countUp(v, to, 950, x =>
        v.dataset.euro ? entier.format(Math.round(x)) + ' €'
      : v.dataset.cent ? euros.format(x) + ' €'
      :                  entier.format(Math.round(x)));
    }]),
    [21.90, () => on($('.pourquoi'))],
    [22.30, () => on($('#pq'), 'grow')],
    [22.90, () => on($('#meilleurs'))],
    [24.20, () => cam('translateY(-4px)')],

    /* 9 — La signature */
    [26.20, () => { on(app, 'gone'); cam('translateY(0px)'); }],
    [27.00, () => on(outro)],
    [30.20, () => on(replay)]
  ];

  /* ---------------------------------------------------------
     Remise à zéro entre deux lectures
     --------------------------------------------------------- */
  function remiseAZero() {
    [phone, app, toast, outro].forEach(el => el.className = el.className.split(' ')[0]);
    carte.className = 'carte';
    qr.className = 'qr';
    valider.className = 'valider';
    off($('#jauge')); off($('#reward')); off($('#fiche')); off($('#dispo'));
    off($('#montant')); off($('#pave')); off($('#champ'), 'hot');
    off($('#btnScan'), 'tap'); off($('.pourquoi')); off($('#pq'), 'grow'); off($('#meilleurs'));

    tape = '';
    $('#mVal').textContent = '0,00 €';
    $('#mPts').textContent = '1 point par euro';
    off($('#mPts'), 'credit');
    $('#ptsCarte').textContent = entier.format(AVANT);
    $('#ficheM').textContent = `n° 1011 · ${entier.format(AVANT)} pts · 29 passages`;
    $('#valMontant').textContent = euros.format(MONTANT) + ' €';
    $('#barre').style.width = '0';
    $('#jaugeT').textContent = 'Prochaine récompense à 800 points';

    touches.forEach(t => off(t, 'tap'));
    $$('.raisons span').forEach(s => off(s, 'pick'));
    recs.forEach(r => off(r, 'show'));
    annivs.forEach(l => { off(l, 'show'); off(l, 'donne'); off($('.offrir', l), 'tap'); });
    $('.offrir', annivs[0]).textContent = 'Offrir 50 points';
    tuiles.forEach(t => { off(t, 'show'); $('.t-v', t).textContent = '0'; });
    $$('.tab').forEach(t => off(t));
    $$('.view').forEach(v => off(v));
    cam('translateY(18px)');
  }

  Motion.jouer({ partition, remiseAZero });
})();
