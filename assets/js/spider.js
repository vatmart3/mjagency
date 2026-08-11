/* =========================================================
   MJ AGENCY — INTERFACE EMBARQUÉE (/spider)
   La caméra en fond, une couche de données par-dessus, et le tout
   piloté aux doigts.

   Rien n'est déguisé et rien n'est plaqué sur le visage : ce que le
   suivi produit sert à l'interface, pas à un costume. Les mains sont
   dessinées en filaire et commandent la page ; le visage n'est qu'une
   cible verrouillée par le viseur.

   Tout se calcule dans le navigateur. Les images de la caméra ne
   quittent jamais l'appareil : seuls les mots dictés partent vers
   /api/iris, le temps d'obtenir une réponse.

   Le suivi vient de MediaPipe Tasks Vision, chargé depuis un CDN.
   S'il ne se charge pas, la page reste utilisable : caméra, heure,
   météo et conversation continuent de fonctionner.
   ========================================================= */

const CDN  = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22';
const WASM = CDN + '/wasm';
const MODELES = {
  mains:  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  visage: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
};

/* Les 21 repères de la main, reliés doigt par doigt. C'est la table
   HAND_CONNECTIONS de MediaPipe, écrite en chaînes plutôt qu'en paires :
   une polyligne par doigt se trace d'un seul trait. */
const DOIGTS = [
  [0, 1, 2, 3, 4],        // pouce
  [0, 5, 6, 7, 8],        // index
  [5, 9, 10, 11, 12],     // majeur
  [9, 13, 14, 15, 16],    // annulaire
  [13, 17, 18, 19, 20],   // auriculaire
  [0, 17],                // base de la paume
];
const BOUTS = [4, 8, 12, 16, 20];
const POUCE = 4, INDEX = 8, PAUME = 9, POIGNET = 0;

/* Repères du visage utiles au viseur : les yeux donnent l'inclinaison
   et l'écart, dont on tire une distance approchée. */
const OEIL_G = [33, 133, 159, 145];
const OEIL_D = [362, 263, 386, 374];
const NEZ = 4;

/* ---------------------------------------------------------------------
   Les profils d'interface

   Un profil n'est qu'une couleur d'accent, posée en variable CSS :
   toute l'interface — filets, panneaux, viseur, filaire de la main —
   la reprend d'un coup. En ajouter un revient à ajouter une ligne.
   --------------------------------------------------------------------- */
const PROFILS = [
  { id:'ecarlate', nom:'ÉCARLATE', accent:'#ff2b3d', rgb:'255,43,61'  },
  { id:'azur',     nom:'AZUR',     accent:'#38d9ff', rgb:'56,217,255' },
  { id:'ambre',    nom:'AMBRE',    accent:'#ffb000', rgb:'255,176,0'  },
  { id:'viride',   nom:'VIRIDE',   accent:'#39ff88', rgb:'57,255,136' },
];

/* ---------------------------------------------------------------------
   Outils
   --------------------------------------------------------------------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const cam = $('#cam');
const cv  = $('#ar');
const ctx = cv.getContext('2d');

const etat = {
  marche:false, facing:'user', cible:true,
  profil:0, trame:0, ips:0,
  mains:null, visage:null, perteVisage:99,
  meteo:null, ecoute:false, attend:false,
};

const historique = [];      // le fil de la conversation avec IRIS
const vue = { ox:0, oy:0, dw:0, dh:0, w:0, h:0 };

let lmMains = null, lmVisage = null;
const horlogeDetection = { mains:0, visage:0 };
let raf = 0;

/* =====================================================================
   1. SAS — rien ne démarre sans un geste

   La caméra, le micro et la synthèse vocale exigent tous une action
   délibérée de l'utilisateur, et sur iPhone la synthèse doit être
   « déverrouillée » pendant ce même geste, sinon elle restera muette
   pour toute la session.
   ===================================================================== */

