/* =========================================================
   MJ AGENCY — MASQUE
   Interface embarquée : suivi du visage et du corps, tenues
   changées au geste, météo réelle, et IRIS au bout du micro.

   Tout se calcule dans le navigateur. Les images de la caméra ne
   quittent jamais l'appareil : seuls les mots dictés partent vers
   /api/iris, le temps d'obtenir une réponse.

   Le suivi vient de MediaPipe Tasks Vision, chargé depuis un CDN.
   S'il ne se charge pas, la page reste utilisable : caméra, heure,
   météo et conversation continuent de fonctionner.

   Repères du visage : le maillage MediaPipe numérote 478 points.
   Ceux utilisés ici sont nommés en tête de fichier plutôt que
   dispersés dans le code — ce sont des constantes du modèle, pas
   des choix de dessin.
   ========================================================= */

const CDN  = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22';
const WASM = CDN + '/wasm';
const MODELES = {
  visage: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  mains:  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  corps:  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
};

/* Le contour du visage, dans l'ordre du tour — c'est la boucle
   FACE_OVAL de MediaPipe, écrite à plat. */
const OVALE = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,
               378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,
               162,21,54,103,67,109];

const OEIL_G = [33,133,159,145,160,144,158,153];
const OEIL_D = [362,263,386,374,385,380,387,373];
const MENTON = 152, FRONT = 10, JOUE_G = 234, JOUE_D = 454;

/* Repères du corps, sur les 33 points de PoseLandmarker. */
const C = {
  nez:0, epauleG:11, epauleD:12, coudeG:13, coudeD:14, poignetG:15, poignetD:16,
  hancheG:23, hancheD:24, genouG:25, genouD:26, chevilleG:27, chevilleD:28,
};

/* ---------------------------------------------------------------------
   Les tenues

   Dessinées, jamais photographiées : chaque tenue n'est qu'un jeu de
   couleurs appliqué au même tracé. En ajouter une revient à ajouter
   une ligne ici.
   --------------------------------------------------------------------- */
const TENUES = [
  {
    id:'ecarlate', libelle:'#ff2b3d', nom:'ÉCARLATE',
    masque:'#c8102e', masqueOmbre:'#75081a', toile:'#170103',
    lentille:'#ffffff', lentilleOmbre:'#b8c6d8', cerne:'#08080a',
    torse:'#c8102e', torseOmbre:'#7d0a1d', bras:'#c8102e',
    jambes:'#141b4d', jambesOmbre:'#080d29', gants:'#c8102e', emblem:'#0a0a0c',
  },
  {
    id:'nuit', libelle:'#e8ecf5', nom:'NUIT',
    masque:'#15161b', masqueOmbre:'#050507', toile:'#33363f',
    lentille:'#ffffff', lentilleOmbre:'#9aa6b8', cerne:'#000000',
    torse:'#15161b', torseOmbre:'#050507', bras:'#15161b',
    jambes:'#0d0e12', jambesOmbre:'#000000', gants:'#25272f', emblem:'#e8ecf5',
  },
  {
    id:'sang', libelle:'#ff5a68', nom:'SANG & NUIT',
    masque:'#8c0f1e', masqueOmbre:'#3d040c', toile:'#0a0a0c',
    lentille:'#ff5a68', lentilleOmbre:'#8c0f1e', cerne:'#000000',
    torse:'#101015', torseOmbre:'#030304', bras:'#101015',
    jambes:'#101015', jambesOmbre:'#030304', gants:'#8c0f1e', emblem:'#8c0f1e',
  },
  {
    id:'spectre', libelle:'#e9edf5', nom:'SPECTRE',
    masque:'#e9edf5', masqueOmbre:'#9aa3b5', toile:'#5c6478',
    lentille:'#10131a', lentilleOmbre:'#000000', cerne:'#e9edf5',
    torse:'#e9edf5', torseOmbre:'#a8b0c0', bras:'#e9edf5',
    jambes:'#c9cfdb', jambesOmbre:'#8d95a6', gants:'#10131a', emblem:'#10131a',
  },
];

