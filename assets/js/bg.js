/* =========================================================
   MJ AGENCY — Objet 3D temps réel

   Un ruban torsadé, rendu par lancer de rayons dans le
   fragment shader : pas de modèle importé, pas de bibliothèque,
   la forme est décrite par une fonction de distance et éclairée
   comme en studio (deux sources + environnement + occlusion).

   Il flotte derrière le contenu, tourne lentement et se déplace
   avec le défilement. Sur la charte claire d'Apple, le matériau
   est une céramique blanche à liseré bleu — visible, mais qui ne
   mange jamais le texte : l'objet vit dans la moitié droite et le
   centre haut reste dégagé pour le titre.
   ========================================================= */
(() => {
  'use strict';

  // Le canvas se crée lui-même plutôt que d'être recopié dans huit pages :
  // une seule source, et aucune page ne peut se retrouver sans fond.
  let canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { degrade(); return; }

  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'default' });
  if (!gl) { degrade(); return; }

  const petit = matchMedia('(max-width: 860px)').matches;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  const PAS = petit ? 58 : 88;

  const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_scroll;      // progression du défilement, en hauteurs d'écran
  uniform vec2  u_decal;       // position de l'objet à l'écran
  uniform float u_taille;      // échelle de l'objet
  uniform float u_petit;       // 1 sur téléphone

  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float bruit(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i),                  b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++){ v += a * bruit(p); p = rot(0.6) * p * 2.02; a *= 0.5; }
    return v;
  }

  /* Orientation courante de l'objet — posée dans main(), lue par la carte
     de distance. Les passer en argument coûterait une copie à chaque pas. */
  float g_ay, g_ax;

  /* ---- La forme -------------------------------------------------------
     Un tore dont la section tourne sur elle-même pendant qu'elle fait le
     tour : d'où l'aspect de ruban noué. Le facteur 1.5 est choisi pour que
     la section retombe sur elle-même à la jointure (la section a une
     symétrie d'ordre 2), sinon une couture apparaîtrait. */
  float objet(vec3 p){
    p /= u_taille;
    p.yz = rot(g_ax) * p.yz;
    p.xz = rot(g_ay) * p.xz;

    float a = atan(p.z, p.x);
    float r = length(p.xz) - 1.22;
    vec2  q = vec2(r, p.y);
    q = rot(a * 1.5) * q;
    q.x = abs(q.x) - 0.40;
    return (length(q) - 0.205) * u_taille;
  }

  vec3 normale(vec3 p){
    vec2 e = vec2(0.0022, 0.0);
    return normalize(vec3(
      objet(p + e.xyy) - objet(p - e.xyy),
      objet(p + e.yxy) - objet(p - e.yxy),
      objet(p + e.yyx) - objet(p - e.yyx)));
  }

  /* Occlusion ambiante approchée : on sonde la distance à quelques pas le
     long de la normale. Là où la surface se replie sur elle-même, la
     distance mesurée est plus courte que le pas — donc l'endroit est fermé. */
  float occlusion(vec3 p, vec3 n){
    float o = 0.0, s = 1.0;
    for (int i = 1; i <= 5; i++){
      float h = 0.022 * float(i) * float(i);
      o += (h - objet(p + n * h)) * s;
      s *= 0.72;
    }
    return clamp(1.0 - 2.2 * o, 0.0, 1.0);
  }

  /* Environnement de studio : plafond lumineux, sol gris très clair,
     une dominante bleutée dans les parties basses. */
  vec3 environnement(vec3 n){
    float h = n.y * 0.5 + 0.5;
    vec3 c = mix(vec3(0.855, 0.870, 0.905), vec3(1.0), smoothstep(0.38, 1.0, h));
    c = mix(c, vec3(0.800, 0.860, 0.960), smoothstep(0.46, 0.0, h) * 0.55);
    return c;
  }

  void main(){
    vec2 q = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    float t = u_time;
    vec2  m = (u_mouse - 0.5);

    /* ---- Le voile de couleur, sous l'objet ---- */
    vec2 d = q;
    d.y += u_scroll * 0.42;
    d = rot(u_scroll * 0.10) * d;
    vec2 w1 = vec2(fbm(d * 1.10 + t * 0.018 + m * 0.16), fbm(d * 1.10 - t * 0.014 + 3.1));
    vec2 w2 = vec2(fbm(d * 1.35 + w1 * 1.2 + t * 0.023), fbm(d * 1.35 + w1 * 1.2 - t * 0.018));
    float f = fbm(d * 1.20 + w2 * 1.1);

    vec3 blanc   = vec3(1.000, 1.000, 1.000);
    vec3 casse   = vec3(0.961, 0.961, 0.969);   // #F5F5F7
    vec3 bleute  = vec3(0.898, 0.933, 0.984);
    vec3 lavande = vec3(0.941, 0.925, 0.973);

    vec3 col = mix(blanc, casse, smoothstep(0.22, 0.78, f));
    col = mix(col, bleute,  smoothstep(0.30, 0.80, w2.x));
    col = mix(col, lavande, smoothstep(0.36, 0.86, w1.y) * 0.80);

    /* ---- L'objet ---- */
    vec2 p2 = q - u_decal;

    // Ombre portée douce : une tache légèrement décalée en bas à droite,
    // qui donne à l'objet son assise sans dessiner de sol.
    float rayon = 0.78 * u_taille;
    float ombre = smoothstep(rayon, 0.0, length((p2 - vec2(0.06, -0.07)) * vec2(1.0, 1.15)));
    ombre *= mix(1.0, 1.0 - smoothstep(0.22, 0.80, u_scroll), u_petit);
    col = mix(col, vec3(0.878, 0.890, 0.914), ombre * 0.55);

    g_ay = t * 0.16 + u_scroll * 1.05 + m.x * 0.40;
    g_ax = 0.34 + sin(t * 0.11) * 0.16 - m.y * 0.22;

    vec3 ro = vec3(0.0, 0.0, 3.9);
    vec3 rd = normalize(vec3(p2, -1.65));

    /* Sphère englobante : la très grande majorité des pixels ne touche pas
       l'objet. Les écarter d'abord libère tous les pas de la marche pour
       ceux qui comptent — c'est ce qui supprime les moirés sur les bords
       rasants, où la marche manquait d'itérations. */
    float R = 1.83 * u_taille;
    float b = dot(ro, rd), c = dot(ro, ro) - R * R;
    float delta = b * b - c;

    float h = 1.0, dist = 0.0;
    bool touche = false;

    if (delta > 0.0){
      float rd_ = sqrt(delta);
      float t0 = max(-b - rd_, 0.0), t1 = -b + rd_;
      dist = t0;
      for (int i = 0; i < ${PAS}; i++){
        h = objet(ro + rd * dist);
        if (h < 0.0012 || dist > t1) break;
        dist += h * 0.55;                     // la torsion casse la lipschitzianité
      }
      touche = (dist <= t1 && h < 0.008);
    }

    if (touche){
      vec3 pos = ro + rd * dist;
      vec3 n   = normale(pos);
      float ao = occlusion(pos, n);

      vec3 l1 = normalize(vec3(-0.52, 0.78, 0.52));   // clé, en haut à gauche
      vec3 l2 = normalize(vec3( 0.82, 0.12, 0.34));   // rappel, à droite

      float dif1 = max(dot(n, l1), 0.0);
      float dif2 = max(dot(n, l2), 0.0);
      float spe1 = pow(max(dot(reflect(-l1, n), -rd), 0.0), 46.0);
      float spe2 = pow(max(dot(reflect(-l2, n), -rd), 0.0), 18.0);
      float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.6);

      vec3 mat = vec3(1.0);
      vec3 o = mat * environnement(n) * (0.34 + 0.60 * dif1);
      o += mat * dif2 * vec3(0.78, 0.85, 1.00) * 0.28;
      o *= mix(0.55, 1.0, ao);
      o += spe1 * 0.62;
      o += spe2 * vec3(0.30, 0.58, 1.00) * 0.22;
      o += fres * vec3(0.00, 0.44, 0.89) * 0.75;      // liseré bleu de la charte

      // Bord adouci : la couverture retombe quand le rayon n'a fait
      // que frôler la surface, ce qui évite l'escalier sans multi-échantillon.
      float couv = 1.0 - smoothstep(0.0012, 0.005, h);

      // Sur téléphone, l'objet est un moment d'ouverture, pas un décor
      // permanent : passé le premier écran il s'efface, au lieu de passer
      // derrière chaque titre sur sept mille pixels de défilement.
      couv *= mix(1.0, 1.0 - smoothstep(0.22, 0.80, u_scroll), u_petit);
      col = mix(col, min(o, vec3(1.0)), couv * 0.94);
    }

    /* La colonne de texte du premier écran est dégagée : l'objet s'estompe
       derrière le titre au lieu de passer devant. Le voile suit la colonne
       (un rectangle adouci, pas un disque) et disparaît dès qu'on défile. */
    // La largeur du voile se mesure en fraction d'écran, pas en unités de
    // scène : sinon un téléphone (écran étroit) se retrouve voilé en entier.
    float sx = gl_FragCoord.x / u_res.x - 0.5;
    float bx = 1.0 - smoothstep(0.19, 0.44, abs(sx + 0.04));
    float by = 1.0 - smoothstep(0.20, 0.48, abs(q.y - 0.16));
    float degage = bx * by * (1.0 - smoothstep(0.05, 0.85, u_scroll));
    col = mix(col, blanc, degage * 0.88);

    // Léger tramage : sans lui, des dégradés aussi doux montrent des bandes
    float grain = (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.006;
    gl_FragColor = vec4(col + grain, 1.0);
  }`;

  function compiler(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  const vs = compiler(gl.VERTEX_SHADER, VERT);
  const fs = compiler(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { degrade(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { degrade(); return; }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes    = gl.getUniformLocation(prog, 'u_res');
  const uTime   = gl.getUniformLocation(prog, 'u_time');
  const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');
  const uDecal  = gl.getUniformLocation(prog, 'u_decal');
  const uTaille = gl.getUniformLocation(prog, 'u_taille');
  const uPetit  = gl.getUniformLocation(prog, 'u_petit');

  gl.uniform1f(uTaille, petit ? 0.22 : 0.40);
  gl.uniform1f(uPetit, petit ? 1 : 0);

  let souris = [0.5, 0.5], cible = [0.5, 0.5];
  let defile = 0, defileCible = 0;
  const lireScroll = () => { defileCible = scrollY / Math.max(innerHeight, 1); };
  addEventListener('scroll', lireScroll, { passive: true });
  lireScroll();

  addEventListener('mousemove', e => {
    cible = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
  }, { passive: true });

  // Le lancer de rayons coûte cher au pixel. On rend sous la définition
  // native — mais pas trop : à 0.75 l'objet ressortait crénelé sur les écrans
  // de téléphone, les plus denses de tous. La marche y est raccourcie en
  // compensation (voir PAS), ce qui se voit beaucoup moins qu'un escalier
  // sur une silhouette.
  const DPR = Math.min(devicePixelRatio || 1, petit ? 1.15 : 1.0);
  function redimensionner(){
    const w = Math.max(1, Math.floor(innerWidth * DPR));
    const h = Math.max(1, Math.floor(innerHeight * DPR));
    canvas.width = w; canvas.height = h;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }
  addEventListener('resize', redimensionner);
  redimensionner();

  let actif = true;
  document.addEventListener('visibilitychange', () => {
    actif = !document.hidden;
    if (actif) requestAnimationFrame(image);
  });

  const t0 = performance.now();
  function image(now){
    if (!actif) return;
    souris[0] += (cible[0] - souris[0]) * 0.03;
    souris[1] += (cible[1] - souris[1]) * 0.03;
    defile += (defileCible - defile) * 0.08;      // le retard donne de l'inertie

    // L'objet ne se contente pas de descendre : il dérive en boucle, donc
    // il reste présent d'un bout à l'autre de la page au lieu de sortir
    // du cadre après le premier écran.
    const x = (petit ? 0.00 : 0.45) + Math.sin(defile * 0.42) * (petit ? 0.03 : 0.10);
    const y = (petit ? -0.40 : 0.04) - Math.sin(defile * 0.58) * (petit ? 0.10 : 0.26);

    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, souris[0], souris[1]);
    gl.uniform1f(uScroll, defile);
    gl.uniform2f(uDecal, x, y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(image);
  }
  requestAnimationFrame(image);

  /* Sans WebGL — ou sans animation demandée — un dégradé fixe équivalent. */
  function degrade(){
    canvas.style.background =
      'radial-gradient(70% 55% at 18% 12%, #E8F0FB 0%, rgba(232,240,251,0) 60%),' +
      'radial-gradient(60% 50% at 84% 30%, #F0EDF8 0%, rgba(240,237,248,0) 62%),' +
      'radial-gradient(80% 60% at 50% 100%, #F5F5F7 0%, rgba(245,245,247,0) 70%),' +
      '#FFFFFF';
  }
})();
