/* =========================================================
   AU BON PAIN — Sète
   Interactions du site. Sans dépendance, sans build.

   Quatre choses vivent ici :
     1. les horaires   → l'état d'ouverture, calculé à l'heure du visiteur
     2. l'horloge du four → cadran 7 h–13 h, aiguille réelle, fournées
     3. le sac         → panier, créneaux de retrait, envoi par SMS
     4. le sandwich    → configurateur, prix en direct, dessin qui se monte

   À AJUSTER PAR LE COMMERÇANT : les deux tableaux ci-dessous
   (HORAIRES et FOURNEES) et les prix, qui sont dans le HTML,
   dans l'attribut data-prix de chaque carte.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   0 · Réglages
   --------------------------------------------------------- */

/* Heures décimales : 7.5 = 7 h 30. null = fermé.
   Index 0 = dimanche, 1 = lundi, … 6 = samedi. */
const HORAIRES = [
  null,        // dimanche
  [7, 13],     // lundi
  [7, 13],     // mardi
  [7, 13],     // mercredi
  [7, 13],     // jeudi
  [7, 13],     // vendredi
  [7, 13],     // samedi
];

const FOURNEES = [
  { h: 7,    nom: 'Baguettes & pains de tradition' },
  { h: 8.5,  nom: 'Viennoiseries au beurre' },
  { h: 11,   nom: 'Fougasses & pains spéciaux' },
  { h: 12,   nom: 'Dernière fournée' },
];

const TEL       = '+33467535931';
const CLE_PANIER = 'abp-panier-v1';

const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

/* ---------------------------------------------------------
   1 · Outils
   --------------------------------------------------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const euro = n => n.toFixed(2).replace('.', ',') + ' €';

/* 8.5 → « 8 h 30 » ; utilisé partout où l'on parle à l'humain */
const hHum = h => {
  const H = Math.floor(h), M = Math.round((h - H) * 60);
  return M ? `${H} h ${String(M).padStart(2, '0')}` : `${H} h`;
};
/* 8.5 → « 08:30 » ; utilisé dans les listes et les messages */
const hNum = h => {
  const H = Math.floor(h), M = Math.round((h - H) * 60);
  return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
};

const decimal = d => d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;

const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   2 · État d'ouverture
   --------------------------------------------------------- */

/* Renvoie { etat, texte, note } — « ouvert », « bientot » ou « ferme ». */
function etatOuverture(now = new Date()) {
  const j = now.getDay();
  const h = decimal(now);
  const plage = HORAIRES[j];

  if (plage && h >= plage[0] && h < plage[1]) {
    const reste = (plage[1] - h) * 60;
    if (reste <= 45) {
      return { etat: 'bientot', texte: `Ferme bientôt · ${hHum(plage[1])}`,
               note: `Encore ${Math.round(reste)} minutes avant la fermeture.` };
    }
    return { etat: 'ouvert', texte: `Ouvert · ferme à ${hHum(plage[1])}`,
             note: `C'est ouvert : le comptoir vous attend jusqu'à ${hHum(plage[1])}.` };
  }

  /* Fermé : on cherche la prochaine ouverture, aujourd'hui compris. */
  for (let d = 0; d < 8; d++) {
    const jj = (j + d) % 7;
    const p = HORAIRES[jj];
    if (!p) continue;
    if (d === 0 && h >= p[0]) continue;          // aujourd'hui, déjà passé
    const quand = d === 0 ? "aujourd'hui"
                : d === 1 ? 'demain'
                : JOURS[jj];
    return { etat: 'ferme', texte: `Fermé · ouvre ${quand} à ${hHum(p[0])}`,
             note: `C'est fermé pour l'instant. Réouverture ${quand} à ${hHum(p[0])} — la commande, elle, reste ouverte.` };
  }
  return { etat: 'ferme', texte: 'Fermé', note: 'Horaires momentanément indisponibles.' };
}

