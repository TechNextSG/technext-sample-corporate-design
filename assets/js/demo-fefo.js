/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Medical page demo: lots, expiry and a recall trace. A clinic group's central store holds
   lot-tracked consumables with expiry dates. Thirty sample days run: orders from the clinics and
   partner customers are reserved by the removal strategy (FEFO or FIFO), alert dates raise
   activities, lots that reach their removal date move to a quarantine location, reordering rules
   raise purchase orders and receipts record new lots. Click any lot to trace it back to its
   supplier receipt and forward to every transfer, delivery and customer, then run a recall.
   Sample data only; no clinical records. */
TN.demo('fefo', function (root, K) {
  var body = K.$('.fefo-body', root), rack = K.$('.fefo-rack', root), qbay = K.$('.fefo-qbins', root);
  var dockL = K.$('.fefo-picks', root), logL = K.$('.fefo-log', root), lanes = K.$('.fefo-lanes', root);
  var trace = K.$('.fefo-trace', root), gs = K.$('.fefo-gs', root), gWrap = K.$('.fefo-g', root);
  var gSvg = K.$('.fefo-gsvg', root), gNodes = K.$('.fefo-gn', root), sumEl = K.$('.fefo-sum', root);
  var gSub = K.$('.fefo-gt small', root), cmpEl = K.$('.fefo-cmp', root);
  var playB = K.$('[data-play]', root), recB = K.$('[data-recall]', root), segB = K.$$('[data-s]', root);
  var kDay = K.$('[data-k="day"]', root), kPick = K.$('[data-k="pick"]', root), kAl = K.$('[data-k="al"]', root), kQ = K.$('[data-k="q"]', root);
  var tpl = K.$('.fefo-ic', root), tip = K.tip(body), gtip = K.tip(trace);
  function ic(n) { var s = tpl && tpl.content.querySelector('[data-i="' + n + '"] svg'); return s ? s.cloneNode(true) : K.el('i'); }

  // ---------------------------------------------------------------- sample data
  var D0 = Date.UTC(2026, 9, 1), END = 30, DAY_MS = 1500, ALERT = 30, REMOVE = 7;
  function ds(d, y) { var o = { day: 'numeric', month: 'short', timeZone: 'UTC' }; if (y) o.year = 'numeric'; return new Date(D0 + d * 864e5).toLocaleDateString('en-GB', o); }
  function pad(n) { return ('0000' + n).slice(-5); }
  // demand per weekday, and where each day's order goes (index into DEST)
  var PR = {
    sal: { n: 'Saline 0.9% · 500 ml', s: 'Saline', u: 'bags', min: 40, max: 100, lead: 4, sup: 'Supplier A', row: 0, dem: [4, 3, 5, 3, 4, 2, 3], to: [0, 1, 3, 2, 0, 5, 1] },
    gau: { n: 'Gauze swabs · 10×10 cm', s: 'Gauze', u: 'packs', min: 60, max: 130, lead: 3, sup: 'Supplier B', row: 1, dem: [2, 3, 1, 2, 3, 2, 2], to: [1, 2, 0, 4, 1, 0, 2] },
    san: { n: 'Hand sanitiser · 500 ml', s: 'Sanitiser', u: 'bottles', min: 20, max: 60, lead: 5, sup: 'Supplier C', row: 2, pos: 1, dem: [1, 1, 2, 1, 0, 1, 1], to: [2, 0, 1, 5, 2, 1, 0] }
  };
  var DEST = ['Clinic A', 'Clinic B', 'Clinic C', 'Partner clinic 1', 'Partner clinic 2', 'Corporate customer 3'];
  // lots on the shelf on 1 Oct: history out = [ref, destination, qty, used or sold at the clinic, POS orders]
  var LOTS = [
    { id: '17A', p: 'sal', bin: 0, in: -203, exp: 30, qty: 40, rc: 120, po: 'P00071', rcpt: 'WH/IN/00031', out: [['WH/INT/00318', 0, 30, 26], ['WH/INT/00327', 1, 24, 20], ['WH/OUT/00141', 3, 16], ['WH/INT/00352', 2, 10, 4]] },
    { id: '21C', p: 'sal', bin: 1, in: -115, exp: 190, qty: 60, rc: 100, po: 'P00083', rcpt: 'WH/IN/00044', out: [['WH/INT/00371', 0, 20, 8], ['WH/OUT/00162', 5, 20]] },
    { id: '23F', p: 'sal', bin: 2, in: -29, exp: 20, qty: 24, rc: 24, po: 'P00097', rcpt: 'WH/IN/00056', sup: 'Supplier D', out: [] },
    { id: '19D', p: 'gau', bin: 0, in: -173, exp: 45, qty: 44, rc: 150, po: 'P00079', rcpt: 'WH/IN/00038', out: [['WH/INT/00331', 0, 40, 36], ['WH/INT/00334', 1, 36, 30], ['WH/OUT/00149', 4, 30]] },
    { id: '24B', p: 'gau', bin: 1, in: -42, exp: 181, qty: 80, rc: 80, po: 'P00094', rcpt: 'WH/IN/00053', out: [] },
    { id: '06E', p: 'san', bin: 0, in: -271, exp: 12, qty: 8, rc: 60, po: 'P00064', rcpt: 'WH/IN/00022', out: [['WH/INT/00301', 1, 24, 20, 12], ['WH/INT/00305', 0, 16, 16, 9], ['WH/OUT/00133', 5, 12]] },
    { id: '09C', p: 'san', bin: 1, in: -58, exp: 406, qty: 50, rc: 50, po: 'P00092', rcpt: 'WH/IN/00051', out: [] }
  ];
  var NEWLOT = { sal: ['26A', '29B'], gau: ['27B', '30C'], san: ['28C', '31D'] }, SHELF = { sal: 300, gau: 360, san: 540 };
  var ROWS = ['sal', 'gau', 'san'];

  // ---------------------------------------------------------------- the simulation (pure: state in, events out)
  function mk(id, p, bin, inD, exp, qty, rc, po, rcpt, sup, out) {
    return { id: id, p: p, bin: bin, in: inD, exp: exp, al: exp - ALERT, rem: exp - REMOVE, qty: qty, rc: rc, po: po, rcpt: rcpt, sup: sup,
             out: (out || []).map(function (m) { return m.slice(); }), loc: 'stock', alerted: exp - ALERT < 0 };
  }
  function fresh(s) {
    return { s: s, d: 0, picked: 0, waste: 0, inc: {}, nl: { sal: 0, gau: 0, san: 0 }, n: { int: 412, out: 180, po: 112, rc: 58, q: 31 },
             lots: LOTS.map(function (l) { return mk(l.id, l.p, l.bin, l.in, l.exp, l.qty, l.rc, l.po, l.rcpt, l.sup || PR[l.p].sup, l.out); }) };
  }
  // the removal strategy decides which lot is reserved first
  function avail(st, p) {
    return st.lots.filter(function (l) { return l.p === p && l.loc === 'stock' && l.qty > 0; })
      .sort(st.s === 'fefo' ? function (a, b) { return a.rem - b.rem || a.in - b.in; } : function (a, b) { return a.in - b.in; });
  }
  function onhand(st, p) { return avail(st, p).reduce(function (t, l) { return t + l.qty; }, 0); }
  function freeBin(st, p) {
    var used = {};
    st.lots.forEach(function (l) { if (l.p === p && l.loc === 'stock' && l.qty > 0) used[l.bin] = 1; });
    for (var i = 0; i < 4; i++) if (!used[i]) return i;
    return 3;
  }
  function day(st) {
    var d = st.d, ev = [];
    ROWS.forEach(function (p) {                                   // receipts due today record a new lot and its expiry
      var r = st.inc[p]; if (!r || r.day !== d) return;
      var l = mk(NEWLOT[p][st.nl[p]++ % 2], p, r.bin, d, d + SHELF[p], r.qty, r.qty, r.po, 'WH/IN/' + pad(st.n.rc++), r.sup, []);
      st.lots.push(l); st.inc[p] = null; ev.push({ k: 'rc', l: l });
    });
    st.lots.forEach(function (l) {                                // removal date reached: out of pickable stock
      if (l.loc === 'stock' && l.qty > 0 && l.rem <= d) { l.loc = 'quar'; st.waste += l.qty; ev.push({ k: 'q', l: l, ref: 'WH/INT/' + pad(st.n.q++) }); }
    });
    st.lots.forEach(function (l) {                                // alert date reached: an activity for the lot
      if (!l.alerted && l.loc === 'stock' && l.qty > 0 && l.al <= d) { l.alerted = true; ev.push({ k: 'al', l: l }); }
    });
    ROWS.forEach(function (p) {                                   // today's orders, reserved lot by lot
      var P = PR[p], q = P.dem[d % 7]; if (!q) return;
      var di = P.to[d % 7], ref = (di >= 3 ? 'WH/OUT/' + pad(st.n.out++) : 'WH/INT/' + pad(st.n.int++)), need = q, lines = [];
      avail(st, p).forEach(function (l) { if (!need) return; var t = Math.min(need, l.qty); l.qty -= t; need -= t; lines.push([l, t]); l.out.push([ref, di, t, 0, 0, d]); });
      st.picked += q - need;
      ev.push({ k: 'pk', p: p, ref: ref, di: di, lines: lines, short: need });
    });
    ROWS.forEach(function (p) {                                   // reordering rules: below the minimum, order up to the maximum
      var P = PR[p]; if (st.inc[p]) return;
      var oh = onhand(st, p); if (oh >= P.min) return;
      var r = { qty: P.max - oh, day: d + P.lead, po: 'P' + pad(st.n.po++), sup: P.sup, bin: freeBin(st, p) };
      st.inc[p] = r; ev.push({ k: 'po', p: p, r: r });
    });
    st.d++;
    return ev;
  }
  function runAll(s) { var st = fresh(s); while (st.d < END) day(st); return st.waste; }
  var CMP = { fefo: runAll('fefo'), fifo: runAll('fifo') };

  // ---------------------------------------------------------------- the shelves
  var bins = {};
  ROWS.forEach(function (p, r) {
    var P = PR[p], row = K.el('div', 'fefo-row'), lab = K.el('div', 'fefo-rl');
    lab.appendChild(K.el('b', null, P.n)); lab.appendChild(K.el('small', null, 'Min ' + P.min + ' · max ' + P.max + ' ' + P.u));
    row.appendChild(lab);
    var bw = K.el('div', 'fefo-bins');
    for (var i = 0; i < 4; i++) { var b = K.el('div', 'fefo-bin'); b.appendChild(K.el('span', 'fefo-bid', 'ABC'[r] + '-0' + (i + 1))); bw.appendChild(b); bins[p + i] = b; }
    row.appendChild(bw); rack.appendChild(row);
  });
  function hover(el, lines, host, t) {
    function on() { var b = K.box(el, host); t.show(lines(), b.cx - (host === trace ? gs.scrollLeft : 0), b.y); }
    function off() { t.hide(); }
    el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
    el.addEventListener('focus', on); el.addEventListener('blur', off);
  }
  function lotTip(l) {
    var P = PR[l.p];
    return ['Lot ' + l.id + ' · ' + P.n,
            l.qty + ' ' + P.u + (l.loc === 'quar' ? ' in WH/Quarantine' : ' in WH/Stock/' + 'ABC'[P.row] + '-0' + (l.bin + 1)),
            'Received ' + ds(l.in, 1) + ' on ' + l.rcpt + ' from ' + l.sup,
            'Alert ' + ds(l.al) + ' · removal ' + ds(l.rem) + ' · expiry ' + ds(l.exp, 1)];
  }
  function carton(l) {
    var b = K.el('button', 'fefo-lot'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    var top = K.el('span', 'fefo-lt'); top.appendChild(K.el('b', null, l.id)); l.qEl = K.el('em', null, String(l.qty)); top.appendChild(l.qEl); b.appendChild(top);
    b.appendChild(K.el('span', 'fefo-le', 'Exp ' + ds(l.exp)));
    l.dEl = K.el('span', 'fefo-ld'); b.appendChild(l.dEl);
    var m = K.el('i', 'fefo-lm'); l.mEl = K.el('i'); m.appendChild(l.mEl); b.appendChild(m);
    b.appendChild(K.el('span', 'fefo-nx', 'Next pick'));
    var a = K.el('span', 'fefo-la'); a.appendChild(ic('clock')); b.appendChild(a);
    b.addEventListener('click', function () { select(l, true); });
    hover(b, function () { return lotTip(l); }, body, tip);
    l.el = b; return b;
  }
  function paint(l) {
    if (!l.el) return;
    var left = l.exp - st.d, P = PR[l.p];
    l.dEl.textContent = left > 0 ? left + ' days' : 'Expired';
    l.mEl.style.transform = 'scaleX(' + Math.max(0, l.qty / l.rc).toFixed(3) + ')';
    l.el.classList.toggle('is-alert', !!l.alerted && l.loc === 'stock');
    l.el.classList.toggle('is-late', l.loc === 'quar');
    l.el.setAttribute('aria-label', 'Lot ' + l.id + ', ' + P.n + ', ' + l.qty + ' ' + P.u + ', expires ' + ds(l.exp, 1) + (l.loc === 'quar' ? ', in quarantine' : '') + '. Trace this lot');
  }
  function flip(el, to) {
    if (!el) return;
    var a = K.reduce ? null : K.box(el, body);
    to.appendChild(el);
    if (!a) return;
    var b = K.box(el, body);
    el.animate([{ transformOrigin: '0 0', transform: 'translate(' + (a.x - b.x) + 'px,' + (a.y - b.y) + 'px) scale(' + (a.w / b.w).toFixed(3) + ',' + (a.h / b.h).toFixed(3) + ')' },
                { transformOrigin: '0 0', transform: 'none' }], { duration: 820, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function gone(l) {
    var c = l.el; if (!c) return;
    l.el = null;
    if (K.reduce) { c.remove(); return; }
    c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.88)' }], { duration: 380, easing: 'ease-in', fill: 'forwards' }).onfinish = function () { c.remove(); };
  }
  function fly(l, card, q) {
    if (K.reduce || !l.el || !card.isConnected) return;
    var a = K.box(l.el, body), b = K.box(card, body);
    if (Math.abs(b.cy - a.cy) > 460) return;                    // stacked layout: the list is far below
    var t = K.el('span', 'fefo-tok', '−' + q); body.appendChild(t);
    var x0 = a.cx - 14, y0 = a.cy - 10, x1 = b.x + 8, y1 = b.cy - 10, mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 36;
    t.animate([{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.6)', opacity: 0 },
               { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1)', opacity: 1, offset: .45 },
               { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.8)', opacity: 0 }], { duration: 760, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = function () { t.remove(); };
  }

  // ---------------------------------------------------------------- expiry calendar
  function buildLanes() {
    lanes.textContent = '';
    ROWS.forEach(function (p) {
      var ln = K.el('div', 'fefo-lane'), tr = K.el('div', 'fefo-ltr');
      ln.appendChild(K.el('span', 'fefo-lnl', PR[p].s));
      st.lots.forEach(function (l) {
        if (l.p !== p) return;
        [[l.al, 'al'], [l.rem, 'rm']].forEach(function (m) {
          if (m[0] < 0 || m[0] >= END) return;
          var k = K.el('i', 'fefo-mk fefo-mk--' + m[1]); k.style.left = (m[0] / END * 100).toFixed(2) + '%'; k.dataset.d = m[0];
          k.appendChild(K.el('b', null, l.id)); tr.appendChild(k);
        });
      });
      ln.appendChild(tr); lanes.appendChild(ln);
    });
    var ax = K.el('div', 'fefo-ax');
    [0, 7, 14, 21, 28].forEach(function (d) { var s = K.el('span', null, ds(d)); s.style.left = (d / END * 100).toFixed(2) + '%'; ax.appendChild(s); });
    var nt = K.el('div', 'fefo-nt'); nowEl = K.el('i', 'fefo-now'); nt.appendChild(nowEl); lanes.appendChild(nt);
    lanes.appendChild(ax);
  }
  var nowEl = null;

  // ---------------------------------------------------------------- one clock: jobs and days run on the frame loop
  var st, sel = null, clk = 0, jobs = [], nextAt = 0, playing = false, ended = false, started = false, vis = false;
  var loop = K.loop(function (now, dt) {
    clk += dt * 1000;
    for (var i = 0; i < jobs.length; i++) if (jobs[i][0] <= clk) { var f = jobs[i][1]; jobs.splice(i, 1); i--; f(); }
    if (playing && clk >= nextAt) { if (st.d >= END) finish(); else { nextAt = clk + DAY_MS; runDay(); } }
    if (!playing && !jobs.length) loop.off();
  });
  function wake() { if (vis && !K.reduce) loop.on(); }
  function at(ms, fn) { if (K.reduce) { fn(); return; } jobs.push([clk + ms, fn]); wake(); }

  function log(c, bold, rest) {
    var li = K.el('li'); li.style.setProperty('--c', c); li.appendChild(K.el('i'));
    var s = K.el('span'); s.appendChild(K.el('b', null, bold)); s.appendChild(document.createTextNode(' ' + rest)); li.appendChild(s);
    logL.insertBefore(li, logL.firstChild);
    var all = K.$$('li', logL); while (all.length > 4) all.pop().remove();
  }
  var H = {
    rc: function (e) {
      var l = e.l, b = bins[l.p + l.bin], g = K.$('.fefo-ghost', b); if (g) g.remove();
      var c = carton(l); b.appendChild(c); paint(l);
      if (!K.reduce) c.animate([{ transform: 'translateY(-16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.34,1.45,.64,1)' });
      log('var(--tok-stock)', l.rcpt, 'received · Lot ' + l.id + ', ' + l.qty + ' ' + PR[l.p].u + ', expiry ' + ds(l.exp, 1) + ' recorded');
    },
    q: function (e) {
      var l = e.l; flip(l.el, qbay); paint(l);
      log('var(--tok-late)', 'Removal date', 'Lot ' + l.id + ': ' + l.qty + ' ' + PR[l.p].u + ' moved to WH/Quarantine (' + e.ref + ')');
    },
    al: function (e) {
      var l = e.l; paint(l); if (l.el) K.restart(l.el, 'is-ping');
      log('var(--tok-buy)', 'Alert date', 'Lot ' + l.id + ' expires ' + ds(l.exp) + ': activity for the stock controller');
    },
    pk: function (e) {
      var P = PR[e.p], card = K.el('li', 'fefo-pk'), h = K.el('div', 'fefo-pkh');
      h.appendChild(K.el('b', null, e.ref)); h.appendChild(K.el('span', null, '→ ' + DEST[e.di])); card.appendChild(h);
      var ln = K.el('div', 'fefo-pkl'); ln.appendChild(K.el('span', null, P.s + ' × ' + (e.lines.reduce(function (t, x) { return t + x[1]; }, 0))));
      ln.appendChild(K.el('em', null, e.lines.length ? e.lines.map(function (x) { return 'Lot ' + x[0].id + ' × ' + x[1]; }).join(' + ') : 'no stock'));
      card.appendChild(ln);
      if (e.lines.length > 1) card.classList.add('is-split');
      if (e.short) card.appendChild(K.el('small', 'fefo-short', e.short + ' ' + P.u + ' backordered'));
      dockL.appendChild(card);
      var all = K.$$('li', dockL); while (all.length > 3) all.shift().remove();
      e.lines.forEach(function (x, j) {
        var l = x[0];
        at(j * 150, function () { fly(l, card, x[1]); if (l.el) K.restart(l.el, 'is-hit'); });
        at(j * 150 + 430, function () { if (l.qEl) K.count(l.qEl, l.qty, 420); if (!l.qty) gone(l); });
      });
    },
    po: function (e) {
      var P = PR[e.p], r = e.r, g = K.el('div', 'fefo-ghost');
      g.appendChild(K.el('b', null, 'Incoming')); g.appendChild(K.el('span', null, r.po + ' · ' + r.qty + ' ' + P.u)); g.appendChild(K.el('small', null, 'Due ' + ds(r.day)));
      bins[e.p + r.bin].appendChild(g);
      log('var(--tok-make)', 'Reordering rule', P.s + ' under ' + P.min + ': ' + r.po + ' to ' + r.sup + ' for ' + r.qty + ' ' + P.u);
    }
  };
  function runDay() {
    var d = st.d, ev = day(st), t = 0;
    dockL.textContent = '';
    kDay.textContent = ds(d);
    nowEl.style.transform = 'translateX(' + (st.d / END * 100).toFixed(2) + '%)';
    ev.forEach(function (e) { at(t, function () { H[e.k](e); }); t += e.k === 'pk' ? 230 : 170; });
    at(t + 80, function () {
      refresh();
      if (!sel) return;
      var hot = {};
      ev.forEach(function (e) { if (e.lines) e.lines.forEach(function (x) { if (x[0] === sel) hot[e.di] = 1; }); if (e.l === sel) hot.c = 1; });
      if (Object.keys(hot).length) graph(false, hot);
    });
  }
  function refresh() {
    ROWS.forEach(function (p) { var nx = avail(st, p)[0]; st.lots.forEach(function (l) { if (l.p === p && l.el) l.el.classList.toggle('is-next', l === nx); }); });
    st.lots.forEach(paint);
    var al = st.lots.filter(function (l) { return l.alerted && l.loc === 'stock' && l.qty > 0; }).length;
    var q = st.lots.reduce(function (t, l) { return t + (l.loc === 'quar' ? l.qty : 0); }, 0);
    K.count(kPick, st.picked, 400); kAl.textContent = String(al); K.count(kQ, q, 400);
    kAl.parentNode.classList.toggle('fefo-warn', al > 0);
    kQ.parentNode.classList.toggle('fefo-bad', q > 0);
    K.$$('.fefo-mk', lanes).forEach(function (m) { m.classList.toggle('is-past', +m.dataset.d < st.d); });
  }
  function playLabel(txt, on) { K.$('span', playB).textContent = txt; playB.classList.toggle('is-on', !!on); }
  function play() { playing = true; ended = false; nextAt = clk + 380; playLabel('Pause', true); wake(); }
  function finish() {
    playing = false; ended = true; playLabel(K.reduce ? 'Restart' : 'Replay');
    var mx = Math.max(CMP.fefo, CMP.fifo, 1);
    K.$$('[data-c]', cmpEl).forEach(function (r) {
      var k = r.dataset.c; K.$('em', r).textContent = CMP[k] + ' units';
      K.$('i i', r).style.transform = 'scaleX(' + (CMP[k] / mx).toFixed(3) + ')';
      r.classList.toggle('is-me', k === st.s);
    });
    cmpEl.hidden = false;
    if (!K.reduce) K.restart(cmpEl, 'is-in');
  }
  function reset(s) {
    jobs = []; playing = false; ended = false;
    st = fresh(s || (st && st.s) || 'fefo');
    K.$$('.fefo-lot, .fefo-ghost', rack).forEach(function (x) { x.remove(); });
    qbay.textContent = ''; dockL.textContent = ''; logL.textContent = '';
    st.lots.forEach(function (l) { bins[l.p + l.bin].appendChild(carton(l)); });
    buildLanes(); cmpEl.hidden = true;
    segB.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.s === st.s)); });
    kDay.textContent = ds(0); kPick.dataset.v = 0; kQ.dataset.v = 0;
    refresh(); playLabel(K.reduce ? 'Next day' : 'Play');
    sel = null; select(st.lots[0], true);
  }

  // ---------------------------------------------------------------- recall trace: back to the receipt, forward to every move
  function model(l) {
    var agg = {}, list = [];
    l.out.forEach(function (m) {
      var a = agg[m[1]];
      if (!a) { a = agg[m[1]] = { di: m[1], refs: [], q: 0, used: 0, pos: 0 }; list.push(a); }
      a.refs.push(m); a.q += m[2]; a.used += m[3] || 0; a.pos += m[4] || 0;
    });
    list.sort(function (a, b) { return a.di - b.di; });
    var ns = list.map(function (a) { var ext = a.di >= 3; return { t: ext ? 'cust' : 'int', a: a, name: DEST[a.di], q: a.q, oh: ext ? 0 : a.q - a.used, used: ext ? 0 : a.used }; });
    if (l.qty > 0 || !ns.length) ns.unshift({ t: l.loc === 'quar' ? 'quar' : 'central', name: l.loc === 'quar' ? 'WH/Quarantine' : 'Central store', q: l.qty, oh: l.qty, used: 0 });
    return ns;
  }
  function gnode(cls, b4, icon, b, s, d) {
    var n = K.el('div', 'fefo-nd fefo-nd--' + cls);
    n.style.left = f1(b4[0]) + 'px'; n.style.top = f1(b4[1]) + 'px'; n.style.width = f1(b4[2]) + 'px'; n.style.height = b4[3] + 'px';
    n.style.setProperty('--d', (d || 0) + 'ms');
    var i = K.el('span', 'fefo-ni'); i.appendChild(ic(icon)); n.appendChild(i);
    var t = K.el('span', 'fefo-nt2'); t.appendChild(K.el('b', null, b)); if (s) t.appendChild(K.el('small', null, s)); n.appendChild(t);
    gNodes.appendChild(n); return n;
  }
  function link(dPath, w, cls, d) {
    var p = K.svg('path', { d: dPath, 'class': 'fefo-lk fefo-lk--' + cls, 'stroke-width': w.toFixed(1), pathLength: 1 });
    p.style.setProperty('--d', (d || 0) + 'ms'); gSvg.appendChild(p); return p;
  }
  function f1(v) { return v.toFixed(1); }
  function graph(anim, hot, recall) {
    var l = sel; if (!l) return;
    var P = PR[l.p], ns = model(l), n = ns.length, v = gs.clientWidth < 600, S, R, L, D = [], H, cy;
    gWrap.classList.toggle('is-v', v);                        // phones: a top-down tree instead of left to right
    var W = gWrap.offsetWidth, sc = 30 / l.rc, full = l.rc * sc;
    if (!v) {
      H = 7 * 50 + 8; cy = H / 2;                             // fixed height: no jumps as moves are added
      var X = [0, W * .205, W * .42, W * .665], WD = [W * .17, W * .18, W * .19, W * .335], rowH = Math.min(58, (H - 8) / n), top0 = (H - n * rowH) / 2 + (rowH - 44) / 2;
      S = [X[0], cy - 27, WD[0], 54]; R = [X[1], cy - 27, WD[1], 54]; L = [X[2], cy - 36, WD[2], 72];
      ns.forEach(function (d, i) { D.push([X[3], top0 + i * rowH, WD[3], 44]); });
    } else {
      var X0 = W * .19;
      S = [0, 0, W * .47, 50]; R = [W * .53, 0, W * .47, 50]; L = [X0, 74, W - X0, 64];
      ns.forEach(function (d, i) { D.push([X0, 162 + i * 52, W - X0, 44]); });
      H = 162 + n * 52; cy = L[1] + L[3] / 2;
    }
    gWrap.style.height = H + 'px'; gSvg.setAttribute('viewBox', '0 0 ' + f1(W) + ' ' + H);
    gSvg.textContent = ''; gNodes.textContent = ''; gtip.hide();
    gWrap.classList.toggle('is-anim', !!anim && !K.reduce); gWrap.classList.toggle('is-recanim', !!recall && !K.reduce);
    if (!v) { link(K.curve([L[0], cy], [R[0] + R[2], cy], .5), full, 'back', 0); link(K.curve([R[0], cy], [S[0] + S[2], cy], .5), full, 'back', 200); }
    else { var rx = R[0] + R[2] * .5; link('M' + f1(rx) + ' ' + L[1] + 'L' + f1(rx) + ' ' + (R[1] + R[3]), full, 'back', 0); link('M' + f1(R[0]) + ' 25L' + f1(S[0] + S[2]) + ' 25', full, 'back', 200); }
    var ns0 = gnode('sup', S, 'truck', l.sup, 'PO ' + l.po, 380);
    gnode('rcp', R, 'receipt', l.rcpt, ds(l.in, 1), 200);
    var ln = gnode('lot', L, 'layers', 'Lot ' + l.id, 'Exp ' + ds(l.exp, 1), 0);
    ln.appendChild(K.el('em', 'fefo-nq', l.rc + ' ' + P.u + ' received'));
    hover(ns0, function () { return [l.sup, 'Purchase order ' + l.po, 'Receipt ' + l.rcpt + ' · ' + ds(l.in, 1)]; }, trace, gtip);
    // downstream links, stacked on the lot like a Sankey (on phones they loop down the left gutter, nested)
    var y = cy - full / 2, order = ns.map(function (d, i) { return i; });
    if (v) order.reverse();
    order.forEach(function (i) {
      var d = ns[i], w = Math.max(2, d.q * sc), ys = y + w / 2, ye = D[i][1] + 22, dl = 420 + i * 90;
      if (!v) link(K.curve([L[0] + L[2], ys], [D[i][0], ye], .5), w, d.t, dl);
      else { var g = L[0] * (.35 + .6 * (i + 1) / n); link('M' + f1(L[0]) + ' ' + f1(ys) + 'C' + f1(L[0] - g) + ' ' + f1(ys) + ' ' + f1(L[0] - g) + ' ' + f1(ye) + ' ' + f1(L[0]) + ' ' + f1(ye), w, d.t, dl); }
      y += w;
    });
    ns.forEach(function (d, i) {
      var icon = d.t === 'int' ? 'pulse' : d.t === 'cust' ? 'users' : d.t === 'quar' ? 'lock' : 'box', sub;
      if (d.t === 'int') sub = d.a.refs.length + (d.a.refs.length > 1 ? ' transfers · ' : ' transfer · ') + d.oh + ' on hand';
      else if (d.t === 'cust') sub = d.a.refs[0][0] + (d.a.refs.length > 1 ? ' +' + (d.a.refs.length - 1) : '') + ' · delivered';
      else sub = d.t === 'quar' ? 'Blocked, not reservable' : 'WH/Stock · on hand';
      var nd = gnode(d.t, D[i], icon, d.name, sub, 580 + i * 90);
      nd.appendChild(K.el('em', 'fefo-nq', d.q + ' ' + P.u));
      if (d.t === 'int') {
        var sp = K.el('i', 'fefo-split'), fi = K.el('i'); fi.style.transform = 'scaleX(' + (d.q ? d.oh / d.q : 0).toFixed(3) + ')'; sp.appendChild(fi); nd.appendChild(sp);
      }
      if (hot && (hot[d.a ? d.a.di : 'c'])) K.restart(nd, 'is-hot');
      if (l.rec) {
        if (d.oh > 0) { nd.classList.add('is-block'); nd.appendChild(K.el('span', 'fefo-tag', d.oh + ' blocked')).style.setProperty('--d', (recall ? 300 + i * 220 : 0) + 'ms'); }
        if (d.t === 'cust') { nd.classList.add('is-contact'); nd.appendChild(K.el('span', 'fefo-tag fefo-tag--c', 'Contact')).style.setProperty('--d', (recall ? 1500 + i * 120 : 0) + 'ms'); }
      }
      hover(nd, function () {
        var lines = [d.name + ' · ' + d.q + ' ' + P.u];
        if (d.a) d.a.refs.slice(-3).forEach(function (r) { lines.push(r[0] + ' · ' + r[2] + ' ' + P.u + (r[5] != null ? ' · ' + ds(r[5]) : '')); });
        if (d.t === 'int') lines.push(d.oh + ' on hand · ' + d.used + (P.pos ? ' sold at the counter in ' + d.a.pos + ' POS orders' : ' used at the clinic'));
        if (d.t === 'central' || d.t === 'quar') lines.push(l.loc === 'quar' ? 'In WH/Quarantine, never reserved' : 'In WH/Stock, reservable by ' + st.s.toUpperCase());
        return lines;
      }, trace, gtip);
    });
    if (l.rec && !v) {                                          // the return to the supplier, over the top
      var x0 = L[0] + L[2] * .5, x1 = S[0] + S[2] * .5;
      link('M' + f1(x0) + ' ' + f1(L[1]) + 'C' + f1(x0) + ' ' + f1(L[1] - 58) + ' ' + f1(x1) + ' ' + f1(S[1] - 58) + ' ' + f1(x1) + ' ' + f1(S[1]), 2, 'ret', recall ? 2300 : 0);
      var rt = K.el('span', 'fefo-rt', 'Return to ' + l.sup + ' · ' + l.rec.blocked + ' ' + P.u);
      rt.style.left = f1((x0 + x1) / 2) + 'px'; rt.style.top = f1(Math.max(0, cy - 84)) + 'px';
      rt.style.setProperty('--d', (recall ? 2500 : 0) + 'ms'); gNodes.appendChild(rt);
    }
    summary(l, ns);
  }
  function summary(l, ns) {
    var P = PR[l.p], toC = 0, cust = 0, oh = 0, nc = 0, pos = 0;
    ns.forEach(function (d) { if (d.t === 'int') { toC += d.q; oh += d.oh; pos += d.a.pos; } else if (d.t === 'cust') { cust += d.q; nc++; } });
    var total = l.qty + toC + cust, rows = [['Received', l.rc], ['Central store', l.qty], ['Sent to clinics', toC + ' (' + oh + ' on hand)'], ['Delivered to customers', cust], ['Accounted for', total + ' of ' + l.rc]];
    if (l.rec) rows.push(['Blocked', l.rec.blocked], ['Customers to contact', nc + (pos ? ' + ' + pos + ' POS orders' : '')], ['Return to ' + l.sup, l.rec.blocked + ' ' + P.u]);
    sumEl.textContent = '';
    rows.forEach(function (r, i) {
      var dv = K.el('div', i === 4 ? (total === l.rc ? 'is-ok' : 'is-bad') : i > 4 ? 'is-rec' : null);
      dv.appendChild(K.el('dt', null, r[0])); dv.appendChild(K.el('dd', null, String(r[1]))); sumEl.appendChild(dv);
    });
    gSub.textContent = 'Lot ' + l.id + ' · ' + P.n + ' · upstream to the receipt, downstream to every move';
  }
  function select(l, anim) {
    if (!l) return;
    sel = l;
    st.lots.forEach(function (x) { if (x.el) { x.el.classList.toggle('is-sel', x === l); x.el.setAttribute('aria-pressed', String(x === l)); } });
    recB.disabled = !!l.rec; K.$('span', recB).textContent = l.rec ? 'Recalled' : 'Run a recall';
    graph(anim);
  }
  recB.addEventListener('click', function () {
    var l = sel; if (!l || l.rec) return;
    started = true;
    var P = PR[l.p], ns = model(l), blocked = 0, places = 0, nc = 0;
    ns.forEach(function (d) { if (d.oh > 0) { blocked += d.oh; places++; } if (d.t === 'cust') nc++; });
    l.rec = { blocked: blocked };
    var move = l.loc === 'stock' && l.qty > 0;
    if (move) l.loc = 'quar';                                   // blocked at once: FEFO skips it from now on
    recB.disabled = true; K.$('span', recB).textContent = 'Recalled';
    graph(false, null, true); refresh();
    at(K.reduce ? 0 : 300, function () {
      if (move) flip(l.el, qbay);
      log('var(--tok-late)', 'Recall · Lot ' + l.id, blocked + ' ' + P.u + ' blocked in ' + places + (places === 1 ? ' location' : ' locations') + ', moved to quarantine');
    });
    at(K.reduce ? 0 : 1500, function () { log('var(--tok-pay)', 'Recall · customers', nc + ' to contact from the delivery orders' + (P.pos ? ', plus the counter sales listed by lot' : '')); });
    at(K.reduce ? 0 : 2400, function () { log('var(--tok-buy)', 'Return to ' + l.sup, blocked + ' ' + P.u + ', a return of ' + l.rcpt); });
  });

  // ---------------------------------------------------------------- controls
  segB.forEach(function (b) {
    b.addEventListener('click', function () {
      started = true; reset(b.dataset.s);
      if (K.reduce) { while (st.d < END) runDay(); finish(); } else play();
    });
  });
  playB.addEventListener('click', function () {
    started = true;
    if (K.reduce) { if (ended) { reset(); return; } runDay(); if (st.d >= END) finish(); return; }
    if (ended) { reset(); play(); return; }
    if (playing) { playing = false; playLabel('Play'); } else play();
  });
  K.$('[data-reset]', root).addEventListener('click', function () { started = true; reset(); if (K.reduce) playLabel('Next day'); });
  var rz = 0;
  window.addEventListener('resize', function () { if (rz) return; rz = requestAnimationFrame(function () { rz = 0; graph(false); }); });

  reset('fefo');
  if (K.reduce) { while (st.d < END) runDay(); finish(); select(st.lots[1], false); }
  return {
    start: function (first) {
      vis = true;
      if (first) graph(!K.reduce);
      if (first && !started && !K.reduce) { started = true; play(); }
      wake();
    },
    stop: function () { vis = false; loop.off(); }
  };
});