$('#lancer').addEventListener('click', async () => {
  const bouton = $('#lancer'), note = $('#sas-note');
  bouton.disabled = true;
  bouton.textContent = 'INITIALISATION…';

  deverrouillerVoix();

  try {
    await ouvrirCamera(etat.facing);
  } catch (err) {
    console.error(err);
    bouton.disabled = false;
    bouton.textContent = 'RÉESSAYER';
    note.className = 'sas-note souci';
    note.textContent = err && err.name === 'NotAllowedError'
      ? "Caméra refusée. Autorisez-la dans les réglages du navigateur, puis réessayez."
      : "Caméra inaccessible. Vérifiez qu'aucune autre application ne l'utilise.";
    return;
  }

  $('#sas').classList.add('parti');
  $('#hud').hidden = false;
  requestAnimationFrame(() => $('#hud').classList.add('allume'));

  etat.marche = true;
  demarrerHorloge();
  chargerMeteo();
  setInterval(chargerMeteo, 10 * 60 * 1000);
  construirePastilles();
  appliquerProfil(0);
  boucle();
  chargerSuivi();

  setTimeout(() => direIris("Interface en ligne. Je vous écoute quand vous voulez.", false), 900);
});

/* =====================================================================
   2. La caméra
   ===================================================================== */

async function ouvrirCamera(facing) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('getUserMedia indisponible');
  }
  if (cam.srcObject) cam.srcObject.getTracks().forEach(t => t.stop());

  const flux = await navigator.mediaDevices.getUserMedia({
    audio:false,
    video:{
      facingMode:{ ideal:facing },
      width:{ ideal:1280 }, height:{ ideal:720 },
      frameRate:{ ideal:30 },
    },
  });

  cam.srcObject = flux;
  document.body.classList.toggle('dos', facing === 'environment');
  await cam.play();

  // Les dimensions réelles arrivent parfois après le play().
  if (!cam.videoWidth) {
    await new Promise(ok => cam.addEventListener('loadedmetadata', ok, { once:true }));
  }
  calerVue();
}

/* Le flux est affiché en `cover` : une partie déborde du cadre. Sans ce
   calcul, le filaire de la main se poserait à côté de la main sur tout
   écran dont le rapport diffère de celui de la caméra. */
function calerVue() {
  const r = Math.min(window.devicePixelRatio || 1, 2.5);
  const w = Math.round(cv.clientWidth * r), h = Math.round(cv.clientHeight * r);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }

  const vw = cam.videoWidth || 1280, vh = cam.videoHeight || 720;
  const s = Math.max(w / vw, h / vh);
  vue.w = w; vue.h = h;
  vue.dw = vw * s; vue.dh = vh * s;
  vue.ox = (w - vue.dw) / 2; vue.oy = (h - vue.dh) / 2;
}

/* Un repère normalisé (0→1 dans l'image) devient un point du canevas.
   Le miroir est appliqué en CSS, sur la vidéo et le calque à la fois :
   inutile — et nuisible — de le refaire ici. */
const P = l => ({ x: vue.ox + l.x * vue.dw, y: vue.oy + l.y * vue.dh });

window.addEventListener('resize', calerVue);
window.addEventListener('orientationchange', () => setTimeout(calerVue, 250));

/* =====================================================================
   3. Chargement du suivi

   Les mains d'abord : ce sont elles qui commandent la page, donc elles
   doivent répondre au plus vite. Le viseur du visage suit, et sa panne
   éventuelle ne coûte qu'un ornement.
   ===================================================================== */

async function chargerSuivi() {
  voyant('mains', 'attente');
  let V, resolveur;
  try {
    V = await import(/* @vite-ignore */ CDN + '/vision_bundle.mjs');
    resolveur = await V.FilesetResolver.forVisionTasks(WASM);
  } catch (err) {
    console.error('MediaPipe indisponible', err);
    voyant('mains', 'off'); voyant('cible', 'off');
    mouchard('SUIVI INDISPONIBLE — MODE VUE SEULE');
    return;
  }

  /* Le délégué GPU est nettement plus rapide, mais il échoue sur
     certains appareils anciens : on retombe alors sur le processeur. */
  const creer = async (Classe, options) => {
    for (const delegate of ['GPU', 'CPU']) {
      try {
        return await Classe.createFromOptions(resolveur, {
          ...options,
          baseOptions:{ ...options.baseOptions, delegate },
        });
      } catch (err) {
        if (delegate === 'CPU') throw err;
        console.warn('Délégué GPU refusé, bascule processeur', err);
      }
    }
  };

  try {
    lmMains = await creer(V.HandLandmarker, {
      baseOptions:{ modelAssetPath:MODELES.mains },
      runningMode:'VIDEO', numHands:1,
      minHandDetectionConfidence:0.5, minTrackingConfidence:0.5,
    });
    voyant('mains', 'on');
    mouchard('BALAYEZ · PINCEZ POUR PARLER');
  } catch (err) { console.error(err); voyant('mains', 'off'); }

  voyant('cible', 'attente');
  try {
    lmVisage = await creer(V.FaceLandmarker, {
      baseOptions:{ modelAssetPath:MODELES.visage },
      runningMode:'VIDEO', numFaces:1,
      outputFaceBlendshapes:false, outputFacialTransformationMatrixes:false,
    });
    voyant('cible', 'on');
  } catch (err) { console.error(err); voyant('cible', 'off'); }
}

