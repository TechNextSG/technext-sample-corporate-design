/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo app pages: how a record moves through the app. The states, branches, hand-offs and
   automations are in the page (built from _src/app_flows.py); this script lays them out in the
   family's own form (rail, ladder, ring, funnel, lanes, hub, journey), then runs sample records
   through them: branches and loops taken at random, hand-offs into other apps lit and logged.
   Phones get the ladder. */
TN.demo('life', function (root, K) {
  var stage = K.$('.lf-stage', root), svg = K.$('.lf-svg', root), toksLayer = K.$('.lf-cards', root);
  var states = K.$$('.lf-states > li', root).map(function (li) { return { el: li, key: li.dataset.s, label: K.$('b', li).textContent, note: li.dataset.note || '', n: K.$('.lf-n', li), count: 0 }; });
  var byKey = {}; states.forEach(function (s, i) { s.i = i; byKey[s.key] = s; });
  var path = (root.dataset.path || '').split(',').filter(function (k) { return byKey[k]; });
  var branches = K.$$('.lf-branch', root).map(function (li) { return { el: li, from: li.dataset.from, to: li.dataset.to, label: K.$('span', li).textContent }; })
    .filter(function (b) { return byKey[b.from] && byKey[b.to]; });
  var hands = K.$$('.lf-hand > li', root).map(function (li) { return { el: li, at: li.dataset.at, text: K.$('small', li).textContent, app: K.$('b', li).textContent }; });
  var kFlow = K.$('[data-k="flow"]', root), kDone = K.$('[data-k="done"]', root), kExc = K.$('[data-k="exc"]', root), kHand = K.$('[data-k="hand"]', root);
  var log = K.$('.lf-log', root), record = root.dataset.record || 'record';
  var tip = K.tip(stage);
  var wantLayout = root.dataset.layout || 'rail', layout = wantLayout;
  var mq = window.matchMedia('(max-width: 640px)');
  var W = 1, H = 1, P = {}, edges = {}, tokens = [], nextSpawn = 0, speed = 1, forceExc = false, serial = 1000 + (Math.random() * 400 | 0);
  var nFlow = 0, nDone = 0, nExc = 0, nHand = 0, on = false;
  // lanes (services): one row per record under the stage headers, a bar that grows along the stages
  var LANES = 6, HEAD = 46, ROW = 27, X0 = 10, laneFree = [];
  var BX = X0 + 5, WMAX = 1;                        // lanes: bars start under the cap's centre; WMAX = their full width
  var htoks = null;                                // other layouts: the HTML layer the record tokens move in
  function tokHost() {
    if (!htoks) { htoks = document.createElement('div'); htoks.className = 'lf-htoks'; htoks.setAttribute('aria-hidden', 'true'); svg.parentNode.insertBefore(htoks, svg.nextSibling); }
    return htoks;
  }
  function laneBar(t) {                            // the scaled fill, plus the static cap for its rounded start
    t.cap = K.el('b', 'lf-cap'); t.bar = K.el('i', 'lf-bar'); t.bar.style.width = WMAX.toFixed(1) + 'px';
    t.el.appendChild(t.cap); t.el.appendChild(t.bar);
  }
  var LADDER_HALF = 58;                              // ladder: half a card's width (wider on desktop, set in place())

  // ---------------------------------------------------------------- layouts: a position per state
  function place() {
    layout = mq.matches ? 'ladder' : wantLayout;
    root.classList.remove('lf--rail', 'lf--ladder', 'lf--ring', 'lf--funnel', 'lf--lanes', 'lf--hub', 'lf--journey');
    root.classList.add('lf--' + layout);
    W = stage.offsetWidth || 1; H = stage.offsetHeight || 1; WMAX = Math.max(1, W - BX - 10);
    var fc = states[0] && states[0].el; LADDER_HALF = layout === 'ladder' && fc ? Math.round(fc.offsetWidth / 2) + 4 : 58;
    var n = states.length, padX = Math.min(90, W * .1), padY = 46;
    states.forEach(function (s, i) {
      var t = n > 1 ? i / (n - 1) : .5, x, y;
      switch (layout) {
        case 'ladder': x = mq.matches ? W * .3 : Math.min(W * .4, W - 330); y = padY - 12 + t * (H - 2 * padY + 24); break;
        case 'ring': var a = -Math.PI / 2 + i / n * Math.PI * 2, r = Math.min(W * .34, H * .38); x = W * .5 + Math.cos(a) * r * 1.25; y = H * .5 + Math.sin(a) * r; break;
        case 'hub': var b = -Math.PI / 2 + i / n * Math.PI * 2, rr = Math.min(W * .36, H * .4); x = W * .5 + Math.cos(b) * rr * 1.35; y = H * .52 + Math.sin(b) * rr; break;
        case 'funnel': x = W * .5; y = padY - 10 + t * (H - 2 * padY + 20); break;
        case 'lanes': x = W * (i + .5) / n; y = 24; break;
        case 'journey': x = padX + t * (W - 2 * padX); y = H * (i % 2 ? .7 : .3); break;
        default: x = padX + t * (W - 2 * padX); y = H * .46;
      }
      P[s.key] = { x: x, y: y };
      s.el.style.left = x.toFixed(1) + 'px'; s.el.style.top = y.toFixed(1) + 'px';
      if (layout === 'funnel') s.el.style.setProperty('--w', (100 - t * 46).toFixed(1) + '%'); else s.el.style.removeProperty('--w');
    });
    draw();
  }
  // ---------------------------------------------------------------- edges: the main path, then branches
  function edgeD(a, b, kind) {
    var A = P[a], B = P[b];
    if (layout === 'lanes') return 'M' + A.x + ' 0L' + B.x + ' 0';
    if (a === b) {                                    // self loop: a small ring above the state
      var s = layout === 'ladder' || layout === 'funnel' ? 1 : -1;
      if (layout === 'ladder') return 'M' + (A.x + LADDER_HALF) + ' ' + (A.y - 8) + 'c34 -8 34 24 0 16';
      if (layout === 'funnel') return 'M' + (A.x + W * .2) + ' ' + (A.y - 8) + 'c34 -8 34 24 0 16';
      return 'M' + (A.x - 10) + ' ' + (A.y + s * 22) + 'c-8 ' + (s * 34) + ' 28 ' + (s * 34) + ' 20 0';
    }
    if (layout === 'hub') {
      if (kind === 'branch') return K.curve([A.x, A.y], [B.x, B.y], .2);
      var C = { x: W * .5, y: H * .52 };               // every hand-over goes through the record in the middle
      return 'M' + A.x.toFixed(1) + ' ' + A.y.toFixed(1) + 'Q' + C.x.toFixed(1) + ' ' + C.y.toFixed(1) + ' ' + B.x.toFixed(1) + ' ' + B.y.toFixed(1);
    }
    if (layout === 'ring') {
      if (kind === 'branch') { var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, cx = W * .5, cy = H * .5; return 'M' + A.x + ' ' + A.y + 'Q' + (cx + (mx - cx) * .2) + ' ' + (cy + (my - cy) * .2) + ' ' + B.x + ' ' + B.y; }
      var r1 = Math.hypot(A.x - W * .5, A.y - H * .5);
      return 'M' + A.x + ' ' + A.y + 'A' + (r1 * 1.1) + ' ' + (r1 * .9) + ' 0 0 1 ' + B.x + ' ' + B.y;
    }
    if (layout === 'ladder' || layout === 'funnel') {
      if (kind === 'branch') { var off = (layout === 'funnel' ? W * .26 : 96) + 14 * Math.abs(byKey[a].i - byKey[b].i); var sx = layout === 'funnel' ? A.x + W * .2 : A.x + LADDER_HALF; return 'M' + sx + ' ' + A.y + 'C' + (sx + off * .6) + ' ' + A.y + ' ' + (sx + off * .6) + ' ' + B.y + ' ' + sx + ' ' + B.y; }
      return 'M' + A.x + ' ' + (A.y + 16) + 'L' + B.x + ' ' + (B.y - 16);
    }
    if (layout === 'journey') {
      if (kind === 'branch') return K.curve([A.x, A.y], [B.x, B.y], .4);
      return K.curve([A.x, A.y], [B.x, B.y], .5);
    }
    // rail: forward along the line, back and skip edges arc away from it
    if (kind === 'branch') {
      var back = byKey[b].i < byKey[a].i, room = back ? A.y - 8 : H - A.y - 8;
      var h = Math.min(46 + 12 * Math.abs(byKey[a].i - byKey[b].i), room), yy = back ? A.y - h : A.y + h;
      return 'M' + A.x + ' ' + (A.y + (back ? -20 : 20)) + 'C' + A.x + ' ' + yy + ' ' + B.x + ' ' + yy + ' ' + B.x + ' ' + (B.y + (back ? -20 : 20));
    }
    return 'M' + (A.x + 50) + ' ' + A.y + 'L' + (B.x - 50) + ' ' + B.y;
  }
  function draw() {
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    // the arrow marker is built with the DOM API: its id comes from a data attribute
    svg.textContent = '';
    var markId = 'lf-arrow-' + (root.dataset.mod || 'x'), defs = K.svg('defs', {});
    var mkr = K.svg('marker', { id: markId, viewBox: '0 0 10 10', refX: 7, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
    mkr.appendChild(K.svg('path', { d: 'M1 1.5 8.5 5 1 8.5z' })); defs.appendChild(mkr); svg.appendChild(defs);
    edges = {};
    var mk = 'url(#' + markId + ')';
    if (layout === 'hub') svg.appendChild(K.svg('circle', { cx: W * .5, cy: H * .52, r: 38, 'class': 'lf-core' }));
    var hide = layout === 'lanes' ? { 'class': 'lf-e', style: 'visibility:hidden' } : null;
    for (var i = 0; i < path.length - 1; i++) {
      var id = path[i] + '>' + path[i + 1];
      if (edges[id]) continue;
      var e = K.svg('path', hide ? Object.assign({ d: edgeD(path[i], path[i + 1], 'path') }, hide) : { d: edgeD(path[i], path[i + 1], 'path'), 'class': 'lf-e', 'marker-end': mk });
      svg.appendChild(e); edges[id] = { p: e };
    }
    branches.forEach(function (b) {
      var id = b.from + '>' + b.to + '>b';
      var e = K.svg('path', hide ? Object.assign({ d: edgeD(b.from, b.to, 'branch') }, hide) : { d: edgeD(b.from, b.to, 'branch'), 'class': 'lf-e lf-e--b', 'marker-end': mk });
      svg.appendChild(e); edges[id] = { p: e, b: b };
    });
    var g = K.svg('g', { 'class': 'lf-toks' }); svg.appendChild(g);
    // each edge as a track worked out from its d: nothing is read back from the SVG, here or per frame
    Object.keys(edges).forEach(function (id) { var E = edges[id]; E.t = K.track(E.p); E.len = E.t.len; });
  }
  // ---------------------------------------------------------------- records
  // log lines are built from text nodes: labels come from the page, never re-read as HTML
  function say(parts, c) {
    var was = K.$$('li', log).map(function (el) { return [el, el.offsetTop]; });
    var li = K.el('li'), sp = K.el('span'); li.appendChild(K.el('i'));
    parts.forEach(function (p) { sp.appendChild(typeof p === 'string' ? document.createTextNode(p) : K.el('b', null, p.b)); });
    li.appendChild(sp); if (c) li.style.setProperty('--c', c);
    log.insertBefore(li, log.firstChild);
    var rows = K.$$('li', log); while (rows.length > 6) rows.pop().remove();
    if (!K.reduce && li.animate) {
      li.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
      was.forEach(function (p) { var dy = p[1] - p[0].offsetTop; if (dy && p[0].isConnected) p[0].animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
    }
  }
  function lower(t) { return t.charAt(0).toLowerCase() + t.slice(1); }
  function num(t) { return '#' + t.id; }
  function freeLane() {
    var now = performance.now();
    for (var ln = 0; ln < LANES; ln++) if (!tokens.some(function (o) { return o.lane === ln; }) && !(laneFree[ln] > now)) return ln;
    return -1;
  }
  function spawn(at) {                               // at: start part-way along the path (lanes open with records under way)
    var k = at || 0, ln = layout === 'lanes' ? freeLane() : 0;
    if (ln < 0) return;                             // every lane is busy: the next record waits
    var t = { id: ++serial, i: k, s: 0, edge: null, wait: 0, loops: 0, v: K.rnd(95, 130) };
    if (layout === 'lanes') {
      t.lane = ln; t.el = K.el('div', 'lf-lane'); t.el.style.top = (HEAD + ln * ROW) + 'px';
      laneBar(t); t.tag = K.el('span', 'lf-tag', num(t));
      t.el.appendChild(t.tag); toksLayer.appendChild(t.el); head(t, X0);
      var x1 = P[path[k]].x, ms = 450 + k * 250;     // the bar grows in to its stage instead of appearing there
      if (!K.reduce && t.bar.animate) {
        t.bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(' + Math.max(0, (x1 - BX) / WMAX).toFixed(4) + ')' }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
        t.tag.animate([{ transform: 'translateX(' + (X0 + 9) + 'px)', opacity: 0 }, { transform: 'translateX(' + (x1 + 9) + 'px)', opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    }
    else {
      t.pos = document.createElement('span'); t.pos.style.cssText = 'position:absolute;left:0;top:0;will-change:transform';
      t.g = K.el('span', 'lf-tok'); t.g.innerHTML = '<i class="lf-th"></i><i class="lf-td"></i>';
      t.pos.appendChild(t.g); tokHost().appendChild(t.pos);
    }
    tokens.push(t); nFlow++; arrive(t, path[k]);
    if (k) t.wait += .4 + k * .5;                   // let the grow-in finish before it moves on
  }
  function arrive(t, key) {
    var s = byKey[key]; t.at = key; t.wait = .55 / speed;
    s.count++; s.n.textContent = s.count > 999 ? '999+' : String(s.count); s.el.classList.add('has-n'); K.restart(s.el, 'is-pulse');
    place1(t, P[key].x, P[key].y);
    hands.forEach(function (h) {
      if (h.at !== key) return;
      nHand++; kHand.textContent = String(nHand); K.restart(h.el, 'is-fire');
      if (Math.random() < .5) say([{ b: record + ' ' + num(t) }, ' ' + lower(h.text) + ' (' + h.app + ')'], 'var(--tok-pay)');
    });
  }
  function place1(t, x, y) {
    if (t.el) head(t, x);
    else if (t.pos) t.pos.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
  }
  function head(t, x) {                              // lanes: the bar reaches x, the record number rides just after it
    t.bar.style.transform = 'scaleX(' + Math.max(0, (x - BX) / WMAX).toFixed(4) + ')';
    t.tag.style.transform = 'translateX(' + (x + 9).toFixed(1) + 'px)';
  }
  function choose(t) {
    // at a state: take a branch now and then (once per record), else follow the main path
    var here = t.at, out = branches.filter(function (b) { return b.from === here; });
    if (out.length && t.loops < 1 && (forceExc || Math.random() < .2)) {
      var b = K.pick(out); t.loops++; forceExc = false;
      nExc++; kExc.textContent = String(nExc); K.restart(b.el, 'is-take');
      say([{ b: record + ' ' + num(t) }, ': ' + lower(b.label)], 'var(--tok-late)');
      return { id: b.from + '>' + b.to + '>b', to: b.to, branch: true };
    }
    var pi = t.i + 1;
    if (pi >= path.length) return null;
    return { id: path[t.i] + '>' + path[pi], to: path[pi], next: pi };
  }
  function step(now, dt) {
    if (now > nextSpawn && tokens.length < (speed > 1 ? 9 : 5)) { spawn(); nextSpawn = now + K.rnd(1300, 2100) / speed; }
    tokens = tokens.filter(function (t) {
      if (!t.edge) {
        t.wait -= dt; if (t.wait > 0) return true;
        var go = choose(t);
        if (!go) { nDone++; kDone.textContent = String(nDone); fade(t); return false; }
        t.edge = go; t.s = 0;
        if (t.el && go.branch && byKey[go.to].i < byKey[t.at].i) t.el.classList.add('is-back');
      }
      var e = edges[t.edge.id]; if (!e) { t.edge = null; return true; }
      t.s += t.v * speed * dt;
      if (layout === 'lanes') {                      // the bar grows (or, on a loop back, shrinks) smoothly
        var A = P[t.at], B = P[t.edge.to], q = K.clamp(t.s / Math.max(60, Math.abs(B.x - A.x)), 0, 1);
        head(t, K.lerp(A.x, B.x, K.ease.inOut(q)));
        if (q >= 1) finishEdge(t);
        return true;
      }
      var pt = K.trackAt(e.t, Math.min(t.s, e.len));
      t.pos.style.transform = 'translate(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px)';
      if (t.s >= e.len) finishEdge(t);
      return true;
    });
    // written only when it changes: replacing the text node every frame re-laid out and repainted the panel 60 times a second
    if (kFlow._n !== tokens.length) { kFlow._n = tokens.length; kFlow.textContent = String(tokens.length); }
  }
  function finishEdge(t) {
    var go = t.edge; t.edge = null;
    if (t.el) t.el.classList.remove('is-back');
    if (go.branch) { t.i = Math.max(0, path.indexOf(go.to)); if (t.i < 0) t.i = 0; }
    else t.i = go.next;
    arrive(t, go.to);
  }
  function fade(t) {
    var n = t.el || t.g; if (!n) return;
    if (t.el) {                                      // lanes: the finished bar turns green where it is, then fades
      t.el.classList.add('is-done'); laneFree[t.lane] = performance.now() + 1100;
      setTimeout(function () { n.classList.add('is-out'); }, 450); setTimeout(function () { n.remove(); }, 1050); return;
    }
    n.classList.add('is-out'); setTimeout(function () { (t.pos || n).remove(); }, 450);
  }
  var loop = K.loop(step);

  // ---------------------------------------------------------------- controls and hover
  K.$$('[data-speed]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      speed = +b.dataset.speed || 1;
      K.$$('[data-speed]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  var exc = K.$('[data-exc]', root);
  if (exc) exc.addEventListener('click', function () { forceExc = true; K.restart(exc, 'is-armed'); });
  states.forEach(function (s) {
    function onT() {
      var out = branches.filter(function (b) { return b.from === s.key; }).map(function (b) { return 'Exception: ' + b.label; });
      var hs = hands.filter(function (h) { return h.at === s.key; }).map(function (h) { return 'Hand-off: ' + h.app + ', ' + h.text.charAt(0).toLowerCase() + h.text.slice(1); });
      var p = P[s.key];
      tip.show([s.label, s.note].concat(hs, out), p.x, p.y - 26, p.y < 90);
      root.classList.add('is-peek'); s.el.classList.add('is-hot');
    }
    function offT() { tip.hide(); root.classList.remove('is-peek'); s.el.classList.remove('is-hot'); }
    s.el.tabIndex = 0;
    s.el.addEventListener('pointerenter', onT); s.el.addEventListener('pointerleave', offT);
    s.el.addEventListener('focus', onT); s.el.addEventListener('blur', offT);
  });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { tokens.forEach(function (t) { var n = t.el || t.pos || t.g; if (n) n.remove(); }); tokens = []; laneFree = []; place(); }, 120); });
  place();
  if (K.reduce) {
    // a still picture: every state shows the sample count it would have after a busy morning
    states.forEach(function (s, i) { s.count = Math.max(1, 12 - i * 2); s.n.textContent = String(s.count); s.el.classList.add('has-n'); });
    if (layout === 'lanes') [3, 1, 4, 0, 2].forEach(function (si, ln) {   // a still timeline: records at different stages
      if (!states[si] || ln >= LANES) return;
      var t = { el: K.el('div', 'lf-lane'), tag: K.el('span', 'lf-tag', '#' + (++serial)) };
      t.el.style.top = (HEAD + ln * ROW) + 'px'; laneBar(t); t.el.appendChild(t.tag); toksLayer.appendChild(t.el);
      head(t, P[states[si].key].x);
    });
  }
  return {
    start: function () {
      if (on) return; on = true; place(); nextSpawn = performance.now() + 250;
      if (layout === 'lanes' && !tokens.length && !K.reduce) [2, 1, 0].forEach(function (k) { if (k < path.length) spawn(k); });
      loop.on();
    },
    stop: function () { on = false; loop.off(); }
  };
});
