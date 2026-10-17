/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Ecommerce page demo: an omnichannel order router. Orders arrive from the website (Odoo eCommerce)
   and two marketplaces (through a marketplace connector), become sales orders in Odoo, reserve
   stock in a warehouse, get a courier label, travel and are delivered; some come back as returns.
   Every stock change is synced back to each channel, so a listing shows sold out before it can be
   oversold (switch to spreadsheet updates to see the difference). Payouts arrive net of fees and
   refunds and are matched in Accounting. Controls: channel toggles, flash sale, stock updates.
   Sample shop, sample fees; nothing here is a specific marketplace or connector. */
TN.demo('router', function (root, K) {
  var stage = K.$('.omr-stage', root), svg = K.$('.omr-svg', root), tip = K.tip(stage);
  var N = {}; K.$$('[data-n]', stage).forEach(function (el) { N[el.dataset.n] = el; });
  var chB = K.$$('[data-ch]', root), syncB = K.$$('[data-sync]', root), flashB = K.$('[data-flash]', root), flashT = K.$('span', flashB);
  var kEl = {}; K.$$('[data-k]', root).forEach(function (el) { kEl[el.dataset.k] = el; });
  var stEl = {}; K.$$('[data-st]', root).forEach(function (el) { stEl[el.dataset.st] = el; });
  var logL = K.$('.omr-log', root), bankL = K.$('.omr-bank', root), bankD = K.$('.omr-bankd', root);
  var PRICE = 24.9, KEYS = ['web', 'mka', 'mkb'], CYCLE = 20, UPLOAD = 12, TOTAL0 = 60;
  var CH = {
    web: { n: 'Website', c: '#3167CA', rate: .38, wh: 'W', co: 'CA', pay: 'Payment provider payout', fee: function (g, n) { return g * .034 + n * .5; }, ft: 'provider fee 3.4% + S$0.50 an order' },
    mka: { n: 'Marketplace A', c: '#7447D6', rate: .33, wh: 'W', co: 'ML', pay: 'Marketplace A payout', fee: function (g) { return g * .1; }, ft: 'commission 8% + payment fee 2%' },
    mkb: { n: 'Marketplace B', c: '#0E9384', rate: .28, wh: 'E', co: 'ML', pay: 'Marketplace B payout', fee: function (g) { return g * .12; }, ft: 'commission 10% + payment fee 2%' }
  };
  function money(v) { return 'S$ ' + v.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function f1(v) { return v.toFixed(1); }

  // ---------------------------------------------------------------- the network: node boxes and edges, wide and phone layouts
  // node: [x as a share of the width, y px, width share, height px]; edge: [from, side, offset, to, side, offset, curve]
  var WIDE = { H: 376, n: {
      web: [0, 18, .17, 80], mka: [0, 138, .17, 80], mkb: [0, 258, .17, 80], conn: [.215, 218, .13, 58], hub: [.385, 100, .15, 140],
      W: [.585, 56, .125, 84], E: [.585, 208, .125, 84], CA: [.75, 66, .115, 60], ML: [.75, 218, .115, 60],
      TR: [.895, 100, .105, 60], DL: [.895, 218, .105, 60], RT: [.705, 326, .16, 44], XX: [.385, 296, .15, 44] },
    e: { wh: ['web', 'r', 0, 'hub', 'l', -38, 'h'], ac: ['mka', 'r', 0, 'conn', 'l', -10, 'h'], bc: ['mkb', 'r', 0, 'conn', 'l', 10, 'h'], ch: ['conn', 'r', 0, 'hub', 'l', 38, 'h'],
      hW: ['hub', 'r', -38, 'W', 'l', 0, 'h'], hE: ['hub', 'r', 38, 'E', 'l', 0, 'h'], WA: ['W', 'r', -12, 'CA', 'l', -8, 'h'], WM: ['W', 'r', 12, 'ML', 'l', -8, 'h'],
      EA: ['E', 'r', -12, 'CA', 'l', 8, 'h'], EM: ['E', 'r', 12, 'ML', 'l', 8, 'h'], AT: ['CA', 'r', 0, 'TR', 'l', -8, 'h'], MT: ['ML', 'r', 0, 'TR', 'l', 8, 'h'],
      TD: ['TR', 'b', 0, 'DL', 't', 0, 'v'], DR: ['DL', 'b', 0, 'RT', 'r', 0, 'x'], RE: ['RT', 'l', 0, 'E', 'b', 0, 'y'], hX: ['hub', 'b', 0, 'XX', 't', 0, 'v'],
      sW: ['hub', 'l', -56, 'web', 'r', -16, 'h'], sC: ['hub', 'l', 56, 'conn', 'r', 14, 'h'], sA: ['conn', 'l', -22, 'mka', 'r', -16, 'h'], sB: ['conn', 'l', 22, 'mkb', 'r', 16, 'h'] } };
  var NARROW = { H: 672, n: {
      web: [0, 0, .31, 76], mka: [.345, 0, .31, 76], mkb: [.69, 0, .31, 76], conn: [.44, 108, .5, 48], hub: [.1, 188, .8, 98],
      W: [0, 334, .47, 78], E: [.53, 334, .47, 78], CA: [0, 452, .47, 52], ML: [.53, 452, .47, 52],
      TR: [0, 546, .47, 52], DL: [.53, 546, .47, 52], RT: [.53, 628, .47, 42], XX: [0, 628, .47, 42] },
    e: { wh: ['web', 'b', 0, 'hub', 't', -60, 'v'], ac: ['mka', 'b', 0, 'conn', 't', -24, 'v'], bc: ['mkb', 'b', 0, 'conn', 't', 24, 'v'], ch: ['conn', 'b', 0, 'hub', 't', 60, 'v'],
      hW: ['hub', 'b', -50, 'W', 't', 0, 'v'], hE: ['hub', 'b', 50, 'E', 't', 0, 'v'], WA: ['W', 'b', -14, 'CA', 't', -8, 'v'], WM: ['W', 'b', 14, 'ML', 't', -8, 'v'],
      EA: ['E', 'b', -14, 'CA', 't', 8, 'v'], EM: ['E', 'b', 14, 'ML', 't', 8, 'v'], AT: ['CA', 'b', 0, 'TR', 't', -8, 'v'], MT: ['ML', 'b', 0, 'TR', 't', 8, 'v'],
      TD: ['TR', 'r', 0, 'DL', 'l', 0, 'h'], DR: ['DL', 'b', 0, 'RT', 't', 0, 'v'],
      sW: ['hub', 't', -80, 'web', 'b', 16, 'v'], sC: ['hub', 't', 80, 'conn', 'b', 18, 'v'], sA: ['conn', 't', -40, 'mka', 'b', -16, 'v'], sB: ['conn', 't', 40, 'mkb', 'b', 16, 'v'] } };
  var edgeG = K.svg('g', {}), pulseG = K.svg('g', {}), tokG = K.svg('g', {});
  svg.appendChild(edgeG); svg.appendChild(pulseG); svg.appendChild(tokG);
  var EDGES = {}, BOX = {};
  function anchor(b, s, o) {
    return s === 'l' ? [b[0], b[1] + b[3] / 2 + o] : s === 'r' ? [b[0] + b[2], b[1] + b[3] / 2 + o] : s === 't' ? [b[0] + b[2] / 2 + o, b[1]] : [b[0] + b[2] / 2 + o, b[1] + b[3]];
  }
  function pathD(a, b, m) {
    var M = 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'C';
    if (m === 'h') return K.curve(a, b, .5);
    if (m === 'v') { var dy = (b[1] - a[1]) / 2; return M + f1(a[0]) + ' ' + f1(a[1] + dy) + ' ' + f1(b[0]) + ' ' + f1(b[1] - dy) + ' ' + f1(b[0]) + ' ' + f1(b[1]); }
    if (m === 'x') return M + f1(a[0]) + ' ' + f1(b[1]) + ' ' + f1(b[0] + 40) + ' ' + f1(b[1]) + ' ' + f1(b[0]) + ' ' + f1(b[1]);
    return M + f1(a[0] - 50) + ' ' + f1(a[1]) + ' ' + f1(b[0]) + ' ' + f1(b[1] + 50) + ' ' + f1(b[0]) + ' ' + f1(b[1]);
  }
  function layout() {
    var W = stage.clientWidth || 900, L = W < 700 ? NARROW : WIDE;
    stage.style.height = L.H + 'px'; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + L.H);
    stage.classList.toggle('is-v', L === NARROW);
    BOX = {};
    Object.keys(L.n).forEach(function (k) {
      var d = L.n[k], b = BOX[k] = [d[0] * W, d[1], d[2] * W, d[3]], el = N[k];
      el.style.left = f1(b[0]) + 'px'; el.style.top = b[1] + 'px'; el.style.width = f1(b[2]) + 'px'; el.style.height = b[3] + 'px';
    });
    edgeG.textContent = ''; EDGES = {};
    Object.keys(L.e).forEach(function (k) {
      var e = L.e[k], sync = k[0] === 's' && k.length === 2;
      var p = K.svg('path', { d: pathD(anchor(BOX[e[0]], e[1], e[2]), anchor(BOX[e[3]], e[4], e[5]), e[6]), 'class': 'omr-e' + (sync ? ' omr-e--sync' + (k === 'sW' ? ' omr-e--sw' : '') : k === 'hX' ? ' omr-e--x' : k === 'DR' || k === 'RE' ? ' omr-e--ret' : '') });
      edgeG.appendChild(p);
      // the 25 stops along the edge, worked out from its d rather than read back from the SVG
      var t = K.track(p), len = t.len || 1, pts = [];
      for (var i = 0; i <= 24; i++) { var q = K.trackAt(t, len * i / 24); pts.push([q.x, q.y]); }
      EDGES[k] = { p: p, len: len, pts: pts };
    });
  }

  // ---------------------------------------------------------------- state
  var S, instant = false, vis = false;
  function stmt() { return { n: 0, g: 0, ref: 0, rn: 0 }; }
  function fresh() {
    return { t: 0, next: { web: .6, mka: 1.3, mkb: 2 }, on: { web: true, mka: true, mkb: true }, live: true, flash: 0, fs: -1, up: UPLOAD,
             av: { W: 36, E: 24 }, ship: { W: 0, E: 0 }, disp: { web: TOTAL0, mka: TOTAL0, mkb: TOTAL0 }, pend: {}, po: null, poN: 88, rcN: 131, rtN: 17, so: 1042,
             k: { orders: 0, shipped: 0, deliv: 0, ret: 0, over: 0, paid: 0 }, c: { CA: 0, ML: 0, TR: 0, DL: 0, RT: 0, XX: 0 },
             st: { web: stmt(), mka: stmt(), mkb: stmt() }, payAt: { web: 16, mka: 22, mkb: 28 }, toks: [], pulses: [], bank: 0 };
  }
  function total() { return S.av.W + S.av.E; }
  function log(c, bold, rest) {
    var li = K.el('li'); li.style.setProperty('--c', c); li.appendChild(K.el('i'));
    var s = K.el('span'); s.appendChild(K.el('b', null, bold)); s.appendChild(document.createTextNode(' ' + rest)); li.appendChild(s);
    logL.insertBefore(li, logL.firstChild);
    var all = K.$$('li', logL); while (all.length > 4) all.pop().remove();
  }
  function txt(n, sel, v) { var e = K.$(sel, N[n]); if (e) e.textContent = v; }
  function bump(n) { if (!instant) K.restart(N[n], 'is-ping'); }

  // ---------------------------------------------------------------- painting
  function paintCh(ch, quiet) {
    var v = S.disp[ch], on = S.on[ch], el = N[ch];
    txt(ch, '.omr-st', !on ? 'Paused' : v > 0 ? v + ' in stock' : 'Sold out');
    el.classList.toggle('is-off', !on); el.classList.toggle('is-out', on && v <= 0);
    el.classList.toggle('is-stale', on && !S.live && ch !== 'web' && v !== total());
    if (!instant && !quiet) K.restart(K.$('.omr-st', el), 'is-tick');
  }
  function paintStock() {
    ['W', 'E'].forEach(function (w) {
      txt(w, '.omr-v', String(S.av[w])); txt(w, '.omr-s', S.ship[w] + ' shipped');
      K.$('.omr-bar i', N[w]).style.transform = 'scaleX(' + Math.min(1, S.av[w] / 50).toFixed(3) + ')';
      N[w].classList.toggle('is-low', S.av[w] <= 4);
    });
    txt('hub', '.omr-av', total() + ' available');
    N.W.classList.toggle('has-inc', !!S.po);
    if (S.po) txt('W', '.omr-inc', 'Incoming ' + S.po.q + ' · ' + S.po.n);
  }
  function paintK() {
    Object.keys(S.k).forEach(function (k) { if (kEl[k]) kEl[k].textContent = String(S.k[k]); });
    kEl.over.parentNode.classList.toggle('omr-bad', S.k.over > 0);
    kEl.over.parentNode.classList.toggle('omr-good', !S.k.over);
    ['CA', 'ML', 'TR', 'DL', 'RT', 'XX'].forEach(function (n) { txt(n, '.omr-v', String(S.c[n])); });
    txt('hub', '.omr-v', 'S0' + (S.so - 1));
  }
  function paintSt(ch) {
    var s = S.st[ch], el = stEl[ch], fee = CH[ch].fee(s.g, s.n), net = s.g - fee - s.ref;
    K.$('.omr-sg', el).textContent = money(s.g) + ' · ' + s.n; K.$('.omr-sf', el).textContent = '− ' + money(fee);
    K.$('.omr-sr', el).textContent = '− ' + money(s.ref); K.$('.omr-snet', el).textContent = money(net);
  }

  // ---------------------------------------------------------------- tokens: orders and sync pulses travel along the edges
  function mkTok(cls, r, c) {
    if (instant) return null;
    var el = K.svg('g', { 'class': cls }); if (c) el.style.fill = c;
    if (cls !== 'omr-pl') el.appendChild(K.svg('circle', { r: r + 5, 'class': 'omr-halo' }));
    el.appendChild(K.svg('circle', { r: r }));
    (cls === 'omr-pl' ? pulseG : tokG).appendChild(el); return el;
  }
  function lit(o, key) {                                      // the edge a token travels lights up while it is on it
    if (o.lit === key) return;
    unlit(o);
    var E = EDGES[key]; if (!E || !o.el || o.el.classList.contains('omr-pl')) return;
    o.lit = key; E.hot = (E.hot || 0) + 1; E.p.classList.add('is-hot');
  }
  function unlit(o) {
    var E = o.lit && EDGES[o.lit]; o.lit = null;
    if (E && !--E.hot) E.p.classList.remove('is-hot');
  }
  function go(o, legs, hold, then) { o.legs = legs; o.t0 = S.t + (hold || 0); o.then = then || null; if (instant) run(o); }
  function run(o) { while (o.legs.length) { o.legs.shift(); if (!o.legs.length && o.then) { var f = o.then; o.then = null; f(o); } } }
  function place(o, x, y) { if (o.el) o.el.setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ')'); }
  function step(o, speed) {                                  // true when the token has nowhere left to go
    var key = o.legs[0]; if (!key) return true;
    var E = EDGES[key];
    if (!E) { o.legs.shift(); o.t0 = S.t; if (!o.legs.length && o.then) { var g = o.then; o.then = null; g(o); } return !o.legs.length; }
    var p = (S.t - o.t0) / Math.max(.3, E.len / speed);
    if (p > 0) lit(o, key);
    if (p >= 1) {
      place(o, E.pts[24][0], E.pts[24][1]);
      unlit(o); o.legs.shift(); o.t0 = S.t;
      if (!o.legs.length && o.then) { var f = o.then; o.then = null; f(o); }
      return !o.legs.length;
    }
    var x = Math.max(0, p) * 24, i = Math.min(23, x | 0), fr = x - i, a = E.pts[i], b = E.pts[i + 1];
    if (p <= 0) { a = E.pts[0]; fr = 0; b = a; }
    place(o, a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr);
    return false;
  }
  function drop(o) {
    unlit(o);
    if (!o.el) return;
    var el = o.el; o.el = null;
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = function () { el.remove(); };
  }

  // ---------------------------------------------------------------- the workflow
  function tryOrder(ch) {
    var C = CH[ch], qty = Math.random() < .18 ? 2 : 1;
    var shown = S.live || ch === 'web' ? total() : S.disp[ch];          // the buyer only sees the listing
    if (shown < 1) return;
    qty = Math.min(qty, shown);
    var o = { id: S.so++, ch: ch, qty: qty };
    if (total() < qty) o.over = true;                                   // sold from a stale listing
    else {
      var wh = C.wh, alt = wh === 'W' ? 'E' : 'W';
      if (S.av[wh] < qty) { if (S.av[alt] >= qty) { wh = alt; o.alt = true; } else qty = o.qty = 1; }
      if (S.av[wh] < qty) { wh = alt; o.alt = true; }
      S.av[wh] -= qty; o.wh = wh;
    }
    S.k.orders++;
    o.el = mkTok('omr-tk' + (o.qty > 1 ? ' is-2' : ''), o.qty > 1 ? 6 : 4.6, C.c);
    bump(ch);
    if (!o.over) stockChanged();
    S.toks.push(o);
    go(o, ch === 'web' ? ['wh'] : [ch === 'mka' ? 'ac' : 'bc', 'ch'], 0, atHub);
  }
  function atHub(o) {
    bump('hub'); paintK();
    if (o.over) {
      S.k.over++; S.c.XX++; paintK(); if (o.el) o.el.classList.add('is-over');
      log('var(--tok-late)', 'Oversold · S0' + o.id, CH[o.ch].n + ' sold a mug that is not in stock: cancelled after payment');
      go(o, ['hX'], .25, function () { bump('XX'); drop(o); });
      return;
    }
    if (o.alt) { if (o.el) o.el.classList.add('is-alt'); log('var(--tok-buy)', 'S0' + o.id + ' · ' + CH[o.ch].n, (o.wh === 'E' ? 'West' : 'East') + ' is short: ships from Warehouse ' + (o.wh === 'E' ? 'East' : 'West')); }
    else log(CH[o.ch].c, 'S0' + o.id + ' · ' + CH[o.ch].n, o.qty + (o.qty > 1 ? ' mugs' : ' mug') + ' reserved at Warehouse ' + (o.wh === 'E' ? 'East' : 'West') + (CH[o.ch].co === 'CA' ? ', courier label next' : ', label from the connector'));
    go(o, ['h' + o.wh], .2, function () {
      bump(o.wh);
      go(o, [o.wh + (CH[o.ch].co === 'CA' ? 'A' : 'M')], .35, function () {
        S.ship[o.wh] += o.qty; S.k.shipped++; S.c[CH[o.ch].co]++; bump(CH[o.ch].co); paintStock(); paintK();
        go(o, [CH[o.ch].co === 'CA' ? 'AT' : 'MT'], .2, function () {
          S.c.TR++; bump('TR'); paintK();
          go(o, ['TD'], .5, delivered);
        });
      });
    });
  }
  function delivered(o) {
    S.c.TR--; S.c.DL++; S.k.deliv++; bump('DL');
    var s = S.st[o.ch]; s.n++; s.g += o.qty * PRICE; paintSt(o.ch); paintK();
    if (Math.random() > .09) { drop(o); return; }
    if (o.el) o.el.classList.add('is-ret');
    go(o, ['DR'], .9, function () {
      S.c.RT++; S.k.ret++; bump('RT'); paintK();
      s.ref += o.qty * PRICE; s.rn++; paintSt(o.ch);
      var keep = Math.random() > .2;
      log('var(--tok-buy)', 'Return WH/RET/000' + (S.rtN++), 'S0' + o.id + ' · refund ' + money(o.qty * PRICE) + (keep ? ' · restocked at Warehouse East' : ' · damaged, scrapped'));
      go(o, ['RE'], .4, function () { drop(o); if (keep) { S.av.E += o.qty; bump('E'); stockChanged(); } });
    });
  }
  function stockChanged() {
    paintStock();
    KEYS.forEach(function (ch) { if (S.on[ch] && (S.live || ch === 'web')) pulse(ch); else paintCh(ch, true); });
    if (!S.po && total() <= 12) {
      S.po = { n: 'P' + ('0000' + S.poN++).slice(-5), at: S.t + 14, q: 48 };
      paintStock();
      log('var(--tok-make)', 'Reordering rule', total() + ' mugs left: ' + S.po.n + ' for 48 to Warehouse West');
    }
  }
  function pulse(ch) {
    if (S.pend[ch]) return;                                  // one in flight per channel: it carries the level current on arrival
    S.pend[ch] = true;
    var p = { el: mkTok('omr-pl', 3) };
    S.pulses.push(p);
    go(p, ch === 'web' ? ['sW'] : ['sC', ch === 'mka' ? 'sA' : 'sB'], 0, function () { S.pend[ch] = false; S.disp[ch] = total(); paintCh(ch); if (p.el) { p.el.remove(); p.el = null; } });
  }
  function payout(ch) {
    var s = S.st[ch]; if (!s.n) return;
    var fee = CH[ch].fee(s.g, s.n), net = s.g - fee - s.ref, n = s.n, rn = s.rn, g = s.g, ref = s.ref;
    S.st[ch] = stmt(); paintSt(ch);
    var li = K.el('li', 'is-wait'); li.style.setProperty('--c', CH[ch].c);
    li.appendChild(K.el('i')); li.appendChild(K.el('span', null, CH[ch].pay)); li.appendChild(K.el('em', null, money(net)));
    var tag = K.el('small', null, 'Matching'); li.appendChild(tag);
    bankL.insertBefore(li, bankL.firstChild);
    var all = K.$$('li', bankL); while (all.length > 3) all.pop().remove();
    var last = K.$('.omr-last', stEl[ch]);
    last.textContent = 'Last payout ' + money(net) + ' · matched';
    function match() {
      li.classList.remove('is-wait'); tag.textContent = 'Matched';
      S.k.paid++; paintK();
      bankD.textContent = '';
      bankD.appendChild(K.el('b', null, CH[ch].pay + ' ' + money(net)));
      bankD.appendChild(document.createTextNode(' matched to ' + n + (n > 1 ? ' orders' : ' order') + (rn ? ' less ' + rn + (rn > 1 ? ' refunds' : ' refund') : '') + ' (' + money(g - ref) + ' receivable) with ' + money(fee) + ' booked to fees: ' + CH[ch].ft + '.'));
      if (!instant) K.restart(stEl[ch], 'is-ping');
    }
    if (instant) match(); else S.jobs.push([S.t + .9, match]);
    log('var(--tok-pay)', 'Bank feed', CH[ch].pay + ' ' + money(net) + ' arrived');
  }

  // ---------------------------------------------------------------- the clock
  function expo(rate) { return -Math.log(1 - Math.random()) / rate; }
  function tick(dt) {
    S.t += dt;
    var flash = S.t < S.flash, mult = flash ? 4 : 1;
    KEYS.forEach(function (ch) {
      if (S.t < S.next[ch]) return;
      S.next[ch] = S.t + expo(CH[ch].rate * mult);
      if (S.on[ch]) tryOrder(ch);
    });
    if (S.po && S.t >= S.po.at) {
      S.av.W += S.po.q; log('var(--tok-stock)', 'WH/IN/00' + (S.rcN++), 'received · ' + S.po.q + ' mugs into Warehouse West (' + S.po.n + ')');
      S.po = null; bump('W'); stockChanged();
    }
    if (!S.live && S.t >= S.up) {                              // the "before" world: someone uploads a stock sheet every so often
      S.up = S.t + UPLOAD;
      ['mka', 'mkb'].forEach(function (ch) { S.disp[ch] = total(); paintCh(ch); });
      log('var(--muted)', 'Stock sheet', 'uploaded to both marketplaces by hand');
    }
    KEYS.forEach(function (ch) { if (S.t >= S.payAt[ch]) { S.payAt[ch] = S.t + CYCLE; payout(ch); } });
    for (var j = 0; j < S.jobs.length; j++) if (S.jobs[j][0] <= S.t) { var f = S.jobs[j][1]; S.jobs.splice(j, 1); j--; f(); }
    if (flash !== !!S.fs || (flash && Math.ceil(S.flash - S.t) !== S.fs)) {
      S.fs = flash ? Math.ceil(S.flash - S.t) : 0;
      flashB.classList.toggle('is-on', flash); root.classList.toggle('is-flash', flash);
      flashT.textContent = flash ? 'Flash sale · ' + S.fs + ' s' : 'Flash sale';
    }
    if (instant) return;
    S.toks = S.toks.filter(function (o) { var done = step(o, 250); if (done && o.el) drop(o); return !done; });
    S.pulses = S.pulses.filter(function (p) { return !step(p, 420); });
    KEYS.forEach(function (ch) { K.$('.omr-pb i', stEl[ch]).style.transform = 'scaleX(' + K.clamp(1 - (S.payAt[ch] - S.t) / CYCLE, 0, 1).toFixed(3) + ')'; });
  }
  var loop = K.loop(function (now, dt) { tick(dt); });
  function simulate(sec) { instant = true; for (var t = 0; t < sec; t += .1) tick(.1); instant = false; paintAll(); }
  function paintAll() { KEYS.forEach(function (ch) { paintCh(ch); paintSt(ch); }); paintStock(); paintK(); }
  function statics() {                                         // reduced motion: a few orders drawn mid-route
    tokG.textContent = '';
    [['wh', .5, 'web'], ['ac', .6, 'mka'], ['hW', .5, 'web'], ['EM', .45, 'mkb'], ['AT', .55, 'web'], ['TD', .5, 'mka'], ['bc', .4, 'mkb']].forEach(function (x) {
      var E = EDGES[x[0]]; if (!E) return;
      var q = E.pts[Math.round(x[1] * 24)], c = K.svg('circle', { r: 4.6, 'class': 'omr-tk', transform: 'translate(' + f1(q[0]) + ' ' + f1(q[1]) + ')' });
      c.style.fill = CH[x[2]].c; tokG.appendChild(c);
    });
  }

  // ---------------------------------------------------------------- hover details
  var TIPS = {
    web: function () { return ['Website · Odoo eCommerce', 'Ceramic mug at S$ 24.90, stock read from Odoo', 'Paid at checkout through the payment provider']; },
    mka: function () { return ['Marketplace A', 'Orders and delivery slips come in through the connector', S.live ? 'Stock level synced back after every change' : 'Stock updated from a spreadsheet: can go stale']; },
    mkb: function () { return ['Marketplace B', 'Orders and delivery slips come in through the connector', S.live ? 'Stock level synced back after every change' : 'Stock updated from a spreadsheet: can go stale']; },
    conn: function () { return ['Marketplace connector', 'Orders in; stock levels and tracking numbers out']; },
    hub: function () { return ['Odoo · Sales and Inventory', 'Each order becomes a sales order and reserves stock', total() + ' mugs available across both warehouses']; },
    W: function () { return ['Warehouse West', 'Ships Website and Marketplace A orders', S.av.W + ' available · ' + S.ship.W + ' shipped']; },
    E: function () { return ['Warehouse East', 'Ships Marketplace B orders and receives returns', S.av.E + ' available · ' + S.ship.E + ' shipped']; },
    CA: function () { return ['Courier A', 'Label and tracking number from the carrier integration']; },
    ML: function () { return ['Marketplace logistics', 'Shipping label comes through the connector']; },
    TR: function () { return ['In transit', 'Tracking sent to the customer and back to the channel']; },
    DL: function () { return ['Delivered', 'Counts towards the next payout of its channel']; },
    RT: function () { return ['Returns', 'Refund issued, then restocked at Warehouse East or scrapped']; },
    XX: function () { return ['Oversold and cancelled', 'Sold from a stale listing: refunded, and the channel may penalise it']; }
  };
  Object.keys(TIPS).forEach(function (k) {
    var el = N[k];
    function on() { var b = K.box(el, stage); tip.show(TIPS[k](), b.cx, b.y); }
    function off() { tip.hide(); }
    el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
    el.addEventListener('focus', on); el.addEventListener('blur', off);
  });

  // ---------------------------------------------------------------- controls
  chB.forEach(function (b) {
    b.addEventListener('click', function () {
      var ch = b.dataset.ch; S.on[ch] = !S.on[ch]; b.setAttribute('aria-pressed', String(S.on[ch]));
      if (S.on[ch]) { if (S.live || ch === 'web') { S.disp[ch] = total(); } log('var(--tok-stock)', CH[ch].n, 'listing live again, stock level sent'); }
      else log('var(--muted)', CH[ch].n, 'listing paused: no new orders from it');
      paintCh(ch);
      if (K.reduce) simulate(8);
    });
  });
  syncB.forEach(function (b) {
    b.addEventListener('click', function () {
      S.live = b.dataset.sync === 'live';
      syncB.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      root.classList.toggle('is-manual', !S.live);
      if (S.live) { KEYS.forEach(function (ch) { if (S.on[ch]) pulse(ch); }); log('var(--tok-stock)', 'Stock sync on', 'every channel gets the Odoo stock level after each change'); }
      else { S.up = S.t + UPLOAD; log('var(--tok-late)', 'Spreadsheet updates', 'marketplaces only learn the stock level when a sheet is uploaded'); }
      KEYS.forEach(paintCh);
      if (K.reduce) simulate(20);
    });
  });
  flashB.addEventListener('click', function () {
    S.flash = S.t + 10; S.fs = -1;
    KEYS.forEach(function (ch) { S.next[ch] = S.t + Math.random() * .4; });
    log('var(--tok-late)', 'Flash sale', 'four times the orders for ten seconds on every live channel');
    if (K.reduce) simulate(12);
  });
  function reset() {
    tokG.textContent = ''; pulseG.textContent = ''; logL.textContent = ''; bankL.textContent = ''; bankD.textContent = 'Payouts are matched here as they arrive.';
    var live = S ? S.live : true;
    S = fresh(); S.jobs = []; S.live = live;
    KEYS.forEach(function (ch) { K.$('.omr-last', stEl[ch]).textContent = 'No payout yet'; });
    chB.forEach(function (b) { b.setAttribute('aria-pressed', 'true'); });
    paintAll();
  }
  K.$('[data-reset]', root).addEventListener('click', function () { reset(); if (K.reduce) { simulate(40); statics(); } });
  var rz = 0;
  window.addEventListener('resize', function () {
    if (rz) return;
    rz = requestAnimationFrame(function () { rz = 0; layout(); if (K.reduce) statics(); });
  });

  layout(); reset();
  if (K.reduce) { simulate(40); statics(); }
  return {
    start: function () { vis = true; layout(); if (K.reduce) statics(); loop.on(); },
    stop: function () { vis = false; loop.off(); }
  };
});