/* ---------------------------------------------------------------------
   Outils
   --------------------------------------------------------------------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const milieu = (a, b) => ({ x:(a.x + b.x) / 2, y:(a.y + b.y) / 2 });

const cam = $('#cam');
const cv  = $('#ar');
const ctx = cv.getContext('2d');

const etat = {
  marche:false, facing:'user', corps:true,
  tenue:0, trame:0, ips:0,
  visage:null, mains:null, pose:null,
  perteVisage:99, pertePose:99,
  meteo:null, ecoute:false, attend:false,
};

const historique = [];      // le fil de la conversation avec IRIS
const vue = { ox:0, oy:0, dw:0, dh:0, w:0, h:0 };

let lmVisage = null, lmMains = null, lmCorps = null;
const horlogeDetection = { visage:0, mains:0, corps:0 };
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
  appliquerTenue(0);
  boucle();
  chargerSuivi();

  setTimeout(() => direIris("Masque en ligne. Je vous écoute quand vous voulez.", false), 900);
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
   calcul, le masque se poserait à côté du visage sur tout écran dont le
   rapport diffère de celui de la caméra. */
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

   Les trois modèles pèsent une quinzaine de mégaoctets à eux tous. On
   les charge l'un après l'autre, dans l'ordre de l'utilité : le visage
   d'abord — c'est lui qui fait apparaître le masque — puis les mains,
   puis le corps. L'interface est utilisable dès le premier.
   ===================================================================== */

async function chargerSuivi() {
  voyant('visage', 'attente');
  let V, resolveur;
  try {
    V = await import(/* @vite-ignore */ CDN + '/vision_bundle.mjs');
    resolveur = await V.FilesetResolver.forVisionTasks(WASM);
  } catch (err) {
    console.error('MediaPipe indisponible', err);
    voyant('visage', 'off'); voyant('mains', 'off'); voyant('corps', 'off');
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
    lmVisage = await creer(V.FaceLandmarker, {
      baseOptions:{ modelAssetPath:MODELES.visage },
      runningMode:'VIDEO', numFaces:1,
      outputFaceBlendshapes:false, outputFacialTransformationMatrixes:false,
    });
    voyant('visage', 'on');
  } catch (err) { console.error(err); voyant('visage', 'off'); }

  voyant('mains', 'attente');
  try {
    lmMains = await creer(V.HandLandmarker, {
      baseOptions:{ modelAssetPath:MODELES.mains },
      runningMode:'VIDEO', numHands:1,
      minHandDetectionConfidence:0.5, minTrackingConfidence:0.5,
    });
    voyant('mains', 'on');
    mouchard('BALAYEZ LA MAIN POUR CHANGER DE TENUE');
  } catch (err) { console.error(err); voyant('mains', 'off'); }

  voyant('corps', 'attente');
  try {
    lmCorps = await creer(V.PoseLandmarker, {
      baseOptions:{ modelAssetPath:MODELES.corps },
      runningMode:'VIDEO', numPoses:1,
      minPoseDetectionConfidence:0.5, minTrackingConfidence:0.5,
    });
    voyant('corps', 'on');
  } catch (err) { console.error(err); voyant('corps', 'off'); }
}

/* =====================================================================
   4. La boucle

   Le visage est analysé à chaque image — c'est lui qu'on regarde. Les
   mains une image sur trois, le corps une sur quatre : leurs modèles
   sont lourds et leurs mouvements lents. Entre deux analyses, le
   lissage exponentiel garde le tracé fluide.
   ===================================================================== */