/* =====================================================================
   4. La boucle

   Les mains sont analysées à chaque image : une commande gestuelle qui
   réagit une fois sur trois passe pour cassée. Le viseur, lui, se
   contente d'une image sur trois.
   ===================================================================== */

function boucle(t) {
  raf = requestAnimationFrame(boucle);
  if (!etat.marche || cam.readyState < 2 || !cam.videoWidth) return;

  etat.trame++;
  mesurerIps(t || performance.now());
  calerVue();
  ctx.clearRect(0, 0, cv.width, cv.height);

  const maintenant = performance.now();

  if (lmMains) {
    const h = horlogeDetection.mains = Math.max(maintenant, horlogeDetection.mains + 1);
    const r = safe(() => lmMains.detectForVideo(cam, h));
    etat.mains = (r && r.landmarks && r.landmarks[0]) || null;
    if (etat.mains) suivreGeste(etat.mains, maintenant);
  }

  if (lmVisage && etat.cible && etat.trame % 3 === 0) {
    const h = horlogeDetection.visage = Math.max(maintenant, horlogeDetection.visage + 1);
    const r = safe(() => lmVisage.detectForVideo(cam, h));
    const pts = r && r.faceLandmarks && r.faceLandmarks[0];
    if (pts) { etat.visage = lisser(etat.visage, pts, 0.5); etat.perteVisage = 0; }
    else if (++etat.perteVisage > 10) etat.visage = null;
  }

  const accent = PROFILS[etat.profil];
  if (etat.cible && etat.visage) dessinerCible(etat.visage, accent, maintenant);
  if (etat.mains) dessinerMain(etat.mains, accent);
  majReleve();
}

function safe(fn) { try { return fn(); } catch (err) { console.warn(err); return null; } }

/* Lissage exponentiel : chaque repère se rapproche de sa nouvelle
   position au lieu d'y sauter. Sans cela, le viseur tremble. */
function lisser(avant, pts, a) {
  const net = pts.map(p => ({ x:p.x, y:p.y }));
  if (!avant || avant.length !== net.length) return net;
  return net.map((p, i) => ({
    x: avant[i].x + (p.x - avant[i].x) * a,
    y: avant[i].y + (p.y - avant[i].y) * a,
  }));
}

let dernierT = 0;
function mesurerIps(t) {
  if (dernierT) {
    const i = 1000 / Math.max(1, t - dernierT);
    etat.ips = etat.ips ? etat.ips * 0.9 + i * 0.1 : i;
    if (etat.trame % 15 === 0) $('#fps').textContent = Math.round(etat.ips);
  }
  dernierT = t;
}

/* =====================================================================
   5. Le viseur

   Quatre équerres autour du visage, une ligne de balayage qui le
   parcourt, une croix sur le nez. C'est un instrument de mesure, pas
   un déguisement : il ne recouvre rien.
   ===================================================================== */

