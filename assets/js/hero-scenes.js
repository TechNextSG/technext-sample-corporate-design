/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Home hero scenes (desktop only; the phone hero is static by design).
   1 · cine  every Odoo app streaks in from off-stage and settles into two tilted orbits around the
             dashboard. Pointer tilts the orbit plane, drag spins it, hover stops it, apps send data in.
   2 · pmap  lead-to-cash across five departments: 17 steps, four decisions, loops and forks, live
             tokens, a scenario switch and a camera that flies the map before pulling back.
   3 · path  the launch path: five raised phases climb to go-live, the project glides up them, each
             phase's deliverables tick off and beams show the offices on it (drag the timeline, or click).
   A scene runs only while its slide is active, the hero is on screen and the tab is visible. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var phone = window.matchMedia('(max-width: 960px)');   // phones get the same scenes, laid out for a narrow screen
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROOT = hero.dataset.root || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pop = $('.pop');
  var popOpen = function () { return !!pop && !pop.hidden; };
  var onScreen = true;
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function live() { return onScreen && !document.hidden; }
  // offset geometry relative to `host`: unaffected by the camera transitions that transform the slide
  function box(el, host) {
    var x = 0, y = 0, e = el;
    while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2, r: x + el.offsetWidth, b: y + el.offsetHeight };
  }
  function oiImg(mod, size) { return '<img class="oi" src="' + ROOT + 'assets/img/odoo/' + mod + '.svg" alt="" width="' + size + '" height="' + size + '">'; }
  function rounded(pts, rad) {
    // drop repeated points: a zero-length leg has no direction to round the corner with
    pts = pts.filter(function (q, i) { return !i || Math.abs(q[0] - pts[i - 1][0]) + Math.abs(q[1] - pts[i - 1][1]) > .5; });
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var r = Math.min(rad, l1 / 2, l2 / 2);
      var a = [p1[0] + (p0[0] - p1[0]) / l1 * r, p1[1] + (p0[1] - p1[1]) / l1 * r], b = [p1[0] + (p2[0] - p1[0]) / l2 * r, p1[1] + (p2[1] - p1[1]) / l2 * r];
      d += 'L' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
    }
    var z = pts[pts.length - 1];
    return d + 'L' + z[0].toFixed(1) + ' ' + z[1].toFixed(1);
  }
  function svgEl(tag, attrs) { var n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  /* ---- frame-budget helpers: nothing below reads layout inside an animation frame ---- */
  var hasRO = 'ResizeObserver' in window;
  // Measure where layout is already clean: a ResizeObserver callback runs after layout, before paint.
  // fn runs when the boxes are first observed, whenever one changes size, and once more after the web
  // fonts load (text metrics can move things inside a box without changing its size).
  function watchSize(els, fn) {
    if (!hasRO) return;
    var ro = new ResizeObserver(function () { fn(); });
    els.forEach(function (e) { if (e) ro.observe(e); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { els.forEach(function (e) { if (e) { ro.unobserve(e); ro.observe(e); } }); });
  }
  // Restart a class-driven CSS animation (keyframes in hero.css) without the remove / reflow / add
  // round trip, which forced a full layout in the middle of a frame. The first time, the class is just
  // added, exactly as before, and the element's own CSSAnimation objects are kept; later restarts rewind
  // and replay them. Falls back to the old restart if the Web Animations API is missing or they were dropped.
  function replay(el, cls, names) {
    if (!el) return;
    var key = '__tn_' + cls, list = el[key], on = el.classList.contains(cls);
    // (reading playState here to spot dropped animations forced a style update on every token hit: CSS dropping one
    // fires animationcancel instead, which forgets the list)
    if (on && list && list.length) {
      list.forEach(function (x) { x.currentTime = 0; x.play(); });
      return;
    }
    if (on) { el.classList.remove(cls); void el.offsetWidth; }
    el.classList.add(cls);
    el[key] = typeof el.getAnimations === 'function' ?
      el.getAnimations({ subtree: true }).filter(function (x) { return names.indexOf(x.animationName) > -1; }) : null;
    if (el[key] && !el[key + '_c']) {
      el[key + '_c'] = true;
      el.addEventListener('animationcancel', function (e) {
        var l = el[key]; if (l && l.some(function (x) { return x.animationName === e.animationName && x.effect && x.effect.target === e.target; })) el[key] = null;
      });
    }
  }
  // Arc-length table of an SVG path, sampled once with getPointAtLength so a frame can place a point by
  // distance along the path without a layout read; between samples (`step` px apart) it interpolates.
  function pathTable(p, step) {
    var len = p.getTotalLength(), n = Math.max(1, Math.ceil(len / step)), xy = new Float64Array(n * 2 + 2);
    for (var i = 0; i <= n; i++) { var q = p.getPointAtLength(len * i / n); xy[i * 2] = q.x; xy[i * 2 + 1] = q.y; }
    return { len: len, n: n, xy: xy };
  }
  function tableAt(T, s, out) {
    var u = T.len > 0 ? clamp(s / T.len, 0, 1) * T.n : 0, i = Math.min(T.n - 1, Math.floor(u)), f = u - i, k = i * 2, xy = T.xy;
    out.x = xy[k] + (xy[k + 2] - xy[k]) * f; out.y = xy[k + 1] + (xy[k + 3] - xy[k + 1]) * f;
    return out;
  }
  // A quadratic Bézier evaluated in script, with a 24-point arc-length table so a point moves along it
  // at the same even speed getPointAtLength gave, without creating layout work.
  function quadCurve(x0, y0, x1, y1, x2, y2) {
    var N = 24, L = new Float64Array(N + 1), px = x0, py = y0;
    for (var i = 1; i <= N; i++) {
      var u = i / N, v = 1 - u, x = v * v * x0 + 2 * v * u * x1 + u * u * x2, y = v * v * y0 + 2 * v * u * y1 + u * u * y2;
      L[i] = L[i - 1] + Math.hypot(x - px, y - py); px = x; py = y;
    }
    return { x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, L: L, len: L[N] };
  }
  function quadAt(c, s, out) {
    var L = c.L, N = 24, i = 0;
    s = clamp(s, 0, c.len);
    while (i < N - 1 && L[i + 1] < s) i++;
    var seg = L[i + 1] - L[i], u = (i + (seg > 0 ? (s - L[i]) / seg : 0)) / N, v = 1 - u;
    out.x = v * v * c.x0 + 2 * v * u * c.x1 + u * u * c.x2; out.y = v * v * c.y0 + 2 * v * u * c.y1 + u * u * c.y2;
    return out;
  }
  // CSS cubic-bezier() timing, for the fades a canvas draws itself
  function bezier(x1, y1, x2, y2) {
    function c(p1, p2, t) { return ((1 - 3 * p2 + 3 * p1) * t + (3 * p2 - 6 * p1)) * t * t + 3 * p1 * t; }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 20; i++) { var v = c(x1, x2, t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return c(y1, y2, t);
    };
  }
  var EASE = bezier(.25, .1, .25, 1);
  // the length of half an ellipse (the front arc of an orbit ring), for dashes measured along it
  function halfEllipse(a, b) {
    var n = 96, s = 0, px = a, py = 0;
    for (var i = 1; i <= n; i++) { var t = Math.PI * i / n, x = a * Math.cos(t), y = b * Math.sin(t); s += Math.hypot(x - px, y - py); px = x; py = y; }
    return s;
  }

  /* ================================================================== 1 · cinematic orbit */
  function Cine(root) {
    var fx = $('.cine-fx', root), ctx = fx.getContext('2d');
    var backSvg = $('.cine-rings--back', root), frontSvg = $('.cine-rings--front', root);
    // The glints sweeping the rings and the packets flying to the dashboard change every frame, so they are
    // drawn on a canvas over the front rings: in the SVG, any change restyled and repainted the whole drawing.
    // The canvas overhangs the stage (the outer ring reaches past its sides) by 15% a side, 4% top and bottom.
    var gl = document.createElement('canvas'); gl.className = 'cine-gl'; gl.setAttribute('aria-hidden', 'true');
    frontSvg.parentNode.insertBefore(gl, frontSvg.nextSibling);
    var gx = gl.getContext('2d'), gdpr = 1, glDirty = false, gHead = [0, 0], gRing = [null, null];
    var core = $('.cine-core', root), feed = $('.cine-feed', root), hand = $('[data-cine-hand]', root);
    // two orbit planes: x/y radii as a share of the stage width, roll in degrees, seconds per lap
    // inner ring: steep, it circles the dashboard; outer ring: wide and flat, crossing the other way
    var RINGS = [{ rx: .455, ry: .285, roll: -13, cy: .5, lap: 40, dir: 1, size: 46 },
                 { rx: .6, ry: .175, roll: 9, cy: .52, lap: 64, dir: -1, size: 36 }];
    // on a phone the stage is the screen's width: keep the outer ring's apps inside it
    if (phone.matches) { RINGS[0].rx = .42; RINGS[0].ry = .31; RINGS[1].rx = .49; RINGS[1].ry = .2; }
    // Each app rides in a bare wrapper (.cine-pos) that takes the per-frame transform, opacity, blur and z-index.
    // Restyling the styled button itself every frame cost ~0.3 ms an app (6 ms a frame for 20); the wrapper ~4 us.
    var apps = $$('.cine-app', root).map(function (el) {
      var pos = el.parentNode.classList.contains('cine-pos') ? el.parentNode : document.createElement('span');
      if (pos !== el.parentNode) { pos.className = 'cine-pos'; el.parentNode.insertBefore(pos, el); pos.appendChild(el); }
      return { el: el, pos: pos, ring: +el.dataset.ring, mod: el.dataset.app, hist: [] };
    });
    [0, 1].forEach(function (r) {
      var list = apps.filter(function (a) { return a.ring === r; });
      list.forEach(function (a, k) { a.slot = k / list.length * TAU + (r ? .21 : 0); });
    });
    var W = 1, H = 1, dpr = 1, fdpr = 1, raf = 0, last = 0, on = false;
    var measured = false, viewBox = '', coreT = { x: 0, y: 0 }, ringTr = [], ringRR = [], hbD = '', PT = { x: 0, y: 0 };
    var rot = [0, .9], spd = 1, spdT = 1, dragV = 0, dragging = false, lastX = 0, lastT = 0;
    var tilt = { tx: 0, ty: 0, x: 0, y: 0 };
    var hot = null, leaveT = 0, rush = null, packets = [], nextPacket = 0, landed = 0;
    var ringG = [], backP = [], frontP = [], halo = [], hoverBeam;
    var DOC = { S: 419, PO: 88, MO: 31, IN: 231, OUT: 412, INV: 147, T: 218 };
    var EVENTS = {
      accountant: function () { return '<b>' + (30 + (Math.random() * 20 | 0)) + '</b> bank lines matched'; },
      sale: function () { return '<b>S00' + (++DOC.S) + '</b> signed, order confirmed'; },
      stock: function () { return '<b>WH/OUT/00' + (++DOC.OUT) + '</b> delivered'; },
      crm: function () { return 'New lead from the <b>website form</b>'; },
      purchase: function () { return '<b>PO000' + (++DOC.PO) + '</b> raised by a reorder rule'; },
      mrp: function () { return '<b>MO/000' + (++DOC.MO) + '</b> done, stock updated'; },
      point_of_sale: function () { return 'POS session <b>closed and posted</b>'; },
      website_sale: function () { return 'Web order <b>paid, stock reserved</b>'; },
      project: function () { return 'Milestone reached, <b>invoice ready</b>'; },
      helpdesk: function () { return 'Ticket <b>#' + (++DOC.T) + '</b> solved'; },
      hr: function () { return 'New hire <b>onboarded</b>'; },
      ai_app: function () { return 'AI drafted a <b>reply</b> for review'; },
      mass_mailing: function () { return 'Campaign sent to a <b>CRM list</b>'; },
      documents: function () { return 'Vendor bill <b>digitised</b>'; },
      sign: function () { return 'Contract <b>signed</b>'; },
      hr_expense: function () { return 'Expense <b>approved, posted</b>'; },
      planning: function () { return 'Next week’s shifts <b>published</b>'; },
      knowledge: function () { return 'Procedure <b>linked</b> to the task'; },
      social: function () { return 'Post <b>scheduled</b>'; },
      web_studio: function () { return 'Field added, <b>upgrade-safe</b>'; }
    };
    var EVENT_KEYS = Object.keys(EVENTS);

    function build() {
      [backSvg, frontSvg].forEach(function (s) { s.innerHTML = ''; });
      var defs = svgEl('defs', {});
      // the near side of each ring is brightest in front of the dashboard and fades toward its ends
      defs.innerHTML = '<linearGradient id="cine-arc" x1="0" x2="1"><stop offset="0" stop-color="#3167CA" stop-opacity=".28"/><stop offset=".5" stop-color="#3167CA" stop-opacity=".8"/><stop offset="1" stop-color="#3167CA" stop-opacity=".28"/></linearGradient>';
      frontSvg.appendChild(defs);
      ringG = []; backP = []; frontP = []; halo = []; gRing = [null, null];
      RINGS.forEach(function (R, r) {
        var gb = svgEl('g', {}), gf = svgEl('g', {});
        backP[r] = svgEl('path', { 'class': 'cr-back cr-back--' + r });
        frontP[r] = svgEl('path', { 'class': 'cr-front cr-front--' + r });
        halo[r] = svgEl('path', { 'class': 'cr-halo cr-halo--' + r });
        gb.appendChild(backP[r]); gf.appendChild(halo[r]); gf.appendChild(frontP[r]);
        backSvg.appendChild(gb); frontSvg.appendChild(gf);
        ringG[r] = [gb, gf];
      });
      hoverBeam = svgEl('path', { 'class': 'cine-hbeam' }); frontSvg.appendChild(hoverBeam);
      ringTr = []; ringRR = []; hbD = '';
    }
    // Every layout read of the scene happens here (on enter only if nothing has measured yet, otherwise
    // from the ResizeObserver or a window resize), never inside a frame.
    function size() {
      W = root.offsetWidth || 1; H = root.offsetHeight || 1;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      apps.forEach(function (a) { a.sz = a.el.offsetWidth || RINGS[a.ring].size; });   // CSS sets smaller apps on phones
      // Where beams and packets land: the live feed on the dashboard. Offset geometry ignores CSS transforms,
      // and the core is centred with translate(-50%,-50%), so take half its size back off.
      var f = box(feed, root);
      coreT = { x: f.cx - core.offsetWidth / 2, y: f.y + 10 - core.offsetHeight / 2 };
      // resizing a canvas clears and reallocates it, so only when the size really changes
      var fw = Math.round(W * 2 * fdpr), fh = Math.round(H * 2 * fdpr);   // the warp canvas is 4x the stage: drawn at 1x (motion streaks), never at the screen ratio
      if (fx.width !== fw) fx.width = fw;
      if (fx.height !== fh) fx.height = fh;
      gdpr = Math.min(1.5, window.devicePixelRatio || 1);
      var gw = Math.round(W * 1.3 * gdpr), gh = Math.round(H * 1.08 * gdpr);
      if (gl.width !== gw) gl.width = gw;
      if (gl.height !== gh) gl.height = gh;
      glDirty = true;
      var vb = '0 0 ' + W + ' ' + H;
      if (vb !== viewBox) { viewBox = vb; [backSvg, frontSvg].forEach(function (s) { s.setAttribute('viewBox', vb); }); }
      measured = true;
    }
    function geo(r) {
      var R = RINGS[r], roll = (R.roll + tilt.x * 14) * Math.PI / 180;
      return { rx: R.rx * W, ry: R.ry * W * (1 + tilt.y * .45), c: Math.cos(roll), s: Math.sin(roll), roll: roll, cx: W * .5, cy: H * R.cy };
    }
    function at(g, th) {
      var x = g.rx * Math.cos(th), y = g.ry * Math.sin(th);
      return { x: g.cx + x * g.c - y * g.s, y: g.cy + x * g.s + y * g.c, d: (Math.sin(th) + 1) / 2 };
    }
    function coreTarget() { return coreT; }          // measured in size()
    function startRush(now) {
      landed = 0; root.classList.remove('is-live'); packets = [];
      if (reduce) { rush = null; landed = apps.length; root.classList.add('is-live'); return; }
      var order = apps.slice().sort(function () { return Math.random() - .5; });
      var warp = [];
      for (var i = 0; i < 46; i++) warp.push({ a: rnd(0, TAU), r: rnd(.75, 1.25) * W, v: rnd(1.2, 2.1) * W, len: rnd(40, 120), w: rnd(.6, 1.8) });
      order.forEach(function (a, k) {
        var g = geo(a.ring), p = at(g, a.slot + rot[a.ring]);
        var dx = p.x - W / 2, dy = p.y - H / 2, dl = Math.hypot(dx, dy) || 1, far = rnd(1.05, 1.5) * W;
        var camera = k % 4 === 3;                       // every fourth app drops from the camera instead
        a.fly = {
          delay: 90 + k * 62 + rnd(0, 120), dur: rnd(1050, 1500), camera: camera,
          x0: camera ? W / 2 + dx * .25 : W / 2 + dx / dl * far + rnd(-.2, .2) * W,
          y0: camera ? H / 2 + dy * .25 : H / 2 + dy / dl * far * .8 + rnd(-.2, .2) * H,
          s0: camera ? 3.4 : rnd(1.5, 2.1), bend: rnd(-.35, .35)
        };
        a.hist = []; a.landed = false; a.el.classList.remove('is-landed');
      });
      rush = { t0: now, warp: warp };
    }
    function layout(now, dt) {
      var g0 = geo(0), g1 = geo(1), G = [g0, g1];
      RINGS.forEach(function (R, r) {
        var g = G[r], cxs = g.cx.toFixed(1), cys = g.cy.toFixed(1), rot = (g.roll * 180 / Math.PI).toFixed(2), tr = 'translate(' + cxs + ' ' + cys + ') rotate(' + rot + ')';
        if (ringTr[r] !== tr) { ringTr[r] = tr; ringG[r][0].setAttribute('transform', tr); ringG[r][1].setAttribute('transform', tr); }
        var rx = g.rx.toFixed(1), ry = g.ry.toFixed(1), q = gRing[r] || (gRing[r] = {});
        if (ringRR[r] !== rx + ' ' + ry) {                     // the ring paths only change when the tilt does
          ringRR[r] = rx + ' ' + ry;
          backP[r].setAttribute('d', 'M-' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' 0');
          frontP[r].setAttribute('d', 'M' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 -' + rx + ' 0');
          halo[r].setAttribute('d', 'M' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 -' + rx + ' 0');
          q.rx = +rx; q.ry = +ry; q.len = halfEllipse(q.rx, q.ry);
        }
        q.cx = +cxs; q.cy = +cys; q.roll = +rot;               // the glint rides the front arc with exactly these numbers
        // a highlight sweeps the near side of each ring in the direction its apps travel, then rests
        var u = (now / (r ? 4.6 : 3.6)) % 1500;
        gHead[r] = R.dir > 0 ? u - 200 : 1200 - u;
      });
      var t = rush ? now - rush.t0 : 1e9, flying = 0;
      apps.forEach(function (a) {
        var R = RINGS[a.ring], p = at(G[a.ring], a.slot + rot[a.ring]);
        var sc = .8 + .34 * p.d, op = .42 + .58 * p.d, blur = p.d < .5 ? (.5 - p.d) * 3.2 : 0;
        var x = p.x, y = p.y, spin = 0, fly = false;
        if (a.fly && !a.landed) {
          var f = a.fly, q = clamp((t - f.delay) / f.dur, 0, 1), e = easeOut(q);
          if (q <= 0) { setOp(a, '0'); a.x = p.x; a.y = p.y; a.d = p.d; return; }
          if (q >= 1) {
            a.landed = true; landed++; a.el.classList.add('is-landed');
            if (landed === apps.length) { root.classList.add('is-live'); nextPacket = now + 700; }
          } else {
            flying++; fly = true;
            var mx = (f.x0 + x) / 2 - (y - f.y0) * f.bend, my = (f.y0 + y) / 2 + (x - f.x0) * f.bend;
            var u = 1 - e;
            x = u * u * f.x0 + 2 * u * e * mx + e * e * p.x; y = u * u * f.y0 + 2 * u * e * my + e * e * p.y;
            sc = lerp(f.s0, sc, e); blur = lerp(f.camera ? 10 : 7, blur, e); op = op * clamp(q * 3.2, 0, 1);
            spin = (1 - e) * (f.camera ? 0 : 38 * (f.bend > 0 ? 1 : -1));
            a.hist.push(x, y); if (a.hist.length > 20) a.hist.splice(0, 2);
          }
        }
        if (a === hot) { sc *= 1.22; op = 1; blur = 0; }
        else if (hot) op *= .55;
        // stacking in a few bands (behind or in front of the dashboard, near or far): every change of z-index
        // re-layers the hero, so it changes a few times a lap, not every few frames
        var s = a.sz || R.size, z = p.d >= .5 ? 30 + Math.round(p.d * 4) : 1 + Math.round(p.d * 6);
        if (a === hot) z = 60;
        a.x = x; a.y = y; a.d = p.d;
        var tf = 'translate(' + (x - s / 2).toFixed(1) + 'px,' + (y - s / 2).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')' + (spin ? ' rotate(' + spin.toFixed(1) + 'deg)' : '');
        if (a.tf !== tf) { a.tf = tf; a.pos.style.transform = tf; }
        setOp(a, op.toFixed(3));
        // depth-of-field blur: at rest two steps on the far side of the orbit (a change re-layers the hero, so
        // an app changes it about four times a lap); while it flies in, whole pixels
        var fl = a === hot ? '' : fly ? (blur > .5 ? 'blur(' + Math.round(blur) + 'px)' : '') : (p.d < .2 ? 'blur(1.4px)' : p.d < .36 ? 'blur(.7px)' : '');
        if (a.fl !== fl) { a.fl = fl; a.pos.style.filter = fl; }
        if (a.z !== z) { a.z = z; a.pos.style.zIndex = z; }
      });
      drawFx(t, flying);
      if (hot) {
        var ct = coreTarget(), hx = hot.x, hy = hot.y;
        var hd = 'M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + 'Q' + ((hx + ct.x) / 2).toFixed(1) + ' ' + (Math.min(hy, ct.y) - 40).toFixed(1) + ' ' + ct.x.toFixed(1) + ' ' + ct.y.toFixed(1);
        if (hd !== hbD) { hbD = hd; hoverBeam.setAttribute('d', hd); }
      }
      stepPackets(now, dt);
      drawGl();
    }
    // The glint was a 55-unit dash on the front arc (pathLength 1000) with its offset animated, and each packet
    // a beam drawn along its curve behind a dot and its halo: the same dashes, curves and colours, on the canvas.
    function drawGl() {
      if (!gx || !gl.width) return;
      var any = packets.length > 0, r, q;
      for (r = 0; r < 2; r++) if (gRing[r] && gHead[r] > -55 && gHead[r] < 1000) any = true;
      if (!any) { if (glDirty) { gx.setTransform(1, 0, 0, 1, 0, 0); gx.clearRect(0, 0, gl.width, gl.height); glDirty = false; } return; }
      glDirty = true;
      gx.setTransform(1, 0, 0, 1, 0, 0); gx.clearRect(0, 0, gl.width, gl.height);
      var sx = gl.width / (W * 1.3), sy = gl.height / (H * 1.08), ox = W * .15 * sx, oy = H * .04 * sy;
      gx.lineCap = 'round'; gx.globalAlpha = 1;
      for (r = 0; r < 2; r++) {
        q = gRing[r]; var hd = gHead[r];
        if (!q || !q.len || hd <= -55 || hd >= 1000) continue;
        var k = q.len / 1000;
        gx.setTransform(sx, 0, 0, sy, ox, oy); gx.translate(q.cx, q.cy); gx.rotate(q.roll * Math.PI / 180);
        gx.beginPath(); gx.ellipse(0, 0, q.rx, q.ry, 0, 0, Math.PI);
        gx.setLineDash([55 * k, 2400 * k]); gx.lineDashOffset = -hd * k;
        gx.lineWidth = 3; gx.strokeStyle = '#3167CA'; gx.stroke();
      }
      gx.setTransform(sx, 0, 0, sy, ox, oy);
      packets.forEach(function (p) {
        var c = p.c;
        gx.globalAlpha = p.a;
        gx.beginPath(); gx.moveTo(c.x0, c.y0); gx.quadraticCurveTo(c.x1, c.y1, c.x2, c.y2);
        gx.setLineDash([p.len, p.len]); gx.lineDashOffset = p.len * (1 - p.e);
        gx.lineWidth = 1.4; gx.strokeStyle = 'rgba(49,103,202,.36)'; gx.stroke();
        gx.setLineDash([]);
        gx.beginPath(); gx.arc(p.x, p.y, 9, 0, TAU); gx.fillStyle = 'rgba(49,103,202,.2)'; gx.fill();
        gx.beginPath(); gx.arc(p.x, p.y, 3.6, 0, TAU); gx.fillStyle = '#3167CA'; gx.fill();
      });
      gx.globalAlpha = 1; gx.setLineDash([]);
    }
    function setOp(a, v) { if (a.op !== v) { a.op = v; a.pos.style.opacity = v; } }
    var fxDirty = false;                               // a flag in script, not a data- attribute written every frame
    function drawFx(t, flying) {
      var warpOn = rush && t >= 0 && t < 1100;
      // the canvas is twice the stage in each direction: hidden while empty, so the compositor skips it
      if (!flying && !warpOn) { if (fxDirty) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, fx.width, fx.height); fxDirty = false; fx.style.visibility = 'hidden'; } return; }
      if (!fxDirty) fx.style.visibility = '';
      fxDirty = true;
      ctx.setTransform(fdpr, 0, 0, fdpr, 0, 0); ctx.clearRect(0, 0, W * 2, H * 2);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.lineCap = 'round';
      if (warpOn) {
        var k = t / 1100, cx = W / 2, cy = H / 2;
        rush.warp.forEach(function (w) {
          var r = w.r - w.v * k; if (r < W * .18) return;
          var a0 = Math.cos(w.a), b0 = Math.sin(w.a) * .8;
          var al = Math.sin(Math.PI * k) * .55;
          var gr = ctx.createLinearGradient(cx + a0 * r, cy + b0 * r, cx + a0 * (r + w.len), cy + b0 * (r + w.len));
          gr.addColorStop(0, 'rgba(49,103,202,' + al.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(111,160,245,0)');
          ctx.strokeStyle = gr; ctx.lineWidth = w.w;
          ctx.beginPath(); ctx.moveTo(cx + a0 * r, cy + b0 * r); ctx.lineTo(cx + a0 * (r + w.len), cy + b0 * (r + w.len)); ctx.stroke();
        });
      }
      apps.forEach(function (a) {
        var h = a.hist; if (a.landed || h.length < 6) return;
        var x0 = h[0], y0 = h[1], x1 = h[h.length - 2], y1 = h[h.length - 1];
        var sz = a.sz || RINGS[a.ring].size;
        [[sz * .62, 'rgba(111,160,245,0)', 'rgba(111,160,245,.30)'], [sz * .16, 'rgba(49,103,202,0)', 'rgba(49,103,202,.75)']].forEach(function (L) {
          var gr = ctx.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, L[1]); gr.addColorStop(1, L[2]);
          ctx.strokeStyle = gr; ctx.lineWidth = L[0];
          ctx.beginPath(); ctx.moveTo(x0, y0);
          for (var i = 2; i < h.length; i += 2) ctx.lineTo(h[i], h[i + 1]);
          ctx.stroke();
        });
      });
      ctx.restore();
    }
    function spawnPacket(now) {
      var cands = apps.filter(function (a) { return a.landed && a !== hot && a.d > .56 && EVENTS[a.mod]; });
      if (!cands.length) return;
      var a = cands[Math.random() * cands.length | 0], ct = coreTarget();
      // the same curve as before (same rounding, same random draws in the same order), drawn by drawGl()
      var P0 = [a.x.toFixed(1), a.y.toFixed(1)], P1 = [((a.x + ct.x) / 2 + rnd(-60, 60)).toFixed(1), (Math.min(a.y, ct.y) - rnd(30, 90)).toFixed(1)], P2 = [ct.x.toFixed(1), ct.y.toFixed(1)];
      var c = quadCurve(+P0[0], +P0[1], +P1[0], +P1[1], +P2[0], +P2[1]);
      replay(a.el, 'is-send', ['cineSend']);
      var key = EVENT_KEYS[EVENT_KEYS.indexOf(a.mod)];
      packets.push({ c: c, len: c.len, t0: now, dur: 820, key: key, e: 0, a: 1, x: c.x0, y: c.y0 });
    }
    function stepPackets(now) {
      if (!reduce && landed === apps.length && !popOpen() && now > nextPacket && packets.length < 3) { spawnPacket(now); nextPacket = now + rnd(1300, 2300); }
      packets = packets.filter(function (p) {
        var q = clamp((now - p.t0) / p.dur, 0, 1), e = easeInOut(q), pt = quadAt(p.c, p.len * e, PT);
        p.e = e; p.x = pt.x; p.y = pt.y; p.a = q > .9 ? (1 - q) * 10 : 1;
        if (q >= 1) { arrive(p.key); return false; }
        return true;
      });
    }
    function arrive(key) {
      if (!key) return;
      var li = document.createElement('li');
      li.className = 'is-new';
      li.innerHTML = oiImg(key, 18) + '<span>' + EVENTS[key]() + '</span><time>now</time>';
      feed.insertBefore(li, feed.firstChild);
      var rows = $$('li', feed);
      rows.forEach(function (r, i) { var tm = $('time', r); if (tm && i) tm.textContent = ['now', '1 min', '3 min', '6 min'][i] || ''; });
      while (rows.length > 3) { var old = rows.pop(); old.remove(); }
      if (hand && /^\d[\d,]*$/.test(hand.textContent)) hand.textContent = (parseInt(hand.textContent.replace(/,/g, ''), 10) + 1 + (Math.random() * 2 | 0)).toLocaleString();
      replay(core, 'is-ping', ['cinePing']);
    }
    function frame() {
      // one clock for everything (rAF stamps and performance.now() can differ)
      var now = performance.now();
      raf = 0;
      if (!on || !live()) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      var target = popOpen() || hot ? 0 : spdT;
      spd += (target - spd) * Math.min(1, dt * (hot ? 14 : target < spd ? 6 : 2.2));
      if (!dragging) dragV *= Math.pow(.18, dt);
      RINGS.forEach(function (R, r) { rot[r] += (R.dir * TAU / R.lap * spd + dragV * (r ? .8 : 1)) * dt; });
      if (!hot) { tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 3.2); tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 3.2); }
      layout(now, dt);
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (on && !raf && !reduce && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    // pointer: tilt the plane, slow down to aim, drag to spin, hover to stop
    root.addEventListener('pointermove', function (e) {
      var r = root.getBoundingClientRect();
      if (dragging) {
        var now = performance.now(), dx = e.clientX - lastX, dts = Math.max(8, now - lastT) / 1000;
        dragV = clamp(dragV * .5 + (dx / W) * 5.2 / dts * .5, -9, 9); lastX = e.clientX; lastT = now;
      }
      if (hot) return;                              // a hovered app stays exactly under the pointer
      tilt.tx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5);
      tilt.ty = clamp((e.clientY - r.top) / r.height - .5, -.5, .5);
    });
    root.addEventListener('pointerenter', function () { spdT = .32; });
    root.addEventListener('pointerleave', function () { spdT = 1; tilt.tx = tilt.ty = 0; });
    root.addEventListener('pointerdown', function (e) {
      if (reduce || e.target.closest('.cine-app') || e.button) return;
      dragging = true; lastX = e.clientX; lastT = performance.now(); root.classList.add('is-drag');
      try { root.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    });
    function endDrag() { dragging = false; root.classList.remove('is-drag'); }
    root.addEventListener('pointerup', endDrag); root.addEventListener('pointercancel', endDrag);
    // keep a drag on the stage from being read as a carousel swipe
    root.addEventListener('touchend', function (e) { e.stopPropagation(); }, { passive: true });
    function hotOn(a) {
      if (leaveT) { clearTimeout(leaveT); leaveT = 0; }
      if (hot && hot !== a) hot.el.classList.remove('is-hover');
      hot = a; a.el.classList.add('is-hover'); root.classList.add('is-focus');
      if (reduce) layout(performance.now(), 0);
    }
    function hotOff(a) {
      if (leaveT) clearTimeout(leaveT);
      leaveT = setTimeout(function () {
        leaveT = 0; if (hot !== a) return;
        a.el.classList.remove('is-hover'); hot = null; root.classList.remove('is-focus');
        if (reduce) layout(performance.now(), 0);
      }, 160);
    }
    apps.forEach(function (a) {
      a.el.addEventListener('pointerenter', function () { hotOn(a); });
      a.el.addEventListener('pointerleave', function () { hotOff(a); });
      a.el.addEventListener('focus', function () { hotOn(a); });
      a.el.addEventListener('blur', function () { hotOff(a); });
    });
    window.addEventListener('resize', function () { if (on) { size(); layout(performance.now(), 0); } else measured = false; });
    // the stage and the dashboard are measured when they are first laid out and whenever they change size
    watchSize([root, core], function () {
      var changed = (root.offsetWidth || 1) !== W || (root.offsetHeight || 1) !== H;
      size();
      if (on && changed) layout(performance.now(), 0);
    });
    build();
    return {
      root: root,
      enter: function (first) {
        on = true;
        if (!measured || !hasRO) size();               // normally already measured: no layout read on a slide change
        if (fxDirty) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, fx.width, fx.height); fxDirty = false; }   // size() used to clear it
        var now = performance.now();
        if (reduce) { startRush(now); layout(now, 0); return; }
        // hold the apps off-stage until the camera has nearly settled, then rush them in (phones have no camera move)
        apps.forEach(function (a) { a.fly = null; a.landed = false; setOp(a, '0'); });
        startRush(now + (first ? 900 : phone.matches ? 260 : 1250));
        wake();
      },
      leave: function () { on = false; hot = null; root.classList.remove('is-focus', 'is-drag'); dragging = false; },
      wake: wake
    };
  }

  /* ================================================================== 2 · process map */
  function PMap(root) {
    var view = $('.pm-view', root), cam = $('.pm-cam', root), svg = $('.pm-svg', root), labels = $('.pm-elabels', root);
    var log = $('.pm-log', root), kFlight = $('[data-k="flight"]', root), kHand = $('[data-k="hand"]', root);
    var nodes = {};
    $$('.pm-node', root).forEach(function (el) {
      // the arrival ping: a ring grown and faded on the compositor (it was an animated box-shadow, repainted
      // every frame). A static mask keeps the icon's own box clear, as the shadow did; first in the icon, so
      // the count badge stays on top of it.
      var ic = $('.pm-ic', el), ping = document.createElement('i');
      ping.className = 'pm-ping'; ping.setAttribute('aria-hidden', 'true'); ping.appendChild(document.createElement('i'));
      ic.insertBefore(ping, ic.firstChild);
      nodes[el.dataset.pn] = { el: el, ic: ic, n: $('.pm-n', el), count: 0, gate: el.classList.contains('pm-gate') };
    });
    // route kinds: h straight · v vertical (node bottom → icon top) · vh down-then-across · hv across-then-up/down
    //              loop back above two nodes · self loop above a gateway · bus under a lane
    var EDGES = {
      e1: { a: 'lead', b: 'quote', r: 'h' }, e2: { a: 'quote', b: 'g_sign', r: 'h' },
      e3: { a: 'g_sign', b: 'order', r: 'h', l: 'signed' }, e4: { a: 'g_sign', b: 'quote', r: 'loop', l: 'no · revise', dash: 1 },
      e5: { a: 'order', b: 'g_stock', r: 'v' }, e6: { a: 'g_stock', b: 'pick', r: 'h', l: 'in stock', lt: .3 },
      e7: { a: 'g_stock', b: 'mo', r: 'vh', l: 'make', lt: .8 }, e8: { a: 'g_stock', b: 'po', r: 'vh', l: 'buy', lt: .86 },
      e9: { a: 'mo', b: 'po', r: 'v', l: 'components', dash: 1 }, e10: { a: 'mo', b: 'g_qc', r: 'h' },
      e11: { a: 'g_qc', b: 'pick', r: 'hv', o: 7, l: 'pass', lt: .22 }, e12: { a: 'g_qc', b: 'mo', r: 'loop', l: 'fail · rework', dash: 1 },
      e13: { a: 'po', b: 'receipt', r: 'h' }, e14: { a: 'receipt', b: 'pick', r: 'hv', o: -7, l: 'received', lt: .2 },
      e15: { a: 'receipt', b: 'vbill', r: 'v', l: '3-way match' }, e16: { a: 'vbill', b: 'vpay', r: 'h' },
      e17: { a: 'pick', b: 'ship', r: 'h' }, e18: { a: 'ship', b: 'inv', r: 'v', l: 'on delivery', lt: .45 },
      e19: { a: 'inv', b: 'g_paid', r: 'h' }, e20: { a: 'g_paid', b: 'recon', r: 'h', l: 'paid' },
      e21: { a: 'g_paid', b: 'g_paid', r: 'self', l: 'overdue · reminder', dash: 1 }, e22: { a: 'vpay', b: 'recon', r: 'bus', l: 'bank feed' },
      e23: { a: 'recon', b: 'reports', r: 'h' }
    };
    var HEAD = ['e1', 'e2'], SIGN = ['e3', 'e5'], SIGN_NO = ['e4', 'e2', 'e3', 'e5'];
    var SHIP = ['e17', 'e18', 'e19'], PAID = ['e20', 'e23'], LATE = ['e21', 'e20', 'e23'];
    var PAY = { fork: ['e15', 'e16', 'e22'], c: 'pay' }, MAKE_PAY = { fork: ['e9', 'e13', 'e15', 'e16', 'e22'], c: 'pay' };
    function route(kind, o) {
      o = o || {};
      var r = HEAD.concat(o.noSign ? SIGN_NO : SIGN);
      if (kind === 'stock' || kind === 'late') r = r.concat(['e6']);
      if (kind === 'buy') r = r.concat(['e8', 'e13', PAY, 'e14']);
      if (kind === 'make') r = r.concat(['e7', MAKE_PAY, 'e10'], o.qcFail ? ['e12', 'e10'] : [], ['e11']);
      r = r.concat(SHIP, kind === 'late' || o.late ? (o.late2 ? ['e21'].concat(LATE) : LATE) : PAID);
      return r;
    }
    var SCEN = {
      all: function () { var k = Math.random(); return k < .42 ? 'stock' : k < .66 ? 'buy' : k < .88 ? 'make' : 'late'; },
      stock: function () { return 'stock'; }, buy: function () { return 'buy'; }, make: function () { return 'make'; }, late: function () { return 'late'; }
    };
    var PATHS = {
      stock: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      buy: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'po', 'receipt', 'vbill', 'vpay', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      make: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'mo', 'g_qc', 'po', 'receipt', 'vbill', 'vpay', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      late: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports']
    };
    var EPATHS = {
      stock: ['e1', 'e2', 'e3', 'e5', 'e6', 'e17', 'e18', 'e19', 'e20', 'e23'],
      buy: ['e1', 'e2', 'e3', 'e5', 'e8', 'e13', 'e14', 'e15', 'e16', 'e22', 'e17', 'e18', 'e19', 'e20', 'e23'],
      make: ['e1', 'e2', 'e3', 'e5', 'e7', 'e9', 'e10', 'e11', 'e12', 'e13', 'e15', 'e16', 'e22', 'e17', 'e18', 'e19', 'e20', 'e23'],
      late: ['e1', 'e2', 'e3', 'e5', 'e6', 'e17', 'e18', 'e19', 'e21', 'e20', 'e23']
    };
    var TIPS = {
      lead: 'Web form, email or WhatsApp → lead assigned', quote: 'Template + pricelist → sent to sign online',
      g_sign: 'Signed → order · no reply → revise and resend', order: 'Confirm → delivery created, stock checked',
      g_stock: 'Routes decide: reserve, buy or manufacture', mo: 'Bill of materials → work orders, components used',
      g_qc: 'Control point: pass → stock · fail → quality alert', po: 'Reorder rule → RFQ with vendor price and lead time',
      receipt: 'Barcode receipt → stock in, bill allowed', vbill: 'Digitised bill matched to order and receipt',
      vpay: 'Batch payment of bills due', pick: 'Barcode picking, packing, carrier label',
      ship: 'Validate → stock out, invoice ready', inv: 'From delivered quantities, with a payment link',
      g_paid: 'Bank feed match · overdue → follow-up level', recon: 'Reconciliation rules match the statement',
      reports: 'P&L, GST and cash forecast, no exports'
    };
    var W = 1, H = 1, geoE = {}, tokens = [], raf = 0, last = 0, on = false, scen = 'all', nextSpawn = 0, hand = 0, revealing = null, panning = null, hotNode = null, leaveT = 0;
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { view.addEventListener(ev, function () { panning = null; }, { passive: true }); });
    var DOC = { S: 419, PO: 88, MO: 31, IN: 231, OUT: 412, INV: 147 };
    // measured geometry (offsets inside the camera, so camera moves never change it), the edge label
    // elements and the last in-flight count, so frames read nothing from layout
    var NB = {}, IB = {}, VW = 1, VH = 1, room = 0, drawn = false, labelOf = {}, flightN = -1, PT = { x: 0, y: 0 };

    function nb(id) { return NB[id] || box(nodes[id].el, cam); }
    function ib(id) { return IB[id] || box(nodes[id].ic, cam); }
    function measure() {                               // every read draw() needs, before it writes anything
      var m = { W: cam.offsetWidth || 1, H: cam.offsetHeight || 1, VW: view.offsetWidth, VH: view.offsetHeight, room: view.scrollWidth - view.clientWidth, NB: {}, IB: {} };
      Object.keys(nodes).forEach(function (id) { m.NB[id] = box(nodes[id].el, cam); m.IB[id] = box(nodes[id].ic, cam); });
      return m;
    }
    function sameGeo(m) {
      if (m.W !== W || m.H !== H || m.VW !== VW || m.VH !== VH || m.room !== room) return false;
      return Object.keys(nodes).every(function (id) {
        var a = m.NB[id], b = NB[id], c = m.IB[id], d = IB[id];
        return b && d && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h && c.x === d.x && c.y === d.y && c.w === d.w && c.h === d.h;
      });
    }
    function edgeD(e) {
      var A = ib(e.a), B = ib(e.b), An = nb(e.a), Bn = nb(e.b), g = 4, o = e.o || 0;
      switch (e.r) {
        case 'h': return rounded([[A.r + g, A.cy], [B.x - g - 3, B.cy]], 0);
        case 'v': return rounded([[An.cx, An.b + 1], [B.cx, B.y - g - 3]], 0);
        case 'vh': return rounded([[An.cx, An.b + 1], [An.cx, B.cy], [B.x - g - 3, B.cy]], 10);
        case 'hv': return rounded([[A.r + g, A.cy], [B.cx + o, A.cy], [B.cx + o, Bn.b + g + 3]], 10);
        case 'loop': var top = Math.min(A.y, B.y) - 17;
          return rounded([[A.cx, A.y - g], [A.cx, top], [B.cx + 6, top], [B.cx + 6, B.y - g - 3]], 9);
        case 'self': return 'M' + (A.cx - 7) + ' ' + (A.y - 2) + 'C' + (A.cx - 30) + ' ' + (A.y - 38) + ' ' + (A.cx + 30) + ' ' + (A.y - 38) + ' ' + (A.cx + 7) + ' ' + (A.y - 5);
        case 'bus': var y = Math.max(An.b, Bn.b) + 9;
          return rounded([[An.cx, An.b + 1], [An.cx, y], [Bn.cx, y], [Bn.cx, Bn.b + 4]], 7);
      }
      return '';
    }
    // Builds the edges from measured geometry. Runs when the map is first laid out and when it changes
    // (ResizeObserver, window resize, web fonts), not on every slide change as before: the result is the same.
    function draw(m) {
      m = m || measure();
      W = m.W; H = m.H; VW = m.VW; VH = m.VH; room = m.room; NB = m.NB; IB = m.IB;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var html = '<defs><marker id="pm-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5z"/></marker>' +
        '<marker id="pm-arrow-hot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5z"/></marker></defs><g class="pm-edges"></g><g class="pm-toks"></g>';
      svg.innerHTML = html;
      var ge = $('.pm-edges', svg), lab = '', made = [];
      Object.keys(EDGES).forEach(function (id) {       // all the writes first ...
        var e = EDGES[id], p = svgEl('path', { d: edgeD(e), 'class': 'pm-e' + (e.dash ? ' pm-e--dash' : ''), 'data-e': id, 'marker-end': 'url(#pm-arrow)' });
        ge.appendChild(p); made.push([id, e, p]);
      });
      made.forEach(function (x) {                      // ... then the path reads, 2 px apart along each edge
        var id = x[0], e = x[1], p = x[2], T = pathTable(p, 2);
        geoE[id] = { p: p, len: T.len, T: T };
        if (e.l) { var pt = p.getPointAtLength(T.len * (e.lt || .5)); lab += '<span class="pm-el' + (e.dash ? ' pm-el--dash' : '') + '" data-e="' + id + '" data-l="' + e.l + '" style="left:' + pt.x.toFixed(1) + 'px;top:' + pt.y.toFixed(1) + 'px">' + e.l + '</span>'; }
      });
      labels.innerHTML = lab;
      if (flashL) flashL.textContent = '';
      flashOf = {};
      labelOf = {}; $$('.pm-el', labels).forEach(function (n) { labelOf[n.getAttribute('data-e')] = n; });
      markScen();
      drawn = true;
    }
    function markScen() {
      var np = scen === 'all' ? null : PATHS[scen], ep = scen === 'all' ? null : EPATHS[scen];
      root.classList.toggle('is-scen', !!np);
      Object.keys(nodes).forEach(function (id) { nodes[id].el.classList.toggle('is-path', !!np && np.indexOf(id) >= 0); });
      $$('[data-e]', root).forEach(function (el) { el.classList.toggle('is-path', !!ep && ep.indexOf(el.getAttribute('data-e')) >= 0); });
    }
    function color(kind) { return kind === 'buy' ? 'buy' : kind === 'make' ? 'make' : kind === 'late' ? 'late' : kind === 'pay' ? 'pay' : 'stock'; }
    // Tokens are HTML over the map (the SVG's units are CSS pixels), each in a bare wrapper that takes the
    // per-frame transform on the compositor. As SVG groups, every move re-laid out and repainted the map.
    function tokLayer() {
      var L = $('.pm-toksh', cam);
      if (!L) { L = document.createElement('div'); L.className = 'pm-toks pm-toksh'; L.setAttribute('aria-hidden', 'true'); svg.parentNode.insertBefore(L, svg.nextSibling); }
      return L;
    }
    // An edge that takes a token flashes: a blue copy of it over the map, faded out on the compositor. (The
    // edge's own stroke colour and width were animated, which re-laid out and repainted the map every frame.)
    var flashL = null, flashOf = {};
    function flash(id) {
      var ge = geoE[id]; if (!ge) return;
      var f = flashOf[id];
      if (!f) {
        if (!flashL) { flashL = document.createElement('div'); flashL.className = 'pm-flash'; flashL.setAttribute('aria-hidden', 'true'); cam.insertBefore(flashL, tokLayer()); }
        var xy = ge.T.xy, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (var i = 0; i < xy.length; i += 2) { x0 = Math.min(x0, xy[i]); x1 = Math.max(x1, xy[i]); y0 = Math.min(y0, xy[i + 1]); y1 = Math.max(y1, xy[i + 1]); }
        x0 = Math.floor(x0 - 14); y0 = Math.floor(y0 - 14); x1 = Math.ceil(x1 + 14); y1 = Math.ceil(y1 + 14);   // room for the stroke and arrowhead
        f = svgEl('svg', { 'class': 'pm-fl' + (EDGES[id].dash ? ' pm-fl--dash' : ''), 'data-e': id, viewBox: x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0) });
        f.style.cssText = 'left:' + x0 + 'px;top:' + y0 + 'px;width:' + (x1 - x0) + 'px;height:' + (y1 - y0) + 'px';
        f.appendChild(svgEl('path', { d: ge.p.getAttribute('d'), 'marker-end': 'url(#pm-arrow)' }));
        ['is-path', 'is-hot'].forEach(function (c) { if (ge.p.classList.contains(c)) f.classList.add(c); });   // markScen / hotOn keep it in step
        flashL.appendChild(f); flashOf[id] = f;
      }
      replay(f, 'is-take', ['pmTake']);
    }
    function makeToken(steps, kind, doc, at, detached) {
      var pos = document.createElement('span'); pos.style.cssText = 'position:absolute;left:0;top:0;will-change:transform';
      var g = document.createElement('span'); g.className = 'pm-tok pm-tok--' + color(kind);
      g.innerHTML = '<i class="pm-th"></i><i class="pm-td"></i>';
      pos.appendChild(g); tokLayer().appendChild(pos);
      var t = { g: g, pos: pos, steps: steps, i: 0, s: 0, wait: 0, state: 'move', kind: kind, doc: doc, v: rnd(150, 185) };
      if (at) { t.i = Math.min(steps.length - 1, at); while (t.i < steps.length && typeof steps[t.i] !== 'string') t.i++; }
      var first = geoE[steps[t.i]];
      if (first) { var p0 = tableAt(first.T, 0, PT); pos.style.transform = 'translate(' + p0.x.toFixed(1) + 'px,' + p0.y.toFixed(1) + 'px)'; }
      if (!detached) tokens.push(t);
      return t;
    }
    function spawn(kindOverride, at) {
      var kind = kindOverride || SCEN[scen]();
      var o = { noSign: Math.random() < .18, qcFail: Math.random() < .35, late: kind === 'late', late2: kind === 'late' && Math.random() < .3 };
      var doc = { S: ++DOC.S, OUT: ++DOC.OUT, INV: ++DOC.INV };
      if (kind === 'buy' || kind === 'make') doc.PO = ++DOC.PO;
      if (kind === 'make') doc.MO = ++DOC.MO;
      makeToken(route(kind, o), kind, doc, at);
    }
    function say(kind, html) {
      var li = document.createElement('li');
      li.className = 'pm-l--' + color(kind);
      li.innerHTML = '<i></i><span>' + html + '</span>';
      log.insertBefore(li, log.firstChild);
      var rows = $$('li', log); while (rows.length > 4) rows.pop().remove();
    }
    function hit(id, t, nextId) {
      var n = nodes[id]; if (!n) return;
      n.count++; n.n.textContent = n.count > 99 ? '99+' : String(n.count); n.el.classList.add('has-n');
      replay(n.el, 'is-pulse', ['pmPulse', 'pmPulseS', 'pmGate', 'pmGateTint']);
      hand++; kHand.textContent = hand.toLocaleString();
      if (nextId) {
        replay(labelOf[nextId], 'is-take', ['pmLab', 'pmLabInk']);
        flash(nextId);
      }
      var d = t.doc, k = t.kind;
      switch (id) {
        case 'lead': if (Math.random() < .5) say(k, 'New lead from the <b>website form</b>'); break;
        case 'g_sign': say(k, nextId === 'e4' ? 'No signature yet: quotation <b>revised</b>' : '<b>S00' + d.S + '</b> signed online, order confirmed'); break;
        case 'g_stock': say(k, nextId === 'e6' ? 'Stock reserved for <b>S00' + d.S + '</b>' : nextId === 'e8' ? 'Reorder rule raised <b>PO000' + d.PO + '</b>' : '<b>MO/000' + d.MO + '</b> created from the bill of materials'); break;
        case 'g_qc': say(k, nextId === 'e12' ? 'Quality alert on <b>MO/000' + d.MO + '</b>: rework' : 'Quality check passed on <b>MO/000' + d.MO + '</b>'); break;
        case 'receipt': if (!t.fork) say(k, '<b>WH/IN/00' + (++DOC.IN) + '</b> received by barcode'); break;
        case 'vbill': say('pay', 'Vendor bill matched to <b>PO000' + d.PO + '</b> and receipt'); break;
        case 'ship': say(k, '<b>WH/OUT/00' + d.OUT + '</b> delivered, invoice ready'); break;
        case 'g_paid': if (nextId === 'e21') say('late', '<b>INV/2026/0' + d.INV + '</b> overdue: reminder sent');
                       else if (nextId === 'e20') say(k, 'Payment matched from the <b>bank feed</b>'); break;
        case 'reports': if (Math.random() < .5) say(k, 'P&amp;L and cash forecast <b>updated</b>'); break;
      }
    }
    function stepTokens(dt) {
      var born = [];
      tokens = tokens.filter(function (t) {
        var step = t.steps[t.i];
        if (step && typeof step !== 'string') {                   // fork: a payables token splits off here
          var child = makeToken(step.fork, step.c, t.doc, 0, true); child.fork = true; born.push(child);
          if (step === MAKE_PAY) say('pay', 'Components short: <b>PO000' + t.doc.PO + '</b> to the vendor');
          t.i++; step = t.steps[t.i];
        }
        if (!step) { t.pos.remove(); return false; }
        var e = EDGES[step], ge = geoE[step];
        if (t.state === 'move') {
          t.s += t.v * dt;
          if (t.s >= ge.len) {
            t.s = ge.len; t.state = 'node'; t.wait = nodes[e.b].gate ? .42 : .26;
            var nxt = t.steps[t.i + 1]; if (nxt && typeof nxt !== 'string') nxt = t.steps[t.i + 2];
            hit(e.b, t, nxt);
            t.g.classList.add('is-in');
          }
          var pt = tableAt(ge.T, t.s, PT);
          t.pos.style.transform = 'translate(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px)';
        } else {
          t.wait -= dt;
          if (t.wait <= 0) {
            t.i++; t.s = 0; t.state = 'move'; t.g.classList.remove('is-in');
            if (t.i >= t.steps.length) { t.pos.remove(); return false; }
          }
        }
        return true;
      });
      if (born.length) tokens = tokens.concat(born);
      if (flightN !== tokens.length) { flightN = tokens.length; kFlight.textContent = String(flightN); }
    }
    // cinematic reveal: the camera starts close on the first lead, flies the sales lane, then pulls back
    function camAt(fx, fy, s) {
      var vw = VW, vh = VH;                            // the panel's size, measured in draw()
      var tx = clamp(vw * .42 - fx * s, vw - W * s, 0), ty = clamp(vh * .5 - fy * s, vh - H * s, 0);
      cam.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    }
    function reveal(now) {
      var r = revealing, t = now - r.t0;
      if (t < 0) { camAt(r.keys[0].x, r.keys[0].y, r.keys[0].s); return; }
      var K = r.keys, total = K[K.length - 1].t;
      if (t >= total) { cam.style.transform = ''; showAll(); return; }
      var i = 0; while (i < K.length - 2 && t > K[i + 1].t) i++;
      var a = K[i], b = K[i + 1], q = easeInOut(clamp((t - a.t) / (b.t - a.t), 0, 1));
      camAt(lerp(a.x, b.x, q), lerp(a.y, b.y, q), lerp(a.s, b.s, q));
      // draw edges and pop nodes as the camera passes them
      var edgeX = lerp(a.x, b.x, q) + VW * .45 / lerp(a.s, b.s, q);
      Object.keys(nodes).forEach(function (id) { var n = nodes[id]; if (!n.in && n.cx < edgeX) { n.in = true; n.el.classList.add('is-in'); } });
      Object.keys(geoE).forEach(function (id) { var g = geoE[id]; if (!g.in && g.x0 < edgeX) { g.in = true; g.p.classList.add('is-in'); } });
    }
    function showAll() {
      revealing = null; root.classList.remove('is-reveal'); root.classList.add('is-ready');
      Object.keys(nodes).forEach(function (id) { nodes[id].in = true; nodes[id].el.classList.add('is-in'); });
      Object.keys(geoE).forEach(function (id) { geoE[id].in = true; geoE[id].p.classList.add('is-in'); });
    }
    function startReveal(now, delay) {
      $$('.pm-node', root).forEach(function (el) { el.classList.remove('is-in'); });
      Object.keys(nodes).forEach(function (id) { var b = ib(id); nodes[id].in = false; nodes[id].cx = b.cx; });
      Object.keys(geoE).forEach(function (id) {
        var g = geoE[id]; g.in = false; g.x0 = g.T.xy[0];   // the edge's first point (getPointAtLength(0))
        // hide without animating the un-draw, then let the reveal draw it in
        g.p.style.transition = 'none'; g.p.style.setProperty('--len', g.len.toFixed(1)); g.p.classList.remove('is-in');
      });
      // re-arm the transitions two frames later, once the hidden state has been drawn (reading a computed style
      // here forced a style pass over the whole page in the click that changed the slide)
      requestAnimationFrame(function () { requestAnimationFrame(function () { Object.keys(geoE).forEach(function (id) { geoE[id].p.style.transition = ''; }); }); });
      if (reduce) { showAll(); return; }
      // phones: the map scrolls sideways in its panel, so instead of a zoom the view pans across it once
      if (phone.matches) { showAll(); panning = { t0: now + delay, dur: 5200 }; view.scrollLeft = 0; return; }
      var L = ib('lead'), O = ib('order'), S = ib('g_stock'), P = ib('receipt');
      root.classList.add('is-reveal'); root.classList.remove('is-ready');
      revealing = { t0: now + delay, keys: [
        { t: 0, x: L.cx, y: L.cy, s: 2.35 }, { t: 1000, x: O.cx, y: O.cy + 10, s: 2.05 },
        { t: 1750, x: (S.cx + P.cx) / 2, y: (S.cy + P.cy) / 2, s: 1.55 }, { t: 2750, x: W / 2, y: H / 2, s: 1 }] };
    }
    function frame() {
      // one clock for everything (rAF stamps and performance.now() can differ)
      var now = performance.now();
      raf = 0;
      if (!on || !live()) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      if (revealing) reveal(now);
      if (panning) {
        var pq = clamp((now - panning.t0) / panning.dur, 0, 1);   // room: measured in draw()
        if (pq > 0 && room > 0) view.scrollLeft = room * (pq < .72 ? easeInOut(pq / .72) : 1 - easeInOut((pq - .72) / .28) * .92);
        if (pq >= 1) panning = null;
      }
      if (!revealing) {
        if (!popOpen()) {
          stepTokens(dt);
          if (now > nextSpawn && tokens.length < 8) { spawn(); nextSpawn = now + rnd(1100, 1900); }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (on && !raf && !reduce && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    function seed() {
      // the business is already running when the camera pulls back: a few orders mid-way
      tokens.forEach(function (t) { t.pos.remove(); }); tokens = [];
      spawn('stock', 6); spawn('buy', 4); spawn('make', 5); spawn('late', 9); spawn(null, 1);
    }
    // scenario switch
    $$('[data-scen]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        scen = b.dataset.scen;
        $$('[data-scen]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        markScen();
        if (scen !== 'all') {
          tokens.forEach(function (t) { if (t.kind !== scen && !(t.fork && scen !== 'stock' && scen !== 'late')) t.pos.remove(); });
          tokens = tokens.filter(function (t) { return t.pos.isConnected; });
          spawn(null, 0); spawn(null, 5);
        }
        nextSpawn = performance.now() + 900;
      });
    });
    // hover a step: light its hand-offs in and out
    function hotOn(id) {
      if (leaveT) { clearTimeout(leaveT); leaveT = 0; }
      hotNode = id; root.classList.add('is-peek');
      Object.keys(nodes).forEach(function (k) { nodes[k].el.classList.toggle('is-hot', k === id); });
      Object.keys(EDGES).forEach(function (eid) {
        var e = EDGES[eid], on2 = e.a === id || e.b === id;
        $$('[data-e="' + eid + '"]', root).forEach(function (el) { el.classList.toggle('is-hot', on2); });
        if (on2) { nodes[e.a].el.classList.add('is-near'); nodes[e.b].el.classList.add('is-near'); }
      });
      var tip = $('.pm-tip', root) || (function () { var d = document.createElement('div'); d.className = 'pm-tip'; cam.appendChild(d); return d; })();
      var b = nb(id);
      tip.textContent = TIPS[id] || '';
      tip.style.left = b.cx.toFixed(1) + 'px'; tip.style.top = (b.y - 6).toFixed(1) + 'px';
      tip.classList.toggle('pm-tip--low', b.y < 60);
      if (b.y < 60) tip.style.top = (b.b + 6).toFixed(1) + 'px';
      tip.classList.add('is-on');
    }
    function hotOff() {
      if (leaveT) clearTimeout(leaveT);
      leaveT = setTimeout(function () {
        leaveT = 0; hotNode = null; root.classList.remove('is-peek');
        $$('.is-hot,.is-near', root).forEach(function (el) { el.classList.remove('is-hot', 'is-near'); });
        var tip = $('.pm-tip', root); if (tip) tip.classList.remove('is-on');
      }, 140);
    }
    Object.keys(nodes).forEach(function (id) {
      var el = nodes[id].el;
      el.addEventListener('pointerenter', function () { hotOn(id); }); el.addEventListener('pointerleave', hotOff);
      el.addEventListener('focus', function () { hotOn(id); }); el.addEventListener('blur', hotOff);
    });
    // moving over the map during the fly-through hands control back at once
    view.addEventListener('pointermove', function () {
      if (!revealing) return;
      var now = performance.now(), cur = revealing.keys, total = cur[cur.length - 1].t;
      if (now - revealing.t0 < total - 450) revealing.t0 = now - (total - 450);
    });
    window.addEventListener('resize', function () { if (on) { cam.style.transform = ''; draw(); showAll(); } else drawn = false; });
    watchSize([view, cam], function () {
      var m = measure();                               // layout is clean inside a ResizeObserver callback
      if (drawn && sameGeo(m)) return;
      if (!on) { draw(m); return; }                    // off-stage: redraw now, invisibly
      if (m.W !== W || m.H !== H || m.VW !== VW || m.VH !== VH) { cam.style.transform = ''; draw(m); showAll(); }   // a real resize
      else drawn = false;                              // text moved inside (web fonts): redraw on the next entry
    });
    return {
      root: root,
      enter: function (first) {
        on = true; cam.style.transform = '';
        if (!drawn || !hasRO) draw();                  // normally drawn already: no layout read on a slide change
        startReveal(performance.now(), first ? 700 : 1150);
        if (!reduce) seed();
        nextSpawn = performance.now() + 4000;
        wake();
      },
      leave: function () { on = false; revealing = null; root.classList.remove('is-reveal'); cam.style.transform = ''; },
      wake: wake
    };
  }

  /* ================================================================== 3 · launch path */
  function Journey(root) {
    // Five raised platforms climb to go-live along a lit path. The project (the orb) glides from phase to
    // phase, each phase's deliverables rise and tick off, and light beams show which offices (SG · PH · VN)
    // and your team are on it. Drag the timeline, click a platform, or let it run. The phases, deliverables
    // and owners come from the screen-reader list in the markup (.lj-plan), which search engines read too.
    // Layers, back to front: the floor grid (an SVG that moves only with the pointer tilt), the platforms'
    // shadows, one canvas with everything under the platforms that changes every frame (the offices' beams,
    // the track, the progress line and the light flowing along it), then the platforms, the lit rim, the
    // trail and the orb as separate composited pieces, and the HTML labels on top. Nothing that changes
    // every frame is SVG: SVG content can't have layers of its own, so a moving orb or dash used to restyle,
    // re-lay out and repaint the whole drawing, and re-render its mask, on every frame.
    var stage = $('.lj-stage', root), svg = $('.lj-svg', root), over = $('.lj-over', root), tip = $('.lj-tip', root);
    function mk(tag, cls, parent, before) {
      var n = tag === 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(tag);
      n.setAttribute('class', cls); n.setAttribute('aria-hidden', 'true'); parent.insertBefore(n, before || null); return n;
    }
    var svgG = mk('svg', 'lj-svg lj-svg--grid', stage, svg), worldEl = mk('div', 'lj-world', stage, svg);
    var shadesL = mk('div', 'lj-shades', worldEl), cv = mk('canvas', 'lj-cv', worldEl), fxL = mk('div', 'lj-fx', worldEl), cx = cv.getContext('2d');
    var scrub = $('.lj-scrub', root), segsEl = $('.lj-segs', root), fillEl = $('.lj-fill', root), knob = $('.lj-knob', root);
    var weekEl = $('[data-lj-week]', root), statusEl = $('[data-lj-status]', root), weekBox = $('.lj-week', root);
    // the week ring's progress arc is drawn on a canvas over the ring's track (it grew every frame)
    var ringC = weekBox ? mk('canvas', 'lj-ringc', weekBox, weekBox.firstChild) : null, rcx = ringC && ringC.getContext('2d');
    if (ringC) ringC.width = ringC.height = Math.round((phone.matches ? 34 : 40) * Math.min(2, window.devicePixelRatio || 1));
    mk('i', 'lj-fcap', fillEl.parentNode, fillEl);
    var whoEl = $('.lj-who', root), moreEl = $('.lj-more', root), moreTx = $('.lj-more span', root);
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var SPAN = 12, RATE = .9, TRAVEL = .7;                    // weeks per second; weeks the orb takes between platforms
    var OFF = { sg: ['SG', 'Singapore'], ph: ['PH', 'Taguig'], vn: ['VN', 'Ho Chi Minh'], you: ['You', 'your team'] };
    var PH = $$('.lj-plan > li', root).map(function (li, i) {
      var desc = $('span', li).textContent;
      return { i: i, s: +li.dataset.s, e: +li.dataset.e, name: $('b', li).textContent, desc: desc, when: desc.split('.')[0],
               who: (li.dataset.who || '').split(' ').filter(Boolean), whoText: li.dataset.w || '', href: li.dataset.href || '',
               more: li.dataset.more || '', icon: $('.lj-ic svg', li),
               items: $$('li', li).map(function (d) { return { s: +d.dataset.s, e: +d.dataset.e, o: d.dataset.o || 'tn', t: d.textContent.trim() }; }) };
    });
    if (!PH.length) return { root: root, enter: function () {}, leave: function () {}, wake: function () {} };
    // two stagings of the same path: a rising staircase for the wide card, a switchback for phones
    var GEO = {
      wide: { w: 640, h: 340, rx: 46, ry: 23, band: false,
              p: [[82, 262, 12], [200, 236, 20], [318, 212, 28], [436, 186, 36], [554, 160, 44]],
              off: { sg: [52, 34], ph: [112, 22], vn: [172, 34], you: [598, 302] } },
      tall: { w: 360, h: 470, rx: 40, ry: 20, band: true,
              p: [[88, 414, 10], [262, 352, 16], [98, 280, 22], [262, 208, 28], [104, 138, 34]],
              off: { you: [40, 98], sg: [226, 98], ph: [270, 98], vn: [314, 98] } }
    };
    var G = null, K = 1, P = [], L = [], total = 1, base, puck, ptag, gridG, trail = [], hist = [];
    // the path's arc-length table and the measured widths (from the ResizeObserver), so frames read no layout
    var LUT = null, PTJ = { x: 0, y: 0 }, PTF = { x: 0, y: 0 }, stageW = 0, scrubW = 0, placedK = 0, lastPc = null, ringP = -1;
    var plats = [], rims = [], shades = [], beams = {}, offs = {}, nodes = [], chips = [], chipsWrap = null, beamT = 0;
    // what the canvas draws from: the track as a Path2D, the progress gradient, how far the orb is, and the
    // fade the progress line and its flow get while a finished run resets (their CSS transition, 0.45 s ease)
    var trackP = null, grad = null, curLen = 0, progFade = { a: 1, b: 1, t0: 0, d: 450 };
    var T = 0, shown = 0, on = false, raf = 0, last = 0, holdUntil = 0, doneAt = 0, active = -1, dragging = false, hoverI = -1, resetting = false;
    var tilt = { x: 0, y: 0, tx: 0, ty: 0 }, cache = {};
    root.classList.add('is-js');

    function pathD(pts) { return 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; }
    function spline(pts) {                                    // Catmull-Rom through the platform tops, as cubic Béziers
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
             (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
      }
      return d;
    }
    function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
    function at(n, x, y, w, h) { n.dataset.x = x; n.dataset.y = y; if (w) { n.dataset.w = w; n.dataset.h = h; } return n; }
    function tick() {
      var s = svgEl('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' });
      s.appendChild(svgEl('path', { d: 'M5 12.5l4.5 4.5L19 7.5' }));
      return s;
    }
    function beamD(o, q) {
      var mx = (o[0] + q[0]) / 2, my = o[1] < q[1] ? Math.min(o[1], q[1]) - 34 : Math.max(o[1], q[1]) + 30;
      return 'M' + o[0] + ' ' + o[1] + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + q[0] + ' ' + q[1];
    }
    // the fades the canvas draws itself, timed like the CSS transitions they replace (a new target restarts
    // from wherever the fade has got to; reduced motion snaps, as the stylesheet does)
    function fadeAt(f, now) { if (reduce) return f.b; var q = (now - f.t0) / f.d; return q >= 1 ? f.b : q <= 0 ? f.a : f.a + (f.b - f.a) * EASE(q); }
    function fadeTo(f, v, now) { if (f.b === v) return; f.a = fadeAt(f, now); f.b = v; f.t0 = now; }

    function build() {
      G = phone.matches ? GEO.tall : GEO.wide;
      root.classList.toggle('lj--tall', G.band);
      stage.style.aspectRatio = G.w + ' / ' + G.h;
      svg.setAttribute('viewBox', '0 0 ' + G.w + ' ' + G.h); svgG.setAttribute('viewBox', '0 0 ' + G.w + ' ' + G.h);
      svg.textContent = ''; svgG.textContent = ''; over.textContent = ''; shadesL.textContent = ''; fxL.textContent = '';
      plats = []; rims = []; shades = []; beams = {}; offs = {}; nodes = []; trail = []; hist = []; chips = []; chipsWrap = null; cache = {}; active = -1;
      P = G.p.map(function (q) { return { x: q[0], y: q[1], h: q[2] }; });
      // an isometric floor that fades out towards the edges
      var rg = svgEl('radialGradient', { id: 'lj-fade', cx: '50%', cy: '58%', r: '60%' });
      rg.appendChild(svgEl('stop', { offset: '0', 'stop-color': '#fff' })); rg.appendChild(svgEl('stop', { offset: '1', 'stop-color': '#000' }));
      var gm = svgEl('mask', { id: 'lj-gridmask' }); gm.appendChild(svgEl('rect', { x: 0, y: 0, width: G.w, height: G.h, fill: 'url(#lj-fade)' }));
      var gdefs = svgEl('defs', {}); gdefs.appendChild(rg); gdefs.appendChild(gm); svgG.appendChild(gdefs);
      gridG = svgEl('g', { 'class': 'lj-grid', mask: 'url(#lj-gridmask)' });
      for (var k = -G.h * 2; k < G.w + G.h * 2; k += 26) {
        gridG.appendChild(svgEl('line', { x1: k, y1: 0, x2: k + G.h * 2, y2: G.h }));
        gridG.appendChild(svgEl('line', { x1: k, y1: 0, x2: k - G.h * 2, y2: G.h }));
      }
      svgG.appendChild(gridG);
      // the platforms' shadows (ellipses under each prism)
      P.forEach(function (q) { var e = el('i', 'lj-shade'); at(e, q.x - G.rx * 1.02, q.y + G.ry + q.h + 5 - G.ry * .5, G.rx * 2.04, G.ry); shadesL.appendChild(e); shades.push(e); });
      // the path: measured once here, drawn by the canvas; the offices' beams are aimed in setActive
      var d = spline(P.map(function (q) { return [q.x, q.y]; }));
      var defs = svgEl('defs', {}); base = svgEl('path', { d: d }); defs.appendChild(base); svg.appendChild(defs);
      total = base.getTotalLength() || 1;
      LUT = pathTable(base, 1);                          // the orb's positions, 1 px apart along the path
      trackP = new Path2D(d);
      Object.keys(G.off).forEach(function (k) { beams[k] = { col: k === 'you' ? '#D97B12' : '#3167CA', p: null, fade: { a: 0, b: 0, t0: 0, d: 320 } }; });
      // the progress line's gradient was an objectBoundingBox one from the path box's bottom-left corner to its
      // top-right: the same colours, as a gradient in user space
      var bx = 1e9, by = 1e9, bX = -1e9, bY = -1e9, xy = LUT.xy;
      for (var n = 0; n < xy.length; n += 2) { bx = Math.min(bx, xy[n]); bX = Math.max(bX, xy[n]); by = Math.min(by, xy[n + 1]); bY = Math.max(bY, xy[n + 1]); }
      var gx = .5 / Math.max(1, bX - bx), gy = -.5 / Math.max(1, bY - by), g2 = gx * gx + gy * gy;
      grad = cx ? cx.createLinearGradient(bx, bY, bx + gx / g2, bY + gy / g2) : null;
      if (grad) { grad.addColorStop(0, '#6FA0F5'); grad.addColorStop(1, '#3167CA'); }
      // where along the path each platform sits
      L = P.map(function (q, i) {
        if (!i) return 0;
        if (i === P.length - 1) return total;
        var best = 0, bd = 1e12;
        for (var s = 0; s <= 300; s++) {
          var len = total * s / 300, pt = base.getPointAtLength(len), dd = (pt.x - q.x) * (pt.x - q.x) + (pt.y - q.y) * (pt.y - q.y);
          if (dd < bd) { bd = dd; best = len; }
        }
        return best;
      });
      // the platforms: raised isometric prisms, each a step higher than the last, each in its own small SVG
      // so the lift is a composited transition; the lit rim is a copy on top that pulses on the compositor
      P.forEach(function (q, i) {
        var x = q.x, y = q.y, rx = G.rx, ry = G.ry, h = q.h, vx = x - rx - 2, vy = y - ry - 2, vw = rx * 2 + 4, vh = ry * 2 + h + 4, vb = vx + ' ' + vy + ' ' + vw + ' ' + vh;
        var rimD = pathD([[x, y - ry + 6], [x + rx - 12, y], [x, y + ry - 6], [x - rx + 12, y]]);
        var g = svgEl('svg', { 'class': 'lj-plat lj-c' + i, viewBox: vb, 'aria-hidden': 'true' });
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--l', d: pathD([[x - rx, y], [x, y + ry], [x, y + ry + h], [x - rx, y + h]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--r', d: pathD([[x, y + ry], [x + rx, y], [x + rx, y + h], [x, y + ry + h]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--t', d: pathD([[x, y - ry], [x + rx, y], [x, y + ry], [x - rx, y]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-rim', d: rimD }));
        var ro = svgEl('svg', { 'class': 'lj-rimo lj-c' + i, viewBox: vb, 'aria-hidden': 'true' });
        ro.appendChild(svgEl('path', { d: rimD }));
        at(g, vx, vy, vw, vh); at(ro, vx, vy, vw, vh);
        fxL.appendChild(g); fxL.appendChild(ro); plats.push(g); rims.push(ro);
      });
      // the project: a soft comet trail and the orb
      for (var t = 0; t < 7; t++) { var c = el('i', 'lj-trail'); c.style.setProperty('--r', (5.2 - t * .6).toFixed(1)); c.style.transform = 'translate(-9999px,0)'; fxL.appendChild(c); trail.push(c); }
      puck = el('span', 'lj-puck');
      puck.appendChild(el('i', 'lj-halo')); puck.appendChild(el('i', 'lj-core')); puck.appendChild(el('i', 'lj-dot'));
      fxL.appendChild(puck);
      // upright labels, icons, hit areas and the offices, laid over the drawing
      P.forEach(function (q, i) {
        var ph = PH[i], hit = el('button', 'lj-hit'), badge = el('span', 'lj-badge lj-c' + i), lab = el('span', 'lj-lab lj-c' + i);
        hit.type = 'button'; hit.setAttribute('aria-label', ph.name + ', ' + ph.desc);
        at(hit, q.x, q.y + q.h / 2, G.rx * 2, G.ry * 2 + q.h + 30);
        if (ph.icon) badge.appendChild(ph.icon.cloneNode(true));
        var tk = el('i', 'lj-tick'); tk.appendChild(tick()); badge.appendChild(tk);
        at(badge, q.x, q.y - G.ry - 15);                      // floats over the platform's back corner
        lab.appendChild(el('b', null, ph.name)); lab.appendChild(el('small', null, ph.when));
        at(lab, q.x, q.y + G.ry + q.h + 9);
        over.appendChild(lab); over.appendChild(badge); over.appendChild(hit);
        nodes.push({ hit: hit, badge: badge, lab: lab });
        hit.addEventListener('pointerenter', function () { if (fine.matches) peek(i); });
        hit.addEventListener('pointerleave', function () { if (hoverI === i) unpeek(); });
        hit.addEventListener('focus', function () { peek(i); });
        hit.addEventListener('blur', unpeek);
        hit.addEventListener('click', function () { jump(PH[i].s + .02, 7000); if (!fine.matches) { peek(i); setTimeout(unpeek, 2600); } });
      });
      // the orb's name rides beside it (HTML, so the pill always fits its text)
      ptag = el('span', 'lj-ptag', 'Your Odoo'); over.appendChild(ptag);
      Object.keys(G.off).forEach(function (k) {
        var o = el('span', 'lj-off lj-off--' + k); o.appendChild(el('b', null, OFF[k][0])); o.appendChild(el('small', null, OFF[k][1]));
        at(o, G.off[k][0], G.off[k][1]); over.appendChild(o); offs[k] = o;
      });
      // the timeline under the stage: one segment per phase, sized by its weeks
      segsEl.textContent = '';
      PH.forEach(function (ph) { var s = el('span'); s.style.flex = String(ph.e - ph.s); s.appendChild(el('b', null, ph.name)); segsEl.appendChild(s); });
      fillPc('0.00');
      placedK = 0; place();
    }
    // Positions the drawing's HTML and SVG pieces in stage pixels. The stage width comes from the
    // ResizeObserver; the pieces are rewritten only when the scale changes, and the canvas resized with them.
    function place() {
      if (!G) return;
      var w = stageW || (stageW = stage.clientWidth); if (!w) return;
      K = w / G.w;
      if (K !== placedK) {
        placedK = K;
        $$('[data-x]', stage).forEach(function (n) {
          n.style.left = (+n.dataset.x * K).toFixed(1) + 'px'; n.style.top = (+n.dataset.y * K).toFixed(1) + 'px';
          if (n.dataset.w) { n.style.width = (+n.dataset.w * K).toFixed(1) + 'px'; n.style.height = (+n.dataset.h * K).toFixed(1) + 'px'; }
        });
        fxL.style.setProperty('--k', K.toFixed(4));
        var dp = Math.min(2, window.devicePixelRatio || 1), cw = Math.max(1, Math.round(w * dp)), ch = Math.max(1, Math.round(w * G.h / G.w * dp));
        if (cv.width !== cw) cv.width = cw;
        if (cv.height !== ch) cv.height = ch;
        drawCv(performance.now());
      }
      if (chipsWrap && !G.band && active >= 0) { chipsWrap.style.left = (P[active].x * K).toFixed(1) + 'px'; chipsWrap.style.top = ((P[active].y - G.ry - 44) * K).toFixed(1) + 'px'; }
    }
    // Everything under the platforms that moves: the beams, the track, the progress line up to the orb and
    // the light flowing along it. One canvas, cleared and redrawn each frame (the SVG had a mask for the flow).
    function drawCv(now) {
      if (!cx || !trackP || !cv.width) return;
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height);
      cx.setTransform(cv.width / G.w, 0, 0, cv.height / G.h, 0, 0);
      cx.lineCap = 'round'; cx.lineJoin = 'round';
      // the offices' beams (under the track, as before): dashes marching 10 units a second, faded in and out
      cx.lineWidth = 1.6; cx.setLineDash([3, 7]); cx.lineDashOffset = reduce ? 0 : -10 * (now % 1000) / 1000;
      Object.keys(beams).forEach(function (k) {
        var b = beams[k], a = fadeAt(b.fade, now) * .7;
        if (b.p && a > .004) { cx.globalAlpha = a; cx.strokeStyle = b.col; cx.stroke(b.p); }
      });
      cx.globalAlpha = 1; cx.setLineDash([]); cx.lineWidth = 9; cx.strokeStyle = '#E6EAF3'; cx.stroke(trackP);
      var fa = fadeAt(progFade, now), len = curLen;
      if (fa > .004 && len > .05 && grad) {
        cx.globalAlpha = fa; cx.lineWidth = 5; cx.strokeStyle = grad; cx.setLineDash([total, total]); cx.lineDashOffset = total - len; cx.stroke(trackP);
        cx.globalAlpha = fa * .9; cx.lineWidth = 2; cx.strokeStyle = '#fff'; cx.setLineDash([2, 12]); cx.lineDashOffset = reduce ? 0 : -14 * (now % 1100) / 1100;
        cx.stroke(flowTo(len + 3));
      }
      cx.globalAlpha = 1;
    }
    // the flow runs from the path's start to just past the orb, dashed from the start like the masked
    // full-length flow was, so its dashes sit exactly where they did
    function flowTo(Lm) {
      var xy = LUT.xy, n = LUT.n, step = LUT.len / n, p = new Path2D(), m = Math.min(n, Math.floor(Lm / step));
      p.moveTo(xy[0], xy[1]);
      for (var i = 1; i <= m; i++) p.lineTo(xy[i * 2], xy[i * 2 + 1]);
      if (m < n) { tableAt(LUT, Lm, PTF); p.lineTo(PTF.x, PTF.y); }
      return p;
    }
    function drawRing(p) {
      ringP = p;
      var W = ringC && ringC.width; if (!W || !rcx) return;
      rcx.setTransform(1, 0, 0, 1, 0, 0); rcx.clearRect(0, 0, W, W);
      if (p <= 0) return;
      rcx.setTransform(W / 40, 0, 0, W / 40, 0, 0);          // the ring SVG's 40-unit box: r 16, 4 wide, from 12 o'clock
      rcx.beginPath(); rcx.arc(20, 20, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, p));
      rcx.lineWidth = 4; rcx.lineCap = 'round'; rcx.strokeStyle = '#3167CA'; rcx.stroke();
    }
    function sizeRing() {                              // from the ResizeObserver: layout is clean there
      if (!ringC) return;
      var s = Math.max(1, Math.round((ringC.clientWidth || 40) * Math.min(2, window.devicePixelRatio || 1)));
      if (ringC.width !== s) { ringC.width = s; ringC.height = s; }
      if (ringP >= 0) drawRing(ringP);
    }
    // The timeline fill is a rounded bar scaled from its left end (a transform, so on the compositor). The round
    // start is a separate dot and the far end sits under the knob, so the scale never squashes a visible curve.
    function fillPc(pc) {
      var w = scrubW || (scrubW = scrub.clientWidth);
      fillEl.style.transform = 'scaleX(' + (w > 3 ? clamp((+pc / 100 * w - 3) / (w - 3), 0, 1) : 0).toFixed(4) + ')';
    }
    function knobAt(pc) {
      lastPc = pc;
      var w = scrubW || (scrubW = scrub.clientWidth);
      knob.style.translate = (+pc / 100 * w).toFixed(2) + 'px 0';
    }

    function phaseAt(t) { for (var i = PH.length - 1; i > 0; i--) if (t >= PH[i].s) return i; return 0; }
    function puckLen(t) {
      var i = phaseAt(t), ph = PH[i];
      if (i === PH.length - 1) return total;
      var left = ph.e - t;
      if (left > TRAVEL) {                                    // on its platform: a slow drift across the top
        var u = clamp((t - ph.s) / Math.max(.01, ph.e - ph.s - TRAVEL), 0, 1);
        return clamp(L[i] - 5 + u * 10, 0, total);
      }
      return lerp(L[i] + 5, L[i + 1] - 5, easeInOut(1 - left / TRAVEL));
    }
    function setActive(i) {
      active = i; var ph = PH[i], now = performance.now();
      plats.forEach(function (g, j) { g.classList.toggle('is-on', j === i); });
      rims.forEach(function (g, j) { g.classList.toggle('is-on', j === i); });
      shades.forEach(function (e, j) { e.classList.toggle('is-on', j === i); });
      nodes.forEach(function (n, j) { n.badge.classList.toggle('is-on', j === i); n.lab.classList.toggle('is-on', j === i); });
      Object.keys(beams).forEach(function (k) { fadeTo(beams[k].fade, 0, now); offs[k].classList.toggle('is-on', ph.who.indexOf(k) >= 0); });
      clearTimeout(beamT);
      beamT = setTimeout(function () {                        // re-aim the beams while they are faded out
        if (active !== i) return;
        var q = P[i], t0 = performance.now();
        Object.keys(beams).forEach(function (k) {
          beams[k].p = new Path2D(beamD(G.off[k], [q.x, q.y - G.ry - 15]));   // into the phase's icon
          if (ph.who.indexOf(k) >= 0) fadeTo(beams[k].fade, 1, t0);
        });
        if (!raf) drawCv(t0);                                 // no frame loop running (reduced motion): draw them now
      }, 330);
      if (chipsWrap) { var old = chipsWrap; old.classList.add('is-gone'); setTimeout(function () { old.remove(); }, 450); }
      chipsWrap = el('div', 'lj-chips lj-c' + i);
      chips = ph.items.map(function (it) {
        var c = el('span', 'lj-chip lj-chip--' + (it.e <= it.s ? 'ms' : it.o)), ic = el('i');
        ic.appendChild(tick()); c.appendChild(ic); c.appendChild(el('b', null, it.t));
        var u = el('u'); c.appendChild(u); chipsWrap.appendChild(c);
        return { el: c, u: u, it: it, st: null };
      });
      over.appendChild(chipsWrap); place();
      moreEl.setAttribute('href', ph.href); moreTx.textContent = ph.more; whoEl.textContent = ph.whoText;
    }
    function set(key, v, fn) { if (cache[key] !== v) { cache[key] = v; fn(v); } }
    function render(dt) {
      var t = T, i = phaseAt(t);
      if (i !== active) setActive(i);
      var target = puckLen(t);
      shown = dt ? shown + (target - shown) * Math.min(1, dt * 9) : target;
      var len = clamp(shown, 0, total), pt = tableAt(LUT, len, PTJ);
      curLen = len;
      set('puck', 'translate(' + (pt.x * K).toFixed(1) + 'px,' + (pt.y * K).toFixed(1) + 'px)', function (v) { puck.style.transform = v; });
      hist.unshift(pt.x, pt.y); if (hist.length > 64) hist.length = 64;
      trail.forEach(function (c, k) {
        var j = (k + 1) * 6;
        if (hist[j + 1] != null) set('t' + k, 'translate(' + (hist[j] * K).toFixed(1) + 'px,' + (hist[j + 1] * K).toFixed(1) + 'px)', function (v) { c.style.transform = v; });
      });
      // the active phase's deliverables: hidden, in progress (with a bar), then done
      chips.forEach(function (c) {
        var it = c.it, ms = it.e <= it.s, st = t < it.s - .02 ? '' : (ms ? t >= it.s : t >= it.e) ? 'done' : 'doing';
        if (st !== c.st) { c.st = st; c.el.classList.toggle('is-in', !!st); c.el.classList.toggle('is-done', st === 'done'); }
        if (st === 'doing') c.u.style.transform = 'scaleX(' + clamp((t - it.s) / (it.e - it.s), 0, 1).toFixed(3) + ')';
      });
      nodes.forEach(function (n, j) { var dn = t >= SPAN - .001 || j < i; if (n.dn !== dn) { n.dn = dn; n.badge.classList.toggle('is-done', dn); plats[j].classList.toggle('is-done', dn); } });
      var cur = null;
      chips.forEach(function (c) { if (!cur && c.st === 'doing') cur = c; });
      if (!cur) for (var k = chips.length - 1; k >= 0; k--) if (chips[k].st === 'done') { cur = chips[k]; break; }
      set('status', cur ? cur.it.t + (cur.st === 'done' ? ' ✓' : '') : PH[i].name, function (v) { statusEl.textContent = v; });
      var wk = Math.min(SPAN, Math.floor(t) + 1);
      set('week', wk, function (v) { weekEl.textContent = String(v); scrub.setAttribute('aria-valuetext', 'Week ' + v + ' · ' + PH[i].name); });
      set('ring', (t / SPAN).toFixed(4), function (v) { drawRing(+v); });
      var pc = (t / SPAN * 100).toFixed(2);
      set('fill', pc, fillPc);
      set('knob', pc, knobAt);
      set('now', t.toFixed(1), function (v) { scrub.setAttribute('aria-valuenow', v); });
      // parallax: the floor, the path and the labels drift by different amounts under the pointer
      tilt.x += (tilt.tx - tilt.x) * Math.min(1, (dt || 1) * 4); tilt.y += (tilt.ty - tilt.y) * Math.min(1, (dt || 1) * 4);
      set('grid', 'translate(' + (-tilt.x * 5 * K).toFixed(2) + 'px,' + (-tilt.y * 3 * K).toFixed(2) + 'px)', function (v) { svgG.style.transform = v; });
      set('world', 'translate(' + (tilt.x * 3 * K).toFixed(2) + 'px,' + (tilt.y * 2 * K).toFixed(2) + 'px)', function (v) { worldEl.style.transform = v; });
      set('over', 'translate(' + (tilt.x * 5 * K).toFixed(2) + 'px,' + (tilt.y * 3.5 * K).toFixed(2) + 'px)', function (v) { over.style.transform = v; });
      // the tag follows the orb in the drawing's own parallax layer, not the overlay's
      set('ptag', 'translate(' + ((pt.x + 13 + tilt.x * 3 - tilt.x * 5) * K).toFixed(1) + 'px,' + ((pt.y + tilt.y * 2 - tilt.y * 3.5) * K).toFixed(1) + 'px) translateY(-50%)', function (v) { ptag.style.transform = v; });
      drawCv(performance.now());
    }
    function frame(now) {
      raf = 0;
      if (!on || !live()) return;
      var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (!reduce && !dragging && hoverI < 0 && now > holdUntil && !resetting) {
        if (T >= SPAN) {
          if (!doneAt) doneAt = now;
          else if (now - doneAt > 2400) {                     // all five done: fade the run out and start again
            resetting = true; root.classList.add('is-reset'); fadeTo(progFade, 0, performance.now());
            setTimeout(function () { T = 0; shown = 0; hist = []; doneAt = 0; resetting = false; root.classList.remove('is-reset'); fadeTo(progFade, 1, performance.now()); }, 500);
          }
        } else T = Math.min(SPAN, T + RATE * dt);
      }
      render(dt);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && on && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    function hold(ms) { holdUntil = performance.now() + ms; }
    function jump(v, ms) { T = clamp(v, 0, SPAN); doneAt = 0; hold(ms); wake(); }
    function peek(i) {
      hoverI = i; var ph = PH[i], q = P[i];
      tip.textContent = '';
      tip.appendChild(el('b', null, ph.name + ' · ' + ph.when)); tip.appendChild(el('span', null, ph.desc.split('. ').slice(1).join('. ') || ph.desc));
      tip.appendChild(el('small', null, ph.whoText));
      tip.hidden = false;
      tip.style.left = clamp(q.x * K, 130, (stageW || stage.clientWidth) - 130).toFixed(1) + 'px';
      tip.style.top = ((q.y - G.ry - (G.band ? 36 : 40)) * K).toFixed(1) + 'px';
      nodes[i].badge.classList.add('is-peek'); plats[i].classList.add('is-peek');
    }
    function unpeek() {
      if (hoverI >= 0) { nodes[hoverI].badge.classList.remove('is-peek'); plats[hoverI].classList.remove('is-peek'); }
      hoverI = -1; tip.hidden = true; hold(1200); wake();
    }
    function tFromX(x) { var r = scrub.getBoundingClientRect(); return clamp((x - r.left) / r.width, 0, 1) * SPAN; }
    scrub.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      dragging = true; if (scrub.setPointerCapture) scrub.setPointerCapture(e.pointerId);
      jump(tFromX(e.clientX), 6000); e.preventDefault();
    });
    scrub.addEventListener('pointermove', function (e) { if (dragging) jump(tFromX(e.clientX), 6000); });
    scrub.addEventListener('pointerup', function () { dragging = false; hold(6000); });
    scrub.addEventListener('pointercancel', function () { dragging = false; });
    scrub.addEventListener('keydown', function (e) {
      var k = e.key, v = T;
      if (k === 'ArrowRight' || k === 'ArrowUp') v += .5; else if (k === 'ArrowLeft' || k === 'ArrowDown') v -= .5;
      else if (k === 'PageUp') v += 2; else if (k === 'PageDown') v -= 2; else if (k === 'Home') v = 0; else if (k === 'End') v = SPAN; else return;
      e.preventDefault(); e.stopPropagation(); jump(v, 8000); if (reduce) render(0);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!fine.matches || reduce) return;
      var r = stage.getBoundingClientRect(); tilt.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); tilt.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
    });
    stage.addEventListener('pointerleave', function () { tilt.tx = 0; tilt.ty = 0; });
    if (hasRO) {
      var jro = new ResizeObserver(function () {
        stageW = stage.clientWidth; scrubW = scrub.clientWidth;          // clean reads: layout is already done here
        sizeRing();
        if (!G || G.band !== phone.matches) { build(); if (on) render(0); } else { place(); if (lastPc != null) { knobAt(lastPc); fillPc(lastPc); } }
      });
      jro.observe(stage); jro.observe(scrub); if (ringC) jro.observe(ringC);
    } else window.addEventListener('resize', function () { stageW = stage.clientWidth; scrubW = scrub.clientWidth; sizeRing(); build(); if (on) render(0); });
    build();
    return {
      root: root,
      enter: function (first) {
        on = true; if (!stageW) stageW = stage.clientWidth;             // normally measured already by the observer
        if (!G || G.band !== phone.matches || !stageW) build(); else place();
        T = reduce ? 10.7 : 0; shown = puckLen(T); doneAt = 0; hoverI = -1; resetting = false; root.classList.remove('is-reset');
        progFade.a = progFade.b = 1;
        hold(first ? 900 : 1400); render(0); wake();
      },
      leave: function () { on = false; tip.hidden = true; },
      wake: wake
    };
  }

  /* ================================================================== 4 · 5 · Nexi's stages */
  // Each Nexi slide is a script: a list of beats, each a cue for Nexi (nexi-bot.js, window.TNNexi), a line she
  // says (a bubble, and her voice when the visitor turned it on) and a change on the stage. A beat lasts its own
  // time, or until her spoken line ends (the carousel is held for that). Without the 3D Nexi (no WebGL, reduced
  // motion, or still loading) a drawn Nexi on the stage says the same lines.
  // Slide 4 is a website that builds itself: Nexi flies to each part and presses its controls (tap), and the
  // visitor can press every one of them too. While it presents nothing decorative moves: only the website changes.
  // Slide 5 is the brand kit, where Nexi over-reacts to every piece.
  // speakAt: when her line starts (ms into the beat). Whatever the beat changes on the stage happens before it,
  // so while she talks nothing else moves.
  var MEET = [
    { d: 1.5, cue: 'closeup', veil: 1 },
    { d: 1.9, cue: 'knock', say: 'Knock knock!', speakAt: 250 },
    { d: 2.5, cue: 'cute', say: 'Hi! It’s me, Nexi!', speakAt: 250 },
    { d: 2.9, cue: 'home', veil: 0, say: 'I’m TechNext’s AI companion.', speakAt: 1300 },
    { d: 3.6, cue: 'point', at: 'web', say: 'TechNext builds websites like this one, and puts AI like me on them!', speakAt: 700 },
    { d: 4.0, step: 0, cue: 'visit', at: 'board', say: 'Step 1: the brief. Your goals, your visitors, your pages.', speakAt: 1100 },
    { d: 5.0, step: 1, cue: 'visit', at: 'pals', tap: 'pal', say: 'Step 2: design. Your brand on every page.', speakAt: 2600 },
    { d: 5.0, step: 2, cue: 'visit', at: 'dev', tap: 'views', say: 'Step 3: build. Every page works on desktop, tablet and phone.', speakAt: 2700 },
    { d: 4.6, step: 3, cue: 'visit', at: 'chat', tap: 'ask', say: 'Step 4: an assistant like me, answering from your content.', speakAt: 1900 },
    { d: 6.2, step: 4, cue: 'visit', at: 'publish', tap: 'publish', say: 'Step 5: publish! Your site is live, and the first enquiry is in.', alt: 'Step 5: publish! Your site is live.', speakAt: 4100 },
    { d: 3.2, cue: 'point', at: 'cta', home: 900, say: 'Want a website that talks back? Let’s build it!', speakAt: 1500 }
  ];
  var BRAND = [
    { d: 2.2, cue: 'zoomin', say: 'Ooh! Brand time!', speakAt: 900 },
    { d: 2.7, cue: 'gasp', item: 'logo', pow: 'WOW!', say: 'A logo?! Gasp!', speakAt: 800 },
    { d: 2.7, cue: 'star', item: 'fan', pow: 'OOH!', say: 'Look at these colours!', speakAt: 800 },
    { d: 2.7, cue: 'love', item: 'type', pow: '♥', say: 'I love this type pair!', speakAt: 800 },
    { d: 2.7, cue: 'bigjump', item: 'phone', pow: 'YES!', say: 'Posts for every channel!', speakAt: 800 },
    { d: 2.7, cue: 'wiggle', item: 'cards', pow: 'FANCY!', say: 'Business cards too?!', speakAt: 800 },
    { d: 3.1, cue: 'faint', item: 'book', say: 'A whole brand guideline… too good…', speakAt: 800 },
    { d: 4.0, cue: 'gasp', dir: 'b', pow: 'BOLD!', say: 'Now watch. One switch…', speakAt: 2000 },
    { d: 3.8, cue: 'celebrate', dir: 'c', say: '…and every piece changes together!', speakAt: 2000 },
    { d: 3.2, cue: 'point', at: 'cta', home: 520, say: 'Want a brand kit like this? Let’s talk!', speakAt: 1100 }
  ];
  // the assistant's sample answers, for the sample interiors company on the page
  var ANSWERS = ['Yes! Offices, clinics and cafes. Shall I book a site visit?', 'Thursday at 10am. I’ll send you a reminder the day before.', 'Of course. I’m passing you to our team with this chat.'];
  // Nexi's comic bursts, in TechNext blues (the heart stays pink)
  var POW_C = { 'WOW!': '#3167CA', 'OOH!': '#2A5DBF', '♥': '#E0457F', 'YES!': '#1F4E9E', 'FANCY!': '#3A72D8', 'BOLD!': '#1B4189' };
  var NTAP = ['Hee hee, that tickles!', 'Boop! Hi again!', 'You found me!', 'Hello, friend!'];
  function NexiStage(root) {
    var slide = root.closest('.slide'), kind = root.getAttribute('data-nxh') === 'brand' ? 'brand' : 'meet';
    var BEATS = kind === 'brand' ? BRAND : MEET;
    var web = $('.nxh-web', root), cap = $('.nxh-cap', root), fx = $('.nxh-fx', root), ava = $('.nxh-ava', root);
    var chips = $$('[data-nxh-step]', root), cta = $('.actions .btn-primary', slide), desk = $('.nxh-desk', root);
    var items = {}; $$('[data-nxd-item]', root).forEach(function (b) { items[b.getAttribute('data-nxd-item')] = b; });
    var TOTAL = BEATS.reduce(function (s, b) { return s + b.d; }, 0);
    var on = false, i = 0, run = 0, mode = '', tm = 0, due = 0, left = -1, pending = null, waitT = 0, holds = {}, soon = [], phoneByScript = false;
    // her line: shown = the line on screen, line = its voice while it plays, deferSpeak = a line waiting for the
    // visitor to scroll back, startAt = a beat picked while she was still warming up
    var shown = null, line = null, deferSpeak = null, talkTok = 0, startAt = -1, pubT = 0, taken = -1;
    function nexi() { return window.TNNexi || null; }
    function live3d() { var a = nexi(); return !!(a && a.live); }
    function cueBot(name, arg) { var a = nexi(); if (mode === '3d' && a) a.cue(name, arg); }
    function sfx(n) { if (window.TNVoice) window.TNVoice.sfx(n); }
    function heroHold(why, v) { if (!!holds[why] === v) return; holds[why] = v; hero.dispatchEvent(new CustomEvent('tn:hero-hold', { detail: { why: why, on: v } })); }
    // one pausable timer for the beats: it stops while the hero is off screen or the tab is hidden
    function after(ms, fn) { clearTimeout(tm); pending = fn; left = -1; due = performance.now() + ms; if (live()) tm = setTimeout(fire, ms); else left = ms; }
    function fire() { var f = pending; pending = null; tm = 0; if (f) f(); }
    function wake() {
      if (!on) return;
      if (!live()) { if (line && window.TNVoice) window.TNVoice.stop(); }         // scrolled away: she stops mid-line
      else if (deferSpeak) { var ds = deferSpeak; deferSpeak = null; ds(); }        // back: the line she was about to say
      if (!pending) return;
      if (live() && left >= 0) { due = performance.now() + left; tm = setTimeout(fire, left); left = -1; }
      else if (!live() && left < 0) { left = Math.max(0, due - performance.now()); clearTimeout(tm); tm = 0; }
    }
    // short in-beat delays (Nexi arrives, then presses); dropped when the beat changes
    function later(ms, fn) { var id = run; soon.push(setTimeout(function () { if (on && id === run) fn(); }, ms)); }
    function clearSoon() { soon.forEach(clearTimeout); soon = []; }
    function q(sel) { return $(sel, root); }

    /* ---- slide 4: the website's controls (the same functions serve Nexi and the visitor) ---- */
    function press(el) {
      // a ring where the control is pressed
      if (!fx || !el) return;
      var rr = root.getBoundingClientRect(), r = el.getBoundingClientRect(), e = document.createElement('i');
      var sx = root.offsetWidth / (rr.width || 1), sy = root.offsetHeight / (rr.height || 1);
      e.className = 'nxh-tap';
      e.style.setProperty('--x', ((r.left - rr.left + r.width / 2) * sx).toFixed(1) + 'px'); e.style.setProperty('--y', ((r.top - rr.top + r.height / 2) * sy).toFixed(1) + 'px');
      fx.appendChild(e); setTimeout(function () { e.remove(); }, 750);
    }
    function pressed(sel, attr, val) { $$(sel, root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(val) ? 'true' : 'false'); }); }
    function setPal(k) { if (!web) return; web.dataset.pal = String(k); pressed('[data-nxh-pal]', 'data-nxh-pal', k); }
    function setFont(f) { if (!web) return; web.dataset.font = f; pressed('[data-nxh-font]', 'data-nxh-font', f); }
    /* the page is laid out at a real device width (960 / 640 / 360 px) and scaled into its frame (CSS zoom),
       so it reflows and scrolls like the real thing. The frame's size changes with the view; the observer keeps
       the scale, so a slide change never measures anything. */
    var DW = { desk: 960, tablet: 640, phone: 360 }, scroller = q('.nxh-scroll'), pg = q('.nxh-pg'), devT = 0, scrolled = false;
    function fitPage() { if (!scroller || !pg || !web) return; var w = scroller.clientWidth; if (w) pg.style.setProperty('--z', (w / DW[web.dataset.dev || 'desk']).toFixed(4)); }
    if (scroller) {
      if (hasRO) new ResizeObserver(function () { fitPage(); }).observe(scroller);
      scroller.addEventListener('scroll', function () { scrolled = scroller.scrollTop > 0; }, { passive: true });
      scroller.addEventListener('wheel', function () { visitor(); }, { passive: true });
    }
    // a view change is a short cross-fade: the frame fades out, changes size and reflows while hidden, fades back
    function setDev(d) {
      if (!web || !DW[d]) return;
      pressed('[data-nxh-dev]', 'data-nxh-dev', d);
      if (web.dataset.dev === d) return;
      clearTimeout(devT); menu(false);
      if (reduce || !web.classList.contains('is-s1')) { web.dataset.dev = d; fitPage(); return; }
      web.classList.add('is-swapping');
      devT = setTimeout(function () { web.dataset.dev = d; fitPage(); if (scroller && scrolled) { scroller.scrollTop = 0; scrolled = false; } web.classList.remove('is-swapping'); }, 160);
    }
    function section(name) { var sc = name && q('[data-sec="' + name + '"]'); return sc && sc.getClientRects().length ? sc : null; }
    function scrollTo(name) {
      if (!scroller) return;
      var sc = section(name); if (name && !sc) return;           // a page dropped in the brief is not there to scroll to
      // the section's title lands just under the page's sticky header
      var nav = q('.nxh-pg-nav'), nh = nav ? nav.getBoundingClientRect().height : 0;
      var top = sc ? sc.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - nh - 8 : 0;
      scroller.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    }
    function menu(open) {
      var nav = q('.nxh-pg-nav'), bg = q('.nxh-pg-burger'); if (!nav) return;
      nav.classList.toggle('is-menu', !!open); if (bg) bg.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    // the contact form types a sample enquiry in and sends it (at launch, or when the visitor presses Send)
    var fgen = 0, formBusy = false;
    function typeForm() {
      var send = q('.nxh-pg-send');
      if (!web || !send || formBusy || web.classList.contains('is-sent')) return;
      formBusy = true;
      var fields = $$('.nxh-f i', root), k = 0, g = fgen;
      (function next() {
        if (g !== fgen) return;
        if (k >= fields.length) { press(send); send.textContent = 'Sent'; web.classList.add('is-sent'); formBusy = false; return; }
        var f = fields[k++], text = f.getAttribute('data-type') || '', n = 0, step = Math.max(1, Math.ceil(text.length / 9));
        f.classList.add('is-typing');
        (function tick() {
          if (g !== fgen) return;
          n = Math.min(text.length, n + step); f.textContent = text.slice(0, n);
          if (n < text.length) setTimeout(tick, 30); else { f.classList.remove('is-typing'); setTimeout(next, 80); }
        })();
      })();
    }
    function clearForm() {
      fgen++; formBusy = false;
      $$('.nxh-f i', root).forEach(function (f) { f.textContent = ''; f.classList.remove('is-typing'); });
      var send = q('.nxh-pg-send'); if (send) send.textContent = 'Send';
      if (web) web.classList.remove('is-sent');
    }
    function paint() { if (web) web.classList.add('is-painted'); }
    // the assistant answers every question, in order: a new question first finishes the answer being typed
    var typing = null, asked = false;
    function ask(k, byVisitor) {
      var log = q('.nxh-chat-log'); if (!log || !ANSWERS[k]) return;
      if (byVisitor) asked = true;
      if (typing) { clearTimeout(typing.t); typing.fn(); }
      var btn = q('[data-nxh-q="' + k + '"]');
      log.setAttribute('aria-live', byVisitor ? 'polite' : 'off');
      $$('[data-nxh-q]', root).forEach(function (b0) { b0.classList.toggle('is-asked', b0 === btn); });
      function add(cls, text) { var p = document.createElement('p'); p.className = cls + ' is-new'; p.textContent = text; log.appendChild(p); while (log.children.length > 4) log.firstChild.remove(); return p; }
      add('nxh-chat-u', btn ? btn.textContent : '');
      var t = add('nxh-chat-t', ''); t.innerHTML = '<i></i><i></i><i></i>';
      var done = function () { typing = null; t.remove(); add('nxh-chat-a', ANSWERS[k]); };
      typing = { fn: done, t: setTimeout(done, 600) };
    }
    function publish() {
      if (!web || web.classList.contains('is-live') || web.classList.contains('is-publishing')) return;
      web.classList.add('is-publishing');
      clearTimeout(pubT); pubT = setTimeout(function () { if (!on) return; web.classList.remove('is-publishing'); web.classList.add('is-live'); sfx('sparkle'); }, 600);
    }
    function showStep(n) {
      if (!web) return;
      web.dataset.step = String(n);
      for (var k = 0; k <= 4; k++) web.classList.toggle('is-s' + k, k <= n);
      if (n < 1) web.classList.remove('is-painted');
      else if (n > 1) paint();
      else if (!web.classList.contains('is-painted')) later(450, paint);
      if (n < 4) web.classList.remove('is-live', 'is-publishing');
      if (n !== 2 && phoneByScript && web.dataset.dev !== 'desk') { setDev('desk'); phoneByScript = false; }
      chips.forEach(function (c, k) { var li = c.parentNode; li.classList.toggle('is-on', k === n); li.classList.toggle('is-done', k < n); c.setAttribute('aria-pressed', k === n ? 'true' : 'false'); });
    }
    function tapIt(kind2) {
      if (kind2 === 'views' && web && web.dataset.dev !== 'desk') return;      // the visitor picked a view already: keep it
      var el = kind2 === 'pal' ? q('[data-nxh-pal="1"]') : kind2 === 'views' ? q('[data-nxh-dev="tablet"]') : kind2 === 'ask' ? q('[data-nxh-q="0"]') : kind2 === 'publish' ? q('[data-nxh-publish]') : null;
      if (!el) return;
      cueBot('tap', el); press(el);
      // design: the new colours, then down the page to show them on every part
      if (kind2 === 'pal') { setPal(1); later(600, function () { if (taken !== run) scrollTo(section('work') ? 'work' : 'services'); }); }
      // build: the tablet view, then the phone view
      else if (kind2 === 'views') {
        setDev('tablet'); phoneByScript = true;
        later(1000, function () { if (taken === run) return; var ph = q('[data-nxh-dev="phone"]'); cueBot('tap', ph); press(ph); setDev('phone'); });
      }
      else if (kind2 === 'ask') { if (!asked) ask(0); }
      // launch: publish, then down to the contact form, where the first enquiry is typed in and sent
      else if (kind2 === 'publish') {
        publish();
        if (web && !web.hasAttribute('data-no-contact')) { later(700, function () { if (taken !== run) scrollTo('contact'); }); later(1400, function () { if (taken !== run) typeForm(); }); }
      }
    }

    /* ---- slide 5: the brand desk ---- */
    function drop(name) {
      // this piece and every piece before it in the script lands on the desk
      var seen = true;
      BRAND.forEach(function (b) { if (!b.item || !seen) return; var el = items[b.item]; if (el) el.classList.add('is-in'); if (b.item === name) seen = false; });
      var a = items[name]; if (!a) return;
      a.classList.remove('is-hot'); void a.offsetWidth; a.classList.add('is-hot');
    }
    var swapT = 0;
    function setDir(d) {
      if (!desk || desk.dataset.dir === d) return;
      desk.dataset.dir = d;
      $$('[data-nxd-dir]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-nxd-dir') === d ? 'true' : 'false'); });
      if (reduce) return;
      desk.classList.remove('is-swap'); void desk.offsetWidth; desk.classList.add('is-swap');
      clearTimeout(swapT); swapT = setTimeout(function () { desk.classList.remove('is-swap'); }, 1400);
    }
    function pow(el, text) {
      if (!fx || !el) return;
      var b = box(el, root), e = document.createElement('b');
      e.className = 'nxh-pow'; e.textContent = text;
      e.style.setProperty('--x', Math.min(b.r - 58, root.offsetWidth - 90) + 'px'); e.style.setProperty('--y', Math.max(0, b.y - 34) + 'px');
      e.style.setProperty('--r', rnd(-14, 14).toFixed(0) + 'deg'); e.style.setProperty('--c', POW_C[text] || '#E4572E');
      fx.appendChild(e); setTimeout(function () { e.remove(); }, 1450);
    }
    /* ---- both ---- */
    function veil(v) {
      if (v && mode === '3d') {
        // the spotlight in the veil sits where Nexi's close-up is: the middle of the hero's visible part
        var hr = hero.getBoundingClientRect(), sr = slide.getBoundingClientRect(), hd = $('[data-header]');
        var top = Math.max(hr.top, hd ? hd.getBoundingClientRect().bottom : 0), bot = Math.min(hr.bottom, window.innerHeight);
        slide.style.setProperty('--ny', Math.round((top + bot) / 2 - sr.top) + 'px');
      }
      slide.classList.toggle('is-nxh-close', !!v && mode === '3d');
    }
    function capSay(text) {
      if (!cap) return;
      cap.classList.remove('is-on'); cap.textContent = text; void cap.offsetWidth; cap.classList.add('is-on');
      if (ava && !reduce) { ava.classList.remove('is-hop'); void ava.offsetWidth; ava.classList.add('is-hop'); }
    }
    // her line: a bubble (3D) or the caption (drawn Nexi), and her voice when it is on
    function say(text, d, id) {
      var voice = window.TNVoice && window.TNVoice.live;
      var est = voice ? 0.8 + text.length * 0.068 : 0, life = Math.max(d, est) + 0.9;   // the next line replaces it
      if (mode === '3d') cueBot('say', { text: text, life: life }); else capSay(text);
      shown = { text: text, id: id };
      voiceLine(text, id);
    }
    // the voice of a line: `line` settles when it has been spoken (or stopped); cut short by another line (a tap
    // on Nexi), it settles once the voice is quiet again, so the script never talks over itself
    function voiceLine(text, id) {
      var v = window.TNVoice; if (!v || !v.live) return;
      var html = document.documentElement, tok = ++talkTok; html.classList.add('nxh-talking');
      var p = v.say(text).then(function (r) {
        if (tok === talkTok) html.classList.remove('nxh-talking');
        return r === 'cut' ? quiet() : r;
      });
      line = { id: id, p: p };
    }
    function quiet() {
      return new Promise(function (res) { var n = 0; (function chk() { if (!window.TNVoice || !window.TNVoice.speaking || ++n > 40) res(true); else setTimeout(chk, 200); })(); });
    }
    // the voice turned on while a line shows: she says that line (it is her hello), not the generic greeting
    document.addEventListener('tn:voice', function (e) {
      var d0 = e.detail || {};
      if (!on || !d0.on || !shown || shown.id !== run || line || !live()) return;
      if (e.cancelable) e.preventDefault();
      voiceLine(shown.text, run);
    });
    function target(b) {
      switch (b.at) {
        case 'web': return web;
        case 'board': return q('.nxh-board') || web;
        case 'pals': return q('.nxh-pals') || web;
        case 'dev': return q('.nxh-devs') || web;
        case 'chat': return q('.nxh-chat') || web;
        case 'publish': return q('[data-nxh-publish]') || web;
        case 'cta': return cta;
      }
      return null;
    }

    /* ---- the script ---- */
    function apply(b) {
      if ('veil' in b) veil(b.veil);
      if (b.step != null) showStep(b.step);
      if (b.item) {
        var el = items[b.item];
        cueBot('visit', el);
        later(260, function () { drop(b.item); });
        later(760, function () { cueBot(b.cue, el); if (b.pow) pow(el, b.pow); });
        return;
      }
      if (b.dir) {
        var dirs = q('.nxd-dirs'), btn = q('[data-nxd-dir="' + b.dir + '"]');
        cueBot('visit', dirs);
        later(mode === '3d' ? 800 : 300, function () { if (taken === run) return; cueBot('tap', btn); press(btn); setDir(b.dir); });
        later(mode === '3d' ? 1950 : 700, function () { cueBot(b.cue, desk); if (b.pow) pow(dirs, b.pow); });
        return;
      }
      if (b.home) { cueBot('home'); later(b.home, function () { cueBot(b.cue, target(b)); }); return; }
      cueBot(b.cue, target(b));
      if (b.tap) later(mode === '3d' ? 1000 : 400, function () { if (taken !== run) tapIt(b.tap); });
    }
    function beat() {
      if (!on) return;
      if (i >= BEATS.length) { root.classList.add('is-over'); return; }
      var b = BEATS[i], id = ++run;
      clearSoon(); deferSpeak = null; line = null; apply(b);
      // her line waits until she has arrived and the stage has changed: while she speaks nothing else moves
      var wait = mode === '3d' ? (b.speakAt || 0) : Math.min(b.speakAt || 0, 600);
      var speakNow = function () {
        if (id !== run) return;
        if (!live()) { deferSpeak = speakNow; return; }          // off screen: she says it when the visitor is back
        var text = b.alt && web && web.hasAttribute('data-no-contact') ? b.alt : b.say;
        if (text) say(text, Math.max(0.8, b.d - wait / 1000), id);
      };
      if (wait && mode === '3d') later(wait, speakNow); else speakNow();
      after(b.d * 1000, function () {
        if (id !== run) return;
        var next = function () { if (id !== run) return; heroHold('nexi-talk', false); i++; beat(); };
        // her voice still playing: the carousel waits for it, and the next beat starts when it ends (on screen)
        if (line && line.id === id) { heroHold('nexi-talk', true); line.p.then(function () { if (id !== run) return; if (live()) next(); else after(0, next); }); }
        else next();
      });
    }
    // select a step or a kit piece: the script goes on from that beat
    function jump(k) {
      if (!on || k < 0) return;
      if (!mode) { startAt = k; return; }                        // still warming up: the script starts there
      heroHold('nexi-talk', false); if (window.TNVoice) window.TNVoice.stop();
      if (slide.classList.contains('is-nxh-close')) { veil(false); cueBot('home'); }
      root.classList.remove('is-over'); i = k;
      var rest = 1.5; for (var r = k; r < BEATS.length; r++) rest += BEATS[r].d;
      hero.dispatchEvent(new CustomEvent('tn:hero-dur', { detail: { ms: Math.round(rest * 1000) } }));
      beat();
    }
    // the visitor is trying the site: the tour waits for them, so nothing changes under their hand
    function restMs() { return !pending ? 0 : tm ? Math.max(0, due - performance.now()) : Math.max(0, left); }
    var lastV = 0;
    function visitor() {
      if (!on || !mode || mode === 'static') return;
      var now = performance.now(); if (taken === run && now - lastV < 400) return; lastV = now;   // a burst (a wheel) counts once
      taken = run;                                              // this beat's scripted taps give way
      if (!pending) return;
      var f = pending, wait = Math.max(restMs(), 6000);
      after(wait, f);
      var rest = wait / 1000 + 1.5; for (var r = i + 1; r < BEATS.length; r++) rest += BEATS[r].d;
      hero.dispatchEvent(new CustomEvent('tn:hero-dur', { detail: { ms: Math.round(rest * 1000) } }));
    }
    function findBeat(key, n) { for (var k = 0; k < BEATS.length; k++) if (BEATS[k][key] === n) return k; return -1; }
    root.addEventListener('click', function (e) {
      if (!on) return;
      var t = e.target.closest('button'); if (!t || !root.contains(t)) { if (mode !== '3d' && e.target.closest('.nxh-ava')) capSay(NTAP[Math.floor(Math.random() * NTAP.length)]); return; }
      if (t.hasAttribute('data-nxh-step')) {
        var n = +t.getAttribute('data-nxh-step');
        if (mode === 'static') { showStep(n); if (n > 1) paint(); if (n === 4) web.classList.add('is-live'); capSay(BEATS[findBeat('step', n)].say); voiceLine(BEATS[findBeat('step', n)].say, run); } else jump(findBeat('step', n));
      } else if (t.hasAttribute('data-nxd-item')) {
        var nm = t.getAttribute('data-nxd-item');
        if (mode === 'static') { drop(nm); capSay(BEATS[findBeat('item', nm)].say); voiceLine(BEATS[findBeat('item', nm)].say, run); } else jump(findBeat('item', nm));
      } else if (t.hasAttribute('data-nxd-dir')) {
        press(t); setDir(t.getAttribute('data-nxd-dir')); visitor();
        if (mode === '3d') { cueBot('star', desk); pow(q('.nxd-dirs'), 'WOW!'); }
      } else if (t.hasAttribute('data-nxh-publish')) {
        press(t);
        if (mode === 'static') { showStep(4); paint(); web.classList.add('is-live'); }
        else { var k4 = findBeat('step', 4); if (+(web.dataset.step) !== 4) jump(k4); publish(); }
      } else if (t.hasAttribute('data-nxh-pal')) { press(t); setPal(+t.getAttribute('data-nxh-pal')); visitor(); }
      else if (t.hasAttribute('data-nxh-font')) { press(t); setFont(t.getAttribute('data-nxh-font')); visitor(); }
      else if (t.hasAttribute('data-nxh-dev')) {
        // a view before there is a page to show: on to the build step, in the view chosen
        press(t); setDev(t.getAttribute('data-nxh-dev')); phoneByScript = false;
        if (web.dataset.step === '-1' || web.dataset.step === '0') { if (mode === 'static') { showStep(2); paint(); } else jump(findBeat('step', 2)); }
        else visitor();
      }
      else if (t.hasAttribute('data-nxh-q')) { press(t); ask(+t.getAttribute('data-nxh-q'), true); visitor(); }
      else if (t.hasAttribute('data-pl')) { press(t); menu(false); scrollTo(t.getAttribute('data-pl')); visitor(); }
      else if (t.classList.contains('nxh-pg-burger')) { press(t); menu(t.getAttribute('aria-expanded') !== 'true'); visitor(); }
      else if (t.classList.contains('nxh-pg-send')) { press(t); typeForm(); visitor(); }
      else if (t.hasAttribute('data-nxh-page')) {
        // the brief's page map: a page added or dropped leaves (or rejoins) the menu and the page
        var pgName = t.getAttribute('data-nxh-page'), keep = t.getAttribute('aria-pressed') !== 'true';
        press(t);
        if (!keep && $$('[data-nxh-page][aria-pressed="true"]', root).length <= 1) return;   // one page besides Home stays
        t.setAttribute('aria-pressed', keep ? 'true' : 'false');
        if (keep) web.removeAttribute('data-no-' + pgName); else web.setAttribute('data-no-' + pgName, '');
        visitor();
      }
    });

    /* ---- modes: 3D Nexi, the drawn Nexi, or the still stage for reduced motion ---- */
    function reset() {
      clearSoon(); clearTimeout(tm); pending = null; clearTimeout(waitT); phoneByScript = false;
      mode = ''; shown = null; line = null; deferSpeak = null; startAt = -1; clearTimeout(pubT);
      if (web) {
        for (var k = 0; k <= 4; k++) web.classList.remove('is-s' + k);
        web.classList.remove('is-painted', 'is-live', 'is-publishing'); web.dataset.step = '-1';
        setPal(0); setFont('sans');
        clearTimeout(devT); web.classList.remove('is-swapping'); web.dataset.dev = 'desk'; pressed('[data-nxh-dev]', 'data-nxh-dev', 'desk'); menu(false);
        ['services', 'work', 'contact'].forEach(function (n2) { web.removeAttribute('data-no-' + n2); });
        $$('[data-nxh-page]', root).forEach(function (b2) { b2.setAttribute('aria-pressed', 'true'); });
        clearForm();
        if (scroller && scrolled) { scroller.scrollTop = 0; scrolled = false; }
        if (!hasRO) fitPage();
        if (typing) { clearTimeout(typing.t); typing = null; } asked = false;
        var log = q('.nxh-chat-log'); if (log) log.innerHTML = '<p class="nxh-chat-a">Hi! Ask me anything.</p>';
        $$('[data-nxh-q]', root).forEach(function (b0) { b0.classList.remove('is-asked'); });
      }
      chips.forEach(function (c2) { c2.parentNode.classList.remove('is-on', 'is-done'); c2.setAttribute('aria-pressed', 'false'); });
      Object.keys(items).forEach(function (k2) { items[k2].classList.remove('is-in', 'is-hot'); });
      if (desk) { desk.classList.remove('is-swap'); desk.dataset.dir = 'a'; $$('[data-nxd-dir]', root).forEach(function (b2) { b2.setAttribute('aria-pressed', b2.getAttribute('data-nxd-dir') === 'a' ? 'true' : 'false'); }); }
      if (cap) { cap.classList.remove('is-on'); cap.textContent = ''; }
      if (fx) fx.textContent = '';
      root.classList.remove('is-2d', 'is-over');
      slide.classList.remove('is-nxh-close');
    }
    function start(m3) {
      mode = m3; heroHold('nexi-wake', false);
      root.classList.toggle('is-2d', m3 !== '3d');
      i = 0;
      if (startAt > 0) { var k0 = startAt; startAt = -1; jump(k0); return; }   // the visitor picked a step while she warmed up
      startAt = -1; beat();
    }
    // she was late (slow network, a busy tab): the drawn Nexi started; when she is ready she takes over from the
    // next beat, so there is never a second Nexi roaming over the slide
    function handover() {
      (function poll() {
        if (!on || mode !== '2d') return;
        var b = nexi();
        if (b && b.live) { b.stage(kind, root); mode = '3d'; root.classList.remove('is-2d'); if (cap) cap.classList.remove('is-on'); return; }
        waitT = setTimeout(poll, 400);
      })();
    }
    function still() {
      // reduced motion: the finished stage, and a line from the drawn Nexi; the buttons switch states instantly
      mode = 'static'; root.classList.add('is-2d');
      if (web) {
        showStep(4); paint(); web.classList.add('is-live', 'is-sent'); ask(0);
        $$('.nxh-f i', root).forEach(function (f) { f.textContent = f.getAttribute('data-type') || ''; });
        var sd = q('.nxh-pg-send'); if (sd) sd.textContent = 'Sent';
      }
      Object.keys(items).forEach(function (k2) { items[k2].classList.add('is-in'); });
      capSay(kind === 'brand' ? 'A brand kit, designed as one system!' : 'Hi, I’m Nexi! TechNext builds websites and puts AI like me on them.');
    }
    function begin() {
      var a = nexi(), waited = 0, last = performance.now(), staged = false;
      if (a) { a.stage(kind, root); staged = true; }
      if (live3d()) { start('3d'); return; }
      if (!window.WebGLRenderingContext || document.documentElement.classList.contains('nexi-fail')) { start('2d'); return; }
      // Nexi is still loading or warming up: hold the slide for her (up to 4 s on screen), then go on without her
      heroHold('nexi-wake', true);
      (function check() {
        if (!on) return;
        var now = performance.now(); if (live()) waited += now - last; last = now;
        var b = nexi(); if (b && !staged) { b.stage(kind, root); staged = true; }
        if (live3d()) start('3d');
        else if (waited > 4000 || document.documentElement.classList.contains('nexi-fail')) { start('2d'); if (!document.documentElement.classList.contains('nexi-fail')) handover(); }
        else waitT = setTimeout(check, 120);
      })();
    }
    hero.addEventListener('tn:nexi-fail', function () { document.documentElement.classList.add('nexi-fail'); });

    return {
      root: root,
      enter: function () {
        on = true; run++; reset();
        // hero.js reads the slide's turn right after this event: the script's length plus a moment to read
        // (index.html carries the same number; if they ever differ, the carousel is told)
        var dur = String(Math.round((TOTAL + 1.5) * 1000));
        if (slide.dataset.dur !== dur) { slide.dataset.dur = dur; hero.dispatchEvent(new CustomEvent('tn:hero-dur', { detail: { ms: +dur } })); }
        if (reduce) { still(); return; }
        begin();
      },
      leave: function () {
        on = false; run++; clearSoon(); clearTimeout(tm); pending = null; clearTimeout(waitT);
        clearTimeout(pubT); clearTimeout(devT); fgen++; deferSpeak = null; line = null; shown = null;
        if (typing) { clearTimeout(typing.t); typing = null; }
        heroHold('nexi-talk', false); heroHold('nexi-wake', false);
        if (window.TNVoice) window.TNVoice.stop();
        document.documentElement.classList.remove('nxh-talking');
        var a = nexi(); if (a) a.stage(null);
        slide.classList.remove('is-nxh-close');
      },
      wake: wake
    };
  }

  /* ================================================================== 6 · Nexi Explains
     The TV cycles the reel (one episode every 2.8 s), its caption counts down to each premiere, the strip under it
     switches the TV, and Nexi's bubble on the TV corner chats every other episode. Nexi herself is nexi-bot.js
     (desktop) or a drawn render (phones, reduced motion, no WebGL; hero.css). */
  function Explains(root) {
    var items = $$('[data-nxs-item]', root), picks = $$('[data-nxs-pick]', root);
    var cap = $('[data-nxs-cap]', root), say = $('[data-nxs-say]', root);
    var nextT = $('[data-nxs-next-t]', root), nextW = $('[data-nxs-next-w]', root);
    var LINES = ['New episodes Tue, Thu & Sat!', 'One idea per episode!', 'That’s me on TV!', 'Tap an episode below!', 'Season 2 lands in 2027!'];
    var cur = 0, on = false, t = 0, li = 0;
    function when(el) { var v = Date.parse(el.getAttribute('data-premiere') || ''); return isNaN(v) ? 0 : v; }
    function left(ms) {
      var m = Math.max(1, Math.round(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
      return d ? d + ' d ' + h + ' h' : h ? h + ' h ' + (m % 60) + ' min' : m + ' min';
    }
    function state(el) { var w = when(el), now = Date.now(); return !w || w <= now ? 'Watch now' : 'Premieres in ' + left(w - now); }
    function caption() {
      var el = items[cur]; if (!el || !cap) return;
      cap.children[0].textContent = el.getAttribute('data-code');
      cap.children[1].textContent = el.getAttribute('data-title');
      cap.children[2].textContent = state(el);
    }
    function nextUp() {
      var now = Date.now(), best = null;
      items.forEach(function (el) { var w = when(el); if (w > now && (!best || w < when(best))) best = el; });
      if (!nextT || !nextW) return;
      if (!best) { nextT.textContent = 'Now on YouTube'; nextW.textContent = ''; root.classList.add('is-out'); return; }
      nextT.textContent = 'Next premiere · ' + best.getAttribute('data-code') + ' ' + best.getAttribute('data-title');
      nextW.textContent = 'in ' + left(when(best) - now);
    }
    function set(k) {
      cur = (k + items.length) % items.length;
      items.forEach(function (el, i) { el.classList.toggle('is-on', i === cur); });
      picks.forEach(function (b, i) { b.classList.toggle('is-on', i === cur); b.setAttribute('aria-pressed', i === cur ? 'true' : 'false'); });
      caption();
    }
    function chat() {
      if (!say || reduce) return;
      li = (li + 1) % LINES.length; say.textContent = LINES[li];
      say.classList.remove('is-pop'); void say.offsetWidth; say.classList.add('is-pop');
    }
    function loop() {
      clearTimeout(t);
      if (!on || reduce || !live()) return;
      t = setTimeout(function () { set(cur + 1); if (cur % 2 === 0) chat(); nextUp(); loop(); }, 2800);
    }
    picks.forEach(function (b, i) { b.addEventListener('click', function () { set(i); chat(); loop(); }); });
    function wake() { if (on) { nextUp(); caption(); loop(); } else clearTimeout(t); }
    /* the comic sky irises open from the TV (hero.css .nxs-bg) and a sound word bursts out of it; leaving, the sky
       closes with a WHOOSH. The header turns the sky's navy while it is up (html.nxs-dark). */
    var tvEl = $('.nxs-tv', root), slideEl = root.closest('.slide'), fxWord = $('[data-nxs-fx]', hero), fxT = 0, darkT = 0, IN = ['BAM!', 'POW!', 'ZAP!'], inK = 0;
    /* the circle grows from (and shrinks into) the TV's centre: set on the slide for its clip, on the burst's layer (it
       covers the hero) for the burst. Never on the hero itself: a custom property there restyles its ~1,500 elements.
       All the reads come first, then the writes, so the layout is worked out once. */
    var fxBox = fxWord && fxWord.closest('.nxs-fx'), mqEl = $('.hero-marquee', hero);
    /* measured once (and again after a resize) in a quiet moment, never inside a slide change: the read there forced
       a style + layout pass of the whole hero (~1,500 elements) on the very frame the circle starts */
    var oDone = false;
    function origin(force) {
      if (!tvEl || (oDone && !force)) return;
      var r = tvEl.getBoundingClientRect(), hr = hero.getBoundingClientRect(), sr = slideEl && slideEl.getBoundingClientRect();
      if (!r.width) return;
      oDone = true;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = Math.max(cx - hr.left, hr.right - cx), dy = Math.max(cy - hr.top, hr.bottom - cy);
      var rad = Math.ceil(Math.sqrt(dx * dx + dy * dy) + 24) + 'px';
      [[fxBox, hr], [slideEl, sr]].forEach(function (p) {
        if (!p[0] || !p[1] || !p[1].width) return;
        p[0].style.setProperty('--nxs-ox', ((cx - p[1].left) / p[1].width * 100).toFixed(1) + '%');
        p[0].style.setProperty('--nxs-oy', ((cy - p[1].top) / p[1].height * 100).toFixed(1) + '%');
        p[0].style.setProperty('--nxs-r', rad);
        /* the rays move by translate from their fixed 74%/46% spot (a left/top change counted as a layout shift) */
        p[0].style.setProperty('--nxs-dx', (cx - p[1].left - p[1].width * .74).toFixed(1) + 'px');
        p[0].style.setProperty('--nxs-dy', (cy - p[1].top - p[1].height * .46).toFixed(1) + 'px');
      });
    }
    var idleO = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
    idleO(function () { origin(true); }, { timeout: 2000 });
    var oRz = 0;
    window.addEventListener('resize', function () { oDone = false; clearTimeout(oRz); oRz = setTimeout(function () { idleO(function () { if (!oDone) origin(true); }); }, 250); }, { passive: true });
    /* restart a class's animation without forcing a layout: off now, back on two frames later */
    function replay(el, cls) {
      el.classList.remove(cls); var tok = (el['_r' + cls] = (el['_r' + cls] || 0) + 1);
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (el['_r' + cls] === tok) el.classList.add(cls); }); });
    }
    /* the header buttons and side tabs change costume with a small staggered pop (site.css .nxs-swap) */
    var swapT = 0;
    function swap() {
      if (reduce) return;
      var de = document.documentElement; replay(de, 'nxs-swap');
      clearTimeout(swapT); swapT = setTimeout(function () { de.classList.remove('nxs-swap'); }, 900);
    }
    function fx(kind) {
      if (reduce || !fxWord) return;
      fxWord.textContent = kind === 'in' ? IN[inK++ % IN.length] : 'WHOOSH!';
      hero.classList.remove(kind === 'in' ? 'is-nxs-out' : 'is-nxs-in');
      replay(hero, kind === 'in' ? 'is-nxs-in' : 'is-nxs-out');
      clearTimeout(fxT); fxT = setTimeout(function () { hero.classList.remove('is-nxs-in', 'is-nxs-out'); }, 1000);
    }
    return {
      root: root,
      enter: function (first) {
        on = true; set(cur); nextUp(); loop();
        origin(); hero.classList.add('is-nxs'); if (mqEl) mqEl.classList.add('mq-nxs');   // the marquee's own switch (hero.css), so its ~200 icons are the only ones restyled
        /* the header goes transparent (white type) only once the circle has covered the strip under it */
        clearTimeout(darkT); darkT = setTimeout(function () { if (on) { document.documentElement.classList.add('nxs-dark'); if (!first) swap(); } }, reduce || first ? 0 : 950);
        if (!first) fx('in');
      },
      leave: function () {
        on = false; clearTimeout(t);
        if (hero.classList.contains('is-nxs')) { origin(); fx('out'); }
        clearTimeout(darkT); hero.classList.remove('is-nxs'); if (mqEl) mqEl.classList.remove('mq-nxs');
        if (document.documentElement.classList.contains('nxs-dark')) { document.documentElement.classList.remove('nxs-dark'); swap(); }
      },
      wake: wake
    };
  }

  /* ================================================================== wiring */
  var scenes = [];
  var c = $('[data-cine]', hero); if (c) scenes.push(Cine(c));
  var m = $('[data-pmap]', hero); if (m) scenes.push(PMap(m));
  var j = $('[data-journey]', hero); if (j) scenes.push(Journey(j));
  $$('[data-nxh]', hero).forEach(function (st) { scenes.push(NexiStage(st)); });
  var nxs = $('[data-nxs]', hero); if (nxs) scenes.push(Explains(nxs));
  var current = null, first = true;
  function sceneOf(slide) { for (var i = 0; i < scenes.length; i++) if (slide.contains(scenes[i].root)) return scenes[i]; return null; }
  function activate(slide) {
    var s = slide ? sceneOf(slide) : null;
    if (current && current !== s) current.leave();
    current = s;
    if (s) { s.enter(first); first = false; }
  }
  function wakeAll() { if (current) current.wake(); }
  hero.addEventListener('tn:slide', function (e) { activate(e.detail && e.detail.slide); });
  document.addEventListener('visibilitychange', wakeAll);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onScreen = es[es.length - 1].isIntersecting; wakeAll(); }, { threshold: .05 }).observe(hero);
  }
  function boot() { activate($('.slide.is-active', hero)); }
  if (document.documentElement.classList.contains('intro')) document.addEventListener('tn:intro-done', boot, { once: true });
  else boot();
})();
