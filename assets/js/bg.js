/* =========================================================
   MJ AGENCY — Décor WebGL
   Un volume de studio raymarché : des arches rectangulaires et
   quatre arêtes lumineuses fuient vers un point de lumière.
   Le scroll pousse la caméra dans la profondeur — on entre
   littéralement dans l'espace.

   Rendu par accumulation de lueur le long du rayon (pas de
   normales, pas d'éclairage) : c'est bien moins coûteux qu'un
   raymarching classique et ça reste assez sombre pour que le
   texte par-dessus demeure lisible.
   ========================================================= */
(() => {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { fallback(); return; }

  const small = matchMedia('(max-width: 860px)').matches;
  const STEPS = small ? 40 : 68;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_z;          // profondeur caméra, pilotée par le scroll

  const float SPACING = 4.2;              // écart entre deux arches
  const vec2  ROOM    = vec2(2.35, 1.42); // demi-largeur / demi-hauteur du volume

  float sdBox2(vec2 p, vec2 b){
    vec2 q = abs(p) - b;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0));
  }

  float sdBox3(vec3 p, vec3 b){
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }

  /* Contour rectangulaire, répété le long de z */
  float arches(vec3 p){
    float zi   = mod(p.z, SPACING) - SPACING * 0.5;
    float ring = abs(sdBox2(p.xy, ROOM)) - 0.014;
    return max(ring, abs(zi) - 0.05);
  }

  /* Les quatre arêtes du volume, continues jusqu'au point de fuite */
  float edges(vec3 p){
    return length(abs(p.xy) - ROOM);
  }

  /* Repère local d'un poste de travail : abs(x) place le même poste
     contre les deux murs, le décalage en z l'intercale entre deux arches. */
  vec3 deskSpace(vec3 p){
    float zi = mod(p.z - SPACING * 0.5, SPACING) - SPACING * 0.5;
    return vec3(abs(p.x) - (ROOM.x - 0.54), p.y, zi);
  }

  /* Plateau + piétements, tracés en contour comme le reste du volume */
  float desks(vec3 q){
    float top  = abs(sdBox3(q - vec3(0.0, -0.72, 0.0), vec3(0.46, 0.014, 0.86))) - 0.010;
    float legs = abs(sdBox3(vec3(q.x, q.y + 1.07, abs(q.z) - 0.78), vec3(0.42, 0.35, 0.018))) - 0.008;
    return min(top, legs);
  }

  /* Les écrans : seuls volumes réellement allumés de la scène */
  float screens(vec3 q){
    return sdBox3(q - vec3(0.26, -0.47, 0.0), vec3(0.014, 0.19, 0.30));
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    vec2 m = u_mouse - 0.5;
    vec3 ro = vec3(m.x * 0.55, m.y * 0.34 + sin(u_time * 0.13) * 0.05, u_z);
    vec3 rd = normalize(vec3(uv, 1.5));

    vec3 violet = vec3(0.42, 0.17, 0.86);
    vec3 pale   = vec3(0.62, 0.50, 0.95);
    vec3 lit    = vec3(0.52, 0.56, 0.98);   // lueur froide des écrans

    vec3 col = vec3(0.0);
    float t  = 0.35;

    for (int i = 0; i < ${STEPS}; i++){
      vec3 p = ro + rd * t;
      vec3 q = deskSpace(p);

      float da = arches(p);
      float de = edges(p);
      float dd = desks(q);
      float ds = screens(q);

      float fog = exp(-t * 0.062);
      col += violet * exp(-da * 30.0) * 0.038 * fog;   // arches
      col += pale   * exp(-de * 13.0) * 0.015 * fog;   // arêtes
      col += pale   * exp(-dd * 28.0) * 0.032 * fog;   // postes de travail
      col += lit    * exp(-ds *  9.0) * 0.052 * fog;   // écrans allumés

      t += clamp(min(min(da, de), min(dd, ds)) * 0.72, 0.06, 1.15);
      if (t > 62.0) break;
    }

    /* Lumière au bout du volume : elle donne envie d'avancer, mais elle
       tombe pile au centre de l'écran — là où passe le texte. On la garde
       serrée et discrète : c'est une promesse, pas un projecteur. */
    float axis = max(dot(rd, vec3(0.0, 0.0, 1.0)), 0.0);
    col += violet * pow(axis, 320.0) * 0.30;
    col += pale   * pow(axis, 1600.0) * 0.20;

    /* Fond très sombre + vignette calée sur le petit côté */
    col += vec3(0.014, 0.011, 0.019);
    float d2  = length(uv / vec2(max(u_res.x / u_res.y, 1.0), 1.0));
    col *= 0.30 + 0.70 * smoothstep(1.15, 0.12, d2);

    /* Grain léger, casse le banding des dégradés */
    col += fract(sin(dot(gl_FragCoord.xy + u_time, vec2(127.1, 311.7))) * 43758.5453) * 0.016 - 0.008;

    gl_FragColor = vec4(col, 1.0);
  }`;

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('shader:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { fallback(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fallback(); return; }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uTime  = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uZ     = gl.getUniformLocation(prog, 'u_z');

  /* ---------- Entrées ---------- */
  let mouse = [0.5, 0.5], mouseTarget = [0.5, 0.5];
  addEventListener('mousemove', e => {
    mouseTarget = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
  }, { passive: true });

  // 90 px de scroll = 1 unité de profondeur ; on passe donc une arche
  // toutes les ~380 px, ce qui reste lisible même en défilement rapide.
  let z = 0, zTarget = 0;
  const readScroll = () => { zTarget = scrollY / 90; };
  addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  /* ---------- Taille ---------- */
  const DPR = Math.min(devicePixelRatio || 1, small ? 0.8 : 1.5);
  function resize(){
    const w = Math.max(1, Math.floor(innerWidth * DPR));
    const h = Math.max(1, Math.floor(innerHeight * DPR));
    canvas.width = w; canvas.height = h;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }
  addEventListener('resize', resize);
  resize();

  /* ---------- Boucle ---------- */
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  // En build fichier unique le canvas survit au changement de page : tant qu'il
  // est masqué, on saute le rendu plutôt que de calculer un shader invisible.
  const visible = () => document.body.classList.contains('studio-3d');

  const t0 = performance.now();
  function frame(now){
    if (!running) return;
    if (!visible()) { requestAnimationFrame(frame); return; }

    const time = (now - t0) / 1000;

    mouse[0] += (mouseTarget[0] - mouse[0]) * 0.04;
    mouse[1] += (mouseTarget[1] - mouse[1]) * 0.04;
    z += (zTarget - z) * 0.075;                 // le retard donne du poids

    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.uniform1f(uZ, z + time * 0.06);          // dérive lente, même à l'arrêt
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Repli sans WebGL ---------- */
  function fallback(){
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W, H;
    const rs = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    addEventListener('resize', rs); rs();

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 220 + Math.random() * 260,
      dx: (Math.random() - .5) * .25, dy: (Math.random() - .5) * .25,
      c: i % 2 ? '78,40,140' : '30,20,54'
    }));

    (function draw(){
      ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r || o.x > W + o.r) o.dx *= -1;
        if (o.y < -o.r || o.y > H + o.r) o.dy *= -1;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `rgba(${o.c},.30)`);
        g.addColorStop(1, 'rgba(5,5,6,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    })();
  }
})();