function majEtat() {
  const { etat, texte, note } = etatOuverture();
  const pill = $('#pill-etat');
  if (pill) { pill.dataset.etat = etat; $('#pill-txt').textContent = texte; }
  const info = $('#infos-etat');
  if (info) info.textContent = note;

  /* Le jour courant est surligné dans le tableau des horaires */
  const j = new Date().getDay();
  $$('#horaires tr').forEach(tr => tr.classList.toggle('aujourdhui', +tr.dataset.j === j));
}

/* ---------------------------------------------------------
   3 · L'horloge du four
   Le cadran couvre 7 h → 13 h sur 240°, de -120° à +120°.
   --------------------------------------------------------- */
const CAD = { cx: 130, cy: 130, r: 100, h0: 7, h1: 13, a0: -120, a1: 120 };

const angleDe = h => CAD.a0 + ((h - CAD.h0) / (CAD.h1 - CAD.h0)) * (CAD.a1 - CAD.a0);
const pointDe = (h, r = CAD.r) => {
  const a = (angleDe(h) - 90) * Math.PI / 180;   /* -90° : 0 h en haut */
  return { x: CAD.cx + r * Math.cos(a), y: CAD.cy + r * Math.sin(a) };
};
const svgEl = (nom, attrs) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', nom);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};