function boucle(t) {
  raf = requestAnimationFrame(boucle);
  if (!etat.marche || cam.readyState < 2 || !cam.videoWidth) return;

  etat.trame++;
  mesurerIps(t || performance.now());
  calerVue();
  ctx.clearRect(0, 0, cv.width, cv.height);

  const maintenant = performance.now();

  if (lmVisage) {
    const h = horlogeDetection.visage = Math.max(maintenant, horlogeDetection.visage + 1);
    const r = safe(() => lmVisage.detectForVideo(cam, h));
    const pts = r && r.faceLandmarks && r.faceLandmarks[0];
    if (pts) { etat.visage = lisser(etat.visage, pts, 0.55); etat.perteVisage = 0; }
    else if (++etat.perteVisage > 10) etat.visage = null;
  }

  if (lmMains && etat.trame % 3 === 0) {
    const h = horlogeDetection.mains = Math.max(maintenant, horlogeDetection.mains + 1);
    const r = safe(() => lmMains.detectForVideo(cam, h));
    etat.mains = (r && r.landmarks && r.landmarks[0]) || null;
    if (etat.mains) suivreGeste(etat.mains, maintenant);
  }

  if (lmCorps && etat.corps && etat.trame % 4 === 0) {
    const h = horlogeDetection.corps = Math.max(maintenant, horlogeDetection.corps + 1);
    const r = safe(() => lmCorps.detectForVideo(cam, h));
    const pts = r && r.landmarks && r.landmarks[0];
    if (pts) {
      // Certaines versions du modèle ne renseignent pas la visibilité et
      // renvoient zéro partout. On ne peut alors pas s'en servir pour
      // filtrer : mieux vaut tout considérer visible que ne rien dessiner.
      const vMax = pts.reduce((m, p) => Math.max(m, p.visibility === undefined ? 1 : p.visibility), 0);
      const net = vMax > 0.02 ? pts : pts.map(p => ({ x:p.x, y:p.y, visibility:1 }));
      etat.pose = lisser(etat.pose, net, 0.4);
      etat.pertePose = 0;
    }
    else if (++etat.pertePose > 12) etat.pose = null;
  }

  const T = TENUES[etat.tenue];
  if (etat.corps && etat.pose) dessinerTenue(etat.pose, T);
  if (etat.visage) dessinerMasque(etat.visage, T);
  if (etat.mains) dessinerMain(etat.mains);
}

function safe(fn) { try { return fn(); } catch (err) { console.warn(err); return null; } }

/* Lissage exponentiel : chaque repère se rapproche de sa nouvelle
   position au lieu d'y sauter. Sans cela, le masque tremble. */