function dessinerCible(pts, profil, t) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const l of pts) {
    const p = P(l);
    if (p.x < x1) x1 = p.x; if (p.x > x2) x2 = p.x;
    if (p.y < y1) y1 = p.y; if (p.y > y2) y2 = p.y;
  }
  // Un peu d'air autour du visage : une équerre collée au menton se lit mal.
  const mx = (x2 - x1) * 0.14, my = (y2 - y1) * 0.10;
  x1 -= mx; x2 += mx; y1 -= my; y2 += my;

  const l = Math.min((x2 - x1), (y2 - y1)) * 0.26;
  ctx.save();
  ctx.strokeStyle = profil.accent;
  ctx.lineWidth = Math.max(1.4, (x2 - x1) * 0.008);
  ctx.globalAlpha = 0.9;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x1, y1 + l); ctx.lineTo(x1, y1); ctx.lineTo(x1 + l, y1);
  ctx.moveTo(x2 - l, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + l);
  ctx.moveTo(x2, y2 - l); ctx.lineTo(x2, y2); ctx.lineTo(x2 - l, y2);
  ctx.moveTo(x1 + l, y2); ctx.lineTo(x1, y2); ctx.lineTo(x1, y2 - l);
  ctx.stroke();

  // Ligne de balayage : elle descend puis remonte, en boucle.
  const cycle = (t % 2600) / 2600;
  const y = y1 + (y2 - y1) * (cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2);
  const g = ctx.createLinearGradient(x1, 0, x2, 0);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.5, profil.accent);
  g.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = g;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x1, y); ctx.lineTo(x2, y);
  ctx.stroke();

  // Croix sur l'arête du nez
  const n = P(pts[NEZ]);
  const c = (x2 - x1) * 0.05;
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = profil.accent;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(n.x - c, n.y); ctx.lineTo(n.x + c, n.y);
  ctx.moveTo(n.x, n.y - c); ctx.lineTo(n.x, n.y + c);
  ctx.stroke();
  ctx.restore();
}

/* =====================================================================
   6. La main en filaire

   Le squelette entier est tracé, parce que c'est lui qui rend le
   contrôle lisible : on voit ce que la machine voit, donc on comprend
   pourquoi un geste passe ou ne passe pas.
   ===================================================================== */

function dessinerMain(main, profil) {
  const pts = main.map(P);
  const echelle = Math.max(12, dist(pts[POIGNET], pts[PAUME]));

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Halo : un second tracé large et transparent sous le trait net.
  for (const [alpha, largeur] of [[0.18, echelle * 0.22], [0.95, Math.max(1.6, echelle * 0.05)]]) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = profil.accent;
    ctx.lineWidth = largeur;
    ctx.beginPath();
    for (const doigt of DOIGTS) {
      ctx.moveTo(pts[doigt[0]].x, pts[doigt[0]].y);
      for (let i = 1; i < doigt.length; i++) ctx.lineTo(pts[doigt[i]].x, pts[doigt[i]].y);
    }
    ctx.stroke();
  }

  // Articulations
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = profil.accent;
  for (let i = 0; i < pts.length; i++) {
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, BOUTS.includes(i) ? echelle * 0.09 : echelle * 0.055, 0, Math.PI * 2);
    ctx.fill();
  }

  // Le pincement : le trait pouce-index se resserre et s'allume.
  const serre = pincement(main);
  ctx.globalAlpha = 0.35 + serre * 0.6;
  ctx.strokeStyle = serre > 0.6 ? '#ffffff' : profil.accent;
  ctx.lineWidth = Math.max(1.2, echelle * 0.04);
  ctx.setLineDash([echelle * 0.14, echelle * 0.12]);
  ctx.beginPath();
  ctx.moveTo(pts[POUCE].x, pts[POUCE].y);
  ctx.lineTo(pts[INDEX].x, pts[INDEX].y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Viseur sur l'index : le doigt qui commande
  const p = pts[INDEX];
  const r = echelle * 0.42;
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = profil.accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.moveTo(p.x - r * 1.5, p.y); ctx.lineTo(p.x - r * 1.15, p.y);
  ctx.moveTo(p.x + r * 1.15, p.y); ctx.lineTo(p.x + r * 1.5, p.y);
  ctx.moveTo(p.x, p.y - r * 1.5); ctx.lineTo(p.x, p.y - r * 1.15);
  ctx.moveTo(p.x, p.y + r * 1.15); ctx.lineTo(p.x, p.y + r * 1.5);
  ctx.stroke();

  ctx.restore();
}

/* =====================================================================
   7. Les gestes

   Deux commandes, et deux seulement : on ne pilote pas une page à
   l'aveugle avec un vocabulaire de gestes qu'il faudrait apprendre.

   — Balayer, franc et horizontal : profil suivant ou précédent.
   — Pincer pouce et index : ouvrir le micro d'IRIS.
   ===================================================================== */

const trace = [];
let dernierGeste = 0, pinceAvant = false, dernierPince = 0;

/* Le serrage, rapporté à la taille de la main : sinon un pincement
   détecté de près ne le serait plus de loin. 0 = ouvert, 1 = fermé. */