function dessineCadran() {
  const gT = $('#fc-ticks'), gF = $('#fc-fournees');
  if (!gT || !gF) return;

  /* Graduations et libellés se posent à l'extérieur de l'anneau :
     la bande reste lisible, le centre reste libre pour le texte. */
  for (let h = CAD.h0; h <= CAD.h1; h++) {
    const a = pointDe(h, CAD.r + 10), b = pointDe(h, CAD.r + 16);
    gT.appendChild(svgEl('line', { class: 'fc-tick', x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
    if (h === CAD.h0 || h === 10 || h === CAD.h1) {
      const t = pointDe(h, CAD.r + 28);
      const txt = svgEl('text', { class: 'fc-htxt', x: t.x, y: t.y + 4 });
      txt.textContent = `${h} h`;
      gT.appendChild(txt);
    }
  }

  /* Un point par fournée, sur l'arc */
  FOURNEES.forEach((f, i) => {
    const p = pointDe(f.h);
    const c = svgEl('circle', { class: 'fc-four', cx: p.x, cy: p.y, r: 7, 'data-i': i });
    gF.appendChild(c);
  });
}

/* Prochaine fournée : aujourd'hui si possible, sinon la première du prochain jour ouvré */
function prochaineFournee(now = new Date()) {
  const h = decimal(now);
  const ouvertAujourdhui = !!HORAIRES[now.getDay()];
  if (ouvertAujourdhui) {
    const f = FOURNEES.find(f => f.h > h);
    if (f) return { ...f, demain: false, minutes: Math.round((f.h - h) * 60) };
  }
  return { ...FOURNEES[0], demain: true, minutes: null };
}

function majFour() {
  const now = new Date();
  const h = decimal(now);
  const { etat } = etatOuverture(now);

  /* Remplissage de l'arc : où en est la matinée */
  const frac = Math.min(1, Math.max(0, (h - CAD.h0) / (CAD.h1 - CAD.h0)));
  const fill = $('#fc-fill');
  if (fill) fill.style.strokeDasharray = `${etat === 'ferme' && h < CAD.h0 ? 0 : frac} 1`;

  /* État des points de fournée */
  const proche = FOURNEES.reduce((best, f, i) =>
    (h >= f.h && h - f.h < 1.5 && (best === -1 || f.h > FOURNEES[best].h)) ? i : best, -1);
  $$('#fc-fournees .fc-four').forEach((c, i) => {
    c.classList.toggle('passee', h >= FOURNEES[i].h);
    c.classList.toggle('active', i === proche && etat !== 'ferme');
    c.setAttribute('r', i === proche && etat !== 'ferme' ? 10 : 7);
  });

  /* L'aiguille — seulement pendant le service */
  const gN = $('#fc-needle');
  if (gN) {
    gN.innerHTML = '';
    if (h >= CAD.h0 && h <= CAD.h1 && etat !== 'ferme') {
      /* Un simple trait qui traverse la bande : lisible même posé sur
         un point de fournée, et il n'entre pas dans le texte du centre. */
      const a = pointDe(h, CAD.r - 13), b = pointDe(h, CAD.r + 18);
      gN.appendChild(svgEl('line', { class: 'fc-needle-trait', x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
    }
  }

  /* Le centre du cadran raconte l'information utile */
  const kick = $('#fc-kicker'), big = $('#fc-big'), sub = $('#fc-sub');
  if (!kick) return;

  if (etat === 'ferme') {
    const texte = etatOuverture(now).texte;
    const p = HORAIRES[now.getDay()];
    const ouvreA = (p && h < p[0]) ? p[0] : FOURNEES[0].h;
    kick.textContent = 'Le four repose';
    big.textContent  = hNum(ouvreA);
    sub.textContent  = texte.replace('Fermé · ', '').replace(/^ouvre/, 'Ouvre');
    return;
  }

  /* Une fournée vient de sortir : cette information passe avant le compte à rebours */
  const juste = proche !== -1 && (h - FOURNEES[proche].h) <= 0.34;   /* 20 minutes */
  const f = prochaineFournee(now);

  const ferme = HORAIRES[now.getDay()][1];

  if (juste) {
    kick.textContent = 'Sorti du four';
    big.textContent  = hHum(FOURNEES[proche].h);
    sub.textContent  = FOURNEES[proche].nom;
  } else if (f.demain) {
    /* Plus de fournée aujourd'hui : ce qui compte devient l'heure de fermeture */
    kick.textContent = 'Fermeture dans';
    big.textContent  = `${Math.round((ferme - h) * 60)} min`;
    sub.textContent  = `Il reste de tout jusqu’à ${hHum(ferme)}.`;
  } else {
    kick.textContent = 'Prochaine fournée';
    big.textContent  = f.minutes >= 60
      ? `${Math.floor(f.minutes / 60)} h ${String(f.minutes % 60).padStart(2, '0')}`
      : `${f.minutes} min`;
    sub.textContent  = f.nom;
  }

  /* La carte de fournée correspondante se signale dans la section */
  $$('#fournees .fournee').forEach(li => {
    const fh = parseFloat(li.dataset.h);
    li.classList.toggle('is-now', proche !== -1 && FOURNEES[proche].h === fh && etat !== 'ferme');
    li.classList.toggle('is-past', h > fh + 1.5);
  });
}

/* ---------------------------------------------------------
   4 · Le sac
   --------------------------------------------------------- */
let panier = [];

try {
  const brut = localStorage.getItem(CLE_PANIER);
  if (brut) panier = JSON.parse(brut) || [];
} catch (e) { panier = []; }

const sauve = () => {
  try { localStorage.setItem(CLE_PANIER, JSON.stringify(panier)); } catch (e) { /* mode privé */ }
};

const totalPanier = () => panier.reduce((s, l) => s + l.prix * l.q, 0);
const nbArticles  = () => panier.reduce((s, l) => s + l.q, 0);

function ajouter(article) {
  const meme = panier.find(l => l.id === article.id && l.det === article.det);
  if (meme) meme.q++;
  else panier.push({ ...article, q: 1 });
  sauve();
  majPanier();

  const btn = $('#ouvrir-panier');
  if (doux) { btn.classList.remove('saute'); void btn.offsetWidth; btn.classList.add('saute'); }
  toast(`${article.nom} — dans le sac`);
}

function majPanier() {
  const n = nbArticles();
  const badge = $('#panier-n');
  badge.textContent = n;
  badge.hidden = n === 0;

  $('#total').textContent = euro(totalPanier());
  $('#panier-vide').hidden = n > 0;
  $('#retrait').hidden = n === 0;
  $('#envoyer').disabled = n === 0;

  const ul = $('#lignes');
  ul.innerHTML = '';
  panier.forEach((l, i) => {
    const li = document.createElement('li');
    li.className = 'ligne';
    li.innerHTML = `
      <svg class="ligne__img" viewBox="0 0 64 64" aria-hidden="true"><use href="#${l.icone}"/></svg>
      <div>
        <p class="ligne__nom">${l.nom}</p>
        ${l.det ? `<p class="ligne__det">${l.det}</p>` : ''}
        <p class="ligne__pu">${euro(l.prix)} l'unité</p>
      </div>
      <div class="qte">
        <button data-i="${i}" data-d="-1" aria-label="Retirer un ${l.nom}">−</button>
        <span>${l.q}</span>
        <button data-i="${i}" data-d="1" aria-label="Ajouter un ${l.nom}">+</button>
      </div>`;
    ul.appendChild(li);
  });

  majCreneaux();
  majBarre();
}

$('#lignes').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]');
  if (!b) return;
  const i = +b.dataset.i;
  panier[i].q += +b.dataset.d;
  if (panier[i].q < 1) panier.splice(i, 1);
  sauve();
  majPanier();
});

/* Boutons « + » de la carte */
$$('.plat').forEach(plat => {
  const btn = $('.add', plat);
  btn.addEventListener('click', () => {
    ajouter({
      id:    plat.dataset.id,
      nom:   plat.dataset.nom,
      prix:  parseFloat(plat.dataset.prix),
      det:   '',
      icone: $('use', plat).getAttribute('href').slice(1),
    });
    btn.classList.add('fait');
    btn.textContent = '✓';
    setTimeout(() => { btn.classList.remove('fait'); btn.textContent = '+'; }, 900);
  });
});

/* ---------------------------------------------------------
   5 · Créneaux de retrait
   Un créneau tous les quarts d'heure, jamais moins de
   20 minutes après maintenant, dans les jours ouverts.
   --------------------------------------------------------- */
const PAS = 0.25;      /* 15 minutes */
const DELAI = 20 / 60; /* le temps de monter les sandwichs */

function joursDisponibles() {
  const now = new Date();
  const h = decimal(now);
  const out = [];
  for (let d = 0; d < 10 && out.length < 4; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const p = HORAIRES[date.getDay()];
    if (!p) continue;
    const depart = d === 0 ? Math.max(p[0], Math.ceil((h + DELAI) / PAS) * PAS) : p[0];
    if (depart >= p[1]) continue;                 /* plus rien à prendre ce jour-là */
    out.push({
      d,
      cle: date.toISOString().slice(0, 10),
      label: d === 0 ? "Aujourd'hui" : d === 1 ? 'Demain'
             : `${JOURS[date.getDay()]} ${date.getDate()}`,
      depart, fin: p[1],
    });
  }
  return out;
}

function majCreneaux() {
  const selJ = $('#jour'), selC = $('#creneau');
  if (!selJ) return;

  const jours = joursDisponibles();
  const choixJ = selJ.value;
  selJ.innerHTML = jours.map(j => `<option value="${j.cle}">${j.label}</option>`).join('');
  if (jours.some(j => j.cle === choixJ)) selJ.value = choixJ;

  const j = jours.find(x => x.cle === selJ.value) || jours[0];
  if (!j) { selC.innerHTML = '<option>—</option>'; return; }

  const opts = [];
  for (let h = j.depart; h < j.fin; h += PAS) opts.push(`<option value="${h}">${hNum(h)}</option>`);
  const choixC = selC.value;
  selC.innerHTML = opts.join('');
  if (opts.some(o => o.includes(`value="${choixC}"`))) selC.value = choixC;

  $('#retrait-note').textContent = j.d === 0
    ? 'Retrait aujourd’hui : comptez 20 minutes de préparation.'
    : `Retrait ${j.label.toLowerCase()} — nous mettons vos pains de côté.`;
}

$('#jour').addEventListener('change', majCreneaux);

/* ---------------------------------------------------------
   6 · Ouverture / fermeture du tiroir
   --------------------------------------------------------- */
const drawer = $('#panier'), voile = $('#voile');
let dernierFocus = null;

function ouvrirPanier() {
  dernierFocus = document.activeElement;
  drawer.hidden = false; voile.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('on'); voile.classList.add('on'); });
  $('#ouvrir-panier').setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  majCreneaux();
  majBarre();
  setTimeout(() => $('#fermer-panier').focus(), 60);
}
function fermerPanier() {
  drawer.classList.remove('on'); voile.classList.remove('on');
  $('#ouvrir-panier').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => { drawer.hidden = true; voile.hidden = true; majBarre(); }, 480);
  if (dernierFocus) dernierFocus.focus();
}

