/* =========================================================
   MJ AGENCY — Interactions
   ========================================================= */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 900px)').matches || 'ontouchstart' in window;

  /* ---------------- Preloader ---------------- */
  const loader = document.querySelector('.loader');
  const pct = document.querySelector('.loader__pct');
  function finishLoad() {
    if (!loader) { document.body.classList.add('loaded'); return; }
    let n = 0;
    const t = setInterval(() => {
      n += Math.floor(Math.random() * 18) + 6;
      if (n >= 100) { n = 100; clearInterval(t); setTimeout(hide, 350); }
      if (pct) pct.textContent = String(n).padStart(3, '0') + ' %';
    }, 120);
    function hide() {
      loader.classList.add('done');
      document.body.classList.add('loaded');
      startHero();
    }
  }
  function startHero() {
    document.querySelectorAll('.hero__title .line > span').forEach((el, i) => {
      el.style.transition = 'transform 1s var(--ease)';
      el.style.transitionDelay = (i * 0.09) + 's';
      requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; });
    });
  }

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverSel = 'a, button, .work-item, .card, .cal__day.avail, .slot, .btn, input, textarea, select';
    document.addEventListener('mouseover', e => {
      const t = e.target.closest(hoverSel);
      if (t) {
        ring.classList.add('hover');
        const lbl = t.getAttribute('data-cursor');
        if (lbl) { ring.classList.add('label'); ring.setAttribute('data-label', lbl); }
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) { ring.classList.remove('hover', 'label'); }
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!isTouch && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.35;
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
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* ---------------- Count-up stats ---------------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      let cur = 0; const dur = 1400, start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        cur = target * eased;
        el.firstChild.nodeValue = (Number.isInteger(target) ? Math.round(cur) : cur.toFixed(1));
        if (p < 1) requestAnimationFrame(tick);
      }
      // ensure suffix span preserved
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------------- Nav scroll state ---------------- */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (nav) nav.style.transform = (y > lastY && y > 400) ? 'translateY(-120%)' : 'translateY(0)';
    lastY = y;
  }, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.mobile-menu');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      nav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobile.classList.remove('open'); nav.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  /* ---------------- Work list floating preview ---------------- */
  const preview = document.querySelector('.work-preview');
  if (preview && !isTouch) {
    const phEl = preview.querySelector('.ph');
    let raf;
    document.querySelectorAll('.work-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        preview.classList.add('show');
        phEl.className = 'ph ' + (item.getAttribute('data-ph') || 'ph-1');
      });
      item.addEventListener('mouseleave', () => preview.classList.remove('show'));
    });
    addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        preview.style.left = e.clientX + 'px';
        preview.style.top = e.clientY + 'px';
      });
    });
  }

  /* ---------------- Booking calendar ---------------- */
  initCalendar();
  function initCalendar() {
    const cal = document.querySelector('[data-calendar]');
    if (!cal) return;
    const monthEl = cal.querySelector('.cal__month');
    const grid = cal.querySelector('.cal__grid');
    const prev = cal.querySelector('[data-prev]');
    const next = cal.querySelector('[data-next]');
    const slotsWrap = document.querySelector('[data-slots]');
    const slotGrid = slotsWrap ? slotsWrap.querySelector('.slots__grid') : null;
    const sumDate = document.querySelector('[data-sum-date]');
    const sumTime = document.querySelector('[data-sum-time]');
    const hiddenDate = document.querySelector('[name="date"]');
    const hiddenTime = document.querySelector('[name="time"]');

    const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

    let view = new Date(); view.setDate(1);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let selectedDay = null;

    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      monthEl.textContent = MONTHS[m] + ' ' + y;
      grid.innerHTML = '';
      DOW.forEach(d => { const el = document.createElement('div'); el.className = 'cal__dow'; el.textContent = d; grid.appendChild(el); });
      let first = new Date(y, m, 1).getDay(); // 0=Sun
      first = (first === 0) ? 6 : first - 1;  // make Monday first
      const days = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < first; i++) { const e = document.createElement('div'); e.className = 'cal__day empty'; grid.appendChild(e); }
      for (let d = 1; d <= days; d++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cal__day';
        cell.textContent = d;
        const date = new Date(y, m, d);
        const dow = date.getDay();
        const past = date < today;
        const weekend = (dow === 0 || dow === 6);
        if (past || weekend) { cell.classList.add('disabled'); }
        else { cell.classList.add('avail'); cell.setAttribute('data-cursor', 'Choisir'); }
        if (selectedDay && date.getTime() === selectedDay.getTime()) cell.classList.add('selected');
        cell.addEventListener('click', () => {
          selectedDay = date;
          render();
          buildSlots(date);
        });
        grid.appendChild(cell);
      }
    }
    function buildSlots(date) {
      if (!slotGrid) return;
      slotsWrap.style.display = 'block';
      slotGrid.innerHTML = '';
      const label = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (sumDate) sumDate.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      if (hiddenDate) hiddenDate.value = date.toISOString().slice(0, 10);
      SLOTS.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'slot'; b.textContent = s;
        b.setAttribute('data-cursor', 'Réserver');
        // pseudo-random unavailable slots for realism
        if ((date.getDate() + i) % 5 === 0) b.classList.add('disabled');
        b.addEventListener('click', () => {
          slotGrid.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
          b.classList.add('selected');
          if (sumTime) sumTime.textContent = s;
          if (hiddenTime) hiddenTime.value = s;
        });
        slotGrid.appendChild(b);
      });
    }
    prev && prev.addEventListener('click', () => {
      const min = new Date(); min.setDate(1);
      if (view > min) { view.setMonth(view.getMonth() - 1); render(); }
    });
    next && next.addEventListener('click', () => { view.setMonth(view.getMonth() + 1); render(); });
    render();
  }

  /* ---------------- Form submit (demo) ---------------- */
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      if (msg) {
        msg.classList.add('show');
        msg.textContent = form.getAttribute('data-success') || 'Merci — nous revenons vers vous sous 24 h.';
      }
      form.querySelectorAll('input, textarea, select').forEach(f => { if (f.type !== 'hidden') f.value = ''; });
    });
  });

  /* ---------------- Page transitions ---------------- */
  const curtain = document.querySelector('.curtain');
  if (curtain) {
    // reveal on load
    curtain.classList.add('cover');
    requestAnimationFrame(() => { setTimeout(() => curtain.classList.add('reveal-up'), 40); });
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank') return;
      a.addEventListener('click', e => {
        e.preventDefault();
        curtain.classList.remove('reveal-up');
        curtain.classList.add('cover');
        setTimeout(() => { location.href = href; }, 560);
      });
    });
  }

  /* ---------------- Kick off ---------------- */
  if (document.readyState === 'complete') finishLoad();
  else addEventListener('load', finishLoad);
})();
