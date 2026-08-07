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

     Les demandes partent vers DESTINATAIRE.

     La clé Web3Forms ci-dessous est publique par nature : elle circule
     dans le navigateur du visiteur, donc elle est lisible dans le code
     source. C'est le fonctionnement prévu du service. La protection
     repose sur le champ piège plus bas ; en cas de spam, il suffit de
     régénérer la clé sur web3forms.com ou d'y activer un captcha.

     Si la clé venait à être retirée, le formulaire bascule sur
     l'ouverture du logiciel de messagerie du visiteur, pré-rempli.
     ========================================================= */
  const CLE_WEB3FORMS = '2931713f-3b41-44f3-829a-ce10b5f63700';
  const DESTINATAIRE  = 'vatmart3@gmail.com';          // boîte qui reçoit
  const CONTACT_PUBLIC = 'mjagency.officiel@gmail.com'; // adresse montrée aux visiteurs

  document.querySelectorAll('form[data-demo]').forEach(form => {
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    const btnTexte = btn ? btn.innerHTML : '';

    function afficher(texte, etat) {
      if (!msg) return;
      msg.classList.add('show');
      msg.classList.toggle('form-msg--erreur', etat === 'erreur');
      msg.textContent = texte;
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

      if (CLE_WEB3FORMS === 'A_REMPLACER') {
        // Repli : on ouvre la messagerie du visiteur, pré-remplie.
        afficher("Votre logiciel de messagerie va s'ouvrir avec la demande pré-remplie. Il ne reste qu'à l'envoyer.", 'info');
        location.href = `mailto:${DESTINATAIRE}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corpsTexte(c))}`;
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
      afficher('Envoi en cours…', 'info');

      try {
        const rep = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CLE_WEB3FORMS,
            subject: sujet,
            from_name: 'Site MJ Agency',
            replyto: c.email,
            Nom: c.nom, Email: c.email, Société: c.societe,
            Budget: c.budget, Date: c.date, Heure: c.heure, Projet: c.message
          })
        });
        const data = await rep.json();
        if (!rep.ok || !data.success) throw new Error(data.message || 'Envoi refusé');

        afficher(`Merci ${c.nom} — votre demande pour le ${c.date} à ${c.heure} est bien partie. Nous confirmons par email sous 24 h.`, 'ok');
        form.reset();
      } catch (err) {
        // On ne prétend jamais que c'est envoyé : on donne une porte de sortie.
        afficher("L'envoi a échoué. Écrivez-nous directement à " + CONTACT_PUBLIC + " ou appelez le 06 11 71 83 68.", 'erreur');
        console.warn('Formulaire :', err);
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
  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);
})();