$('#ouvrir-panier').addEventListener('click', ouvrirPanier);
$('#fermer-panier').addEventListener('click', fermerPanier);
voile.addEventListener('click', fermerPanier);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !drawer.hidden) fermerPanier();
  /* Le focus reste dans le tiroir tant qu'il est ouvert */
  if (e.key === 'Tab' && !drawer.hidden) {
    const f = $$('button, a[href], input, select', drawer).filter(el => !el.disabled && el.offsetParent);
    if (!f.length) return;
    const premier = f[0], dernier = f[f.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  }
});

/* ---------------------------------------------------------
   7 · Envoi de la commande
   Pas de back-end sur ce site : la commande part en SMS chez
   le commerçant, dans un format qu'il peut lire d'un coup d'œil.
   --------------------------------------------------------- */
function texteCommande() {
  const jour = $('#jour').selectedOptions[0]?.textContent || '';
  const cre  = $('#creneau').selectedOptions[0]?.textContent || '';
  const nom  = $('#prenom').value.trim();
  const tel  = $('#tel').value.trim();

  const lignes = panier.map(l =>
    `- ${l.q} × ${l.nom}${l.det ? ` (${l.det})` : ''} : ${euro(l.prix * l.q)}`).join('\n');

  return [
    'Commande Au Bon Pain',
    nom ? `Pour : ${nom}` : null,
    tel ? `Tél : ${tel}` : null,
    `Retrait : ${jour} à ${cre}`,
    '',
    lignes,
    '',
    `Total : ${euro(totalPanier())}`,
  ].filter(Boolean).join('\n');
}

