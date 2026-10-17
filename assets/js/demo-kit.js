/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Page demos. Every service and industry page has its own signature demo of the workflow it sells;
   each registers here with TN.demo(name, init). init(root, K) returns { start, stop } (both
   optional): the kit calls start when the demo scrolls into view and stop when it leaves or the tab
   is hidden, so nothing animates off-screen. init runs ahead of time, in an idle moment after load,
   so it builds and lays out only: motion (loops, timers, entrances) belongs in start. K is a small
   shared toolkit (geometry, SVG, a frame loop, a tooltip, counters, a log, path tracks). Reduced
   motion is honoured: K.reduce, and K.loop never runs. */
(function () {
  'use strict';
  var TN = window.TN = window.TN || {};
  if (TN.demo) return;
  var me = document.currentScript && document.currentScript.src || '';
  var ROOT = me ? me.replace(/assets\/js\/demo-kit\.js.*$/, '') : '/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var ease = {
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    back: function (t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.random() * list.length | 0]; }
  // offset geometry relative to `host`: stays correct under CSS transforms on ancestors
  function box(el, host) {
    var x = 0, y = 0, e = el;
    while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    var w = el.offsetWidth, h = el.offsetHeight;
    return { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  }
  function svg(tag, attrs) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }
  // polyline with rounded corners; repeated points are dropped (a zero-length leg has no direction)
  function path(pts, rad) {
    pts = pts.filter(function (q, i) { return !i || Math.abs(q[0] - pts[i - 1][0]) + Math.abs(q[1] - pts[i - 1][1]) > .5; });
    var f = function (v) { return v.toFixed(1); };
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var r = Math.min(rad || 0, l1 / 2, l2 / 2);
      var a = [p1[0] + (p0[0] - p1[0]) / l1 * r, p1[1] + (p0[1] - p1[1]) / l1 * r];
      var b = [p1[0] + (p2[0] - p1[0]) / l2 * r, p1[1] + (p2[1] - p1[1]) / l2 * r];
      d += 'L' + f(a[0]) + ' ' + f(a[1]) + 'Q' + f(p1[0]) + ' ' + f(p1[1]) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    var z = pts[pts.length - 1];
    return d + 'L' + f(z[0]) + ' ' + f(z[1]);
  }
  function curve(a, b, bend) {
    // a soft S between two points, horizontal tangents (bend 0..1)
    var dx = (b[0] - a[0]) * (bend == null ? .5 : bend);
    return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'C' + (a[0] + dx).toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + (b[0] - dx).toFixed(1) + ' ' + b[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
  }
  function oi(mod, size) {
    if (!/^[a-z0-9_]+$/.test(mod)) return '';
    return '<img class="oi" src="' + ROOT + 'assets/img/odoo/' + mod + '.svg" alt="" width="' + size + '" height="' + size + '">';
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  // Replays a class-driven CSS animation. The class comes back two frames later instead of after a forced
  // reflow (void offsetWidth), which made the browser lay out the whole page inside the animation frame each
  // time a flash fired; a newer call supersedes a pending one.
  function restart(node, cls) {
    if (!node) return;
    if (!node.classList.contains(cls)) { node.classList.add(cls); return; }
    node.classList.remove(cls);
    var tok = node.__tnRs = (node.__tnRs || 0) + 1;
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (node.__tnRs === tok) node.classList.add(cls); }); });
  }
  function money(v, cur) { return (cur || 'S$') + ' ' + Math.round(v).toLocaleString('en-SG'); }
  function num(v) { return Math.round(v).toLocaleString('en-SG'); }
  function count(node, to, dur, fmt) {
    fmt = fmt || num;
    var from = parseFloat(String(node.dataset.v || 0)) || 0; node.dataset.v = to;
    if (reduce || !dur) { node.textContent = fmt(to); return; }
    tween(node, from, to, dur, fmt);
  }
  function tween(node, from, to, dur, fmt) {
    var t0 = performance.now();
    (function step() {
      var q = clamp((performance.now() - t0) / dur, 0, 1);
      node.textContent = fmt(lerp(from, to, ease.out(q)));
      if (q < 1) requestAnimationFrame(step);
    })();
  }
  // an SVG path as arc-length samples, worked out from its d (M L H V C Q A Z, absolute or relative)
  // instead of read back from the DOM: getTotalLength and getPointAtLength cost ~10 µs a call, and
  // force a layout once the frame has written styles. Agrees with getPointAtLength to within a few
  // hundredths of a pixel. d: a path element or its d string; step: sample spacing in px.
  function track(d, step) {
    if (typeof d !== 'string') d = d.getAttribute('d') || '';
    var tk = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [], i = 0, c = '', x = 0, y = 0, x0 = 0, y0 = 0;
    var P = [], S = [];
    function num() { return parseFloat(tk[i++]); }
    function add(px, py) {
      if (!P.length) { P.push([px, py]); S.push(0); return; }
      var q = P[P.length - 1], l = Math.hypot(px - q[0], py - q[1]);
      if (l > 0) { P.push([px, py]); S.push(S[S.length - 1] + l); }
    }
    function curve(f, est) { var k = Math.max(8, Math.ceil(est)); for (var j = 1; j <= k; j++) { var p = f(j / k); add(p[0], p[1]); } }
    function cubic(x1, y1, x2, y2, x3, y3) {
      var ax = x, ay = y; x = x3; y = y3;
      curve(function (t) { var u = 1 - t; return [u * u * u * ax + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * ay + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]; },
        Math.hypot(x1 - ax, y1 - ay) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2));
    }
    function quad(x1, y1, x2, y2) {
      var ax = x, ay = y; x = x2; y = y2;
      curve(function (t) { var u = 1 - t; return [u * u * ax + 2 * u * t * x1 + t * t * x2, u * u * ay + 2 * u * t * y1 + t * t * y2]; }, Math.hypot(x1 - ax, y1 - ay) + Math.hypot(x2 - x1, y2 - y1));
    }
    function arc(rx, ry, phi, fa, fs, x2, y2) {           // endpoint arc to centre form, as in the SVG implementation notes
      var x1 = x, y1 = y; x = x2; y = y2;
      if (x1 === x2 && y1 === y2) return;
      rx = Math.abs(rx); ry = Math.abs(ry);
      if (!rx || !ry) { add(x2, y2); return; }
      var a = phi * Math.PI / 180, co = Math.cos(a), si = Math.sin(a), dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
      var xp = co * dx + si * dy, yp = -si * dx + co * dy, lam = xp * xp / (rx * rx) + yp * yp / (ry * ry);
      if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
      var nu = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp, de = rx * rx * yp * yp + ry * ry * xp * xp;
      var k = Math.sqrt(Math.max(0, nu / de)) * (fa === fs ? -1 : 1), cxp = k * rx * yp / ry, cyp = -k * ry * xp / rx;
      var cx = co * cxp - si * cyp + (x1 + x2) / 2, cy = si * cxp + co * cyp + (y1 + y2) / 2;
      var ux = (xp - cxp) / rx, uy = (yp - cyp) / ry, vx = (-xp - cxp) / rx, vy = (-yp - cyp) / ry;
      var t1 = Math.atan2(uy, ux), dt = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
      if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI;
      curve(function (t) { var th = t1 + dt * t, ex = rx * Math.cos(th), ey = ry * Math.sin(th); return [cx + co * ex - si * ey, cy + si * ex + co * ey]; }, Math.abs(dt) * Math.max(rx, ry));
    }
    while (i < tk.length) {
      if (/[a-zA-Z]/.test(tk[i])) c = tk[i++];
      var rel = c === c.toLowerCase(), ox = rel ? x : 0, oy = rel ? y : 0;
      switch (c.toUpperCase()) {
        case 'M': x = ox + num(); y = oy + num(); x0 = x; y0 = y; add(x, y); c = rel ? 'l' : 'L'; break;
        case 'L': x = ox + num(); y = oy + num(); add(x, y); break;
        case 'H': x = ox + num(); add(x, y); break;
        case 'V': y = oy + num(); add(x, y); break;
        case 'C': cubic(ox + num(), oy + num(), ox + num(), oy + num(), ox + num(), oy + num()); break;
        case 'Q': quad(ox + num(), oy + num(), ox + num(), oy + num()); break;
        case 'A': arc(num(), num(), num(), num(), num(), ox + num(), oy + num()); break;
        case 'Z': x = x0; y = y0; add(x, y); break;
        default: i++;
      }
    }
    if (!P.length) P.push([0, 0]), S.push(0);
    var len = S[S.length - 1], n = Math.max(1, Math.ceil(len / (step || 1))), X = new Float64Array(n + 1), Y = new Float64Array(n + 1), j = 1;
    for (var q = 0; q <= n; q++) {                         // resampled at an even spacing, so a lookup is O(1)
      var s = len * q / n; while (j < S.length - 1 && S[j] < s) j++;
      var A = P[j - 1] || P[0], B = P[j] || A, f = B === A ? 0 : (s - S[j - 1]) / ((S[j] - S[j - 1]) || 1);
      X[q] = A[0] + (B[0] - A[0]) * f; Y[q] = A[1] + (B[1] - A[1]) * f;
    }
    return { len: len, n: n, x: X, y: Y };
  }
  // the point at distance s along a track, clamped to its ends like getPointAtLength
  function trackAt(t, s) {
    var f = clamp(t.len ? s / t.len : 0, 0, 1) * t.n, i = Math.min(t.n - 1, f | 0), r = f - i;
    return { x: t.x[i] + (t.x[i + 1] - t.x[i]) * r, y: t.y[i] + (t.y[i + 1] - t.y[i]) * r };
  }
  // a frame loop that only runs while switched on (the kit switches demos off when off-screen)
  function loop(fn) {
    var raf = 0, on = false, last = 0;
    function frame() {
      raf = 0; if (!on || document.hidden) return;
      var now = performance.now(), dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      fn(now, dt);
      if (on) raf = requestAnimationFrame(frame);
    }
    return {
      on: function () { if (reduce) return; on = true; if (!raf) { last = 0; raf = requestAnimationFrame(frame); } },
      off: function () { on = false; },
      get running() { return on; }
    };
  }
  // one tooltip per demo; content is built from text nodes, never from HTML strings
  function tip(host) {
    var t = el('div', 'dm-tip'); t.hidden = true; host.appendChild(t);
    return {
      show: function (lines, x, y, below) {
        t.textContent = '';
        (Array.isArray(lines) ? lines : [lines]).forEach(function (l, i) { if (l) t.appendChild(el(i ? 'span' : 'b', null, l)); });
        t.hidden = false; t.classList.toggle('dm-tip--below', !!below);
        // clamp by the tooltip's real width, so it never pokes out of a narrow panel
        var hw = Math.min(t.offsetWidth, host.offsetWidth - 12) / 2 + 6;
        t.style.left = clamp(x, hw, Math.max(hw, host.offsetWidth - hw)).toFixed(1) + 'px'; t.style.top = y.toFixed(1) + 'px';
      },
      hide: function () { t.hidden = true; }
    };
  }
  function log(list, html, cls, max) {
    var li = el('li', cls || null); li.innerHTML = html;       // callers pass their own constant markup
    list.insertBefore(li, list.firstChild);
    var rows = $$('li', list); while (rows.length > (max || 4)) rows.pop().remove();
    return li;
  }
  var K = { reduce: reduce, root: ROOT, $: $, $$: $$, clamp: clamp, lerp: lerp, ease: ease, rnd: rnd, pick: pick, box: box, svg: svg,
            path: path, curve: curve, oi: oi, el: el, restart: restart, money: money, count: count, loop: loop, tip: tip, log: log,
            track: track, trackAt: trackAt };

  // Every demo is built ahead of time (after load, one per idle slice) so scrolling one into view only
  // starts it; a demo reached before its turn is built on the spot. Until its first start a demo shows
  // what it would have shown the moment it was built: its CSS animations wait under .is-offscreen (the
  // same class holds them whenever it is stopped, see demo-kit.css) and its counters wait too.
  var defs = {}, live = [], pending = [], loaded = false, idleOn = false, waitSince = 0;
  function mount(name, root) {
    if (root.__dm) return;
    var inst = null, seen = false, visible = false, held = [];
    root.__dm = true; root.classList.add('is-js', 'is-offscreen');
    var kit = Object.create(K);                          // this demo's kit: counters wait for its first start
    kit.count = function (node, to, dur, fmt) {
      if (seen || reduce || !dur) { count(node, to, dur, fmt); return; }
      fmt = fmt || num;
      var from = parseFloat(String(node.dataset.v || 0)) || 0; node.dataset.v = to;
      node.textContent = fmt(from);
      held.push(function () { tween(node, from, to, dur, fmt); });
    };
    function build() { if (!inst) inst = defs[name](root, kit) || {}; }
    // the class goes after start: a start that measures then does not pay for restyling the whole demo
    function go() {
      build();
      var first = !seen; seen = true;
      if (first) { var h = held; held = []; h.forEach(function (f) { f(); }); }
      if (inst.start) inst.start(first);
      root.classList.remove('is-offscreen');
    }
    function halt() { if (inst && seen && inst.stop) inst.stop(); root.classList.add('is-offscreen'); }
    var rec = {
      root: root, wake: function () { if (visible && !document.hidden) go(); else halt(); },
      done: function () { return !!inst; },
      // a demo that is not rendered (display:none) waits to be seen, so it never measures a zero-size box
      build: function () { if (!inst && root.isConnected && root.getClientRects().length) build(); }
    };
    live.push(rec); pending.push(rec); schedule();
    if (!('IntersectionObserver' in window)) { visible = true; go(); return; }
    new IntersectionObserver(function (es) {
      visible = es[es.length - 1].isIntersecting;
      rec.wake();
    }, { rootMargin: '120px 0px', threshold: .08 }).observe(root);
  }
  var idle = window.requestIdleCallback ? function (f) { requestIdleCallback(f, { timeout: 2000 }); } : function (f) { setTimeout(f, 60); };
  function schedule() {
    while (pending.length && pending[0].done()) pending.shift();
    if (!loaded || idleOn || !pending.length) return;
    idleOn = true; if (!waitSince) waitSince = performance.now();
    idle(drain);
  }
  function drain(dl) {
    idleOn = false;
    // a slice that is nearly over waits for a longer one, for two seconds at most
    if (dl && !dl.didTimeout && dl.timeRemaining() < 10 && performance.now() - waitSince < 2000) { schedule(); return; }
    waitSince = 0;
    while (pending.length && pending[0].done()) pending.shift();
    var rec = pending.shift();
    if (rec) rec.build();
    schedule();
  }
  function ready() { loaded = true; schedule(); }
  function onLoad() { if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready, ready); else ready(); }
  if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad);
  TN.demo = function (name, init) {
    defs[name] = init;
    $$('[data-demo="' + name + '"]').forEach(function (r) { mount(name, r); });
  };
  document.addEventListener('visibilitychange', function () { live.forEach(function (r) { r.wake(); }); });
})();
