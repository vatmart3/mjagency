/* =========================================================
   MJ AGENCY — Champ de dégradés

   Un voile de couleur qui respire, très clair, très lent.
   Aucun objet, aucune scène : juste de la lumière qui bouge,
   dans l'esprit « subtle gradients » de la charte.

   Le rendu tient en un seul quad et un bruit fractal ; il n'y a
   ni géométrie ni éclairage à calculer, donc le coût reste
   marginal même sur un téléphone.
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

  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power' });
  if (!gl) { degrade(); return; }

  const petit = matchMedia('(max-width: 860px)').matches;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_scroll;      // progression du défilement, en hauteurs d'écran

  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float bruit(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i),            b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ v += a * bruit(p); p = rot(0.6) * p * 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 q  = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    float t = u_time * 0.018;                    // dérive lente, indépendante du scroll
    vec2  m = (u_mouse - 0.5) * 0.16;

    // Le défilement déplace le domaine : les masses glissent vers le haut
    // et tournent légèrement, donc le fond change réellement de page en
    // page au lieu de se contenter d'onduler sur place.
    vec2 d = q;
    d.y += u_scroll * 0.42;
    d = rot(u_scroll * 0.10) * d;

    // Double déformation du domaine : c'est ce qui donne aux masses
    // leur mouvement organique plutôt qu'un simple défilement.
    vec2 w1 = vec2(fbm(d * 1.10 + t + m), fbm(d * 1.10 - t * 0.8 + 3.1));
    vec2 w2 = vec2(fbm(d * 1.35 + w1 * 1.2 + t * 1.3), fbm(d * 1.35 + w1 * 1.2 - t));
    float f = fbm(d * 1.20 + w2 * 1.1);

    // Palette de la charte : blancs, bleu très dilué, lavande à peine posée
    vec3 blanc   = vec3(1.000, 1.000, 1.000);
    vec3 casse   = vec3(0.961, 0.961, 0.969);   // #F5F5F7
    vec3 bleu    = vec3(0.898, 0.933, 0.984);
    vec3 lavande = vec3(0.941, 0.925, 0.973);

    vec3 col = mix(blanc, casse, smoothstep(0.22, 0.78, f));
    col = mix(col, bleu,    smoothstep(0.30, 0.80, w2.x));
    col = mix(col, lavande, smoothstep(0.36, 0.86, w1.y) * 0.80);

    // Le centre haut reste clair pour ne pas gêner le titre, mais les
    // masses restent lisibles sur les côtés : sans ça, le mouvement ne
    // se perçoit plus du tout.
    float degage = smoothstep(0.62, 0.02, length(vec2(q.x * 0.55, q.y - 0.22)))
                 * (1.0 - smoothstep(0.0, 0.8, u_scroll));
    col = mix(col, blanc, degage * 0.72);

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

  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uTime  = gl.getUniformLocation(prog, 'u_time');
  const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  let souris = [0.5, 0.5], cible = [0.5, 0.5];
  let defile = 0, defileCible = 0;
  const lireScroll = () => { defileCible = scrollY / Math.max(innerHeight, 1); };
  addEventListener('scroll', lireScroll, { passive: true });
  lireScroll();

  addEventListener('mousemove', e => {
    cible = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
  }, { passive: true });

  // Le champ est diffus : le rendre en pleine résolution ne se verrait pas.
  const DPR = Math.min(devicePixelRatio || 1, petit ? 0.6 : 1.0);
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
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, souris[0], souris[1]);
    gl.uniform1f(uScroll, defile);
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