$('#envoyer').addEventListener('click', () => {
  if (!panier.length) return;
  const nom = $('#prenom').value.trim();
  if (!nom) { $('#prenom').focus(); toast('Un prénom, pour retrouver votre sac'); return; }

  const corps = encodeURIComponent(texteCommande());
  /* Le séparateur diffère selon les plateformes : « ?&body= » couvre iOS et Android. */
  window.location.href = `sms:${TEL}?&body=${corps}`;
  toast('Votre message est prêt — il ne reste qu’à l’envoyer');
});

$('#copier').addEventListener('click', async () => {
  const txt = panier.length ? texteCommande() : 'Sac vide.';
  try {
    await navigator.clipboard.writeText(txt);
    toast('Récapitulatif copié');
  } catch (e) {
    /* Navigateurs sans presse-papiers : on sélectionne un champ temporaire */
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    toast('Récapitulatif copié');
  }
});

/* ---------------------------------------------------------
   8 · Le configurateur de sandwich
   --------------------------------------------------------- */
const form = $('#form-sandwich');

function litSandwich() {
  const pain = form.querySelector('input[name=pain]:checked');
  const gar  = form.querySelector('input[name=garniture]:checked');
  const sauce = form.querySelector('input[name=sauce]:checked');
  const crud = $$('input[name=crudites]:checked', form).map(i => i.value);
  const formule = $('#formule');

  const prix = parseFloat(pain.dataset.prix) + parseFloat(gar.dataset.prix)
             + (formule.checked ? parseFloat(formule.dataset.prix) : 0);

  return { pain: pain.value, gar: gar.value, sauce: sauce.value, crud, formule: formule.checked, prix };
}