function pincement(main) {
  const taille = Math.max(1e-4, dist(main[POIGNET], main[PAUME]));
  const rapport = dist(main[POUCE], main[INDEX]) / taille;
  return Math.max(0, Math.min(1, (0.85 - rapport) / 0.55));
}

function suivreGeste(main, t) {
  // --- Pincement : au front montant seulement, pour ne pas rouvrir le
  // micro tant que les doigts restent joints.
  const serre = pincement(main) > 0.72;
  if (serre && !pinceAvant && t - dernierPince > 1500) {
    dernierPince = t;
    basculerMicro();
    if (navigator.vibrate) navigator.vibrate(24);
  }
  pinceAvant = serre;

  // --- Balayage : trajectoire du centre de la paume sur 700 ms.
  const paume = [0, 5, 9, 13, 17].reduce((acc, i) => {
    acc.x += main[i].x / 5; acc.y += main[i].y / 5; return acc;
  }, { x:0, y:0 });

  trace.push({ x:paume.x, y:paume.y, t });
  while (trace.length && t - trace[0].t > 700) trace.shift();
  if (trace.length < 4 || t - dernierGeste < 1100) return;

  const a = trace[0], b = trace[trace.length - 1];
  const dx = b.x - a.x, dy = b.y - a.y;
  if (Math.abs(dx) < 0.20 || Math.abs(dx) < Math.abs(dy) * 1.8) return;

  dernierGeste = t;
  trace.length = 0;
  // L'image est en miroir : un x croissant dans la vidéo est un
  // déplacement vers la gauche de l'écran.
  changerProfil(dx > 0 ? -1 : +1);
  if (navigator.vibrate) navigator.vibrate(18);
}

/* =====================================================================
   8. Les profils, côté interface
   ===================================================================== */

function construirePastilles() {
  const boite = $('#pastilles');
  boite.innerHTML = '';
  PROFILS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', p.nom);
    b.style.background = p.accent;
    b.style.color = p.accent;
    b.addEventListener('click', () => appliquerProfil(i));
    boite.appendChild(b);
  });
}

function changerProfil(pas) {
  appliquerProfil((etat.profil + pas + PROFILS.length) % PROFILS.length);
}

/* Un seul point d'entrée pour la couleur : on pose deux variables CSS
   et toute l'interface suit, filets et panneaux compris. */
function appliquerProfil(i) {
  etat.profil = i;
  const p = PROFILS[i];
  document.documentElement.style.setProperty('--accent', p.accent);
  document.documentElement.style.setProperty('--accent-rgb', p.rgb);
  $('#profil-nom').textContent = p.nom;
  $$('#pastilles button').forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  mouchard('PROFIL · ' + p.nom);
}

/* =====================================================================
   9. Horloge, météo, relevés, voyants
   ===================================================================== */

function demarrerHorloge() {
  const dateFmt = new Intl.DateTimeFormat('fr-FR', { weekday:'long', day:'numeric', month:'long' });
  const tic = () => {
    const d = new Date();
    $('#heure').textContent = d.toLocaleTimeString('fr-FR', { hour12:false });
    $('#date').textContent = dateFmt.format(d);
  };
  tic();
  setInterval(tic, 500);

  if (navigator.getBattery) {
    navigator.getBattery().then(b => {
      const maj = () => { $('#batterie').textContent = Math.round(b.level * 100) + '%' + (b.charging ? ' ⚡' : ''); };
      maj();
      b.addEventListener('levelchange', maj);
      b.addEventListener('chargingchange', maj);
    }).catch(() => {});
  } else {
    $('#batterie').textContent = '—';
  }
}

/* Le relevé du viseur : inclinaison de la tête, et une distance
   approchée. L'estimation part d'un écart entre les yeux de 6,3 cm —
   la moyenne adulte — et d'une focale déduite de la largeur d'image.
   C'est un ordre de grandeur affiché comme tel, pas une mesure. */
