/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Enterprise page: group consolidation on one Odoo database. A fictional Singapore holding owns
   companies in the Philippines, Vietnam and Malaysia. An intercompany sale (the invoice creates the
   mirror bill), a group loan with interest and a management fee flow between them. Month-end
   translates each company into SGD at the chosen rate, eliminates intercompany revenue and cost,
   the profit left in the buyer's stock, receivables and payables, the loan and its interest, and
   builds the group P&L. Companies can be switched out of the group view. Illustrative figures. */
TN.demo('consol', function (root, K) {
  var BASE = { SGD: 1, PHP: 43.5, VND: 20200, MYR: 3.3 };
  // external figures per month, as SGD at the base rates (they are booked in local currency)
  var ENT = [
    { k: 'sg', n: 'SG Holding', c: 'Singapore', cur: 'SGD', rev: 600000, cogs: 380000, opex: 120000, x: .5, y: .15 },
    { k: 'ph', n: 'PH Trading', c: 'Philippines', cur: 'PHP', rev: 420000, cogs: 110000, opex: 85000, x: .17, y: .6 },
    { k: 'vn', n: 'VN Assembly', c: 'Vietnam', cur: 'VND', rev: 150000, cogs: 100000, opex: 45000, x: .5, y: .6 },
    { k: 'my', n: 'MY Distribution', c: 'Malaysia', cur: 'MYR', rev: 260000, cogs: 170000, opex: 55000, x: .83, y: .6 }
  ];
  var E = {}; ENT.forEach(function (e) { E[e.k] = e; e.on = true; });
  var SALE = 200000, SALE_COST = 150000, SOLD = .8;             // VN sells to PH in VND: 200,000 SGD at base rates, 80% sold on
  var LOAN = 2400000, INT = 6000, FEE = 15000;                  // SG lends to VN at 3% a year; SG charges MY a monthly fee (both in SGD)
  var FLOWS = [
    { k: 'sale', a: 'vn', b: 'ph', c: 'var(--tok-stock)', bend: -.35, lab: function (k) { return 'Invoice VND ' + (SALE * BASE.VND / 1e9).toFixed(2) + 'bn → mirror bill'; } },
    { k: 'loan', a: 'sg', b: 'vn', c: 'var(--tok-pay)', bend: .28, lab: function () { return 'Loan SGD 2.4m · interest 6,000'; } },
    { k: 'fee', a: 'sg', b: 'my', c: 'var(--tok-make)', bend: .3, lab: function () { return 'Management fee SGD 15,000'; } }
  ];
  var ROWS = [['rev', 'Revenue'], ['cogs', 'Cost of sales'], ['gp', 'Gross profit', 1], ['opex', 'Operating expenses'], ['ii', 'Interest income'], ['ie', 'Interest expense'], ['np', 'Net profit before tax', 1]];

  var tree = K.$('.cns-tree', root), svg = K.$('.cns-svg', root), tbody = K.$('.cns-tbl tbody', root), check = K.$('.cns-check', root);
  var elims = K.$('.cns-elims', root), steps = K.$$('.cns-steps li', root), fx = K.$('#cns-fx', root);
  var kPct = K.$('[data-k="pct"]', root), kRates = K.$('[data-k="rates"]', root);
  var tip = K.tip(root);
  var k = 1;

  // ---------------------------------------------------------------- the accounts (pure)
  function money(v) { var a = Math.abs(v) / 1000, s = a.toLocaleString('en-SG', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); return v < -.5 ? '(' + s + ')' : Math.abs(v) < .5 ? '–' : s; }
  function books(e) {                                            // one company's P&L in SGD at the chosen rate
    var f = e.cur === 'SGD' ? 1 : 1 / k, r = { rev: e.rev * f, cogs: e.cogs * f, opex: e.opex * f, ii: 0, ie: 0 };
    if (e.k === 'sg') { r.rev += FEE; r.ii = INT; }
    if (e.k === 'vn') { r.rev += SALE / k; r.cogs += SALE_COST / k; r.ie = INT; }
    if (e.k === 'ph') r.cogs += SALE * SOLD / k;
    if (e.k === 'my') r.opex += FEE;
    r.gp = r.rev - r.cogs; r.np = r.gp - r.opex + r.ii - r.ie;
    return r;
  }
  function elimList() {                                          // eliminations apply only between companies inside the group view
    var on = function (a, b) { return E[a].on && E[b].on; }, urp = (1 - SOLD) * (SALE - SALE_COST) / k, s = SALE / k;
    return [
      { t: 'Intercompany sale, VN to PH', on: on('vn', 'ph'), pl: { rev: -s, cogs: -s }, lines: [['Dr', 'Revenue, VN Assembly', s], ['Cr', 'Cost of sales, PH Trading', s]] },
      { t: 'Profit still in PH’s stock', on: on('vn', 'ph'), pl: { cogs: urp }, lines: [['Dr', 'Cost of sales', urp], ['Cr', 'Inventory, PH Trading', urp]], note: '20% of the goods not yet sold on' },
      { t: 'Open invoice, PH owes VN', on: on('vn', 'ph'), pl: {}, lines: [['Dr', 'Payable, PH Trading', s], ['Cr', 'Receivable, VN Assembly', s]] },
      { t: 'Group loan, SG to VN', on: on('sg', 'vn'), pl: { ii: -INT, ie: -INT }, lines: [['Dr', 'Interest income, SG', INT], ['Cr', 'Interest expense, VN', INT], ['Dr', 'Loan and interest payable, VN', LOAN + INT], ['Cr', 'Loan and interest receivable, SG', LOAN + INT]] },
      { t: 'Management fee, SG to MY', on: on('sg', 'my'), pl: { rev: -FEE, opex: -FEE }, lines: [['Dr', 'Revenue, SG Holding', FEE], ['Cr', 'Operating expenses, MY', FEE], ['Dr', 'Payable, MY Distribution', FEE], ['Cr', 'Receivable, SG Holding', FEE]] }
    ];
  }
  function consolidate() {
    var cols = {}, el = { rev: 0, cogs: 0, opex: 0, ii: 0, ie: 0 }, g = {};
    ENT.forEach(function (e) { cols[e.k] = books(e); });
    var L = elimList();
    L.forEach(function (x) { if (x.on) for (var a in x.pl) el[a] += x.pl[a]; });
    el.gp = el.rev - el.cogs; el.np = el.gp - el.opex + el.ii - el.ie;
    ['rev', 'cogs', 'opex', 'ii', 'ie'].forEach(function (a) { g[a] = el[a]; ENT.forEach(function (e) { if (e.on) g[a] += cols[e.k][a]; }); });
    g.gp = g.rev - g.cogs; g.np = g.gp - g.opex + g.ii - g.ie;
    return { cols: cols, el: el, g: g, L: L };
  }

  // ---------------------------------------------------------------- the entity tree
  var nodes = {}, flowEls = [];
  ENT.forEach(function (e) {
    var b = K.el('button', 'cns-n'); b.type = 'button'; b.style.left = (e.x * 100) + '%'; b.style.top = (e.y * 100) + '%';
    var top = K.el('span', 'cns-nt'); top.appendChild(K.el('b', null, e.n)); top.appendChild(K.el('em', null, e.cur)); b.appendChild(top);
    b.appendChild(K.el('small', 'cns-nc', e.c + (e.k === 'sg' ? ' · parent' : ' · 100% owned')));
    var v = K.el('span', 'cns-nv'); b.appendChild(v);
    var sw = K.el('span', 'cns-sw'); sw.appendChild(K.el('i')); sw.appendChild(K.el('span', null, 'In the group view')); b.appendChild(sw);
    b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', function () {
      if (e.on && ENT.filter(function (x) { return x.on; }).length === 1) { K.restart(b, 'is-nope'); return; }
      e.on = !e.on; b.setAttribute('aria-pressed', String(e.on)); render(true);
    });
    tree.appendChild(b); nodes[e.k] = { el: b, v: v };
  });
  var leg = K.el('ul', 'cns-fleg');
  FLOWS.forEach(function (f) {
    var lab = K.el('span', 'cns-fl'); lab.style.setProperty('--c', f.c); tree.appendChild(lab);
    var li = K.el('li'); li.style.setProperty('--c', f.c); li.appendChild(K.el('i')); var tx = K.el('span'); li.appendChild(tx); leg.appendChild(li);
    flowEls.push({ f: f, lab: lab, leg: tx, path: null, dots: [] });
  });
  tree.appendChild(leg);
  var TW = 1, TH = 1, pts = {}, MOB = { sg: [.5, .1], ph: [.27, .42], my: [.73, .42], vn: [.5, .71] };
  function layoutTree() {
    var narrow = tree.offsetWidth < 480;                            // phones: a diamond instead of a row
    root.classList.toggle('is-narrow', narrow);
    ENT.forEach(function (e) { var q = narrow ? MOB[e.k] : [e.x, e.y]; nodes[e.k].el.style.left = (q[0] * 100) + '%'; nodes[e.k].el.style.top = (q[1] * 100) + '%'; });
    TW = tree.offsetWidth; TH = tree.offsetHeight; svg.setAttribute('viewBox', '0 0 ' + TW + ' ' + TH); svg.textContent = '';
    ENT.forEach(function (e) {                                      // nodes are centred with a transform: undo it here
      var el = nodes[e.k].el, w = el.offsetWidth, h = el.offsetHeight, x = el.offsetLeft - w / 2, y = el.offsetTop - h / 2;
      pts[e.k] = { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
    });
    var s = pts.sg;
    ['ph', 'vn', 'my'].forEach(function (x) {                         // ownership lines
      var b = pts[x], my = (s.b + b.y) / 2;
      svg.appendChild(K.svg('path', { d: K.path([[s.cx, s.b], [s.cx, my], [b.cx, my], [b.cx, b.y]], 10), 'class': 'cns-own' }));
    });
    var P = pts;
    var G = narrow ? {                                               // start, control and end point of each arrow
      sale: [[P.vn.x, P.vn.cy], [P.ph.cx, P.vn.cy], [P.ph.cx, P.ph.b]],
      loan: [[P.sg.cx, P.sg.b], [P.sg.cx + 1, (P.sg.b + P.vn.y) / 2], [P.vn.cx, P.vn.y]],
      fee: [[P.sg.r, P.sg.cy], [P.my.cx, P.sg.cy], [P.my.cx, P.my.y]]
    } : {
      sale: [[P.vn.x + 30, P.vn.b], [(P.vn.x + P.ph.r) / 2, Math.max(P.vn.b, P.ph.b) + 58], [P.ph.r - 30, P.ph.b]],
      loan: [[P.sg.cx - 40, P.sg.b], [P.sg.cx - 72, (P.sg.b + P.vn.y) / 2], [P.vn.cx - 40, P.vn.y]],
      fee: [[P.sg.r, P.sg.cy], [P.my.cx, P.sg.cy], [P.my.cx, P.my.y]]
    };
    flowEls.forEach(function (fe) {
      var q = G[fe.f.k], f1 = function (v) { return v.toFixed(1); };
      var d = 'M' + f1(q[0][0]) + ' ' + f1(q[0][1]) + 'Q' + f1(q[1][0]) + ' ' + f1(q[1][1]) + ' ' + f1(q[2][0]) + ' ' + f1(q[2][1]);
      var path = K.svg('path', { d: d, 'class': 'cns-flow', style: '--c:' + fe.f.c, 'marker-end': 'url(#cnsArr)' });
      svg.appendChild(path); fe.path = path; fe.q = q;
      var m = qpt(q, .5); fe.lab.style.left = f1(m[0]) + 'px'; fe.lab.style.top = f1(m[1]) + 'px';
      fe.dots = [0, 1].map(function () { var c = K.svg('circle', { r: 4, 'class': 'cns-dot', style: '--c:' + fe.f.c }); svg.appendChild(c); return c; });
    });
    var defs = K.svg('defs', {}), mk = K.svg('marker', { id: 'cnsArr', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    mk.appendChild(K.svg('path', { d: 'M0 0L10 5L0 10z', 'class': 'cns-arr' })); defs.appendChild(mk); svg.insertBefore(defs, svg.firstChild);
    paintTree();
  }
  function qpt(q, t) { var u = 1 - t; return [u * u * q[0][0] + 2 * u * t * q[1][0] + t * t * q[2][0], u * u * q[0][1] + 2 * u * t * q[1][1] + t * t * q[2][1]]; }
  function paintTree() {
    var R = consolidate();
    ENT.forEach(function (e) {
      var r = R.cols[e.k], loc = e.cur === 'SGD' ? r.rev : r.rev * BASE[e.cur] * k, nd = nodes[e.k];
      nd.v.textContent = 'Revenue ' + e.cur + ' ' + big(loc) + (e.cur === 'SGD' ? '' : ' = SGD ' + big(r.rev));
      nd.el.classList.toggle('is-out', !e.on);
    });
    flowEls.forEach(function (fe) {
      var live = E[fe.f.a].on && E[fe.f.b].on;
      fe.lab.textContent = live ? fe.f.lab(k) : 'Outside the group view: not eliminated';
      fe.leg.textContent = E[fe.f.a].n + ' \u2192 ' + E[fe.f.b].n + ': ' + fe.lab.textContent;
      fe.lab.classList.toggle('is-out', !live); if (fe.path) fe.path.classList.toggle('is-out', !live);
    });
  }
  function big(v) { var a = Math.abs(v); return a >= 1e9 ? (v / 1e9).toFixed(2) + 'bn' : a >= 1e6 ? (v / 1e6).toFixed(2) + 'm' : Math.round(v).toLocaleString('en-SG'); }

  // ---------------------------------------------------------------- worksheet and eliminations
  var cellEls = {};
  ROWS.forEach(function (row) {
    var tr = K.el('tr', row[2] ? 'is-sum' : null); var th = K.el('th', null, row[1]); th.setAttribute('scope', 'row'); tr.appendChild(th);
    ['sg', 'ph', 'vn', 'my', 'el', 'g'].forEach(function (c) { var td = K.el('td', c === 'el' ? 'is-el' : c === 'g' ? 'is-g' : null); tr.appendChild(td); cellEls[row[0] + c] = td; });
    tbody.appendChild(tr);
  });
  var SIGN = { cogs: -1, opex: -1, ie: -1 };
  function paintSheet(R, flash) {
    ROWS.forEach(function (row) {
      var a = row[0], sg = SIGN[a] || 1;
      ENT.forEach(function (e) { var td = cellEls[a + e.k]; td.textContent = money(sg * R.cols[e.k][a]); td.classList.toggle('is-out', !e.on); });
      cellEls[a + 'el'].textContent = money(sg * R.el[a]);
      var g = cellEls[a + 'g'], v = money(sg * R.g[a]);
      if (g.textContent !== v) { g.textContent = v; if (flash) K.restart(g, 'is-flash'); }
    });
    var sum = 0, urp = 0;
    ENT.forEach(function (e) { if (e.on) sum += R.cols[e.k].np; });
    R.L.forEach(function (x) { if (x.on && x.pl.cogs > 0) urp = x.pl.cogs; });
    check.textContent = 'Check: company profits ' + money(sum) + (urp ? ' less unrealised profit in stock ' + money(urp) : '') + ' = group profit ' + money(R.g.np) + ' (SGD thousands). Every other elimination nets to zero.';
    elims.textContent = '';
    R.L.forEach(function (x, i) {
      var c = K.el('div', 'cns-e' + (x.on ? '' : ' is-out'));
      var h = K.el('p', 'cns-eh'); h.appendChild(K.el('b', null, 'E' + (i + 1))); h.appendChild(document.createTextNode(x.t)); c.appendChild(h);
      x.lines.forEach(function (l) {
        var r = K.el('p', 'cns-el' + (l[0] === 'Cr' ? ' is-cr' : '')); r.appendChild(K.el('span', null, l[0] + ' ' + l[1])); r.appendChild(K.el('em', null, money(l[2]))); c.appendChild(r);
      });
      c.appendChild(K.el('p', 'cns-en', x.on ? (x.note || 'Posted to the elimination column') : 'Not eliminated: one company is outside the group view'));
      elims.appendChild(c);
    });
  }
  function render(flash) {
    var R = consolidate(); paintTree(); paintSheet(R, flash);
    kPct.textContent = (k > 1 ? '+' : '') + Math.round((k - 1) * 100) + '%';
    kRates.textContent = '1 SGD = ' + (BASE.PHP * k).toFixed(2) + ' PHP · ' + Math.round(BASE.VND * k).toLocaleString('en-SG') + ' VND · ' + (BASE.MYR * k).toFixed(2) + ' MYR (sample)';
  }

  // ---------------------------------------------------------------- month-end run and moving documents
  var runT = -1, stepAt = 900;
  function setStep(n) { steps.forEach(function (s, i) { s.classList.toggle('is-done', i < n); s.classList.toggle('is-now', i === n); }); root.dataset.step = String(n); }
  var loop = K.loop(function (now) {
    if (runT >= 0) {
      var n = Math.floor((now - runT) / stepAt);
      if (n !== +root.dataset.step) { setStep(Math.min(n, 5)); if (n === 4) render(true); }
      if (n >= 5) runT = -1;
    }
    flowEls.forEach(function (fe, j) {
      if (!fe.q) return;
      var live = E[fe.f.a].on && E[fe.f.b].on;
      fe.dots.forEach(function (d, i) {
        var t = ((now / 2600) + i * .5 + j * .21) % 1;
        var p = qpt(fe.q, t); d.setAttribute('cx', p[0].toFixed(1)); d.setAttribute('cy', p[1].toFixed(1));
        d.style.opacity = live ? String(Math.sin(t * Math.PI)) : '0';
      });
    });
  });
  K.$('[data-run]', root).addEventListener('click', function () {
    if (K.reduce) { setStep(5); render(true); return; }
    runT = performance.now(); setStep(0); loop.on();
  });
  fx.addEventListener('input', function () { k = 1 + (+fx.value) / 100; fx.setAttribute('aria-valuetext', kPct.textContent); render(false); });
  ENT.forEach(function (e) {
    var b = nodes[e.k].el;
    b.addEventListener('pointerenter', function () {
      var r = books(e), bx = K.box(b, root);
      tip.show([e.n + ' · ' + e.cur, 'Own books in ' + e.cur + '; translated at 1 SGD = ' + (BASE[e.cur] * k).toLocaleString('en-SG', { maximumFractionDigits: 2 }) + ' ' + e.cur, 'Net profit SGD ' + Math.round(r.np).toLocaleString('en-SG')], bx.cx, bx.y);
    });
    b.addEventListener('pointerleave', function () { tip.hide(); });
  });
  window.addEventListener('resize', layoutTree);
  render(false); setStep(5);
  var seen = false;
  return {
    start: function (first) {
      layoutTree();
      if (K.reduce) return;
      if (first && !seen) { seen = true; runT = performance.now(); setStep(0); }
      loop.on();
    },
    stop: function () { loop.off(); }
  };
});