function majSandwich() {
  const s = litSandwich();
  $('#sandwich-prix').textContent = euro(s.prix);

  /* Le choix relu en mots : on vérifie sa commande sans relire les cases */
  const mots = $('#sandwich-mots');
  if (mots) {
    const crud = s.crud.length ? s.crud.join(', ').toLowerCase() : 'sans crudités';
    mots.innerHTML = `<b>${s.gar}</b> sur ${s.pain.toLowerCase()}, ${crud}, `
      + `${s.sauce.toLowerCase()}${s.formule ? ', en formule midi' : ''}.`;
  }

  /* Le dessin suit les choix : teinte de la garniture, sauce, crudités */
  const gar = form.querySelector('input[name=garniture]:checked');
  const sauce = form.querySelector('input[name=sauce]:checked');
  $('#sv-garniture').querySelector('rect').style.fill = gar.dataset.teinte;
  const svSauce = $('#sv-sauce');
  svSauce.classList.toggle('sv-off', sauce.dataset.teinte === 'transparent');
  svSauce.querySelector('path').style.fill = sauce.dataset.teinte;
  $('#sv-crudites').classList.toggle('sv-off', s.crud.length === 0);

  /* La couche rejouée à chaque changement : le sandwich se remonte */
  if (doux) {
    [$('#sv-garniture'), $('#sv-crudites'), $('#sv-sauce')].forEach(g => {
      g.style.animation = 'none'; void g.offsetWidth; g.style.animation = '';
    });
  }
}

form.addEventListener('change', majSandwich);
form.addEventListener('submit', e => {
  e.preventDefault();
  const s = litSandwich();
  const det = [s.pain, s.crud.join(', ') || 'sans crudités', s.sauce.toLowerCase(),
               s.formule ? 'formule midi' : null].filter(Boolean).join(' · ');
  ajouter({
    id: 'sur-mesure-' + Date.now().toString(36),
    nom: `Sandwich ${s.gar.toLowerCase()}`,
    prix: s.prix, det, icone: 'ic-sandwich',
  });
  $('#sandwich-recap').textContent = 'Ajouté au sac. Vous pouvez en composer un autre.';
  setTimeout(() => { $('#sandwich-recap').textContent = ''; }, 5000);
});

/* ---------------------------------------------------------
   9 · Menu mobile, apparitions, barre collante, toast
   --------------------------------------------------------- */
const burger = $('#burger'), menuMob = $('#menu-mob');
burger.addEventListener('click', () => {
  const ouvert = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!ouvert));
  burger.setAttribute('aria-label', ouvert ? 'Ouvrir le menu' : 'Fermer le menu');
  menuMob.hidden = ouvert;
});
$$('a', menuMob).forEach(a => a.addEventListener('click', () => {
  menuMob.hidden = true;
  burger.setAttribute('aria-expanded', 'false');
}));

const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 16);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en, i) => {
      if (!en.isIntersecting) return;
      /* Léger décalage entre voisins : le contenu arrive, il ne saute pas */
      setTimeout(() => en.target.classList.add('vu'), doux ? i * 70 : 0);
      obs.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('vu'));
}

let tId;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(tId);
  tId = setTimeout(() => t.classList.remove('on'), 2600);
}

/* Filtres de la carte — les cartes s'effacent puis reviennent,
   au lieu de disparaître d'un coup */