function majReleve() {
  if (etat.trame % 10) return;
  const el = $('#cible');
  if (!el) return;

  if (!etat.cible || !etat.visage) {
    el.textContent = 'CIBLE — AUCUNE';
    return;
  }
  const g = centre(etat.visage, OEIL_G), d = centre(etat.visage, OEIL_D);
  const ecart = Math.max(1, dist(g, d));
  const angle = Math.round(Math.atan2(d.y - g.y, d.x - g.x) * 180 / Math.PI);
  const cm = Math.round((6.3 * vue.dw * 1.15 / ecart) / 5) * 5;
  el.textContent = `CIBLE ${angle > 0 ? '+' : ''}${angle}° · ≈${cm} CM`;
}

const centre = (pts, idx) => {
  let x = 0, y = 0;
  for (const i of idx) { const p = P(pts[i]); x += p.x; y += p.y; }
  return { x:x / idx.length, y:y / idx.length };
};

async function chargerMeteo() {
  const pos = await positionner();
  const q = pos ? `?lat=${pos.lat.toFixed(4)}&lon=${pos.lon.toFixed(4)}` : '';
  try {
    const rep = await fetch('/api/meteo' + q, { headers:{ accept:'application/json' } });
    const d = await rep.json();
    if (!d.ok) throw new Error(d.code || 'météo');
    etat.meteo = d;
    afficherMeteo(d);
  } catch (err) {
    console.warn('Météo indisponible', err);
    $('#meteo-libelle').textContent = 'Atmosphère hors ligne';
  }
}

/* La géolocalisation du navigateur est plus précise que l'adresse IP,
   mais elle demande une autorisation. On la tente sans jamais bloquer :
   passé cinq secondes, la route serveur se débrouillera avec l'IP. */
function positionner() {
  return new Promise(ok => {
    if (!navigator.geolocation) return ok(null);
    let fini = false;
    const fin = v => { if (!fini) { fini = true; ok(v); } };
    setTimeout(() => fin(null), 5200);
    navigator.geolocation.getCurrentPosition(
      p => fin({ lat:p.coords.latitude, lon:p.coords.longitude }),
      () => fin(null),
      { enableHighAccuracy:false, timeout:5000, maximumAge:600000 }
    );
  });
}

const ICONES = {
  'soleil':'<circle cx="32" cy="32" r="12"/><path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M20 44l-6 6"/>',
  'nuage':'<path d="M20 46h24a10 10 0 0 0 1-20 14 14 0 0 0-26-4 9 9 0 0 0 1 24Z"/>',
  'nuage-soleil':'<circle cx="22" cy="20" r="7"/><path d="M22 6v4M8 20h4M12 10l3 3"/><path d="M26 50h20a9 9 0 0 0 1-18 12 12 0 0 0-23-3 8 8 0 0 0 2 21Z"/>',
  'pluie':'<path d="M20 40h24a10 10 0 0 0 1-20 14 14 0 0 0-26-4 9 9 0 0 0 1 24Z"/><path d="M22 47l-3 8M32 47l-3 8M42 47l-3 8"/>',
  'neige':'<path d="M20 38h24a10 10 0 0 0 1-20 14 14 0 0 0-26-4 9 9 0 0 0 1 24Z"/><path d="M22 48h.01M32 52h.01M42 48h.01M27 55h.01M37 55h.01"/>',
  'orage':'<path d="M20 38h24a10 10 0 0 0 1-20 14 14 0 0 0-26-4 9 9 0 0 0 1 24Z"/><path d="M34 42l-8 10h7l-3 8"/>',
  'brume':'<path d="M10 24h44M14 34h36M18 44h28M24 54h20"/>',
};

function afficherMeteo(d) {
  $('#meteo-temp').textContent = d.temp;
  $('#meteo-libelle').textContent = d.libelle;
  $('#meteo-lieu').textContent = d.pays ? `${d.ville} · ${d.pays}` : d.ville;
  $('#meteo-ressenti').textContent = d.ressenti + '°';
  $('#meteo-vent').textContent = d.vent + ' km/h';
  $('#meteo-hum').textContent = d.humidite + '%';
  $('#meteo-minmax').textContent = (d.min ?? '--') + '/' + (d.max ?? '--') + '°';
  $('#meteo-icone').innerHTML = ICONES[d.icone] || ICONES['nuage'];
}

function voyant(nom, mode) {
  const el = document.querySelector(`[data-voyant="${nom}"]`);
  if (!el) return;
  el.classList.toggle('on', mode === 'on');
  el.classList.toggle('attente', mode === 'attente');
}

