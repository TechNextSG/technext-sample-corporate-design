/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Retail page demo: store network replenishment. A central warehouse and five stores sell one sample
   product at the tills. Every location has a reordering rule (min / max): when a store's forecast
   (on hand + incoming - outgoing) drops below its minimum, the rule raises a transfer from the
   warehouse (reserved, picked, shipped through transit, received); when the warehouse drops below
   its own minimum, its Buy rule raises an RFQ that the buyer confirms and the vendor delivers after its
   lead time. Partial availability ships with a backorder, empty shelves count missed sales. Controls:
   promotion weekend, store selection with details, move stock between stores, apply suggested levels.
   The simulation is seeded, so the reduced-motion view is a real computed state, not a picture. */
TN.demo('stores', function (root, K) {
  'use strict';
  var map = K.$('.srn-map', root), svg = K.$('.srn-routes', root), tbody = K.$('.srn-ops tbody', root);
  var logEl = K.$('.srn-log', root), det = K.$('.srn-detail', root), nightEl = K.$('.srn-night', root);
  var clockEl = K.$('[data-clock]', root), dayBar = K.$('.srn-day i', root), dayTag = K.$('[data-daytag]', root);
  var bPromo = K.$('[data-promo]', root), bPause = K.$('[data-pause]', root), bReset = K.$('[data-reset]', root);
  var KP = {}, F = {};                                            // element maps keyed by constant names
  ['sold', 'tr', 'po', 'served'].forEach(function (k) { KP[k] = K.$('[data-k="' + k + '"]', root); });
  'icon name code oh inc out fc rule route sugg apply today promo ops rebal'.split(' ').forEach(function (k) { F[k] = K.$('[data-f="' + k + '"]', det); });
  var bb = K.$('.srn-bar--big', det), big = { fill: K.$('i', bb), inc: K.$('u', bb), min: K.$('s', bb) };

  var DAYS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  var DAYLEN = 12, DT = .05, SPEED = 1.45;              // store hours 10:00 to 22:00; real seconds per sim hour
  var PRICE = 59, PROMO_X = 2.6, PICK = .5, RB_TRIP = 1;
  var VEN = { name: 'Apex Textiles', trip: 1.6, lead: 12 };
  var CURVE = [.55, .8, 1.3, 1.4, 1, .8, .8, .95, 1.35, 1.45, 1.05, .6];
  var ORDER = ['wh', 'jur', 'wdl', 'orc', 'pgl', 'tam'];
  var DEF = {
    wh: { name: 'Central warehouse', code: 'WH', oh: 240, min: 120, max: 340 },
    jur: { name: 'Jurong', code: 'JUR', oh: 21, min: 10, max: 30, rate: 1.9, trip: .8 },
    wdl: { name: 'Woodlands', code: 'WDL', oh: 15, min: 10, max: 30, rate: 1.6, trip: 1.2 },
    orc: { name: 'Orchard', code: 'ORC', oh: 26, min: 12, max: 36, rate: 2.6, trip: 1.3 },
    pgl: { name: 'Punggol', code: 'PGL', oh: 9, min: 10, max: 30, rate: 1.5, trip: 1.7 },
    tam: { name: 'Tampines', code: 'TAM', oh: 22, min: 10, max: 30, rate: 2.2, trip: 1.9 }
  };
  var C = { tr: 'var(--tok-stock)', po: 'var(--tok-buy)', rb: 'var(--tok-pay)', out: 'var(--tok-late)', ok: 'var(--ok)', promo: 'var(--tok-make)' };
  var ST = { rfq: 'RFQ', po: 'Purchase order', wait: 'Waiting', ready: 'Ready', transit: 'In transit', done: 'Done' };
  var inPromo = { orc: true, tam: true }, promoOn = false, paused = false, sel = 'orc', opsSel = '';

  function rng(a) { return function () { a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pad(n) { return ('0000' + n).slice(-5); }
  function nm(id) { return id === 'ven' ? VEN.name : DEF[id].name; }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }

  // ------------------------------------------------------------------ state
  var S;
  function fresh() {
    var n = {};
    ORDER.forEach(function (id) {
      var d = DEF[id];
      n[id] = { id: id, oh: d.oh, min: d.min, max: d.max, sold: 0, missed: 0, tSold: 0, tMissed: 0, shipped: 0, out: false, hist: [], hr: 0 };
    });
    S = { k: 0, t: 0, n: n, ops: [], seq: { 'WH/OUT': 30, 'WH/IN': 11, P: 40 }, sold: 0, missed: 0, nTr: 0, nPo: 0, r: rng(20260927), acc: 0, night: 0, dirty: true, od: true };
    ORDER.forEach(function (id, i) { if (i) { S.seq[DEF[id].code + '/IN'] = 4 + i * 3; S.seq[DEF[id].code + '/OUT'] = 2 + i; } });
  }
  function ref(p) { S.seq[p]++; return p === 'P' ? 'P' + pad(S.seq[p]) : p + '/' + pad(S.seq[p]); }

  function mkOp(kind, from, to, qty) {
    var o = { kind: kind, from: from, to: to, qty: qty, res: 0, st: 'wait', t0: S.t, tGo: 0, tArr: 0, truck: null };
    if (kind === 'po') { o.ref = ref('P'); o.rin = ref('WH/IN'); o.st = 'rfq'; o.tConf = S.t + .6; }
    else { o.ref = ref(DEF[from].code + '/OUT'); o.rin = ref(DEF[to].code + '/IN'); }
    S.ops.push(o); S.dirty = S.od = true;
    return o;
  }
  function reserved(id) { var r = 0; S.ops.forEach(function (o) { if (o.from === id && o.st === 'ready') r += o.res; }); return r; }
  function flows(id) {
    var inc = 0, out = 0;
    S.ops.forEach(function (o) {
      if (o.st === 'done') return;
      if (o.to === id) inc += o.qty;                               // RFQs count too, as Odoo's rules do
      if (o.from === id && o.st !== 'transit') out += o.qty;       // not shipped yet
    });
    return { inc: inc, out: out, fc: S.n[id].oh + inc - out };
  }
  function reserve() {                                             // first come, first served
    S.ops.forEach(function (o) {
      if (o.st !== 'wait') return;
      var a = S.n[o.from].oh - reserved(o.from);
      if (a <= 0) return;
      o.res = Math.min(a, o.qty); o.st = 'ready'; o.tGo = S.t + (o.kind === 'rb' ? .3 : PICK); S.dirty = S.od = true;
    });
  }
  function rules() {
    ORDER.forEach(function (id) {
      var n = S.n[id], f = flows(id).fc;
      if (f >= n.min) return;
      var q = n.max - f, o;
      if (id === 'wh') {
        o = mkOp('po', 'ven', 'wh', q); S.nPo++;
        ev('Warehouse forecast ' + f + ' &lt; min ' + n.min + ': RFQ <b>' + o.ref + '</b> to ' + VEN.name + ' for ' + q, C.po);
      } else {
        o = mkOp('tr', 'wh', id, q); S.nTr++; S.n.wh.hr += q;
        ev(DEF[id].name + ' forecast ' + f + ' &lt; min ' + n.min + ': <b>' + o.ref + '</b> for ' + q, C.tr);
        ping(id);
      }
    });
    reserve();
  }
  function dispatch(o) {
    if (o.res < o.qty) {                                           // partial: ship what is reserved, backorder the rest
      var bo = mkOp(o.kind, o.from, o.to, o.qty - o.res);
      ev('<b>' + o.ref + '</b> ships ' + o.res + ' of ' + o.qty + ', backorder <b>' + bo.ref + '</b>', C.out);
      o.qty = o.res;
    }
    var n = S.n[o.from]; n.oh -= o.qty; n.shipped += o.qty;
    o.st = 'transit'; o.tGo = S.t; o.tArr = S.t + (o.kind === 'rb' ? RB_TRIP : DEF[o.to].trip); S.dirty = S.od = true;
    spawn(o);
  }
  function arrive(o) {
    var n = S.n[o.to]; n.oh += o.qty; o.st = 'done'; o.tDone = S.t; S.dirty = S.od = true;
    if (n.out && n.oh > 0) n.out = false;
    kill(o);
    ev('<b>' + o.rin + '</b> received at ' + nm(o.to) + ': +' + o.qty, o.kind === 'po' ? C.po : o.kind === 'rb' ? C.rb : C.ok);
    if (o.to === 'wh') reserve();
    var key = o.from + '-' + o.to;
    if (o.kind === 'rb' && G[key] && !S.ops.some(function (x) { return x.kind === 'rb' && x.st !== 'done' && x.from + '-' + x.to === key; })) { G[key].el.remove(); delete G[key]; }
  }
  function sale(id) {
    var n = S.n[id], q = S.r() < .18 ? 2 : 1;
    n.hr += q;
    var ok = Math.min(q, n.oh), miss = q - ok;
    if (ok) { n.oh -= ok; n.sold += ok; n.tSold += ok; S.sold += ok; blip(id, '+S$ ' + ok * PRICE, false); }
    if (miss) {
      n.missed += miss; n.tMissed += miss; S.missed += miss; blip(id, 'missed sale', true);
      if (!n.out) { n.out = true; ev('Stock-out at <b>' + DEF[id].name + '</b>: shelf empty, sales missed', C.out); }
    }
    S.dirty = true;
  }
  function step() {
    var hr = Math.floor(S.t % DAYLEN), day = Math.floor(S.t / DAYLEN);
    ORDER.forEach(function (id) {
      if (id === 'wh') return;
      var p = DEF[id].rate * CURVE[hr] * (promoOn && inPromo[id] ? PROMO_X : 1) * DT;
      if (S.r() < p) sale(id);
    });
    S.ops.forEach(function (o) {
      if (o.st === 'rfq' && S.t >= o.tConf) { o.st = 'po'; o.tGo = o.tConf + VEN.lead - VEN.trip; S.dirty = S.od = true; ev('Buyer confirmed <b>' + o.ref + '</b>, receipt <b>' + o.rin + '</b> expected in 1 day', C.po); }
      else if (o.st === 'po' && S.t >= o.tGo) { o.st = 'transit'; o.tArr = S.t + VEN.trip; S.dirty = S.od = true; spawn(o); }
      else if (o.st === 'ready' && S.t >= o.tGo) dispatch(o);
      else if (o.st === 'transit' && S.t >= o.tArr) arrive(o);
    });
    if (S.k % 5 === 0) rules();                                    // the scheduler, every 15 minutes here
    var nOps = S.ops.length;
    S.ops = S.ops.filter(function (o) { return o.st !== 'done' || S.t - o.tDone < 2.5; });
    if (S.ops.length !== nOps) S.od = true;
    S.k++; S.t = +(S.k * DT).toFixed(4);
    if (S.k % 20 === 0) ORDER.forEach(function (id) { var n = S.n[id]; n.hist.push(n.hr); n.hr = 0; if (n.hist.length > 12) n.hist.shift(); });
    if (Math.floor(S.t / DAYLEN) > day) {                          // closing time: tomorrow at 10:00
      ORDER.forEach(function (id) { S.n[id].tSold = 0; S.n[id].tMissed = 0; S.n[id].shipped = 0; });
      S.night = K.reduce ? 0 : 1.1;
      if (!K.reduce) { nightEl.hidden = false; K.restart(nightEl, 'is-on'); }
    }
  }
  function suggest(id) {
    var h = S.n[id].hist; if (h.length < 3) return null;
    var dem = sum(h) / h.length, lead = id === 'wh' ? VEN.lead + .6 : PICK + DEF[id].trip;
    var mn = Math.max(4, Math.ceil(dem * (lead + 1))), mx = mn + Math.ceil(dem * (id === 'wh' ? 10 : 6));
    return [mn, Math.max(mx, mn + 6)];
  }

  // ------------------------------------------------------------------ nodes and geometry
  var nodes = {}, boxes = {}, G = {}, W = 1, H = 1;
  var gR = K.svg('g', { 'class': 'srn-rg' }), gT = K.svg('g', { 'class': 'srn-tg' });
  svg.appendChild(gR); svg.appendChild(gT);
  var venEl = K.$('.srn-vendor', root);
  ORDER.forEach(function (id) {                                   // ids come from ORDER, never from the page
    var el = K.$('.srn-node[data-n="' + id + '"]', map);
    nodes[id] = { el: el, fill: K.$('.srn-bar i', el), inc: K.$('.srn-bar u', el), min: K.$('.srn-bar s', el), q: K.$('.srn-q', el), flag: K.$('.srn-flag', el), ic: K.$('svg', el), last: '' };
    el.addEventListener('click', function () { select(id); });
  });
  function nb(el) {                                              // the nodes are centred with translate(-50%,-50%)
    var b = K.box(el, map), x = b.x - b.w / 2, y = b.y - b.h / 2;
    return { x: x, y: y, w: b.w, h: b.h, cx: x + b.w / 2, cy: y + b.h / 2, r: x + b.w, b: y + b.h };
  }
  function size() {
    W = map.clientWidth; H = map.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ORDER.forEach(function (id) { boxes[id] = nb(nodes[id].el); });
    boxes.ven = nb(venEl);
    gR.textContent = ''; G = {};
    ORDER.forEach(function (id) { if (id !== 'wh') route('wh', id); });
    route('ven', 'wh');
    S.ops.forEach(function (o) { if (o.kind === 'rb' && o.st !== 'done') route(o.from, o.to); if (o.truck && G[o.from + '-' + o.to]) G[o.from + '-' + o.to].el.classList.add('is-on'); });
    frame();
  }
  function inside(p, b) { return p[0] > b.x - 3 && p[0] < b.r + 3 && p[1] > b.y - 3 && p[1] < b.b + 3; }
  function route(a, b) {
    var key = a + '-' + b; if (G[key]) return G[key];
    var A = [boxes[a].cx, boxes[a].cy], B = [boxes[b].cx, boxes[b].cy];
    var dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1, bend = a === 'ven' ? -.16 : a === 'wh' ? .1 : .22;
    var nx = -dy / len * len * bend, ny = dx / len * len * bend;
    var c1 = [A[0] + dx * .3 + nx, A[1] + dy * .3 + ny], c2 = [A[0] + dx * .7 + nx, A[1] + dy * .7 + ny];
    var pts = [], s = 0;
    for (var i = 0; i <= 48; i++) {
      var t = i / 48, u = 1 - t;
      var x = u * u * u * A[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * B[0];
      var y = u * u * u * A[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * B[1];
      if (i) s += Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]);
      pts.push([x, y, s]);
    }
    var i0 = 0, i1 = pts.length - 1;
    while (i0 < i1 && inside(pts[i0], boxes[a])) i0++;
    while (i1 > i0 && inside(pts[i1], boxes[b])) i1--;
    var d = 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ' ' + B[0].toFixed(1) + ' ' + B[1].toFixed(1);
    var el = K.svg('g', { 'class': 'srn-r' + (a === 'ven' ? ' srn-r--po' : a === 'wh' ? '' : ' srn-r--rb') });
    el.appendChild(K.svg('path', { d: d, 'class': 'srn-rb' })); el.appendChild(K.svg('path', { d: d, 'class': 'srn-rl' }));
    gR.appendChild(el);
    return (G[key] = { pts: pts, s0: pts[i0][2], s1: pts[i1][2], el: el });
  }
  function at(g, u) {
    var s = g.s0 + (g.s1 - g.s0) * u, p = g.pts;
    for (var i = 1; i < p.length; i++) if (p[i][2] >= s) { var a = p[i - 1], b = p[i], f = (s - a[2]) / ((b[2] - a[2]) || 1); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, b[0] - a[0]]; }
    var z = p[p.length - 1]; return [z[0], z[1], 1];
  }
  function spawn(o) {
    var g = K.svg('g', { 'class': 'srn-truck srn-truck--' + o.kind }), body = K.svg('g', {});
    body.appendChild(K.svg('rect', { x: -11, y: -7, width: 14, height: 10, rx: 2, 'class': 'srn-tbox' }));
    body.appendChild(K.svg('path', { d: 'M3.5 -4H8l3.5 3.6V3H3.5Z', 'class': 'srn-tcab' }));
    body.appendChild(K.svg('circle', { cx: -6.5, cy: 3.6, r: 2.3 })); body.appendChild(K.svg('circle', { cx: 7, cy: 3.6, r: 2.3 }));
    var w = 10 + String(o.qty).length * 6.4;
    var tag = K.svg('g', { 'class': 'srn-ttag' });
    tag.appendChild(K.svg('rect', { x: -w / 2, y: -25, width: w, height: 14, rx: 7 }));
    var tx = K.svg('text', { x: 0, y: -14.8, 'text-anchor': 'middle' }); tx.textContent = String(o.qty); tag.appendChild(tx);
    g.appendChild(body); g.appendChild(tag); gT.appendChild(g);
    o.truck = { g: g, body: body, flip: null };
    if (o.kind === 'rb') route(o.from, o.to);
    var r = G[o.from + '-' + o.to]; if (r) r.el.classList.add('is-on');
  }
  function kill(o) {
    if (!o.truck) return;
    o.truck.g.remove(); o.truck = null;
    var busy = S.ops.some(function (x) { return x !== o && x.truck && x.from === o.from && x.to === o.to; });
    var r = G[o.from + '-' + o.to]; if (r && !busy) r.el.classList.remove('is-on');
  }
  function sm(u) { return u * u * (3 - 2 * u); }
  function frame() {                                               // positions only: no layout reads here
    var tc = S.t + S.acc;
    S.ops.forEach(function (o) {
      if (!o.truck) return;
      var g = G[o.from + '-' + o.to]; if (!g) return;
      var p = at(g, sm(K.clamp((tc - o.tGo) / ((o.tArr - o.tGo) || 1), 0, 1)));
      o.truck.g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
      var flip = p[2] < 0;
      if (flip !== o.truck.flip) { o.truck.flip = flip; o.truck.body.setAttribute('transform', flip ? 'scale(-1 1)' : ''); }
    });
    var dt = tc % DAYLEN, hh = 10 + Math.floor(dt), mm = Math.floor(dt % 1 * 12) * 5;
    var clock = DAYS[Math.floor(tc / DAYLEN) % 7] + ' ' + hh + ':' + (mm < 10 ? '0' : '') + mm;
    if (clockEl.textContent !== clock) clockEl.textContent = clock;
    dayBar.style.transform = 'scaleX(' + (dt / DAYLEN).toFixed(3) + ')';
  }

  // ------------------------------------------------------------------ feedback
  var lastBlip = {};
  function blip(id, text, bad) {
    if (K.reduce || document.hidden || !boxes[id]) return;
    var now = performance.now(); if (now - (lastBlip[id] || 0) < 380) return; lastBlip[id] = now;
    var b = K.el('span', 'srn-blip' + (bad ? ' is-bad' : ''), text);
    b.style.left = (boxes[id].x + boxes[id].w * .3).toFixed(0) + 'px'; b.style.top = boxes[id].y.toFixed(0) + 'px';
    map.appendChild(b); setTimeout(function () { b.remove(); }, 1000);
  }
  function ping(id) { if (!K.reduce) K.restart(nodes[id].el, 'is-ping'); }
  var quiet = false;                                               // the reduced-motion snapshot logs silently, then shows its last events
  function ev(html, c) { if (quiet) { S.evq = (S.evq || []).concat([[html, c]]).slice(-5); return; } put(html, c); }
  function put(html, c) { var li = K.log(logEl, '<i></i><span>' + html + '</span>', null, 5); li.style.setProperty('--c', c); }

  // ------------------------------------------------------------------ rendering
  function drawBar(e, n, f) {
    e.fill.style.transform = 'scaleX(' + K.clamp(n.oh / n.max, 0, 1).toFixed(3) + ')';
    e.inc.style.transform = 'scaleX(' + K.clamp(f / n.max, 0, 1).toFixed(3) + ')';
    e.min.style.left = (K.clamp(n.min / n.max, 0, 1) * 100).toFixed(1) + '%';
  }
  function state(id, fl) {
    var n = S.n[id];
    if (id !== 'wh' && n.out && n.oh === 0) return ['out', 'Stock-out'];
    var wait = S.ops.some(function (o) { return o.to === id && o.st === 'wait'; });
    if (wait) return ['wait', 'Waiting'];
    if (S.ops.some(function (o) { return o.to === id && o.st === 'transit'; })) return ['in', 'Incoming'];
    if (fl.fc < n.min || n.oh < n.min) return ['low', 'Below min'];
    return ['', ''];
  }
  function drawNodes() {
    ORDER.forEach(function (id) {
      var n = S.n[id], e = nodes[id], fl = flows(id), s = state(id, fl);
      drawBar(e, n, fl.fc);
      var key = n.oh + '|' + s[0] + '|' + (promoOn && inPromo[id]);
      if (key === e.last) return; e.last = key;
      e.q.textContent = n.oh + ' on hand · min ' + n.min;
      e.flag.textContent = s[1] || (promoOn && inPromo[id] ? 'Promotion' : '');
      e.el.dataset.s = s[0] || (promoOn && inPromo[id] ? 'promo' : '');
      e.el.setAttribute('aria-label', DEF[id].name + ': ' + n.oh + ' on hand, forecast ' + fl.fc + (s[1] ? ', ' + s[1].toLowerCase() : '') + '. Show details');
    });
  }
  function drawKpis() {
    KP.sold.textContent = S.sold.toLocaleString('en-SG');
    KP.tr.textContent = String(S.nTr); KP.po.textContent = String(S.nPo);
    var tot = S.sold + S.missed, pc = tot ? S.sold / tot * 100 : 100;
    KP.served.textContent = (pc >= 99.95 ? '100' : pc.toFixed(1)) + '%';
    KP.served.parentNode.classList.toggle('dm-ok', S.missed === 0);
    KP.served.parentNode.classList.toggle('srn-bad', S.missed > 0);
  }
  function opRow(o) {
    var tr = K.el('tr', o.st === 'done' ? 'is-done' : null); tr.style.setProperty('--c', C[o.kind]);
    var td = K.el('td'); td.appendChild(K.el('b', null, o.ref)); td.appendChild(K.el('small', null, o.kind === 'po' ? 'receipt ' + o.rin : 'receipt ' + o.rin)); tr.appendChild(td);
    tr.appendChild(K.el('td', null, (o.from === 'ven' ? 'Vendor' : DEF[o.from].code) + ' → ' + DEF[o.to].code));
    tr.appendChild(K.el('td', 'srn-num', String(o.qty)));
    var st = K.el('td'); st.appendChild(K.el('span', 'srn-pill is-' + o.st, ST[o.st] + (o.st === 'ready' && o.res < o.qty ? ' · partial' : ''))); tr.appendChild(st);
    tr.addEventListener('pointerenter', function () { var g = G[o.from + '-' + o.to]; if (g) g.el.classList.add('is-hot'); });
    tr.addEventListener('pointerleave', function () { K.$$('.is-hot', gR).forEach(function (x) { x.classList.remove('is-hot'); }); });
    return tr;
  }
  function drawOps() {
    K.$$('.is-hot', gR).forEach(function (x) { x.classList.remove('is-hot'); });
    tbody.textContent = '';
    var open = S.ops.filter(function (o) { return o.st !== 'done'; }).reverse(), done = S.ops.filter(function (o) { return o.st === 'done'; }).reverse();
    var rows = open.concat(done).slice(0, 6);
    if (!rows.length) { var tr = K.el('tr', 'srn-empty'), td = K.el('td', null, 'Nothing open: every location is above its minimum.'); td.colSpan = 4; tr.appendChild(td); tbody.appendChild(tr); }
    rows.forEach(function (o) { tbody.appendChild(opRow(o)); });
  }
  function drawDetail() {
    var id = sel, n = S.n[id], d = DEF[id], fl = flows(id), wh = id === 'wh';
    drawBar(big, n, fl.fc);
    F.name.textContent = wh ? 'Central warehouse' : d.name + ' store';
    F.code.textContent = wh ? 'WH · supplies the five stores' : d.code + ' · warehouse + Point of Sale';
    F.oh.textContent = String(n.oh); F.inc.textContent = String(fl.inc); F.out.textContent = String(fl.out); F.fc.textContent = String(fl.fc);
    F.rule.textContent = 'Min ' + n.min + ' · Max ' + n.max + ' · trigger: auto';
    F.route.textContent = wh ? 'Buy · ' + VEN.name + ', lead time 1 day' : 'Resupply from the warehouse · ' + (d.trip * 60).toFixed(0) + ' min drive';
    var sg = suggest(id);
    F.sugg.textContent = sg ? 'Min ' + sg[0] + ' · Max ' + sg[1] + ' ' : 'after a few hours of demand ';
    F.apply.hidden = !sg || (sg[0] === n.min && sg[1] === n.max);
    F.today.textContent = wh ? n.shipped + ' shipped to stores' : n.tSold + ' sold · ' + K.money(n.tSold * PRICE) + (n.tMissed ? ' · ' + n.tMissed + ' missed' : '');
    F.promo.parentNode.parentNode.hidden = wh;
    F.promo.setAttribute('aria-pressed', String(!!inPromo[id]));
    if (!S.od && opsSel === id) { drawRebal(id, wh); return; }
    opsSel = id; F.ops.textContent = '';
    var mine = S.ops.filter(function (o) { return (o.to === id || o.from === id) && o.st !== 'done'; }).slice(-3);
    if (!mine.length) F.ops.appendChild(K.el('li', 'srn-none', 'No open operations'));
    mine.forEach(function (o) {
      var li = K.el('li'); li.style.setProperty('--c', C[o.kind]);
      li.appendChild(K.el('b', null, o.ref));
      li.appendChild(K.el('span', null, (o.to === id ? '+' + o.qty + ' from ' + (o.kind === 'po' ? 'vendor' : DEF[o.from].code) : '−' + o.qty + ' to ' + DEF[o.to].code)));
      li.appendChild(K.el('span', 'srn-pill is-' + o.st, ST[o.st]));
      F.ops.appendChild(li);
    });
    drawRebal(id, wh);
  }
  function drawRebal(id, wh) {
    var rb = !wh && donor(id);
    F.rebal.hidden = !rb;
    if (rb) K.$('span', F.rebal).textContent = 'Move ' + rb[1] + ' from ' + DEF[rb[0]].name;
  }
  function donor(id) {                                            // only while the warehouse cannot cover it
    var n = S.n[id], fl = flows(id);
    var needs = n.oh < n.min && (S.ops.some(function (o) { return o.to === id && o.st === 'wait'; }) || S.n.wh.oh - reserved('wh') <= 0);
    if (!needs || S.ops.some(function (o) { return o.to === id && o.kind === 'rb' && o.st !== 'done'; })) return null;
    var best = null, bs = 0;
    ORDER.forEach(function (x) { if (x === 'wh' || x === id) return; var sur = S.n[x].oh - flows(x).out - S.n[x].min - 2; if (sur > bs) { bs = sur; best = x; } });   // real stock only
    if (!best || bs < 3) return null;
    return [best, Math.min(bs, Math.max(4, n.max - fl.fc))];
  }
  function drawAll() { drawNodes(); drawKpis(); if (S.od) drawOps(); drawDetail(); S.dirty = S.od = false; }
  function select(id) {
    sel = id;
    ORDER.forEach(function (x) { nodes[x].el.setAttribute('aria-pressed', String(x === id)); });
    F.icon.textContent = ''; F.icon.appendChild(nodes[id].ic.cloneNode(true));
    opsSel = ''; drawDetail();
  }

  // ------------------------------------------------------------------ controls
  function setPromo(on) {
    promoOn = on; bPromo.setAttribute('aria-pressed', String(on));
    dayTag.textContent = on ? 'Promotion weekend · demand × ' + PROMO_X : 'Normal trading';
    root.classList.toggle('srn-is-promo', on);
    if (!quiet) ev(on ? 'Promotion weekend on: demand × ' + PROMO_X + ' at ' + promoList() : 'Promotion over: demand back to normal', C.promo);
  }
  function promoList() { var l = ORDER.filter(function (id) { return inPromo[id]; }).map(function (id) { return DEF[id].name; }); return l.length ? l.join(', ') : 'no stores yet (add one)'; }
  bPromo.addEventListener('click', function () { setPromo(!promoOn); if (K.reduce) snapshot(); else drawAll(); });
  bPause.addEventListener('click', function () {
    paused = !paused; bPause.setAttribute('aria-pressed', String(paused)); K.$('span', bPause).textContent = paused ? 'Resume' : 'Pause';
    if (paused) loop.off(); else if (vis) loop.on();
  });
  bReset.addEventListener('click', function () { reset(); if (K.reduce) snapshot(); else if (vis && !paused) loop.on(); });
  F.promo.addEventListener('click', function () {
    inPromo[sel] = !inPromo[sel];
    ev(DEF[sel].name + (inPromo[sel] ? ' joins' : ' leaves') + ' the promotion', C.promo);
    if (K.reduce && promoOn) snapshot(); else drawAll();
  });
  F.apply.addEventListener('click', function () {
    var sg = suggest(sel); if (!sg) return;
    var n = S.n[sel]; ev((sel === 'wh' ? 'Warehouse' : DEF[sel].name) + ' rule updated: min ' + n.min + ' → ' + sg[0] + ', max ' + n.max + ' → ' + sg[1], C.tr);
    n.min = sg[0]; n.max = sg[1]; rules(); after();
  });
  F.rebal.addEventListener('click', function () {
    var rb = donor(sel); if (!rb) return;
    var o = mkOp('rb', rb[0], sel, rb[1]); S.nTr++;
    ev('Manual transfer <b>' + o.ref + '</b>: ' + rb[1] + ' from ' + DEF[rb[0]].name + ' to ' + DEF[sel].name, C.rb);
    reserve(); after();
  });
  function after() { if (K.reduce) { quiet = true; for (var i = 0; i < 50; i++) step(); quiet = false; flush(); frame(); } drawAll(); }

  // ------------------------------------------------------------------ run
  var vis = false;
  var loop = K.loop(function (now, dt) {
    if (S.night > 0) { S.night -= dt; if (S.night <= 0) { nightEl.hidden = true; } return; }
    S.acc += dt / SPEED;
    var guard = 0;
    while (S.acc >= DT && guard++ < 8) { S.acc -= DT; step(); if (S.night > 0) { S.acc = 0; break; } }
    frame();
    if (S.dirty) drawAll();
  });
  function reset() {
    S && S.ops.forEach(kill);
    fresh(); gT.textContent = ''; logEl.textContent = ''; nightEl.hidden = true;
    ORDER.forEach(function (id) { nodes[id].last = ''; });
    size(); drawAll();
    ev('Day opens: every store sells, rules watch the forecast', C.tr);
  }
  function flush() { (S.evq || []).forEach(function (e) { put(e[0], e[1]); }); S.evq = []; }
  function snapshot() {                                            // reduced motion: a computed state at 17:30 on day one
    S && S.ops.forEach(kill);
    fresh(); gT.textContent = ''; logEl.textContent = ''; quiet = true; size();
    while (S.t < 7.5) step();
    quiet = false; flush(); frame(); drawAll();
  }
  fresh(); S.od = true; select(sel);
  if (K.reduce) bPause.hidden = true;
  window.addEventListener('resize', function () { size(); });
  return {
    start: function (first) {
      vis = true;
      if (first) { if (K.reduce) snapshot(); else reset(); }
      else size();
      if (!paused) loop.on();
    },
    stop: function () { vis = false; loop.off(); }
  };
});
