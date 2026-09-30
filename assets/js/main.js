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
  /* ---------------- La citation qui s'écrit ----------------
     Chaque mot devient un <span> qui apparaît après le précédent. Le
     découpage garde les séparateurs tels quels : une espace insécable
     avant un deux-points est une règle de typographie française, la
     perdre déplacerait la ponctuation à la ligne suivante.

     On ne touche pas à une citation qui contient déjà du balisage : y
     réécrire le HTML mot à mot casserait ses liens ou ses emphases. Et
     rien du tout si le visiteur demande moins d'animations. */
  (function motsDesAvis() {
    if (reduced) return;
    document.querySelectorAll('.tem__cite').forEach(p => {
      if (p.dataset.mots) return;

      // On n'enveloppe que les nœuds de texte, sans réécrire le HTML autour :
      // une citation qui contient un lien ou une emphase garde sa structure,
      // et la puce « à remplir » s'anime comme le fera la vraie phrase.
      const textes = [];
      const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) textes.push(w.currentNode);

      let i = 0;
      textes.forEach(n => {
        if (!n.nodeValue.trim()) return;
        const frag = document.createDocumentFragment();
        n.nodeValue.split(/(\s+)/).forEach(m => {
          if (!m) return;
          if (!m.trim()) { frag.appendChild(document.createTextNode(m)); return; }
          const s = document.createElement('span');
          s.className = 'mot';
          // 0,42 s : le temps que la maquette d'à côté finisse de s'assembler.
          s.style.transitionDelay = (0.42 + i * 0.028).toFixed(3) + 's';
          s.textContent = m;          // textContent, donc rien à échapper
          i++;
          frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      });
      p.dataset.mots = '1';
    });
  })();

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
     CONSENTEMENT ET AUDIT OFFERT

     Deux fenêtres, et un ordre : le bandeau d'abord, la proposition
     d'audit ensuite. Les afficher ensemble, c'est deux couches par-dessus
     la page dès l'arrivée — personne ne lit ni l'une ni l'autre.

     Ce que le site garde dans le navigateur, et rien d'autre :
       mj-cookies  oui | non — le choix fait dans le bandeau
       mj-audit    1 — la fenêtre d'audit a été vue, elle ne revient pas

     En cas de refus, le second n'est jamais écrit : la fenêtre d'audit ne
     s'ouvre pas du tout. C'est la seule façon honnête de tenir un refus
     sans avoir à mémoriser quelque chose pour s'en souvenir.
     ========================================================= */
  (function consentement() {
    const CLE_C = 'mj-cookies';
    const CLE_A = 'mj-audit';

    const lire = c => { try { return localStorage.getItem(c); } catch { return null; } };
    const ecrire = (c, v) => { try { localStorage.setItem(c, v); } catch { /* navigation privée */ } };

    const noeud = (balise, classe, html) => {
      const n = document.createElement(balise);
      if (classe) n.className = classe;
      if (html) n.innerHTML = html;
      return n;
    };

    /* Le cookie est dessiné, pas écrit en emoji : un emoji change de dessin
       à chaque système et n'a pas la couleur de la marque. Une pépite reprend
       le bleu du logo — c'est ce qui le rattache au studio. */
    const COOKIE = `
      <svg class="bandeau__cookie" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#F3E3C6" stroke="#D8B887" stroke-width="1.4"/>
        <circle cx="11.4" cy="11.8" r="2.1" fill="#7A4A21"/>
        <circle cx="20.3" cy="11.1" r="1.6" fill="#7A4A21"/>
        <circle cx="17.1" cy="18.6" r="2.3" fill="var(--blue)"/>
        <circle cx="10.9" cy="20.8" r="1.5" fill="#7A4A21"/>
        <circle cx="23"   cy="18.2" r="1.3" fill="#7A4A21"/>
      </svg>`;

    /* ---------------- Le bandeau ---------------- */
    function bandeau(apres) {
      // Second argument : le visiteur vient-il de répondre, ou avait-il déjà
      // répondu lors d'une visite précédente ? Le délai d'ouverture en dépend.
      if (lire(CLE_C)) { apres(lire(CLE_C), false); return; }

      const b = noeud('div', 'bandeau', `
        <div class="bandeau__tete">
          ${COOKIE}
          <span class="bandeau__marque"><i></i> MJ&nbsp;Agency <em>· Cookies</em></span>
        </div>
        <p class="bandeau__t">Aucune publicité, aucun traceur. Nous gardons seulement
        en mémoire votre choix et, si vous acceptez, le fait de vous avoir déjà proposé
        notre audit offert. <a href="confidentialite.html">Politique de confidentialité</a></p>
        <div class="bandeau__actions">
          <button type="button" class="bandeau__btn bandeau__btn--non">Refuser</button>
          <button type="button" class="bandeau__btn bandeau__btn--ok">Accepter</button>
        </div>`);
      b.setAttribute('role', 'region');
      b.setAttribute('aria-label', 'Cookies');
      document.body.appendChild(b);

      b.classList.add('montre');
      requestAnimationFrame(() => b.classList.add('vu'));

      const repondre = v => {
        ecrire(CLE_C, v);
        b.classList.remove('vu');
        setTimeout(() => b.remove(), reduced ? 0 : 400);
        apres(v, true);
      };
      b.querySelector('.bandeau__btn--ok').addEventListener('click', () => repondre('oui'));
      b.querySelector('.bandeau__btn--non').addEventListener('click', () => repondre('non'));
    }

    /* ---------------- La fenêtre d'audit ---------------- */
    function audit() {
      // Pas de fenêtre promotionnelle par-dessus une page légale : c'est là
      // qu'on vient lire ce que le site fait de ses données.
      if (document.querySelector('.legal')) return;
      if (lire(CLE_A)) return;

      const p = noeud('div', 'pop', `
        <div class="pop__boite" role="dialog" aria-modal="true" aria-labelledby="pop-t">
          <button type="button" class="pop__fermer" aria-label="Fermer">✕</button>
          <span class="pop__marque"><i></i> MJ&nbsp;Agency <em>· Offert</em></span>
          <h2 class="pop__t" id="pop-t">Votre site relu en 5&nbsp;points. Offert.</h2>
          <p class="pop__d">Laissez-nous son adresse&nbsp;: nous le passons en revue et
          vous envoyons nos observations sous 48&nbsp;h. Sans engagement, et sans suite
          commerciale si vous n'en voulez pas.</p>
          <ol class="pop__pts">
            <li><b>1</b> La vitesse de chargement, sur téléphone comme sur ordinateur</li>
            <li><b>2</b> Le rendu et le confort de lecture sur mobile</li>
            <li><b>3</b> Le référencement local&nbsp;: ce que Google comprend de vous</li>
            <li><b>4</b> La clarté de l'offre dès le premier écran</li>
            <li><b>5</b> Ce qui retient vos visiteurs de vous contacter</li>
          </ol>
          <form class="pop__form" novalidate>
            <div class="field">
              <input type="email" id="pop-email" name="email" placeholder=" " autocomplete="email" required>
              <label for="pop-email">Votre email</label>
            </div>
            <div class="field">
              <input type="text" id="pop-lien" name="lien" placeholder=" " inputmode="url" autocomplete="url" required>
              <label for="pop-lien">L'adresse de votre site</label>
            </div>
            <input type="text" name="site" tabindex="-1" autocomplete="off" aria-hidden="true"
                   style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
            <div class="form-msg" role="status"></div>
            <button type="submit" class="btn btn--glow">Recevoir mon audit <span class="arw" aria-hidden="true">↗</span></button>
            <p class="pop__note">Votre email et l'adresse de votre site ne servent qu'à
            réaliser et vous envoyer cet audit. Aucune inscription à une liste de diffusion.
            <a href="confidentialite.html">Politique de confidentialité</a></p>
          </form>
        </div>`);
      document.body.appendChild(p);

      const boite = p.querySelector('.pop__boite');
      const form  = p.querySelector('form');
      const msg   = p.querySelector('.form-msg');
      const btn   = p.querySelector('button[type="submit"]');
      const btnHtml = btn.innerHTML;
      let ouverte = false;
      let avant = null;

      function ouvrir() {
        avant = document.activeElement;
        p.classList.add('montre');
        requestAnimationFrame(() => p.classList.add('vu'));
        document.body.style.overflow = 'hidden';
        ouverte = true;
        p.querySelector('#pop-email').focus({ preventScroll: true });
      }

      function fermer() {
        if (!ouverte) return;
        ouverte = false;
        ecrire(CLE_A, '1');            // vue une fois, elle ne revient plus
        p.classList.remove('vu');
        document.body.style.overflow = '';
        setTimeout(() => p.remove(), reduced ? 0 : 350);
        if (avant && avant.focus) avant.focus({ preventScroll: true });
      }

      p.querySelector('.pop__fermer').addEventListener('click', fermer);
      p.addEventListener('click', e => { if (e.target === p) fermer(); });

      // Échap ferme, et Tab reste enfermé dans la fenêtre : sans cela le
      // focus part derrière le voile, sur une page qu'on ne peut plus voir.
      p.addEventListener('keydown', e => {
        if (e.key === 'Escape') { fermer(); return; }
        if (e.key !== 'Tab') return;
        const f = [...boite.querySelectorAll('button, input:not([tabindex="-1"]), a[href]')]
          .filter(n => n.offsetParent !== null);
        if (!f.length) return;
        const premier = f[0], dernier = f[f.length - 1];
        if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
        else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
      });

      function dire(texte, erreur, html) {
        msg.classList.add('show');
        msg.classList.toggle('form-msg--erreur', Boolean(erreur));
        if (html) msg.innerHTML = html; else msg.textContent = texte;
      }

      /* « monsite.fr » est une réponse parfaitement normale à « l'adresse de
         votre site ». On complète le schéma nous-mêmes plutôt que de renvoyer
         le visiteur à sa copie pour un détail de syntaxe. */
      function normalise(v) {
        const t = v.trim().replace(/\s+/g, '');
        if (!t) return '';
        const avecSchema = /^https?:\/\//i.test(t) ? t : 'https://' + t;
        try {
          const u = new URL(avecSchema);
          if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(u.hostname)) return '';
          return u.href;
        } catch { return ''; }
      }

      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (form.querySelector('[name="site"]').value) return;   // automate

        const email = form.querySelector('[name="email"]').value.trim();
        const champLien = form.querySelector('[name="lien"]');
        const lien = normalise(champLien.value);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          dire('Vérifiez votre adresse email.', true);
          form.querySelector('[name="email"]').focus();
          return;
        }
        if (!lien) {
          dire("Indiquez l'adresse de votre site, par exemple monsite.fr.", true);
          champLien.focus();
          return;
        }
        champLien.value = lien;

        btn.disabled = true;
        btn.textContent = 'Envoi…';
        dire('Envoi en cours…', false);

        try {
          const rep = await fetch(POINT_ENVOI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ type: 'audit', email, lien, site: '' })
          });
          const data = await rep.json().catch(() => ({}));
          if (!rep.ok || !data.ok) {
            const err = new Error(data.error || `HTTP ${rep.status}`);
            err.code = data.code || (rep.status === 404 ? 'ROUTE-ABSENTE' : 'HTTP-' + rep.status);
            throw err;
          }
          ecrire(CLE_A, '1');
          form.innerHTML = '<p class="pop__d" role="status">C\'est noté&nbsp;! Nous regardons ' +
            'votre site et vous écrivons sous 48&nbsp;h à cette adresse.</p>';
          setTimeout(fermer, 3600);
        } catch (err) {
          const corps = `Bonjour,\n\nJe souhaite l'audit offert en 5 points.\n\n` +
            `Email : ${email}\nSite : ${lien}\n`;
          const mailto = `mailto:${DESTINATAIRE}?subject=${encodeURIComponent('Audit offert — ' + lien)}` +
            `&body=${encodeURIComponent(corps)}`;
          dire(null, true,
            `L'envoi a échoué. <a href="${mailto}">Envoyez-le depuis votre messagerie</a> ` +
            `— tout est déjà rempli. <small class="form-msg__ref">réf. ${err.code || 'RESEAU'}</small>`);
          console.warn('Audit :', err.code || 'RESEAU', err);
        } finally {
          btn.disabled = false;
          btn.innerHTML = btnHtml;
        }
      });

      return ouvrir;
    }

    /* Le bandeau répond, puis la fenêtre s'ouvre — tout de suite si le
       visiteur vient de cliquer « Accepter », après un temps de lecture s'il
       avait déjà répondu lors d'une visite précédente. */
    bandeau((choix, vientDeRepondre) => {
      if (choix !== 'oui') return;
      const ouvrir = audit();
      if (!ouvrir) return;
      // 900 ms laisse le bandeau finir de s'effacer (400 ms) avant que la
      // fenêtre n'arrive ; 4,5 s laissent le temps de commencer à lire.
      setTimeout(ouvrir, vientDeRepondre ? 900 : 4500);
    });
  })();

  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);
})();