let mouchardTimer = 0;
function mouchard(texte) {
  const el = $('#mouchard');
  el.textContent = texte;
  el.classList.add('vu');
  clearTimeout(mouchardTimer);
  mouchardTimer = setTimeout(() => el.classList.remove('vu'), 2000);
}

/* =====================================================================
   10. IRIS

   Reconnaissance vocale du navigateur → /api/iris → synthèse vocale.
   Les trois maillons peuvent manquer indépendamment : sans micro on
   tape, sans liaison on répond localement, sans synthèse on lit.
   ===================================================================== */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let reco = null, bulleEcoute = null, voix = null;

function deverrouillerVoix() {
  if (!('speechSynthesis' in window)) return;
  try {
    // Une phrase muette prononcée pendant le geste de l'utilisateur :
    // sans elle, iOS refuse toute synthèse ultérieure de la session.
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
    choisirVoix();
    speechSynthesis.addEventListener('voiceschanged', choisirVoix);
  } catch { /* la synthèse restera muette, le texte reste lisible */ }
}

function choisirVoix() {
  const dispo = speechSynthesis.getVoices() || [];
  voix = dispo.find(v => /fr[-_]FR/i.test(v.lang) && /thomas|daniel|amelie|amélie|google/i.test(v.name))
      || dispo.find(v => /^fr/i.test(v.lang))
      || null;
}

function parler(texte) {
  if (!('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    u.rate = 1.06;
    u.pitch = 0.82;          // légèrement grave : une voix d'appareil, pas de présentateur
    if (voix) u.voice = voix;
    // On coupe le micro pendant qu'IRIS parle : sans cela la
    // reconnaissance s'entend elle-même et se répond.
    u.onstart = arreterEcoute;
    speechSynthesis.speak(u);
  } catch (err) { console.warn('Synthèse indisponible', err); }
}

function bulle(classe, texte) {
  const fil = $('#fil');
  const p = document.createElement('p');
  p.className = 'bulle ' + classe;
  p.textContent = texte;
  fil.appendChild(p);
  while (fil.children.length > 6) fil.removeChild(fil.firstChild);
  return p;
}

function direIris(texte, aVoixHaute = true) {
  bulle('iris', texte);
  if (aVoixHaute) parler(texte);
}

/* --- Le micro --------------------------------------------------------- */

if (SR) {
  reco = new SR();
  reco.lang = 'fr-FR';
  reco.interimResults = true;
  reco.continuous = false;
  reco.maxAlternatives = 1;

  reco.onstart = () => {
    etat.ecoute = true;
    $('#micro').classList.add('actif');
    bulleEcoute = bulle('ecoute', 'À l’écoute…');
  };

  reco.onresult = e => {
    let provisoire = '', definitif = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) definitif += t; else provisoire += t;
    }
    if (bulleEcoute) bulleEcoute.textContent = (definitif || provisoire || 'À l’écoute…').trim();
    if (definitif.trim()) {
      if (bulleEcoute) { bulleEcoute.remove(); bulleEcoute = null; }
      demander(definitif.trim());
    }
  };

  reco.onerror = e => {
    if (bulleEcoute) { bulleEcoute.remove(); bulleEcoute = null; }
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      bulle('souci', "Micro refusé. Autorisez-le dans les réglages, ou tapez votre message.");
    } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
      bulle('souci', 'Micro indisponible (' + e.error + '). Tapez votre message.');
    }
  };

  reco.onend = () => {
    etat.ecoute = false;
    $('#micro').classList.remove('actif');
    if (bulleEcoute) { bulleEcoute.remove(); bulleEcoute = null; }
  };
} else {
  $('#micro').disabled = true;
  $('#texte').placeholder = 'Écrire à IRIS…';
}

function arreterEcoute() { if (reco && etat.ecoute) { try { reco.stop(); } catch {} } }

/* Un seul chemin pour ouvrir ou fermer le micro, que l'ordre vienne du
   bouton ou du pincement. */
function basculerMicro() {
  if (!reco) return mouchard('MICRO INDISPONIBLE');
  if (etat.ecoute) return arreterEcoute();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  try { reco.start(); } catch { /* déjà démarrée */ }
}

$('#micro').addEventListener('click', basculerMicro);

$('#saisie').addEventListener('submit', e => {
  e.preventDefault();
  const champ = $('#texte');
  const t = champ.value.trim();
  if (!t) return;
  champ.value = '';
  champ.blur();
  demander(t);
});

