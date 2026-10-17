/* Nexi, TechNext's AI companion: the 3D robot and its roaming brain for the home hero.
   Loaded by assets/js/nexi.js after Three.js (assets/js/vendor/three-r128.min.js).
   Exposes window.tnNexi(hero, ROOT, opts), which builds the robot and returns
   { pause, resume, stage, cue, live }. On desktop Nexi roams every slide; on the two Nexi slides the stage
   script in hero-scenes.js takes over (stage(kind, root), then cue(name, arg) per beat). opts.lite is the
   phone build: lower pixel ratio, no glow pass, and it runs only while a Nexi slide shows. */
(function () {
  'use strict';
  window.tnNexi = create;

  function create(hero, ROOT, opts) {
    var THREE = window.THREE;
    opts = opts || {};
    var LITE = !!opts.lite;

    /* ---------- DOM: canvas + hit area + effects inside the hero, intro card on top ---------- */
    var layer = document.createElement('div');
    layer.className = 'nexi' + (LITE ? ' nexi--lite' : '');
    layer.innerHTML = '<canvas class="nexi-cv" aria-hidden="true"></canvas>' +
      '<button class="nexi-hit" type="button" aria-label="Meet Nexi, TechNext’s AI companion" aria-haspopup="dialog" aria-controls="nexi-card" aria-expanded="false"></button>' +
      '<div class="nexi-fx" aria-hidden="true"></div>';
    var card = document.createElement('div');
    card.className = 'nexi-card' + (LITE ? ' nexi-card--lite' : ''); card.id = 'nexi-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'nexi-card-t'); card.hidden = true;
    card.innerHTML =
      '<div class="nexi-card-head"><span class="nexi-ava" aria-hidden="true"></span>' +
      '<div><b id="nexi-card-t">Hi, I’m Nexi!</b><span>TechNext’s AI companion</span></div>' +
      '<button class="nexi-x" type="button" data-nexi-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<p>I fly around this page and keep an eye on things. I circle the Odoo apps, chase orders through the flow and cheer every launch.</p>' +
      '<p>I’m a small preview of the AI chatbots TechNext builds for websites, WhatsApp and apps. My full self answers questions on my own page.</p>' +
      '<div class="nexi-card-act"><a class="btn btn-primary btn-sm" href="' + ROOT + 'nexi#full" data-nexi-chat>Chat with me</a>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-nexi-close>Bye, Nexi!</button></div>';
    hero.appendChild(layer);
    hero.appendChild(card);
    var cv = layer.querySelector('.nexi-cv'), hit = layer.querySelector('.nexi-hit'), fxEl = layer.querySelector('.nexi-fx');

    /* ---------- renderer ---------- */
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch (e) { layer.remove(); card.remove(); return null; }
    /* no synchronous shader status checks: the GPU process compiles in parallel instead of the page waiting */
    renderer.debug.checkShaderErrors = false;
    var PR = Math.min(window.devicePixelRatio || 1, LITE ? 1.5 : 2);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scene = new THREE.Scene();
    var CAMZ = 24, FOV = 30;
    var camera = new THREE.PerspectiveCamera(FOV, 1, 1, 80);
    camera.position.set(0, 0, CAMZ);
    var clock = new THREE.Clock(), time = 0;
    var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), tmp3 = new THREE.Vector3();
    var W = 1, H = 1, S = 1, SIZE = 150, VIEW = 450;

    /* studio reflections, blue bounce for the white shell */
    (function () {
      var pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene();
      es.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xd3def5, side: THREE.BackSide })));
      function panel(w, h, x, y, z, rx, ry, k, col) {
        var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
        m.position.set(x, y, z); m.rotation.set(rx, ry, 0); es.add(m);
      }
      panel(10, 4, 0, 9.6, 1, Math.PI / 2, 0, 3.4, '#ffffff');
      panel(5, 8, -9.6, 2.5, 3, 0, Math.PI / 2, 2.6, '#ffffff');
      panel(4, 8, 9.6, 2, -1, 0, -Math.PI / 2, 1.8, '#9fc0ff');
      panel(14, 3, 0, 1, -9.6, 0, 0, 1.4, '#b9d0ff');
      panel(8, 3, 0, 3.5, 9.6, 0, Math.PI, 1.6, '#ffffff');
      scene.environment = pm.fromScene(es, 0.03).texture;
      pm.dispose();
    })();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8fa9dd, 0.3));
    var key = new THREE.DirectionalLight(0xffffff, 1.45); key.position.set(4, 8, 10); scene.add(key);
    var rim = new THREE.DirectionalLight(0xffffff, 0.7); rim.position.set(-6, 3, -5); scene.add(rim);
    var fill = new THREE.DirectionalLight(0x8fb4ff, 0.35); fill.position.set(6, 1, 4); scene.add(fill);

    /* ---------- helpers ---------- */
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function ease(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function bell(p) { return Math.sin(Math.PI * clamp(p, 0, 1)); }
    function env(p, a, r) { return p < a ? ease(p / a) : (p > 1 - r ? ease((1 - p) / r) : 1); }
    function Spring(f, d) { this.w = 2 * Math.PI * f; this.z = d == null ? 1 : d; this.x = 0; this.v = 0; }
    Spring.prototype.step = function (t, dt) { var n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n; for (var i = 0; i < n; i++) { var a = -this.w * this.w * (this.x - t) - 2 * this.z * this.w * this.v; this.v += a * h; this.x += this.v * h; } return this.x; };
    var ANISO = renderer.capabilities.getMaxAnisotropy();
    function canvasTex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO; return t; }
    function dataTex(w, h, fn) {
      var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'), im = g.createImageData(w, h);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var v = fn(x, y), i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0); var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = ANISO; return t;
    }
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var speck = new Float32Array(65536); for (var si = 0; si < speck.length; si++) speck[si] = rnd();
    function sp(x, y) { return speck[((y & 255) << 8) | (x & 255)]; }
    var noiseTex = dataTex(256, 256, function (x, y) { return 150 + ((sp(x, y) * 2 + sp(x + 1, y) + sp(x, y + 1) + sp(x - 1, y) + sp(x, y - 1)) / 6) * 70; }); noiseTex.repeat.set(6, 3);
    var rows = new Float32Array(512); for (var ri = 0; ri < 512; ri++) rows[ri] = rnd();
    var brushTex = dataTex(256, 512, function (x, y) { return 120 + ((rows[y] * 3 + rows[(y + 1) & 511] + rows[(y + 511) & 511]) / 5) * 90 + sp(x, y) * 25; }); brushTex.repeat.set(1, 4);
    var circuitTex = canvasTex(1024, 512, function (g, w, h) {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
      for (var i = 0; i < 26; i++) {
        var x = rnd() * w, y = h * 0.56 + rnd() * h * 0.14, len = 40 + rnd() * 110, dir = rnd() < 0.5 ? -1 : 1, dy = rnd() < 0.5 ? -18 : 18;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + len * dir, y); g.lineTo(x + len * dir + 18 * dir, y + dy); g.stroke();
        g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.beginPath(); g.arc(x + len * dir + 18 * dir, y + dy, 4, 0, 7); g.fill();
      }
    });

    var M = {
      shell: new THREE.MeshPhysicalMaterial({ color: 0xeef2fa, roughness: 0.42, roughnessMap: noiseTex, bumpMap: noiseTex, bumpScale: 0.0012, clearcoat: 0.85, clearcoatRoughness: 0.14, envMapIntensity: 0.8 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xe4e9f2, roughness: 0.28, roughnessMap: brushTex, metalness: 1, envMapIntensity: 1.15 }),
      visor: new THREE.MeshPhysicalMaterial({ color: 0x03050b, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.3, emissive: 0xffffff, emissiveIntensity: 1 }),
      glow: new THREE.MeshBasicMaterial({ color: 0x5d8ff0, toneMapped: false }),
      line: new THREE.MeshBasicMaterial({ color: 0x8fc0ff, toneMapped: false }),
      eye: new THREE.MeshBasicMaterial({ color: 0xa6d2ff, toneMapped: false, side: THREE.DoubleSide }),
      ring: new THREE.MeshBasicMaterial({ color: 0x4f86ee, toneMapped: false }),
      black: new THREE.MeshBasicMaterial({ color: 0x000000 })
    };
    M.torso = M.shell.clone(); M.torso.emissive = new THREE.Color(0x6fa4ff); M.torso.emissiveMap = circuitTex; M.torso.emissiveIntensity = 0.85;
    M.heart = new THREE.MeshBasicMaterial({ color: 0xff7eb6, toneMapped: false, side: THREE.DoubleSide });
    M.visor.emissiveMap = canvasTex(256, 256, function (g) { var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#000'); gr.addColorStop(0.62, '#000'); gr.addColorStop(0.8, '#0b1d44'); gr.addColorStop(1, '#1c3f86'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
    function glowMesh(geo, mat) { var m = new THREE.Mesh(geo, mat); m.userData.glow = true; return m; }
    function mesh(geo, mat) { return new THREE.Mesh(geo, mat); }

    /* ---------- selective glow: only the lights bloom ---------- */
    var Glow = (function () {
      var o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
      var A = new THREE.WebGLRenderTarget(4, 4, o), B = new THREE.WebGLRenderTarget(4, 4, o), C = new THREE.WebGLRenderTarget(4, 4, o);
      var qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), qs = new THREE.Scene();
      var vs = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }';
      var blur = new THREE.ShaderMaterial({ uniforms: { tMap: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: vs, depthTest: false, depthWrite: false,
        fragmentShader: 'uniform sampler2D tMap; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 s=texture2D(tMap,vUv)*0.227027; s+=texture2D(tMap,vUv+uDir*1.384615)*0.316216; s+=texture2D(tMap,vUv-uDir*1.384615)*0.316216; s+=texture2D(tMap,vUv+uDir*3.230769)*0.070270; s+=texture2D(tMap,vUv-uDir*3.230769)*0.070270; gl_FragColor=s; }' });
      var comp = new THREE.ShaderMaterial({ uniforms: { tB: { value: null }, tA: { value: null } }, vertexShader: vs, depthTest: false, depthWrite: false, transparent: true,
        blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
        fragmentShader: 'uniform sampler2D tB; uniform sampler2D tA; varying vec2 vUv; void main(){ vec3 c=texture2D(tB,vUv).rgb*0.55+texture2D(tA,vUv).rgb*0.12; c=clamp(c,0.0,1.0); gl_FragColor=vec4(c,max(c.r,max(c.g,c.b))); }' });
      var quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blur); quad.frustumCulled = false; qs.add(quad);
      /* the meshes that do not glow are dimmed to black (or hidden) for the glow render: kept in a list, rebuilt
         now and then, so a frame walks no scene graph and allocates nothing */
      var list = null, glist = null, listAt = 0, hid = [], swp = [], mats = [], gsw = [], gmat = [], twins = new Map();
      function lists() {
        if (!list || ++listAt > 240) { listAt = 0; list = []; glist = []; scene.traverse(function (o2) { if (o2.isMesh) (o2.userData.glow ? glist : list).push(o2); }); }
      }
      /* the lights render with a twin of their material here: a material rendered both to the canvas (sRGB) and to
         the glow target (linear) switched shader programs twice a frame; each twin always renders to the target */
      function twin(m) { var t = twins.get(m); if (!t) { t = m.clone(); if (m.color) t.color = m.color; twins.set(m, t); } t.opacity = m.opacity; return t; }
      function pass(m, t) { quad.material = m; renderer.setRenderTarget(t); renderer.render(qs, qc); }
      return {
        /* compile the glow pass's materials up front (with the scene's, see the end of create) */
        /* the pass's own materials, compiled one at a time by warmUp() */
        /* ...each for the target it really renders to (the output encoding is part of a program) */
        warmSteps: [[M.black, A], [blur, B], [comp, null]].map(function (mt) { return function () { var ws = new THREE.Scene(); ws.add(new THREE.Mesh(quad.geometry, mt[0])); renderer.setRenderTarget(mt[1]); renderer.compile(ws, qc); renderer.setRenderTarget(null); }; }),
        /* the lights' twins, compiled for the glow target before the first frame */
        warmTwins: function () {
          lists(); var ws = new THREE.Scene(), seen = new Set(); ws.environment = scene.environment;
          glist.forEach(function (o2) { if (seen.has(o2.material)) return; seen.add(o2.material); ws.add(new THREE.Mesh(o2.geometry, twin(o2.material))); });
          renderer.setRenderTarget(A); renderer.compile(ws, camera); renderer.setRenderTarget(null);
        },
        /* big: the close-up, where the glow is drawn at a quarter of the render size (it is blurred anyway) */
        size: function (w, h, big) { var d = big ? 4 : 2; A.setSize(Math.max(2, w / d | 0), Math.max(2, h / d | 0)); B.setSize(Math.max(2, w / (d * 2) | 0), Math.max(2, h / (d * 2) | 0)); C.setSize(Math.max(2, w / (d * 2) | 0), Math.max(2, h / (d * 2) | 0)); },
        render: function () {
          lists();
          var L = list, nh = 0, ns = 0, ng = 0, i, o2;
          for (i = 0; i < L.length; i++) {
            o2 = L[i]; if (!o2.visible) continue;
            if (o2.userData.noGlow || o2.material.transparent) { hid[nh++] = o2; o2.visible = false; }
            else { swp[ns] = o2; mats[ns++] = o2.material; o2.material = M.black; }
          }
          for (i = 0; i < glist.length; i++) { o2 = glist[i]; if (!o2.visible) continue; gsw[ng] = o2; gmat[ng++] = o2.material; o2.material = twin(o2.material); }
          renderer.setClearColor(0, 1); renderer.setRenderTarget(A); renderer.clear(); renderer.render(scene, camera);
          for (i = 0; i < nh; i++) hid[i].visible = true;
          for (i = 0; i < ns; i++) { swp[i].material = mats[i]; mats[i] = null; }
          for (i = 0; i < ng; i++) { gsw[i].material = gmat[i]; gmat[i] = null; }
          renderer.setClearColor(0, 0);
          blur.uniforms.tMap.value = A.texture; blur.uniforms.uDir.value.set(1.5 / B.width, 0); pass(blur, B);
          blur.uniforms.tMap.value = B.texture; blur.uniforms.uDir.value.set(0, 1.5 / C.height); pass(blur, C);
          blur.uniforms.tMap.value = C.texture; blur.uniforms.uDir.value.set(3 / B.width, 0); pass(blur, B);
          blur.uniforms.tMap.value = B.texture; blur.uniforms.uDir.value.set(0, 3 / C.height); pass(blur, C);
          this.again();
        },
        /* last frame's glow added to this frame (no glow render) */
        again: function () {
          comp.uniforms.tB.value = C.texture; comp.uniforms.tA.value = A.texture;
          renderer.autoClear = false; pass(comp, null); renderer.autoClear = true;
        }
      };
    })();

    /* ---------- the robot (same design as the Nexi chatbot concept) ---------- */
    var bot = new THREE.Group(); scene.add(bot);
    var spinner = new THREE.Group(); bot.add(spinner);
    var BASE = -1.44;
    var hover = new THREE.Group(); hover.position.y = BASE; spinner.add(hover);
    var head = new THREE.Group(); head.position.y = 2.06; head.rotation.order = 'YXZ'; hover.add(head);
    var handL = new THREE.Group(), handR = new THREE.Group(); hover.add(handL); hover.add(handR);
    var HL = new THREE.Vector3(-0.88, 0.72, 0.12), HR = new THREE.Vector3(0.88, 0.72, 0.12);

    function smoothProfile(pts) {
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], r = p[2] || 0;
        if (!r || i === 0 || i === pts.length - 1) { out.push(new THREE.Vector2(p[0], p[1])); continue; }
        var a = pts[i - 1], b = pts[i + 1], ax = a[0] - p[0], ay = a[1] - p[1], bx = b[0] - p[0], by = b[1] - p[1];
        var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), d = Math.min(r, la / 2, lb / 2);
        var p1x = p[0] + ax / la * d, p1y = p[1] + ay / la * d, p2x = p[0] + bx / lb * d, p2y = p[1] + by / lb * d;
        for (var k = 0; k <= 8; k++) { var t = k / 8, u = 1 - t; out.push(new THREE.Vector2(u * u * p1x + 2 * u * t * p[0] + t * t * p2x, u * u * p1y + 2 * u * t * p[1] + t * t * p2y)); }
      }
      return out;
    }
    function lathe(pts, seg) { return new THREE.LatheGeometry(smoothProfile(pts), seg || 96); }
    function ellipsoid(rx, ry, rz, seg) { var g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)); g.scale(rx, ry, rz); return g; }
    function roundRect(w, h, r) {
      var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
    }
    function star(R, r, n) { var s = new THREE.Shape(); for (var i = 0; i < n * 2; i++) { var a = Math.PI / 2 + i * Math.PI / n, rad = i % 2 ? r : R; if (i) s.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); else s.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); } s.closePath(); return s; }
    /* heart eyes (in love with a brand kit) and x eyes (fainting) */
    function heartShape(r) {
      var s = new THREE.Shape(); s.moveTo(0, -r);
      s.bezierCurveTo(r * 0.2, -r * 0.62, r * 1.05, -r * 0.2, r * 0.92, r * 0.38);
      s.bezierCurveTo(r * 0.82, r * 0.86, r * 0.2, r * 0.95, 0, r * 0.45);
      s.bezierCurveTo(-r * 0.2, r * 0.95, -r * 0.82, r * 0.86, -r * 0.92, r * 0.38);
      s.bezierCurveTo(-r * 1.05, -r * 0.2, -r * 0.2, -r * 0.62, 0, -r); return s;
    }
    function crossGeo(w, t) {
      var s = new THREE.Shape(), a = w / 2, b = t / 2;
      s.moveTo(-b, a); s.lineTo(b, a); s.lineTo(b, b); s.lineTo(a, b); s.lineTo(a, -b); s.lineTo(b, -b); s.lineTo(b, -a);
      s.lineTo(-b, -a); s.lineTo(-b, -b); s.lineTo(-a, -b); s.lineTo(-a, b); s.lineTo(-b, b); s.closePath();
      var g = new THREE.ShapeGeometry(s); g.rotateZ(Math.PI / 4); return g;
    }
    function bezelCurve() {
      var a = 0.52, b = 0.405, c = 0.385, cz = 0.39, R0 = 0.7, pts = [];
      for (var i = 0; i < 100; i++) {
        var th = i / 100 * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th), lo = 0, hi = Math.PI / 2;
        for (var k = 0; k < 28; k++) { var t = (lo + hi) / 2, x = a * ct * Math.sin(t), y = b * st * Math.sin(t), z = c + cz * Math.cos(t); if (Math.sqrt(x * x + y * y + z * z) > R0) lo = t; else hi = t; }
        var tt = (lo + hi) / 2; pts.push(new THREE.Vector3(a * ct * Math.sin(tt), b * st * Math.sin(tt), c + cz * Math.cos(tt)).multiplyScalar(1.004));
      }
      return new THREE.CatmullRomCurve3(pts, true);
    }

    /* body */
    var torso = mesh(ellipsoid(0.58, 0.609, 0.545, 80), M.torso); torso.position.y = 0.72; hover.add(torso);
    var chan = mesh(new THREE.TorusGeometry(0.583, 0.012, 8, 120), M.metal); chan.rotation.x = Math.PI / 2; chan.scale.set(1, 0.94, 1); chan.position.y = 0.66; hover.add(chan);
    var waist = glowMesh(new THREE.TorusGeometry(0.594, 0.006, 6, 120), M.line); waist.rotation.x = Math.PI / 2; waist.scale.set(1, 0.94, 1); waist.position.y = 0.66; hover.add(waist);
    var logoMat = new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, opacity: 0 });
    var logo = new THREE.Mesh(new THREE.SphereGeometry(0.586, 32, 16, Math.PI / 2 - 0.27, 0.54, 1.19, 0.44), logoMat);
    logo.scale.set(1, 1.05, 0.94); logo.position.y = 0.72; logo.userData.noGlow = true; hover.add(logo);
    new THREE.TextureLoader().load(ROOT + 'assets/img/logo-plane.png', function (t) { t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO; logoMat.map = t; logoMat.opacity = 1; logoMat.needsUpdate = true; });
    [-1, 1].forEach(function (s) {
      var port = mesh(new THREE.CircleGeometry(0.07, 32), M.metal); port.position.set(s * 0.579, 0.74, 0); port.rotation.y = s * Math.PI / 2; hover.add(port);
      var pl = glowMesh(new THREE.CircleGeometry(0.022, 20), M.ring); pl.position.set(s * 0.582, 0.74, 0); pl.rotation.y = s * Math.PI / 2; hover.add(pl);
    });
    var thrRing = mesh(new THREE.TorusGeometry(0.2, 0.022, 10, 48), M.metal); thrRing.rotation.x = Math.PI / 2; thrRing.position.y = 0.13; hover.add(thrRing);
    var thr = glowMesh(new THREE.TorusGeometry(0.17, 0.012, 8, 48), M.glow); thr.rotation.x = Math.PI / 2; thr.position.y = 0.12; hover.add(thr);
    var thrCore = glowMesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshBasicMaterial({ color: 0x2f64d0, toneMapped: false })); thrCore.rotation.x = Math.PI / 2; thrCore.position.y = 0.118; hover.add(thrCore);
    var flame = glowMesh(new THREE.ConeGeometry(0.15, 1, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide }));
    flame.geometry.rotateX(Math.PI); flame.geometry.translate(0, -0.5, 0); flame.scale.set(1, 0.001, 1); flame.position.y = 0.12; hover.add(flame);
    var neck = mesh(lathe([[0, -0.065], [0.13, -0.065, 0.03], [0.13, -0.012, 0.004], [0.121, 0, 0.004], [0.13, 0.012, 0.004], [0.13, 0.065, 0.03], [0, 0.065]], 48), M.metal); neck.position.y = 1.37; hover.add(neck);
    var neckRing = glowMesh(new THREE.TorusGeometry(0.136, 0.006, 6, 48), M.line); neckRing.rotation.x = Math.PI / 2; neckRing.position.y = 1.37; hover.add(neckRing);
    /* hands: mitten with a thumb, left one mirrored */
    var palm = ellipsoid(0.13, 0.165, 0.125, 40), thumb = ellipsoid(0.055, 0.075, 0.055, 28); thumb.translate(-0.1, 0.03, 0.055);
    [palm, thumb].forEach(function (g) { handR.add(mesh(g, M.shell)); var l = mesh(g, M.shell); l.scale.x = -1; handL.add(l); });
    [handL, handR].forEach(function (h) { var wr = glowMesh(new THREE.TorusGeometry(0.1, 0.009, 6, 36), M.line); wr.rotation.x = Math.PI / 2; wr.scale.set(1, 0.85, 1); wr.position.y = 0.12; h.add(wr); });
    /* head */
    head.add(mesh(new THREE.SphereGeometry(0.7, 80, 60), M.shell));
    var crown = new THREE.TorusGeometry(0.7015, 0.0035, 6, 140, THREE.MathUtils.degToRad(200)); crown.rotateZ(THREE.MathUtils.degToRad(-58)); crown.rotateY(Math.PI / 2); head.add(glowMesh(crown, M.line));
    head.add(mesh(new THREE.TubeGeometry(bezelCurve(), 180, 0.02, 10, true), M.metal));
    var visor = mesh(new THREE.SphereGeometry(1, 60, 44), M.visor); visor.scale.set(0.52, 0.405, 0.39); visor.position.z = 0.385; head.add(visor);
    var earGeo = lathe([[0, 0], [0.215, 0, 0.02], [0.215, 0.2, 0.055], [0.168, 0.2, 0.01], [0.168, 0.236, 0.012], [0.096, 0.236, 0.004], [0.09, 0.226, 0.003], [0, 0.226]], 72);
    earGeo.rotateZ(-Math.PI / 2); earGeo.translate(0.56, 0, 0);
    var fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.05, 0.24); fin.quadraticCurveTo(0.08, 0.33, 0.17, 0.31); fin.lineTo(0.13, 0.02); fin.closePath();
    var finGeo = new THREE.ExtrudeGeometry(fin, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 8 }); finGeo.translate(0, 0, -0.011); finGeo.rotateY(Math.PI / 2);
    [1, -1].forEach(function (s) {
      var e = mesh(earGeo, M.shell); if (s < 0) e.scale.x = -1; head.add(e);
      var ring = glowMesh(new THREE.TorusGeometry(0.148, 0.012, 10, 56), M.ring); ring.rotation.y = Math.PI / 2; ring.position.x = s * 0.797; head.add(ring);
      var lens = glowMesh(new THREE.CircleGeometry(0.086, 32), M.ring); lens.rotation.y = s * Math.PI / 2; lens.position.x = s * 0.788; head.add(lens);
      var ar = glowMesh(new THREE.TorusGeometry(0.283, 0.0035, 6, 90), M.line); ar.position.x = s * 0.642; ar.rotation.y = Math.PI / 2; head.add(ar);
      var f = mesh(finGeo, M.shell); f.position.set(s * 0.74, 0.13, -0.02); f.rotation.x = -0.25; if (s < 0) f.scale.x = -1; head.add(f);
      var tip = glowMesh(new THREE.SphereGeometry(0.022, 12, 10), M.line); tip.position.set(s * 0.74, 0.39, -0.26); head.add(tip);
    });
    var mic = new THREE.CatmullRomCurve3([new THREE.Vector3(0.74, -0.05, 0.08), new THREE.Vector3(0.71, -0.3, 0.37), new THREE.Vector3(0.47, -0.45, 0.58), new THREE.Vector3(0.25, -0.47, 0.66)]);
    head.add(mesh(new THREE.TubeGeometry(mic, 48, 0.016, 8, false), M.metal));
    var micTip = glowMesh(new THREE.SphereGeometry(0.04, 16, 12), M.ring); micTip.position.copy(mic.getPoint(1)); head.add(micTip);
    /* face */
    var SHAPES = ['open', 'happy', 'star', 'line', 'big', 'heart', 'x'];
    var G = { open: new THREE.ShapeGeometry(roundRect(0.125, 0.235, 0.062), 12), happy: new THREE.TorusGeometry(0.068, 0.024, 10, 28, Math.PI),
      star: new THREE.ShapeGeometry(star(0.115, 0.036, 4)), line: new THREE.ShapeGeometry(roundRect(0.16, 0.04, 0.02), 8), big: new THREE.RingGeometry(0.058, 0.104, 40),
      heart: new THREE.ShapeGeometry(heartShape(0.1), 12), x: crossGeo(0.2, 0.045) };
    var eyes = [];
    [-1, 1].forEach(function (s) {
      var g = new THREE.Group(); g.position.set(s * 0.19, 0.045, 0.756); g.rotation.y = s * 0.29; head.add(g);
      var p = { g: g, bx: s * 0.19 };
      SHAPES.forEach(function (k) { var m = glowMesh(G[k], k === 'heart' ? M.heart : M.eye); m.visible = false; g.add(m); p[k] = m; });
      p.happy.position.y = -0.03; eyes.push(p);
    });
    var blushMat = new THREE.MeshBasicMaterial({ color: 0xff8fb8, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    [-1, 1].forEach(function (s) { var b = glowMesh(new THREE.CircleGeometry(0.05, 24), blushMat); b.scale.set(1.5, 0.8, 1); b.position.set(s * 0.3, -0.13, 0.69); b.rotation.y = s * 0.52; head.add(b); });
    var mouth = new THREE.Group(); mouth.position.set(0, -0.19, 0.738); mouth.rotation.x = 0.47; head.add(mouth);
    var smile = glowMesh(new THREE.TorusGeometry(0.055, 0.013, 8, 24, Math.PI), M.eye); smile.rotation.z = Math.PI; mouth.add(smile);
    var mouthO = glowMesh(new THREE.TorusGeometry(0.03, 0.011, 8, 20), M.eye); mouth.add(mouthO);
    var eq = []; for (var qi = 0; qi < 5; qi++) { var bar = glowMesh(new THREE.BoxGeometry(0.017, 0.06, 0.006), M.eye); bar.position.x = (qi - 2) * 0.03; mouth.add(bar); eq.push(bar); }

    /* a faint blue aura so the white shell reads on the white hero. It lives in world space, not in the
       robot, so spins and flips never swing it in front: it always sits behind Nexi. No shadow: Nexi floats. */
    function softTex(inner, mid) { return canvasTex(128, 128, function (g) { var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(0.55, mid); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); }
    var aura = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: softTex('rgba(111,160,245,.2)', 'rgba(111,160,245,.06)'), transparent: true, depthWrite: false, toneMapped: false }));
    aura.userData.noGlow = true; aura.renderOrder = -1; scene.add(aura);

    /* sparkle trail from the thruster while flying */
    var SPK = 40, spkPos = new Float32Array(SPK * 3), spk = [];
    for (var sk = 0; sk < SPK; sk++) spk.push({ life: 0, i: sk, v: new THREE.Vector3() });
    var spkGeo = new THREE.BufferGeometry(); spkGeo.setAttribute('position', new THREE.BufferAttribute(spkPos, 3));
    var dotTex = canvasTex(64, 64, function (g) { var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(170,205,255,.7)'); gr.addColorStop(1, 'rgba(90,140,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    var sparkles = new THREE.Points(spkGeo, new THREE.PointsMaterial({ size: 0.16, map: dotTex, color: 0x9cc6ff, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
    scene.add(sparkles); var spkNext = 0, spkAt = 0;

    /* ---------- state ---------- */
    var Sp = { x: new Spring(0.68, 0.9), y: new Spring(0.68, 0.9), z: new Spring(0.45, 0.95), ly: new Spring(1.5, 0.95), lp: new Spring(1.5, 0.95),
      nod: new Spring(2.4, 0.8), tilt: new Spring(2, 0.8), yb: new Spring(2.2, 0.75), sq: new Spring(3, 0.55), bank: new Spring(1.3, 0.8), yaw: new Spring(1, 0.95),
      hLx: new Spring(2.4, 0.75), hLy: new Spring(2.4, 0.75), hLz: new Spring(2.4, 0.75), hRx: new Spring(2.6, 0.72), hRy: new Spring(2.6, 0.72), hRz: new Spring(2.6, 0.72), hRr: new Spring(3, 0.7),
      talk: new Spring(6, 1), boost: new Spring(3, 0.9), roll: new Spring(1.6, 0.85) };
    var R = { tx: 0, ty: 0, tz: 0, look: null, lookUntil: -1, eyes: 'open', eyeFrom: 'open', eyeT0: -9, mouth: 'smile', exprUntil: Infinity, clips: [], blinkAt: 2, blinkT0: -9,
      humUntil: -1, blushUntil: -1, task: null, lastTask: '', cardOpen: false, entered: false };
    var EXPR = { idle: ['open', 'smile'], happy: ['happy', 'smile'], star: ['star', 'smile'], content: ['line', 'smile'], wow: ['big', 'o'],
      love: ['heart', 'smile'], dizzy: ['x', 'o'] };
    function expr(n, dur) { var e = EXPR[n] || EXPR.idle; if (e[0] !== R.eyes) { R.eyeFrom = R.eyes; R.eyes = e[0]; R.eyeT0 = time; } R.mouth = e[1]; R.exprUntil = dur ? time + dur : Infinity; }
    var CLIPS = {
      wave: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.18, 0.22); O.hRy += 0.78 * e; O.hRx += 0.1 * e; O.hRz += 0.24 * e; O.hRr += Math.sin(p * Math.PI * 8) * 0.5 * e; O.tilt += 0.1 * e; } },
      hop: { dur: 0.7, fn: function (p, O) { if (p < 0.25) O.sq -= 0.08 * bell(p / 0.25); else { var q = (p - 0.25) / 0.75; O.yb += bell(q) * 0.2; O.sq += 0.05 * bell(q); } } },
      nod: { dur: 1, fn: function (p, O) { O.nod += Math.sin(p * Math.PI * 2) * 0.18 * env(p, 0.1, 0.2); } },
      spin: { dur: 1.4, fn: function (p, O) { O.spin += ease(p) * Math.PI * 2; O.yb += bell(p) * 0.25; O.hLy += bell(p) * 0.25; O.hRy += bell(p) * 0.25; } },
      flip: { dur: 1.5, fn: function (p, O) { if (p < 0.18) O.sq -= 0.16 * ease(p / 0.18); else if (p < 0.85) { var q = (p - 0.18) / 0.67; O.yb += bell(q) * 0.9; O.flip -= ease(q) * Math.PI * 2; O.hLy += 0.7; O.hRy += 0.7; } else O.sq -= 0.15 * bell((p - 0.85) / 0.15); } },
      point: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.2, 0.25); O.hRx += 0.4 * e; O.hRy += 0.25 * e; O.hRz += 0.55 * e; O.nod += 0.1 * e; } },
      pointL: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.2, 0.25); O.hLx -= 0.4 * e; O.hLy += 0.25 * e; O.hLz += 0.55 * e; O.nod += 0.1 * e; } },
      celebrate: { dur: 1.7, fn: function (p, O) { var j = Math.abs(Math.sin(p * Math.PI * 2)); O.yb += j * 0.26; O.sq += (j - 0.4) * 0.06; var e = env(p, 0.1, 0.2); O.hLy += 0.82 * e; O.hRy += 0.82 * e; O.hLx -= 0.14 * e; O.hRx += 0.14 * e; } },
      think: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.2, 0.2); O.tilt += 0.16 * e; O.nod -= 0.1 * e; O.hRx -= 0.4 * e; O.hRy += 0.5 * e; O.hRz += 0.4 * e; } },
      clap: { dur: 1.3, fn: function (p, O) { var e = env(p, 0.2, 0.2), c = (Math.sin(p * Math.PI * 10) + 1) / 2; O.hLx += (0.6 - 0.12 * c) * e; O.hRx -= (0.6 - 0.12 * c) * e; O.hLy += 0.36 * e; O.hRy += 0.36 * e; O.hLz += 0.36 * e; O.hRz += 0.36 * e; } },
      curious: { dur: 1.4, fn: function (p, O) { O.tilt += 0.18 * env(p, 0.2, 0.3); } },
      hum: { dur: 3.4, fn: function (p, O) { var e = env(p, 0.1, 0.15), s = Math.sin(p * Math.PI * 6); O.tilt += s * 0.12 * e; O.hLy += Math.max(0, s) * 0.28 * e; O.hRy += Math.max(0, -s) * 0.28 * e; } },
      stretch: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.3, 0.3); O.hLy += 2.1 * e; O.hRy += 2.1 * e; O.hLx += 0.42 * e; O.hRx -= 0.42 * e; O.sq += 0.08 * e; O.nod -= 0.25 * e; } },
      surf: { dur: 4.2, fn: function (p, O) { var e = env(p, 0.15, 0.15); O.hLx -= 0.25 * e; O.hRx += 0.25 * e; O.hLy += 0.5 * e; O.hRy += 0.5 * e; O.tilt += Math.sin(p * Math.PI * 4) * 0.12 * e; } },
      tug: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.12, 0.18), c = (1 - Math.cos(p * Math.PI * 6)) / 2; O.hRx += (0.5 - c * 0.18) * e; O.hLx += (0.62 - c * 0.18) * e; O.hRy += 0.12 * e; O.hLy += 0.1 * e; O.tilt -= (0.08 + c * 0.1) * e; O.sq += c * 0.05 * e; } },
      peek: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.25, 0.3); O.nod += 0.1 * e; O.hRy += 0.6 * e; O.hRz += 0.25 * e; O.hRr += Math.sin(p * Math.PI * 7) * 0.35 * e; O.tilt -= 0.15 * e; } },
      /* the stage clips: knocking on the glass, acting cute, presenting, and the over-reactions */
      tap: { dur: 0.9, fn: function (p, O) { var e = env(p, 0.22, 0.3), t = bell(clamp((p - 0.28) / 0.4, 0, 1)); O.hRy += 0.5 * e; O.hRx -= 0.18 * e; O.hRz += (0.14 + 0.3 * t) * e; O.hRr -= 0.25 * e; O.nod -= 0.06 * e; } },
      knock: { dur: 1.4, fn: function (p, O) { var e = env(p, 0.14, 0.2), t = Math.max(0, Math.sin(clamp((p - 0.12) / 0.76, 0, 1) * Math.PI * 3)); O.hRy += 0.62 * e; O.hRx -= 0.28 * e; O.hRz += (0.22 + 0.34 * t) * e; O.hRr -= 0.3 * e; O.nod -= 0.05 * e; O.tilt += 0.06 * e; O.sq -= t * 0.015 * e; } },
      cute: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.15, 0.2), s = Math.sin(p * Math.PI * 4); O.tilt += (0.22 + s * 0.07) * e; O.hLx += 0.3 * e; O.hRx -= 0.3 * e; O.hLy += 0.6 * e; O.hRy += 0.6 * e; O.hLz += 0.3 * e; O.hRz += 0.3 * e; O.sq += s * 0.03 * e; O.nod += 0.08 * e; } },
      present: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.2, 0.25); O.hLx -= 0.34 * e; O.hLy += 0.44 * e; O.hRx += 0.34 * e; O.hRy += 0.44 * e; O.hLz += 0.2 * e; O.hRz += 0.2 * e; O.tilt += 0.06 * e; O.nod -= 0.05 * e; } },
      gasp: { dur: 1.4, fn: function (p, O) { var e = env(p, 0.07, 0.35); O.sq -= 0.12 * bell(clamp(p / 0.14, 0, 1)); O.yb += 0.34 * e; O.nod -= 0.22 * e; O.hLy += 0.8 * e; O.hRy += 0.8 * e; O.hLx += 0.34 * e; O.hRx -= 0.34 * e; O.hLz += 0.36 * e; O.hRz += 0.36 * e; } },
      wiggle: { dur: 1.4, fn: function (p, O) { var e = env(p, 0.1, 0.2), s = Math.sin(p * Math.PI * 12); O.tilt += s * 0.22 * e; O.spin += s * 0.18 * e; O.hLy += (0.5 + s * 0.2) * e; O.hRy += (0.5 - s * 0.2) * e; O.sq += Math.abs(s) * 0.04 * e; } },
      bigjump: { dur: 1.25, fn: function (p, O) { if (p < 0.2) O.sq -= 0.2 * ease(p / 0.2); else if (p < 0.85) { var q = (p - 0.2) / 0.65, b = bell(q); O.yb += b * 1.3; O.sq += 0.1 * b; O.hLy += 1.1 * b; O.hRy += 1.1 * b; O.hLx -= 0.2 * b; O.hRx += 0.2 * b; O.spin += ease(q) * Math.PI * 2; } else O.sq -= 0.18 * bell((p - 0.85) / 0.15); } },
      faint: { dur: 2.6, fn: function (p, O) { var f = p < 0.3 ? ease(p / 0.3) : p < 0.68 ? 1 : 1 - ease((p - 0.68) / 0.32); O.roll += 1.05 * f; O.flip -= 0.22 * f; O.yb -= 0.3 * f; O.hLy += 0.95 * f; O.hRy += 0.95 * f; O.hLx -= 0.32 * f; O.hRx += 0.32 * f; O.tilt += 0.18 * f + Math.sin(p * Math.PI * 6) * 0.07 * f; if (p > 0.68) O.sq += 0.09 * bell((p - 0.68) / 0.32); } }
    };
    function play(n) { var c = CLIPS[n]; if (c) R.clips.push({ t0: time, dur: c.dur, fn: c.fn }); }

    /* ---------- layout: hero pixels <-> world ---------- */
    var heroRect = hero.getBoundingClientRect();
    function resize() {
      heroRect = hero.getBoundingClientRect();
      W = Math.max(1, hero.clientWidth); H = Math.max(1, hero.clientHeight);

      S = H / (2 * CAMZ * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      SIZE = LITE ? clamp(W * 0.28, 88, 124) : clamp(H * 0.17, 108, 150);
      bot.scale.setScalar(SIZE / (2.65 * S));
      /* the canvas is only a window around Nexi (3x its size) that travels with it, not the whole
         hero: about a fifth of the pixels to render and composite every frame. The close-up on the
         Nexi slide needs a bigger window, used only while Nexi is that near (setView) */
      VIEW_S = Math.round(SIZE * 3);
      VIEW_B = Math.min(Math.round(SIZE * 6.4), Math.round(Math.max(W, H) * 1.2));
      camera.aspect = W / H; camera.updateProjectionMatrix();
      setView(VBIG, true);
      hit.style.width = (SIZE * 0.72) + 'px'; hit.style.height = SIZE + 'px';
    }
    var VIEW_S = 450, VIEW_B = 780, VBIG = false;
    function setView(big, force) {
      if (big === VBIG && !force) return;
      VBIG = big; VIEW = big ? VIEW_B : VIEW_S;
      var pr = big ? Math.min(PR, LITE ? 1 : 1.25) : PR;
      renderer.setPixelRatio(pr); renderer.setSize(VIEW, VIEW, false); cv.style.width = cv.style.height = VIEW + 'px';
      Glow.size(VIEW * pr, VIEW * pr, big); glowFresh = false;
    }
    function rectOf(el) { var r = el.getBoundingClientRect(); heroRect = hero.getBoundingClientRect(); return { x: r.left - heroRect.left, y: r.top - heroRect.top, w: r.width, h: r.height, cx: r.left - heroRect.left + r.width / 2, cy: r.top - heroRect.top + r.height / 2 }; }
    function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; }
    var TABS = LITE ? 0 : 72; /* the fixed side tabs cover the right edge of the hero (on phones they are round buttons at the bottom) */

    /* Nexi never parks on text or buttons. obstacles() lists the text runs, links, buttons and controls
       of the visible slide (refreshed every 0.35 s); goTo() moves each target to the nearest spot
       where Nexi's box touches none of them. */
    var WORDY = (function () { try { return new RegExp('[\\p{L}\\p{N}]', 'u'); } catch (e) { return /[A-Za-z0-9\u00C0-\u024F\u0370-\u1FFF\u3040-\uD7AF]/; } })();
    var OBS = [], obsAt = -9, OBS_SEL = 'a,button,input,select,textarea,label,.btn,[role="button"],[tabindex]';
    var rg = document.createRange();
    function shown(el) { return !el.checkVisibility || el.checkVisibility({ opacityProperty: true, visibilityProperty: true }); }
    /* a box inside a scrolling frame (the sample website on slide 4) counts only where it shows */
    function clipIn(r, el, scr, sr) {
      if (!sr || !el || !scr.contains(el)) return r;
      var L = Math.max(r.left, sr.left), T = Math.max(r.top, sr.top), Rr = Math.min(r.right, sr.right), B = Math.min(r.bottom, sr.bottom);
      return { left: L, top: T, right: Rr, bottom: B, width: Rr - L, height: B - T };
    }
    /* roaming, the list is refreshed about three times a second; on a Nexi stage her spots come from the script
       and are placed when cued (cue() asks for a fresh list), so once a second is plenty there */
    var freeDirty = true, scanQ = false;
    function obsEvery() { return ST && ST.on ? 1 : 0.35; }
    /* the list is refreshed by a task queued right after the frame that found it due (the layout is clean then,
       so reading boxes costs no extra layout); a caller inside a frame gets the list as it is. Only a missing or a
       very stale list (a cue asks for a fresh one) is scanned on the spot. */
    function obstacles() {
      var age = time - obsAt, every = obsEvery();
      if (age < every) return OBS;
      if (age < every * 4) { if (!scanQ) { scanQ = true; setTimeout(function () { scanQ = false; if (time - obsAt >= obsEvery()) scan(); }, 0); } return OBS; }
      scan(); return OBS;
    }
    function scan() {
      obsAt = time; OBS = []; freeDirty = true;
      var hr = hero.getBoundingClientRect();
      function add(r, pad) {
        if (r.width < 2 || r.height < 2) return;
        var x = r.left - hr.left, y = r.top - hr.top;
        if (x > W || y > H || x + r.width < 0 || y + r.height < 0) return;
        OBS.push([x - pad, y - pad, x + r.width + pad, y + r.height + pad]);
      }
      var slide = active(), scr = slide && slide.querySelector('.nxh-scroll'), sr = scr && scr.getBoundingClientRect();
      [slide, hero.querySelector('.hero-ctl')].forEach(function (root) {
        if (!root) return;
        root.querySelectorAll(OBS_SEL).forEach(function (el) { var r = el.getBoundingClientRect(); if (r.width * r.height < W * H * 0.2 && shown(el)) add(clipIn(r, el, scr, sr), 8); });
        /* words only: a glyph with no letter or digit (the comic sky's ✦ twinkles, ★, ♪) is decoration, not text to keep
           readable, so she never fades for one */
        var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return WORDY.test(n.nodeValue) ? 1 : 3; } }), n;
        while ((n = tw.nextNode())) { var el = n.parentElement; if (!el || !shown(el)) continue; rg.selectNodeContents(n); add(clipIn(rg.getBoundingClientRect(), el, scr, sr), 6); }
      });
      var mq = hero.querySelector('.hero-marquee'); if (mq) add(mq.getBoundingClientRect(), 4);
      var hd = document.querySelector('[data-header]'); if (hd) add(hd.getBoundingClientRect(), 4);
      return OBS;
    }
    /* the free spots, built from the current list only when something asks for them */
    function freeSpots() { if (freeDirty) { freeDirty = false; buildFree(); } return FREE; }
    /* every spot (on a 24 px grid) where Nexi's box touches no text or button */
    var FREE = [], GRID = 24;
    function buildFree() {
      FREE = [];
      var x0 = SIZE * 0.42, x1 = W - TABS - SIZE * 0.45, y0 = SIZE * 0.62, y1 = H - SIZE * 0.55 - 8;
      for (var y = y0; y <= y1; y += GRID) for (var x = x0; x <= x1; x += GRID) if (!hits(box(x, y, 2.2))) FREE.push(x, y);
    }
    function hits(b) {
      for (var i = 0; i < OBS.length; i++) { var r = OBS[i]; if (b[0] < r[2] && b[2] > r[0] && b[1] < r[3] && b[3] > r[1]) return true; }
      return false;
    }
    function box(x, y, z) { var k = CAMZ / Math.max(4, CAMZ - (z || 0)), hw = SIZE * 0.4 * k, hh = SIZE * 0.52 * k; return [x - hw, y - hh, x + hw, y + hh]; }
    function overlap(b) {
      var o = obstacles(), a = 0;
      for (var i = 0; i < o.length; i++) { var r = o[i], ix = Math.min(b[2], r[2]) - Math.max(b[0], r[0]), iy = Math.min(b[3], r[3]) - Math.max(b[1], r[1]); if (ix > 0 && iy > 0) a += ix * iy; }
      return a;
    }
    var lastSpot = null;
    function free(x, y, z) {
      obstacles();
      if (!overlap(box(x, y, z))) return (lastSpot = [x, y]);
      var best = null, bd = Infinity; freeSpots();
      for (var i = 0; i < FREE.length; i += 2) { var dx = FREE[i] - x, dy = (FREE[i + 1] - y) * 1.3, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      if (best == null) return [x, y];
      if (lastSpot && !overlap(box(lastSpot[0], lastSpot[1], z))) {
        var lx = lastSpot[0] - x, ly = (lastSpot[1] - y) * 1.3;
        if (Math.sqrt(lx * lx + ly * ly) < Math.sqrt(bd) + 80) return lastSpot;
      }
      return (lastSpot = [FREE[best], FREE[best + 1]]);
    }
    /* targets are screen spots; Nexi flies in the z=0 plane, so a spot at depth z projects by k */
    function depthK(z) { return CAMZ / Math.max(4, CAMZ - (z || 0)); }
    function toScreen(px, py, z) { var k = depthK(z); return [W / 2 + (px - W / 2) * k, H / 2 + (py - H / 2) * k]; }
    /* place(): hold a screen spot while the depth changes. The plane target is re-solved every frame from the
       current depth, so zooming toward the screen never drifts Nexi sideways over the content. */
    /* the nearest free spot (to the given screen point) with a clear bubble area above it on either side */
    function roomySpot(x, y) {
      obstacles();
      var bw = 250, bh = 56, best = null, bd = Infinity; freeSpots();
      for (var i = 0; i < FREE.length; i += 2) {
        var fx = FREE[i], fy = FREE[i + 1], top = fy - SIZE * 0.6 - bh;
        if (top < 8) continue;
        var right = [fx + SIZE * 0.2, top, fx + SIZE * 0.2 + bw, top + bh], left = [fx - SIZE * 0.2 - bw, top, fx - SIZE * 0.2, top + bh];
        var okR = right[2] < W - TABS && !hits(right), okL = left[0] > 8 && !hits(left);
        if (!okR && !okL) continue;
        var d = (fx - x) * (fx - x) + (fy - y) * (fy - y) * 1.3;
        if (d < bd) { bd = d; best = [fx, fy]; }
      }
      return best;
    }
    /* a little trail of arrows from Nexi to an element (points the way when Nexi cannot get close) */
    function arrowsTo(el) {
      var h = botPx(), r = rectOf(el), k = depthK(R.tz);
      for (var i = 0; i < 4; i++) (function (n) {
        setTimeout(function () {
          var e = document.createElement('i'); e.textContent = '→';
          e.style.setProperty('--x0', (h.x + SIZE * 0.4 * k) + 'px'); e.style.setProperty('--y0', (h.y - SIZE * 0.15) + 'px');
          e.style.setProperty('--x1', (r.x - 18) + 'px'); e.style.setProperty('--y1', (r.cy - 14) + 'px'); e.style.setProperty('--r', '0deg');
          fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1700);
        }, n * 260);
      })(i);
    }
    function askTab() {
      var t = document.querySelector('.side-tab.nexi-tab');
      if (!t || document.body.classList.contains('talk-open')) return null;
      var r = t.getBoundingClientRect(), hr = hero.getBoundingClientRect();
      if (!r.width || r.top < hr.top + SIZE * 0.3 || r.bottom > hr.bottom - SIZE * 0.3) return null;
      return t;
    }
    function place(sx, sy, z) { R.tz = z; R.lock = { sx: sx, sy: sy }; }
    /* the right-most point of either hand on screen, in px: the palm's edge (0.13 wide) taken both ways, so it holds
       whichever way the body has turned */
    function handFront() {
      var best = -1e9, upp = 0;
      [handL, handR].forEach(function (h) {
        var a = [-0.13, 0.13].map(function (dx) { tmp3.set(dx, 0, 0); h.localToWorld(tmp3).project(camera); return (tmp3.x + 1) / 2 * W; });
        var f = Math.max(a[0], a[1]);
        if (f > best) { best = f; upp = 0.26 / Math.max(4, Math.abs(a[1] - a[0])); }
      });
      return { x: best, upp: upp };
    }
    /* The fourth-wall corner: Nexi comes right up to the screen at the left edge, half of it past the edge.
       Only where its close-up box (the visible part) covers no text or button; the right edge belongs to the
       side tabs. */
    var WALL_Z = 8;
    function cornerSpot() {
      obstacles();
      /* as far into view as the free space allows, but always at least about a third of Nexi showing */
      var k = depthK(WALL_Z), ys = [H * 0.74, H * 0.58, H * 0.42];
      for (var i = 0; i < ys.length; i++) {
        var y = clamp(ys[i], SIZE * 0.7 * k, H - SIZE * 0.6 * k - 8);
        for (var x = SIZE * 0.35; x >= -SIZE * 0.12 * k; x -= SIZE * 0.05) {
          var bx = box(x, y, WALL_Z);
          if (!hits([Math.max(0, bx[0]), bx[1], bx[2], bx[3]])) return { x: x, y: y };
        }
      }
      return null;
    }
    /* loose: allowed to peek past the left edge of the hero */
    function goTo(x, y, z, loose) {
      R.lock = null;
      R.tz = z == null ? 0 : z;
      var k = depthK(R.tz), m = SIZE * 0.55 * k, x0 = loose ? SIZE * 0.15 : m, x1 = W - TABS - m, y0 = SIZE * 0.62 * k, y1 = H - SIZE * 0.55 * k - 8;
      var f = free(clamp(x, x0, x1), clamp(y, y0, y1), R.tz);
      R.tx = W / 2 + (f[0] - W / 2) / k; R.ty = H / 2 + (f[1] - H / 2) / k;
    }
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function worldAt(px, py, z, out) {
      ndc.set(px / W * 2 - 1, -(py / H * 2 - 1)); ray.setFromCamera(ndc, camera);
      var t = (z - ray.ray.origin.z) / ray.ray.direction.z; return out.copy(ray.ray.origin).addScaledVector(ray.ray.direction, t);
    }
    var lookPt = new THREE.Vector3();
    function lookAtEl(el, sec) { if (!el) return; var r = rectOf(el); lookAtPx(r.cx, r.cy, sec); }
    function lookAtPx(px, py, sec) { worldAt(px, py, 2.5, lookPt); R.look = lookPt; R.lookUntil = time + (sec || 3); }

    /* ---------- floating emotes and ring pulses ---------- */
    function botPx() { tmp.copy(bot.position).project(camera); return { x: (tmp.x + 1) / 2 * W, y: (1 - tmp.y) / 2 * H }; }
    function emote(chars, n) {
      var h = botPx();
      for (var i = 0; i < (n || 1); i++) (function (k) {
        setTimeout(function () {
          var e = document.createElement('i'); e.textContent = Array.isArray(chars) ? pick(chars) : chars;
          var x0 = h.x + rand(-40, 40), y0 = h.y - SIZE * 0.55 + rand(-10, 10);
          e.style.setProperty('--x0', x0 + 'px'); e.style.setProperty('--y0', y0 + 'px');
          e.style.setProperty('--x1', (x0 + rand(-50, 50)) + 'px'); e.style.setProperty('--y1', (y0 - rand(70, 120)) + 'px'); e.style.setProperty('--r', rand(-30, 30) + 'deg');
          fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1700);
        }, k * 140);
      })(i);
    }
    /* speech bubbles: Nexi introduces itself, reacts to the hero and chatters. A bubble takes the first spot
       around Nexi that covers no text or button; if none is clear it tries a narrow two-line bubble (it fits
       the page margin), and failing that the spot that covers the least. */
    /* a bubble pops a little larger and (roaming) drifts 28 px up as it fades: never place one closer to the
       hero's top edge than that, or the hero clips it */
    var YMIN = 36;
    function word(text, life, optional, o) {
      o = o || {};
      /* one speech bubble at a time: a new line replaces the one still showing */
      [].forEach.call(fxEl.querySelectorAll('b'), function (old) { old.remove(); });
      var h = botPx(), k = depthK(Sp.z.x), e = document.createElement('b'); e.textContent = text;
      if (o.wide) e.classList.add('is-wide');
      fxEl.appendChild(e);
      /* Nexi's voice (nexi-voice.js, off until the visitor turns it on): lines she chooses to say out loud.
         The stage script speaks its own lines, so it passes silent */
      if (!optional && !o.silent && window.TNVoice && window.TNVoice.live) window.TNVoice.say(text);
      obstacles();
      /* on the stage a bubble may sit over the stage's own pictures, never over the copy, the step chips or
         the controls (in the close-up the copy is behind the veil, so only the header and controls count) */
      var SO = null;
      if (o.stage || ST.on) {
        /* [x0, y0, x1, y1, weight]: the copy's text and buttons, the step chips, the controls and the header are
           off limits (weight 1000); the stage's own pictures and Nexi herself are light (covered when nothing is free) */
        SO = []; var hr0 = hero.getBoundingClientRect(), sl0 = active(), scr0 = sl0 && sl0.querySelector('.nxh-scroll'), sr0 = scr0 && scr0.getBoundingClientRect();
        var pushR = function (q3, pad, wt) { if (q3.width > 2 && q3.height > 2) SO.push([q3.left - hr0.left - pad, q3.top - hr0.top - pad, q3.right - hr0.left + pad, q3.bottom - hr0.top + pad, wt]); };
        var addR = function (el, pad, wt) { if (el) pushR(clipIn(el.getBoundingClientRect(), el, scr0, sr0), pad, wt); };
        if (ST.spot !== 'close' && sl0) {
          var cp = sl0.querySelector('.slide-copy');
          if (cp) {
            cp.querySelectorAll(OBS_SEL).forEach(function (el) { if (shown(el)) addR(el, 6, 1000); });
            var tw0 = document.createTreeWalker(cp, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return /\S/.test(n.nodeValue) ? 1 : 3; } }), tn;
            while ((tn = tw0.nextNode())) { if (!tn.parentElement || !shown(tn.parentElement)) continue; rg.selectNodeContents(tn); pushR(rg.getBoundingClientRect(), 6, 1000); }
          }
          addR(sl0.querySelector('.nxh-steps'), 4, 1000);
          addR(sl0.querySelector('.nxh-desk'), 0, 1);
          addR(sl0.querySelector('.nxh-tools'), 2, 1000); addR(sl0.querySelector('.nxh-bar'), 2, 1000); addR(sl0.querySelector('.nxh-ctx'), 2, 1000); addR(sl0.querySelector('.nxd-head'), 2, 1000);
          var web0 = sl0.querySelector('.nxh-web');
          if (web0) {
            web0.querySelectorAll(OBS_SEL).forEach(function (el) { if (shown(el)) addR(el, 4, 1000); });
            var tw1 = document.createTreeWalker(web0, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return /\S/.test(n.nodeValue) ? 1 : 3; } }), tn1;
            while ((tn1 = tw1.nextNode())) { if (!tn1.parentElement || !shown(tn1.parentElement)) continue; rg.selectNodeContents(tn1); pushR(clipIn(rg.getBoundingClientRect(), tn1.parentElement, scr0, sr0), 4, 1000); }
            addR(sl0.querySelector('.nxh-chat'), 4, 1000);
          }
        }
        addR(hero.querySelector('.hero-ctl-inner'), 4, 1000); addR(document.querySelector('[data-header]'), 4, 1000);
        var nb = box(h.x, h.y, Sp.z.x); SO.push([nb[0], nb[1], nb[2], nb[3], 30]);
      }
      function ov(b) {
        if (!SO) return overlap(b);
        var a = 0; for (var n = 0; n < SO.length; n++) { var r0 = SO[n], ix = Math.min(b[2], r0[2]) - Math.max(b[0], r0[0]), iy = Math.min(b[3], r0[3]) - Math.max(b[1], r0[1]); if (ix > 0 && iy > 0) a += ix * iy * r0[4]; }
        return a;
      }
      /* on the stage: scan rows above and beside her head for the freest spot, the nearest one winning a tie */
      function fitStage() {
        var w = e.offsetWidth || 96, hh = e.offsetHeight || 30, top = h.y - SIZE * 0.58 * k - hh, best = null, bestA = Infinity;
        var rows = [top, top - hh - 12, h.y - SIZE * 0.3 * k - hh, h.y - hh * 0.5, top - 2 * hh - 24, h.y + SIZE * 0.56 * k, h.y + SIZE * 0.56 * k + hh + 10];
        for (var ri = 0; ri < rows.length; ri++) {
          for (var x = h.x - w - SIZE * 0.3 * k; x <= h.x + SIZE * 0.5 * k; x += 16) {
            var cx = clamp(x, 8, W - TABS - w - 8), cy = clamp(rows[ri], YMIN, H - hh - 8);
            var a = ov([cx - 4, cy - 4, cx + w + 4, cy + hh + 4]) + Math.abs(cx + w / 2 - h.x) * 1.5 + Math.abs(cy - top) * 2 + ri * 40;
            if (a < bestA) { bestA = a; best = [cx, cy]; }
          }
        }
        return { at: best, a: 0 };
      }
      function fit() {
        var w = e.offsetWidth || 96, hh = e.offsetHeight || 30, top = h.y - SIZE * 0.6 * k - hh, pad = 4 + w * 0.06;
        var spots = [[h.x + SIZE * 0.22 * k, top], [h.x - SIZE * 0.22 * k - w, top], [h.x - w / 2, top - 6], [h.x - w / 2, top - hh - 14],
                     [h.x + SIZE * 0.46 * k, h.y - hh], [h.x - SIZE * 0.46 * k - w, h.y - hh], [h.x - w / 2, h.y + SIZE * 0.55 * k]];
        var best = null, bestA = Infinity;
        for (var i = 0; i < spots.length; i++) {
          var x = clamp(spots[i][0], 8, W - TABS - w), y = clamp(spots[i][1], YMIN, H - hh - 8), a = ov([x - pad, y - pad, x + w + pad, y + hh + pad]);
          if (a < bestA) { bestA = a; best = [x, y]; if (!a) break; }
        }
        return { at: best, a: bestA };
      }
      var f = SO ? fitStage() : fit();
      if (!SO && f.a > 0) { e.classList.add('is-narrow'); var g = fit(); if (g.a <= f.a) f = g; else e.classList.remove('is-narrow'); }
      if (optional && f.a > 0) { e.remove(); return null; }
      e.style.setProperty('--x', f.at[0].toFixed(0) + 'px'); e.style.setProperty('--y', f.at[1].toFixed(0) + 'px');
      if (life) e.style.animationDuration = life + 's';
      R.lastWord = time;
      setTimeout(function () { e.remove(); }, (life || 1.9) * 1000);
      return e;
    }
    var SAY = {
      hello: ['Hi, I’m Nexi!', 'Hello there!', 'Beep boop, hi!', 'Welcome to TechNext!'],
      idle: ['need a hand?', 'click me!', 'la la la ♪', 'so many apps…', 'one database ✓', 'just floating by', 'I’m TechNext’s AI buddy'],
      orbit: ['round and round!', 'all the apps!', 'one system ✓', 'wheee!'],
      inspect: ['ooh, this one!', 'nice app!', 'what does it do?'],
      token: ['an order! go go!', 'catch that order!', 'zoom zoom!'],
      gate: ['hmm… approved?', 'checking…', 'looks good!'],
      orb: ['go-live soon!', 'next phase!', 'almost there!'],
      headline: ['read this!', 'good point!', 'that’s us!'],
      cta: ['psst, try this!', 'click here!', 'this one →'],
      marquee: ['surf’s up!', 'so many apps!', 'wheee!'],
      rest: ['*stretch*', 'break time ♪', 'hmm hm hm ♪'],
      peek: ['peekaboo!', 'boo!', 'who’s there?'],
      trick: ['ta-da!', 'did you see?', 'one more?'],
      slide: ['ooh, new one!', 'next slide!', 'wheee!'],
      react: ['oh, hi!', 'what’s that?', 'I saw that!'],
      wall1: ['psst!', 'hey, you!', 'pssst… over here!'],
      wall2: ['Hi, I’m Nexi 👋', 'I see you!', 'hello, human!'],
      wall3: ['boop!', '*taps the glass*', 'is this thing on?'],
      wall4: ['you’re awesome!', 'need help? click me', 'I’m TechNext’s AI buddy'],
      bye: ['bye for now!', 'see you!', 'back to work!'],
      cheer: ['yay!', 'done ✓', 'woohoo!', 'next one!'],
      tab1: ['psst… see this tab?', 'look, Ask Nexi!', 'this one →'],
      tab2: ['come on… *pull*', 'hnngh! *tug*', 'heave-ho!'],
      tab3: ['tap Ask Nexi to chat!', 'ask me anything there →', 'I answer there, promise!']
    };
    /* talking: short three-line chats about Nexi, TechNext and Odoo (wording the site already uses), plus
       lines built from what the active slide is showing right now */
    var TALK = {
      self: [['Hi, I’m Nexi!', 'TechNext’s AI companion', 'tap me anytime 👋'],
             ['I’m a tiny AI robot', 'I fly around this page', 'and keep an eye on things'],
             ['want to chat with me?', 'my full self lives in Ask Nexi', 'the tab on the right →']],
      technext: [['TechNext is an Odoo Ready Partner', 'we set up Odoo for growing companies', 'Accounting, Sales, Inventory first'],
                 ['TechNext does Odoo, AI and websites', 'one team, discovery to support', 'pretty neat, huh?'],
                 ['clients in 10+ countries', 'teams in Singapore, the Philippines and Vietnam', 'hello from all of us!']],
      odoo: [['Odoo runs your whole business', 'on one database', 'no more spreadsheets!'],
             ['start with the apps you need', 'add the rest when you’re ready', 'it all stays connected'],
             ['with Odoo, nothing is typed twice', 'an order flows into the books', 'all by itself ✓']]
    };
    function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').replace(/[,.]\s*$/, '').trim() : ''; }
    function ctxTalk() {
      var sl = active(); if (!sl) return null;
      var opts = [];
      if (sl.querySelector('[data-cine]')) {
        var w = txt(sl.querySelector('.rot b.is-on')), hand = txt(sl.querySelector('[data-cine-hand]')), feed = txt(sl.querySelector('.cine-feed li span'));
        if (w) opts.push(['Run your ' + w + ' on one system!', 'that’s what Odoo does', 'and TechNext sets it up ✓']);
        if (+hand > 0) opts.push([hand + ' automatic hand-offs!', 'nobody typed them twice', 'that’s the Odoo magic ✨']);
        if (feed) opts.push(['“' + feed + '”', 'see? it just happens', 'one database ✓']);
        opts.push(['these apps share one database', 'spin the orbit, try it!', 'or click any app']);
      } else if (sl.querySelector('[data-pmap]')) {
        var fl = txt(sl.querySelector('[data-k="flight"]')), hd = txt(sl.querySelector('[data-k="hand"]')), sc = txt(sl.querySelector('.pm-scen [aria-pressed="true"]'));
        if (+fl > 0) opts.push([fl + ' orders in flight!', 'from lead to reconciled cash', 'across five departments']);
        if (+hd > 0) opts.push([hd + ' automatic hand-offs', 'zero typed twice ✓', 'Sales → Warehouse → Finance']);
        if (sc) opts.push(['showing: ' + sc, 'try another flow up top', 'every hand-off is live']);
        opts.push(['a quote becomes an order', 'the order reserves stock', 'then the invoice, then the cash!']);
      } else if (sl.querySelector('[data-nxs]')) {
        var ep = txt(sl.querySelector('[data-nxs-cap] b'));
        if (ep) opts.push(['now on air: ' + ep, 'that’s me in there!', 'one idea per episode ✓']);
        opts.push(['I have my own show!', 'Odoo, AI and tech', 'explained by me ✨']);
        opts.push(['new episodes Tue, Thu and Sat', 'tap one under the TV', 'I wear a new costume each time!']);
      } else if (sl.querySelector('[data-inds]')) {
        var ind = txt(sl.querySelector('.hxs-panel.is-on .h1-hand'));
        if (ind) opts.push(['now showing: ' + ind, 'that’s me in costume!', 'tap the screen to step inside']);
        opts.push(['eight industries, one Odoo', 'a costume for every one', 'pick a badge in the strip!']);
        opts.push(['clinics, kitchens, factories…', 'each runs Odoo its own way', 'hover a badge to switch ✓']);
      }
      return opts.length ? pick(opts) : null;
    }
    /* say(kind): a bubble from that pool, at most one every 3.2 s unless forced */
    function say(kind, force, life) {
      var list = SAY[kind]; if (!list || R.cardOpen) return;
      if (!force && time - (R.lastWord || -9) < 3.2) return;
      word(pick(list), life, !force);
    }
    /* a ripple on the "glass" where Nexi's hand touches it */
    function boop(ox, oy) {
      var h = botPx(), k = depthK(Sp.z.x), e = document.createElement('u'), d = SIZE * 0.42 * k;
      ox = ox == null ? 0.3 : ox; oy = oy == null ? -0.05 : oy;
      e.className = 'is-boop'; e.style.left = (h.x + SIZE * ox * k - d / 2) + 'px'; e.style.top = (h.y + SIZE * oy * k - d / 2) + 'px';
      e.style.width = e.style.height = d + 'px'; fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1500);
    }
    function ringAt(el) {
      if (!visible(el)) return; var r = rectOf(el), e = document.createElement('u');
      e.style.left = r.x + 'px'; e.style.top = r.y + 'px'; e.style.width = r.w + 'px'; e.style.height = r.h + 'px';
      fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1500);
    }

    /* ---------- what Nexi does: small tasks built from the hero's own elements ---------- */
    function active() { return hero.querySelector('.slide.is-active'); }
    function q(sel) { var s = active(); return s ? s.querySelector(sel) : null; }
    function qa(sel) { var s = active(); return s ? [].slice.call(s.querySelectorAll(sel)) : []; }
    var TASKS = {
      orbitApps: { w: function () { return visible(q('[data-cine]')) ? 3 : 0; }, run: function (T) {
        var el = q('.dash-wrap') || q('[data-cine]'), r = rectOf(el), a0 = rand(0, 6.28), dir = Math.random() < 0.5 ? 1 : -1;
        T.dur = 6; expr('happy', 2); play('surf'); T.at(1.2, function () { say('orbit'); });
        T.tick = function (p) { var a = a0 + dir * p * Math.PI * 2 * 0.9; goTo(r.cx + Math.cos(a) * (r.w * 0.5 + SIZE * 0.45), r.cy + Math.sin(a) * (r.h * 0.5 + SIZE * 0.3), Math.sin(a) * 3); lookAtPx(r.cx, r.cy, 0.5); };
      } },
      inspectApp: { w: function () { return qa('.cine-app').length ? 2 : 0; }, run: function (T) {
        var apps = qa('.cine-app').filter(visible), el = pick(apps); if (!el) return T.end();
        var r = rectOf(el), side = r.cx > W / 2 ? -1 : 1; goTo(r.cx + side * SIZE * 0.7, r.cy - SIZE * 0.1, 1.5);
        T.dur = 4.5; T.at(1.6, function () { lookAtEl(el, 2.6); play('curious'); expr('wow', 0.9); emote('?'); });
        T.at(2.7, function () { play(side > 0 ? 'pointL' : 'point'); expr('star', 1.4); emote(['✦', '✧'], 3); ringAt(el); say('inspect'); });
      } },
      chaseToken: { w: function () { return visible(q('[data-pmap]')) ? 3 : 0; }, run: function (T) {
        var map = q('[data-pmap]'), lock = null; T.dur = 7; expr('happy', 3); play('hum'); R.humUntil = time + 3.2; emote(['♪', '♫'], 2); T.at(1.4, function () { say('token'); });
        /* the token's box is read about five times a second (every frame forced a style pass after the scene
           had moved things); Nexi's springs smooth the steps */
        var rAt = -9, rr = null, mr = null;
        T.tick = function () {
          if (time - rAt < 0.2 && (rr || mr)) { if (rr) goTo(rr.cx, rr.cy - SIZE * 0.62, 1); else goTo(mr.cx + Math.sin(time) * mr.w * 0.3, mr.y + SIZE * 0.5, 0.5); return; }
          rAt = time; rr = mr = null;
          if (!lock || !lock.isConnected || !visible(lock)) { var toks = qa('.pm-tok').filter(visible); lock = toks.length ? pick(toks) : null; }
          if (lock) { rr = rectOf(lock); goTo(rr.cx, rr.cy - SIZE * 0.62, 1); lookAtPx(rr.cx, rr.cy, 0.5); }
          else { mr = rectOf(map); goTo(mr.cx + Math.sin(time) * mr.w * 0.3, mr.y + SIZE * 0.5, 0.5); }
        };
      } },
      watchGate: { w: function () { return qa('.pm-gate').length ? 1.4 : 0; }, run: function (T) {
        var el = pick(qa('.pm-gate').filter(visible)); if (!el) return T.end();
        var r = rectOf(el); goTo(r.cx + SIZE * 0.65, r.cy - SIZE * 0.3, 1); T.dur = 4.2;
        T.at(1.5, function () { lookAtEl(el, 2.4); play('think'); expr('content', 1.6); });
        T.at(3.2, function () { play('nod'); expr('happy', 1); ringAt(el); say('gate'); });
      } },
      cheerOrb: { w: function () { return visible(q('[data-inds]')) ? 3 : 0; }, run: function (T) {
        T.dur = 7; expr('happy', 2);
        var oAt = -9, orr = null;
        T.tick = function () {
          if (time - oAt >= 0.2 || !orr) { oAt = time; var orb = q('.lj-puck') || q('.lj-ptag'); if (!orb) return; orr = rectOf(orb); lookAtPx(orr.cx, orr.cy, 0.5); }
          goTo(orr.cx - SIZE * 0.8, orr.cy - SIZE * 0.35, 1);
        };
        T.at(2.2, function () { play('clap'); emote(['✦', '♪'], 2); say('orb'); });
      } },
      readHeadline: { w: function () { return q('.as-h1') ? 1 : 0; }, run: function (T) {
        var el = q('.as-h1'), r = rectOf(el), left = r.x > W * 0.45; goTo(left ? r.x - SIZE * 0.55 : r.x + r.w + SIZE * 0.5, r.y + SIZE * 0.3, 0.5);
        T.dur = 4.6; T.at(1.6, function () { lookAtEl(el, 2.8); play('think'); expr('content', 2); });
        T.at(3.4, function () { play('nod'); expr('happy', 1.2); var hl = q('.hl') || q('.rot b.is-on'); if (hl) { ringAt(hl); emote('✦'); } say('headline'); });
      } },
      pointCTA: { w: function () { return q('.actions .btn') ? 1.3 : 0; }, run: function (T) {
        var el = q('.actions .btn'), r = rectOf(el); goTo(r.x + r.w + SIZE * 0.55, r.y - SIZE * 0.2, 1.5);
        T.dur = 4.2; T.at(1.6, function () { lookAtEl(el, 2.4); play('pointL'); expr('happy', 2); ringAt(el); emote('!'); say('cta'); });
      } },
      surfMarquee: { w: function () { return visible(hero.querySelector('.hero-marquee')) ? 0.9 : 0; }, run: function (T) {
        var m = rectOf(hero.querySelector('.hero-marquee')), dir = Math.random() < 0.5 ? 1 : -1; T.dur = 5; play('surf'); expr('happy', 4); T.at(1, function () { say('marquee'); });
        T.tick = function (p) { goTo(dir > 0 ? lerp(SIZE, W - SIZE, p) : lerp(W - SIZE, SIZE, p), m.y - SIZE * 0.6, 1.5); };
      } },
      rest: { w: function () { return 1; }, run: function (T) {
        var spots = [[0.9, 0.3], [0.06, 0.76], [0.5, 0.86], [0.93, 0.8]], s = pick(spots); goTo(W * s[0], H * s[1], -1);
        T.dur = 5; T.at(1.8, function () { var c = pick(['stretch', 'hum', 'wave']); play(c); if (c === 'hum') { R.humUntil = time + 3; emote(['♪', '♫'], 3); } expr(c === 'wave' ? 'happy' : 'content', 2.2); say(c === 'wave' ? 'hello' : 'rest'); });
      } },
      peek: { w: function () { return 0.6; }, run: function (T) {
        var right = Math.random() < 0.5; goTo(right ? W : SIZE * 0.15, H * rand(0.35, 0.7), 2, !right);
        T.dur = 4; T.at(1.8, function () { play('peek'); expr('happy', 1.6); say('peek', true); });
      } },
      trick: { w: function () { return 0.5; }, run: function (T) { T.dur = 2.4; play(Math.random() < 0.5 ? 'flip' : 'spin'); expr('happy', 2); T.at(1.2, function () { emote(['✦', '✧'], 3); say('trick'); }); } },
      /* a little chat: three lines, face to the visitor, the mouth moving while it talks */
      talk: { w: function () { return 2.2; }, run: function (T) {
        var r = Math.random(), seq = r < 0.45 ? ctxTalk() : null;
        if (!seq) seq = pick(TALK[r < 0.65 ? 'self' : r < 0.85 ? 'technext' : 'odoo']);
        if (seq.join() === R.lastTalk) seq = pick(TALK.odoo);
        R.lastTalk = seq.join();
        var h = botPx(), room = roomySpot(h.x, h.y);
        if (room) goTo(room[0], room[1], 0.5);
        T.dur = 1.2 + seq.length * 2.05;
        R.look = camera.position; R.lookUntil = time + T.dur;
        var cur = null;
        seq.forEach(function (line, i) {
          T.at(1 + i * 2.05, function () {
            if (cur && cur.isConnected) cur.remove();
            cur = word(line, 2.15); R.humUntil = time + Math.min(1.6, 0.35 + line.length * 0.045);
            play(i === 0 ? 'wave' : pick(['nod', 'curious', 'hop'])); expr(pick(['happy', 'content', 'happy', 'star']), 1.6);
          });
        });
      } },
      /* points at the Ask Nexi tab, grabs it and tugs it a little, then tells the visitor to tap it */
      callTab: { w: function () { var t = askTab(); return t ? 1.3 : 0; }, run: function (T) {
        var t = askTab(); if (!t) return T.end();
        var r = rectOf(t), want = [W - TABS - SIZE * 0.5, clamp(r.cy, SIZE * 0.7, H - SIZE * 0.6)];
        goTo(want[0], want[1], 0.5);
        var at = toScreen(R.tx, R.ty, R.tz), near = Math.abs(at[0] - want[0]) < SIZE * 0.8 && Math.abs(at[1] - want[1]) < SIZE * 1.1;
        T.dur = near ? 8 : 5.4;
        T.at(1.6, function () { lookAtEl(t, 6); play('point'); expr('happy', 2); t.classList.add('is-called'); say('tab1', true, 2.1); });
        /* while she tugs, her leading hand stays on the tab and her body does the pulling: each frame she slides so the
           hand's front edge sits 4 px over the tab's real edge (turning to face it shortens her reach, and the comic
           tabs are a different width, so the reach is measured, never assumed; the tab's own tug moves the hand too) */
        var grip = false;
        T.tick = function () {
          R.gripOn = grip;
          if (!grip) return;
          var hf = handFront(), d = (rectOf(t).x + 4) - hf.x;
          /* the body closes most of the gap (it moves on a spring, so it lags the pulls); the hands take up the rest
             at once, so they stay on the tab while the body and the pose do the tugging */
          if (Math.abs(d) > 0.5) { var b = botPx(); place(b.x + d * 0.5, b.y, R.tz); }
          R.gripDx = clamp((R.gripDx || 0) + d * hf.upp * 0.8, -0.7, 0.7);
        };
        if (near) {
          T.at(3.4, function () { play('tug'); expr('content', 2); grip = true; if (!t.matches(':hover')) t.classList.add('is-tugged'); say('tab2', true, 2.1); });
          T.at(5.8, function () { grip = false; R.gripOn = false; var b = botPx(); goTo(b.x - SIZE * 0.2, b.y, R.tz); t.classList.remove('is-tugged'); play('wave'); play('hop'); expr('star', 1.6); emote(['✦', '→'], 2); say('tab3', true, 2.1); });
        } else {
          T.at(2.4, function () { arrowsTo(t); });
          T.at(3.6, function () { play('point'); expr('star', 1.4); arrowsTo(t); say('tab3', true, 2.1); });
        }
        T.at(T.dur - 0.2, function () { t.classList.remove('is-called', 'is-tugged'); });
      } },
      /* breaks the fourth wall: ducks behind the left edge, pops back in close to the screen looking at the
         visitor, waves, boops the glass, blushes, and ducks out again */
      fourthWall: { w: function () { return cornerSpot() ? 1.8 : 0; }, run: function (T) {
        var c = cornerSpot(); if (!c) return T.end();
        T.dur = 8.4;
        place(-SIZE * 0.9, c.y, 0); expr('content', 1.2);
        T.at(1.4, function () { place(c.x, c.y, WALL_Z); R.look = camera.position; R.lookUntil = time + 6.6; expr('wow', 0.9); say('wall1', true); });
        T.at(2.9, function () { play('wave'); expr('happy', 2.2); say('wall2', true, 2.2); });
        T.at(4.5, function () { play('point'); play('hop'); boop(); say('wall3', true); });
        T.at(5.9, function () { expr('happy', 2); R.blushUntil = time + 2.2; emote(['♥', '✦', '♥'], 3); say('wall4', true, 2.2); });
        T.at(7.4, function () { place(-SIZE * 0.9, c.y, 0); say('bye', true); });
      } }
    };
    var timersT = [];
    function startTask(name, extra) {
      timersT.length = 0;
      var T = { name: name, t0: time, dur: 4, tick: null, done: false,
        at: function (s, fn) { timersT.push({ at: time + s, fn: fn }); },
        end: function () { T.dur = 0; } };
      R.task = T; R.lastTask = name; R.gripOn = false;
      (extra || TASKS[name].run)(T);
    }
    function nextTask() {
      if (R.wallNext) { R.wallNext = false; if (TASKS.fourthWall.w()) { startTask('fourthWall'); return; } }
      var names = Object.keys(TASKS).filter(function (n) { return n !== R.lastTask; }), tot = 0, ws = {};
      names.forEach(function (n) { ws[n] = TASKS[n].w(); tot += ws[n]; });
      var r = Math.random() * tot, n = names[0];
      for (var i = 0; i < names.length; i++) { r -= ws[names[i]]; if (r <= 0) { n = names[i]; break; } }
      startTask(n);
    }

    /* ---------- the stage: the two Nexi slides ----------
       hero-scenes.js (NexiStage) calls stage(kind, root) when a Nexi slide opens and stage(null) when it
       closes, and cue(name, arg) for each beat of its script. While the stage is on Nexi takes no roaming
       tasks, does not chatter and never fades over text: she is the show. */
    var ST = { on: false, kind: '', root: null, spot: '', follow: null, followAt: 0, z: 0, idleAt: 0 };
    var STAGE_Z = LITE ? 2 : 3;
    function sfx(n) { if (window.TNVoice) window.TNVoice.sfx(n); }
    function visibleBand() {
      /* the part of the hero on screen, below the fixed header */
      var hr = hero.getBoundingClientRect(), hd = document.querySelector('[data-header]'), top = hd ? hd.getBoundingClientRect().bottom : 0;
      var y0 = clamp(top - hr.top, 0, H), y1 = clamp(window.innerHeight - hr.top, y0 + 1, H);
      return { y0: y0, y1: y1 };
    }
    function closeSpot() {
      var b = visibleBand(), vh = b.y1 - b.y0, k = clamp(Math.min(vh * (LITE ? 0.6 : 0.8), (W - TABS) * (LITE ? 0.86 : 0.56)) / SIZE, 1.6, 4.4);
      return { x: (W - TABS) / 2, y: b.y0 + vh * 0.48, z: CAMZ * (1 - 1 / k) };
    }
    /* home: floating at the left edge of the website (meet), or at the left edge of the brand desk (brand).
       No platform: she roams, and on these slides she may overlap the design */
    function homeZ() { return ST.kind === 'brand' ? (LITE ? 3 : 7) : (LITE ? 1 : 1); }
    function inHero(x, y, k) { return { x: clamp(x, SIZE * 0.4 * k, W - TABS - SIZE * 0.4 * k), y: clamp(y, SIZE * 0.55 * k + 24, H - SIZE * 0.55 * k) }; }
    function homeSpot() {
      if (!ST.root) return null;
      var k = depthK(homeZ()), web = ST.root.querySelector('.nxh-web'), desk = ST.root.querySelector('.nxh-desk');
      if (web) { var view = ST.root.querySelector('.nxh-view') || web; return presenterSpot(view); }
      if (desk) { var q2 = rectOf(desk); return inHero(q2.x - SIZE * k * 0.02, q2.y + q2.h * 0.3, k); }
      return null;
    }
    /* beside a piece of the brand desk: at its left edge, a third of the way down, looking at it (her body
       covers only a sliver of the piece she is excited about) */
    function assetSpot(el) {
      var r = rectOf(el), k = depthK(homeZ());
      return inHero(r.x - SIZE * k * 0.12, r.y + r.h * 0.34, k);
    }
    /* where she presents a part of the website from: the nearest spot where her box covers no text, no button
       and not the part itself (rings around it, plus the free spots inside it). She points at it from there. */
    function clearSpot(el) {
      obstacles();
      var r = rectOf(el), z = homeZ(), k = depthK(z), hw = SIZE * 0.4 * k, hh = SIZE * 0.52 * k, cands = [];
      [0.12, 0.4, 0.75].forEach(function (g0) {
        var g = g0 * SIZE * k;
        [r.y + r.h * 0.3, r.cy, r.y + r.h * 0.7].forEach(function (yy) { cands.push([r.x - g - hw, yy], [r.x + r.w + g + hw, yy]); });
        [r.x + r.w * 0.2, r.cx, r.x + r.w * 0.8].forEach(function (xx) { cands.push([xx, r.y - g - hh], [xx, r.y + r.h + g + hh]); });
      });
      freeSpots();
      for (var f = 0; f < FREE.length; f += 2) {
        var fx = FREE[f], fy = FREE[f + 1];
        if (fx > r.x - SIZE * k * 2 && fx < r.x + r.w + SIZE * k * 2 && fy > r.y - SIZE * k * 2 && fy < r.y + r.h + SIZE * k * 2) cands.push([fx, fy]);
      }
      var best = null, bestS = Infinity, self = [r.x, r.y, r.x + r.w, r.y + r.h];
      for (var i = 0; i < cands.length; i++) {
        var c = inHero(cands[i][0], cands[i][1], k), b = box(c.x, c.y, z);
        var own = Math.max(0, Math.min(b[2], self[2]) - Math.max(b[0], self[0])) * Math.max(0, Math.min(b[3], self[3]) - Math.max(b[1], self[1]));
        var dx = Math.max(0, Math.abs(c.x - r.cx) - r.w / 2), dy = Math.max(0, Math.abs(c.y - r.cy) - r.h / 2);
        var sc = overlap(b) * 12 + own * 6 + Math.hypot(dx, dy) * 1.2;
        if (sc < bestS) { bestS = sc; best = c; }
      }
      return best || inHero(r.x - hw, r.cy, k);
    }
    /* desktop: the presenter's spot at the website's left edge, level with the part she explains, where her box
       covers the least text and no button (she points across at the part from there) */
    function presenterSpot(el) {
      obstacles();
      var web = ST.root && ST.root.querySelector('.nxh-web'); if (!web) return clearSpot(el);
      var w = rectOf(web), r = rectOf(el), z = homeZ(), k = depthK(z), hw = SIZE * 0.4 * k, hh = SIZE * 0.52 * k, best = null, bestS = Infinity;
      /* phones: the lane the layout keeps under the website (hero.css), left of centre, her lines beside her */
      if (LITE) { var st = rectOf(ST.root); return inHero(w.x + SIZE * k * 0.55, (w.y + w.h + st.y + st.h) / 2 + SIZE * 0.04, k); }
      [-0.2, -0.32, -0.08].forEach(function (fx) {
        for (var y = w.y + hh * 0.6; y <= w.y + w.h - hh * 0.4; y += 12) {
          var c = inHero(w.x + SIZE * k * fx, y, k), b = box(c.x, c.y, z);
          var sc = overlap(b) * 12 + Math.abs(c.y - r.cy) * 1.2 + Math.abs(fx + 0.2) * 300;
          if (sc < bestS) { bestS = sc; best = c; }
        }
      });
      return best || clearSpot(el);
    }
    /* beside a part of the website: a small control gets her right hand on it (she presses it with 'tap');
       a big area gets her at its left edge */
    function nearSpot(el) {
      var r = rectOf(el), k = depthK(homeZ());
      if (r.w < SIZE * k * 1.3 && r.h < SIZE * k * 0.9) return inHero(r.cx - SIZE * k * 0.3, r.cy + SIZE * k * 0.1, k);
      return inHero(r.x + SIZE * k * 0.05, r.y + Math.min(r.h * 0.45, SIZE * k * 0.7), k);
    }
    function go(spot, z, follow) {
      if (!spot) return;
      ST.z = z; ST.follow = follow || null; ST.followAt = time + 0.25;
      place(spot.x, spot.y, z);
    }
    function stageTask(name, fn) { startTask('st-' + name, function (T) { T.dur = 1e9; fn(T); }); }
    function stage(kind, root) {
      if (!kind) {
        if (!ST.on) return;
        ST.on = false; ST.root = null; ST.follow = null; ST.spot = '';
        R.task = null; timersT.length = 0; R.lock = null; R.look = null;
        hit.setAttribute('aria-haspopup', 'dialog'); hit.setAttribute('aria-expanded', 'false');
        [].forEach.call(fxEl.querySelectorAll('b'), function (old) { old.remove(); });   // her last line stays with its slide
        return;
      }
      if (R.cardOpen) closeCard();
      /* not run yet (still paused after its warm-up): the scene has no size, and every spot below needs one */
      if (W < 2) resize();
      hit.removeAttribute('aria-haspopup'); hit.removeAttribute('aria-expanded');
      var first = !running || !ST.seen; ST.seen = true;
      ST.on = true; ST.kind = kind; ST.root = root; ST.spot = 'enter'; ST.follow = null; ST.idleAt = time + 99;
      R.task = null; timersT.length = 0; R.entered = true;
      if (first || kind === 'meet') {
        /* arrive from far away, straight down the middle, so the close-up reads as coming toward the glass */
        var c = closeSpot(); Sp.x.x = c.x; Sp.y.x = c.y; Sp.z.x = -18; Sp.x.v = Sp.y.v = Sp.z.v = 0;
        place(c.x, c.y, -18);
      }
      if (kind === 'brand') { var hs = homeSpot(); if (hs) { Sp.x.x = W + SIZE * 2; Sp.y.x = hs.y; Sp.z.x = 0; place(W + SIZE * 2, hs.y, 0); } }
    }
    var TAP = ['Hee hee, that tickles!', 'Boop! Hi again!', 'You found me!', 'Hello, friend!', 'Beep boop!'];
    function face(s) { R.look = camera.position; R.lookUntil = time + s; }
    function cue(name, a) {
      if (!ST.on) return;
      obsAt = -9;
      var el = a && a.nodeType === 1 ? a : null;
      ST.idleAt = time + 5.5;
      /* the over-reactions play to the visitor: a quick look at the piece, then the face turns to them */
      if (/^(gasp|star|love|bigjump|wiggle|faint|celebrate|cute)$/.test(name)) { if (el) lookAtEl(el, 0.5); later(el ? 0.45 : 0, function () { face(2.4); }); }
      switch (name) {
        case 'closeup': stageTask(name, function (T) {
          var c = closeSpot(); ST.spot = 'close'; go(c, c.z);
          R.look = camera.position; R.lookUntil = time + 30; expr('wow', 1.2); sfx('whoosh');
          T.at(1.1, function () { expr('happy', 1.5); play('hop'); });
        }); break;
        case 'knock': stageTask(name, function (T) {
          play('knock'); expr('content', 1.6); R.look = camera.position; R.lookUntil = time + 30;
          [0.36, 0.72, 1.08].forEach(function (s) { T.at(s, function () { boop(0.26, 0.02); sfx('knock'); shake(); }); });
        }); break;
        case 'cute': play('cute'); expr('happy', 2.4); R.blushUntil = time + 2.6; emote(['♥', '✦', '♥'], 3); sfx('heart'); break;
        case 'home': stageTask(name, function (T) {
          var was = ST.spot; ST.spot = 'home'; go(homeSpot(), homeZ(), homeSpot);
          R.look = camera.position; R.lookUntil = time + 3; if (was === 'close') sfx('whoosh');
        }); break;
        case 'zoomin': stageTask(name, function (T) {
          ST.spot = 'home'; go(homeSpot(), homeZ(), homeSpot); play('spin'); expr('wow', 1.4); sfx('whoosh');
          T.at(1.2, function () { play('hop'); expr('star', 1.2); emote(['!', '✦'], 2); });
        }); break;
        case 'visit': if (el) {
          var spotFn = ST.kind === 'meet' ? presenterSpot : assetSpot; ST.spot = 'asset';
          var at0 = spotFn(el); go(at0, homeZ(), null); lookAtEl(el, 4);
          if (ST.kind === 'meet') later(0.8, function () { var r = rectOf(el), hp = botPx(); ST.pointAt = time; play(r.cx > hp.x ? 'point' : 'pointL'); });
        } break;
        case 'tap': if (el) { var rt = rectOf(el), ht = botPx(); if (!(ST.pointAt && time - ST.pointAt < 1.6)) play(rt.cx > ht.x ? 'point' : 'pointL'); lookAtEl(el, 1.6); } else play('tap'); expr('content', 0.9); sfx('boop'); break;
        case 'present': play('present'); if (el) lookAtEl(el, 2.4); expr('happy', 1.8); break;
        case 'point': if (el) { var r = rectOf(el), hp = botPx(); lookAtEl(el, 2.6); play(r.cx > hp.x ? 'point' : 'pointL'); } else play('point'); expr('happy', 1.6); break;
        case 'wave': play('wave'); expr('happy', 1.8); R.look = el ? null : camera.position; R.lookUntil = time + 2.2; if (el) lookAtEl(el, 2.4); break;
        case 'nod': play('nod'); expr('content', 1.4); break;
        case 'hop': play('hop'); expr('happy', 1); break;
        case 'star': expr('star', 1.9); play('spin'); emote(['✦', '✧', '★'], 4); sfx('sparkle'); break;
        case 'love': expr('love', 2.2); R.blushUntil = time + 2.4; play('cute'); emote(['♥', '♥', '♥'], 4); sfx('heart'); break;
        case 'gasp': expr('wow', 1.6); play('gasp'); emote(['!', '!!'], 2); sfx('gasp'); jolt(-2.4); break;
        case 'bigjump': play('bigjump'); expr('happy', 1.5); emote(['✦', '!'], 2); sfx('boing'); break;
        case 'wiggle': play('wiggle'); expr('star', 1.3); emote(['✧', '✦'], 3); sfx('pop'); break;
        case 'faint': expr('dizzy', 2); play('faint'); sfx('whoosh');
          later(0.6, function () { emote(['✦', '✧', '★'], 3); }); later(1.9, function () { expr('wow', 0.7); sfx('boing'); }); break;
        case 'celebrate': play('celebrate'); expr('happy', 2); emote(['✦', '✧', '♪'], 4); sfx('tada'); break;
        case 'say': if (typeof a === 'object' && a && a.text) { word(a.text, a.life || 2.4, false, { wide: true, silent: true, stage: true }); R.humUntil = time + Math.min(a.life || 2.4, 0.5 + a.text.length * 0.055); } break;
      }
    }
    /* the glass shakes a little with each knock: the active slide's inner, translate only (it composes with the
       tilt's transform), one animation on the compositor */
    function shake() {
      var sl = active(), el = sl && sl.querySelector('.slide-inner'); if (!el || !el.animate) return;
      el.animate([{ translate: '0 0' }, { translate: '2px -1px', offset: 0.3 }, { translate: '-2px 1px', offset: 0.65 }, { translate: '0 0' }], { duration: 180, easing: 'ease-out' });
    }
    /* a quick jump back and in again (the gasp) */
    function jolt(dz) { if (!R.lock) return; var z0 = ST.z; R.tz = z0 + dz; later(0.32, function () { if (R.lock) R.tz = z0; }); }
    function later(s, fn) { timersT.push({ at: time + s, fn: fn }); }
    /* the script is between cues or over: small things, never a roaming task */
    function stageIdle() {
      ST.idleAt = time + rand(4, 6.5);
      var c = pick(ST.kind === 'meet' ? ['look', 'look', 'nod'] : ['nod', 'hop', 'curious', 'look', 'look']);
      if (c === 'look' && ST.root) { var r = rectOf(ST.root); lookAtPx(r.x + rand(0.1, 0.9) * r.w, r.y + rand(0.1, 0.9) * r.h, 1.6); }
      else if (c !== 'look') play(c);
    }

    /* the carousel changed slide: swoop to the new visual */
    hero.addEventListener('tn:slide', function () {
      if (!running || R.cardOpen || ST.on) return;
      setTimeout(function () {
        if (ST.on || R.cardOpen) return;
        startTask('swoop', function (T) {
          var v = q('[data-cine]') || q('[data-pmap]') || q('[data-inds]') || q('[data-nxs]'); T.dur = 3.2; play('spin'); expr('wow', 0.8);
          if (v) { var r = rectOf(v); goTo(r.x + r.w * rand(0.2, 0.8), r.y + SIZE * 0.4, 2); T.at(1.4, function () { lookAtEl(v, 1.6); expr('happy', 1.5); say('slide', true); }); }
        });
      }, 900);
    });
    /* clicks on hero items: Nexi comes over to look */
    hero.addEventListener('click', function (e) {
      if (!running || R.cardOpen || ST.on || e.target.closest('.nexi-hit,.nexi-card')) return;
      var el = e.target.closest('[data-app],[data-flow],.lj-hit,.pm-scen button,.dot,.hero-arrow');
      if (el) { startTask('visit', function (T) { var r = rectOf(el); goTo(r.cx + (r.cx > W / 2 ? -1 : 1) * SIZE * 0.75, r.cy - SIZE * 0.2, 1.5); lookAtEl(el, 3); T.dur = 3.4; expr('wow', 0.7); T.at(1.3, function () { play('clap'); expr('happy', 1.4); emote('✦', 2); }); }); }
      else { var hr = hero.getBoundingClientRect(); lookAtPx(e.clientX - hr.left, e.clientY - hr.top, 2); play('curious'); say('react'); }
    }, true);
    /* the launch path finished a phase: cheer */
    var ljWatch = new MutationObserver(function (list) {
      if (!running || R.cardOpen || ST.on) return;
      for (var i = 0; i < list.length; i++) { var t = list[i].target; if (t.classList && t.classList.contains('is-done') && (list[i].oldValue || '').indexOf('is-done') < 0 && /lj-(badge|plat)/.test(t.getAttribute('class') || '')) { play('celebrate'); expr('happy', 1.6); emote(['✦', '✧', '♪'], 3); if (Math.random() < 0.5) say('cheer'); return; } }
    });
    var lj = hero.querySelector('[data-journey]'); if (lj) ljWatch.observe(lj, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });

    /* ---------- the intro card ---------- */
    var chirpCtx = null;
    function chirp() {
      /* all of Nexi's sounds follow the voice switch when the voice module is on the page */
      if (window.TNVoice) { window.TNVoice.sfx('chirp'); return; }
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        if (navigator.userActivation && !navigator.userActivation.isActive) return; /* browsers only allow sound after a real click */
        chirpCtx = chirpCtx || new AC(); if (chirpCtx.state === 'suspended') chirpCtx.resume(); var c = chirpCtx, t = c.currentTime + 0.01, g = c.createGain(); g.gain.value = 0.08; g.connect(c.destination);
        [[620, 980, 0], [880, 1320, 0.12], [1175, 1700, 0.24]].forEach(function (n) { var o = c.createOscillator(), a = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(n[0], t + n[2]); o.frequency.exponentialRampToValueAtTime(n[1], t + n[2] + 0.1); a.gain.setValueAtTime(0.0001, t + n[2]); a.gain.exponentialRampToValueAtTime(1, t + n[2] + 0.01); a.gain.exponentialRampToValueAtTime(0.0001, t + n[2] + 0.12); o.connect(a); a.connect(g); o.start(t + n[2]); o.stop(t + n[2] + 0.14); });
      } catch (e) { /* sound is optional */ }
    }
    function placeCard() {
      var h = botPx(), cw = card.offsetWidth || 320, ch = card.offsetHeight || 220;
      var edge = W - TABS, low = H - 12; /* keep clear of the fixed side tabs and the cookie notice */
      var cb = document.getElementById('tn-cookie-banner');
      if (cb) { var br = cb.getBoundingClientRect(); if (br.height) low = Math.min(low, br.top - hero.getBoundingClientRect().top - 12); }
      var x = h.x + SIZE * 0.55; if (x + cw > edge) x = h.x - SIZE * 0.55 - cw;
      card.style.left = clamp(x, 16, edge - cw) + 'px'; card.style.top = Math.max(12, Math.min(h.y - ch / 2, low - ch)) + 'px';
    }
    function openCard() {
      if (R.cardOpen) return; R.cardOpen = true; hit.setAttribute('aria-expanded', 'true');
      startTask('present', function (T) { T.dur = 1e9; goTo(R.tx, R.ty, 3); R.look = null; });
      card.hidden = false; placeCard(); requestAnimationFrame(function () { card.classList.add('is-on'); });
      play('wave'); play('hop'); expr('happy', 3); R.blushUntil = time + 2.4; chirp(); emote(['✦', '♥'], 3);
      var b = card.querySelector('[data-nexi-chat]'); if (b) b.focus({ preventScroll: true });
    }
    function closeCard(back) {
      if (!R.cardOpen) return; R.cardOpen = false; hit.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-on'); setTimeout(function () { if (!R.cardOpen) card.hidden = true; }, 260);
      play('wave'); expr('happy', 1.2); R.task = null; if (back) hit.focus({ preventScroll: true });
    }
    hit.addEventListener('click', function (e) {
      e.stopPropagation();
      /* on the stage a tap is a little moment with Nexi, not the intro card (the slide already introduces her) */
      if (ST.on && !R.cardOpen) { play('hop'); play('cute'); expr('happy', 1.6); R.blushUntil = time + 1.8; emote(['♥', '✦'], 2); sfx('boop'); word(pick(TAP), 1.9, false, { silent: false }); ST.idleAt = time + 4; return; }
      if (R.cardOpen) closeCard(); else openCard();
    });
    hit.addEventListener('touchend', function (e) { e.stopPropagation(); });
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-nexi-close]')) closeCard(true);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && R.cardOpen) closeCard(true); });
    document.addEventListener('click', function (e) { if (R.cardOpen && !e.target.closest('.nexi-card,.nexi-hit')) closeCard(); });

    /* ---------- run / pause ---------- */
    var running = false, inView = true, raf = 0;
    function setOn() { document.body.classList.toggle('nexi-on', running && inView); }
    var io = new IntersectionObserver(function (en) { inView = en[0].isIntersecting; setOn(); if (inView && running && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0.05 });
    io.observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && running && !raf) { clock.getDelta(); raf = requestAnimationFrame(tick); } });
    window.addEventListener('resize', function () { if (running) resize(); });

    function tick() {
      raf = 0;
      if (!running || !inView || document.hidden) return;
      var dt = Math.min(0.05, clock.getDelta()); time += dt;
      for (var ti = timersT.length - 1; ti >= 0; ti--) if (time >= timersT[ti].at) { var f = timersT[ti].fn; timersT.splice(ti, 1); f(); }
      if (!R.entered && !ST.on) { R.entered = true; Sp.x.x = W + SIZE; Sp.y.x = H * 0.35; startTask('enter', function (T) { var v = q('[data-cine]') || q('[data-pmap]') || q('[data-inds]') || q('[data-nxs]'); var r = v ? rectOf(v) : { cx: W * 0.7, cy: H * 0.4, w: 0, h: 0 }; goTo(r.cx + r.w * 0.3, r.cy - SIZE * 0.3, 1.5); T.dur = 4.2; T.at(1.9, function () { play('wave'); expr('happy', 2); say('hello', true, 2.2); }); R.wallNext = true; }); }
      var T = R.task;
      if (T) { var p = (time - T.t0) / Math.max(0.001, T.dur); if (T.tick) T.tick(clamp(p, 0, 1)); if (p >= 1) { R.task = null; } }
      if (ST.on) {
        if (time > ST.idleAt) stageIdle();
        /* the spot she holds moves with the slide (tilt, reveals, resizes): re-read it a few times a second */
        if (ST.follow && R.lock && time > ST.followAt) { ST.followAt = time + 0.25; var fs = ST.follow(); if (fs) { R.lock.sx = fs.x; R.lock.sy = fs.y; } }
      } else if (!R.task && !R.cardOpen) nextTask();
      if (!R.cardOpen && !ST.on && time > (R.chatAt || 0)) {
        R.chatAt = time + rand(6, 9);
        if (time - (R.lastWord || -9) > 5 && !(R.task && (R.task.name === 'talk' || R.task.name === 'fourthWall' || R.task.name === 'callTab'))) {
          var cl = Math.random() < 0.5 ? ctxTalk() : null;
          if (cl) { word(cl[0]); R.humUntil = time + 1; } else say('idle');
        }
      }
      if (R.cardOpen) placeCard();
      if (time > R.exprUntil) expr('idle');

      /* the page moved under Nexi (a reveal, a slide change): re-pick a clear spot */
      obstacles();
      if (R.lock) { var kl = depthK(Sp.z.x); R.tx = W / 2 + (R.lock.sx - W / 2) / kl; R.ty = H / 2 + (R.lock.sy - H / 2) / kl; }
      else if (R.obsSeen !== obsAt) {
        R.obsSeen = obsAt;
        var ts = toScreen(R.tx, R.ty, R.tz);
        if (!R.cardOpen && overlap(box(ts[0], ts[1], R.tz))) { var kk = depthK(R.tz), fr = free(ts[0], ts[1], R.tz); R.tx = W / 2 + (fr[0] - W / 2) / kk; R.ty = H / 2 + (fr[1] - H / 2) / kk; }
      }
      /* movement */
      var px = Sp.x.step(R.tx, dt), py = Sp.y.step(R.ty, dt), pz = Sp.z.step(R.tz, dt);
      var vx = Sp.x.v, vy = Sp.y.v, speed = Math.hypot(vx, vy) / S;
      bot.position.set((px - W / 2) / S, (H / 2 - py) / S, pz);
      var O = { yb: 0, sq: 0, spin: 0, flip: 0, roll: 0, nod: 0, tilt: 0, hLx: 0, hLy: 0, hLz: 0, hRx: 0, hRy: 0, hRz: 0, hRr: 0 };
      R.clips = R.clips.filter(function (c) { var pp = (time - c.t0) / c.dur; if (pp >= 1) return false; c.fn(clamp(pp, 0, 1), O); return true; });
      var sq = Sp.sq.step(O.sq, dt);
      var yb = Sp.yb.step(O.yb, dt), bob = Math.sin(time * 1.5) * 0.06;
      hover.position.y = BASE + bob + yb;
      aura.scale.setScalar(bot.scale.x); aura.position.set(bot.position.x, bot.position.y + 0.1 * bot.scale.x, bot.position.z - 1.2 * bot.scale.x);
      hover.scale.set(1 - sq * 0.5, 1 + sq, 1 - sq * 0.5);
      spinner.rotation.x = O.flip + clamp(-vy / S * 0.02, -0.2, 0.2);
      spinner.rotation.z = Sp.bank.step(clamp(-vx / S * 0.06, -0.35, 0.35), dt) + Sp.roll.step(O.roll, dt);
      bot.rotation.y = O.spin + Sp.yaw.step(speed > 0.6 ? clamp(vx / S * 0.08, -0.6, 0.6) : 0, dt);

      /* look */
      var ly = Math.sin(time * 0.37) * 0.12, lp = Math.sin(time * 0.29) * 0.05, target = null;
      if (time < R.lookUntil && R.look) target = R.look;
      if (target) {
        var local = hover.worldToLocal(tmp2.copy(target)), dx = local.x - head.position.x, dy = local.y - head.position.y, dz = local.z - head.position.z;
        ly = clamp(Math.atan2(dx, dz), -0.85, 0.85); lp = clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.45, 0.45);
      }
      var lookY = Sp.ly.step(ly, dt), lookP = Sp.lp.step(lp, dt);
      head.rotation.set(lookP + Sp.nod.step(O.nod, dt), lookY, Sp.tilt.step(O.tilt, dt));
      if (!R.gripOn && R.gripDx) R.gripDx = Math.abs(R.gripDx) < 0.002 ? 0 : R.gripDx * Math.exp(-dt * 7);
      var gdx = R.gripDx || 0;
      handL.position.set(HL.x + gdx + Sp.hLx.step(O.hLx, dt), HL.y + Math.sin(time * 2) * 0.035 + Sp.hLy.step(O.hLy, dt), HL.z + Sp.hLz.step(O.hLz, dt));
      handR.position.set(HR.x + gdx + Sp.hRx.step(O.hRx, dt), HR.y + Math.sin(time * 2 + 1.3) * 0.035 + Sp.hRy.step(O.hRy, dt), HR.z + Sp.hRz.step(O.hRz, dt));
      handR.rotation.z = Sp.hRr.step(O.hRr, dt);

      /* face */
      if (time > R.blinkAt) { R.blinkT0 = time; R.blinkAt = time + rand(2.4, 5.6); }
      var bp = (time - R.blinkT0) / 0.18, blink = bp >= 0 && bp < 1 ? 1 - Math.pow(bell(bp), 1.4) * 0.92 : 1;
      var swp = (time - R.eyeT0) / 0.22, shape = R.eyes, sw = 1;
      if (swp >= 0 && swp < 1) { if (swp < 0.5) { shape = R.eyeFrom; sw = 1 - ease(swp * 2); } else sw = ease((swp - 0.5) * 2); }
      eyes.forEach(function (e, i) {
        e.g.position.x = e.bx + lookY * 0.03; e.g.position.y = 0.045 - lookP * 0.03;
        SHAPES.forEach(function (k) { e[k].visible = k === shape; });
        var m = e[shape], s = Math.max(0.05, sw), beat = shape === 'heart' ? 1 + 0.16 * Math.pow(Math.max(0, Math.sin(time * 9)), 3) : 1;
        m.scale.set((0.7 + 0.3 * s) * beat, s * (shape === 'open' ? blink : 1) * beat, 1);
        if (shape === 'star') m.rotation.z = Math.sin(time * 3 + i) * 0.25;
        if (shape === 'x') m.rotation.z = Math.sin(time * 5 + i) * 0.3;
      });
      var tk = Sp.talk.step(time < R.humUntil ? 1 : 0, dt);
      smile.visible = tk < 0.5 && R.mouth === 'smile'; mouthO.visible = tk < 0.5 && R.mouth === 'o';
      smile.scale.setScalar(Math.max(0.01, 1 - tk)); mouthO.scale.setScalar(Math.max(0.01, 1 - tk));
      eq.forEach(function (b, i) { b.visible = tk > 0.05; b.scale.set(1, Math.max(0.05, tk * (0.35 + 0.9 * Math.abs(Math.sin(time * 16 + i * 1.9) * Math.sin(time * 6.7 + i)))), 1); });
      blushMat.opacity = lerp(blushMat.opacity, time < R.blushUntil ? 0.85 : 0, 1 - Math.exp(-dt * 6));
      M.line.color.setHSL(0.6, 0.95, 0.72 + Math.sin(time * 2.2) * 0.06);

      /* thruster and sparkle trail */
      var boost = Sp.boost.step(speed > 0.9 ? 1 : 0, dt);
      flame.scale.set(1 + boost * 0.3, Math.max(0.001, boost * (1 + Math.sin(time * 40) * 0.12)), 1 + boost * 0.3); flame.material.opacity = clamp(boost, 0, 1) * 0.85; thr.scale.setScalar(1 + boost * 0.6);
      if (boost > 0.3 && time > spkAt) { spkAt = time + 0.05; var si2 = spkNext, sp1 = spk[si2]; spkNext = (spkNext + 1) % SPK; thr.getWorldPosition(tmp3); sp1.life = 1; sp1.i = si2; sp1.v.set(rand(-0.4, 0.4), rand(-1.4, -0.6), rand(-0.2, 0.2)); spkPos[si2 * 3] = tmp3.x; spkPos[si2 * 3 + 1] = tmp3.y; spkPos[si2 * 3 + 2] = tmp3.z; }
      for (var k2 = 0; k2 < SPK; k2++) { var s2 = spk[k2]; if (s2.life <= 0) continue; s2.life -= dt * 2; var ii = s2.i * 3; spkPos[ii] += s2.v.x * dt; spkPos[ii + 1] += s2.v.y * dt; spkPos[ii + 2] += s2.v.z * dt; if (s2.life <= 0) spkPos[ii + 1] = -999; }
      spkGeo.attributes.position.needsUpdate = true;

      /* click target follows the robot */
      var h = botPx(); hit.style.transform = 'translate(' + (h.x - SIZE * 0.36).toFixed(1) + 'px,' + (h.y - SIZE * 0.5).toFixed(1) + 'px) scale(' + depthK(pz).toFixed(3) + ')';

      /* passing over text or a button on the way somewhere: fade out of the way, never block a click */
      /* on the stage she never fades (she is the show), but her hit area still lets clicks through to a button
         under her, except in the close-up, where a tap on her face must not open a link behind the veil */
      var bb = box(h.x, h.y, pz), over = !R.cardOpen && overlap(bb) > (bb[2] - bb[0]) * (bb[3] - bb[1]) * 0.03;
      R.alpha = lerp(R.alpha == null ? 1 : R.alpha, over && !ST.on ? 0.28 : 1, 1 - Math.exp(-dt * (over ? 10 : 4)));
      var ao = R.alpha.toFixed(2); if (ao !== R.alphaSet) { cv.style.opacity = ao; R.alphaSet = ao; }
      var thru = over && !(ST.on && ST.spot === 'close');
      if (thru !== R.passThru) { R.passThru = thru; hit.style.pointerEvents = thru ? 'none' : ''; }

      /* the bigger render window while she is near the glass (with a little hysteresis) */
      var kNow = depthK(pz); if (VBIG ? kNow < 1.5 : kNow > 1.7) setView(!VBIG);
      var vx0 = Math.round(h.x - VIEW / 2), vy0 = Math.round(h.y - VIEW / 2);
      camera.setViewOffset(W, H, vx0, vy0, VIEW, VIEW);
      renderer.setRenderTarget(null); renderer.render(scene, camera);
      if (!LITE) { if (speed < 0.2 && !glowReuse && glowFresh) { Glow.again(); glowReuse = true; } else { Glow.render(); glowReuse = false; glowFresh = true; } }
      camera.clearViewOffset();
      cv.style.transform = 'translate3d(' + vx0 + 'px,' + vy0 + 'px,0)';
      raf = requestAnimationFrame(tick);
    }
    for (var z0 = 0; z0 < SPK; z0++) spkPos[z0 * 3 + 1] = -999;
    /* the glow is reused for one frame at a time while she is nearly still (glowFresh: rendered since the last resize) */
    var glowReuse = false, glowFresh = false;

    var warmed = false;
    function resume() {
      if (running) return; running = true; layer.style.display = ''; resize(); clock.getDelta(); setOn(); if (!raf) raf = requestAnimationFrame(tick);
      if (!warmed) { warmed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-ready')); }
    }
    function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; layer.style.display = 'none'; closeCard(); setOn(); }
    /* Compile the shaders one per frame slot before Nexi's first frame. All at once they cost one long
       frame (a visible hitch on the hero); spread out, no single frame waits long. */
    function warmUp(done) {
      /* renderer.compile() walks the whole scene it is given, so each material gets a stand-in scene
         with the same lights and environment (same shader variant) and a proxy of one mesh that uses it */
      var steps = [], seen = new Set(), lights = [];
      scene.traverse(function (o) { if (o.isLight) lights.push(o); });
      scene.traverse(function (o) {
        if (!(o.isMesh || o.isPoints) || seen.has(o.material)) return; seen.add(o.material);
        steps.push(function () {
          var ws = new THREE.Scene(); ws.environment = scene.environment; ws.fog = scene.fog;
          lights.forEach(function (l) { ws.add(l.clone()); });
          ws.add(o.isPoints ? new THREE.Points(o.geometry, o.material) : new THREE.Mesh(o.geometry, o.material));
          renderer.compile(ws, camera);
        });
      });
      if (!LITE) steps = steps.concat(Glow.warmSteps, [Glow.warmTwins]);
      var i = 0;
      (function next() {
        if (i >= steps.length) { done(); return; }
        try { steps[i++](); } catch (err) { /* compiled on first use instead */ }
        setTimeout(next, 24);
      })();
    }
    /* nexi.js decides when Nexi may run (desktop: always; phones: on a Nexi slide), so the first resume
       waits for its say-so after the warm-up */
    var wantRun = true;
    setTimeout(function () { warmUp(function () { if (wantRun) resume(); else { warmed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-ready')); } }); }, 30);
    var api = {
      pause: function () { wantRun = false; if (running) pause(); },
      resume: function () { wantRun = true; if (warmed) resume(); },
      stage: stage, cue: cue, lite: LITE,
      act: function (n) { if (TASKS[n] && !ST.on && TASKS[n].w()) { startTask(n); return true; } return false; }
    };
    /* live: drawing on screen right now (the stage script only cues a Nexi the visitor can see) */
    Object.defineProperty(api, 'live', { get: function () { return running && inView && !document.hidden; } });
    return api;
  }
})();