function lisser(avant, pts, a) {
  const net = pts.map(p => ({ x:p.x, y:p.y, v:p.visibility === undefined ? 1 : p.visibility }));
  if (!avant || avant.length !== net.length) return net;
  return net.map((p, i) => ({
    x: avant[i].x + (p.x - avant[i].x) * a,
    y: avant[i].y + (p.y - avant[i].y) * a,
    v: avant[i].v + (p.v - avant[i].v) * a,
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
   5. Le masque

   Le maillage donne le contour du visage, qui s'arrête à la naissance
   des cheveux. Un masque, lui, couvre le crâne : on travaille donc
   dans le repère penché de la tête — un axe entre les yeux, un axe
   menton-front — et on étire le contour vers le haut. Passer par ce
   repère plutôt que par les axes de l'écran est ce qui permet au
   masque de suivre une tête inclinée.
   ===================================================================== */

function reperesTete(pts) {
  const g = moyenne(pts, OEIL_G), d = moyenne(pts, OEIL_D);
  const ecart = Math.max(1, dist(g, d));
  const droite = { x:(d.x - g.x) / ecart, y:(d.y - g.y) / ecart };
  const haut = { x:droite.y, y:-droite.x };              // perpendiculaire, vers le haut
  const front = P(pts[FRONT]), menton = P(pts[MENTON]);

  // Garde-fou : l'axe vertical doit pointer du menton vers le front. Sans
  // cette vérification, une tête très inclinée retournerait le masque.
  if ((front.x - menton.x) * haut.x + (front.y - menton.y) * haut.y < 0) {
    haut.x = -haut.x; haut.y = -haut.y;
  }

  return {
    oeilG:g, oeilD:d, ecart, droite, haut,
    centre:{ x:(front.x + menton.x) / 2, y:(front.y + menton.y) / 2 },
    hauteur:Math.max(1, dist(front, menton)),
    largeur:Math.max(1, dist(P(pts[JOUE_G]), P(pts[JOUE_D]))),
    angle:Math.atan2(droite.y, droite.x),
  };
}

const moyenne = (pts, idx) => {
  let x = 0, y = 0;
  for (const i of idx) { const p = P(pts[i]); x += p.x; y += p.y; }
  return { x:x / idx.length, y:y / idx.length };
};

function dessinerMasque(pts, T) {
  const R = reperesTete(pts);

  // Contour dilaté : plus large sur les côtés, beaucoup plus haut sur
  // le crâne, à peine sous le menton.
  const contour = OVALE.map(i => {
    const p = P(pts[i]);
    const dx = p.x - R.centre.x, dy = p.y - R.centre.y;
    const u = dx * R.droite.x + dy * R.droite.y;
    const v = dx * R.haut.x + dy * R.haut.y;
    const u2 = u * 1.13;
    const v2 = v * (v > 0 ? 1.46 : 1.07);
    return {
      x: R.centre.x + R.droite.x * u2 + R.haut.x * v2,
      y: R.centre.y + R.droite.y * u2 + R.haut.y * v2,
    };
  });

  ctx.save();
  cheminLisse(contour);

  // Le tissu : plus clair là où la lumière tomberait, sombre sur les bords.
  const g = ctx.createRadialGradient(
    R.centre.x - R.droite.x * R.largeur * 0.18, R.centre.y - R.hauteur * 0.28, R.largeur * 0.12,
    R.centre.x, R.centre.y, R.largeur * 0.95
  );
  g.addColorStop(0, T.masque);
  g.addColorStop(0.62, T.masque);
  g.addColorStop(1, T.masqueOmbre);
  ctx.fillStyle = g;
  ctx.fill();

  // La toile, contenue dans le masque
  ctx.clip();
  dessinerToile(R.centre, R.haut, R.hauteur * 1.55, R.angle, T.toile, R.largeur * 0.0075, R.hauteur * 0.26);
  ctx.restore();

  // Liseré de contour : sans lui le masque flotte sur l'image.
  ctx.save();
  cheminLisse(contour);
  ctx.strokeStyle = T.masqueOmbre;
  ctx.lineWidth = Math.max(1, R.largeur * 0.02);
  ctx.globalAlpha = 0.75;
  ctx.stroke();
  ctx.restore();

  dessinerLentille(R, T, +1);   // œil côté image gauche
  dessinerLentille(R, T, -1);
}

/* Toile d'araignée : des rayons partant d'un point, et des anneaux
   entre eux. Le tout est tracé en coordonnées de la tête, donc suit
   son inclinaison. */
function dessinerToile(centre, haut, rayon, angle, couleur, trait, decalage) {
  const o = { x:centre.x + haut.x * decalage, y:centre.y + haut.y * decalage };
  ctx.strokeStyle = couleur;
  ctx.lineWidth = Math.max(0.6, trait);
  ctx.globalAlpha = 0.65;
  ctx.lineCap = 'round';

  ctx.beginPath();
  for (let i = 0; i < 18; i++) {
    const a = angle + (i / 18) * Math.PI * 2;
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x + Math.cos(a) * rayon, o.y + Math.sin(a) * rayon);
  }
  ctx.stroke();

  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  for (let k = 1; k <= 10; k++) {
    const r = rayon * (k / 10) * 0.96;
    ctx.ellipse(o.x, o.y, r, r * 0.9, angle, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/* Les lentilles : deux amandes surdimensionnées, cernées de noir.
   `sens` vaut +1 pour l'œil situé à gauche dans l'image, -1 pour
   l'autre ; il retourne le tracé pour que la pointe reste du côté du nez. */
function dessinerLentille(R, T, sens) {
  const base = sens > 0 ? R.oeilG : R.oeilD;
  // Demi-largeur et demi-hauteur. Le tracé s'étend d'environ -1 à +1,1 :
  // au-delà de la moitié de l'écart inter-oculaire, les deux lentilles
  // se chevauchent au-dessus du nez.
  const l = R.ecart * 0.50, h = R.ecart * 0.30;

  // On pousse la lentille vers l'extérieur et légèrement vers le haut :
  // c'est ce décalage qui donne le regard, plutôt que le calque d'un œil.
  const cx = base.x - R.droite.x * sens * R.ecart * 0.10 - R.haut.x * R.ecart * 0.05;
  const cy = base.y - R.droite.y * sens * R.ecart * 0.10 - R.haut.y * R.ecart * 0.05;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(R.angle);
  ctx.scale(-sens * l, h);      // -sens : la pointe pointe vers le nez

  const forme = () => {
    ctx.beginPath();
    ctx.moveTo(-1, 0.05);
    ctx.bezierCurveTo(-0.55, -0.95, 0.45, -1.0, 0.92, -0.35);
    ctx.bezierCurveTo(1.12, 0.05, 0.85, 0.85, 0.15, 0.95);
    ctx.bezierCurveTo(-0.35, 0.95, -0.85, 0.5, -1, 0.05);
    ctx.closePath();
  };

  forme();
  ctx.fillStyle = T.lentille;
  ctx.fill();

  // Dégradé interne : la lentille paraît bombée, pas collée.
  const g = ctx.createLinearGradient(0, -1, 0, 1);
  g.addColorStop(0, 'rgba(255,255,255,.55)');
  g.addColorStop(0.45, 'rgba(255,255,255,0)');
  g.addColorStop(1, T.lentilleOmbre);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = g;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();

  // Le cerne, tracé hors de l'échelle déformée pour garder une épaisseur
  // constante — sans quoi il serait ovalisé comme la lentille.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(R.angle);
  ctx.scale(-sens * l, h);
  ctx.beginPath();
  ctx.moveTo(-1, 0.05);
  ctx.bezierCurveTo(-0.55, -0.95, 0.45, -1.0, 0.92, -0.35);
  ctx.bezierCurveTo(1.12, 0.05, 0.85, 0.85, 0.15, 0.95);
  ctx.bezierCurveTo(-0.35, 0.95, -0.85, 0.5, -1, 0.05);
  ctx.closePath();
  ctx.restore();
  ctx.lineWidth = Math.max(1.5, R.ecart * 0.048);
  ctx.strokeStyle = T.cerne;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/* Tracé fermé et adouci : on passe par les milieux de segments, ce qui
   arrondit un polygone de 36 points sans le déformer. */
function cheminLisse(pts) {
  const n = pts.length;
  ctx.beginPath();
  let m = milieu(pts[n - 1], pts[0]);
  ctx.moveTo(m.x, m.y);
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const mm = milieu(p, q);
    ctx.quadraticCurveTo(p.x, p.y, mm.x, mm.y);
  }
  ctx.closePath();
}

/* =====================================================================
   6. La tenue

   Le squelette donne treize points utiles. Le costume en est déduit :
   un tronc, quatre membres tracés au gros trait rond, des gants et des
   bottes. Rien n'est plaqué sur l'image — tout est reconstruit.
   ===================================================================== */

function dessinerTenue(pts, T) {
  const vis = i => (pts[i] ? pts[i].v : 0);
  if (vis(C.epauleG) < 0.5 || vis(C.epauleD) < 0.5) return;

  const eG = P(pts[C.epauleG]), eD = P(pts[C.epauleD]);
  const largeur = Math.max(20, dist(eG, eD));
  const trait = largeur * 0.21;

  const troncVisible = vis(C.hancheG) > 0.4 && vis(C.hancheD) > 0.4;
  const hG = troncVisible ? P(pts[C.hancheG]) : { x:eG.x, y:eG.y + largeur * 1.1 };
  const hD = troncVisible ? P(pts[C.hancheD]) : { x:eD.x, y:eD.y + largeur * 1.1 };

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // --- Jambes, dessinées en premier : elles passent derrière le tronc.
  if (troncVisible) {
    membre(pts, [C.hancheG, C.genouG, C.chevilleG], trait * 1.16, T.jambes, T.jambesOmbre);
    membre(pts, [C.hancheD, C.genouD, C.chevilleD], trait * 1.16, T.jambes, T.jambesOmbre);
    botte(pts, C.chevilleG, largeur * 0.13, T.gants);
    botte(pts, C.chevilleD, largeur * 0.13, T.gants);
  }

  // --- Le tronc
  // Six points, pas quatre : le lissage d'un simple quadrilatère
  // épaules-hanches donne un œuf. Les deux points de taille, resserrés,
  // sont ce qui rend au buste une silhouette de torse.
  const centreT = { x:(eG.x + eD.x + hG.x + hD.x) / 4, y:(eG.y + eD.y + hG.y + hD.y) / 4 };
  const ux = (eD.x - eG.x) / largeur, uy = (eD.y - eG.y) / largeur;   // axe des épaules
  const ecarter = (p, k) => ({ x:p.x + ux * k, y:p.y + uy * k });
  const entre = (a, b, t) => ({ x:a.x + (b.x - a.x) * t, y:a.y + (b.y - a.y) * t });

  const epG = ecarter(eG, -largeur * 0.13), epD = ecarter(eD, largeur * 0.13);
  const baG = ecarter(hG, -largeur * 0.11), baD = ecarter(hD, largeur * 0.11);
  const taG = ecarter(entre(epG, baG, 0.55),  largeur * 0.045);
  const taD = ecarter(entre(epD, baD, 0.55), -largeur * 0.045);
  const tronc = [epG, epD, taD, baD, baG, taG];

  ctx.save();
  cheminLisse(tronc);
  const gt = ctx.createLinearGradient(eG.x, eG.y, hD.x, hD.y);
  gt.addColorStop(0, T.torse);
  gt.addColorStop(1, T.torseOmbre);
  ctx.fillStyle = gt;
  ctx.fill();

  // Toile sur le buste, rayonnant du plexus
  ctx.clip();
  const hautT = { x:(eG.x - hG.x) / Math.max(1, dist(eG, hG)), y:(eG.y - hG.y) / Math.max(1, dist(eG, hG)) };
  const droiteT = { x:-hautT.y, y:hautT.x };
  dessinerToile(centreT, hautT, largeur * 2.2, Math.atan2(droiteT.y, droiteT.x),
                T.toile, largeur * 0.009, largeur * 0.12);
  ctx.restore();

  // --- Bras
  membre(pts, [C.epauleG, C.coudeG, C.poignetG], trait, T.bras, T.torseOmbre);
  membre(pts, [C.epauleD, C.coudeD, C.poignetD], trait, T.bras, T.torseOmbre);
  botte(pts, C.poignetG, largeur * 0.115, T.gants);
  botte(pts, C.poignetD, largeur * 0.115, T.gants);

  // --- Cou : relie la tenue au masque, sinon la tête flotte.
  if (vis(C.nez) > 0.4) {
    const nez = P(pts[C.nez]), epaules = milieu(eG, eD);
    ctx.beginPath();
    ctx.moveTo(epaules.x, epaules.y);
    ctx.lineTo(epaules.x + (nez.x - epaules.x) * 0.55, epaules.y + (nez.y - epaules.y) * 0.55);
    ctx.strokeStyle = T.masqueOmbre;
    ctx.lineWidth = largeur * 0.26;
    ctx.stroke();
  }

  // --- L'emblème de poitrine
  const plexus = {
    x: centreT.x + (milieu(eG, eD).x - centreT.x) * 0.42,
    y: centreT.y + (milieu(eG, eD).y - centreT.y) * 0.42,
  };
  emblem(plexus, largeur * 0.19, Math.atan2(eD.y - eG.y, eD.x - eG.x), T.emblem);

  ctx.restore();
}

/* Un membre : deux segments d'épaisseur décroissante. On ne le trace
   pas si un de ses points est trop incertain — mieux vaut un bras
   absent qu'un bras jeté au hasard dans le décor. */
function membre(pts, chaine, trait, couleur, ombre) {
  for (let i = 0; i < chaine.length - 1; i++) {
    const a = pts[chaine[i]], b = pts[chaine[i + 1]];
    if (!a || !b || a.v < 0.4 || b.v < 0.4) continue;
    const A = P(a), B = P(b);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.strokeStyle = couleur;
    ctx.lineWidth = trait * (i === 0 ? 1 : 0.82);
    ctx.stroke();

    // Un filet d'ombre sur un bord donne du volume au cylindre.
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = ombre;
    ctx.lineWidth = trait * (i === 0 ? 0.3 : 0.24);
    ctx.translate(trait * 0.24, trait * 0.1);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.restore();
  }
}

function botte(pts, idx, r, couleur) {
  const p = pts[idx];
  if (!p || p.v < 0.4) return;
  const q = P(p);
  ctx.beginPath();
  ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
  ctx.fillStyle = couleur;
  ctx.fill();
}

/* Emblème : une silhouette d'arachnide, tracée géométriquement —
   corps, tête, huit pattes symétriques. */
function emblem(centre, taille, angle, couleur) {
  ctx.save();
  ctx.translate(centre.x, centre.y);
  ctx.rotate(angle);
  ctx.scale(taille, taille);
  ctx.fillStyle = couleur;
  ctx.strokeStyle = couleur;
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.09;

  ctx.beginPath();
  ctx.ellipse(0, 0.14, 0.17, 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -0.26, 0.12, 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Quatre pattes de chaque côté, deux vers le haut, deux vers le bas.
  const pattes = [
    [-0.10, -0.20, -0.62, -0.62, -0.98, -0.34],
    [-0.12, -0.05, -0.70, -0.28, -1.02, 0.06],
    [-0.12,  0.12, -0.70,  0.14, -0.98,  0.48],
    [-0.10,  0.28, -0.58,  0.52, -0.82,  0.92],
  ];
  for (const s of [-1, 1]) {
    for (const [x1, y1, cx, cy, x2, y2] of pattes) {
      ctx.beginPath();
      ctx.moveTo(x1 * s, y1);
      ctx.quadraticCurveTo(cx * s, cy, x2 * s, y2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* Un discret repère sur l'index : l'utilisateur voit que sa main est
   suivie, donc que le balayage a une chance d'aboutir. */
function dessinerMain(main) {
  const p = P(main[8]);
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = '#ff2b3d';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
  ctx.moveTo(p.x - 20, p.y); ctx.lineTo(p.x - 15, p.y);
  ctx.moveTo(p.x + 15, p.y); ctx.lineTo(p.x + 20, p.y);
  ctx.stroke();
  ctx.restore();
}

/* =====================================================================
   7. Le balayage

   On garde la trajectoire du centre de la main sur les dernières
   fractions de seconde. Un déplacement franc, surtout horizontal et
   assez rapide, vaut changement de tenue. Le délai de garde évite
   qu'un même mouvement ne compte trois fois.
   ===================================================================== */

const trace = [];
let dernierGeste = 0;

function suivreGeste(main, t) {
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
  changerTenue(dx > 0 ? -1 : +1);
  if (navigator.vibrate) navigator.vibrate(18);
}

/* =====================================================================
   8. Les tenues, côté interface
   ===================================================================== */

function construirePastilles() {
  const boite = $('#pastilles');
  boite.innerHTML = '';
  TENUES.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', t.nom);
    b.style.background = t.masque;
    b.style.color = t.masque;
    b.addEventListener('click', () => appliquerTenue(i));
    boite.appendChild(b);
  });
}

function changerTenue(pas) {
  appliquerTenue((etat.tenue + pas + TENUES.length) % TENUES.length);
}

function appliquerTenue(i) {
  etat.tenue = i;
  const t = TENUES[i];
  $('#tenue-nom').textContent = t.nom;
  $('#tenue-nom').style.color = t.libelle;
  $$('#pastilles button').forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  mouchard('TENUE · ' + t.nom);
}

/* =====================================================================
   9. Horloge, météo, voyants
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

$('#micro').addEventListener('click', () => {
  if (!reco) return;
  if (etat.ecoute) return arreterEcoute();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  try { reco.start(); } catch { /* déjà démarrée */ }
});

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
    tenue: TENUES[etat.tenue].nom,
  };
}

/* Le cerveau de secours. Il ne comprend rien : il reconnaît quelques
   mots et lit les capteurs. C'est assez pour que le masque ne devienne
   jamais complètement muet. */
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
  if (/tenue|costume|masque|couleur/.test(t)) {
    return `Tenue ${TENUES[etat.tenue].nom}. Balayez la main pour en changer.`;
  }
  return "Liaison avec IRIS coupée. Je garde l'heure, la météo et les tenues.";
}

/* =====================================================================
   11. Barre d'outils
   ===================================================================== */

$$('.outils button').forEach(b => b.addEventListener('click', async () => {
  switch (b.dataset.outil) {
    case 'tenue-prec': changerTenue(-1); break;
    case 'tenue-suiv': changerTenue(+1); break;

    case 'corps':
      etat.corps = !etat.corps;
      b.setAttribute('aria-pressed', String(etat.corps));
      if (!etat.corps) etat.pose = null;
      mouchard(etat.corps ? 'TENUE INTÉGRALE' : 'MASQUE SEUL');
      break;

    case 'camera':
      etat.facing = etat.facing === 'user' ? 'environment' : 'user';
      etat.visage = etat.pose = null;
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

/* Onglet quitté : on relâche la caméra et on coupe la voix. Un masque
   qui continue de filmer en arrière-plan serait indéfendable. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    arreterEcoute();
  }
});