/* --- L'aller-retour --------------------------------------------------- */

async function demander(question) {
  if (etat.attend) return;
  bulle('moi', question);
  historique.push({ role:'user', content:question });

  etat.attend = true;
  voyant('liaison', 'attente');
  const attente = bulle('iris', '…');

  try {
    const rep = await fetch('/api/iris', {
      method:'POST',
      headers:{ 'content-type':'application/json' },
      body:JSON.stringify({ messages:historique.slice(-12), contexte:contexte() }),
    });
    const d = await rep.json();
    if (!d.ok) throw new Error(d.code || 'liaison');

    attente.textContent = d.texte;
    historique.push({ role:'assistant', content:d.texte });
    parler(d.texte);
    voyant('liaison', 'on');
  } catch (err) {
    console.warn('IRIS injoignable', err);
    voyant('liaison', 'off');
    const secours = horsLigne(question);
    attente.textContent = secours;
    attente.classList.add('souci');
    // On ne garde pas les réponses de secours dans l'historique : elles
    // ne viennent pas d'IRIS et fausseraient la suite de la conversation.
    parler(secours);
  } finally {
    etat.attend = false;
  }
}

function contexte() {
  const d = new Date();
  const m = etat.meteo;
  return {
    heure: d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
    date: d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    ville: m ? (m.pays ? `${m.ville}, ${m.pays}` : m.ville) : '',
    meteo: m ? `${m.libelle}, ${m.temp} °C (ressenti ${m.ressenti} °C), vent ${m.vent} km/h, humidité ${m.humidite} %, min ${m.min} °C / max ${m.max} °C` : '',
    profil: PROFILS[etat.profil].nom,
  };
}

/* Le cerveau de secours. Il ne comprend rien : il reconnaît quelques
   mots et lit les capteurs. C'est assez pour que l'interface ne
   devienne jamais complètement muette. */
function horsLigne(q) {
  const t = q.toLowerCase();
  const m = etat.meteo;
  const d = new Date();

  if (/heure|quelle heure|il est/.test(t)) {
    return `Il est ${d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}.`;
  }
  if (/météo|meteo|temps|degré|degre|pleut|pluie|froid|chaud|vent/.test(t)) {
    return m ? `${m.libelle} sur ${m.ville}, ${m.temp} degrés, vent à ${m.vent} kilomètres-heure.`
             : "Capteurs atmosphériques hors ligne.";
  }
  if (/où|ou suis|position|ville|endroit/.test(t)) {
    return m ? `Position approximative : ${m.ville}.` : "Position indéterminée.";
  }
  if (/profil|couleur|interface|thème|theme/.test(t)) {
    return `Profil ${PROFILS[etat.profil].nom}. Balayez la main pour en changer.`;
  }
  return "Liaison avec IRIS coupée. Je garde l'heure, la météo et les profils.";
}

/* =====================================================================
   11. Barre d'outils
   ===================================================================== */

$$('.outils button').forEach(b => b.addEventListener('click', async () => {
  switch (b.dataset.outil) {
    case 'profil-prec': changerProfil(-1); break;
    case 'profil-suiv': changerProfil(+1); break;

    case 'cible':
      etat.cible = !etat.cible;
      b.setAttribute('aria-pressed', String(etat.cible));
      if (!etat.cible) etat.visage = null;
      mouchard(etat.cible ? 'VISEUR ACTIF' : 'VISEUR COUPÉ');
      break;

    case 'camera':
      etat.facing = etat.facing === 'user' ? 'environment' : 'user';
      etat.visage = null;
      try { await ouvrirCamera(etat.facing); }
      catch (err) { console.error(err); mouchard('CAMÉRA INDISPONIBLE'); }
      mouchard(etat.facing === 'user' ? 'CAMÉRA FRONTALE' : 'CAMÉRA ARRIÈRE');
      break;

    case 'quitter':
      etat.marche = false;
      cancelAnimationFrame(raf);
      if (cam.srcObject) cam.srcObject.getTracks().forEach(t => t.stop());
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      arreterEcoute();
      location.href = 'index.html';
      break;
  }
}));

/* Onglet quitté : on relâche la caméra et on coupe la voix. Une page
   qui continue de filmer en arrière-plan serait indéfendable. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    arreterEcoute();
  }
});
