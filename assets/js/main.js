/* =========================================================
   MJ AGENCY — Interactions
   ========================================================= */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Scroll reveal ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .rs').forEach(el => io.observe(el));

  /* ---------------- Count-up ---------------- */
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------------- Nav hide on scroll down ---------------- */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (nav && !nav.classList.contains('open')) {
      nav.style.transform = (y > lastY && y > 400) ? 'translateY(-120%)' : 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* ---------------- Portfolio filters ---------------- */
  const filterBtns = document.querySelectorAll('.filters .tag');
  if (filterBtns.length) {
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      document.querySelectorAll('.grid-cards .card').forEach(card => {
        const show = f === 'all' || (card.getAttribute('data-cat') || '').includes(f);
        card.style.display = show ? '' : 'none';
      });
    }));
  }

  /* ---------------- Booking calendar ---------------- */
  (function calendar() {
    const cal = document.querySelector('[data-calendar]');
    if (!cal) return;

    const monthEl = cal.querySelector('.cal__month');
    const grid = cal.querySelector('.cal__grid');
    const slotsBox = document.querySelector('[data-slots]');
    const slotGrid = slotsBox ? slotsBox.querySelector('.slots__grid') : null;
    const sumDate = document.querySelector('[data-sum-date]');
    const sumTime = document.querySelector('[data-sum-time]');
    const fDate = document.querySelector('input[name="date"]');
    const fTime = document.querySelector('input[name="time"]');

    const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const view = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = null;

    function render() {
      monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';

      DOW.forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal__dow'; el.textContent = d;
        grid.appendChild(el);
      });

      let first = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
      first = (first === 0) ? 6 : first - 1;              // semaine commençant lundi
      for (let i = 0; i < first; i++) {
        const el = document.createElement('div');
        el.className = 'cal__day empty';
        grid.appendChild(el);
      }

      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const date = new Date(view.getFullYear(), view.getMonth(), d);
        const dow = date.getDay();
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cal__day';
        cell.textContent = d;

        if (date < today || dow === 0 || dow === 6) {
          cell.classList.add('disabled');
          cell.disabled = true;
        } else {
          cell.classList.add('avail');
          cell.setAttribute('data-cursor', 'Choisir');
        }
        if (selected && date.getTime() === selected.getTime()) cell.classList.add('selected');

        cell.addEventListener('click', () => { selected = date; render(); buildSlots(date); });
        grid.appendChild(cell);
      }
    }

    function buildSlots(date) {
      if (!slotGrid) return;
      slotsBox.hidden = false;
      slotGrid.innerHTML = '';

      const label = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (sumDate) sumDate.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      if (sumTime) sumTime.textContent = '—';
      if (fDate) fDate.value = date.toISOString().slice(0, 10);
      if (fTime) fTime.value = '';

      SLOTS.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'slot'; b.textContent = s;
        b.setAttribute('data-cursor', 'Réserver');
        if ((date.getDate() + i) % 5 === 0) { b.classList.add('disabled'); b.disabled = true; }
        b.addEventListener('click', () => {
          slotGrid.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
          b.classList.add('selected');
          if (sumTime) sumTime.textContent = s;
          if (fTime) fTime.value = s;
        });
        slotGrid.appendChild(b);
      });
    }

    cal.querySelector('[data-prev]').addEventListener('click', () => {
      const min = new Date(today.getFullYear(), today.getMonth(), 1);
      if (view > min) { view.setMonth(view.getMonth() - 1); render(); }
    });
    cal.querySelector('[data-next]').addEventListener('click', () => {
      view.setMonth(view.getMonth() + 1); render();
    });

    render();
  })();

  /* =========================================================
     FORMULAIRE DE RÉSERVATION

     La demande part vers /api/contact — une fonction serverless du
     projet, qui la relaie à Resend. Aucune clé ne transite ici : c'est
     tout l'intérêt par rapport à un service appelé depuis le navigateur,
     où la clé est lisible dans le code source de la page.

     Cette route n'existe que sur le site déployé. Ouvert en fichier
     local, ou dans un aperçu qui bloque les requêtes sortantes, l'appel
     échoue — le repli propose alors d'écrire directement.
     ========================================================= */
  const POINT_ENVOI    = '/api/contact';
  const DESTINATAIRE   = 'vatmart3@gmail.com';   // boîte qui reçoit, et repli mailto

  document.querySelectorAll('form[data-demo]').forEach(form => {
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    const btnTexte = btn ? btn.innerHTML : '';

    function afficher(texte, etat, html) {
      if (!msg) return;
      msg.classList.add('show');
      msg.classList.toggle('form-msg--erreur', etat === 'erreur');
      if (html) msg.innerHTML = html; else msg.textContent = texte;
    }

    function champs() {
      const val = n => (form.querySelector(`[name="${n}"]`) || {}).value || '';
      const date = document.querySelector('[data-sum-date]');
      const time = document.querySelector('[data-sum-time]');
      return {
        nom: val('name'), email: val('email'), societe: val('company'),
        budget: val('budget'), message: val('message'),
        date: date ? date.textContent : '', heure: time ? time.textContent : ''
      };
    }

    function corpsTexte(c) {
      return [
        `Nom : ${c.nom}`,
        `Email : ${c.email}`,
        c.societe ? `Société : ${c.societe}` : null,
        c.budget ? `Budget : ${c.budget}` : null,
        `Rendez-vous souhaité : ${c.date} à ${c.heure}`,
        '',
        'Projet :',
        c.message || '(non renseigné)'
      ].filter(Boolean).join('\n');
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Piège à robots : rempli, c'est un automate.
      const piege = form.querySelector('[name="site"]');
      if (piege && piege.value) return;

      const c = champs();
      if (!c.heure || c.heure === '—') {
        afficher('Choisissez une date et un créneau avant de confirmer.', 'erreur');
        return;
      }

      const sujet = `Demande de rendez-vous — ${c.nom} (${c.date} ${c.heure})`;

      if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
      afficher('Envoi en cours…', 'info');

      try {
        const rep = await fetch(POINT_ENVOI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            nom: c.nom, email: c.email, societe: c.societe,
            budget: c.budget, message: c.message,
            date: c.date, heure: c.heure,
            site: (piege && piege.value) || ''   // le piège est vérifié aussi côté serveur
          })
        });
        const data = await rep.json().catch(() => ({}));
        if (!rep.ok || !data.ok) {
          // Une réponse sans JSON exploitable veut presque toujours dire que
          // la route n'a pas été déployée : on le nomme, plutôt que de laisser
          // toutes les pannes se ressembler.
          const err = new Error(data.error || `HTTP ${rep.status}`);
          err.code = data.code || (rep.status === 404 ? 'ROUTE-ABSENTE' : 'HTTP-' + rep.status);
          throw err;
        }

        afficher(`Merci ${c.nom} — votre demande pour le ${c.date} à ${c.heure} est bien partie. Nous confirmons par email sous 24 h.`, 'ok');
        form.reset();
      } catch (err) {
        // On ne prétend jamais que c'est envoyé : on donne une porte de sortie,
        // avec la demande déjà rédigée pour que rien ne soit à ressaisir. Le
        // code sert à nommer la panne sans avoir à ouvrir les journaux.
        const lien = `mailto:${DESTINATAIRE}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corpsTexte(c))}`;
        const code = err.code || 'RESEAU';
        afficher(null, 'erreur',
          `L'envoi a échoué. <a href="${lien}">Envoyez-la depuis votre messagerie</a> ` +
          `— tout est déjà rempli — ou appelez le <a href="tel:+33611718368">06 11 71 83 68</a>. ` +
          `<small class="form-msg__ref">réf. ${code}</small>`);
        console.warn('Formulaire :', code, err);
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = btnTexte; }
      }
    });
  });

  /* ---------------- Hero intro ---------------- */
  function revealHero(scope) {
    (scope || document).querySelectorAll('.hero__title .line > span').forEach((el, i) => {
      el.style.transition = 'transform .95s var(--ease)';
      el.style.transitionDelay = (i * 0.09) + 's';
      requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; });
    });
  }

  function closeMenu() {
    if (!menu || !menu.classList.contains('open')) return;
    menu.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ---------------- Navigation ----------------
     Two modes from one file: when several .page blocks are present
     (the single-file build) we swap them in place; otherwise we do a
     normal page load.                                              */
  const pageEls = document.querySelectorAll('.page');
  const isRouter = pageEls.length > 1;

  // Navigation nette, sans rideau : la charte demande des interactions
  // discrètes, et un effet de transition sur chaque clic n'en est pas une.
  function wipe(then) { then(); }

  if (isRouter) {
    const pages = {};
    pageEls.forEach(p => { pages[p.id.replace('page-', '')] = p; });
    let current = document.querySelector('.page.active').id.replace('page-', '');

    document.addEventListener('click', e => {
      const link = e.target.closest('[data-go]');
      if (!link) return;
      e.preventDefault();
      closeMenu();
      const name = link.getAttribute('data-go');
      if (name === current || !pages[name]) return;

      wipe(() => {
        pages[current].classList.remove('active');
        pages[name].classList.add('active');
        current = name;
        scrollTo(0, 0);
        document.querySelectorAll('.nav__links a[data-go]').forEach(a =>
          a.classList.toggle('active', a.getAttribute('data-go') === name));
        const page = pages[name];
        page.querySelectorAll('.reveal, .rs').forEach(el => { el.classList.remove('in'); io.observe(el); });
        page.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));
        revealHero(page);
      });
    });
  } else {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
      a.addEventListener('click', e => {
        if (reduced) return;
        e.preventDefault();
        wipe(() => { location.href = href; });
      });
    });
  }

  function boot() {
    const scope = isRouter ? document.querySelector('.page.active') : document;
    revealHero(scope);
  }

  /* =========================================================
     PARALLAXE DES VISUELS

     Les maquettes des cartes glissent légèrement pendant que la carte
     traverse l'écran. C'est la seule chose qui donne de la profondeur au
     téléphone, où il n'y a ni curseur à suivre ni survol : la page répond
     au geste au lieu de se contenter d'apparaître une fois.

     Volontairement discret — une dizaine de pixels. Sur un site, tout
     faire bouger revient à ne rien mettre en avant.

     La boucle ne tourne que lorsqu'un visuel est effectivement à l'écran,
     et jamais si le visiteur a demandé moins d'animations.
     ========================================================= */
  (function parallaxe() {
    if (reduced) return;
    const cibles = [...document.querySelectorAll(
      '.feature__viz--nav .nave, .feature__viz--board .board, .feature__viz--3d .gyro,'
      + '.card--large .fid, .duo__portrait, .coherence'
    )];
    if (!cibles.length) return;

    const vus = new Set();
    const io = new IntersectionObserver(entrees => {
      entrees.forEach(e => e.isIntersecting ? vus.add(e.target) : vus.delete(e.target));
      relancer();
    }, { rootMargin: '10% 0px' });
    cibles.forEach(c => io.observe(c));

    let enCours = false;
    function relancer() {
      if (enCours || !vus.size) return;
      enCours = true;
      requestAnimationFrame(image);
    }
    function image() {
      if (!vus.size) { enCours = false; return; }
      const h = innerHeight;
      vus.forEach(el => {
        /* Tant que l'élément n'est pas arrivé, on ne touche pas à son
           transform : le style en ligne de la parallaxe écraserait celui
           de l'apparition, qui ne se verrait jamais. */
        const porteur = el.closest('.reveal, .arrive');
        if (porteur && !porteur.classList.contains('in') && !porteur.classList.contains('vu')) return;
        const r = el.getBoundingClientRect();
        // -1 quand l'élément entre par le bas, +1 quand il sort par le haut
        // Borné : hors écran le rapport dépasse 1 et le décalage filait à
        // vingt pixels au lieu des onze prévus.
        const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) / h - 0.5) * -2));
        el.style.transform = `translate3d(0, ${(p * 16).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(image);
    }
  })();


  /* =========================================================
     RÉVÉLATION DES TITRES

     Le découpage se fait ici plutôt que dans les dix fichiers HTML : un
     seul endroit à maintenir, et les titres restent du texte simple dans
     la source — lisible par un robot d'indexation comme par un lecteur
     d'écran.

     On découpe sur les <br> déjà présents dans les titres : chaque ligne
     obtient son masque et son léger retard. Pas de mesure des lignes
     réelles, donc rien ne se casse au changement de largeur.
     ========================================================= */
  (function revelerTitres() {
    // Les intertitres des pages légales restent des intertitres.
    const titres = [...document.querySelectorAll('.h2')]
      .filter(h => !h.closest('.legal'));

    titres.forEach(h => {
      if (h.dataset.masque) return;
      const lignes = h.innerHTML.split(/<br\s*\/?>/i).map(t => t.trim()).filter(Boolean);
      h.innerHTML = lignes
        .map(t => `<span class="masque"><span>${t}</span></span>`)
        .join('');
      h.dataset.masque = '1';
    });

    /* Un titre n'est pas toujours dans un conteneur observé (.reveal) :
       on l'observe alors pour lui-même, sinon il resterait masqué. */
    const orphelins = titres.filter(h => !h.closest('.reveal, .rs'));
    const io = new IntersectionObserver(entrees => entrees.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.masque').forEach(m => m.classList.add('vu'));
      io.unobserve(e.target);
    }), { threshold: 0.2 });
    orphelins.forEach(h => io.observe(h));

    /* Le titre du hero se découvre au chargement, pas au défilement : il
       est déjà à l'écran. Un souffle de retard laisse la page se poser. */
    const hero = document.querySelector('.hero__title');
    if (hero) {
      if (reduced) hero.classList.add('vu');
      else requestAnimationFrame(() => setTimeout(() => hero.classList.add('vu'), 120));
    }
  })();


  /* =========================================================
     ARRIVÉE À L'UNITÉ

     Les listes longues étaient révélées d'un bloc : sur téléphone, la
     moitié de leurs éléments s'animait hors écran et le visiteur ne voyait
     jamais rien arriver. Chacun est désormais observé pour lui-même.

     Le décalage vient de la position réelle dans la liste, pas d'un
     compteur global : deux éléments qui entrent ensemble se suivent, un
     élément isolé n'attend pas.
     ========================================================= */
  (function arriveesUnitaires() {
    const SELECTEURS = [
      '.work-item', '.faq__item', '.step', '.stat',
      '.membre', '.cap', '.coh', '.grid-cards .card',
    ].join(', ');

    const elements = [...document.querySelectorAll(SELECTEURS)]
      // Un élément déjà pris en charge par un conteneur .rs garderait deux
      // animations concurrentes.
      .filter(e => !e.parentElement.classList.contains('rs'));

    if (!elements.length || reduced) return;
    elements.forEach(e => e.classList.add('arrive'));

    const io = new IntersectionObserver(entrees => {
      entrees.filter(e => e.isIntersecting).forEach(e => {
        const freres = [...e.target.parentElement.children];
        const rang = freres.indexOf(e.target);
        e.target.style.transitionDelay = Math.min(rang % 4, 3) * 0.07 + 's';
        e.target.classList.add('vu');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach(e => io.observe(e));
  })();


  /* =========================================================
     COMMANDES DE L'INTERFACE

     Tout est créé ici plutôt que recopié dans dix fichiers HTML : une
     seule source, et aucune page ne peut se retrouver sans. Ce sont de
     toute façon des fonctions qui n'existent que si le JavaScript tourne.
     ========================================================= */
  (function commandes() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const el = (balise, classe, dedans) => {
      const n = document.createElement(balise);
      if (classe) n.className = classe;
      if (dedans !== undefined) n.innerHTML = dedans;
      return n;
    };

    /* ---------- Thème ----------
       Trois états : « auto » suit le système, « light » et « dark » sont un
       choix explicite du visiteur. On ne stocke rien tant qu'il n'a pas
       choisi — c'est ce qui permet de n'afficher l'avis de stockage qu'à ce
       moment-là, et pas dès l'arrivée. */
    const CLE = 'mj-theme';
    let memoire = null;
    try { memoire = localStorage.getItem(CLE); } catch { /* navigation privée */ }
    if (memoire === 'dark' || memoire === 'light') {
      document.documentElement.setAttribute('data-theme', memoire);
    }

    const sombreActif = () => {
      const a = document.documentElement.getAttribute('data-theme');
      if (a) return a === 'dark';
      return matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const ICONES = `
      <svg class="soleil" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/></svg>
      <svg class="lune" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z"/></svg>`;

    const boutonTheme = el('button', 'nav__outil', ICONES);
    boutonTheme.type = 'button';
    const majEtiquette = () => boutonTheme.setAttribute('aria-label',
      sombreActif() ? 'Passer au thème clair' : 'Passer au thème sombre');
    majEtiquette();
    boutonTheme.addEventListener('click', () => {
      const vers = sombreActif() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', vers);
      try { localStorage.setItem(CLE, vers); avis.montrerUneFois(); } catch {}
      majEtiquette();
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = vers === 'dark' ? '#0B0B0E' : '#FFFFFF';
    });
    // Le système change d'avis pendant la visite : on suit, sauf choix explicite.
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', majEtiquette);

    /* ---------- Recherche ---------- */
    const boutonRech = el('button', 'nav__outil',
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4 20 20"/></svg>');
    boutonRech.type = 'button';
    boutonRech.setAttribute('aria-label', 'Rechercher sur le site');

    const outils = el('span', 'nav__outils');
    outils.append(boutonRech, boutonTheme);
    const burger = nav.querySelector('.nav__burger');
    const cta = nav.querySelector('.nav__cta');
    nav.insertBefore(outils, cta || burger);

    const rech = el('div', 'rech', `
      <div class="rech__boite" role="dialog" aria-modal="true" aria-label="Recherche">
        <div class="rech__haut">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4 20 20"/></svg>
          <input class="rech__champ" type="search" placeholder="Rechercher une page, un service, une ville…"
                 aria-label="Rechercher" autocomplete="off" enterkeyhint="search">
          <span class="rech__fermer">esc</span>
        </div>
        <div class="rech__liste" role="listbox"></div>
      </div>
      <p class="rech__aide">Flèches pour parcourir · Entrée pour ouvrir</p>`);
    document.body.appendChild(rech);

    const champ = rech.querySelector('.rech__champ');
    const liste = rech.querySelector('.rech__liste');
    let resultats = [], actif = 0;

    const sansAccent = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    function chercher(q) {
      const index = window.MJ_INDEX || [];
      const mots = sansAccent(q).split(/\s+/).filter(Boolean);
      if (!mots.length) return [];
      return index
        .map(e => {
          const t = sansAccent(e.t), x = sansAccent(e.x), s = sansAccent(e.s);
          let score = 0;
          for (const m of mots) {
            if (t.startsWith(m)) score += 12;
            else if (t.includes(m)) score += 8;
            else if (s.includes(m)) score += 4;
            else if (x.includes(m)) score += 2;
            else return null;            // tous les mots doivent être présents
          }
          return { ...e, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
    }

    function surligner(texte, q) {
      const mots = sansAccent(q).split(/\s+/).filter(Boolean);
      const brut = texte.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
      if (!mots.length) return brut;
      // On cherche sur la version sans accent, on découpe sur l'originale :
      // les positions se correspondent, NFD mis à part les diacritiques.
      const plat = sansAccent(brut);
      let sortie = '', i = 0;
      while (i < brut.length) {
        const trouve = mots
          .map(m => ({ m, p: plat.indexOf(m, i) }))
          .filter(o => o.p === i)
          .sort((a, b) => b.m.length - a.m.length)[0];
        if (trouve) {
          sortie += '<mark>' + brut.slice(i, i + trouve.m.length) + '</mark>';
          i += trouve.m.length;
        } else { sortie += brut[i]; i++; }
      }
      return sortie;
    }

    function afficher(q) {
      resultats = chercher(q);
      actif = 0;
      if (!q.trim()) {
        liste.innerHTML = '<p class="rech__vide">Tapez pour chercher dans tout le site.</p>';
        return;
      }
      if (!resultats.length) {
        liste.innerHTML = '<p class="rech__vide">Aucun résultat pour « ' +
          q.replace(/[<>&]/g, '') + ' ».</p>';
        return;
      }
      liste.innerHTML = resultats.map((r, i) => `
        <a class="rech__item${i === 0 ? ' actif' : ''}" href="${r.u}" role="option">
          <span class="rech__t">${surligner(r.t, q)}</span>
          <span class="rech__x">${r.s} — ${surligner(r.x.slice(0, 96), q)}…</span>
        </a>`).join('');
    }

    function ouvrir() {
      rech.classList.add('ouverte');
      document.body.style.overflow = 'hidden';
      afficher('');
      champ.value = '';
      champ.focus();
    }
    function fermer() {
      rech.classList.remove('ouverte');
      document.body.style.overflow = '';
      boutonRech.focus();
    }
    boutonRech.addEventListener('click', ouvrir);
    rech.querySelector('.rech__fermer').addEventListener('click', fermer);
    rech.addEventListener('click', e => { if (e.target === rech) fermer(); });
    champ.addEventListener('input', () => afficher(champ.value));

    function surligneActif() {
      liste.querySelectorAll('.rech__item').forEach((n, i) =>
        n.classList.toggle('actif', i === actif));
      const n = liste.querySelectorAll('.rech__item')[actif];
      if (n) n.scrollIntoView({ block: 'nearest' });
    }
    champ.addEventListener('keydown', e => {
      if (e.key === 'Escape') { fermer(); return; }
      if (!resultats.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); actif = (actif + 1) % resultats.length; surligneActif(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); actif = (actif - 1 + resultats.length) % resultats.length; surligneActif(); }
      if (e.key === 'Enter') {
        const n = liste.querySelectorAll('.rech__item')[actif];
        if (n) n.click();
      }
    });
    addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ouvrir(); }
      if (e.key === 'Escape' && rech.classList.contains('ouverte')) fermer();
    });

    /* ---------- Barre de progression ---------- */
    const progres = el('div', 'progres');
    progres.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progres);

    /* ---------- Retour en haut ---------- */
    const remonter = el('button', 'remonter', '<span aria-hidden="true">↑</span>');
    remonter.type = 'button';
    remonter.setAttribute('aria-label', 'Revenir en haut de la page');
    remonter.addEventListener('click', () =>
      scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    document.body.appendChild(remonter);

    let enAttente = false;
    function surDefilement() {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        const course = document.documentElement.scrollHeight - innerHeight;
        const p = course > 0 ? Math.min(1, scrollY / course) : 0;
        progres.style.transform = `scaleX(${p})`;
        remonter.classList.toggle('visible', scrollY > innerHeight * 0.9);
      });
    }
    addEventListener('scroll', surDefilement, { passive: true });
    addEventListener('resize', surDefilement);
    surDefilement();

    /* ---------- Avis sur le stockage ----------
       Ce site ne dépose aucun cookie et n'embarque aucun traceur : il n'y
       a donc rien à faire consentir, et une bannière de consentement
       serait mensongère. L'avis n'apparaît qu'au moment où le visiteur
       choisit un thème, puisque c'est la seule chose que le site retienne
       — une préférence d'affichage qu'il a demandée, exemptée de
       consentement. Il ne revient pas une fois lu. */
    const avis = (function () {
      const CLE_AVIS = 'mj-avis-stockage';
      let vu = null;
      try { vu = localStorage.getItem(CLE_AVIS); } catch {}
      const boite = el('div', 'avis', `
        <p class="avis__t">Ce site ne dépose aucun cookie et n’utilise aucun traceur.
        Votre choix de thème est le seul élément conservé, dans votre navigateur.
        <a href="confidentialite.html">En savoir plus</a></p>
        <button type="button" class="avis__ok">J’ai compris</button>`);
      document.body.appendChild(boite);

      /* L'avis et le retour en haut occupent le même coin. L'avis gagne, et
         le bouton monte au-dessus de lui — de sa hauteur réelle, qui va de
         une à trois lignes selon la largeur, donc mesurée plutôt que devinée. */
      const place = () => document.documentElement.style.setProperty(
        '--avis-h', boite.classList.contains('visible')
          ? Math.ceil(boite.getBoundingClientRect().height) + 10 + 'px' : '0px');

      boite.querySelector('.avis__ok').addEventListener('click', () => {
        boite.classList.remove('visible');
        place();
        try { localStorage.setItem(CLE_AVIS, '1'); } catch {}
        // Le bouton lu disparaît du flux : sans cela le focus retombe sur
        // le document et le visiteur au clavier repart du haut.
        boutonTheme.focus({ preventScroll: true });
      });
      addEventListener('resize', place, { passive: true });
      return {
        montrerUneFois() { if (!vu) { boite.classList.add('visible'); place(); } },
      };
    })();
  })();

  /* ---------- Animation de chargement ----------
     Elle n'apparaît que si la page tarde. Affichée systématiquement, elle
     clignoterait sur un chargement rapide — ce qui donne l'impression
     inverse de celle recherchée. Sur ce site, sans image lourde, elle ne
     devrait presque jamais se voir : c'est le but. */
  (function chargement() {
    const barre = document.createElement('div');
    barre.className = 'chargement';
    barre.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barre);

    let minuteur = null;
    const montrer = () => {
      clearTimeout(minuteur);
      minuteur = setTimeout(() => barre.classList.add('visible'), 420);
    };
    const cacher = () => { clearTimeout(minuteur); barre.classList.remove('visible'); };

    // 1 — le premier affichage, s'il tarde.
    if (document.readyState !== 'complete') {
      montrer();
      addEventListener('load', cacher, { once: true });
    }

    /* 2 — le passage d'une page à l'autre. C'est la seule attente réelle ici :
       le site n'embarque aucune image ni police à télécharger, donc son
       premier chargement est immédiat et la barre ne s'y verrait jamais —
       alors que changer de page redemande un aller-retour au serveur, et
       c'est précisément là qu'un visiteur en 4G faible reste sans réponse. */
    addEventListener('click', e => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const brut = a.getAttribute('href') || '';
      if (/^(#|mailto:|tel:|javascript:)/i.test(brut)) return;
      let u;
      try { u = new URL(a.href, location.href); } catch { return; }
      if (u.origin !== location.origin) return;
      // Même document : une ancre, ou un lien du routeur du fichier unique.
      // Rien ne part sur le réseau, la barre tournerait dans le vide.
      if (u.pathname === location.pathname && u.search === location.search) return;
      montrer();
    }, true);

    // Retour arrière : la page revient du cache telle qu'elle a été quittée,
    // barre en cours comprise. On la coupe à l'arrivée comme au départ.
    addEventListener('pageshow', e => { if (e.persisted) cacher(); });
    addEventListener('pagehide', cacher);
  })();

  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);
})();
