/* =========================================================
   MJ AGENCY — Interactions
   ========================================================= */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Custom cursor ---------------- */
  if (fine) {
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    const sel = 'a, button, .card, .cal__day.avail, .slot, input, textarea, select';
    document.addEventListener('mouseover', e => {
      const t = e.target.closest(sel); if (!t) return;
      ring.classList.add('hover');
      const label = t.getAttribute('data-cursor');
      if (label) { ring.classList.add('label'); ring.setAttribute('data-label', label); }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(sel)) ring.classList.remove('hover', 'label');
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (fine && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

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

  /* ---------------- Work list floating preview ---------------- */
  const preview = document.querySelector('.work-preview');
  if (preview && fine) {
    const ph = preview.querySelector('.ph');
    document.querySelectorAll('.work-item[data-ph]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        preview.classList.add('show');
        ph.className = 'ph ' + item.getAttribute('data-ph');
      });
      item.addEventListener('mouseleave', () => preview.classList.remove('show'));
    });
    let raf;
    addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        preview.style.left = e.clientX + 'px';
        preview.style.top = e.clientY + 'px';
      });
    }, { passive: true });
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

  /* ---------------- Bassin de Thau : entrée dans la carte ----------------
     La carte occupe déjà tout l'écran ; seul son masque s'ouvre. On ne
     touche donc qu'à clip-path et opacity, jamais aux dimensions, pour
     que le navigateur n'ait aucune mise en page à refaire pendant le
     défilement. */
  (function thau() {
    const sec = document.querySelector('[data-thau]');
    if (!sec) return;

    const stage = sec.querySelector('.thau__stage');
    const map   = sec.querySelector('[data-thau-map]');
    const phone = sec.querySelector('[data-thau-phone]');
    const intro = sec.querySelector('[data-thau-intro]');
    const towns = sec.querySelector('[data-thau-towns]');
    const hint  = sec.querySelector('[data-thau-hint]');

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const ease  = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    let W = 0, H = 0, pw = 0, ph = 0;

    // Sur un grand écran on dessine un téléphone. Sur un téléphone, c'est
    // inutile — et un peu absurde : l'appareil du visiteur EST le téléphone.
    // Le masque part donc des bords de l'écran, avec le rayon d'angle d'un
    // vrai mobile, et s'ouvre jusqu'au plein bord.
    let surMobile = false, rayonDepart = 26;

    function measure() {
      W = stage.clientWidth;
      H = stage.clientHeight;
      surMobile = (W / H) < 1;

      if (surMobile) {
        pw = W - 24;
        ph = H - 24;
        rayonDepart = 36;
        phone.style.display = 'none';
      } else {
        pw = Math.min(300, W * 0.68);
        ph = Math.min(620, H * 0.72);
        rayonDepart = 26;
        phone.style.display = '';
        phone.style.width  = pw + 'px';
        phone.style.height = ph + 'px';
      }
    }

    // Sans animation demandée : carte ouverte, texte visible, rien ne bouge.
    if (reduced) {
      measure();
      map.style.clipPath = 'inset(0 0 round 0)';
      towns.style.opacity = '1';
      phone.style.opacity = '0';
      if (hint) hint.style.display = 'none';
      return;
    }

    let ticking = false;

    function apply() {
      ticking = false;
      const rect  = sec.getBoundingClientRect();
      const track = sec.offsetHeight - H;
      if (track <= 0) return;
      const p = clamp(-rect.top / track, 0, 1);

      // 1. le masque s'ouvre jusqu'au plein cadre
      const zoom = ease(clamp((p - 0.10) / 0.52, 0, 1));
      const cx = (W - pw) / 2 * (1 - zoom);
      const cy = (H - ph) / 2 * (1 - zoom);
      map.style.clipPath = `inset(${cy}px ${cx}px round ${rayonDepart * (1 - zoom)}px)`;

      // Sète occupe 67,6 % de la largeur et 47,5 % de la hauteur du dessin.
      // Au départ on est zoomé sur elle ; en s'ouvrant, le cadre recule
      // jusqu'à montrer le bassin entier, recentré.
      // Un écran portrait ne peut pas contenir une lagune de 19 km : la
      // carte y tient en bande, donc le gros plan de départ doit serrer
      // beaucoup plus fort pour rester lisible dans le téléphone.
      const narrow = surMobile;
      const startS = narrow ? 2.0 : 1.75;
      const endS   = narrow ? 1.10 : 1.0;
      const S  = startS - (startS - endS) * zoom;
      // En portrait, la carte finit en bande : on la remonte pour qu'elle
      // ne se retrouve pas derrière la liste des communes.
      const endY = narrow ? -15 : 0;
      const tx = -(67.6 - 50) * S * (1 - zoom);
      const ty = -(47.5 - 50) * S * (1 - zoom) + endY * zoom;
      map.style.setProperty('--ms', S.toFixed(3));
      map.style.setProperty('--tx', tx.toFixed(2) + '%');
      map.style.setProperty('--ty', ty.toFixed(2) + '%');

      // 2. le châssis et le titre s'effacent une fois passés
      if (!surMobile) phone.style.opacity = String(clamp(1 - (p - 0.26) / 0.20, 0, 1));
      intro.style.opacity = String(clamp(1 - (p - 0.16) / 0.18, 0, 1));
      if (hint) hint.style.opacity = String(clamp(1 - p / 0.12, 0, 1));

      // 3. les communes montent une fois qu'on est dedans
      const t = clamp((p - 0.62) / 0.18, 0, 1);
      towns.style.opacity = String(t);
      towns.style.transform = `translateY(${((1 - t) * 26).toFixed(1)}px)`;

      // 4. fondu de sortie : l'enchaînement vers la suite reste continu
      stage.style.opacity = String(1 - clamp((p - 0.90) / 0.10, 0, 1) * 0.55);
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { measure(); apply(); });
    measure();
    apply();
  })();

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

     Pour un envoi automatique, il faut une clé Web3Forms :
       1. aller sur web3forms.com
       2. saisir vatmart3@gmail.com — la clé arrive par email
       3. la coller ci-dessous à la place de la valeur actuelle
     C'est gratuit et sans création de compte.

     Tant que la clé n'est pas renseignée, le formulaire bascule sur
     l'ouverture du logiciel de messagerie du visiteur, pré-rempli. Ça
     fonctionne, mais ça demande une action de sa part : la clé reste
     nettement préférable.
     ========================================================= */
  const CLE_WEB3FORMS = 'A_REMPLACER';
  const DESTINATAIRE  = 'vatmart3@gmail.com';

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
        afficher("L'envoi a échoué. Écrivez-nous directement à " + DESTINATAIRE + " ou appelez le 06 11 71 83 68.", 'erreur');
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

  /* Le décor 3D n'appartient qu'à l'accueil — seule page à porter un .hero.
     Le déduire de la structure évite d'avoir à marquer chaque page à la main. */
  function syncBackdrop(scope) {
    const isHome = !!(scope || document).querySelector('.hero');
    document.body.classList.toggle('studio-3d', isHome);
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
     normal page load. Both share the same curtain wipe.            */
  const curtain = document.querySelector('.curtain');
  const pageEls = document.querySelectorAll('.page');
  const isRouter = pageEls.length > 1;

  if (curtain && !reduced) {
    curtain.classList.add('cover');
    requestAnimationFrame(() => setTimeout(() => curtain.classList.add('up'), 40));
  }

  function wipe(then) {
    if (!curtain || reduced) { then(); return; }
    curtain.classList.remove('up');
    curtain.classList.add('cover');
    setTimeout(() => { then(); curtain.classList.add('up'); }, 520);
  }

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
        syncBackdrop(page);
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

  const loader = document.querySelector('.loader');
  function boot() {
    if (loader) setTimeout(() => loader.classList.add('done'), 900);
    const scope = isRouter ? document.querySelector('.page.active') : document;
    syncBackdrop(scope);
    revealHero(scope);
  }
  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);
})();
