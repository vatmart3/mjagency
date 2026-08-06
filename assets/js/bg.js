/* =========================================================
   MJ AGENCY — WebGL shader background
   A slow, mysterious dark flow-field with a subtle blue core
   that drifts toward the pointer. Falls back to canvas noise.
   ========================================================= */
(() => {
  'use strict';
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
          || canvas.getContext('experimental-webgl');

  if (!gl) { fallback(); return; }

  const vert = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }
  `;

  // Fractal-noise flow field, tuned very dark with a cool blue core.
  const frag = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec2  u_mouse;

    mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
      vec2 u=f*f*(3.-2.*f);
      return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v=0., a=0.5;
      for(int i=0;i<6;i++){ v+=a*noise(p); p=rot(0.5)*p*2.0; a*=0.5; }
      return v;
    }

    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/u_res.y;
      float t = u_time*0.045;

      // domain warp
      vec2 q = vec2(fbm(uv*1.6 + t), fbm(uv*1.6 - t + 4.2));
      vec2 r = vec2(fbm(uv*1.6 + q*1.4 + t*1.3), fbm(uv*1.6 + q*1.4 - t));
      float f = fbm(uv*1.6 + r*1.2);

      // mouse-driven core
      vec2 m = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);
      float d = length(uv - m*0.9);
      float core = smoothstep(0.9, 0.0, d) * 0.5;

      // colour: near-black base, deep violet veins, faint highlights
      vec3 base = vec3(0.026, 0.020, 0.034);
      vec3 blue = vec3(0.34, 0.14, 0.66);
      vec3 hi   = vec3(0.72, 0.55, 0.98);

      float veins = smoothstep(0.45, 0.85, f);
      float glow  = pow(f, 3.0);

      vec3 col = base;
      col += blue * (r.x*0.22 + veins*0.20);
      col += hi   * glow * 0.10;
      col += blue * core * (0.6 + r.y*0.4);

      // vignette
      float vig = smoothstep(1.25, 0.2, length(uv));
      col *= 0.35 + 0.65*vig;

      // subtle grain via time-jitter
      col += (hash(gl_FragCoord.xy + t)*0.02 - 0.01);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) { fallback(); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fallback(); return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  let mouse = [0.5, 0.5], tMouse = [0.5, 0.5];
  addEventListener('mousemove', e => { tMouse = [e.clientX / innerWidth, 1 - e.clientY / innerHeight]; }, { passive: true });

  const DPR = Math.min(devicePixelRatio || 1, 1.6);
  function resize() {
    const w = Math.floor(innerWidth * DPR), h = Math.floor(innerHeight * DPR);
    canvas.width = w; canvas.height = h;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }
  addEventListener('resize', resize); resize();

  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });

  const start = performance.now();
  function frame(now) {
    if (!running) return;
    mouse[0] += (tMouse[0] - mouse[0]) * 0.04;
    mouse[1] += (tMouse[1] - mouse[1]) * 0.04;
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Canvas fallback (soft drifting orbs) ---------- */
  function fallback() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W, H;
    function rs() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    addEventListener('resize', rs); rs();
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 220 + Math.random() * 260,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      c: i % 2 ? '78,40,140' : '30,20,54'
    }));
    (function draw() {
      ctx.fillStyle = '#060607'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r || o.x > W + o.r) o.dx *= -1;
        if (o.y < -o.r || o.y > H + o.r) o.dy *= -1;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `rgba(${o.c},0.30)`); g.addColorStop(1, 'rgba(6,6,7,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    })();
  }
})();