$$('.filtre').forEach(f => f.addEventListener('click', () => {
  $$('.filtre').forEach(x => { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
  f.classList.add('is-on'); f.setAttribute('aria-pressed', 'true');

  const cible = f.dataset.f;
  let visibles = 0;

  $$('.plat').forEach(p => {
    const ok = cible === 'tout' || p.dataset.cat === cible;
    if (ok) visibles++;

    if (!doux) {                       /* mouvement réduit : on coupe court */
      p.classList.toggle('is-hidden', !ok);
      return;
    }
    if (ok && p.classList.contains('is-hidden')) {
      p.classList.remove('is-hidden', 'part');
      p.classList.add('arrive');
      setTimeout(() => p.classList.remove('arrive'), 460);
    } else if (!ok && !p.classList.contains('is-hidden')) {
      p.classList.add('part');
      setTimeout(() => { p.classList.add('is-hidden'); p.classList.remove('part'); }, 200);
    }
  });

  $('#grille-vide').hidden = visibles > 0;
}));

/* ---------------------------------------------------------
   11 · « Tout chaud »
   Chaque produit porte la ou les fournées dont il sort
   (data-fournee). Pendant les 75 minutes qui suivent, la carte
   le dit — c'est l'information qu'on vient chercher.
   --------------------------------------------------------- */
const FENETRE_CHAUD = 75 / 60;   /* heures */

function majChaud() {
  const now = new Date();
  const h = decimal(now);
  const ouvert = etatOuverture(now).etat !== 'ferme';
  const chauds = [];

  $$('.plat[data-fournee]').forEach(p => {
    const sorties = p.dataset.fournee.split(',').map(Number);
    const chaud = ouvert && sorties.some(f => h >= f && h - f <= FENETRE_CHAUD);

    p.classList.toggle('est-chaud', chaud);
    let pastille = $('.chaud', p);
    if (chaud && !pastille) {
      pastille = document.createElement('span');
      pastille.className = 'chaud';
      pastille.textContent = 'Tout chaud';
      p.prepend(pastille);
    } else if (!chaud && pastille) {
      pastille.remove();
    }
    if (chaud) chauds.push(p.dataset.nom.toLowerCase());
  });

  /* Le résumé sous le titre de la carte */
  const ligne = $('#carte-chaud');
  if (!ligne) return;
  if (!chauds.length) { ligne.hidden = true; return; }
  ligne.hidden = false;
  const reste = chauds.length - 3;
  const liste = reste > 0
    ? chauds.slice(0, 3).join(', ') + (reste === 1 ? ' et un autre' : ` et ${reste} autres`)
    : chauds.join(', ');
  ligne.textContent = `Sorti du four à l’instant : ${liste}.`;
}

/* ---------------------------------------------------------
   12 · La barre du sac (téléphone) et le repère de navigation
   --------------------------------------------------------- */
function majBarre() {
  const barre = $('#barre-sac');
  if (!barre) return;
  const n = nbArticles();
  barre.hidden = n === 0 || !drawer.hidden;
  document.body.classList.toggle('avec-barre', !barre.hidden);
  if (n === 0) return;
  $('#barre-n').textContent = `${n} article${n > 1 ? 's' : ''}`;
  $('#barre-total').textContent = euro(totalPanier());
}
$('#barre-sac').addEventListener('click', ouvrirPanier);

/* Repère de section : le lien de la section lue s'annonce */
const liens = $$('.nav__links a');
const sections = liens
  .map(a => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
  .filter(x => x.sec);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      liens.forEach(a => a.classList.remove('ici'));
      const trouve = sections.find(x => x.sec === en.target);
      if (trouve) trouve.a.classList.add('ici');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(x => spy.observe(x.sec));
}

/* ---------------------------------------------------------
   10 · Démarrage — puis on repasse toutes les 30 secondes,
   pour que le compte à rebours et l'état restent vrais.
   --------------------------------------------------------- */
dessineCadran();
majEtat();
majFour();
majChaud();
majPanier();
majSandwich();

setInterval(() => { majEtat(); majFour(); majChaud(); }, 30000);
