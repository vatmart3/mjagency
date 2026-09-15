/* =========================================================
   « Du mail au planning » — la partition de ce film.
   La mécanique est dans engine.js ; ici, seulement le décor
   qui bouge et à quelle seconde.
   ========================================================= */
'use strict';

(function () {

  const { $, $$, on, off, cam, fly, countUp, euros, replay } = Motion;

  /* ---------------------------------------------------------
     Les données que l'IA extrait du mail, et leur champ d'arrivée
     --------------------------------------------------------- */
  const DONNEES = [
    ['projet',   'Projet',   'Rénovation cuisine'],
    ['surface',  'Surface',  '12 m²'],
    ['pose',     'Pose',     'Incluse'],
    ['echeance', 'Échéance', '15 octobre'],
    ['lieu',     'Lieu',     'Liège'],
    ['client',   'Client',   'Martin Leroy'],
  ];

  function envoler([cle, etiquette, valeur]) {
    const src = $(`.ent[data-ent="${cle}"]`);
    const fld = $(`.field[data-field="${cle}"]`);
    src.classList.add('spent');
    fly(src, fld, {
      etiquette, valeur,
      arrivee() {
        fld.classList.add('hit');
        on($('.v', fld));
        setTimeout(() => fld.classList.remove('hit'), 720);
      }
    });
  }

  /* Navigation de l'outil */
  function goto(nom) {
    $$('.nav').forEach(n => n.classList.toggle('on', n.dataset.nav === nom));
    $$('.view').forEach(v => v.classList.toggle('on', v.dataset.view === nom));
  }

  const mail   = $('#mail'),  app   = $('#app'),   phone = $('#phone');
  const toast  = $('#toast'), outro = $('#outro'), cta   = $('#cta');
  const accept = $('#accept');

  const rows  = $$('#mailList .row');
  const lns   = $$('.mo-body .ln');
  const lines = $$('#lines .line');
  const sums  = $$('#sums p');
  const stats = $$('.stat');
  const cards = $$('#flow .fc');

  /* ---------------------------------------------------------
     La partition — [seconde, ce qui se passe]
     --------------------------------------------------------- */
  const partition = [

    /* 1 — La boîte de réception */
    [0.10, () => { cam('translateY(8px)'); on(mail, 'in'); }],
    ...rows.map((r, i) => [0.55 + i * 0.13, () => on(r, 'show')]),

    /* 2 — Le mail s'ouvre */
    [2.60, () => { on($('#mailList'), 'out'); on(mail, 'open'); on($('#mailOpen'), 'in');
                   cam('translateY(0px)'); }],
    ...lns.map((l, i) => [2.95 + i * 0.15, () => on(l, 'show')]),

    /* 3 — L'IA lit le mail */
    [4.45, () => { on(mail, 'reading'); on($('#aiBadge')); }],
    ...DONNEES.map(([c], i) => [4.85 + i * 0.2, () => on($(`.ent[data-ent="${c}"]`))]),

    /* 4 — Les données s'envolent vers la fiche */
    [6.30, () => { on(mail, 'away'); on(app, 'in'); goto('clients'); cam('translate(0,0)'); }],
    ...DONNEES.map((d, i) => [7.60 + i * 0.14, () => envoler(d)]),

    /* 5 — La fiche client est créée */
    [9.55, () => on($('#chipAuto'))],
    [9.85, () => on($('#tagProspect'))],
    [10.00, () => on($$('#log li')[0], 'show')],
    [10.15, () => on($$('#log li')[1], 'show')],

    /* 6 — Le devis */
    [11.40, () => { goto('devis'); on(app, 'mid'); off(mail, 'away'); on(mail, 'gone');
                    cam('translateY(-6px)'); }],
    ...lines.map((l, i) => [11.85 + i * 0.16, () => on(l, 'show')]),
    [12.65, () => on(sums[0], 'show')],
    [12.80, () => on(sums[1], 'show')],
    [12.95, () => { on(sums[2], 'show');
                    countUp($('#total'), 9561.20, 1100, v => euros.format(v) + ' €'); }],
    [14.30, () => on(cta, 'show')],

    /* 7 — Envoi, puis acceptation sur le téléphone */
    [15.30, () => on(cta, 'tap')],
    [15.55, () => off(cta, 'tap')],
    [15.60, () => { on(app, 'aside'); on(phone, 'in'); cam('translateY(4px)'); }],
    [16.90, () => on(accept, 'tap')],
    [17.15, () => { off(accept, 'tap'); on(accept, 'done'); }],
    [17.80, () => on(toast)],

    /* 8 — Le planning */
    [18.60, () => { goto('planning'); off(app, 'aside'); on(phone, 'gone');
                    cam('translate(0,-10px)'); }],
    [19.20, () => on($('#evPose'), 'show')],
    [19.60, () => on($('#evLivr'), 'show')],
    [20.20, () => off(toast)],

    /* 9 — Les automatisations */
    [20.60, () => cam('translate(0,-30px)')],
    ...cards.flatMap((c, i) => [
      [20.75 + i * 0.34, () => on(c, 'show')],
      [21.05 + i * 0.34, () => on(c, 'link')]
    ]),

    /* 10 — Le tableau de bord */
    [23.80, () => { cards.forEach(c => { off(c, 'show'); off(c, 'link'); });
                    cam('translate(0,0)'); }],
    [24.20, () => goto('dash')],
    ...stats.map((s, i) => [24.45 + i * 0.16, () => {
      on(s, 'show');
      const v = $('.s-v', s);
      countUp(v, +v.dataset.to, 900, x => String(Math.round(x)));
    }]),
    [25.40, () => on($('#chart'), 'grow')],
    [26.20, () => cam('translateY(-8px)')],

    /* 11 — La signature */
    [28.00, () => { on(app, 'gone'); on(mail, 'gone'); cam('translateY(0px)'); }],
    [28.80, () => on(outro)],
    [31.80, () => on(replay)]
  ];

  /* ---------------------------------------------------------
     Remise à zéro entre deux lectures
     --------------------------------------------------------- */
  function remiseAZero() {
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
    cam('translateY(16px)');
  }

  Motion.jouer({ partition, remiseAZero });
})();
