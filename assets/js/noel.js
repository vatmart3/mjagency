/* =========================================================
   MJ AGENCY — Thème de Noël

   Ne tourne QUE si l'amorce du <head> a posé .theme-noel sur <html>.
   Hors période, ce fichier n'est même pas téléchargé.

   Rien n'est écrit en dur ici : dates, places, échéance, conseils et
   questions viennent tous de noel-config.js.
   ========================================================= */
(function () {
  'use strict';

  var C = window.MJ_NOEL;
  if (!C || !document.documentElement.classList.contains('theme-noel')) return;

  var racine  = document.documentElement;
  var reduit  = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile  = matchMedia('(max-width: 760px)').matches;

  /* Le stockage peut jeter en navigation privée : on ne laisse jamais une
     préférence d'affichage faire tomber la page. */
  function lire(c)    { try { return localStorage.getItem(c); } catch (e) { return null; } }
  function ecrire(c, v) { try { localStorage.setItem(c, v); } catch (e) {} }

  function noeud(balise, classe, html) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (html != null) n.innerHTML = html;
    return n;
  }

  var FLOCON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" aria-hidden="true">' +
    '<path d="M12 2v20M3.4 7l17.2 10M20.6 7 3.4 17"/>' +
    '<path d="M12 6.2 9.6 4M12 6.2 14.4 4M12 17.8 9.6 20M12 17.8 14.4 20"/>' +
    '<path d="m6.9 9.1-3.2.2M6.9 9.1 5.6 6.2M17.1 14.9l3.2-.2M17.1 14.9l1.3 2.9"/>' +
    '<path d="m6.9 14.9-1.3 2.9M6.9 14.9l-3.2-.2M17.1 9.1l1.3-2.9M17.1 9.1l3.2.2"/></svg>';

  /* =========================================================
     1 — ÉCHÉANCE ET PLACES
     ========================================================= */
  var echeance = new Date(C.echeance).getTime();

  function restant() {
    var d = echeance - Date.now();
    if (d <= 0) return null;
    return {
      j: Math.floor(d / 86400000),
      h: Math.floor(d / 3600000) % 24,
      m: Math.floor(d / 60000) % 60,
      s: Math.floor(d / 1000) % 60
    };
  }

  /* =========================================================
     2 — BANDEAU DE FIN D'ANNÉE
     Se décale comme celui d'Octobre Rose : la barre et le hero suivent
     --bandeau-h, mesurée et non devinée.
     ========================================================= */
  (function bandeau() {
    var CLE = 'mj-noel-bandeau-' + new Date().getFullYear();
    if (lire(CLE)) return;

    var b = noeud('div', 'noel-bandeau',
      '<span class="noel-bandeau__floc">' + FLOCON + '</span>' +
      '<p class="noel-bandeau__txt">Offre de fin d’année — plus que <b>' + C.places +
      ' places</b> pour janvier. <a href="' + C.lienOffre + '">Voir l’offre</a></p>' +
      '<button type="button" class="noel-bandeau__fermer" ' +
      'aria-label="Masquer le bandeau de fin d’année">✕</button>');
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Offre de fin d’année');
    document.body.insertBefore(b, document.body.firstChild);

    function poser() {
      racine.style.setProperty('--bandeau-h', b.getBoundingClientRect().height.toFixed(2) + 'px');
    }
    poser();
    var t = null;
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(poser, 150); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(poser);

    b.querySelector('.noel-bandeau__fermer').addEventListener('click', function () {
      b.remove();
      racine.style.setProperty('--bandeau-h', '0px');
      ecrire(CLE, '1');
    });
  })();

  /* =========================================================
     3 — LA NEIGE
     Un canevas 2D, pas une bibliothèque 3D : pour des points qui tombent,
     three.js coûterait 150 Ko compressés et un contexte WebGL de plus —
     sur un site qui vise Lighthouse > 85 et qui fait déjà tourner son fond
     en WebGL, c'est le mauvais échange. Le rendu est identique.

     Le nombre de flocons est plafonné (config), la boucle s'arrête quand
     l'onglet passe à l'arrière-plan, et rien ne démarre si le visiteur a
     demandé moins d'animations.
     ========================================================= */
  var neige = (function () {
    if (reduit) return { basculer: function () {}, actif: false, possible: false };

    var CLE = 'mj-noel-neige';
    var pref = lire(CLE);
    var actif = pref === null ? C.neigeParDefaut !== false : pref === '1';

    var cv = noeud('canvas', 'noel-neige');
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d');

    var N = mobile ? (C.flocons && C.flocons.mobile) || 60 : (C.flocons && C.flocons.bureau) || 140;
    var dpr = Math.min(devicePixelRatio || 1, 1.5);
    var L = 0, H = 0, flocons = [], brut = null, souris = { x: -999, y: -999 };

    function taille() {
      L = innerWidth; H = innerHeight;
      cv.width = Math.round(L * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = L + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function neuf(enHaut) {
      return {
        x: Math.random() * L,
        y: enHaut ? -10 - Math.random() * H * 0.3 : Math.random() * H,
        r: 0.9 + Math.random() * 2.1,
        vy: 14 + Math.random() * 26,        // pixels par seconde
        vx: 0,
        d: Math.random() * Math.PI * 2,      // phase du balancement
        o: 0.35 + Math.random() * 0.5
      };
    }

    function semer() {
      flocons = [];
      for (var i = 0; i < N; i++) flocons.push(neuf(false));
    }

    var dernier = 0;
    function image(t) {
      if (!actif) { brut = null; return; }
      brut = requestAnimationFrame(image);
      var dt = dernier ? Math.min((t - dernier) / 1000, 0.05) : 0.016;
      dernier = t;

      ctx.clearRect(0, 0, L, H);
      ctx.fillStyle = '#fff';
      for (var i = 0; i < flocons.length; i++) {
        var f = flocons[i];
        f.d += dt * 1.1;
        /* Le curseur pousse les flocons proches : une impulsion qui décroît
           avec le carré de la distance, amortie à chaque image pour que le
           flocon reprenne sa chute au lieu de filer tout droit. */
        var dx = f.x - souris.x, dy = f.y - souris.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 16900) {                     // 130 px de rayon
          var force = (1 - d2 / 16900) * 260;
          var d = Math.sqrt(d2) || 1;
          f.vx += (dx / d) * force * dt;
        }
        f.vx *= 0.94;
        f.x += (Math.sin(f.d) * 9 + f.vx) * dt;
        f.y += f.vy * dt;

        if (f.y > H + 8 || f.x < -20 || f.x > L + 20) flocons[i] = neuf(true);

        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function lancer() { if (!brut) { dernier = 0; brut = requestAnimationFrame(image); } }
    function stopper() { if (brut) { cancelAnimationFrame(brut); brut = null; } ctx.clearRect(0, 0, L, H); }

    taille(); semer();
    addEventListener('resize', function () { taille(); semer(); }, { passive: true });
    addEventListener('pointermove', function (e) { souris.x = e.clientX; souris.y = e.clientY; }, { passive: true });
    addEventListener('pointerleave', function () { souris.x = souris.y = -999; }, { passive: true });
    // Un onglet en arrière-plan ne doit pas continuer à calculer.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopper(); else if (actif) lancer();
    });

    if (actif) lancer();

    return {
      possible: true,
      get actif() { return actif; },
      basculer: function () {
        actif = !actif;
        ecrire(CLE, actif ? '1' : '0');
        if (actif) lancer(); else stopper();
        return actif;
      }
    };
  })();

  /* =========================================================
     4 — LES GRAINS QUI TOMBENT DES CARTES
     La couche de neige s'efface en CSS ; ici on lance les quelques grains
     qui s'en détachent. Trois par survol : au-delà c'est de la confettis.
     ========================================================= */
  if (!reduit && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var SEL = '.card, .cap, .step, .membre, .ruban__avis, .btn--glow, .nav__cta';
    var dernierGrain = 0;
    document.addEventListener('pointerover', function (e) {
      var c = e.target.closest && e.target.closest(SEL);
      if (!c || Date.now() - dernierGrain < 260) return;
      dernierGrain = Date.now();
      var b = c.getBoundingClientRect();
      for (var i = 0; i < 3; i++) (function (i) {
        var g = noeud('div', 'noel-grain');
        var x = b.left + b.width * (0.2 + Math.random() * 0.6);
        g.style.left = x + 'px';
        g.style.top = b.top + 'px';
        document.body.appendChild(g);
        g.animate([
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: 'translate(' + (Math.random() * 20 - 10).toFixed(0) + 'px,' +
              (40 + Math.random() * 40).toFixed(0) + 'px)', opacity: 0 }
        ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.3,.1,.5,1)' })
          .onfinish = function () { g.remove(); };
      })(i);
    });
  }

  /* =========================================================
     5 — LE BOUTON FLOTTANT : NEIGE, ET GRELOTS
     ========================================================= */
  var son = (function () {
    var CLE = 'mj-noel-son';
    var pref = lire(CLE);
    var actif = pref === null ? C.sonParDefaut === true : pref === '1';
    var ctx = null;

    /* Les grelots sont synthétisés : pas de fichier à télécharger, et le
       contexte audio n'est créé qu'au premier son réellement demandé —
       un AudioContext ouvert sans geste du visiteur est bloqué, et pèse
       pour rien sur le chargement. */
    function tinter() {
      if (!actif) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        var t0 = ctx.currentTime;
        [2093, 2637, 3136].forEach(function (f, i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t0 + i * 0.012);
          g.gain.exponentialRampToValueAtTime(0.035, t0 + i * 0.012 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.012 + 0.5);
          o.connect(g); g.connect(ctx.destination);
          o.start(t0 + i * 0.012); o.stop(t0 + i * 0.012 + 0.55);
        });
      } catch (e) { /* audio indisponible : on n'en fait pas une erreur */ }
    }

    return {
      get actif() { return actif; },
      basculer: function () { actif = !actif; ecrire(CLE, actif ? '1' : '0'); if (actif) tinter(); return actif; },
      tinter: tinter
    };
  })();

  (function reglages() {
    var boite = noeud('div', 'noel-reglages');

    function bouton(classe, etiquette, contenu, actif, auClic) {
      var b = noeud('button', 'noel-bouton ' + classe, contenu);
      b.type = 'button';
      b.setAttribute('aria-pressed', actif ? 'true' : 'false');
      b.setAttribute('aria-label', etiquette);
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', auClic() ? 'true' : 'false');
      });
      return b;
    }

    if (neige.possible) {
      boite.appendChild(bouton('noel-bouton--neige', 'Activer ou couper la neige',
        FLOCON + '<span>Neige</span>', neige.actif, function () { return neige.basculer(); }));
    }
    boite.appendChild(bouton('noel-bouton--son', 'Activer ou couper les grelots',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/>' +
      '<path d="M17.5 9.5a4 4 0 0 1 0 5"/></svg><span>Grelots</span>',
      son.actif, function () { return son.basculer(); }));

    document.body.appendChild(boite);
  })();

  /* =========================================================
     6 — LE HERO, LE COMPTE À REBOURS, LES PLACES
     Les textes du hero ne sont remplacés que sur la page d'accueil, et
     seulement si les éléments attendus sont là : aucune autre page ne doit
     bouger, et un hero absent ne doit pas faire tomber le script.
     ========================================================= */
  (function hero() {
    var h = document.querySelector('.hero');
    if (!h || !document.body.classList.contains('p-home')) return;

    var titre = h.querySelector('.hero__title');
    var chapeau = h.querySelector('.eyebrow');
    var accroche = h.querySelector('.lead');
    var actions = h.querySelector('.hero__actions');

    if (chapeau) {
      chapeau.textContent = 'Offre de fin d’année · Bassin de Thau';
      chapeau.classList.add('noel-hero__eyebrow');
    }
    if (titre) {
      titre.innerHTML = '<span class="line"><span>2027 commence avec</span></span>' +
                        '<span class="line"><span>un site qui vend.</span></span>';
      titre.classList.add('vu');
    }
    if (accroche) {
      accroche.textContent = 'Réservez avant le 31 décembre, on livre en janvier — ' +
        'pendant que vos concurrents dorment encore.';
    }
    if (actions) {
      actions.innerHTML =
        '<a href="' + C.lienDevis + '" class="btn btn--glow">Réserver mon créneau de janvier ' +
        '<span class="arw" aria-hidden="true">↗</span></a>' +
        '<a href="' + C.lienCalendrier + '" class="link-t">Ouvrir la case du jour ' +
        '<span class="arw" aria-hidden="true">↗</span></a>';
    }

    /* Compte à rebours et places, insérés après les boutons */
    var apres = actions || accroche;
    if (!apres) return;

    var compte = noeud('div', 'noel-compte');
    compte.setAttribute('role', 'timer');
    compte.setAttribute('aria-live', 'off');
    apres.insertAdjacentElement('afterend', compte);

    var places = noeud('div', 'noel-places',
      '<span class="noel-places__point" aria-hidden="true"></span>' +
      '<span>Places restantes pour janvier : <b>' + C.places + '</b></span>');
    compte.insertAdjacentElement('afterend', places);

    var ETIQ = [['j', 'jours'], ['h', 'heures'], ['m', 'minutes'], ['s', 'secondes']];
    function peindre() {
      var r = restant();
      if (!r) {
        compte.className = 'noel-compte noel-compte--fini';
        compte.textContent = 'L’offre de fin d’année est terminée — parlons quand même de janvier.';
        return false;
      }
      compte.innerHTML = ETIQ.map(function (e) {
        return '<div class="noel-compte__bloc"><span class="noel-compte__n">' +
          String(r[e[0]]).padStart(2, '0') + '</span><span class="noel-compte__l">' + e[1] + '</span></div>';
      }).join('');
      return true;
    }
    if (peindre()) {
      var tic = setInterval(function () { if (!peindre()) clearInterval(tic); }, 1000);
    }
  })();

  /* Les blocs écrits en dur mais réservés à la saison (page /offre-noel)
     sont masqués dans le HTML : hors période le script n'est pas chargé,
     et une façade vide au milieu de la page n'aurait aucun sens. */
  [].forEach.call(document.querySelectorAll('[data-noel-saison]'), function (n) {
    n.hidden = false;
  });

  /* =========================================================
     6b — LES SECTIONS DE SAISON, INJECTÉES
     Elles ne sont PAS écrites dans index.html : hors période, la page ne
     doit pas contenir un mot de Noël, ni pour le visiteur ni pour Google.
     Elles sont donc posées ici, après les avis.

     Leurs blocs .reveal ont leur propre observateur : main.js a installé
     les siens avant que ce script n'existe, et des éléments ajoutés après
     ne seraient jamais observés — donc jamais révélés, donc invisibles.
     ========================================================= */
  (function sections() {
    if (!document.body.classList.contains('p-home')) return;
    var apres = document.querySelector('#avis');
    if (!apres) return;

    var html =
    /* ---- L'offre ---- */
    '<section class="container pad-y sep noel-sec" id="offre-noel">' +
      '<div class="sec-head reveal">' +
        '<span class="eyebrow noel-eyebrow">Offre de fin d’année</span>' +
        '<h2 class="h2">Signez avant le 31 décembre,<br>on vous offre&nbsp;:</h2>' +
      '</div>' +
      '<div class="noel-offre">' +
        '<ul class="noel-dons reveal">' +
          '<li class="noel-don"><span class="noel-don__n">1</span><div>' +
            '<b>Votre carte NFC d’avis Google</b>' +
            '<span>Posée près de la caisse. Le client approche son téléphone, l’avis s’ouvre. ' +
            'C’est ce qui transforme une bonne journée en avis écrit.</span></div></li>' +
          '<li class="noel-don"><span class="noel-don__n">2</span><div>' +
            '<b>Le coffret de livraison MJ Agency</b>' +
            '<span>Votre contrat, la carte NFC de votre site, et deux ou trois choses ' +
            'qu’on préfère vous laisser découvrir le jour de la mise en ligne.</span></div></li>' +
          '<li class="noel-don"><span class="noel-don__n">3</span><div>' +
            '<b>La mise en ligne prioritaire en janvier</b>' +
            '<span>Le planning se remplit dans l’ordre des signatures. Signer en décembre, ' +
            'c’est être en ligne avant les autres.</span></div></li>' +
        '</ul>' +
        '<div class="coffret reveal" aria-hidden="true"><div class="coffret__scene">' +
          '<div class="coffret__lueur"></div><div class="coffret__corps"></div>' +
          '<div class="coffret__couvercle"></div><div class="coffret__noeud"></div>' +
        '</div></div>' +
      '</div>' +
      '<p class="noel-mention">Ce n’est pas une remise&nbsp;: le tarif ne change pas. ' +
      'Offre valable pour toute signature avant le <span data-noel="echeance"></span>, ' +
      'dans la limite de <span data-noel="places"></span> projets.</p>' +
      '<div class="stack" style="margin-top:var(--s4)">' +
        '<a href="' + C.lienDevis + '" class="btn btn--glow">Réserver mon créneau de janvier ' +
        '<span class="arw" aria-hidden="true">↗</span></a></div>' +
    '</section>' +

    /* ---- Le calendrier ---- */
    '<section class="container pad-y sep noel-sec" id="calendrier">' +
      '<div class="sec-head reveal">' +
        '<span class="eyebrow noel-eyebrow">Calendrier de l’avent</span>' +
        '<h2 class="h2">24 conseils pour vendre plus<br>en 2027.</h2>' +
        '<p class="lead">Une fenêtre par jour, un conseil applicable le jour même. ' +
        'Pensés pour les commerçants du bassin de Thau, pas pour les start-up.</p>' +
      '</div>' +
      '<div data-avent class="reveal"></div>' +
    '</section>' +

    /* ---- La carte cadeau ---- */
    '<section class="container pad-y sep noel-sec" id="carte-cadeau">' +
      '<div class="noel-cadeau">' +
        '<div class="reveal">' +
          '<span class="eyebrow noel-eyebrow">Carte cadeau</span>' +
          '<h2 class="h2 mt-s">Offrez un site<br>à quelqu’un qui le mérite.</h2>' +
          '<p class="lead mt-s">Un associé qui repousse depuis deux ans, un parent qui ' +
          'vient d’ouvrir, un ami dont la page Facebook tient lieu de vitrine. ' +
          'Offrez-lui l’audit, ou le site entier.</p>' +
          '<a href="' + C.lienDevis + '?sujet=carte-cadeau" class="btn btn--glow mt-m">' +
          'Offrir une carte cadeau <span class="arw" aria-hidden="true">↗</span></a>' +
        '</div>' +
        '<div class="cadeau-scene reveal" aria-hidden="true"><div class="cadeau">' +
          '<div class="cadeau__haut">' +
            '<span class="cadeau__marque"><i></i> MJ&nbsp;Agency</span>' +
            '<span class="cadeau__puce"></span>' +
          '</div>' +
          '<div class="cadeau__t">Offrez un site</div>' +
          '<div class="cadeau__bas">Carte cadeau · Bassin de Thau</div>' +
        '</div></div>' +
      '</div>' +
    '</section>';

    var bac = document.createElement('div');
    bac.innerHTML = html;
    var ajoutes = [];
    while (bac.firstElementChild) {
      var sec = bac.firstElementChild;
      apres.insertAdjacentElement('afterend', sec);
      apres = sec;
      ajoutes.push(sec);
    }

    /* Leur propre observateur — voir le commentaire en tête du bloc. */
    if (reduit) {
      ajoutes.forEach(function (s) {
        [].forEach.call(s.querySelectorAll('.reveal'), function (n) { n.classList.add('in'); });
      });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    ajoutes.forEach(function (s) {
      [].forEach.call(s.querySelectorAll('.reveal'), function (n) { io.observe(n); });
    });
  })();

  /* =========================================================
     7 — LE CALENDRIER DE L'AVENT
     La façade est construite ici, à partir de la config. La date de
     référence est celle de Paris : un visiteur à Montréal ne doit pas voir
     la case du lendemain, ni l'inverse.
     ========================================================= */
  (function avent() {
    var hote = document.querySelector('[data-avent]');
    if (!hote) return;

    var p = jourParis();
    var dansDecembre = p.mois === 12;
    var jourCourant = dansDecembre ? Math.min(p.jour, 24) : (p.mois === 1 ? 25 : 0);

    var grille = noeud('div', 'avent__grille');
    var toit = noeud('div', 'avent__toit');
    var cadre = noeud('div', 'avent');
    cadre.appendChild(toit);
    cadre.appendChild(grille);
    hote.appendChild(cadre);

    C.cases.forEach(function (c) {
      var etat = c.j < jourCourant ? 'passe' : (c.j === jourCourant ? 'jour' : 'futur');
      var el = noeud('button', 'avent__case avent__case--' + etat + (c.bonus ? ' avent__case--bonus' : ''));
      el.type = 'button';
      el.innerHTML =
        '<span class="avent__volets" aria-hidden="true">' +
          '<span class="avent__volet avent__volet--g"></span>' +
          '<span class="avent__volet avent__volet--d"></span>' +
        '</span>' +
        '<span class="avent__num">' + c.j + '</span>' +
        (etat === 'futur' ? '<span class="avent__floc" aria-hidden="true">' + FLOCON + '</span>' : '');

      if (etat === 'futur') {
        el.disabled = true;
        el.setAttribute('aria-label', 'Case ' + c.j + ' — verrouillée jusqu’au ' + c.j + ' décembre');
      } else {
        el.setAttribute('aria-label', 'Case ' + c.j + ' — ' + c.titre);
        el.addEventListener('click', function () {
          el.classList.add('avent__case--ouverte');
          son.tinter();
          ouvrir(c);
        });
      }
      grille.appendChild(el);
    });

    /* ---- La fenêtre de contenu ---- */
    var vue = noeud('div', 'avent-vue',
      '<div class="avent-vue__boite" role="dialog" aria-modal="true" aria-labelledby="avent-t">' +
        '<button type="button" class="avent-vue__fermer" aria-label="Fermer">✕</button>' +
        '<span class="avent-vue__jour"></span>' +
        '<h3 class="avent-vue__t" id="avent-t"></h3>' +
        '<p class="avent-vue__c"></p>' +
        '<div class="avent-vue__a"><b>À faire aujourd’hui</b><span></span></div>' +
        '<div class="avent-vue__bonus" hidden></div>' +
        '<a class="btn btn--glow" href="' + C.lienDevis + '"></a>' +
      '</div>');
    document.body.appendChild(vue);

    var boite = vue.querySelector('.avent-vue__boite');
    var avant = null;

    function ouvrir(c) {
      avant = document.activeElement;
      vue.querySelector('.avent-vue__jour').textContent = c.j + ' décembre';
      vue.querySelector('.avent-vue__t').textContent = c.titre;
      vue.querySelector('.avent-vue__c').textContent = c.conseil;
      vue.querySelector('.avent-vue__a span').textContent = c.action;
      var bonus = vue.querySelector('.avent-vue__bonus');
      if (c.bonus) {
        bonus.hidden = false;
        bonus.innerHTML = '<b>' + c.bonusTitre + '</b> — offert pour toute signature avant le ' +
          C.echeanceTexte + '.';
      } else {
        bonus.hidden = true;
      }
      var cta = vue.querySelector('.btn');
      cta.textContent = c.bonus ? 'J’en profite' : 'Faire auditer mon site, offert';
      cta.href = C.lienDevis;

      vue.classList.add('montre');
      requestAnimationFrame(function () { vue.classList.add('vu'); });
      document.body.style.overflow = 'hidden';
      vue.querySelector('.avent-vue__fermer').focus({ preventScroll: true });
    }

    function fermer() {
      vue.classList.remove('vu');
      document.body.style.overflow = '';
      setTimeout(function () { vue.classList.remove('montre'); }, reduit ? 0 : 300);
      if (avant && avant.focus) avant.focus({ preventScroll: true });
    }

    vue.querySelector('.avent-vue__fermer').addEventListener('click', fermer);
    vue.addEventListener('click', function (e) { if (e.target === vue) fermer(); });
    vue.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fermer(); return; }
      if (e.key !== 'Tab') return;
      // Le focus reste dans la fenêtre : sinon il part derrière le voile.
      var f = [].slice.call(boite.querySelectorAll('button, a[href]'))
        .filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var premier = f[0], dernier = f[f.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });

    /* Ouverture directe par ancre : #calendrier-7 ouvre la case 7 si elle
       est consultable. Sert aux liens envoyés en story Instagram. */
    var m = /^#case-(\d{1,2})$/.exec(location.hash);
    if (m) {
      var n = parseInt(m[1], 10);
      var c = C.cases.filter(function (x) { return x.j === n; })[0];
      if (c && n <= jourCourant) setTimeout(function () { ouvrir(c); }, 400);
    }
  })();

  /* =========================================================
     8 — LE COFFRET QUI S'OUVRE AU DÉFILEMENT
     ========================================================= */
  (function coffret() {
    var c = document.querySelector('.coffret');
    if (!c) return;
    if (reduit) { c.classList.add('ouvert'); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { c.classList.add('ouvert'); io.unobserve(e.target); }
      });
    }, { threshold: 0.45 });
    io.observe(c);
  })();

  /* =========================================================
     9 — LA CARTE CADEAU QUI SUIT LE CURSEUR
     ========================================================= */
  (function carteCadeau() {
    var scene = document.querySelector('.cadeau-scene');
    var carte = scene && scene.querySelector('.cadeau');
    if (!carte) return;
    if (reduit || !matchMedia('(hover: hover) and (pointer: fine)').matches) {
      carte.style.transform = 'rotateX(4deg) rotateY(-9deg)';
      carte.style.setProperty('--reflet', '-12%');
      return;
    }
    var brut = null, cible = { x: 0, y: 0 };
    scene.addEventListener('pointermove', function (e) {
      var b = scene.getBoundingClientRect();
      cible.x = ((e.clientX - b.left) / b.width - 0.5) * 2;
      cible.y = ((e.clientY - b.top) / b.height - 0.5) * 2;
      if (!brut) brut = requestAnimationFrame(peindre);
    }, { passive: true });
    scene.addEventListener('pointerleave', function () {
      cible.x = 0; cible.y = 0;
      if (!brut) brut = requestAnimationFrame(peindre);
    });
    var x = 0, y = 0;
    function peindre() {
      x += (cible.x - x) * 0.14;
      y += (cible.y - y) * 0.14;
      carte.style.transform = 'rotateY(' + (x * 11).toFixed(2) + 'deg) rotateX(' +
        (-y * 9).toFixed(2) + 'deg)';
      carte.style.setProperty('--reflet', (x * 42).toFixed(1) + '%');
      if (Math.abs(cible.x - x) > 0.002 || Math.abs(cible.y - y) > 0.002) {
        brut = requestAnimationFrame(peindre);
      } else { brut = null; }
    }
  })();

  /* =========================================================
     10 — LES QUESTIONS DE LA PAGE OFFRE
     ========================================================= */
  (function faq() {
    var hote = document.querySelector('[data-noel-faq]');
    if (!hote) return;
    hote.innerHTML = C.faq.map(function (q) {
      return '<details class="faq__item"><summary class="faq__q"><h3>' + q.q +
        '</h3></summary><p class="faq__a">' + q.r + '</p></details>';
    }).join('');
  })();

  /* =========================================================
     11 — LES VALEURS DE CONFIG RECOPIÉES DANS LE TEXTE
     Tout élément portant data-noel="places" ou "echeance" reçoit la
     valeur : une seule source, pas de chiffre à corriger à douze endroits.
     ========================================================= */
  [].forEach.call(document.querySelectorAll('[data-noel]'), function (n) {
    var k = n.getAttribute('data-noel');
    if (k === 'places') n.textContent = C.places;
    if (k === 'echeance') n.textContent = C.echeanceTexte;
  });

  /* ---------------- La date, en heure de Paris ---------------- */
  function jourParis() {
    try {
      var p = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(new Date()).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
      return { annee: +p.year, mois: +p.month, jour: +p.day };
    } catch (e) {
      var d = new Date();
      return { annee: d.getFullYear(), mois: d.getMonth() + 1, jour: d.getDate() };
    }
  }
})();
