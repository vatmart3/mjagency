/* =========================================================
   « La carte de fidélité » — la partition de ce film.

   Un seul achat, suivi de bout en bout : 42,50 € encaissés,
   +43 points, 1 529 → 1 572 points, 29 → 30 passages. Les
   chiffres se répondent d'un plan à l'autre, jusqu'au tableau
   de bord où la cliente reparaît avec ses totaux.
   ========================================================= */
'use strict';

(function () {

  const { $, $$, on, off, cam, cadre, fly, countUp, euros, entier, replay } = Motion;

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

  /* ---------------------------------------------------------
     Le découpage

     `cadre(x, y, s)` amène le point (x, y) de la scène au centre du
     cadre, à l'échelle s — repère centré, x vers la droite. Huit
     cadres, deux coupes franches, et à l'intérieur de chaque plan un
     mouvement lent : un cadre parfaitement fixe fait tableau, pas film.
     --------------------------------------------------------- */
  const CARTE       = cadre(   0, -154, 1.30);   // la carte, plein cadre
  const CARTE_PLUS  = cadre(   0, -150, 1.38);   // le même plan, qui se resserre
  const LARGE       = cadre(   0,    0, 1.00);
  const FICHE       = cadre( 170,  -90, 1.20);   // le client s'ouvre en caisse
  const PAVE        = cadre( 284,  -20, 1.18);   // le pavé numérique
  const PAVE_PLUS   = cadre( 275,    0, 1.20);
  const VALIDER     = cadre( 150,   60, 1.06);   // le bouton
  const CARTE_SERRE = cadre(-400, -136, 1.35);   // retour sur le téléphone
  const CARTE_OUVRE = cadre(-400,  -40, 1.12);   // on découvre les récompenses
  const ANNIV       = cadre(   0,  -30, 1.04);
  const TUILES      = cadre(   0, -108, 1.38);   // la rangée de compteurs, plein cadre
  const FIN         = cadre(   0,    0, 1.05);

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
    $('#mPts').textContent = pts ? `+${pts} points pour Camille` : '1 point par euro';
    $('#mPts').classList.toggle('credit', !!pts);
  }

  /* ---------------------------------------------------------
     La partition — [seconde, ce qui se passe]
     --------------------------------------------------------- */
  const partition = [

    /* 1 — La carte, dans la poche du client */
    /* 1 — Plan serré sur la carte */
    [0.10, () => on(phone, 'in')],
    [0.60, () => cam(CARTE_PLUS, 2.6)],          // il se resserre doucement
    [1.30, () => on($('#jauge'))],
    [1.55, () => $('#barre').style.width = '78%'],

    /* 2 — La caisse s'ouvre, le code part au scan */
    /* 2 — On s'élargit : la caisse entre */
    [2.85, () => cam(LARGE, 1.5)],
    [3.00, () => { on(phone, 'aside'); on(app, 'in'); onglet('caisse'); }],
    [4.40, () => on($('#btnScan'), 'tap')],
    [4.70, () => { off($('#btnScan'), 'tap'); on($('#champ'), 'hot');
                   fly(qr, $('#champ'), { etiquette: 'Carte', valeur: 'n° 1042',
                     arrivee() { on($('#fiche')); off($('#champ'), 'hot'); } }); }],
    [5.10, () => on(qr, 'out')],

    /* 3 — On entre dans la caisse */
    [4.60, () => cam(FICHE, 1.3)],
    [6.10, () => on($('#dispo'))],
    [6.50, () => { on($('#montant')); on($('#pave')); }],

    /* 4 — Plan sur le pavé, le montant se compose */
    [6.60, () => cam(PAVE, 1.2)],
    ...SAISIE.map((_, i) => [7.40 + i * 0.42, () => frapper(i)]),
    [8.80, () => cam(PAVE_PLUS, 1.8)],           // appui lent pendant la frappe
    [9.40, () => on($('.raisons [data-r="habitue"]'), 'pick')],
    [9.90, () => on(valider)],
    [10.50, () => cam(VALIDER, 1.0)],

    /* 5 — On encaisse : les points s'envolent vers la carte */
    [11.00, () => on(valider, 'tap')],
    [11.26, () => off(valider, 'tap')],
    [11.35, () => fly(valider, carte, {
      etiquette: 'Points', valeur: '+' + POINTS, classe: 'gros',
      arrivee() {
        on(carte, 'credit');
        countUp($('#ptsCarte'), APRES, 900, v => entier.format(Math.round(v)), AVANT);
        $('#ficheM').textContent = `n° 1042 · ${entier.format(APRES)} pts · 30 passages`;
        $('#barre').style.width = '100%';
        $('#jaugeT').textContent = 'Toutes les récompenses sont débloquées';
        setTimeout(() => off(carte, 'credit'), 950);
      }
    })],
    [11.55, () => on(toast)],
    /* COUPE — on passe sur le téléphone pendant que les points volent.
       La caisse recule dans l'ombre : elle n'est plus le sujet. */
    [11.95, () => { cam(CARTE_SERRE, 0); on(app, 'recule'); }],

    /* 6 — On ouvre le cadre : ce que ça débloque */
    [13.10, () => off(toast)],
    [13.40, () => on($('#reward'))],
    [13.45, () => cam(CARTE_OUVRE, 1.6)],
    ...[0, 1, 2].map(i => [13.80 + i * 0.22, () => on(recs[i], 'show')]),

    /* 7 — L'anniversaire du mois */
    [15.95, () => off(app, 'recule')],
    [16.05, () => cam(ANNIV, 1.2)],
    [16.20, () => { onglet('anniv'); on(phone, 'gone'); on(app, 'mid'); }],
    [17.80, () => cam(LARGE, 2.6)],              // on respire
    ...annivs.map((l, i) => [16.80 + i * 0.2, () => on(l, 'show')]),
    [18.40, () => on($('.offrir', annivs[0]), 'tap')],
    [18.66, () => { off($('.offrir', annivs[0]), 'tap'); on(annivs[0], 'donne');
                    $('.offrir', annivs[0]).textContent = '50 points offerts'; }],

    /* 8 — COUPE sur les compteurs, puis on recule */
    [20.40, () => { onglet('dash'); cam(TUILES, 0); }],
    ...tuiles.map((t, i) => [20.90 + i * 0.16, () => {
      on(t, 'show');
      const v = $('.t-v', t), to = +v.dataset.to;
      countUp(v, to, 950, x =>
        v.dataset.euro ? entier.format(Math.round(x)) + ' €'
      : v.dataset.cent ? euros.format(x) + ' €'
      :                  entier.format(Math.round(x)));
    }]),
    [21.50, () => on($('.pourquoi'))],
    [21.85, () => on($('#pq'), 'grow')],
    [22.20, () => cam(LARGE, 2.6)],
    [22.60, () => on($('#meilleurs'))],

    /* 9 — La signature */
    [26.20, () => { on(app, 'gone'); cam(FIN, 2.2); }],
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
    $('#ficheM').textContent = `n° 1042 · ${entier.format(AVANT)} pts · 29 passages`;
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
    cam(CARTE, 0);            /* on ouvre déjà serré sur la carte */
  }

  Motion.jouer({ partition, remiseAZero });
})();
